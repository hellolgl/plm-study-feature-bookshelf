/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component, PureComponent } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import WebCanvas from './WebCanvas.js';

export default class Canvas extends PureComponent {

  constructor(props) {
    super(props)
  }

  _pen = () => {
    if (!this.refs.canvas) return
    this.refs.canvas._pen();
  }

  _clear = () => {
    if (!this.refs.canvas) return
    this.refs.canvas.clear();
  }

  _nextTopaic = () => {
    //console.log('canvas 下一题', this.refs.canvas)
    if (!this.refs.canvas) return
    this.refs.canvas.nextTopaic()
  }



  // 以url的形式添加背景
  _addImageUrl = (url) => {
    this.refs.canvas._addImageUrl(url);
  }

  // 以base64的形式添加背景
  _addImageBase64() {
    this.refs.canvas._addImageBase64(base64);
  }

  // 得到图片的base64形式
  _getBase64() {
    this.refs.canvas._getBase64(base64);
  }

  // 保存base64
  _handleBase64(data) {
    alert(data)
  }

  // 图片右转
  _rotateRight() {
    this.refs.canvas._rotateRight();
  }

  componentDidMount() {
    this._pen()

  }

  render() {
    return (
      <View style={styles.container}>
        <WebCanvas
          handleBase64={this._handleBase64.bind(this)}
          ref='canvas'
          height={this.props.height || 310}
          width={this.props.width || 600}
          onRef={this.props.onRef}
          getDataFromCanvas={this.props.getDataFromCanvas}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

// AppRegistry.registerComponent('test_canvas', () => test_canvas);
