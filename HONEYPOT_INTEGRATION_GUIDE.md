# Honeypot Bot Trap - Integration Guide

## Overview
This system provides multi-layered bot protection for your forms using honeypot fields and time-based validation.

## Files Created

### Frontend
1. **`assets/css/honeypot.css`** - CSS to hide honeypot fields from real users
2. **`assets/js/honeypot.js`** - JavaScript functions for form handling and validation
3. **`sections/honeypot-fields.html`** - Reusable HTML snippet for honeypot fields

### Backend
4. **`backend/middleware/honeypot.js`** - Express middleware for server-side bot detection

---

## 🎯 How It Works

### Layer 1: Visual Honeypot
- Hidden form fields that real users can't see
- Bots automatically fill all fields, triggering detection
- Three different honeypot fields catch various bot types

### Layer 2: Time-Based Validation
- Records when user starts filling the form
- Measures submission time
- Bots submit instantly (< 3 seconds), humans take longer

### Layer 3: Server-Side Validation
- Backend middleware double-checks all honeypot fields
- Removes honeypot data before saving to database
- Logs bot attempts for monitoring

---

## 📝 Integration Steps

### Step 1: Add CSS to Your Form Pages

Add this to the `<head>` section of any page with a form:

```html
<link rel="stylesheet" href="../assets/css/honeypot.css" />
```

### Step 2: Add Honeypot Fields to Your Forms

Copy the honeypot fields from `sections/honeypot-fields.html` and paste them inside your `<form>` tag, preferably at the top:

```html
<form id="contact-form" novalidate>
    <!-- HONEYPOT FIELDS - Paste these at the top of your form -->
    <div class="hp-field" aria-hidden="true">
        <label for="hp_website">Leave this field empty</label>
        <input type="text" id="hp_website" name="hp_website" tabindex="-1" autocomplete="off" />
    </div>
    
    <div class="hp-field" aria-hidden="true">
        <label for="hp_email">Do not fill this field</label>
        <input type="email" id="hp_email" name="hp_email" tabindex="-1" autocomplete="off" />
    </div>
    
    <div class="hp-field" aria-hidden="true">
        <label for="hp_name">Hidden field</label>
        <input type="text" id="hp_name" name="hp_name" tabindex="-1" autocomplete="off" />
    </div>
    
    <!-- Your existing form fields go here -->
    <div class="form-group">
        <label for="full-name">Full Name</label>
        <input type="text" id="full-name" name="fullName" required />
    </div>
    <!-- ... rest of your form -->
</form>
```

### Step 3: Add JavaScript to Your Form Pages

Add this before the closing `</body>` tag:

```html
<script src="../assets/js/honeypot.js"></script>
```

### Step 4: Initialize Honeypot Protection

In your form's JavaScript file (e.g., `contact.js`), replace your existing form submission handler with:

```javascript
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Setup honeypot protection
    setupHoneypotForm('contact-form', 'contact', function(result) {
        // This callback runs after successful submission
        console.log('Form submitted successfully:', result);
        
        // Add any custom success handling here
        // For example, redirect or show custom message
    });
});
```

**Form Types:**
- `'contact'` - For contact forms
- `'hire'` - For hire talent forms
- `'enrollment'` - For enrollment forms

---

## 🔧 Complete Example: Contact Form

Here's how your updated `contact.html` should look:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contact Us – Thexora</title>
    <link rel="stylesheet" href="../assets/css/style.css" />
    <link rel="stylesheet" href="../assets/css/contact.css" />
    <link rel="stylesheet" href="../assets/css/honeypot.css" /> <!-- ADD THIS -->
