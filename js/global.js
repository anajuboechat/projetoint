import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBN2_GgoK-nXfOxefYlCE9i7PupwrNQkrY",
  authDomain: "medvestplus.firebaseapp.com",
  projectId: "medvestplus",
  storageBucket: "medvestplus.firebasestorage.app",
  messagingSenderId: "261146979409",
  appId: "1:261146979409:web:3388c61d54f7d7f7205c70",
  databaseURL: "https://medvestplus-default-rtdb.firebaseio.com" // 🔹 adicione sua URL do Realtime Database
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const submit = document.getElementById("submit");

submit.addEventListener("click", async (event) => {
  event.preventDefault();

  document.getElementById("email-error").textContent = "";
  document.getElementById("password-error").textContent = "";
  document.getElementById("confirm-error").textContent = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm-password").value;

  if (password !== confirm) {
    document.getElementById("confirm-error").textContent = "As senhas não coincidem!";
    return;
  }

  if (password.length < 6) {
    document.getElementById("password-error").textContent = "A senha deve ter 6 ou mais caracteres!";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Salva o usuário diretamente no Realtime Database
    await set(ref(db, "usuarios/" + user.uid), {
      email: email,
      criadoEm: new Date().toISOString()
    });

    document.getElementById("email-error").style.color = "green";
    document.getElementById("email-error").textContent = "Usuário cadastrado com sucesso!";

    setTimeout(() => {
      window.location.href = "../pages/login.html";
    }, 1000);
  } catch (error) {
    console.error(error);
    if (error.code === "auth/email-already-in-use") {
      document.getElementById("email-error").textContent = "Este e-mail já está em uso!";
    } else if (error.code === "auth/invalid-email") {
      document.getElementById("email-error").textContent = "E-mail inválido!";
    } else {
      document.getElementById("email-error").textContent = error.message;
    }
  }
});