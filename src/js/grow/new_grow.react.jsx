import React, { Component } from 'react';
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
import Customize from '../../media/customize_button.jpg';

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
//   {this.state.selectedPlant === 'customize' &&
//     this.state.selectedChamber === '' && <CustomizeSensors {...this.props} />}
//   { this.state.selectedChamber === '' &&
//     this.state.selectedPlant !== '' &&
//     this.state.showDirections === false && (
//       <div className="chamberOptions">
//         <div className="chamberImage">
//           <ChamberFormGroup
//             options={this.state.chamberOptions} onClick={this.handleChamberRadioClick} />
//         </div>
//         <h3 id="chamber" className="directions Futura-Lig">
//           Select A Chamber
//         </h3>
// }
//
// <LoaderButton
// className='sumbit-garden'
// disabled={!this.validateForm()}
// type="submit"
// isloading={this.state.isloading}
// text="Create"
// loadingText="Creating…"
// />
// </form>
// }
// { this.state.selectedChamber !== '' &&
//   this.state.selectedPlant !== '' &&
//   this.state.isBalanced === false && (
//     <Directions
//       newGrowPlant={this.state.newGrowPlant}
//       climates={this.state.climates}
//       handleClick={this.updatePhBalance}
//       isBalanced={this.state.isBalanced}
//       selectedChamber={this.state.selectedChamber}
//       // onClick={this.showPlantingDirections}
//     />
//   )}
//
// {this.state.showDirections === true && (
//   <PlantingDirections
//     newGrowPlant={this.state.newGrowPlant}
//     climates={this.state.climates}
//     isBalanced={this.state.isBalanced}
//     selectedChamber={this.state.selectedChamber}
//     handleClick={this.submitGrowChange}
//   />
// ) }

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
    let plantImgSymbol;

    return (
      plantTypes.map((plant) => {
        if (plant.recipeName === "Basil") {
          plantImgSymbol = Basil;
        } else if (plant.recipeName === 'Kale') {
          plantImgSymbol = Kale;
        } else if (plant.recipeName === 'Green Beans') {
          plantImgSymbol = GreenBeans;
        } else if (plant.recipeName === 'Cilantro') {
          plantImgSymbol = Cilantro;
        } else if (plant.recipeName === 'Lettuce') {
          plantImgSymbol = Lettuce;
        } else if (plant.recipeName === 'Broccoli') {
          plantImgSymbol = Broccoli;
        } else if (plant.recipeName === 'Tomatoes') {
          plantImgSymbol = Tomatoes;
        } else if (plant.recipeName === 'Cilantro') {
          plantImgSymbol = Cilantro;
        } else if (plant.recipeName === 'Bell Pepper') {
          plantImgSymbol = BellPepper;
        } else {
          plantImgSymbol = Customize;
        }
        return (
        <div
          key={plant.recipeName}
          className={`styles.button${(plant.recipeName).replace(/\s/, '')}`}>
          <img
            key={plant.recipeName}
            src={plantImgSymbol}
            alt={plant.recipeName} />
          <input
            name={plant.recipeName}
            value={plant.fullName}
            key={plant.gardenId}
            className={`styles.${(plant.recipeName).replace(/\s/, '')}Input`}
            onChange={this.handlePLantChange}
          />
        </div>
      )})
    )
  }

  renderChambers() {
    const { chamberOptions } = this.state;
    chamberOptions.map((chamber) => {
      return (
        <input
          type='radio'
          name={chamber.chamberId}
          key={chamber.chamberId}
          value={chamber.chamberName}
          className={chamber.chamberName}
          onChange={this.handleChamberChange}
        />
      )
    })
  }

  render() {
    console.log('render new grow');
    // console.log(`plantTypes: ${this.state.plantTypes}`);
    // console.log(`chambers: ${this.state.chamberOptions}`);
// debugger
    return (
      <div className={styles.newGrowContainer}>
      { !this.state.isloading &&
        <form
          className={styles.newGrowForm}
          onSubmit={this.handleSubmit}>
          { this.state.newGrowPlant.length < 1
            ?
            <div className={(styles.selectPlant).replace(/\s/, '')}>
              <h3>Select a Plant</h3>
              <h4>OR</h4>
              <h3>Customize Your Own Settings</h3>
              { this.renderPlantGroup() }
            </div>
            :
            null
          }
          </form>
        }
      </div>
    );
  }
}

export default NewGrow;
