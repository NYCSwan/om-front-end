import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import PagerBack from './pagerBack.react';

class SiteHeader extends Component {
  static propTypes = {
    auth: PropTypes.objectOf(PropTypes.object).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func,
      length: PropTypes.number,
      action: PropTypes.string,
      isAuthenticated: PropTypes.func
    }).isRequired,
    match: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  handleSelect = eventKey => {
    console.log(`selected ${eventKey}`);
  };

  goTo = route => {
    this.props.history.replace(`/${route}`);
  };

  login = () => {
    this.props.auth.login();
  };

  logout = () => {
    this.props.auth.logout();
  };

  render() {
    const { title, match } = this.props;
    const { isAuthenticated } = this.props.auth;
    // debugger;
    return (
      <Navbar inverse collapseOnSelect fluid className="container-fluid">
        <Navbar.Header>
          <Navbar.Brand className={`brandLogo ${match.path}`} id="navbarbrand">
            <Link to="/" href="/" className="logo img-responsive center-block" />
            <div className="backImage">
              <PagerBack className="header" />
            </div>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse className="bs-navbar-collapse">
          <Nav bsStyle="pills" pullRight onSelect={this.handleSelect}>
            <NavItem className="navItem" EventKey={3} href="/monitor">
              Monitor
            </NavItem>
            <NavItem className="navItem" eventKey={4} href="/controls">
              Controls
            </NavItem>
            <NavItem className="navItem" eventKey={1} href="#">
              My Account
            </NavItem>
            <NavItem className="navItem" eventKey={2} href="#">
              Support
            </NavItem>
          </Nav>
        </Navbar.Collapse>
        <Nav>
          <h1 className="title Futura-Lig">{title}</h1>
          {!isAuthenticated() && (
            <Button id="qsLoginBtn" bsStyle="primary" className="btn-margin" onClick={this.login}>
              Log In
            </Button>
          )}
          {isAuthenticated() && (
            <Button id="qsLogoutBtn" bsStyle="primary" className="btn-margin" onClick={this.logout}>
              Log Out
            </Button>
          )}
        </Nav>
      </Navbar>
    );
  }
}

SiteHeader.propTypes = {
  title: PropTypes.string.isRequired,
  match: PropTypes.shape({
    params: PropTypes.object,
    path: PropTypes.string
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func
  }).isRequired,
  auth: PropTypes.shape({
    login: PropTypes.func,
    logout: PropTypes.func,
    isAuthenticated: PropTypes.func
  }).isRequired
};

export default SiteHeader;
