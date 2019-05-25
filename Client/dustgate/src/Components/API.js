import React from 'react';
import {Table} from 'antd';
import axios from 'axios';
const moment = require('moment-timezone');
const columns = [
    {
        title: 'Location',
        dataIndex: 'location'
    },
    {
        title: 'pm25',
        dataIndex: 'pm25'
    },
    {
        title: 'pm10',
        dataIndex: 'pm10'
    },
    {
        title: 'Time',
        dataIndex: 'time'
    }
]

class API extends React.Component{
    state = {
        dataCount: 0,
        dataSource: []
    }

    componentDidMount() {
        axios.get('http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/list')
        .then(response => {
            let i = this.state.dataCount;
            let r = response.data.map((v) => {
                v.key = i++;
                v.time = moment(new Date(Number(v.time))).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
                return v;
            })
            console.log(r);
            this.setState({
                dataSource: [...r]
            })
        })
    }

    render() {
        return(
            <div> <Table columns={columns} dataSource={this.state.dataSource} /> </div>
        )
    }
}
export default API;