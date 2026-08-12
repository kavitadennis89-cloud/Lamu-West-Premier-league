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
  appId: "1:280853181931:web:8c411d3528bddadd2d15ae"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ==========================================
// SHOW ERROR
// ==========================================

function showError(message) {

  const box = document.getElementById("adminError");

  if (box) {

    box.innerHTML = `
      <div style="
        background:#ffe0e0;
        color:#900;
        padding:15px;
        margin:15px 0;
        border:2px solid #900;
        border-radius:8px;
      ">
        <strong>Admin Error:</strong>
        <br>
        ${message}
      </div>
    `;

  }

  console.error(message);

}


// ==========================================
// GET TEAMS
// ==========================================

async function getTeams() {

  const snapshot = await getDocs(
    collection(db, "teams")
  );

  const teams = [];

  snapshot.forEach((teamDoc) => {

    const data = teamDoc.data();

    teams.push({
      id: teamDoc.id,
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

  try {

    const teams = await getTeams();

    list.innerHTML = "";

    if (teams.length === 0) {

      list.innerHTML = "<p>No teams found.</p>";

      return;

    }

    teams.forEach((team) => {

      list.innerHTML += `
        <div style="
          margin-bottom:15px;
          padding:12px;
          border:1px solid #ddd;
          border-radius:8px;
        ">

          <p>
            ⚽
            <strong>${team.name}</strong>
          </p>

          <button onclick="deleteTeam('${team.id}')">
            🗑️ Delete Team
          </button>

        </div>
      `;

    });

  } catch (error) {

    list.innerHTML =
      "<p>Error loading teams.</p>";

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

    const answer = confirm(
      "Are you sure you want to delete " +
      team.name +
      "?\n\nThis action cannot be undone."
    );

    if (!answer) {

      return;

    }

    await deleteDoc(
      doc(
        db,
        "teams",
        teamId
      )
    );

    alert(
      team.name +
      " deleted successfully! 🗑️"
    );

    await loadTeams();
    await loadFixtureTeams();
    await loadScorerTeams();

  } catch (error) {

    alert(
      "Error deleting team: " +
      error.message
    );

    showError(
      "Delete Team: " +
      error.message
    );

  }

};


// ==========================================
// LOAD FIXTURE TEAMS
// ==========================================

async function loadFixtureTeams() {

  const home =
    document.getElementById("fixtureHome");

  const away =
    document.getElementById("fixtureAway");

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

document
  .getElementById("teamForm")
  .addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();

      try {

        const team = {

          name:
            document.getElementById("name").value.trim(),

          played:
            Number(
              document.getElementById("played").value
            ),

          won:
            Number(
              document.getElementById("wins").value
            ),

          draw:
            Number(
              document.getElementById("draws").value
            ),

          lost:
            Number(
              document.getElementById("losses").value
            ),

          goalsFor:
            Number(
              document.getElementById("goalsFor").value
            ),

          goalsAgainst:
            Number(
              document.getElementById("goalsAgainst").value
            ),

          points:
            Number(
              document.getElementById("points").value
            )

        };


        await addDoc(
          collection(db, "teams"),
          team
        );


        alert(
          "Team saved successfully! ⚽"
        );


        event.target.reset();


        await loadTeams();
        await loadFixtureTeams();
        await loadScorerTeams();

      } catch (error) {

        alert(
          "Error saving team: " +
          error.message
        );

        showError(
          error.message
        );

      }

    }
  );


// ==========================================
// ADD FIXTURE
// ==========================================

document
  .getElementById("fixtureForm")
  .addEventListener(
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


        event.target.reset();

        await loadFixtures();

      } catch (error) {

        alert(
          "Error saving fixture: " +
          error.message
        );

        showError(
          error.message
        );

      }

    }
  );


// ==========================================
// LOAD FIXTURES
// ==========================================

async function loadFixtures() {

  const list =
    document.getElementById("fixturesList");

  try {

    const snapshot =
      await getDocs(
        collection(db, "fixtures")
      );

    list.innerHTML = "";

    if (snapshot.empty) {

      list.innerHTML =
        "<p>No fixtures added yet.</p>";

      return;

    }


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

          <p>
            📅
            <strong>
              ${fixture.date || ""}
            </strong>

            —

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
      "<p>Error loading fixtures.</p>";

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
      doc(
        db,
        "fixtures",
        fixtureId
      );


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

      alert(
        "Fixture not found."
      );

      return;

    }


    const newDate =
      prompt(
        "Enter new match date:",
        fixture.date || ""
      );


    if (newDate === null) {

      return;

    }


    const newHome =
      prompt(
        "Enter Home Team:",
        fixture.homeTeam || ""
      );


    if (newHome === null) {

      return;

    }


    const newAway =
      prompt(
        "Enter Away Team:",
        fixture.awayTeam || ""
      );


    if (newAway === null) {

      return;

    }


    if (
      !newDate ||
      !newHome ||
      !newAway
    ) {

      alert(
        "All fields are required."
      );

      return;

    }


    if (newHome === newAway) {

      alert(
        "A team cannot play against itself."
      );

      return;

    }


    await updateDoc(
      fixtureRef,
      {
        date: newDate,
        homeTeam: newHome,
        awayTeam: newAway
      }
    );


    alert(
      "Fixture updated successfully! ✅"
    );


    await loadFixtures();

  } catch (error) {

    alert(
      "Error editing fixture: " +
      error.message
    );

    showError(
      error.message
    );

  }

};


