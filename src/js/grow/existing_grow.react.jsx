import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PageHeader, ListGroup } from 'react-bootstrap';
// import upperFirst from 'lodash/upperFirst';
// import pickBy from 'lodash/pickBy';
// import findKey from 'lodash/findKey';
// import isEmpty from 'lodash/isEmpty';

// import ChamberFormGroup from './chamber_options_form.react';
// import Directions from './directions.react';
import PagerBack from '../layout/pagerBack.react';
import PagerFwd from '../layout/pagerFwd.react';
// import Pause from './pause.react';
// import PopUp from './popup.react';
import { invokeApig } from '../../libs/awsLibs';
import './existing_grow.css';

class ExistingGrow extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
  }

  state = {
    isLoading: true,
    chamberOptions: [],
    // selectedPlant: '',
    // selectedChamber: '',
    // plantTypes: [],
    climates: [],
    // growingPlant: [],
    growingPlants: [],
    // showBalance: false,
    // showPause: false,
    // showInitialPopup: false,
    // showChambers: true,
    // // showButton: false,
    // isBalanced: false
  };


  async componentDidMount() {
    console.log('component did mount existing grow');
   try {
     const chamberResults = await this.getChamberOptions();
     debugger
     const gardenResults = await this.getGrowingPlants();
     const climateResults = await this.getClimates();
     this.setChambers(chamberResults);
     this.setGardens(gardenResults);
     this.setClimates(climateResults);
   } catch (e) {
     console.log(e);
   }
   // setTimeout(function () {
     this.setState({isLoading: false })
   // }, 0);
    // this.getChamberOptions();
    // this.getClimates();
  }

  // shouldComponentUpdate(newState) {
  //   console.log('shouldComponentUpdate existing grow');
  //   return (
  //     this.state.chamberOptions !== newState.chamberOptions ||
  //     // this.state.selectedChamber !== newState.selectedChamber ||
  //     // this.state.showPause !== newState.showPause ||
  //     // this.state.showBalance !== newState.showBalance ||
  //     // this.state.showInitialPopup !== newState.showInitialPopup ||
  //     this.state.growingPlants !== newState.growingPlants
  //     // || this.state.isBalanced !== newState.isBalanced
  //   );
  // }

  // componentDidUpdate() {
    // console.log('componentDidUpdate existing grow');
    // if (this.state.selectedPlant !== "" && this.state.directions.length === 0) {
    // this.updateSettings();
    // this.updateDirections();
    // }
  // }
  renderGrowingPlantsList(plants) {
    return [{}].concat(plants).map(
    (plant, i) =>
      <p>{plant.plantName}</p>
  );
  }

  renderLanding() {
    return (
      <div>
        <h1>Select from your Exisiting Gardens</h1>
      </div>
    )
  }

  renderGardens() {
    return (
      <div className="gardens">
        <PageHeader>Your Choices</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderGrowingPlantsList(this.state.growingPlants)}
        </ListGroup>
      </div>
    );
  }

  getGrowingPlants = () => {
    console.log('get plant recipes');
    // debugger
    return invokeApig({ path: 'gardens' });
  };

  getChamberOptions = () => {
    console.log('get chamber options');
    return invokeApig({ path: 'chambers' });
  };

  getClimates = () => {
    console.log('get chambers');
    return invokeApig({ path: 'climates' });
  };

  setGardens = (garden) => {
    this.setState({ growingPlants: garden });
  }

  setChambers = (chambers) => {
    this.setState({ chamberOptions: chambers });
  }

  setClimates = (climates) => {
    this.setState({ climates });
  }
  // handleChamberRadioClick = e => {
  //   console.log(`handleChamberRadio: ${e.target.labels[0].innerText}`);
  //   // debugger
  //   this.setState({
  //     selectedChamber: e.target.labels[0].innerText
  //   });
  //   // console.log('handel form shoudl have chamber state');
  //   this.updateExistingPlant(e);
  // };
  //
  // updateExistingPlant = e => {
  //   console.log('update existing plant existing grow');
  //   const target = e.target.labels[0].innerText;
  //   const tempPlant = parseInt(target.charAt(target.length - 1), 8);
  //
  //   const currentPlantType = pickBy(this.state.plantTypes, plant => plant.g_id === tempPlant);
  //   debugger;
  //   this.setState({ growingPlant: currentPlantType });
  // };
  //
  // updatePhBalance = () => {
  //   console.log('update ph balance existing plant');
  //   //   setTimeout(200000);
  //   //   console.log('timeout 20000');
  //   //   console.log(e);
  //   this.setState({ isBalanced: true });
  // };

  // updateFormWithChamberData = () => {
  //   console.log('update form with chamber data');
  //   if (this.state.selectedChamber !== "" && this.state.selectedPlant === "") {
  //     console.log('update plant');
  //     this.updatePlantSelection();
  //   }
  //   if (this.state.selectedPlant !== "") {
  //     this.updateSettings();
  //     this.updateDirections();
  //   }
  // }
  //
  // updatePlantSelection = () => {
  //   console.log('update Plant selection');
  //   const tempFilledChambers = this.state.chamberOptions;
  //   const currentChamber = this.state.selectedChamber;
  //   const selectedPlantData = pickBy(tempFilledChambers, (plant) => plant.chamber_id === currentChamber.toString() );
  //   const key = findKey(selectedPlantData);
  //   this.setState({
  //     selectedPlant: selectedPlantData[key].name,
  //     selectedClimateId: selectedPlantData[key].climate_id
  //   })
  // }
  //
  // handleNewPlantSelection = e => {
  //   console.log('handleNewPlantSelection new grow');
  //   const tempPlant = e.target.labels[0].innerText;
  //   const currentPlantType = pickBy(this.state.plantTypes, plant => plant.shortname === tempPlant);
  //   this.setState({ newGrowPlant: currentPlantType });
  // };
  //
  // handleBalanceClick = e => {
  //   console.log('handle balance Click existingGrow');
  //   console.log(e);
  //   this.setState({
  //     showBalance: true,
  //     showInitialPopup: false,
  //     showButton: false,
  //     showChambers: false
  //   });
  // };
  //
  // handlePauseClick = () => {
  //   console.log('handle pause Click existingGrow');
  //   this.setState({
  //     showPause: true,
  //     showButton: false,
  //     showInitialPopup: false,
  //     showChambers: false
  //   });
  // };
  //
  // updateSettings = () => {
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
  //
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
  //
  // handleChamberRadioClick = (e) => {
  //   console.log(`handleChamberRadio existingGrow: ${e.nativeEvent.which}`);
  //   this.setState({
  //     selectedChamber: e.nativeEvent.which,
  //     showButton: true
  //    }, () => {
  //     this.updateFormWithChamberData();
  //   });
  // }
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
  //   <div className="chamberOptions">
  //     <div className="chamberImage">
  //       <ChamberFormGroup options={this.state.chamberOptions} onClick={this.handleChamberRadioClick} />
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
  //   <PopUp
  //     modalTitle="Select Your Next Step"
  //     modalBody={
  //       <div>
  //         <h4>Pause</h4>
  //         <p>Pause your grow system to clean or change the water.</p>
  //         <Button className="pause" onClick={this.handlePauseClick}>
  //           Pause
  //         </Button>
  //         <h4>pH Balance</h4>
  //         <p>Balance the pH in your system.</p>
  //         <Button className="balanced" onClick={this.handleBalanceClick}>
  //           Balance
  //         </Button>
  //       </div>
  //     }
  //     buttonText1="Submit Chamber"
  //     buttonText2="Close"
  //     displayModal={this.state.showInitialPopup}
  //     handleClick={this.handlePopupClick}
  //   />
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

  render() {
    console.log('render existing grow');
    console.log(this.state.growingPlants);
// debugger
    return (
      <div className="existingGrow container">
        <div>
              climates: {this.state.climates}
              chambers: {this.state.chamberOptions}
        </div>
        {this.props.isAuthenticated ? this.renderGardens() : this.renderLanding()}
        <PagerBack className="grow" />
        <PagerFwd className="grow" />
      </div>
    );
  }
}

export default ExistingGrow;
