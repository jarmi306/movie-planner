const firebaseConfig = {
  apiKey: "AIzaSyCPzyGBtT3my4njW7B6xZw7BRKWP2yRS38",
  authDomain: "movie-planner-4e8f8.firebaseapp.com",
  projectId: "movie-planner-4e8f8",
  storageBucket: "movie-planner-4e8f8.firebasestorage.app",
  messagingSenderId: "141209573472",
  appId: "1:141209573472:web:5414792eeaa8f3b3b18b05"
};

// Initialize Firebase safely
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

let user = null;

// Handle Auth State Changes
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

// Helper: Redirect to Login Page if on Index
function goToLoginPage() {
    window.location.href = 'login.html';
}

// Global Click Handler for Buttons
document.addEventListener('click', (e) => {
    const id = e.target.id;
    
    // If on Index page, the "Login / Sign Up" button should just take you to login.html
    if (id === 'login-btn' && window.location.pathname.includes('index.html')) {
        goToLoginPage();
    }
    
    // Actual Login Logic (Used in login.html)
    if (id === 'do-login') {
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-pass').value;
        auth.signInWithEmailAndPassword(email, pass)
            .then(() => window.location.href = 'index.html')
            .catch(err => alert("Login Error: " + err.message));
    }

    // Actual Signup Logic (Used in login.html)
    if (id === 'do-signup') {
        const email = document.getElementById('sig-email').value;
        const pass = document.getElementById('sig-pass').value;
        auth.createUserWithEmailAndPassword(email, pass)
            .then(() => window.location.href = 'index.html')
            .catch(err => alert("Signup Error: " + err.message));
    }

    // Logout
    if (id === 'logout-btn') {
        auth.signOut().then(() => window.location.href = 'index.html');
    }
});

// Normalize and Save Data
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