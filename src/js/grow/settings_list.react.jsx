import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import findKey from 'lodash/findKey';
// import pickBy from 'lodash/pickBy';
// import replace from 'lodash/replace';

// import ListGroupContainer from './../components/ListGroup.react';
import styles from '../../styling/settings_list.css';

class SettingsList extends Component {
  static propTypes = {
    newGrowPlant: PropTypes.arrayOf(PropTypes.object).isRequired,
    climates: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedChamber: PropTypes.string.isRequired
  };
  // state = {
  //   displaySettings: []
  // };
  //
  // componentDidMount() {
  //   this.updateSettings();
  // }

  // shouldComponentUpdate(newProps, newState) {
  //   return (
  //     this.props.newGrowPlant !== newProps.newGrowPlant ||
  //     this.props.climates !== newProps.climates ||
  //     this.state.displaySettings !== newState.displaySettings
  //   );
  // }

  // updateSettings = () => {
  //   const plantType = this.props.newGrowPlant;
  //   const plantKey = findKey(plantType);
  //   const tempClimate = pickBy(this.props.climates, climate => climate.cl_id === plantType[plantKey].climate_id);
  //   const climateKey = findKey(tempClimate);
  //   const tempSettings = [];
  //
  //   tempSettings.push(plantType[plantKey].recipeName);
  //   tempSettings.push(`${tempClimate[climateKey].climateId},  ${plantType[plantKey].temperatureRange} *F`);
  //   tempSettings.push(`pH ${plantType[plantKey].ph}`);
  //   tempSettings.push(this.props.selectedChamber);
  //   this.setState({ displaySettings: tempSettings });
  // };

  render() {

    return (
      <aside className={styles.directionsleft}>
        <ul className={styles.settingsList}>
          {this.props.settings.map(item => { // eslint-disable-line
            // debugger
            return (
              <li
                key={item}
                className={styles.listItem}>
                { item }
              </li>
            );
          })}
          </ul>
      </aside>
    );
  }
}

export default SettingsList;
