import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isUndefined from 'lodash/isUndefined';
import camelCase from 'lodash/camelCase';
// import isEmpty from 'lodash/isEmpty';

import Basil from '../../media/basil.jpeg';
import BellPepper from '../../media/bell_pepper_button.png';
import Broccoli from '../../media/broccoli_button.png';
import Cilantro from '../../media/cilantro_button.png';
import GreenBeans from '../../media/green_bean_button.png';
import Kale from '../../media/kale_button.png';
import Lettuce from '../../media/lettuce_button.png';
import Tomatoes from '../../media/tomato_button.png';
import Customize from '../../media/customize_button.jpg';
import styles from '../../styling/plant_details.css';

// NOTE: Convert to functional comp.

class PlantDetails extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object
    }).isRequired,
    details: PropTypes.object
  };
  //
  // state = {
  //   plant: ''
  // };

  componentDidMount() {
    console.log('componentDidMount plant container');
    // this.getPlantRecipes();
    // this.setPlant();
    // this.props.history.push({
    //   pathname: this.props.location.pathname,
    //   state: {

  }

  // shouldComponentUpdate(newState) {
  //   return this.state.plant !== newState.plant || this.state.plantTypes !== newState.plantTypes;
  // }

  // getPlantRecipes = () => {
  //   console.log('get plant recipes, plant container');
  //
  // };
  //
  // setPlant = () => {
  //   const plantId = parseInt(this.props.match.params.plant_id, 10);
  //   this.setState({ plant: plantId });
  // };

  renderNotifications() {
    const { notifications } = this.props.location.state;

    notifications.map(notice => {
      return (
        <h2> {notice} </h2>
      )
    })
  }

  renderPlantDetailsFromProps() {
    const { details } = this.props;
    let plantImgSymbol;

    if (details.recipeName === "Basil") {
      plantImgSymbol = Basil;
    } else if (details.recipeName === 'Kale') {
      plantImgSymbol = Kale;
    } else if (details.recipeName === 'Green Beans') {
      plantImgSymbol = GreenBeans;
    } else if (details.recipeName === 'Cilantro') {
      plantImgSymbol = Cilantro;
    } else if (details.recipeName === 'Lettuce') {
      plantImgSymbol = Lettuce;
    } else if (details.recipeName === 'Broccoli') {
      plantImgSymbol = Broccoli;
    } else if (details.recipeName === 'Tomatoes') {
      plantImgSymbol = Tomatoes;
    } else if (details.recipeName === 'Cilantro') {
      plantImgSymbol = Cilantro;
    } else if (details.recipeName === 'Bell Pepper') {
      plantImgSymbol = BellPepper;
    } else {
      plantImgSymbol = Customize;
    }

    return (
      <div
        className={styles.plantInfoContainer}
        key={details.recipeName}>
        <img
          src={plantImgSymbol}
          alt={details.recipeName}
          className={styles.plantImg}
          key={details.Etag} />
        <aside className={styles.plantDetails}>
          <h1>{details.fullName}</h1>
          <h4>{details.suggestions}</h4>
          <h4><b>Avg Market Price:</b> ${details.marketPrice}</h4>
          <h4><b>Avg Yield:</b> {details.yield}</h4>
        </aside>
      </div>
    )
  }

  renderPlantDetailsFromHistory() {
    const { details } = this.props.location.state;
    let plantImgSymbol;

    if (details.recipeName === "Basil") {
      plantImgSymbol = Basil;
    } else if (details.recipeName === 'Kale') {
      plantImgSymbol = Kale;
    } else if (details.recipeName === 'Green Beans') {
      plantImgSymbol = GreenBeans;
    } else if (details.recipeName === 'Cilantro') {
      plantImgSymbol = Cilantro;
    } else if (details.recipeName === 'Lettuce') {
      plantImgSymbol = Lettuce;
    } else if (details.recipeName === 'Broccoli') {
      plantImgSymbol = Broccoli;
    } else if (details.recipeName === 'Tomatoes') {
      plantImgSymbol = Tomatoes;
    } else if (details.recipeName === 'Cilantro') {
      plantImgSymbol = Cilantro;
    } else if (details.recipeName === 'Bell Pepper') {
      plantImgSymbol = BellPepper;
    } else {
      plantImgSymbol = Customize;
    }

    return (
      <div
        className={styles.plantInfoContainer}
        key={details.recipeName}>
        <img
          src={plantImgSymbol}
          alt={details.recipeName}
          className={styles.plantImg}
          key={details.Etag} />
        <aside className={styles.plantDetails}>
          <h1>{details.fullName}</h1>
          <h4>{details.suggestions}</h4>
          <h4>
          <b>Avg Market Price:</b> ${details.marketPrice}
          </h4>
          <h4>
          <b>Avg Yield:</b> {details.yield}
          </h4>
        </aside>
      </div>
    )
  };

  render() {
    console.log('render plant container');

    return (
      <div className={styles[`${camelCase(this.props.match.params.plant_name)}`]}>
        {isUndefined(this.props.details) ?
          this.renderPlantDetailsFromHistory() :
          this.renderPlantDetailsFromProps()
        }
      </div>

    )
  }
}

export default PlantDetails;
