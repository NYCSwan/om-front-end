import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Radio } from 'react-bootstrap';

class PlantFormGroup extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    onClick: PropTypes.func.isRequired
  };

  componentWillReceiveProps({ onClick }) {
    console.log('componentWillReceiveProps form group');
    if (onClick !== this.props.onClick) {
      this.handleClick();
    }
  }

  handleClick = e => {
    console.log('handle click form group');
    this.props.onClick(e);
  };

  render() {
    console.log('render form_group');
    const radioBtns = this.props.options.map(value => { // eslint-disable-line
      return (
        <Radio
          name={`radioGroup${value.shortname}`}
          key={value.shortname}
          className={`link ${value.shortname}`}
          onChange={this.handleClick}
        >
          {value.shortname}
        </Radio>
      );
    });

    return <FormGroup>{radioBtns}</FormGroup>;
  }
}

export default PlantFormGroup;
