import React from 'react';
import {Button, Icon, Table, Modal, Layout, Form, Input} from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
const {
    Header
} = Layout;

const Device = Form.create({name: 'device_register'})( 
    class extends React.Component{
        state = {
            visible: false,
            dataSource: [],
            dataCount: 0
        }

        columns = [
            { title: 'Device id', dataIndex: 'device_id', key: 'device_id'},
            { title: 'Location', dataIndex: 'location', key: 'location'},
            { title: 'Wallet Address', dataIndex: 'wallet_address', key: 'wallet_address', },
            { title: 'Action', dataIndex: 'action',
                render: (text, record) => <Button type="danger" onClick={() => this.handleDelete(record)}> Delete </Button>
            }
        ]
        
        componentDidMount() {
            axios.get('http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/device/list', {
                params: {
                    username: this.props.username
                }
            })
            .then(response => {
                let t = [];
                let c = this.state.dataCount;
                response.data.forEach(function(item, index, array) {
                    const newData = {
                        key: c,
                        location: item.location,
                        device_id: item.device_id,
                        wallet_address: item.wallet_address
                    }
                    t.push(newData);
                    c += 1;
                })
                this.setState({
                    dataCount: c,
                    dataSource: [...t]
                })
            })
        }

        add = (e) => {
            this.setState({ visible: true });
        }
        cancel = () => {
            this.setState({ visible: false });
        }

        handleDelete = (record) => {
            const dataSource = [...this.state.dataSource];
            this.setState({
                dataSource: dataSource.filter(item => item.key !== record.key)
            })
            axios.get('http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/device/delete', {
                params: {
                    device_id: record.device_id
                }
            }).then(response => {
                /* Error */
            })
        }

        handleSubmit = (e) => {
            e.preventDefault();
            const { validateFields } = this.props.form;
            validateFields((err, values) => {
                if (!err) {
                    console.log(values);
                    this.props.form.resetFields();
                    const newData = {
                        key: this.state.dataCount,
                        device_id: values.device_id,
                        location: values.location,
                        wallet_address: values.wallet_address
                    }
                    axios.get('http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/device/add', {
                        params: {
                            username: this.props.username,
                            device_id: newData.device_id,
                            loc: newData.location,
                            wallet_address: newData.wallet_address
                        }
                    }).then(response => {
                        /* Error */
                    })
                    this.setState({
                        visible: false,
                        dataSource: [...this.state.dataSource, newData],
                        dataCount: this.state.dataCount + 1
                    })
                }
            })
        }

        getRegister() {
            const { getFieldDecorator } = this.props.form;
            return (
                <Modal visible={this.state.visible} footer={null} onCancel={this.cancel}>
                    <Layout style={{ background: '#fff' }}>
                        <Header style={{ background: '#fff', padding: 0 }} align="center">
                            <h1>Register device</h1>
                        </Header>
                        <Form>
                            <Form.Item label="Device id">
                                {getFieldDecorator('device_id', {
                                    rules: [{ required: true, message: 'Please input device id!' },]
                                })(
                                    <Input />
                                )}
                            </Form.Item>
                            <Form.Item label="Location">
                                {getFieldDecorator('location', {
                                    rules: [{ required: true, message: 'Please input location!'},]
                                })(
                                    <Input />
                                )}
                            </Form.Item>
                            <Form.Item label="Wallet address">
                                {getFieldDecorator('wallet_address', {
                                    rules: [{ required: true, message: 'Please input your wallet address!' },]
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
            return (
                <div style={{ padding: '0 0 0 5%' }}>
                    {this.getRegister()}
                    <div style={{ padding: '0 0 0 65%' }}>
                        <Button type="primary" onClick={this.add}> <Icon type="plus" /> Add </Button>
                    </div>
                    <Table columns={this.columns} dataSource={this.state.dataSource} style={{ width: '60%' }} pagination={false}/>
                </div>
            )
        }
})
export default Device;