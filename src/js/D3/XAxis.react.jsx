import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { XAxis } from 'recharts';
import moment from 'moment';

class xAxis extends Component {

  render() {
    const { sensor, startDate, endDate, data } = this.props;
    const dateFormat = (time) => {
      if( endDate - startDate === 8640000) {
        return moment(time).format('hA');
      } else if (endDate - startDate === 604800000 ){
        return moment(time).format('dd');
      } else if (endDate - startDate > 604800000){
        return moment(time).format('dd');
      } else {  // eslint-disable-line
        return moment(time).format('dd');
      }
    }; // eslint-disable-line
    return (
      <XAxis
        dataKey='time'
        label={{ value: sensor, position:'outside'}} tickCount={3}
        tick={{ stroke:'#fff', strokeWidth: 1 }}
        tickLine={false}
        tickFormatter={dateFormat}
        stroke='#fff'
      />

    )
  }
}

xAxis.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    sensor: PropTypes.string.isRequired
}
export default xAxis;
