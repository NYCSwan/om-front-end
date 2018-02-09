import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

class PopUp extends Component {
  static propTypes = {
    displayModal: PropTypes.bool.isRequired,
    modalTitle: PropTypes.string.isRequired,
    modalBody: PropTypes.element.isRequired,
    buttonText1: PropTypes.string.isRequired,
    buttonText2: PropTypes.string.isRequired
    // handleClick: PropTypes.func.isRequired
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
    // debugger
    this.setState({ showModal: false });
  };

  open = () => {
    console.log('open popup');
    this.setState({ showModal: true });
  };

  render() {
    console.log('render popup');
    const { modalBody, modalTitle, buttonText1, buttonText2 } = this.props;
    // console.log(!this.state.showModal);
    // debugger
    return (
      <div className="modal-container">
        <Button
          bsStyle="primary"
          bsSize="large"
          className={`${buttonText1} center-block`}
          onClick={this.open}
          disabled={this.state.showModal}
        >
          {buttonText1}
        </Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalBody}
            <Button className={`close ${buttonText2}`} onClick={this.close}>
              {buttonText2}
            </Button>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default PopUp;
