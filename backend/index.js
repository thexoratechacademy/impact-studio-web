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
app.use(cors({
    origin: 'https://impact-studio-web.netlify.app',
    methods: 'GET,HEAD,PUT,POST,DELETE',
    credentials: true
})); 

// --- DATABASE CONNECTION ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Database Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1); // Exit process with error code if cant connect
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
    companyName:       z.string().optional(),
    officeAddress:     z.string().optional(),
    title:             z.string().optional(),
})

// --- THE API ROUTE ---
app.post('/api/submit', async (req, res) => {
    try {
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