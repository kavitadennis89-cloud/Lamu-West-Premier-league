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
    apiKey: "AIzaSyBQIYS4TaMNIokWDCn0EJhlaA6KBxCmyaQ",
    authDomain: "lamu-west-premier-league.firebaseapp.com",
    projectId: "lamu-west-premier-league",
    storageBucket: "lamu-west-premier-league.firebasestorage.app",
    messagingSenderId: "280853181931",
    appId: "1:280853181931:web:8c411d3528bddadd2d15ae",
    measurementId: "G-HQ04SZWBBB"
};


// ===============================
// INITIALIZE FIREBASE
// ===============================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ===============================
// TEST PLAYERS COLLECTION
// ===============================

async function loadPlayers() {

    try {

        const snapshot = await getDocs(
            collection(db, "players")
        );

        console.log(
            "Players found:",
            snapshot.size
        );

        snapshot.forEach((doc) => {

            console.log(
                doc.id,
                doc.data()
            );

        });

    } catch (error) {

        console.error(
            "Firebase Error:",
            error
        );

    }

}


// ===============================
// START
// ===============================

loadPlayers();
