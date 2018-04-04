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
    updatingThisChamber: [],
    growingPlants: [],
    showBalance: false,
    showPause: false,
    showInitialPopup: false,
    newGrowPlant: {},
    showForm: true,
    // // showButton: false,
    isBalanced: false
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
            updatingThisChamber: this.state.updatingThisChamber,
            showBalance: this.state.showBalance,
            showPause: this.state.showPause,
            showInitialPopup: this.state.showInitialPopup,
            newGrowPlant: this.state.newGrowPlant,
            growingPlants: this.state.growingPlants,
            climates: this.state.climates,
            chamberId: this.state.newGrowPlant.chamberId
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
    this.props.setTitle(`Garden`);
  }

  shouldComponentUpdate(newState) {
    console.log('shouldComponentUpdate existing grow');
    return (
      this.state.chamberOptions !== newState.chamberOptions || this.state.growingPlants !== newState.growingPlants || this.state.showForm !== newState.showForm
    );
  }


// API GET CALLS
  getGrowingPlants = () => {
    console.log('get plant recipe');
    return invokeApig({ path: `/gardens`});
  };

  getChamberOptions = () => {
    console.log('get chamber options');
    return invokeApig({ path: '/chambers' });
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

  updateGardenSelection = () => {
    // return invokeApig({ // eslint-disable-line
    //   path: `/chambers/${createdAt}`,
    //   method: "put",
    //   body: chamber
    // })
  }

// V-DOM EVENTS
// UPDATE STATE
  setStateFromHistory = () => {
    const { chamberOptions, showBalance, newGrowPlant, plantTypes, growingPlants, updatingThisChamber, climates, showPause, showInitialPopup } = this.props.history.location.state;

    this.setState({
      plantTypes,
      chamberOptions,
      updatingThisChamber,
      showBalance,
      showPause,
      showInitialPopup,
      newGrowPlant,
      growingPlants,
      climates
    })

  }

  handleChamberRadioClick = (e) => {
    console.log('handleChamberRadio: update existing plant existing grow');
    const target = e.target.innerText;
    const currentPlantType = pickBy(this.state.growingPlants, plant => plant.plantName === target);
    const key = findKey(currentPlantType);
    this.setState({
      updatingThisChamber: currentPlantType[key],
      showInitialPopup: true,
      showForm: false
    });

    this.props.handleModalClick();
    // this.props.showModal();
    this.updateRecipeState(target);
    this.props.history.push({
      pathname: this.props.location.pathname,
      state: {
        plantTypes: this.state.plantTypes,
        showForm: false,
        chamberOptions: this.state.chamberOptions,
        updatingThisChamber: currentPlantType[key],
        showBalance: this.state.showBalance,
        showPause: this.state.showPause,
        showInitialPopup: true,
        newGrowPlant: this.state.newGrowPlant,
        growingPlants: this.state.growingPlants,
        climates: this.state.climates
      }
    })
  }

  async updateRecipeState(plant) {
    console.log('get recipe based on form input');
    try {
      const recipeResults = await this.getRecipe(plant);
      this.setState({ newGrowPlant: recipeResults });
    } catch(plant) {
      console.error('error existingGrow: 128');
    }
  }

// DOM EVENTS
  handlePopupClick = () => {
    console.log('handle popup click existing grow');
    this.setState({
      showInitialPopup: false,
      showForm: true,
      showPause: false
    });

    this.props.handleModalClick();
  }

  handleBalanceClick = () => {
    console.log('handle balance Click existingGrow');
    this.setState({
      showBalance: true,
      showInitialPopup: false,
      showForm: false
    });
    this.props.history.push({
      pathname: this.props.location.pathname,
      state: {
        plantTypes: this.state.plantTypes,
        chamberOptions: this.state.chamberOptions,
        updatingThisChamber: this.state.updatingThisChamber,
        showBalance: false,
        showPause: this.state.showPause,
        showInitialPopup: true,
        newGrowPlant: this.state.newGrowPlant,
        growingPlants: this.state.growingPlants,
        climates: this.state.climates
      }
    })
    // this.props.handleModalClick();
  };

  handlePauseClick = () => {
    console.log('handle pause Click existingGrow');
    this.setState({
      showPause: true,
      showInitialPopup: false
    });

    this.props.history.push({
      pathname: this.props.location.pathname,
      state: {
        plantTypes: this.state.plantTypes,
        chamberOptions: this.state.chamberOptions,
        updatingThisChamber: this.state.updatingThisChamber,
        showBalance: false,
        showPause: false,
        showInitialPopup: true,
        newGrowPlant: this.state.newGrowPlant,
        growingPlants: this.state.growingPlants,
        climates: this.state.climates
      }
    })
  };

  handleResumeClick = () => {
    console.log('handle resume click');
    this.setState({ showPause: false });
    this.props.handleModalClick();
    // update Chamber Info in DB
    this.updateChamberDataToDb();
    // Redirect to monitor page
    this.props.history.push({
      pathname: '/monitor',
      state: {
        chamberId: this.state.newGrowPlant.chamberId,
        growingPlants: this.state.growingPlants,
        chambers: this.state.chamberOptions,
        currentPlantName: this.state.newGrowPlant.recipeName,
        notifications: ["You have successfully updated your garden. Check out how it's doing!"]
        }
      });
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
    const { chamberOptions, showForm } = this.state;
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
    if (showForm) {
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
    setTimeout(() => {
      console.log('timeout 10000')
    }, 10000);
    this.setState({ isBalanced: true });
  };

  completeExisitingGrow = () => {
    console.log('complete existing grow after setup ph, etc');
    this.props.history.push({
      pathname: "/monitor",
      state: {
        chamberId: this.state.chamberId,
        growingPlants: this.state.growingPlants,
        chambers: this.state.chamberOptions,
        notifications: ["You have successfully updated your garden!"]
      }
    });
  }

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
          handleCloseClick={this.handlePopupClick}
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
        { ( !isEmpty(this.state.newGrowPlant) && this.state.showInitialPopup )
          ? this.renderPopUp()
          : null
        }

        { this.state.showPause === true
          ? <Pause
              showPause={this.state.showPause}
              openModal={this.props.openModal}
              handleCloseClick={this.handlePopupClick}
              handleClick={this.handleResumeClick}
            />
          : null
        }
        { this.state.showBalance === true
          ? <DirectionsContainer
              newGrowPlant={this.state.newGrowPlant}
              handlePhClick={this.updatePhBalance}
              handlePlantClick={this.completeExisitingGrow}
              handleNextClick={this.completeExisitingGrow}
              isBalanced={this.state.isBalanced}
              plant={this.state.updatingThisChamber.fullName}
              selectedChamber={parseInt(this.state.updatingThisChamber.chamberId, 10)}
              showPlantsDirections={false}
            />
          : null
        }
      </div>
    );
  }
}

export default ExistingGrow;
