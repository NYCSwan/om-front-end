import React, { Component } from "react";
import PropTypes from 'prop-types';

import { AuthenticationDetails, CognitoUserPool } from "amazon-cognito-identity-js";
import config from "./../../config";
import LoaderButton from "../components/LoaderButton.react";
import styles from '../../styling/signup.css';

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
    event.preventDefault();

    this.setState({
      [event.target.id]: event.target.value
    });
    // debugger
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isloading: true });

    debugger
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
    // debugger
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <fieldset id="confirmationCode" className={styles.field}>
          <label>Confirmation Code</label>
          <input
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
          />
          <h2 className={styles.helpblock}>Please check your email for the code.</h2>
        </fieldset>
        <LoaderButton
          block
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isloading={this.state.isloading}
          text="Verify"
          loadingtext="Verifying…"
        />
      </form>
    );
  }


  renderForm = () => { // eslint-disable-line
    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset className={styles.field}>
          <label>Email:</label>
          <input
            autoFocus
            type="email"
            id="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </fieldset>
        <fieldset className={styles.field}>
        <label>Oasis Mini Serial Number:</label>
        <input
          value={this.state.deviceId}
          onChange={this.handleChange}
          type="text"
          id="deviceId"
        />
        </fieldset>
        <fieldset className={styles.field}>
          <label>Password:</label>
          <input
            value={this.state.password}
            onChange={this.handleChange}
            type="password"
            id="password"
          />
        </fieldset>
        <fieldset className={styles.field}>
          <label>Confirm Password:</label>
          <input
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            type="password"
            id="confirmPassword"
          />
        </fieldset>
        <LoaderButton
          block
          disabled={!this.validateForm()}
          type="submit"
          isloading={this.state.isloading}
          text="Signup"
          loadingtext="Signing up…"
        />
      </form>
    )
  }

  render() {
    return (
      <div className={styles.Signup}>
        <h2>Sign Up</h2>
        {this.state.newUser === null

          ? this.renderForm()
          : this.renderConfirmationForm()
        }
      </div>
    )
  }
}
