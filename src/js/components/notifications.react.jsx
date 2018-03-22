import React from 'react';
import PropTypes from 'prop-types';

const Notifications = (props) => (
  props.notifications.map(notification => {
    return (
      <h3>{notification}</h3>
    )
  })
)

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.string).isRequired
}
export default Notifications;
