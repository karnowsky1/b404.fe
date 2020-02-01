import React from 'react';
import { NavLink } from 'react-router-dom';
import { MAIN_ROUTES } from '../../constants/routes';
import { Menu, Icon, Button, Dropdown } from 'antd';
import { setUser, setIsLoggedIn } from '../../actions/user';
import { connect } from 'react-redux';
import { TOKEN_KEY, UUID_KEY } from '../../constants/auth';

const profile_icon = 'user'
const SIGNATURES = "1"
const SETTINGS = "2"
const LOG_OUT = "3"  
// const logout_icon = 'logout'

function handleMenuClick(e) {
  console.log('click', e);
  console.log(e.key)
  if (e.key == LOG_OUT) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(UUID_KEY)
    setIsLoggedIn(false)
    // console.log(auth)
  }
}

const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">Signatures</Menu.Item>
    <Menu.Item key="2">Settings</Menu.Item>
    <Menu.Item key="3">
      <NavLink to="/login">
        Log Out
      </NavLink>
    </Menu.Item>
    
  </Menu>
)

class Logout extends React.Component {
  constructor(props) {
    super (props)
  }
  render() {
    const { setIsLoggedIn } = this.props
    return(
      <Dropdown overlay={menu}>
        <Button type="primary" shape="circle">
          <Icon type={profile_icon} />
        </Button>
      </Dropdown>
    )
  }
}

export default connect((state={})=>({}), { setUser, setIsLoggedIn })(Logout)

// export default Logout