import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import { connect } from "react-redux";
import { setLiveUsers } from "../../actions/viewerActions";
import axios from 'axios'

import { Badge, TreeSelect, Layout, Menu } from "antd"
import { CalendarOutlined , AppstoreOutlined, FormOutlined, LogoutOutlined, HomeOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';

import MenuItem from "antd/lib/menu/MenuItem";
const { TreeNode } = TreeSelect
const { Header } = Layout;
const { SubMenu } = Menu;

class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchIsEmpty: true,
      searchValue : "",
      redirectPath : null,
      pendingCount : null
    }
  }

  fetchLiveUsers() {
    axios.get( "/api/users/", {
      params: {status: "live"}
    })
    .then(async (response) => {
      await this.props.setLiveUsers(response.data.result);
    })
    ;
  }

  getUserPrivateMeetings = async () => {
    axios.get(
      "/api/private_meeting/",
      {
        params: {username: this.props.auth.user.name, status: 'pending'}
      },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    )
    .then((response) => {
      this.setState({
        pendingCount: response.data.result.length
      })

    })
    .catch(function (error) {
      console.log(error);
    });
  }

  componentWillMount() {
    this.fetchLiveUsers();
    this.getUserPrivateMeetings();
  }

  onSelect = (value) => {
    let userObject = JSON.parse(value);
    this.setState({
      redirectPath: "/watch/" + userObject.name
    })
  }
  
  onSearch = (value) => {
    if(value == ''){
      this.setState({
        searchValue: value,
        searchIsEmpty: true
      })
    }else if(this.state.searchIsEmpty == true){
      this.setState({
        searchValue: value,
        searchIsEmpty: false
      })
    }else{
      this.setState({
        searchValue: value
      })
    }
  }


  onLogoutClick = (e) => {
    //return false;
    this.props.logoutUser();
  };



  render() {
    const { user } = this.props.auth;
    const centerStyle = {
      justifyContent: 'center'
    };
    if(this.state.redirectPath){
      return <Redirect to={this.state.redirectPath}></Redirect>
    }
    return (
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div className="logo"><h5 className='logoo'>THROUGH</h5></div>
      <Menu style={{marginLeft:"80px"}}theme="dark" mode="horizontal">
        <Menu.Item key="1" icon={<HomeOutlined />}><Link
         to="/dashboard">
       </Link> Home</Menu.Item>
        <Menu.Item key="2" icon={<AppstoreOutlined />}> <Link
         to="/stream"></Link>
         Start Streaming</Menu.Item>
        <SubMenu key="SubMenu" icon={<UserOutlined />} title="Profile" justifyContent='right'>
           <Menu.Item icon={<FormOutlined />} key="setting:1"><Link
         to="/config"> </Link>Configure Stream</Menu.Item>
           <Menu.Item icon={<CalendarOutlined />} key="setting:2"><Link
         to="/calendar"> </Link>Calendar</Menu.Item>
         <Menu.Item icon={<LogoutOutlined />} onClick={this.onLogoutClick} key="setting:3">Sign Out</Menu.Item>
       </SubMenu>
        <Menu.Item style={{position:"right"}}>     
         <TreeSelect
              treeDefaultExpandAll
              showSearch={true}
              showArrow={false}
              style={{ width: 200 }}
              placeholder="Search"
              onSelect={this.onSelect}
              onSearch={this.onSearch}
              filterTreeNode={(input, treeNode) => {
                  return true
                }
              }
            >
              <TreeNode value="" title="Search by User" key="user" selectable={false}>
                {this.props.viewer.liveUsers.map(item => {
                  if(this.state.searchValue == ""){
                    return <TreeNode value={JSON.stringify(item)} key={"user-" + item.name} title={item.name}></TreeNode>
                  }else{
                    if(item.name.toLowerCase().includes(this.state.searchValue.toLowerCase()))
                      return <TreeNode value={JSON.stringify(item)} key={"user-" + item.name} title={item.name}/>
                  } 
                })}
              </TreeNode>
              {!this.state.searchIsEmpty ? <TreeNode value="" key="tag" title="Search by Tags" selectable={false}>
                {this.props.viewer.liveUsers.map(item => {
                  const lowerCaseTags = item.stream.tags.map((tag) => {return tag.toLowerCase()})
                  console.log(lowerCaseTags)
                  for(let i = 0; i < lowerCaseTags.length; i++){
                    if(lowerCaseTags[i].includes(this.state.searchValue.toLowerCase()))
                      return <TreeNode value={JSON.stringify(item)} key={"tag-" + item.name} title={item.name}/>
                  }
                })}
              </TreeNode> : null}
              {!this.state.searchIsEmpty ? <TreeNode value="" key="location" title="Search by Location" selectable={false}>
                {this.props.viewer.liveUsers.map(item => {
                  if(item.stream.location.toLowerCase().includes(this.state.searchValue.toLowerCase()))
                    return <TreeNode value={JSON.stringify(item)} key={"location-" + item.name} title={item.name}/>
                })}
              </TreeNode> : null}
              {!this.state.searchIsEmpty ? <TreeNode value="" key="profession" title="Search by Profession" selectable={false}>
                {this.props.viewer.liveUsers.map(item => {
                  if(item.profession.toLowerCase().includes(this.state.searchValue.toLowerCase()))
                    return <TreeNode value={JSON.stringify(item)} key={"profession-" + item.name} title={item.name}/>
                })}
              </TreeNode> : null}
            </TreeSelect></Menu.Item>
            <MenuItem style={{justifyContent:"center"}}> <Badge size="small" count={this.state.pendingCount}>
                  <BellOutlined style={{color:"white"}}></BellOutlined>
                </Badge> <Link
                      to="/calendar"> </Link></MenuItem>
      </Menu>
    </Header>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  viewer: state.viewer,
});

const mapDispatchToProps = () => {
  return {
    setLiveUsers,
    logoutUser
  };
};

export default connect(mapStateToProps, mapDispatchToProps())(Navbar);



