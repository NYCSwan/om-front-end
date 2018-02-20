import React from 'react';
import spinner from '../../media/loading.png';
import styles from '../../styling/spinner.css';

const Spinner = () => (
  <div className={styles.spinner}>
    <h3>Loading your gardens... </h3>
    <img src={spinner} alt="loading indicator" className={styles.img}/>
  </div>
);

export default Spinner;
