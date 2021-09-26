import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, PageHeader, TimePicker, Modal, Input, Button } from "antd";
import axios from 'axios'

class BookingModal extends Component {

    constructor(props){
        super(props);
        this.formRef = React.createRef();
    }

    handleCancel = () => {
        this.formRef.current.resetFields();
        this.props.unmountMe();
    }

    createPrivateMeetingRequest = async (values) => {
        const res = await axios.post("/api/private_meeting/request_private_meeting", 
        {
            requestedBy: this.props.auth.user.name,
            requestedFrom: this.props.viewer.watchedUser,
            note: values.note,
            title: values.title,
            startDate: values.timeSlot[0],
            endDate: values.timeSlot[1]
        },
        {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            }
        })
        if(res.data.status == "success"){
            Modal.success({
                content: "Your private meeting request is created!",
                onOk: () => {
                    Modal.destroyAll();
                    this.formRef.current.resetFields();
                    this.props.unmountMe();
                }
            })
        }else{
            Modal.error({
                content: "Your private meeting request could not be processed!",
                onOk: () => {
                    Modal.destroyAll();
                }
            })
        }
    }

    render() {
        return (
            <Modal
                visible={this.props.visible}
                onCancel={this.handleCancel}
                okButtonProps={{form:'bookingForm', key: 'submit', htmlType: 'submit'}}
            >
                <PageHeader
                    title="What is the Occasion?"
                    backIcon={false}
                />
                <Form
                    id="bookingForm"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={ (values) => this.createPrivateMeetingRequest(values)}
                    ref={this.formRef}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{required: true, message: "Please state your purpose shortly"}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Time Slot"
                        name="timeSlot"
                        rules={[{required: true, message: "Please select an available time slot"}]}
                    >
                        <TimePicker.RangePicker
                            format="HH:mm"
                            minuteStep={15}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Add Note"
                        name="note"
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  viewer: state.viewer,
});

export default connect(mapStateToProps, {})(BookingModal);
