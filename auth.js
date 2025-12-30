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

// Handle Auth State
auth.onAuthStateChanged(u => {
    user = u;
    const userSection = document.getElementById('user-logged-in');
    const userInfo = document.getElementById('user-info');
    const loginBtn = document.getElementById('login-btn');
    
    if (u) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userSection) userSection.style.display = 'flex';
        if (userInfo) userInfo.innerText = `Hi, ${u.email.split('@')[0]}`;
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (userSection) userSection.style.display = 'none';
    }
});

// GLOBAL FUNCTIONS (Assigned to window so HTML can see them)
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

window.forgotPassword = function() {
    const email = document.getElementById('login-email').value;
    if(!email) return alert("Enter email first");
    auth.sendPasswordResetEmail(email)
        .then(() => alert("Reset link sent!"))
        .catch(err => alert(err.message));
};

// Data Saving Function
async function saveShow(movie, status) {
    if (!user) return alert("Login first!");
    const title = movie.title || movie.name || "Unknown";
    try {
        await db.collection("users").doc(user.uid).collection("watched").doc(movie.id.toString()).set({
            title: title,
            status: status,
            poster: movie.poster_path || "",
            id: movie.id,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("Added!");
    } catch (e) { alert(e.message); }
}