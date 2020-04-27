import React from 'react';
import { Table, Button, Divider, Modal, Spin } from 'antd';
import axios from 'axios';
import { AssignModal } from '../assignModal';
import { AssignPeople } from '../assignModal';
import WorkflowBuilder from '../../wf-builder/workflowBuilder';
import {
  TOKEN_KEY,
  DEFAULT_TREE,
  FETCH_REFRESH_TIME,
} from '../../../constants';
import qs from 'qs';
import { axiosError } from '../../../utils/axiosError';
import { showDeleteConfirmUtil } from '../../../utils/showDeleteConfirmUtil';

let currentComponent;

const { confirm } = Modal;

const defaultWorkflow = {
  name: '',
  description: '',
  steps: [DEFAULT_TREE],
};

class ActiveWorkflows extends React.Component {
  constructor(props) {
    super(props);
    this.showModalDefault = this.showModalDefault.bind(this);
    this.getWorkflows = this.getWorkflows.bind(this);
    this.state = {
      workflow: null,
      data: [],
      loading: true,
      visible: false,
      isNew: false,
      companyVisible: false,
      companyOptions: [],
      personVisible: false,
      personOptions: [],
      personDocuments: [],
    };
    this.columns = [
      { title: 'Type', dataIndex: 'name', key: 'name' },
      { title: 'Description', dataIndex: 'description', key: 'description' },
      {
        title: 'Action',
        dataIndex: this.state.data,
        key: 'x',
        render: (workflow) => (
          <React.Fragment>
            <Button
              type="link"
              size="small"
              onClick={(e) => this.showModal(workflow)}
            >
              Update
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              onClick={(e) => this.showDeleteConfirm(e, workflow.workflowID)}
            >
              Delete
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              onClick={(e) => this.showArchiveConfirm(e, workflow.workflowID)}
            >
              Archive
            </Button>
          </React.Fragment>
        ),
      },
    ];
  }

  getWorkflows() {
    const url = window.__env__.API_URL + '/blink/api/workflow/active';
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(TOKEN_KEY),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            loading: false,
          });
          this.setState({
            data: response.data,
          });
        }
      })
      .catch(function (error) {
        console.error(error);
        currentComponent.setState({
          loading: false,
        });
        axiosError(error);
      });
  }

  componentDidMount() {
    currentComponent = this;
    this.setState({
      loading: true,
    });
    this.getWorkflows();
    this.getAllCompanies();
    this.getAllPeople();
    this.intervalID = setInterval(() => {
      this.getWorkflows();
      this.getAllCompanies();
      this.getAllPeople();
    }, FETCH_REFRESH_TIME);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  showCompanyModal = (workflow) => {
    this.setState({
      workflow: workflow,
      companyVisible: true,
    });
  };

  handleCompanyOk = (e) => {
    this.setState({
      companyVisible: false,
    });
  };

  handleCompanyCancel = (e) => {
    this.setState({
      companyVisible: false,
    });
  };

  showPersonModal = () => {
    this.setState({
      companyVisible: false,
      personVisible: true,
    });
  };

  handlePersonOk = (e) => {
    this.setState({
      personVisible: false,
    });
  };

  handlePersonCancel = (e) => {
    this.setState({
      personVisible: false,
    });
  };

  getAllCompanies() {
    axios
      .get(window.__env__.API_URL + '/blink/api/company', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
      .then((response) => {
        this.setState({
          companyOptions: response.data.map((company) => {
            return {
              value: company.companyID,
              label: company.companyName,
            };
          }),
        });
      })
      .catch(function (error) {});
  }

  getAllPeople() {
    axios
      .get(window.__env__.API_URL + '/blink/api/person', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
      .then((response) => {
        this.setState({
          personOptions: response.data.map((person) => {
            return {
              value: person.uuid,
              label: person.fName + ' ' + person.lName,
            };
          }),
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getAllDocuments() {}

  showModal = (workflow) => {
    this.setState({
      workflow: workflow,
      isNew: false,
      visible: true,
    });
  };

  showModalDefault() {
    this.setState({
      workflow: defaultWorkflow,
      isNew: true,
      visible: true,
    });
  }

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      workflow: null,
      visible: false,
    });
  };

  showDeleteConfirm = (e, id) => {
    const { getWorkflows } = this;
    showDeleteConfirmUtil(id, 'workflow', 'workflows', getWorkflows);
  };

  showArchiveConfirm = (e, id) => {
    confirm({
      title: 'Are you sure you want to archive this Workflow?',
      content: 'If you archive this Workflow it will go to the archived tab!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios
          .put(
            window.__env__.API_URL + '/blink/api/workflow/archive',
            qs.stringify({
              id,
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: localStorage.getItem('token'),
              },
            }
          )
          .then((response) => {
            if (response.status === 200) {
              window.location.reload(false);
            } else {
            }
          });
      },
      onCancel() {},
    });
  };

  render() {
    return (
      <React.Fragment>
        <Spin spinning={this.state.loading}>
          <Table
            columns={this.columns}
            expandedRowRender={(record) => (
              <p style={{ margin: 0 }}>Created: {record.createdDate}</p>
            )}
            dataSource={this.state.data}
            rowKey={(record) => record.workflowID}
          />
        </Spin>
        {this.state.companyVisible && (
          <AssignModal
            workflow={this.state.workflow}
            companies={this.state.companyOptions}
            onCancel={this.handleCompanyCancel}
            title="Assign Modal"
            onOk={this.showPersonModal}
          />
        )}
        {this.state.personVisible && (
          <AssignPeople
            workflow={this.state.workflow}
            person={this.state.personOptions}
            documents={this.state.personDocuments}
            visible={this.state.visible}
            onCancel={this.handlePersonCancel}
            title="Assign Modal"
            onOk={this.handlePersonOk}
          />
        )}
        <Modal
          bodyStyle={{ height: '81vh' }}
          title={
            this.state.isNew
              ? 'Create a new workflow template'
              : 'Edit Active Workflow'
          }
          width="75vw"
          footer={null}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <WorkflowBuilder
            workflow={this.state.workflow}
            isConcreteWorkflow={!this.state.isNew}
            updateWorkflow={true}
            onCancel={this.handleCancel}
          />
        </Modal>
      </React.Fragment>
    );
  }
}
export default ActiveWorkflows;
