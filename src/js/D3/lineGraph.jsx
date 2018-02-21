import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { max, min } from 'd3-array';
import isEmpty from 'lodash/isEmpty';
import ChartArea from './AreaChart.react';
import styles from '../../styling/lineGraph.css';

class LineGraph extends Component {
  static propTypes = {
    sensorData: PropTypes.arrayOf(PropTypes.object).isRequired,
    graphWidth: PropTypes.number.isRequired,
    graphHeight: PropTypes.number.isRequired,
    startDate: PropTypes.instanceOf(Object).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    margin: PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      right: PropTypes.number,
      left: PropTypes.number
    }),
    sensor: PropTypes.string.isRequired,
    chamberId: PropTypes.number.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object,
      path: PropTypes.string
    }).isRequired

  }

  state = {
    maxY: 0,
    minY: 0,
    minX: 0,
    maxX: 0,
    currentData: []
  }

  componentDidMount() {
    console.log('comonpent mounted linegraph');
      this.extractMaxMin();
      this.extractSingleSensorData();
  }

  // componentWillReceiveProps({ sensorData, chamberId, sensor }) {
  //   console.log('componentWillReceiveProps linegraph');
  //   // eslint-disable-next-line
  //   if ((sensorData !== this.props.sensorData) && (this.props.sensorData.length >0 ) || (sensor !== this.props.sensor) || (chamberId !== this.props.chamberId)) {
  //     console.log('change data, data, sensor or chamber changed');
  //     this.extractMaxMin()
  //   }
  // }

  shouldComponentUpdate (newProps, newState) {
    console.log('shouldComponentUpdate lineGraph');
    return this.props.endDate !== newProps.endDate || this.props.sensorData !== newProps.sensorData || this.state.maxY !== newState.maxY || this.state.minY !== newState.minY || this.props.sensor !== newProps.sensor || this.props.chamberId !== newProps.chamberId
  }
  //
  // componentDidUpdate() {
  //   this.extractMaxMin();
  // }

  extractMaxMin = () => {
    console.log('extractMaxMin');
    const { startDate, endDate, sensorData } = this.props;
    const dates = [];
    const value = this.props.match.params.sensor_id;
    dates.push(startDate._d);
    dates.push(endDate);
    // debugger;
    if(isEmpty(sensorData) === false) {
      const tempMaxY = max(sensorData, (d) => parseFloat(d[`${value}`]));
      const tempMinY = min(sensorData, (d) => parseFloat(d[`${value}`]));
      const tempMaxX = max(dates);
      const tempMinX = min(dates);
      if (tempMaxX !== this.state.maxX) {
        this.setState({ maxX: tempMaxX })
      }
      if (tempMinX !== this.state.minX) {
        this.setState({ minX: tempMinX })
      }
      if (tempMaxY !== this.state.maxY) {
        this.setState({ maxY: tempMaxY })
      }
      if (tempMinY !== this.state.minY) {
        this.setState({ minY: tempMinY })
      }
    }
  }

  extractSingleSensorData = () => {
    const { sensorData, sensor, startDate } = this.props;
    const tempData = [];
    let temp = {};
    const tempStartDate = startDate._d.getTime();

    for (let i= 0; i < sensorData.length; i++) {
      if((sensorData[i].timestamp >= tempStartDate) === true) {
      temp[i] = {
        'time': sensorData[i].timestamp,
        'value': parseFloat(sensorData[i][`${sensor}`])
      }
    }
      tempData.push(temp[i]);
    };

    this.setState({ currentData: tempData });
  }

  render() {
    console.log('render lineGraph');
    const { graphHeight, graphWidth, margin, sensor, startDate, endDate } = this.props;
    const { currentData } = this.state;

    return (
      <div className={styles.areaChartContainer}>
      { currentData.length >= 1 &&
          <ChartArea
            graphWidth={graphWidth}
            graphHeight={graphHeight}
            currentData={currentData}
            margin={{ top: margin.top, right: margin.right, bottom: margin.bottom, left: margin.left }}
            endDate={endDate}
            startDate={startDate}
            sensor={sensor}
            maxY={this.state.maxY}
            minY={this.state.minY}
          />
      }
      </div>
    )
  }
}

LineGraph.defaultProps = {
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 10
    }
}

export default LineGraph;
