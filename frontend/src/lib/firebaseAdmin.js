// frontend/src/lib/firebaseAdmin.js
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let serviceAccount;

try {
  const filePath = path.join(process.cwd(), 'firebase-key.json'); // asegurate de que este archivo exista
  const rawData = fs.readFileSync(filePath, 'utf8');
  serviceAccount = JSON.parse(rawData);
} catch (e) {
  throw new Error('Failed to load firebase-key.json: ' + e.message);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// ✅ Asegurate de exportar `db`
const db = admin.firestore();

export { admin, db };
