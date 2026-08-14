import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ======================================================
// FIREBASE CONFIG
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


// ======================================================
// INITIALIZE FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ======================================================
// CURRENT TEAM
// ======================================================

const TEAM_NAME = "Mavuno Stars";


// ======================================================
// POSITION LOCATIONS ON PITCH
// ======================================================

const positions = {

    goalkeeper: {
        left: "50%",
        bottom: "7%"
    },

    gk: {
        left: "50%",
        bottom: "7%"
    },


    lb: {
        left: "18%",
        bottom: "25%"
    },

    leftback: {
        left: "18%",
        bottom: "25%"
    },


    cb1: {
        left: "40%",
        bottom: "22%"
    },

    cb2: {
        left: "60%",
        bottom: "22%"
    },

    cb: {
        left: "50%",
        bottom: "22%"
    },

    centreback: {
        left: "50%",
        bottom: "22%"
    },


    rb: {
        left: "82%",
        bottom: "25%"
    },

    rightback: {
        left: "82%",
        bottom: "25%"
    },


    lm: {
        left: "20%",
        bottom: "43%"
    },

    leftmidfield: {
        left: "20%",
        bottom: "43%"
    },


    cm1: {
        left: "30%",
        bottom: "43%"
    },

    cm2: {
        left: "50%",
        bottom: "46%"
    },

    cm3: {
        left: "70%",
        bottom: "43%"
    },

    cm: {
        left: "50%",
        bottom: "44%"
    },

    centralmidfielder: {
        left: "50%",
        bottom: "44%"
    },


    rm: {
        left: "80%",
        bottom: "43%"
    },

    rightmidfield: {
        left: "80%",
        bottom: "43%"
    },


    lw: {
        left: "20%",
        bottom: "65%"
    },

    leftwing: {
        left: "20%",
        bottom: "65%"
    },


    cf: {
        left: "50%",
        bottom: "67%"
    },

    centreforward: {
        left: "50%",
        bottom: "67%"
    },


    st: {
        left: "50%",
        bottom: "72%"
    },

    striker: {
        left: "50%",
        bottom: "72%"
    },


    rw: {
        left: "80%",
        bottom: "65%"
    },

    rightwing: {
        left: "80%",
        bottom: "65%"
    }

};


// ======================================================
// NORMALIZE POSITION
// ======================================================

function normalizePosition(position) {

    if (!position) {
        return "";
    }

    return position
        .toString()
        .trim()
        .toLowerCase()
        .replace(/-/g, "")
        .replace(/_/g, "")
        .replace(/\s+/g, "");
}


// ======================================================
// GET POSITION
// ======================================================

function getPlayerPosition(player, index) {

    const normalized = normalizePosition(
        player.position
    );

    if (positions[normalized]) {
        return positions[normalized];
    }


    // Fallback positions if Firebase position
    // does not match our position list.

    const fallback = [

        {
            left: "50%",
            bottom: "7%"
        },

        {
            left: "18%",
            bottom: "25%"
        },

        {
            left: "40%",
            bottom: "22%"
        },

        {
            left: "60%",
            bottom: "22%"
        },

        {
            left: "82%",
            bottom: "25%"
        },

        {
            left: "30%",
            bottom: "43%"
        },

        {
            left: "50%",
            bottom: "45%"
        },

        {
            left: "70%",
            bottom: "43%"
        },

        {
            left: "20%",
            bottom: "65%"
        },

        {
            left: "50%",
            bottom: "72%"
        },

        {
            left: "80%",
            bottom: "65%"
        }

    ];


    return fallback[index] || {
        left: "50%",
        bottom: "50%"
    };
}


// ======================================================
// CREATE PLAYER CARD
// ======================================================

