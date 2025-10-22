import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getDatabase, ref, update, set } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

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

// 🔹 LOGIN COM EMAIL E SENHA
const submit = document.getElementById("submit");

submit.addEventListener("click", async (event) => {
  event.preventDefault();

  document.getElementById("email-error").textContent = "";
  document.getElementById("password-error").textContent = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Atualiza último login
    await update(ref(db, "usuarios/" + user.uid), {
      ultimoLogin: new Date().toISOString()
    });

    sessionStorage.setItem("isLoggedIn", "true");

    const success = document.getElementById("password-error");
    success.className = "success-message";
    success.style.color = "green";
    success.textContent = "Login realizado com sucesso!";

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 800);
  } catch (error) {
    console.error(error);
    document.getElementById("password-error").textContent = "Credenciais incorretas!";
  }
});

// 🔹 LOGIN COM GOOGLE
const googleBtn = document.querySelector(".btn-google");

if (googleBtn) {
  const provider = new GoogleAuthProvider();

  googleBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    emailError.textContent = "";
    passwordError.textContent = "";

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Cria ou atualiza o registro do usuário no Realtime Database
      const userRef = ref(db, "usuarios/" + user.uid);
      await set(userRef, {
        email: user.email,
        nome: user.displayName || "",
        avatar: user.photoURL || "",
        ultimoLogin: new Date().toISOString()
      });

      // Mostra mensagem de sucesso
      passwordError.className = "success-message";
      passwordError.style.color = "green";
      passwordError.textContent = "Login com Google realizado com sucesso!";

      // Define o login ativo e redireciona
      sessionStorage.setItem("isLoggedIn", "true");

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 800);
    } catch (error) {
      console.error("Erro no login com Google:", error);
      passwordError.textContent = "Erro ao fazer login com Google: " + error.message;
    }
  });
}