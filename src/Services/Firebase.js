// src/firebase.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signOut 
} from "firebase/auth";
import { 
  getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGuMBvb_LXJmbyfHKarbUjFMPFKOrGizw",
  authDomain: "cocktail-lab-294f2.firebaseapp.com",
  projectId: "cocktail-lab-294f2",
  storageBucket: "cocktail-lab-294f2.firebasestorage.app",
  messagingSenderId: "126671091791",
  appId: "1:126671091791:web:3dc3fd9a36c57ab884923a",
  measurementId: "G-J841D2FKM8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

export const loginGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);

// Salvar favorito no Firestore
export const salvarFavorito = async (userId, drink) => {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, { favoritos: [drink] });
  } else {
    await updateDoc(userRef, {
      favoritos: arrayUnion(drink)
    });
  }
};

// Observar favoritos em tempo real
export const observarFavoritos = (userId, callback) => {
  const userRef = doc(db, "users", userId);
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().favoritos || []);
    } else {
      callback([]);
    }
  });
};

// Remover favorito do Firestore
export const removerFavorito = async (userId, drink) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    favoritos: arrayRemove(drink)
  });
};