import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styling/listGroup.css';

const ListGroupContainer = props => (
  <ul className={styles.chamber_icon}>
    {props.items.map(item => { // eslint-disable-line
      return (
        <li
          key={item.name}
          className={styles.listItem}>
          <button
            disabled={!item.isFilled}
            onClick={props.handleClick}
            className={styles.button}>
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
