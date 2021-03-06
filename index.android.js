/* @flow */
'use strict';

import React, {Component} from 'react';
import {
  AppRegistry,
  View,
  Text,
  StyleSheet,
  AsyncStorage,
} from 'react-native';
import Relay, {RootContainer} from 'react-relay';
import AppNavigator from './js/AppNavigator';
import {UserRoute} from './js/routes/';
import config from './config';


Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(config.graphqlURL, {
    fetchTimeout: 15000,
    retryDelays: [5000, 10000],
  })
);

const UID_APP = config.uidKeyStore;

class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const userRoute = new UserRoute();


    return (
        <RootContainer
          Component={AppNavigator}
          route={userRoute}
          renderLoading={() => (<View style={styles.container}><Text>Loading...</Text></View>)
          }
          renderFetched={
             (data) =>(<AppNavigator {...data} {...this.state} />)
          }
          renderFailure={function(error, retry) {
            return (<View><Text>{error.message}</Text></View>)
          }}
          forceFetch={false}
        />
    );
  }

  componentDidMount(){
    AsyncStorage.getItem(UID_APP, (err, result) => {
      const uid = JSON.parse(result);
      this.setState({
        ...uid
      })
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
})

AppRegistry.registerComponent('mi7', () => App);
