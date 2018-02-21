import React, { Component } from 'react';
// import { form, FormGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import pickBy from 'lodash/pickBy';
import { invokeApig } from "../../libs/awsLibs";
import LoaderButton from './../components/LoaderButton.react';
import styles from '../../styling/new_grow.css';
import Basil from '../../media/basil_button.png';
import BellPepper from '../../media/bell_pepper_button.png';
import Broccoli from '../../media/broccoli_button.png';
import Cilantro from '../../media/cilantro_button.png';
import GreenBeans from '../../media/green_bean_button.png';
import Kale from '../../media/kale_button.png';
import Lettuce from '../../media/lettuce_button.png';
import Tomatoes from '../../media/tomato_button.png';
import Customize from '../../media/customize_button.png';

class NewGrow extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired,
    userHasAuthenticated: PropTypes.func.isRequired
  }

  state = {
    plantTypes: [],
    chamberOptions: [],
    selectedPlant: '',
    selectedChamber: '',
    isBalanced: false,
    showDirections: false,
    isloading: false,
    newGrowPlant: []
  };

  async componentDidMount() {
    console.log('component did mount new grow');
    try {
        const recipeResults = await this.getPlantRecipes();
        this.setState({plantTypes: recipeResults});
        const chamberResults = await this.getChamberOptions();
        debugger
        this.setState({chamberOptions: chamberResults});
        // const climateResults = await this.getClimates();
        // this.setClimates(climateResults);
    } catch(e) {
      console.error(e);
    }
  }

  shouldComponentUpdate(newState) {
    console.log('shouldComponentUpdate new grow');
    return (
      this.state.selectedChamber !== newState.selectedChamber ||
      this.state.selectedPlant !== newState.selectedPlant ||
      this.state.plantTypes !== newState.plantTypes ||
      this.state.newGrowPlant !== newState.newGrowPlant ||
      this.state.chamberOptions !== newState.chamberOptions ||
      this.state.showDirections !== newState.showDirections ||
      this.state.isBalanced !== newState.isBalanced
    );
  }
  //
  // componentDidUpdate() {
  //   console.log('componentDidUpdate new grow');
  // }

  getPlantRecipes = () => {
    console.log(`get plant recipes`);
    return invokeApig({ path: '/plants' });
  };

  getChamberOptions = () => {
    console.log('get chamber options');
    return invokeApig({ path: '/chambers' });
  };

  // getClimates = () => {
  //   console.log('get climates');
  //   return invokeApig({ path: 'climates' });
  // };

  //
  // setClimates = (climateResults) => {
  //   this.setState({ climates: climateResults});
  // }

  handlePlantRadioClick = e => {
    console.log(`handlePlantRadioClick: ${e.target}`);
    debugger;
    this.setState({ selectedPlant: e.target });
    this.handleNewPlantSelection(e);
  };

  handleChamberRadioClick = e => {
    console.log(`handleChamberRadio: ${e.target.labels[0].innerText}`);
    this.setState({
      selectedChamber: e.target.labels[0].innerText
    });
    console.log('handel form shoudl have chamber state');
  }

  handleNewPlantSelection = e => {
    console.log('handleNewPlantSelection new grow');
    const tempPlant = e.target.labels[0].innerText;
    const currentPlantType = pickBy(this.state.plantTypes, plant => plant.shortname === tempPlant);
    this.setState({ newGrowPlant: currentPlantType });
  }
  //
  // updatePhBalance = () => {
  //   console.log('update PH balance');
  //   // setTimeout(() => {
  //   //   console.log('timeout 10000')
  //   // }, 10000);
  //   this.setState({ isBalanced: true });
  //   this.showPlantingDirections();
  // };
  //
  // showPlantingDirections = () => {
  //   console.log('show planting directions');
  //   this.setState({ showDirections: true });
  // };

  validateForm() {
    return this.state.selectedPlant.length > 0 && this.state.selectedPlant.length > 0;
  }

  handlePLantChange = event => {
    console.log('handle change');
    this.setState({
      selectedPlant: event.target.name
    });
  }

  handleChamberChange = event => {
    console.log('handle change');
    // debugger
    this.setState({
      selectedChamber: event.target.name
    });
  }

  createGarden = (garden) => { // eslint-disable-line
    console.log('create garden');
    // debugger;
    return invokeApig({ // eslint-disable-line
      path: '/gardens',
      method: "POST",
      body: garden
    })
  }

  handleSubmit = async event => {
    console.log('submit new grow plant');
    event.preventDefault();
    if (this.state.selectedPlant.length > 0 && this.state.selectedChamber > 0) {
      alert("Please pick a plant and chamber.");
      return;
    }

    this.setState({ isloading: true });

    try {
      await this.createGarden({
        chamberId: this.state.selectedChamber,
        plantName: this.state.selectedPlant.plantName,
        climateId: this.state.selectedPlant.climateId,
        plantRecipeId: this.state.selectedPlant.plantRecipeId,
        createdAt: new Date()
      });
      this.props.history.push("/monitor");
    } catch(e) {
      console.log(e);
      this.setState({isloading:false})
    }
  }

  renderPlantGroup() {
    const { plantTypes } = this.state;
    // debugger
    let plantImgSymbol;
      plantTypes.map((plant) => {
        if (plant.plantName === "Basil") {
          plantImgSymbol = Basil;
        } else if (plant.plantName === 'Kale') {
          plantImgSymbol = Kale;
        } else if (plant.plantName === 'Green Beans') {
          plantImgSymbol = GreenBeans;
        } else if (plant.plantName === 'Cilantro') {
          plantImgSymbol = Cilantro;
        } else if (plant.plantName === 'Lettuce') {
          plantImgSymbol = Lettuce;
        } else if (plant.plantName === 'Broccoli') {
          plantImgSymbol = Broccoli;
        } else if (plant.plantName === 'Tomatoes') {
          plantImgSymbol = Tomatoes;
        } else if (plant.plantName === 'Cilantro') {
          plantImgSymbol = Cilantro;
        } else if (plant.plantName === 'Bell Pepper') {
          plantImgSymbol = BellPepper;
        } else {
          plantImgSymbol = Customize;
        }
debugger
      return (
        <div className={`styles.button${plant.plantName}`}>
          <img src={plantImgSymbol} alt={plant.plantName} />
          <input
            name={plant.plantName}
            value={plant.plantName}
            key={plant.plantName}
            className={`styles.${plant.plantName}`}        onChange={this.handlePLantChange}
          />
          {plant.plantName}
        </div>
      )
    }
  }

  renderChambers() {
    const { chamberOptions } = this.state;
    chamberOptions.map((chamber) =>
      return (
        <input
          type='radio'
          name={chamber}
          key={chamber}
          value={chamber}
          className={chamber}
          onChange={this.handleChamberChange}
        />
        {chamber}
    ))
  }

  render() {
    console.log('render new grow');
    // console.log(`plantTypes: ${this.state.plantTypes}`);
    // console.log(`chambers: ${this.state.chamberOptions}`);
// debugger
    return (
      <div className="newGrow container">
      { !this.state.isloading &&
        <form
          className="new_grow_form"
          onSubmit={this.handleSubmit}>
          {this.state.selectedPlant === '' && (
            <div className="selectedPlant">
              <h3>Select A Plant</h3>
              <h3>OR</h3>
              <h3>Customize Your Own Settings</h3>
              {this.renderPlantGroup()}
            </div>
          )}
          </form>
        }
      </div>
    );
  }
}

export default NewGrow;
