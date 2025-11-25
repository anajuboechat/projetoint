import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

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

const params = new URLSearchParams(window.location.search);
const disciplina = params.get("tipo");
const idMateria = params.get("id");
const nomeMateria = params.get("nome");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("flashcardForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const frente = document.getElementById("front").value.trim();
    const verso = document.getElementById("back").value.trim();

    if (!frente || !verso) {
      alert("Preencha frente e verso!");
      return;
    }

    onAuthStateChanged(auth, async (user) => {
      if (!user) return alert("Você precisa estar logado!");

      const flashcardsRef = ref(
        db,
        `usuarios/${user.uid}/categoria/${disciplina}/${nomeMateria}/flashcards`
      );

      const snapshot = await get(flashcardsRef);
      const data = snapshot.exists() ? snapshot.val() : {};

      // Gera ID sequencial
      const count = Object.keys(data).length + 1;
      const idFlashcard = `flashcard_${String(count).padStart(3, "0")}`;

      await set(ref(
        db,
        `usuarios/${user.uid}/categoria/${disciplina}/${nomeMateria}/flashcards/${idFlashcard}`
      ), {
        id: idFlashcard,
        frente,
        verso
      });

      window.location.href =
        `categoria.html?nome=${nomeMateria}&id=${idMateria}&tipo=${disciplina}`;
    });
  });
});