import React from 'react';
import { Form, Input, Tooltip, Icon, Card, Button, Spin, message } from 'antd';
import axios from 'axios';
import qs from 'qs';
import { TOKEN_KEY, UUID_KEY } from '../../constants/auth';
import { hash } from './../../utils/hash';
import SignatureCanvas from 'react-signature-canvas';

class SettingsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {},
      confirmDirty: false,
      autoCompleteResult: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    message.config({
      maxCount: 1
    });
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.sigCanvas.fromDataURL("data:image/png;base64,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");

    const url =
      window.__env__.API_URL +
      '/blink/api/person/id/' +
      localStorage.getItem(UUID_KEY);
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: localStorage.getItem(TOKEN_KEY)
        }
      })
      .then(response => {
        if (response.status === 200) {
          this.setState({
            loading: false,
            user: response.data
          });
        }
      })
      .catch(function(error) {
        message.destroy();
        this.setState({ loading: false });
        if (error.response) {
          // Request made and server responded
          message.error(error.response.data.error);
        } else if (error.request) {
          // The request was made but no response was received
          message.error('Server not responding');
        } else {
          // Something happened in setting up the request that triggered an Error
          message.error('Error setting up request');
        }
      });
  }

  handleSubmit = async e => {
    this.setState({ loading: true });
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {
          uuid,
          username,
          password,
          fName,
          lName,
          email,
          title,
          accessLevelID
        } = this.state.user;
        const id = uuid;
        const url = window.__env__.API_URL + '/blink/api/person';
        axios
          .put(
            url,
            qs.stringify({
              id,
              username,
              password: password ? hash(password) : '',
              fName,
              lName,
              email,
              title,
              accessLevelID
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: localStorage.getItem(TOKEN_KEY)
              }
            }
          )
          .then(response => {
            if (response.status === 200) {
              message.success('Data saved successfully');
              this.setState({ loading: false });
            }
          })
          .catch(function(error) {
            message.destroy();
            this.setState({ loading: false });
            if (error.response) {
              // Request made and server responded
              message.error(error.response.data.error);
            } else if (error.request) {
              // The request was made but no response was received
              message.error('Server not responding');
            } else {
              // Something happened in setting up the request that triggered an Error
              message.error('Error setting up request');
            }
          });
      } else {
        message.error('Please fill out all fields!');
        this.setState({ loading: false });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleChange = e => {
    this.setState({
      user: { ...this.state.user, [e.target.name]: e.target.value }
    });
    console.log(this.sigCanvas.toDataURL());
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

    return (
      <div className="settings-main">
        <Card>
            <h3 className="headers">Main Settings</h3>
            <div className="settings-inner">
              <Spin spinning={this.state.loading}>
                <Form
                  {...formItemLayout}
                  hideRequiredMark
                  name="form"
                  labelAlign="left"
                  onSubmit={this.handleSubmit}
                >
                  <Form.Item style={{ display: 'none' }} label={<span>ID</span>}>
                    {getFieldDecorator('uuid', {
                      initialValue: this.state.user.uuid,
                      valuePropName: 'uuid',
                      rules: [
                        {
                          required: true,
                          message: 'Please input your id!',
                          whitespace: true
                        }
                      ]
                    })(
                      <Input
                        name="uuid"
                        value={this.state.user.uuid}
                        disabled
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label={
                      <span>
                        Username&nbsp;
                        <Tooltip title="What will your username be within the system?">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('username', {
                      initialValue: this.state.user.username,
                      valuePropName: 'username',
                      rules: [
                        {
                          required: true,
                          message: 'Please input your username!',
                          whitespace: true
                        }
                      ]
                    })(
                      <Input
                        name="username"
                        value={this.state.user.username}
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="New password" hasFeedback>
                    {getFieldDecorator('password', {
                      initialValue: this.state.user.password,
                      valuePropName: 'password',
                      rules: [
                        {
                          type: "regexp",
                          pattern: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
                          message: "Wrong format!"
                        }
                      ]
                    })(
                      <Input.Password
                        name="password"
                        value={this.state.user.password}
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<span>First Name</span>}>
                    {getFieldDecorator('fName', {
                      initialValue: this.state.user.fName,
                      valuePropName: 'fname',
                      rules: [
                        {
                          required: true,
                          message: 'Please input your first name!',
                          whitespace: true
                        }
                      ]
                    })(
                      <Input
                        name="fName"
                        value={this.state.user.fName}
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<span>Last Name</span>}>
                    {getFieldDecorator('lName', {
                      initialValue: this.state.user.lName,
                      valuePropName: 'lname',
                      rules: [
                        {
                          required: true,
                          message: 'Please input your last name!',
                          whitespace: true
                        }
                      ]
                    })(
                      <Input
                        name="lName"
                        value={this.state.user.lName}
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="E-mail">
                    {getFieldDecorator('email', {
                      initialValue: this.state.user.email,
                      valuePropName: 'email',
                      rules: [
                        {
                          type: 'email',
                          message: 'The input is not valid E-mail!'
                        },
                        {
                          message: 'Please input your E-mail!'
                        }
                      ]
                    })(
                      <Input
                        name="email"
                        value={this.state.user.email}
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    style={{ display: 'none' }} 
                    label={<span>Title</span>}>
                    {getFieldDecorator('title', {
                      initialValue: this.state.user.title,
                      valuePropName: 'title',
                      rules: [
                        {
                          message: 'Please input your title!',
                          whitespace: true
                        }
                      ]
                    })(
                      <Input
                        name="title"
                        value={this.state.user.title}
                        disabled
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    style={{ display: 'none' }}
                    label={<span>Access Level</span>}
                  >
                    {getFieldDecorator('accessLevelID', {
                      initialValue: this.state.user.accessLevelID,
                      valuePropName: 'accesslevelid'
                    })(
                      <Input
                        name="accessLevelID"
                        value={this.state.user.accessLevelID}
                        disabled
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Item>
                  <SignatureCanvas ref={(ref) => { this.sigCanvas = ref; }} 
                                       penColor='green'
                                       canvasProps={{width: 500, height: 200, className: 'sigCanvas'}}
                                       onEnd={this.handleChange}
                  />
                  <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                      Update
                    </Button>
                  </Form.Item>
                </Form>
              </Spin>
            </div>
          </Card>
      </div>
    );
  }
}

const Settings = Form.create({ name: 'settings' })(SettingsForm);

export default Settings;

// get actions as props when you connect them
// you get redux state objects
// passing it into login as a prop

// get the logged in state from redux
