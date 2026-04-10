# 🚀 Production Deployment Checklist

**Date:** April 9, 2026  
**Status:** Ready for Production Review

---

## ✅ Pre-Deployment Checklist

### 1. Code Quality
- [x] Honeypot bot protection implemented
- [x] Master form handler (`setupFormHandler`) working
- [x] CORS configured for production domains
- [x] Rate limiting active (10 submissions/hour)
- [x] Form validation with Zod schemas
- [x] Backend middleware for bot detection
- [ ] **TODO:** Fix hire schema in backend (manual edit needed)

### 2. Security
- [x] Honeypot fields hidden with CSS
- [x] `autocomplete="new-password"` on honeypot fields
- [x] `readonly` attribute prevents auto-fill
- [x] Backend validates and cleans honeypot data
- [x] Rate limiter prevents abuse
- [x] CORS restricts allowed origins
- [x] Environment variables in `.env` (not committed)

### 3. Performance
- [x] Rate limiter fixed (was 6 min, now 1 hour)
- [x] Form submission optimized (< 1 second)
- [x] Database indexes created
- [x] Static assets properly linked

### 4. Forms Status
| Form | Frontend | Backend | Status |
|------|----------|---------|--------|
| Contact | ✅ | ✅ | Production Ready |
| Enrollment | ✅ | ✅ | Production Ready |
| Hire Talent | ❌ Missing | ✅ Ready | **NEEDS FORM** |
| Newsletter | ✅ | ✅ | Production Ready |

---

## 🔧 Critical Fixes Before Production

### FIX #1: Backend Hire Schema (REQUIRED)

**File:** `backend/index.js` (lines 115-123)

**Current (BROKEN):**
```javascript
const hireSchema = z.object({
    formType:           z.literal('hire'),
    contactName:        z.string().min(3, "Name must be at least 2 characters"),
    email:              z.string().email("Invalid email address"),
    phone:              z.string().min(10, "Phone number is too short"),
    companyName:        z.string().min(2, "Company name is too short"),
    officeAddress:      z.string().min(5, "Please enter a full office address"),
    title:              z.string().optional(),   
})
```

**Replace With:**
```javascript
const hireSchema = z.object({
    formType:           z.literal('hire'),
    contactName:        z.string().min(2, "Name must be at least 2 characters"),
    email:              z.string().email("Invalid email address"),
    phone:              z.string().min(10, "Phone number is too short"),
    companyName:        z.string().min(2, "Company name is too short"),
    officeAddress:      z.string().min(5, "Please enter a full office address").optional(),
    title:              z.string().optional(),
    message:            z.string().optional(),
});
```

**Why:** Makes `officeAddress` optional and adds `message` field

---

### FIX #2: Backend Duplicate Import (REQUIRED)

**File:** `backend/index.js` (line 7-9)

**Check for:**
```javascript
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const { honeypotMiddleware } = require('./middleware/honeypot');
```

**Should NOT have duplicate:**
```javascript
const rateLimit = require('express-rate-limit'); // ❌ Remove if duplicated
```

---

### FIX #3: Environment Variables (REQUIRED)

**File:** `backend/.env`

**Must contain:**
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/thexora
PORT=5000
NODE_ENV=production
```

**Verify:**
- [ ] `MONGO_URL` is set
- [ ] MongoDB Atlas whitelist includes `0.0.0.0/0` (all IPs)
- [ ] No `.env` file committed to git

---

## 🌐 Deployment Steps

### Option A: Netlify (Frontend) + Render (Backend)

#### 1. Frontend (Netlify)

**Step 1: Push to Git**
```bash
cd c:\Users\Daniel\OneDrive\Desktop\Thexora
git add .
git commit -m "feat: production ready with honeypot protection"
git push origin main
```

**Step 2: Netlify Auto-Deploy**
- Netlify should auto-deploy from `main` branch
- Check deployment at: https://app.netlify.com/sites/impact-studio-web

**Step 3: Verify Environment**
- Site URL: `https://impact-studio-web.netlify.app`
- Backend URL in `honeypot.js`: `https://impact-studio-web.onrender.com` ✅

---

#### 2. Backend (Render)

**Step 1: Verify Render Service**
- Service URL: `https://impact-studio-web.onrender.com`
- Health check: `https://impact-studio-web.onrender.com/health`

**Step 2: Check Environment Variables on Render**
In Render Dashboard → Environment:
```
MONGO_URL = mongodb+srv://...
NODE_ENV = production
```

**Step 3: Deploy**
```bash
git push origin main
```
Render auto-deploys on push to `main`

**Step 4: Verify**
```bash
# Test health endpoint
curl https://impact-studio-web.onrender.com/health

# Expected response:
{"status":"ok","db":"connected"}
```

