import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
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

const errorBox = document.getElementById("adminError");

function showError(message) {
  console.error(message);

  if (errorBox) {
    errorBox.innerHTML = `
      <div style="background:#ffdddd;color:#900;padding:10px;border:1px solid red;">
        ${message}
      </div>
    `;
  }
          }
// =======================
// TEAMS
// =======================

const teamForm = document.getElementById("teamForm");
const teamsList = document.getElementById("teamsList");

async function loadTeams() {

  try {

    const snapshot = await getDocs(collection(db, "teams"));

    teamsList.innerHTML = "";

    if (snapshot.empty) {
      teamsList.innerHTML = "<p>No teams found.</p>";
      return;
    }

    snapshot.forEach((teamDoc) => {

      const team = teamDoc.data();

      teamsList.innerHTML += `
        <div class="card">
          <h3>${team.name}</h3>

          <p>Played: ${team.played || 0}</p>
          <p>Won: ${team.won || 0}</p>
          <p>Draw: ${team.draw || 0}</p>
          <p>Lost: ${team.lost || 0}</p>
          <p>GF: ${team.goalsFor || 0}</p>
          <p>GA: ${team.goalsAgainst || 0}</p>
          <p>Points: ${team.points || 0}</p>

          <button onclick="deleteTeam('${teamDoc.id}')">
            Delete
          </button>
        </div>
        <br>
      `;

    });

  } catch (error) {

    showError(error.message);

  }

}

teamForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  try {

    await addDoc(collection(db, "teams"), {

      name: document.getElementById("name").value,
      played: Number(document.getElementById("played").value),
      won: Number(document.getElementById("wins").value),
      draw: Number(document.getElementById("draws").value),
      lost: Number(document.getElementById("losses").value),
      goalsFor: Number(document.getElementById("goalsFor").value),
      goalsAgainst: Number(document.getElementById("goalsAgainst").value),
      points: Number(document.getElementById("points").value)

    });

    teamForm.reset();

    loadTeams();

  } catch (error) {

    showError(error.message);

  }

});

window.deleteTeam = async (id) => {

  if (!confirm("Delete this team?")) return;

  await deleteDoc(doc(db, "teams", id));

  loadTeams();

};
