import express from 'express'
import { migrateToLatest } from '../src/data/migrate.js';
import { errorMiddleware } from './middleware/error.js';
import healthRouter from './routes/health.js';
import userRouter from "./routes/user.js";

export const app = express();

app.use(express.json());
app.use(errorMiddleware);
app.use('/api/v1/health', healthRouter)
app.use('/api/v1/users', userRouter);

const PORT = process.env.PORT ?? 3000;

if (process.env.APP_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
        migrateToLatest();
    });
}