import React from 'react'
import { Form, Icon, Input, Button, Checkbox, message } from 'antd'
import { connect } from 'react-redux'
import { setUser, setIsLoggedIn } from '../../actions/user'
import axios from 'axios'
import qs from 'qs'
import { Redirect } from 'react-router-dom'
import Logo from '../../img/VC2.png'
import { Card } from 'antd'
import { Typography } from 'antd'
import { TOKEN_KEY, UUID_KEY } from '../../constants/auth'

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
    const { setUser, setIsLoggedIn } = this.props // set user is coming from props
    // imported setUser is being given to connect, then it's connecting via dispatch
    // the export default connect is what allows me to use it JS
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
    const { username, password } = this.state
    const url = window.__env__.API_URL + '/blink/api/login'
    await axios.post(
      url,
      qs.stringify({
        // username: btoa(username),
        // password: btoa(password)
        username,
        password
      }),
      {
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      }
    ).then(response => {
      if (response.status === 200){
        setUser(response.data)
        localStorage.setItem(TOKEN_KEY, response.headers.authorization)
        localStorage.setItem(UUID_KEY, response.data.UUID)
        setIsLoggedIn(true)
      }
    }).catch(function (error) {
      message.destroy()
      if (error.response) {
        // Request made and server responded
        message.error(error.response.data.error);
      } else if (error.request) {
        // The request was made but no response was received
        message.error(error.response.data.error);
      } else {
        // Something happened in setting up the request that triggered an Error
        message.error(error.response.data.error);
      }
    });
  };

  handleChange = e =>{
    const {name, value} = e.target
    this.setState({ [name]: value })
  }

  render() {
    const { /**errors,*/ username, password, /**isLoading*/ } = this.state
    const { getFieldDecorator } = this.props.form
    const { isLoggedIn } = this.props
    const gridStyle = {
      width: '50%',
      height: '100%',
    };
    const { Title } = Typography;
    return isLoggedIn?(
      <Redirect to = '/dashboard' />
    ):(
      <div className="login-container">
          <Card.Grid hoverable={false} style={gridStyle}>
            <div className="bkg-container">
              <div className="img-container">
                <img src={Logo} alt="Not Available"/>
              </div>
            </div>
          </Card.Grid>
          <Card.Grid hoverable={false} style={gridStyle}>
            
            <Form onSubmit={this.handleSubmit} className="login-form" id="login-form">
            <Title level={3}>Login</Title>
            <Form.Item>
              {getFieldDecorator('username', {
                valuePropName: 'username',
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
                valuePropName: 'password',
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
            <p id="API_URL">API URL: {window.__env__.API_URL}</p>
          </Form>
        
        {/* <h1>{this.state.username}</h1> */}
        {/* <h1>{this.state.password}</h1> */}
        <h1>{this.props.user&&this.props.user.name}</h1>
          </Card.Grid>
      </div>
    );
  }
}

const Login = Form.create({ name: 'normal_login' })(LoginForm)

export default connect((state={})=>({user: state.user, isLoggedIn: state.isLoggedIn}), {setUser, setIsLoggedIn})(Login)

// get actions as props when you connect them 
// you get redux state objects 
// passing it into login as a prop 

// get the logged in state from redux 