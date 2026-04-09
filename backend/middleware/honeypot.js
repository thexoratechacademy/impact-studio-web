/**
 * ==========================================
 * HONEYPOT BOT TRAP - EXPRESS MIDDLEWARE
 * ==========================================
 * Apply this middleware to any POST route to check for bots
 */

/**
 * Honeypot validation middleware
 * Checks if honeypot fields are filled or if form was submitted too quickly
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.minSubmissionTime - Minimum time in ms to fill form (default: 3000)
 * @param {boolean} options.logBotAttempts - Whether to log bot attempts (default: true)
 * @returns {Function} Express middleware
 */
function honeypotMiddleware(options = {}) {
    const {
        minSubmissionTime = 3000, // 3 seconds minimum
        logBotAttempts = true
    } = options;

    return function(req, res, next) {
        try {
            const {
                hp_website,
                hp_email,
                hp_name,
                hp_time_start,
                hp_time_submit
            } = req.body;

            // Check 1: Honeypot fields should be empty
            if (hp_website && hp_website.trim() !== '') {
                if (logBotAttempts) {
                    console.warn('🤖 Bot detected: hp_website field filled', {
                        ip: req.ip,
                        userAgent: req.get('User-Agent'),
                        timestamp: new Date().toISOString(),
                        data: sanitizeLogData(req.body)
                    });
                }
                return res.status(403).json({
                    success: false,
                    message: 'Request blocked by security filter.'
                });
            }

            if (hp_email && hp_email.trim() !== '') {
                if (logBotAttempts) {
                    console.warn('🤖 Bot detected: hp_email field filled', {
                        ip: req.ip,
                        userAgent: req.get('User-Agent'),
                        timestamp: new Date().toISOString(),
                        data: sanitizeLogData(req.body)
                    });
                }
                return res.status(403).json({
                    success: false,
                    message: 'Request blocked by security filter.'
                });
            }

            if (hp_name && hp_name.trim() !== '') {
                if (logBotAttempts) {
                    console.warn('🤖 Bot detected: hp_name field filled', {
                        ip: req.ip,
                        userAgent: req.get('User-Agent'),
                        timestamp: new Date().toISOString(),
                        data: sanitizeLogData(req.body)
                    });
                }
                return res.status(403).json({
                    success: false,
                    message: 'Request blocked by security filter.'
                });
            }

            // Check 2: Time-based validation (bots are too fast)
            if (hp_time_start && hp_time_submit) {
                const startTime = parseInt(hp_time_start);
                const submitTime = parseInt(hp_time_submit);
                const timeDiff = submitTime - startTime;

                if (isNaN(startTime) || isNaN(submitTime)) {
                    if (logBotAttempts) {
                        console.warn('🤖 Bot detected: Invalid timestamp format', {
                            ip: req.ip,
                            userAgent: req.get('User-Agent'),
                            timestamp: new Date().toISOString()
                        });
                    }
                    return res.status(403).json({
                        success: false,
                        message: 'Request blocked by security filter.'
                    });
                }

                if (timeDiff < minSubmissionTime) {
                    if (logBotAttempts) {
                        console.warn('🤖 Bot detected: Form submitted too quickly', {
                            ip: req.ip,
                            userAgent: req.get('User-Agent'),
                            timeDiff: `${timeDiff}ms`,
                            minRequired: `${minSubmissionTime}ms`,
                            timestamp: new Date().toISOString(),
                            data: sanitizeLogData(req.body)
                        });
                    }
                    return res.status(403).json({
                        success: false,
                        message: 'Request blocked by security filter.'
                    });
                }
            }

            // All checks passed - proceed to next middleware/route handler
            if (logBotAttempts) {
                console.log('✅ Honeypot validation passed', {
                    ip: req.ip,
                    timestamp: new Date().toISOString()
                });
            }

            // Remove honeypot fields from request body before saving to DB
            const cleanBody = { ...req.body };
            delete cleanBody.hp_website;
            delete cleanBody.hp_email;
            delete cleanBody.hp_name;
            delete cleanBody.hp_time_start;
            delete cleanBody.hp_time_submit;

            // Attach clean data to request for downstream use
            req.cleanData = cleanBody;

            next();
        } catch (error) {
            console.error('❌ Honeypot middleware error:', error);
            // Fail safe - allow request but log error
            next();
        }
    };
}

/**
 * Sanitize data for logging (remove sensitive information)
 * @param {Object} data - Request body data
 * @returns {Object} Sanitized data
 */
function sanitizeLogData(data) {
    const sanitized = { ...data };
    
    // Remove or mask sensitive fields
    if (sanitized.email) sanitized.email = maskEmail(sanitized.email);
    if (sanitized.phone) sanitized.phone = maskPhone(sanitized.phone);
    
    // Only keep honeypot fields for debugging
    return {
        hp_website: sanitized.hp_website ? '[FILLED]' : '[EMPTY]',
        hp_email: sanitized.hp_email ? '[FILLED]' : '[EMPTY]',
        hp_name: sanitized.hp_name ? '[FILLED]' : '[EMPTY]',
        hp_time_start: sanitized.hp_time_start || 'N/A',
        hp_time_submit: sanitized.hp_time_submit || 'N/A',
        formType: sanitized.formType || 'unknown'
    };
}

/**
 * Mask email for logging
 * @param {string} email - Email address
 * @returns {string} Masked email
 */
function maskEmail(email) {
    if (!email || !email.includes('@')) return '[INVALID]';
    const [username, domain] = email.split('@');
    return `${username.substring(0, 2)}***@${domain}`;
}

/**
 * Mask phone number for logging
 * @param {string} phone - Phone number
 * @returns {string} Masked phone
 */
function maskPhone(phone) {
    if (!phone || phone.length < 4) return '[INVALID]';
    return `***${phone.slice(-4)}`;
}

module.exports = { honeypotMiddleware };
