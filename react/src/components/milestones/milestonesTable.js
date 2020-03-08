import React from 'react';
import axios from 'axios';
import qs from 'qs';
import { Table, Progress, Row, Col, Button, Modal, Divider } from 'antd';
import { MilestoneModal } from './MilestoneModal';
import { getAllCompanies, getMilestone } from '../../utils/api';
import { axiosError } from '../../utils/axiosError';
import { AssignTemplateModal } from '../workflow/AssignTemplateModal';


const { confirm } = Modal;

class MilestonesTable extends React.Component {
  state = {
    data: [],
    companyName: [],
    loading: true,
    addvisible: false,
    editvisible: false,
    assignvisible: false,
    editingMilestone: undefined,
    editingMilestoneID: undefined,
    companyOptions: [],
    content: "",
    pagination: {}
    
  };
  constructor(props) {
    super(props);
    this.columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Company', dataIndex: 'company', key: 'company' },
      {
        title: 'Progress',
        dataIndex: '',
        key: 'y',
        render: () => <Progress percent={50} />
      },
      {
        title: 'Actions',
        dataIndex: '',
        key: 'x',
        render: record => this.props.content === "active" ? (
          <React.Fragment>
            <Button
              type="link"
              size="small"
              onClick={e => this.showAssignModal()}
            >
              Assign
            </Button>
            <Divider type="vertical" />
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
              onClick={e => this.showArchiveConfirm(e, record.id, "archive", "archived")}
            >
              Archive
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Button
                type="link"
                size="small"
                onClick={e => this.showArchiveConfirm(e, record.id, "unarchive", "active")}
              >
                Unarchive
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

  componentDidMount() {
    this.fetch();
    getAllCompanies()
      .then(response => {
        this.setState({
          companyOptions: response.data.map(company => ({
            value: company.companyID,
            key: company.companyID,
            label: company.companyName
          }))
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

  showAssignModal = () => {
    this.setState({
      assignvisible: true
    });
  };

  showEditModal = async record => {
    console.log(record)
    await getMilestone(record.id)
      .then(response =>{
        console.log(response.data)
        this.setState({
          editingMilestone: {
            name: response.data.name,
            description: response.data.description,
            companyID: response.data.company.companyID, // or companyName
            startDate: response.data.startDate,
            deliveryDate: response.data.deliveryDate
          },
          editingMilestoneID: record.id,
          editvisible: true
        })
      })
  }

  handleAddCancel = e => {
    // console.log(e);
    this.setState({
      addvisible: false
    });
  };

  handleEditCancel = e => {
    // console.log(e);
    this.setState({
      editvisible: false
    });
  };

  handleAssignCancel = e => {
    // console.log(e);
    this.setState({
      assignvisible: false
    });
  };

  onAddSubmit = async values => {
    await axios({
      method: 'post',
      url: window.__env__.API_URL + '/blink/api/milestone',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify(values),
      // this is already a big object coming from formik
      type: 'json'
    })
      .then(() => {
        this.fetch();
      })
      .catch(axiosError);
      this.setState({
        addvisible: false
      });
  };

  onEditSubmit = async values => {
    // if (!this.state.previousJobIsEmpty && values.title === '') {
    //   values.title = ' ';
    // }
    // may have to do this again 
    console.log(values)
    await axios({
      method: 'put',
      url: window.__env__.API_URL + '/blink/api/milestone',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        id: this.state.editingMilestoneID,
        name: values.name,
        description: values.description,
        companyID: values.companyID,
        startDate: values.startDate,
        deliveryDate: values.deliveryDate,
      }),
      type: 'json'
    }).then(() => {
      this.fetch();
    })
    .catch(axiosError);
    this.setState({
      editvisible: false
    });
    this.fetch();
  }

  fetch = (params = {}) => {
    const { content } = this.props
    axios({
      method: 'get',
      url: window.__env__.API_URL + `/blink/api/milestone/${content}`,
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
            id: entry.mileStoneID,
            key: entry.mileStoneID,
            name: entry.name,
            company: entry.company.companyName,
            startDate: entry.startDate,
            completedDate: entry.completedDate,
            deliveryDate: entry.deliveryDate
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

  showArchiveConfirm = (e, id, request, oppositeTab) => {
    const { fetch } = this; 
    confirm({
      title: `Are you sure you want to ${request} this Milestone?`,
      content: `If you ${request} this Milestone it will go to the ${oppositeTab} tab!`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        await axios({
          method: 'put',
          url: window.__env__.API_URL + `/blink/api/milestone/${request}`,
          headers: {
            Authorization: localStorage.getItem('token'),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: qs.stringify({
            id: id
          }),
          type: 'json'
        }).then(() => {
          fetch(); //having an issue with need to refresh both tables 
        })
        .catch(axiosError);
      },
      onCancel() {
        // console.log('Cancel');
      }
    });
  };

  showDeleteConfirm = (e, id) => {
    const { fetch } = this; 
    confirm({
      title: `Are you sure you want to delete this Milestone?`,
      content: `If you delete this Milestone, all associated worklflows will be romoved from the system!`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        await  axios
        .delete(window.__env__.API_URL + '/blink/api/milestone/' + id, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        }).then(() => {
          fetch(); //having an issue with need to refresh both tables 
        })
        .catch(axiosError);
      },
      onCancel() {
        // console.log('Cancel');
      }
    });
  };

  render() {
    return (
      <React.Fragment>
          <Table
            columns={this.columns}
            rowKey={record => record.id}
            expandedRowRender={record => (
              <Row key={record.key}>
                <Col span={12}>
                  <p>
                    <b>Start Date: {record.startDate}</b>
                  </p>
                  <p>
                    <b>Delivery Date: {record.deliveryDate}</b>
                  </p>
                  <p>
                    <b>Completed Date: {record.completedDate ? record.completedDate : 'N/A'}</b>
                  </p>
                </Col>
                <Col span={12}>
                  <div style={{ width: 200 }}>
                    <p>
                      <b>Workflow 1</b>
                    </p>
                    <Progress percent={50} size="small" />
                    <p>
                      <b>Workflow 2</b>
                    </p>
                    <Progress percent={50} size="small" />
                    <Button type="link">+ Add Workflow</Button>
                  </div>
                </Col>
              </Row>
            )}
            dataSource={this.state.data}
          />
          {this.props.active && (
            <Button type="primary" onClick={this.showAddModal}>
              + Create
            </Button>
            ) 
          }
          
          {this.state.addvisible && (
            <MilestoneModal
              onSubmit={this.onAddSubmit}
              companies={this.state.companyOptions}
              onCancel={this.handleAddCancel}
              title="Add Milestone"
              isAddModal={true}
            />
          )}

          {this.state.editvisible && (
            <MilestoneModal
              initialValues={this.state.editingMilestone}
              onSubmit={this.onEditSubmit}
              companies={this.state.companyOptions}
              onCancel={this.handleEditCancel}
              title="Edit Milestone"
              isAddModal={false}
            />
          )}

          {this.state.assignvisible && (
            <AssignTemplateModal
              initialValues={this.state.editingMilestone}
              onSubmit={this.onEditSubmit}
              companies={this.state.companyOptions}
              onCancel={this.handleAssignCancel}
              title="Add a Workflow Template"
              isAddModal={false}
            />
          )}
        </React.Fragment>
    );
  }
}

export default MilestonesTable;
