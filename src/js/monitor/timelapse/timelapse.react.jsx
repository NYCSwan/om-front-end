import React from 'react';
import { Carousel } from 'react-bootstrap';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
// import { invokeApig } from '../../../libs/awsLibs';
import styles from '../../../styling/timelapse.css';

const Timelapse = (props) => (
  // state = {
  //   isLoading: true
  // }

  // async componentDidMount() {
  //   console.log('componentDidMount timelapse container');
  //   try {
  //
  //     // const gardenResults = await this.getGrowingPlants();
  //     // this.setState({ growingPlants: gardenResults });
  //   } catch(e) {
  //     console.log(e);
  //   }
  //   this.setState({ isLoading: false });
  // }

  // render() {
  //   const { images } = this.props;
  //   return (

      <div>
        <h3>Timelapse Video</h3>
        <Carousel>
        { (isEmpty(props.images))
          ?
          null
          :
          props.images.map( image =>
          <Carousel.Item>
            <img width={300} height={200} alt="900x500" src={image.Key}
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
