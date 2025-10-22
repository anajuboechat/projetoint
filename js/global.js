import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
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

// 🔹 BOTÃO "Continue com Google"
const googleBtn = document.getElementById("googleBtn");

if (googleBtn) {
  const provider = new GoogleAuthProvider();

  googleBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const emailError = document.getElementById("email-error");
    emailError.textContent = "";
    emailError.style.color = "red";

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Salva no Realtime Database caso ainda não exista
      const userRef = ref(db, "usuarios/" + user.uid);
      await set(userRef, {
        email: user.email,
        nome: user.displayName || "",
        avatar: user.photoURL || "",
        criadoEm: new Date().toISOString()
      });

      // Mostra mensagem de sucesso
      emailError.style.color = "green";
      emailError.textContent = "Login com Google realizado com sucesso!";

      // 🔹 Define o login ativo na sessão
      sessionStorage.setItem("isLoggedIn", "true");

      // 🔹 Redireciona para a página inicial
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 800);
    } catch (error) {
      console.error("Erro no login com Google:", error);
      emailError.textContent = "Erro ao fazer login com Google: " + error.message;
    }
  });
}

// 🔹 Cadastro com e-mail e senha
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

    const emailError = document.getElementById("email-error");
    emailError.style.color = "green";
    emailError.textContent = "Usuário cadastrado com sucesso!";

    // 🔹 Define o login ativo e redireciona
    sessionStorage.setItem("isLoggedIn", "true");

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 800);
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
