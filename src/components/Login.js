import React, { Component } from "react";
import { GoogleLogin } from "react-google-login";
import Parse from "parse";

class Login extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() { }

  onSignIn = async googleUser => {
    console.log("googleUser: ", googleUser);
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log("Full Name: " + profile.getName());
    console.log("Given Name: " + profile.getGivenName());
    console.log("Family Name: " + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);

    const obj = {
      google: {
        id: profile.getId(),
        id_token
      }
    };

    const user = new Parse.User();
    user.set('email', profile.getEmail())
    user.set('name', profile.getName())
    user.set('image', profile.getImageUrl())
    const yes = await user._linkWith("google", {
      authData: {
        id: profile.getId(),
        id_token
      }
    });
    this.props.onLogIn()
    console.log("yes: ", yes);
  };

  render() {
    return (
      <GoogleLogin
        clientId="1070145465944-tn8056d56nvbfrcs4avbsce8q17psc4g.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={this.onSignIn}
        onFailure={fail => {
          console.log("fail", fail);
          console.log("fail", fail.details);
        }}
        cookiePolicy={"single_host_origin"}
      />
    );
  }
}

export default Login;
