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


const params =
  new URLSearchParams(
    window.location.search
  );


const teamName =
  params.get("team");


/* ==========================
   LOAD TEAM
========================== */

async function loadTeam() {

  const nameElement =
    document.getElementById(
      "teamName"
    );


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

      const data =
        teamDoc.data();


      if (
        data.name === teamName
      ) {

        teamFound = data;

      }

    });


    if (!teamFound) {

      nameElement.textContent =
        "Team not found";

      return;

    }


    /* TEAM NAME */

    nameElement.textContent =
      teamFound.name ||
      "Unknown Team";


    /* STATISTICS */

    document.getElementById(
      "played"
    ).textContent =
      Number(
        teamFound.played || 0
      );


    document.getElementById(
      "won"
    ).textContent =
      Number(
        teamFound.won ||
        teamFound.wins ||
        0
      );


    document.getElementById(
      "draw"
    ).textContent =
      Number(
        teamFound.draw ||
        teamFound.draws ||
        0
      );


    document.getElementById(
      "lost"
    ).textContent =
      Number(
        teamFound.lost ||
        teamFound.losses ||
        0
      );


    /* GOALS */

    const goalsFor =
      Number(
        teamFound.goalsFor || 0
      );


    const goalsAgainst =
      Number(
        teamFound.goalsAgainst || 0
      );


    document.getElementById(
      "goalsFor"
    ).textContent =
      goalsFor;


    document.getElementById(
      "goalsAgainst"
    ).textContent =
      goalsAgainst;


    document.getElementById(
      "goalDifference"
    ).textContent =
      goalsFor - goalsAgainst;


    document.getElementById(
      "points"
    ).textContent =
      Number(
        teamFound.points || 0
      );


    /* LOAD PLAYERS */

    await loadPlayers(teamFound.name);

  }

  catch(error) {

    console.error(
      "Error loading team:",
      error
    );


    nameElement.textContent =
      "Error loading team";

  }

}


/* ==========================
   LOAD PLAYERS
========================== */

async function loadPlayers(team) {

  const playersList =
    document.getElementById(
      "playersList"
    );


  try {

    const snapshot =
      await getDocs(
        collection(db, "players")
      );


    const players = [];


    snapshot.forEach(playerDoc => {

      const player =
        playerDoc.data();


      if (
        player.team === team
      ) {

        players.push(player);

      }

    });


    if (players.length === 0) {

      playersList.innerHTML = `

        <p class="no-players">
          👤 No players registered
          for this team yet.
        </p>

      `;

      return;

    }


    players.sort(
      (a, b) =>
        Number(a.number || 999) -
        Number(b.number || 999)
    );


    let html = `

      <table>

        <tr>

          <th>No.</th>

          <th>Player</th>

          <th>Position</th>

          <th>Status</th>

        </tr>

    `;


    players.forEach(player => {

      let status = "";


      if (player.captain) {

        status +=
          `<span class="captain">
             ©️ Captain
           </span>`;

      }


      if (player.starting) {

        if (status) {
          status += "<br>";
        }

        status +=
          `<span class="starting">
             ⭐ Starting XI
           </span>`;

      }


      if (!status) {

        status =
          "🔄 Substitute";

      }


      html += `

        <tr>

          <td>

            <span class="player-number">

              ${player.number || "-"}

            </span>

          </td>

          <td>
            ${player.name || "Unknown"}
          </td>

          <td>
            ${player.position || "-"}
          </td>

          <td>
            ${status}
          </td>

        </tr>

      `;

    });


    html += `

      </table>

    `;


    playersList.innerHTML =
      html;

  }

  catch(error) {

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


/* ==========================
   START
========================== */

loadTeam();
