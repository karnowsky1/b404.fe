import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import {
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath
} from 'react-sortable-tree';
import { axiosError } from '../../utils/axiosError';
import { WorkflowDateRange } from '../../utils/WorkflowDateRange';
import { Button, Input, Select, message, Switch } from 'antd';
import 'react-sortable-tree/style.css';
//import qs from 'qs';
import axios from 'axios';
import {
  TOKEN_KEY,
  DEFAULT_TREE,
  ASSIGN_DEFAULT_TREE,
  SEND_DATE_FORMAT,
  RECEIVE_DATE_FORMAT
} from '../../constants';
import {
  getVerbs,
  getFileByMilestone,
  getPeopleByCompany,
  getMilestone
} from '../../utils/api';
import moment from 'moment';

const { Option } = Select;

export default class WorkflowBuilder extends Component {
  constructor(props) {
    super(props);
    this.updateTreeData = this.updateTreeData.bind(this);
    this.addNode = this.addNewNode.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getAllVerbs = this.getAllVerbs.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.setTreeData = this.setTreeData.bind(this);
    this.setWorkflowData = this.setWorkflowData.bind(this);
    message.config({
      maxCount: 1
    });

    this.state = {
      workflowID: 0,
      wfName: '',
      wfDescription: '',
      visible: false,
      loading: false,
      startDate: undefined,
      deliveryDate: undefined,
      defaultRange: undefined,
      verbs: [],
      people: [],
      files: [],
      milestoneID: '',
      defaultTree: this.props.isConcreteWorkflow
        ? [ASSIGN_DEFAULT_TREE]
        : [DEFAULT_TREE],
      treeData: this.props.isConcreteWorkflow
        ? [ASSIGN_DEFAULT_TREE]
        : [DEFAULT_TREE]
    };
  }

  componentDidMount() {
    console.log(this.state.defaultTree);
    this.getAllVerbs();
    console.log('this is the milestone ID');
    console.log(this.props.workflow.milestoneID);
    var milestoneID = '';
    console.log('this is the milestone ID from props');
    console.log(this.props.milestoneID);
    this.props.isConcreteWorkflow && this.props.updateWorkflow
      ? (milestoneID = this.props.workflow.milestoneID)
      : (milestoneID = this.props.milestoneID);

    console.log('this is the milestoneID im looking for ');
    console.log(milestoneID);
    console.log('this is the workflow im looking for ');
    console.log(this.props.workflow);
    this.props.workflow &&
      this.setState({
        workflow: this.props.workflow,
        milestoneID: milestoneID
      });
    this.props.isConcreteWorkflow && this.getAllPeople(milestoneID);
    this.props.isConcreteWorkflow && this.getAllFiles(milestoneID);

    this.props.workflow && this.setWorkflowData();
    console.log('this is the concrete workflow');
    console.log(this.props.workflow.steps);

    // have to move all this stuff in a fetch method?
    // recall that fetch method whenever the workflow is changed
  }

  // new parts of the tree (person | file) mapped to the workflow steps
  // if there's a step that doesn't require a file, it defaults to 0, can provide it or it defaults on the backend regardless
  // try to get that file, get empty blob, kind of like

  // template file has a workflowID of 0

  // have to pass in the workflow ID when routing the user to the submission page
  // either via localStorage or Redux, or sesion

  // hit the insertFile endpoint with the optional stepID to submit a new document like a dropbox

  getAllVerbs = async e => {
    await getVerbs()
      .then(response => {
        if (response.status === 200) {
          this.setState({
            verbs: response.data
          });
        }
      })
      .catch(axiosError);
  };

  getAllPeople = async milestoneID => {
    await getMilestone(milestoneID)
      .then(async response => {
        response.status === 200 &&
          (await getPeopleByCompany(response.data.company.companyID)
            .then(response => {
              response.status === 200 &&
                this.setState({ people: response.data });
            })
            .catch(axiosError));
      })
      .catch(axiosError);
  };

