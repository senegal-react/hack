/* @flow */
'use strict';

import React, {Component} from 'react';
import {
  AppRegistry,
  View,
  Text,
  StyleSheet,
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

class App extends Component {
  render() {
    const userRoute = new UserRoute();
    return (
        <RootContainer
          Component={AppNavigator}
          route={userRoute}
          renderLoading={() => (<View style={styles.container}><Text>Loading...</Text></View>)
          }
          renderFetched={
             (data) =>(<AppNavigator {...this.props} {...data} connected={true} />)
          }
          renderFailure={function(error, retry) {
            return (<View><Text>{error.message}</Text></View>)
          }}
          forceFetch={true}
        />
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
})

AppRegistry.registerComponent('mi7', () => App);
