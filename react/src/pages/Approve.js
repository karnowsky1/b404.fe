import React, { Component } from 'react'
import { Card, Button } from 'antd'
import { TOKEN_KEY } from '../constants/auth';
// import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { axiosError } from '../utils/axiosError';

var displayData = {};

export default class Approve extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{"stepID":167,"orderNumber":1,"subtitle":"Test description 2","parentStepID":166,"uuid":"a99063fd-4322-4514-a380-c4da46abc7ab","title":4,"fileID":68,"workflowID":12,"asynchronous":false,"completed":false,"expanded":false,"children":[]}, {"stepID":234,"orderNumber":1,"subtitle":"Test description 2","parentStepID":166,"uuid":"a99063fd-4322-4514-a380-c4da46abc7ab","title":4,"fileID":68,"workflowID":12,"asynchronous":false,"completed":false,"expanded":false,"children":[]}],
      user: {},
      approveStep: {},
    }
  }

  componentDidMount() {
    this.getApprovalDescription();
    this.filterStep(this.state.data);
  }

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
            data: [response.data]
          })
          this.filterStep(response.data);
          console.log(this.state.file);
        }
      })
      .catch(axiosError);
  }

  getUser() {
    const url = window.__env__.API_URL + '/blink/api/person/id/' + displayData.uuid;
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
          approveStep: element
        })
        displayData = element;
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
      <Card title="Approve">
        {Object.keys(displayData).map(key => 
        <h4 key={key} value={key}>{key.toUpperCase() + ': ' + displayData[key]}</h4>
        )}
      </Card>
      <div className="approveButton">
        <Button type="primary" onClick={this.markStepComplete}>
          Approve
        </Button>
      </div>
      </React.Fragment>
    )
  }
}
