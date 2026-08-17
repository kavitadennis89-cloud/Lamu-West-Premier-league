import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ======================================================
// FIREBASE
// ======================================================

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


// ======================================================
// TEAMS
// ======================================================

const HOME_TEAM = "Mavuno Stars";
const AWAY_TEAM = "Opponent";


// ======================================================
// PLAYER POSITIONS - 4-3-3
// ======================================================

const formationPositions = [

    // GK
    { left: "50%", bottom: "7%" },

    // DEFENCE
    { left: "16%", bottom: "25%" },
    { left: "38%", bottom: "21%" },
    { left: "62%", bottom: "21%" },
    { left: "84%", bottom: "25%" },

    // MIDFIELD
    { left: "28%", bottom: "43%" },
    { left: "50%", bottom: "46%" },
    { left: "72%", bottom: "43%" },

    // ATTACK
    { left: "18%", bottom: "67%" },
    { left: "50%", bottom: "72%" },
    { left: "82%", bottom: "67%" }
];


// ======================================================
// NORMALIZE
// ======================================================

function normalize(value) {

    if (!value) return "";

    return value
        .toString()
        .trim()
        .toLowerCase();
}


// ======================================================
// TEAM MATCH
// ======================================================

function belongsToTeam(player, teamName) {

    if (!player.team) return false;

    const playerTeam = normalize(player.team);
    const wantedTeam = normalize(teamName);

    return (
        playerTeam === wantedTeam ||
        playerTeam.includes(wantedTeam) ||
        wantedTeam.includes(playerTeam)
    );
}


// ======================================================
// CREATE PLAYER
// ======================================================

function createPlayer(player, index) {

    const card = document.createElement("div");

    card.className = "player";

    const position =
        formationPositions[index] || {
            left: "50%",
            bottom: "50%"
        };

    card.style.left = position.left;
    card.style.bottom = position.bottom;


    const number =
        player.number ??
        player.jerseyNumber ??
        (index + 1);


    const name =
        player.name ||
        player.playerName ||
        "Player";


    const isCaptain =
        player.captain === true ||
        player.captain === "true";


    card.innerHTML = `
        <div class="player-number">
            ${number}
        </div>

        <div class="player-name">
            ${isCaptain ? "© " : ""}
            ${name}
        </div>
    `;


    if (isCaptain) {
        card.classList.add("captain");
    }


    return card;
}


// ======================================================
// RENDER PITCH
// ======================================================

function renderPitch(players) {

    const pitch =
        document.querySelector(".pitch");

    if (!pitch) {
        console.error("PITCH NOT FOUND");
        return;
    }


    pitch
        .querySelectorAll(".player")
        .forEach(player => player.remove());


    players
        .slice(0, 11)
        .forEach((player, index) => {

            const card =
                createPlayer(
                    player,
                    index
                );

            pitch.appendChild(card);

        });


    console.log(
        "Players rendered:",
        players.length
    );
}


// ======================================================
// STARTING XI LIST
// ======================================================

function renderStartingList(players) {

    const container =
        document.getElementById("homePlayers");

    if (!container) return;

    container.innerHTML = "";


    if (players.length === 0) {

        container.innerHTML =
            "<p>No starting lineup available.</p>";

        return;
    }


    players.forEach((player, index) => {

        const row =
            document.createElement("div");

        row.className =
            "player-list-row";


        const number =
            player.number ??
            player.jerseyNumber ??
            (index + 1);


        const name =
            player.name ||
            player.playerName ||
            "Player";


        const position =
            player.position || "";


        row.innerHTML = `
            <div class="player-number">
                ${number}
            </div>

            <div class="player-info">

                <span class="player-name">
                    ${name}
                </span>

                <span class="player-position">
                    ${position}
                </span>

            </div>
        `;


        container.appendChild(row);

    });
}


// ======================================================
// SUBSTITUTES
// ======================================================

function renderSubstitutes(players) {

    const container =
        document.getElementById("homeSubstitutes");

    if (!container) return;

    container.innerHTML = "";


    if (players.length === 0) {

        container.innerHTML =
            "<p>No substitutes available.</p>";

        return;
    }


    players.forEach((player, index) => {

        const row =
            document.createElement("div");

        row.className =
            "substitute-player";


        const number =
            player.number ??
            player.jerseyNumber ??
            (index + 12);


        const name =
            player.name ||
            player.playerName ||
            "Player";


        row.innerHTML = `
            <span class="sub-number">
                ${number}
            </span>

            <span class="sub-name">
                ${name}
            </span>
        `;


        container.appendChild(row);

    });
}


// ======================================================
// UPDATE TEAM
// ======================================================

function updateTeam(teamName) {

    const ids = [
        "homeTeam",
        "homeLineupName",
        "homeSubsTitle"
    ];

    ids.forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent =
                teamName;
        }

    });
}


// ======================================================
// LOAD FIREBASE PLAYERS
// ======================================================

async function loadPlayers() {

    try {

        console.log(
            "Loading LWPL players..."
        );


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "players"
                )
            );


        const players = [];


        snapshot.forEach(doc => {

            players.push({
                id: doc.id,
                ...doc.data()
            });

        });


        console.log(
            "TOTAL PLAYERS:",
            players.length
        );


        // ----------------------------------------------
        // MAVUNO STARS
        // ----------------------------------------------

        const teamPlayers =
            players.filter(
                player =>
                    belongsToTeam(
                        player,
                        HOME_TEAM
                    )
            );


        console.log(
            "MAVUNO PLAYERS:",
            teamPlayers.length
        );


        // ----------------------------------------------
        // STARTING XI
        // ----------------------------------------------

        let starting =
            teamPlayers.filter(
                player =>
                    player.starting === true ||
                    player.starting === "true" ||
                    player.isStarting === true ||
                    player.lineup === true
            );


        // If no starting flag,
        // use first 11 players

        if (
            starting.length === 0 &&
            teamPlayers.length > 0
        ) {

            starting =
                teamPlayers.slice(0, 11);

        }


        starting =
            starting.slice(0, 11);


        // ----------------------------------------------
        // SUBSTITUTES
        // ----------------------------------------------

        const startingIds =
            new Set(
                starting.map(
                    player => player.id
                )
            );


        const substitutes =
            teamPlayers.filter(
                player =>
                    !startingIds.has(
                        player.id
                    )
            );


        // ----------------------------------------------
        // UPDATE
        // ----------------------------------------------

        updateTeam(HOME_TEAM);

        renderPitch(starting);

        renderStartingList(starting);

        renderSubstitutes(substitutes);


        console.log(
            "STARTING XI:",
            starting
        );


    } catch (error) {

        console.error(
            "LINEUP ERROR:",
            error
        );

        const pitch =
            document.querySelector(".pitch");

        if (pitch) {

            const errorBox =
                document.createElement("div");

            errorBox.className =
                "lineup-error";

            errorBox.textContent =
                "Unable to load players.";

            pitch.appendChild(
                errorBox
            );

        }

    }

}


// ======================================================
// START
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    loadPlayers
);
