import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Button } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { IndexLinkContainer } from 'react-router-bootstrap';
// import image from './BG_1.jpg';

// import RouteNavItem from './components/RouteNavItem.react';
import PagerBack from './js/layout/pagerBack.react';
import PagerFwd from './js/layout/pagerFwd.react';
import Routes from './js/routes';
import { authUser, signOutUser } from "./libs/awsLibs";
import styles from './styling/app.css';
// import GlobalStyles from './styling/global-styles.css';
import logo from './media/logo.png';
import Footer from './js/layout/footer.react';

// const style = {
//   backgroundImage: 'url('+image+')'
// }

class App extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired
    // match: PropTypes.shape({
    //   path: PropTypes.string
    // }).isRequired
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
    // const { match } = this.props;
    // debugger
    return (
      <div className={styles.app}>
      { !this.state.isAuthenticating &&
        <div>
        <nav className={styles.navbar}>
          <div className={styles.topNav}>
            <Link to="/" href="/" className={styles.logo}>
              <img src={logo} className={styles.brandLogo} alt='Aeroasis Logo' />
            </Link>
            <ul
              onSelect={this.handleSelect}
              className={styles.navbarCollapse}>
              <input
                type='checkbox'
                id='collapse'
                className={styles.collapse} />
                <label
                  htmlFor='collapse' className={styles.label}></label>
                  <IndexLinkContainer
                    to='/monitor'
                    key={'monitor'} className={styles.indexLinkContainer}>
                    <li
                      className={styles.navItem}>
                      Monitor
                    </li>
                  </IndexLinkContainer>
                  <IndexLinkContainer
                    to='/monitor/progress'
                    key={'progress'} className={styles.indexLinkContainer}>
                    <li
                      className={styles.navItem}>
                      Progress
                    </li>
                  </IndexLinkContainer>
                  <IndexLinkContainer
                    to='/controls' 
                    key={'controls'}
                    className={styles.indexLinkContainer}>
                    <li
                      className={styles.navItem}>
                      Controls
                    </li>
                  </IndexLinkContainer>
                  <IndexLinkContainer
                    to='/'
                    key={'userAccount'}
                    className={styles.indexLinkContainer}>
                    <li
                      className={styles.navItem}>
                      My Account
                    </li>
                  </IndexLinkContainer>
                  <IndexLinkContainer
                    to='/'
                    key={'support'}
                    className={styles.indexLinkContainer}>
                    <li
                      className={styles.navItem}>
                    Support</li>
                  </IndexLinkContainer>
              </ul>
            </div>
            <div className={styles.logging}>
              {this.state.isAuthenticated
                ?
                <button className={styles.logout} onClick={this.handleLogout}>Logout</button>
                : [
                    <Link to='/signup' key={'signup'}>
                      Signup
                    </Link>,
                    <Link to='/login' key={'login'}>
                      Login
                    </Link>
                  ]
              }
            </div>
          </nav>
          <Routes
            isAuthenticated={this.state.isAuthenticated}
            userHasAuthenticated={this.userHasAuthenticated} />
        </div>
      }
        <PagerBack className={styles.header} />
        <PagerFwd className={styles.header} />
        <Footer />
      </div>
    );
  }
}
export default withRouter(App);
