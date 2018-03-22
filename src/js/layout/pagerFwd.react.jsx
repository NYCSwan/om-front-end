import React from 'react';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/fontawesome-free-solid';
import PropTypes from 'prop-types';
import styles from '../../styling/pagers.css';

fontawesome.library.add(faChevronRight);

const PagerFwd = props => (
  <aside
    className={styles.pagers}
    onClick={props.handleClick}>
      <FontAwesomeIcon
        icon="chevron-right"
        pull="left"
        className={styles.previous} />
  </aside>
);

PagerFwd.propTypes = {
 handleClick: PropTypes.func.isRequired
};

export default PagerFwd;
