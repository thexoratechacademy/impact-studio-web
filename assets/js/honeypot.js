/**
 * ==========================================
 * HONEYPOT BOT TRAP - REUSABLE JAVASCRIPT
 * ==========================================
 * Include this in any form page to enable honeypot protection
 */

/**
 * Gathers form data including honeypot fields and metadata
 * @param {HTMLFormElement} form - The form element
 * @param {string} formType - Type of form: 'hire', 'contact', or 'enrollment'
 * @returns {Object} Form data with honeypot fields
 */
function gatherFormDataWithHoneypot(form, formType) {
    const formData = new FormData(form);
    const data = {
        formType: formType,
        timestamp: Date.now(),
        // Honeypot fields
        hp_website: formData.get('hp_website') || '',
        hp_email: formData.get('hp_email') || '',
        hp_name: formData.get('hp_name') || '',
        // Time-based honeypot (submission time)
        hp_time_start: formData.get('hp_time_start') || '',
        hp_time_submit: Date.now()
    };

    // Add all other form fields
    for (let [key, value] of formData.entries()) {
        // Skip honeypot fields
        if (!key.startsWith('hp_') && key !== 'hp_time_start') {
            // Map common field names to backend schema
            if (key === 'fullName' || key === 'contactName' || key === 'name') {
                data.contactName = value;
            } else if (key === 'email') {
                data.email = value;
            } else if (key === 'phone') {
                data.phone = value;
            } else if (key === 'companyName' || key === 'company') {
                data.companyName = value;
            } else if (key === 'message') {
                data.message = value;
            } else if (key === 'subject') {
                data.subject = value;
            } else if (key === 'officeAddress') {
                data.officeAddress = value;
            } else if (key === 'socialLink' || key === 'channel') {
                data.socialLink = value;
            } else if (key === 'title') {
                data.title = value;
            } else {
                // Add any additional fields
                data[key] = value;
            }
        }
    }

    return data;
}

/**
 * Validates honeypot data to detect bots
 * @param {Object} data - The form data with honeypot fields
 * @param {number} minTimeMs - Minimum time in ms to fill form (default: 3000ms)
 * @returns {Object} { isValid: boolean, reason: string }
 */
function validateHoneypotData(data, minTimeMs = 3000) {
    // Check if any honeypot fields are filled
    if (data.hp_website && data.hp_website.trim() !== '') {
        console.warn('🤖 Bot detected: website honeypot filled', data.hp_website);
        return { isValid: false, reason: 'Bot detected: website field filled' };
    }
    if (data.hp_email && data.hp_email.trim() !== '') {
        console.warn('🤖 Bot detected: email honeypot filled', data.hp_email);
        return { isValid: false, reason: 'Bot detected: email honeypot filled' };
    }
    if (data.hp_name && data.hp_name.trim() !== '') {
        console.warn('🤖 Bot detected: name honeypot filled', data.hp_name);
        return { isValid: false, reason: 'Bot detected: name honeypot filled' };
    }

    // Check submission time (bots are too fast)
    if (data.hp_time_start) {
        const startTime = parseInt(data.hp_time_start);
        const submitTime = data.hp_time_submit;
        const timeDiff = submitTime - startTime;
        
        if (timeDiff < minTimeMs) {
            return { 
                isValid: false, 
                reason: `Bot detected: form submitted too quickly (${timeDiff}ms)` 
            };
        }
    }

    return { isValid: true, reason: 'Passed honeypot validation' };
}

/**
 * ==========================================
 * MASTER FORM HANDLER WITH HONEYPOT PROTECTION
 * ==========================================
 * Universal form handler for all Thexora forms
 * Includes: honeypot validation, time-based traps, loading states, error handling
 */

/**
 * Master Function to handle any form submission on Thexora
 * @param {string} formId - The ID of the HTML form
 * @param {string} formType - The type of form: 'contact', 'enrollment', or 'hire'
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Custom success callback
 * @param {Function} options.onError - Custom error callback
 * @param {boolean} options.showAlerts - Show alert dialogs (default: true)
 * @param {string} options.successMessage - Custom success message
 */
