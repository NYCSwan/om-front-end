import React from 'react';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/fontawesome-free-solid';
import { Link } from 'react-router-dom';

import styles from '../../styling/pagers.css';

fontawesome.library.add(faChevronLeft);

const PagerBack = props => (
  <aside className={styles.pagers}>
    <Link to={{
      pathname: props.location
    }} href="#">
      <FontAwesomeIcon
        icon="chevron-left"
        pull="left"
        className={styles.previous} />
    </Link>
  </aside>
);

export default PagerBack;
