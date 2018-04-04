import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/fontawesome-free-solid';
import fontawesome from '@fortawesome/fontawesome';

import styles from '../../styling/notifications.css';

fontawesome.library.add(faWindowClose);

const Notifications = (props) => (
  <div className={styles.notificationsContainer}>

    <FontAwesomeIcon
      icon="window-close"
      pull="right"
      className={styles.close}
      onClick={props.close} />

    { props.notifications.map(notification => {
      return (
        <h3 key={notification}>{notification}</h3>
      )
    })}
  </div>
)

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.string).isRequired
}
export default Notifications;
