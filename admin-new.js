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


menuItems.forEach(item => {

    item.addEventListener("click", () => {

        menuItems.forEach(menu => {
            menu.classList.remove("active");
        });

        item.classList.add("active");

        const page = item.dataset.page;

        pageTitle.textContent =
            item.textContent.trim();


        if (page === "dashboard") {

            showDashboard();

        }

        else if (page === "players") {

            showPlayers();

        }

        else {

            content.innerHTML = `
                <div class="card">
                    <h3>
                        ${item.textContent.trim()}
                    </h3>

                    <p>
                        Coming soon...
                    </p>
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
                Lamu West Premier League
                Administration
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

            <button id="addPlayerBtn">
                ➕ Add Player
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

        <br>

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


    try {

        const snapshot =
            await getDocs(
                collection(db, "teams")
            );


        snapshot.forEach(teamDoc => {

            const team =
                teamDoc.data();


            const option =
                document.createElement("option");


            option.value =
                team.name;


            option.textContent =
                team.name;


            select.appendChild(option);

        });

    }

    catch(error) {

        console.error(error);

        alert(
            "Unable to load teams: " +
            error.message
        );

    }

}


/* =========================
   SAVE PLAYER
========================= */

async function savePlayer() {

    const name =
        document
        .getElementById("playerName")
        .value
        .trim();


    const team =
        document
        .getElementById("playerTeam")
        .value;


    const number =
        document
        .getElementById("playerNumber")
        .value;


    const position =
        document
        .getElementById("playerPosition")
        .value;


    const starting =
        document
        .getElementById("playerStarting")
        .checked;


    const captain =
        document
        .getElementById("playerCaptain")
        .checked;


    if (
        !name ||
        !team ||
        !position
    ) {

        alert(
            "Please fill Player Name, Team and Position."
        );

        return;

    }


    try {

        await addDoc(
            collection(db, "players"),
            {

                name: name,

                team: team,

                number: number,

                position: position,

                starting: starting,

                captain: captain

            }
        );


        alert(
            "✅ Player saved successfully!"
        );


        await showPlayers();

    }

    catch(error) {

        console.error(error);

        alert(
            "❌ Firebase error: " +
            error.message
        );

    }

}


/* =========================
   LOAD PLAYERS
========================= */

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
                <p>
                    No players yet.
                </p>
            `;

            return;

        }


        playersList.innerHTML = "";


        snapshot.forEach(playerDoc => {

            const player =
                playerDoc.data();


            const playerCard =
                document.createElement("div");


            playerCard.className =
                "card";


            playerCard.innerHTML = `

                <h3>
                    👤 ${player.name || "Unknown"}
                </h3>

                <p>
                    🏆 ${player.team || "-"}
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

                <br>

                <button
                    onclick="deletePlayer('${playerDoc.id}')"
                >
                    🗑️ Delete
                </button>

            `;


            playersList.appendChild(
                playerCard
            );

        });

    }

    catch(error) {

        console.error(error);

        playersList.innerHTML = `
            <p>
                ❌ ${error.message}
            </p>
        `;

    }

}


/* =========================
   DELETE PLAYER
========================= */

window.deletePlayer =
async function(id) {

    if (
        !confirm(
            "Are you sure you want to delete this player?"
        )
    ) {

        return;

    }


    try {

        await deleteDoc(
            doc(db, "players", id)
        );


        alert(
            "✅ Player deleted!"
        );


        await showPlayers();

    }

    catch(error) {

        console.error(error);

        alert(
            "❌ " + error.message
        );

    }

};


showDashboard();
