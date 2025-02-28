import * as path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import {Migrator, FileMigrationProvider } from 'kysely';
import { db } from './db';

// couldn't find a cleaner way to do this
// path to file + we rm that path by getting its dir via .dirname, then we can append migrations to in FileMigrationProvider
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, 'migrations'), // Kept receiving an undefined error w/ path.join (Node v23)
  }),
});

export async function migrateToLatest() {
  const { error, results } = await migrator.migrateToLatest();

  let migrationErrored = false;
  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
      migrationErrored = true;
    }
  });

  if (error || migrationErrored) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }
}
