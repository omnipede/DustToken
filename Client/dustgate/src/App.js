import React from 'react';
import logo from './logo.svg';
import {
  Layout, Menu, Breadcrumb, Icon
} from 'antd'; 
import './App.css';

const {
  Header, Content, Footer, Sider,
} = Layout;
const SubMenu = Menu.SubMenu;

class App extends React.Component {

  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log (collapsed);
    this.setState({collapsed});
  }
  
  render() {
    return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello world !!! <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    )
  }
}

export default App;
