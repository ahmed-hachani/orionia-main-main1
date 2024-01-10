const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');


if(bar){
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}
if(close){
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

const xhr = new XMLHttpRequest();
xhr.open('GET', '/user-informations');
xhr.responseType = 'json';
xhr.onload = function() {
  console.log(xhr.response);

  document.getElementById('nom').value=xhr.response['lastname']
  document.getElementById('prenom').value=xhr.response['firstname']
  document.getElementById('email').value=xhr.response['email']
  
  switch (xhr.response['subscription_type']) {
    case 1:
      document.getElementById('abonnement').value='Plan Découverte'
      break;
    case 2:
      document.getElementById('abonnement').value='Plan Explorateur'
      break;
    case 3:
      document.getElementById('abonnement').value='Plan Pro'
      break;
    default:
      console.log('Un problème est survenu sur la récupération des informations clients ');
  }
  document.getElementById('date-abonnement').value=xhr.response['subscription_date']

};
xhr.onerror = function() {
  console.error('Une erreur s\'est produite lors de la requête.');
};
xhr.send();
