import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GrowContainer from '../grow/grow_container.react';

class ControlSettings extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
      path: PropTypes.string
    }).isRequired,
    setTitle: PropTypes.func.isRequired
  };

  state = {
    showGrowOptions: true
  };

  componentDidMount() {
    this.props.setTitle('Controls Dash');
  }

  shouldComponentUpdate(newState) {
    return this.state.showGrowOptions !== newState.showGrowOptions || this.state.showMonitor !== newState.showMonitor;
  }

  render() {
    // debugger
    return (
      <div>
      { this.state.showGrowOptions === true
        ? <GrowContainer {...this.props} />
        : null
      }
      </div>
    )
  }
}

export default ControlSettings;
