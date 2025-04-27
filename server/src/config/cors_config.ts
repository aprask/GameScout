const WHITE_LIST = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost',
    'http://client',
    'http://localhost:80',
    'http://64.225.31.139',
    'https://64.225.31.139',
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
        if (WHITE_LIST.indexOf(origin!) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'), false)
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
};