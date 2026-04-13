// Load environment variables early
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const { honeypotMiddleware } = require('./middleware/honeypot');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const path = require('path');

// --- APP CONFIG ---
const app = express();
const PORT = process.env.PORT || 5000;

// DEBUG: Check database URL
console.log("🔍 Checking environment variables...");
console.log("Database URL check:", process.env.MONGO_URL ? "FOUND ✅": "NOT FOUND ❌");
console.log("Google Sheets ID check:", process.env.GOOGLE_SHEET_ID ? "FOUND ✅": "NOT FOUND ❌");

// Limit each IP to 10 submissions per hour
const formLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 10,
    message: "Too many requests from this IP, please try again after an hour",
    standardHeaders: true,
    legacyHeaders: false,
});

//middleware
app.use(helmet());
app.use(express.json());

// Request logger for troubleshooting
app.use((req, res, next) => {
    console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${req.ip}`);
    next();
});

// --- STATIC FILE SERVING ---
// These routes allow Render to host the frontend since Netlify may be paused
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/pages', express.static(path.join(__dirname, '../pages')));
app.use('/components', express.static(path.join(__dirname, '../components')));
app.use('/sections', express.static(path.join(__dirname, '../sections')));
app.get('/script.js', (req, res) => res.sendFile(path.join(__dirname, '../script.js')));

// --- ROOT ROUTE (Main Website) ---
app.get('/', (req, res) => {
    // Check if the frontend index.html exists, if so serve it
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Move diagnostic route to the top
app.get('/api/sheets-check', async (req, res) => {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timed out')), 15000));
    try {
        if (!doc) return res.status(500).json({ success: false, message: "Google Sheets script object missing." });
        console.log("🔍 Attempting to load Google Sheet info...");
        await Promise.race([doc.loadInfo(), timeout]);
        const sheet = doc.sheetsByIndex[0];
        res.json({ 
            success: true, 
            status: "Connected",
            documentTitle: doc.title,
            sheetTitle: sheet.title,
            firstRowHeaders: sheet.headerValues || "No headers detected"
        });
    } catch (err) {
        console.error("❌ Sheets Test Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

const allowedOrigins = [
    'https://impact-studio-web.netlify.app',
    'https://tech300.netlify.app',
    'https://thexora.art', // Added primary domain
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5505',
    'http://127.0.0.1:5505',
    'http://localhost:8080',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS: origin not allowed: ' + origin));
        }
    },
    methods: 'GET,HEAD,PUT,POST,DELETE',
    credentials: true
}));

// --- DATABASE CONNECTION ---
let isDbConnected = false;

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            console.error("❌ MONGO_URL is not set in environment variables!");
            return;
        }
        await mongoose.connect(process.env.MONGO_URL);
        isDbConnected = true;
        console.log("✅ Database Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
    }
};

// --- GOOGLE SHEETS SETUP ---
let doc = null;

const initGoogleSheets = () => {
    try {
        const sheetId = process.env.GOOGLE_SHEET_ID;
        const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        let key = process.env.GOOGLE_PRIVATE_KEY;

        if (!sheetId || !email || !key) {
            console.warn("⚠️ Google Sheets credentials or ID missing. Skipping sheet sync setup.");
            return null;
        }

        // Deep sanitize: remove wrapping quotes and fix newlines
        key = key.trim().replace(/^"|"$/g, '').replace(/\\n/g, '\n');

        const serviceAccountAuth = new JWT({
            email: email,
            key: key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        return new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    } catch (err) {
        console.error("❌ Google Sheets Init Error:", err.message);
        return null;
    }
};

doc = initGoogleSheets();

const syncToSheet = async (data, sheetType = 'submissions') => {
    // Immediate safety check
    if (!doc) {
        console.warn("⚠️ Sheet Sync: doc not initialized. Check your credentials.");
        return;
    }

    try {
        console.log(`📊 Sheet Sync: Starting for ${data.formType || 'submission'}...`);
        
        // Ensure info is loaded, but with a timeout to prevent hanging the event loop
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Sync Timeout')), 8000));
        await Promise.race([doc.loadInfo(), timeout]);
        
        let sheet = doc.sheetsByTitle[sheetType];
        if (!sheet) {
            sheet = doc.sheetsByIndex[0];
            console.log(`📝 Sheet Sync: "${sheetType}" not found, using index 0: "${sheet.title}"`);
        }
        
        const row = {
            Date: new Date().toLocaleString(),
            Type: data.formType || 'subscription',
            Name: data.contactName || 'N/A',
            Email: data.email,
            Phone: data.phone || 'N/A',
            Subject: data.subject || 'N/A',
            Company: data.companyName || 'N/A',
            Message: data.message || 'N/A',
            Title: data.title || 'N/A',
            Social: data.socialLink || 'N/A'
        };
        
        await sheet.addRow(row);
        console.log("✅ Sheet Sync: SUCCESS");
    } catch (err) {
        console.error("❌ Sheet Sync: FAILED");
        console.error(`   Message: ${err.message}`);
        // Do NOT rethrow - stay silent but log it so the server lives
    }
};

// DB connects after server starts (see bottom of file)

// --- THE MODEL ---
const submissionSchema = new mongoose.Schema({
    formType: String,      // 'hire', 'enrollment', or 'contact'
    contactName: String,
    email: String,
    phone: String,
    companyName: String,
    officeAddress: String, // For 'hire' form
    subject: String,       // For 'contact' form
    message: String,       // Multi-purpose field
    title: String,         // Job title or Position deired
    socialLink: String,    // For YouTube/channel links
    submittedAt: { type: Date, default: Date.now }
});
// Indexes for faster queries at scale
submissionSchema.index({ email: 1, formType: 1 });
submissionSchema.index({ submittedAt: -1 });
const Submission = mongoose.model('Submission', submissionSchema);

// --- SUBSCRIBER MODEL ---
const subscriberSchema = new mongoose.Schema({
    email:        { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now }
});
subscriberSchema.index({ subscribedAt: -1 });
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// --- RATE LIMITERS ---
// General API: max 30 requests per 10 minutes per IP
const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please wait a few minutes and try again.' }
});

// Subscribe route: stricter — max 5 per 10 minutes per IP
const subscribeLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many subscription attempts. Please try again later.' }
});

// ---VALIDATION SCHEMA ---
const hireSchema = z.object({
    formType:           z.literal('hire'),
    contactName:        z.string().min(3, "Name must be at least 2 characters"),
    email:              z.string().email("Invalid email address"),
    phone:              z.string().min(10, "Phone number is too short"),
    companyName:        z.string().min(2, "Company name is too short"),
    officeAddress:      z.string().min(5, "Please enter a full office address"),
    title:              z.string().optional(),   
})

const contactSchema = z.object({
    formType:          z.literal('contact'),
    contactName:       z.string().min(2, "Name must be at least 2 characters"),
    email:             z.string().email("Invalid email address"),
    phone:             z.string().optional(),
    subject:           z.string().min(1, "Please select a subject"),
    message:           z.string().min(10, "Message is too short")
})

const enrollmentSchema = z.object({
    formType:          z.literal('enrollment'),
    contactName:       z.string().min(2, "Name must be at least 2 characters"),
    email:             z.string().email("Invalid email address"),
    phone:             z.string().min(10, "Phone number is too short"),
    title:             z.string().optional(),
    companyName:       z.string().optional(),
    message:           z.string().optional(), // packed: education, course, mode, referral, etc.
})

// --- HEALTH CHECK (required by Render) ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', db: isDbConnected ? 'connected' : 'disconnected' });
});

// --- NEWSLETTER SUBSCRIBE ROUTE ---
app.post('/api/subscribe', subscribeLimiter, async (req, res) => {
    try {
        if (!isDbConnected) {
            return res.status(503).json({ success: false, message: 'Database not connected. Please try again shortly.' });
        }
        const emailSchema = z.object({
            email: z.string().email('Invalid email address')
        });
        const { email } = emailSchema.parse(req.body);
        const existing = await Subscriber.findOne({ email });
        if (existing) {
            return res.status(200).json({ success: true, message: 'Already subscribed!' });
        }
        await new Subscriber({ email }).save();
        
        // Sync to Sheets
        syncToSheet({ email, formType: 'newsletter' }, 'subscribers');

        res.status(201).json({ success: true, message: 'Subscribed successfully!' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, message: error.errors[0].message });
        }
        console.error('Subscribe error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// --- THE API ROUTE ---
app.post('/api/submit', apiLimiter, formLimiter, honeypotMiddleware({ minSubmissionTime: 3000, logBotAttempts: true }), async (req, res) => {
    try {
        if (!isDbConnected) {
            return res.status(503).json({ success: false, message: "Database not connected. Please try again shortly." });
        }
        
        // Use cleaned data (honeypot fields removed) from middleware
        const { formType } = req.cleanData;
        
        let schema;
        if (formType == 'hire')                  schema = hireSchema;
        else if (formType === 'contact')         schema = contactSchema;
        else if (formType === 'enrollment')      schema = enrollmentSchema;
        else return res.status(400).json({ success: false, message: " Unknown form type"});

        const validatedData = schema.parse(req.cleanData);
        const newSubmission = new Submission(validatedData);
        await newSubmission.save();

        // Sync to Sheets
        syncToSheet(validatedData, 'submissions');

        res.status(201).json({ success: true, message: "Submission saved successfully!"});
    }catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        console.error("Server Error:", error);
        return res.status(500).json({ success: false, errors: "Internal server error"});
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server started on port ${PORT}`);
    connectDB();
});