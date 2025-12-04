// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "oauth-integration-665f2.firebaseapp.com",
    projectId: "oauth-integration-665f2",
    storageBucket: "oauth-integration-665f2.firebasestorage.app",
    messagingSenderId: "1054735542306",
    appId: "1:1054735542306:web:151dec890818fcfabec27b",
    measurementId: "G-YFSYFT1JPM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const providers = new GoogleAuthProvider();

export { auth, providers }