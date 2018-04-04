import React from "react";
import PropTypes from 'prop-types';
import styles from '../../styling/LoaderButton.css';

const LoaderButton = props => (
  <button
    className={styles.LoaderButton}
    disabled={props.disabled}
    onClick={props.onClick}>
    {!props.isloading ? props.text : props.loadingtext}
  </button>
)

LoaderButton.propTypes = {
  isloading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  loadingtext: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default LoaderButton;
