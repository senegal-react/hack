import React,{Component} from 'react'
import {
  DrawerLayoutAndroid,
  Dimensions,
  StyleSheet,
  ListView,
  TouchableHighlight,
  View,
  Text,
  Image,
} from 'react-native'
import sections from '../sections.json'

const DRAWER_WIDTH_LEFT = 55


class SideMenu extends Component{
  constructor(props){
    super(props)
    this.state = {
      drawerDataSource : new ListView.DataSource({
        rowHasChanged : (row1,row2) => row1 !== row2,
      }).cloneWithRows(sections),
    }


  }

  sectionClick(id,name){
    this.props.onItemClick(id,name)
    this.drawer.closeDrawer()
  }
  _renderDrawerRow(item){
    return (
      <TouchableHighlight
      onPress = {() => this.sectionClick(item.id,item.name)}
      >
        <View style={styles.section}>
          <Text style={styles.sectionText}>{item.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  _renderDrawerContent(){
    return (
        <View>
          <Text> {this.props.name} </Text>
          <ListView
            style={styles.drawerListViewStyle}
            dataSource={this.state.drawerDataSource}
            renderRow={this._renderDrawerRow.bind(this)}
          />
        </View>
    )
  }
  openDrawer(){
    this.drawer.openDrawer()
  }
  render(){
    return (
      <DrawerLayoutAndroid
       drawerPosition={DrawerLayoutAndroid.positions.Left}
       drawerWidth={Dimensions.get('window').width - DRAWER_WIDTH_LEFT}
       keyboardDismissMode="on-drag"
       onDrawerOpen={() => {
         this._overrideBackPressForDrawerLayout = true;
       }}
       onDrawerClose={() => {
         this._overrideBackPressForDrawerLayout = false;
       }}
       ref={(drawer) => {this.drawer = drawer}}
       renderNavigationView={this._renderDrawerContent.bind(this)}
       >
       {this.props.children}
       </DrawerLayoutAndroid>
   )
  }

  componentWillMount(){

  }
}

var styles = StyleSheet.create({
  toolbar: {
    height: 56,
  },
  section:{
    height:50,
  },
  sectionText:{
    fontSize : 18,
    textAlign : 'left',
    color: 'black',
  },
  drawerListViewStyle :{
    paddingTop:40,
  },
  listStyle : {
    paddingTop : 20,
  }
})

export default SideMenu
