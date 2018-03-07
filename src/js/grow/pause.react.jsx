import React from 'react';
import PropTypes from 'prop-types';
import PopUp from './popup.react';

const Pause = props => (
  <PopUp
    displayModal={props.showPause}
    modalTitle="Your System Is Paused."
    modalBody={
      <tbody>
        <tr>
          <td>Directions:</td>
        </tr>
        <tr>
          <td>Please clean your system or add water to the tanks now.</td>
        </tr>
      </tbody>
    }
    buttonText="Resume"
    openModal={props.openModal}
    handleClick={props.handleClick}
  />
);

Pause.propTypes = {
  openModal: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default Pause;
