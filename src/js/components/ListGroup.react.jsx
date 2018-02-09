import React from 'react';
import PropTypes from 'prop-types';

const ListGroupContainer = props => (
  <ul>
    {props.items.map(item => { // eslint-disable-line
      return (
        <li key={item} className="Futura-Lig">
          {item}
        </li>
      );
    })}
  </ul>
);

ListGroupContainer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ListGroupContainer;
