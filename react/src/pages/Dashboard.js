import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Dashboard extends Component {
  render() {
    return (
      <React.Fragment>
        Dashboard<Link to="/workflow">click me!</Link>
      </React.Fragment>
    );
  }
}
