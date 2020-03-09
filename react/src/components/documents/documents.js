import React from "react";
import { Table, Button, Input, Divider, Tag } from "antd";
import axios from "axios";
import { DocumentsModal } from "./DocumentsModal";

const { Search } = Input;

class DocumentsTable extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: true,
    documentVisible: false
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "Document Name",
        dataIndex: "title",
        key: "title"
      },
      {
        title: "Last Modified By",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "File Type",
        dataIndex: "fileType",
        key: "fileType",
        render: fileType => <Tag>{fileType}</Tag>
      },
      {
        title: "Last Modified",
        dataIndex: "mod",
        key: "mod",
        render: mod => (
          <React.Fragment>
            {mod.modified}
            <p style={{ color: "gainsboro" }}>{mod.time}</p>
          </React.Fragment>
        )
      },
      {
        title: "Confidential",
        dataIndex: "confidental",
        key: "confidental",
        render: confidental => {
          if (confidental === "true") {
            return "Yes";
          } else return "No";
        }
      },
      {
        title: "More",
        dataIndex: "more",
        render: more => (
          <React.Fragment>
            <Button type="link">Update</Button> <Divider type="vertical" />
            <Button type="link">Delete</Button>
          </React.Fragment>
        )
      }
    ];
  }

  componentDidMount() {
    this.fetch();
  }

  showModal = () => {
    this.setState({
      documentVisible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      documentVisible: false
    });
  };

  onCancel = e => {
    console.log(e);
    this.setState({
      documentVisible: false
    });
  };

  fetch = (params = {}) => {
    axios({
      method: "get",
      url: "http://demo1986594.mockable.io",
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
            id: entry.key,
            title: entry.title,
            name: entry.name,
            updated: entry.updated,
            modified: entry.modified,
            time: entry.time,
            confidental: entry.confidental,
            fileType: entry.fileType,
            mod: { modified: entry.modified, time: entry.time }
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
        <div>
          <Search
            placeholder="Search..."
            onSearch={value => console.log(value)}
            enterButton="Search"
          />
        </div>
        <br></br>
        <div>
          <h1>Documents</h1>
          <Table
            columns={this.columns}
            dataSource={this.state.data}
            loading={this.state.loading}
            rowKey={record => record.id}
          />
          <Button type="primary" onClick={this.showModal}>
            + Create
          </Button>
        </div>
        {this.state.documentVisible && (
          <DocumentsModal
            onOk={this.handleOk}
            visible={this.state.documentVisible}
            onCancel={this.onCancel}
            title="Add Document"
          />
        )}
      </React.Fragment>
    );
  }
}

export default DocumentsTable;
