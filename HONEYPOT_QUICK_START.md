# Honeypot Bot Trap - Quick Start Guide

## ⚡ 3-Step Implementation

### Step 1: Add to HTML (inside `<form>` tag)

```html
<!-- HONEYPOT FIELDS - Add at the top of your form -->
<div class="hp-field" aria-hidden="true">
    <label for="hp_website">Website</label>
    <input type="text" id="hp_website" name="hp_website" tabindex="-1" autocomplete="off" />
</div>
<div class="hp-field" aria-hidden="true">
    <label for="hp_email">Email</label>
    <input type="email" id="hp_email" name="hp_email" tabindex="-1" autocomplete="off" />
</div>
<div class="hp-field" aria-hidden="true">
    <label for="hp_name">Name</label>
    <input type="text" id="hp_name" name="hp_name" tabindex="-1" autocomplete="off" />
</div>
```

### Step 2: Add CSS & JS Links (in `<head>`)

```html
<link rel="stylesheet" href="../assets/css/honeypot.css" />
```

Before `</body>`:
```html
<script src="../assets/js/honeypot.js"></script>
```

### Step 3: Initialize (in your form's JS file)

```javascript
document.addEventListener('DOMContentLoaded', function() {
    setupHoneypotForm('your-form-id', 'form-type', function(result) {
        console.log('Success:', result);
    });
});
```

**Form Types:** `'contact'` | `'hire'` | `'enrollment'`

---

## 📋 Complete Example

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="../assets/css/honeypot.css" />
</head>
<body>
    <form id="my-form">
        <!-- HONEYPOT -->
        <div class="hp-field"><input type="text" name="hp_website" tabindex="-1" /></div>
        <div class="hp-field"><input type="email" name="hp_email" tabindex="-1" /></div>
        <div class="hp-field"><input type="text" name="hp_name" tabindex="-1" /></div>
        
        <!-- YOUR FIELDS -->
        <input type="text" name="fullName" required />
        <input type="email" name="email" required />
        <button type="submit">Submit</button>
    </form>
    
    <script src="../assets/js/honeypot.js"></script>
    <script>
        setupHoneypotForm('my-form', 'contact');
    </script>
</body>
</html>
```

---

## 🔧 Backend (Already Configured!)

The middleware is already active in `backend/index.js`:

```javascript
app.post('/api/submit', 
    apiLimiter, 
    formLimiter, 
    honeypotMiddleware(), // ✅ Already here!
    async (req, res) => {
        // Use req.cleanData instead of req.body
        const data = req.cleanData;
    }
);
```

---

## 🧪 Quick Test

**Test Real User:**
1. Fill form normally (>3 seconds)
2. Submit ✅

**Test Bot Detection:**
1. Open DevTools
2. Fill `hp_website` field
3. Submit → Blocked 🤖

---

## 📁 Files Created

```
✅ assets/css/honeypot.css              - Hidden field styles
✅ assets/js/honeypot.js                - Form handling logic
✅ sections/honeypot-fields.html        - Reusable HTML snippet
✅ backend/middleware/honeypot.js       - Express middleware
✅ HONEYPOT_INTEGRATION_GUIDE.md        - Full documentation
✅ HONEYPOT_QUICK_START.md              - This file
```

---

## 🎯 How It Works

1. **Hidden Fields** - Real users can't see them, bots fill them
2. **Time Trap** - Records when form opened, blocks submissions <3 seconds
3. **Server Check** - Backend validates and cleans data before saving

---

## 🚨 Important Notes

- ✅ Backend URL auto-configures for localhost/production
- ✅ Honeypot fields automatically removed before DB save
- ✅ Bot attempts logged to console
- ✅ Silent failure (bots don't know they're blocked)
- ⚠️ Update `BACKEND_URL` in `honeypot.js` for production

---

## 📞 Need Help?

See full documentation: `HONEYPOT_INTEGRATION_GUIDE.md`
