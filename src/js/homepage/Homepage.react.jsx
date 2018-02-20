import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styling/homepage.css';

const Homepage = () => (
  <div className={styles.monitorOrGrow}>
    <Link to='/monitor'>
      <button className={styles.homepage} href="/monitor">
        Monitor
        Your Garden
      </button>
    </Link>
    <Link to="/controls">
      <button className={styles.homepage} href="/controls">
        Grow Something
      </button>
    </Link>
  </div>
);

export default Homepage;
