// API Configuration
// For local network testing (mobile), use your PC's IP: http://10.31.158.86:8000
// For local testing on the same PC, use: http://127.0.0.1:8000
// For production (after Render deployment), use your Render URL: https://your-app.onrender.com

const CONFIG = {
    // Dynamically detect the backend URL based on how the page is accessed
    API_BASE_URL: (function () {
        const hostname = window.location.hostname;
        const protocol = 'http:'; // Using http for local Django
        const port = '8000';

        // If accessed via file:// or empty hostname, default to localhost
        if (!hostname || hostname === '') {
            return `${protocol}//127.0.0.1:${port}`;
        }

        // Otherwise use the current hostname (works for localhost, 127.0.0.1, or local IP)
        return `${protocol}//${hostname}:${port}`;
    })()
};
