import React from "react";
import { Table, Button, Divider, Modal } from "antd";
import axios from "axios";
import { AssignModal } from "../assignModal";
import { AssignPeople } from "../assignModal";
import WorkflowBuilder from '../../wf-builder/workflowBuilder';

const data = [
  {
    key: 1,
    name: "a1",
    age: 32,
    description:
      "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park."
  },
  {
    key: 2,
    name: "qt3",
    age: 42,
    description:
      "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park."
  },
  {
    key: 3,
    name: "wf7",
    age: 32,
    description:
      "My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park."
  }
];

class Templates extends React.Component {
  state = {
    data: [],
    loading: true,
    companyVisible: false,
    companyOptions: [],
    personVisible: false,
    personOptions: [],
    personDocuments: []
  };

  constructor(props) {
    super(props);
    this.columns = [
      { title: "Type", dataIndex: "name", key: "name" },
      { title: "Description", dataIndex: "description", key: "description" },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: () => (
          <React.Fragment>
            <Button
              type="link"
              size="small"
              onClick={e => this.showCompanyModal()}
            >
              Assign
            </Button>
            <Divider type="vertical" />
            <Button type="link" size="small">
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

  /*
  fetch = (params = {}) => {
    axios({
      method: "get",
      url: window.__env__.API_URL + "/blink/api/person",
      headers: { Authorization: localStorage.getItem("token") },
      response: {
        results: 4,
        params
      },
      type: "json"
    })
      .then(response => {
        let conf = [];
        for (let entry of response.data) {
          conf.push({
            name: entry.name,
            description: entry.description
          });
        }
        const pagination = { ...this.state.pagination };
        pagination.pageSize = 4;
        this.setState({
          loading: false,
          data: conf,
          pagination
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  */

  componentDidMount() {
    this.getAllCompanies();
    this.getAllPeople();
  }

  showCompanyModal = () => {
    this.setState({
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
      .get(window.__env__.API_URL + "/blink/api/company", {
        headers: {
          Authorization: localStorage.getItem("token")
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
      .get(window.__env__.API_URL + "/blink/api/person", {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      })
      .then(response => {
        this.setState({
          personOptions: response.data.map(person => {
            return {
              value: person.UUID,
              label: person.fName + " " + person.lName
            };
          })
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  getAllDocuments() {}

  showModal = () => {
    this.setState({
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
      visible: false
    });
  };

  render() {
    return (
      <React.Fragment>
        <Table
          columns={this.columns}
          expandedRowRender={record => (
            <p style={{ margin: 0 }}>{record.description}</p>
          )}
          dataSource={data}
        />
        {this.state.companyVisible && (
          <AssignModal
            companies={this.state.companyOptions}
            onCancel={this.handleCompanyCancel}
            title="Assign Modal"
            onOk={this.showPersonModal}
          />
        )}
        {this.state.personVisible && (
          <AssignPeople
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
            // TODO: don't hard code this.
              bodyStyle={{ height: '75vh' }}
              title="Create your workflow"
              width="75vw"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
            <WorkflowBuilder />        
            </Modal>
      </React.Fragment>
    );
  }
}
export default Templates;
