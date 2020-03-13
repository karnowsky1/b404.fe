import React from "react";
import { Table, Button, Input, Divider, Tag, Modal, Select } from "antd";
import axios from "axios";
import { DocumentsModal } from "./DocumentsModal";

const { Search } = Input;
const { Option } = Select;

class DocumentsTable extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: true,
    documentVisible: false,
    uploadVisible: false,
    select: ""
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
        render: fileType => <Tag color={this.color(fileType)}>{fileType}</Tag>
      },
      {
        title: "Last Modified",
        dataIndex: "mod",
        key: "mod",
        render: mod => (
          <React.Fragment>
            <span>{mod.modified}</span>
            <Divider type="vertical" />
            <span style={{ color: "gainsboro" }}>{mod.time}</span>
          </React.Fragment>
        )
      },
      {
        title: "Confidential",
        dataIndex: "confidental",
        key: "confidental",
        render: confidental => {
          return (confidental? 'Yes' : 'No');
        }
      },
      {
        title: "Actions",
        dataIndex: "actions",
        render: more => (
          <React.Fragment>
            <Button 
              type="link"
              size="small"
            >
              Update
            </Button> 
            <Divider type="vertical" />
            <Button 
              type="link"
              size="small"
            >
              Delete
            </Button>
          </React.Fragment>
        )
      }
    ];
  }

  color(dataC) {
    let color = "";
    switch (dataC) {
      case "File":
        color = "geekblue";
        break;
      case "Document":
        color = "green";
        break;
      case "Image":
        color = "purple";
        break;
      case "Video":
        color = "sandybrown";
        break;
      case "Executable":
        color = "springgreen";
        break;
      case "Archive":
        color = "aquamarine";
        break;
      default:
        return;
    }
    return color;
  }

  componentDidMount() {
    this.fetch();
  }

  showModal = () => {
    this.setState({
      documentVisible: true
    });
  };

  showUploadModal = () => {
    this.setState({
      uploadVisible: true
    });
  };

  handleOk = e => {
    console.log(e);
    let value = this.state.select;
    if (value === "") {
      console.log("Please enter value");
    } else if (value === "upload") {
      this.setState({
        documentVisible: false
      });
      this.showUploadModal();
    } else if (value === "create") {
      this.setState({
        documentVisible: false
      });
      console.log("This works");
      //Mislav add this pls
      //this.showCreateModal();
    }
  };

  handleUploadOk = e => {
    console.log(e);
    this.setState({
      uploadVisible: false
    });
  };

  onCancel = e => {
    console.log(e);
    this.setState({
      documentVisible: false
    });
  };

  onUploadCancel = e => {
    console.log(e);
    this.setState({
      uploadVisible: false
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
        <Modal
          title="Add Document"
          visible={this.state.documentVisible}
          onCancel={this.onCancel}
          onOk={this.handleOk}
        >
          <p>Document Type</p>
          <Select
            placeholder="Please select action..."
            style={{ width: "100%" }}
            id="select_document"
            onChange={value => {
              this.setState({ select: value });
            }}
          >
            <Option value="upload">Upload new document</Option>
            <Option value="create">Create new document</Option>
          </Select>
        </Modal>
        {this.state.uploadVisible && (
          <DocumentsModal
            onOk={this.handleUploadOk}
            onCancel={this.onUploadCancel}
            visible={this.state.uploadVisible}
            title="Upload Document"
          />
        )}
      </React.Fragment>
    );
  }
}

export default DocumentsTable;
