import React, { Component } from 'react';
import { Card } from 'antd';
import { Upload, message, Icon } from 'antd';
import { TOKEN_KEY } from '../constants/auth';
// import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { axiosError } from '../utils/axiosError';

const { Dragger } = Upload;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function markStepComplete() {
  const url =
    window.__env__.API_URL +
    '/blink/api/workflow/step/complete?id=' +
    localStorage.getItem('stepId');
  axios
    .put(url, null, {
      headers: {
        Authorization: localStorage.getItem(TOKEN_KEY),
      },
    })
    .then((response) => {
      if (response.status === 200) {
        window.location.href = '/dashboard';
      }
    })
    .catch(axiosError);
}

export default class Uploads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stepId: localStorage.getItem('stepId'),
      fileId: localStorage.getItem('fileId'),
      file: {},
      fileName: '',
      fileBase64: '',
      fileList: [],
      extension: '',
      downloadHidden: false,
    };

    this.returnUploadProps = this.returnUploadProps.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  uploadFile(base64, file) {
    console.log(file);
    console.log(base64);

    let requestObject = {
      fileID: parseInt(localStorage.getItem('fileId')),
      stepID: parseInt(localStorage.getItem('stepId')),
      name: file.name,
      file: base64,
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
          markStepComplete();
        }
      })
      .catch(axiosError);
  }

  fetch = (params = {}) => {
    axios({
      method: 'get',
      url:
        window.__env__.API_URL +
        '/blink/api/file/id/' +
        localStorage.getItem('fileId'),
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
        console.log(response);
        this.setState({
          file: response.data,
          fileList: [
            {
              uid: '1',
              name: response.data.name,
            },
          ],
          downloadHidden: false,
          fileName: response.data.name,
          extension: response.data.name.includes('.')
            ? response.data.name.split('.').pop()
            : '',
          fileBase64: response.data.file,
        });
        console.log(this.state);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  getStepFile() {
    const url =
      window.__env__.API_URL +
      '/blink/api/file/id/' +
      localStorage.getItem('fileId');
    axios
      .get(url, null, {
        headers: {
          //'Content-Type': 'application/json',
          Authorization: localStorage.getItem(TOKEN_KEY),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          this.setState({
            file: response.data,
            fileList: [response.data],
          });
          console.log(this.state.file);
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
          state.setState({
            fileBase64: data,
          });
          state.uploadFile(data, file);
        });
      },
      showUploadList: {
        showDownloadIcon: true,
        downloadIcon: 'Download',
        showRemoveIcon: false,
      },
      onChange: this.handleUploadChange,
    };
    return propsUpload;
  }

  handleUploadChange = ({ fileList }) => {
    if (fileList.length > 1) {
      fileList.shift();
      this.setState({
        downloadHidden: false,
      });
      console.log(this.state.downloadHidden);
    } else {
      this.setState({
        downloadHidden: true,
      });
      console.log(this.state.downloadHidden);
    }
    this.setState({ fileList: fileList });
  };

  dataURItoBlob(dataURI) {
    var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
  }

  render() {
    return (
      <Card title="Upload">
        <Card
          style={{
            width: '60%',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <p style={{textAlign: 'center'}}>Attached is the file associated with this step. You can use the download link to inspect the file and, if needed, make modifications to it. When you are done, drag & drop/reupload the file to finish the step.</p>
          <Dragger
            {...this.returnUploadProps(this)}
            fileList={this.state.fileList}
            style={{
              margin: 'auto',
              padding: '0 0',
              width: '70%',
              height: '50%',
            }}
          >
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" theme="outlined" />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from
              uploading company data or other band files
            </p>
          </Dragger>
          {!this.state.downloadHidden && (
            <a
              style={{ color: '#f06f32' }}
              href={
                this.state.fileBase64
                  ? URL.createObjectURL(
                      this.dataURItoBlob(this.state.fileBase64)
                    )
                  : '#'
              }
              download={
                this.state.fileName.includes('.')
                  ? this.state.fileName
                  : this.state.fileName + '.' + this.state.extension
              }
            >
              Download
            </a>
          )}
        </Card>
      </Card>
    );
  }
}
