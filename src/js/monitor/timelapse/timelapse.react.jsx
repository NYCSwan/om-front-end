import React, { Component } from 'react';
import { Carousel } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { invokeApig } from '../../../libs/awsLibs';
import styles from '../../../styling/timelapse.css';

class Timelapse extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string
    }).isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };

  state = {
    images: [],
    growingPlants: [],
    isLoading: true
  }

  async componentDidMount() {
    console.log('componentDidMount timelapse container');
    try {
      const results = await this.getImages();
      this.setState({images: results});
      const gardenResults = await this.getGrowingPlants();
      this.setState({ growingPlants: gardenResults });
    } catch(e) {
      console.log(e);
    }
    this.setState({ isLoading: false });
  }

  getImages() {
    console.log('GET Images request');
    return invokeApig({ path: '/images' });
  }

  renderLander = () => {
    return (
      <div className={styles.lander}>
        <h2>Loading the images.</h2>
        <h3>This may take a minute to upload your feed live.</h3>
      </div>
    )
  }

  renderCarousel = (images) => {
    console.log('render carousel');
    return (
    // [{}].concat(images).map(
      <Carousel>
        <Carousel.Item>
          <img width={300} height={200} alt="900x500" src="/basil.jpeg" />
        </Carousel.Item>
      </Carousel>
    )
  }

  render() {
 // <ResponsiveEmbed a16by9>
 //      <video
 //      autoPlay
 //      loop
 //      controls="controls"
 //      width="800"
 //      height="600"
 //      name="Video Name"
 //      src="../public/img/timelapse.mov"
 //      type="video/mov"
 //      >
 //      Your browser does not support this video.
 //      </video>
 //      <track />
 //      </ResponsiveEmbed>
    return (

      <div>
        <h3>Timelapse Video</h3>
        <Carousel>
          <Carousel.Item>
            <img width={300} height={200} alt="900x500" src="/basil.jpeg" />
          </Carousel.Item>
        </Carousel>
      </div>
    )

  }
}

export default Timelapse;
