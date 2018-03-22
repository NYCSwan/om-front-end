import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styling/pageTitle.css';

const PageTitle = (props) => (
  <div className={styles.pageTitle}>
    <h1>{props.pageTitle}</h1>
  </div>
)

PageTitle.propTypes = {
  pageTitle: PropTypes.string.isRequired
}

export default PageTitle;
