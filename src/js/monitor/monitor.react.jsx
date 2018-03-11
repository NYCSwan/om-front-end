import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
// import findKey from 'lodash/findKey';
// import findLastIndex from 'lodash/findLastIndex';
// import isEmpty from 'lodash/isEmpty';
// import forIn from 'lodash/forIn';
// import pickBy from 'lodash/pickBy';
// import { ListGroup } from 'react-bootstrap';
import styles from '../../styling/monitor.css';
import FilterButtonGroup from '../components/filter_button.react';
import { invokeApig } from '../../libs/awsLibs';
import Spinner from '../helpers/spinner.react';
// import pH from '../../media/pH_icon.png';
// import ppm from '../../media/ppm_icon.png';
//
// import humidity from '../../media/humidity_icon.png';
// import temperature from '../../media/temperature_icon.png';
import waterlevel from '../../media/water_level_icon.png';
import lightsOn from '../../media/light_icon_white.png';
import lightsOff from '../../media/light_icon_grey.png';

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
    lightOn: true
  };

  async componentDidMount() {
    console.log('componentDidMount monitor');
    try {
      const results = await this.growingPlants();
      this.setState({growingPlants: results});
      const chamberResults = await this.getAllChamberData();
      this.setChambers(chamberResults);
      // debugger
      const sensorResults = await this.getSensorMeasurementData();
      this.setSensorData(sensorResults);
    } catch(e) {
      console.log(e);
    }
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

  handleGardenClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
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
                  <h4>RH</h4>
                </Link>
              </div>

              <div className={styles.turbidityContainer}>
                <Link
                className={styles.turbiditylink}
                to='/monitor/turbidity'>
                  <h2 className={styles.xBigFont}>{latest.turbidity}%</h2>
                  <h4>RH</h4>
                </Link>
              </div>

              <div className={styles.temperatureContainer}>
                <Link
                  className={styles.temperaturelink} to='/monitor/temperature'>
                  <h2 className={styles.xBigFont}>{latest.temperature}*</h2>
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
                <h4 className={styles.lighting}>
                  light on/off
                </h4>
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
