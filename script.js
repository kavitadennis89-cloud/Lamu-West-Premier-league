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
// LEAGUE TABLE
// ==========================

async function loadTeams() {

  const snapshot = await getDocs(collection(db, "teams"));

  const teams = [];

  snapshot.forEach((teamDoc) => {

    const data = teamDoc.data();

    teams.push({
      name: data.name || "Unknown Team",
      played: Number(data.played || 0),
      won: Number(data.won || data.wins || 0),
      draw: Number(data.draw || data.draws || 0),
      lost: Number(data.lost || data.losses || 0),
      goalsFor: Number(data.goalsFor || 0),
      goalsAgainst: Number(data.goalsAgainst || 0),
      points: Number(data.points || 0)
    });

  });


  teams.sort((a, b) => {

    if (b.points !== a.points) {
      return b.points - a.points;
    }

    const aGD = a.goalsFor - a.goalsAgainst;
    const bGD = b.goalsFor - b.goalsAgainst;

    return bGD - aGD;

  });


  const table = document.querySelector("table");

  table.innerHTML = `
    <tr>
      <th>Pos</th>
      <th>Club</th>
      <th>P</th>
      <th>W</th>
      <th>D</th>
      <th>L</th>
      <th>Pts</th>
    </tr>
  `;


  teams.forEach((team, index) => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${team.name}</td>
      <td>${team.played}</td>
      <td>${team.won}</td>
      <td>${team.draw}</td>
      <td>${team.lost}</td>
      <td>${team.points}</td>
    `;

    table.appendChild(row);

  });

}


// ==========================
// LATEST RESULTS
// ==========================

async function loadResults() {

  const snapshot = await getDocs(collection(db, "results"));

  const sections = document.querySelectorAll("section");

  let resultsSection = null;

  sections.forEach((section) => {

    const heading = section.querySelector("h2");

    if (heading && heading.textContent.includes("Latest Results")) {
      resultsSection = section;
    }

  });


  if (!resultsSection) return;


  async function loadResults() {
  try {
    const snapshot = await getDocs(collection(db, "results"));

    const resultsList = document.getElementById("resultsList");

    if (!resultsList) return;

    resultsList.innerHTML = "";

    if (snapshot.empty) {
      resultsList.innerHTML = "<p>No matches played yet.</p>";
      return;
    }

    snapshot.forEach((resultDoc) => {
      const result = resultDoc.data();

      const match = document.createElement("p");

      match.innerHTML = `
        ⚽ <strong>${result.homeTeam}</strong>
        ${result.homeGoals}
        -
        ${result.awayGoals}
        <strong>${result.awayTeam}</strong>
      `;

      resultsList.appendChild(match);
    });

  } catch (error) {
    console.error("Error loading results:", error);
  }
  }


  if (snapshot.empty) {

    const message = document.createElement("p");

    message.textContent = "No matches played yet.";

    resultsSection.appendChild(message);

    return;

  }


  snapshot.forEach((resultDoc) => {

    const result = resultDoc.data();

    const match = document.createElement("p");

    match.innerHTML = `
      ⚽ <strong>${result.homeTeam}</strong>
      ${result.homeGoals}
      -
      ${result.awayGoals}
      <strong>${result.awayTeam}</strong>
    `;

    resultsSection.appendChild(match);

  });

}


// ==========================
// LOAD WEBSITE DATA
// ==========================

loadTeams();
loadResults();
