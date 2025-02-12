import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDG13wa8wmnVpAq5AWDNEvSlgrBUCG-sCo",
  authDomain: "task-management--system.firebaseapp.com",
  projectId: "task-management--system",
  storageBucket: "task-management--system.firebasestorage.app",
  messagingSenderId: "564339467111",
  appId: "1:564339467111:web:c071a80bafe206b2d785c2",
  measurementId: "G-EF8Q6TYMRZ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, analytics };