import styles from '../../../styling/timelapse.css';
import React from 'react';
import { Carousel } from 'react-bootstrap';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

const Timelapse = (props) => (

      <div>
        <h3>Timelapse Video</h3>
        <Carousel>
        { (isEmpty(props.images))
          ?
          null
          :
          props.images.map( image =>
          <Carousel.Item>
            <img width={300} height={200} alt="900x500" src={`${props.url}${image.Key}`}
            className={styles.carouselItem} />
          </Carousel.Item>
        )}
        </Carousel>
      </div>
    )
//
//   }
// }

Timelapse.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string
  }).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  images: PropTypes.arrayOf(PropTypes.object).isRequired

};
export default Timelapse;
