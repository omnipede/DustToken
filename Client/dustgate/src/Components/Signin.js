import React from 'react';
import {
    Modal, Form, Input, Button,
} from 'antd';
import 'antd/dist/antd.css';
import './style/style.css';


const SigninForm = Form.create({name: 'signin'})(

    class extends React.Component {
        render(){
            const {getFieldDecorator} = this.props.form;
            return(
                <div>
                    <Modal visible={this.props.visible} footer={null}>
                        <Form>
                            <Form.Item label="E-mail">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Password" >
                                <Input type="password" />
                            </Form.Item>
                            <Form.Item label="Confirm Password">
                                <Input type="password" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Sign in</Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            )
        }
    }
);

class SigninPage extends React.Component {
    state = {
        visible: false, 
    }

    showModal = () => {
        this.setState({
            visible: true
        })
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        return(
            <React.Fragment>
                <Button
                    className="signin_Btn" onClick={this.showModal}
                > Sign in
                </Button>
            </React.Fragment>
        )
    }
}

export default SigninPage;