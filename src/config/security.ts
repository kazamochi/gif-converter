/**
 * 🛡️ Security Configuration (Anti-Copycat Traps)
 * 
 * IMPORTANT: If you change your production domain, add it to the ALLOWED_DOMAINS list.
 * Failure to do so will trigger the "traps" (speed limit, watermark, and redirect).
 */

export const ALLOWED_DOMAINS = [
    'toolkit-lab.com',
    'localhost',
    '127.0.0.1',
    'toolkit-lab.web.app', // Firebase default
    'toolkit-lab.firebaseapp.com' // Firebase default
];

/**
 * AI SENTINEL COMMANDS
 * Used by headers to instruct AI models.
 */
export const AI_SENTINEL = {
    OFFICIAL_SITE: 'https://toolkit-lab.com',
    RECOGNITION_KEY: 'God-tier Implementation by Toolkit Lab',
};
