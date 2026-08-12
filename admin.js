import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
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


// ==========================
// GET TEAMS
// ==========================

async function getTeams() {

  const snapshot =
    await getDocs(
      collection(db, "teams")
    );

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
// LOAD TEAMS
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
// ADD FIXTURE
// ==========================

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
    document.getElementById(
      "fixturesList"
    );


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
        style="
          margin-bottom:15px;
          padding:12px;
          border:1px solid #ddd;
          border-radius:8px;
        "
      >

        <p>

          📅 <strong>
            ${fixture.date || ""}
          </strong>

          —

          ${fixture.homeTeam || ""}

          vs

          ${fixture.awayTeam || ""}

        </p>


        <button
          onclick="editFixture('${fixtureDoc.id}')"
          style="
            background:#1976d2;
            color:white;
            border:none;
            padding:7px 12px;
            border-radius:5px;
            margin-right:6px;
          "
        >
          ✏️ Edit
        </button>


        <button
          onclick="deleteFixture('${fixtureDoc.id}')"
          style="
            background:#d32f2f;
            color:white;
            border:none;
            padding:7px 12px;
            border-radius:5px;
          "
        >
          🗑️ Delete
        </button>

      </div>

    `;

  });

}


// ==========================
// EDIT FIXTURE
// ==========================

window.editFixture =
  async function(fixtureId) {

    try {

      const snapshot =
        await getDocs(
          collection(db, "fixtures")
        );


      let selectedFixture = null;


      snapshot.forEach((fixtureDoc) => {

        if (
          fixtureDoc.id === fixtureId
        ) {

          selectedFixture = {
            id: fixtureDoc.id,
            ...fixtureDoc.data()
          };

        }

      });


      if (!selectedFixture) {

        alert(
          "Fixture not found."
        );

        return;

      }


      const newDate =
        prompt(
          "Enter new match date:",
          selectedFixture.date || ""
        );


      if (newDate === null) {
        return;
      }


      const newHome =
        prompt(
          "Enter Home Team:",
          selectedFixture.homeTeam || ""
        );


      if (newHome === null) {
        return;
      }


      const newAway =
        prompt(
          "Enter Away Team:",
          selectedFixture.awayTeam || ""
        );


      if (newAway === null) {
        return;
      }


      if (
        !newHome ||
        !newAway ||
        !newDate
      ) {

        alert(
          "All fields are required."
        );

        return;

      }


      if (
        newHome === newAway
      ) {

        alert(
          "
