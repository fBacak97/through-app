import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Calendar, Badge, Button, Space, Table, Input, Layout, Divider } from "antd"
import moment from "moment";
import Text from "antd/lib/typography/Text";

let tableColumns = [];
const { Header, Content, Footer, Sider } = Layout;

class MeetingCalendar extends Component {

    acceptMeeting = (entry) => {
        axios.post(
            "/api/private_meeting/accept",
            {
                id: entry._id
            },
            {
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
            }
        ).then((res) => {
            if(res.data.status == "success"){
                this.componentDidMount()
            }
        })
    }

    rejectMeeting = (entry) => {
        axios.post(
            "/api/private_meeting/reject",
            {
                id: entry._id
            },
            {
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
            }
        ).then((res) => {
            if(res.data.status == "success"){
                this.componentDidMount()
            }
        })
    }

  constructor(props) {
    super(props);
    this.state = {
      privateMeetings: [],
      ready: false,
    };

    tableColumns = [
        {
            title: 'Requested By',
            dataIndex: 'requestedBy',
            key: 'requestedBy', 
            render: (item) => {
                return <Text>{item.name}</Text>
            }
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text) => {
                return <Text>{moment(text).format("MMMM Do YYYY, hh:mm")}</Text>
            }
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text) => {
                return <Text>{moment(text).format("MMMM Do YYYY, hh:mm")}</Text>
            }
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
            render: (note) => {
                return (
                    <Input.TextArea
                        style={{resize: 'none'}}
                        readOnly
                        defaultValue={note}
                    />
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (entry) => {
                return( 
                    <Space>
                        <Button
                            type='primary'
                            onClick={() => {
                                this.acceptMeeting(entry)
                            }}
                        >Accept
                        </Button>
                        <Button
                            type='primary'
                            onClick={() => {
                                this.rejectMeeting(entry)
                            }}
                        >Reject
                        </Button>             
                    </Space>
                )
            }
        },
    ]
  }

  getUserPrivateMeetings = async () => {
    axios.get(
      "/api/private_meeting/",
      {
        params: {username: this.props.auth.user.name}
      },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    )
    .then((response) => {
      this.setState({
        privateMeetings: response.data.result
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getListData = (value) => {
    let listData = [];
    for (let i=0; i<this.state.privateMeetings.length; i++){
      let meetingStartMoment = moment(this.state.privateMeetings[i].startDate)
      let meetingEndMoment = moment(this.state.privateMeetings[i].endDate)
      if(value.dayOfYear() == meetingStartMoment.dayOfYear()){
        let type = '';
        if(this.state.privateMeetings[i].status == 'rejected'){
        }else{
          if(this.state.privateMeetings[i].status == 'pending'){
            type = 'warning'
          }else{
            type = 'success'
          }          
          listData.push({type: type, content: meetingStartMoment.format('hh:mm') + ' - ' + meetingEndMoment.format('hh:mm') + 
          ' with ' + this.state.privateMeetings[i].requestedBy.name})
        }
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

  componentDidMount() {
    this.getUserPrivateMeetings()
  }

  render() {
    return (
    
      <Layout>
        <Content className="site-layout" style={{ padding: '30px 20px', marginTop: 54 }}>
        <Layout className="site-layout-background" style={{ padding: '0 3px 3px 0' }}>
          <Content style={{ padding: '0px 0px 10px 10px'}}><div style={{width: "600px", height: "800px" }}><Calendar
                dateCellRender={this.dateCellRender}
                monthCellRender={this.monthCellRender} style={{height:"400px"}}></Calendar></div></Content>
          <Sider className="site-layout-background" width={700}><div style={{width: "700px", height: "800px", marginTop: "33px" }}>
          <Divider orientation="left" style={{fontSize:'22px'}}>Private Meeting Requests</Divider>
            <Table
                        columns={tableColumns}
                        dataSource={this.state.privateMeetings.filter(element => element.status == 'pending')}></Table>
              </div>
          </Sider>
        </Layout>
        </Content>
      </Layout>

    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(MeetingCalendar);
