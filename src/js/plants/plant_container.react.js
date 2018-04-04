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

  state = {
    showNotifications: true
  }
  
  componentDidMount() {
    console.log('componentDidMount plant container');
    this.props.setTitle('Plant Recipe');
    // load recipe (details) or get from history
    // set details to state object
    // etc
  }

  close = () => {
    console.log('close notifications');
    this.setState({ showNotifications: false });
  }

  render() {

    return (
      <div className={styles.plantContainer}>
      { (this.state.showNotifications === true)
        ?
        <Notifications
        notifications={this.props.location.state.notifications}
        close={this.close} />
        :
        null
      }
        <PlantDetails
          details={this.props.history.location.state.details}
          match={this.props.match} />
      </div>
    )
  }
}

export default PlantContainer;
