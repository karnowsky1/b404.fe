import React, { Component } from 'react';
import { Tabs } from 'antd';

import MilestonesTable from '../components/milestones/milestonesTable';
import { axiosError } from '../utils/axiosError';
import { getMilestone, getWorkflowByMilestoneId } from '../utils/api';

const { TabPane } = Tabs;

export default class Milestones extends Component {
  state = {
    activeMilestones: [],
    archivedMilestones: [],
    loading: false,
    pagination: {},
  };

  constructor() {
    super();
    this.fetch = this.fetch.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  handleResponse = (type) => async (response) => {
    let conf = [];
    for (let entry of response.data) {
      const { data } = await getWorkflowByMilestoneId(entry.mileStoneID);

      conf.push({
        id: entry.mileStoneID,
        key: entry.mileStoneID,
        name: entry.name,
        company: entry.company.companyName,
        startDate: entry.startDate,
        completedDate: entry.completedDate,
        deliveryDate: entry.deliveryDate,
        workflows: data,
      });
    }
    const pagination = { ...this.state.pagination };
    pagination.pageSize = 4;
    this.setState({
      loading: false,
      [type]: conf,
      pagination,
    });
  };

  fetch = () => {
    getMilestone('active')
      .then(this.handleResponse('activeMilestones'))
      .catch(axiosError);
    getMilestone('archived')
      .then(this.handleResponse('archivedMilestones'))
      .catch(axiosError);
  };
  render() {
    return (
      <Tabs defaultActiveKey="1" onChange={this.callback}>
        <TabPane tab="Active Milestones" key="1">
          <MilestonesTable
            content="active"
            active={true}
            loading={this.state.loading}
            pagination={this.state.pagination}
            data={this.state.activeMilestones}
            fetch={this.fetch}
          />
        </TabPane>
        <TabPane tab="Archived Milestones" key="2">
          <MilestonesTable
            content="archived"
            loading={this.state.loading}
            pagination={this.state.pagination}
            data={this.state.archivedMilestones}
            fetch={this.fetch}
          />
        </TabPane>
      </Tabs>
    );
  }
}
