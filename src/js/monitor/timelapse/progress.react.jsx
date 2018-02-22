import React , { Component } from 'react';
import PropTypes from 'prop-types';
import { invokeApig } from '../../../libs/awsLibs'
import Timelapse from './timelapse.react';
import styles from '../../../styling/progress.css';
import FilterButtonGroup from '../../components/filter_button.react';
import Basil from '../../../media/basil.jpeg';

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
    chamberId: 1
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

  renderPlantDetails() {
    const { recipe } = this.state;
    return (
      <div className={styles.plantInfoContainer}>
        <img src={Basil} alt={recipe.plantName} className={styles.plantImg}/>
        <h4>{recipe.fullName}</h4>
        <p>{recipe.suggestions}</p>
        <h5>Avg Market Price: ${recipe.marketPrice}</h5>
        <h5>Avg Yield: ${recipe.yield}</h5>
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
    const { images } = this.state;

    return (
      <Timelapse
        match={this.props.match}
        isAuthenticated={this.props.isAuthenticated}
        images={images}
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
