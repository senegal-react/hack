import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import {
  LoginButton,
  ShareDialog,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

export default class LoginWithFB extends Component {
  constructor(props) {
    super(props);
  }

  //Create response callback.
  _responseInfoCallback(error: ?Object, result: ?Object) {
    if (error) {
      //alert('Error fetching data: ' + error.toString());
    } else {
      //alert('Success fetching data: ' + result);
      let logIn = this.props.logIn;
      logIn(result.name,true)
      this.props.navigator.replace({id: 'Simple', name: `Welcome ${result.name}`, passProps:{...result}})
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert('login has error: ' + result.error);
              } else if (result.isCancelled) {
                alert('login is cancelled.');
              } else {  
                // Create a graph request asking for user information with a callback to handle the response.
                const infoRequest = new GraphRequest(
                  '/me',
                  null,
                  this._responseInfoCallback.bind(this),
                );
                // Start the graph request.
                new GraphRequestManager().addRequest(infoRequest).start();
              }
            }
          }
          onLogoutFinished={() => true}/>
      </View>
    );
  }
}

export class GraphApi {
  constructor(api){
    //super()
    const infoRequest = new GraphRequest(
      api, // api /me
      null,
      this._responseInfoCallback.bind(this),
    );

    new GraphRequestManager().addRequest(infoRequest).start();

  }

  //Create response callback.
  _responseInfoCallback(error: ?Object, result: ?Object) {
    if (error) {
      //alert('Error fetching data: ' + error.toString());
      this.result =  error
    } else {
      this.result = result
    }
  }

  getApi(){
    return this.result;
  }
}

export class ShareWithFB extends Component {
  constructor(props) {
    super(props);
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: "https://www.facebook.com/",
    };

    this.state = {
      shareLinkContent: shareLinkContent,
    };
  }

  shareLinkWithShareDialog() {
    var tmp = this;
    ShareDialog.canShow(this.state.shareLinkContent).then(
      function(canShow) {
        if (canShow) {
          return ShareDialog.show(tmp.state.shareLinkContent);
        }
      }
    ).then(
      function(result) {
        if (result.isCancelled) {
          alert('Share cancelled');
        } else {
          alert('Share success');
        }
      },
      function(error) {
        alert('Share fail with error: ' + error);
      }
    );
  }

  render() {
    return (
        <TouchableHighlight style={styles.share}
          onPress={this.shareLinkWithShareDialog.bind(this)}>
          <Text style={styles.shareText}>Share link with ShareDialog</Text>
        </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  shareText: {
    fontSize: 20,
    margin: 10,
  }
});
