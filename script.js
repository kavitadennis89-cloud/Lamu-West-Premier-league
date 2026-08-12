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

  try {

    const snapshot =
      await getDocs(collection(db, "teams"));

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

      const aGD =
        a.goalsFor - a.goalsAgainst;

      const bGD =
        b.goalsFor - b.goalsAgainst;

      return bGD - aGD;

    });


    const table =
      document.querySelector("table");

    if (!table) return;


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

      const row =
        document.createElement("tr");

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

  } catch (error) {

    console.error(
      "Error loading teams:",
      error
    );

  }

}


// ==========================
// UPCOMING FIXTURES
// ==========================

async function loadFixtures() {

  try {

    const fixtureSnapshot =
      await getDocs(
        collection(db, "fixtures")
      );

    const resultSnapshot =
      await getDocs(
        collection(db, "results")
      );


    const playedFixtureIds = new Set();


    resultSnapshot.forEach((resultDoc) => {

      const result =
        resultDoc.data();

      if (result.fixtureId) {

        playedFixtureIds.add(
          result.fixtureId
        );

      }

    });


    const sections =
      document.querySelectorAll("section");

    let fixturesSection = null;


    sections.forEach((section) => {

      const heading =
        section.querySelector("h2");

      if (
        heading &&
        heading.textContent.includes(
          "Upcoming Fixtures"
        )
      ) {

        fixturesSection = section;

      }

    });


    if (!fixturesSection) return;


    fixturesSection.innerHTML = `
      <h2>📅 Upcoming Fixtures</h2>
    `;


    let upcomingCount = 0;


    fixtureSnapshot.forEach((fixtureDoc) => {

      const fixture =
        fixtureDoc.data();


      if (
        playedFixtureIds.has(
          fixtureDoc.id
        )
      ) {

        return;

      }


      upcomingCount++;


      const match =
        document.createElement("p");

      match.innerHTML = `
        📅 <strong>${fixture.date}</strong>
        —
        ${fixture.homeTeam}
        vs
        ${fixture.awayTeam}
      `;


      fixturesSection.appendChild(match);

    });


    if (upcomingCount === 0) {

      fixturesSection.innerHTML +=
        "<p>No upcoming fixtures.</p>";

    }

  } catch (error) {

    console.error(
      "Error loading fixtures:",
      error
    );

  }

}


// ==========================
// LATEST RESULTS
// ==========================

async function loadResults() {

  try {

    const snapshot =
      await getDocs(
        collection(db, "results")
      );


    const resultsList =
      document.getElementById(
        "resultsList"
      );


    if (!resultsList) return;


    resultsList.innerHTML = "";


    if (snapshot.empty) {

      resultsList.innerHTML =
        "<p>No matches played yet.</p>";

      return;

    }


    snapshot.forEach((resultDoc) => {

      const result =
        resultDoc.data();


      const match =
        document.createElement("p");


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

    console.error(
      "Error loading results:",
      error
    );

  }

}


// ==========================
// TOP SCORERS
// ==========================

async function loadScorers() {

  try {

    const snapshot =
      await getDocs(
        collection(db, "scorers")
      );


    const sections =
      document.querySelectorAll("section");

    let scorersSection = null;


    sections.forEach((section) => {

      const heading =
        section.querySelector("h2");

      if (
        heading &&
        heading.textContent.includes(
          "Top Scorers"
        )
      ) {

        scorersSection = section;

      }

    });


    if (!scorersSection) return;


    scorersSection.innerHTML = `
      <h2>🥇 Top Scorers</h2>
    `;


    if (snapshot.empty) {

      scorersSection.innerHTML +=
        "<p>No goals scored yet.</p>";

      return;

    }


    const scorers = [];


    snapshot.forEach((scorerDoc) => {

      const scorer =
        scorerDoc.data();

      scorers.push(scorer);

    });


    scorers.sort((a, b) => {

      return Number(b.goals || 0) -
             Number(a.goals || 0);

    });


    scorers.forEach((scorer, index) => {

      const player =
        document.createElement("p");

      player.innerHTML = `
        🥅 <strong>${index + 1}.</strong>
        ${scorer.playerName}
        —
        ${scorer.team}
        —
        <strong>${scorer.goals} goals</strong>
      `;

      scorersSection.appendChild(player);

    });

  } catch (error) {

    console.error(
      "Error loading top scorers:",
      error
    );

  }

}


// ==========================
// START
// ==========================

loadTeams();

loadFixtures();

loadResults();

loadScorers();
