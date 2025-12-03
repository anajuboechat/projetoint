import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { 
  getDatabase, 
  ref, 
  get 
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


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


const lista = document.getElementById("listaResultados");
const ctx = document.getElementById("graficoResultados");


function mostrarLoading(show) {
  document.getElementById("loading").classList.toggle("hidden", !show);
}


onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  mostrarLoading(true);

  const uid = user.uid;

  const resultadosRef = ref(db, `usuarios/${uid}/resultados_simulados`);

  try {
    const snap = await get(resultadosRef);
    mostrarLoading(false);

    if (!snap.exists()) {
      lista.innerHTML = "<p>Você ainda não possui resultados registrados.</p>";
      return;
    }

    const dados = snap.val();

    lista.innerHTML = "";

    const labels = [];
    const values = [];

    Object.keys(dados).forEach((id) => {

      const r = dados[id];

      const nomeSimulado = r.nomeSimulado || id;
      const nota = r.nota || r.acertos || 0;
      const data = r.data || "Sem data";

      lista.innerHTML += `
        <div class="item-resultado">
          <h3>${nomeSimulado}</h3>
          <p><strong>Acertos:</strong> ${nota}</p>
          <p><strong>Data:</strong> ${data}</p>
        </div>
      `;

      labels.push(nomeSimulado);
      values.push(nota);
    });

    new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Evolução dos Acertos",
          data: values,
          borderWidth: 3,
          tension: 0.3
        }]
      }
    });

  } catch (err) {
    console.error("Erro ao buscar resultados:", err);
    mostrarLoading(false);
    lista.innerHTML = "<p>Erro ao carregar resultados.</p>";
  }
});
