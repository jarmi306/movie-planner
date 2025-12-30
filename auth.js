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
const provider = new firebase.auth.GoogleAuthProvider();

let user = null;

// Handle Redirect Login Result
auth.getRedirectResult().then((result) => {
    if (result.user) console.log("Login successful");
}).catch((error) => console.error("Redirect Error:", error));

// Watch for User Login State
auth.onAuthStateChanged(u => {
    user = u;
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    if (u) {
        loginBtn.style.display = 'none';
        userInfo.innerText = `Hi, ${u.displayName.split(' ')[0]}`;
    } else {
        loginBtn.style.display = 'block';
        userInfo.innerText = '';
    }
});

document.getElementById('login-btn').onclick = () => auth.signInWithRedirect(provider);

async function saveShow(movie, status) {
    if (!user) return alert("Please Login first!");
    try {
        await db.collection("users").doc(user.uid).collection("watched").doc(movie.id.toString()).set({
            title: movie.title,
            status: status,
            poster: movie.poster_path,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert(`Show ${status}!`);
    } catch (e) {
        alert("Error saving: " + e.message);
    }
}