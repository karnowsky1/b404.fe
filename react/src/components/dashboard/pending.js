import React from "react";
import axios from "axios";
import { List, Button } from "antd";
import { TOKEN_KEY /*, UUID_KEY*/ } from "../../constants/auth";
import { Link } from "react-router-dom";

class Pending extends React.Component {
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
      url: window.__env__.API_URL + "/blink/api/workflow/pending",
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
        console.log(response);
        // let conf = [];
        // for (let entry of response.data) {
        //   conf.push({
        //     id: entry.workflowID
        //     key: entry.workflowID,
        //     name: entry.name,
        //     description: entry.description,
        //     dateC: entry.createdDate,
        //     dateM: entry.lastUpdatedDate
        //   });
        // }
        const pagination = { ...this.state.pagination };
        pagination.pageSize = 4;
        this.setState({
          loading: false,
          data: response.data,
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
        <h3>Pending Tasks</h3>
        <Button type="link" style={{ float: "right" }}>
          <Link to="/">View All</Link>
        </Button>
        <br />
        <List
          dataSource={this.state.data}
          renderItem={item => (
            <List.Item key={item.id}>
              <List.Item.Meta title={item.name} />
              <div>{item.id}</div>
            </List.Item>
          )}
        />
        <br />
      </React.Fragment>
    );
  }
}

export default Pending;
