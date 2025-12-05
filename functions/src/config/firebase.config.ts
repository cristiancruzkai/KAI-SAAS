/**
 * Configuración de Firebase Admin SDK
 */

import { initializeApp, getApps, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

// Inicializar Firebase Admin solo una vez
let app: App;

if (getApps().length === 0) {
  app = initializeApp();
} else {
  app = getApps()[0]!;
}

// Exportar instancias
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export { app };
