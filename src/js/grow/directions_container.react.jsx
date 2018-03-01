import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Directions from './directions.react';
import PlantingDirections from './planting_directions.react';

class DirectionsContainer extends Component {
  static propTypes = {
    newGrowPlant: PropTypes.object.isRequired,
    // climates: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedChamber: PropTypes.number.isRequired,
    handlePhClick: PropTypes.func.isRequired,
    handlePlantClick: PropTypes.func.isRequired,
    isBalanced: PropTypes.bool.isRequired,
    showPlantingDirections: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object
    }).isRequired
  };

  state = {
    settings: [],
    directions: ['Fill chamber water reservoir with clean water, then put the water reservoir back inside the chamber and initiate pH balancing.', 'Transplant seedlings in rockwool cubes from propagation chamber to net pots and put net pots in chamber lid holes.', 'Your plants are ready!']
  };

  componentDidMount() {
    this.createSettings();
  }

  createSettings = () => {
      const { newGrowPlant } = this.props;
      const tempSettings = [];
      tempSettings.push(newGrowPlant.plantName);
      tempSettings.push(newGrowPlant.climateId);
      tempSettings.push(newGrowPlant.chamberName);
      tempSettings.push(newGrowPlant.pH);
      tempSettings.push(newGrowPlant.temperature);

      this.setState({
        settings: tempSettings
      })
  }

  // climates={this.props.climates}
  render() {
    return (
      <div className="directions container">
      { this.props.showPlantingDirections
        ?
          <PlantingDirections
            newGrowPlant={this.props.newGrowPlant}
            isBalanced={this.props.isBalanced}
            selectedChamber={this.props.selectedChamber}
            handlePlantClick={this.props.handlePlantClick}
          />
        :
          <Directions
            settings={this.state.settings}
            directions={this.state.directions}
            plant={this.props.selectedPlant}
            handlePhClick={this.props.handlePhClick}
            isBalanced={this.props.isBalanced}
          />
      }
      </div>
    );
  }
}

export default DirectionsContainer;
