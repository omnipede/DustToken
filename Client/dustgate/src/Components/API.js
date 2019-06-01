import React from 'react';
import {Table, Tabs, Button, Icon } from 'antd';
import {Chart} from 'react-google-charts';
import axios from 'axios';
const moment = require('moment-timezone');
const { TabPane } = Tabs;
const columns = [
    { title: 'Location', dataIndex: 'location'}, 
    { title: 'pm25', dataIndex: 'pm25'},
    { title: 'pm10', dataIndex: 'pm10'},
    { title: 'Time', dataIndex: 'time'}
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
            <Tabs defaultActiveKey="0">

                <TabPane tab="API" key="0">
                    <h1>미세먼지 데이터 API</h1>
                    <div style={{backgroundColor:'#f8f9fa', margin: '0 0 8px', padding: '12px'}} >
                        <a href='http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/get_data?from=1559307591528&to=1559308187629&count=128'> 
                        http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/get_data?from=1559307591528&to=1559308187629&count=128
                        </a>
                    </div>
                    <h1> Transaction 데이터 API </h1>
                    <div style={{backgroundColor:'#f8f9fa', margin: '0 0 8px', padding: '12px'}} >
                        <a href='http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/get_transaction?from=1559307591528&to=1559308187629&count=128'> 
                        http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/get_transaction?from=1559307591528&to=1559308187629&count=128
                        </a>
                    </div>

                </TabPane>

                <TabPane tab="Data" key="1">
                    <div> 
                        <Button type='primary' style={{margin: '0 0 10px 0'}} 
                            href='http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/export_data.csv?count=3000' download> 
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