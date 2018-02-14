import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
// import findKey from 'lodash/findKey';
// import isEmpty from 'lodash/isEmpty';
// import pickBy from 'lodash/pickBy';

import { invokeApig } from '../../../libs/awsLibs';
import LineGraph from '../../D3/lineGraph';
import FilterButtonGroup from '../../components/filter_button.react';

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
    sensorData: []
  };

  componentDidMount() {
    console.log('componentDidMount sensor');
    this.getAllChamberData();
    this.getSensorData();
    // this.getGrowingPlantsData();
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

  componentDidUpdate() {
    console.log('componentDidUpdate sensor');
  }

  getAllChamberData = () => {
    console.log('get chamber info');

    const test = invokeApig({ path: '/chambers' }).then(chambers => {
      this.setState({ chambers });
    });
    console.log(test);
  };

  // getGrowingPlantsData = () => {
  //   console.log('get growing plant data- sensor measurement data');
  //
  //   return invokeApig({ path: '/gardens' }).then(gardens => {
  //     this.setState({ growingPlants: gardens });
  //   });
  // };

  getSensorData = () => {
    console.log('get sensor data');
    // const { chamberId } = this.state;
    const sensor = this.props.match.url.slice(9);
    if (sensor !== '') {
      return invokeApig({ path: '/sensorData' })
    } else {
      console.error('shit went wrong');
    }
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

  render() {
    console.log('render sensor');
    const { chambers, chamberId, graphHeight, graphWidth, sensorData } = this.state;
    const today = new Date();
    const yesterday = new Date(today - 1000 * 60 * 60 * 24 * 1);
    const oneWeekAgo = new Date(today - 1000 * 60 * 60 * 24 * 7);
    const full = new Date(today - 1000 * 60 * 60 * 24 * 8);
    // let startedOnMonth = 0;
    let startedOn = 0;
    // const currentPlantInfo = pickBy(growingPlants, plant => plant.chamber_id === chamberId);
    // const plantKey = findKey(currentPlantInfo);

    // if (isEmpty(currentPlantInfo) === false) {
    //   startedOn = new Date(Date.parse(currentPlantInfo[plantKey].started_datetime)).toLocaleString();
    //   // startedOnMonth = Date.parse(currentPlantInfo[plantKey].started_datetime).getDate();
    // }

    const sensorName = this.props.match.url.slice(9);
    console.log(sensorData);
    console.log(chambers);
    console.log(sensorData);
    return (
      <div className="sensor container">
        <div className="filter">
          <FilterButtonGroup onChange={this.handleChamberIdChange} chamberId={chamberId} options={chambers} />
        </div>


        <LineGraph
          chamberId={chamberId}
          sensorData={sensorData}
          sensor={sensorName}
          graphHeight={graphHeight}
          graphWidth={graphWidth}
          endDate={today}
          startDate={yesterday}
          match={this.props.match}
        />
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
          startDate={full}
          match={this.props.match}
        />
        <Row className="bottom container readings">
          <Col className="startedOn half-circle center" xs={6} xsOffset={3} sm={6} smOffset={3} md={6} mdOffset={3}>
            <h4> Started</h4>
            <h2>{startedOn}</h2>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Sensor;
