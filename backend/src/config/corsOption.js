

const cors = require('cors');

// Allowed frontend origins
const localOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://learning-management-system-eight-lilac.vercel.app'
];

// Read additional origins from Render environment variables
const configuredOrigins = (process.env.FRONTEND_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

// Combine and remove duplicate origins
const whitelist = [
    ...new Set([...localOrigins, ...configuredOrigins])
];

const corsOptions = {
    origin: (origin, callback) => {
        console.log('Incoming Origin:', origin);

        // Allow requests without an Origin header
        if (!origin) {
            return callback(null, true);
        }

        // Check whether the origin is allowed
        if (whitelist.includes(origin)) {
            return callback(null, true);
        }

        console.log('Blocked Origin:', origin);
        return callback(null, false);
    },

    credentials: true,

    methods: [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS'
    ],

    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With'
    ],

    optionsSuccessStatus: 204
};

module.exports = corsOptions;
