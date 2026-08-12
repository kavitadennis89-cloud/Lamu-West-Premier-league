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


// ==========================================
// FIREBASE
// ==========================================

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


// ==========================================
// ERROR DISPLAY
// ==========================================

function showError(message) {

  const box = document.getElementById("adminError");

  if (box) {

    box.innerHTML = `
      <div style="
        background:#ffe5e5;
        color:#900;
        padding:15px;
        margin:15px 0;
        border:2px solid #c00;
        border-radius:8px;
      ">
        <strong>Admin Error:</strong>
        <br>
        ${message}
      </div>
    `;

  }

  console.error("ADMIN ERROR:", message);

}


// ==========================================
// GET TEAMS
// ==========================================

async function getTeams() {

  const snapshot = await getDocs(
    collection(db, "teams")
  );

  const teams = [];

  snapshot.forEach((item) => {

    const data = item.data();

    teams.push({
      id: item.id,
      name: data.name || "Unknown Team"
    });

  });

  return teams;
}


// ==========================================
// LOAD TEAMS
// ==========================================

async function loadTeams() {

  const list = document.getElementById("teamsList");

  if (!list) return;

  list.innerHTML = "<p>Loading teams...</p>";

  try {

    const teams = await getTeams();

    if (teams.length === 0) {

      list.innerHTML = "<p>No teams found.</p>";
      return;

    }

    list.innerHTML = "";

    teams.forEach((team) => {

      list.innerHTML += `
        <div style="
          margin-bottom:15px;
          padding:12px;
          border:1px solid #ddd;
          border-radius:8px;
        ">

          <strong>⚽ ${team.name}</strong>

          <br><br>

          <button onclick="deleteTeam('${team.id}')">
            🗑️ Delete Team
          </button>

        </div>
      `;

    });

  } catch (error) {

    list.innerHTML =
      "<p>Unable to load teams.</p>";

    showError(
      "Teams: " + error.message
    );

  }

}


// ==========================================
// DELETE TEAM
// ==========================================

window.deleteTeam = async function(teamId) {

  try {

    const teams = await getTeams();

    const team = teams.find(
      (item) => item.id === teamId
    );

    if (!team) {

      alert("Team not found.");
      return;

    }

    const confirmDelete = confirm(
      "Delete " +
      team.name +
      "?\n\nThis cannot be undone."
    );

    if (!confirmDelete) return;

    await deleteDoc(
      doc(db, "teams", teamId)
    );

    alert(
      team.name +
      " deleted successfully! 🗑️"
    );

    await refreshAll();

  } catch (error) {

    showError(
      "Delete Team: " +
      error.message
    );

  }

};


// ==========================================
// LOAD PLAYER TEAMS
// ==========================================

async function loadPlayerTeams() {

  const select =
    document.getElementById("playerTeam");

  if (!select) return;

  try {

    const teams = await getTeams();

    select.innerHTML =
      '<option value="">Select Team</option>';

    teams.forEach((team) => {

      select.innerHTML += `
        <option value="${team.name}">
          ${team.name}
        </option>
      `;

    });

  } catch (error) {

    showError(
      "Player team dropdown: " +
      error.message
    );

  }

}


// ==========================================
// LOAD FIXTURE TEAMS
// ==========================================

async function loadFixtureTeams() {

  const home =
    document.getElementById("fixtureHome");

  const away =
    document.getElementById("fixtureAway");

  if (!home || !away) return;

  try {

    const teams = await getTeams();

    home.innerHTML =
      '<option value="">Select Home Team</option>';

    away.innerHTML =
      '<option value="">Select Away Team</option>';

    teams.forEach((team) => {

      home.innerHTML += `
        <option value="${team.name}">
          ${team.name}
        </option>
      `;

      away.innerHTML += `
        <option value="${team.name}">
          ${team.name}
        </option>
      `;

    });

  } catch (error) {

    showError(
      "Fixture teams: " +
      error.message
    );

  }

}


// ==========================================
// LOAD SCORER TEAMS
// ==========================================

async function loadScorerTeams() {

  const select =
    document.getElementById("scorerTeam");

  if (!select) return;

  try {

    const teams = await getTeams();

    select.innerHTML =
      '<option value="">Select Team</option>';

    teams.forEach((team) => {

      select.innerHTML += `
        <option value="${team.name}">
          ${team.name}
        </option>
      `;

    });

  } catch (error) {

    showError(
      "Scorer teams: " +
      error.message
    );

  }

}


