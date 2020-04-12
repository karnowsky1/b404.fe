import React, { Component } from 'react'
import { Card, Button } from 'antd'
import { TOKEN_KEY } from '../constants/auth';
// import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { axiosError } from '../utils/axiosError';

//var displayData = {};

export default class Complete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      user: {},
      completeStep: {},
    }
  }

  componentDidMount() {
    this.fetch();
    this.filterStep(this.state.data); 
  }

  fetch = (params = {}) => {
    axios({
      method: 'get',
      url: window.__env__.API_URL + '/blink/api/workflow/pending',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(TOKEN_KEY)
      },
      response: {
        results: 4,
        params
      },
      type: 'json'
    })
      .then(response => {
        this.setState({
          data: response.data
        })
        this.filterStep(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  }; 

  getApprovalDescription() {
    const url = window.__env__.API_URL + '/blink/api/workflow/pending';
    axios
      .get(url, null, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(TOKEN_KEY)
        }
      })
      .then(response => {
        if (response.status === 200) {
          console.log(response);
          this.setState({
            data: response.data
          })
          this.filterStep(response.data);
          console.log(this.state.file);
        }
      })
      .catch(axiosError);
  }

  getUser() {
    const url = window.__env__.API_URL + '/blink/api/person/id/' + this.state.completeStep.uuid;
    axios
      .get(url, null, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(TOKEN_KEY)
        }
      })
      .then(response => {
        if (response.status === 200) {
          console.log(response);
          this.setState({
            data: response.data
          })
          this.filterStep(response.data);
          console.log(this.state.data);
        }
      })
      .catch(axiosError);
  }

  filterStep = (array) => {
    array.forEach(element => {
      if (element.stepID.toString() === localStorage.getItem('stepId')) {
        this.setState({
          completeStep: element
        })
        //displayData = element;
      }
    });
  }

  markStepComplete() {
    const url =
      window.__env__.API_URL +
      '/blink/api/workflow/step/complete?id=' +
      localStorage.getItem('stepId');
    axios
      .put(url, null, {
        headers: {
          Authorization: localStorage.getItem(TOKEN_KEY)
        }
      })
      .then(response => {
        if (response.status === 200) {
          window.location.href = '/dashboard';
        }
      })
      .catch(axiosError);
  }

  render() {
    return (
      <React.Fragment>
      <Card title="Complete">
        <h4>{"DESCRIPTION: " + this.state.completeStep.subtitle}</h4>
      </Card>
      <div className="approveButton">
        <Button type="primary" onClick={this.markStepComplete}>
          Complete
        </Button>
      </div>
      </React.Fragment>
    )
  }
}
