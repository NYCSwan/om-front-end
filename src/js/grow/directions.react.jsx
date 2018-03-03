import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Grid, Row, Col, Button } from 'react-bootstrap';
import filter from 'lodash/filter';
import map from 'lodash/map';

import checkmark from "../../media/check_mark_icon.png";
import styles from '../../styling/directions.css';

class Directions extends Component {
  static propTypes = {
    newGrowPlant: PropTypes.object.isRequired,
    handlePhClick: PropTypes.func.isRequired,
    handleClick: PropTypes.func.isRequired,
    isBalanced: PropTypes.bool.isRequired,
    selectedChamber: PropTypes.number.isRequired,
    showPlantsDirections: PropTypes.bool.isRequired,
    directions: PropTypes.arrayOf(PropTypes.string).isRequired,
    plant: PropTypes.string.isRequired
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
      this.props.isBalanced !== newProps.isBalanced ||       this.props.directions !== newProps.directions ||
      this.props.selectedChamber !== newProps.selectedChamber ||
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
    this.setState({ balancing: false });
    this.props.handlePhClick();
  };

  handleNextClick = () => {
    this.props.handleClick();
  };

  render() {
    console.log('render directions');
    const { newGrowPlant, settings, directions, selectedChamber } = this.props;
    const phdirections = filter(directions, function(direction) { return direction.phBalance})

    return (
      <main className={styles.directionsright}>
        { map(phdirections[0].phBalance, function( line) { return <p>{line}</p> })}
        <p>This may take up to 5 minutes...</p>
      {this.state.balanced === true
        ?
          <div>
            <img
              className={styles.checkmark} alt="check mark pH is balanced!" src={checkmark} />
            <button
              onClick={this.handleNextClick}>Next</button>
          </div>
         :
          <button
            className={styles.balanced} onClick={this.handleClickUpdate}>
          {this.state.balancing === true ? 'Balancing...' : 'pH Balance Water'}
          </button>
        }
        </main>
    );
  }
}

export default Directions;
