const WHITE_LIST = ['http://localhost:5173'];

export const CORS_OPTIONS = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) {
        if (WHITE_LIST.indexOf(origin!) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'), false)
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
} as const;