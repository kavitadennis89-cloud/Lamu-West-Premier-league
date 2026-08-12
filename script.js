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

      const goalsFor =
        Number(data.goalsFor || 0);

      const goalsAgainst =
        Number(data.goalsAgainst || 0);

      const goalDifference =
        goalsFor - goalsAgainst;


      teams.push({

        name:
          data.name || "Unknown Team",

        played:
          Number(data.played || 0),

        won:
          Number(
            data.won || data.wins || 0
          ),

        draw:
          Number(
            data.draw || data.draws || 0
          ),

        lost:
          Number(
            data.lost || data.losses || 0
          ),

        goalsFor:
          goalsFor,

        goalsAgainst:
          goalsAgainst,

        goalDifference:
          goalDifference,

        points:
          Number(data.points || 0)

      });

    });


    // ==========================
    // SORT TABLE
    // ==========================

    teams.sort((a, b) => {

      // First: Points

      if (b.points !== a.points) {

        return b.points - a.points;

      }


      // Second: Goal Difference

      if (
        b.goalDifference !==
        a.goalDifference
      ) {

        return (
          b.goalDifference -
          a.goalDifference
        );

      }


      // Third: Goals For

      return (
        b.goalsFor -
        a.goalsFor
      );

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
        <th>GF</th>
        <th>GA</th>
        <th>GD</th>
        <th>Pts</th>

      </tr>

    `;


    teams.forEach((team, index) => {

      const row =
        document.createElement("tr");


      const gd =
        team.goalDifference;


      const gdText =
        gd > 0
          ? `+${gd}`
          : gd;


      row.innerHTML = `

        <td>
          ${index + 1}
        </td>

        <td>
          <strong>
            ${team.name}
          </strong>
        </td>

        <td>
          ${team.played}
        </td>

        <td>
          ${team.won}
        </td>

        <td>
          ${team.draw}
        </td>

        <td>
          ${team.lost}
        </td>

        <td>
          ${team.goalsFor}
        </td>

        <td>
          ${team.goalsAgainst}
        </td>

        <td>
          ${gdText}
        </td>

        <td>
          <strong>
            ${team.points}
          </strong>
        </td>

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


    const playedFixtureIds =
      new Set();


    resultSnapshot.forEach(
      (resultDoc) => {

        const result =
          resultDoc.data();


        if (result.fixtureId) {

          playedFixtureIds.add(
            result.fixtureId
          );

        }

      }
    );


    const fixturesSection =
      document.getElementById(
        "upcomingFixtures"
      );


    if (!fixturesSection) return;


    fixturesSection.innerHTML = `

      <h2>
        📅 Upcoming Fixtures
      </h2>

    `;


    let upcomingCount = 0;


    fixtureSnapshot.forEach(
      (fixtureDoc) => {

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

          📅 <strong>
            ${fixture.date}
          </strong>

          —

          ${fixture.homeTeam}

          vs

          ${fixture.awayTeam}

        `;


        fixturesSection.appendChild(
          match
        );

      }
    );


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
// MATCH RESULTS
// ==========================

async function loadResults
