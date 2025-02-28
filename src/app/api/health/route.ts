import { migrateToLatest } from '../../../db/migrates';

export async function GET() {
    return Response.json({
      status: "ok",
      message: "Server is up!",
    });
}

export async function POST() {
  await migrateToLatest();
  return Response.json({
    status: "ok",
    message: "Made migration"
  });
}