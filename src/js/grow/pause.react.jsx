import React from 'react';
import PropTypes from 'prop-types';
import PopUp from './popup.react';

const Pause = props => (
  <PopUp
    displayModal={props.showPause}
    modalTitle="Your System Is Paused."
    modalBody={
      <div>
        <h4>Directions:</h4>
        <p>Please clean your system or add water tanks now.</p>
      </div>
    }
    buttonText1="Pause"
    buttonText2="Resume"
  />
);

Pause.propTypes = {
  showPause: PropTypes.bool.isRequired
};
export default Pause;
