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

  growPlant() {
    const {spinner} = this.state;
    let offset = 0;
    spinner.each(function(img){

      setTimeout(function() {
        return (
          <img src={img} alt="loading indicator" className={styles.img}/>
        )
      }, 1000);
      offset += 1000;
    })

    offset = 0;
  }

  render() {
    return (
      <div>
        <h3>Loading your gardens... </h3>
        <div className={styles.spinner}>
          {this.growPlant}
        </div>
      </div>
    )
  }
}

export default Spinner;
