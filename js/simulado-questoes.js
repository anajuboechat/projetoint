
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBN2_GgoK-nXfOxefYlCE9i7PupwrNQkrY",
  authDomain: "medvestplus.firebaseapp.com",
  databaseURL: "https://medvestplus-default-rtdb.firebaseio.com",
  projectId: "medvestplus",
  storageBucket: "medvestplus.appspot.com",
  messagingSenderId: "261146979409",
  appId: "1:261146979409:web:3388c61d54f7d7f7205c70"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const navContainer = document.getElementById("questionNav");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");

let questions = [];
let index = 0;
let answers = [];

async function loadQuestions() {
  try {
    const snapshot = await get(ref(db, "Simulados/S1"));
    if (!snapshot.exists()) {
      questionEl.textContent = "Nenhuma questão encontrada.";
      return;
    }

    const data = snapshot.val();

    let todasQuestoes = Object.keys(data)
      .map(key => {
        const q = data[key];
        return {
          id: key,
          enunciado: q.enunciado || "",
          alternativas: q.alternativas || {},
          correta: q.correta || "",
          numero: q.numero || 0
        };
      })
      .sort(() => Math.random() - 0.5); /* embaralhar */

    questions = todasQuestoes;

    answers = Array(questions.length).fill(null);
    createNavButtons();
    renderQuestion();

  } catch (err) {
    console.error("❌ Erro ao carregar questões:", err);
    questionEl.textContent = "Erro ao carregar questões.";
  }
}

function createNavButtons() {
  navContainer.innerHTML = "";
  questions.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.textContent = i + 1;
    btn.addEventListener("click", () => goToQuestion(i));
    navContainer.appendChild(btn);
  });
}

function renderQuestion() {
  const q = questions[index];
  questionEl.textContent = `${index + 1}. ${q.enunciado}`;

  const letras = Object.keys(q.alternativas);

  if (letras.length === 0) {
    optionsEl.innerHTML = "<p style='color:red;'>Sem alternativas cadastradas</p>";
  } else {
    const mapABCD = ["A", "B", "C", "D", "E"];
    optionsEl.innerHTML = letras.map((letra, idx) => `
      <label style="min-width:300px;"> 
        <input type="radio" name="answer" value="${mapABCD[idx]}" ${answers[index] === mapABCD[idx] ? "checked" : ""}>
        ${mapABCD[idx]}) ${q.alternativas[letra]}
      </label>
    `).join("");
  }

  document.querySelectorAll(".question-buttons button").forEach((b, i) => {
    b.classList.toggle("active", i === index);
    b.classList.toggle("answered", answers[i] !== null);
  });

  nextBtn.textContent = index === questions.length - 1 ? "Enviar" : "Próxima";
}

function saveAnswer() {
  const selected = document.querySelector('input[name="answer"]:checked');
  answers[index] = selected ? selected.value : null;
}

nextBtn.addEventListener("click", () => {
  saveAnswer();
  if (index < questions.length - 1) {
    index++;
    renderQuestion();
  } else {
    enviarRespostas();
  }
});

prevBtn.addEventListener("click", () => {
  saveAnswer();
  if (index > 0) {
    index--;
    renderQuestion();
  }
});

function goToQuestion(i) {
  saveAnswer();
  index = i;
  renderQuestion();
}

function enviarRespostas() {
  overlay.classList.remove("hidden");
  overlayText.textContent = "Calculando desempenho...";

  setTimeout(() => {
    let acertos = 0;
    questions.forEach((q, i) => {
      if (answers[i] && answers[i].toUpperCase() === q.correta.toUpperCase()) {
        acertos++;
      }
    });

    overlayText.innerHTML = `✅ Você acertou <strong>${acertos}</strong> de <strong>${questions.length}</strong> questões!<br><br>Voltando à tela inicial...`;

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 3500);
  }, 1500);
}

loadQuestions();