</head>
<body>
    <!-- Your existing content -->
    
    <form class="contact-form" id="contact-form" novalidate>
        <!-- ADD HONEYPOT FIELDS HERE -->
        <div class="hp-field" aria-hidden="true">
            <label for="hp_website">Leave this field empty</label>
            <input type="text" id="hp_website" name="hp_website" tabindex="-1" autocomplete="off" />
        </div>
        <div class="hp-field" aria-hidden="true">
            <label for="hp_email">Do not fill this field</label>
            <input type="email" id="hp_email" name="hp_email" tabindex="-1" autocomplete="off" />
        </div>
        <div class="hp-field" aria-hidden="true">
            <label for="hp_name">Hidden field</label>
            <input type="text" id="hp_name" name="hp_name" tabindex="-1" autocomplete="off" />
        </div>
        
        <!-- Your existing form fields -->
        <div class="form-row">
            <div class="form-group">
                <label for="full-name">Full Name <span class="req">*</span></label>
                <input type="text" id="full-name" name="fullName" placeholder="e.g. Jane Doe" required />
            </div>
            <!-- ... rest of your form -->
        </div>
    </form>
    
    <!-- ADD HONEYPOT JS -->
    <script src="../assets/js/honeypot.js"></script>
    <script src="../assets/js/contact.js"></script>
</body>
</html>
```

And in your `contact.js`:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Setup honeypot-protected form submission
    setupHoneypotForm('contact-form', 'contact', function(result) {
        console.log('Contact form submitted:', result);
        // Additional custom logic here
    });
});
```

---

## 🚀 Backend Integration (Already Done!)

The backend middleware is already integrated into your `backend/index.js`:

```javascript
const { honeypotMiddleware } = require('./middleware/honeypot');

// Applied to your submit route
app.post('/api/submit', 
    apiLimiter, 
    formLimiter, 
    honeypotMiddleware({ minSubmissionTime: 3000, logBotAttempts: true }), 
    async (req, res) => {
        // Your existing route handler
    }
);
```

### Middleware Options

You can customize the middleware behavior:

```javascript
honeypotMiddleware({
    minSubmissionTime: 3000,  // Minimum time in ms (default: 3000)
    logBotAttempts: true      // Log bot attempts to console (default: true)
})
```

---

## 📊 Bot Detection Logs

When a bot is detected, you'll see logs like this in your backend:

```
🤖 Bot detected: hp_website field filled
{
  ip: '192.168.1.100',
  userAgent: 'Mozilla/5.0...',
  timestamp: '2024-01-15T10:30:00.000Z',
  data: {
    hp_website: '[FILLED]',
    hp_email: '[EMPTY]',
    hp_name: '[EMPTY]',
    formType: 'contact'
  }
}

✅ Honeypot validation passed
{
  ip: '192.168.1.101',
  timestamp: '2024-01-15T10:31:00.000Z'
}
```

---

## 🔒 Security Features

### 1. **Multiple Honeypot Fields**
- `hp_website` - Catches basic bots
- `hp_email` - Catches email-harvesting bots
- `hp_name` - Catches simple form-fillers

### 2. **Time-Based Validation**
- Records form start time automatically
- Blocks submissions faster than 3 seconds
- Configurable threshold per form type

### 3. **Data Sanitization**
- Honeypot fields removed before database save
- Sensitive data masked in logs
- Clean data passed to downstream handlers

### 4. **Silent Failure**
- Bots don't know they're blocked
- No error messages that help bots adapt
- Returns generic "blocked" message

---

## 🧪 Testing

