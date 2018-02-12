import React from 'react';
import { Pager, Glyphicon } from 'react-bootstrap';
// import PropTypes from 'prop-types';
import styles from '../../styling/pagers.css';

const PagerFwd = props => (
  <Pager className={styles.pagers}>
    <Pager.Item next href="#">
      <Glyphicon glyph="glyphicon glyphicon-chevron-right" />
    </Pager.Item>
  </Pager>
);

// PagerFwd.propTypes = {
//  className: PropTypes.string.isRequired
// };
export default PagerFwd;
