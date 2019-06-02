import React from 'react';
import {Table, Pagination, Row, Col, Input, Card} from 'antd';
import axios from 'axios';

const moment = require('moment-timezone');
const Web3 = require('web3');
const columns = [
    { title: 'Transaction hash', dataIndex: 'hash'},
    { title: 'Time', dataIndex: 'time'}
]
const {TextArea, Search} = Input;

let web3 = new Web3(new Web3.providers.HttpProvider(
    'https://ropsten.infura.io/v3/49b9acbd693940a0bf84fef21253e244'
));
class Transactions extends React.Component{
    state = {
        dataCount: 0,
        dataSource: [],
        decodedTx: '',
        txToDecode: ''
    }
    componentDidMount() {
        axios.get('http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/get_transaction_count')
        .then(response => {
            this.setState({ dataCount: response.data[0].cnt })
        })
        axios.get('http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/get_transaction_page', {
            params: {
                pageSize: 10,
                pageNum: 0
            }
        })
        .then(async response => {
            console.log(response.data);
            let i = 0;
            let r = response.data.map((v) => {
                v.key = i++;
                v.time = moment(new Date(v.time)).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
                return v;
            })
            this.setState({
                dataSource: [...r]
            })
        })
    }
    pageChange  = (pageNumber) => {
        axios.get('http://ec2-54-186-81-184.us-west-2.compute.amazonaws.com:3001/api/get_transaction_page', {
                params: {
                    pageSize: 10,
                    pageNum: pageNumber - 1
                }
            })
            .then(response => {
                console.log(response.data);
                let i = 0;
                let r = response.data.map((v) => {
                    v.key = i++;
                    v.time = moment(new Date(v.time)).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
                    return v;
                })
                this.setState({
                    dataSource: [...r]
                })
            })
    }
    decode = async (value) => {
        let tx = await web3.eth.getTransaction(value);
        let entry = web3.eth.abi.decodeParameters(
            ['string', 'uint256', 'uint256', 'uint256'], tx.input
        );
        delete tx.input;
        delete tx.r;
        delete tx.s;
        delete tx.v;
        tx.location = entry['0'];
        tx.pm25 = entry['1'].toString();
        tx.pm10 = entry['2'].toString();
        tx.time = entry['3'].toString();
        tx.time = moment(new Date(Number(tx.time))).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
        this.setState({
            decodedTx: JSON.stringify(tx, null, "\t")
        })
    }
    render() {
        return(
            <div>
                <Row>
                    <Col span={12}>
                    <h1 style={{ margin: '0 0 30px 0' }}> DustToken의 모든 transaction 을 확인하실 수 있습니다. </h1>
                    <Table columns={columns} dataSource={this.state.dataSource} pagination={false} />
                    <Pagination defaultCurrent={1} total={this.state.dataCount} onChange={this.pageChange} style={{ margin: '10px 0 0 0' }} />
                    </Col>
                    <Col span={12}>
                    <Card title="Dust Token blockchain transaction decoder" style={{margin: '30px'}}>
                        <Search placeholder="input search text" onSearch={value => this.decode(value)} enterButton style={{margin: '30px 0'}}/>
                        <TextArea value={this.state.decodedTx} autosize={true} readOnly={true} />
                    </Card>
                    </Col>
                </Row>
            </div>
            
        )
    }
}
export default Transactions;