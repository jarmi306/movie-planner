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

auth.onAuthStateChanged(u => {
    user = u;
    document.getElementById('login-btn').style.display = u ? 'none' : 'block';
    document.getElementById('user-info').innerText = u ? `Hi, ${u.displayName.split(' ')[0]}` : '';
});

document.getElementById('login-btn').onclick = () => auth.signInWithPopup(provider);

async function saveShow(movie, status) {
    if (!user) return alert("Login first!");
    await db.collection("users").doc(user.uid).collection("watched").doc(movie.id.toString()).set({
        title: movie.title,
        status: status,
        date: new Date()
    });
    alert("Saved!");
}