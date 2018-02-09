import React from 'react';
import PropTypes from 'prop-types';

const ChartTitle = props => (
  <g transform={`translate(${props.x},${props.y})`}>
    <text x={0} y={0} dy={16} textAnchor="end" fill={props.stroke} transform="rotate(-35)">
      {props.payload.value}
    </text>
  </g>
);

ChartTitle.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  stroke: PropTypes.number.isRequired,
  payload: PropTypes.objectOf(PropTypes.string).isRequired
};

export default ChartTitle;
