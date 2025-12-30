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

let currentUser = null;

// Automatic Device Login
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        const info = document.getElementById('user-info');
        if (info) info.innerText = "Device Sync Active";
    } else {
        auth.signInAnonymously().catch(e => console.error("Auth Error", e));
    }
});

// Normalized Save Function
window.saveShow = async function(movie, status) {
    if (!currentUser) return alert("Connecting to device account...");

    const finalTitle = movie.title || movie.name || "Unknown Title";
    const finalPoster = movie.poster_path || "";

    try {
        await db.collection("users").doc(currentUser.uid).collection("watched").doc(movie.id.toString()).set({
            title: finalTitle,
            status: status,
            poster: finalPoster,
            rating: movie.vote_average || 0,
            id: movie.id,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert(`Added to ${status}!`);
    } catch (e) {
        alert("Database Error: " + e.message);
    }
};