import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { AreaChart, Area, XAxis, YAxis } from 'recharts';
import moment from 'moment';

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

  // state = {
  //   dataForTimePeriod: []
  // }


  shouldComponentUpdate (newProps, newState) {
    console.log('shouldComponentUpdate areaChart');
    return (
      this.props.currentData !== newProps.currentData ||  this.props.sensor !== newProps.sensor
    )
  }


  dateFormatter = (tick) => { // eslint-disable-line
    // console.log(tick);
    const { endDate, startDate } = this.props;
    if (endDate - startDate === 604800000 ){
      return moment(tick).format('ddd, Do');
    } else if (endDate - startDate > 604800000){
      return moment(tick).format('dd');
    }
  }

  render() {
    console.log('render areaChart');
    const { currentData, graphHeight, graphWidth, margin, minY, maxY, label } = this.props;

    const dataMinRound = (Math.round(minY / 10) * 10);
    const dataMaxRound = (Math.round(maxY / 10) * 10);
    // console.log(currentData);

    return (
      <AreaChart
        width={graphWidth}
        height={graphHeight}
        data={currentData}
        margin={{
          top: margin.top,
          right: margin.right,
          bottom: margin.bottom,
          left: margin.left
       }}
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
              stopOpacity={0.8}/>
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          tick={{ stroke:'#ccccccc', strokeWidth: 1 }}
          tickLine={false}
          stroke='rgb(168,168,168)'
          tickFormatter={this.dateFormatter}
          interval={1000}
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
          dot={false}
          connectNulls={true}
          type='monotone'
          stroke='rgb(168,168,168)'
          fillOpacity={1}
          fill='url(#valueColor)' />
      </AreaChart>
    )
  }
}


export default ChartArea;
