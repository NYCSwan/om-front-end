import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from '../../styling/planting_directions.css';


class PlantingDirections extends Component {
  static propTypes = {
    newGrowPlant: PropTypes.arrayOf(PropTypes.object).isRequired,
    climates: PropTypes.arrayOf(PropTypes.object).isRequired,
    handlePlantClick: PropTypes.func.isRequired,
    selectedChamber: PropTypes.string.isRequired,
    isBalanced: PropTypes.bool.isRequired
  };

  shouldComponentUpdate(newProps) {
    return (
      this.props.newGrowPlant !== newProps.newGrowPlant ||
      this.props.climates !== newProps.climates ||
      this.props.isBalanced !== newProps.isBalanced
    )
  }

  handleClick = () => {
    console.log('handle click planting directions');
    this.props.handlePlantClick();
    // send message to Plant page saying "Garden started!"
    // send new grow to db, fill chamber
  };


  render() {
    console.log('render directions');
    const { directions } = this.props;
    return (
      <div
        className={styles.directionsright}>
        <ul>
          {directions[1].planting.map(line => {
            return (
              <li
                key={line}>{line}</li>
            )
          })}
          </ul>
          <button
            className={styles.balanced} onClick={this.handleClick}>
            Start Growing!
          </button>
        </div>
    );
  }
}

export default PlantingDirections;
