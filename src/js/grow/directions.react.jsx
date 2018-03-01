import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import findKey from 'lodash/findKey';

import SettingsList from './settings_list.react';

class Directions extends Component {
  static propTypes = {
    newGrowPlant: PropTypes.objectOf(PropTypes.object).isRequired,
    climates: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleClick: PropTypes.func.isRequired,
    isBalanced: PropTypes.bool.isRequired,
    selectedChamber: PropTypes.string.isRequired
    // onClick: PropTypes.func.isRequired
  };

  state = {
    balancing: false,
    balanced: false
  };

  // componentDidMount() {
  //   this.updateSettings();
  // }

  shouldComponentUpdate(newProps, newState) {
    return (
      this.props.newGrowPlant !== newProps.newGrowPlant ||
      this.props.isBalanced !== newProps.isBalanced ||
      this.state.balancing !== newState.balancing ||
      this.state.balanced !== newState.balanced
    );
  }

  handleClickUpdate = () => {
    this.setState({ balancing: true });
    console.log('timeout 0');
    setTimeout(() => {
      this.setState({ balanced: true });
      console.log('timeout 10000');
    }, 10000);
  };

  handleNextClick = () => {
    this.props.handleClick();
  };
  render() {
    console.log('render directions');
    const { newGrowPlant, settings, directions, selectedChamber } = this.props;

    return (
      <div className="directions container">
      <SettingsList
        chamber={selectedChamber}
        settings={settings}
        newGrowPlant={newGrowPlant} />
      <div className="directions right" pullRight>
      <Grid>
      <Row key={1}>
      <Col className="Futura-Lig" xs={5} md={6}>
      {' '}
      {directions}
      </Col>
      <Col className="Futura-Lig" xs={5} md={6}>
      This may take about 5 minutes...
      </Col>
      </Row>
      </Grid>
      </div>
      {this.state.balanced === true ? (
          <div>
          <img className="check_mark" alt="check mark pH is balanced!" src="../public/img/check_mark_icon.png" />
          <Button onClick={this.handleNextClick}>Next</Button>
          </div>
        ) : (
          <Button className="balanced Futura-Lig" onClick={this.handleClickUpdate}>
          {this.state.balancing === true ? 'Balancing...' : 'pH Balance Water'}
          </Button>
        )}
      </div>
    );
  }
}

export default Directions;
