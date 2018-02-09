import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import findKey from 'lodash/findKey';

import SettingsList from './settings_list.react';

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

  render() {
    console.log('render directions');
    const { newGrowPlant, climates, selectedChamber } = this.props;
    // debugger
    const plantKey = findKey(newGrowPlant);
    const growingDirections = newGrowPlant[plantKey].planting_directions;
    return (
      <div className="directions container">
        <SettingsList chamber={selectedChamber} climates={climates} newGrowPlant={newGrowPlant} />
        <div className="directions right" pullRight>
          <Grid>
            <Row key="growingDirections">
              <Col className="Futura-Lig" xs={5} md={6}>
                {' '}
                {growingDirections}
              </Col>
            </Row>
          </Grid>
          <a href={`/plants/${newGrowPlant[plantKey].r_id}`} alt="Start Growing!">
            <Button className="balanced Futura-Lig" onClick={this.handleClick}>
              Start Growing!
            </Button>
          </a>
        </div>
      </div>
    );
  }
}

export default PlantingDirections;
