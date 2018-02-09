import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import { invokeApig } from '../../libs/awsLibs';

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
    try {
      const plantRecipeResults = await this.getPlantRecipes();
      debugger
      this.setRecipes(plantRecipeResults);
    } catch(e) {
      console.log(e);
    }
  }

  shouldComponentUpdate(newState, newProps) {
    return this.state.plantTypes !== newState.plantTypes || this.props.match !== newProps.match;
  }

  getPlantRecipes = () => {
    console.log('get plant recipes, plant List');

    return invokeApig({ path: '/plantRecipes'})
  };

  setRecipes = (plantRecipes) => {
    debugger
    this.setState({ plantTypes: plantRecipes });
  }

  render() {
    console.log('render plant list');
    const { plantTypes } = this.state;
    return (
      <div>
        <div className="plantList">
          <Grid>
            {plantTypes.map(plant => { // eslint-disable-line
              return (
                <Row key={plant.r_id}>
                  <Col>
                    <a href={`plants/${plant.r_id}`}>{plant.name}</a>
                  </Col>
                  <Col>{plant.days_to_maturity}</Col>
                  <Col>{plant.yield}</Col>
                </Row>
              );
            })}
          </Grid>
        </div>
      </div>
    );
  }
}

export default PlantList;
