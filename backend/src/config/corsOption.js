// Whitelist of origins allowed to call the API.
// In production, replace with your actual deployment URL(s).
const whitelist = [
  'http://localhost:3000',  // Vite dev server
  'http://localhost:5173',  // Vite default port (fallback)
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;