import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { max, min } from 'd3-array';
import isEmpty from 'lodash/isEmpty';
import ChartArea from './AreaChart.react';

class LineGraph extends Component {
  static propTypes = {
    sensorData: PropTypes.arrayOf(PropTypes.object).isRequired,
    graphWidth: PropTypes.number.isRequired,
    graphHeight: PropTypes.number.isRequired,
    startDate: PropTypes.instanceOf(Date).isRequired,
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
    maxX: 0
  }

  componentDidMount() {
    console.log('comonpent mounted linegraph');
      this.extractMaxMin();
  }

  componentWillReceiveProps({ sensorData, chamberId, sensor }) {
    console.log('componentWillReceiveProps linegraph');
    // eslint-disable-next-line
    if ((sensorData !== this.props.sensorData) && (this.props.sensorData.length >0 ) || (sensor !== this.props.sensor) || (chamberId !== this.props.chamberId)) {
      console.log('change data, data, sensor or chamber changed');
      this.extractMaxMin()
    }
  }

  shouldComponentUpdate (newProps, newState) {
    console.log('shouldComponentUpdate lineGraph');
    return this.props.endDate !== newProps.endDate || this.props.sensorData !== newProps.sensorData || this.state.maxY !== newState.maxY || this.state.minY !== newState.minY || this.props.sensor !== newProps.sensor || this.props.chamberId !== newProps.chamberId
  }

  componentDidUpdate() {
    this.extractMaxMin();
  }

  extractMaxMin = () => {
    console.log('extractMaxMin');
    const { startDate, endDate, sensorData } = this.props;
    const dates = [];

    dates.push(startDate);
    dates.push(endDate);

    if(isEmpty(sensorData) === false) {
      const tempMaxY = max(sensorData, (d) => d.value);
      const tempMinY = min(sensorData, (d) => d.value);
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

  render() {
    console.log('render lineGraph');
    const { graphHeight, graphWidth, sensorData, match, margin, sensor, startDate, endDate } = this.props;

    return (
      <div className="areaChart container">
        <a href={`${match.url}`} alt={`${sensor} details`}>
          <ChartArea
            graphWidth={graphWidth}
            graphHeight={graphHeight}
            currentData={sensorData}
            margin={{ top: margin.top, right: margin.right, bottom: margin.bottom, left: margin.left }}
            endDate={endDate}
            startDate={startDate}
            sensor={sensor}
            maxY={this.state.maxY}
            minY={this.state.minY}
          />
        </a>
      </div>
    )
  }
}

LineGraph.defaultProps = {
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 0
    }
}

export default LineGraph;
