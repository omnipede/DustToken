import React from 'react';
import {
  Layout, Icon, Button
} from 'antd'; 

import LoginPage from './Components/Login';
import Menubar from './Components/Menubar';
import SigninPage from './Components/Signup';

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
    /* Debug purpose */
    console.log('click', e);
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

  getContent = () => {
    switch(this.state.nav){
      case "Intro.":
      break;
      case "Device":
      break;
      case "API":
      break;
      case "Block chain":
      break;
      default:
      break;
    }
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Menubar collapsed={this.state.collapsed} onMenuClick={this.handleMenuClick} />
        <Layout>
          <Header style={{ background: 'rgba(0, 0, 0, 0)', padding: 0 }} >
            <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} style={{fontSize: '32px'}}/>
            <img src={logo_black}  alt="Logo" className="logo_in" />
            
            { this.state.login === false
              ? <div style={{width: '512px', height: '64px', float: 'right'}}>
              <LoginPage onLogin = {this.handleLogin} />
              <SigninPage /> 
              </div>
              : <div style={{width: '256px', height: '64px', float: 'right'}}>
              Welcome <i>{"" + this.userInfo.username}! {' '} </i> 
              <Button type="danger" onClick={this.handleLogout}>log out</Button>
              </div>}
          </Header>
          <Content style={{ margin: '16px 16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            { this.state.nav === "login" 
            /*getContent() 구현 */
            ? <div> this is page two </div>
            : <div> this is not page two </div>
            }
              Bill is a cat.
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