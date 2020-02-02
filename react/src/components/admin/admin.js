import React from "react";
import { Table, Button, Row, Col, Card, Tag, Divider, Modal } from "antd";
import axios from "axios";

const columns = [
  { title: "Name", dataIndex: "nameW", key: "nameW" },
  { title: "Company", dataIndex: "companies", key: "companies" },
  {
    title: "Role",
    dataIndex: "accessLevelID",
    key: "accessLevelID",
    render: accessLevelID => (
      <React.Fragment>
        <Tag color={color(accessLevelID)}>{name(accessLevelID)}</Tag>
      </React.Fragment>
    )
  },
  {
    title: "Actions",
    dataIndex: "",
    key: "x",
    render: () => (
      <React.Fragment>
        <Button type="link" size="small">
          Edit
        </Button>
        <Divider type="vertical" />
        <Button type="link" size="small">
          Delete
        </Button>
      </React.Fragment>
    )
  }
];

function name(dataN) {
  let name = "";
  switch (dataN) {
    case 1:
      name = "admin";
      break;
    case 2:
      name = "coach";
      break;
    case 3:
      name = "external";
      break;
    default:
      return;
  }
  return name;
}

function color(dataC) {
  let color = "";
  switch (dataC) {
    case 1:
      color = "geekblue";
      break;
    case 2:
      color = "green";
      break;
    case 3:
      color = "cyan";
      break;
    default:
      return;
  }
  return color;
}

class AdminTable extends React.Component {
  state = {
    data: [],
    loading: true,
    pagination: {},
    visible: false
  };

  componentDidMount() {
    this.fetch();
  }

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
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  fetch = (params = {}) => {
    axios({
      method: "get",
      url: "https://testing.blink-404.com/blink/api/person",
      headers: { Authorization: localStorage.getItem("token") },
      response: {
        results: 4,
        params
      },
      type: "json"
    }).then(response => {
      let conf = [];
      for (let entry of response.data) {
        conf.push({
          id: entry.UUID,
          username: entry.username,
          nameW: entry.fName + " " + entry.lName,
          email: entry.email,
          title: entry.title,
          companies: entry.companies[0].companyName,
          accessLevelID: entry.accessLevelID
        });
      }
      const pagination = { ...this.state.pagination };
      pagination.pageSize = 4;
      this.setState({
        loading: false,
        data: conf,
        pagination
      });
    });
  };

  render() {
    return (
      <React.Fragment>
        <Card>
          <div>
            <h1>Users</h1>
            <Table
              columns={columns}
              expandedRowRender={record => (
                <React.Fragment>
                  <Row>
                    <Col span={6}>
                      <p>
                        <b>Username: </b>
                        {record.username}
                      </p>
                    </Col>
                    <Col span={6}>
                      <p>
                        <b>Email: </b>
                        {record.email}
                      </p>
                    </Col>
                    <Col span={6}>
                      <p>
                        <b>Job Title: </b>
                        {record.title}
                      </p>
                    </Col>
                  </Row>
                  <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                  >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                  </Modal>
                </React.Fragment>
              )}
              dataSource={this.state.data}
            />
          </div>
        </Card>
      </React.Fragment>
    );
  }
}

export default AdminTable;
