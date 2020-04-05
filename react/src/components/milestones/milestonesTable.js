import React from 'react';
import axios from 'axios';
import qs from 'qs';
import { Table, Progress, Row, Col, Button, Modal, Divider } from 'antd';
import { MilestoneModal } from './MilestoneModal';
import {
  getAllCompanies,
  getMilestone,
  getWorkflowTemplates,
  getWorkflow
} from '../../utils/api';
import { axiosError } from '../../utils/axiosError';
import { AssignTemplateModal } from '../workflow/AssignTemplateModal';
import moment from 'moment';
import WorkflowBuilder from '../wf-builder/workflowBuilder';
import { RECEIVE_DATE_FORMAT } from '../../constants';
import { NoContent } from '../../utils/NoContent';
import {
  noMilestonesMessageOne,
  noMilestonesMessageTwo
} from '../../constants/messages';

const { confirm } = Modal;

class MilestonesTable extends React.Component {
  state = {
    data: [],
    companyName: [],
    loading: true,
    addvisible: false,
    editvisible: false,
    assignvisible: false,
    workflowBuilderVisible: false,
    workflow: [],
    updateWorkflow: false,
    editingMilestone: undefined,
    editingMilestoneID: undefined,
    assignWorkflowTemplates: undefined,
    assignWorkflowToMilestoneID: undefined,
    companyOptions: [],
    content: '',
    pagination: {}
  };
  constructor(props) {
    super(props);
    this.columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Company', dataIndex: 'company', key: 'company' },
      {
        title: 'Actions',
        dataIndex: '',
        key: 'x',
        render: record =>
          this.props.content === 'active' ? (
            <React.Fragment>
              <Button
                type="link"
                size="small"
                onClick={e => this.showAssignModal(record)}
              >
                Add Workflow
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
                onClick={e =>
                  this.showArchiveConfirm(e, record.id, 'archive', 'archived')
                }
              >
                Archive
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button
                type="link"
                size="small"
                onClick={e =>
                  this.showArchiveConfirm(e, record.id, 'unarchive', 'active')
                }
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

  componentDidMount = async e => {
    this.fetch();
    await getAllCompanies()
      .then(response => {
        this.setState({
          companyOptions: response.data.map(company => ({
            value: company.companyID,
            key: company.companyID,
            label: company.companyName
          }))
        });
      })
      .catch(axiosError);
  };

  showAddModal = () => {
    this.setState({
      addvisible: true
    });
  };

  showAssignModal = async record => {
    await getWorkflowTemplates()
      .then(response => {
        this.setState({
          assignWorkflowTemplates: response.data.map(template => ({
            value: template.workflowID,
            key: template.workflowID,
            label: template.name
          })),
          assignvisible: true,
          assignWorkflowToMilestoneID: record.id
        });
      })
      .catch(axiosError);
  };

  showEditModal = async record => {
    // console.log(record)
    await getMilestone(record.id).then(response => {
      // console.log(response.data)
      this.setState({
        editingMilestone: {
          name: response.data.name,
          description: response.data.description,
          companyID: response.data.company.companyID, // or companyName
          startDate: moment(response.data.startDate, RECEIVE_DATE_FORMAT), // update this to include hours mintues and seconds once the backend gets to it
          deliveryDate: moment(response.data.deliveryDate, RECEIVE_DATE_FORMAT)
        },
        editingMilestoneID: record.id,
        editvisible: true
      });
    });
  };

  showWorkflowModal = workflow => {
    workflow
      ? this.setState({
          workflow: workflow,
          assignWorkflowToMilestoneID: workflow.milestoneID,
          updateWorkflow: true,
          workflowBuilderVisible: true
        })
      : this.setState({
          isNew: false,
          workflowBuilderVisible: true,
          updateWorkflow: false
        });
  };

  handleAddCancel = e => {
    this.setState({
      addvisible: false
    });
  };

  handleEditCancel = e => {
    this.setState({
      editvisible: false
    });
  };

  handleAssignCancel = e => {
    this.setState({
      assignvisible: false
    });
  };

  handleWorkflowCancel = e => {
    this.setState({
      workflowBuilderVisible: false
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
    this.handleAddCancel();
  };

  onEditSubmit = async values => {
    // if (!this.state.previousJobIsEmpty && values.title === '') {
    //   values.title = ' ';
    // }
    // may have to do this again
    console.log(values);
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
        deliveryDate: values.deliveryDate
      }),
      type: 'json'
    })
      .then(() => {
        this.fetch();
      })
      .catch(axiosError);
    this.handleEditCancel();
    this.fetch();
  };

  onAssignSubmit = async values => {
    console.log(values);
    await getWorkflow(values.templateID)
      .then(response => {
        this.setState({
          workflow: response.data
        });
      })
      .catch(axiosError);
    this.handleAssignCancel();
    this.showWorkflowModal();
  };

  fetch = async e => {
    const { content } = this.props;
    await axios({
      method: 'get',
      url: window.__env__.API_URL + `/blink/api/milestone/${content}`,
      headers: { Authorization: localStorage.getItem('token') },
      response: {
        results: 4
      },
      type: 'json'
    })
      .then(async response => {
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
            // workflows:
          });
          conf.forEach(async item => {
            await axios({
              method: 'get',
              url:
                window.__env__.API_URL +
                `/blink/api/workflow/milestone/${item.id}`,
              headers: { Authorization: localStorage.getItem('token') },
              response: {
                results: 4
              },
              type: 'json'
            }).then(response => {
              item.workflows = response.data;
            });
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
      .catch(axiosError);
  };

  showArchiveConfirm = (e, id, request, oppositeTab) => {
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
        })
          .then(() => {
            window.location.reload(false);
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
        await axios
          .delete(window.__env__.API_URL + '/blink/api/milestone/' + id, {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          })
          .then(() => {
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
                  <b>
                    Completed Date:{' '}
                    {record.completedDate ? record.completedDate : 'N/A'}
                  </b>
                </p>
              </Col>
              <Col span={12}>
                <div>
                  {/* <p> */}
                  {/* {console.log(record)} */}
                  {record.workflows[0] ? (
                    record.workflows.map(({ ...workflow }) => (
                      <div key={workflow.workflowID}>
                        <span style={{ width: 200 }}>
                          <b>{workflow.name}</b>
                        </span>
                        <Divider type="vertical" />
                        {this.props.content === 'active' && (
                          <Button
                            type="link"
                            size="small"
                            onClick={e => this.showWorkflowModal(workflow)}
                          >
                            Update Workflow
                          </Button>
                        )}
                        <p></p>
                        <Progress
                          style={{ width: 310 }}
                          percent={workflow.percentComplete * 100}
                          size="small"
                        />
                        <p></p>
                      </div>
                    ))
                  ) : (
                    <NoContent
                      iconType="file-excel"
                      twoTonecolor="#001529"
                      firstMessage={noMilestonesMessageOne}
                      secondMessage={noMilestonesMessageTwo}
                    />
                  )}
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
        )}

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
            initialValues={this.state.assignWorkflowTemplates}
            onSubmit={this.onAssignSubmit}
            templates={this.state.assignWorkflowTemplates}
            onCancel={this.handleAssignCancel}
            title="Assign a Workflow Template to this Milestone"
            isAddModal={false}
          />
        )}
        {this.state.workflowBuilderVisible && (
          <Modal
            bodyStyle={{ height: '81vh' }}
            title={
              this.state.isNew ? (
                <h1>Create a new workflow template</h1>
              ) : (
                <h1>Create a concrete workflow</h1>
              )
            }
            width="75vw"
            footer={null}
            onOk={this.handleOk}
            onCancel={this.handleWorkflowCancel}
            visible={true}
          >
            <WorkflowBuilder
              isNew={false}
              isConcreteWorkflow={true}
              workflow={this.state.workflow}
              milestoneID={this.state.assignWorkflowToMilestoneID}
              updateWorkflow={this.state.updateWorkflow}
              onCancel={this.handleWorkflowCancel}
            />
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export default MilestonesTable;
