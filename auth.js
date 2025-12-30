// Replace with your actual Firebase Config
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

// Observe Auth State
auth.onAuthStateChanged(u => {
    user = u;
    const loginForm = document.getElementById('login-form-container');
    const userSection = document.getElementById('user-logged-in');
    const userInfo = document.getElementById('user-info');
    
    // Check if we are on the index page or profile page
    if (loginForm && userSection) {
        if (u) {
            loginForm.style.display = 'none';
            userSection.style.display = 'block';
            userInfo.innerText = `Hi, ${u.email.split('@')[0]}`;
        } else {
            loginForm.style.display = 'flex';
            userSection.style.display = 'none';
        }
    }
});

/** * AUTHENTICATION FUNCTIONS 
 */

// Sign Up
const signupBtn = document.getElementById('signup-btn');
if(signupBtn) {
    signupBtn.onclick = () => {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        auth.createUserWithEmailAndPassword(email, pass)
            .then(() => alert("Account created successfully!"))
            .catch(err => alert("Signup Error: " + err.message));
    };
}

// Login
const loginBtn = document.getElementById('login-btn');
if(loginBtn) {
    loginBtn.onclick = () => {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        auth.signInWithEmailAndPassword(email, pass)
            .catch(err => alert("Login Error: " + err.message));
    };
}

// Logout
const logoutBtn = document.getElementById('logout-btn');
if(logoutBtn) {
    logoutBtn.onclick = () => auth.signOut();
}

/** * DATA SAVING FUNCTIONS 
 */

async function saveShow(movie, status) {
    if (!user) {
        alert("Please login to save movies to your profile!");
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