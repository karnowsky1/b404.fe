import React from 'react';
import axios from 'axios';
import qs from 'qs';
import { Table, Tabs, Progress, Row, Col, Button, Modal, Divider } from 'antd';
import { MilestoneModal } from './MilestoneModal';
import { getAllCompanies } from '../../utils/api';
import { axiosError } from '../../utils/axiosError';

const { confirm } = Modal;

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

class MilestonesTable extends React.Component {
  state = {
    data: [],
    companyName: [],
    loading: true,
    addvisible: false,
    pagination: {},
    companyOptions: []
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
        render: record => (
          <React.Fragment>
            <Button
              type="link"
              size="small"
              // onClick={e => this.showEditModal(record)}
            >
              Assign
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              // onClick={e => this.showEditModal(record)}
            >
              Edit
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              onClick={e => this.showArchiveConfirm(e, record.id)}
            >
              Archive
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

  handleAddCancel = e => {
    // console.log(e);
    this.setState({
      addvisible: false
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

  fetch = (params = {}) => {
    axios({
      method: 'get',
      url: window.__env__.API_URL + '/blink/api/milestone',
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
            company: entry.companyID,
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

  showArchiveConfirm = (e, id) => {
    const { fetch } = this;
    confirm({
      title: 'Are you sure archive this Milestone?',
      content: 'If you archive this Milestone it will go to the arhived tab!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios
          .delete(window.__env__.API_URL + '/blink/api/milestone/id/' + id, {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          })
          .then(response => {
            if (response.status === 200) {
              // console.log('works');
              fetch();
            } else {
              // console.log(response);
            }
          });
      },
      onCancel() {
        // console.log('Cancel');
      }
    });
  };

  render() {
    return (
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Active Milestones" key="1">
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
          <Button type="primary" onClick={this.showAddModal}>
            + Create
          </Button>
          {this.state.addvisible && (
            <MilestoneModal
              onSubmit={this.onAddSubmit}
              companies={this.state.companyOptions}
              onCancel={this.handleAddCancel}
              title="Add Milestone"
              isAddModal={true}
            />
          )}
        </TabPane>
        <TabPane tab="Archived Milestones" key="2">
          <p>Archived Tab</p>
        </TabPane>
      </Tabs>
    );
  }
}

export default MilestonesTable;
