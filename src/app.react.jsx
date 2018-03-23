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
import PagerBack from './js/layout/pagerBack.react';
import PageTitle from './js/components/pageTitle.react';

fontawesome.library.add(faAlignJustify);

class App extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired
  };

  state = {
    isAuthenticated: false,
    isAuthenticating: true,
    openHamburger: false,
    openModal: false,
    pageTitle: ''
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

  handlePageTitleChange = (newTitle) => {
    console.log('handle pageTitle change');
    this.setState({ pageTitle: newTitle });
  }

  handleModalClick = () => {
    console.log('handle modal change');
    this.setState({ openModal: !this.state.openModal });
  }

  handleBackClick = (e) => {
    window.onpopstate = (e) => {
        this.props.history.go(0);
    }
  }

  authenticating = () => {
    this.setState({ isAuthenticating: false });
  }

  render() {
    const { pageTitle } = this.state;

    return (
      <div className={styles.app}>
      { (!this.state.isAuthenticating && !this.state.openModal) &&
        <div className={styles.navWithRoutes}>
        <nav className={styles.navbar}>
        <div className={styles.topNavNarrow}>
          <PagerBack
            handleClick={this.handleBackClick} />
          <PageTitle pageTitle={pageTitle} />
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
                    className={styles.narrowIndexLinkContainer}
                    onClick={this.handleSelect}>
                    <li
                      className={styles.navItem}>
                      Dashboard
                    </li>
                  </IndexLinkContainer>
                  <IndexLinkContainer
                    to='/monitor/progress'
                    key={'progress'}
                    onClick={this.handleSelect}
                    className={styles.narrowIndexLinkContainer}>
                    <li
                      className={styles.navItem}>
                      Progress
                    </li>
                  </IndexLinkContainer>
                  <IndexLinkContainer
                    to='/controls'
                    key={'controls'}
                    className={styles.narrowIndexLinkContainer}
                    onClick={this.handleSelect}>
                    <li
                      className={styles.navItem}>
                      Controls
                    </li>
                  </IndexLinkContainer>
                  <IndexLinkContainer
                    to='/plants'
                    key={'plants'}
                    className={styles.narrowIndexLinkContainer}
                    onClick={this.handleSelect}>
                    <li
                      className={styles.navItem}>
                      Plant Reference
                    </li>
                  </IndexLinkContainer>
                  <IndexLinkContainer
                    to='/'
                    key={'userAccount'}
                    className={styles.narrowIndexLinkContainer}
                    onClick={this.handleSelect}>
                    <li
                      className={styles.navItem}>
                      My Account
                    </li>
                  </IndexLinkContainer>
                  <IndexLinkContainer
                    to='/'
                    key={'support'}
                    className={styles.narrowIndexLinkContainer}
                    onClick={this.handleSelect}>
                    <li
                      className={styles.navItem}>
                    Support</li>
                  </IndexLinkContainer>
                  {this.state.isAuthenticated
                    ?
                    <div
                      className={styles.narrowIndexLinkContainer}>
                      <li
                        className={styles.navItem}
                        onClick={this.handleLogout}
                      >Logout</li>
                    </div>
                    :
                    [
                      <IndexLinkContainer
                        className={styles.narrowIndexLinkContainer}
                        to='/signup'
                        key={'signup'}>
                        <li
                          className={styles.navItem}>
                          Signup</li>
                      </IndexLinkContainer> ,
                      <IndexLinkContainer
                        className={styles.narrowIndexLinkContainer} to='/login' key={'login'}>
                        <li
                          className={styles.navItem}>
                          Login</li>
                      </IndexLinkContainer>
                    ]
                  }
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
          <div className={styles.topNavWide}>
            <PageTitle pageTitle={pageTitle} />
            <IndexLinkContainer
              to='/monitor'
              key={'monitor'} className={styles.indexLinkContainer}>
              <li
                className={styles.navItem}>
                Dashboard
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
              key={'support'}
              className={styles.indexLinkContainer}>
              <li
                className={styles.navItem}>
                Support</li>
            </IndexLinkContainer>
            <IndexLinkContainer
              to='/plants'
              key={'plants'}
              className={styles.indexLinkContainer}
              onClick={this.handleSelect}>
              <li
                className={styles.navItem}>
                Plant Reference
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
          </div>

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
              showModal={this.showModal}
              setTitle={this.handlePageTitleChange} />
            <Footer />
          </div>
      }
      </div>
    );
  }
}
export default withRouter(App);
