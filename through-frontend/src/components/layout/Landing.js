import React, { Component } from "react";
import axios from "axios"

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liveUsers: null,
    };
  }

  fetchLiveUsers() {
    axios.get( "/api/users/", {
      params: {status: "live"}
    })
    .then((response) => {
      this.setState({liveUsers: response.data.result})
    })
    ;
  }

  componentWillMount() {
    this.fetchLiveUsers();
  }

  render() {
    return (
    <div>{JSON.stringify(this.state.liveUsers)}</div>
      // <div style={{ height: "75vh" }} className="container valign-wrapper">
      //   <div className="row">
      //     <div className="col s12 center-align">
      //       <h4>
      //         <b>Build</b> a login/auth app with the{" "}
      //         <span style={{ fontFamily: "monospace" }}>MERN</span> stack from
      //         scratch
      //       </h4>
      //       <p className="flow-text grey-text text-darken-1">
      //         Create a (minimal) full-stack app with user authentication via
      //         passport and JWTs
      //       </p>
      //       <br />
      //       <div className="col s6">
      //         <Link
      //           to="/register"
      //           style={{
      //             width: "140px",
      //             borderRadius: "3px",
      //             letterSpacing: "1.5px",
      //           }}
      //           className="btn btn-large waves-effect waves-light hoverable blue accent-3"
      //         >
      //           Register
      //         </Link>
      //       </div>
      //       <div className="col s6">
      //         <Link
      //           to="/login"
      //           style={{
      //             width: "140px",
      //             borderRadius: "3px",
      //             letterSpacing: "1.5px",
      //           }}
      //           className="btn btn-large btn-flat waves-effect white black-text"
      //         >
      //           Log In
      //         </Link>
      //       </div>
      //     </div>
      //   </div>
      // </div>
    );
  }
}
export default Landing;
