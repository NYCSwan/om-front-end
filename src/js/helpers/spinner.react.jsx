import React from 'react';
import spinner from '../../media/loading.png';
import styles from '../../styling/spinner.css';

const Spinner = () => (
  <div>
    <h3>Loading your gardens... </h3>
    <div className={styles.spinner}>
      <img src={spinner} alt="loading indicator" className={styles.img}/>
    </div>
  </div>
);

export default Spinner;
