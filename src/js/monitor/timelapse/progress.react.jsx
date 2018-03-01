import React , { Component } from 'react';
import PropTypes from 'prop-types';
import { invokeApig } from '../../../libs/awsLibs'
import Timelapse from './timelapse.react';
import styles from '../../../styling/progress.css';
import FilterButtonGroup from '../../components/filter_button.react';
import Basil from '../../../media/basil.jpeg';
import BellPepper from '../../../media/bell_pepper_button.png';
import Broccoli from '../../../media/broccoli_button.png';
import Cilantro from '../../../media/cilantro_button.png';
import GreenBeans from '../../../media/green_bean_button.png';
import Kale from '../../../media/kale_button.png';
import Lettuce from '../../../media/lettuce_button.png';
import Tomatoes from '../../../media/tomato_button.png';
import Customize from '../../../media/customize_button.jpg';
import TimelapseVideo from '../../../media/timelapse.mov';

class Progress extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string
    }).isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };

  state = {
    growingPlants: [],
    isLoading: true,
    recipes: [],
    images: [],
    chambers: [],
    chamberId: 1,
    currentPlant: [],
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

    try {
      const results = await this.getGrowingPlants();
      this.setState({ growingPlants: results });

      const recipeResults = await this.getRecipe(results[0].plantName);
      this.setState({ recipes: recipeResults });

      const chamberResults = await this.getAllChamberData();
      this.setState({ chambers: chamberResults });

      const imageResults = await this.getImages();
      this.setState({ images: imageResults.Contents });

    } catch(e) {
      console.log(e);
    }
    this.setState({ isLoading: false });
  }

  getGrowingPlants() {
    console.log('GET chamber plants');
    return invokeApig({ path: '/gardens' });
  }

  getRecipe(plant) {
    console.log('GET plant recipe');
    return invokeApig({ path: `/plants` })
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
  //
  // handleAfterSlide = () => {
  //   this.setState({ slideIndex: newSlideIndex })
  // }

  renderPlantDetails() {
    const { recipes, chamberId, chambers } = this.state;
    let plantImgSymbol;
    const recipe = [];
    let key = 0;
    // debugger
    const currentChamber = [];
    // let chamberKey = 0;

    for(let cKey in chambers) {
      if(parseInt(chambers[cKey].chamberId, 10) === chamberId){
        // chamberKey = cKey;
        currentChamber.push(chambers[cKey])
      }
    }

    for(let rKey in recipes) {
      // debugger
      if(recipes[rKey].recipeName === currentChamber[key].plantName){
        // recipeKey = rKey;
        recipe.push(recipes[rKey])
      }
    }
    debugger
    if (recipe[key].recipeName === "Basil") {
      plantImgSymbol = Basil;
    } else if (recipe[key].recipeName === 'Kale') {
      plantImgSymbol = Kale;
    } else if (recipe[key].recipeName === 'Green Beans') {
      plantImgSymbol = GreenBeans;
    } else if (recipe[key].recipeName === 'Cilantro') {
      plantImgSymbol = Cilantro;
    } else if (recipe[key].recipeName === 'Lettuce') {
      plantImgSymbol = Lettuce;
    } else if (recipe[key].recipeName === 'Broccoli') {
      plantImgSymbol = Broccoli;
    } else if (recipe[key].recipeName === 'Tomatoes') {
      plantImgSymbol = Tomatoes;
    } else if (recipe[key].recipeName === 'Cilantro') {
      plantImgSymbol = Cilantro;
    } else if (recipe[key].recipeName === 'Bell Pepper') {
      plantImgSymbol = BellPepper;
    } else {
      plantImgSymbol = Customize;
    }
    return (
      <div
        className={styles.plantInfoContainer}
        key={recipe[key].recipeName}>
        <img
          src={plantImgSymbol}
          alt={recipe[key].recipeName}
          className={styles.plantImg}
          key={recipe[key].Etag} />
        <h4>{recipe[key].fullName}</h4>
        
        <p>{recipe[key].suggestions}</p>
        <h5>
          Avg Market Price: ${recipe[key].marketPrice}
        </h5>
        <h5>
          Avg Yield: ${recipe[key].yield}
        </h5>
      </div>
    )
  }

  renderLander() {
    return (
      <div className={styles.lander}>
        <h2>Loading the images.</h2>
        <h3>This may take a minute to upload your feed live.</h3>
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
      <video width="320" height="240" key='video'>
        <source src={TimelapseVideo} type="video/mov" />
        Your browser does not support the video tag.
      </video>
    )
  }

  render(){
    const { isLoading, chamberId, chambers } = this.state;

    return (
      <div>
        <FilterButtonGroup
          onChange={this.handleChamberIdChange}
          chamberId={chamberId}
          options={chambers}
        />
      { !isLoading
        ?
        [this.renderPlantDetails(), this.renderTimelapseVideo()]
        :
        this.renderLander()
      }
      </div>

    )
  }
};

export default Progress;
