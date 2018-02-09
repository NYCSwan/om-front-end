import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pickBy from 'lodash/pickBy';
import findKey from 'lodash/findKey';
import isEmpty from 'lodash/isEmpty';

class PlantContainer extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object
    }).isRequired
  };

  state = {
    plantTypes: [],
    plant: ''
  };

  componentDidMount() {
    console.log('componentDidMount plant container');
    this.getPlantRecipes();
    this.setPlant();
  }

  shouldComponentUpdate(newState) {
    return this.state.plant !== newState.plant || this.state.plantTypes !== newState.plantTypes;
  }

  getPlantRecipes = () => {
    console.log('get plant recipes, plant container');
  };

  setPlant = () => {
    const plantId = parseInt(this.props.match.params.plant_id, 10);
    this.setState({ plant: plantId });
  };

  render() {
    console.log('render plant container');
    const { plant, plantTypes } = this.state;

    const currentPlant = pickBy(plantTypes, recipe => recipe.r_id === plant);
    const plantKey = findKey(currentPlant);

    console.log(currentPlant);
    return (
      <div>
        {!isEmpty(currentPlant) && (
          <div className="plantType">
            <img src={`../public/img/${currentPlant[plantKey].shortname}.png`} alt={currentPlant[plantKey].shortname} />
            <h2>{currentPlant[plantKey].name}</h2>
            <p>Yield: {currentPlant[plantKey].yield}</p>
            <p>Maturity: {currentPlant[plantKey].days_to_maturity}</p>
            <p>${currentPlant[plantKey].market_price}</p>
            <p>{currentPlant[plantKey].uses}</p>
          </div>
        )}
      </div>
    );
  }
}

export default PlantContainer;
