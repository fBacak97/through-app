import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import AgoraRTC from "agora-rtc-sdk";
import axios from "axios";
import { setCurrentWatched } from "../actions/viewerActions";
import Chat from "./chat/chat"
import socket from "../utils/socket"
import { Modal, Calendar, Badge, Layout, Card, Avatar } from "antd"
import { ScheduleOutlined } from '@ant-design/icons';
import BookingModal from "./BookingModal";
import moment from "moment";

const { Content, Footer, Sider } = Layout;
const { Meta } = Card;

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
        resolve(token);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
};

let privateMeetings = [];

class Watch extends Component {

  constructor() {
    super();
    this.state = {
      calendarVisible: false,
      bookingDetailsVisible: false,
      selectedDay: null,
      timeSlot: null,
      isPrivate: null,
      allowedUsers: [],
    };
    this.handleChildUnmount = this.handleChildUnmount.bind(this);
  }

  handleChildUnmount = () => {
    this.setState({
      bookingDetailsVisible: false
    });
  }

  openCalendar = () => {
    this.setState({
      calendarVisible: true
    })
  }

  handleOk = () => {
    this.setState({
      calendarVisible: false
    })
  }

  handleCancel = () => {
    this.setState({
      calendarVisible: false
    })
  }

  onDaySelect = value => {
    this.setState({
      selectedDay: value,
      bookingDetailsVisible: true,
    });
  };

  getUserPrivateMeetings = async () => {
    axios.get(
      "/api/private_meeting/",
      {
        params: {username: this.props.viewer.watchedUser, status: 'accepted'}
      },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    )
    .then(function (response) {
      privateMeetings = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getStream = async () => {
    axios.get(
      "/api/stream/",
      {
        params: {name: this.props.viewer.watchedUser}
      },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    )
    .then((response) => this.setState({
      isPrivate: response.data.result[0].stream.isPrivate,
      allowedUsers: response.data.result[0].stream.allowedUsers
    }))
    .catch(function (error) {
      console.log(error);
    });
  }

  getListData = (value) => {
    let listData = [];
    for (let i=0; i<privateMeetings.length; i++){
      let meetingStartMoment = moment(privateMeetings[i].startDate)
      let meetingEndMoment = moment(privateMeetings[i].endDate)
      if(value.dayOfYear() == meetingStartMoment.dayOfYear()){
        listData.push({type: 'success', content: meetingStartMoment.format('hh:mm') + ' - ' + meetingEndMoment.format('hh:mm') + ' with ' + privateMeetings[i].requestedBy.name})
      }
    }
    return listData;
  }

  dateCellRender = (value) => {
    const listData = this.getListData(value);
    return (
      <ul 
        className="events"
      >
        {listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  }
  
  monthCellRender = () => {
    return (
      <div className="notes-month">
      </div>
    );
  }

  async componentDidMount() {
    await this.props.setCurrentWatched(
      window.location.pathname.split("/").pop()
    );
    await this.getUserPrivateMeetings();
    await this.getStream();
    let token = await fetchToken(0, this.props.viewer.watchedUser, "audience");
    client.init(
      "{ENTER_YOUR_CLIENT_KEY_HERE}",
      () => {
        client.setClientRole("audience");
        client.join(
          token,
          this.props.viewer.watchedUser,
          null,
          (uid) => {},
          handleError
        );
        console.log("client initialized");
      },
      function (err) {
        console.log("client init failed ", err);
      }
    );

    client.on("stream-added", function (evt) {
      client.subscribe(evt.stream, handleError);
    });

    // Play the remote stream when it is subsribed
    client.on("stream-subscribed", function (evt) {
      let stream = evt.stream;
      stream.play("liveStream");
    });

    //Join Chat
    const username = this.props.auth.user.name
    const roomname = this.props.viewer.watchedUser
    socket.emit("joinRoom", { username, roomname });
  }

  render() {
    if(this.state.isPrivate && !(this.state.allowedUsers.includes(this.props.auth.user.name))){
      return (
      <Modal
        cancelButtonProps={{style: {display: "none"}}}
        onOk={() => {
          this.props.history.push("/dashboard")
        }}
        visible={true}
        closable={false}
      >
        <p>This user is currently on a private session. </p> <p>Click OK to redirect to main page.</p>
      </Modal>)
    }
    const { user } = this.props.auth;
    let desMes = "You can book a private meeting with,  " + this.props.viewer.watchedUser.split(" ")[0] + "!";
    let welcomeMes = "Hello,  " + user.name.split(" ")[0] + "!";
    return (

      <Layout>
      <Content className="site-layout" style={{ padding: '30px 20px', marginTop: 54 }}>
      <Layout className="site-layout-background" style={{ padding: '0 5px 5px 0' }}>
        <Sider className="site-layout-background" width={200}>
          <Chat
             username={this.props.auth.user.name}
             roomname={this.props.viewer.watchedUser}
             socket={socket}/>
        </Sider>
        <Content style={{ padding: '0 0px 0px 170px', minHeight: 280 }}><div style={{width: "%100", height: "600px" }} id="liveStream"></div></Content>
      </Layout>
      </Content>
      <Footer>           
        <Card style={{ width: 500}}     actions={[
        <ScheduleOutlined key="setting" onClick={this.openCalendar} />,
      ]}>
            <Meta avatar= {<Avatar style={{
              color: '#f56a00',
              backgroundColor: '#fde3cf',
            }}> {user.name.split(" ")[0].charAt(0)} </Avatar>}
                title= {welcomeMes}
                description={desMes}
            />
          </Card>
           <Modal
             width={1000}
             title="Book a Private Meeting"
             onOk={this.handleOk}
             onCancel={this.handleCancel}
             visible={this.state.calendarVisible}
           >
             <Calendar
               value={this.state.selectedDay}
               onSelect={this.onDaySelect}
               dateCellRender={this.dateCellRender}
               monthCellRender={this.monthCellRender}
             ></Calendar>
           </Modal>
           <BookingModal
             visible={this.state.bookingDetailsVisible}
             timeSlot={this.state.timeSlot}
             unmountMe={this.handleChildUnmount}
           >
           </BookingModal></Footer>
      </Layout>
    );
  }
}

Watch.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  viewer: state.viewer,
});

const mapDispatchToProps = () => {
  return {
    setCurrentWatched,
  };
};

export default connect(mapStateToProps, mapDispatchToProps())(Watch);
