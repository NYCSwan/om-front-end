import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import includes from 'lodash/includes';
import Directions from './directions.react';
import PlantingDirections from './planting_directions.react';
import SettingsList from './settings_list.react';
import styles from '../../styling/directions_container.css';

class DirectionsContainer extends Component {
  static propTypes = {
    newGrowPlant: PropTypes.object.isRequired,
    // climates: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedChamber: PropTypes.number.isRequired,
    handlePhClick: PropTypes.func.isRequired,
    handlePlantClick: PropTypes.func.isRequired,
    handleNextClick: PropTypes.func.isRequired,
    plant: PropTypes.string.isRequired,
    isBalanced: PropTypes.bool.isRequired,
    showPlantsDirections: PropTypes.bool.isRequired,
    // match: PropTypes.shape({
    //   params: PropTypes.object,
    //   path: PropTypes.string
    // }).isRequired
  };

  state = {
    settings: [],
    directions: [
      {
        phBalance: [
          'Now that we have correctly dosed our nutrients, we can initiate pH balancing.'
        ]
      },
      {
        planting: [
          'Fill chamber water reservoir with clean water, then put the water reservoir back inside the chamber and initiate pH balancing.', 'Transplant seedlings in rockwool cubes from propagation chamber to net pots and put net pots in chamber lid holes.', 'Your plants are ready!'
        ]
      }

    ]
  };

  componentDidMount() {
    this.createSettings();
  }

  shouldComponentUpdate(newProps, newState) {
    return (
      this.props.newGrowPlant !== newProps.newGrowPlant ||
      this.props.isBalanced !== newProps.isBalanced || this.state.settings !== newState.settings
    );
  }

  createSettings = () => {
      const { newGrowPlant, selectedChamber } = this.props;
      const tempSettings = [];
      // debugger
      tempSettings.push(newGrowPlant.recipeName);
      tempSettings.push(`${newGrowPlant.climateId}, ${newGrowPlant.temperatureRange}`);
      tempSettings.push(`pH ${newGrowPlant.pH}`);
      tempSettings.push(`Chamber ${selectedChamber}`);

      this.setState({
        settings: tempSettings
      })
  }

  handleNextClick = (event) => {
    // debugger
    // if (event.target.baseURI.includes('/controls/ExistingGrow')) {
    //   this.props.handleNextClick();
    // } else {
      this.props.handleNextClick() ;
    // }
  }
  // climates={this.props.climates}
  render() {
    console.log('render directions container');
    const { settings, directions } = this.state;
    const { selectedChamber, newGrowPlant, isBalanced, handlePlantClick, handlePhClick, selectedPlant, showPlantsDirections } = this.props;
    // console.log(selectedPlant);
    return (
      <div className={styles.directions}>
        <h2>Garden</h2>
        <h3>Grow Directions</h3>
        <SettingsList
          chamber={selectedChamber}
          settings={settings}
          newGrowPlant={newGrowPlant} />
      { (showPlantsDirections === true)
        ?
          <PlantingDirections
            newGrowPlant={newGrowPlant}
            isBalanced={isBalanced}
            directions={directions}
            selectedChamber={selectedChamber}
            handlePlantClick={handlePlantClick}
          />
        :
          <Directions
            settings={settings}
            directions={directions}
            showPlantsDirections={showPlantsDirections}
            plant={selectedPlant}
            handlePhClick={handlePhClick}
            handleClick={this.handleNextClick}
            isBalanced={isBalanced}
          />
      }
      </div>
    );
  }
}

export default DirectionsContainer;
