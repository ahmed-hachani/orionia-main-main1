import React, {useState} from 'react';

function Choose() {
    const [selectedImage, setSelectedImage] = useState(null);

    function handleImageUpload(event) {
      const file = event.target.files[0];
  
      if (file) {
        const reader = new FileReader();
  
        reader.onload = function (e) {
          setSelectedImage(e.target.result);
        };
  
        reader.readAsDataURL(file);
      } else {
        setSelectedImage(null);
      }
    }
    return (
        <div id="container">
        {/*LEFT SIDE*/}
        
        <div id="after">
            <span className="handwriting-font">Votre intérieur actuel</span>
            <div id="element-image-drop">
              {/* File input */}
              <input
                className='nn'
                type="file"
                id="upload"
                onChange={handleImageUpload}
                accept="image/*"
              />
              {selectedImage && (
                <img src={selectedImage} id="generated" alt="Uploaded" className="uploaded-image" />
              )}
            </div>
           
          </div>
        {/* Right Side */}
        <div id="after">
          <span className="handwriting-font">Résultat </span>
          <div id="element-image-drop-2">
            <a id="download" href download>
              <img id="generated" style={{display: 'none'}} />
            </a>
            <div id="loader" />
          </div>
          
        </div>
      </div>
    );
}

export default Choose;