// Fonction pour récupérer la valeur d'une cookie
function getCookie(name) {
  let value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
}

// Récupérez la valeur du cookie sécurisé contenant le JWT
let jwt = getCookie("access_token");

// Stockez le JWT dans le stockage local
localStorage.setItem("jwt", jwt);

// Accédez au JWT stocké pour les demandes futures à l'API
fetch("http://localhost:8000/", {
  headers: {
    "Authorization": `Bearer ${jwt}`
  }
})
  .then(response => response.json())
  .then(data => console.log(data));



var passwordSpan=document.getElementById('forgot-password');


passwordSpan.addEventListener('click', function() {

  document.getElementById('from-connexion').style.display='none';
  document.getElementById('form-password').style.display='block';

});


/*
var passwordReset=document.getElementById('mail-reset');


passwordReset.addEventListener('click', function() {
  alert("vous allez recevoir un mail ...")
  document.getElementById('from-connexion').style.display='block';
  document.getElementById('form-password').style.display='none';

});

*/
