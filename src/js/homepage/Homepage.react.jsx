import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from '../../styling/homepage.css';

class Homepage extends Component {
  static propTypes = {
    setTitle: PropTypes.func.isRequired
  }
  componentDidMount() {
    this.props.setTitle('Homepage');
  }

  render() {

    return (
      <div className={styles.monitorOrGrow}>
        <Link to='/monitor'>
          <button className={styles.homepage} href="/monitor">
          Monitor
          Your Garden
          </button>
        </Link>
        <Link to="/controls">
        <button className={styles.homepage} href="/controls">
        Grow Something
        </button>
        </Link>
      </div>
    )
  }
}

export default Homepage;
