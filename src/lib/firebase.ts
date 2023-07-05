import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCTVWzLRKu9dDAlJ16ceOcysLO93YX5wm8",
  authDomain: "svelte-tree-aaaf7.firebaseapp.com",
  projectId: "svelte-tree-aaaf7",
  storageBucket: "svelte-tree-aaaf7.appspot.com",
  messagingSenderId: "16798301494",
  appId: "1:16798301494:web:e149530267c0fd31688797"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
