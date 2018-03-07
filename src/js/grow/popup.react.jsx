import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/fontawesome-free-solid';

import styles from '../../styling/popup.css';

fontawesome.library.add(faWindowClose);

class PopUp extends Component {
  static propTypes = {
    displayModal: PropTypes.bool.isRequired,
    modalTitle: PropTypes.string.isRequired,
    modalBody: PropTypes.element.isRequired,
    buttonText: PropTypes.string.isRequired,
    // onClick: PropTypes.func.isRequired,
    openModal: PropTypes.bool.isRequired,
    handleClick: PropTypes.func.isRequired
    // showModal: PropTypes.func.isRequired
  };

  state = {
    openModal: this.props.openModal
  };

  // componentWillMount() {
  //   this.props.openModal();
  // }

  shouldComponentUpdate(newProps, newState) {
    console.log('shouldComponentUpdate existing grow');
    return this.props.openModal !== newProps.openModal || this.props.displayModal !== newProps.displayModal;
  }

  close = () => {
    console.log('close popup');
    this.props.handleClick();
    this.setState({ openModal: false });
  };

  // open = () => {
  //   console.log('open popup');
  //   this.props.handleModalClick();
  //   this.setState({ openModal: true });
  // };

  render() {
    console.log('render popup');
    const { displayModal, modalBody, modalTitle, buttonText } = this.props;
    // const { openModal } = this.state;
    return (
      <div>
      { displayModal && (
      <div
        className={styles.modalContainer}
        onClick={this.close}>
        <div
          className={styles.modal}>
          <table>
            <thead className={styles.header}>
              <tr>
                <th>
                  <FontAwesomeIcon
                    icon="window-close"
                    pull="right"
                    className={styles.close}
                    onClick={this.close} />
                </th>
              </tr>
              <tr>
                <th className={styles.title}>{modalTitle}</th>
              </tr>
            </thead>
              { modalBody }
            <tfoot>
              <tr>
                <td>
                  <button
                    className={styles.buttonSubmitChange}
                    onClick={this.close}>
                  {buttonText}
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      )}
    </div>
    );
  }
}

export default PopUp;
