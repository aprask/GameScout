import express from 'express';

import { migrateToLatest } from './data/migrate.js';
import { errorMiddleware } from './middleware/error.js';
import { Consumer } from './config/consumer.js';

import healthRouter from './routes/health.js';
import userRouter from './routes/user.js';
import adminRouter from './routes/admin.js';
import imageRouter from './routes/image.js';
import gameRouter from './routes/game.js';
import reviewRouter from './routes/review.js';
import followRouter from './routes/follows.js';
import articlesRouter from './routes/articles.js';
import wishlistRouter from './routes/wishlist.js';
import profileRouter from './routes/profile.js';
import authRouter from './routes/auth.js';

export const app = express();

app.use(express.json());

app.use('/api/v1/health', healthRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/image', imageRouter);
app.use('/api/v1/game', gameRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/follow', followRouter);
app.use('/api/v1/community/articles', articlesRouter);
app.use('/api/v1/wishlist', wishlistRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/auth', authRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT ?? 3000;

if (process.env.APP_ENV !== 'test') {
  const CONSUMER = new Consumer('GAME_DATA');
  await CONSUMER.consumerConfig();
  app.listen(+PORT, '0.0.0.0', () => {
    console.log(`Listening on port ${PORT}`);
    migrateToLatest();
  });
}
