import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import upperFirst from 'lodash/upperFirst';
import pickBy from 'lodash/pickBy';
import findKey from 'lodash/findKey';
import isEmpty from 'lodash/isEmpty';

import ListGroupContainer from '../components/ListGroup.react';
import Pause from './pause.react';
import DirectionsContainer from './directions_container.react';
import Spinner from '../helpers/spinner.react';
import PopUp from './popup.react';
import { invokeApig } from '../../libs/awsLibs';
import styles from '../../styling/existing_grow.css';

class ExistingGrow extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired,
    openModal: PropTypes.bool.isRequired,
    handleModalClick: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired
  }

  state = {
    isloading: true,
    chamberOptions: [],
    climates: [],
    updatingThisPlant: [],
    growingPlants: [],
    showBalance: false,
    showPause: false,
    showInitialPopup: false,
    plantRecipe: {},
    isAuthenticated: PropTypes.bool.isRequired,
    userHasAuthenticated: PropTypes.func.isRequired
    // showChambers: true,
    // // showButton: false,
    // isBalanced: false
  };


  async componentDidMount() {
    console.log('component did mount existing grow');
    if (!this.props.location.state) {
    try {
      const chamberResults = await this.getChamberOptions();
      this.setState({chamberOptions: chamberResults});
      const climateResults = await this.getClimates();
      this.setState({climates: climateResults});
      const gardenResults = await this.getGrowingPlants();
      this.setState({growingPlants: gardenResults});

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
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log('set state to location state');
    this.setStateFromHistory();
  }

    // debugger
    window.onpopstate = (e) => {
        e.preventDefault();
        this.props.history.go(0);
    }

    this.setState({isloading: false });
  }

  shouldComponentUpdate(newState) {
    console.log('shouldComponentUpdate existing grow');
    return (
      this.state.chamberOptions !== newState.chamberOptions || this.state.growingPlants !== newState.growingPlants
    );
  }


// API GET CALLS
  getGrowingPlants = () => {
    console.log('get plant recipe');
    return invokeApig({ path: `/plants`});
  };

  getChamberOptions = () => {
    console.log('get chamber options');
    return invokeApig({ path: '/chamberOptions' });
  };

  getClimates = () => {
    console.log('get recipes');
    return invokeApig({ path: '/climates' });
  };

  getRecipe = (plant) => {
    console.log('get recipe');
    return invokeApig({ path: `/plants/${plant}` });
  };

  // POST TO DB
  updateChamberDataToDb = () => {
    console.log('update db with chamber data');
    if (this.state.selectedChamber !== "" && this.state.selectedPlant === "") {
      console.log('update plant');
      this.updateGardenSelection();
      // this.updateChambers();

    }
  }
// V-DOM EVENTS
// UPDATE STATE
  handleChamberRadioClick = (e) => {
    console.log('handleChamberRadio: update existing plant existing grow');
    const target = e.target.innerText;
    const currentPlantType = pickBy(this.state.growingPlants, plant => plant.plantName === target);
    const key = findKey(currentPlantType)
    // this.props.handleModalClick();
    this.setState({
      updatingThisPlant: currentPlantType[key],
      showInitialPopup: true
    });

    this.props.showModal();
    this.updateRecipeState(target);
  }

  async updateRecipeState(plant) {
    console.log('update recipe state');

    try {
      const recipeResults = await this.getRecipe(plant);
      this.setState({ plantRecipe: recipeResults })
    } catch(plant) {
      console.error('error existingGrow: 128');
    }
  }
  handlePopupClick = () => {
    console.log('handle popup click');
    this.setState({ showInitialPopup: false });
    // this.props.handleModalClick();
  }

  handleBalanceClick = e => {
    console.log('handle balance Click existingGrow');
    console.log(e);
    this.setState({
      showBalance: true,
      showInitialPopup: false
    });
    this.props.handleModalClick();
  };

  handlePauseClick = () => {
    console.log('handle pause Click existingGrow');
    this.setState({
      showPause: true,
      showInitialPopup: false
    });
  };

  handleResumeClick = () => {
    console.log('handle resume click');
    this.setState({ showPause: false });
    this.props.handleModalClick();
    this.props.history.push('/monitor');
  }
// RENDER
  renderLanding() {
    console.log('render lander');
    return (
      <div>
        <h1>Loading gardens...</h1>
        <Spinner />
      </div>
    )
  }

  renderGardens() {
    console.log('renderGardens');
    const { chamberOptions, updatingThisPlant } = this.state;
    const items = []
    let temp = {};
    for(let i = 0; i< chamberOptions.length; i++) {
      temp[i] = {
        'name': chamberOptions[i].chamberName,
        'isFilled': chamberOptions[i].isFilled,
        'plantName': chamberOptions[i].plantName || null
      }
      items.push(temp[i])
    }
    if (isEmpty(updatingThisPlant)) {
      return (
        <div className={styles.gardens}>
          <h3 className={styles.chamber}>Your Choices</h3>
          <ListGroupContainer
            items={items}
            handleClick={this.handleChamberRadioClick}>
          </ListGroupContainer>
        </div>
      )
    }
  }

  updatePhBalance = () => {
    console.log('update ph balance existing plant');
      setTimeout(200000);
      console.log('timeout 20000');
    this.setState({ isBalanced: true });
  };

  // renderSettings = () => {
  //   console.log('update settings existing grow');
  //   // update state.settings with plantTypes info
  //   const { plantTypes, climates } = this.props;
  //
  //   const chamber = this.state.selectedChamber;
  //   const currentPlantState = upperFirst(this.state.selectedPlant);
  //   const currentClimateId = this.state.selectedClimateId;
  //   const currentPlantType = pickBy(plantTypes, (plant) => plant.name === currentPlantState );
  //   const currentClimate = pickBy(climates, (climate) => climate.id === currentClimateId )
  //   const key = findKey(currentClimate);
  //   const climateName = currentClimate[key].type;
  //   const currentSettings = [];
  //   const plantKey = findKey(currentPlantType);
  //
  //   currentSettings.push(currentPlantType[plantKey].name);
  //   currentSettings.push(`${upperFirst(climateName)}, ${currentPlantType[plantKey].temperature}`);
  //   currentSettings.push(`pH ${currentPlantType[plantKey].pH}`);
  //   currentSettings.push(`Chamber ${chamber}`);
  //   this.setState({ settings: currentSettings });
  //
  // }

  // updateDirections = () => {
  //   console.log('update directions existing grow');
  //   const { plantTypes } = this.props;
  //   const currentPlantState = upperFirst(this.state.selectedPlant);
  //   const currentPlantType = pickBy(plantTypes, (plant) => plant.name === currentPlantState );
  //   const tempDirections = [];
  //   const key = findKey(currentPlantType);
  //
  //   tempDirections.push(currentPlantType[key].grow_directions);
  //   tempDirections.push("This may take about 5 minutes...");
  //   tempDirections.push(currentPlantType[key].planting_directions);
  //   this.setState({ directions: tempDirections });
  // }

  completeExisitingGrow = () => {
    console.log('complete existing grow after setup ph, etc');
    this.props.history.push("/monitor");
  }
  // showGrowDirections = () => {
  //   console.log('show grow directions existing grow');
  //   this.setState({ showGrowDirections: true, showBalance: false });
  // }
  //
  // submitGrowChange = () => {
  //   console.log('submit grow changes');
  // }


  renderPopUp() {
    console.log('render popup');

    return (
        <PopUp
          modalTitle="Select Your Next Step"
          modalBody={
          <tbody className={styles.modalBody}>
            <tr>
              <td className={styles.title}>Pause</td>
            </tr>
            <tr className={styles.textContainer}>
              <td className={styles.text}>Pause your grow system to clean or change the water.</td>
            </tr>
            <tr className={styles.buttonContainer}>
              <td>
                <button
                  className={styles.pause}
                  onClick={this.handlePauseClick}>
                  Pause
                </button>
              </td>
            </tr>

            <tr><td className={styles.title}>pH Balance</td></tr>
            <tr className={styles.balancedButtonContainer}>
              <td className={styles.text}>Balance the pH in your system.</td>
            </tr>
            <tr className={styles.buttonContainer}>
              <td>
                <button
                  className={styles.balanced}
                  onClick={this.handleBalanceClick}>
                  Balance
                </button>
              </td>
            </tr>
          </tbody>
          }
          openModal={this.props.openModal}
          buttonText="Close"
          displayModal={this.state.showInitialPopup}
          handleClick={this.handlePopupClick}
        />
    )
  }

  renderError() {
    return (
      <div className={styles.errorMessage}>
        <p className={styles.text}>Something seems to have gone wrong. Please refresh or try again later.</p>
      </div>
    )
  }

  render() {
    console.log('render existing grow');
    // console.log(this.state.growingPlants);
// debugger
    return (
      <div className={styles.existingGrow}>
        { this.props.isAuthenticated
          ? this.renderGardens()
          : this.renderLanding()
        }
        { ( !isEmpty(this.state.plantRecipe) && this.state.showInitialPopup )
          ? this.renderPopUp()
          : null
        }

        { this.state.showPause === true
          ? <Pause
              showPause={this.state.showPause}
              openModal={this.props.openModal}
              handleClick={this.handleResumeClick}
            />
          : null
        }
        { this.state.showBalance === true
          ? <DirectionsContainer
              newGrowPlant={this.state.plantRecipe}
              handlePhClick={this.updatePhBalance}
              isBalanced={this.state.isBalanced}
              selectedChamber={this.state.updatingThisPlant.chamberId}
              handleClick={this.completeExisitingGrow}
              showPlantsDirections={false}
              plant={this.state.updatingThisPlant.fullName}
              handlePlantClick={this.completeExisitingGrow}
              handleNextClick={this.completeExisitingGrow}
              match={this.props.match}
              history={this.props.history}
            />
          : null
        }
      </div>
    );
  }
}

export default ExistingGrow;
