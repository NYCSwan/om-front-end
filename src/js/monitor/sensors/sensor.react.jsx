import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Row, Col } from 'react-bootstrap';
// import findKey from 'lodash/findKey';
// import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import moment from 'moment';
import { invokeApig } from '../../../libs/awsLibs';
import LineGraph from '../../D3/lineGraph';
import FilterButtonGroup from '../../components/filter_button.react';
import styles from '../../../styling/sensor.css';
import Spinner from '../../helpers/spinner.react';

class Sensor extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
      url: PropTypes.string
    }).isRequired
  };

  state = {
    chamberId: 1,
    graphWidth: 300,
    graphHeight: 200,
    chambers: [],
    sensorData: [],
    isLoading: true,
    growingPlants: []
  };

  async componentDidMount() {
    console.log('componentDidMount sensor');
      try {
        const results = await this.growingPlantsData();
        this.setState({growingPlants: results});
        const chamberResults = await this.getAllChamberData();
        this.setState({chambers: chamberResults});
        const sensorResults = await this.getSensorMeasurementData();
        this.setState({sensorData: sensorResults});
      } catch(e) {
        console.log(e);
      }
    this.setState({ isLoading: false });
  }

  shouldComponentUpdate(newProps, newState) {
    console.log('shouldComponentUpdate sensor');
    return (
      this.state.sensorData !== newState.sensorData ||
      this.state.chamberId !== newState.chamberId ||
      this.state.graphWidth !== newState.graphWidth ||
      this.state.graphHeight !== newState.graphHeight ||
      this.state.growingPlants !== newState.growingPlants
    );
  }

  growingPlantsData = () => {
    console.log('get growing plant data- sensor measurement data');
    return invokeApig({ path: '/gardens' });
  };

  getAllChamberData() {
    console.log('get chamber info');
    return invokeApig({ path: '/chambers' });
  };

  getSensorMeasurementData() {
    console.log('get sensor measurents');
      return invokeApig({  path: `/sensorData` })
  };

  handleChamberIdChange = newChamber => {
    console.log('handleChamberIdChange');
    let tempChamber = 0;
    if (newChamber == null) {
      tempChamber = 1;
    } else {
      tempChamber = newChamber;
    }
    this.setState({
      chamberId: tempChamber
    });
  };

  renderStartDate() {
    console.log('render start date');
    const { growingPlants, chamberId } = this.state;
    const tempChamber = `Chamber ${chamberId}`;
    const plant = pickBy(growingPlants, plant => plant.chamberId === tempChamber)
    return moment(plant[0].createdAt).format("dddd, MMM Do");

  }

  render() {
    console.log('render sensor');
    const { chambers, chamberId, graphHeight, graphWidth, sensorData, growingPlants } = this.state;
    const today = new Date();
    const oneWeekAgo = {'oneWeekAgo': moment(today).subtract(7, 'days')};
    const oneMonthAgo = {'oneMonthAgo': moment(today).subtract(1, 'months')};
    // let startedOnMonth = 0;
    // const currentPlantInfo = pickBy(growingPlants, plant => plant.chamber_id === chamberId);
    // const plantKey = findKey(currentPlantInfo);

    // if (isEmpty(currentPlantInfo) === false) {
    //   startedOn = new Date(Date.parse(currentPlantInfo[plantKey].started_datetime)).toLocaleString();
    //   // startedOnMonth = Date.parse(currentPlantInfo[plantKey].started_datetime).getDate();
    // }

    const sensorName = this.props.match.params.sensor_id;

    return (
      <div className={styles.sensor}>
          <FilterButtonGroup
            onChange={this.handleChamberIdChange}
            chamberId={chamberId}
            options={chambers}
          />
          { this.state.sensorData.length >= 1
          ?
          <div >
            <div className={styles.currentSensorReading}>
              { sensorData[0].temperature }
            </div>
            <LineGraph
              chamberId={chamberId}
              sensorData={sensorData}
              sensor={sensorName}
              graphHeight={graphHeight}
              graphWidth={graphWidth}
              endDate={today}
              startDate={oneWeekAgo}
              match={this.props.match}
            />
            <LineGraph
              chamberId={chamberId}
              sensorData={sensorData}
              sensor={sensorName}
              graphHeight={graphHeight}
              graphWidth={graphWidth}
              endDate={today}
              startDate={oneMonthAgo}
              match={this.props.match}
            />
              <h4> Started</h4>
              {this.renderStartDate()}
          </div>
          :
          <Spinner />
        }
      </div>
    );
  }
}

export default Sensor;
