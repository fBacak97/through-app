import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Descriptions, Input, Button, Tag, Divider, Layout, Switch, Select, Row, Col, Typography, Modal} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GeoSuggest from "antd-geosuggest"


const { Content } = Layout;
const {Text} = Typography


class StreamConfig extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputVisible: false,
            inputValue: '',
            title: null,
            tags: [],
            location: null,
            profession: null,
            isPrivate: null,
            allowedUsers: [],
            allUsernameOptions: [],
        };
    }

    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        axios.post('/api/stream/change_tags', {
            username: this.props.auth.user.name,
            tags: tags,
        },
        {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
        }).then(this.setState({
            tags: tags
        }))
        this.setState({
            tags: tags,
        });
    };

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    handleInputConfirm = () => {
        const { inputValue } = this.state;
        let tags = null;
        if (inputValue && this.state.tags.indexOf(inputValue) === -1) {
            tags = [...this.state.tags, inputValue];
        }
        axios.post('/api/stream/change_tags', {
            username: this.props.auth.user.name,
            tags: tags,
        },
        {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
        }).then(this.setState({
            tags: tags
        }))
        this.setState({
            tags: tags,
            inputVisible: false,
            inputValue: '',
        });
    };

    handleTitleChange = () => {
        const { title } = this.state
        axios.post('/api/stream/change_title', {
            username: this.props.auth.user.name,
            title: title
        },
        {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
        }).then((res) => {
            if(res.data.result == "success"){
                Modal.success({
                    title: "Success",
                    content: `Successfully changed the stream title.`
                })
            }else{
                Modal.error({
                    title: "Error",
                    content: `We encountered an error while changing the stream title. Please try again later.`
                })
            }
        })
    };

    handleProfessionChange = () => {
        const { profession } = this.state
        axios.post('/api/stream/change_profession', {
            username: this.props.auth.user.name,
            profession: profession
        },
        {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
        }).then((res) => {
            if(res.data.result == "success"){
                Modal.success({
                    title: "Success",
                    content: `Successfully changed profession.`
                })
            }else{
                Modal.error({
                    title: "Error",
                    content: `We encountered an error while changing profession. Please try again later.`
                })
            }
        })
    };

    handlePrivateChange = (value) => {
        this.setState({
            isPrivate: value
        })
        axios.post('/api/stream/change_private', {
            username: this.props.auth.user.name,
            isPrivate: value
        },
        {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
        }).then((res) => {
            if(res.data.result == "success"){
                Modal.success({
                    title: "Success",
                    content: `Stream is set to ${value ? "private." : "public."}` 
                })
            }else{
                Modal.error({
                    title: "Error",
                    content: "We encountered an error while changing stream privacy. Please try again later."
                })
            }
        })
    };

    handleAllowedUsersChange = (value) => {
        let added = true
        if(value.length < this.state.allowedUsers.length){
            added = false 
        }
        this.setState({
            allowedUsers: value
        })
        axios.post('/api/stream/change_allowed_users', {
            username: this.props.auth.user.name,
            allowedUsers: value
        },
        {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
        }).then((res) => {
            if(res.data.result == "success"){
                Modal.success({
                    title: "Success",
                    content: `Successfully ${added ? "added user to" : "removed user from"} allowed users in private mode.`
                })
            }else{
                Modal.error({
                    title: "Error",
                    content: `We encountered an error ${added ? "adding the user to" : "removing the user from"} allowed users in private mode. Please try again later.`
                })
            }
        })
    };

    saveInputRef = input => {
        this.input = input;
    };

    handleLocationChange(location) {
        console.log("selen ");
        if(location[0]){
            axios.post('/api/stream/change_location', {
                username: this.props.auth.user.name,
                location: location[0].address
            },
            {
                headers: {
                  "Content-Type": "application/json; charset=UTF-8",
                },
            }).then((res)=> {
                this.setState({
                    location: location
                })
                if(res.data.result == "success"){
                    Modal.success({
                        title: "Success",
                        content: `Successfully updated stream location`
                    })
                }else{
                    Modal.error({
                        title: "Error",
                        content: `We encountered an error while updating stream location. Please try again later.`
                    })
                }
            })
        }else
        {
            axios.post('/api/stream/change_location', {
                username: this.props.auth.user.name,
                location: ''
            },
            {
                headers: {
                  "Content-Type": "application/json; charset=UTF-8",
                },
            }).then((res)=> {
                this.setState({
                    location: location
                })
                if(res.data.result == "success"){
                    Modal.success({
                        title: "Success",
                        content: `Successfully cleared stream location`
                    })
                }else{
                    Modal.error({
                        title: "Error",
                        content: `We encountered an error while clearing stream location. Please try again later.`
                    })
                }
            })
        }
    }

    fetchStream() {
        axios.get("/api/stream/", {
            params: {name: this.props.auth.user.name}
        })
        .then((response) => {
            this.setState({
                tags: response.data.result[0].stream.tags,
                title: response.data.result[0].stream.title,
                location: response.data.result[0].stream.location,
                profession: response.data.result[0].profession,
                allowedUsers: response.data.result[0].stream.allowedUsers,
                isPrivate: response.data.result[0].stream.isPrivate,
            })
        });
    }

    getAllUsers() {
        axios.get("/api/users/", {
            params: {}
        })
        .then((response) => {
            let usernames = []
            for (let i = 0; i < response.data.result.length; i++){
                usernames.push({label: response.data.result[i].name, value: response.data.result[i].name})
            }
            this.setState({
                allUsernameOptions: usernames
            })
        });
    }

    componentWillMount() {
        this.fetchStream();
        this.getAllUsers();
    }

    render() {
        const { tags, inputVisible, inputValue } = this.state;

        return (

            <Layout>
      <Content className="site-layout" style={{ padding: '40px 40px', marginTop: 54 }}>
      <Layout className="site-layout-background">
        <Content><div style={{width: "%100", height: "800px" }}>

        <div>
                <Divider orientation="left" style={{fontSize:'22px'}}> Stream Details Configuration </Divider>
                <Descriptions layout="vertical" bordered column={1}>
                <Descriptions.Item label="Profession">
                    <Input value={this.state.profession} onChange={(e) => {
                        this.setState({
                            profession: e.target.value
                        })
                    }} suffix={<Button onClick={this.handleProfessionChange} type="primary">Save</Button>}/>
                </Descriptions.Item>
                    <Descriptions.Item label="Stream Title">
                        <Input value={this.state.title} onChange={(e) => {
                            this.setState({
                                title: e.target.value
                            })
                        }} suffix={<Button onClick={this.handleTitleChange} type="primary">Save</Button>}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="Stream Tags">
                    {tags.map((tag) => {
                        const tagElem = (
                            <Tag
                            className="edit-tag"
                            key={tag}
                            closable={true}
                            onClose={() => this.handleClose(tag)}
                            >
                            <span>
                                {tag}
                            </span>
                            </Tag>
                        );

                        return tagElem
                    })}
                    {inputVisible && (
                        <Input
                            ref={this.saveInputRef}
                            type="text"
                            size="small"
                            className="tag-input"
                            value={inputValue}
                            onChange={this.handleInputChange}
                            onBlur={this.handleInputConfirm}
                            onPressEnter={this.handleInputConfirm}
                        />
                    )}
                    {!inputVisible && (
                        <Tag className="site-tag-plus" onClick={this.showInput}>
                            <PlusOutlined /> New Tag
                        </Tag>
                    )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Stream Location">
                        <GeoSuggest types={['(cities)']}  placeholder={this.state.location} onChange={(suggest) => {
                            this.handleLocationChange(suggest);
                        }}></GeoSuggest>
                    </Descriptions.Item>
                    <Descriptions.Item label="Stream Status">
                    <Row gutter={8}>
                        <Col span={3}>
                            <Text style={{paddingRight: "6px"}}>Private: </Text>
                            <Switch onChange={this.handlePrivateChange} defaultChecked={this.state.isPrivate}/>
                            <Select mode="multiple" style={{visibility: "hidden"}}></Select>
                        </Col>
                        <Col span={21}>
                            <Text style={{paddingRight: "6px"}}>Allowed Users: </Text>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '50%' }}
                                placeholder="Select Users"
                                onChange={this.handleAllowedUsersChange}
                                options={this.state.allUsernameOptions}
                                defaultValue={this.state.allowedUsers.length != 0 ? this.state.allowedUsers : []}
                                >
                            </Select>
                        </Col>
                    </Row>   
                </Descriptions.Item>
                </Descriptions>
            </div>



          
          </div></Content>
      </Layout>
      </Content>
    </Layout>



              

        );
    }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(StreamConfig);
