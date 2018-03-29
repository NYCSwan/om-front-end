import React , { Component } from 'react';
import PropTypes from 'prop-types';
import pickBy from 'lodash/pickBy';
import findKey from 'lodash/findKey';

import { invokeApig } from '../../../libs/awsLibs'
import Timelapse from './timelapse.react';
import Spinner from '../../helpers/spinner.react';
import PlantDetails from '../../plants/plant_details.react';
import styles from '../../../styling/progress.css';
import FilterButtonGroup from '../../components/filter_button.react';
import TimelapseVideo from '../../../media/timelapse.mp4';

class Progress extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string
    }).isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };

  state = {
    growingPlants: [],
    isloading: true,
    recipes: [],
    images: [],
    chambers: [],
    chamberId: 1,
    plantDetails: [],
    selectedPlant: '',
    decorators: [{
      component: function(p){
        return <div />;
      },
      position: 'BottomLeft'
    }, {
      component: function(p){
        return <div />;
      },
      position: 'BottomRight'
    }],

  }

  async componentDidMount() {
    console.log('componentDidMount progress page');

    if (!this.props.history.location.state) {
      try {
        const results = await this.getGrowingPlants();
        this.setState({ growingPlants: results });

        const recipeResults = await this.getRecipes();
        this.setState({ recipes: recipeResults });
        this.setPlant();
        this.setPlantRecipe();
        const chamberResults = await this.getAllChamberData();
        this.setState({ chambers: chamberResults });

        // const imageResults = await this.getImages();
        // this.setState({ images: imageResults.Contents });

      } catch(e) {
        console.log(e);
      }
    } else {
      console.log('set state to location state');
      try {
        const results = await this.getGrowingPlants();
        this.setState({ growingPlants: results });
        //
        // const imageResults = await this.getImages();
        // this.setState({ images: imageResults.Contents });

        this.setStateFromHistory();
      } catch(e) {
        console.log(e);
      }
    }

    this.props.setTitle('Progress');
    this.setState({ isloading: false });
  }

  shouldComponentUpdate(newState) {
    return this.state.plantDetails !== newState.plantDetails
  }

  getGrowingPlants() {
    console.log('GET chamber plants');
    return invokeApig({ path: '/gardens' });
  }

  getRecipes() {
    console.log('GET plant recipes');
    return invokeApig({ path: `/plants` });
  }

  getAllChamberData() {
    console.log('get chamber info');
    return invokeApig({ path: '/chambers' });
  };

  getImages() {
    console.log('GET Images request');
    return invokeApig({ path: '/images' });
  }

  handleChamberIdChange = (newChamber) => {
    console.log('handleChamberIdChange');
    console.log(newChamber);
    let tempChamber = '';
    if (newChamber != null) {
      tempChamber = newChamber.target.value;
      this.setState({
          chamberId: tempChamber},
        () => console.log(`chamberId ${this.state.chamberId}`)
      );
    }
  };

  setStateFromHistory = () => {
    console.log('set state from history');
    const { chamberOptions, newGrowPlant, plantTypes, selectedChamber, selectedPlant } = this.props.history.location.state;

    this.setState({
      chambers: chamberOptions,
      plantDetails: newGrowPlant,
      recipes: plantTypes,
      chamberId: selectedChamber,
      selectedPlant: selectedPlant
    })

  }

  setPlant = () => {
    console.log('set plant name');
    const currentPlant =  pickBy(this.state.growingPlants, plant => parseInt(plant.chamberId, 10) === this.state.chamberId);
    const key = findKey(currentPlant)
    // debugger
    this.setState({ selectedPlant: currentPlant[key].plantName})
  }

  setPlantRecipe = () => {
    console.log('set plant recipe');
    // debugger;
    const currentPlant =  pickBy(this.state.recipes, plant => plant.recipeName === this.state.selectedPlant);
    const key = findKey(currentPlant)
    this.setState({ plantDetails: currentPlant[key]})
  }

  renderLander() {
    return (
      <div className={styles.lander}>
        <h3>This may take a minute to upload your feed live.</h3>
        <Spinner />
      </div>
    )
  }

  renderTimelapse() {
    const { images, slideIndex } = this.state;
    // const slideIndex = ;

    return (
      <Timelapse
        match={this.props.match}
        isAuthenticated={this.props.isAuthenticated}
        images={images}
        url='https://s3.amazonaws.com/livestreamdata.timelapse.images/'
        decorators={this.state.decorators}
        slideIndex={slideIndex}
        afterSlide={this.handleAfterSlide}
      />
    )
  }

  renderTimelapseVideo() {
    return (
      <div
        className={styles.videoContainer}>
        <h3>My Timelapse</h3>
        <video width="320"
          height="240"
          key='video'
          loop
          autoPlay>
          <source
            src={TimelapseVideo}
            type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }

  render(){
    const { isloading, chamberId, chambers, plantDetails } = this.state;

    return (
      <div className={styles.progressContainer}>
        <FilterButtonGroup
          onChange={this.handleChamberIdChange}
          chamberId={chamberId}
          options={chambers}
          key={chamberId}
        />
      { !isloading
        ?
        [<PlantDetails
          details={plantDetails}
          match={this.props.match} />,
          this.renderTimelapseVideo()
        ]
        :
        this.renderLander()
      }
      </div>

    )
  }
};

export default Progress;
