import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
// import { ButtonGroup, Button } from 'react-bootstrap';

import styles from '../../styling/filter_button.css';

class FilterButtonGroup extends Component {
  static propTypes = {
    chamberId: PropTypes.number.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func.isRequired
    // filledChambers: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  handleClick = e => {
    console.log(`handle filter click: ${e}`);
    this.props.onChange(e);
  };

  render() {
    console.log('render filter buttons');
    return (
      <div
        className={styles.filterById}>
        {this.props.options.reverse().map(option => { // eslint-disable-line

          return ( // eslint-disable-line
            <button
              key={option.gardenId}
              value={option.plantName || option.chamberName}
              className={styles.chamber}
              active={this.props.chamberId === parseInt(option.chamberId, 10)}
              checked={this.props.chamberId === parseInt(option.chamberId, 10)}
              onClick={this.handleClick}
              disabled={!option.isFilled}
            >
              {option.isFilled ? option.plantName : option.chamberName}
            </button>
          );
        })}
      </div>
    );
  }
}

export default FilterButtonGroup;
