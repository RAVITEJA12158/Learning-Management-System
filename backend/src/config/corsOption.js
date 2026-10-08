// Whitelist of origins allowed to call the API.
// In production, replace with your actual deployment URL(s).
const localOrigins = [
  'http://localhost:3000',  // Vite dev server
  'http://localhost:5173',  // Vite default port (fallback)
];
const configuredOrigins = (process.env.FRONTEND_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const whitelist = [...new Set([...localOrigins, ...configuredOrigins])];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      const error = new Error('Not allowed by CORS');
      error.code = 'CORS_DENIED';
      callback(error);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
