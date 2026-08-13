import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBQIYS4TaMNIokWDCn0EJhlaA6KBxCmyaQ",
    authDomain: "lamu-west-premier-league.firebaseapp.com",
    projectId: "lamu-west-premier-league",
    storageBucket: "lamu-west-premier-league.firebasestorage.app",
    messagingSenderId: "280853181931",
    appId: "1:280853181931:web:8c411d3528bddadd2d15ae",
    measurementId: "G-HQ04SZWBBB"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("🔥 Firebase connected");


const menuItems = document.querySelectorAll(".sidebar li");
const pageTitle = document.getElementById("pageTitle");
const content = document.getElementById("content");


menuItems.forEach(item => {

    item.addEventListener("click", () => {

        const page = item.dataset.page;

        pageTitle.textContent = item.textContent.trim();

        if (page === "dashboard") {
            showDashboard();
        }

        if (page === "teams") {
            showTeams();
        }

        if (page === "players") {
            showPlayers();
        }

        if (
            page !== "dashboard" &&
            page !== "teams" &&
            page !== "players"
        ) {

            content.innerHTML = `
                <div class="card">
                    <h3>${item.textContent.trim()}</h3>
                    <p>Coming soon...</p>
                </div>
            `;

        }

    });

});


function showDashboard() {

    content.innerHTML = `
        <div class="card">

            <h3>🏆 LWPL Dashboard</h3>

            <p>
                Welcome to Lamu West Premier League Admin Panel.
            </p>

        </div>
    `;

}


/* =========================
   PLAYERS
========================= */

async function showPlayers() {

    content.innerHTML = `

        <div class="card">

            <h3>👕 Players Management</h3>

            <button id="addPlayer">
                ➕ Add Player
            </button>

            <br><br>

            <div id="playersList">
                Loading players...
            </div>

        </div>
    `;


    document
        .getElementById("addPlayer")
        .addEventListener(
            "click",
            addPlayer
        );


    await loadPlayers();

}


async function loadPlayers() {

    const playersList =
        document.getElementById("playersList");


    try {

        const snapshot =
            await getDocs(
                collection(db, "players")
            );


        if (snapshot.empty) {

            playersList.innerHTML = `
                <p>No players found.</p>
            `;

            return;
        }


        playersList.innerHTML = "";


        snapshot.forEach(playerDoc => {

            const player =
                playerDoc.data();


            playersList.innerHTML += `

                <div class="card">

                    <h3>
                        👤 ${player.name || "Unknown"}
                    </h3>

                    <p>
                        🏆 Team:
                        ${player.team || "-"}
                    </p>

                    <p>
                        🔢 Number:
                        ${player.number || "-"}
                    </p>

                    <p>
                        ⚽ Position:
                        ${player.position || "-"}
                    </p>

                    <p>
                        ${
                            player.starting
                            ? "⭐ Starting XI"
                            : "🔄 Substitute"
                        }
                    </p>

                    ${
                        player.captain
                        ? "<p>©️ Captain</p>"
                        : ""
                    }

                    <button
                        onclick="deletePlayer('${playerDoc.id}')"
                    >
                        🗑️ Delete
                    </button>

                </div>

            `;

        });

    }

    catch(error) {

        console.error(error);

        playersList.innerHTML = `
            <p>❌ Firebase Error</p>
            <p>${error.message}</p>
        `;

    }

}


/* =========================
   ADD PLAYER
========================= */

async function addPlayer() {

    const name =
        prompt("Player name:");

    if (!name) return;


    const team =
        prompt("Team name:");

    if (!team) return;


    const number =
        prompt("Jersey number:");


    const position =
        prompt(
            "Position: GK / DEF / MID / FW"
        );

    if (!position) return;


    const starting =
        confirm(
            "Is this player Starting XI?"
        );


    const captain =
        confirm(
            "Is this player Captain?"
        );


    try {

        await addDoc(
            collection(db, "players"),
            {

                name: name.trim(),

                team: team.trim(),

                number: number || "",

                position:
                    position
                    .trim()
                    .toUpperCase(),

                starting: starting,

                captain: captain

            }
        );


        alert(
            "✅ Player added successfully!"
        );


        await loadPlayers();

    }

    catch(error) {

        console.error(error);

        alert(
            "❌ " + error.message
        );

    }

}


/* =========================
   DELETE PLAYER
========================= */

window.deletePlayer =
async function(id) {

    if (
        !confirm(
            "Delete this player?"
        )
    ) {
        return;
    }


    try {

        await deleteDoc(
            doc(db, "players", id)
        );


        alert(
            "
