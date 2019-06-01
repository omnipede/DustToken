import React from 'react';
import {Table, Tabs, Button, Icon} from 'antd';
import {Chart} from 'react-google-charts';
import axios from 'axios';
const moment = require('moment-timezone');
const { TabPane } = Tabs;
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

    getChartData () {
        let t = [['Time', 'pm25', 'pm10']]
        let src = [...this.state.dataSource]
        src.reverse();
        src.forEach((item, index, array) => {
            let d = [item.time, Number(item.pm25), Number(item.pm10)]
            t.push(d);
        })
        return t;
    }

    handleDownload = (e) => {
        axios.get('http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/export_data.csv', {
            params: {
                count: 3000
            }
        })
        .then(response => {
            console.log('Hello world')
            const link = document.createElement('a');
            link.href = `export_data.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
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
            this.setState({
                dataCount: i,
                dataSource: [...r]
            })
        })
    }

    render() {
        return(
            <Tabs defaultActiveKey="1">

                <TabPane tab="Data" key="1">
                    <div> 
                        <Button type='primary' style={{margin: '0 0 10px 0'}} href='http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/export_data.csv?count=3000' download> 
                            <Icon type='download' /> Download as csv 
                        </Button>
                        <Table columns={columns} dataSource={this.state.dataSource} /> 
                    </div>
                </TabPane>

                <TabPane tab="Chart" key="2">
                    <Chart
                        height={500}
                        chartType="Line"
                        loader={ <div> loading ... </div> }
                        data={ this.getChartData() }
                        options={{
                            chart: {
                                title: 'PM2.5 & PM10 change',
                                subtitle: 'µg /  m³',
                            },
                        }}
                    />
                </TabPane>

            </Tabs>
        )
    }
}
export default API;