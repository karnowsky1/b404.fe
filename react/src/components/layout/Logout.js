import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Icon, Button, Dropdown } from 'antd';
import { setUser, setIsLoggedIn } from '../../actions/user';
import { connect } from 'react-redux';
import { TOKEN_KEY, UUID_KEY } from '../../constants/auth';

class Logout extends React.Component {
  constructor(props) {
    super (props)
    this.state = {
      authed: ''
    }
  }

  render() {
    const { setIsLoggedIn } = this.props
    const profile_icon = 'user'
    // const SETTINGS = "2"
    const LOG_OUT = "3"  
    // const logout_icon = 'logout'

    function handleMenuClick(e) {
      console.log('click', e);
      console.log(e.key)
      if (e.key === LOG_OUT) {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(UUID_KEY)
        setIsLoggedIn(false)
      }
    }
    
    const menu = (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="2">
          <NavLink to="/main-settings">
            Settings
          </NavLink>
        </Menu.Item>
        <Menu.Item key="3">
          <NavLink to="/login">
            Log Out
          </NavLink>
        </Menu.Item>
      </Menu>
    )
    
    return(
      <Dropdown overlay={menu}>
        <Button style={{backgroundColor: '#001529'}} type="primary" shape="circle">
          <Icon type={profile_icon} />
        </Button>
      </Dropdown>
    )
  }
}

export default connect((state={})=>({authed: state.isLoggedIn}), { setUser, setIsLoggedIn })(Logout)

// export default Logout