import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let initialized = false;

export function getFirestoreDb() {
  if (!initialized) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Firestore credentials are not configured");
    }

    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }

    initialized = true;
  }

  return getFirestore();
}

export function getArtifactCollection() {
  return process.env.FIRESTORE_COLLECTION ?? "aa_artifacts";
}
