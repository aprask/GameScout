const WHITE_LIST = ['*'];

export const CORS_OPTIONS = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) {
        if (WHITE_LIST.indexOf(origin!) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'), false)
        }
    },
    optionsSuccessStatus: 200
} as const;