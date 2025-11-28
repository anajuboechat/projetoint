let isLoggedIn = sessionStorage.getItem("isLoggedIn");

if (isLoggedIn === null) {
  sessionStorage.setItem("isLoggedIn", "false");
  isLoggedIn = false;
} else {
  isLoggedIn = (isLoggedIn === "true");
}

// Detecta QUAL ÁREA o usuário escolheu
document.querySelectorAll(".cards a").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const area = this.getAttribute("data-area"); // quimica / biologia / fisica

    // ARMAZENA PARA AS OUTRAS PÁGINAS
    localStorage.setItem("areaSelecionada", area);

    // REDIRECIONA PARA A PÁGINA DA ÁREA
    window.location.href = `./pages/conteudos_${area}.html`;
  });
});

window.addEventListener("load", () => {
  const splash = document.querySelector(".splash");
  if (!splash) return;

  const visited = sessionStorage.getItem("visited");

  function redirectAccordingToLogin() {
    splash.classList.add("hidden");

    if (isLoggedIn) {
      if (!window.location.pathname.endsWith("index.html") && 
          !window.location.pathname.endsWith("/")) {
        window.location.href = "/index.html";
      }
    } else {
      if (!window.location.pathname.endsWith("home.html") && 
          !window.location.pathname.endsWith("login.html") &&
          !window.location.pathname.endsWith("signin.html")) {
        window.location.href = "./pages/home.html";
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
