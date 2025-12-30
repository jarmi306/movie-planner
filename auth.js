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

// Auth State Observer
auth.onAuthStateChanged(u => {
    user = u;
    const loginForm = document.getElementById('login-form-container');
    const userSection = document.getElementById('user-logged-in');
    const userInfo = document.getElementById('user-info');
    
    if (u) {
        if (loginForm) loginForm.style.display = 'none';
        if (userSection) userSection.style.display = 'flex';
        if (userInfo) userInfo.innerText = `Hi, ${u.email.split('@')[0]}`;
    } else {
        if (loginForm) loginForm.style.display = 'flex';
        if (userSection) userSection.style.display = 'none';
    }
});

// LOGIN LOGIC (for index.html and login.html)
function handleLogin() {
    const email = document.getElementById('email') ? document.getElementById('email').value : document.getElementById('login-email').value;
    const pass = document.getElementById('password') ? document.getElementById('password').value : document.getElementById('login-pass').value;
    
    auth.signInWithEmailAndPassword(email, pass)
        .then(() => { if(window.location.pathname.includes('login')) window.location.href = 'index.html'; })
        .catch(err => alert("Login Error: " + err.message));
}

// SIGNUP LOGIC
function handleSignup() {
    const email = document.getElementById('email') ? document.getElementById('email').value : document.getElementById('sig-email').value;
    const pass = document.getElementById('password') ? document.getElementById('password').value : document.getElementById('sig-pass').value;
    
    auth.createUserWithEmailAndPassword(email, pass)
        .then(() => { window.location.href = 'index.html'; })
        .catch(err => alert("Signup Error: " + err.message));
}

// Attach listeners safely
document.addEventListener('click', (e) => {
    if (e.target.id === 'login-btn' || e.target.id === 'do-login') handleLogin();
    if (e.target.id === 'signup-btn' || e.target.id === 'do-signup') handleSignup();
    if (e.target.id === 'logout-btn') auth.signOut().then(() => window.location.href = 'index.html');
});

// DATA SAVING WITH NORMALIZATION (The Dragon Ball Fix)
async function saveShow(movie, status) {
    if (!user) return alert("Please login first!");

    const finalTitle = movie.title || movie.name || "Unknown Title";
    const finalPoster = movie.poster_path || "";

    try {
        await db.collection("users").doc(user.uid).collection("watched").doc(movie.id.toString()).set({
            title: finalTitle,
            status: status,
            poster: finalPoster,
            rating: movie.vote_average || 0,
            id: movie.id,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert(`Successfully added to ${status}!`);
    } catch (e) {
        alert("Database Error: " + e.message);
    }
}

// Navigation Guard
function checkNavigation() {
    const path = window.location.pathname.toLowerCase();
    auth.onAuthStateChanged(u => {
        if (path.includes('profile') && !u) window.location.href = 'login.html';
    });
}
checkNavigation();