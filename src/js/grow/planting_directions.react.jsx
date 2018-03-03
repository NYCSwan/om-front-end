import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import findKey from 'lodash/findKey';

import styles from '../../styling/planting_directions.css';
// import SettingsList from './settings_list.react';

class PlantingDirections extends Component {
  static propTypes = {
    newGrowPlant: PropTypes.arrayOf(PropTypes.object).isRequired,
    climates: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleClick: PropTypes.func.isRequired,
    selectedChamber: PropTypes.string.isRequired,
    isBalanced: PropTypes.bool.isRequired
  };
  // state = {
  //   displaySettings: []
  // }

  shouldComponentUpdate(newProps) {
    return (
      this.props.newGrowPlant !== newProps.newGrowPlant ||
      this.props.climates !== newProps.climates ||
      this.props.isBalanced !== newProps.isBalanced
    )
  }

  handleClick = () => {
    console.log('handle click planting directions');
    this.props.handleClick();
    // send message to Plant page saying "Garden started!"
    // send new grow to db, fill chamber
  };
  // <SettingsList chamber={selectedChamber} climates={climates} newGrowPlant={newGrowPlant} />

  render() {
    console.log('render directions');
    const { newGrowPlant, directions } = this.props;
    // debugger
    // const plantKey = findKey(newGrowPlant);
    // const growingDirections = newGrowPlant[plantKey].planting_directions;
    return (
      <div
        className={styles.directionsright}>
        <ul>
          {directions.planting.map(line => {
            return (
              <li
                key={line}>{line}</li>
            )
          })}
          </ul>
          <a
            href={`/plants/${newGrowPlant.recipeId}`}
            alt="Start Growing!">
            <button
              className={styles.balanced} onClick={this.handleClick}>
              Start Growing!
            </button>
          </a>
        })}
        </div>
    );
  }
}

export default PlantingDirections;
