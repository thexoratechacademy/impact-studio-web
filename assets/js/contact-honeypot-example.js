/**
 * ==========================================
 * CONTACT FORM - HONEYPOT INTEGRATION
 * ==========================================
 * Replace your existing contact.js with this
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Setup honeypot-protected form submission
    setupHoneypotForm('contact-form', 'contact', function(result) {
        console.log('Contact form submitted successfully:', result);
        
        // Optional: Add custom success handling
        // For example, redirect to thank you page
        // window.location.href = '/pages/thank-you.html';
    });
    
    // Optional: Add real-time form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
});

/**
 * Validate individual form field
 */
function validateField(field) {
    const errorClass = 'field-error';
    
    if (!field.value || field.value.trim() === '') {
        field.classList.add('error');
        showError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            field.classList.add('error');
            showError(field, 'Please enter a valid email');
            return false;
        }
    }
    
    // Phone validation (if provided)
    if (field.type === 'tel' && field.value) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(field.value)) {
            field.classList.add('error');
            showError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    field.classList.remove('error');
    removeError(field);
    return true;
}

/**
 * Show error message for field
 */
function showError(field, message) {
    removeError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ff4444';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '4px';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

/**
 * Remove error message for field
 */
function removeError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}
