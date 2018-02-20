import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
// import findKey from 'lodash/findKey';
// import findLastIndex from 'lodash/findLastIndex';
// import isEmpty from 'lodash/isEmpty';
// import forIn from 'lodash/forIn';
import pickBy from 'lodash/pickBy';
import { ListGroup } from 'react-bootstrap';
import styles from '../../styling/monitor.css';
import FilterButtonGroup from '../components/filter_button.react';
import { invokeApig } from '../../libs/awsLibs';
// {dayOfCycle}

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
    isLoading: true
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
    this.setState({ isLoading: false });
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
    // const oneMonth = moment().subtract('months', 1).unix()
    // debugger
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
    console.log(newChamber);
    let tempChamber = '';
    if (newChamber != null) {
      tempChamber = newChamber.target.value;
      this.setState({chamberId: tempChamber});
    }
  };

  renderLander = () => {
    return (
      <div className={styles.lander}>
        <h3>Loading your garden's information...</h3>
      </div>
    )
  }

  handleGardenClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderDayInCycle() {
    console.log('render day of cycle');
    const { growingPlants, chamberId } = this.state;
    const tempChamber = `Chamber ${chamberId}`;
    const plant = pickBy(growingPlants, plant => plant.chamberId === tempChamber)
    const now = moment(new Date());
    const then = moment(plant[0].createdAt)
    const days = now.date() - then.date();

    return days;
  }

  renderChambers() {
   return (
       <ListGroup className={styles.listGroup}>
         {!this.state.isLoading && this.renderChambersList(this.state.chambers)}
       </ListGroup>
   );
 }

  render() {
    console.log('render monitor');
    const { chamberData, chambers, chamberId } = this.state;
    const latest = chamberData[0];
    // const dayOfCycle = ();
    // debugger
    return (
      <div className={styles.monitor}>
        <FilterButtonGroup
          onChange={this.handleChamberIdChange}
          chamberId={chamberId}
          options={chambers}
        />
        { this.state.chamberData.length >= 1
          ?
            <div className={styles.bubbles}>
              <Link to='/monitor/ph'>
                <h2 className={styles.xBigFont} key={latest.timestamp}>
                  {latest.pH}
                </h2>
                <h4>pH</h4>
              </Link>
              <Link to='/monitor/temperature'>
                <h2 className={styles.xBigFont}>{latest.temperature}*</h2>
                <h4>F</h4>
              </Link>
              <Link to='/monitor/humidity'>
                <h2 className={styles.xBigFont}>{latest.humidity}%</h2>
                <h4>RH</h4>
              </Link>
              <h4 className={styles.xBigFont}>Day {this.renderDayInCycle()}</h4>
            </div>
        :
          this.renderLander()
      }
      </div>
    );
  }
}

export default Monitor;
