import React from 'react';
import { Layout, Menu, Icon, Divider } from 'antd';
import { NavLink } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

class MainSettingsLayout extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Layout style={{ height: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['5']}>
            <Menu.Item key="1">
            <NavLink to="/dashboard">
              <Icon type="dashboard" />
              <span>Dashboard</span>
            </NavLink>   
            </Menu.Item>
            <Menu.Item key="2">
            <NavLink to="/documents">
              <Icon type="form" />
              <span>Documents</span>
            </NavLink>  
            </Menu.Item>
            <Menu.Item key="3">
            <NavLink to="/workflow">
              <Icon type="snippets" />
              <span>Workflow</span>
            </NavLink>  
            </Menu.Item>
            <Menu.Item key="4">
            <NavLink to="/signatures">
              <Icon type="edit" />
              <span>Signatures</span>
            </NavLink>
            </Menu.Item>
            <Divider style={{margin: "10px"}}/>
            <div style={{padding: "10px"}}>Settings</div>
            <Menu.Item key="5">
            <NavLink to="/main-settings">
              <Icon type="setting" />
              <span>Main Settings</span>
            </NavLink>  
            </Menu.Item>
            <Menu.Item key="6">
            <NavLink to="/admin">
              <Icon type="plus-square" />
              <span>Admin</span>
            </NavLink>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#f06f32', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff'
            }}
          >
            Main Settings
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default MainSettingsLayout;