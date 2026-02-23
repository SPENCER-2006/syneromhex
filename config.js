// API Configuration
// For local network testing (mobile), use your PC's IP: http://10.31.158.86:8000
// For local testing on the same PC, use: http://127.0.0.1:8000
// For production (after Render deployment), use your Render URL: https://your-app.onrender.com

const CONFIG = {
    // 1. Enter your production backend URL here (e.g., https://synerom-backend.onrender.com)
    PRODUCTION_API_URL: '',

    // Dynamically detect the backend URL based on how the page is accessed
    API_BASE_URL: (function () {
        const hostname = window.location.hostname;
        const protocol = 'http:';
        const port = '8000';

        // If accessed via GitHub Pages, we MUST use the production API URL
        if (hostname.includes('github.io')) {
            // Note: If PRODUCTION_API_URL is empty, this will fail.
            // You must deploy your Django backend to a service like Render and put the URL above.
            return CONFIG.PRODUCTION_API_URL || 'https://your-app.onrender.com';
        }

        // If accessed via file:// or empty hostname, default to localhost
        if (!hostname || hostname === '') {
            return `${protocol}//127.0.0.1:${port}`;
        }

        // Otherwise use the current hostname (works for localhost, 127.0.0.1, or local IP)
        return `${protocol}//${hostname}:${port}`;
    })()
};
// Note: If you are using local IP for testing, the detection above will still work.