// ==========================================
// ADD TEAM
// ==========================================

const teamForm =
  document.getElementById("teamForm");

if (teamForm) {

  teamForm.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();

      try {

        const team = {

          name:
            document.getElementById("name").value.trim(),

          played:
            Number(document.getElementById("played").value),

          won:
            Number(document.getElementById("wins").value),

          draw:
            Number(document.getElementById("draws").value),

          lost:
            Number(document.getElementById("losses").value),

          goalsFor:
            Number(document.getElementById("goalsFor").value),

          goalsAgainst:
            Number(document.getElementById("goalsAgainst").value),

          points:
            Number(document.getElementById("points").value)

        };

        await addDoc(
          collection(db, "teams"),
          team
        );

        alert(
          "Team saved successfully! ⚽"
        );

        teamForm.reset();

        await refreshAll();

      } catch (error) {

        showError(
          "Save Team: " +
          error.message
        );

      }

    }
  );

}


// ==========================================
// ADD PLAYER
// ==========================================

const playerForm =
  document.getElementById("playerForm");

if (playerForm) {

  playerForm.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();

      try {

        const name =
          document
            .getElementById("playerNameAdmin")
            .value
            .trim();

        const team =
          document
            .getElementById("playerTeam")
            .value;

        const number =
          Number(
            document
              .getElementById("playerNumber")
              .value
          );

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
          !number ||
          !position
        ) {

          alert(
            "Please fill all player fields."
          );

          return;

        }


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
          "Player saved successfully! 👤⚽"
        );


        playerForm.reset();

        await loadPlayers();

      } catch (error) {

        showError(
          "Save Player: " +
          error.message
        );

      }

    }
  );

}


// ==========================================
// LOAD PLAYERS
// ==========================================

async function loadPlayers() {

  const list =
    document.getElementById("playersList");

  if (!list) return;

  list.innerHTML =
    "<p>Loading players...</p>";

  try {

    const snapshot =
      await getDocs(
        collection(db, "players")
      );

    if (snapshot.empty) {

      list.innerHTML =
        "<p>No players added yet.</p>";

      return;

    }

    list.innerHTML = "";

    snapshot.forEach((playerDoc) => {

      const player =
        playerDoc.data();

      const starting =
        player.starting
          ? "Starting XI"
          : "Substitute";

      const captain =
        player.captain
          ? " ⭐ Captain"
          : "";

      list.innerHTML += `
        <div style="
          margin-bottom:15px;
          padding:12px;
          border:1px solid #ddd;
          border-radius:8px;
        ">

          <strong>
            👤 ${player.name || ""}
          </strong>

          <p>
            ${player.team || ""}
            <br>
            #${player.number || ""}
            —
            ${player.position || ""}
            —
            ${starting}
            ${captain}
          </p>

          <button
            onclick="editPlayer('${playerDoc.id}')"
          >
            ✏️ Edit
          </button>

          <button
            onclick="deletePlayer('${playerDoc.id}')"
          >
            🗑️ Delete
          </button>

        </div>
      `;

    });

  } catch (error) {

    list.innerHTML =
      "<p>Unable to load players.</p>";

    showError(
      "Players: " +
      error.message
    );

  }

}


// ==========================================
// EDIT PLAYER
// ==========================================

window.editPlayer = async function(playerId) {

  try {

    const playerRef =
      doc(db, "players", playerId);

    const snapshot =
      await getDocs(
        collection(db, "players")
      );

    let player = null;

    snapshot.forEach((item) => {

      if (item.id === playerId) {

        player = item.data();

      }

    });

    if (!player) {

      alert("Player not found.");
      return;

    }

    const name =
      prompt(
        "Player name:",
        player.name || ""
      );

    if (name === null) return;

    const team =
      prompt(
        "Team:",
        player.team || ""
      );

    if (team === null) return;

    const number =
      prompt(
        "Jersey number:",
        player.number || ""
      );

    if (number === null) return;

    const position =
      prompt(
        "Position:",
        player.position || ""
      );

    if (position === null) return;

    const starting =
      confirm(
        "OK = Starting XI\nCancel = Substitute"
      );

    const captain =
      confirm(
        "OK = Captain\nCancel = Not Captain"
      );

    await updateDoc(
      playerRef,
      {

        name: name.trim(),

        team: team.trim(),

        number: Number(number),

        position:
          position.trim().toUpperCase(),

        starting: starting,

        captain: captain

      }
    );

    alert(
      "Player updated successfully! ✅"
    );

    await loadPlayers();

  } catch (error) {

    showError(
      "Edit Player: " +
      error.message
    );

  }

};