function setupFormHandler(formId, formType, options = {}) {
    const form = document.getElementById(formId);
    if (!form) {
        console.warn(`Form with ID "${formId}" not found on this page`);
        return; // Exit if the form doesn't exist on this page
    }

    const {
        onSuccess = null,
        onError = null,
        showAlerts = true,
        successMessage = 'Success! Your request has been sent to Thexora.',
        minSubmissionTime = 3000
    } = options;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

    // Add hidden timestamp field for time-based honeypot
    const timeField = document.createElement('input');
    timeField.type = 'hidden';
    timeField.name = 'hp_time_start';
    timeField.value = Date.now();
    form.appendChild(timeField);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Visual Feedback
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Processing...';
        }

        // 2. Collet & Validate Data (including honeypot fields & mapping)
        const data = gatherFormDataWithHoneypot(form, formType);

        // 3. Honeypot Validation
        const honeypotCheck = validateHoneypotData(data, minSubmissionTime);
        if (!honeypotCheck.isValid) {
            console.warn('🤖 Bot detected:', honeypotCheck.reason);
            // Silently fail for bots - don't show errors
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
            return;
        }

        try {
            // 4. Send to Backend
            const response = await fetch(`${BACKEND_URL}/api/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // 5. Success UI
                console.log('✅ Form submitted successfully:', result);
                
                if (showAlerts) {
                    alert(successMessage);
                }
                
                form.reset();
                
                // Reset timestamp for next submission
                timeField.value = Date.now();
                
                // Call custom success callback if provided
                if (onSuccess) {
                    onSuccess(result);
                }
            } else {
                // 6. Handle backend errors (Bot Trap, Rate Limiter, Validation)
                console.error('❌ Submission error:', result);
                
                const errorMessage = result.message || result.error || 'Submission failed. Please try again.';
                
                if (showAlerts) {
                    alert(errorMessage);
                }
                
                // Call custom error callback if provided
                if (onError) {
                    onError(result);
                }
            }
        } catch (error) {
            // 7. Network Error
            console.error('🌐 Network Error:', error);
            
            if (showAlerts) {
                alert('Connection error. Please check your internet and try again.');
            }
            
            if (onError) {
                onError(error);
            }
        } finally {
            // 8. Reset Button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        }
    });

    console.log(`✅ Form handler initialized: ${formId} (${formType})`);
}

// Backend URL configuration
const BACKEND_URL = (window.ThexoraConfig && window.ThexoraConfig.BACKEND_URL) 
    ? window.ThexoraConfig.BACKEND_URL 
    : (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://impact-studio-web.onrender.com');

/**
 * Backwards compatibility alias
 * @deprecated Use setupFormHandler instead
 */
function setupHoneypotForm(formId, formType, onSuccess = null) {
    console.warn('setupHoneypotForm is deprecated. Use setupFormHandler instead.');
    setupFormHandler(formId, formType, { onSuccess });
}

// --- INITIALIZE ALL YOUR FORMS ---
// Auto-initialize forms when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Contact Form
    setupFormHandler('contact-form', 'contact', {
        successMessage: 'Message sent! We\'ll be in touch shortly.',
        onSuccess: (result) => {
            console.log('Contact form submitted:', result);
            // Show inline success message if it exists
            const successMsg = document.getElementById('form-success');
            if (successMsg) {
                successMsg.classList.add('visible');
                setTimeout(() => successMsg.classList.remove('visible'), 5000);
            }
        }
    });

    // Note: Enrollment Form is handled manually in choose-path.html due to multi-step complexity
    // setupFormHandler('enroll-form', 'enrollment', {...});

    // Hire Talent Form (when you create it)
    setupFormHandler('hire-talent-form', 'hire', {
        successMessage: 'Request sent! We\'ll connect you with talent soon.',
        onSuccess: (result) => {
            console.log('Hire talent form submitted:', result);
        }
    });

    console.log('✅ All form handlers initialized');
});
