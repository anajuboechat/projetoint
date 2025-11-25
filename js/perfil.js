  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
  import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

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

  const avatarImage = document.getElementById("avatarImage");
  const fileInput = document.getElementById("fileInput");
  const nameInput = document.getElementById("name");
  const emailDisplay = document.getElementById("emailDisplay");
  const editNameBtn = document.getElementById("editNameBtn");
  const saveAllBtn = document.getElementById("saveAllBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  let uid;

  avatarImage.addEventListener("click", () => fileInput.click());

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "./login.html";
      return;
    }

    uid = user.uid;
    emailDisplay.textContent = user.email;

    try {
      const snap = await get(ref(db, "usuarios/" + uid));
      if (snap.exists()) {
        const data = snap.val();
        if (data.nome) nameInput.value = data.nome;
        if (data.avatar) avatarImage.src = data.avatar;
        if (data.vestibulares) {
          document.querySelectorAll("input[name='vestibulares']").forEach(cb => {
            if (data.vestibulares.includes(cb.value)) cb.checked = true;
          });
        }
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  });

  editNameBtn.addEventListener("click", async () => {
    if (!uid) return;
    const nome = nameInput.value.trim();
    try {
      await update(ref(db, "usuarios/" + uid), { nome });
      alert("Nome atualizado!");
    } catch (error) {
      console.error("Erro ao salvar nome:", error);
    }
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file && uid) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;
        avatarImage.src = base64;
        try {
          await update(ref(db, "usuarios/" + uid), { avatar: base64 });
          alert("Avatar atualizado com sucesso!");
        } catch (error) {
          console.error("Erro ao salvar avatar:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  });

  saveAllBtn.addEventListener("click", async () => {
    if (!uid) return;
    const nome = nameInput.value.trim();
    const vestibulares = Array.from(document.querySelectorAll("input[name='vestibulares']:checked"))
      .map(cb => cb.value);

    try {
      await update(ref(db, "usuarios/" + uid), { nome, vestibulares });
      alert("Perfil salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
  });

  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    sessionStorage.setItem("isLoggedIn", "false");
    sessionStorage.removeItem("visited");
    window.location.href = "./login.html";
  });