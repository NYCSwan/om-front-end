import React, { Component } from 'react';
import PropTypes from 'prop-types';
import findKey from 'lodash/findKey';
// import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import moment from 'moment';
import { invokeApig } from '../../../libs/awsLibs';
import LineGraph from '../../D3/lineGraph';
import FilterButtonGroup from '../../components/filter_button.react';
import styles from '../../../styling/sensor.css';
import Spinner from '../../helpers/spinner.react';
// import pH from '../../../media/pH_icon.png';
// import humidity from '../../../media/humidity_icon.png';
// import temperature from '../../../media/temperature_icon.png';
// import waterlevel from '../../../media/water_level_icon.png';

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
    isloading: true,
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
    this.setState({ isloading: false });
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
    const { chambers } = this.state;
    const tempChamberPlant = newChamber.target.value;
    const tempChamber = pickBy(chambers, chamber => chamber.plantName === tempChamberPlant);

    this.setState({ chamberId: tempChamber.chamberId });
  };

  renderStartDate() {
    console.log('render start date');
    const { growingPlants, chamberId } = this.state;
    const tempChamber = chamberId.toString();
    const plant = pickBy(growingPlants, plant => plant.chamberId === tempChamber)
    const key = findKey(plant);
    return moment(plant[key].createdAt).format("dddd, MMM Do");

  }
  renderCurrentSensorReading() {
    const {chamberId, sensorData} = this.state;
    const sensorName = this.props.match.params.sensor_id;

    return (
      <aside className={styles[`${sensorName}`]}>
        <div className={styles.texttop}>
          <h5>Chamber {chamberId}'s current {sensorName}</h5>
          <h4 className={styles.textbottom}>{ sensorData[0][`${sensorName}`] }</h4>
        </div>
      </aside>
    )
  }

  render() {
    console.log('render sensor');
    const { chambers, chamberId, graphHeight, graphWidth, sensorData } = this.state;
    const today = new Date();
    const oneWeekAgo = moment(today).subtract(7, 'days');
    const oneMonthAgo = moment(today).subtract(1, 'months');
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
          <div>
            { this.renderCurrentSensorReading() }
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
              <div className={styles.startDate}>
                <h4>Started</h4>
                {this.renderStartDate()}
              </div>
          </div>
          :
          <Spinner />
        }
      </div>
    );
  }
}

export default Sensor;
