import React from 'react';
import { Table, Button, Row, Col, Card, Tag, Divider, Modal, Icon, message } from 'antd';
import axios from 'axios';
import qs from 'qs';
import { PeopleModal } from './PeopleModal';
import { axiosError } from '../../utils/axiosError';
import { getAllCompanies } from '../../utils/api';

const { confirm } = Modal;

const optionsR = [
  {
    value: 1,
    label: 'Admin'
  },
  {
    value: 2,
    label: 'Coach'
  },
  {
    value: 3,
    label: 'External'
  },
  {
    value: 4,
    label: 'Customer'
  },
  {
    value: 5,
    label: 'Provider'
  }
];

class AdminTable extends React.Component {
  state = {
    data: [],
    loading: true,
    editingUser: undefined,
    pagination: {},
    addvisible: false,
    editvisible: false,
    companyOptions: []
  };
  
  constructor(props) {
    super(props);
    this.columns = [
      { title: 'Name', dataIndex: 'nameW', key: 'nameW' },
      {
        title: 'Company',
        dataIndex: 'companies',
        key: 'companies',
        ellipsis: true
      },
      {
        title: 'Role',
        dataIndex: 'accessLevelID',
        key: 'accessLevelID',
        render: accessLevelID => (
          <React.Fragment>
            <Tag color={this.color(accessLevelID)}>
              {this.name(accessLevelID)}
            </Tag>
          </React.Fragment>
        )
      },
      {
        title: 'Actions',
        dataIndex: '',
        key: 'x',
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
    let name = '';
    switch (dataN) {
      case 1:
        name = 'admin';
        break;
      case 2:
        name = 'coach';
        break;
      case 3:
        name = 'external';
        break;
      case 4:
        name = 'customer';
        break;
      case 5:
        name = 'provider';
        break;
      default:
        return;
    }
    return name;
  }

  color(dataC) {
    let color = '';
    switch (dataC) {
      case 1:
        color = 'geekblue';
        break;
      case 2:
        color = 'green';
        break;
      case 3:
        color = 'cyan';
        break;
      case 4:
        color = 'lime';
        break;
      case 5:
        color = 'purple';
        break;
      default:
        return;
    }
    return color;
  }

  componentDidMount() {
    this.fetch();
    getAllCompanies()
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
      .catch(error => {
        console.error(error);
      });
  }

  showAddModal = () => {
    this.setState({
      addvisible: true
    });
  };

  showEditModal = record => {
    this.setState({
      editingUser: record,
      editvisible: true
    });
  };

  onAddSubmit = async values => {
    if(!this.state.data.some(user =>
      user.username === values.username
    )){
    await axios({
      method: 'post',
      url: window.__env__.API_URL + '/blink/api/person',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify(values),
      // this is already a big object coming from formik
      type: 'json'
    })
      .then(response => {  
        // console.log(values.company)
        if (response.status === 200 && values.company) {
          // needed the response of the first call to make the second found
          // grabbing ID from the first one to send into the next request 
          for (let company of values.company) {
            axios({
              method: 'post',
              url: window.__env__.API_URL + '/blink/api/company/person/add',
              headers: {
                Authorization: localStorage.getItem('token'),
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: qs.stringify({companyID: company, personID: response.data.UUID}),
              // making query string with key and value, that's why we're wrapping it in an object and using it this way 
              // object names need to match variables from API endpoint 
              type: 'json'
            })
            .then(()=>{
              this.fetch();
            })
            .catch(axiosError);
          }    
        } else {
          this.fetch()
          console.log(response);
        }
      })
      .catch(axiosError);
      this.setState({
        addvisible: false
      });
    } else {
      message.destroy()
      message.error(`Username ${values.username} is already taken`);
    }
  };

  showDeleteConfirm = (e, id) => {
    const { fetch } = this;
    confirm({
      title: 'Are you sure delete this user?',
      content: 'If you delete this user he will no longer be able to login!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios
          .delete(window.__env__.API_URL + '/blink/api/person/id/' + id, {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          })
          .then(response => {
            if (response.status === 200) {
              console.log('works');
              fetch();
            } else {
              console.log(response);
            }
          });
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  handleAddCancel = e => {
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

  onEditSubmit = async values => {
    await axios({
      method: 'put',
      url: window.__env__.API_URL + '/blink/api/person',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify(values),
      type: 'json'
    })
      .then(response => {  
        if (response.status === 200 && values.company) {
          axios({
            method: 'post',
            url: window.__env__.API_URL + '/blink/api/company/person/add',
            headers: {
              Authorization: localStorage.getItem('token'),
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify({companyID: values.company, personID: response.data.UUID}),
            type: 'json'
          })
          .then(()=>{
            this.fetch();
          })
          .catch(axiosError);    
        } else {
          this.fetch()
          console.log(response);
        }
      })
    this.setState({
      editvisible: false
    });
    this.fetch();
  };

  fetch = (params = {}) => {
    axios({
      method: 'get',
      url: window.__env__.API_URL + '/blink/api/person',
      headers: { Authorization: localStorage.getItem('token') },
      response: {
        results: 4,
        params
      },
      type: 'json'
    })
      .then(response => {
        let conf = [];
        for (let entry of response.data) {
          conf.push({
            id: entry.UUID,
            fName: entry.fName,
            lName: entry.lName,
            username: entry.username,
            nameW: entry.fName + ' ' + entry.lName,
            email: entry.email,
            title: entry.title,
            companies:
            entry.companies.map(company =>{
              return company.companyName + '. '
            }),
              // entry.companies.length > 0 ? entry.companies[0].companyName : '',
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
            {this.state.addvisible && (
              <PeopleModal
                onSubmit={this.onAddSubmit}
                companies={this.state.companyOptions}
                onCancel={this.handleAddCancel}
                roles={optionsR}
                title="Add User"
                isAddModal={true}
              />
            )}
            {this.state.editvisible && (
              <PeopleModal
                initialValues={this.state.editingUser}
                onSubmit={this.onEditSubmit}
                companies={this.state.companyOptions}
                onCancel={this.handleEditCancel}
                roles={optionsR}
                title="Edit User"
                isAddModal={false}
              />
            )}
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminTable;
