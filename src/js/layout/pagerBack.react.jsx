import React from 'react';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/fontawesome-free-solid';
import PropTypes from 'prop-types';
import { IndexLinkContainer } from 'react-router-bootstrap';

import styles from '../../styling/pagers.css';

fontawesome.library.add(faChevronLeft);

const PagerBack = props => (
  <IndexLinkContainer
    to={{
      pathname:'/monitor',
      state: {

      }
    }}
    className={styles.pagers}
    onClick={props.handleClick}>
      <FontAwesomeIcon
        icon="chevron-left"
        pull="left"
        className={styles.previous} />
  </IndexLinkContainer>
);

PagerBack.propTypes = {
 handleClick: PropTypes.func.isRequired
};

export default PagerBack;
