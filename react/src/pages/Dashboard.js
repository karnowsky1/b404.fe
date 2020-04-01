import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Dash from '../components/dashboard/dashboard';

export default class Dashboard extends Component {
  render() {
    return (
      <React.Fragment>
        <Link to="/workflow">click me!</Link>
        <Dash />
      </React.Fragment>
    );
  }
}
