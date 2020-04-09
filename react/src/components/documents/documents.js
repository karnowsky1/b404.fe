import React from "react";
import {
  Button,
  Modal,
  Select,
  Tabs,
  message,
  Card,
  Input,
  Checkbox,
  Upload,
} from "antd";
import axios from "axios";
import { TOKEN_KEY /*, UUID_KEY*/ } from "../../constants/auth";
import TemplateTable from "./templateDoc";
import AssignTable from "./assignedDoc";
import { FormBuilder } from "cb-react-forms";
//import { FormGenerator } from 'cb-react-forms';
import ReactToPrint from "react-to-print";
import { getUser } from "../../utils/api";
import { axiosError } from "../../utils/axiosError";

const { Option } = Select;

const { TabPane } = Tabs;

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

const items = [
  {
    key: "Header",
    name: "Header Text",
    icon: "fa fa-header",
  },
  {
    key: "Label",
    name: "Label",
    icon: "fa fa-font",
  },
  {
    key: "Paragraph",
    name: "Paragraph",
    icon: "fa fa-paragraph",
  },
  {
    key: "LineBreak",
    name: "Line Break",
    icon: "fa fa-arrows-h",
  },
  {
    key: "Dropdown",
    name: "Dropdown",
    icon: "fa fa-caret-square-o-down",
  },
  {
    key: "Tags",
    name: "Tags",
    icon: "fa fa-tags",
  },
  {
    key: "Checkboxes",
    name: "Checkboxes",
    icon: "fa fa-check-square-o",
  },
  {
    key: "RadioButtons",
    name: "Multiple Choice",
    icon: "fa fa-dot-circle-o",
  },
  {
    key: "TextInput",
    name: "Text Input",
    icon: "fa fa-font",
  },
  {
    key: "NumberInput",
    name: "Number Input",
    icon: "fa fa-plus",
  },
  {
    key: "TextArea",
    name: "Multi-line Input",
    icon: "fa fa-text-height",
  },
  {
    key: "Rating",
    name: "Rating",
    icon: "fa fa-star",
  },
  {
    key: "HyperLink",
    name: "Web site",
    icon: "fa fa-link",
  },
  {
    key: "Range",
    name: "Range",
    icon: "fa fa-sliders",
  },
  {
    key: "Email",
    name: "Email",
    icon: "fa fa-at",
  },
  {
    key: "Date",
    name: "Date",
    icon: "fa fa-calendar",
  },
  {
    key: "Signature",
    name: "Signature",
    icon: "fa fa-edit",
  },
];

const onSubmit = (formData) => console.log(formData);

message.config({
  maxCount: 1,
});

class DocumentsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {},
      loading: true,
      visible: false,
      documentVisible: false,
      uploadVisible: false,
      select: "",
      buttonVisible: false,
    };
  }

  componentDidMount() {
    this.fetch();
    getUser().then((result) => this.setState({ buttonVisible: result }));
  }

  showPluginModal = () => {
    this.setState({
      documentVisible: false,
      visible: true,
    });
  };

  handlePluginOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
    this.fetch();
  };

  handlePluginCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    this.setState({
      documentVisible: true,
    });
  };

  showUploadModal = () => {
    this.setState({
      uploadVisible: true,
    });
  };

  handleOk = (e) => {
    console.log(e);
    let value = this.state.select;
    if (value === "") {
      console.log("Please enter value");
    } else if (value === "upload") {
      this.setState({
        documentVisible: false,
      });
      this.showUploadModal();
    } else if (value === "create") {
      this.setState({
        visible: false,
      });
      console.log("This works");
      this.showPluginModal();
      //Mislav add this pls
      //this.showCreateModal();
    }
  };

  handleUploadOk = (e) => {
    console.log(e);
    this.uploadFile(saveData, saveFile);
    this.setState({
      uploadVisible: false,
    });
  };

  onCancel = (e) => {
    console.log(e);
    this.setState({
      documentVisible: false,
    });
  };

  onUploadCancel = (e) => {
    console.log(e);
    this.setState({
      uploadVisible: false,
    });
  };

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
        let conf = [];
        for (let entry of response.data) {
          conf.push({
            id: entry.fileId,
            name: entry.name,
            //file: entry.file,
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

  uploadFile(base64, file) {
    let requestObject = {
      name: document.getElementById("nameInput").value,
      file: base64,
      confidential: checked,
    };

    console.log(requestObject);

    const url = window.__env__.API_URL + "/blink/api/file";
    axios
      .post(url, requestObject, {
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
          <h1>Documents</h1>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Documents" key="1">
              <AssignTable />
            </TabPane>
            <TabPane tab="Template Documents" key="2">
              <TemplateTable />
            </TabPane>
          </Tabs>
          {this.state.buttonVisible && (
            <Button type="primary" onClick={this.showModal}>
              + Create
            </Button>
          )}
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
            onChange={(value) => {
              this.setState({ select: value });
            }}
          >
            <Option value="upload">Upload a file.</Option>
            <Option value="create">Create a new form template.</Option>
          </Select>
        </Modal>
        <Modal
          ref={(el) => (this.componentRef = el)}
          title="Create your document"
          width="80vw"
          visible={this.state.visible}
          onOk={this.handlePluginOk}
          onCancel={this.handlePluginCancel}
        >
          <FormBuilder onSubmit={onSubmit} items={items} />
          <ReactToPrint
            trigger={() => <Button>Print this out!</Button>}
            content={() => this.componentRef}
          />
        </Modal>
        {this.state.uploadVisible && (
          <Modal
            onOk={this.handleUploadOk}
            onCancel={this.onUploadCancel}
            visible={this.state.uploadVisible}
            title="Upload Document"
          >
            <Card>
              <Input id="nameInput" placeholder="Document name..." />
              <p></p>
              <Checkbox onChange={this.onChange}>Confidential</Checkbox>
              <p></p>
              <Dragger {...props}>
                <p className="ant-upload-drag-icon"></p>
                <p className="ant-upload-text">
                  Click here or drag a file to this area to upload.
                </p>
              </Dragger>
            </Card>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export default DocumentsTable;
