import React from 'react';
import {Table, Tabs} from 'antd';
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
        let t = [['time', 'pm25', 'pm10']]
        let src = [...this.state.dataSource]
        src.reverse();
        src.forEach((item, index, array) => {
            let d = [item.time, Number(item.pm25), Number(item.pm10)]
            //console.log(moment(new Date(item.time)).tz('Asia/Seoul').format('HH:mm'));
            t.push(d);
        })
        return t;
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
                dataSource: [...r]
            })
        })
    }

    render() {
        return(
            <Tabs defaultActiveKey="1">
                <TabPane tab="Data" key="1">
                    <div> <Table columns={columns} dataSource={this.state.dataSource} /> </div>
                </TabPane>
                <TabPane tab="Chart" key="2">
                    <Chart
                        height={500}
                        chartType="Line"
                        loader={
                            <div> loading ... </div>
                            
                        }
                        data={
                            this.getChartData()
                            /*[
                            [
                                'time',
                                'pm2.5',
                                'pm10',
                            ],
                            [1, 37.8, 80.8],
                            [2, 30.9, 69.5],
                            [3, 25.4, 57],
                            [4, 11.7, 18.8],
                            [5, 11.9, 17.6],
                            [6, 8.8, 13.6],
                            [7, 7.6, 12.3],
                            [8, 12.3, 29.2],
                            [9, 16.9, 42.9],
                            [10, 12.8, 30.9],
                            [11, 5.3, 7.9],
                            [12, 6.6, 8.4],
                            [13, 4.8, 6.3],
                            [14, 4.2, 6.2],
                        ] */}
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