import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { 
  getDatabase, 
  ref, 
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

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
const db = getDatabase(app);
const auth = getAuth(app);

const tipos = ["quimica", "biologia", "fisica"];
const nomes = { quimica:"Química", biologia:"Biologia", fisica:"Física" };

let UID = null;

onAuthStateChanged(auth, (user) => {
  if (!user) return window.location.href = "../login.html";
  UID = user.uid;
  carregarCategorias();
});

function carregarCategorias() {
  onValue(ref(db, `usuarios/${UID}/categoria`), (snapshot) => {
    const dados = snapshot.val() || {};
    renderCategorias(dados);
  });
}

function renderCategorias(dados) {
  const page = document.querySelector(".flashcards-page");
  document.querySelectorAll(".flashcards-category").forEach(x => x.remove());

  tipos.forEach(tipo => {
    const bloco = document.createElement("div");
    bloco.className = "flashcards-category";
    bloco.innerHTML = `
      <div class='category-header'><h3>${nomes[tipo]}</h3></div>
      <div class='flashcards-container'></div>
    `;
    page.appendChild(bloco);

    const container = bloco.querySelector(".flashcards-container");

    if (!dados[tipo]) return;

    Object.entries(dados[tipo]).forEach(([materiaNome, materiaObj]) => {
      const idMateria = Object.keys(materiaObj)[0];

      const div = document.createElement("div");
      div.className = "category-card";

      const title = document.createElement("div");
      title.textContent = materiaNome;
      title.style.pointerEvents = "none";

      const del = document.createElement("div");
      del.className = "delete-x-square";
      del.innerHTML = "✖";

      del.addEventListener("click", (ev) => {
        ev.stopPropagation();
        openConfirm(`Excluir a matéria "${materiaNome}" e todos os flashcards?`, async () => {
          await remove(ref(db, `usuarios/${UID}/categoria/${tipo}/${materiaNome}`));
        });
      });

      div.appendChild(title);
      div.appendChild(del);

      div.addEventListener("click", () => {
        window.location.href =
          `categoria.html?nome=${encodeURIComponent(materiaNome)}&id=${idMateria}&tipo=${tipo}`;
      });

      container.appendChild(div);
    });
  });
}

function openConfirm(message, onConfirm) {
  const backdrop = document.getElementById("confirmBackdrop");
  const txt = document.getElementById("confirmText");
  txt.textContent = message;
  backdrop.classList.add("show");

  const btnYes = document.getElementById("confirmYes");
  const btnNo = document.getElementById("confirmNo");

  const cleanup = () => {
    backdrop.classList.remove("show");
    btnYes.onclick = null;
    btnNo.onclick = null;
  };

  btnYes.onclick = async () => {
    try {
      await onConfirm();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    } finally {
      cleanup();
    }
  };

  btnNo.onclick = cleanup;
}