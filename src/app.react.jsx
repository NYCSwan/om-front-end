import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { IndexLinkContainer } from 'react-router-bootstrap';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faAlignJustify } from '@fortawesome/fontawesome-free-solid';

import Routes from './js/routes';
import { authUser, signOutUser } from "./libs/awsLibs";
import styles from './styling/app.css';
import logo from './media/logo.png';
import Footer from './js/layout/footer.react';

fontawesome.library.add(faAlignJustify);

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
    isAuthenticating: true,
    openHamburger: false,
    openModal: false
  }

  async componentDidMount() {
    try {
      if (await authUser()) {
        this.userHasAuthenticated(true);
      }
    } catch(e) {
      console.log(e);
    }
    this.authenticating();
  }

  shouldComponentUpdate(newState, newProps) {
    return this.state.isAuthenticated !== newState.isAuthenticated || this.props.match !== newProps.match;
  }

  userHasAuthenticated = (authenticated) => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleSelect = () => {
    console.log(`handle hamburger toggle`);
    this.setState({ openHamburger: !this.state.openHamburger });
  }

  handleLogout = ( event ) => {
    console.log(`handle logout ${event}`);
    signOutUser();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  showModal = () => {
    this.setState({ openModal: true });
  }

  handleModalClick = () => {
    console.log('handle modal change');
    this.setState({ openModal: !this.state.openModal });
  }

  authenticating = () => {
    this.setState({ isAuthenticating: false });
  }

  render() {

    return (
      <div className={styles.app}>
      { (!this.state.isAuthenticating && !this.state.openModal) &&
        <div className={styles.navWithRoutes}>
        <nav className={styles.navbar}>
          <div className={styles.topNavWide}>
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
          </div>
          <div className={styles.topNavNarrow}>
            <FontAwesomeIcon
              icon="align-justify"
              pull="right"
              className={styles.hamburger}
              onClick={this.handleSelect} />
              { this.state.openHamburger === true
                ?
              <ul
                onSelect={this.handleSelect}
                className={styles.navbarCollapse}>
                    <IndexLinkContainer
                      to='/monitor'
                      key={'monitor'}
                      className={styles.indexLinkContainer}
                      onClick={this.handleSelect}>
                      <li
                        className={styles.navItem}>
                        Monitor
                      </li>
                    </IndexLinkContainer>
                    <IndexLinkContainer
                      to='/monitor/progress'
                      key={'progress'}
                      onClick={this.handleSelect}
                      className={styles.indexLinkContainer}>
                      <li
                        className={styles.navItem}>
                        Progress
                      </li>
                    </IndexLinkContainer>
                    <IndexLinkContainer
                      to='/controls'
                      key={'controls'}
                      className={styles.indexLinkContainer}
                      onClick={this.handleSelect}>
                      <li
                        className={styles.navItem}>
                        Controls
                      </li>
                    </IndexLinkContainer>
                    <IndexLinkContainer
                      to='/'
                      key={'userAccount'}
                      className={styles.indexLinkContainer}
                      onClick={this.handleSelect}>
                      <li
                        className={styles.navItem}>
                        My Account
                      </li>
                    </IndexLinkContainer>
                    <IndexLinkContainer
                      to='/'
                      key={'support'}
                      className={styles.indxLinkContSel}
                      onClick={this.handleSelect}>
                      <li
                        className={styles.navItem}>
                      Support</li>
                    </IndexLinkContainer>
              </ul>
              :
              null
            }
          </div>
          { !this.state.openHamburger &&
            <Link to="/" href="/" className={styles.logo}>
              <img src={logo} className={styles.brandLogo} alt='Aeroasis Logo' />
            </Link>
          }
              <div className={styles.logging}>
                {this.state.isAuthenticated
                  ?
                  <button className={styles.logout} onClick={this.handleLogout}>Logout</button>
                  : [
                      <Link className={styles.signup} to='/signup' key={'signup'}>
                        Signup
                      </Link>,
                      <Link className={styles.login} to='/login' key={'login'}>
                        Login
                      </Link>
                    ]
                }
              </div>
            </nav>
          </div>
        }
        { (!this.state.isAuthenticating && !this.state.openHamburger) &&
          <div>
            <Routes
              isAuthenticated={this.state.isAuthenticated}
              userHasAuthenticated={this.userHasAuthenticated}
              openModal={this.state.openModal}
              handleModalClick={this.handleModalClick}
              showModal={this.showModal} />
            <Footer />
          </div>
      }
      </div>
    );
  }
}
export default withRouter(App);
