import React, {Component} from 'react';
import Relay from 'react-relay';

import {
  View,
  Text,
  StyleSheet,
  ListView,
  RefreshControl,
  TouchableHighlight,
} from 'react-native';

import sections from '../stub.json'; // For testing ListView


class Simple extends Component {

  constructor(props){
    super(props)
    this.state = {
      loaded : false,
      refreshing : false,
      isLoadingTail : false,
      dataSource : new ListView.DataSource({
        rowHasChanged : (row1,row2) => row1 !== row2,
      }).cloneWithRows(sections),
    }

    this._onRefresh = this._onRefresh.bind(this)
    this._renderItem = this._renderItem.bind(this)
    this._onEndReached = this._onEndReached.bind(this)
  }

  _onEndReached() {
     if (this.state.isLoadingTail) {
         return;
     }
     this.setState({
         isLoadingTail: true
     });

     sections.push({id:'new', name:'Refreshed new data :' + Math.round(Math.random(9)*100)})
     this.setState({
       dataSource : new ListView.DataSource({
         rowHasChanged : (row1,row2) => row1 !== row2,
       }).cloneWithRows(sections)
     })

     this.setState({
         isLoadingTail: false,
     });
   }

   refreshDataSource(top){
     if(top)sections.unshift({id:'new', name:'Refreshed new data :' + Math.round(Math.random(9)*100)})
     else sections.push({id:'new', name:'Refreshed new data :' + Math.round(Math.random(9)*100)})
     this.setState({
       dataSource : new ListView.DataSource({
         rowHasChanged : (row1,row2) => row1 !== row2,
       }).cloneWithRows(sections)
     })
   }

  _onRefresh() {
    this.setState({refreshing: true})
    sections.unshift({id:'new', name:'Refreshed new data :' + Math.round(Math.random(9)*100)})
    this.setState({
      dataSource : new ListView.DataSource({
        rowHasChanged : (row1,row2) => row1 !== row2,
      }).cloneWithRows(sections)
    })
    this.setState({refreshing: false})
  }

  _renderItem(item){
    return (
      <TouchableHighlight
      onPress = {() => {
        return false
      }}
      >
          <View style={styles.section}>
            <Text style={styles.sectionText}>{item.name}</Text>
          </View>
      </TouchableHighlight>
    )
  }

  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}
      />
    );
  }

  render() {
      return (
          <View style={{flex:1, paddingTop:55}}>
            <ListView
             refreshControl = {
               <RefreshControl
               refreshing={this.state.refreshing}
               onRefresh={this._onRefresh}

              />
            }
             dataSource={this.state.dataSource}
             renderRow = {this._renderItem}
             onEndReached={this._onEndReached}
             style = {styles.listView}
             renderSeparator={(sectionID,rowID) => this._renderSeparator(sectionID,rowID)}
            />
          </View>

    );
  }
}

export default Relay.createContainer(Simple, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        name
      }
    `,
    // widgets: () => Relay.QL`
    //   fragment on User {
    //     widgets(first:2) {
    //       edges {
    //         node {
    //           name
    //         }
    //       }
    //     }
    //   }
    // `,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection : 'row',
    alignItems: 'center',
    paddingTop : 55,
  },
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section:{
    height:55,
    justifyContent: 'center',
  },
  sectionText:{
    fontSize : 18,
    textAlign : 'left',
    color: 'black',
  },
});
