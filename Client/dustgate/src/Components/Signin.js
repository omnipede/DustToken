import React from 'react';
import {
    Modal, Form, Input, Button,
} from 'antd';
import 'antd/dist/antd.css';
import './style/style.css';


const SigninForm = Form.create({name: 'signin'})(

    class extends React.Component {

        state = {
            confirmDirty: false
        }

        handleConfirmBlur = (e) => {
            const value = e.target.value;
            this.setState({ confirmDirty: this.state.confirmDirty || !!value });
        }

        compareToFirstPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && value !== form.getFieldValue('password')) {
                callback('Two passwords that you enter is inconsistent!');
            } else {
                callback();
            }
        }

        validateToNextPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && this.state.confirmDirty) {
                form.validateFields(['confirm'], {force: true});
            }
            callback();
        }

        render(){
            const {getFieldDecorator} = this.props.form;
            return(
                <div>
                    <Modal visible={this.props.visible} footer={null} onCancel = {this.props.onCancel} >
                        <Form onSubmit = {this.props.onSubmit}> {/*
                            <Form.Item label="E-mail">
                                {getFieldDecorator('email', {
                                    rules: [{
                                        type: 'email', message: 'The input is not valid E-mail', 
                                    }, {
                                        required: 'true', message: 'Please input your E-mail!',
                                    }], 
                                }) (
                                    <Input />
                                )}
                                </Form.Item> */}
                            <Form.Item label="Username">
                                {getFieldDecorator('username', {
                                    rules: [{
                                        required: true, message: 'Please input your username!',
                                    }]
                                }) (
                                    <Input />
                                )}
                            </Form.Item>
                            <Form.Item label="Password" >
                                {getFieldDecorator('password', {
                                    rules: [{
                                        required: true, message: 'Please input your password!'
                                    }, {
                                        validator: this.validateToNextPassword,
                                    }]
                                })(
                                    <Input type="password" />
                                )}
                            </Form.Item>
                            <Form.Item label="Confirm Password">
                                {getFieldDecorator('confirm', {
                                    rules: [{
                                        required: true, message: 'Please confirm your password!'
                                    }, {
                                        validator: this.compareToFirstPassword,
                                    }]
                                })(
                                    <Input type="password" onBlur={this.handleConfirmBlur} />
                                )}
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

    handleCancel = (e) => {
        this.setState({
            visible: false
        })
    } 

    handleSubmit = (e) => {
        const form = this.formRef.props.form;
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                form.resetFields();
                this.setState({ visible: false })
            }
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

                <SigninForm 
                    wrappedComponentRef = {this.saveFormRef}
                    visible = {this.state.visible}
                    onCancel = {this.handleCancel} 
                    onSubmit = {this.handleSubmit} />
            </React.Fragment>
        )
    }
}

export default SigninPage;