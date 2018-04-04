import React from 'react';
import PropTypes from 'prop-types';
import PopUp from './popup.react';
import styles from '../../styling/pause.css';

const Pause = props => (
  <PopUp
    displayModal={props.showPause}
    modalTitle="Your System Is Paused."
    modalBody={
      <tbody>
        <tr>
          <td className={styles.title}>Directions:</td>
        </tr>
        <tr>
          <td className={styles.text}>Please clean your system or add water to the tanks now.</td>
        </tr>
      </tbody>
    }
    buttonText="Resume"
    openModal={props.openModal}
    handleClick={props.handleClick}
    handleCloseClick={props.handleCloseClick}
  />
);

Pause.propTypes = {
  openModal: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleCloseClick: PropTypes.func.isRequired,
  showPause: PropTypes.bool.isRequired
};

export default Pause;
