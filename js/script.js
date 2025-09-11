const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
sessionStorage.setItem("isLoggedIn", "false");

window.addEventListener("load", () => {
  const splash = document.querySelector(".splash");
  if (!splash) return;

  const visited = sessionStorage.getItem("visited");

  function redirectAccordingToLogin() {
    splash.classList.add("hidden");

    if (isLoggedIn) {
      if (!window.location.pathname.endsWith("index.html")) {
        window.location.href = "/index.html";
      }
    } else {
      if (!window.location.pathname.endsWith("login.html")) {
        window.location.href = "./pages/login.html";
      }
    }
  }

  if (visited) {
    redirectAccordingToLogin();
  } else {
    setTimeout(() => {
      sessionStorage.setItem("visited", "true");
      redirectAccordingToLogin();
    }, 2500);
  }
});

// Animação de carregamento nos links
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const loading = document.getElementById("loading");

    loading.classList.remove("hidden");
    loading.classList.add("fade-in");

    setTimeout(() => {
      window.location.href = this.href;
    }, 1200);
  });
});

// Materiais (Química, Bio, Física)
const materias = {
  quimica: [
    { nome: "Estequiometria", img: "./assets/images/estequiometria.png" },
    { nome: "Química Orgânica", img: "./assets/images/organica.png" },
    { nome: "Físico-Química", img: "./assets/images/fisicoquimica.png" }
  ],
  biologia: [
    { nome: "A Biologia", img: "./assets/images/abiologia.png" },
    { nome: "Moléculas e Células", img: "./assets/images/moleculasecelulas.png" },
    { nome: "Bioquímica", img: "./assets/images/bioquimica.png" }
  ],
  fisica: [
    { nome: "Cinemática", img: "./assets/images/cinematica.png" },
    { nome: "Dinâmica", img: "./assets/images/dinamica.png" },
    { nome: "Eletromagnetismo", img: "./assets/images/eletro.png" }
  ]
};

document.querySelectorAll(".cards a").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    
    const href = this.getAttribute("href");
    const materiaKey = href.split("/").pop().replace(".html", "");

    localStorage.setItem("materiasSelecionadas", JSON.stringify(materias[materiaKey]));
    window.location.href = "./pages/conteudos.html";
  });
});
