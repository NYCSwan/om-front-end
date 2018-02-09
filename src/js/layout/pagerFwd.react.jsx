import React from 'react';
import { Pager, Glyphicon } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './pagers.css';

const PagerFwd = props => (
  <Pager className={props.className}>
    <Pager.Item next href="#">
      <Glyphicon glyph="glyphicon glyphicon-chevron-right" />
    </Pager.Item>
  </Pager>
);

PagerFwd.propTypes = {
  className: PropTypes.string.isRequired
};
export default PagerFwd;
