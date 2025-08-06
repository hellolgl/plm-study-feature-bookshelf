import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { pxToDp } from "../tools";
import NavifationUtil from "../../navigator/NavigationUtil";
import FastImage from "react-native-fast-image";
import { appStyle } from "../../theme";

const log = console.log.bind(console);

class Protocol extends Component {
  constructor() {
    super();
    this.screenWidth = Dimensions.get("window").width;
    this.screenHeight = Dimensions.get("window").height;
    this.state = {
      protocolWidth: 0,
      protocolHeight: 0,
    };
    this.scrollRef = React.createRef();
  }

  goBack = () => {
    NavifationUtil.goBack(this.props);
  };

  componentDidMount() {
    const imgType = this.props.navigation.state.params.data.img;
    let width, height;
    if (imgType === "yinsi") {
      width = 927;
      height = 2306;
    } else if (imgType === "ertong") {
      width = 926;
      height = 3094;
    } else if (imgType === 'create' || imgType === 'https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/official-website/static/img/create.png'){
      width = pxToDp(2048)
      height = pxToDp(7688)
    }else {
      width = 930;
      height = 1310;
    }
    this.setState({
      protocolWidth: width,
      protocolHeight: (this.screenWidth / width) * height,
    });
  }

  render() {
    const { protocolWidth, protocolHeight } = this.state;
    const imgType = this.props.navigation.state.params.data.img;
    if (this.scrollRef.current) {
      this.scrollRef.current.scrollTo({ x: 0, y: 0, animated: false });
    }
    if (Platform.OS === "ios") {
      const img = this.props.navigation.state.params.data.img;
      return (
        <View>
          <View
            style={{
              position: "absolute",
              width: pxToDp(200),
              height: pxToDp(200),
              zIndex: 9,
              top: pxToDp(40),
              left: pxToDp(40),
            }}
          >
            <TouchableOpacity onPress={() => this.goBack()}>
              <Image
                style={[{ width: pxToDp(70), height: pxToDp(70) }]}
                source={require("../../images/IOSLogin/blackBackBtn.png")}
                resizeMode="contain"
              ></Image>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{
              width: "100%",
            }}
            contentContainerStyle={[{paddingTop:pxToDp(100),backgroundColor:"#fff"}]}
            ref={this.scrollRef}
          >
            {img === 'https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/official-website/static/img/create.png'?<Image
              style={[{
                width: protocolWidth, 
                height: protocolHeight,
                // margin: pxToDp(100),
              }]}
              source={{uri:img}}
              resizeMode="contain"
            />:<Image
            style={[{
              width: "90%",
              margin: pxToDp(100),
              }]}
              source={img}
              resizeMode="contain"
            />}
          </ScrollView>
        </View>
      );
    } else {
      const imgType = this.props.navigation.state.params.data.img;
      let imgUri = `https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/official-website/static/img/${imgType}.png`;
      return (
        <View
          style={[{
            backgroundColor: "white",
            flex: 1,
          },
            imgType === 'create'?{paddingTop:pxToDp(80)}:null
          ]}
        >
          <View
            style={{
              position: "absolute",
              width: pxToDp(200),
              height: pxToDp(200),
              zIndex: 9,
              top: pxToDp(40),
              left: pxToDp(40),
            }}
          >
            <TouchableOpacity onPress={() => this.goBack()}>
              <Image
                style={[{ width: pxToDp(70), height: pxToDp(70) }]}
                source={require("../../images/IOSLogin/blackBackBtn.png")}
                resizeMode="contain"
              ></Image>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{
              width: "100%",
              flex: 1,
            }}
          >
            <View
              style={[
                { flex: 1, justifyContent: "flex-start" },
                appStyle.flexAliCenter,
              ]}
            >
              <FastImage
                style={{ width: protocolWidth, height: protocolHeight }}
                source={{
                  uri: imgUri,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 28,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    fontSize: 19,
    marginBottom: 5,
  },
});

export default Protocol;
