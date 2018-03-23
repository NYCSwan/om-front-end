import React from 'react';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/fontawesome-free-regular';
import styles from '../../styling/footer.css';

fontawesome.library.add(faCopyright);

const Footer = () => (
  <div className={styles.footer}>
    <small>Aeroasis</small> <FontAwesomeIcon className={styles.fontawesome} icon={faCopyright} /><small>2018</small>
  </div>
)
export default Footer;
