import {
    Modal, Form, Input, Button, Layout, Icon
} from 'antd';

const LoginForm = Form.create({name: 'login'}) (

    class extends React.Component {
        render () {
            const {
                visible, onCancel, onSubmit, form, 
            } = this.props;
            const {getFieldDecorator} = form;
            return (
                <div>
                    <Modal visible={visible} footer={null} onCancel={onCancel}>
                        <Layout style={{ background: '#fff' }}>
                            <Header style={{ background: '#fff', padding: 0 }} align="center">
                                <h1> Log in </h1>
                            </Header>
                            <Form onSubmit={onSubmit} className="login-form">
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