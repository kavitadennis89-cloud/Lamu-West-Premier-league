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


const fixturesList =
  document.getElementById("fixturesList");


async function loadFixtures() {

  try {

    const snapshot = await getDocs(
      collection(db, "fixtures")
    );


    fixturesList.innerHTML = "";


    if (snapshot.empty) {

      fixturesList.innerHTML =
        "<p>No upcoming fixtures available.</p>";

      return;

    }


    snapshot.forEach((fixtureDoc) => {

      const fixture =
        fixtureDoc.data();


      const date =
        fixture.date || "Date TBA";


      const homeTeam =
        fixture.homeTeam || "Home Team";


      const awayTeam =
        fixture.awayTeam || "Away Team";


      const fixtureCard =
        document.createElement("div");


      fixtureCard.className =
        "fixture";


      fixtureCard.innerHTML = `

        <div class="fixture-date">

          📅 ${date}

        </div>


        <div class="teams">

          <strong>
            ${homeTeam}
          </strong>

          <span class="vs">
            VS
          </span>

          <strong>
            ${awayTeam}
          </strong>

        </div>

      `;


      fixturesList.appendChild(
        fixtureCard
      );

    });

  }


  catch (error) {

    console.error(
      "Error loading fixtures:",
      error
    );


    fixturesList.innerHTML =

      "<p>Error loading fixtures.</p>";

  }

}


loadFixtures();
