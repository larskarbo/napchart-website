import React, { Component } from "react";
import Login from "./Login"
import Parse from "parse";

class User extends Component {
  constructor() {
    super();
    this.state = {
      user: Parse.User.current()
    };
    console.log('this.state: ', this.state);

  }

  componentDidMount() { }


  render() {
    return (
      <div>
        {this.state.user ? (<div>loggedin
          <button
                  margin="medium"
                  onClick={async () => {
                    await Parse.User.logOut();
                    this.setState({
                      currentUser: Parse.User.current()
                    });
                  }}
                >Log out</button>
        </div>) : (<Login
          onLogIn={() => {
            this.setState({
              currentUser: Parse.User.current()
            });
          }}
        />)}

      </div>
    );
  }
}

export default User;
