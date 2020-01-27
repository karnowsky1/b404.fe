import React from "react";
import {
  Table,
  Icon,
  Button,
  Row,
  Col,
  Card,
  Modal,
  Upload,
  message,
  Input
} from "antd";
import axios from "axios";

const { Search } = Input;

/*
const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="" href="">
        View
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="" href="">
        Delete
      </a>
    </Menu.Item>
  </Menu>
);*/

const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text"
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
};

const columns = [
  {
    title: "Document Details",
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

class DocumentsTable extends React.Component {
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
            <h1>Your Documents</h1>
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
              title="Upload your document"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <Upload {...props}>
                <Button>
                  <Icon type="upload" /> Click to Upload
                </Button>
              </Upload>
            </Modal>
          </div>
        </Card>
      </React.Fragment>
    );
  }
}

export default DocumentsTable;
