import React from 'react';
import {
  Table,
  Icon,
  Button,
  Row,
  Col,
  Card,
  Modal,
  message,
  Input
} from 'antd';
import axios from 'axios';
import { FormBuilder } from 'cb-react-forms';
//import { FormGenerator } from 'cb-react-forms';

const { Search } = Input;

const items = [
  {
    key: "Header",
    name: "Header Text",
    icon: "fa fa-header"
  },
  {
    key: "Label",
    name: "Label",
    icon: "fa fa-font"
  },
  {
    key: "Paragraph",
    name: "Paragraph",
    icon: "fa fa-paragraph"
  },
  {
    key: "LineBreak",
    name: "Line Break",
    icon: "fa fa-arrows-h"
  },
  {
    key: "Dropdown",
    name: "Dropdown",
    icon: "fa fa-caret-square-o-down"
  },
  {
    key: "Tags",
    name: "Tags",
    icon: "fa fa-tags"
  },
  {
    key: "Checkboxes",
    name: "Checkboxes",
    icon: "fa fa-check-square-o"
  },
  {
    key: "RadioButtons",
    name: "Multiple Choice",
    icon: "fa fa-dot-circle-o"
  },
  {
    key: "TextInput",
    name: "Text Input",
    icon: "fa fa-font"
  },
  {
    key: "NumberInput",
    name: "Number Input",
    icon: "fa fa-plus"
  },
  {
    key: "TextArea",
    name: "Multi-line Input",
    icon: "fa fa-text-height"
  },
  {
    key: "Rating",
    name: "Rating",
    icon: "fa fa-star"
  },
  {
    key: "HyperLink",
    name: "Web site",
    icon: "fa fa-link"
  },
  {
    key: "Range",
    name: "Range",
    icon: "fa fa-sliders"
  },
  {
    key: "Email",
    name: "Email",
    icon: "fa fa-at"
  },
  {
    key: "Date",
    name: "Date",
    icon: "fa fa-calendar"
  },
  {
    key: "Signature",
    name: "Signature",
    icon: "fa fa-edit"
  }
];

const onSubmit = (formData) => console.log(formData);

message.config({
  maxCount: 1
});
/** 
const props = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text'
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
};*/

const columns = [
  {
    title: 'Document Details',
    dataIndex: 'nameW',
    sorter: true,
    render: nameW => (
      <React.Fragment>
        <Row>
          <Col span={3}>
            <Button type="primary" shape="circle" id="button">
              {nameW.title.charAt(0)}
            </Button>
          </Col>
          <Col span={12}>
            {nameW.title}
            <p>{nameW.updated}</p>
          </Col>
        </Row>
      </React.Fragment>
    )
  },
  {
    title: 'Author',
    dataIndex: 'author',
    render: author => (
      <React.Fragment>
        {author.name}
        <p>{author.created}</p>
      </React.Fragment>
    )
  },
  {
    title: 'Date Created',
    dataIndex: 'date',
    render: date => (
      <React.Fragment>
        {date.created}
        <p>{date.time}</p>
      </React.Fragment>
    )
  },
  {
    title: 'Last Modified',
    dataIndex: 'modified',
    render: modified => (
      <React.Fragment>
        {modified.created}
        <p>{modified.time}</p>
      </React.Fragment>
    )
  },
  {
    title: 'More',
    dataIndex: 'more',
    render: more => <Icon type="more" />
  }
];

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
        <Card>
          <div>
            <h1>Your Documents</h1>
            <Table
              columns={columns}
              dataSource={this.state.data}
              loading={this.state.loading}
              pagination={this.state.pagination}
              onChange={this.handleTableChange}
              size="middle"
            />
            <Button type="primary" onClick={this.showModal}>
              + Create
            </Button>
            <Modal
              title="Create your document"
              bodyStyle={{ height: '100vh' }}
              width="80vw"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              
              <FormBuilder onSubmit={onSubmit} items={items} />
              
            </Modal>
          </div>
        </Card>
      </React.Fragment>
    );
  }
}

export default DocumentsTable;
