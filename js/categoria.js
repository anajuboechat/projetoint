import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

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

const params = new URLSearchParams(window.location.search);
const nome = params.get("nome");
const tipo = params.get("tipo");
document.getElementById("categoryTitle").textContent = nome;

const addBtn = document.getElementById("addFlashcardBtn");
addBtn.href = `novoflashcard.html?nome=${encodeURIComponent(nome)}&tipo=${encodeURIComponent(tipo)}`;

const container = document.getElementById("flashcardContainer");
let flashcards = [];
let currentIndex = 0;

let correct = 0;
let wrong = 0;

let UID = null;

onAuthStateChanged(auth, (user) => {
  if (!user) return;
  UID = user.uid;

  const refCards = ref(db, `usuarios/${UID}/categoria/${tipo}/${nome}/flashcards`);

  onValue(refCards, (snap) => {
    const data = snap.val() || {};
    flashcards = Object.entries(data).map(([id, item]) => ({ _id: id, ...item }));

    currentIndex = 0;
    renderFlashcard(currentIndex);
  });
});

function openConfirm(message, onConfirm) {
  const backdrop = document.getElementById("confirmBackdrop");
  const txt = document.getElementById("confirmText");
  txt.textContent = message;
  backdrop.classList.add("show");

  const yes = document.getElementById("confirmYes");
  const no = document.getElementById("confirmNo");

  const cleanup = () => {
    backdrop.classList.remove("show");
    yes.onclick = null;
    no.onclick = null;
  };

  yes.onclick = async () => {
    try {
      await onConfirm();
    } catch (err) {
      console.error(err);
    } finally {
      cleanup();
    }
  };
  no.onclick = cleanup;
}

function renderFlashcard(index) {
  container.innerHTML = "";

  if (flashcards.length === 0) {
    container.innerHTML = "<p>Não há flashcards nesta categoria.</p>";
    return;
  }

  const fc = flashcards[index];

  const div = document.createElement("div");
  div.className = "flashcard";

  div.innerHTML = `
    <div class="flashcard-inner">
      <div class="flashcard-front">${fc.frente}</div>
      <div class="flashcard-back">${fc.verso}</div>
    </div>
    <div class="hover-icon left">✖</div>
    <div class="hover-icon right">✔</div>
  `;

  const del = document.createElement("div");
  del.className = "delete-x-square-flash";
  del.innerHTML = "✖";
  del.addEventListener("click", (e) => {
    e.stopPropagation();
    openConfirm("Excluir este flashcard?", async () => {
      await remove(ref(db, `usuarios/${UID}/categoria/${tipo}/${nome}/flashcards/${fc._id}`));
      flashcards.splice(currentIndex, 1);
      if (flashcards.length === 0) {
        container.innerHTML = "<p>Não há flashcards nesta categoria.</p>";
        return;
      }
      currentIndex = currentIndex % flashcards.length;
      renderFlashcard(currentIndex);
    });
  });

  div.appendChild(del);

  div.addEventListener("click", (e) => {
    if (Math.abs(e.offsetX - div.offsetWidth / 2) < 200) {
      div.classList.toggle("is-flipped");
    }
  });

  div.addEventListener("mousemove", (e) => {
    const rect = div.getBoundingClientRect();
    const mid = rect.left + rect.width / 2;
    const diff = e.clientX - mid;
    const maxTilt = 8;

    let tilt = 0;
    const dist = Math.abs(diff);
    if (dist > 100) {
      const factor = (dist - 100) / (rect.width / 2 - 100);
      tilt = Math.sign(diff) * Math.min(maxTilt, factor * maxTilt);
    }

    div.style.transform = `rotate(${tilt}deg)`;
  });

  div.addEventListener("mouseleave", () => {
    div.style.transform = "rotate(0deg)";
  });

  let startX = 0;
  let dragging = false;

  div.addEventListener("mousedown", (e) => {
    dragging = true;
    startX = e.clientX;
    div.style.transition = "none";
  });

  document.addEventListener("mouseup", (e) => {
    if (!dragging) return;
    dragging = false;
    div.style.transition = "transform 0.3s";

    const dx = e.clientX - startX;

    if (dx > 100) {
      div.classList.add("throw-right");
      setTimeout(() => {
        correct++;
        document.getElementById("correctCount").textContent = correct;
        nextFlashcard();
      }, 300);
    } else if (dx < -100) {
      div.classList.add("throw-left");
      setTimeout(() => {
        wrong++;
        document.getElementById("wrongCount").textContent = wrong;
        nextFlashcard();
      }, 300);
    } else {
      div.style.transform = "translateX(0) rotate(0)";
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const tilt = Math.max(-10, Math.min(10, dx / 15));
    div.style.transform = `translateX(${dx}px) rotate(${tilt}deg)`;
  });

  container.appendChild(div);
}

function nextFlashcard() {
  if (flashcards.length === 0) return;
  currentIndex = (currentIndex + 1) % flashcards.length;
  renderFlashcard(currentIndex);
}

document.getElementById("prevBtn").addEventListener("click", () => {
  if (flashcards.length === 0) return;
  currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
  renderFlashcard(currentIndex);
});

document.getElementById("nextBtn").addEventListener("click", nextFlashcard);