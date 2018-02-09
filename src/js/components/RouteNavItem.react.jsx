import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { NavItem } from 'react-bootstrap';

const RouteNavItem = props => (
  <Route
    path={props.href}
    exact
    children={({ match, history }) =>
      <NavItem
        onClick={e => history.push(e.currentTarget.getAttribute("href"))}
        {...props}
        active={match}>
          {props.children}
      </NavItem>
    }
  />
);

RouteNavItem.propTypes = {
  children: PropTypes.func.isRequired,
  href: PropTypes.string.isRequired
}

export default RouteNavItem;
