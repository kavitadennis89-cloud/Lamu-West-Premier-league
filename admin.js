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
  appId: "1:280853181931:web:8c411d3528bddadd2d15ae"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ==========================
// GET TEAMS
// ==========================

async function getTeams() {

  const snapshot =
    await getDocs(collection(db, "teams"));

  const teams = [];

  snapshot.forEach((teamDoc) => {

    const data = teamDoc.data();

    teams.push({
      id: teamDoc.id,
      name: data.name
    });

  });

  return teams;
}


// ==========================
// LOAD TEAM LIST
// ==========================

async function loadTeams() {

  const teamsList =
    document.getElementById("teamsList");

  const teams =
    await getTeams();

  teamsList.innerHTML = "";

  teams.forEach((team) => {

    teamsList.innerHTML += `
      <p>
        <strong>${team.name}</strong>
      </p>
    `;

  });

}


// ==========================
// LOAD FIXTURE TEAMS
// ==========================

async function loadFixtureTeams() {

  const home =
    document.getElementById("fixtureHome");

  const away =
    document.getElementById("fixtureAway");

  const teams =
    await getTeams();

  home.innerHTML =
    '<option value="">Select Home Team</option>';

  away.innerHTML =
    '<option value="">Select Away Team</option>';

  teams.forEach((team) => {

    const homeOption =
      document.createElement("option");

    homeOption.value =
      team.name;

    homeOption.textContent =
      team.name;

    home.appendChild(homeOption);


    const awayOption =
      document.createElement("option");

    awayOption.value =
      team.name;

    awayOption.textContent =
      team.name;

    away.appendChild(awayOption);

  });

}


// ==========================
// LOAD SCORER TEAMS
// ==========================

async function loadScorerTeams() {

  const scorerTeam =
    document.getElementById("scorerTeam");

  const teams =
    await getTeams();

  scorerTeam.innerHTML =
    '<option value="">Select Team</option>';

  teams.forEach((team) => {

    const option =
      document.createElement("option");

    option.value =
      team.name;

    option.textContent =
      team.name;

    scorerTeam.appendChild(option);

  });

}


// ==========================
// ADD TEAM
// ==========================

document
  .getElementById("teamForm")
  .addEventListener("submit", async (e) => {

    e.preventDefault();

    const team = {

      name:
        document.getElementById("name").value,

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

    try {

      await addDoc(
        collection(db, "teams"),
        team
      );

      alert(
        "Team saved successfully! ⚽"
      );

      e.target.reset();

      await loadTeams();
      await loadFixtureTeams();
      await loadScorerTeams();

    } catch (error) {

      console.error(error);

      alert(
        "Error saving team: " +
        error.message
      );

    }

  });


// ==========================
// SAVE FIXTURE
// ==========================

document
  .getElementById("fixtureForm")
  .addEventListener("submit", async (e) => {

    e.preventDefault();

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
        "Fixture saved successfully! ⚽🔥"
      );

      e.target.reset();

      await loadFixtures();

    } catch (error) {

      console.error(error);

      alert(
        "Error saving fixture: " +
        error.message
      );

    }

  });


// ==========================
// LOAD FIXTURES
// ==========================

async function loadFixtures() {

  const list =
    document.getElementById("fixturesList");

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
      <p>
        📅 <strong>${fixture.date}</strong>
        —
        ${fixture.homeTeam}
        vs
        ${fixture.awayTeam}
      </p>
    `;

  });

}


// ==========================
// SAVE TOP SCORER
// ==========================

document
  .getElementById("scorerForm")
  .addEventListener("submit", async (e) => {

    e.preventDefault();

    const playerName =
      document.getElementById("playerName").value.trim();

    const team =
      document.getElementById("scorerTeam").value;

    const goals =
      Number(
        document.getElementById("playerGoals").value
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
          goals: goals,
          createdAt: new Date()
        }
      );

      alert(
        "Top scorer saved successfully! 🥇⚽"
      );

      e.target.reset();

      await loadScorers();

    } catch (error) {

      console.error(error);

      alert(
        "Error saving scorer: " +
        error.message
      );

    }

  });


// ==========================
// LOAD TOP SCORERS
// ==========================

async function loadScorers() {

  const list =
    document.getElementById("scorersList");

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

  const scorers = [];

  snapshot.forEach((scorerDoc) => {

    scorers.push(
      scorerDoc.data()
    );

  });

  scorers.sort((a, b) => {

    return Number(b.goals || 0) -
           Number(a.goals || 0);

  });


  scorers.forEach((scorer, index) => {

    list.innerHTML += `
      <p>
        ${index + 1}.
        <strong>${scorer.playerName}</strong>
        —
        ${scorer.team}
        —
        ${scorer.goals} goals
      </p>
    `;

  });

}


// ==========================
// START
// ==========================

async function start() {

  try {

    await loadTeams();

    await loadFixtureTeams();

    await loadFixtures();

    await loadScorerTeams();

    await loadScorers();

  } catch (error) {

    console.error(
      "Startup error:",
      error
    );

  }

}


start();
