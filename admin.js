import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
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

console.log("🔥 Firebase connected");


const pageTitle = document.getElementById("pageTitle");
const content = document.getElementById("content");
const menuItems = document.querySelectorAll(".sidebar li");


menuItems.forEach(item => {

    item.addEventListener("click", () => {

        menuItems.forEach(i => i.classList.remove("active"));

        item.classList.add("active");

        const page = item.dataset.page;

        pageTitle.textContent = item.textContent.trim();

        loadPage(page);

    });

});


async function loadPage(page) {

    if (page === "dashboard") {

        content.innerHTML = `
            <div class="card">
                <h3>🏆 LWPL Dashboard</h3>
                <p>Welcome to Lamu West Premier League Admin Panel.</p>
            </div>
        `;

    }


    else if (page === "teams") {

        await showTeams();

    }


    else {

        content.innerHTML = `
            <div class="card">
                <h3>${pageTitle.textContent}</h3>
                <p>This section is coming next.</p>
            </div>
        `;

    }

}


/* =========================
   TEAMS
========================= */

async function showTeams() {

    content.innerHTML = `
        <div class="card">

            <h3>⚽ Teams</h3>

            <br>

            <button id="addTeamBtn">
                ➕ Add Team
            </button>

            <br><br>

            <div id="teamsList">
                Loading teams...
            </div>

        </div>
    `;


    document
        .getElementById("addTeamBtn")
        .addEventListener("click", addTeam);


    await loadTeams();

}


/* =========================
   LOAD TEAMS
========================= */

async function loadTeams() {

    const teamsList = document.getElementById("teamsList");

    try {

        const snapshot = await getDocs(
            collection(db, "teams")
        );


        if (snapshot.empty) {

            teamsList.innerHTML = `
                <p>No teams found.</p>
            `;

            return;

        }


        teamsList.innerHTML = "";


        snapshot.forEach(teamDoc => {

            const team = teamDoc.data();

            teamsList.innerHTML += `

                <div class="card">

                    <h3>${team.name || "Unnamed Team"}</h3>

                    <p>
                        Played: ${team.played || 0}
                    </p>

                    <p>
                        Points: ${team.points || 0}
                    </p>

                    <button onclick="editTeam('${teamDoc.id}', '${team.name || ""}')">
                        ✏️ Edit
                    </button>

                    <button onclick="deleteTeam('${teamDoc.id}')">
                        🗑️ Delete
                    </button>

                </div>

            `;

        });

    }

    catch(error) {

        console.error(error);

        teamsList.innerHTML = `
            <p>❌ Failed to load teams.</p>
            <p>${error.message}</p>
        `;

    }

}


/* =========================
   ADD TEAM
========================= */

async function addTeam() {

    const name = prompt("Enter team name:");

    if (!name) return;


    try {

        await addDoc(
            collection(db, "teams"),
            {
                name: name.trim(),
                played: 0,
                won: 0,
                draw: 0,
                lost: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                points: 0
            }
        );


        alert("✅ Team added successfully!");

        await loadTeams();

    }

    catch(error) {

        console.error(error);

        alert("❌ Error: " + error.message);

    }

}


/* =========================
   EDIT TEAM
========================= */

window.editTeam = async function(id, oldName) {

    const newName = prompt(
        "Enter new team name:",
        oldName
    );

    if (!newName) return;


    try {

        await updateDoc(
            doc(db, "teams", id),
            {
                name: newName.trim()
            }
        );


        alert("✅ Team updated!");

        await loadTeams();

    }

    catch(error) {

        console.error(error);

        alert("❌ Error: " + error.message);

    }

};


/* =========================
   DELETE TEAM
========================= */

window.deleteTeam = async function(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this team?"
    );

    if (!confirmDelete) return;


    try {

        await deleteDoc(
            doc(db, "teams", id)
        );


        alert("✅ Team deleted!");

        await loadTeams();

    }

    catch(error) {

        console.error(error);

        alert("❌ Error: " + error.message);

    }

};


loadPage("dashboard");
