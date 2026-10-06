import fs from 'fs';
import path from 'path';
import { INITIAL_DATABASE_STATE } from '../data/seedData';
import { AppDatabaseState } from '../types/fitness';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE_PATH = path.join(DATA_DIR, 'fitness_hub_db.json');
const CREDENTIALS_FILE_PATH = path.join(DATA_DIR, 'admin_credentials.json');

interface AdminCredentials {
  email: string;
  password: string;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getDatabaseState(): AppDatabaseState {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE_PATH)) {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(INITIAL_DATABASE_STATE, null, 2), 'utf-8');
    return structuredClone(INITIAL_DATABASE_STATE);
  }
  try {
    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as AppDatabaseState;
    return {
      ...INITIAL_DATABASE_STATE,
      ...parsed,
      settings: {
        ...INITIAL_DATABASE_STATE.settings,
        ...(parsed.settings || {}),
      },
    };
  } catch {
    return structuredClone(INITIAL_DATABASE_STATE);
  }
}

export function saveDatabaseState(state: AppDatabaseState): AppDatabaseState {
  ensureDataDir();
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  return state;
}

export function getAdminCredentials(): AdminCredentials {
  ensureDataDir();
  const defaultCreds: AdminCredentials = {
    email: process.env.ADMIN_DEFAULT_EMAIL || 'admin@shirsekarsfitness.in',
    password: process.env.ADMIN_DEFAULT_PASSWORD || 'FitMantras@2026',
  };
  if (!fs.existsSync(CREDENTIALS_FILE_PATH)) {
    fs.writeFileSync(CREDENTIALS_FILE_PATH, JSON.stringify(defaultCreds, null, 2), 'utf-8');
    return defaultCreds;
  }
  try {
    return JSON.parse(fs.readFileSync(CREDENTIALS_FILE_PATH, 'utf-8')) as AdminCredentials;
  } catch {
    return defaultCreds;
  }
}

export function saveAdminCredentials(creds: AdminCredentials): void {
  ensureDataDir();
  fs.writeFileSync(CREDENTIALS_FILE_PATH, JSON.stringify(creds, null, 2), 'utf-8');
}
