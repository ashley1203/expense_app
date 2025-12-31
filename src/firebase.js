import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// TODO: Replace with your Firebase config from Firebase Console
// Go to: Firebase Console > Project Settings > Your apps > Web app > Config
const firebaseConfig = {
    apiKey: "AIzaSyATLAQcYAmw91RzKo2uxxFfP6XcnntH4fM",
    authDomain: "expense-tracker-f20c7.firebaseapp.com",
    projectId: "expense-tracker-f20c7",
    storageBucket: "expense-tracker-f20c7.firebasestorage.app",
    messagingSenderId: "436505583500",
    appId: "1:436505583500:web:fc08f67e5f89b81b0e80a9"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

