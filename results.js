import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc
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


const fixtureSelect =
  document.getElementById("fixtureSelect");

const homeGoals =
  document.getElementById("homeGoals");

const awayGoals =
  document.getElementById("awayGoals");

const saveResult =
  document.getElementById("saveResult");


let fixtures = [];
let teams = [];


// ==========================
// LOAD FIXTURES
// ==========================

async function loadFixtures() {

  try {

    const snapshot =
      await getDocs(
        collection(db, "fixtures")
      );

    fixtures = [];

    fixtureSelect.innerHTML =
      '<option value="">Select Fixture</option>';

    snapshot.forEach((fixtureDoc) => {

      const fixture = {
        id: fixtureDoc.id,
        ...fixtureDoc.data()
      };

      fixtures.push(fixture);

      const option =
        document.createElement("option");

      option.value = fixture.id;

      option.textContent =
        `${fixture.date} — ${fixture.homeTeam} vs ${fixture.awayTeam}`;

      fixtureSelect.appendChild(option);

    });

    console.log(
      "Fixtures loaded:",
      fixtures
    );

  } catch (error) {

    console.error(
      "Error loading fixtures:",
      error
    );

    alert(
      "Could not load fixtures: " +
      error.message
    );

  }

}


// ==========================
// LOAD TEAMS
// ==========================

async function loadTeams() {

  try {

    const snapshot =
      await getDocs(
        collection(db, "teams")
      );

    teams = [];

    snapshot.forEach((teamDoc) => {

      teams.push({
        id: teamDoc.id,
        ...teamDoc.data()
      });

    });

    console.log(
      "Teams loaded:",
      teams
    );

  } catch (error) {

    console.error(
      "Error loading teams:",
      error
    );

    alert(
      "Could not load teams: " +
      error.message
    );

  }

}


// ==========================
// SAVE RESULT
// ==========================

saveResult.addEventListener(
  "click",
  async () => {

    try {

      const fixtureId =
        fixtureSelect.value;

      const homeScore =
        Number(homeGoals.value);

      const awayScore =
        Number(awayGoals.value);


      // CHECK FIXTURE

      if (!fixtureId) {

        alert(
          "Please select a fixture."
        );

        return;

      }


      // CHECK SCORES

      if (
        homeGoals.value === "" ||
        awayGoals.value === ""
      ) {

        alert(
          "Please enter both scores."
        );

        return;

      }


      if (
        homeScore < 0 ||
        awayScore < 0
      ) {

        alert(
          "Goals cannot be negative."
        );

        return;

      }


      // FIND FIXTURE

      const fixture =
        fixtures.find(
          item => item.id === fixtureId
        );


      if (!fixture) {

        alert(
          "Fixture not found."
        );

        return;

      }


      // FIND TEAMS

      const home =
        teams.find(
          team =>
            team.name === fixture.homeTeam
        );


      const away =
        teams.find(
          team =>
            team.name === fixture.awayTeam
        );


      if (!home || !away) {

        alert(
          "Could not find teams."
        );

        return;

      }


      // ==========================
      // CALCULATE RESULT
      // ==========================

      let homeWon = 0;
      let homeDraw = 0;
      let homeLost = 0;

      let awayWon = 0;
      let awayDraw = 0;
      let awayLost = 0;

      let homePoints = 0;
      let awayPoints = 0;


      if (homeScore > awayScore) {

        homeWon = 1;
        awayLost = 1;

        homePoints = 3;

      }

      else if (homeScore < awayScore) {

        awayWon = 1;
        homeLost = 1;

        awayPoints = 3;

      }

      else {

        homeDraw = 1;
        awayDraw = 1;

        homePoints = 1;
        awayPoints = 1;

      }


      // ==========================
      // UPDATE HOME TEAM
      // ==========================

      const homeUpdate = {

        played:
          Number(home.played || 0) + 1,

        wins:
          Number(
            home.wins ||
            home.won ||
            0
          ) + homeWon,

        draws:
          Number(
            home.draws ||
            home.draw ||
            0
          ) + homeDraw,

        losses:
          Number(
            home.losses ||
            home.lost ||
            0
          ) + homeLost,

        goalsFor:
          Number(
            home.goalsFor || 0
          ) + homeScore,

        goalsAgainst:
          Number(
            home.goalsAgainst || 0
          ) + awayScore,

        points:
          Number(
            home.points || 0
          ) + homePoints

      };


      // ==========================
      // UPDATE AWAY TEAM
      // ==========================

      const awayUpdate = {

        played:
          Number(away.played || 0) + 1,

        wins:
          Number(
            away.wins ||
            away.won ||
            0
          ) + awayWon,

        draws:
          Number(
            away.draws ||
            away.draw ||
            0
          ) + awayDraw,

        losses:
          Number(
            away.losses ||
            away.lost ||
            0
          ) + awayLost,

        goalsFor:
          Number(
            away.goalsFor || 0
          ) + awayScore,

        goalsAgainst:
          Number(
            away.goalsAgainst || 0
          ) + homeScore,

        points:
          Number(
            away.points || 0
          ) + awayPoints

      };


      // ==========================
      // SAVE HOME TEAM
      // ==========================

      await updateDoc(
        doc(
          db,
          "teams",
          home.id
        ),
        homeUpdate
      );


      // ==========================
      // SAVE AWAY TEAM
      // ==========================

      await updateDoc(
        doc(
          db,
          "teams",
          away.id
        ),
        awayUpdate
      );


      // ==========================
      // SAVE RESULT
      // ==========================

      await addDoc(
        collection(
          db,
          "results"
        ),
        {

          fixtureId:
            fixtureId,

          homeTeam:
            fixture.homeTeam,

          awayTeam:
            fixture.awayTeam,

          homeGoals:
            homeScore,

          awayGoals:
            awayScore

        }
      );


      // ==========================
      // SUCCESS
      // ==========================

      alert(
        "Match result saved successfully!"
      );


      homeGoals.value = "";

      awayGoals.value = "";

      fixtureSelect.value = "";


      await loadTeams();

      await loadFixtures();


    } catch (error) {

      console.error(
        "Error saving result:",
        error
      );

      alert(
        "Error saving result: " +
        error.message
      );

    }

  }
);


// ==========================
// START
// ==========================

loadTeams();

loadFixtures();
       
