import React, { Component } from 'react';
import PropTypes from 'prop-types';
import findKey from 'lodash/findKey';
import upperFirst from 'lodash/upperFirst';
import replace from 'lodash/replace';
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
    }).isRequired,
    setTitle: PropTypes.func.isRequired
  };

  state = {
    chamberId: 1,
    chambers: [],
    sensorData: [],
    isloading: true,
    growingPlants: []
  };

  async componentDidMount() {
    console.log('componentDidMount sensor');
    const { plantName } = this.props.history.location.state;

    if (!this.props.location.state) {
      try {
        const results = await this.growingPlantsData();
        this.setState({growingPlants: results});
        const chamberResults = await this.getAllChamberData();
        this.setState({chambers: chamberResults});
        const sensorResults = await this.getSensorMeasurementData();
        this.setState({sensorData: sensorResults});

        if(this.props.isAuthenticated) {
          this.props.history.push({
            pathname: this.props.location.pathname,
            state: {
              chamberId: this.state.chamberId,
              sensorData: this.state.sensorData,
              growingPlants: this.state.growingPlants,
              chambers: this.state.chambers
            }
          })
        }
      } catch(e) {
        console.log(e);
      }
    } else {
      console.log('set state from location ');
      this.setStateFromHistory();
    }

    const recipeResult = await this.getRecipeData(plantName);
    this.setState({currentPlantRecipe: recipeResult});

    this.props.setTitle(upperFirst(replace(this.props.match.url, '/monitor/', '')));
    this.setState({ isloading: false });
  }

  shouldComponentUpdate(newProps, newState) {
    console.log('shouldComponentUpdate sensor');
    return (
      this.state.sensorData !== newState.sensorData ||
      this.state.chamberId !== newState.chamberId ||
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
  }

  getRecipeData(plantName) {
    console.log('get recipe data');
    return invokeApig({ path: `/plants`, id: plantName});
  }

  setStateFromHistory = () => {
    const { chambers, chamberId, sensorData, growingPlants } = this.props.history.location.state;

    this.setState({
      chambers,
      chamberId,
      sensorData,
      growingPlants
    })
  }

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
    return <h4>{moment(plant[key].createdAt).format("dddd, MMM Do")}</h4>;

  }
  renderCurrentSensorReading() {
    const {chamberId, sensorData} = this.state;
    const sensorName = this.props.match.params.sensor_id;

    return (
      <aside className={styles[sensorName]}>
        <div className={styles.texttop}>
          <h5>Chamber {chamberId}'s current {sensorName}</h5>
          <h4 className={styles.textbottom}>{ sensorData[0][`${sensorName}`] }</h4>
        </div>
      </aside>
    )
  }

  render() {
    console.log('render sensor');
    const { chambers, chamberId, sensorData } = this.state;
    const today = new Date();
    const oneWeekAgo = moment(today).subtract(7, 'days');
    const oneMonthAgo = moment(today).subtract(1, 'months');
    const sensorName = this.props.match.params.sensor_id;
    let measurement = '';
    if (this.props.match.params.sensor_id === 'temperature') {
      measurement = '( F )';
    } else if (this.props.match.params.sensor_id === 'humidity' || this.props.match.params.sensor_id === 'waterlevel') {
      measurement = '( % )';
    } else {
      measurement = '';
    }

    // debugger
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
              endDate={today}
              startDate={oneWeekAgo}
              match={this.props.match}
            />
            <h3 className={styles.title}>One Week {measurement}</h3>
            <LineGraph
              chamberId={chamberId}
              sensorData={sensorData}
              sensor={sensorName}
              endDate={today}
              startDate={oneMonthAgo}
              match={this.props.match}
            />
            <h3 className={styles.title}>One Month {measurement}</h3>

              <div className={styles.startDate}>
                <h3>Started</h3>
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
