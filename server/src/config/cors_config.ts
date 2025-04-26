const WHITE_LIST = [
    'http://localhost',
    'http://client',
    'http://localhost:80',
    'http://64.225.31.139',
    'https://64.225.31.139',
    'http://localhost:5173',
    'https://gamescout.xyz',
    'http://gamescout.xyz',
    'https://www.gamescout.xyz',
];
export const CORS_OPTIONS = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) {
        if (!origin) {
            callback(null, true);
            return;
        }
        if (WHITE_LIST.some(domain => origin.toLowerCase().includes(domain.toLowerCase()))) {
            callback(null, true);
        } else {
            console.error(`Blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    maxAge: 86400
};