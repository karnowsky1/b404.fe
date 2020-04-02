import React from 'react';
import {
  Table,
  Button,
  Input,
  Divider,
  Tag,
  Modal,
  Select,
  message
} from 'antd';
import axios from 'axios';
import { DocumentsModal } from './DocumentsModal';

import { FormBuilder } from 'cb-react-forms';
//import { FormGenerator } from 'cb-react-forms';
import ReactToPrint from 'react-to-print';

const { Search } = Input;
const { Option } = Select;

const items = [
  {
    key: 'Header',
    name: 'Header Text',
    icon: 'fa fa-header'
  },
  {
    key: 'Label',
    name: 'Label',
    icon: 'fa fa-font'
  },
  {
    key: 'Paragraph',
    name: 'Paragraph',
    icon: 'fa fa-paragraph'
  },
  {
    key: 'LineBreak',
    name: 'Line Break',
    icon: 'fa fa-arrows-h'
  },
  {
    key: 'Dropdown',
    name: 'Dropdown',
    icon: 'fa fa-caret-square-o-down'
  },
  {
    key: 'Tags',
    name: 'Tags',
    icon: 'fa fa-tags'
  },
  {
    key: 'Checkboxes',
    name: 'Checkboxes',
    icon: 'fa fa-check-square-o'
  },
  {
    key: 'RadioButtons',
    name: 'Multiple Choice',
    icon: 'fa fa-dot-circle-o'
  },
  {
    key: 'TextInput',
    name: 'Text Input',
    icon: 'fa fa-font'
  },
  {
    key: 'NumberInput',
    name: 'Number Input',
    icon: 'fa fa-plus'
  },
  {
    key: 'TextArea',
    name: 'Multi-line Input',
    icon: 'fa fa-text-height'
  },
  {
    key: 'Rating',
    name: 'Rating',
    icon: 'fa fa-star'
  },
  {
    key: 'HyperLink',
    name: 'Web site',
    icon: 'fa fa-link'
  },
  {
    key: 'Range',
    name: 'Range',
    icon: 'fa fa-sliders'
  },
  {
    key: 'Email',
    name: 'Email',
    icon: 'fa fa-at'
  },
  {
    key: 'Date',
    name: 'Date',
    icon: 'fa fa-calendar'
  },
  {
    key: 'Signature',
    name: 'Signature',
    icon: 'fa fa-edit'
  }
];

const onSubmit = formData => console.log(formData);

message.config({
  maxCount: 1
});

class DocumentsTable extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: true,
    visible: false,
    documentVisible: false,
    uploadVisible: false,
    select: ''
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Document Name',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: 'Last Modified By',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'File Type',
        dataIndex: 'fileType',
        key: 'fileType',
        render: fileType => <Tag color={this.color(fileType)}>{fileType}</Tag>
      },
      {
        title: 'Last Modified',
        dataIndex: 'mod',
        key: 'mod',
        render: mod => (
          <React.Fragment>
            <span>{mod.modified}</span>
            <Divider type="vertical" />
            <span style={{ color: 'gainsboro' }}>{mod.time}</span>
          </React.Fragment>
        )
      },
      {
        title: 'Confidential',
        dataIndex: 'confidental',
        key: 'confidental',
        render: confidental => {
          return confidental ? 'Yes' : 'No';
        }
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        render: more => (
          <React.Fragment>
            <Button type="link" size="small">
              Update
            </Button>
            <Divider type="vertical" />
            <Button type="link" size="small">
              Delete
            </Button>
          </React.Fragment>
        )
      }
    ];
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
      default:
        return;
    }
    return color;
  }

  componentDidMount() {
    this.fetch();
  }

  showPluginModal = () => {
    this.setState({
      documentVisible: false,
      visible: true
    });
  };

  handlePluginOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
    this.fetch();
  };

  handlePluginCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

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
    if (value === '') {
      console.log('Please enter value');
    } else if (value === 'upload') {
      this.setState({
        documentVisible: false
      });
      this.showUploadModal();
    } else if (value === 'create') {
      this.setState({
        visible: false
      });
      console.log('This works');
      this.showPluginModal();
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

  fetch = async (params = {}) => {
    await axios({
      method: 'get',
      url: 'https://demo1986594.mockable.io',
      response: {
        results: 4,
        params
      },
      type: 'json'
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
            style={{ width: '100%' }}
            id="select_document"
            onChange={value => {
              this.setState({ select: value });
            }}
          >
            <Option value="upload">Upload a file.</Option>
            <Option value="create">Create a new form template.</Option>
          </Select>
        </Modal>
        <Modal
          ref={el => (this.componentRef = el)}
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
