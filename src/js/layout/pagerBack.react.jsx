import React from 'react';
import { Pager, Glyphicon } from 'react-bootstrap';
import PropTypes from 'prop-types';
import styles from '../../styling/pagers.css';

const PagerBack = props => (
  <Pager className={styles.pagers}>
    <Pager.Item previous href="#">
      <Glyphicon glyph="glyphicon glyphicon-chevron-left" />
    </Pager.Item>
  </Pager>
);
PagerBack.propTypes = {
  className: PropTypes.string.isRequired
};
export default PagerBack;
