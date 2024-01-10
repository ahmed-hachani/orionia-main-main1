import React, { useState,useEffect } from 'react';
import logo from './img/LOGO_ORION_-2.png';
import '../App.css';

function Navbar() {
  const [isMenuActive, setMenuActive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user has a valid token
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
  };

  const toggleMenu = () => {
    setMenuActive(!isMenuActive);
  };

  return (
    <div>
 
       <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container px-4 px-lg-5">
      <img src={logo}  className="logo" />

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon" /></button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
          <li className="nav-item"><a className="nav-link active" aria-current="page" href="/">ATELIER</a></li>
          <li className="nav-item"><a className="nav-link" href="/profile">PROFIL</a></li>
          <li className="nav-item"><a className="nav-link" href="/support">SUPPORT</a></li>


        
        </ul>
        {isAuthenticated ? (
          <li className="nav-item">
            <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <li className="nav-item"><a className="nav-link" href="/login">Login</a></li>
        )}

      </div>
    </div>
  </nav> 
    </div>
  );
}

export default Navbar;
