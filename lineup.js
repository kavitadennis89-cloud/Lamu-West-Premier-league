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
// MATCH TEAMS
// ======================================================

const HOME_TEAM = "Mavuno Stars";
const AWAY_TEAM = "Opponent";


// ======================================================
// HELPERS
// ======================================================

function normalize(value) {
  if (!value) return "";

  return value
    .toString()
    .trim()
    .toLowerCase();
}


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
// POSITION NORMALIZER
// ======================================================

function getPosition(player) {

  const position = normalize(player.position);

  if (
    position.includes("goal") ||
    position === "gk" ||
    position.includes("keeper")
  ) {
    return "GK";
  }

  if (
    position.includes("def") ||
    position === "cb" ||
    position === "lb" ||
    position === "rb" ||
    position.includes("back")
  ) {
    return "DEF";
  }

  if (
    position.includes("mid") ||
    position === "cm" ||
    position === "dm" ||
    position === "am"
  ) {
    return "MID";
  }

  if (
    position.includes("att") ||
    position.includes("forward") ||
    position.includes("striker") ||
    position === "st" ||
    position === "cf" ||
    position.includes("wing")
  ) {
    return "ATT";
  }

  return "MID";
}


// ======================================================
// 4-3-3 PITCH POSITIONS
// ======================================================

const positions = {

  GK: [
    { left: "50%", bottom: "7%" }
  ],

  DEF: [
    { left: "16%", bottom: "25%" },
    { left: "38%", bottom: "21%" },
    { left: "62%", bottom: "21%" },
    { left: "84%", bottom: "25%" }
  ],

  MID: [
    { left: "28%", bottom: "43%" },
    { left: "50%", bottom: "46%" },
    { left: "72%", bottom: "43%" }
  ],

  ATT: [
    { left: "18%", bottom: "67%" },
    { left: "50%", bottom: "72%" },
    { left: "82%", bottom: "67%" }
  ]

};


// ======================================================
// CREATE PLAYER CARD
// ======================================================

function createPlayer(player, position) {

  const card = document.createElement("div");

  card.className = "player-card";

  card.style.left = position.left;
  card.style.bottom = position.bottom;


  const number =
    player.number ??
    player.jerseyNumber ??
    "—";


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
// SORT PLAYERS INTO 4-3-3
// ======================================================

function organizePlayers(players) {

  const groups = {
    GK: [],
    DEF: [],
    MID: [],
    ATT: []
  };


  players.forEach(player => {

    const position = getPosition(player);

    groups[position].push(player);

  });


  return groups;
}


// ======================================================
// RENDER PITCH
// ======================================================

function renderPitch(players) {

  const pitch =
    document.querySelector(".pitch");

  const layer =
    document.getElementById("homeLineup");


  if (!pitch || !layer) {
    console.error("Pitch elements not found.");
    return;
  }


  layer.innerHTML = "";


  const groups =
    organizePlayers(players);


  Object.keys(groups).forEach(positionType => {

    const group =
      groups[positionType];

    const availablePositions =
      positions[positionType];


    group
      .slice(0, availablePositions.length)
      .forEach((player, index) => {

        const card =
          createPlayer(
            player,
            availablePositions[index]
          );


        layer.appendChild(card);

      });

  });


  console.log(
    "Players placed on pitch:",
    players.length
  );

}


// ======================================================
// RENDER AWAY SECTION
// ======================================================

function renderAwayTeam() {

  const title =
    document.getElementById("awayTitle");

  const container =
    document.getElementById("awayLineup");


  if (title) {
    title.textContent = AWAY_TEAM;
  }


  if (container) {

    container.innerHTML = `
      <div class="away-player">
        Away lineup will be added here.
      </div>
    `;

  }

}


// ======================================================
// RENDER SUBSTITUTES
// ======================================================

function renderSubstitutes(players) {

  const container =
    document.getElementById("substitutesList");


  if (!container) return;


  container.innerHTML = "";


  if (players.length === 0) {

    container.innerHTML =
      `<div class="sub-player">
        No substitutes available.
      </div>`;

    return;
  }


  players.forEach(player => {

    const number =
      player.number ??
      player.jerseyNumber ??
      "—";


    const name =
      player.name ||
      player.playerName ||
      "Player";


    const div =
      document.createElement("div");


    div.className = "sub-player";


    div.innerHTML = `
      <strong>#${number}</strong><br>
      ${name}
    `;


    container.appendChild(div);

  });

}


// ======================================================
// UPDATE MATCH HEADER
// ======================================================

function updateHeader() {

  const home =
    document.getElementById("homeTeam");

  const away =
    document.getElementById("awayTeam");


  if (home) {
    home.textContent = HOME_TEAM;
  }


  if (away) {
    away.textContent = AWAY_TEAM;
  }

}


// ======================================================
// LOAD PLAYERS FROM FIRESTORE
// ======================================================

async function loadPlayers() {

  try {

    console.log("Loading LWPL players...");


    const snapshot =
      await getDocs(
        collection(db, "players")
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
    // GET MAVUNO STARS PLAYERS
    // ----------------------------------------------

    const teamPlayers =
      players.filter(player =>
        belongsToTeam(
          player,
          HOME_TEAM
        )
      );


    console.log(
      "MAVUNO STARS PLAYERS:",
      teamPlayers.length
    );


    // ----------------------------------------------
    // STARTING XI
    // ----------------------------------------------

    let starting =
      teamPlayers.filter(player =>

        player.starting === true ||
        player.starting === "true" ||
        player.isStarting === true ||
        player.lineup === true

      );


    // If starting has not been selected,
    // use first 11 players.

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
        starting.map(player => player.id)
      );


    const substitutes =
      teamPlayers.filter(player =>
        !startingIds.has(player.id)
      );


    // ----------------------------------------------
    // UPDATE PAGE
    // ----------------------------------------------

    updateHeader();

    renderPitch(starting);

    renderSubstitutes(substitutes);

    renderAwayTeam();


    console.log(
      "STARTING XI:",
      starting
    );


    console.log(
      "SUBSTITUTES:",
      substitutes
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
