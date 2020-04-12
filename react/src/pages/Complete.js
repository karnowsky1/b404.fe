import React, { Component } from 'react'
import { Card, Button } from 'antd'
import { TOKEN_KEY } from '../constants/auth';
// import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { axiosError } from '../utils/axiosError';

var displayData = {};
var displayWorkflow = {};
//var workflow = {};

export default class Complete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{"stepID":167,"orderNumber":1,"subtitle":"Test description 2","parentStepID":166,"uuid":"a99063fd-4322-4514-a380-c4da46abc7ab","title":4,"fileID":68,"workflowID":12,"asynchronous":false,"completed":false,"expanded":false,"children":[]}, {"stepID":234,"orderNumber":1,"subtitle":"Test description 2","parentStepID":166,"uuid":"a99063fd-4322-4514-a380-c4da46abc7ab","title":4,"fileID":68,"workflowID":12,"asynchronous":false,"completed":false,"expanded":false,"children":[]}],
      user: {},
      workflow: {
        "workflowID": 12,
        "name": "B6",
        "description": "Test",
        "createdDate": "Apr 11, 2020 00:00:00",
        "lastUpdatedDate": "Apr 12, 2020 00:00:00",
        "startDate": "Jan 20, 2000 00:00:00",
        "deliveryDate": "Jan 20, 2000 00:00:00",
        "completedDate": null,
        "archived": false,
        "milestoneID": 1,
        "company": {
            "companyID": 2,
            "companyName": "Rochester Institute of Technology"
        },
        "percentComplete": 0.0,
        "steps": [
            {
                "stepID": 165,
                "orderNumber": 1,
                "subtitle": "Test description 0",
                "parentStepID": 0,
                "uuid": null,
                "title": 3,
                "fileID": 0,
                "workflowID": 12,
                "asynchronous": false,
                "completed": false,
                "expanded": true,
                "children": [
                    {
                        "stepID": 166,
                        "orderNumber": 1,
                        "subtitle": "Test description 1",
                        "parentStepID": 165,
                        "uuid": null,
                        "title": 3,
                        "fileID": 0,
                        "workflowID": 12,
                        "asynchronous": false,
                        "completed": false,
                        "expanded": true,
                        "children": [
                            {
                                "stepID": 167,
                                "orderNumber": 1,
                                "subtitle": "Test description 2",
                                "parentStepID": 166,
                                "uuid": "a99063fd-4322-4514-a380-c4da46abc7ab",
                                "title": 4,
                                "fileID": 68,
                                "workflowID": 12,
                                "asynchronous": false,
                                "completed": false,
                                "expanded": false,
                                "children": []
                            },
                            {
                                "stepID": 168,
                                "orderNumber": 2,
                                "subtitle": "Test description 3",
                                "parentStepID": 166,
                                "uuid": "a99063fd-4322-4514-a380-c4da46abc7ab",
                                "title": 2,
                                "fileID": 29,
                                "workflowID": 12,
                                "asynchronous": false,
                                "completed": false,
                                "expanded": false,
                                "children": []
                            }
                        ]
                    }
                ]
            }
        ]
    },
      completeStep: {},
    }
  }

  componentDidMount() {
    this.getApprovalDescription();
    this.getWorkflow();
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

  getWorkflow() {
    displayWorkflow = this.state.workflow;
    console.log(displayWorkflow);
    const url = window.__env__.API_URL + '/blink/api/workflow/' + displayData.workflowID;
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
            workflow: response.data
          })
          this.filterStep(response.data);
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
          completeStep: element
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
      <Card title="Complete">
        {Object.keys(displayWorkflow).map(key => 
        <h4 key={key} value={key}>{key.toUpperCase() + ': ' + displayWorkflow[key]}</h4>
        )}
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
