import React, { useState } from 'react';
import './Login.css';
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState({});

  const validateRegistration = () => {
    let errors = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email address';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/.test(password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one special character, and one number';
    }
    

    setErrorMessages(errors);

    return Object.keys(errors).length === 0;
  };
  const validateLogin = () => {
    let errors = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    }

    setErrorMessages(errors);

    return Object.keys(errors).length === 0;
  };

  const toggleForm = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        username: username,
        password: password
      });
  
      // Assuming your backend sends back tokens in the response
      const { accessToken, refreshToken } = response.data;
  
      // Store the tokens securely (e.g., in localStorage or secure cookies)
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);


  
      // Handle successful login response here (e.g., redirect user to a protected route)
      console.log('Login successful:', response.data);
      navigate('/');

    } catch (error) {
      // Handle error here
      console.error('Error logging in:', error);
    }
  };
  
  const handleRegister = async () => {
    if(validateRegistration()){
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
         // Replace with actual user input or dynamic data
        username: username,
        email: email,
        password: password
      });
  
      // Assuming your backend sends back tokens in the response
      const { accessToken, refreshToken } = response.data;
  
      // Store the tokens securely (e.g., in localStorage or secure cookies)
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
  
      // Handle successful registration response here (e.g., redirect user to a protected route)
      console.log('Registration successful:', response.data);
    } catch (error) {
      // Handle error here
      console.error('Error registering:', error);
    }}

  };

  return (
    <>
      <Navbar />
      <div className='cntr'>
        <div className={`form-structor ${isLoginVisible ? 'slide-up' : ''}`}>
          <div className='signup'>
            <h2 className='form-title' id='signup'>
              <span>or</span>Sign up
            </h2>
            <div className='form-holder'>
              <input type='text' className='input' placeholder='Name' onChange={(e) => setUserName(e.target.value)} />
              {errorMessages.username && <p className='error'>{errorMessages.username}</p>}

              <input type='email' className='input' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
              {errorMessages.email && <p className='error'>{errorMessages.email}</p>}

              <input type='password' className='input' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
              {errorMessages.password && <p className='error'>{errorMessages.password}</p>}

            </div>
            <button className='submit-btn' onClick={handleRegister}>Sign up</button>
          </div>
          <div className={`login ${isLoginVisible ? '' : 'slide-up'}`}>
            <div className='center'>
              <h2 className='form-title' id='login' onClick={toggleForm}>
                <span>or</span>Log in
              </h2>
              <div className='form-holder'>
                <input type='text' className='input' placeholder='Username' onChange={(e) => setUserName(e.target.value)} />
                <input type='password' className='input' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button className='submit-btn' onClick={handleLogin}>Log in</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
