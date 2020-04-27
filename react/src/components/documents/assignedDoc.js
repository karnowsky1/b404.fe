import React from 'react';
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
} from 'antd';
import axios from 'axios';
import { TOKEN_KEY /*, UUID_KEY*/ } from '../../constants/auth';
import { axiosError } from '../../utils/axiosError';
import { FETCH_REFRESH_TIME } from '../../constants';

const { confirm } = Modal;

const { Dragger } = Upload;

var saveFile;

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

class AssignTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {},
      loading: true,
      download: [],
      uploadVisible: false,
      fileName: '',
      checked: false,
      fileId: '',
      fileBase64: '',
      fileList: [],
      changed: false,
      extension: '',
      form: false
    };
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.returnUploadProps = this.returnUploadProps.bind(this);
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
    this.columns = [
      {
        title: 'Document Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'File Type',
        dataIndex: this.state.data,
        key: 'y',
        render: (file) => (
          <Tag
            color={this.color(
              file.fileC && this.getMime(file.fileC).split('/').shift()
            )}
          >
            {this.getMime(file.fileC) === null
              ? 'N/A'
              : this.getMime(file.fileC)}
          </Tag>
        ),
      },
      {
        title: 'Confidential',
        dataIndex: 'confidental',
        key: 'confidental',
        render: (confidental) => {
          return confidental ? 'Yes' : 'No';
        },
      },
      {
        title: 'Actions',
        dataIndex: this.state.data,
        key: 'x',
        render: (file) => (
          <React.Fragment>
            {!file.form && (
            <a
              style={{ color: '#f06f32' }}
              href={
                file.fileC &&
                URL.createObjectURL(this.dataURItoBlob(file.fileC))
              }
              download={
                file.name.includes('.')
                  ? file.name
                  : file.name + '.' + file.extension
              }
            >
              Download
            </a>
            )}
              <React.Fragment>
              {(this.props.buttonVisible && !file.form) && (
                <React.Fragment>
                <Divider type="vertical" />
                <Button
                  type="link"
                  size="small"
                  onClick={(e) => {
                    this.showModal(
                      file.name,
                      file.confidental,
                      file.id,
                      file.fileC
                    );
                  }}
                >
                  Update
                </Button>
                <Divider type="vertical" />
                </React.Fragment>
                )}
                <Button
                  type="link"
                  size="small"
                  onClick={(e) => this.showDeleteConfirm(e, file.id, this)}
                >
                  Delete
                </Button>
              </React.Fragment>
          </React.Fragment>
        ),
      },
    ];
  }

  dataURItoBlob(dataURI) {
    var mime = dataURI && dataURI.split(',')[0].split(':')[1].split(';')[0];
    var binary = dataURI && atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
  }

  getMime(dataURI) {
    var mime = dataURI && dataURI.split(',')[0].split(':')[1].split(';')[0];
    return mime;
  }

  color(dataC) {
    let color = '';
    switch (dataC) {
      case 'file':
        color = 'geekblue';
        break;
      case 'document':
        color = 'green';
        break;
      case 'image':
        color = 'purple';
        break;
      case 'video':
        color = 'sandybrown';
        break;
      case 'executable':
        color = 'springgreen';
        break;
      case 'archive':
        color = 'aquamarine';
        break;
      case 'N/A':
        color = 'geekblue';
        break;
      default:
        color = 'geekblue';
    }
    return color;
  }

  base64ToBlob(file) {
    var pos = file.indexOf(';base64,');
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
    this.intervalID = setInterval(this.fetch, FETCH_REFRESH_TIME);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.changed !== prevState.changed) {
      this.fetch();
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  showDeleteConfirm = (e, id, state) => {
    confirm({
      title: 'Are you sure delete this document?',
      content: 'If you delete this document it will become unusable!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios
          .delete(window.__env__.API_URL + '/blink/api/file/' + id, {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          })
          .then((response) => {
            if (response.status === 200) {
              // console.log('works');
              state.setState({
                changed: true,
              });
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
    this.setState({
      loading: false,
      changed: false,
    });
    await axios({
      method: 'get',
      url: window.__env__.API_URL + '/blink/api/file/concrete',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(TOKEN_KEY),
      },
      response: {
        results: 4,
        params,
      },
      type: 'json',
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
            stepID: entry.stepID,
            extension: entry.name.includes('.')
              ? entry.name.split('.').pop()
              : '',
            form: entry.form  
          });
        }
        const pagination = { ...this.state.pagination };
        pagination.pageSize = 4;
        this.setState({
          loading: false,
          data: conf,
          pagination,
        });
        console.log(this.state.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  showModal = (fileName, isChecked, id, base64String) => {
    this.setState({
      uploadVisible: true,
    });
    isChecked === true
      ? this.setState({ checked: true })
      : this.setState({ checked: false });
    this.setState({
      fileName: fileName,
      extension: fileName.includes('.') ? fileName.split('.').pop() : '',
      fileId: id,
      fileBase64: base64String,
      fileList: [
        {
          uid: '1',
          name: fileName,
          status: 'done',
        },
      ],
    });
  };

  handleChange = (e) => {
    if (!e.target.value.includes('.')) {
      this.setState({
        fileName: e.target.value,
      });
    } else {
      message.error(
        "Don't input extensions into the file name, the system does this automatically"
      );
    }
  };

  handleUploadOk = (e) => {
    console.log(this.state.fileBase64);
    console.log(saveFile);
    console.log(e);
    var input = document.getElementById('nameInput').value;
    if (input === '' || null || undefined) {
      message.error('Please input the file name');
      return;
    }
    if (this.state.fileBase64 === undefined || null || '') {
      message.error('Please provide a file');
      return;
    }
    this.uploadFile(this.state.fileBase64, saveFile);
    this.setState({
      uploadVisible: false,
      changed: true,
    });
  };

  onUploadCancel = (e) => {
    console.log(e);
    this.setState({
      uploadVisible: false,
    });
  };

  uploadFile(base64, file) {
    console.log(base64);
    let requestObject = {
      fileID: this.state.fileId,
      name: document.getElementById('nameInput').value.includes('.')
        ? document.getElementById('nameInput').value.replace(/ /gi, '')
        : document.getElementById('nameInput').value.replace(/ /gi, '') +
          (this.state.extension === '' ? '' : '.' + this.state.extension),
      file: base64 === undefined ? this.state.fileBase64 : base64,
      confidential: this.state.checked,
    };

    console.log(requestObject);
    const url = window.__env__.API_URL + '/blink/api/file';
    axios
      .put(url, requestObject, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem(TOKEN_KEY),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          message.success('Data saved successfully');
        }
      })
      .catch(axiosError);
  }

  returnUploadProps(state) {
    var propsUpload = {
      name: 'file',
      multiple: false,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      beforeUpload(file) {
        console.log(file);
        state.setState({
          fileName: file.name,
          extension: file.name.includes('.') ? file.name.split('.').pop() : '',
        });
        console.log(state);
        getBase64(file).then((data) => {
          if (document.getElementById('nameInput').value === '') {
            message.error('Please provide file name');
            state.setState({
              fileBase64: data,
            });
            saveFile = file;
          } else {
            state.setState({
              fileBase64: data,
            });
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
    console.log(this.state);
    return propsUpload;
  }

  handleUploadChange = ({ fileList }) => {
    if (fileList.length > 1) {
      fileList.shift();
    }
    this.setState({ fileList: fileList });
  };

  onCheckboxChange(e) {
    this.state.checked
      ? this.setState({ checked: false })
      : this.setState({ checked: true });
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
              <div className="nameExtension">
                <Input
                  id="nameInput"
                  placeholder="Document name..."
                  value={this.state.fileName.split('.').shift()}
                  onChange={this.handleChange}
                />
                <Input
                  id="extensionInput"
                  placeholder=""
                  value={this.state.extension}
                  disabled
                />
              </div>
              <p></p>
              <Checkbox
                checked={this.state.checked}
                onChange={this.onCheckboxChange}
              >
                Confidential
              </Checkbox>
              <p></p>
              <Dragger
                {...this.returnUploadProps(this)}
                fileList={this.state.fileList}
              >
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

export default AssignTable;
