import React from "react";
import { Table, Button, Divider } from "antd";

const columns = [
  { title: "Type", dataIndex: "name", key: "name" },
  { title: "Assigned Company", dataIndex: "description", key: "description" },
  {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: () => (
      <React.Fragment>
        <Button type="link" size="small">
          Update
        </Button>
        <Divider type="vertical" />
        <Button type="link" size="small">
          Delete
        </Button>
      </React.Fragment>
    )
  }
];

const data = [
  {
    key: 1,
    name: "a1",
    age: 32,
    description: "Venture Creations"
  },
  {
    key: 2,
    name: "qt3",
    age: 42,
    description: "Venture Creations"
  },
  {
    key: 3,
    name: "wf7",
    age: 32,
    description: "Venture Creations"
  }
];

class ActiveWorkflows extends React.Component {
  state = {
    data: [],
    loading: true
  };

  /*
  fetch = (params = {}) => {
    axios({
      method: "get",
      url: window.__env__.API_URL + "/blink/api/person",
      headers: { Authorization: localStorage.getItem("token") },
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
            name: entry.name,
            description: entry.description
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
  */
  render() {
    return (
      <Table
        columns={columns}
        expandedRowRender={record => (
          <p style={{ margin: 0 }}>{record.description}</p>
        )}
        dataSource={data}
      />
    );
  }
}
export default ActiveWorkflows;
