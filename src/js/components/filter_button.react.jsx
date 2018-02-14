import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { ButtonGroup, Button } from 'react-bootstrap';

import styles from '../../styling/filter_button.css';
class FilterButtonGroup extends Component {
  static propTypes = {
    chamberId: PropTypes.number.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func.isRequired
    // filledChambers: PropTypes.arrayOf(PropTypes.object).isRequired
  };
  handleClick = e => {
    console.log(`handle filter click: ${e.target}`);
    this.props.onChange(e);
  };

  render() {
    console.log('render filter buttons');
    return (
      <ButtonGroup
        justified
        type="radio"
        name="filterById"
        className={styles.filterById}
        options={this.props.options}
        onChange={this.props.onChange}
      >
        {this.props.options.map(option => { // eslint-disable-line

          return (
            // eslint-disable-line
            <Button
              key={option.chamberId}
              value={option.plantName}
              className={`styles.chamber${option.chamberId}`}
              checked={this.props.chamberId === option.chamberId}
              onClick={this.handleClick}
              disabled={option.isFilled}
            >
              {option.plantName ? option.plantName : option.chamberName}
            </Button>
          );
        })}
      </ButtonGroup>
    );
  }
}

export default FilterButtonGroup;
