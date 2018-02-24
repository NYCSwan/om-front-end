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
    recipe: [],
    images: [],
    chambers: [],
    chamberId: 1,
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
      this.setState({ recipe: recipeResults });

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
    const { recipe } = this.state;
    let plantImgSymbol;

    if (recipe.recipeName === "Basil") {
      plantImgSymbol = Basil;
    } else if (recipe.recipeName === 'Kale') {
      plantImgSymbol = Kale;
    } else if (recipe.recipeName === 'Green Beans') {
      plantImgSymbol = GreenBeans;
    } else if (recipe.recipeName === 'Cilantro') {
      plantImgSymbol = Cilantro;
    } else if (recipe.recipeName === 'Lettuce') {
      plantImgSymbol = Lettuce;
    } else if (recipe.recipeName === 'Broccoli') {
      plantImgSymbol = Broccoli;
    } else if (recipe.recipeName === 'Tomatoes') {
      plantImgSymbol = Tomatoes;
    } else if (recipe.recipeName === 'Cilantro') {
      plantImgSymbol = Cilantro;
    } else if (recipe.recipeName === 'Bell Pepper') {
      plantImgSymbol = BellPepper;
    } else {
      plantImgSymbol = Customize;
    }
    return (
      <div
        className={styles.plantInfoContainer}
        key={recipe.recipeName}>
        <img
          src={plantImgSymbol} alt={recipe.recipeName} className={styles.plantImg}
          key={recipe.Etag} />
        <h4>{recipe.fullName}</h4>
        <p>{recipe.suggestions}</p>
        <h5>
          Avg Market Price: ${recipe.marketPrice}
        </h5>
        <h5>
          Avg Yield: ${recipe.yield}
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
        [this.renderPlantDetails(), this.renderTimelapse()]
        :
        this.renderLander()
      }
      </div>

    )
  }
};

export default Progress;
