// Movie Planner Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPzyGBtT3my4njW7B6xZw7BRKWP2yRS38",
  authDomain: "movie-planner-4e8f8.firebaseapp.com",
  projectId: "movie-planner-4e8f8",
  storageBucket: "movie-planner-4e8f8.firebasestorage.app",
  messagingSenderId: "141209573472",
  appId: "1:141209573472:web:5414792eeaa8f3b3b18b05"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

let user = null;

/**
 * 1. HANDLE REDIRECT RESULT
 * This is crucial for mobile. When the page reloads after Google Login,
 * this function "catches" the user data or the error.
 */
auth.getRedirectResult().then((result) => {
    if (result.user) {
        console.log("Login successful for:", result.user.displayName);
    }
}).catch((error) => {
    // If login fails, this alert will tell us exactly why.
    // Example: "auth/unauthorized-domain" or "auth/operation-not-allowed"
    alert("Login Error: " + error.message + " (Code: " + error.code + ")");
    console.error("Full Auth Error:", error);
});

/**
 * 2. AUTH STATE OBSERVER
 * Automatically updates the UI when a user logs in or out.
 */
auth.onAuthStateChanged(u => {
    user = u;
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    
    if (u) {
        loginBtn.style.display = 'none';
        userInfo.innerText = `Hi, ${u.displayName.split(' ')[0]}`;
        console.log("Auth State: User is logged in");
    } else {
        loginBtn.style.display = 'block';
        userInfo.innerText = '';
        console.log("Auth State: No user logged in");
    }
});

/**
 * 3. LOGIN TRIGGER
 * Uses Redirect because Popups are often blocked by Android Chrome.
 */
document.getElementById('login-btn').onclick = () => {
    auth.signInWithRedirect(provider);
};

/**
 * 4. SAVE DATA TO FIRESTORE
 * Saves the movie to the "watched" collection under the user's ID.
 */
async function saveShow(movie, status) {
    if (!user) {
        alert("Please login with Google first!");
        return;
    }
    
    try {
        await db.collection("users").doc(user.uid).collection("watched").doc(movie.id.toString()).set({
            title: movie.title,
            status: status,
            poster: movie.poster_path,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert(`Successfully marked as ${status}!`);
    } catch (e) {
        console.error("Firestore Error:", e);
        alert("Database Error: " + e.message);
    }
}