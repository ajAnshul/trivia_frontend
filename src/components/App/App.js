import React, { Component } from 'react';
// import {Tesseract} from "tesseract.ts";
// import logo from './full_ques.jpg';
import { Layout, Menu, Button, Row, Col } from 'antd';
import 'antd/dist/antd.css';
const { Header, Content, Footer } = Layout;
// const screenshot = require('screenshot-desktop')



class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      question:'----------',
      options:['--', '--', '--'],
      op1_count:0,
      op2_count:0,
      op3_count:0,
      scanning:false,
      op1_color:'#e9e8e8',
      op2_color:'#e9e8e8',
      op3_color:'#e9e8e8',
      questions:[],
      isNotQuestion:false
    }
  }
  componentDidMount(){


  }

  resetState = () => {
    this.setState({
      question:'----------',
      options:['--', '--', '--'],
      op1_count:0,
      op2_count:0,
      op3_count:0,
      scanning:false,
      op1_color:'#e9e8e8',
      op2_color:'#e9e8e8',
      op3_color:'#e9e8e8',
      isNotQuestion:false
    })
  }

  scanIt = () => {
    this.setState({scanning:true})
    let that = this;
    that.resetState();
    fetch(process.env.REACT_APP_SERVER + '/myBot/scanv1.1/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        test:'testing'
      })
    })
    .then(function(response) {
      return response.json()
    })
    .then(function(res) {
      console.log('signup Success', res);
      if(res.success){
        let {questions} = that.state;
        questions.push(res.result.results.question);
        that.setState({
          scanning:false,
          question:res.result.results.question,
          options:res.result.results.options,
          op1_count:res.result.results.op1_count,
          op2_count:res.result.results.op2_count,
          op3_count:res.result.results.op3_count,
          isNotQuestion:res.result.results.isNotQuestion,
          questions
        }, ()=>{
          that.findAnswer();
        })

      } else{
        console.log("got error in api");
      }
    })
    .catch(error => {
      console.log(error);
      that.resetState();
    });
  }

  frontEndOCR = () => {
    // let url = document.getElementById("image_fees").value;
    // screenshot({ filename: 'shot.jpg' }).then((imgPath) => {
    //   // imgPath: absolute path to screenshot
    //   // created in current working directory named shot.png
    // });
    // Tesseract.recognize(url)
    // .progress(function  (p) { console.log('progress', p)    })
    // .then(function (result) {
    //   // console.log('result', result)
    //   // console.log("result",result.text);
    //   let arr = result.text.split(/\r\n|\n|\r/)
    //   var filtered = arr.filter(function (el) {
    //     return el != "";
    //   });
    //   let options = filtered.slice(filtered.length-3);
    //   let question = filtered.slice(0, filtered.length-3).join(' ');
    //   console.log("got arr ", options);
    //   console.log("question", question);
    //  })
  }

  findAnswer = () => {
    let {op1_count, op2_count, op3_count, op1_color, op2_color, op3_color, isNotQuestion} = this.state;
    console.log("");
    if(isNotQuestion){
      // question has not
      if(op1_count < op2_count && op1_count < op3_count){
        // option1 is right answer
        op1_color = 'green';
      } else if(op2_count < op1_count && op2_count < op3_count){
        op2_color = 'green';
      } else if(op3_count < op1_count && op3_count < op2_count){
        op3_color = 'green';
      } else {
        op1_color = 'yellow';
        op2_color = 'yellow';
        op3_color = 'yellow';
      }

    } else{
      if(op1_count > op2_count && op1_count > op3_count){
        // option1 is right answer
        op1_color = 'green';
        if(op2_count > 0) op2_color = 'yellow';
        if(op3_count > 0) op3_color = 'yellow';
      } else if(op2_count > op1_count && op2_count > op3_count){
        op2_color = 'green';
        if(op1_count > 0) op1_color = 'yellow';
        if(op3_count > 0) op3_color = 'yellow';
      } else if(op3_count > op1_count && op3_count > op2_count){
        op3_color = 'green';
        if(op1_count > 0) op1_color = 'yellow';
        if(op2_count > 0) op2_color = 'yellow';
      } else {
        op1_color = 'yellow';
        op2_color = 'yellow';
        op3_color = 'yellow';
      }
    }

    this.setState({op1_color, op2_color, op3_color});

  }

  getPercent = (num) => {
    if(num == 0) return num;
    let { op1_count, op2_count, op3_count } = this.state
    let sum = op1_count + op2_count + op3_count;
    let res = num/sum;
    console.log("res",res);
    console.log(res*100);
    return Math.round((num/sum)*100) + '%';
  }

  render() {
    let {question, options, scanning, op1_color, op2_color, op3_color, op1_count, op2_count, op3_count } = this.state;
    let op1_styles = {
      backgroundColor:'#e9e8e8',
      borderRadius:'30px',
      fontSize:18,
      padding:20,
      marginBottom:10,
      display:'flex',
      justifyContent:'space-between'
    }

    let op2_styles = {
      backgroundColor:'#e9e8e8',
      borderRadius:'30px',
      fontSize:18,
      padding:20,
      marginBottom:10,
      display:'flex',
      justifyContent:'space-between'
    }

    let op3_styles = {
      backgroundColor:'#e9e8e8',
      borderRadius:'30px',
      fontSize:18,
      padding:20,
      marginBottom:10,
      display:'flex',
      justifyContent:'space-between'
    }
    op1_styles['backgroundColor'] = op1_color;
    op2_styles['backgroundColor'] = op2_color;
    op3_styles['backgroundColor'] = op3_color;
    console.log("questions is ", this.state.questions);
    return (
      <div className="My-App">
      <Layout className="layout">
        <Header style={{display:'flex', justifyContent:'space-between'}}>
          <div className="logo" style={{color:'white', fontSize:16}}>Your Boat</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">Home</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 20p' }}>
        <Row type="flex" justify="center"  style={{background: '#fff', padding: 24, minHeight: 280, textAlign:'center', height:'100vh'}}>
          <Col xs={{ span: 20}} lg={{ span: 8 }} md={{ span: 8}} sm={{ span: 16}}>
          <Button loading={scanning} size="large" style={{width:'100%'}}
          onClick={()=>{
            this.scanIt();
          }}
          type="primary">Scan</Button>
          <div style={{paddingTop:60}}>
            <h4 style={{paddingTop:10, paddintBottom:40, fontSize:20}}>{question}</h4>
            <div style={{paddingTop:40, textAlign:'left'}}>
              <div style={op1_styles}>
                <div>{options[0]}</div>
                <div style={{color:'red', fontWeight:1000}}>{this.getPercent(op1_count)}</div>
              </div>
              <div style={op2_styles}>
                <div>{options[1]}</div>
                <div style={{color:'red', fontWeight:1000}}>{this.getPercent(op2_count)}</div>
              </div>
              <div style={op3_styles}>
                <div>{options[2]}</div>
                <div style={{color:'red', fontWeight:1000}}>{this.getPercent(op3_count)}</div>
              </div>
            </div>
          </div>
          </Col>
        </Row>

        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
        {/*
          <input style={{display:'none'}}  type="text" id="image_fees" value={logo}/>
            <p>
              Enjoy
            </p>
          */}
      </div>
    );
  }
}

export default App;
