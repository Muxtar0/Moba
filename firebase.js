// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth , GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeMotyIVaHKdHzSgBFUbnCsf6amAKh5gw",
  authDomain: "mytwitter-4a93d.firebaseapp.com",
  projectId: "mytwitter-4a93d",
  storageBucket: "mytwitter-4a93d.appspot.com",
  messagingSenderId: "811007211471",
  appId: "1:811007211471:web:11abd4e13151eea5b284ba"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


export default app;
export { db, storage,auth, provider };
