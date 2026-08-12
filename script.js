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


// ==========================================
// LEAGUE STANDINGS
// ==========================================

async function loadTeams() {

  try {

    const snapshot = await getDocs(
      collection(db, "teams")
    );

    const teams = [];

    snapshot.forEach((teamDoc) => {

      const data = teamDoc.data();

      const goalsFor = Number(data.goalsFor || 0);
      const goalsAgainst = Number(data.goalsAgainst || 0);

      teams.push({

        name: data.name || "Unknown Team",

        played: Number(data.played || 0),

        won: Number(
          data.won ||
          data.wins ||
          0
        ),

        draw: Number(
          data.draw ||
          data.draws ||
          0
        ),

        lost: Number(
          data.lost ||
          data.losses ||
          0
        ),

        goalsFor: goalsFor,

        goalsAgainst: goalsAgainst,

        goalDifference:
          goalsFor - goalsAgainst,

        points: Number(data.points || 0)

      });

    });


    teams.sort((a, b) => {

      if (b.points !== a.points) {
        return b.points - a.points;
      }

      if (b.goalDifference !== a.goalDifference) {
        return b.goalDifference - a.goalDifference;
      }

      return b.goalsFor - a.goalsFor;

    });


    const table = document.querySelector("table");

    if (!table) return;


    table.innerHTML = `

      <tr>
        <th>Pos</th>
        <th>Club</th>
        <th>P</th>
        <th>W</th>
        <th>D</th>
        <th>L</th>
        <th>GF</th>
        <th>GA</th>
        <th>GD</th>
        <th>Pts</th>
      </tr>

    `;


    teams.forEach((team, index) => {

      const row = document.createElement("tr");

      const gd = team.goalDifference;

      const gdText =
        gd > 0 ? `+${gd}` : gd;


      row.innerHTML = `

        <td>${index + 1}</td>

        <td>
          <a href="team.html?team=${encodeURIComponent(team.name)}">
            <strong>${team.name}</strong>
          </a>
        </td>

        <td>${team.played}</td>

        <td>${team.won}</td>

        <td>${team.draw}</td>

        <td>${team.lost}</td>

        <td>${team.goalsFor}</td>

        <td>${team.goalsAgainst}</td>

        <td>${gdText}</td>

        <td>
          <strong>${team.points}</strong>
        </td>

      `;


      table.appendChild(row);

    });

  } catch (error) {

    console.error(
      "League table error:",
      error
    );

  }

}


// ==========================================
// UPCOMING FIXTURES
// ==========================================

async function loadFixtures() {

  try {

    const fixtureSnapshot = await getDocs(
      collection(db, "fixtures")
    );

    const resultSnapshot = await getDocs(
      collection(db, "results")
    );


    const playedFixtureIds = new Set();


    resultSnapshot.forEach((resultDoc) => {

      const result = resultDoc.data();

      if (result.fixtureId) {

        playedFixtureIds.add(
          result.fixtureId
        );

      }

    });


    const section =
      document.getElementById(
        "upcomingFixtures"
      );


    if (!section) return;


    section.innerHTML = `

      <h2>📅 Upcoming Fixtures</h2>

    `;


    let count = 0;


    fixtureSnapshot.forEach((fixtureDoc) => {

      const fixture = fixtureDoc.data();


      if (
        playedFixtureIds.has(
          fixtureDoc.id
        )
      ) {

        return;

      }


      count++;


      const match =
        document.createElement("p");


      match.innerHTML = `

        📅

        <strong>
          ${fixture.date || ""}
        </strong>

        —

        ${fixture.homeTeam || ""}

        vs

        ${fixture.awayTeam || ""}

      `;


      section.appendChild(match);

    });


    if (count === 0) {

      section.innerHTML +=
        "<p>No upcoming fixtures.</p>";

    }

  } catch (error) {

    console.error(
      "Fixtures error:",
      error
    );

  }

}


// ==========================================
// MATCH RESULTS
// ==========================================

async function loadResults() {

  try {

    const snapshot = await getDocs(
      collection(db, "results")
    );


    const list =
      document.getElementById(
        "resultsList"
      );


    if (!list) return;


    list.innerHTML = "";


    const results = [];


    snapshot.forEach((resultDoc) => {

      results.push(
        resultDoc.data()
      );

    });


    if (results.length === 0) {

      list.innerHTML =
        "<p>No match results yet.</p>";

      return;

    }


    results.reverse();


    results.forEach((result) => {

      const match =
        document.createElement("p");


      const home =
        result.homeTeam ||
        result.home ||
        "Home Team";


      const away =
        result.awayTeam ||
        result.away ||
        "Away Team";


      const homeScore =
        Number(
          result.homeScore ||
          result.homeGoals ||
          0
        );


      const awayScore =
        Number(
          result.awayScore ||
          result.awayGoals ||
          0
        );


      match.innerHTML = `

        📅 ${result.date || ""}

        —

        <strong>${home}</strong>

        ${homeScore}

        -

        ${awayScore}

        <strong>${away}</strong>

      `;


      list.appendChild(match);

    });

  } catch (error) {

    console.error(
      "Results error:",
      error
    );

  }

}


// ==========================================
// TOP SCORERS
// ==========================================

async function loadTopScorers() {

  try {

    const snapshot = await getDocs(
      collection(db, "scorers")
    );


    const list =
      document.getElementById(
        "scorersList"
      );


    if (!list) return;


    list.innerHTML = "";


    const scorers = [];


    snapshot.forEach((scorerDoc) => {

      const data = scorerDoc.data();


      scorers.push({

        playerName:
          data.playerName ||
          "Unknown Player",

        team:
          data.team ||
          "Unknown Team",

        goals:
          Number(
            data.goals || 0
          )

      });

    });


    scorers.sort((a, b) => {

      return b.goals - a.goals;

    });


    if (scorers.length === 0) {

      list.innerHTML =
        "<p>No top scorers yet.</p>";

      return;

    }


    scorers.forEach((player, index) => {

      const row =
        document.createElement("p");


      row.innerHTML = `

        <strong>
          ${index + 1}.
          ${player.playerName}
        </strong>

        —

        ${player.team}

        —

        <strong>
          ${player.goals} goals
        </strong>

      `;


      list.appendChild(row);

    });

  } catch (error) {

    console.error(
      "Top scorers error:",
      error
    );


    const list =
      document.getElementById(
        "scorersList"
      );


    if (list) {

      list.innerHTML =
        "<p>Error loading top scorers.</p>";

    }

  }

}


// ==========================================
// LOAD WEBSITE
// ==========================================

async function loadWebsite() {

  await loadTeams();

  await loadFixtures();

  await loadResults();

  await loadTopScorers();

}


loadWebsite();
