import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import sortBy from 'lodash/sortBy';

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
    const sortedChambers =  sortBy(this.props.options, ['chamberName']);

    return (
      <div
        className={styles.filterById}>
        {sortedChambers.map(option => { // eslint-disable-line

          return ( // eslint-disable-line
            <button
              key={option.gardenId}
              value={option.plantName || option.chamberName}
              className={styles.chamber}
              active={this.props.chamberId === parseInt(option.chamberId, 10) ? 'true' : 'false'}
              checked={this.props.chamberId === parseInt(option.chamberId, 10) ? 'true' : 'false'}
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
