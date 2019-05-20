import React from 'react';
import {Button, Icon, Table} from 'antd';
import 'antd/dist/antd.css';
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

class Device extends React.Component{
    render() {
        return(
            <div style={{padding: '0 0 0 5%'}}>
                <div style={{padding: '0 0 0 65%'}}>
                    <Button type="primary"> <Icon type="plus" /> Add </Button>
                </div>
                <Table columns={columns} dataSource={data} style={{width: '60%'}}/>
            </div>
        )
    }
}
export default Device;