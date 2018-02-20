import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip } from 'recharts';
import moment from 'moment';
import dropWhile from 'lodash/dropWhile';

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
    dataForTimePeriod: [],
    dataSeries: []
  }

  componentDidMount() {
    console.log('componentDidMount areaChart');
    this.getDataSeries();
  }

  // componentWillReceiveProps({ margin, graphWidth, graphHeight, currentData, endDate, startDate, sensor, maxY, minY }) {
  //   console.log('componentWillReceiveProps area chart');
  //
  //   if (currentData !== this.props.currentData || sensor !== this.props.sensor || maxY !== this.props.maxY || minY !== this.props.minY) {
  //     console.log('change data, data, sensor or chamber changed');
  //     this.updateAreaChartData();
  //   } else if (endDate !== this.props.endDate || startDate !== this.props.startDate) {
  //     console.log('change data, dates changed');
  //     this.updateAreaChartData();
  //   } else if (margin !== this.props.margin || graphWidth !== this.props.graphWidth || graphHeight !== this.props.graphHeight) {
  //    console.log('change size');
  //   }
  // }

  shouldComponentUpdate (newProps, newState) {
    console.log('shouldComponentUpdate areaChart');
    return (
      this.props.currentData !== newProps.currentData ||  this.props.sensor !== newProps.sensor || this.state.dataSeries !== newState.dataSeries || this.state.dataForTimePeriod !== newState.dataForTimePeriod
    )
  }

  getDataSeries = () => {
    console.log('get data series');
    const {startDate, endDate, currentData } = this.props;
    // const { dataForTimePeriod } = this.state;
    const tempData = currentData;

    if (endDate - startDate <= 604800000 ){
      dropWhile(tempData, (datum) => { // eslint-disable-next-line
        new Date(datum.time).getTime() <= startDate;
      })
      this.setState({ dataSeries: tempData});
    } else if (endDate - startDate > 604800000){
      dropWhile(tempData, (datum) => { // eslint-disable-next-line
        new Date(datum.time).getTime() >= startDate;
      })
      this.setState({ dataSeries: tempData});
    }
  }

  dateFormatter = (tick) => { // eslint-disable-line
    // console.log(tick);
    const { endDate, startDate } = this.props;
    if (endDate - startDate === 604800000 ){
      return moment(tick).format('dd, Do');
    } else if (endDate - startDate > 604800000){
      return moment(tick).format('dd');
    }
  }

  render() {
    console.log('render areaChart');
    const { graphHeight, graphWidth, margin, minY, maxY } = this.props;
    const { dataSeries } = this.state;

    const dataMinRound = (Math.round(minY / 10) * 10);
    const dataMaxRound = (Math.round(maxY / 10) * 10);
    // console.log(currentData);

    return (
      <ComposedChart
        width={graphWidth}
        height={graphHeight}
        data={dataSeries}
        margin={{ top: margin.top, right: margin.right, bottom: margin.bottom, left: margin.left
       }}
       className={styles.chart}
      >
        <defs>
          <linearGradient id="valueColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fff" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          label={{ value: this.timeLabel, position:'outside'}} tickCount={3}
          tick={{ stroke:'#fff', strokeWidth: 1 }}
          tickLine={false}
          tickFormatter={this.dateFormatter}
          stroke='#fff'
        />
        <YAxis
          domain={[dataMinRound, dataMaxRound]}
          tick={{ stroke:'#fff', strokeWidth: 1 }}
          tickCount={3}
          tickLine={false}
          stroke='#fff' />
        <Tooltip />
        <Area
          type='monotone'
          dataKey='value'
          stroke='#fff'
          fillOpacity={1}
          fill='url(#valueColor)' />
        <Line
          type='monotone'
          dataKey='value'
          stroke='#fff' />
      </ComposedChart>
    )
  }
}


export default ChartArea;
