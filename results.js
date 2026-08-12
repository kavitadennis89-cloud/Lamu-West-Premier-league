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
  appId: "1:280853181931:web:8c411d3528bddadd2d15ae",
  measurementId: "G-HQ04SZWBBB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const homeTeam = document.getElementById("homeTeam");
const awayTeam = document.getElementById("awayTeam");
const homeGoals = document.getElementById("homeGoals");
const awayGoals = document.getElementById("awayGoals");
const saveResult = document.getElementById("saveResult");

let teams = [];

async function loadTeams() {
  try {
    const snapshot = await getDocs(collection(db, "teams"));


    teams = [];

    homeTeam.innerHTML = '<option value="">Select Home Team</option>';
    awayTeam.innerHTML = '<option value="">Select Away Team</option>';

    snapshot.forEach((teamDoc) => {
  const team = {
    id: teamDoc.id,
    ...teamDoc.data()
  };

      teams.push(team);

      const option1 = document.createElement("option");
      option1.value = team.id;
      option1.textContent = team.name;

      const option2 = document.createElement("option");
      option2.value = team.id;
      option2.textContent = team.name;

      homeTeam.appendChild(option1);
      awayTeam.appendChild(option2);
    });

    console.log("Teams loaded:", teams);

  } catch (error) {
    console.error("Error loading teams:", error);
    alert("Could not load teams: " + error.message);
  }
}

saveResult.addEventListener("click", async () => {
  const homeId = homeTeam.value;
  const awayId = awayTeam.value;

  const homeScore = Number(homeGoals.value);
  const awayScore = Number(awayGoals.value);

  if (!homeId || !awayId) {
    alert("Please select both teams.");
    return;
  }

  if (homeId === awayId) {
    alert("A team cannot play against itself.");
    return;
  }

  if (homeGoals.value === "" || awayGoals.value === "") {
    alert("Please enter both scores.");
    return;
  }

  if (homeScore < 0 || awayScore < 0) {
    alert("Goals cannot be negative.");
    return;
  }

  const home = teams.find(team => team.id === homeId);
  const away = teams.find(team => team.id === awayId);

  if (!home || !away) {
    alert("Team not found.");
    return;
  }

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

  } else if (homeScore < awayScore) {
    awayWon = 1;
    homeLost = 1;
    awayPoints = 3;

  } else {
    homeDraw = 1;
    awayDraw = 1;
    homePoints = 1;
    awayPoints = 1;
  }

  const homeUpdate = {
    played: Number(home.played || 0) + 1,
    won: Number(home.won || 0) + homeWon,
    draw: Number(home.draw || 0) + homeDraw,
    lost: Number(home.lost || 0) + homeLost,
    goalsFor: Number(home.goalsFor || 0) + homeScore,
    goalsAgainst: Number(home.goalsAgainst || 0) + awayScore,
    points: Number(home.points || 0) + homePoints
  };

  const awayUpdate = {
    played: Number(away.played || 0) + 1,
    won: Number(away.won || 0) + awayWon,
    draw: Number(away.draw || 0) + awayDraw,
    lost: Number(away.lost || 0) + awayLost,
    goalsFor: Number(away.goalsFor || 0) + awayScore,
    goalsAgainst: Number(away.goalsAgainst || 0) + homeScore,
    points: Number(away.points || 0) + awayPoints
  };

  try {
    await updateDoc(doc(db, "teams", homeId), homeUpdate);
    await updateDoc(doc(db, "teams", awayId), awayUpdate);

    await addDoc(collection(db, "results"), {
      homeTeam: home.name,
      awayTeam: away.name,
      homeGoals: homeScore,
      awayGoals: awayScore,
      createdAt: new Date()
    });

    alert("Match result saved successfully! ⚽🔥");

    homeTeam.value = "";
    awayTeam.value = "";
    homeGoals.value = "";
    awayGoals.value = "";

    await loadTeams();

  } catch (error) {
    console.error("Error saving result:", error);
    alert("Error saving result: " + error.message);
  }
});

loadTeams();
