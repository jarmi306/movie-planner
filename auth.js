const firebaseConfig = {
  apiKey: "AIzaSyCPzyGBtT3my4njW7B6xZw7BRKWP2yRS38",
  authDomain: "movie-planner-4e8f8.firebaseapp.com",
  projectId: "movie-planner-4e8f8",
  storageBucket: "movie-planner-4e8f8.firebasestorage.app",
  messagingSenderId: "141209573472",
  appId: "1:141209573472:web:5414792eeaa8f3b3b18b05"
};

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

// GLOBAL FUNCTIONS FOR BUTTONS
window.handleLogin = function() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    if (!email || !pass) return alert("Enter email and password");

    auth.signInWithEmailAndPassword(email, pass)
        .then(() => { window.location.href = 'index.html'; })
        .catch(err => alert("Login Error: " + err.message));
};

window.handleSignup = function() {
    const email = document.getElementById('sig-email').value;
    const pass = document.getElementById('sig-pass').value;
    if (!email || !pass) return alert("Enter email and password");

    auth.createUserWithEmailAndPassword(email, pass)
        .then(() => { window.location.href = 'index.html'; })
        .catch(err => alert("Signup Error: " + err.message));
};

window.handleLogout = function() {
    auth.signOut().then(() => { window.location.href = 'index.html'; });
};

// DATA SAVING
async function saveShow(movie, status) {
    if (!user) return alert("Please login first!");
    const title = movie.title || movie.name || "Unknown";
    try {
        await db.collection("users").doc(user.uid).collection("watched").doc(movie.id.toString()).set({
            title: title,
            status: status,
            poster: movie.poster_path || "",
            id: movie.id,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert(`Successfully added to ${status}!`);
    } catch (e) { alert("Database Error: " + e.message); }
}