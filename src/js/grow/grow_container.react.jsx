import React from 'react';
import { Button } from 'react-bootstrap';

const GrowContainer = () => (
  <div className="grow links container">
    <Button bsStyle="primary" bsSize="large" className="homepage link Futura-Lig" href='/controls/NewGrow'>
      New Grow
    </Button>
    <Button
      bsStyle="primary"
      bsSize="large"
      className="homepage link Futura-Lig"
      href='/controls/ExistingGrow'
    >
      Existing Grow
    </Button>
    <Button bsStyle="primary" bsSize="large" className="homepage link Futura-Lig" href="/Tutorials">
      Tutorials
    </Button>
  </div>
);

export default GrowContainer;
