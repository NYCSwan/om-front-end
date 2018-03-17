import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import { invokeApig } from '../../libs/awsLibs';
import PlantDetails from './plant_details.react';
import styles from '../../styling/plant_list.css';

class PlantList extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object
    }).isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };

  state = {
    plantTypes: []
  };

  async componentDidMount() {
    console.log('componentDidMount plant list');
    if(!this.props.isAuthenticated) {
      return;
    }
    if (!this.props.history.location.state) {
      try {
        const plantRecipeResults = await this.getPlantRecipes();

        this.setRecipes(plantRecipeResults);
      } catch(e) {
        console.log(e);
      }
    } else {
      console.log('set state to location state');
      this.setStateFromHistory();
    }
  }

  shouldComponentUpdate(newState, newProps) {
    return this.state.plantTypes !== newState.plantTypes || this.props.match !== newProps.match;
  }

  getPlantRecipes = () => {
    console.log('get plant recipes, plant List');

    return invokeApig({ path: '/plants'})
  };

  setRecipes = (plantRecipes) => {
    this.setState({ plantTypes: plantRecipes });
  }

  setStateFromHistory = () => {
    this.setState({ plantTypes: this.props.history.location.details})
  }

  render() {
    console.log('render plant list');
    const { plantTypes } = this.state;
    // const plantUrl = ;
    return (
      <main>
        <div className="plantList">
          <h2>Plant Index</h2>
          {plantTypes.map(plant => { // eslint-disable-line
            return (
              <Link
                to={{
                  pathname: `/plants/${upperFirst(camelCase(plant.recipeName))}`,
                  state: {details: plant}
                }}>
                <div className={styles[`${camelCase(plant.recipeName)}DetailsContainer`]}>
                  <PlantDetails
                    notifications={null}
                    details={plant}
                    key={plant.fullName}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    );
  }
}

export default PlantList;
