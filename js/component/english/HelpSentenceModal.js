import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
} from "react-native";
import {
  margin_tool,
  size_tool,
  pxToDp,
  borderRadius_tool,
  padding_tool,
} from "../../util/tools";
import { appStyle, appFont } from "../../theme";
import DashSecondLine from "../dashLine";
import Sound from "react-native-sound";
import ViewControl from "react-native-image-pan-zoom";
import LinearGradient from "react-native-linear-gradient";
import { Toast, Radio } from "antd-mobile-rn";
import Audio from "../../util/audio";

/*水平方向的虚线
 * len 虚线个数
 * width 总长度
 * backgroundColor 背景颜色
 * */

const log = console.log.bind(console);

export default class HelpCard extends Component {
  constructor(props) {
    super(props);
    // console.log(props.defaultValue, 'helpcard')
    this.url = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/";
    this.state = {
      paused: true,
      list: [
        {
          image: require("../../images/englishHomepage/helpItem1.png"),
          value: props.defaultValue.word,
          type: "text",
        },
        {
          image: require("../../images/englishHomepage/helpItem2.png"),
          value: props.defaultValue.gpc,
          type: "text",
        },
        {
          image: require("../../images/englishHomepage/helpItem3.png"),
          value: props.defaultValue.meaning,
          type: "text",
        },
        {
          image: require("../../images/englishHomepage/helpItem4.png"),
          value: props.defaultValue.picture,
          type: "image",
        },
      ],
    };
    this.audio = undefined;
    this.playAudioTimer = null;
    this.audioNew = React.createRef();
  }

  componentDidMount() {
    this.playAudio();
  }

  componentWillUnmount() {
    this.audioPaused();
  }

  // 播放读音
  playAudio = () => {
    const { paused } = this.state;
    log("click here111: ", paused);
    this.audioNew.current.replay();
    this.setState({
      paused: !paused,
    });
  };

  audioPaused = () => {
    this.setState({
      paused: true,
    });
  };
  goback() {
    this.audioPaused();
    this.props.goback();
  }

  renderItemBg = (list) => {
    log("will render list: ", list);
    const helpItem1Png = require(`../../images/englishHomepage/helpItem1.png`);
    const helpItem2Png = require(`../../images/englishHomepage/helpItem2.png`);
    const helpItem3Png = require(`../../images/englishHomepage/helpItem3.png`);
    const helpItem4Png = require(`../../images/englishHomepage/helpItem4.png`);
    const imagesList = [helpItem1Png, helpItem2Png, helpItem3Png, helpItem4Png];
    return (
      <View
        style={{
          margin: pxToDp(30),
          // backgroundColor: "green",
          flexDirection: "row",
          flexWrap: "wrap",
          flex: 1,
        }}
      >
        {list.map((item, index) => {
          return (
            <View
              style={{
                width: "50%",
                height: "50%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={{}}>
                <Image
                  source={imagesList[index]}
                  style={[size_tool(700, 400)]}
                ></Image>
                {index === 0 ? (
                  <TouchableOpacity
                    style={[
                      { position: "absolute", zIndex: 100 },
                      appStyle.flexAliCenter,
                      { top: pxToDp(62), right: pxToDp(32) },
                    ]}
                    onPress={() => {
                      this.playAudio(); //播放录音
                    }}
                  >
                    <Image
                      style={[{ width: pxToDp(70), height: pxToDp(48) }]}
                      source={require("../../images/englishHomepage/playAudio.png")}
                    ></Image>
                  </TouchableOpacity>
                ) : null}
                {item.type === "text" ? (
                  <View
                    style={{
                      position: "absolute",
                      top: pxToDp(20),
                      left: 0,
                      right: 0,
                      bottom: 0,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: pxToDp(46),
                        color: "#fff",
                        width: pxToDp(600),
                      }}
                    >
                      {item.value}
                    </Text>
                  </View>
                ) : null}
                {item.type === "image" ? (
                  <View
                    style={{
                      position: "absolute",
                      top: pxToDp(30),
                      left: 0,
                      right: 0,
                      bottom: 0,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{
                        width: pxToDp(406),
                        height: pxToDp(256),
                      }}
                      source={{ uri: this.url + item.value }}
                      resizeMode="contain"
                    />
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  render() {
    const audioPath = this.url + this.props.defaultValue.audio;
    log("audio Path: ", audioPath);
    const { list, paused } = this.state;
    const toolHeight = Platform.OS === "ios" ? 200 : 150;
    return (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: "#F5D6A6",
            alignItems: "center",
          },
        ]}
      >
        <View
          style={[
            {
              height: pxToDp(toolHeight),
              alignSelf: "flex-end",
              //   backgroundColor: "pink",
              width: "100%",
              alignItems: "flex-end",
            },
          ]}
        >
          <TouchableOpacity
            onPress={this.goback.bind(this)}
            style={[
              {
                marginRight: pxToDp(80),
                height: pxToDp(toolHeight),
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: "pink",
              },
            ]}
          >
            <Image
              style={{ width: pxToDp(194), height: pxToDp(79) }}
              source={require("../../images/englishHomepage/helpNext.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={[padding_tool(40, 40, 0, 40), styles.wordmainWrap]}>
          <View style={[styles.wordmainInBg]}>{this.renderItemBg(list)}</View>
        </View>
        <View style={[styles.wordFooter]}>
          <View style={[styles.wordFooterbg1]}></View>
          <View style={[styles.wordFooterbg2]}></View>
          <View style={[styles.wordFooterbg3]}></View>
        </View>
        <Audio
          uri={audioPath}
          paused={paused}
          pausedEvent={this.audioPaused}
          ref={this.audioNew}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  contentWrap: {
    // backgroundColor: "#fff",
    zIndex: 1,
    minWidth: pxToDp(220),
    minHeight: pxToDp(110),
  },
  wordmainWrap: {
    alignItems: "center",
    flex: 1,
    width: pxToDp(1800),
    backgroundColor: "#A86A33",
    borderTopLeftRadius: pxToDp(64),
    borderTopRightRadius: pxToDp(64),
  },
  wordmainInBg: {
    flex: 1,
    width: pxToDp(1720),
    backgroundColor: "#1F1F1F",
    borderTopLeftRadius: pxToDp(56),
    borderTopRightRadius: pxToDp(56),
  },
  wordFooter: {
    height: pxToDp(100),
    width: "100%",
  },
  wordFooterbg1: {
    height: pxToDp(16),
    backgroundColor: "#FDC798",
  },
  wordFooterbg2: {
    height: pxToDp(24),
    backgroundColor: "#A86A33",
  },
  wordFooterbg3: {
    flex: 1,
    backgroundColor: "#6F2F09",
  },
});
