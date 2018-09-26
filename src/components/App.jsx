import React from 'react'


import styles from '../styles/index.scss'

import history from '../utils/history'
import router from './routes.jsx'
import * as firebaseui from 'firebaseui'

import firebase from 'firebase'

import serverCom from '../utils/serverCom'


serverCom.begin();

var uiConfig = {
  signInSuccessUrl: 'hahahhahahahahhahahaahahah',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
  // tosUrl and privacyPolicyUrl accept either url string or a callback
  // function.
  // Terms of service url/callback.
  tosUrl: '<your-tos-url>',
  // Privacy policy url/callback.
  privacyPolicyUrl: function () {
    window.location.assign('<your-privacy-policy-url>');
  }
};



export default class Router extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      currentPath: history.location,
      user: null
    }
  }

  render() {
    console.log('user', this.state.user)
    var Component = router.resolve(window.location)
    return (
      <div>
        <div
          style={{
            display: (this.state.user == null) ? 'none' : 'block'
          }}
          id="firebaseui-auth-container"
        ></div>
        <Component />
      </div>
    )
  }

  componentDidMount() {
    history.listen((location) => {
      this.setState({
        currentPath: location
      })
    });


    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);

    console.log(firebase.auth().currentUser)

    // firebase.auth().signOut()
    //   .then(function () {
    //     // Sign-out successful.
    //   })
    //   .catch(function (error) {
    //     // An error happened
    //   });

    // You have to add an auth state change observer.

      firebase.auth().onAuthStateChanged(function (user) {
        console.log('asdf', user)
        if (user) {
          this.setState({
            user
          })
        } else {
          // No user is signed in.
        }
      });


  }
}
