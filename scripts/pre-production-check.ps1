# Pre-Production Verification Script
# Run this BEFORE pushing to production

Write-Host "`n🔍 PRE-PRODUCTION VERIFICATION" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$errors = 0
$warnings = 0

# Test 1: Check .env not committed
Write-Host "📋 Test 1: Checking .env files..." -ForegroundColor Yellow
if (Test-Path "backend/.env") {
    Write-Host "  ✅ .env exists (good)" -ForegroundColor Green
    $gitStatus = git ls-files --error-unmatch backend/.env 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ❌ ERROR: .env is tracked by git!" -ForegroundColor Red
        $errors++
    } else {
        Write-Host "  ✅ .env not in git (good)" -ForegroundColor Green
    }
} else {
    Write-Host "  ⚠️ WARNING: .env file not found" -ForegroundColor Yellow
    $warnings++
}

# Test 2: Check backend files
Write-Host "`n📋 Test 2: Checking backend structure..." -ForegroundColor Yellow
$requiredFiles = @("backend/index.js", "backend/package.json", "backend/.env")
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "  ❌ ERROR: $file missing!" -ForegroundColor Red
        $errors++
    }
}

# Test 3: Check honeypot files
Write-Host "`n📋 Test 3: Checking honeypot implementation..." -ForegroundColor Yellow
$honeypotFiles = @(
    "assets/css/honeypot.css",
    "assets/js/honeypot.js",
    "backend/middleware/honeypot.js"
)
foreach ($file in $honeypotFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "  ❌ ERROR: $file missing!" -ForegroundColor Red
        $errors++
    }
}

# Test 4: Check for duplicate imports
Write-Host "`n📋 Test 4: Checking for duplicate imports..." -ForegroundColor Yellow
$indexContent = Get-Content "backend/index.js" -Raw
$rateLimitCount = ([regex]::Matches($indexContent, "require\('express-rate-limit'\)")).Count
if ($rateLimitCount -gt 1) {
    Write-Host "  ❌ ERROR: Duplicate rateLimit import found!" -ForegroundColor Red
    $errors++
} else {
    Write-Host "  ✅ No duplicate imports" -ForegroundColor Green
}

# Test 5: Check rate limiter
Write-Host "`n📋 Test 5: Checking rate limiter..." -ForegroundColor Yellow
if ($indexContent -match "60 \* 60 \* 1000") {
    Write-Host "  ✅ Rate limiter correct (1 hour)" -ForegroundColor Green
} elseif ($indexContent -match "60 \* 60 \* 100") {
    Write-Host "  ❌ ERROR: Rate limiter still wrong (10 min instead of 1 hour)!" -ForegroundColor Red
    $errors++
} else {
    Write-Host "  ⚠️ WARNING: Cannot verify rate limiter" -ForegroundColor Yellow
    $warnings++
}

# Test 6: Check forms
Write-Host "`n📋 Test 6: Checking form files..." -ForegroundColor Yellow
$forms = @(
    @{file="pages/contact.html"; name="Contact Form"},
    @{file="pages/choose-path.html"; name="Enrollment Form"}
)
foreach ($form in $forms) {
    if (Test-Path $form.file) {
        $content = Get-Content $form.file -Raw
        if ($content -match "honeypot\.css") {
            Write-Host "  ✅ $($form.name) has honeypot" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ WARNING: $($form.name) missing honeypot CSS" -ForegroundColor Yellow
            $warnings++
        }
    } else {
        Write-Host "  ❌ ERROR: $($form.name) file missing!" -ForegroundColor Red
        $errors++
    }
}

# Test 7: Check git status
Write-Host "`n📋 Test 7: Checking git status..." -ForegroundColor Yellow
$uncommitted = git status --porcelain
if ($uncommitted) {
    Write-Host "  ⚠️ WARNING: Uncommitted changes detected" -ForegroundColor Yellow
    Write-Host "  Run: git add . && git commit -m 'your message'" -ForegroundColor Yellow
    $warnings++
} else {
    Write-Host "  ✅ Working tree clean" -ForegroundColor Green
}

# Test 8: Check for sensitive data
Write-Host "`n📋 Test 8: Scanning for sensitive data..." -ForegroundColor Yellow
$sensitivePatterns = @(
    "mongodb\+srv://[^`"']+",
    "AIza[0-9A-Za-z_-]{35}",
    "sk-[a-zA-Z0-9]{20,}"
)
$allFiles = git ls-files
$foundSensitive = $false
foreach ($pattern in $sensitivePatterns) {
    foreach ($file in $allFiles) {
        if (Test-Path $file) {
            $content = Get-Content $file -Raw -ErrorAction SilentlyContinue
            if ($content -match $pattern) {
                Write-Host "  ❌ ERROR: Sensitive data found in $file!" -ForegroundColor Red
                $errors++
                $foundSensitive = $true
            }
        }
    }
}
if (-not $foundSensitive) {
    Write-Host "  ✅ No sensitive data detected" -ForegroundColor Green
}

# Summary
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "📊 VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan
Write-Host "Errors:   $errors" -ForegroundColor $(if ($errors -gt 0) {"Red"} else {"Green"})
Write-Host "Warnings: $warnings" -ForegroundColor $(if ($warnings -gt 0) {"Yellow"} else {"Green"})

if ($errors -gt 0) {
    Write-Host "`n❌ CANNOT DEPLOY - Fix errors first!" -ForegroundColor Red
    Write-Host "Resolve all errors before pushing to production.`n" -ForegroundColor Red
    exit 1
} elseif ($warnings -gt 0) {
    Write-Host "`n⚠️  READY WITH WARNINGS" -ForegroundColor Yellow
    Write-Host "You can deploy, but review warnings first.`n" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "`n✅ ALL CHECKS PASSED - READY FOR PRODUCTION!" -ForegroundColor Green
    Write-Host "Safe to push to production.`n" -ForegroundColor Green
    exit 0
}
