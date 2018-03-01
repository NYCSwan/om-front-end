import React, { Component } from "react";
import PropTypes from 'prop-types';
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import { AuthenticationDetails, CognitoUserPool } from "amazon-cognito-identity-js";
import config from "./../../config";
import LoaderButton from "../components/LoaderButton.react";
import styles from '../../styling/signup.css';
import button from '../../styling/buttons.css';
export default class Signup extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired,
    userHasAuthenticated: PropTypes.func.isRequired
  }

  state = {
    isloading: false,
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
    deviceId: "",
    newUser: null
  };


  validateForm = () => { // eslint-disable-line
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm = () => { // eslint-disable-line
    return this.state.confirmationCode.length > 0;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isloading: true });

      try {
        const newUser = await this.signup(this.state.email, this.state.password);
        this.setState({ newUser });
      } catch (e) {
        console.log(e);
      }
      this.setState({ isloading: false });
  }

  handleConfirmationSubmit = async event => {
    event.preventDefault();

    this.setState({ isloading: true });

      try {
        await this.confirm(this.state.newUser, this.state.confirmationCode);
        await this.authenticate(
          this.state.newUser,
          this.state.email,
          this.state.password
        );

        this.props.userHasAuthenticated(true);
        this.props.history.push("/");
      } catch (e) {
        console.log(e);
        this.setState({ isloading: false });
      }
    }

  signup = (email, password) => {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });

    return new Promise((resolve, reject) =>
      userPool.signUp(email, password, [], null, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.user);
        })
    )
  }

  confirm = (user, confirmationCode) => { // eslint-disable-line
    return new Promise((resolve, reject) =>
      user.confirmRegistration(confirmationCode, true, function(err, result) { // eslint-disable-line
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      })
    );
  }

  authenticate = (user, email, password) => {
    const authenticationData = {
      Username: email,
      Password: password
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) => // eslint-disable-line
      user.authenticateUser(authenticationDetails, {
        onSuccess: result => resolve(), // eslint-disable-line
        onFailure: err => reject(err)
      })
    );
  }

  renderConfirmationForm = () => { // eslint-disable-line
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" className={button.large}>
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          className={button.large}
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isloading={this.state.isloading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    );
  }


  renderForm = () => { // eslint-disable-line
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="email" className={button.large}>
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="deviceId" className={button.large}>
        <ControlLabel>Oasis Mini Serial Number</ControlLabel>
        <FormControl
          value={this.state.deviceId}
          onChange={this.handleChange}
          type="text"
        />
        </FormGroup>
        <FormGroup controlId="password" className={button.large}>
          <ControlLabel>Password</ControlLabel>
          <FormControl
            value={this.state.password}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" className={button.large}>
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          block
          className={button.large}
          disabled={!this.validateForm()}
          type="submit"
          isloading={this.state.isloading}
          text="Signup"
          loadingText="Signing up…"
        />
      </form>
    )
  }

  render() {
    return (
      <div className={styles.Signup}>
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()
        }
      </div>
    )
  }
}
