import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import config from "../config.json";

//Firebase instantie aanmaken

const API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;
const AUTH_DOMAIN = config.firebase_auth_domain;
const PROJECT_ID = config.firebase_project_id;
const STORAGE_BUCKET = config.firebase_storage_bucket;
const MESSAGING_SENDER_ID = config.firebase_messaging_sender_id;
const APP_ID = config.firebase_app_id;

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  //measurementId: "${config.measurementId}",
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage, app };
