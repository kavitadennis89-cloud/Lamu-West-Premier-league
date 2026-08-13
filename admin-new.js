import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
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

} else if (page === "teams") {

    showTeams();

} else if (page === "players") {

    showPlayers();

} else {

    content.innerHTML = `
        <div class="card">
            <h3>${item.textContent.trim()}</h3>
            <p>This module is under development.</p>
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
                Lamu West Premier League Administration
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
                🔄 Refresh
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
   ADD PLAYER FORM
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


    loadTeamsIntoSelect(
        "playerTeam"
    );


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

async function loadTeamsIntoSelect(selectId) {

    const select =
        document.getElementById(selectId);


    if (!select) return;


    try {

        const snapshot =
            await getDocs(
                collection(db, "teams")
            );


        snapshot.forEach(teamDoc => {

            const team =
                teamDoc.data();


            if (!team.name) return;


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


    if (!name || !team || !position) {

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
   DISPLAY PLAYERS
========================= */

async function loadPlayers() {

    const playersList =
        document.getElementById("playersList");


    if (!playersList) return;


    playersList.innerHTML =
        "<p>⏳ Loading players...</p>";


    try {

        const snapshot =
            await getDocs(
                collection(db, "players")
            );


        if (snapshot.empty) {

            playersList.innerHTML = `
                <div class="card">
                    <h3>👤 No Players Yet</h3>
                    <p>Add your first player.</p>
                </div>
            `;

            return;

        }


        playersList.innerHTML = `

            <h3>
                👥 Registered Players
                (${snapshot.size})
            </h3>

        `;


        snapshot.forEach(playerDoc => {

            const player =
                playerDoc.data();


            const card =
                document.createElement("div");


            card.className = "card";


            card.innerHTML = `

                <h3>
                    👤 ${player.name || "Unknown Player"}
                </h3>

                <p>
                    🏆 <strong>Team:</strong>
                    ${player.team || "-"}
                </p>

                <p>
                    🔢 <strong>Number:</strong>
                    ${player.number || "-"}
                </p>

                <p>
                    ⚽ <strong>Position:</strong>
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
                    class="editPlayerBtn"
                    data-id="${playerDoc.id}"
                >
                    ✏️ Edit
                </button>

                <button
                    class="deletePlayerBtn"
                    data-id="${playerDoc.id}"
                >
                    🗑️ Delete
                </button>

            `;


            playersList.appendChild(card);

        });


        document
            .querySelectorAll(".editPlayerBtn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        editPlayer(
                            button.dataset.id
                        );

                    }
                );

            });


        document
            .querySelectorAll(".deletePlayerBtn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        deletePlayer(
                            button.dataset.id
                        );

                    }
                );

            });

    }

    catch(error) {

        console.error(error);

        playersList.innerHTML = `
            <div class="card">
                <p>❌ Failed to load players.</p>
                <p>${error.message}</p>
            </div>
        `;

    }

}


/* =========================
   EDIT PLAYER
========================= */

async function editPlayer(id) {

    try {

        const playerRef =
            doc(db, "players", id);


        const snapshot =
            await getDocs(
                collection(db, "players")
            );


        let player = null;


        snapshot.forEach(playerDoc => {

            if (playerDoc.id === id) {

                player =
                    playerDoc.data();

            }

        });


        if (!player) {

            alert("Player not found.");

            return;

        }


        const form =
            document.createElement("div");


        form.className =
            "card";


        form.innerHTML = `

            <h3>✏️ Edit Player</h3>

            <label>Player Name</label>

            <input
                id="editName"
                type="text"
                value="${player.name || ""}"
            >

            <br><br>

            <label>Team</label>

            <select id="editTeam">

                <option value="">
                    Select Team
                </option>

            </select>

            <br><br>

            <label>Jersey Number</label>

            <input
                id="editNumber"
                type="number"
                value="${player.number || ""}"
            >

            <br><br>

            <label>Position</label>

            <select id="editPosition">

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
                    id="editStarting"
                    type="checkbox"
                    ${player.starting ? "checked" : ""}
                >

                Starting XI

            </label>

            <br><br>

            <label>

                <input
                    id="editCaptain"
                    type="checkbox"
                    ${player.captain ? "checked" : ""}
                >

                Captain

            </label>

            <br><br>

            <button id="updatePlayerBtn">
                💾 Update Player
            </button>

            <button id="cancelEditBtn">
                ❌ Cancel
            </button>

        `;


        content.prepend(form);


        await loadTeamsIntoSelect(
            "editTeam"
        );


        document.getElementById(
            "editTeam"
        ).value =
            player.team || "";


        document.getElementById(
            "editPosition"
        ).value =
            player.position || "";


        document
            .getElementById("updatePlayerBtn")
            .addEventListener(
                "click",
                async () => {

                    const updatedData = {

                        name:
                            document
                            .getElementById("editName")
                            .value
                            .trim(),

                        team:
                            document
                            .getElementById("editTeam")
                            .value,

                        number:
                            document
                            .getElementById("editNumber")
                            .value,

                        position:
                            document
                            .getElementById("editPosition")
                            .value,

                        starting:
                            document
                            .getElementById("editStarting")
                            .checked,

                        captain:
                            document
                            .getElementById("editCaptain")
                            .checked

                    };


                    if (
                        !updatedData.name ||
                        !updatedData.team ||
                        !updatedData.position
                    ) {

                        alert(
                            "Please fill Player Name, Team and Position."
                        );

                        return;

                    }


                    try {

                        await updateDoc(
                            playerRef,
                            updatedData
                        );


                        alert(
                            "✅ Player updated successfully!"
                        );


                        form.remove();


                        await loadPlayers();

                    }

                    catch(error) {

                        console.error(error);

                        alert(
                            "❌ Firebase error: " +
                            error.message
                        );

                    }

                }
            );


        document
            .getElementById("cancelEditBtn")
            .addEventListener(
                "click",
                () => form.remove()
            );

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

async function deletePlayer(id) {

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


        await loadPlayers();

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
   START
========================= */

showDashboard();
/* =========================
   TEAMS PAGE
========================= */

async function showTeams() {

    content.innerHTML = `
        <div class="card">

            <h3>⚽ Teams Management</h3>

            <button id="refreshTeamsBtn">
                🔄 Refresh Teams
            </button>

            <br><br>

            <div id="teamsList">
                Loading teams...
            </div>

        </div>
    `;

    document
        .getElementById("refreshTeamsBtn")
        .addEventListener("click", loadTeams);

    await loadTeams();
}

async function loadTeams() {

    const teamsList =
        document.getElementById("teamsList");

    teamsList.innerHTML = "<p>Loading teams...</p>";

    try {

        const snapshot =
            await getDocs(collection(db, "teams"));

        if (snapshot.empty) {

            teamsList.innerHTML =
                "<p>No teams found.</p>";

            return;

        }

        teamsList.innerHTML = "";

        snapshot.forEach(teamDoc => {

            const team = teamDoc.data();

            teamsList.innerHTML += `
                <div class="card">
                    <h3>${team.name}</h3>

                    <p>Played: ${team.played || 0}</p>
                    <p>Won: ${team.won || 0}</p>
                    <p>Draw: ${team.draw || 0}</p>
                    <p>Lost: ${team.lost || 0}</p>
                    <p>Points: ${team.points || 0}</p>
                </div>
            `;
        });

    } catch(error) {

        teamsList.innerHTML =
            "<p>Failed to load teams.</p>";

        console.error(error);
    }
}
