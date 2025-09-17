import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

const firebaseConfig = {

    apiKey: "AIzaSyBN2_GgoK-nXfOxefYlCE9i7PupwrNQkrY",

    authDomain: "medvestplus.firebaseapp.com",

    projectId: "medvestplus",

    storageBucket: "medvestplus.firebasestorage.app",

    messagingSenderId: "261146979409",

    appId: "1:261146979409:web:3388c61d54f7d7f7205c70"

  };

const app = initializeApp(firebaseConfig);



const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

const submit = document.getElementById('submit');
submit.addEventListener("click", function(event){
    event.preventDefault()
    alert(5)
})