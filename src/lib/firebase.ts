import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';

// Firebase configuration
// For production, these should be environment variables, but for now we'll match the hosting config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "web-tool-kit.firebaseapp.com",
    projectId: "web-tool-kit",
    storageBucket: "web-tool-kit.appspot.com",
    messagingSenderId: "1076786221434",
    appId: "1:1076786221434:web:037466826012c4194090b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Functions
// Region must match the deployed function region (us-central1 is default)
export const functions = getFunctions(app, 'us-central1');
