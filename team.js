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


// ==========================
// GET TEAM NAME FROM URL
// ==========================

const params =
  new URLSearchParams(
    window.location.search
  );

const teamName =
  params.get("team");


// ==========================
// LOAD TEAM
// ==========================

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


    snapshot.forEach((teamDoc) => {

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


    // ==========================
    // TEAM NAME
    // ==========================

    nameElement.textContent =
      teamFound.name || "Unknown Team";


    // ==========================
    // STATISTICS
    // ==========================

    document.getElementById(
      "played"
    ).textContent =
      Number(teamFound.played || 0);


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


    // ==========================
    // GOALS
    // ==========================

    const goalsFor =
      Number(
        teamFound.goalsFor || 0
      );


    const goalsAgainst =
      Number(
        teamFound.goalsAgainst || 0
      );


    const goalDifference =
      goalsFor -
      goalsAgainst;


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
      goalDifference;


    document.getElementById(
      "points"
    ).textContent =
      Number(
        teamFound.points || 0
      );


  } catch (error) {

    console.error(
      "Error loading team:",
      error
    );


    nameElement.textContent =
      "Error loading team";

  }

}


// ==========================
// START
// ==========================

loadTeam();
