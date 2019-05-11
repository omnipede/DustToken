import React from 'react';
import {
    Modal, Form, Input, Button, Layout, Icon
} from 'antd';
import './style/style.css';

const {
    Header
} = Layout;

const LoginForm = Form.create({name: 'login'}) (

    class extends React.Component {
        render () {

            const {getFieldDecorator} = this.props.form;
            return (
                <div>
                    <Modal visible={this.props.visible} footer={null} onCancel={this.props.onCancel}>
                        <Layout style={{ background: '#fff' }}>
                            <Header style={{ background: '#fff', padding: 0 }} align="center">
                                <h1> Log in </h1>
                            </Header>
                            <Form className="login-form">
                                <Form.Item>
                                    {getFieldDecorator('username', {
                                        rules: [{ required: true, message: 'Please input your username!' }],
                                    })(
                                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, .25)' }} />} placeholder="User name" />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: 'Please input your passoword!' }],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button" block>
                                        Log in
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Layout>
                    </Modal>
                </div>
            )
        }
    }
);

class LoginPage extends React.Component {
    state = {
        visible: false,
    };

    showModal = () => {
        this.setState({
            visible: true
        })
    }

    handleCancel = (e) => {
        console.log('called');
        this.setState({
            visible: false
        })
    }

    render() {
        return (
            <div>
                <Button 
                    className="login_Btn" type="primary" onClick = {this.showModal}
                > Log in 
                </Button>

                <LoginForm 
                    visible = {this.state.visible}
                    onCancel = {this.handleCancel}
                />
                {console.log(this.state.visible)}
            </div>
            
        )
    }
}

export default LoginPage;