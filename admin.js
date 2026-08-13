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
  appId: "1:280853181931:web:8c411d3528bddadd2d15ae"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const errorBox = document.getElementById("adminError");

function showError(msg){
  console.error(msg);
  if(errorBox){
    errorBox.innerHTML = `
      <div style="background:#ffdddd;padding:10px;border:1px solid red">
        ${msg}
      </div>`;
  }
}

async function getTeams(){
  const snap = await getDocs(collection(db,"teams"));
  const teams = [];
  snap.forEach(docItem=>{
    teams.push({
      id:docItem.id,
      ...docItem.data()
    });
  });
  return teams;
}

async function loadTeams(){

  const list=document.getElementById("teamsList");
  list.innerHTML="Loading teams...";

  try{

    const teams=await getTeams();

    if(teams.length===0){
      list.innerHTML="No teams found.";
      return;
    }

    list.innerHTML="";

    teams.forEach(team=>{

      list.innerHTML+=`
      <div class="card">
        <b>${team.name}</b><br>
        Played: ${team.played||0}<br>
        Won: ${team.won||0}<br>
        Draw: ${team.draw||0}<br>
        Lost: ${team.lost||0}<br>
        GF: ${team.goalsFor||0}<br>
        GA: ${team.goalsAgainst||0}<br>
        Points: ${team.points||0}
        <br><br>
        <button onclick="deleteTeam('${team.id}')">Delete</button>
      </div><br>
      `;

    });

  }catch(err){
    showError(err.message);
  }

}
 // =========================
// ADD TEAM
// =========================

const addTeamForm = document.getElementById("addTeamForm");

if(addTeamForm){

addTeamForm.addEventListener("submit", async(e)=>{

e.preventDefault();

const teamName=document.getElementById("teamName").value.trim();

if(teamName===""){
alert("Enter team name");
return;
}

try{

await addDoc(collection(db,"teams"),{

name:teamName,
played:0,
won:0,
draw:0,
lost:0,
goalsFor:0,
goalsAgainst:0,
points:0

});

addTeamForm.reset();

loadTeams();

}
catch(err){
showError(err.message);
}

});

}



// =========================
// DELETE TEAM
// =========================

window.deleteTeam=async(id)=>{

const ok=confirm("Delete this team?");

if(!ok) return;

try{

await deleteDoc(doc(db,"teams",id));

loadTeams();

}
catch(err){
showError(err.message);
}

};



// =========================
// PLAYERS SECTION
// =========================

async function loadPlayers(){

const list=document.getElementById("playersList");

if(!list) return;

list.innerHTML="Loading players...";

try{

const snap=await getDocs(collection(db,"players"));

if(snap.empty){

list.innerHTML="No players found.";

return;

}

list.innerHTML="";

snap.forEach(player=>{

const p=player.data();

list.innerHTML+=`

<div class="card">

<b>${p.name}</b><br>

Team: ${p.team}<br>

Number: ${p.number}<br>

Position: ${p.position}<br>

Captain: ${p.captain?"Yes":"No"}<br>

Starter: ${p.starting?"Yes":"No"}

<br><br>

<button onclick="deletePlayer('${player.id}')">
Delete
</button>

</div><br>

`;

});

}
catch(err){
showError(err.message);
}

                  }        
// =========================
// ADD PLAYER
// =========================

const addPlayerForm = document.getElementById("addPlayerForm");

if (addPlayerForm) {

  addPlayerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

      await addDoc(collection(db, "players"), {

        name: document.getElementById("playerName").value.trim(),
        team: document.getElementById("playerTeam").value,
        number: Number(document.getElementById("playerNumber").value),
        position: document.getElementById("playerPosition").value,
        starting: document.getElementById("playerStarting").checked,
        captain: document.getElementById("playerCaptain").checked

      });

      addPlayerForm.reset();

      loadPlayers();

    } catch (err) {

      showError(err.message);

    }

  });

}



// =========================
// DELETE PLAYER
// =========================

window.deletePlayer = async (id) => {

  const ok = confirm("Delete this player?");

  if (!ok) return;

  try {

    await deleteDoc(doc(db, "players", id));

    loadPlayers();

  } catch (err) {

    showError(err.message);

  }

};



// =========================
// PAGE LOAD
// =========================

window.addEventListener("load", () => {

  loadTeams();

  loadPlayers();

});
