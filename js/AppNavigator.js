import React, { Component } from 'react';
import {
  Navigator,
  TouchableHighlight,
  StyleSheet,
  BackAndroid,
  Text,
  View,
  Image,
  Animated,
  AsyncStorage,
} from 'react-native';
import Relay from 'react-relay';

import {
  GraphRequest,
  GraphRequestManager,
  AccessToken,
} from 'react-native-fbsdk';

import config from '../config';

const UID_APP = config.uidKeyStore;

import {Simple, Collection} from './components';

import SideMenu from './SideMenu';

import LoginWithFB, {ShareWithFB, GraphApi} from './FacebookSDK';

let _drawer;

class AppNavigator extends Component {
  constructor(props){
    super(props)
    this.state = {
      connected: props.connected,
      someAnimatedValue: new Animated.Value(0),
      username: '',
      graphApi: new GraphApi('/me'),
    }

    this._renderScene = this._renderScene.bind(this)
  }

  async logIn(username: ?String, connected: ?Boolean){
    AsyncStorage.setItem(UID_APP, JSON.stringify({username, connected}));
    this.setState({
      username: username,
      connected: connected,
    })
  }

  _routeMapper = {
      Title : (route,navigator,index,state) => {
        return (
          <Text
            style={[styles.navBarText,styles.navBarTitleText]}
          >
            {route.name}
          </Text>
      )
      },
      LeftButton : (route,navigator,index,state) => {
        let imgsrc =  require(`./images/ic_arrow_back_black_24dp.png`)
        let onPress = () => {navigator.pop()}
        if(index === 0){
          imgsrc = require(`./images/ic_menu_black_24dp.png`)
          onPress = () => {_drawer.openDrawer()}
        }
        return (
          <TouchableHighlight
            onPress = {onPress}
           >
            <Image
            source={imgsrc}
            style={styles.navBarLeftItemStyle}
            />
          </TouchableHighlight>
        )
      },
      RightButton : (route,navigator,index,state) => {
        return null
      }
  }

  _navigationBar(){
    if(this.state.connected)
    return (
      <Navigator.NavigationBar
      routeMapper = {this._routeMapper}
      style = {styles.navBarStyle}
      />
    )
  }

  _renderScene(route, navigator ) {
    switch (route.id) {
      case 'Simple':
        return (
          <Simple
            viewer={this.props.viewer}
            navigator={navigator}
            {...route.passProps}
          />
        )
      case 'Share':
        return (
          <Image source={require('./images/background.png')} style={styles.backgroundImage}>
            <View style={styles.view}>
              <TouchableHighlight onPress={
                () => {
                  navigator.replace({id: ''})
                }
              }
              >
                <Text style={styles.link}>Welcome!!!</Text>
              </TouchableHighlight>
              <ShareWithFB />
            </View>
          </Image>
        )
      default:
      if(!this.state.connected)
      return (
        <LoginWithFB
          navigator={navigator}
          logIn={this.logIn.bind(this)}
        />
      )
        return (
          <View style={styles.view}>
            <Text> Welcome {this.state.username} </Text>
          </View>
        )
    }
  }

  handleItemClick(id,name){
    this.setState({
      id : id,
      name: name,
    })
    this.refs["navigator"].push({id:id, name: name, passProps: {}})
  }

  _handleBackButton(){
    const {navigator} = this.refs
    if(navigator && navigator.getCurrentRoutes().length > 1){
      navigator.pop()
      return true
    }
    return false
  }

  componentDidMount(){
    BackAndroid.addEventListener('hardwareBackPress', this._handleBackButton)
    _drawer = this.refs['drawer'];
  }

  componentWillUnmount(){
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  render() {
    return (
      <SideMenu ref={'drawer'} onItemClick={this.handleItemClick.bind(this)} username={this.props.username} >
        <Navigator
          ref = "navigator"
          initialRoute={{ id: '', name: '', passProps: {}}}
          renderScene={this._renderScene}
          configureScene={(route) => {
            if (route.sceneConfig) {
              return route.sceneConfig;
            }
            return Navigator.SceneConfigs.FloatFromBottom;
          }}
          navigationBar = {this._navigationBar()}
        />
      </SideMenu>
    );
  }

};

export default Relay.createContainer(AppNavigator, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${Simple.getFragment('viewer')}
      }
    `,
  },
});

var styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    width: undefined,
    height: undefined,
  },
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    color: 'blue',
  },

  navBarText : {
    fontSize : 16,
    marginVertical : 9,
  },
  navBarTitleText : {
    fontWeight : "500",
  },
  navBarLeftItemStyle : {
    height : 25,
    width : 25,
    marginLeft : 10,
    marginTop : 10,
  },
  navBarStyle :{
    justifyContent : 'center',
    alignItems : 'center',
    backgroundColor : 'white',
  },
  navSceneStyle : {
    paddingTop : 45,
    marginBottom : 25,
  }
});
