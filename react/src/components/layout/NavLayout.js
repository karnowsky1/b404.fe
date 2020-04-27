import React from 'react';
import { Layout, Menu, Icon, notification } from 'antd';
import { NavLink } from 'react-router-dom';
import { MAIN_ROUTES } from '../../constants/routes';
import { connect } from 'react-redux';
import { setTasks } from '../../actions/task';
import Logout from './Logout';
import mainLogo from '../../img/something.jpg';
import { AUTH, PENDING_TASKS_FETCH_REFRESH_TIME } from '../../constants';
import { getPendingTasks, getActiveWorkflows } from '../../utils/api';

const { Header, Sider, Content } = Layout;

const { SubMenu } = Menu;

class NavLayout extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  componentDidMount() {
    this.fetch();
    this.intervalID = setInterval(this.fetch, PENDING_TASKS_FETCH_REFRESH_TIME);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  fetch = async () => {
    const { setTasks } = this.props;
    // what about the first time this.fetch is called?
    // this.fetch will be clean, then I'll have a second function that calls this.fetch() but with extras stuff
    const response = await getPendingTasks();
    if (response.status === 200) {
      if (this.props.pendingTasks) {
        const currentIds = this.props.pendingTasks.map((task) => task.stepID);
        const newIds = response.data.map((task) => task.stepID);
        const updatedWorkflows = new Set();
        newIds.forEach((newId) => {
          if (!currentIds.includes(newId)) {
            const task = response.data.find((task) => task.stepID === newId);
            updatedWorkflows.add(task.workflowID);
          }
        });
        if (updatedWorkflows.size > 0) {
          const workflows = await getActiveWorkflows();
          notification.open({
            message: 'Tasks have been uploaded for the following workflows:',
            description: Array.from(updatedWorkflows)
              .map(
                (workflowID) =>
                  workflows.data.find(
                    (workflow) => workflow.workflowID === workflowID
                  ).name
              )
              .join(', '),
          });
          setTasks(response.data);
        }
      } else {
        setTasks(response.data);
      }
    }
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
              alignItems: 'center',
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
              background: '#fff',
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default connect(
  (state = {}) => ({
    authorization_level: state.user && state.user.accessLevelID,
    isAdmin: state.user && state.user.accessLevelID <= AUTH.ADMIN,
    user_name: state.user.fName + ' ' + state.user.lName,
    pendingTasks: state.pendingTasks,
  }),
  { setTasks }
)(NavLayout);
