window.addEventListener("load", () => {
  const splash = document.querySelector(".splash");
  if (splash) {
    const visited = sessionStorage.getItem("visited");
    if (visited) {
      splash.classList.add("hidden");
    } else {
      setTimeout(() => {
        splash.classList.add("hidden");
        sessionStorage.setItem("visited", "true");
      }, 2500);
    }
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

const materias = {
  quimica: [
    { nome: "Estequiometria", img: "./assets/images/estequiometria.png" },
    { nome: "Química Orgânica", img: "./assets/images/organica.png" },
    { nome: "Físico-Química", img: "./assets/images/fisicoquimica.png" }
  ],
  biologia: [
    { nome: "A Biologia", img: "./assets/images/abiologia.png" },
    { nome: "Moléculas e Células", img: "./assets/images/moleculasecelulas.png" },
    { nome: "Bioquímica", img: "./assets/images/bioquimica.png" },
    { nome: "Diversidade Biológica", img: "./assets/images/abiologia.png" },
    { nome: "Genética", img: "./assets/images/moleculasecelulas.png" },
    { nome: "Ecologia", img: "./assets/images/bioquimica.png" },
    { nome: "A Biologia", img: "./assets/images/abiologia.png" },
    { nome: "Moléculas e Células", img: "./assets/images/moleculasecelulas.png" },
    { nome: "Bioquímica", img: "./assets/images/bioquimica.png" },
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
