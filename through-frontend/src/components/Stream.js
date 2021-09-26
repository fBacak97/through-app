import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import AgoraRTC from "agora-rtc-sdk";
import axios from "axios";
import Chat from "./chat/chat"
import socket from "../utils/socket"
import { setStreamStatus } from "../actions/streamActions";

import { Layout, Modal, Form, Radio } from "antd"

const { Content, Sider } = Layout;

let handleError = (err) => {
  console.log("Error: ", err);
};

let client = AgoraRTC.createClient({
  mode: "live",
  codec: "vp8",
});

let fetchToken = (uid, channelName, tokenRole) => {
  return new Promise(function (resolve) {
    axios.post(
        "/api/token/fetch_rtc_token",
        {
          uid: uid,
          channelName: channelName,
          role: tokenRole,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      )
      .then(function (response) {
        const token = response.data.token;
        console.log("TOKEN" + JSON.stringify(response.data))
        resolve(token);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
};

class Stream extends Component {

  constructor(props){
    super(props)
    this.state={
      audio: false,
      media: "",
      configReady: false,
    }
    this.formRef = React.createRef();
  }


  async componentDidUpdate(prevProps, prevState) {
    if(this.state.configReady !== prevState.configReady){
      let token = await fetchToken(0,this.props.auth.user.name,'host');
      if(this.state.configReady){
        client.init(
          "{ENTER_YOUR_CLIENT_KEY_HERE}",
          () => {
            client.setClientRole("host");
            client.join(
              token,
              this.props.auth.user.name,
              null,
              (uid) => {
                let localStream = AgoraRTC.createStream({
                  streamID: uid,
                  audio: this.state.audio,
                  video: this.state.media == "camera" ? true : false,
                  screen: this.state.media == "screen" ? true : false,
                });
    
                // Initialize the local stream
                localStream.init(() => {
                  // Play the local stream
                  localStream.play("myStream");
                  client.publish(localStream, function (err) {
                    console.log("Publish local stream error: " + err);
                  });
                  axios.post('/api/users/change_stream_status', {
                    username: this.props.auth.user.name,
                    status: "live"
                  },
                  {
                    headers: {
                      "Content-Type": "application/json; charset=UTF-8",
                    },
                  }).then((res, err) => {
                    if (res.data.result == "success"){
                      this.props.setStreamStatus("live")
                    }
                  })
                }, handleError);
              },
              handleError
            );
            console.log("client initialized");
          },
          function (err) {
            console.log("client init failed ", err);
          }
        );
      }
    }
  }

  componentDidMount() {
    //Join Chat
    const username = this.props.auth.user.name
    const roomname = this.props.auth.user.name
    socket.emit("joinRoom", { username, roomname });
  }



  render() {
    const centerStyle = {
      justifyContent: 'center'
    };
    const { user } = this.props.auth;

    return (
      <Layout>
        <Modal
          visible={!this.state.configReady}
          closable={false}
          okButtonProps={{form:'configForm', key: 'submit', htmlType: 'submit'}}
          cancelButtonProps={{style: {display: "none"}}}
        >
          <Form
            id="configForm"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={(values) => this.setState({
              configReady: true,
              audio: values.audio,
              media: values.media
            })}
            on
            ref={this.formRef}
          >
            <Form.Item
                label="Media"
                name="media"
                rules={[{required: true, message: "Please select your shared media type."}]}
            >
              <Radio.Group>
                <Radio value="camera">Camera</Radio>
                <Radio value="screen">Screen Share</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
                label="Audio"
                name="audio"
                rules={[{required: true, message: "Please select whether audio is on or off."}]}
            >
                <Radio.Group>
                  <Radio value={true}>On</Radio>
                  <Radio value={false}>Off</Radio>
                </Radio.Group>
            </Form.Item>
          </Form>
        </Modal>
        <Content className="site-layout" style={{ padding: '30px 20px', marginTop: 54 }}>
          <Layout className="site-layout-background" style={{ padding: '0 5px 5px 0' }}>
            <Sider className="site-layout-background" width={200}>
              <Chat
                username={this.props.auth.user.name}
                roomname={this.props.auth.user.name}
                socket={socket}
              />
            </Sider>
            <Content style={{ padding: '0 0px 0px 170px', minHeight: 280 }}><div style={{width: "%100", height: "600px" }} id="myStream"></div></Content>
          </Layout>
        </Content>
      </Layout>
    );
  }
}

Stream.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  stream: state.stream
});


const mapDispatchToProps = () => {
  return {
    setStreamStatus,
  };
};

export default connect(mapStateToProps, mapDispatchToProps())(Stream);
