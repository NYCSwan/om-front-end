import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import config from './../../config';
import LoaderButton from "../components/LoaderButton.react";
import styles from '../../styling/login.css';
// import button from '../../styling/buttons.css';

class Login extends Component {
  static propTypes = {
    userHasAuthenticated: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired
  }
  state = {
    isloading: false,
    email: '',
    password: ''
  };

  login = (email, password) => {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authenticationData = { Username: email, Password: password };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) =>
      user.authenticateUser(authenticationDetails, {
        onSuccess: result => resolve(), // eslint-disable-line
        onFailure: err => reject(err)
      })
    );
  };

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    // debugger
    event.preventDefault();

    this.setState({
      [event.target.type]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isloading: true });

    try {
      await this.login(this.state.email, this.state.password);
      console.log('Logged in');
      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      console.log(e);
      this.setState({ isloading: false });
    }
  };

  render() {
    return (
      <div className={styles.Login}>
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <div className={styles.email}>
            <label>Email:  </label>
            <input
              autofocus
              type="email"
              value={this.state.email} onChange={this.handleChange} />
          </div>
          <div className={styles.password}>
            <label>Password:  </label>
            <input
              autofocus
              value={this.state.password} onChange={this.handleChange} type="password" />
          </div>
          <LoaderButton
            block
            disabled={!this.validateForm()}
            type="submit"
            isloading={this.state.isloading}
            text="Login"
            loadingtext="Logging in…"
          />
        </form>
      </div>
    );
  }
}

export default Login;
