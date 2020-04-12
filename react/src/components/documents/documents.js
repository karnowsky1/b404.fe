import React from 'react';
import { connect } from 'react-redux';

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

var saveFile;

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
      fileList: [],
      fileBase64: "",
      fileName: "",
      extension: "",
      changed: false,
    };
    this.returnUploadProps = this.returnUploadProps.bind(this);
  }

  componentDidMount() {
    getUser().then((result) => this.setState({ buttonVisible: result }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.changed !== prevState.changed) {

    }
  }

  returnUploadProps(state) {
    var propsUpload = {
      name: "file",
      multiple: false,
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      beforeUpload(file) {
        state.setState({
          fileName: file.name,
          extension: file.name.includes('.') ? file.name.split('.').pop() : ""
        })
        getBase64(file).then((data) => {
          if (document.getElementById("nameInput").value === "") {
            message.error("Please provide file name");
            state.setState({
              fileBase64: data
            })
            saveFile = file;
          } else {
            state.setState({
              fileBase64: data
            })
            saveFile = file;
          }
        });
      },
      showUploadList: {
        showDownloadIcon: false,
        showRemoveIcon: false,
      },
      onChange: this.handleUploadChange,
    };
    return propsUpload;
  }

  handleUploadChange = ({ fileList }) => {
    if (fileList.length > 1) {
      fileList.shift();
    }
    this.setState({ fileList: fileList });
  };

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
      fileList: [],
      fileBase64: "",
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
    var input = document.getElementById("nameInput").value;
    if (input === "" || null || undefined) {
      message.error("Please input the file name");
      return;
    }
    if (input.includes('.')) {
      message.error("Don't input extensions into the file name, the system does this automatically");
      return;
    }
    if (this.state.fileBase64 === "" || null || undefined) {
      message.error("Please provide a file");
      return;
    }
    this.uploadFile(this.state.fileBase64, saveFile);
    this.setState({
      fileName: "",
      fileBase64: "",
      fileList: [],
      changed: true,
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
      fileName: "",
      fileBase64: "",
      fileList: [],
    });
  };

  uploadFile(base64, file) {
    let requestObject = {
      name: this.state.extension === '' ? document.getElementById("nameInput").value.replace(/ /gi, "") : document.getElementById("nameInput").value.replace(/ /gi, "") + '.' + this.state.extension,
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
          window.location.reload(false);
        }
      })
      .catch(axiosError);
  }

  onChange(e) {
    console.log(`checked = ${(checked = true)}`);
  }

  handleChange = (e) => {
    if (!e.target.value.includes('.')) {
      this.setState({
        fileName: e.target.value,
      });
    } else {
      message.error("Don't input extensions into the file name, the system does this automatically");
    }
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <h1>Documents</h1>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Documents" key="1">
              <AssignTable buttonVisible={this.state.buttonVisible}/>
            </TabPane>
            {this.state.buttonVisible && (
              <TabPane tab="Template Documents" key="2">
                <TemplateTable buttonVisible={this.state.buttonVisible} />
              </TabPane>
            )}
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
              <Input id="nameInput" value={this.state.fileName.split('.').shift()}
                onChange={this.handleChange} placeholder="Document name..." />
              <p></p>
              <Checkbox onChange={this.onChange}>Confidential</Checkbox>
              <p></p>
              <Dragger {...this.returnUploadProps(this)}
                      fileList={this.state.fileList}
              >
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

export default connect((state = {}) => ({
  authorization_level: state.user && state.user.accessLevelID
}))(DocumentsTable);
