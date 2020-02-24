import React from "react";
import { Tabs } from "antd";
import ActiveMilestones from "./tabs/activeMilestone";

const { TabPane } = Tabs;

class MilestoneTable extends React.Component {
  callback(key) {
    console.log(key);
  }

  render() {
    return (
      <Tabs defaultActiveKey="1" onChange={this.callback}>
        <TabPane tab="Active Milestones" key="1">
        <ActiveMilestones />
        </TabPane>
        <TabPane tab="Archived Milestones" key="2">
        <ActiveMilestones />
        </TabPane>
      </Tabs>
    );
  }
}
export default MilestoneTable;
