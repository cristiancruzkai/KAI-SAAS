import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
