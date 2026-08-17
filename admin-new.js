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


/* =========================
   FIREBASE
========================= */

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


/* =========================
   AUTH CHECK
========================= */

if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "login.html";
}


/* =========================
   ELEMENTS
========================= */

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

        if (page === "dashboard") showDashboard();
        if (page === "teams") showTeams();
        if (page === "players") showPlayers();
        if (page === "fixtures") showFixtures();
        if (page === "results") showResults();
        if (page === "scorers") showScorers();
        if (page === "logos") showLogos();
        if (page === "lineups") showLineups();
        if (page === "settings") showSettings();

    });

});


/* =========================
   DASHBOARD
========================= */

async function showDashboard() {

    content.innerHTML = `
        <div class="card">
            <h3>🏆 LWPL Dashboard</h3>
            <p>Lamu West Premier League Administration</p>

            <div id="dashboardStats">
                Loading statistics...
            </div>
        </div>
    `;

    try {

        const teams = await getDocs(collection(db, "teams"));
        const players = await getDocs(collection(db, "players"));
        const fixtures = await getDocs(collection(db, "fixtures"));
        const results = await getDocs(collection(db, "results"));
        const scorers = await getDocs(collection(db, "scorers"));

        document.getElementById("dashboardStats").innerHTML = `
            <hr>
            <p>⚽ Teams: <strong>${teams.size}</strong></p>
            <p>👕 Players: <strong>${players.size}</strong></p>
            <p>📅 Fixtures: <strong>${fixtures.size}</strong></p>
            <p>🥅 Results: <strong>${results.size}</strong></p>
            <p>⚽ Top Scorers: <strong>${scorers.size}</strong></p>
        `;

    } catch (error) {

        console.error(error);

        document.getElementById("dashboardStats").innerHTML =
            `<p>❌ Unable to load dashboard.</p>`;
    }

}


/* =========================
   TEAMS
========================= */

async function showTeams() {

    content.innerHTML = `
        <div class="card">
            <h3>⚽ Teams Management</h3>

            <button id="refreshTeams">
                🔄 Refresh Teams
            </button>

            <div id="teamsList">
                Loading teams...
            </div>
        </div>
    `;

    document
        .getElementById("refreshTeams")
        .addEventListener("click", loadTeams);

    await loadTeams();
}


