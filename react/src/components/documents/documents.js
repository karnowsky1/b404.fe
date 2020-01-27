import React from "react";
import { Table, Icon, Button, Row, Col, Card } from "antd";
import axios from "axios";
import ReactPaginate from 'react-paginate';

const columns = [
  {
    title: "Document Details",
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

class DocumentsTable extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: false
  };

  componentDidMount() {
    this.fetch();
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  fetch = (params = {}) => {
    axios({
      method: "get",
      //TODO:Change to API...............................................................................
      url: "https://demo7818297.mockable.io/",
      //TODO:Change to API...............................................................................
      response: {
        results: 0,
        params
      },
      type: "json"
    }).then(response => {
        const pagination = { ...this.state.pagination };
      pagination.total = 200;
      this.setState({
        loading: false,
        data: response.data,
        pagination
      });
    });
  };

  render() {
    return (
      <React.Fragment>
        <Card>
          <div>
            <h1>Your Documents</h1>
            <Table
              columns={columns}
              dataSource={this.state.data}
              loading={this.state.loading}
              pagination={this.state.pagination}
            />
            <Button type="primary" id="mWView">
              + Create
            </Button>
          </div>
        </Card>
      </React.Fragment>
    );
  }
}

export default DocumentsTable;
