import React from "react";
import {
  Table,
  Progress,
  Icon,
  Button,
  Row,
  Col,
  Card,
  Menu,
  Dropdown
} from "antd";
import axios from "axios";

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="" href="">
        Delete
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="" href="">
        View
      </a>
    </Menu.Item>
  </Menu>
);

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
    render: more => (
      <React.Fragment>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" href="#">
            <Icon type="more" />
          </a>
        </Dropdown>
      </React.Fragment>
    )
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
      let conf = [];
      for (let entry of response.data) {
        conf.push({
          id: entry.id,
          nameW: { title: entry.title, updated: entry.updated },
          author: { name: entry.name, createdA: entry.createdA },
          date: { createdD: entry.createdD, time: entry.time },
          progress: entry.progress
        });
      }
      this.setState({
        loading: false,
        data: conf
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
