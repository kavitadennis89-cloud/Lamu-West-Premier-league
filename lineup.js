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
// SETTINGS
// ===============================

// Kwa sasa lineup hii ni ya Mavuno Stars
const TEAM_NAME = "Mavuno Stars";


// ===============================
// POSITION → PITCH LOCATION
// ===============================

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

    rb: {
        left: "82%",
        bottom: "25%"
    },

    rightback: {
        left: "82%",
        bottom: "25%"
    },

    cm1: {
        left: "30%",
        bottom: "42%"
    },

    cm2: {
        left: "50%",
        bottom: "45%"
    },

    cm3: {
        left: "70%",
        bottom: "42%"
    },

    cm: {
        left: "50%",
        bottom: "43%"
    },

    lm: {
        left: "30%",
        bottom: "43%"
    },

    rm: {
        left: "70%",
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

    st: {
        left: "50%",
        bottom: "70%"
    },

    striker: {
        left: "50%",
        bottom: "70%"
    },

    cf: {
        left: "50%",
        bottom: "68%"
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


// ===============================
// NORMALIZE POSITION
// ===============================

function normalizePosition(position) {

    if (!position) {
        return "";
    }

    return position
        .toString()
        .trim()
        .toLowerCase()
        .replace(/-/g, "")
        .replace(/\s+/g, "");
}


// ===============================
// CREATE PLAYER ON PITCH
// ===============================

function createPlayer(player, positionData) {

    const div = document.createElement("div");

    div.className = "player";

    div.style.left = positionData.left;
    div.style.bottom = positionData.bottom;

    const number = player.number || "?";

    div.innerHTML = `
        <span>${number}</span>
        <span class="player-name">
            ${player.name || "Player"}
            ${player.captain ? " ©" : ""}
        </span>
    `;

    if (player.captain) {
        div.classList.add("captain");
    }

    return div;
}


// ===============================
// LOAD PLAYERS
// ===============================

async function loadPlayers() {

    try {

        console.log("Loading players...");

        const snapshot = await getDocs(
            collection(db, "players")
        );

        console.log(
            "Players found:",
            snapshot.size
        );


        // ===============================
        // CONVERT FIREBASE DATA
        // ===============================

        const allPlayers = [];

        snapshot.forEach((doc) => {

            const player = {
                id: doc.id,
                ...doc.data()
            };

            allPlayers.push(player);

            console.log(
                "Player:",
                player
            );

        });


        // ===============================
        // FILTER TEAM
        // ===============================

        const teamPlayers = allPlayers.filter(player => {

            if (!player.team) {
                return false;
            }

            return player.team
                .toString()
                .trim()
                .toLowerCase()
                .includes(
                    TEAM_NAME.toLowerCase().replace(" stars", "")
                );

        });


        console.log(
            "Players for",
            TEAM_NAME,
            ":",
            teamPlayers.length
        );


        // ===============================
        // STARTING XI
        // ===============================

        const startingPlayers = teamPlayers.filter(
            player => player.starting === true
        );


        // ===============================
        // SUBSTITUTES
        // ===============================

        const substitutes = teamPlayers.filter(
            player => player.starting !== true
        );


        console.log(
            "Starting XI:",
            startingPlayers
        );

        console.log(
            "Substitutes:",
            substitutes
        );


        // ===============================
        // PITCH
        // ===============================

        const pitch = document.querySelector(".pitch");

        if (!pitch) {
            console.error("Pitch not found");
            return;
        }


        // Remove old hard-coded players

        pitch.querySelectorAll(".player").forEach(
            player => player.remove()
        );


        // ===============================
        // PLACE STARTING PLAYERS
        // ===============================

        const usedPositions = {};

        startingPlayers.forEach(player => {

            const normalized = normalizePosition(
                player.position
            );

            let positionData = positions[normalized];


            // ===============================
            // FALLBACK POSITION
            // ===============================

            if (!positionData) {

                console.warn(
                    "Unknown position:",
                    player.position,
                    player.name
                );

                return;
            }


            // ===============================
            // HANDLE