async function loadTeams() {

    const list = document.getElementById("teamsList");

    if (!list) return;

    list.innerHTML = "<p>⏳ Loading teams...</p>";

    try {

        const snapshot =
            await getDocs(collection(db, "teams"));

        if (snapshot.empty) {

            list.innerHTML = "<p>No teams found.</p>";

            return;
        }

        list.innerHTML = "";

        snapshot.forEach(teamDoc => {

            const team = teamDoc.data();

            list.innerHTML += `
                <div class="card">

                    <h3>⚽ ${team.name || "Unnamed Team"}</h3>

                    <p>Played: ${team.played || 0}</p>
                    <p>Won: ${team.won || 0}</p>
                    <p>Draw: ${team.draw || 0}</p>
                    <p>Lost: ${team.lost || 0}</p>
                    <p>GF: ${team.goalsFor || 0}</p>
                    <p>GA: ${team.goalsAgainst || 0}</p>
                    <p>Points: ${team.points || 0}</p>

                </div>
            `;
        });

    } catch (error) {

        console.error(error);

        list.innerHTML = `
            <p>❌ Failed to load teams.</p>
            <p>${error.message}</p>
        `;
    }
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

            <button id="refreshPlayersBtn">
                🔄 Refresh
            </button>

            <div id="playersList">
                Loading players...
            </div>

        </div>
    `;

    document
        .getElementById("addPlayerBtn")
        .addEventListener("click", showPlayerForm);

    document
        .getElementById("refreshPlayersBtn")
        .addEventListener("click", loadPlayers);

    await loadPlayers();
}


async function loadPlayers() {

    const list = document.getElementById("playersList");

    if (!list) return;

    list.innerHTML = "<p>⏳ Loading players...</p>";

    try {

        const snapshot =
            await getDocs(collection(db, "players"));

        if (snapshot.empty) {

            list.innerHTML = "<p>No players found.</p>";

            return;
        }

        list.innerHTML = `<h3>👥 Players (${snapshot.size})</h3>`;

        snapshot.forEach(playerDoc => {

            const player = playerDoc.data();

            list.innerHTML += `
                <div class="card">

                    <h3>👤 ${player.name || "Unknown"}</h3>

                    <p>Team: ${player.team || "-"}</p>
                    <p>Number: ${player.number || "-"}</p>
                    <p>Position: ${player.position || "-"}</p>

                    <p>
                        ${player.starting ? "⭐ Starting XI" : "🔄 Substitute"}
                    </p>

                    ${player.captain ? "<p>©️ Captain</p>" : ""}

                    <button
                        class="deletePlayer"
                        data-id="${playerDoc.id}">
                        🗑️ Delete
                    </button>

                </div>
            `;
        });

        document
            .querySelectorAll(".deletePlayer")
            .forEach(button => {

                button.addEventListener("click", async () => {

                    if (!confirm("Delete this player?")) return;

                    await deleteDoc(
                        doc(db, "players", button.dataset.id)
                    );

                    await loadPlayers();
                });

            });

    } catch (error) {

        console.error(error);

        list.innerHTML =
            `<p>❌ ${error.message}</p>`;
    }
}


function showPlayerForm() {

    content.insertAdjacentHTML("afterbegin", `

        <div class="card" id="playerForm">

            <h3>➕ Add Player</h3>

            <input id="playerName"
                placeholder="Player Name">

            <input id="playerNumber"
                type="number"
                placeholder="Jersey Number">

            <select id="playerTeam">
                <option value="">Select Team</option>
            </select>

            <select id="playerPosition">
                <option value="">Select Position</option>
                <option value="GK">🧤 Goalkeeper</option>
                <option value="DEF">🛡️ Defender</option>
                <option value="MID">⚙️ Midfielder</option>
                <option value="FW">⚡ Forward</option>
            </select>

            <label>
                <input id="playerStarting" type="checkbox">
                Starting XI
            </label>

            <label>
                <input id="playerCaptain" type="checkbox">
                Captain
            </label>

            <br>

            <button id="savePlayer">
                💾 Save
            </button>

            <button id="cancelPlayer">
                ❌ Cancel
            </button>

        </div>

    `);

    loadTeamsSelect("playerTeam");

    document.getElementById("savePlayer")
        .addEventListener("click", savePlayer);

    document.getElementById("cancelPlayer")
        .addEventListener("click", () => {
            document.getElementById("playerForm").remove();
        });
}


async function loadTeamsSelect(id) {

    const select = document.getElementById(id);

    if (!select) return;

    const snapshot =
        await getDocs(collection(db, "teams"));

    snapshot.forEach(teamDoc => {

        const team = teamDoc.data();

        if (!team.name) return;

        select.innerHTML += `
            <option value="${team.name}">
                ${team.name}
            </option>
        `;
    });
}


async function savePlayer() {

    const name =
        document.getElementById("playerName").value.trim();

    const team =
        document.getElementById("playerTeam").value;

    const number =
        document.getElementById("playerNumber").value;

    const position =
        document.getElementById("playerPosition").value;

    const starting =
        document.getElementById("playerStarting").checked;

    const captain =
        document.getElementById("playerCaptain").checked;

    if (!name || !team || !position) {

        alert("Fill Player Name, Team and Position.");

        return;
    }

    try {

        await addDoc(collection(db, "players"), {
            name,
            team,
            number,
            position,
            starting,
            captain
        });

        alert("✅ Player saved!");

        await showPlayers();

    } catch (error) {

        alert("❌ " + error.message);

    }
}


/* =========================
   FIXTURES
========================= */

async function showFixtures() {

    content.innerHTML = `
        <div class="card">

            <h3>📅 Fixtures Management</h3>

            <button id="addFixture">
                ➕ Add Fixture
            </button>

            <button id="refreshFixtures">
                🔄 Refresh
            </button>

            <div id="fixturesList">
                Loading fixtures...
            </div>

        </div>
    `;

    document.getElementById("addFixture")
        .addEventListener("click", showFixtureForm);

    document.getElementById("refreshFixtures")
        .addEventListener("click", loadFixtures);

    await loadFixtures();
}


async function loadFixtures() {

    const list = document.getElementById("fixturesList");

    if (!list) return;

    try {

        const snapshot =
            await getDocs(collection(db, "fixtures"));

        if (snapshot.empty) {

            list.innerHTML = "<p>No fixtures found.</p>";

            return;
        }

        list.innerHTML = "";

        snapshot.forEach(fixtureDoc => {

            const f = fixtureDoc.data();

            list.innerHTML += `
                <div class="card">

                    <h3>
                        ${f.homeTeam || f.home || "-"}
                        🆚
                        ${f.awayTeam || f.away || "-"}
                    </h3>

                    <p>📅 ${f.date || "-"}</p>
                    <p>⏰ ${f.time || "-"}</p>
                    <p>📍 ${f.venue || "-"}</p>

                    <button
                        class="deleteFixture"
                        data-id="${fixtureDoc.id}">
                        🗑️ Delete
                    </button>

                </div>
            `;
        });

        document
            .querySelectorAll(".deleteFixture")
            .forEach(button => {

                button.addEventListener("click", async () => {

                    if (!confirm("Delete this fixture?")) return;

                    await deleteDoc(
                        doc(db, "fixtures", button.dataset.id)
                    );

                    await loadFixtures();
                });

            });

    } catch (error) {

        console.error(error);

        list.innerHTML =
            `<p>❌ ${error.message}</p>`;
    }
}


function showFixtureForm() {

    content.insertAdjacentHTML("afterbegin", `

        <div class="card" id="fixtureForm">

            <h3>➕ Add Fixture</h3>

            <select id="homeTeam">
                <option value="">Home Team</option>
            </select>

            <select id="awayTeam">
                <option value="">Away Team</option>
            </select>

            <input id="fixtureDate"
                type="date">

            <input id="fixtureTime"
                type="time">

            <input id="fixtureVenue"
                placeholder="Venue">

            <br>

            <button id="saveFixture">
                💾 Save Fixture
            </button>

            <button id="cancelFixture">
                ❌ Cancel
            </button>

        </div>
    `);

    loadTeamsSelect("homeTeam");
    loadTeamsSelect("awayTeam");

    document.getElementById("saveFixture")
        .addEventListener("click", saveFixture);

    document.getElementById("cancelFixture")
        .addEventListener("click", () => {
            document.getElementById("fixtureForm").remove();
        });
}


async function saveFixture() {

    const home =
        document.getElementById("homeTeam").value;

    const away =
        document.getElementById("awayTeam").value;

    const date =
        document.getElementById("fixtureDate").value;

    const time =
        document.getElementById("fixtureTime").value;

    const venue =
        document.getElementById("fixtureVenue").value.trim();

    if (!home || !away || !date) {

        alert("Select both teams and date.");

        return;
    }

    if (home === away) {

        alert("Home and Away teams cannot be the same.");

        return;
    }

    try {

        await addDoc(collection(db, "fixtures"), {
            homeTeam: home,
            awayTeam: away,
            date,
            time,
            venue,
            status: "upcoming"
        });

        alert("✅ Fixture saved!");

        await showFixtures();

    } catch (error) {

        alert("❌ " + error.message);

    }
}


/* =========================
   RESULTS
========================= */

async function showResults() {

    content.innerHTML = `
        <div class="card">

            <h3>🥅 Results Management</h3>

            <button id="addResult">
                ➕ Add Result
            </button>

            <button id="refreshResults">
                🔄 Refresh
            </button>

            <div id="resultsList">
                Loading results...
            </div>

        </div>
    `;

    document.getElementById("addResult")
        .addEventListener("click", showResultForm);

    document.getElementById("refreshResults")
        .addEventListener("click", loadResults);

    await loadResults();
}


async function loadResults() {

    const list = document.getElementById("resultsList");

    if (!list) return;

    try {

        const snapshot =
            await getDocs(collection(db, "results"));

        if (snapshot.empty) {

            list.innerHTML = "<p>No results found.</p>";

            return;
        }

        list.innerHTML = "";

        snapshot.forEach(resultDoc => {

            const r = resultDoc.data();

            list.innerHTML += `
                <div class="card">

                    <h3>
                        ${r.homeTeam || r.home || "-"}
                        ${r.homeScore ?? 0}
                        -
                        ${r.awayScore ?? 0}
                        ${r.awayTeam || r.away || "-"}
                    </h3>

                    <p>📅 ${r.date || "-"}</p>

                    <button
                        class="deleteResult"
                        data-id="${resultDoc.id}">
                        🗑️ Delete
                    </button>

                </div>
            `;
        });

        document
            .querySelectorAll(".deleteResult")
            .forEach(button => {

                button.addEventListener("click", async () => {

                    if (!confirm("Delete this result?")) return;

                    await deleteDoc(
                        doc(db, "results", button.dataset.id)
                    );

                    await loadResults();
                });

            });

    } catch (error) {

        list.innerHTML =
            `<p>❌ ${error.message}</p>`;
    }
}


function showResultForm() {

    content.insertAdjacentHTML("afterbegin", `

        <div class="card" id="resultForm">

            <h3>➕ Add Match Result</h3>

            <select id="resultHome">
                <option value="">Home Team</option>
            </select>

            <input id="homeScore"
                type="number"
                min="0"
                placeholder="Home Score">

            <select id="resultAway">
                <option value="">Away Team</option>
            </select>

            <input id="awayScore"
                type="number"
                min="0"
                placeholder="Away Score">

            <input id="resultDate"
                type="date">

            <br>

            <button id="saveResult">
                💾 Save Result
            </button>

            <button id="cancelResult">
                ❌ Cancel
            </button>

        </div>
    `);

    loadTeamsSelect("resultHome");
    loadTeamsSelect("resultAway");

    document.getElementById("saveResult")
        .addEventListener("click", saveResult);

    document.getElementById("cancelResult")
        .addEventListener("click", () => {
            document.getElementById("resultForm").remove();
        });
}


async function saveResult() {

    const home =
        document.getElementById("resultHome").value;

    const away =
        document.getElementById("resultAway").value;

    const homeScore =
        Number(document.getElementById("homeScore").value);

    const awayScore =
        Number(document.getElementById("awayScore").value);

    const date =
        document.getElementById("resultDate").value;

    if (!home || !away || !date) {

        alert("Fill all result details.");

        return;
    }

    if (home === away) {

        alert("Teams cannot be the same.");

        return;
    }

    try {

        await addDoc(collection(db, "results"), {
            homeTeam: home,
            awayTeam: away,
            homeScore,
            awayScore,
            date
        });

        alert("✅ Result saved!");

        await showResults();

    } catch (error) {

        alert("❌ " + error.message);

    }
}


/* =========================
   TOP SCORERS
========================= */

async function showScorers() {

    content.innerHTML = `
        <div class="card">

            <h3>⚽ Top Scorers</h3>

            <button id="addScorer">
                ➕ Add Scorer
            </button>

            <button id="refreshScorers">
                🔄 Refresh
            </button>

            <div id="scorersList">
                Loading scorers...
            </div>

        </div>
    `;

    document.getElementById("addScorer")
        .addEventListener("click", showScorerForm);

    document.getElementById("refreshScorers")
        .addEventListener("click", loadScorers);

    await loadScorers();
}


async function loadScorers() {

    const list = document.getElementById("scorersList");

    if (!list) return;

    const snapshot =
        await getDocs(collection(db, "scorers"));

    if (snapshot.empty) {

        list.innerHTML = "<p>No scorers found.</p>";

        return;
    }

    list.innerHTML = "";

    snapshot.forEach(scorerDoc => {

        const s = scorerDoc.data();

        list.innerHTML += `
            <div class="card">

                <h3>⚽ ${s.name || "-"}</h3>

                <p>Team: ${s.team || "-"}</p>

                <p>Goals: ${s.goals || 0}</p>

                <button
                    class="deleteScorer"
                    data-id="${scorerDoc.id}">
                    🗑️ Delete
                </button>

            </div>
        `;
    });

    document
        .querySelectorAll(".deleteScorer")
        .forEach(button => {

            button.addEventListener("click", async () => {

                if (!confirm("Delete scorer?")) return;

                await deleteDoc(
                    doc(db, "scorers", button.dataset.id)
                );

                await loadScorers();
            });

        });
}


function showScorerForm() {

    content.insertAdjacentHTML("afterbegin", `

        <div class="card" id="scorerForm">

            <h3>➕ Add Top Scorer</h3>

            <input id="scorerName"
                placeholder="Player Name">

            <input id="scorerTeam"
                placeholder="Team">

            <input id="scorerGoals"
                type="number"
                min="0"
                placeholder="Goals">

            <br>

            <button id="saveScorer">
                💾 Save
            </button>

            <button id="cancelScorer">
                ❌ Cancel
            </button>

        </div>
    `);

    document.getElementById("saveScorer")
        .addEventListener("click", saveScorer);

    document.getElementById("cancelScorer")
        .addEventListener("click", () => {
            document.getElementById("scorerForm").remove();
        });
}


async function saveScorer() {

    const name =
        document.getElementById("scorerName").value.trim();

    const team =
        document.getElementById("scorerTeam").value.trim();

    const goals =
        Number(document.getElementById("scorerGoals").value);

    if (!name || !team) {

        alert("Enter player name and team.");

        return;
    }

    try {

        await addDoc(collection(db, "scorers"), {
            name,
            team,
            goals
        });

        alert("✅ Scorer saved!");

        await showScorers();

    } catch (error) {

        alert("❌ " + error.message);

    }
}


/* =========================
   TEAM LOGOS
========================= */

async function showLogos() {

    content.innerHTML = `
        <div class="card">

            <h3>🖼️ Team Logos</h3>

            <p>
                Team logos can be managed from the
                Teams collection.
            </p>

            <div id="logosList">
                Loading teams...
            </div>

        </div>
    `;

    await loadLogos();
}


async function loadLogos() {

    const list =
        document.getElementById("logosList");

    if (!list) return;

    const snapshot =
        await getDocs(collection(db, "teams"));

    if (snapshot.empty) {

        list.innerHTML = "<p>No teams found.</p>";

        return;
    }

    list.innerHTML = "";

    snapshot.forEach(teamDoc => {

        const team = teamDoc.data();

        list.innerHTML += `
            <div class="card">

                <h3>${team.name || "-"}</h3>

                ${
                    team.logo
                    ? `<img src="${team.logo}"
                            style="width:80px;height:80px;object-fit:contain;">`
                    : "<p>No logo</p>"
                }

            </div>
        `;
    });
}


/* =========================
   LINEUPS
========================= */

async function showLineups() {

    content.innerHTML = `
        <div class="card">

            <h3>📋 Lineups</h3>

            <p>
                Select players from the Players collection
                when preparing a match lineup.
            </p>

            <button id="refreshLineups">
                🔄 Refresh Players
            </button>

            <div id="lineupsList">
                Loading players...
            </div>

        </div>
    `;

    document.getElementById("refreshLineups")
        .addEventListener("click", loadLineupPlayers);

    await loadLineupPlayers();
}


async function loadLineupPlayers() {

    const list =
        document.getElementById("lineupsList");

    if (!list) return;

    const snapshot =
        await getDocs(collection(db, "players"));

    if (snapshot.empty) {

        list.innerHTML = "<p>No players available.</p>";

        return;
    }

    list.innerHTML = "";

    snapshot.forEach(playerDoc => {

        const p = playerDoc.data();

        list.innerHTML += `
            <div class="card">

                <h3>
                    ${p.name || "-"}
                </h3>

                <p>
                    ${p.team || "-"} |
                    ${p.position || "-"}
                </p>

            </div>
        `;
    });
}


/* =========================
   SETTINGS
========================= */

function showSettings() {

    content.innerHTML = `
        <div class="card">

            <h3>⚙️ Settings</h3>

            <p>
                LWPL Admin Settings
            </p>

            <p>
                Firebase connection is active.
            </p>

            <button id="logoutSettings">
                🚪 Logout
            </button>

        </div>
    `;

    document
        .getElementById("logoutSettings")
        .addEventListener("click", logout);
}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem("adminLoggedIn");

    window.location.href = "login.html";
}


/* =========================
   LOGOUT BUTTON
========================= */

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        logout
    );
}


/* =========================
   START
========================= */

showDashboard();


