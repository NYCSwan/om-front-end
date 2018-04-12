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
    isAuthenticated: PropTypes.bool.isRequired,
    setTitle: PropTypes.func.isRequired
  };

  state = {
    plantTypes: []
  };

  async componentDidMount() {
    console.log('componentDidMount plant list');
    // if(!this.props.isAuthenticated) {
    //   return;
    // }

    if (!this.props.history.location.state) {
      try {
        const plantRecipeResults = await this.getPlantRecipes();

        this.setState({plantTypes: plantRecipeResults});

        if(this.props.isAuthenticated) {
          this.props.history.push({
            pathname: this.props.location.pathname,
            state: {
              plantTypes: this.state.plantTypes
            }
          })
        }
      } catch(e) {
        console.log(e);
      }
    } else {
      console.log('set state to location state');

      this.setStateFromHistory();
    }
    this.props.setTitle('Plant Recipes')
  }

  shouldComponentUpdate(newState, newProps) {
    return this.state.plantTypes !== newState.plantTypes || this.props.match !== newProps.match;
  }

  getPlantRecipes = () => {
    console.log('get plant recipes, plant List');
    return invokeApig({ path: '/plants'})
  };

  setStateFromHistory = () => {
    console.log('set state from history');
    this.setState({ plantTypes: this.props.history.location.state.plantTypes})
  }

  render() {
    console.log('render plant list');
    const { plantTypes } = this.state;
    // const plantUrl = ;
    return (
      <main className={styles.plantList}>
          {plantTypes.map(plant => { // eslint-disable-line
            return (
              <div
                className={styles[`${camelCase(plant.recipeName)}DetailsContainer`]}
                key={plant.recipeName}>
                <Link
                to={{
                  pathname: `/plants/${upperFirst(camelCase(plant.recipeName))}`,
                  state: {details: plant}
                }}>
                  <PlantDetails
                    notifications={null}
                    details={plant}
                    key={plant.fullName}
                    match={this.props.match}
                  />
                </Link>
              </div>
            );
          })}
      </main>
    );
  }
}

export default PlantList;
