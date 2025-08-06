import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image
} from "react-native";
import { appStyle } from "../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../util/tools";
import url from '../../../util/url'

class AutoImage extends PureComponent {
  constructor(props) {
    super(props);
    this.imgUrl = url.baseURL
    this.state = {
      width: 0,
      height: 0
    };
  }
  componentDidMount() {

    Image.getSize(url.baseURL + this.props.url, (width, height) => {
      this.setState({
        width,
        height
      })
    }, () => {
      this.setState({
        width: 0,
        height: 0
      })
    })
  }
  componentDidUpdate(prevProps, prevState) {
    Image.getSize(url.baseURL + this.props.url, (width, height) => {
      this.setState({
        width,
        height
      })
    }, () => {
      this.setState({
        width: 0,
        height: 0
      })
    })
  }
  render() {
    const { width, height } = this.state
    const { url } = this.props
    if (!url) return null
    return width > 0 ? <Image resizeMode='contain' style={[{ width: width, height: height, marginTop: pxToDp(32) }]} source={{ uri: this.imgUrl + url }} ></Image> : null;
  }
}

const styles = StyleSheet.create({
});
export default AutoImage;
