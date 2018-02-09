import React from 'react';
import { Button } from 'react-bootstrap';
import './homepage.css';

const Homepage = () => (
  <div>
    <div>
      <p> Notifications would appear here. </p>
      <div className="monitorOrGrow container">
        <Button bsStyle="primary" className="homepage link Futura-Lig" href="/monitor">
          Monitor Your Garden
        </Button>
        <Button bsStyle="primary" className="homepage link Futura-Lig" href="/controls">
          Grow Something
        </Button>
      </div>
    </div>
  </div>
);

export default Homepage;
