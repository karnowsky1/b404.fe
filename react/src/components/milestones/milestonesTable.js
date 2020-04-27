import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import qs from 'qs';
import { Table, Progress, Row, Col, Button, Modal, Divider } from 'antd';
import { MilestoneModal } from './MilestoneModal';
import {
  getAllCompanies,
  getMilestone,
  getWorkflowTemplates,
  getWorkflow,
  getZippedFilesByMilestone,
} from '../../utils/api';
import { axiosError } from '../../utils/axiosError';
import { AssignTemplateModal } from '../workflow/AssignTemplateModal';
import moment from 'moment';
import WorkflowBuilder from '../wf-builder/workflowBuilder';
import {
  RECEIVE_DATE_FORMAT,
  IS_INTERNAL,
  FETCH_REFRESH_TIME,
} from '../../constants';
import { NoContent } from '../../utils/NoContent';
import {
  noMilestonesMessageOne,
  noMilestonesMessageTwo,
} from '../../constants/messages';
import { showDeleteConfirmUtil } from '../../utils/showDeleteConfirmUtil';

var downloadjs = require('downloadjs');

const { confirm } = Modal;

class MilestonesTable extends React.Component {
  state = {
    companyName: [],
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
  };
  constructor(props) {
    super(props);
    this.columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Company', dataIndex: 'company', key: 'company' },
    ];
    const progress = {
      title: 'Progress',
      dataIndex: '',
      key: 'y',
      render: (record) => (
        <Progress
          //style={{ width: 310 }}
          percent={Math.floor(record.percentComplete * 100)}
          size="small"
        />
      ),
    };
    const actions = {
      title: 'Actions',
      dataIndex: '',
      key: 'x',
      render: (record) =>
        this.props.content === 'active' ? (
          <React.Fragment>
            <Button
              type="link"
              size="small"
              onClick={(e) => this.showAssignModal(record)}
            >
              Add Workflow
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              onClick={(e) => this.showEditModal(record)}
            >
              Edit
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              onClick={(e) =>
                this.showArchiveConfirm(e, record.id, 'archive', 'archived')
              }
            >
              Archive
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              onClick={(e) => this.downloadFiles(record.id)}
            >
              Download Content
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Button
              type="link"
              size="small"
              onClick={(e) =>
                this.showArchiveConfirm(e, record.id, 'unarchive', 'active')
              }
            >
              Unarchive
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              onClick={(e) => this.showDeleteConfirm(e, record.id)}
            >
              Delete
            </Button>
          </React.Fragment>
        ),
    };
    IS_INTERNAL(this.props.authorization_level) &&
      this.columns.push(progress) &&
      this.columns.push(actions);
  }

  componentDidMount = async (e) => {
    const { fetch } = this.props;
    fetch();
    this.intervalID = setInterval(fetch, FETCH_REFRESH_TIME);
    await getAllCompanies()
      .then((response) => {
        this.setState({
          companyOptions: response.data.map((company) => ({
            value: company.companyID,
            key: company.companyID,
            label: company.companyName,
          })),
        });
      })
      .catch(axiosError);
  };

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  showAddModal = () => {
    this.setState({
      addvisible: true,
    });
  };

  showAssignModal = async (record) => {
    await getWorkflowTemplates()
      .then((response) => {
        this.setState({
          assignWorkflowTemplates: response.data.map((template) => ({
            value: template.workflowID,
            key: template.workflowID,
            label: template.name,
          })),
          assignvisible: true,
          assignWorkflowToMilestoneID: record.id,
        });
      })
      .catch(axiosError);
  };

  showEditModal = async (record) => {
    await getMilestone(record.id).then((response) => {
      this.setState({
        editingMilestone: {
          name: response.data.name,
          description: response.data.description,
          companyID: response.data.company.companyID, // or companyName
          startDate: moment(response.data.startDate, RECEIVE_DATE_FORMAT), // update this to include hours mintues and seconds once the backend gets to it
          deliveryDate: moment(response.data.deliveryDate, RECEIVE_DATE_FORMAT),
        },
        editingMilestoneID: record.id,
        editvisible: true,
      });
    });
  };

  downloadFiles = async (id) => {
    await getZippedFilesByMilestone(id)
      .then((response) => {
        if (response.status === 200) {
          var mime =
            response.data.file &&
            response.data.file.split(',')[0].split(':')[1].split(';')[0];
          downloadjs(response.data.file, response.data.name, mime);
        }
      })
      .catch(axiosError);
  };

  showWorkflowModal = (workflow) => {
    workflow
      ? this.setState({
          workflow: workflow,
          assignWorkflowToMilestoneID: workflow.milestoneID,
          updateWorkflow: true,
          workflowBuilderVisible: true,
        })
      : this.setState({
          isNew: false,
          workflowBuilderVisible: true,
          updateWorkflow: false,
        });
  };

  handleAddCancel = (e) => {
    this.setState({
      addvisible: false,
    });
  };

  handleEditCancel = (e) => {
    this.setState({
      editvisible: false,
    });
  };

  handleAssignCancel = (e) => {
    this.setState({
      assignvisible: false,
    });
  };

  handleWorkflowCancel = (e) => {
    this.setState({
      workflowBuilderVisible: false,
    });
  };

  onAddSubmit = async (values) => {
    await axios({
      method: 'post',
      url: window.__env__.API_URL + '/blink/api/milestone',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify(values),
      // this is already a big object coming from formik
      type: 'json',
    })
      .then(() => {
        this.props.fetch();
      })
      .catch(axiosError);
    this.handleAddCancel();
  };

  onEditSubmit = async (values) => {
    await axios({
      method: 'put',
      url: window.__env__.API_URL + '/blink/api/milestone',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        id: this.state.editingMilestoneID,
        name: values.name,
        description: values.description,
        companyID: values.companyID,
        startDate: values.startDate,
        deliveryDate: values.deliveryDate,
      }),
      type: 'json',
    })
      .then(() => {
        this.props.fetch();
      })
      .catch(axiosError);
    this.handleEditCancel();
    this.props.fetch();
  };

  onAssignSubmit = async (values) => {
    await getWorkflow(values.templateID)
      .then((response) => {
        this.setState({
          workflow: response.data,
        });
      })
      .catch(axiosError);
    this.handleAssignCancel();
    this.showWorkflowModal();
  };

  showArchiveConfirm = (e, id, request, oppositeTab) => {
    const { props } = this;
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
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: qs.stringify({
            id: id,
          }),
          type: 'json',
        })
          .then(() => {
            props.fetch();
          })
          .catch(axiosError);
      },
      onCancel() {},
    });
  };

  showDeleteConfirm = (e, id) => {
    const { props } = this;
    showDeleteConfirmUtil(id, 'milestone', 'workflows', props.fetch);
  };

  render() {
    return (
      <React.Fragment>
        <Table
          columns={this.columns}
          rowKey={(record) => record.id}
          expandedRowRender={(record) => (
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
                  {record.workflows && record.workflows.length ? (
                    record.workflows.map(({ ...workflow }) => (
                      <div key={workflow.workflowID}>
                        <span style={{ width: 200 }}>
                          <b>{workflow.name}</b>
                        </span>
                        {IS_INTERNAL(this.props.authorization_level) && (
                          <Divider type="vertical" />
                        )}
                        {IS_INTERNAL(this.props.authorization_level) &&
                          this.props.content === 'active' && (
                            <Button
                              type="link"
                              size="small"
                              onClick={(e) => this.showWorkflowModal(workflow)}
                            >
                              Update Workflow
                            </Button>
                          )}
                        {IS_INTERNAL(this.props.authorization_level) &&
                          this.props.content === 'active' && (
                            <>
                              <Divider type="vertical" />
                              <Button
                                type="link"
                                size="small"
                                onClick={(e) => {
                                  const { fetch } = this.props;
                                  showDeleteConfirmUtil(
                                    workflow.workflowID,
                                    'workflow',
                                    'steps',
                                    fetch
                                  );
                                }}
                              >
                                Delete Workflow
                              </Button>
                            </>
                          )}
                        <p></p>
                        <Progress
                          style={{ width: 310 }}
                          percent={Math.floor(workflow.percentComplete * 100)}
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
                      secondMessage={
                        IS_INTERNAL(this.props.authorization_level)
                          ? noMilestonesMessageTwo
                          : ''
                      }
                    />
                  )}
                </div>
              </Col>
            </Row>
          )}
          dataSource={this.props.data}
        />
        {IS_INTERNAL(this.props.authorization_level) && this.props.active && (
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

export default connect((state = {}) => ({
  authorization_level: state.user && state.user.accessLevelID,
}))(MilestonesTable);
