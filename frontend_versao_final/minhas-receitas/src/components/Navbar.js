import React from 'react';
import { Link } from 'react-router-dom'; 
import styles from '../styles/navbar.module.css';
import logo from '../img/chef_svg.svg';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="Chef Notes Logo" className={styles.logoImage} />
        </Link>
      </div>
      <ul className={styles.navLinks}>
        <li className={styles.navItem}>
          <Link to="/" className={styles.navItem}>Minhas Receitas</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
