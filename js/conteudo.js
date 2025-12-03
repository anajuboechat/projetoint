// conteudo.js
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


const params = new URLSearchParams(window.location.search);
const topico = params.get("topico");
const area = params.get("area");

document.getElementById("tituloTopico").innerText = topico;


const caminho = `conteudo/${area}/${topico}`;

console.log("Lendo Firebase em:", caminho);


get(ref(db, caminho)).then(snapshot => {
    if (snapshot.exists()) {

        let valor = snapshot.val();

        if (typeof valor === "object" && valor.texto) {
            valor = valor.texto;
        }

        valor = String(valor);

        document.getElementById("textoTopico").innerHTML = valor;

    } else {
        document.getElementById("textoTopico").innerText = "Conteúdo ainda não disponível.";
    }
}).catch(err => {
    console.error("Erro ao carregar:", err);
    document.getElementById("textoTopico").innerText = "Erro ao carregar conteúdo.";
});


document.getElementById("btnQuestoes").onclick = () => {
    window.location.href =
        `questoes.html?topico=${encodeURIComponent(topico)}&area=${encodeURIComponent(area)}`;
};
