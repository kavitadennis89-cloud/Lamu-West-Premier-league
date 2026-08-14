import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ===============================
// FIREBASE CONFIG
// ===============================

const firebaseConfig = {
    apiKey: "AIzaSyBQIYS4q......",
    authDomain: "YOUR-PROJECT.firebaseapp.com",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR-SENDER-ID",
    appId: "YOUR-APP-ID"
};


// ===============================
// FIREBASE START
// ===============================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ===============================
// LOAD PLAYERS
// ===============================

async function loadPlayers() {

    try {

        const snapshot = await getDocs(
            collection(db, "players")
        );

        console.log("Players found:", snapshot.size);

        snapshot.forEach((doc) => {

            console.log(
                "Player:",
                doc.id,
                doc.data()
            );

        });

    } catch (error) {

        console.error(
            "Firebase players error:",
            error
        );

    }

}


// ===============================
// START
// ===============================

loadPlayers();
