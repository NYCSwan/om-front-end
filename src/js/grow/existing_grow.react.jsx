import React, { Component } from 'react';
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';
import pickBy from 'lodash/pickBy';
import findKey from 'lodash/findKey';
import isEmpty from 'lodash/isEmpty';

import ListGroupContainer from '../components/ListGroup.react';
// import ChamberFormGroup from './chamber_options_form.react';
// import Directions from './directions.react';
import Spinner from '../helpers/spinner.react';
import PopUp from './popup.react';
import { invokeApig } from '../../libs/awsLibs';
import styles from '../../styling/existing_grow.css';

class ExistingGrow extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
  }

  state = {
    isloading: true,
    chambers: [],
    climates: [],
    updatingThisPlant: [],
    growingPlants: [],
    // showBalance: false,
    // showPause: false,
    showInitialPopup: false,
    // showChambers: true,
    // // showButton: false,
    // isBalanced: false
  };


  async componentDidMount() {
    console.log('component did mount existing grow');
   try {
     const chamberResults = await this.getChamberOptions();
     this.setState({chambers: chamberResults});
     const climateResults = await this.getClimates();
     this.setState({climates: climateResults});
     const gardenResults = await this.getGrowingPlants();
     this.setState({growingPlants: gardenResults});
   } catch (e) {
     console.log(e);
   }
     this.setState({isloading: false });
  }

  shouldComponentUpdate(newState) {
    console.log('shouldComponentUpdate existing grow');
    return (
      this.state.chambers !== newState.chambers ||
      // this.state.selectedChamber !== newState.selectedChamber ||
      // this.state.showPause !== newState.showPause ||
      // this.state.showBalance !== newState.showBalance ||
      // this.state.showInitialPopup !== newState.showInitialPopup ||
      this.state.growingPlants !== newState.growingPlants
      // || this.state.isBalanced !== newState.isBalanced
    );
  }

  // componentDidUpdate() {
    // console.log('componentDidUpdate existing grow');
    // if (this.state.selectedPlant !== "" && this.state.directions.length === 0) {
    // this.updateSettings();
    // this.updateDirections();
    // }
  // }
  // renderGrowingPlantsList(plants) {
  //   return [{}].concat(plants).map(
  //   (plant, i) =>
  //     <p key={plant.plantName}>{plant.plantName}</p>
  // );
  // }

// API GET CALLS
  getGrowingPlants = () => {
    console.log('get plant recipe');
    // debugger
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
  handleChamberRadioClick = e => {
    console.log('handleChamberRadio: update existing plant existing grow');
    const target = e.target.innerText;
    const currentPlantType = pickBy(this.state.growingPlants, plant => plant.plantName === target);
    // const key = findKey(currentPlantType)
    this.setState({
      updatingThisPlant: currentPlantType,
      showInitialPopup: true
    });
  };

  handlePopupClick = () => {
    console.log('handle popup click');
    this.setState({ showInitialPopup: false });
  }

  handleBalanceClick = e => {
    console.log('handle balance Click existingGrow');
    console.log(e);
    this.setState({
      showBalance: true,
      showButton: false,
      showChambers: false
    });
  };

  handlePauseClick = () => {
    console.log('handle pause Click existingGrow');
    this.setState({
      showPause: true,
      showButton: false,
      showChambers: false
    });
  };


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
    const { chambers } = this.state;
    const items = []
    let temp = {};
    for(let i = 0; i< chambers.length; i++) {
      temp[i] = {
        'name': chambers[i].chamberName,
        'isFilled': chambers[i].isFilled,
        'plantName': chambers[i].plantName || null
      }
      items.push(temp[i])
    }
    return (
      <div className={styles.gardens}>
        <h3 className={styles.chamber}>Your Choices</h3>
        <ListGroupContainer
          items={items}
          handleClick={this.handleChamberRadioClick}>
        </ListGroupContainer>
      </div>
    );
  }

  // updatePhBalance = () => {
  //   console.log('update ph balance existing plant');
  //   //   setTimeout(200000);
  //   //   console.log('timeout 20000');
  //   //   console.log(e);
  //   this.setState({ isBalanced: true });
  // };

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

  updateDirections = () => {
    console.log('update directions existing grow');
    const { plantTypes } = this.props;
    const currentPlantState = upperFirst(this.state.selectedPlant);
    const currentPlantType = pickBy(plantTypes, (plant) => plant.name === currentPlantState );
    const tempDirections = [];
    const key = findKey(currentPlantType);

    tempDirections.push(currentPlantType[key].grow_directions);
    tempDirections.push("This may take about 5 minutes...");
    tempDirections.push(currentPlantType[key].planting_directions);
    this.setState({ directions: tempDirections });
  }


  //
  // showGrowDirections = () => {
  //   console.log('show grow directions existing grow');
  //   this.setState({ showGrowDirections: true, showBalance: false });
  // }
  //
  // submitGrowChange = () => {
  //   console.log('submit grow changes');
  // }

  // {/* chamber selection */}
  // {isEmpty(this.state.growingPlant) && (
  //   <div className="chambers">
  //     <div className="chamberImage">
  //       <ChamberFormGroup options={this.state.chambers} onClick={this.handleChamberRadioClick} />
  //     </div>
  //     <h3 id="chamber" className="directions Futura-Lig">
  //       Select A Chamber
  //     </h3>
  //     <a href="/directions" className="btn btn-default">
  //       Submit
  //     </a>
  //   </div>
  // )}
  // {!isEmpty(this.state.growingPlant) && (

  // )}
  // {this.state.showPause === true ? <Pause showPause={this.state.showPause} /> : null}
  // {this.state.showBalance === true ? (
  //   <Directions
  //     newGrowPlant={this.state.newGrowPlant}
  //     climates={this.state.climates}
  //     handleClick={this.updatePhBalance}
  //     isBalanced={this.state.isBalanced}
  //     selectedChamber={this.state.selectedChamber}
  //   />
  // ) : null}
  renderPopUp() {
    console.log('render popup');
    return (
        <PopUp
          modalTitle="Select Your Next Step"
          modalBody={
            <div>
              <h4>Pause</h4>
              <p>Pause your grow system to clean or change the water.</p>
              <button
                className={styles.pause} onClick={this.handlePauseClick}>
                Pause
              </button>
              <h4>pH Balance</h4>
              <p>Balance the pH in your system.</p>
              <button
                className={styles.balanced} onClick={this.handleBalanceClick}>
                Balance
              </button>
            </div>
          }
          buttonText1="Submit Chamber"
          buttonText2="Close"
          displayModal={this.state.showInitialPopup}
          handleClick={this.handlePopupClick}
        />
    )
  }

  renderError() {
    return (
      <div className={styles.errorMessage}>
        <p>Something seems to have gone wrong. Please refresh or try again later.</p>
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
        { !isEmpty(this.state.updatingThisPlant)
          ? this.renderPopUp()
          : null
        }
      </div>
    );
  }
}

export default ExistingGrow;
