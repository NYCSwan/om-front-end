import styles from '../../../styling/timelapse.css';
import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import Carousel from 'nuka-carousel';
// import Decorators from './decorators.react';

const Timelapse = (props) => (

      <div className={styles.timelapseContainer}>
        <h3>Timelapse Video</h3>
        <Carousel
          ref={(c) => this.slider = c} slidesToShow={1}
          speed={50}
          width={'100%'}
          decorators={props.decorators}
          autoplay={true}
          className={styles.carousel}
          slideIndex={props.slideIndex}
          afterSlide={props.afterSlide}>
          { (isEmpty(props.images))
          ?
          null
          :
          props.images.map( image =>

            <img
              key={image.Etag}
              alt="timelapse still 300x200" src={`${props.url}${image.Key}`} />
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
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  decorators: PropTypes.arrayOf(PropTypes.object).isRequired

};
export default Timelapse;
