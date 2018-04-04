import React, { Component } from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import map from 'lodash/map';
import findKey from 'lodash/findKey';

import LoaderButton from '../components/LoaderButton.react';
import checkmark from "../../media/check_mark_icon.png";
import styles from '../../styling/directions.css';

class Directions extends Component {
  static propTypes = {
    newGrowPlant: PropTypes.object.isRequired,
    directions: PropTypes.arrayOf(PropTypes.string).isRequired,
    plant: PropTypes.string.isRequired,
    handlePhClick: PropTypes.func.isRequired,
    handleClick: PropTypes.func.isRequired,
    isBalanced: PropTypes.bool.isRequired
    // showPlantsDirections: PropTypes.bool.isRequired,
  };

  state = {
    balancing: false,
    balanced: false
  };

  shouldComponentUpdate(newProps, newState) {
    return (
      this.props.isBalanced !== newProps.isBalanced || this.state.balanced !== newState.balanced ||  this.state.balancing !== newState.balancing ||       this.props.directions !== newProps.directions
    );
  }

  handleClickUpdate = () => {
    console.log('handle click update: timeout 0');
    this.setState({ balancing: true });
    this.balancingDemo();
    this.props.handlePhClick();
  };

  balancingDemo = () => {
    setTimeout(() => {
      console.log('timeout 10000');
      this.setState({ balanced: true });
    }, 10000);
    this.setState({ balancing: false });
  }

  handleNextClick = () => {
    console.log('handle next click');
    this.props.handleClick();
  };

  render() {
    console.log('render directions');
    const { directions } = this.props;
    const phdirections = filter(directions, function(direction) { return direction.phBalance});
    const key = findKey(phdirections);
// debugger
    return (
      <main className={styles.directionsright}>
        { map(phdirections[key].phBalance, function( line) { return <p key={line}>{line}</p> })}
        <p>This may take up to 5 minutes...</p>
      {this.state.balanced === true
        ?
          <div>
            <img
              className={styles.checkmark}
              alt="check mark pH is balanced!"
              src={checkmark} />
            <button
              className={styles.nextBtn}
              onClick={this.handleNextClick}>Next</button>
          </div>
        :
          <LoaderButton
            isloading={this.state.balancing}
            onClick={this.handleClickUpdate}
            text={'pH Balance Water'}
            disabled={this.state.balanced}
            loadingtext={'Balancing...'} />
        }
        </main>
    );
  }
}

// the buttons is messed up-- not changing on balancing or hitting debugger
export default Directions;
