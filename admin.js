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

const form = document.getElementById("teamForm");
const teamsList = document.getElementById("teamsList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const team = {
    name: document.getElementById("name").value,
    played: Number(document.getElementById("played").value),
    wins: Number(document.getElementById("wins").value),
    draws: Number(document.getElementById("draws").value),
    losses: Number(document.getElementById("losses").value),
    goalsFor: Number(document.getElementById("goalsFor").value),
    goalsAgainst: Number(document.getElementById("goalsAgainst").value),
    points: Number(document.getElementById("points").value)
  };

  await addDoc(collection(db, "teams"), team);

  alert("Team saved successfully!");
  form.reset();
  loadTeams();
});

async function loadTeams() {
  teamsList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "teams"));

  querySnapshot.forEach((doc) => {
    const team = doc.data();

    teamsList.innerHTML += `
      <p><strong>${team.name}</strong> - ${team.points} pts</p>
    `;
  });
}

loadTeams();
