/**
 * Thexora Global Configuration
 */
const CONFIG = {
    // API Configuration
    BACKEND_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : 'https://impact-studio-web.onrender.com', // Update this link as needed
    
    // SEO Defaults
    SITE_NAME: 'Thexora Tech Academy',
    DEFAULT_DESCRIPTION: 'Master high-demand tech skills with Thexora Tech Academy. Physical and online courses in Web Development, Mobile Apps, Cybersecurity, and more.'
};

// Also expose as window property for easy access
window.ThexoraConfig = CONFIG;
