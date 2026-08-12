import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
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

      list.innerHTML =
        "<p>No teams found.</p>";

      return;
    }

    teams.forEach((team) => {

      list.innerHTML += `
        <p>
          ⚽ <strong>${team.name}</strong>
        </p>
      `;

    });

  } catch (error) {

    console.error("TEAM ERROR:", error);

    list.innerHTML =
      "<p>Error loading teams.</p>";

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

    console.error(
      "FIXTURE TEAM ERROR:",
      error
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

    console.error(
      "SCORER TEAM ERROR:",
      error
    );

  }
}


// ==========================================
// ADD TEAM
// ==========================================

document
  .getElementById("teamForm")
  .addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

      await addDoc(
        collection(db, "teams"),
        {

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

        }
      );

      alert(
        "Team saved successfully! ⚽"
      );

      e.target.reset();

      await loadTeams();
      await loadFixtureTeams();
      await loadScorerTeams();

    } catch (error) {

      console.error(
        "SAVE TEAM ERROR:",
        error
      );

      alert(
        "Error saving team: " +
        error.message
      );

    }

  });


// ==========================================
// ADD FIXTURE
// ==========================================

document
  .getElementById("fixtureForm")
  .addEventListener("submit", async (e) => {

    e.preventDefault();

    const home =
      document.getElementById(
        "fixtureHome"
      ).value;

    const away =
      document.getElementById(
        "fixtureAway"
      ).value;

    const date =
      document.getElementById(
        "fixtureDate"
      ).value;

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

      e.target.reset();

      await loadFixtures();

    } catch (error) {

      console.error(
        "SAVE FIXTURE ERROR:",
        error
      );

      alert(
        "Error saving fixture: " +
        error.message
      );

    }

  });


// ==========================================
// LOAD FIXTURES
// ==========================================

async function loadFixtures() {

  const list =
    document.getElementById(
      "fixturesList"
    );

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

        <div
         
