import React from 'react';
import { shallow } from 'enzyme';
import Monitor from '../monitor.react';
import './../helpers/enzyme_setup';

test('Monitor renders correctly', () => {
  const component = shallow(<Monitor />);
  expect(component).toMatchSnapshot();
});
