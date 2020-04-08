import React from "react";
import { Table, Button, Divider, Tag, message, Modal } from "antd";
import axios from "axios";
import { TOKEN_KEY /*, UUID_KEY*/ } from "../../constants/auth";

const { confirm } = Modal;

message.config({
  maxCount: 1,
});

class TemplateTable extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: true,
    download: [],
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
        dataIndex: "file",
        key: "file",
        render: (name) => <Tag color={this.color(name)}>{name}</Tag>,
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
        key: "x",
        render: (file) => (
          <React.Fragment>
            <Button
              type="link"
              size="small"
              onClick={(e) => this.downloadDocument(e, file.id)}
            >
              Download
            </Button>
            <Divider type="vertical" />
            <Button type="link" size="small">
              Update
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              onClick={(e) => this.showDeleteConfirm(e, file.id)}
            >
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
      default:
        color = "geekblue";
    }
    return color;
  }

  componentDidMount() {
    this.fetch();
  }

  downloadDocument = (e, id) => {
    axios
      .get(window.__env__.API_URL + "/blink/api/file/" + id, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.name);
        } else {
          // console.log(response);
        }
      });
  };

  showDeleteConfirm = (e, id) => {
    confirm({
      title: "Are you sure delete this document?",
      content: "If you delete this document it will become unusable!",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        axios
          .delete(window.__env__.API_URL + "/blink/api/file/" + id, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          })
          .then((response) => {
            if (response.status === 200) {
              // console.log('works');
              window.location.reload(false);
            } else {
              // console.log(response);
            }
          });
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };

  fetch = async (params = {}) => {
    await axios({
      method: "get",
      url: window.__env__.API_URL + "/blink/api/file/template",
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
        let conf = [];
        for (let entry of response.data) {
          conf.push({
            id: entry.fileID,
            name: entry.name,
            fileC: entry.file,
            confidental: entry.confidental,
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

  render() {
    return (
      <React.Fragment>
        <div>
          <Table
            columns={this.columns}
            dataSource={this.state.data}
            loading={this.state.loading}
            rowKey={(record) => record.id}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default TemplateTable;
