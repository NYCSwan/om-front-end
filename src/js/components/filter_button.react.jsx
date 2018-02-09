import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { ButtonGroup, Button } from 'react-bootstrap';

class FilterButtonGroup extends Component {
  static propTypes = {
    chamberId: PropTypes.number.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func.isRequired
    // filledChambers: PropTypes.arrayOf(PropTypes.object).isRequired
  };
  handleClick = e => {
    console.log(`handle filter click: ${e.target}`);
    this.props.onChange(e);
  };

  render() {
    console.log('render filter buttons');
    return (
      <ButtonGroup
        justified
        type="radio"
        name="filterById"
        className="filterById filter flex-row row"
        options={this.props.options}
        onChange={this.props.onChange}
        sm={12}
        md={12}
        lg={12}
      >
        {this.props.options.map(option => { // eslint-disable-line

          return (
            // eslint-disable-line
            <Button
              key={option.c_id}
              value={option.name}
              className={`chamber-${option.c_id}`}
              checked={this.props.chamberId === option.c_id}
              onClick={this.handleClick}
              disabled={option.filled}
            >
              {option.name}
            </Button>
          );
        })}
      </ButtonGroup>
    );
  }
}

export default FilterButtonGroup;
