import React from "react";
import { Glyphicon } from "react-bootstrap";
import PropTypes from 'prop-types';
import styles from '../../styling/LoaderButton.css';

const LoaderButton = props => (
  <button
    className={styles.LoaderButton}
    disabled={props.disabled}>
    {props.isloading && <Glyphicon glyph="refresh" className="spinning" />}
    {!props.isloading ? props.text : props.loadingtext}
  </button>
)

LoaderButton.propTypes = {
  className: PropTypes.string.isRequired,
  isloading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  loadingtext: PropTypes.string.isRequired,
  // handleClick: PropTypes.func.isRequired
}

export default LoaderButton;
