import React, { Component } from 'react';
import {
  Navigator,
  TouchableHighlight,
  StyleSheet,
  BackAndroid,
  Text,
  View,
  Image,
} from 'react-native';
import Relay from 'react-relay';
import Simple from './Simple';
import Collection from './Collection';

import SideMenu from './SideMenu'

var _navigator;

var sideMenu;

const IMG_DIR = './src/images';

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});


class FixApp extends Component {
  constructor(){
    super()
    this.state = {
      id : '',
      sectionName : 'Home',
      connected: true,
      sm: null,
    }

    this._renderScene = this._renderScene.bind(this)
  }

  _navigationBar(){
    return (
      <Navigator.NavigationBar
      routeMapper = {this._routeMapper}
      style = {styles.navBarStyle}
      />
    )
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
        console.log('sidemenu debug')
        console.log(route.passProps)
        if(index === 0){
          imgsrc = require(`./images/ic_menu_black_24dp.png`)
          onPress = () => {sideMenu.openDrawer()}
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

  _renderScene(route, navigator ) {
    _navigator = navigator;

    switch (route.id) {
      case 'Simple':
        return (
          <Simple
            viewer={this.props.viewer}
            navigator={navigator}
            {...route.passProps}
          />
        )
      case 'Collection':
        return (
          <Simple
            navigator={navigator}
          />
        )
      default:
        return (
          <View style={styles.view}>
            <TouchableHighlight onPress={() => _navigator.replace({id: ''})}>
              <Text style={styles.link}>Welcome!!!</Text>
            </TouchableHighlight>


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

  render() {
    return (
      <Image source={require('./images/background.png')} style={styles.backgroundImage}>
      <SideMenu ref={'drawer'} onItemClick={this.handleItemClick.bind(this)} >
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
    </Image>
    );
  }

  componentDidMount(){
    // BackAndroid.addEventListener('hardwareBackPress', () => {
    //   const navigator = this.refs["navigator"]
    //   if(navigator && navigator.getCurrentRoutes().length > 1){
    //     navigator.pop()
    //     return true
    //   }
    //   return false
    // })
    //console.log('didMount')
    this.state = {
      sm: this.refs['drawer']
    }
    sideMenu = this.refs['drawer'];
    //console.log(sideMenu);
  }
};

export default Relay.createContainer(FixApp, {
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
