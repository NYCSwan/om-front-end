import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/fontawesome-free-regular';
import pickBy from 'lodash/pickBy';
import findKey from 'lodash/findKey';

import styles from '../../styling/monitor.css';
import FilterButtonGroup from '../components/filter_button.react';
import { invokeApig } from '../../libs/awsLibs';
import Spinner from '../helpers/spinner.react';
import waterlevel from '../../media/waterlevel_icon.png';
import lightsOn from '../../media/light_icon_white.png';
import lightsOff from '../../media/light_icon_grey.png';
import Notifications from '../components/notifications.react';

fontawesome.library.add(faCircle);

class Monitor extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string
    }).isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };

  state = {
    chamberId: 1,
    chamberData: [],
    growingPlants: [],
    chambers: [],
    isloading: true,
    lightOn: true,
    notifications: [],
    currentPlantName: '',
    showNotifications: true
  };

  async componentDidMount() {
    console.log('componentDidMount monitor');
    // debugger
    if (!this.props.location.state) {
      try {
        const results = await this.growingPlants();
        this.setState({growingPlants: results});
        const chamberResults = await this.getAllChamberData();
        this.setChambers(chamberResults);
        const sensorResults = await this.getSensorMeasurementData();
        this.setSensorData(sensorResults);
        this.setCurrentPlantName();

        if(this.props.isAuthenticated) {
          this.props.history.push({
            pathname: this.props.location.pathname,
            state: {
              chamberId: this.state.chamberId,
              chamberData: this.state.chamberData,
              growingPlants: this.state.growingPlants,
              currentPlantName: this.state.currentPlantRecipe,
              chambers: this.state.chambers,
              lightOn: this.state.lightOn,
              notifications: this.state.notifications
            }
          })
        }
      } catch(e) {
        console.log(e);
      }
    } else {
      console.log('set state to location state');
      this.setStateFromHistory();

      if (!this.props.history.location.chamberData) {
        const sensorResults = await this.getSensorMeasurementData();
        this.setSensorData(sensorResults);
      }
    }

    this.props.setTitle('Dashboard');
    this.setState({ isloading: false });
  }

  shouldComponentUpdate(newState) {
    console.log('shouldComponentUpdate monitor');
    return (  // eslint-disable-line
      this.state.chamberId !== newState.chamberId ||
      this.state.chamberData !== newState.chamberData ||
      this.state.growingPlants !== newState.growingPlants
    );
  }


  getGrowingPlantsData = () => {
    console.log('get growing plant data- sensor measurement data');
    return invokeApig({ path: '/gardens' });
  };

  getAllChamberData() {
    console.log('get chamber info');
    return invokeApig({ path: '/chambers' });
  };

  getSensorMeasurementData() {
    console.log('get sensor measurents by chamber id');
      return invokeApig({ path: `/sensorData` })
  };


  setCurrentPlantName = () => {
    console.log('set current plant in state');
    const currentPlant = pickBy(this.state.growingPlants, recipe => this.state.chamberId === parseInt(recipe.chamberId, 10));
    const key = findKey(currentPlant);
    // debugger
    this.setState({ currentPlantName: currentPlant[key].plantName });
  }

  setStateFromHistory = () => {
    const { chambers, chamberId, currentPlantName, growingPlants, notifications } = this.props.history.location.state;

    this.setState({
      chamberId,
      growingPlants,
      chambers,
      notifications,
      currentPlantName
    })

    if (this.props.history.location.state.chamberData) {
      this.setState({
        chamberData: this.props.history.location.state.chamberData
      });
    }
  }

  setChambers = (chamberResults) => {
    console.log('set chambers in state');

    this.setState({ chambers: chamberResults });
  }

  setSensorData = (sensorResults) => {
    console.log('set sensor data in state');
    this.setState({ chamberData: sensorResults });
  }

  growingPlants() {
    console.log('get growing plants from db');
    return invokeApig({ path: "/gardens" });  // eslint-disable-line
  }

  handleChamberIdChange = newChamber => {
    console.log('handleChamberIdChange');
    const { growingPlants } =  this.state;
    // let tempChamber = newChamber.target.value;

    for(var key in growingPlants) {
      if(growingPlants[key].plantName === newChamber || parseInt(growingPlants[key].chamberId, 10) === newChamber){

        this.setState({chamberId: growingPlants[key].chamberId.slice(-1) });
      }
    }
  };

  close = () => {
    console.log('close notifications');
    this.setState({ showNotifications: false });
  }

  renderLander = () => {
    return (
      <div className={styles.lander}>
        <Spinner />
      </div>
    )
  }


  handleLight = () => {
    console.log('turn lights on or off');
    this.setState({ lightOn: !this.state.lightOn });
  }

  renderDayInCycle() {
    console.log('render day of cycle');
    const { growingPlants, chamberId } = this.state;
    const now = moment(new Date());
    let then;

    for(var key in growingPlants) {
      if (parseInt(growingPlants[key].chamberId, 10) === chamberId) {
        then = moment(growingPlants[key].createdAt);
      }
    }
    const days = now.diff(then, 'days');
    // debugger

    return days;
  }

  render() {
    console.log('render monitor');
    const { chamberData, chambers, chamberId } = this.state;
    const latest = chamberData[0];
    // const dayOfCycle = ();
    return (
      <div className={styles.monitor}>
        <FilterButtonGroup
          onChange={this.handleChamberIdChange}
          chamberId={chamberId}
          options={chambers}
          key={chamberId}
        />

        { (this.props.history.location.state.notifications.length >= 1)
          ?
          <Notifications
            notifications={this.state.notifications}
            close={this.close} />
          :
          null
          }

        { this.state.chamberData.length >= 1
          ?

            <div className={styles.bubbles}>
            { this.state.lightOn ?
              <div
                className={styles.light}
                onClick={this.handleLight}>
                <img src={lightsOn} alt='light on/off' />
              </div>
              :
              <div
                className={styles.light}
                onClick={this.handleLight}>
                <img src={lightsOff} alt='light on/off' />
              </div>
            }
              <div className={styles.humidityContainer}>
                <Link
                  className={styles.humiditylink}
                  to={{
                    pathname: '/monitor/humidity',
                    state: {
                      chamberId: this.state.chamberId,
                      sensorData: this.state.chamberData,
                      growingPlants: this.state.growingPlants,
                      chambers: this.state.chambers,
                      plantName: this.state.currentPlantName
                    }
                  }}>
                  <h2 className={styles.xBigFont}>{latest.humidity}%</h2>
                  <h4>RH</h4>
                </Link>
              </div>
              <div className={styles.turbidityContainer}>
                <Link
                className={styles.turbiditylink}
                to={{
                  pathname: '/monitor/turbidity',
                  state: {
                    chamberId: this.state.chamberId,
                    sensorData: this.state.chamberData,
                    growingPlants: this.state.growingPlants,
                    chambers: this.state.chambers,
                    plantName: this.state.currentPlantName

                  }
                }}>
                  <h2 className={styles.turbidity}>{latest.turbidity}</h2>
                  <h4>PPM</h4>
                </Link>
              </div>
              <div className={styles.temperatureContainer}>
                <Link
                  className={styles.temperaturelink}
                  to={{
                    pathname: '/monitor/temperature',
                    state: {
                      chamberId: this.state.chamberId,
                      sensorData: this.state.chamberData,
                      growingPlants: this.state.growingPlants,
                      chambers: this.state.chambers,
                      plantName: this.state.currentPlantName

                    }
                  }}>
                  <h2 className={styles.xBigFont}>
                    {latest.temperature}
                    <FontAwesomeIcon icon={faCircle} className={styles.fontawesome}/>
                  </h2>
                  <h4>F</h4>
                </Link>
              </div>
              <div className={styles.phContainer}>
                <Link
                  className={styles.phlink}
                  to={{
                    pathname: '/monitor/pH',
                    state: {
                      chamberId: this.state.chamberId,
                      sensorData: this.state.chamberData,
                      growingPlants: this.state.growingPlants,
                      chambers: this.state.chambers,
                      plantName: this.state.currentPlantName

                    }
                  }}>
                  <h2 className={styles.pH} key={latest.timestamp}>
                  {latest.pH}
                  </h2>
                  <h4>pH</h4>
                </Link>
              </div>
              <div className={styles.waterlevelContainer}>
                <Link
                  className={styles.waterlevelink}
                  to={{
                    pathname: '/monitor/waterlevel',
                    state: {
                      chamberId: this.state.chamberId,
                      sensorData: this.state.chamberData,
                      growingPlants: this.state.growingPlants,
                      chambers: this.state.chambers,
                      plantName: this.state.currentPlantName

                    }
                  }}
                >
                  <div>
                    <img src={waterlevel} alt="water level icon" />
                  </div>
                </Link>
              </div>
                <h3 className={styles.dayOfCycle}>
                  Day {this.renderDayInCycle()}
                </h3>
            </div>
        :
          this.renderLander()
      }
      </div>
    );
  }
}

export default Monitor;
