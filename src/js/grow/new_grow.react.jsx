import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pickBy from 'lodash/pickBy';
import findKey from 'lodash/findKey';
import isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

import { invokeApig } from "../../libs/awsLibs";
import LoaderButton from './../components/LoaderButton.react';
import DirectionsContainer from './directions_container.react';
import styles from '../../styling/new_grow.css';


class NewGrow extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
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
    debugger
    if (!this.props.location.state) {
      try {
          const recipeResults = await this.getPlantRecipes();
          this.setState({plantTypes: recipeResults});
          const chamberResults = await this.getChamberOptions();
          this.setState({chamberOptions: chamberResults});

          if(this.props.isAuthenticated) {
            this.props.history.push({
              pathname: this.props.location.pathname,
              state: {
                plantTypes: this.state.plantTypes,
                chamberOptions: this.state.chamberOptions,
                selectedPlant: this.state.selectedPlant,
                isBalanced: this.state.isBalanced,
                showDirections: this.state.showDirections,
                showPlantsDirections: this.state.showPlantsDirections,
                newGrowPlant: this.state.newGrowPlant,
                selectedChamber: this.state.selectedChamber,
                showForm: this.state.showForm
              }
            });
          }
      } catch(e) {
        console.error(e);
      }
    } else {
      console.log('set state to location state');
      this.setStateFromHistory();
    }
    this.props.setTitle('New Garden');
      // debugger
      window.onpopstate = (e) => {
          e.preventDefault();
          this.props.history.go(0);
      }
  }

  shouldComponentUpdate(newState) {
    console.log('shouldComponentUpdate new grow');
    return (
      // this.state.selectedChamber !== newState.selectedChamber ||
      // this.state.selectedPlant !== newState.selectedPlant ||
      // this.state.plantTypes !== newState.plantTypes ||
      // this.state.newGrowPlant !== newState.newGrowPlant ||
      // this.state.chamberOptions !== newState.chamberOptions ||
      this.state.isBalanced !== newState.isBalanced || this.state.showForm !== newState.showForm
    );
  }

  componentWillUnmount() {
    this.unlisten();
  }

  unlisten = () => {
    this.props.history.listen((location, action) => {
      // location is an object like window.location
      console.log(action, location.pathname, location.state)
    })
  }

  getPlantRecipes = () => {
    console.log(`get plant recipes`);
    return invokeApig({ path: '/plants' });
  };

  getChamberOptions = () => {
    console.log('get chamber options');
    return invokeApig({ path: '/chambers' });
  };

  handlePlantRadioClick = e => {
    console.log(`handlePlantRadioClick: ${e.target}`);
    // debugger
    this.setState({ selectedPlant: e.target.value });
    this.handleNewPlantSelection(e);
  };

  handleChamberRadioClick = e => {
    console.log(`handleChamberRadio: ${e.target.value}`);
    const tempChamberId = parseInt(e.target.value.slice(-1), 10);
    this.setState({
      selectedChamber: tempChamberId,
      plantTypes: this.state.plantTypes,
      chamberOptions: this.state.chamberOptions,
      selectedPlant: this.state.selectedPlant,
      isBalanced: this.state.isBalanced,
      showDirections: this.state.showDirections,
      showPlantsDirections: this.state.showPlantsDirections,
      newGrowPlant: this.state.newGrowPlant,
      showForm: this.state.showForm
    });
  }

  handleNewPlantSelection = e => {
    console.log('handle Plant recipe Selection new grow');
    const tempPlant = e.target.value;
    const currentPlantType = pickBy(this.state.plantTypes, plant => plant.fullName === tempPlant);
    const key = findKey(currentPlantType);
    this.setState({ newGrowPlant: currentPlantType[key] })
    this.props.history.push({
      pathname: this.props.location.pathname,
      state: {
        selectedPlant: tempPlant,
        newGrowPlant: currentPlantType[key],
        plantTypes: this.state.plantTypes,
        chamberOptions: this.state.chamberOptions,
        isBalanced: this.state.isBalanced,
        showDirections: this.state.showDirections,
        showPlantsDirections: this.state.showPlantsDirections,
        selectedChamber: this.state.selectedChamber,
        showForm: this.state.showForm
      }
    });
    // debugger
  }

  updatePhBalance = () => {
    console.log('update PH balance');
    setTimeout(() => {
      console.log('timeout 10000')
    }, 10000);
    this.setState({ isBalanced: true })
    this.props.history.push({
      pathname: this.props.location.pathname,
      state: {
        isBalanced: true,
        newGrowPlant: this.state.newGrowPlant,
        plantTypes: this.state.plantTypes,
        chamberOptions: this.state.chamberOptions,
        selectedPlant: this.state.selectedPlant,
        showDirections: this.state.showDirections,
        showPlantsDirections: this.state.showPlantsDirections,
        selectedChamber: this.state.selectedChamber,
        showForm: this.state.showForm
      }
    });
    this.showPlantingDirections();
  };

  showPlantingDirections = () => {
    console.log('show planting directions');
    this.setState({ showPlantsDirections: true })
    this.props.history.push({
      pathname: this.props.location.pathname,
      state: {
        showPlantsDirections: true,
        newGrowPlant: this.state.newGrowPlant,
        plantTypes: this.state.plantTypes,
        chamberOptions: this.state.chamberOptions,
        selectedPlant: this.state.selectedPlant,
        isBalanced: this.state.isBalanced,
        showDirections: this.state.showDirections,
        selectedChamber: this.state.selectedChamber,
        showForm: this.state.showForm
      }
    });
  }

  validateForm() {
    console.log('validateForm');
    // debugger
    return this.state.selectedPlant.length > 0 && this.state.selectedChamber > 0;
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
    // this.props.history.push({
    //   pathname: this.props.location.pathname,
    //   state: {
    //     isloading:false,
    //     showForm: false
    //   }
    // });
    if (!isEmpty(this.state.newGrowPlant)) {
      this.setState({ showDirections: true })
      this.props.history.push({
        pathname: this.props.location.pathname,
        state: {
          showDirections: true,
          isloading: false,
          newGrowPlant: this.state.newGrowPlant,
          plantTypes: this.state.plantTypes,
          chamberOptions: this.state.chamberOptions,
          selectedPlant: this.state.selectedPlant,
          isBalanced: this.state.isBalanced,
          showPlantsDirections: this.state.showPlantsDirections,
          selectedChamber: this.state.selectedChamber,
          showForm: true
        }
      });
    }
  }

  completeNewGrow = () => {
    console.log('complete new grow after setup ph, etc');
    const plant_name = upperFirst(camelCase(this.state.newGrowPlant.recipeName));
    this.props.history.push({
      pathname: `/plants/${plant_name}`,
      state: {
        details: this.state.newGrowPlant,
        notifications: ["You have successfully started growing your garden! Check out how it's doing below."],
        plantTypes: this.state.plantTypes
      }
    });
  }

  setStateFromHistory = () => {
    const { chamberOptions, isBalanced, newGrowPlant, plantTypes, selectedPlant, selectedChamber, showDirections, showForm, showPlantsDirections } = this.props.history.location.state;

    this.setState({
      chamberOptions,
      isBalanced,
      newGrowPlant,
      plantTypes,
      selectedPlant,
      selectedChamber,
      showDirections,
      showForm,
      showPlantsDirections
    })
    this.setState({ isloading: false });
  }

  renderPlantGroup() {
    const { plantTypes } = this.state;
    if (isEmpty(this.state.selectedPlant)) {
      return (
        <div className={styles.plantsContainer}>
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
          <main>
          { chamberOptions.map((chamber) => {
              return (
                <input
                  type='button'
                  name={chamber.chamberId}
                  key={chamber.chamberId}
                  value={chamber.isFilled ? chamber.plantName : chamber.chamberName}
                  className={styles[`${chamber.chamberName.replace(/\s/, '')}`]}
                  onClick={this.handleChamberRadioClick}
                  disabled={chamber.isFilled}
                />
              )
            })
          }
          </main>
        </div>
      )
    } else {
      return null;
    }
  }

  render() {
    console.log('render new grow');
    return (
      <div className={styles.newGrowContainer}>
      { !this.state.isloading &&
        <div>
        { isEmpty(this.state.selectedPlant)
          ?
          <div className={styles.plantHeader}>
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
          <DirectionsContainer
            newGrowPlant={this.state.newGrowPlant}
            handlePhClick={this.updatePhBalance}
            handlePlantClick={this.completeNewGrow}
            handleNextClick={this.showPlantingDirections}
            isBalanced={this.state.isBalanced}
            plant={this.state.selectedPlant}
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
