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


const googleBtn = document.getElementById("googleBtn");
const globalMsg = document.getElementById("global-message");

if (googleBtn) {
  const provider = new GoogleAuthProvider();

  googleBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    globalMsg.textContent = "";
    globalMsg.style.color = "red";

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = ref(db, "usuarios/" + user.uid);
      await set(userRef, {
        email: user.email,
        nome: user.displayName || "",
        username: user.displayName || "",
        avatar: user.photoURL || "",
        criadoEm: new Date().toISOString()
      });

      globalMsg.style.color = "green";
      globalMsg.textContent = "Login com Google realizado com sucesso!";

      sessionStorage.setItem("isLoggedIn", "true");

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 800);

    } catch (error) {
      console.error("Erro no login com Google:", error);
      globalMsg.textContent = "Erro ao fazer login com Google: " + error.message;
    }
  });
}

const submit = document.getElementById("submit");

submit.addEventListener("click", async (event) => {
  event.preventDefault();

  document.getElementById("username-error").textContent = "";
  document.getElementById("email-error").textContent = "";
  document.getElementById("password-error").textContent = "";
  document.getElementById("confirm-error").textContent = "";
  globalMsg.textContent = "";

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm-password").value;

  if (!email) {
    document.getElementById("email-error").textContent = "O email é obrigatório!";
    return;
  }

  if (!username) {
    document.getElementById("username-error").textContent = "O nome de usuário é obrigatório!";
    return;
  }

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

    await set(ref(db, "usuarios/" + user.uid), {
      email,
      username,
      criadoEm: new Date().toISOString()
    });

    globalMsg.style.color = "green";
    globalMsg.textContent = "Usuário cadastrado com sucesso!";

    sessionStorage.setItem("isLoggedIn", "true");

    setTimeout(() => {
      window.location.href = "./preferencia_usuario.html";
    }, 800);

  } catch (error) {
    console.error(error);

    globalMsg.style.color = "red";

    if (error.code === "auth/email-already-in-use") {
      globalMsg.textContent = "Este e-mail já está em uso!";
    } 
    else if (error.code === "auth/invalid-email") {
      globalMsg.textContent = "E-mail inválido!";
    } 
    else {
      globalMsg.textContent = error.message;
    }
  }
});
