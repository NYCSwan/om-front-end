import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlantDetails from './plant_details.react';
import Notifications from '../components/notifications.react';
import styles from '../../styling/plant_container.css';

class PlantContainer extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object
    }).isRequired,
    details: PropTypes.object
  };

  componentDidMount() {
    console.log('componentDidMount plant container');
    this.props.setTitle('Plant Recipe');
    // load recipe (details) or get from history
    // set details to state object
    // etc
  }

  render() {

    return (
      <div className={styles.plantContainer}>
        <Notifications
          notifications={this.props.location.state.notifications} />
        <PlantDetails
          details={this.props.history.location.state.details}
          match={this.props.match} />
      </div>
    )
  }
}

export default PlantContainer;
