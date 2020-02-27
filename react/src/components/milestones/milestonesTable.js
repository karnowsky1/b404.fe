import React from 'react';
import axios from 'axios';
import { Table, Tabs, Progress, Row, Col, Button } from 'antd';
import { MilestoneModal } from './MilestoneModal'
import { getAllCompanies } from '../../utils/api';

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
        render: () => <Button type="link">Delete</Button>
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
            endDate: entry.completedDate
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
                    <b>End Date: {record.endDate}</b>
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
          <Button 
            type="primary"
            onClick={this.showAddModal}
            >+ Create
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
