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

// 1. Simplify Provider
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' }); // Forces the account selector to show

// 2. Handle returning from Google
auth.getRedirectResult().catch((error) => {
    alert("Error returning from Google: " + error.message);
});

// 3. Update UI
auth.onAuthStateChanged(user => {
    const btn = document.getElementById('login-btn');
    const info = document.getElementById('user-info');
    if (user) {
        btn.style.display = 'none';
        info.innerText = "Hi, " + user.displayName.split(' ')[0];
    } else {
        btn.style.display = 'block';
        info.innerText = '';
    }
});

// 4. Trigger Login
document.getElementById('login-btn').onclick = () => {
    auth.signInWithRedirect(provider);
};