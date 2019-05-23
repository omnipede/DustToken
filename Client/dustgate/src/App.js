import React from 'react';
import {
  Layout, Icon, Button, Row, Col
} from 'antd'; 

import LoginPage from './Components/Login';
import Menubar from './Components/Menubar';
import SigninPage from './Components/Signup';
import Device from './Components/Device';
import Template from './Components/Template';

import "antd/dist/antd.css";
import './App.css';

import logo_black from './logo_black.png';

const {
  Header, Content, Footer,
} = Layout;

class App extends React.Component {
  state = {
    collapsed: false, 
    nav: "Intro.",
    visible: false,
    login: false
  };

  userInfo = {
    username: null
  }

  /* Menu toggle callback. */
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  /* Menu handling callback */
  handleMenuClick = (e) => {
    this.setState({
      nav: e.key,
    })
  };

  handleLogin = (username) => {
    console.log(username);
    this.userInfo.username = username;
    this.setState({
      login: true
    })
  }

  handleLogout = (e) => {
    this.userInfo.username = undefined;
    this.setState({
      login: false
    })
  }

  getContent () {
    switch(this.state.nav){
      case "Intro.": 
      return <Template text="Intro." />
      case "Device": 
      return <Device 
        text="Device" 
        username={this.userInfo.username} 
      />
      case "API": 
      return <Template text="API" />
      case "Block chain": 
      return <Template text="Block chain" />
      default: ;
    }
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Menubar collapsed={this.state.collapsed} onMenuClick={this.handleMenuClick} />
        <Layout>
          <Header style={{ background: 'rgba(0, 0, 0, 0)', padding: 0 }} >
            <Row>
              <Col span={8}>
            <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} style={{fontSize: '32px'}}/>
            <img src={logo_black}  alt="Logo" className="logo_in" />
              </Col>
            {
              this.state.login === false
              ? /*<div style={{ width: '512px', height: '64px', float: 'right' }}>*/
                <Col span={16}>
                <LoginPage onLogin={this.handleLogin} />
                <SigninPage />
                </Col>
                /*</div>*/
              : /*<div style={{ width: '256px', height: '64px', float: 'right' }}> */
              <Col span={16}>
                Welcome <i>{"" + this.userInfo.username}! {' '} </i>
                <Button type="danger" onClick={this.handleLogout}>log out</Button>
                </Col>
              /*</div> */
            }
            </Row>
          </Header>
          <Content style={{ margin: '16px 16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              { this.getContent() }
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Copyright © Since 2019 3월29일, Inc. Created by omnipede
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;