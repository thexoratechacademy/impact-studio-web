const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { z } = require('zod');

// DEBUG: This will tell us if the Variable is actually being seen now
console.log("Database URL check:", process.env.MONGO_URL ? "FOUND ✅": "NOT FOUND ❌")
const app = express();


//middleware
app.use(express.json());

const allowedOrigins = [
    'https://impact-studio-web.netlify.app',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:8080',
];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. Postman, mobile apps)
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
        // Server stays alive — do NOT call process.exit(1)
    }
};
// DB connects after server starts (see bottom of file)

// --- THE MODEL ---
const submissionSchema = new mongoose.Schema({
 formType: String, // 'hire' or 'enrollment'
    contactName: String,
    email: String,
    phone: String,
    companyName: String,
    message: String,
    socialLink: String, // For the YouTube/channel links you mentioned
    submittedAt: { type: Date, default: Date.now }
});
const Submission = mongoose.model('Submission', submissionSchema);

// --- SUBSCRIBER MODEL ---
const subscriberSchema = new mongoose.Schema({
    email:        { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now }
});
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

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
app.post('/api/subscribe', async (req, res) => {
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
app.post('/api/submit', async (req, res) => {
    try {
        if (!isDbConnected) {
            return res.status(503).json({ success: false, message: "Database not connected. Please try again shortly." });
        }
        const { formType } = req.body;
        
        let schema;
        if (formType == 'hire')                  schema = hireSchema;
        else if (formType === 'contact')         schema = contactSchema;
        else if (formType === 'enrollment')      schema = enrollmentSchema;
        else return res.status(400).json({ success: false, message: " Unknown form type"});

        const validatedData = schema.parse(req.body);
        const newSubmission = new Submission(validatedData);
        await newSubmission.save();

        res.status(201).json({ success: true, message: "Submission saved successfully!"});
    }catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        console.error("Server Error:", error);
        return res.status(500).json({ success: false, errors: "Internal server error"});
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server started on port ${PORT}`);
    connectDB();
});