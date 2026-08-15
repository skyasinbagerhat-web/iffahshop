// ==========================================
// IFFAH SHOP - FIREBASE CONFIG
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyCorDSEo_CbCWX3bLwUhh1-SpWeW6yVbfg",
    authDomain: "iffah-shop.firebaseapp.com",
    projectId: "iffah-shop",
    storageBucket: "iffah-shop.firebasestorage.app",
    messagingSenderId: "686173059760",
    appId: "1:686173059760:web:1354619b4f212549299975",
    measurementId: "G-6H5DVH4GVS"
};

// Firebase চালু
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Firestore
const db = firebase.firestore();

// অন্য JS ফাইল থেকেও ব্যবহার করা যাবে
window.db = db;

console.log("🔥 Firebase Connected");
