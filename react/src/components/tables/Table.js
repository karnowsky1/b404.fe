import React from "react";
import { Table, Progress, Icon, Button, Row, Col, Card } from "antd";
import axios from "axios";

const columns = [
  {
    title: "Workflow Details",
    dataIndex: "nameW",
    render: nameW => (
      <React.Fragment>
        <Row>
          <Col span={3}>
            <Button type="primary" shape="circle" id="button">
              {nameW.title.charAt(0)}
            </Button>
          </Col>
          <Col span={12}>
            {nameW.title}
            <p>{nameW.updated}</p>
          </Col>
        </Row>
      </React.Fragment>
    )
  },
  {
    title: "Workflow Author",
    dataIndex: "author",
    render: author => (
      <React.Fragment>
        {author.name}
        <p>{author.createdA}</p>
      </React.Fragment>
    )
  },
  {
    title: "Date Created",
    dataIndex: "date",
    render: date => (
      <React.Fragment>
        {date.createdD}
        <p>{date.time}</p>
      </React.Fragment>
    )
  },
  {
    title: "Progress",
    dataIndex: "progress",
    render: progress => (
      <Progress
        strokeColor={{
          "0%": "#108ee9",
          "100%": "#87d068"
        }}
        percent={progress}
        size="small"
        status="active"
      />
    )
  },
  {
    title: "More",
    dataIndex: "more",
    render: more => <Icon type="more" />
  }
];

class Tables extends React.Component {
  state = {
    data: [],
    loading: true
  };

  componentDidMount() {
    this.fetch();
    console.log(this.state.data);
  }

  fetch = (params = {}) => {
    axios({
      method: "get",
      //TODO:Change to API...............................................................................
      url: "https://demo1986594.mockable.io",
      //TODO:Change to API...............................................................................
      response: {
        results: 4,
        params
      },
      type: "json"
    }).then(response => {
      let conf = {
        id: response.data.id,
        nameW: { title: response.data.title, updated: response.data.updated },
        author: { name: response.data.name, createdA: response.data.createdA },
        date: { createdD: response.data.createdD, time: response.data.time },
        progress: response.data.progress
      };
      this.setState({
        loading: false,
        data: conf.data
      });
    });
  };

  render() {
    return (
      <React.Fragment>
        <Card>
          <div>
            <h1>Your Workflows</h1>
            <Table
              columns={columns}
              dataSource={this.state.data}
              pagination={false}
              loading={this.state.loading}
            />
            <Button type="link" id="mWView">
              View All
            </Button>
          </div>
        </Card>
      </React.Fragment>
    );
  }
}

export default Tables;
