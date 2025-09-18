import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyBN2_GgoK-nXfOxefYlCE9i7PupwrNQkrY",

    authDomain: "medvestplus.firebaseapp.com",

    projectId: "medvestplus",

    storageBucket: "medvestplus.firebasestorage.app",

    messagingSenderId: "261146979409",

    appId: "1:261146979409:web:3388c61d54f7d7f7205c70"

  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

submit.addEventListener("click", function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("logado!");
    })
    .catch((error) => {
      alert(error.message);
    });
});
