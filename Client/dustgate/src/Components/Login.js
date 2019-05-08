import React from 'react';
import {
    Modal, Form, Input, Button, Layout, Icon
} from 'antd';
import "antd/dist/antd.css";

const {
    Header
} = Layout;

/* Login modal component. */
class Login extends React.Component {

    state = {
        visible: false
    }

    constructor(props){
        super();
        this.state = {
            visible: props.visible
        }
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        })
    }

    render() {
        return(
        <div> 
          <Modal visible={this.state.visible} footer={null} onCancel={this.handleCancel}>
             <Layout>
               <Header style={{background: '#fff', padding: 0}} align="center">
                 <h1> Log in </h1>
               </Header>
                 <Form className="login-form">
                  <Form.Item> 
                   <Input prefix={<Icon type="user" style={{color: 'rgba(0, 0, 0, .25)'}}/>} placeholder="User name"/>
                  </Form.Item>
                  <Form.Item>
                   <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                  </Form.Item>
                 </Form>
                 <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                 </Button>
             </Layout>
          </Modal>
        </div>
        );
    }
}

export default Login;