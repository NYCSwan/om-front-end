import React from 'react';
import styles from '../../styling/grow_container.css';
import { Link } from 'react-router-dom';

const GrowContainer = () => (
  <div className={styles.grow}>
  <h2>Grow a new garden in an empty container or maintain a garden that is growing.</h2>
    <Link to="/controls/NewGrow">
      <button className={styles.homepage} href='/controls/NewGrow'>
        New Grow
      </button>
    </Link>
    <Link to="/controls/ExistingGrow">
      <button
        className={styles.homepage}
        href='/controls/ExistingGrow'
      >
        Existing Grow
      </button>
    </Link>
    <Link to="tutorials">
      <button
        className={styles.homepage}
        href="/tutorials">
        Tutorials
      </button>
    </Link>
  </div>
);

export default GrowContainer;
