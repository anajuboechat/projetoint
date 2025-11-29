import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { 
  getDatabase, 
  ref, 
  get, 
  set 
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

let uid = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
  } else {
    showToast("Você precisa estar logado!");
    setTimeout(() => {
      window.location.href = "../login/login.html";
    }, 1000);
  }
});

// -----------------------------
//     ⭐ SISTEMA DE TOAST ⭐
// -----------------------------
function showToast(message) {
  const overlay = document.getElementById("toastOverlay");
  const toastMessage = document.getElementById("toastMessage");

  toastMessage.textContent = message;

  overlay.classList.remove("hidden");

  setTimeout(() => overlay.classList.add("show"), 15);

  setTimeout(() => {
    overlay.classList.remove("show");
    setTimeout(() => overlay.classList.add("hidden"), 300);
  }, 2500);
}
// -----------------------------

const params = new URLSearchParams(window.location.search);
const topico = params.get("topico");
const area = params.get("area");

document.getElementById("tituloTopico").innerText = topico;

let questoes = [];
let index = 0;
let alternativaSelecionada = null;
let acertos = 0;
let erros = 0;

let jaContabilizadaAgora = false;  // ⭐ NOVO FLAG — evita contar múltiplas vezes sem trocar de questão

const letras = ["A", "B", "C", "D", "E"];

function getIndiceCorreto(correta) {
  if (typeof correta === "number") return correta;
  if (typeof correta === "string") return letras.indexOf(correta.toUpperCase());
  return -1;
}

function processarEnunciado(texto) {
  const regexImagem = /!\[\]\((https:\/\/enem\.dev\/[^\)]+)\)/g;

  return texto.replace(regexImagem, (match, url) => {
    return `
      <br>
      <img src="${url}" alt="Imagem da questão" style="max-width: 100%; margin: 12px 0;">
      <br>
    `;
  });
}

async function carregar() {
  const caminho = `questoes/${area}/${topico}`;

  const snapshot = await get(ref(db, caminho));

  if (!snapshot.exists()) {
    document.getElementById("textoQuestao").innerText = "Nenhuma questão encontrada.";
    return;
  }

  questoes = Object.values(snapshot.val());
  mostrarQuestao();
  atualizarProgresso();
}

function mostrarQuestao() {
  alternativaSelecionada = null;
  jaContabilizadaAgora = false; // ⭐ RESETA AO TROCAR DE QUESTÃO

  const q = questoes[index];
  const enunciadoHTML = processarEnunciado(q.enunciado);

  document.getElementById("textoQuestao").innerHTML = `${index + 1}) ${enunciadoHTML}`;

  const areaAlt = document.getElementById("alternativas");
  areaAlt.innerHTML = "";

  q.alternativas.forEach((texto, i) => {
    const div = document.createElement("div");
    div.className = "alternativa";
    div.innerText = `${letras[i]}) ${texto}`;
    div.onclick = () => selecionarAlternativa(i, div);
    areaAlt.appendChild(div);
  });

  document.getElementById("resultadoResposta").innerHTML = "";
}

function selecionarAlternativa(i, div) {
  alternativaSelecionada = i;
  document.querySelectorAll(".alternativa").forEach(a =>
    a.classList.remove("selecionada")
  );
  div.classList.add("selecionada");
}

document.getElementById("btnProxima").onclick = () => {
  if (index < questoes.length - 1) {
    index++;
    mostrarQuestao();
    atualizarProgresso();
  }
};

document.getElementById("btnAnterior").onclick = () => {
  if (index > 0) {
    index--;
    mostrarQuestao();
    atualizarProgresso();
  }
};

document.getElementById("btnConfirmar").onclick = async () => {
  if (alternativaSelecionada === null) {
    showToast("Selecione uma alternativa!");
    return;
  }

  const idQuestao = index;
  const caminhoResposta = `usuarios/${uid}/respostas/${area}/${topico}/${idQuestao}`;

  const jaRespondida = await get(ref(db, caminhoResposta));

  const corretaIndice = getIndiceCorreto(questoes[index].correta);
  const corretaLetra = letras[corretaIndice];

  const acertou = alternativaSelecionada === corretaIndice;
  const div = document.getElementById("resultadoResposta");

  // ⭐⭐ CONTAGEM CONTROLADA ⭐⭐
  if (!jaContabilizadaAgora) {
    if (acertou) acertos++;
    else erros++;

    jaContabilizadaAgora = true; // impede contagem dupla sem mudar de questão
  }

  atualizarProgresso();

  if (acertou) {
    div.innerHTML = `<p style="color:green">✔ Acertou! (${corretaLetra})</p>`;
  } else {
    div.innerHTML = `<p style="color:red">✘ Errou! (${corretaLetra})</p>`;
  }

  // Se já respondeu antes → não salva novamente
  if (jaRespondida.exists()) {
    div.innerHTML += `<p style="color:#555; margin-top:6px;">⚠ Você já respondeu esta questão antes.</p>`;
    return;
  }

  // Primeira resposta salva no Firebase
  await set(ref(db, caminhoResposta), {
    acertou,
    alternativa: letras[alternativaSelecionada],
    correta: corretaLetra,
    timestamp: Date.now()
  });
};

function atualizarProgresso() {
  document.getElementById("progresso").innerText =
    `Questão ${index + 1} de ${questoes.length} — ✔ ${acertos} | ✘ ${erros}`;
}

carregar();
