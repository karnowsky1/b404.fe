import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { NavLink } from 'react-router-dom';
import { MAIN_ROUTES } from '../../constants/routes';
import { connect } from 'react-redux';
import Logout from './Logout';
import mainLogo from '../../img/something.jpg';
import { AUTH, IS_INTERNAL } from '../../constants';

const { Header, Sider, Content } = Layout;

const { SubMenu } = Menu;

class NavLayout extends React.Component {
  state = {
    collapsed: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    return (
      <Layout style={{ height: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          {this.state.collapsed ? (
            <div className="box-for-image">
              <img className="image-url" src={mainLogo} alt="" />
            </div>
          ) : (
            <div className="box-for-logo">
              <div style={{ position: 'fixed' }} className="font-title-logo">
                VENTURE CREATIONS
              </div>
              <div style={{ position: 'fixed' }} className="font-subtitle-logo">
                RIT's Technology Business Incubator
              </div>
            </div>
          )}
          {console.log(` These are the paths:  ${this.props.path}`)}

          <Menu theme="dark" mode="inline" selectedKeys={[this.props.path]}>
            {MAIN_ROUTES.map(({ name, path, icon, auth }) => {
              return (
                auth(this.props.authorization_level) && (
                  <Menu.Item key={path}>
                    {/* {console.log(
                      `this is the auth value ${auth(
                        this.props.authorization_level
                      )}`
                    )} */}
                    {/* {console.log(
                      `this is the authorization level ${this.props.authorization_level}`
                    )} */}
                    <NavLink to={path}>
                      <Icon type={icon} />
                      <span>{name}</span>
                    </NavLink>
                  </Menu.Item>
                )
              );
            })}
            <Menu.Divider style={{ backgroundColor: '#313C4E' }} />
            {/* <div style={{ padding: '10px', fontSize: '.8em' }}>Settings</div> */}
            <Menu.Item key="/main-settings">
              <NavLink to="/main-settings">
                <Icon type="setting" />
                <span>Main Settings</span>
              </NavLink>
            </Menu.Item>
            {this.props.isAdmin && (
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="plus-square" />
                    <span>Admin</span>
                  </span>
                }
              >
                <Menu.Item key="/company">
                  <NavLink to="/company">Companies</NavLink>
                </Menu.Item>
                <Menu.Item key="/people">
                  <NavLink to="/people">Users</NavLink>
                </Menu.Item>
              </SubMenu>
            )}
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              background: '#f06f32',
              padding: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <div style={{ display: 'flex', height: 'inherit' }}>
              <div className="username">
                <p>{this.props.user_name}</p>
              </div>
              <div className="logout">
                <Logout />
              </div>
            </div>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff'
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default connect((state = {}) => ({
  authorization_level: state.user && state.user.accessLevelID,
  isAdmin: state.user && state.user.accessLevelID <= AUTH.ADMIN,
  isInternal: state.user && IS_INTERNAL(state.user.accessLevelID),
  user_name: state.user.fName + ' ' + state.user.lName
}))(NavLayout);
