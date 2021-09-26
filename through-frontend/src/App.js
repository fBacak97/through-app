import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import axios from "axios"

import Navbar from "./components/layout/Navbar";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";
import Stream from "./components/Stream"
import Start from "./components/layout/Start"
import Watch from "./components/Watch";
import MeetingCalendar from "./components/MeetingCalendar";
import StreamConfig from "./components/StreamConfig"

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);

  // Decode token and get user info and exp
  const decoded = jwt_decode(token);

  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds

  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {

  componentDidMount(){
    if(store.getState().auth.user.name){
      axios.post('/api/users/change_stream_status', {
        username: store.getState().auth.user.name,
        status: "offline"
      },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      })
    }
  }

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <PrivateRoute path="/" component={Navbar} />
            <Route exact path="/" component={Start} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/stream" component={Stream} />
              <PrivateRoute exact path="/watch/:streamer" component={Watch} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/calendar" component={MeetingCalendar} />
              <PrivateRoute exact path="/config" component={StreamConfig} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