### Test 1: Real User Submission
1. Fill out the form normally (takes > 3 seconds)
2. Leave honeypot fields empty (they're hidden)
3. Submit - should succeed ✅

### Test 2: Bot Simulation (Honeypot)
1. Open browser DevTools
2. Fill in any `hp_*` field with a value
3. Submit - should be blocked 🤖

### Test 3: Bot Simulation (Speed)
1. Open browser DevTools Console
2. Run: `document.querySelector('input[name="hp_time_start"]').value = Date.now() - 1000`
3. Immediately submit - should be blocked 🤖

### Test 4: Valid Fast Submission
1. Start filling form
2. Complete and submit in under 3 seconds
3. Should be blocked (too fast) 🤖

---

## 🎨 Customization

### Adjust Minimum Submission Time

**Frontend** (in `honeypot.js`):
```javascript
function validateHoneypotLocally(formData, minTimeMs = 5000) {
    // Change default from 3000 to 5000ms
}
```

**Backend** (in `index.js`):
```javascript
honeypotMiddleware({ minSubmissionTime: 5000 }) // 5 seconds
```

### Add More Honeypot Fields

**HTML** (add to form):
```html
<div class="hp-field" aria-hidden="true">
    <label for="hp_phone">Phone</label>
    <input type="text" id="hp_phone" name="hp_phone" tabindex="-1" autocomplete="off" />
</div>
```

**Backend** (in `middleware/honeypot.js`):
```javascript
if (hp_phone && hp_phone.trim() !== '') {
    // Block bot
    return res.status(403).json({ success: false, message: 'Request blocked by security filter.' });
}
```

---

## 📋 Form-Specific Implementation

### 1. Contact Form (`pages/contact.html`)

**HTML additions:**
```html
<link rel="stylesheet" href="../assets/css/honeypot.css" />
<!-- Inside <form id="contact-form"> -->
<!-- Add honeypot fields from sections/honeypot-fields.html -->
```

**JavaScript** (`assets/js/contact.js`):
```javascript
document.addEventListener('DOMContentLoaded', function() {
    setupHoneypotForm('contact-form', 'contact', function(result) {
        console.log('Contact submitted');
    });
});
```

### 2. Hire Talent Form

**HTML additions:**
```html
<link rel="stylesheet" href="../assets/css/honeypot.css" />
<!-- Inside your hire form -->
<!-- Add honeypot fields -->
```

**JavaScript:**
```javascript
document.addEventListener('DOMContentLoaded', function() {
    setupHoneypotForm('hire-form', 'hire', function(result) {
        console.log('Hire request submitted');
    });
});
```

### 3. Enrollment Form

**HTML additions:**
```html
<link rel="stylesheet" href="../assets/css/honeypot.css" />
<!-- Inside your enrollment form -->
<!-- Add honeypot fields -->
```

**JavaScript:**
```javascript
document.addEventListener('DOMContentLoaded', function() {
    setupHoneypotForm('enrollment-form', 'enrollment', function(result) {
        console.log('Enrollment submitted');
    });
});
```

---

## 🚨 Troubleshooting

### Issue: Form submits but data not saved
**Solution:** Check browser console for errors. Ensure `BACKEND_URL` in `honeypot.js` is correct.

### Issue: Real users getting blocked
**Solution:** 
- Check if honeypot fields are properly hidden with CSS
- Increase `minSubmissionTime` if users are fast typers
- Check browser DevTools for any CSS loading issues

### Issue: Bots still getting through
**Solution:**
- Add more honeypot fields with different names
- Decrease `minSubmissionTime` to catch faster bots
- Enable stricter validation in middleware
- Consider adding CAPTCHA as additional layer

### Issue: Backend logs show honeypot data
**Solution:** The middleware automatically removes honeypot fields. Check that `req.cleanData` is being used instead of `req.body` in your route handler.

---

## 📈 Monitoring & Analytics

Track bot attempts by monitoring your backend logs:

```bash
# Count bot attempts
grep "Bot detected" backend-logs.txt | wc -l

# View recent bot attempts
grep "Bot detected" backend-logs.txt | tail -20
```

---

## 🔮 Future Enhancements

Consider adding these for even stronger protection:

1. **Google reCAPTCHA v3** - Invisible CAPTCHA scoring
2. **IP Blacklisting** - Block known bot IPs
3. **User Agent Analysis** - Detect suspicious user agents
4. **Behavioral Analysis** - Track mouse movements and typing patterns
5. **CSRF Tokens** - Prevent cross-site request forgery
6. **Google Sheets Sync** - The middleware's `req.cleanData` can be easily forwarded to Google Sheets API

---

## 📞 Support

If you encounter any issues:
1. Check browser console for frontend errors
2. Check backend logs for bot detection logs
3. Verify all files are properly linked
4. Test with the testing steps above

---

**Last Updated:** April 9, 2026  
**Version:** 1.0.0
