import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

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

let uid = null;

onAuthStateChanged(auth, (user) => {
  if (user) uid = user.uid;
  else window.location.href = "../login.html";
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("categoriaForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const materia = document.getElementById("titulo").value.trim().toLowerCase();
    const disciplina = document.getElementById("tipo").value;

    if (!materia) {
      alert("Digite um nome para a Matéria!");
      return;
    }

    const materiaRef = ref(
      db,
      `usuarios/${uid}/categoria/${disciplina}/${materia}`
    );

    const idMateriaRef = push(materiaRef);

    await set(idMateriaRef, {
      id: idMateriaRef.key,
      criadoEm: new Date().toISOString()
    });

    await set(
      ref(db, `usuarios/${uid}/categoria/${disciplina}/${materia}/flashcards`),
      {}
    );

    window.location.href = "flashcards.html";
  });
});