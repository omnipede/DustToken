import React from 'react';
import {
    Layout, Menu, Icon,
} from 'antd';

import "antd/dist/antd.css";
import '../App.css';

import logo from '../logo_white.png';
const {
    Sider
} = Layout;

class Menubar extends React.Component {
   render() {
       return(
           <Sider
               trigger={null}
               collapsible
               collapsed={this.props.collapsed}
           >
               <div>
                   {
                       this.props.collapsed === false
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
               <Menu theme="dark" defaultSelectedKeys={['Intro.']} mode="inline" onClick={this.props.onMenuClick}>
                   <Menu.Item key="Intro.">
                       <Icon type="home" />
                       <span> Intro. </span>
                   </Menu.Item>
                   <Menu.Item key="Device">
                       <Icon type="mobile" />
                       <span> Device </span>
                   </Menu.Item>
                   <Menu.Item key="API">
                       <Icon type="bar-chart" />
                       <span> API </span>
                   </Menu.Item>
                   <Menu.Item key="Block chain">
                       <Icon type="desktop" />
                       <span> Block chain </span>
                   </Menu.Item>
               </Menu>
           </Sider>
       )
   }
}

export default Menubar;