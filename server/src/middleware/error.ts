import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.statusCode ?? 500;
    const message = err.response ?? 'Internal Server Error';
    res.status(statusCode).json({ error: message });
}