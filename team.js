import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBQIYS4TaMNIokWDCn0EJhlaA6KBxCmyaQ",
    authDomain: "lamu-west-premier-league.firebaseapp.com",
    projectId: "lamu-west-premier-league",
    storageBucket: "lamu-west-premier-league.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Get selected team from URL
const params = new URLSearchParams(window.location.search);
const selectedTeam = params.get("team");


// Show team name
document.getElementById("teamName").textContent =
    selectedTeam || "Team Squad";


async function loadSquad() {

    if (!selectedTeam) {
        document.getElementById("teamName").textContent = "No Team Selected";
        return;
    }

    const playersSnapshot = await getDocs(collection(db, "players"));

    const goalkeepers = document.getElementById("goalkeepers");
    const defenders = document.getElementById("defenders");
    const midfielders = document.getElementById("midfielders");
    const forwards = document.getElementById("forwards");

    goalkeepers.innerHTML = "";
    defenders.innerHTML = "";
    midfielders.innerHTML = "";
    forwards.innerHTML = "";

    let foundPlayers = false;

    playersSnapshot.forEach((doc) => {

        const player = doc.data();

        // Only show players belonging to selected team
        if (player.team !== selectedTeam) {
            return;
        }

        foundPlayers = true;

        const card = document.createElement("div");
        card.className = "player-card";

        card.innerHTML = `
            <div class="number">
                ${player.number || "-"}
            </div>

            <div class="player-info">
                <h3>${player.name || "Unnamed Player"}</h3>

                <p>
                    ${player.position || "Player"}
                </p>

                ${
                    player.captain
                    ? `<p class="captain">⭐ CAPTAIN</p>`
                    : ""
                }
            </div>
        `;

        const position = (player.position || "").toLowerCase();

        if (
            position.includes("goal") ||
            position === "gk" ||
            position.includes("keeper")
        ) {
            goalkeepers.appendChild(card);

        } else if (
            position.includes("def") ||
            position === "cb" ||
            position === "lb" ||
            position === "rb"
        ) {
            defenders.appendChild(card);

        } else if (
            position.includes("mid") ||
            position === "cm" ||
            position === "dm" ||
            position === "am"
        ) {
            midfielders.appendChild(card);

        } else if (
            position.includes("for") ||
            position.includes("attack") ||
            position === "fw" ||
            position === "st"
        ) {
            forwards.appendChild(card);

        } else {
            midfielders.appendChild(card);
        }

    });


    if (!foundPlayers) {

        goalkeepers.innerHTML =
            `<div class="empty">No players registered for this team yet.</div>`;

    }

}


// Load squad
loadSquad();
