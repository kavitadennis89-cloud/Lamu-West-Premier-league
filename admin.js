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
// TEAM ELEMENTS
// ==========================

const teamForm =
  document.getElementById("teamForm");

const teamsList =
  document.getElementById("teamsList");


// ==========================
// ADD TEAM
// ==========================

teamForm.addEventListener(
  "submit",
  async (e) => {

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


      teamForm.reset();


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

  }
);


// ==========================
// LOAD TEAMS
// ==========================

async function loadTeams() {

  try {

    const snapshot =
      await getDocs(
        collection(db, "teams")
      );


    teamsList.innerHTML = "";


    snapshot.forEach((teamDoc) => {

      const team =
        teamDoc.data();


      teamsList.innerHTML += `
        <p>
          <strong>${team.name}</strong>
          - ${team.points || 0} pts
        </p>
      `;

    });

  } catch (error) {

    console.error(error);

  }

}


// ==========================
// FIXTURE TEAM DROPDOWNS
// ==========================

async function loadFixtureTeams() {

  try {

    const homeSelect =
      document.getElementById(
        "fixtureHome"
      );

    const awaySelect =
      document.getElementById(
        "fixtureAway"
      );


    const snapshot =
      await getDocs(
        collection(db, "teams")
      );


    homeSelect.innerHTML =
      '<option value="">Select Home Team</option>';

    awaySelect.innerHTML =
      '<option value="">Select Away Team</option>';


    snapshot.forEach((teamDoc) => {

      const team =
        teamDoc.data();


      const homeOption =
        document.createElement(
          "option"
        );

      homeOption.value =
        team.name;

      homeOption.textContent =
        team.name;


      const awayOption =
        document.createElement(
          "option"
        );

      awayOption.value =
        team.name;

      awayOption.textContent =
        team.name;


      homeSelect.appendChild(
        homeOption
      );

      awaySelect.appendChild(
        awayOption
      );

    });

  } catch (error) {

    console.error(error);

  }

}


// ==========================
// SAVE FIXTURE
// ==========================

const fixtureForm =
  document.getElementById(
    "fixtureForm"
  );


fixtureForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();


    const homeTeam =
      document.getElementById(
        "fixtureHome"
      ).value;


    const awayTeam =
      document.getElementById(
        "fixtureAway"
      ).value;


    const date =
      document.getElementById(
        "fixtureDate"
      ).value;


    if (
      !homeTeam ||
      !awayTeam ||
      !date
    ) {

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


    try {

      await addDoc(
        collection(db, "fixtures"),
        {

          homeTeam:
            homeTeam,

          awayTeam:
            awayTeam,

          date:
            date,

          createdAt:
            new Date()

        }
      );


      alert(
        "Fixture saved successfully! ⚽🔥"
      );


      fixtureForm.reset();


      await loadFixtures();

    } catch (error) {

      console.error(
        "Fixture error:",
        error
      );

      alert(
        "Error saving fixture: " +
        error.message
      );

    }

  }
);


// ==========================
// LOAD FIXTURES
// ==========================

async function loadFixtures() {

  try {

    const fixturesList =
      document.getElementById(
        "fixturesList"
      );


    const snapshot =
      await getDocs(
        collection(db, "fixtures")
      );


    fixturesList.innerHTML = "";


    if (snapshot.empty) {

      fixturesList.innerHTML =
        "<p>No fixtures added yet.</p>";

      return;

    }


    snapshot.forEach((fixtureDoc) => {

      const fixture =
        fixtureDoc.data();


      fixturesList.innerHTML += `
        <p>
          📅 <strong>${fixture.date}</strong>
          —
          ${fixture.homeTeam}
          vs
          ${fixture.awayTeam}
        </p>
      `;

    });

  } catch (error) {

    console.error(
      "Fixture loading error:",
      error
    );

  }

}


// ==========================
// TOP SCORER TEAM DROPDOWN
// ==========================

async function loadScorerTeams() {

  try {

    const scorerTeam =
      document.getElementById(
        "scorerTeam"
      );


    const snapshot =
      await getDocs(
        collection(db, "teams")
      );


    scorerTeam.innerHTML =
      '<option value="">Select Team</option>';


    snapshot.forEach((teamDoc) => {

      const team =
        teamDoc.data();


      const option =
        document.createElement(
          "option"
        );


      option.value =
        team.name;

      option.textContent =
        team.name;


      scorerTeam.appendChild(
        option
      );

    });

  } catch (error) {

    console.error(
      "Error loading scorer teams:",
      error
    );

  }

}


// ==========================
// SAVE TOP SCORER
// ==========================

const scorerForm =
  document.getElementById(
    "scorerForm"
  );


scorerForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();


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


    if (
      !playerName ||
      !team
    ) {

      alert(
        "Please enter player name and team."
      );

      return;

    }


    if (goals < 0) {
