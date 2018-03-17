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
// import Basil from '../../../media/basil.jpeg';
// import BellPepper from '../../../media/bell_pepper_button.png';
// import Broccoli from '../../../media/broccoli_button.png';
// import Cilantro from '../../../media/cilantro_button.png';
// import GreenBeans from '../../../media/green_bean_button.png';
// import Kale from '../../../media/kale_button.png';
// import Lettuce from '../../../media/lettuce_button.png';
// import Tomatoes from '../../../media/tomato_button.png';
// import Customize from '../../../media/customize_button.jpg';
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

    })

  }

  setPlantRecipe = () => {
    console.log('set plant recipe');
    // debugger;
    const currentPlant =  pickBy(this.state.growingPlants, plant => parseInt(plant.chamberId) === this.state.chamberId);
    const key = findKey(currentPlant)
    this.setState({ plantDetails: currentPlant[key]})
  }
  // handleAfterSlide = () => {
  //   this.setState({ slideIndex: newSlideIndex })
  // }

  // renderPlantDetails() {
  //   const { recipes, chamberId, chambers } = this.state;
  //   let plantImgSymbol;
  //   const recipe = [];
  //   let key = 0;
  //   // debugger
  //   const currentChamber = [];
  //   // let chamberKey = 0;
  //
  //   for(let cKey in chambers) {
  //     if(parseInt(chambers[cKey].chamberId, 10) === chamberId){
  //       // chamberKey = cKey;
  //       currentChamber.push(chambers[cKey])
  //     }
  //   }
  //
  //   for(let rKey in recipes) {
  //     // debugger
  //     if(recipes[rKey].recipeName === currentChamber[key].plantName){
  //       // recipeKey = rKey;
  //       recipe.push(recipes[rKey])
  //     }
  //   }
  //   // debugger
  //   if (recipe[key].recipeName === "Basil") {
  //     plantImgSymbol = Basil;
  //   } else if (recipe[key].recipeName === 'Kale') {
  //     plantImgSymbol = Kale;
  //   } else if (recipe[key].recipeName === 'Green Beans') {
  //     plantImgSymbol = GreenBeans;
  //   } else if (recipe[key].recipeName === 'Cilantro') {
  //     plantImgSymbol = Cilantro;
  //   } else if (recipe[key].recipeName === 'Lettuce') {
  //     plantImgSymbol = Lettuce;
  //   } else if (recipe[key].recipeName === 'Broccoli') {
  //     plantImgSymbol = Broccoli;
  //   } else if (recipe[key].recipeName === 'Tomatoes') {
  //     plantImgSymbol = Tomatoes;
  //   } else if (recipe[key].recipeName === 'Cilantro') {
  //     plantImgSymbol = Cilantro;
  //   } else if (recipe[key].recipeName === 'Bell Pepper') {
  //     plantImgSymbol = BellPepper;
  //   } else {
  //     plantImgSymbol = Customize;
  //   }
  //   return (
  //     <div
  //       className={styles.plantInfoContainer}
  //       key={recipe[key].recipeName}>
  //       <img
  //         src={plantImgSymbol}
  //         alt={recipe[key].recipeName}
  //         className={styles.plantImg}
  //         key={recipe[key].Etag} />
  //       <aside className={styles.plantDetails}>
  //         <h1>{recipe[key].fullName}</h1>
  //         <h4>{recipe[key].suggestions}</h4>
  //         <h4>
  //           <b>Avg Market Price:</b> ${recipe[key].marketPrice}
  //         </h4>
  //         <h4>
  //           <b>Avg Yield:</b> {recipe[key].yield}
  //         </h4>
  //       </aside>
  //     </div>
  //   )
  // }

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
      <div>
        <FilterButtonGroup
          onChange={this.handleChamberIdChange}
          chamberId={chamberId}
          options={chambers}
          key={chamberId}
        />
      { !isloading
        ?
        [<PlantDetails
          details={plantDetails} />, this.renderTimelapseVideo()]
        :
        this.renderLander()
      }
      </div>

    )
  }
};

export default Progress;
