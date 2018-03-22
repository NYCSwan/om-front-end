import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/fontawesome-free-regular';
import isUndefined from 'lodash/isUndefined';

import styles from '../../styling/monitor.css';
import FilterButtonGroup from '../components/filter_button.react';
import { invokeApig } from '../../libs/awsLibs';
import Spinner from '../helpers/spinner.react';
import waterlevel from '../../media/water_level_icon.png';
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
    notifications: []
  };

  async componentDidMount() {
    console.log('componentDidMount monitor');
    debugger
    if (!this.props.location.state) {
      try {
        const results = await this.growingPlants();
        this.setState({growingPlants: results});
        const chamberResults = await this.getAllChamberData();
        this.setChambers(chamberResults);
        const sensorResults = await this.getSensorMeasurementData();
        this.setSensorData(sensorResults);

        if(this.props.isAuthenticated) {
          this.props.history.push({
            pathname: this.props.location.pathname,
            state: {
              chamberId: this.state.chamberId,
              chamberData: this.state.chamberData,
              growingPlants: this.state.growingPlants,
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
      this.setStateFromHistory()

      const sensorResults = await this.getSensorMeasurementData();
      this.setSensorData(sensorResults);
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
      return invokeApig({ path: `/sensorData/all` })
  };


  setGrowingPlants = (growingResults) => {
    console.log('set growing plants in state');
    this.setState({ growingPlants: growingResults });
  }

  setStateFromHistory = () => {
    const { chambers, chamberId, growingPlants, notifications } = this.props.history.location.state;

    this.setState({
      chamberId,
      growingPlants,
      chambers,
      notifications
    })
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
      if(growingPlants[key].plantName === newChamber || growingPlants[key].chamberId === newChamber){

        this.setState({chamberId: growingPlants[key].chamberId.slice(-1) });
      }
    }
  };

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
      if (growingPlants[key].chamberId === chamberId.toString()) {
        then = moment(growingPlants[key].createdAt);
      }
    }
    const days = now.diff(then, 'days');

    return days;
  }

  renderNotifications(){
    // if (!isUndefined(this.props.location.state.notifications) ) {
    //   this.props.location.state.notifications.map(notification => {
    //     return (
    //       <h3>{notification}</h3>
    //     )
    //   });
    // } else {
    //   return;
    // }
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

        { !isUndefined(this.props.location.state)
          ?
          <Notifications
            notifications={this.state.notifications} />
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
                to='/monitor/humidity'>
                  <h2 className={styles.xBigFont}>{latest.humidity}%</h2>
                  <h4>RH (Humidity)</h4>
                </Link>
              </div>
              <div className={styles.turbidityContainer}>
                <Link
                className={styles.turbiditylink}
                to='/monitor/turbidity'>
                  <h2 className={styles.xBigFont}>{latest.turbidity}</h2>
                  <h4>PPM</h4>
                </Link>
              </div>
              <div className={styles.temperatureContainer}>
                <Link
                  className={styles.temperaturelink} to='/monitor/temperature'>
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
                  to='/monitor/pH'>
                  <h2 className={styles.xBigFont} key={latest.timestamp}>
                  {latest.pH}
                  </h2>
                  <h4>pH</h4>
                </Link>
              </div>
              <div className={styles.waterlevelContainer}>
                <Link
                  className={styles.waterlevelink}
                  to='/monitor/waterlevel'>
                  <img src={waterlevel} alt="water level icon" />
                </Link>
              </div>
                <h4 className={styles.dayOfCycle}>
                  Day {this.renderDayInCycle()}
                </h4>
            </div>
        :
          this.renderLander()
      }
      </div>
    );
  }
}

export default Monitor;
