import React from 'react';
import { Layout, Menu, Icon } from 'antd';

const { Header, Sider, Content } = Layout;

class NavLayout extends React.Component {
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
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="dashboard" />
              <span>Dashboard</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="form" />
              <span>Documents</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="snippets" />
              <span>Workflow</span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="edit" />
              <span>Signatures</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
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
            Content
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default NavLayout;