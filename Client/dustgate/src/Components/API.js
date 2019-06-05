import React from 'react';
import {Table, Tabs, Button, Icon, Modal } from 'antd';
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
const config = require( '../ethereum/config.json');

class API extends React.Component{
    state = {
        dataCount: 0,
        dataSource: [],
        visible: false
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
        const Web3 = require('web3');
        const web3 = new Web3(Web3.givenProvider)
        let dusttoken = undefined;
        if (typeof web3 !== undefined) {
            dusttoken = new web3.eth.Contract(config.abi, config.address);
        }
        return(
            <Tabs defaultActiveKey="0">
                <TabPane tab="API" key="0">
                    <Modal title="Your api key generated!"
                        visible={this.state.visible}
                        onOk = {(e)=>{this.setState({visible: false})}}
                        onCancel = {(e)=>{this.setState({visible: false})}}>
                        <b> 0x0111122333 </b>
                    </Modal>
                    <Button type="primary" style={{ margin: '0 0 20px 0' }}
                        onClick = {async (e) =>{
                            e.preventDefault();
                            if (dusttoken !== undefined && web3 !== undefined) {
                                let accounts = await web3.eth.requestAccounts()
                                dusttoken.methods.transfer("0x0164214FF43A46c8ad6C399811576ABFaB68FA42", web3.utils.toHex(1e18))
                                .send({from: accounts[0]}, (err, txHash) => {
                                    if (!err){
                                       this.setState({visible: true})
                                    }
                                })
                            }
                        }}> Get API Key</Button>
                    <h1>미세먼지 데이터 API</h1>
                    <div style={{backgroundColor:'#f8f9fa', margin: '0 0 8px', padding: '12px'}} >
                        <a href='http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/get_data?api_key=YOUR_API_KEY&from=1559307591528&to=1559308187629&count=128'> 
                        http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/get_data?api_key=YOUR_API_KEY&from=1559307591528&to=1559308187629&count=128
                        </a>
                    </div>
                    <h1> Transaction 데이터 API </h1>
                    <div style={{backgroundColor:'#f8f9fa', margin: '0 0 8px', padding: '12px'}} >
                        <a href='http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/get_transaction?api_key=YOUR_API_KEY&from=1559307591528&to=1559308187629&count=128'> 
                        http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/get_transaction?api_key=YOUR_API_KEY&from=1559307591528&to=1559308187629&count=128
                        </a>
                    </div>
                </TabPane>

                <TabPane tab="Data" key="1">
                    <div>
                        <Button type='primary' style={{ margin: '0 0 20px 0' }}
                            onClick = {async (e) => {
                                e.preventDefault();
                                if (dusttoken !== undefined && web3 !== undefined ){
                                    let accounts = await web3.eth.requestAccounts()
                                    dusttoken.methods.transfer("0x0164214FF43A46c8ad6C399811576ABFaB68FA42", web3.utils.toHex(1e18))
                                    .send({from: accounts[0]}, (err, txHash) => {
                                        if (!err){ 
                                            axios({
                                                url: 'http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/export_data.csv?count=1000',
                                                method: 'GET',
                                                responseType: 'blob', // important
                                              }).then((response) => {
                                                 const url = window.URL.createObjectURL(new Blob([response.data]));
                                                 const link = document.createElement('a');
                                                 link.href = url;
                                                 link.setAttribute('download', 'file.csv'); //or any other extension
                                                 document.body.appendChild(link);
                                                 link.click();
                                              });
                                        }
                                    })
                                }
                            }}>
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