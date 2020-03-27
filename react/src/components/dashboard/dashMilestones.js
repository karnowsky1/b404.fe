import React from "react";
import axios from "axios";
import { Table, Button } from "antd";
import { TOKEN_KEY /*, UUID_KEY*/ } from "../../constants/auth";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Company",
    dataIndex: "company",
    key: "company"
  },
  {
    title: "Date Started",
    dataIndex: "date",
    key: "date"
  }
];

class DashMilestones extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      visible: false,
      pagination: {}
    };
  }

  componentDidMount() {
    this.setState({
      loading: true
    });
    this.fetch();
  }

  fetch = (params = {}) => {
    axios({
      method: "get",
      url: window.__env__.API_URL + "/blink/api/milestone/active",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem(TOKEN_KEY)
      },
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
            id: entry.milestoneID,
            key: entry.milestoneID,
            name: entry.name,
            date: entry.createdDate,
            company: entry.company.companyName
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
        <h3>Your Milestones</h3>
        <Table
          columns={columns}
          rowKey={records => records.id}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
        <Button type="link">
          <Link to="/milestones">View All</Link>
        </Button>
      </React.Fragment>
    );
  }
}

export default DashMilestones;
