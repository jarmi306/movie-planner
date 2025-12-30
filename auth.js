const firebaseConfig = {
  apiKey: "AIzaSyCPzyGBtT3my4njW7B6xZw7BRKWP2yRS38",
  authDomain: "movie-planner-4e8f8.firebaseapp.com",
  projectId: "movie-planner-4e8f8",
  storageBucket: "movie-planner-4e8f8.firebasestorage.app",
  messagingSenderId: "141209573472",
  appId: "1:141209573472:web:5414792eeaa8f3b3b18b05"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let user = null;

// Auth State Observer
auth.onAuthStateChanged(u => {
    user = u;
    const form = document.getElementById('login-form-container');
    const loggedInSection = document.getElementById('user-logged-in');
    const userInfo = document.getElementById('user-info');
    
    if (u) {
        form.style.display = 'none';
        loggedInSection.style.display = 'block';
        userInfo.innerText = u.email.split('@')[0];
    } else {
        form.style.display = 'flex';
        loggedInSection.style.display = 'none';
    }
});

// Sign Up Logic
document.getElementById('signup-btn').onclick = () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    auth.createUserWithEmailAndPassword(email, pass)
        .catch(err => alert("Signup Error: " + err.message));
};

// Login Logic
document.getElementById('login-btn').onclick = () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, pass)
        .catch(err => alert("Login Error: " + err.message));
};

// Logout Logic
document.getElementById('logout-btn').onclick = () => auth.signOut();

// Save Data Function
async function saveShow(movie, status) {
    if (!user) return alert("Please login first!");
    try {
        await db.collection("users").doc(user.uid).collection("watched").doc(movie.id.toString()).set({
            title: movie.title,
            status: status,
            poster: movie.poster_path,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("Saved to your profile!");
    } catch (e) {
        alert("Error: " + e.message);
    }
}