import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB-gB-9Y25V3B_RY16IQzH81KF5c-yAjC4",
  authDomain: "harvard-huddle-97087.firebaseapp.com",
  projectId: "harvard-huddle-97087",
  storageBucket: "harvard-huddle-97087.firebasestorage.app",
  messagingSenderId: "883023948928",
  appId: "1:883023948928:web:0540f7ccf208ba878b8a65",
  measurementId: "G-X94EXNNGSC",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
