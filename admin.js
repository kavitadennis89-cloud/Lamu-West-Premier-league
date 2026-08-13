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
         
