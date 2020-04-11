import React from "react";
import {
  Table,
  Button,
  Divider,
  Tag,
  message,
  Modal,
  Upload,
  Card,
  Input,
  Checkbox,
} from "antd";
import axios from "axios";
import { TOKEN_KEY /*, UUID_KEY*/ } from "../../constants/auth";
import { axiosError } from "../../utils/axiosError";

const { confirm } = Modal;

const { Dragger } = Upload;

var checked = false;

var saveData;
var saveFile;

const props = {
  name: "file",
  multiple: true,
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  beforeUpload(file) {
    getBase64(file).then((data) => {
      if (document.getElementById("nameInput").value === "") {
        alert("Please provide file name");
      } else {
        saveData = data;
        saveFile = file;
      }
    });
  },
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

message.config({
  maxCount: 1,
});

class TemplateTable extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: true,
    download: [],
    uploadVisible: false,
    fileName: "",
    checked: false,
    fileId: "",
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
        key: "x",
        render: (file) => (
          <React.Fragment>
            <a
              href={
                URL.createObjectURL(this.dataURItoBlob(file.fileC))
              }
              download={file.name}
            >
              Download
            </a>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              onClick={(e) =>
                this.showModal(file.name, file.confidental, file.id)
              }
            >
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

  blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  dataURItoBlob(dataURI) {
    var mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var binary = atob(dataURI.split(",")[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
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

  base64ToBlob(file) {
    var pos = file.indexOf(";base64,");
    var type = file.substring(5, pos);
    var b64 = file.substr(pos + 8);

    var content = atob(b64);

    var buffer = new ArrayBuffer(content.length);
    var view = new Uint8Array(buffer);

    for (var n = 0; n < content.length; n++) {
      view[n] = content.charCodeAt(n);
    }

    var blob = new Blob([buffer], { type: type });

    return blob;
  }

  componentDidMount() {
    this.fetch();
  }

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
        console.log(response.data);
        let conf = [];
        for (let entry of response.data) {
          conf.push({
            id: entry.fileID,
            name: entry.name,
            fileC: entry.file,
            confidental: entry.confidential,
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

  showModal = (fileName, isChecked, id) => {
    this.setState({
      uploadVisible: true,
    });
    isChecked === true
      ? this.setState({ checked: true })
      : this.setState({ checked: false });
    this.setState({
      fileName: fileName,
      fileId: id,
    });
  };

  handleChange = (e) => {
    this.setState({
      fileName: e.target.value,
    });
  };

  handleUploadOk = (e) => {
    console.log(e);
    this.uploadFile(saveData, saveFile);
    this.setState({
      uploadVisible: false,
    });
  };

  onUploadCancel = (e) => {
    console.log(e);
    this.setState({
      uploadVisible: false,
    });
  };

  uploadFile(base64, file) {
    let requestObject = {
      fileID: this.state.fileId,
      name: document.getElementById("nameInput").value,
      file: base64,
      confidential: checked,
    };

    console.log(requestObject);
    console.log(this.state.fileID);
    const url = window.__env__.API_URL + "/blink/api/file";
    axios
      .put(url, requestObject, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem(TOKEN_KEY),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          message.success("Data saved successfully");
        }
      })
      .catch(axiosError);
  }

  onChange(e) {
    console.log(`checked = ${(checked = true)}`);
  }

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
          <Modal
            onOk={this.handleUploadOk}
            onCancel={this.onUploadCancel}
            visible={this.state.uploadVisible}
            title="Upload Document"
          >
            <Card>
              <Input
                id="nameInput"
                placeholder="Document name..."
                value={this.state.fileName}
                onChange={this.handleChange}
              />
              <p></p>
              <Checkbox checked={this.state.checked} onChange={this.onChange}>
                Confidential
              </Checkbox>
              <p></p>
              <Dragger {...props}>
                <p className="ant-upload-drag-icon"></p>
                <p className="ant-upload-text">
                  Click here or drag a file to this area to upload.
                </p>
              </Dragger>
            </Card>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default TemplateTable;
