import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

import { getFirebaseWebConfig } from "@/lib/firebase/config";

type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
};

let cachedServices: FirebaseServices | null = null;

export function getFirebaseServices(): FirebaseServices | null {
  const config = getFirebaseWebConfig();

  if (!config) {
    return null;
  }

  if (cachedServices) {
    return cachedServices;
  }

  const app = getApps().length ? getApp() : initializeApp(config);

  cachedServices = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  };

  return cachedServices;
}
