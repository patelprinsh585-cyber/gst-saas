import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtZ_JtVbtwhPEy26Z_jF0zJsfZoWTW66k",
  authDomain: "gst-genius-ai.firebaseapp.com",
  projectId: "gst-genius-ai",
  storageBucket: "gst-genius-ai.firebasestorage.app",
  messagingSenderId: "568681229906",
  appId: "1:568681229906:web:909651d73f0ff6efb9f98b",
  measurementId: "G-6Q14L9JD81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
  apiKey: "AIza...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("User:", user.email, user.displayName);
    // ab apna dashboard redirect karo
    router.push("/dashboard");
  } catch (error) {
    console.error(error);
  }
};
