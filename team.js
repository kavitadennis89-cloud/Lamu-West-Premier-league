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
  messagingSenderId: "280853181931",
  appId: "1:280853181931:web:8c411d3528bddadd2d15ae"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/* =========================
   GET TEAM FROM URL
========================= */

const params = new URLSearchParams(
  window.location.search
);

const teamName = params.get("team");


/* =========================
   LOAD TEAM
========================= */

async function loadTeam() {

  const nameElement =
    document.getElementById("teamName");


  if (!teamName) {

    nameElement.textContent =
      "Team not selected";

    return;
  }


  try {

    const snapshot =
      await getDocs(
        collection(db, "teams")
      );


    let teamFound = null;


    snapshot.forEach(teamDoc => {

      const data = teamDoc.data();


      if (data.name === teamName) {

        teamFound = data;

      }

    });


    if (!teamFound) {

      nameElement.textContent =
        "Team not found";

      return;
    }


    /* =========================
       TEAM NAME
    ========================= */

    nameElement.textContent =
      teamFound.name || "Unknown Team";


    /* =========================
       STATISTICS
    ========================= */

    document.getElementById("played").textContent =
      Number(teamFound.played || 0);


    document.getElementById("won").textContent =
      Number(
        teamFound.won ||
        teamFound.wins ||
        0
      );


    document.getElementById("draw").textContent =
      Number(
        teamFound.draw ||
        teamFound.draws ||
        0
      );


    document.getElementById("lost").textContent =
      Number(
        teamFound.lost ||
        teamFound.losses ||
        0
      );


    /* =========================
       GOALS
    ========================= */

    const goalsFor =
      Number(teamFound.goalsFor || 0);


    const goalsAgainst =
      Number(teamFound.goalsAgainst || 0);


    document.getElementById("goalsFor").textContent =
      goalsFor;


    document.getElementById("goalsAgainst").textContent =
      goalsAgainst;


    document.getElementById("goalDifference").textContent =
      goalsFor - goalsAgainst;


    document.getElementById("points").textContent =
      Number(teamFound.points || 0);


    /* =========================
       LOAD SQUAD
    ========================= */

    await loadPlayers(teamFound.name);

  }

  catch (error) {

    console.error(
      "Error loading team:",
      error
    );


    nameElement.textContent =
      "Error loading team";

  }

}


/* =========================
   LOAD PLAYERS
========================= */

async function loadPlayers(team) {

  const playersList =
    document.getElementById("playersList");


  if (!playersList) return;


  try {

    const snapshot =
      await getDocs(
        collection(db, "players")
      );


    const players = [];


    snapshot.forEach(playerDoc => {

      const player =
        playerDoc.data();


      if (player.team === team) {

        players.push(player);

      }

    });


    /* =========================
       NO PLAYERS
    ========================= */

    if (players.length === 0) {

      playersList.innerHTML = `

        <p class="no-players">

          👤 No players registered
          for this team yet.

        </p>

      `;

      return;

    }


    /* =========================
       SORT BY JERSEY NUMBER
    ========================= */

    players.sort(
      (a, b) =>
        Number(a.number || 999) -
        Number(b.number || 999)
    );


    /* =========================
       STARTING XI
    ========================= */

    const startingPlayers =
      players.filter(
        player => player.starting === true
      );


    /* =========================
       SUBSTITUTES
    ========================= */

    const substitutePlayers =
      players.filter(
        player => player.starting !== true
      );


    let html = "";


    /* =========================
       STARTING XI TITLE
    ========================= */

    if (startingPlayers.length > 0) {

      html += `

        <div style="
          grid-column: 1 / -1;
          margin-bottom: 5px;
        ">

          <h3 style="
            color:#075e3d;
            margin-bottom:10px;
          ">

            ⭐ Starting XI

          </h3>

        </div>

      `;


      startingPlayers.forEach(player => {

        html += createPlayerCard(
          player,
          true
        );

      });

    }


    /* =========================
       SUBSTITUTE TITLE
    ========================= */

    if (substitutePlayers.length > 0) {

      html += `

        <div style="
          grid-column: 1 / -1;
          margin-top:20px;
          margin-bottom:5px;
        ">

          <h3 style="
            color:#075e3d;
            margin-bottom:10px;
          ">

            🔄 Substitutes

          </h3>

        </div>

      `;


      substitutePlayers.forEach(player => {

        html += createPlayerCard(
          player,
          false
        );

      });

    }


    playersList.innerHTML =
      html;

  }

  catch (error) {

    console.error(
      "Error loading players:",
      error
    );


    playersList.innerHTML = `

      <p class="no-players">

        ❌ Unable to load players.

      </p>

    `;

  }

}


/* =========================
   PLAYER CARD
========================= */

function createPlayerCard(
  player,
  isStarting
) {

  let status = "";


  /* =========================
     CAPTAIN
  ========================= */

  if (player.captain) {

    status += `

      <span class="captain-badge">

        👑 Captain

      </span>

    `;

  }


  /* =========================
     STARTING / SUBSTITUTE
  ========================= */

  if (isStarting) {

    if (status) {

      status += "<br>";

    }


    status += `

      <span class="starting-badge">

        ⭐ Starting XI

      </span>

    `;

  }

  else {

    if (status) {

      status += "<br>";

    }


    status += `

      <span class="substitute-badge">

        🔄 Substitute

      </span>

    `;

  }


  /* =========================
     PLAYER CARD HTML
  ========================= */

  return `

    <div class="player-card">

      <div class="player-number">

        ${player.number || "-"}

      </div>


      <div class="player-info">

        <h4>

          ${player.name || "Unknown Player"}

        </h4>


        <p>

          ${player.position || "Player"}

        </p>


        <div class="player-status">

          ${status}

        </div>

      </div>

    </div>

  `;

}


/* =========================
   START TEAM PAGE
========================= */

loadTeam();
