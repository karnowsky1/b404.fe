import React, { Component } from 'react'
import { Tabs } from "antd";
import MilestonesTable from "../components/milestones/milestonesTable";

const { TabPane } = Tabs;

export default class Milestones extends Component {
    render() {
        return (
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="Active Milestones" key="1">
              <MilestonesTable content="active" active={true}/>
            </TabPane>
            <TabPane tab="Archived Milestones" key="2">
              <MilestonesTable content="archived"/>
            </TabPane>
        </Tabs>
        )
    }
}