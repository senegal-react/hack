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
import FixApp from './src/components/FixApp';
import ViewerRoute from './src/routes/ViewerRoute';
import config from './config';


Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(config.graphqlURL, {
    fetchTimeout: 15000,
    retryDelays: [5000, 10000],
  })
);

class Mi7App extends Component {
  render() {
    const viewerRoute = new ViewerRoute();
    return (
        <RootContainer
           Component={FixApp}
           route={viewerRoute}
           renderLoading={() => (<View style={styles.container}><Text>Loading...</Text></View>)
           }
           renderFetched={
             (data) =>(<FixApp {...this.props} {...data} />)
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

AppRegistry.registerComponent('mi7', () => Mi7App);
