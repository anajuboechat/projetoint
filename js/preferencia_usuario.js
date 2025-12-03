import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBN2_GgoK-nXfOxefYlCE9i7PupwrNQkrY",
  authDomain: "medvestplus.firebaseapp.com",
  projectId: "medvestplus",
  storageBucket: "medvestplus.firebasestorage.app",
  messagingSenderId: "261146979409",
  appId: "1:261146979409:web:3388c61d54f7d7f7205c70",
  databaseURL: "https://medvestplus-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


const cards = document.querySelectorAll(".card");

cards.forEach(card => {
  card.addEventListener("click", () => {
    card.classList.toggle("selected");
  });
});

document.getElementById("continuarBtn").addEventListener("click", () => {


  const selecionadas = [];
  document.querySelectorAll(".card.selected").forEach(card => {
    const name = card.dataset.name || card.querySelector("span").textContent.trim();
    selecionadas.push(name);
  });

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("Você precisa estar logado.");
      return;
    }

    const uid = user.uid;

    set(ref(db, `usuarios/${uid}/preferencias/universidades`), selecionadas)
      .then(() => {
        window.location.href = "../index.html";
      })
      .catch(err => {
        console.error("Erro ao salvar:", err);
        alert("Erro ao salvar preferências.");
      });
  });
});
