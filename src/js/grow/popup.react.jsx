import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import styles from '../../styling/popup.css';

class PopUp extends Component {
  static propTypes = {
    displayModal: PropTypes.bool.isRequired,
    modalTitle: PropTypes.string.isRequired,
    modalBody: PropTypes.element.isRequired,
    buttonText1: PropTypes.string.isRequired,
    buttonText2: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired
  };

  state = {
    showModal: this.props.displayModal
  };

  shouldComponentUpdate(newProps, newState) {
    console.log('shouldComponentUpdate existing grow');
    return this.state.showModal !== newState.showModal || this.props.displayModal !== newProps.displayModal;
  }

  componentDidUpdate() {
    console.log('componentDidUpdate popup');
    // this.updateModalDisplay(nextProps, nextState);
  }

  updateModalDisplay = (nextProps, nextState) => {
    console.log('update modal display');
    console.log(nextProps, nextState);
    // debugger
    this.setState({ showModal: !this.state.showModal });
  };

  close = () => {
    console.log('close popup');
    this.setState({ showModal: false });
  };

  open = () => {
    console.log('open popup');
    this.setState({ showModal: true });
    this.props.handleClick();
  };

  render() {
    console.log('render popup');
    const { modalBody, modalTitle, buttonText1, buttonText2 } = this.props;
    // console.log(!this.state.showModal);
    // debugger
    return (
      <div className={styles.modalContainer}>
        <button
          className={styles.buttonSubmitChamber}
          onClick={this.open}
          disabled={this.props.displayModal}
        >
          {buttonText1}
        </button>
        <Modal
          show={this.state.showModal}
          onHide={this.close}
          className={styles.modal}>
          <Modal.Header closeButton>
            <Modal.Title className={styles.title}>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            {modalBody}
            <button
              className={styles.buttonSubmitChange}
              onClick={this.close}>
              {buttonText2}
            </button>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default PopUp;
