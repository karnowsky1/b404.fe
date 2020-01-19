import React from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
import { connect } from 'react-redux'
import { login } from '../../actions/login'
import axios from 'axios'

class LoginForm extends React.Component {

  constructor(props) {
    super (props)
    this.state = {
      username: '',
      password: '',
      isLoading: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit = async e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    });
    const { username, password } = this.state
    const url = window.__env__.API_URL + '/blink/api/login'
    const response = await axios.post(
      url,
      {
        username,
        password
      },
      {
        headers: {
          'Content-Type' : 'x-www-form-urlencoded'
        }
      }
    )
    console.log(response.data)
    if (response.status == 200) this.context.router.push('/')
  };

  handleChange = e =>{
    const {name, value} = e.target
    this.setState({ [name]: value })
  }

  render() {
    const {errors, username, password, isLoading} = this.state
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login-container">
        <Form onSubmit={this.handleSubmit} className="login-form" id="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input
                name = "username"
                value = {username}
                prefix = {<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder = "Username"
                onChange = {this.handleChange}
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                name = "password"
                value = {password}
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
                onChange = {this.handleChange}
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>Remember me</Checkbox>)}
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      <p id="API_URL">API URL: {window.__env__.API_URL}</p>
      {/* <h1>{this.state.username}</h1> */}
      {/* <h1>{this.state.password}</h1> */}
      </div>
    );
  }
}

const Login = Form.create({ name: 'normal_login' })(LoginForm)

export default connect(null, {login})(Login)