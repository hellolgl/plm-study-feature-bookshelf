import React, { Component } from "react";
import { Text, StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";



export default class BaseButton extends Component {

  onPress = () => {
    const { onPress } = this.props;
    onPress ? onPress() : "";
  };


  render() {
    const { text, backgroundColor } = this.props;
    const styleButton = this.props.style || styles.button
    const styleButtonText = this.props.buttonTextStyle || styles.buttonText
    return (
      <View>
        <TouchableOpacity
          style={[styles.button,styleButton]}
          onPress={this.onPress}>
          <Text numberOfLines={3} ellipsizeMode={'tail'} style={[styles.buttonText,styleButtonText]}>{text ? text : "确定"}</Text>
        </TouchableOpacity>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    height: 30,
    borderRadius: 20,
    margin: 10,
    backgroundColor:'#33A1FDFF',
    justifyContent: 'center',
    borderColor: '#33A1FDFF'
  },
  buttonText: {
    fontSize:10,
    textAlign: 'center',
    color: '#000',
  }
});