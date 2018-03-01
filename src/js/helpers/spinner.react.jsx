import React, { Component } from 'react';
import plant1 from '../../media/Loading1.png';
import plant2 from '../../media/Loading2.png';
import plant3 from '../../media/Loading3.png';

import styles from '../../styling/spinner.css';

class Spinner extends Component {
  state = {
    spinner: [
      plant1, plant2, plant3
    ]
  }
  //
  // growPlant() {
  //   const {spinner} = this.state;
  //
  //   return setTimeout(function( spinner,
  //     return (
  //       <img src={plant1} alt="loading indicator" className={styles.img}/>
  //     )
  //   ), 1000);
  // }

  render() {
    return (
      <div>
        <h3>Loading your gardens... </h3>
        <div className={styles.spinner}>
          <img src={plant1} alt="loading indicator" className={styles.img}/>
        </div>
      </div>
    )
  }
}

export default Spinner;
