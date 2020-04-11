import React from "react";
import { Table, Button, Divider, Tag, message } from "antd";
import axios from "axios";
import { TOKEN_KEY /*, UUID_KEY*/ } from "../../constants/auth";

message.config({
  maxCount: 1,
});

class AssignTable extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: true,
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "Document Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "File Type",
        dataIndex: "fileType",
        key: "fileType",
        render: (name) => (
          <Tag color={this.color(name)}>{name === null ? "N/A" : name}</Tag>
        ),
      },
      {
        title: "Confidential",
        dataIndex: "confidental",
        key: "confidental",
        render: (confidental) => {
          return confidental ? "Yes" : "No";
        },
      },
      {
        title: "Actions",
        dataIndex: this.state.data,
        key: 'x',
        render: (row) => (
          <React.Fragment>
            <a
              href={URL.createObjectURL(this.dataURItoBlob(row.file))}
              download={row.name}
            >
              Download
            </a>
            <Divider type="vertical" />
            <Button type="link" size="small">
              Update
            </Button>
            <Divider type="vertical" />
            <Button type="link" size="small">
              Delete
            </Button>
          </React.Fragment>
        ),
      },
    ];
  }

  color(dataC) {
    let color = "";
    switch (dataC) {
      case "file":
        color = "geekblue";
        break;
      case "document":
        color = "green";
        break;
      case "image":
        color = "purple";
        break;
      case "video":
        color = "sandybrown";
        break;
      case "executable":
        color = "springgreen";
        break;
      case "archive":
        color = "aquamarine";
        break;
      case "N/A":
        color = "geekblue";
        break;
      default:
        color = "geekblue";
    }
    return color;
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = async (params = {}) => {
    await axios({
      method: "get",
      url: window.__env__.API_URL + "/blink/api/file/concrete",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem(TOKEN_KEY),
      },
      response: {
        results: 4,
        params,
      },
      type: "json",
    })
      .then((response) => {
        console.log(response.data);
        let conf = [];
        for (let entry of response.data) {
          conf.push({
            id: entry.fileID,
            name: entry.name,
            file: entry.file,
            confidental: entry.confidental,
            fileType: entry.fileType,
          });
        }
        const pagination = { ...this.state.pagination };
        pagination.pageSize = 4;
        this.setState({
          loading: false,
          data: conf,
          pagination,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  dataURItoBlob(dataURI) {
    var mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var binary = atob(dataURI.split(",")[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <Table
            rowKey={(record) => record.id}
            columns={this.columns}
            dataSource={this.state.data}
            loading={this.state.loading}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default AssignTable;
