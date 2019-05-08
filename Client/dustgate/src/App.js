import React from 'react';
import {
  Layout, Menu, Icon,
} from 'antd'; 
import Login from './Components/Login';
import "antd/dist/antd.css";
import './App.css';
import logo from './logo_white.png';

const {
  Header, Content, Footer, Sider,
} = Layout;

class App extends React.Component {
  state = {
    collapsed: false, 
    menuKey: "1"
  };

  /* Menu collapse callback */
  onCollapse = (collapsed) => {
    this.setState({collapsed});
  };

  /* Menu handling callback */
  onMenuClick = (e) => {
    /* Debug purpose */
    console.log('click', e);
    this.setState({
      menuKey: e.key
    })
  };

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div>
          {
            this.state.collapsed === false
              ? (
              <div className="logo"> 
              <img src={logo} width="168px" height="32px" alt="Logo" />
              </div>
              )
              : (
              <div className="logo"> 
              </div>
              )
          }
          </div>
          
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick = {this.onMenuClick}>
            <Menu.Item key="1">
              <Icon type="pie-chart" />
              <span> Intro. </span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="desktop" />
              <span> login / signin </span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="desktop" />
              <span> Device </span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="desktop" />
              <span> API </span>
            </Menu.Item>
            <Menu.Item key="5">
              <Icon type="desktop" />
              <span> Block chain </span>
            </Menu.Item>
          </Menu>
        </Sider>

        <Login />

        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '16px 16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              Bill is a cat.
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            3월29일 ©2019 Created by omnipede
          </Footer>
        </Layout>
      </Layout>

    );
  }
}

export default App;
