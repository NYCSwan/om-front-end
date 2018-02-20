import React, { Component } from 'react';
import { form, FormGroup, Radio} from 'react-bootstrap';
import PropTypes from 'prop-types';
import pickBy from 'lodash/pickBy';
import { invokeApig } from "../../libs/awsLibs";
import LoaderButton from './../components/LoaderButton.react';
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
        // const climateResults = await this.getClimates();
        debugger
        this.setState({chamberOptions: chamberResults});
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

  setRecipes = (recipeResults) => {
    this.setState({ plantTypes: recipeResults })
  }

  setChambers = (chamberResults) => {
    this.setState({ chamberOptions: chamberResults })
  }
  //
  // setClimates = (climateResults) => {
  //   this.setState({ climates: climateResults});
  // }

  handlePlantRadioClick = e => {
    console.log(`handlePlantRadioClick: ${e.target.labels[0].innerText}`);
    this.setState({ selectedPlant: e.target.labels[0].innerText });
    this.handleNewPlantSelection(e);
  };

  handleChamberRadioClick = e => {
    console.log(`handleChamberRadio: ${e.target.labels[0].innerText}`);
    this.setState({
      selectedChamber: e.target.labels[0].innerText
    });
    console.log('handel form shoudl have chamber state');
  };

  handleNewPlantSelection = e => {
    console.log('handleNewPlantSelection new grow');
    const tempPlant = e.target.labels[0].innerText;
    const currentPlantType = pickBy(this.state.plantTypes, plant => plant.shortname === tempPlant);
    this.setState({ newGrowPlant: currentPlantType });
  };
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
        name={plant.plantName}
        key={plant.plantName}
        className={styles.plant.plantName}
        onChange={this.handlePLantChange}
      >
        {plant.plantName}
      </Radio>)
    )
  }

  renderChambers() {
    const { chamberOptions } = this.state;
    return ( chamberOptions.map((chamber) =>
      <Radio
        name={chamber}
        key={chamber}
        className={chamber}
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
      {/* this.state.isloading &&
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
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="plant">
            {this.renderPlantGroup()}
          </FormGroup>

      <LoaderButton
        className='sumbit-garden'
        disabled={!this.validateForm()}
        type="submit"
        isloading={this.state.isloading}
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
