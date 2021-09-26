import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Layout, Divider, Row, Col, Card, Input, Space, Select } from "antd"
import { setLiveUsers } from "../actions/viewerActions";
import axios from 'axios'
import { PlayCircleOutlined, PushpinOutlined, SearchOutlined, TagsOutlined, IdcardOutlined } from '@ant-design/icons';

const { Content } = Layout;



class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirectPath : null,
      inputValue: '', // user name, title
      professions: [],
      locations: [],
      tags: [], 
      selectedProfession: '',
      selectedLocation: '',
      selectedTag: '' 
    }
  }

  fetchLiveUsers() {
    axios.get( "/api/users/", {
      params: {status: "live"}
    })
    .then(async (response) => {
      await this.props.setLiveUsers(response.data.result);
      let tags = [];
      let locations = [];
      let professions = [];
      this.props.viewer.liveUsers.map(item=>{ 
        for (let i=0; i<item.stream.tags.length; i++){
          if (!tags.includes(item.stream.tags[i])){
            tags.push(item.stream.tags[i]);
          }  
        }
        if (!locations.includes(item.stream.location)){
          locations.push(item.stream.location);
        }  
        if (!professions.includes(item.profession)){
          professions.push(item.profession);
        }  
      })
      this.setState({
        tags: tags,
        locations: locations,
        professions: professions
      })
    })
    ;
  }

  componentWillMount() {
    this.fetchLiveUsers();
  }

  onClick = (value) => {
    this.setState({
      redirectPath: "/watch/" + value.name
    })
  }

  onLocationSelect = (value) => {
    this.setState({
      selectedLocation: value
    })
  }

  onTagSelect = (value) => {
    this.setState({
      selectedTag: value
    })
  }



  onProfessionSelect = (value) => {
    this.setState({
      selectedProfession: value
    })
  }

  onQueryChange = (event) =>{
    this.setState({
      inputValue: event.target.value
    })

  }
  



  render() {

    if(this.state.redirectPath){
      return <Redirect to={this.state.redirectPath}></Redirect>
    }

    const { user } = this.props.auth;
    let welcomeMes = "Welcome to Through " + user.name.split(" ")[0] + "!";
    return (
      <Layout>
      <Content className="site-layout" style={{ padding: '40px 40px', marginTop: 54 }}>
      <Layout className="site-layout-background">
        <Content><div style={{width: "%100", height: "600px" }}>
          <Divider orientation="left" style={{fontSize:'22px'}}>Current Streams</Divider>
          <Space wrap>
          <Input style={{width:"300px", height:"50px" , marginLeft:'15px', marginRight:"10px"}} size="small"  placeholder="Keyword" onChange={this.onQueryChange}  prefix={<SearchOutlined />} />
          <Select
              showSearch
              allowClear
              style={{ width: 200 }}
              placeholder="Location"
              onSelect={this.onLocationSelect}
              onClear={()=>{
                this.setState({
                  selectedLocation: ''
                })
              }}
              options={this.state.locations.map(item =>{
                return {label: item, value: item}

              })}
              filterOption={(input, option) =>
                option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
          </Select>
          <Select
              showSearch
              allowClear
              style={{ width: 200 }}
              placeholder="Stream Tags"
              onSelect={this.onTagSelect}
              onClear={()=>{
                this.setState({
                  selectedTag: ''
                })
              }}
              options={this.state.tags.map(item =>{
                return {label: item, value: item}

              })}
              filterOption={(input, option) =>
                option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
          </Select>
          <Select
              showSearch
              allowClear
              style={{ width: 200 }}
              placeholder="Profession"
              onSelect={this.onProfessionSelect}
              onClear={()=>{
                this.setState({
                  selectedProfession: ''
                })
              }}
              options={this.state.professions.map(item =>{
                return {label: item, value: item}

              })}
              filterOption={(input, option) =>
                option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
          </Select>
        </Space>
        <Divider orientation="left" style={{fontSize:'22px'}}></Divider>
          <Row style={{marginLeft:'3px', marginRight:'3px', marginTop: '3px'}} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {this.props.viewer.liveUsers.map(item => {

              if (this.state.inputValue != '' ? item.name.toLowerCase().includes(this.state.inputValue) || item.stream.title.toLowerCase().includes(this.state.inputValue) : true && 
                  this.state.selectedTag != '' ? item.stream.tags.includes(this.state.selectedTag) : true && 
                  this.state.selectedProfession != '' ? item.profession == this.state.selectedProfession : true && 
                  this.state.selectedLocation != '' ? item.stream.location == this.state.selectedLocation : true
              ){
                  return <Col className="gutter-row" span={6}>
                  <div>     <Card hoverable size="small" style={{marginBottom: '8px'}} title={item.stream.title} actions={[
                <PlayCircleOutlined value={JSON.stringify(item)} key="setting" onClick={this.onClick.bind(this, item)} /> ]}>

                    <p><PushpinOutlined/>{" "+item.stream.location}</p>
                    <p><IdcardOutlined/>{" "+item.profession}</p>
                    <p><TagsOutlined/>{" "+item.stream.tags}</p>
                  </Card> </div>
                  </Col>  
                } 
                })} 
          </Row>
          </div></Content>
      </Layout>
      </Content>
    </Layout>

    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  viewer: state.viewer,
});

const mapDispatchToProps = () => {
  return {
    setLiveUsers
  };
};

export default connect(mapStateToProps, mapDispatchToProps())(Dashboard);
