import React from 'react'
import { Form,
  Input, 
  Tooltip,
  Icon,
  Button,
  message } from 'antd'
import axios from 'axios'
import qs from 'qs'
import { TOKEN_KEY, UUID_KEY } from '../../constants/auth'

class SettingsForm extends React.Component {

  constructor(props) {
    super (props)
    this.state = {
        user: {},
        confirmDirty: false,
        autoCompleteResult: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    const url = window.__env__.API_URL + '/blink/api/person/id/' + localStorage.getItem(UUID_KEY);
    axios.get(
      url,
      {
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded',
          'Authorization' : localStorage.getItem(TOKEN_KEY)
        }
      }
    ).then(response => {
      if (response.status === 200){
        this.setState({
          user: response.data
        })
      }
    }).catch(function (error) {
      message.destroy()
      if (error.response) {
        // Request made and server responded
        message.error(error.response.data.error);
      } else if (error.request) {
        // The request was made but no response was received
        message.error("Server not responding");
      } else {
        // Something happened in setting up the request that triggered an Error
        message.error("Error setting up request");
      }
    });
  }

  handleSubmit = async e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {UUID, username, password, fName, lName, email, title, accessLevelID} = this.state.user
        const id = UUID
        const url = window.__env__.API_URL + '/blink/api/person'
        axios.put(
          url,
          qs.stringify({
            id,
            username,
            password,
            fName,
            lName,
            email,
            title,
            accessLevelID
          }),
          {
            headers: {
              'Content-Type' : 'application/x-www-form-urlencoded',
              'Authorization' : localStorage.getItem(TOKEN_KEY)
            }
          }
        ).then(response => {
          if (response.status === 200){
            message.success('Data saved successfully');
          }
        }).catch(function (error) {
          message.destroy()
          if (error.response) {
            // Request made and server responded
            message.error(error.response.data.error);
          } else if (error.request) {
            // The request was made but no response was received
            message.error("Server not responding");
          } else {
            // Something happened in setting up the request that triggered an Error
            message.error("Error setting up request");
          }
        });
      } else message.error('Please fill out all fields!')
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleChange = (e) => {
    this.setState( { user: {...this.state.user, [e.target.name]: e.target.value }})
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;
    console.log(this.state.user)

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    
    return (
      <div className="settings-main">
      <Form {...formItemLayout} hideRequiredMark name='form' labelAlign ="left" onSubmit={this.handleSubmit}>
      <Form.Item
          style={{display: 'none'}}
          label={
            <span>
              ID
            </span>
          }
        >
          {getFieldDecorator('UUID', {
            initialValue: this.state.user.UUID,
            valuePropName: 'uuid',
            rules: [{ required: true, message: 'Please input your id!', whitespace: true }],
          })(<Input name='UUID' value={this.state.user.UUID} disabled onChange = {this.handleChange} />)}
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
            rules: [{ required: true, message: 'Please input your username!', whitespace: true }],
          })(<Input name='username' value={this.state.user.username} onChange={this.handleChange} />)}
        </Form.Item>
        <Form.Item label="Password" hasFeedback>
          {getFieldDecorator('password', {
            initialValue: this.state.user.password,
            valuePropName: 'password',
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password name='password' value={this.state.user.password} onChange = {this.handleChange} />)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              First Name
            </span>
          }
        >
          {getFieldDecorator('fName', {
            initialValue: this.state.user.fName,
            valuePropName: 'fname',
            rules: [{ required: true, message: 'Please input your first name!', whitespace: true }],
          })(<Input name='fName' value={this.state.user.fName} onChange = {this.handleChange} />)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Last Name
            </span>
          }
        >
          {getFieldDecorator('lName', {
            initialValue: this.state.user.lName,
            valuePropName: 'lname',
            rules: [{ required: true, message: 'Please input your last name!', whitespace: true }],
          })(<Input name='lName' value={this.state.user.lName} onChange = {this.handleChange} />)}
        </Form.Item>
        <Form.Item label="E-mail">
          {getFieldDecorator('email', {
            initialValue: this.state.user.email,
            valuePropName: 'email',
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input name='email' value={this.state.user.email} onChange = {this.handleChange} />)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Title
            </span>
          }
        >
          {getFieldDecorator('title', {
            initialValue: this.state.user.title,
            valuePropName: 'title',
            rules: [{ required: true, message: 'Please input your title!', whitespace: true }],
          })(<Input name='title' value={this.state.user.title} disabled onChange = {this.handleChange} />)}
        </Form.Item>
        <Form.Item
          style={{display: 'none'}}
          label={
            <span>
              Access Level
            </span>
          }
        >
          {getFieldDecorator('accessLevelID', {
            initialValue: this.state.user.accessLevelID,
            valuePropName: 'accesslevelid'
          })(<Input name='accessLevelID' value={this.state.user.accessLevelID} disabled onChange = {this.handleChange} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
      </div>
    );
  }
}

const Settings = Form.create({ name: 'settings' })(SettingsForm)

export default Settings;

// get actions as props when you connect them 
// you get redux state objects 
// passing it into login as a prop 

// get the logged in state from redux 