import React, { Component } from 'react';
import { form, FormGroup, Radio, ControlLabel } from 'react-bootstrap';
// import pickBy from 'lodash/pickBy';
import PropTypes from 'prop-types';

import { invokeApig } from "../../libs/awsLibs";
import PagerBack from '../layout/pagerBack.react';
import PagerFwd from '../layout/pagerFwd.react';
// import CustomizeSensors from './customize_sensors.react';
// import PlantFormGroup from './planttype_form_group.react';
// import ChamberFormGroup from './chamber_options_form.react';
// import Directions from './directions.react';
// import PlantingDirections from './planting_directions.react';
import LoaderButton from './../components/LoaderButton.react';
import './new_grow.css';

class NewGrow extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired,
    userHasAuthenticated: PropTypes.func.isRequired
  }

  state = {
    plantTypes: ['Basil', 'Kale', 'Cilantro'],
    chamberOptions: ['Chamber 1','Chamber 2','Chamber 3'],
    climates: ['Temperate', 'Tropical', 'Customize'],
    selectedPlant: '',
    selectedChamber: '',
    isBalanced: false,
    showDirections: false,
    isLoading: false,
    newGrowPlant: []
  };

  // async componentDidMount() {
  //   console.log('component did mount new grow');
  //   try {
  //       const recipeResults = await this.getPlantRecipes();
  //       const chamberResults = await this.getChamberOptions();
  //       const climateResults = await this.getClimates();
  //       // debugger
  //       this.setRecipes(recipeResults);
  //       this.setChambers(chamberResults);
  //       this.setClimates(climateResults);
  //   } catch(e) {
  //     console.log(e);
  //   }
  // }
  //
  // shouldComponentUpdate(newState) {
  //   console.log('shouldComponentUpdate new grow');
  //   return (
  //     this.state.selectedChamber !== newState.selectedChamber ||
  //     this.state.selectedPlant !== newState.selectedPlant ||
  //     this.state.plantTypes !== newState.plantTypes ||
  //     this.state.newGrowPlant !== newState.newGrowPlant ||
  //     this.state.chamberOptions !== newState.chamberOptions ||
  //     this.state.showDirections !== newState.showDirections ||
  //     this.state.isBalanced !== newState.isBalanced
  //   );
  // }
  //
  // componentDidUpdate() {
  //   console.log('componentDidUpdate new grow');
  // }
  //
  // getPlantRecipes = () => {
  //   const test = invokeApig({ path: 'plants' });
  //   debugger
  //   console.log(`get plant recipes ${test}`);
  //   return invokeApig({ path: 'plants' });
  // };
  //
  // getChamberOptions = () => {
  //   console.log('get chamber options');
  //   return invokeApig({ path: 'chambers' });
  // };
  //
  // getClimates = () => {
  //   console.log('get climates');
  //   return invokeApig({ path: 'climates' });
  // };
  //
  // setRecipes = (recipeResults) => {
  //   this.setState({ plantTypes: recipeResults })
  // }
  //
  // setChambers = (chamberResults) => {
  //   this.setState({ chamberOptions: chamberResults })
  // }
  //
  // setClimates = (climateResults) => {
  //   this.setState({ climates: climateResults});
  // }
  //
  // handlePlantRadioClick = e => {
  //   console.log(`handlePlantRadioClick: ${e.target.labels[0].innerText}`);
  //   this.setState({ selectedPlant: e.target.labels[0].innerText });
  //   this.handleNewPlantSelection(e);
  // };
  //
  // handleChamberRadioClick = e => {
  //   console.log(`handleChamberRadio: ${e.target.labels[0].innerText}`);
  //   this.setState({
  //     selectedChamber: e.target.labels[0].innerText
  //   });
  //   console.log('handel form shoudl have chamber state');
  // };
  //
  // handleNewPlantSelection = e => {
  //   console.log('handleNewPlantSelection new grow');
  //   const tempPlant = e.target.labels[0].innerText;
  //   const currentPlantType = pickBy(this.state.plantTypes, plant => plant.shortname === tempPlant);
  //   this.setState({ newGrowPlant: currentPlantType });
  // };
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

    this.setState({ isLoading: true });

    try {
      await this.createGarden({
        chamberId: this.state.selectedChamber,
        plantName: this.state.selectedPlant,
        climateId: '2',
        plantRecipeId: '2',
        createdAt: new Date()
      });
      this.props.history.push("/monitor");
    } catch(e) {
      console.log(e);
      this.setState({isLoading:false})
    }

    // window.location = `/plants/${this.state.selectedPlant}`;
    // const response = {};
    // response.chamber_id = this.state.chamberId;
    // response.plant_recipe_id = this.state.newGrowPlant.r_id;
    // response.climate_id = this.state.newGrowPlant.climate_id;
    // response.device_id = 1;
    // response.user_id = 1;
    //
    // postNewGrowingPlant(response);
  };

  renderPlantGroup() {
    const { plantTypes } = this.state;
    // debugger
    return ( plantTypes.map((plant) =>
      <Radio
        name={plant}
        key={plant}
        className={`link ${plant}`}
        onChange={this.handlePLantChange}
      >
        {plant}
      </Radio>)
    )
  }

  renderChambers() {
    const { chamberOptions } = this.state;
    return ( chamberOptions.map((chamber) =>
      <Radio
        name={chamber}
        key={chamber}
        className={`link ${chamber}`}
        onChange={this.handleChamberChange}
      >
        {chamber}
      </Radio>)
    )
  }

  render() {
    console.log('render new grow');
    // console.log(`plantTypes: ${this.state.plantTypes}`);
    // console.log(`chambers: ${this.state.chamberOptions}`);
// debugger
    return (
      <div className="newGrow container">
      {/* this.state.isLoading &&
        <form className="new_grow_form">
          {this.state.selectedPlant === '' && (
            <div className="selectedPlant">
              <h3>Select A Plant</h3>
              <h3>OR</h3>
              <h3>Customize Your Own Settings</h3>
              <PlantFormGroup options={this.state.plantTypes} onClick={this.handlePlantRadioClick} />
            </div>
          )}
          {this.state.selectedPlant === 'customize' &&
            this.state.selectedChamber === '' && <CustomizeSensors {...this.props} />}
          { this.state.selectedChamber === '' &&
            this.state.selectedPlant !== '' &&
            this.state.showDirections === false && (
              <div className="chamberOptions">
                <div className="chamberImage">
                  <ChamberFormGroup options={this.state.chamberOptions} onClick={this.handleChamberRadioClick} />
                </div>
                <h3 id="chamber" className="directions Futura-Lig">
                  Select A Chamber
                </h3>
                */}
        <PagerBack className="grow" />
        <PagerFwd className="grow" />
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="plant">
            {this.renderPlantGroup()}
          </FormGroup>
        <div className="chamberImage">
        <FormGroup controlId="chambers">
          <ControlLabel>Chamber</ControlLabel>
          {this.renderChambers()}
        </FormGroup>
        </div>
      <LoaderButton
        block
        bsStyle="primary"
        bsSize="large"
        className='sumbit-garden'
        disabled={!this.validateForm()}
        type="submit"
        isLoading={this.state.isLoading}
        text="Create"
        loadingText="Creating…"
      />
    </form>

        {/* this.state.selectedChamber !== '' &&
          this.state.selectedPlant !== '' &&
          this.state.isBalanced === false && (
            <Directions
              newGrowPlant={this.state.newGrowPlant}
              climates={this.state.climates}
              handleClick={this.updatePhBalance}
              isBalanced={this.state.isBalanced}
              selectedChamber={this.state.selectedChamber}
              // onClick={this.showPlantingDirections}
            />
          )}

        {this.state.showDirections === true && (
          <PlantingDirections
            newGrowPlant={this.state.newGrowPlant}
            climates={this.state.climates}
            isBalanced={this.state.isBalanced}
            selectedChamber={this.state.selectedChamber}
            handleClick={this.submitGrowChange}
          />
        ) */}
      </div>
    );
  }
}

export default NewGrow;