  getAllFiles = async milestoneID => {
    await getFileByMilestone(milestoneID)
      .then(response => {
        this.setState({
          files: response.data
        });
      })
      .catch(axiosError);
  };

  setWorkflowData() {
    this.setState({
      workflowID: this.props.workflow.workflowID,
      wfName: this.props.workflow.name,
      wfDescription: this.props.workflow.description,
      treeData: this.props.workflow.steps,
      startDate: this.props.workflow.startDate,
      deliveryDate: this.props.workflow.startDate
      // defaultRange: [
      //   moment('Jan 1, 2019 00:00:00', RECEIVE_DATE_FORMAT),
      //   moment('Feb 1, 2019 00:00:00', RECEIVE_DATE_FORMAT)
      // ]
    });
  }

  workflowConcreteStepConversion() {
    console.log(this.props.workflow.steps);
    const concreteWorkflow = this.props.workflow.steps.map(obj => ({
      ...obj,
      person: '',
      fileID: ''
    }));
    console.log('this is the concrete workflow');
    console.log(concreteWorkflow);
  }

  componentDidUpdate(prevProps) {
    if (this.props.workflow !== prevProps.workflow) {
      if (this.props.workflow !== null) {
        this.setWorkflowData();
      }
    }
  }

  handleSubmit = async e => {
    e.preventDefault();
    //const {wfName, username, password, fName, lName, email, title, accessLevelID} = this.state.user
    //const id = UUID
    const { onCancel } = this.props;
    const url = window.__env__.API_URL + '/blink/api/workflow/template';
    const concreteWorkflowUrl =
      window.__env__.API_URL + '/blink/api/workflow/concrete';

    console.log('this is the workflow ID');
    console.log(this.props.workflow);

    const requestObject = {
      workflowID: this.state.workflow.workflowID,
      name: this.state.wfName,
      description: this.state.wfDescription,
      steps: this.state.treeData,
      startDate: this.state.defaultRange[0].format(SEND_DATE_FORMAT),
      deliveryDate: this.state.defaultRange[1].format(SEND_DATE_FORMAT),
      milestoneID: this.state.milestoneID
    };
    console.log(requestObject);
    this.setState({ loading: true });

    if (this.props.isNew && !this.props.isConcreteWorkflow) {
      // new workflow template
      await axios
        .post(url, requestObject, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(TOKEN_KEY)
          }
        })
        .then(response => {
          //this.setState({ loading: true });
          if (response.status === 200) {
            this.successfulResponseSubmission();
            console.log('workflow template');
            console.log(requestObject);
          }
        })
        .catch(axiosError);
      onCancel();
    } else if (!this.props.isNew && !this.props.isConcreteWorkflow) {
      // updating an existing workflow template
      await axios
        .put(url, requestObject, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(TOKEN_KEY)
          }
        })
        .then(response => {
          if (response.status === 200) {
            this.successfulResponseSubmission();
          }
        })
        .catch(axiosError);
      onCancel();
    } else if (!this.props.updateWorkflow && this.props.isConcreteWorkflow) {
      // assigning/ creating a concrete workflow
      await axios
        .post(concreteWorkflowUrl, requestObject, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(TOKEN_KEY)
          }
        })
        .then(response => {
          //this.setState({ loading: true });
          if (response.status === 200) {
            this.successfulResponseSubmission();
          }
        })
        .catch(axiosError);
      onCancel();
    } else if (this.props.updateWorkflow && this.props.isConcreteWorkflow) {
      // updating a concrete workflow
      await axios
        .put(concreteWorkflowUrl, requestObject, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(TOKEN_KEY)
          }
        })
        .then(response => {
          //this.setState({ loading: true });
          if (response.status === 200) {
            this.successfulResponseSubmission();
          }
        })
        .catch(axiosError);
      onCancel();
    }
  };

  successfulResponseSubmission() {
    this.setState({ loading: false });
    message.success('Data saved successfully');
    window.location.reload(true);
  }

  addNewNode(rowInfo) {
    const NEW_NODE = {
      ...this.state.defaultTree,
      title: this.state.verbs[0].verbID
    };
    const newTree = addNodeUnderParent({
      treeData: this.state.treeData,
      newNode: NEW_NODE,
      expandParent: true,
      parentKey: rowInfo ? rowInfo.treeIndex : undefined,
      getNodeKey: ({ treeIndex }) => treeIndex
    });
    this.updateTreeData(newTree.treeData);
  }

  removeNode(rowInfo) {
    const { path } = rowInfo;
    const newTree = removeNodeAtPath({
      treeData: this.state.treeData,
      path,
      getNodeKey: ({ treeIndex }) => treeIndex
    });
    if (newTree.length !== 0) {
      this.updateTreeData(newTree);
    }
  }

  setTreeData(tree) {
    return {
      ...tree,
      title: tree.children && tree.children.length ? 0 : tree.title,
      children: tree.children ? tree.children.map(this.setTreeData) : []
    };
  }

  updateTreeData(treeData) {
    const newTrees = treeData.map(this.setTreeData);
    this.setState({ treeData: newTrees });
  }

  handleNameChange = e => {
    this.setState({
      wfName: e.target.value
    });
  };

  handleDescriptionChange = e => {
    this.setState({
      wfDescription: e.target.value
    });
  };

  handleDateChange = e => {
    // this.setState({
    //   defaultRange: e.target.value
    // });
    // console.log('This better fucking work');
    // console.log(e.target);
    // console.log(e.target.format(SEND_DATE_FORMAT));
    // console.log(e.target.value.dateStrings[0]);
    // console.log(e.target.value.dateStrings[1]);
  };

  render() {
    const getNodeKey = ({ treeIndex }) => treeIndex;
    const children = [];
    const people = [];
    const files = [];
    this.state.verbs.forEach(element => {
      children.push(<Option key={element.verbID}>{element.name}</Option>);
    });
    this.state.people.forEach(element => {
      people.push(
        <Option key={element.uuid}>{element.fName + element.lName}</Option>
      );
    });
    this.state.files.forEach(element => {
      files.push(<Option key={element.fileID}>{element.name}</Option>);
    });

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ display: 'flex', marginBottom: '30px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginRight: '35px'
            }}
          >
            <h6 className="wfInputText">Name: </h6>
            <Input
              value={this.state.wfName}
              onChange={this.handleNameChange}
              placeholder="Enter workflow name..."
            ></Input>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginRight: '35px'
            }}
          >
            <h6 className="wfInputText">Description: </h6>
            <Input
              value={this.state.wfDescription}
              onChange={this.handleDescriptionChange}
              placeholder="Enter description..."
            ></Input>
          </div>
          {this.props.isConcreteWorkflow && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginRight: '35px'
              }}
            >
              <h6 className="wfInputText"> {'Start & End Date:'} </h6>
              {console.log('this is the default range')}
              {console.log(this.state.defaultRange)}
              <WorkflowDateRange
                // startDate={startDate}
                // endDate={endDate}
                // setStartDate={setStartDate}
                // setEndDate={setEndDate}
                // failedSubmit={failedSubmit}
                // setFailedSubmit={setFailedSubmit}
                onChange={dates => {
                  this.setState({
                    defaultRange: dates
                  });
                  // setStartDate(date);
                }}
                defaultRange={this.state.defaultRange}
                format={SEND_DATE_FORMAT}
              />
            </div>
          )}
        </div>
        <SortableTree
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            paddingLeft: '5px'
          }}
          treeData={this.state.treeData}
          onChange={this.updateTreeData}
          generateNodeProps={rowInfo => ({
            title: (
              <div>
                <span>Verb: </span>
                <Select
                  value={rowInfo.node.title.toString()}
                  size="small"
                  disabled={
                    rowInfo.node.children && !!rowInfo.node.children.length
                  }
                  style={{ width: 120 }}
                  onChange={event => {
                    const { path } = rowInfo;
                    const title = parseInt(event);
                    this.setState(state => ({
                      treeData: changeNodeAtPath({
                        treeData: state.treeData,
                        path,
                        getNodeKey,
                        newNode: { ...rowInfo.node, title }
                      })
                    }));
                  }}
                >
                  {children}
                </Select>
              </div>
            ),
            subtitle: (
              <div>
                <span>Descr: </span>
                <Input
                  style={{
                    marginTop: '12px'
                  }}
                  placeholder="Enter a description"
                  value={rowInfo.node.subtitle}
                  size="small"
                  onChange={event => {
                    const { path } = rowInfo;
                    const subtitle = event.target.value;

                    this.setState(state => ({
                      treeData: changeNodeAtPath({
                        treeData: state.treeData,
                        path,
                        getNodeKey,
                        newNode: { ...rowInfo.node, subtitle }
                      })
                    }));
                  }}
                />
              </div>
            ),
            buttons: [
              <div style={{ display: 'flex' }}>
                {this.props.isConcreteWorkflow && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      paddingRight: '1em'
                    }}
                  >
                    <div>
                      <span>Person: </span>
                      <Select
                        value={
                          rowInfo.node.uuid && rowInfo.node.uuid.toString()
                        }
                        size="small"
                        placeholder="Select Person"
                        showSearch
                        // filterOption={(input, option) =>
                        //   option.children
                        //     .toLowerCase()
                        //     .indexOf(input.toLowerCase()) >= 0
                        // }
                        // add case sensitivity filtering later
                        disabled={
                          rowInfo.node.children &&
                          !!rowInfo.node.children.length
                        }
                        style={{ width: 160 }}
                        onChange={event => {
                          const { path } = rowInfo;
                          const uuid = event;
                          console.log('what is this parse int');
                          console.log(uuid);

                          this.setState(state => ({
                            treeData: changeNodeAtPath({
                              treeData: state.treeData,
                              path,
                              getNodeKey,
                              newNode: { ...rowInfo.node, uuid }
                            })
                          }));
                        }}
                      >
                        {people}
                      </Select>
                    </div>
                    <div>
                      <span>File: </span>
                      <Select
                        value={
                          rowInfo.node.fileID && rowInfo.node.fileID.toString()
                        }
                        size="small"
                        placeholder="Select File"
                        showSearch
                        disabled={
                          rowInfo.node.children &&
                          !!rowInfo.node.children.length
                        }
                        style={{ width: 160 }}
                        onChange={event => {
                          const { path } = rowInfo;
                          const fileID = parseInt(event);
                          this.setState(state => ({
                            treeData: changeNodeAtPath({
                              treeData: state.treeData,
                              path,
                              getNodeKey,
                              newNode: { ...rowInfo.node, fileID }
                            })
                          }));
                        }}
                      >
                        {files}
                      </Select>
                    </div>
                  </div>
                )}

                <Button
                  style={{ marginRight: 5 }}
                  label="Delete"
                  onClick={event => this.removeNode(rowInfo)}
                >
                  Remove
                </Button>
                <Button
                  label="Add"
                  onClick={event => this.addNewNode(rowInfo)}
                  style={{ marginRight: 5 }}
                >
                  Add
                </Button>
                <div>
                  <div>Asynchronous</div>
                  <Switch
                    checked={rowInfo.node.asynchronous}
                    disabled={
                      !(rowInfo.node.children && rowInfo.node.children.length)
                    }
                    onClick={checked => {
                      const { path } = rowInfo;

                      this.setState(state => ({
                        treeData: changeNodeAtPath({
                          treeData: state.treeData,
                          path,
                          getNodeKey,
                          newNode: {
                            ...rowInfo.node,
                            asynchronous: checked
                          }
                        })
                      }));
                    }}
                  />
                </div>
              </div>
            ],
            style: {
              height: '60px'
            }
          })}
        ></SortableTree>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '1rem'
          }}
        >
          <Button
            type="primary"
            loading={this.state.loading}
            label="submit"
            onClick={this.handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    );
  }
}
