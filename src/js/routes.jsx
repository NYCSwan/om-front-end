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
import PlantContainer from './plants/plant_container.react';
import PlantList from './plants/plant_list.react';
import Monitor from './monitor/monitor.react';
import Sensor from './monitor/sensor.react';
import Progress from './monitor/progress.react';

const Routes = (props) => (
  <Switch>
    <Route path="/" exact component={Homepage} {...props} />
    <Route {...props} path='/login' render={(routeProps) => { // eslint-disable-line
        return <Login
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }}
    />
    <Route {...props} path="/signup" render={(routeProps) => { // eslint-disable-line
        return <Signup
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }}
    />
    <Route {...props} path='/monitor' exact render={(routeProps) => { // eslint-disable-line
        return <Monitor
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }}
    />
    <Route path='monitor/progress' exact render={(routeProps) => { // eslint-disable-line
        return <Progress
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }}
    />
    <Route path='monitor/:sensor_id' exact render={(routeProps) => { // eslint-disable-line
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
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps}  /> }}
    />
    <Route {...props} path='/controls/ExistingGrow' exact render={(routeProps) => { // eslint-disable-line
        return <ExistingGrow
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }}
    />
    <Route {...props} path='/tutorials' render={(routeProps) => { // eslint-disable-line
        return <Tutorials
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }}
    />
    <Route {...props} path='/plants' exact render={(routeProps) => { // eslint-disable-line
        return <PlantList
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }}
    />
    <Route path='plants/:plant_id' exact render={(routeProps) => { // eslint-disable-line
        return <PlantContainer
          isAuthenticated={props.isAuthenticated} userHasAuthenticated={props.userHasAuthenticated}
          {...routeProps} /> }} />
    <Route component={NotFound} />
  </Switch>
);

Routes.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    userHasAuthenticated: PropTypes.func.isRequired
};

export default Routes;