// ==========================================
// DELETE PLAYER
// ==========================================

window.deletePlayer = async function(playerId) {

  try {

    const confirmDelete =
      confirm(
        "Delete this player?\n\nThis cannot be undone."
      );

    if (!confirmDelete) return;

    await deleteDoc(
      doc(db, "players", playerId)
    );

    alert(
      "Player deleted successfully! 🗑️"
    );

    await loadPlayers();

  } catch (error) {

    showError(
      "Delete Player: " +
      error.message
    );

  }

};


// ==========================================
// ADD FIXTURE
// ==========================================

const fixtureForm =
  document.getElementById("fixtureForm");

if (fixtureForm) {

  fixtureForm.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();

      const home =
        document.getElementById("fixtureHome").value;

      const away =
        document.getElementById("fixtureAway").value;

      const date =
        document.getElementById("fixtureDate").value;


      if (!home || !away || !date) {

        alert(
          "Please select both teams and date."
        );

        return;

      }


      if (home === away) {

        alert(
          "A team cannot play against itself."
        );

        return;

      }


      try {

        await addDoc(
          collection(db, "fixtures"),
          {

            homeTeam: home,

            awayTeam: away,

            date: date,

            createdAt: new Date()

          }
        );


        alert(
          "Fixture saved successfully! ⚽"
        );


        fixtureForm.reset();

        await loadFixtures();

      } catch (error) {

        showError(
          "Save Fixture: " +
          error.message
        );

      }

    }
  );

}


// ==========================================
// LOAD FIXTURES
// ==========================================

async function loadFixtures() {

  const list =
    document.getElementById("fixturesList");

  if (!list) return;

  list.innerHTML =
    "<p>Loading fixtures...</p>";

  try {

    const snapshot =
      await getDocs(
        collection(db, "fixtures")
      );

    if (snapshot.empty) {

      list.innerHTML =
        "<p>No fixtures added yet.</p>";

      return;

    }

    list.innerHTML = "";

    snapshot.forEach((fixtureDoc) => {

      const fixture =
        fixtureDoc.data();

      list.innerHTML += `
        <div style="
          margin-bottom:15px;
          padding:12px;
          border:1px solid #ddd;
          border-radius:8px;
        ">

          <strong>
            📅 ${fixture.date || ""}
          </strong>

          <p>
            ${fixture.homeTeam || ""}
            vs
            ${fixture.awayTeam || ""}
          </p>

          <button
            onclick="editFixture('${fixtureDoc.id}')"
          >
            ✏️ Edit
          </button>

          <button
            onclick="deleteFixture('${fixtureDoc.id}')"
          >
            🗑️ Delete
          </button>

        </div>
      `;

    });

  } catch (error) {

    list.innerHTML =
      "<p>Unable to load fixtures.</p>";

    showError(
      "Fixtures: " +
      error.message
    );

  }

}


// ==========================================
// EDIT FIXTURE
// ==========================================

window.editFixture = async function(fixtureId) {

  try {

    const fixtureRef =
      doc(db, "fixtures", fixtureId);

    const snapshot =
      await getDocs(
        collection(db, "fixtures")
      );

    let fixture = null;

    snapshot.forEach((item) => {

      if (item.id === fixtureId) {

        fixture = item.data();

      }

    });

    if (!fixture) {

      alert("Fixture not found.");
      return;

    }

    const date =
      prompt(
        "Match date:",
        fixture.date || ""
      );

    if (date === null) return;

    const home =
      prompt(
        "Home Team:",
        fixture.homeTeam || ""
      );

    if (home === null) return;

    const away =
      prompt(
        "Away Team:",
        fixture.awayTeam || ""
      );

    if (away === null) return;

    if (!date || !home || !away) {

      alert(
        "All fields are required."
      );

      return;

    }

    if (home === away) {

      alert(
        "A team cannot play against itself."
      );

      return;

    }

    await updateDoc(
      fixtureRef,
      {

        date: date,

        homeTeam: home,

        away
         
