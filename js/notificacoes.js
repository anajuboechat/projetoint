import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

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

/* ÍCONES */
const iconMap = {
  1: "/assets/images/chat.png",
  2: "/assets/images/notes.png",
  3: "/assets/images/dingobell.png"
};

/* Notificações fechadas localmente */
const closedNotifications = JSON.parse(localStorage.getItem("closedNotifications") || "[]");

/* ================================ */
/*   FUNÇÃO: Mostrar mensagem vazia */
/* ================================ */
function updateEmptyMessage() {
  const list = document.getElementById("notificationList");
  const container = document.querySelector(".notification-container");

  const oldMsg = document.getElementById("emptyMsg");
  if (oldMsg) oldMsg.remove();

  if (list.children.length === 0) {
    const msg = document.createElement("p");
    msg.id = "emptyMsg";
    msg.classList.add("empty-message");
    msg.textContent = "Sem notificações no momento";
    container.appendChild(msg);
  }
}

/* ================================ */
/*       CARREGAR NOTIFICAÇÕES     */
/* ================================ */
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const notifRef = ref(db, "notificacoes");

  try {
    const snapshot = await get(notifRef);
    if (!snapshot.exists()) {
      updateEmptyMessage();
      return;
    }

    const notifications = snapshot.val();
    const list = document.getElementById("notificationList");

    Object.keys(notifications).forEach((id) => {
      const n = notifications[id];

      if (closedNotifications.includes(id)) return;

      const card = document.createElement("div");
      card.classList.add("notification-card");
      card.setAttribute("data-id", id);

      const iconSrc = iconMap[n.icon] || iconMap[1];

      card.innerHTML = `
        <img class="notification-icon" src="${iconSrc}">
        <p class="notification-title">${n.mensagem}</p>
        <span class="notification-date">${n.data}</span>
        <button class="delete-btn"><div class="close-icon"></div></button>
      `;

      card.querySelector(".delete-btn").addEventListener("click", () => {
        card.remove();
        closedNotifications.push(id);
        localStorage.setItem("closedNotifications", JSON.stringify(closedNotifications));
        updateEmptyMessage();
      });

      list.appendChild(card);
    });

    updateEmptyMessage();

  } catch (err) {
    console.error("Erro ao carregar notificações:", err);
    updateEmptyMessage();
  }
});

/* ================================ */
/*   FECHAR TODAS AS NOTIFICAÇÕES  */
/* ================================ */

document.getElementById("closeAllBtn").addEventListener("click", () => {
  const list = document.getElementById("notificationList");

  while (list.firstChild) {
    const id = list.firstChild.getAttribute("data-id");
    if (id && !closedNotifications.includes(id)) {
      closedNotifications.push(id);
    }
    list.removeChild(list.firstChild);
  }

  localStorage.setItem("closedNotifications", JSON.stringify(closedNotifications));

  updateEmptyMessage();
});
