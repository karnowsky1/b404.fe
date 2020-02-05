import React from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Card,
  Tag,
  Divider,
  Modal,
  Icon,
  Input,
  Cascader
} from "antd";
import axios from "axios";
import qs from "qs";

const { confirm } = Modal;
const InputGroup = Input.Group;
const optionsC = [
  {
    value: getAllCompanies,
    label: getAllCompanies
  }
];
const optionsR = [
  {
    value: "1",
    label: "Admin"
  },
  {
    value: "2",
    label: "Coach"
  },
  {
    value: "3",
    label: "External"
  },
  {
    value: "4",
    label: "Customer"
  },
  {
    value: "5",
    label: "Provider"
  }
];

function getAllCompanies() {
  axios
    .get(window.__env__.API_URL + "/blink/api/company", {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
    .then(response => {
      for (let res in response.data) {
        return response.data[res];
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

class AdminTable extends React.Component {
  state = {
    data: [],
    loading: true,
    pagination: {},
    addvisible: false,
    editvisible: false
  };

  constructor(props) {
    super(props);
    this.editData = null;
    this.columns = [
      { title: "Name", dataIndex: "nameW", key: "nameW" },
      {
        title: "Company",
        dataIndex: "companies",
        key: "companies"
      },
      {
        title: "Role",
        dataIndex: "accessLevelID",
        key: "accessLevelID",
        render: accessLevelID => (
          <React.Fragment>
            <Tag color={this.color(accessLevelID)}>
              {this.name(accessLevelID)}
            </Tag>
          </React.Fragment>
        )
      },
      {
        title: "Actions",
        dataIndex: "",
        key: "x",
        render: record => (
          <React.Fragment>
            <Button
              type="link"
              size="small"
              onClick={e => this.showEditModal(record)}
            >
              Edit
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              onClick={e => this.showDeleteConfirm(e, record.id)}
            >
              Delete
            </Button>
          </React.Fragment>
        )
      }
    ];
  }

  name(dataN) {
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
      case 4:
        name = "customer";
        break;
      case 5:
        name = "provider";
        break;
      default:
        return;
    }
    return name;
  }

  color(dataC) {
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
      case 4:
        color = "lime";
        break;
      case 5:
        color = "purple";
        break;
      default:
        return;
    }
    return color;
  }

  componentDidMount() {
    this.fetch();

    /*
    this.interval = setInterval(() => {
      this.fetch();
    }, 10000);*/
  }

  /*
  componentWillUnmount () {
    clearInterval(this.interval);
  }*/

  showAddModal = () => {
    this.setState({
      addvisible: true
    });
  };

  showEditModal = record => {
    console.log(record);
    this.editData = record;
    this.setState({
      editvisible: true
    });
  };

  handleAddOk = e => {
    const data = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      fName: document.getElementById("fname").value,
      lName: document.getElementById("lname").value,
      email: document.getElementById("email").value,
      title: document.getElementById("title").value,
      accessLevelID: 1
    };
    axios({
      method: "post",
      url: window.__env__.API_URL + "/blink/api/person",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: qs.stringify(data),
      type: "json"
    })
      .then(response => {
        if (response.status === 200) {
          this.fetch();
        } else {
          console.log(response);
        }
      })
      .catch(function(error) {
        console.log(error);
      });

    this.setState({
      addvisible: false
    });
  };

  showDeleteConfirm = (e, id) => {
    confirm({
      title: "Are you sure delete this user?",
      content: "If you delete this user he will no longer be able to login!",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        axios
          .delete(window.__env__.API_URL + "/blink/api/person/id/" + id, {
            headers: {
              Authorization: localStorage.getItem("token")
            }
          })
          .then(response => {
            if (response.status === 200) {
              console.log("works");
              //fix this it does not work
              //this.fetch();
            } else {
              console.log(response);
            }
          });
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  handleaddCancel = e => {
    console.log(e);
    this.setState({
      addvisible: false
    });
  };

  handleEditCancel = e => {
    console.log(e);
    this.setState({
      editvisible: false
    });
  };

  handleEditOk = e => {
    const data = {
      id: this.editData.id,
      username: document.getElementById("usernameE").value,
      password: document.getElementById("passwordE").value,
      fName: document.getElementById("fnameE").value,
      lName: document.getElementById("lnameE").value,
      email: document.getElementById("emailE").value,
      title: document.getElementById("titleE").value,
      accessLevelID: 1
    };
    axios({
      method: "put",
      url: window.__env__.API_URL + "/blink/api/person",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: qs.stringify(data),
      type: "json"
    })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
    this.setState({
      editvisible: false
    });
    this.fetch();
  };

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
            id: entry.UUID,
            fName: entry.fName,
            lName: entry.lName,
            username: entry.username,
            nameW: entry.fName + " " + entry.lName,
            email: entry.email,
            title: entry.title,
            companies:
              entry.companies.length > 0 ? entry.companies[0].companyName : "",
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
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <Card>
            <h1>Users</h1>
            <Table
              columns={this.columns}
              rowKey={record => record.id}
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
                    <Col span={6}>
                      <p>
                        <b>Companies: </b>
                        {record.companies}
                      </p>
                    </Col>
                  </Row>
                </React.Fragment>
              )}
              dataSource={this.state.data}
            />
            <Button
              type="primary"
              shape="circle"
              size="default"
              onClick={this.showAddModal}
            >
              <b>
                <Icon type="plus" />
              </b>
            </Button>
            <Modal
              title="Add User"
              visible={this.state.addvisible}
              onOk={this.handleAddOk}
              onCancel={this.handleaddCancel}
            >
              <p>First Name *</p>
              <Input id="fname" placeholder="First Name" />
              <p></p>
              <p>Last Name *</p>
              <Input id="lname" placeholder="Last Name" />
              <p></p>
              <p>Username *</p>
              <Input id="username" placeholder="Username" />
              <p></p>
              <p>Password *</p>
              <Input id="password" placeholder="Password" />
              <p></p>
              <p>Comapay</p>
              <InputGroup compact id="company">
                <Cascader
                  style={{ width: "100%" }}
                  options={optionsC}
                  placeholder="Select Company"
                />
              </InputGroup>
              <p></p>
              <p>Role *</p>
              <InputGroup compact>
                <Cascader
                  style={{ width: "100%" }}
                  options={optionsR}
                  placeholder="Select Role"
                  id="role"
                />
              </InputGroup>
              <p></p>
              <p>Email</p>
              <Input id="email" placeholder="Email" />
              <p></p>
              <p>Job Title</p>
              <Input id="title" placeholder="Job Title" />
            </Modal>
            <Modal
              title="Edit User"
              visible={this.state.editvisible}
              onOk={this.handleEditOk}
              onCancel={this.handleEditCancel}
            >
              <p>First Name *</p>
              <Input
                id="fnameE"
                placeholder=""
                defaultValue={this.editData !== null ? this.editData.fName : ""}
              />
              <p></p>
              <p>Last Name *</p>
              <Input
                id="lnameE"
                placeholder=""
                defaultValue={this.editData !== null ? this.editData.lName : ""}
              />
              <p></p>
              <p>Username *</p>
              <Input
                id="usernameE"
                placeholder=""
                defaultValue={
                  this.editData !== null ? this.editData.username : ""
                }
              />
              <p></p>
              <p>Password *</p>
              <Input
                id="passwordE"
                placeholder=""
                defaultValue={
                  this.editData !== null ? this.editData.password : ""
                }
              />
              <p></p>
              <p>Comapay</p>
              <InputGroup compact id="companyE">
                <Cascader
                  style={{ width: "100%" }}
                  options={optionsC}
                  placeholder=""
                  defaultValue={
                    this.editData !== null ? this.editData.companyName : ""
                  }
                />
              </InputGroup>
              <p></p>
              <p>Role *</p>
              <InputGroup compact>
                <Cascader
                  style={{ width: "100%" }}
                  options={optionsR}
                  placeholder=""
                  id="roleE"
                  defaultValue={
                    this.editData !== null ? this.editData.role : ""
                  }
                />
              </InputGroup>
              <p></p>
              <p>Email</p>
              <Input
                id="emailE"
                placeholder=""
                defaultValue={this.editData !== null ? this.editData.email : ""}
              />
              <p></p>
              <p>Job Title</p>
              <Input
                id="titleE"
                placeholder=""
                defaultValue={this.editData !== null ? this.editData.title : ""}
              />
            </Modal>
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminTable;
