/* ============================================================================
 * Dev-only launcher: runs the admissions API against a MongoDB instance on
 * this machine, so the signup/login flow works without an Atlas account.
 *
 * The data lives in server/.local-db, so it survives a restart — this is a
 * real local database, not a throwaway one. It is still EMPTY to begin with:
 * accounts created against Atlas do not exist here, so sign up once.
 *
 * For the real admissions data, put the Atlas connection string in
 * server/.env as MONGODB_URI and use `npm run dev` instead.
 * ==========================================================================*/

import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoMemoryServer } from 'mongodb-memory-server';

const here = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(here, '..', '.local-db');
mkdirSync(dbPath, { recursive: true });

const mongod = await MongoMemoryServer.create({
  instance: { dbName: 'spist_admissions', dbPath, storageEngine: 'wiredTiger' },
});

// db.js reads this at import time, so it has to be set before index.js loads.
process.env.MONGODB_URI = mongod.getUri('spist_admissions');
console.log('[db] Local MongoDB started (data in server/.local-db)');

const shutdown = async () => {
  await mongod.stop();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

await import('./index.js');
