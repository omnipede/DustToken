import React from 'react';
import {Button, Icon, Table, Modal, Layout, Form, Input} from 'antd';
import 'antd/dist/antd.css';
const {
    Header
} = Layout;
const columns = [
    {
        title: 'Device id',
        dataIndex: 'device_id',
        key: 'device_id'
    },
    {
        title: 'Wallet',
        dataIndex: 'wallet',
        key: 'wallet',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action'
    }
]

let data = [
    {
        key: '1',
        device_id: 'John Brown',
        wallet: 32
    },
    {
        key: '2',
        device_id: 'Jim Green',
        wallet: 42
    }
]

const Device = Form.create({name: 'device_register'})( 
    class extends React.Component{
    state = {
        visible: false,
        key: '1'
    }
    add = (e) => {
        this.setState({visible: true});
    }
    cancel = () => {
        this.setState({visible: false});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields((err, values) => {
            if (!err){
                console.log('Received values of form: ', values);
                this.props.form.resetFields();
                this.setState({visible: false});
                data.push({key: this.state.key, device_id: values.device_id, wallet: values.wallet_address})
            }
        })
    }

    getRegister (){
        const {getFieldDecorator} = this.props.form;
        return (
        <Modal visible = {this.state.visible} footer = {null} onCancel={this.cancel}>
            <Layout style={{ background: '#fff' }}>
                <Header style={{background: '#fff', padding: 0}} align="center">
                    <h1>Register device</h1>
                </Header>
                <Form>
                    <Form.Item label="Device id">
                        {getFieldDecorator('device_id', {
                            rules: [{required: true, message: 'Please input device id!'},]
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="Wallet address">
                        {getFieldDecorator('wallet_address', {
                            rules: [{required: true, message: 'Please input your wallet address!'},]
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={this.handleSubmit} htmlType="submit">Register</Button>
                    </Form.Item>
                </Form>
            </Layout>
        </Modal>
        ) 
    }
    render() {
        return(
            <div style={{padding: '0 0 0 5%'}}>
                {this.getRegister()}
                <div style={{padding: '0 0 0 65%'}}>
                    <Button type="primary" onClick={this.add}> <Icon type="plus" /> Add </Button>
                </div>
                <Table columns={columns} dataSource={data} style={{width: '60%'}}/>
            </div>
        )
    }
})
export default Device;