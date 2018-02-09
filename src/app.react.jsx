import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { IndexLinkContainer } from 'react-router-bootstrap';

// import RouteNavItem from './components/RouteNavItem.react';
import PagerBack from './js/layout/pagerBack.react';
import Routes from './js/routes';
import { authUser, signOutUser } from "./libs/awsLibs";
import './app.css';

class App extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired,
    match: PropTypes.shape({
      path: PropTypes.string
    }).isRequired
  };

  state = {
    isAuthenticated: false,
    isAuthenticating: true
  }

  async componentDidMount() {
    try {
      if (await authUser()) {
        // debugger
        this.userHasAuthenticated(true);
      }
    } catch(e) {
      console.log(e);
    }
    this.authenticating();
    // this.setState({ isAuthenticating: false, });
  }

  shouldComponentUpdate(newState, newProps) {
    return this.state.isAuthenticated !== newState.isAuthenticated || this.props.match !== newProps.match;
  }

  userHasAuthenticated = (authenticated) => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleSelect = eventKey => {
    console.log(`selected ${eventKey}`);
  }

  handleLogout = ( event ) => {
    console.log(`handle logout ${event}`);
    signOutUser();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");

  }

  authenticating = () => {
    this.setState({ isAuthenticating: false });
  }

  render() {
    const { match } = this.props;

    // debugger
    return (
      <div>
      { !this.state.isAuthenticating &&
        <div>
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
              <IndexLinkContainer to='/monitor' key={'monitor'}>
                <NavItem className="navItem" eventKey={3}>
                  Monitor
                </NavItem>
              </IndexLinkContainer>
              <IndexLinkContainer to='/controls' key={'controls'}>
                <NavItem className="navItem" eventKey={4}>
                  Controls
                </NavItem>
              </IndexLinkContainer>
              <IndexLinkContainer to='/' key={'userAccount'}>
                <NavItem className="navItem" eventKey={1}>
                  My Account
                </NavItem>
              </IndexLinkContainer>
              <IndexLinkContainer to='/' key={'support'}>
                <NavItem className="navItem" eventKey={2}>
                Support</NavItem>
              </IndexLinkContainer>
            </Nav>
          </Navbar.Collapse>
          <h1 className="title Futura-Lig">title</h1>
          <Nav pullRight>
          {this.state.isAuthenticated
            ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
            : [
              <IndexLinkContainer to='/signup' key={'signup'}>
                <NavItem eventKey={5}>
                  Signup
                </NavItem>
              </IndexLinkContainer>,
              <IndexLinkContainer to='/login' key={'login'}>
                <NavItem eventKey={6}>
                  Login
                </NavItem>
              </IndexLinkContainer>
              ]}
            </Nav>
          </Navbar>
          <Routes
            isAuthenticated={this.state.isAuthenticated}
            userHasAuthenticated={this.userHasAuthenticated} />
        </div>
      }
      </div>
    );
  }
}
export default withRouter(App);
