import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

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
  const uid = user.uid;

  const notifRef = ref(db, "notificacoes");
  const closedRef = ref(db, `usuarios/${uid}/notificacoesFechadas`);

  try {
    const [notifSnap, closedSnap] = await Promise.all([
      get(notifRef),
      get(closedRef)
    ]);

    const closedNotifications = closedSnap.exists() ? closedSnap.val() : {};
    const notifications = notifSnap.exists() ? notifSnap.val() : {};
    const list = document.getElementById("notificationList");

    /* ================================ */
    /*  ORDENAR NOTIFICAÇÕES POR DATA  */
    /* ================================ */

    const sortedNotifications = Object.keys(notifications).sort((a, b) => {
      const nA = notifications[a];
      const nB = notifications[b];

      const [dA, mA, yA] = nA.data.split("/").map(Number);
      const [dB, mB, yB] = nB.data.split("/").map(Number);

      const dateA = new Date(yA, mA - 1, dA);
      const dateB = new Date(yB, mB - 1, dB);

      return dateB - dateA; // MAIS RECENTE → ANTIGO
    });

    /* ================================ */
    /*  BLOQUEAR NOTIFICAÇÕES FUTURAS  */
    /* ================================ */

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Zerar horas para comparar só o dia

    sortedNotifications.forEach((id) => {
      const n = notifications[id];

      const [d, m, y] = n.data.split("/").map(Number);
      const notifDate = new Date(y, m - 1, d);
      notifDate.setHours(0, 0, 0, 0);

      // 🔥 SE A DATA É DO FUTURO → NÃO EXIBIR
      if (notifDate > now) return;

      // 🔥 Se já foi fechada → não exibir
      if (closedNotifications[id]) return;

      const iconSrc = iconMap[n.icon] || iconMap[1];

      const card = document.createElement("div");
      card.classList.add("notification-card");
      card.setAttribute("data-id", id);

      card.innerHTML = `
        <img class="notification-icon" src="${iconSrc}">
        <p class="notification-title">${n.mensagem}</p>
        <span class="notification-date">${n.data}</span>
        <button class="delete-btn"><div class="close-icon"></div></button>
      `;

      // Botão fechar
      card.querySelector(".delete-btn").addEventListener("click", async () => {
        card.remove();

        await update(closedRef, {
          [id]: true
        });

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
document.getElementById("closeAllBtn").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const uid = user.uid;
  const closedRef = ref(db, `usuarios/${uid}/notificacoesFechadas`);
  const list = document.getElementById("notificationList");

  const updates = {};
  for (const card of Array.from(list.children)) {
    const id = card.getAttribute("data-id");
    updates[id] = true;
    card.remove();
  }

  await update(closedRef, updates);
  updateEmptyMessage();
});
