import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import findKey from 'lodash/findKey';
// import findLastIndex from 'lodash/findLastIndex';
// import isEmpty from 'lodash/isEmpty';
// import forIn from 'lodash/forIn';
// import pickBy from 'lodash/pickBy';
import { ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import styles from '../../styling/monitor.css';
import FilterButtonGroup from '../components/filter_button.react';
import { invokeApig } from '../../libs/awsLibs';

class Monitor extends Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string
    }).isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };

  state = {
    chamberId: 1,
    chamberData: [],
    growingPlants: [],
    chambers: [],
    isLoading: true
  };

  async componentDidMount() {
    console.log('componentDidMount monitor');
    try {
      const results = await this.growingPlants();
      this.setState({growingPlants: results});
      const chamberResults = await this.getAllChamberData();
      this.setChambers(chamberResults);
      // debugger
      // const sensorResults = await this.getSensorMeasurementData();
      // this.setSensorData(sensorResults);
    } catch(e) {
      console.log(e);
    }
    this.setState({ isLoading: false });
  }

  // shouldComponentUpdate(newState) {
  //   console.log('shouldComponentUpdate monitor');
  //   return (  // eslint-disable-line
  //     this.state.chamberId !== newState.chamberId ||
  //     this.state.chamberData !== newState.chamberData ||
  //     this.state.growingPlants !== newState.growingPlants
  //   );
  // }

  // componentDidUpdate(newState) {
  //   console.log('componentDidUpdate monitor');
  //   if (this.state.chamberId !== newState.chamberId) {
  //     this.getSensorMeasurementData();
  //   }
  //   if (this.state.growingPlants !== newState.growingPlants) {
  //     this.getGrowingPlantsData();
  //   }
  // }

  // getGrowingPlantsData = () => {
  //   console.log('get growing plant data- sensor measurement data');
  //
  //   getGrowingPlants().then(plants => {
  //     this.setState({ growingPlants: plants });
  //   });
  // };

  getAllChamberData() {
    console.log('get chamber info');
    return invokeApig({ path: '/chambers' });
  };

  getSensorMeasurementData = () => {
    console.log('get sensor measurents by chamber id');
    // debugger
      return invokeApig({ path: `/sensorData` })
  };


  setGrowingPlants = (growingResults) => {
    console.log('set growing plants in state');
    this.setState({ growingPlants: growingResults });
  }

  setChambers = (chamberResults) => {
    console.log('set chambers in state');

    this.setState({ chambers: chamberResults });
  }

  setSensorData = (sensorResults) => {
    console.log('set sensor data in state');

    this.setState({ chamberData: sensorResults });
  }

  growingPlants() {
    console.log('get growing plants from db');
    return invokeApig({ path: "/gardens" });  // eslint-disable-line
  }

  handleChamberIdChange = newChamber => {
    console.log('handleChamberIdChange');
    console.log(newChamber);
    let tempChamber = '';
    if (newChamber != null) {
      tempChamber = newChamber.target.value;
      this.setState(
        {
          chamberId: tempChamber
        },
        () => console.log(`chamberId ${this.state.chamberId}`)
      );
    }
  };
  renderLander = () => {
    return (
      <div className={styles.lander}>
        <h3>It doesnt look like you have started a garden yet!</h3>
        <Button className={styles.newGrow}><b>{"\uFF0B"}</b> Start a new Garden</Button>
      </div>
    )
  }
