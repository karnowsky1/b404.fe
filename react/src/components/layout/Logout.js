import React from 'react';
import { NavLink } from 'react-router-dom';
import { MAIN_ROUTES } from '../../constants/routes';
import { Menu, Icon, Button, Dropdown } from 'antd';

const profile_icon = 'user'
// const logout_icon = 'logout'

function handleMenuClick(e) {
  console.log('click', e);
}

const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">Signatures</Menu.Item>
    <Menu.Item key="2">Settings</Menu.Item>
    <Menu.Item key="3">Log Out</Menu.Item>
  </Menu>
)

class Logout extends React.Component {
  state = {
    collapsed: false
  }

  toggle = () =>{
    this.setState({
      collapsed: !this.collapsed
    })
  }

  render() {
    return(
      <Dropdown overlay={menu}>
        <Button type="primary" shape="circle">
          <Icon type={profile_icon} />
        </Button>
      </Dropdown>
    )
  }
}

export default Logout