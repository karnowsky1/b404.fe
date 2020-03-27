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
    title: "Created Date",
    dataIndex: "dateC",
    key: "dateC"
  },
  {
    title: "Last Modified",
    dataIndex: "dateM",
    key: "dateM"
  }
];

class DashWorkflow extends React.Component {
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
      url: window.__env__.API_URL + "/blink/api/workflow/active",
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
            id: entry.workflowID,
            key: entry.workflowID,
            name: entry.name,
            description: entry.description,
            dateC: entry.createdDate,
            dateM: entry.lastUpdatedDate
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
        <h3>Your Workflows</h3>
        <Table
          columns={columns}
          rowKey={record => record.id}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
        <Button type="link">
          <Link to="/workflow">View All</Link>
        </Button>
      </React.Fragment>
    );
  }
}

export default DashWorkflow;
