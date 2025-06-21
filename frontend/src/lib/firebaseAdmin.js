import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let app;

if (!getApps().length) {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;

  if (!base64) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY_BASE64');
  }

  const jsonStr = Buffer.from(base64, 'base64').toString('utf8');
  const serviceAccount = JSON.parse(jsonStr);

  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  app = getApps()[0];
}

export { app, getAuth };
