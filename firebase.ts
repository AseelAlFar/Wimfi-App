
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWGd2hyfYxNZu46onPMN8LBiJpckADBlo",
  authDomain: "wimfi-1eccd.firebaseapp.com",
  projectId: "wimfi-1eccd",
  storageBucket: "wimfi-1eccd.firebasestorage.app",
  messagingSenderId: "346679906313",
  appId: "1:346679906313:web:f91821968f91dddc1d68d8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let userId: string = "";
signInAnonymously(auth);
onAuthStateChanged(auth, (user) => { if (user) userId = user.uid; });

export const saveMemory = async (item: string, location: string) => {
  if (!userId) return;
  const ref = doc(db, "users", userId, "memories", item.toLowerCase());
  await setDoc(ref, { location, updatedAt: Date.now() });
};

export const queryMemory = async (item: string): Promise<string | null> => {
  if (!userId) return null;
  const ref = doc(db, "users", userId, "memories", item.toLowerCase());
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data()?.location : null;
};
