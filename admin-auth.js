import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBQIYS4TaMNIokWDCn0EJhlaA6KBxCmyaQ",
  authDomain: "lamu-west-premier-league.firebaseapp.com",
  projectId: "lamu-west-premier-league",
  storageBucket: "lamu-west-premier-league.firebasestorage.app",
  messagingSenderId: "280853181931",
  appId: "1:280853181931:web:8c411d3528bddadd2d15ae"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "login.html";
  }

});
