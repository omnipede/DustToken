import React from 'react';
import { Carousel, Collapse, Row, Col } from 'antd';
import "antd/dist/antd.css";
import img_dust from '../intro_dust.jpg';
import img_token from '../intro_token.jpg';
import img_blockchain from '../img_blockchain.jpg';
const Panel = Collapse.Panel;
class Intro extends React.Component{
    render() {
        return(
            <div>
                <Carousel>
                    <div>
                        <Row>
                            <Col span={10}> <img src={img_dust} alt='logo' style={{width: '100%', height: '360px'}}/></Col>
                            <Col span={14} style={{color: 'white', fontSize: 36, textAlign: 'center'}}> 미세먼지를 측정해서 암호화폐를 얻으세요 </Col>
                        </Row>    
                    </div>
                    <div>
                        <Row>
                            <Col span={10}> <img src={img_token} alt='logo' style={{width: '100%', height: '360px'}}/></Col>
                            <Col span={14} style={{color: 'white', fontSize: 36, textAlign: 'center'}}> 국내유일 IoT 기반 암호화폐 </Col>
                        </Row>
                    </div>
                    <div>
                        <Row>
                            <Col span={10}> <img src={img_blockchain} alt='logo' style={{width: '100%', height: '360px'}}/></Col>
                            <Col span={14} style={{color: 'white', fontSize: 36, textAlign: 'center'}}> 국내유일 IoT 기반 암호화폐 </Col>
                        </Row>
                    </div>
                </Carousel>
                <div style={{margin: '0 241.5px', padding: '60px 15px'}}>
                    <div style={{color: '#555555', fontSize: 24, textAlign: 'center', margin: '5px 0px 30px'}}> <b>Dust Token </b></div>
                    <div style={{backgroundColor: '#555555', margin: 'auto', height: '2px', width: '70px', boxSizing: 'border-box' }}> </div>
                    <div style={{color: '#555555', fontSize: 13, textAlign: 'center', margin: '10px 0px 30px'}}>IoT based Ethereum ERC20 Token</div>
                </div>
                {/*
                <div style={{margin: '50px 0 0 0'}}>
                    <h2>Getting started</h2>
                <Collapse>
                    <Panel header="Step 1: 디바이스 구입" key="1">
                    </Panel>
                    <Panel header="Step 2: 디바이스 등록" key="2">
                        <p></p>
                    </Panel>
                    <Panel header="Step 3: 편히 쉬세요" key="3">
                        <p></p>
                    </Panel>
                </Collapse>
                </div>
            */}
            </div>
        );
    }
}
export default Intro;