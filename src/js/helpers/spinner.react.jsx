import React, { Component } from 'react';

import plant1 from '../../media/Loading1.png';
import plant2 from '../../media/Loading2.png';
import plant3 from '../../media/Loading3.png';

import styles from '../../styling/spinner.css';

class Spinner extends Component {
  state = {
    timer: 0,
    plantImage: plant3
  }

  componentDidMount() {
    this.timerId = setInterval(() => this.growPlant(),
      1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId)
    this.setState({ timer: 0 });
  }

  growPlant() {
    const {plantImage} = this.state;
    let interval = this.state.timer;

      if (plantImage === plant1) {
        this.setState({plantImage: plant2})
      } else if (plantImage === plant3) {
        this.setState({plantImage: plant1})
      } else {
        this.setState({plantImage: plant3});
      }
    this.setState({ timer: interval += 1});
  }

  render() {
    // debugger
    return (
      <main className={styles.spinnerContainer}>
        <h3>Loading your gardens... </h3>
        <img src={ this.state.plantImage } alt="loading indicator" className={styles.img}/>
      </main>
    )
  }
}

export default Spinner;
