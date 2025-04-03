import { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { CORS_OPTIONS } from "../config/cors_config.js";
import dotenv from 'dotenv';

dotenv.config();

const corsMiddleware = cors(CORS_OPTIONS);

export async function resourceSharer(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (process.env.APP_ENV === 'test') next();
    else corsMiddleware(req, res, next);
}