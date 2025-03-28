import express, { NextFunction, Request, Response } from 'express';
import VError from 'verror';

export const app = express();
app.use(express.json());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const info = VError.info(err);
    console.log(err);
    res.status(info?.statusCode ?? 500).json({ error: info?.response ?? 'Internal Server Error' });
});

const PORT = process.env.PORT ?? 3000;

if (process.env.APP_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}