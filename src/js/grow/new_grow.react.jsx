import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pickBy from 'lodash/pickBy';
import findKey from 'lodash/findKey';
import isEmpty from 'lodash/isEmpty';

import { invokeApig } from "../../libs/awsLibs";
import LoaderButton from './../components/LoaderButton.react';
import Directions from './directions_container.react';
// import PlantingDirections from './planting_directions.react';
import styles from '../../styling/new_grow.css';


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
    showPlantsDirections: false,
    isloading: false,
    newGrowPlant: [],
    selectedPlant: '',
    selectedChamber: 0,
    showForm: true
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

      this.state.isBalanced !== newState.isBalanced
    );
  }

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
    this.setState({ selectedPlant: e.target.value });
    this.handleNewPlantSelection(e);
  };

  handleChamberRadioClick = e => {
    console.log(`handleChamberRadio: ${e.target.value}`);
    const tempChamberId = parseInt(e.target.value.slice(-1), 10);
    this.setState({
      selectedChamber: tempChamberId
    });
  }

  handleNewPlantSelection = e => {
    console.log('handle Plant recipe Selection new grow');
    const tempPlant = e.target.value;
    const currentPlantType = pickBy(this.state.plantTypes, plant => plant.fullName === tempPlant);
    const key = findKey(currentPlantType);
    // debugger
    this.setState({ newGrowPlant: currentPlantType[key] });
  }

  updatePhBalance = () => {
    console.log('update PH balance');
    setTimeout(() => {
      console.log('timeout 10000')
    }, 10000);
    this.setState({ isBalanced: true });
    this.showPlantingDirections();
  };

  showPlantingDirections = () => {
    console.log('show planting directions');
    this.setState({ showPlantsDirections: true });
  };
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
//
// }
// //
// // </form>
// // }
// // { this.state.selectedChamber !== '' &&
//   this.state.selectedPlant !== '' &&
//   this.state.isBalanced === false && (
//
//   )}
//
// {this.state.showDirections === true && (
//
// ) }

  validateForm() {
    console.log('validateForm');
    // debugger
    return this.state.selectedPlant.length > 0 && this.state.selectedChamber > 0;
  }

  // handlePLantChange = event => {
  //   console.log('handle change');
  //   this.setState({
  //     selectedPlant: event.target.name
  //   });
  // }
  //
  // handleChamberChange = event => {
  //   console.log('handle change');
  //   // debugger
  //   this.setState({
  //     selectedChamber: event.target.name
  //   });
  // }

  createGarden = (garden) => { // eslint-disable-line
    console.log('create garden');
    // debugger;
    return invokeApig({ // eslint-disable-line
      path: '/gardens',
      method: "POST",
      body: garden
    })
  }

  updateChamber = (chamber) => { // eslint-disable-line
    console.log('update chamber');
    const tempChamber = pickBy(this.state.chamberOptions, chamberOpt => chamberOpt.chamberId === this.state.selectedChamber.toString());
    const key = findKey(tempChamber);
    const createdAt = this.state.chamberOptions[key].createdAt;
    // debugger;

    return invokeApig({ // eslint-disable-line
      path: `/chambers/${createdAt}`,
      method: "put",
      body: chamber
    })
  }

  handleSubmit = async event => {
    console.log('submit new grow plant');
    event.preventDefault();
    if (!this.validateForm()) {
      alert("Please pick a plant and chamber.");
      return;
    }

    this.setState({ isloading: true });

    try {
      await this.createGarden({
        chamberId: (this.state.selectedChamber).toString(),
        plantName: this.state.selectedPlant,
        climateId: this.state.newGrowPlant.climateId,
        plantRecipeId: this.state.newGrowPlant.recipeId,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // await this.updateChamber({
      //   chamberId: (this.state.selectedChamber).toString(),
      //   isFilled: true,
      //   chamberName: `Chamber ${this.state.selectedChamber}`,
      //   plantName: this.state.selectedPlant
      //
      // });
      // this.setState({showDirections: true});
    } catch(e) {
      console.log(e);
    }
    this.setState({
      isloading:false,
      showForm: false
    })
    if (!isEmpty(this.state.newGrowPlant)) {
      this.setState({ showDirections: true });
    }
  }

  completeNewGrow = () => {
    console.log('complete new grow after setup ph, etc');
    this.props.history.pushState("You have successfully created a New Garden!", null, "/monitor");
  }

  renderPlantGroup() {
    const { plantTypes } = this.state;
    if (isEmpty(this.state.selectedPlant)) {
      return (
        <div className={styles.plantsContainer} >
          { plantTypes.map((plant) => {

            return (
            <div
              key={plant.recipeName}
              className={styles[`button${(plant.recipeName).replace(/\s/, '')}`]}>

              <input
                type='button'
                name={plant.recipeName}
                value={plant.fullName}
                key={plant.gardenId}
                className={styles[`${plant.recipeName.replace(/\s/, '')}Input`]}
                onClick={this.handlePlantRadioClick}
              />
            </div>
            )
          })}
        </div>
      )
    } else {
      return null;
    }
  }

  renderChambers() {
    const { chamberOptions } = this.state;
    if (!isEmpty(this.state.newGrowPlant)) {
      return (
        <div className={styles.chamberContainer}>
        <h3
          id="chamber"
          className={styles.directions}>
          Select A Chamber
        </h3>
      { chamberOptions.map((chamber) => {
          return (
            <input
              type='button'
              name={chamber.chamberId}
              key={chamber.chamberId}
              value={chamber.chamberName}
              className={styles[`${chamber.chamberName.replace(/\s/, '')}`]}
              onClick={this.handleChamberRadioClick}
              disabled={chamber.isFilled}
            />
          )
        })
      }
        </div>
      )
    } else {
      return null;
    }
  }

  render() {
    console.log('render new grow');
    // console.log(`plantTypes: ${this.state.plantTypes}`);
    console.log(this.state.newGrowPlant);
// debugger
    return (
      <div className={styles.newGrowContainer}>
      { !this.state.isloading &&
        <div>
        { isEmpty(this.state.selectedPlant)
          ?
          <div className={styles[`${this.state.selectedPlant.replace(/\s/, '')}`]}>
            <h3>Select a Plant</h3>
            <h4>OR</h4>
            <h3>Customize Your Own Settings</h3>
          </div>
          :
          null
        }
        { this.state.showForm === true && (
        <form
          className={styles.newGrowForm}
          onSubmit={this.handleSubmit}>
          <div>
            <div>
             { this.renderPlantGroup() }
             { this.renderChambers() }
             </div>
            <LoaderButton
              className='sumbitGarden'
              disabled={!this.validateForm()}
              type="submit"
              isloading={this.state.isloading}
              text="Create"
              loadingtext="Creating…"
            />
          </div>
        </form>
        )}
        { this.state.showDirections === true && (
          <Directions
            newGrowPlant={this.state.newGrowPlant}
            handlePhClick={this.updatePhBalance}
            handlePlantClick={this.completeNewGrow}
            handleNextClick={this.showPlantingDirections}
            isBalanced={this.state.isBalanced}
            selectedPlant={this.state.selectedPlant}

            selectedChamber={this.state.selectedChamber}
            showPlantsDirections={this.state.showPlantsDirections}
          />
        )}

      </div>
    }
    </div>
    );
  }
}

export default NewGrow;
