import React from "react";
import { Button, Glyphicon } from "react-bootstrap";
import PropTypes from 'prop-types';
import styles from '../../styling/LoaderButton.css';

const LoaderButton = props => (
  <Button
    className={styles.LoaderButton}
    disabled={props.disabled || props.isLoading}
    {...props}>
    {props.isLoading && <Glyphicon glyph="refresh" className="spinning" />}
    {!props.isLoading ? props.text : props.loadingText}
  </Button>
)

LoaderButton.propTypes = {
  className: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  loadingText: PropTypes.string.isRequired
}

export default LoaderButton;
