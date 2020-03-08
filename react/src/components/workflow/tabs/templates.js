import React from 'react';
import { Table, Button, Divider, Modal, Spin, message } from 'antd';
import axios from 'axios';
import { AssignModal } from '../assignModal';
import { AssignPeople } from '../assignModal';
import WorkflowBuilder from '../../wf-builder/workflowBuilder';
import { TOKEN_KEY/*, UUID_KEY*/ } from '../../../constants/auth'

class Templates extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      workflow: null,
      data: [],
      loading: true,
      companyVisible: false,
      companyOptions: [],
      personVisible: false,
      personOptions: [],
      personDocuments: []
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
            <Button type="link" size="small" onClick={e => this.showModal(workflow)}>
              Update
            </Button>
            <Divider type="vertical" />
            <Button type="link" size="small">
              Delete
            </Button>
          </React.Fragment>
        )
      }
    ];
  }

  getWorkflows() {
    const url = window.__env__.API_URL + '/blink/api/workflow/templates';
        axios.get(
        url,
        {
            headers: {
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem(TOKEN_KEY)
            }
        }
        ).then(response => {
        if (response.status === 200){
            this.setState({
              loading: false
            });
            console.log(response);
            this.setState({
              data: response.data
            });
        }
        }).catch(function (error) {
        this.setState({
          loading: false
        });
        message.destroy()
        if (error.response) {
            // Request made and server responded
            message.error(error.response.data.error);
        } else if (error.request) {
            // The request was made but no response was received
            message.error("Server not responding");
        } else {
            // Something happened in setting up the request that triggered an Error
            message.error("Error setting up request");
        }
        });
  }

  componentDidMount() {
    this.setState({
      loading: true
    });
    this.getWorkflows();
    this.getAllCompanies();
    this.getAllPeople();
  }

  showCompanyModal = (workflow) => {
    console.log(workflow);
    this.setState({
      workflow: workflow,
      companyVisible: true
    });
  };

  handleCompanyOk = e => {
    console.log(e);
    this.setState({
      companyVisible: false
    });
  };

  handleCompanyCancel = e => {
    console.log(e);
    this.setState({
      companyVisible: false
    });
  };

  showPersonModal = () => {
    this.setState({
      companyVisible: false,
      personVisible: true
    });
  };

  handlePersonOk = e => {
    console.log(e);
    this.setState({
      personVisible: false
    });
  };

  handlePersonCancel = e => {
    console.log(e);
    this.setState({
      personVisible: false
    });
  };

  getAllCompanies() {
    axios
      .get(window.__env__.API_URL + '/blink/api/company', {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then(response => {
        this.setState({
          companyOptions: response.data.map(company => {
            return {
              value: company.companyID,
              label: company.companyName
            };
          })
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  getAllPeople() {
    axios
      .get(window.__env__.API_URL + '/blink/api/person', {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then(response => {
        this.setState({
          personOptions: response.data.map(person => {
            return {
              value: person.uuid,
              label: person.fName + ' ' + person.lName
            };
          })
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  getAllDocuments() {}

  showModal = (workflow) => {
    this.setState({
      workflow: workflow,
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
    this.fetch();
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      workflow: null,
      visible: false
    });
  };

  render() {
    //const { visible, loading } = this.state;
    const workflow = this.state.workflow;
    return (
      <React.Fragment>
        <Spin spinning={this.state.loading}>
        <Table
          columns={this.columns}
          expandedRowRender={record => (
            <p style={{ margin: 0 }}>Created: {record.createdDate}</p>
          )}
          dataSource={this.state.data}
          rowKey={record => record.workflowID}
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
            onCancel={this.handlePersonCancel}
            title="Assign Modal"
            onOk={this.handlePersonOk}
          />
        )}
        <Button type="primary" onClick={this.showModal}>
          + Create
        </Button>
        <Modal
          bodyStyle={{ height: '81vh' }}
          title="Create your workflow template"
          width="75vw"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <WorkflowBuilder workflow={workflow}/>
        </Modal>
      </React.Fragment>
    );
  }
}
export default Templates;
