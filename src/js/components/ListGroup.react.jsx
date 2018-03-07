import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styling/listGroup.css';
import replace from 'lodash/replace';

const ListGroupContainer = props => (
  <ul className={styles.chamberIcon}>
    {props.items.map(item => { // eslint-disable-line
      // debugger
      return (
        <li
          key={item.name}
          className={styles[`listItem${replace(item.name, ' ', '')}`]}>
          <button
            disabled={!item.isFilled}
            onClick={props.handleClick}
            className={styles[`button${replace(item.name, ' ', '')}`]}>
          { item.isFilled ? item.plantName : item.name }
          </button>
        </li>
      );
    }).reverse()}
  </ul>
);

ListGroupContainer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleClick: PropTypes.func.isRequired
};

export default ListGroupContainer;
