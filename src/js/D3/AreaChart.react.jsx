import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { AreaChart, Area, XAxis, YAxis } from 'recharts';
import moment from 'moment';
import chunk from 'lodash/chunk';
import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';


import styles from '../../styling/areaChart.css';

class ChartArea extends Component {
  static propTypes = {
    currentData: PropTypes.arrayOf(PropTypes.object).isRequired,
    graphWidth: PropTypes.number.isRequired,
    graphHeight: PropTypes.number.isRequired,
    startDate: PropTypes.instanceOf(Object).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    margin: PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      right: PropTypes.number,
      left: PropTypes.number
    }).isRequired,
    sensor: PropTypes.string.isRequired,
    maxY: PropTypes.number.isRequired,
    minY: PropTypes.number.isRequired
  }

  state = {
    dataForTimePeriod: []
  }

  componentDidMount() {
    this.setSensorData();
  }

  shouldComponentUpdate (newProps, newState) {
    console.log('shouldComponentUpdate areaChart');
    return (
      this.props.currentData !== newProps.currentData ||  this.props.sensor !== newProps.sensor || this.state.dataForTimePeriod !== newState.dataForTimePeriod
    )
  }

  setSensorData = () => {
    console.log('narrow sensor data to 7 points');
    // select 5 representative data points and any outliers if outliers is for longer than 3 hours.
    const { currentData } = this.props;
    // break data into 7 (%7==0) groups
    const numberForEachGroup = Math.ceil(currentData.length/7);
    const slicedData = chunk(currentData, numberForEachGroup);
    const averageArray = [];
    const agregatedDataPoints = [];
    // find average
    forEach(slicedData, function(chunk) {
      const sum = reduce(chunk, function(sum, n) {
        return sum + n.value;
      }, 0)
      const avg = sum/ chunk.length
      averageArray.push(avg);
    })
    // find datapoint that is closest to the average: *** REFACTOR ***
    forEach(slicedData, function(chunk) {
      let closestToAvg = {};
      let differenceFromAvg = 10000;
      let key = 0;
      // find the value that is closest to the average.len-1
      forEach(chunk, function(datapoint) {
        if (datapoint.value > averageArray[key]) {
          const tempDiff = datapoint.value - averageArray[key]
          if(tempDiff < differenceFromAvg) {
            differenceFromAvg = datapoint.value - averageArray[key];
            closestToAvg = datapoint;
          }
        } else {
          const tempDiff = averageArray[key] - datapoint.value;
          if (tempDiff < differenceFromAvg) {
            differenceFromAvg = datapoint.value - averageArray[key];
            closestToAvg = datapoint;
          }
        }
      })
      agregatedDataPoints.push(closestToAvg);
      console.log(chunk);
      key+=1;
      // for each value in chunk find diff
      // save difference if nearest as
      // save datapoint
      // if exact same difference, skip it

    })
    // debugger
    // find outliers
    // const outliers = this.findOutlierDataPoints();
    // push into state
    this.setState({ dataForTimePeriod: agregatedDataPoints});
  }

  findOutlierDataPoints = () => {
    console.log('find outliers');
    // const { sensorData, sensor } = this.props;
    // filter any value is within the sensor range,
    // if results are sequential && longer than 3 mins,
    // return sample datapoint for each result.

  }

  dateFormatter = (tick) => { // eslint-disable-line

    const { endDate, startDate } = this.props;
    if (endDate - startDate === 604800000 ){
      return moment(tick).format('ddd, Do');
    } else if (endDate - startDate > 604800000){
      return moment(tick).format('dd');
    }
  }

  render() {
    console.log('render areaChart');
    const { graphHeight, graphWidth, margin, minY, maxY, label } = this.props;

    const dataMinRound = (Math.floor(minY / 5) * 5);
    const dataMaxRound = (Math.ceil(maxY / 5) * 5);
    // console.log(currentData);
// debugger
    return (
      <AreaChart
        width={graphWidth}
        height={graphHeight}
        data={this.state.dataForTimePeriod}
        margin={{
          top: margin.top,
          right: margin.right,
          bottom: margin.bottom,
          left: margin.left
       }}
       stackOffset='expand'
       className={styles.chart}>
        <defs>
          <linearGradient
            id="valueColor"
            x1="0"
            y1="0"
            x2="0"
            y2="1">
            <stop
              offset="20%"
              stopColor="rgba(168,168,168, 0.1)"
              stopOpacity={0.0}/>
            <stop
              offset="100%"
              stopColor="#605E5E"
              stopOpacity={1.0}/>
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          tick={{ stroke:'#ccccccc', strokeWidth: 2 }}
          tickCount={5}
          stroke='rgb(168,168,168)'
          tickFormatter={this.dateFormatter}
        />
        <YAxis
          domain={[dataMinRound, dataMaxRound]}
          tick={{ stroke:'#cccccc', strokeWidth: 1 }}
          tickCount={5}
          tickLine={false}
          stroke='rgb(168,168,168)'
          label={label}>
        </YAxis>
        <Area
          dataKey='value'
          dot={{stroke: 'rgb(170,170,170)', strokeWidth: 2 }}
          connectNulls={true}
          type='natural'
          stroke='rgb(168,168,168)'
          fillOpacity={1}
          fill='url(#valueColor)' />
      </AreaChart>
    )
  }
}


export default ChartArea;
