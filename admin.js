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
// TEAM FORM
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

    goalsAgainst: Number(
      document.getElementById("goalsAgainst").value
    ),

    points: Number(document.getElementById("points").value)

  };


  await addDoc(
    collection(db, "teams"),
    team
  );


  alert("Team saved successfully! ⚽");

  teamForm.reset();

  loadTeams();

});


// ==========================
// LOAD TEAMS
// ==========================

async function loadTeams() {

  const snapshot =
    await getDocs(collection(db, "teams"));


  teamsList.innerHTML = "";


  snapshot.forEach((teamDoc) => {

    const team = teamDoc.data();


    teamsList.innerHTML += `
      <p>
        <strong>${team.name}</strong>
        - ${team.points || 0} pts
      </p>
    `;

  });


  loadFixtureTeams(snapshot);

}


// ==========================
// FIXTURE TEAM DROPDOWNS
// ==========================

function loadFixtureTeams(snapshot) {

  const homeSelect =
    document.getElementById("fixtureHome");

  const awaySelect =
    document.getElementById("fixtureAway");


  homeSelect.innerHTML =
    '<option value="">Select Home Team</option>';
alert("Teams found: " + snapshot.size);
  awaySelect.innerHTML =
    '<option value="">Select Away Team</option>';


  snapshot.forEach((teamDoc) => {

    const team = teamDoc.data();


    const homeOption =
      document.createElement("option");

    homeOption.value = team.name;

    homeOption.textContent = team.name;


    const awayOption =
      document.createElement("option");

    awayOption.value = team.name;

    awayOption.textContent = team.name;


    homeSelect.appendChild(homeOption);

    awaySelect.appendChild(awayOption);

  });

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

    alert("Please fill all fixture details.");

    return;

  }


  if (homeTeam === awayTeam) {

    alert("A team cannot play against itself.");

    return;

  }


  await addDoc(
    collection(db, "fixtures"),
    {

      homeTeam: homeTeam,

      awayTeam: awayTeam,

      date: date,

      createdAt: new Date()

    }
  );


  alert("Fixture saved successfully! 📅⚽");


  fixtureForm.reset();


  loadFixtures();

});


// ==========================
// LOAD FIXTURES
// ==========================

async function loadFixtures() {

  const fixturesList =
    document.getElementById("fixturesList");


  fixturesList.innerHTML = "";


  const snapshot =
    await getDocs(collection(db, "fixtures"));


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

}


// ==========================
// START
// ==========================

loadTeams();

loadFixtures();
