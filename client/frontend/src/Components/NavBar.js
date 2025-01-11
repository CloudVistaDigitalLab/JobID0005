import React from 'react';
import '../index.css'; 

function NavBar() {
  return (
    <nav className="navbar">
      <h1>Vehicle Insurance Co.</h1>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Services</li>
        <li>Contact</li>
      </ul>
    </nav>
  );
}

export default NavBar;
