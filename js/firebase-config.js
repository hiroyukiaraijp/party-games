/* ===== Firebase Configuration for asobi.dev ===== */

// Firebase App + Firestore (CDN compat version for static sites)
// Loaded via <script> tags in HTML, no build step needed.

const firebaseConfig = {
  apiKey: "AIzaSyA5mBaUgaqQFPrJkoKbp0k6bKuy0qRWEws",
  authDomain: "asobi-dev.firebaseapp.com",
  projectId: "asobi-dev",
  storageBucket: "asobi-dev.firebasestorage.app",
  messagingSenderId: "340678083829",
  appId: "1:340678083829:web:0f2bc379d0f5667350b1bc"
};

// Initialize after Firebase SDK loads
let db = null;
function initFirebase() {
  if (db) return db;
  try {
    const app = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    return db;
  } catch (e) {
    console.error('Firebase init failed:', e);
    return null;
  }
}
