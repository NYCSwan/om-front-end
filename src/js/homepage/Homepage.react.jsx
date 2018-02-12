import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../../styling/homepage.css';

const Homepage = () => (
  <div>
    <div>
      <div className={styles.monitorOrGrow}>
        <Button className={styles.homepage} href="/monitor">
          Monitor
          Your Garden
        </Button>
        <Button className={styles.homepage} href="/controls">
          Grow Something
        </Button>
      </div>
    </div>
  </div>
);

export default Homepage;
