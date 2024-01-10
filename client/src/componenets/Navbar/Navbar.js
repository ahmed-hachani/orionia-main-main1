import React, { useState, useEffect } from 'react';
import '../../App.css'

import { useNavigate } from 'react-router-dom';
import logo from '../img/LOGO_ORION_-2.png';


function LogoutButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userDetails');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <button className="nav-link btn btn-link" onClick={handleLogout}>
      LOGOUT
    </button>
  );
}

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

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container px-4 px-lg-5">
          <img src={logo} alt="Logo" className="logo" />

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">
                  ATELIER
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/profile">
                  PROFILE
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/support">
                  SUPPORT
                </a>
              </li>
              {isAuthenticated ? (
  <li className="nav-item">
    <LogoutButton />
  </li>
) : (
  <li className="nav-item">
    <a className="nav-link login-button" href="/login">
      LOGIN
    </a>
  </li>
)}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
