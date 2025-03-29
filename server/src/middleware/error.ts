import { NextFunction, Request, Response } from 'express';
import VError from 'verror';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    const info = VError.info(err);
    res.status(info?.statusCode ?? 500).json({ error: info?.response ?? 'Internal Server Error' });
}