// should render sensor data
  // renderChambersList(chambers) {
  //   console.log(chambers);
  //   return [{}].concat(chambers).map(
  //     (chamber, i) =>
  //       i > 0
  //         ? <ListGroupItem
  //             key={chamber.chamberId}
  //             href={`/chambers/${chamber.chamberId}`}
  //             onClick={this.handleNoteClick}
  //             header={chamber.chamberName}
  //             className={styles.groupItem}
  //           >
  //             {"Created: " + new Date(chamber.createdAt).toLocaleString()}
  //           </ListGroupItem>
  //         : <ListGroupItem
  //             key="new"
  //             href="/controls/NewGrow"
  //             onClick={this.handleChamberClick}
  //             className={styles.groupItem}
  //           >
  //             <Button className={styles.newGrow}>
  //               Start a new Garden
  //             </Button>
  //           </ListGroupItem>
  //   );
  // }

  handleGardenClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderChambers() {
   return (
       <ListGroup className={styles.listGroup}>
         {!this.state.isLoading && this.renderChambersList(this.state.chambers)}
       </ListGroup>
   );
 }

  render() {
    console.log('render monitor');
    const { chambers, chamberId} = this.state;
    // const currentPlantDataByChamber = [];

    // forIn(chamberData, reading => {
    //   if (reading.chamber_id === chamberId) {
    //     currentPlantDataByChamber.push(reading);
    //   }
    //   return currentPlantDataByChamber;
    // });

    // const phReadingIdx = findLastIndex(currentPlantDataByChamber, data => data.sensor_id === 3);
    // const ppmReadingIdx = findLastIndex(currentPlantDataByChamber, data => data.sensor_id === 4);
    // const temperatureReadingIdx = findLastIndex(currentPlantDataByChamber, data => data.sensor_id === 2);
    // const humidityReadingIdx = findLastIndex(currentPlantDataByChamber, data => data.sensor_id === 1);
    // //
    // const currentPlantInfo = pickBy(growingPlants, plant => plant.chamber_id === chamberId);
    // const plantKey = findKey(currentPlantInfo);
    // const now = new Date().getTime();
    // let dayOfCycle = 1;

    // if (isEmpty(currentPlantInfo) === false) {
    //   const startedOn = Date.parse(currentPlantInfo[plantKey].started_datetime);
    //   dayOfCycle = new Date(now - startedOn).getDate();
    // }

    return (
      <div className={styles.monitor}>
        <FilterButtonGroup
          onChange={this.handleChamberIdChange}
          chamberId={chamberId}
          options={chambers}
          className={styles.filterByChambersNav}
        />
        {this.props.isAuthenticated && this.renderLander()
        }
        {JSON.stringify(this.state.growingPlants)}
        {/*this.state.chamberData.length >= 1 ? (
          <Row className={styles.readings}>
            <Col className={styles.bubblePh>
              <a href={`${this.props.match.path}/ph`}>
                <h2 className={button.xBigFont} key={currentPlantDataByChamber[phReadingIdx].time}>
                  {currentPlantDataByChamber[phReadingIdx].value}
                </h2>
                <h4>pH</h4>
              </a>
            </Col>
            <Col className={styles.bubbleEmpty} />
            <Col className={styles.bubblePpm}>
              <a href={`${this.props.match.path}/ppm`}>
                <h2 className="xBigFont">{currentPlantDataByChamber[ppmReadingIdx].value}</h2>
                <h4>PPM</h4>
              </a>
            </Col>
            <Col className={styles.bubbleTemperature}>
              <a href={`${this.props.match.path}/temperature`}>
                <h2 className={styles.xBigFont}>{currentPlantDataByChamber[temperatureReadingIdx].value}*</h2>
                <h4>F</h4>
              </a>
            </Col>
            <Col className={styles.bubbleEmpty} />
            <Col className={styles.bubbleEmpty} />
            <Col className={styles.bubbleHumidity}>
              <a href={`${this.props.match.path}/humidity`}>
                <h2 className={styles.xBigFont}>{currentPlantDataByChamber[humidityReadingIdx].value}%</h2>
                <h4>RH</h4>
              </a>
            </Col>
            <Col className={styles.bubbleDayOfCycle}>
              <h4 className={styles.xBigFont}>Day {dayOfCycle}</h4>
            </Col>
          </Row>
        ) : (
          <div>
            <h2>Sorry. You are not growing anything in this chamber right now.</h2>
            <a href="/controls/NewGrow" alt="grow something in this chamber">
              <Button>Start New Garden</Button>
            </a>
          </div>
        ) */}
      </div>
    );
  }
}

export default Monitor;