---

### Option B: Manual Deploy

#### Frontend
```bash
# Build (if using build tool)
npm run build

# Or deploy static files directly
# Upload entire project root to hosting
```

#### Backend
```bash
cd backend
npm install --production
npm start
```

---

## 🧪 Post-Deployment Testing

### Test 1: Health Check
```
GET https://impact-studio-web.onrender.com/health
```
**Expected:** `{"status":"ok","db":"connected"}`

### Test 2: Contact Form
1. Go to: `https://impact-studio-web.netlify.app/pages/contact.html`
2. Fill form (wait >3 seconds)
3. Submit
4. **Expected:** Success message, data in MongoDB

### Test 3: Enrollment Form
1. Go to: `https://impact-studio-web.netlify.app/pages/choose-path.html`
2. Fill multi-step form
3. Submit
4. **Expected:** Success screen, data in MongoDB

### Test 4: Bot Protection
1. Open browser console
2. Fill honeypot field: `document.querySelector('input[name="hp_website"]').value = 'test'`
3. Submit
4. **Expected:** Silently blocked

### Test 5: CORS
**From browser console on your domain:**
```javascript
fetch('https://impact-studio-web.onrender.com/api/submit', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({formType: 'contact'})
})
```
**Expected:** Should work (no CORS error)

---

## 📊 Monitoring

### Backend Logs
- Render Dashboard → Logs
- Look for:
  - `✅ Honeypot validation passed` (good)
  - `🤖 Bot detected` (bots blocked)
  - `❌ Server Error` (investigate)

### Database
- MongoDB Atlas → Collections
- Check `submissions` collection
- Verify data is being saved

### Frontend
- Netlify Analytics (if enabled)
- Browser DevTools → Console
- Check for errors

---

## ⚠️ Known Issues

### 1. Hire Form Missing
**Impact:** Can't hire talent through website  
**Workaround:** Use contact form for now  
**Fix:** Create hire form (see FORM_PERFORMANCE_DIAGNOSTIC.md)

### 2. Backend File Lock
**Impact:** Can't auto-update hire schema  
**Fix:** Manual edit required in Render dashboard or local push

### 3. Rate Limiter Strictness
**Current:** 10 submissions/hour per IP  
**Monitor:** Check if users hit limit  
**Adjust:** Increase `max` in `formLimiter` if needed

---

## 🔐 Security Audit

### ✅ Passed
- [x] Environment variables not committed
- [x] CORS restricts origins
- [x] Rate limiting active
- [x] Honeypot bot protection
- [x] Input validation (Zod)
- [x] MongoDB connection string secured
- [x] No sensitive data in frontend

### ⚠️ Review
- [ ] Consider adding CSRF tokens
- [ ] Consider adding reCAPTCHA v3
- [ ] Review MongoDB Atlas IP whitelist
- [ ] Enable MongoDB authentication
- [ ] Add request logging

---

## 📝 Commit Message Template

```bash
git add .
git commit -m "feat: production deployment - honeypot protection & form handlers

- Add honeypot bot trap to all forms
- Implement master form handler (setupFormHandler)
- Fix rate limiter calculation (6min → 1hour)
- Update CORS for production domains
- Add backend honeypot middleware
- Improve form validation and error handling
- Optimize submission performance (<1s)

Security:
- Bot detection via honeypot fields
- Time-based validation (min 3 seconds)
- Rate limiting (10 req/hour)
- Input sanitization with Zod

Forms:
- ✅ Contact form (production ready)
- ✅ Enrollment form (production ready)
- ❌ Hire form (needs creation)
- ✅ Newsletter subscription (production ready)"

git push origin main
```

---

## 🚦 Go/No-Go Decision

### ✅ GREEN LIGHT (Safe to Deploy)
- Backend health check passes
- MongoDB connected
- CORS configured
- Forms tested locally
- `.env` not committed
- All critical fixes applied

### 🔴 RED LIGHT (Do NOT Deploy)
- Backend health check fails
- MongoDB not connected
- `.env` file in git
- Forms not tested
- Hire schema not fixed

---

## 📞 Support

**If deployment fails:**
1. Check Render logs for backend errors
2. Check Netlify logs for frontend errors
3. Verify environment variables
4. Test health endpoint
5. Check MongoDB Atlas connection

**Common Issues:**
- `MONGO_URL not found` → Add to Render env vars
- `CORS error` → Check allowedOrigins in backend
- `Form not submitting` → Check BACKEND_URL in honeypot.js
- `503 Database not connected` → MongoDB connection issue

---

**Last Updated:** April 9, 2026  
**Deployment Target:** Netlify (Frontend) + Render (Backend)  
**Status:** ⚠️ Ready after critical fixes
