import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import NewGrow from './grow/new_grow.react';
import ExistingGrow from './grow/existing_grow.react';
import ControlSettings from './controls/control_settings.react';
import Homepage from './homepage/Homepage.react';
import Tutorials from './tutorials.react';
import Login from './login/login.react';
import NotFound from './helpers/not_found.react';
import Signup from './login/signup.react';
import PlantDetails from './plants/plant_details.react';
import PlantList from './plants/plant_list.react';
import Monitor from './monitor/monitor.react';
import Sensor from './monitor/sensors/sensor.react';
import Progress from './monitor/timelapse/progress.react';

const Routes = (props) => (
  <Switch>
    <Route path="/" exact component={Homepage} {...props} />
    <Route {...props} path='/login' exact render={(routeProps) => { // eslint-disable-line
        return <Login
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }}
    />
    <Route {...props} path="/signup" exact render={(routeProps) => { // eslint-disable-line
        return <Signup
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }}
    />
    <Route {...props} path='/monitor' exact render={(routeProps) => { // eslint-disable-line
        return <Monitor
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }}
    />
    <Route {...props} path='/monitor/progress' exact render={(routeProps) => { // eslint-disable-line
        return <Progress
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }}
    />
    <Route {...props} path='/monitor/:sensor_id' exact render={(routeProps) => { // eslint-disable-line
        return <Sensor
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }}
    />
    <Route {...props} path="/controls" exact render={(routeProps) => { // eslint-disable-line
       return <ControlSettings
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }}
    />
    <Route {...props} path='/controls/NewGrow' exact render={(routeProps) => { // eslint-disable-line
        return <NewGrow
          openModal={props.openModal}
          showModal={props.showModal}
          handleModalClick={props.handleModalClick}
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps}  /> }}
    />
    <Route {...props} path='/controls/ExistingGrow' exact render={(routeProps) => { // eslint-disable-line
        return <ExistingGrow
          openModal={props.openModal}
          showModal={props.showModal}
          handleModalClick={props.handleModalClick}
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }}
    />
    <Route {...props} path='/tutorials' exact render={(routeProps) => { // eslint-disable-line
        return <Tutorials
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }}
    />
    <Route {...props} path='/plants' exact render={(routeProps) => { // eslint-disable-line
        return <PlantList
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }}
    />
    <Route path='/plants/:plant_name' exact render={(routeProps) => { // eslint-disable-line
        return <PlantDetails
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }} />
    <Route component={NotFound} />
  </Switch>
);

Routes.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    userHasAuthenticated: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    openModal: PropTypes.bool.isRequired,
    handleModalClick: PropTypes.func.isRequired
};

export default Routes;