function createPlayer(player, positionData) {

    const div = document.createElement("div");

    div.className = "player";


    // Position on pitch

    div.style.left = positionData.left;
    div.style.bottom = positionData.bottom;


    // Player number

    const number =
        player.number ??
        player.jerseyNumber ??
        "?";


    // Player name

    const name =
        player.name ||
        player.playerName ||
        "Player";


    // Captain

    const captain =
        player.captain === true;


    div.innerHTML = `

        <span class="player-number">
            ${number}
        </span>

        <span class="player-name">
            ${name}
            ${captain ? " ©" : ""}
        </span>

    `;


    if (captain) {
        div.classList.add("captain");
    }


    return div;
}


// ======================================================
// CREATE SUBSTITUTE CARD
// ======================================================

function createSubstitute(player, index) {

    const div = document.createElement("div");

    div.className =
        "substitute-player";


    const number =
        player.number ??
        player.jerseyNumber ??
        (index + 12);


    const name =
        player.name ||
        player.playerName ||
        "Substitute";


    div.innerHTML = `

        <span class="sub-number">
            ${number}
        </span>

        <span class="sub-name">
            ${name}
        </span>

    `;


    return div;
}


// ======================================================
// FILTER TEAM
// ======================================================

function belongsToTeam(player, teamName) {

    if (!player.team) {
        return false;
    }


    const firebaseTeam =
        player.team
            .toString()
            .trim()
            .toLowerCase();


    const wantedTeam =
        teamName
            .toString()
            .trim()
            .toLowerCase();


    return (
        firebaseTeam === wantedTeam ||
        firebaseTeam.includes(wantedTeam) ||
        wantedTeam.includes(firebaseTeam)
    );
}


// ======================================================
// UPDATE TEAM NAME
// ======================================================

function updateTeamName(teamName) {

    const homeTeam =
        document.getElementById("homeTeam");

    const homeLineupName =
        document.getElementById("homeLineupName");

    const homeSubsTitle =
        document.getElementById("homeSubsTitle");


    if (homeTeam) {
        homeTeam.textContent = teamName;
    }


    if (homeLineupName) {
        homeLineupName.textContent = teamName;
    }


    if (homeSubsTitle) {
        homeSubsTitle.textContent = teamName;
    }

}


// ======================================================
// RENDER STARTING XI LIST
// ======================================================

function renderStartingList(players) {

    const container =
        document.getElementById("homePlayers");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (players.length === 0) {

        container.innerHTML = `

            <div class="player-list-empty">
                No starting lineup available.
            </div>

        `;

        return;
    }


    players.forEach((player, index) => {

        const row =
            document.createElement("div");


        row.className =
            "player";


        const number =
            player.number ??
            player.jerseyNumber ??
            index + 1;


        const name =
            player.name ||
            player.playerName ||
            "Player";


        const position =
            player.position ||
            "";


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
// RENDER SUBSTITUTES LIST
// ======================================================

function renderSubstitutes(players) {

    const container =
        document.getElementById("homeSubstitutes");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (players.length === 0) {

        container.innerHTML = `

            <div class="substitute-player">

                <span class="sub-number">
                    -
                </span>

                <span class="sub-name">
                    No substitutes
                </span>

            </div>

        `;

        return;
    }


    players.forEach((player, index) => {

        container.appendChild(
            createSubstitute(
                player,
                index
            )
        );

    });

}


// ======================================================
// LOAD PLAYERS
// ======================================================

async function loadPlayers() {

    try {

        console.log(
            "Loading players from Firebase..."
        );


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "players"
                )
            );


        console.log(
            "Players found:",
            snapshot.size
        );


        const allPlayers = [];


        snapshot.forEach((doc) => {

            const player = {

                id: doc.id,

                ...doc.data()

            };


            allPlayers.push(player);


            console.log(
                "Firebase player:",
                player
            );

        });


        // ==================================================
        // FILTER MAVUNO STARS
        // ==================================================

        const teamPlayers =
            allPlayers.filter(
                player =>
                    belongsToTeam(
                        player,
                        TEAM_NAME
                    )
            );


        console.log(
            "Players for",
            TEAM_NAME,
            ":",
            teamPlayers.length
        );


        // ==================================================
        // STARTING XI
        // ==================================================

        const startingPlayers =
            teamPlayers.filter(
               
