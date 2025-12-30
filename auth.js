// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPzyGBtT3my4njW7B6xZw7BRKWP2yRS38",
  authDomain: "movie-planner-4e8f8.firebaseapp.com",
  projectId: "movie-planner-4e8f8",
  storageBucket: "movie-planner-4e8f8.firebasestorage.app",
  messagingSenderId: "141209573472",
  appId: "1:141209573472:web:5414792eeaa8f3b3b18b05"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

let user = null;

/**
 * 1. AUTH STATE OBSERVER
 * Handles UI changes across all pages when login status changes
 */
auth.onAuthStateChanged(u => {
    user = u;
    const loginForm = document.getElementById('login-form-container');
    const userSection = document.getElementById('user-logged-in');
    const userInfo = document.getElementById('user-info');
    
    if (u) {
        // Update Navbar for logged-in user
        if (loginForm) loginForm.style.display = 'none';
        if (userSection) userSection.style.display = 'flex';
        if (userInfo) userInfo.innerText = `Hi, ${u.email.split('@')[0]}`;
    } else {
        // Update Navbar for logged-out user
        if (loginForm) loginForm.style.display = 'flex';
        if (userSection) userSection.style.display = 'none';
    }
});

/**
 * 2. AUTHENTICATION LOGIC
 */

// Sign Up Logic
const signupBtn = document.getElementById('signup-btn');
if (signupBtn) {
    signupBtn.onclick = () => {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        if (!email || !pass) return alert("Please fill in all fields");
        
        auth.createUserWithEmailAndPassword(email, pass)
            .then(() => {
                alert("Account created!");
                window.location.href = 'index.html';
            })
            .catch(err => alert("Signup Error: " + err.message));
    };
}

// Login Logic
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.onclick = () => {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        
        auth.signInWithEmailAndPassword(email, pass)
            .then(() => {
                window.location.href = 'index.html';
            })
            .catch(err => alert("Login Error: " + err.message));
    };
}

// Logout Logic
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.onclick = () => {
        auth.signOut().then(() => {
            window.location.href = 'index.html';
        });
    };
}

/**
 * 3. DATA SAVING
 */
async function saveShow(movie, status) {
    if (!user) {
        alert("Please login to save movies!");
        return;
    }
    
    try {
        await db.collection("users").doc(user.uid).collection("watched").doc(movie.id.toString()).set({
            title: movie.title,
            status: status, // 'liked', 'disliked', or 'watchlist'
            poster: movie.poster_path,
            rating: movie.vote_average,
            id: movie.id,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert(`Successfully added to ${status}!`);
    } catch (e) {
        console.error("Firestore Error:", e);
        alert("Database Error: " + e.message);
    }
}

/**
 * 4. NAVIGATION GUARD
 * Prevents logged-out users from seeing the profile page
 */
function checkNavigation() {
    // This looks for 'profile' anywhere in the URL path
    const path = window.location.pathname.toLowerCase();
    
    auth.onAuthStateChanged(u => {
        if (path.includes('profile') && !u) {
            console.log("Access denied: No user found. Redirecting to login...");
            window.location.href = '/login.html';
        }
    });
}
checkNavigation();