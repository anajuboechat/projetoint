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
