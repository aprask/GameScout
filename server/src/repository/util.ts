import { db } from '../data/db.js';

export async function truncateDb(): Promise<void> {
    await db.deleteFrom('articles').execute();
    await db.deleteFrom('article_comments').execute();
    await db.deleteFrom('user').execute();
    await db.deleteFrom('admin').execute();
    await db.deleteFrom('images').execute();
    await db.deleteFrom('games').execute();
    await db.deleteFrom('review').execute();
    await db.deleteFrom('wishlist').execute();
    await db.deleteFrom('profile').execute();
    await db.deleteFrom('follows').execute();
    await db.deleteFrom('auth').execute();
}