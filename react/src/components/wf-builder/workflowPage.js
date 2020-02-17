import React from "react";
import {
  Table,
  Icon,
  Button,
  Row,
  Col,
  Card,
  Modal,
  Input
} from "antd";
import WorkflowBuilder from './workflowBuilder';
import axios from "axios";

const { Search } = Input;

const columns = [
  {
    title: "Workflow Details",
    dataIndex: "nameW",
    sorter: true,
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
    title: "Author",
    dataIndex: "author",
    render: author => (
      <React.Fragment>
        {author.name}
        <p>{author.created}</p>
      </React.Fragment>
    )
  },
  {
    title: "Date Created",
    dataIndex: "date",
    render: date => (
      <React.Fragment>
        {date.created}
        <p>{date.time}</p>
      </React.Fragment>
    )
  },
  {
    title: "Last Modified",
    dataIndex: "modified",
    render: modified => (
      <React.Fragment>
        {modified.created}
        <p>{modified.time}</p>
      </React.Fragment>
    )
  },
  {
    title: "More",
    dataIndex: "more",
    render: more => <Icon type="more" />
  }
];

class WorkflowsTable extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: true
  };

  componentDidMount() {
    this.fetch();
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    });
  };

  fetch = (params = {}) => {
    axios({
      method: "get",
      //TODO:Change to API...............................................................................
      url: "https://demo7818297.mockable.io/",
      //TODO:Change to API...............................................................................
      response: {
        results: 2,
        params
      },
      type: "json"
    }).then(response => {
      const pagination = { ...this.state.pagination };
      pagination.total = 10;
      pagination.size = "small";
      pagination.pageSize = 4;
      this.setState({
        loading: false,
        data: response.data,
        pagination
      });
    });
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
    this.fetch();
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <Search
            placeholder="Search..."
            onSearch={value => console.log(value)}
            enterButton="Search"
          />
        </div>
        <br></br>
        <Card>
          <div>
            <h1>Your Workflows</h1>
            <Table
              columns={columns}
              dataSource={this.state.data}
              loading={this.state.loading}
              pagination={this.state.pagination}
              onChange={this.handleTableChange}
              size="middle"
            />
            <Button type="primary" onClick={this.showModal}>
              + Create
            </Button>
            <Modal
              bodyStyle={{ height: '650px' }}
              title="Create your workflow"
              width="100"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
            <WorkflowBuilder />        
            </Modal>
          </div>
        </Card>
      </React.Fragment>
    );
  }
}

export default WorkflowsTable;
