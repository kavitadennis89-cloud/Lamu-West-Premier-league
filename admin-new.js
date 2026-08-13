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


const menuItems = document.querySelectorAll(".sidebar li");
const pageTitle = document.getElementById("pageTitle");
const content = document.getElementById("content");


/* =========================
   SIDEBAR
========================= */

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        menuItems.forEach(menu => {
            menu.classList.remove("active");
        });

        item.classList.add("active");

        const page = item.dataset.page;

        pageTitle.textContent = item.textContent.trim();


        if (page === "dashboard") {

            showDashboard();

        } else if (page === "players") {

            showPlayers();

        } else {

            content.innerHTML = `
                <div class="card">
                    <h3>${item.textContent.trim()}</h3>
                    <p>Coming soon...</p>
                </div>
            `;

        }

    });

});


/* =========================
   DASHBOARD
========================= */

function showDashboard() {

    content.innerHTML = `
        <div class="card">

            <h3>🏆 LWPL Dashboard</h3>

            <p>
                Lamu West Premier League
                Administration
            </p>

        </div>
    `;

}


/* =========================
   PLAYERS PAGE
========================= */

async function showPlayers() {

    content.innerHTML = `

        <div class="card">

            <h3>👕 Players Management</h3>

            <button id="addPlayerBtn">
                ➕ Add Player
            </button>

            <button id="refreshPlayersBtn">
                🔄 Refresh Players
            </button>

            <br><br>

            <div id="playersList">
                Loading players...
            </div>

        </div>

    `;


    document
        .getElementById("addPlayerBtn")
        .addEventListener(
            "click",
            showPlayerForm
        );


    document
        .getElementById("refreshPlayersBtn")
        .addEventListener(
            "click",
            loadPlayers
        );


    await loadPlayers();

}


/* =========================
   PLAYER FORM
========================= */

function showPlayerForm() {

    const form = document.createElement("div");

    form.className = "card";

    form.innerHTML = `

        <h3>➕ Add New Player</h3>

        <label>Player Name</label>

        <input
            id="playerName"
            type="text"
            placeholder="Enter player name"
        >

        <br><br>

        <label>Team</label>

        <select id="playerTeam">

            <option value="">
                Select Team
            </option>

        </select>

        <br><br>

        <label>Jersey Number</label>

        <input
            id="playerNumber"
            type="number"
            placeholder="e.g. 10"
        >

        <br><br>

        <label>Position</label>

        <select id="playerPosition">

            <option value="">
                Select Position
            </option>

            <option value="GK">
                🧤 Goalkeeper
            </option>

            <option value="DEF">
                🛡️ Defender
            </option>

            <option value="MID">
                ⚙️ Midfielder
            </option>

            <option value="FW">
                ⚡ Forward
            </option>

        </select>

        <br><br>

        <label>
            <input
                id="playerStarting"
                type="checkbox"
            >

            Starting XI
        </label>

        <br><br>

        <label>
            <input
                id="playerCaptain"
                type="checkbox"
            >

            Captain
        </label>

        <br><br>

        <button id="savePlayerBtn">
            💾 Save Player
        </button>

        <button id="cancelPlayerBtn">
            ❌ Cancel
        </button>

    `;


    content.prepend(form);


    loadTeamsIntoSelect();


    document
        .getElementById("savePlayerBtn")
        .addEventListener(
            "click",
            savePlayer
        );


    document
        .getElementById("cancelPlayerBtn")
        .addEventListener(
            "click",
            () => form.remove()
        );

}


/* =========================
   LOAD TEAMS
========================= */

async function loadTeamsIntoSelect() {

    const select =
        document.getElementById("playerTeam");
