import React, { Component } from 'react';
import DemoVideo from '../../media/TimelapseMINI.mp4';
import styles from '../../styling/demo_container.css';

class DemoContainer extends Component {

  componentDidMount() {
    this.props.setTitle('Oasis Mini Demo');
    this.props.showModal();
  }

  render() {
    return (

      <div className={styles.container}>
        <h2 className={styles.demoTitle}>Oasis Mini Demo</h2>
        <video
          key='video1'
          width="400"
          height='300'
          controls>
          <source
            src={DemoVideo}
            type="video/mp4" />
            Your browser does not support the video tag.
        </video>
      </div>
    )
  }
}

export default DemoContainer;
