
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkYBnmE6fv__osymaDhPHVUjdg60e_aos",
  authDomain: "mypetrock-2b073.firebaseapp.com",
  projectId: "mypetrock-2b073",
  storageBucket: "mypetrock-2b073.firebasestorage.app",
  messagingSenderId: "229284276416",
  appId: "1:229284276416:web:13148d0ace35ce5afba525",
  measurementId: "G-NXYFFVH6LG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const logout = () => signOut(auth);

export const registerWithEmail = (email: string, pass: string, name: string) => 
  createUserWithEmailAndPassword(auth, email, pass).then(async (userCred) => {
    await updateProfile(userCred.user, { displayName: name });
    return userCred;
  });

export const loginWithEmail = (email: string, pass: string) => 
  signInWithEmailAndPassword(auth, email, pass);

export async function saveUserData(uid: string, data: any) {
  try {
    await setDoc(doc(db, "users", uid), data, { merge: true });
  } catch (e) {
    console.error("Error saving data:", e);
  }
}

export async function getUserData(uid: string) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (e) {
    console.error("Error getting data:", e);
    return null;
  }
}

export async function submitIdea(uid: string | null, idea: string) {
  try {
    await addDoc(collection(db, "ideas"), {
      uid: uid || "anonymous",
      text: idea,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (e) {
    console.error("Error submitting idea:", e);
    return false;
  }
}
