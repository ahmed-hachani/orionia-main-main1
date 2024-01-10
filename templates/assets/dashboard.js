const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

const container = document.getElementById('element-image-drop');
const containerWidth = container.offsetWidth;
const containerHeight = container.offsetHeight;

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


const colorBoxes = document.querySelectorAll('.color-box');

colorBoxes.forEach((box) => {
  box.addEventListener('click', (event) => {
    colorBoxes.forEach((box) => {
      box.classList.remove('active');
    });
    event.target.classList.add('active');
  });
});


const imgChoiceRoom = document.querySelectorAll('.room-type-img');

imgChoiceRoom.forEach((box) => {
  box.addEventListener('click', (event) => {
    imgChoiceRoom.forEach((box) => {
      box.classList.remove('room-type-img-clicked');
    });
    event.target.classList.add('room-type-img-clicked');
  });
});

const imgChoiceStyle = document.querySelectorAll('.style-type-img');

imgChoiceStyle.forEach((box) => {
  box.addEventListener('click', (event) => {
    imgChoiceStyle.forEach((box) => {
      box.classList.remove('style-type-img-clicked');
    });
    event.target.classList.add('style-type-img-clicked');
  });
});

function sendAvisPos(){

    const isLiked = true; // Remplacez "true" par la valeur booléenne correspondant au choix de l'utilisateur
    const formData = new FormData();
    formData.append('isLiked', true);
   fetch('/picture-evalutation', {
        method: 'POST',
        body: formData
    })
   document.getElementById('divButtonLike').style.display='none';

}

function sendAvisNeg(){
    const isLiked = false; // Remplacez "true" par la valeur booléenne correspondant au choix de l'utilisateur
    const formData = new FormData();
    formData.append('isLiked', false);
   fetch('/picture-evalutation', {
        method: 'POST',
        body: formData
    })

   document.getElementById('divButtonLike').style.display='none';

  
}



function showIMG(){
    fetch('/showimage')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then(blob => {
          const image = URL.createObjectURL(blob);
          const imgElement = document.getElementById('generated');
          const container = document.getElementById('element-image-drop-2');
          const imgDownload =document.getElementById('download');

          //document.getElementById('loader').style.display='none';
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            document.getElementById('generated').style.width = `${containerWidth}px`;
            document.getElementById('generated').style.height = `${containerHeight}px`;
            document.getElementById('divButtonLike').style.display='block';
          document.getElementById('generated').style.display='block';
          document.getElementById('generated').style.width=document.getElementById('preview').style.width;
          document.getElementById('generated').style.height=document.getElementById('preview').style.height;
          document.getElementById('generated').classList.add('rounded');
          document.getElementById('loader').style.display='none';
          imgElement.src = image;
          imgDownload.href=image;
        })
        .catch(error => {
          console.error('Il y a eu un problème avec la récupération de l\'image:', error);
        });
            
}

function sendIMG(){
    document.getElementById('loader').style.display='block';

    const form = document.getElementById('upload-form');
    const photoFile = document.getElementById('upload');
    
    event.preventDefault();
    if (!photoFile.files[0]) {
        console.error('Le champ est vide');
        return;
    }

    const formData = new FormData();

    let roomType  = document.getElementsByClassName('room-type-img-clicked')[0].parentNode.childNodes[4].textContent;
    var roomStyle='.'
    if (document.getElementsByClassName('style-type-img-clicked')[0]!=undefined){
      roomStyle = document.getElementsByClassName('style-type-img-clicked')[0].parentNode.childNodes[4].textContent;
    }

    const element = document.querySelector('.active');
    var color='.'
    if (element!=null){
        const classes = element.classList;
        const dict={'1':'white',
                    '2':'black',
                    '3':'grey',
                    '4':'silver',
                    '5':'blue',
                    '6':'cyan',
                    '7':'navy',
                    '8':'green',
                    '10':'olive',
                    '11':'teal',
                    '12':'purple',
                    '13':'magenta',
                    '14':'yellow',
                    '15':'brown',
                    '16':'red'}

        color=dict[classes[1]]
    }

    formData.append('photo_file', photoFile.files[0]);
    formData.append('room_type',roomType)
    formData.append('room_style',roomStyle)
    formData.append('room_color',color)
    console.log(roomType,color)
    fetch('/upload/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Réponse serveur:', data);
        showIMG()
    })
    .catch(error => console.error(error));     
}

function previewImage(event) {

    var preview = document.getElementById("preview");
    var file = event.target.files[0];
    var reader = new FileReader();
    
    reader.onload = function(event) {
        preview.src = event.target.result;
        preview.style.width = `${containerWidth}px`;
        preview.style.height = `${containerHeight}px`;
        preview.style.display = "block";

        preview.classList.add('rounded');
        document.getElementById('text-of-image-container').style.display='none'
        document.getElementById('element-image-drop').style.border='none'
        document.getElementById('generated').style.display='none';
        document.getElementById('divButtonLike').style.display='none';

    }
    reader.readAsDataURL(file);
       
}
   


const dragDropContainer = document.getElementById('element-image-drop');
const dragDropText = document.getElementById('text-of-image-container');
const fileInput = document.getElementById('upload');

const change_picture=document.getElementById('preview');
change_picture.addEventListener('click',(event)=>{
  event.preventDefault();
  fileInput.click();
});


dragDropContainer.addEventListener('dragover', (event) => {
  event.preventDefault();
  dragDropContainer.classList.add('dragover');
});

dragDropContainer.addEventListener('dragleave', () => {
  dragDropContainer.classList.remove('dragover');
});

dragDropContainer.addEventListener('drop', (event) => {
  event.preventDefault();
  dragDropContainer.classList.remove('dragover');
  handleFiles(event.dataTransfer.files);
});

dragDropText.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (event) => {
  handleFiles(event.target.files);
});

function handleFiles(files) {
  for (const file of files) {
    // Envoi du fichier vers le serveur
  }
}