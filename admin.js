import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


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


// ==========================
// ADD TEAM
// ==========================

const teamForm = document.getElementById("teamForm");
const teamsList = document.getElementById("teamsList");

teamForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const team = {
    name: document.getElementById("name").value,
    played: Number(document.getElementById("played").value),
    won: Number(document.getElementById("wins").value),
    draw: Number(document.getElementById("draws").value),
    lost: Number(document.getElementById("losses").value),
    goalsFor: Number(document.getElementById("goalsFor").value),
    goalsAgainst: Number(document.getElementById("goalsAgainst").value),
    points: Number(document.getElementById("points").value)
  };

  try {

    await addDoc(collection(db, "teams"), team);

    alert("Team saved successfully! ⚽");

    teamForm.reset();

    await loadAll();

  } catch (error) {

    console.error(error);

    alert("Error saving team: " + error.message);

  }

});


// ==========================
// LOAD ALL TEAMS
// ==========================

async function getTeams() {

  const snapshot = await getDocs(
    collection(db, "teams")
  );

  const teams = [];

  snapshot.forEach((teamDoc) => {

    teams.push({
      id: teamDoc.id,
      ...teamDoc.data()
    });

  });

  return teams;

}


// ==========================
// SHOW TEAMS
// ==========================

async function loadTeams() {

  try {

    const teams = await getTeams();

    teamsList.innerHTML = "";

    if (teams.length === 0) {

      teamsList.innerHTML =
        "<p>No teams added yet.</p>";

      return;

    }

    teams.forEach((team) => {

      teamsList.innerHTML += `
        <p>
          <strong>${team.name}</strong>
          - ${team.points || 0} pts
        </p>
      `;

    });

  } catch (error) {

    console.error(
      "Error loading teams:",
      error
    );

  }

}


// ==========================
// LOAD FIXTURE TEAMS
// ==========================

async function loadFixtureTeams() {

  try {

    const homeSelect =
      document.getElementById("fixtureHome");

    const awaySelect =
      document.getElementById("fixtureAway");

    const teams = await getTeams();

    homeSelect.innerHTML =
      '<option value="">Select Home Team</option>';

    awaySelect.innerHTML =
      '<option value="">Select Away Team</option>';

    teams.forEach((team) => {

      const homeOption =
        document.createElement("option");

      homeOption.value = team.name;
      homeOption.textContent = team.name;

      homeSelect.appendChild(homeOption);


      const awayOption =
        document.createElement("option");

      awayOption.value = team.name;
      awayOption.textContent = team.name;

      awaySelect.appendChild(awayOption);

    });

  } catch (error) {

    console.error(
      "Error loading fixture teams:",
      error
    );

  }

}


// ==========================
// SAVE FIXTURE
// ==========================

const fixtureForm =
  document.getElementById("fixtureForm");

fixtureForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const homeTeam =
    document.getElementById("fixtureHome").value;

  const awayTeam =
    document.getElementById("fixtureAway").value;

  const date =
    document.getElementById("fixtureDate").value;


  if (!homeTeam || !awayTeam || !date) {

    alert(
      "Please select both teams and a date."
    );

    return;

  }


  if (homeTeam === awayTeam) {

    alert(
      "A team cannot play against itself."
    );

    return;

  }
