import React,{Component} from 'react';

import {
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

class Back extends Component{
  render() {
      return (
        <TouchableHighlight
          onPress={() => this.props.navigator.jumpBack()}>
          <Text style={styles.link}>back</Text>
        </TouchableHighlight>
      )
    }
}

var styles = StyleSheet.create({
  link: {
    color: 'blue',
  }
});

module.exports = Back;
