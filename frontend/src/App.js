import React, { useState } from 'react';
import './App.css';
import Home from './Home'; // Import the new Home component

function App() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if user is logged in
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '' });

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const endpoint = type === 'login' ? 'login' : 'register';
    
    try {
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok) {
        if (type === 'login') {
          //alert(`Welcome back!`);
          setIsLoggedIn(true); // Switch to Home Page on success
        } else {
          //alert("Account created successfully!");
          setIsRightPanelActive(false); // Slide back to login side
        }
      } else { 
        alert(data.error || "Something went wrong"); 
      }
    } catch (err) { 
      alert("Check if backend is running!"); 
    }
  };

  // IF LOGGED IN, SHOW HOME PAGE
  if (isLoggedIn) {
    return <Home />;
  }

  // OTHERWISE, SHOW LOGIN/SIGNUP SLIDING PAGE
  return (
    <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
      
      {/* Create Account (Sign Up) */}
      <div className="form-container sign-up-container">
        <form onSubmit={(e) => handleSubmit(e, 'register')}>
          <h1>Create Account</h1>
          <input type="text" name="name" placeholder="Name" onChange={handleInput} required />
          <input type="text" name="username" placeholder="Username" onChange={handleInput} required />
          <input type="email" name="email" placeholder="Email" onChange={handleInput} required />
          <input type="password" name="password" placeholder="Password" onChange={handleInput} required />
          <button type="submit">Register</button>
        </form>
      </div>

      {/* Sign In */}
      <div className="form-container sign-in-container">
        <form onSubmit={(e) => handleSubmit(e, 'login')}>
          <h1>Sign in</h1>
          <input type="text" name="username" placeholder="Username" onChange={handleInput} required />
          <input type="password" name="password" placeholder="Password" onChange={handleInput} required />
          <a href="#" className="forgot-password">Forgot your password?</a>
          <button type="submit">Login</button>
        </form>
      </div>

      {/* Sliding Overlays */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" id="signIn" onClick={() => setIsRightPanelActive(false)}>Login</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button className="ghost" id="signUp" onClick={() => setIsRightPanelActive(true)}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;