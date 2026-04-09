# ✅ CORS & CSS Issues Fixed

## Issue 1: CORS Error ✅ FIXED

**Error:**
```
Access to fetch at 'https://impact-studio-web.onrender.com/api/submit' 
from origin 'http://127.0.0.1:5505' has been blocked by CORS policy
```

**Root Cause:**
- Your backend CORS only allowed port `5500`
- You're running Live Server on port `5505`

**Fix Applied:**
Added port 5505 to allowed origins in `backend/index.js`:

```javascript
const allowedOrigins = [
    'https://impact-studio-web.netlify.app',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5505',      // ← ADDED
    'http://127.0.0.1:5505',      // ← ADDED
    'http://localhost:8080',
];
```

**Status:** ✅ Backend restarted with new CORS settings

---

## Issue 2: CSS MIME Type Error ⚠️ Path Issue

**Error:**
```
Refused to apply style from 'http://127.0.0.1:5505/pages/assets/css/style.css' 
because its MIME type ('text/html') is not a supported stylesheet MIME type
```

**Root Cause:**
The browser is looking for CSS at wrong path:
- **Wrong:** `http://127.0.0.1:5505/pages/assets/css/style.css`
- **Correct:** `http://127.0.0.1:5505/assets/css/style.css`

This happens when:
1. Live Server root is not set correctly, OR
2. Relative paths (`../`) aren't resolving properly

---

## 🔧 Solutions for CSS Issue

### Solution 1: Hard Refresh (Try This First)
```
Ctrl + Shift + R  (or Ctrl + F5)
```
This clears the browser cache and often fixes MIME type errors.

---

### Solution 2: Check Live Server Root

**Problem:** You might be opening the file directly instead of from project root.

**Correct Way:**
1. Open `index.html` (root file) with Live Server
2. Navigate to contact form from there
3. URL should be: `http://127.0.0.1:5505/index.html`

**Wrong Way:**
- Don't right-click `pages/contact.html` → Open with Live Server
- This sets the root to `/pages/` folder

---

### Solution 3: Use Absolute Paths (Temporary Fix)

If relative paths don't work, change CSS links in `pages/contact.html`:

**Before (relative):**
```html
<link rel="stylesheet" href="../assets/css/style.css" />
<link rel="stylesheet" href="../assets/css/contact.css" />
<link rel="stylesheet" href="../assets/css/honeypot.css" />
```

**After (absolute):**
```html
<link rel="stylesheet" href="/assets/css/style.css" />
<link rel="stylesheet" href="/assets/css/contact.css" />
<link rel="stylesheet" href="/assets/css/honeypot.css" />
```

**Note:** This only works if Live Server root is the project root.

---

### Solution 4: Check .vscode/settings.json

You might have a Live Server configuration issue.

**Check if this file exists:** `.vscode/settings.json`

**Should contain:**
```json
{
    "liveServer.settings.root": "/",
    "liveServer.settings.port": 5505
}
```

If `root` is set to `/pages`, that's the problem!

---

## 🧪 Test Now

### Step 1: Verify Backend is Running
Backend console should show:
```
✅ Server started on port 5000
✅ Database Connected Successfully
```
✅ **Confirmed running!**

### Step 2: Hard Refresh Browser
```
Ctrl + Shift + R
```

### Step 3: Check CSS Loading
1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "CSS"
4. Reload page
5. Check if CSS files show `200` status (green) or `404` (red)

### Step 4: Test Form Submission
1. Fill out contact form
2. Wait 3-5 seconds
3. Submit

**Expected:** No CORS error, form submits successfully!

---

## 🔍 Still Having CSS Issues?

### Check Console for Exact Errors

Press F12 → Console tab

**If you see:**
```
GET http://127.0.0.1:5505/pages/assets/css/style.css 404 (Not Found)
```
→ Path is wrong, CSS file not found

**If you see:**
```
Refused to apply style... MIME type ('text/html')
```
→ Server is returning HTML instead of CSS (wrong path)

### Quick Diagnostic

Open in browser:
```
http://127.0.0.1:5505/assets/css/style.css
```

**Expected:** Should show CSS code
**If you see:** HTML or 404 → Root path is wrong

---

## 📋 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Backend Server | ✅ Running | Port 5000 |
| Database | ✅ Connected | MongoDB |
| CORS (port 5505) | ✅ Fixed | Added to allowed origins |
| CORS (port 5500) | ✅ Working | Already configured |
| Honeypot CSS | ⚠️ Check path | May need refresh |
| Form Submission | ✅ Should work | CORS fixed |

---

## 🎯 Next Steps

1. **Hard refresh browser:** `Ctrl + Shift + R`
2. **Check Network tab:** Verify CSS loads with 200 status
3. **Test form:** Fill and submit (wait >3 seconds)
4. **If CSS still broken:** Try Solution 3 (absolute paths)
5. **Report back:** Any remaining errors

---

## 🚨 Quick Fix If CSS Still Broken

As a temporary workaround, add this to the top of `pages/contact.html`:

```html
<head>
    <!-- Use absolute paths -->
    <link rel="stylesheet" href="/assets/css/style.css" />
    <link rel="stylesheet" href="/assets/css/contact.css" />
    <link rel="stylesheet" href="/assets/css/honeypot.css" />
    <!-- ... rest of head -->
</head>
```

Then restart Live Server:
1. Click "Port: 5505" in VS Code bottom bar → "Stop Live Server"
2. Right-click `index.html` → "Open with Live Server"
3. Navigate to contact form

---

**Last Updated:** April 9, 2026  
**CORS Status:** ✅ Fixed  
**CSS Status:** ⚠️ Try hard refresh first