// ==========================================
// DELETE FIXTURE
// ==========================================

window.deleteFixture =
  async function(fixtureId) {

    try {

      const answer =
        confirm(
          "Are you sure you want to delete this fixture?"
        );


      if (!answer) {

        return;

      }


      await deleteDoc(
        doc(
          db,
          "fixtures",
          fixtureId
        )
      );


      alert(
        "Fixture deleted successfully! 🗑️"
      );


      await loadFixtures();

    } catch (error) {

      alert(
        "Error deleting fixture: " +
        error.message
      );

      showError(
        error.message
      );

    }

  };


// ==========================================
// ADD TOP SCORER
// ==========================================

document
  .getElementById("scorerForm")
  .addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();


      const playerName =
        document.getElementById(
          "playerName"
        ).value.trim();


      const team =
        document.getElementById(
          "scorerTeam"
        ).value;


      const goals =
        Number(
          document.getElementById(
            "playerGoals"
          ).value
        );


      if (!playerName || !team) {

        alert(
          "Please enter player name and select team."
        );

        return;

      }


      try {

        await addDoc(
          collection(db, "scorers"),
          {
            playerName: playerName,
            team: team,
            goals: goals
          }
        );


        alert(
          "Top scorer saved successfully! 🥇"
        );


        event.target.reset();

        await loadScorers();

      } catch (error) {

        alert(
          "Error saving scorer: " +
          error.message
        );

        showError(
          error.message
        );

      }

    }
  );


// ==========================================
// LOAD SCORERS
// ==========================================

async function loadScorers() {

  const list =
    document.getElementById("scorersList");

  try {

    const snapshot =
      await getDocs(
        collection(db, "scorers")
      );


    list.innerHTML = "";


    if (snapshot.empty) {

      list.innerHTML =
        "<p>No scorers added yet.</p>";

      return;

    }


    snapshot.forEach((scorerDoc) => {

      const data =
        scorerDoc.data();


      list.innerHTML += `
        <p>

          🥇

          <strong>
            ${data.playerName || ""}
          </strong>

          —

          ${data.team || ""}

          —

          <strong>
            ${data.goals || 0}
            goals
          </strong>

        </p>
      `;

    });

  } catch (error) {

    list.innerHTML =
      "<p>Error loading scorers.</p>";

    showError(
      "Scorers: " +
      error.message
    );

  }

}


// ==========================================
// START ADMIN
// ==========================================

async function startAdmin() {

  try {

    await loadTeams();

    await loadFixtureTeams();

    await loadScorerTeams();

    await loadFixtures();

    await loadScorers();

  } catch (error) {

    showError(
      error.message
    );

  }

}


startAdmin();
         
