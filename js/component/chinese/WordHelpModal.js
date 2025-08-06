import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Animated,
  ScrollView,
} from "react-native";
import { appStyle } from "../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  borderRadius_tool,
  margin_tool,
} from "../../util/tools";
import DashSecondLine from "../dashLine";
import Sound from "react-native-sound";
import url from "../../util/url";
class WordHelpModal extends PureComponent {
  constructor(props) {
    super(props);
    this.audio = undefined;
    this.state = {
      opacityList: [
        {
          opacity: new Animated.Value(0),
        },
        {
          opacity: new Animated.Value(0),
        },
        {
          opacity: new Animated.Value(0),
        },
        {
          opacity: new Animated.Value(0),
        },
        {
          opacity: new Animated.Value(0),
        },
        {
          opacity: new Animated.Value(0),
        },
        {
          opacity: new Animated.Value(0),
        },
      ],
      lineList: [
        // 拼音
        {
          translateY: -100,
          rotate: "-10deg",
          len: 8,
          width: 130,
        },
        // 结构
        {
          translateY: 100,
          rotate: "-40deg",
          len: 11,
          width: 180,
        },
        // 释义
        {
          translateY: 100,
          rotate: "40deg",
          len: 13,
          width: 220,
        },
        // 近义词
        {
          translateY: 120,
          rotate: "-125deg",
          len: 15,
          width: 250,
        },
        // 相关成语
        {
          translateY: 120,
          rotate: "120deg",
          len: 13,
          width: 240,
        },
        // 易混淆词语
        {
          translateY: 120,
          rotate: "80deg",
          len: 15,
          width: 280,
        },
        // 反义词
        {
          translateY: 120,
          rotate: "-80deg",
          len: 15,
          width: 250,
        },
      ],
    };
  }
  //关闭语音播放
  closeAudio = () => {
    if (this.audio) {
      this.audio.stop();
      this.audio = undefined;
    }
  };
  // 播放读音
  playAudioHelp = (index) => {
    let path = url.baseURL + this.props.detailsObj.audio;
    console.log("播放语音地址", path);
    if (!path) {
      return;
    }
    if (this.audio) {
      this.audio.stop(() => {
        this.audio.play();
      });
      this.audio = undefined;
      // this.audio.stop(() => {
      //   this.audio.play((success) => {
      //     if (success) {
      //       this.audio.release();
      //     }
      //   });
      // });
      // return;
    }
    this.audio = new Sound(path, null, (error) => {
      if (error) {
        console.log("播放失败");
      } else {
        this.audio.play((success) => {
          if (success) {
            this.audio.release();
          }
        });
      }
    });
  };
  onShow = () => {
    const { opacityList } = this.state;
    this.playAudioHelp(0);
    // let topicKey = "pinyin";
    let topicKey = this.props.detailsObj.topicKey;
    let _opacityList = opacityList.concat([]);
    _opacityList.forEach((item, index) => {
      item.opacity = new Animated.Value(0);
    });
    _opacityList.forEach((item, index) => {
      item.opacity = new Animated.Value(0);
    });
    if (topicKey === "pinyin" || topicKey === "listen") {
      Animated.timing(_opacityList[0].opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      // Animated.sequence([
      //   Animated.timing(_opacityList[0].opacity, {
      //     toValue: 1,
      //     duration: 1000,
      //     useNativeDriver: true,
      //   }),
      //   Animated.timing(_opacityList[1].opacity, {
      //     toValue: 1,
      //     duration: 1000,
      //     useNativeDriver: true,
      //   }),
      //   Animated.parallel([
      //     Animated.timing(_opacityList[2].opacity, {
      //       toValue: 1,
      //       duration: 1000,
      //       useNativeDriver: true,
      //     }),
      //     Animated.timing(_opacityList[3].opacity, {
      //       toValue: 1,
      //       duration: 1000,
      //       useNativeDriver: true,
      //     }),
      //     Animated.timing(_opacityList[4].opacity, {
      //       toValue: 1,
      //       duration: 1000,
      //       useNativeDriver: true,
      //     }),
      //     Animated.timing(_opacityList[5].opacity, {
      //       toValue: 1,
      //       duration: 1000,
      //       useNativeDriver: true,
      //     }),
      //     Animated.timing(_opacityList[6].opacity, {
      //       toValue: 1,
      //       duration: 1000,
      //       useNativeDriver: true,
      //     }),
      //   ]),
      // ]).start();
    }
    if (topicKey === "structure") {
      Animated.sequence([
        Animated.timing(_opacityList[0].opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(_opacityList[1].opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
    if (topicKey === "meaning") {
      Animated.sequence([
        Animated.timing(_opacityList[0].opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(_opacityList[1].opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(_opacityList[2].opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(_opacityList[3].opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(_opacityList[4].opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(_opacityList[5].opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(_opacityList[6].opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
    this.setState({
      opacityList: _opacityList,
    });
  };
  // 播放读音
  renderWordPY = (detailsObj) => {
    const { opacityList } = this.state;
    // detailsObj.pinyin = 'long feng feng wu'
    return (
      <Animated.View
        style={[
          styles.contentWrap,
          borderRadius_tool(18),
          padding_tool(26, 30),
          {
            left: 540,
            top: 40,
            opacity: opacityList[0].opacity,
          },
        ]}
      >
        <Text style={[styles.contentText]}>拼音:</Text>
        <TouchableOpacity
          onPress={() => {
            this.playAudioHelp(0);
          }}
        >
          <View
            style={[
              appStyle.flexTopLine,
              appStyle.flexJusBetween,
              appStyle.flexAliCenter,
              margin_tool(20, 0, 0, 0),
            ]}
          >
            <Text style={[{ color: "#333", fontSize: pxToDp(32) }]}>
              {detailsObj.pinyin}
            </Text>
            <View
              style={[
                {
                  backgroundColor:
                    "linear-gradient(275deg, rgba(54, 187, 254, 1) 0%, rgba(93, 199, 254, 1) 100%)",
                  marginLeft: pxToDp(32),
                },
                padding_tool(12),
                borderRadius_tool(8),
              ]}
            >
              <Image
                style={[{ width: pxToDp(27), height: pxToDp(24) }]}
                source={require("../../images/voice.png")}
              ></Image>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  renderWordJyc = (detailsObj) => {
    const { opacityList } = this.state;
    return (
      <Animated.View
        style={[
          styles.contentWrap,
          borderRadius_tool(18),
          padding_tool(25),
          {
            width: pxToDp(450),
            left: 870,
            top: 110,
            opacity: opacityList[3].opacity,
          },
        ]}
      >
        <Text style={[styles.contentText]}>近义词:</Text>
        <ScrollView style={{ maxHeight: 50 }}>
          <Text style={[{ fontSize: pxToDp(32) }]}>
            {detailsObj.word_synonym}
          </Text>
        </ScrollView>
      </Animated.View>
    );
  };
  renderWordCy = (detailsObj) => {
    const { opacityList } = this.state;
    return (
      <Animated.View
        style={[
          styles.contentWrap,
          borderRadius_tool(18),
          padding_tool(25),
          {
            width: pxToDp(480),
            left: 140,
            top: 120,
            opacity: opacityList[4].opacity,
          },
        ]}
      >
        <Text style={[styles.contentText]}>相关句子:</Text>
        <ScrollView style={{ maxHeight: 50 }}>
          <Text style={[{fontSize:pxToDp(32)}]}>{detailsObj.word_idiom}</Text>
        </ScrollView>
      </Animated.View>
    );
  };
  renderWordHx = (detailsObj) => {
    const { opacityList } = this.state;
    return (
      <Animated.View
        style={[
          styles.contentWrap,
          borderRadius_tool(18),
          padding_tool(25),
          {
            width: pxToDp(400),
            left: 160,
            top: 290,
            opacity: opacityList[5].opacity,
          },
        ]}
      >
        <Text style={[styles.contentText]}>易混淆词语:</Text>
        <ScrollView style={{ maxHeight: 50 }}>
          <Text style={[{ fontSize: pxToDp(32) }]}>
            {detailsObj.word_confusing}
          </Text>
        </ScrollView>
      </Animated.View>
    );
  };
  renderWordFyc = (detailsObj) => {
    const { opacityList } = this.state;
    return (
      <Animated.View
        style={[
          styles.contentWrap,
          borderRadius_tool(18),
          padding_tool(25),
          {
            width: pxToDp(400),
            left: 910,
            top: 280,
            opacity: opacityList[6].opacity,
          },
        ]}
      >
        <Text style={[styles.contentText]}>反义词:</Text>
        <ScrollView style={{ maxHeight: 50 }}>
          <Text style={[{ fontSize: pxToDp(32) }]}>
            {detailsObj.word_antonym}
          </Text>
        </ScrollView>
      </Animated.View>
    );
  };
  renderWordJg = (detailsObj) => {
    const { opacityList } = this.state;
    return (
      <Animated.View
        style={[
          styles.contentWrap,
          borderRadius_tool(18),
          padding_tool(25),
          {
            width: pxToDp(300),
            left: 750,
            top: 430,
            opacity: opacityList[1].opacity,
          },
        ]}
      >
        <Text style={[styles.contentText]}>结构:</Text>
        <Text style={[{ fontSize: pxToDp(32) }]}>{detailsObj.structure}</Text>
      </Animated.View>
    );
  };
  renderWordSy = (detailsObj) => {
    const { opacityList } = this.state;
    return (
      <Animated.View
        style={[
          styles.contentWrap,
          borderRadius_tool(18),
          padding_tool(25),
          {
            width: pxToDp(480),
            left: 290,
            top: 440,
            opacity: opacityList[2].opacity,
          },
        ]}
      >
        <Text style={[styles.contentText]}>释义:</Text>
        <ScrollView style={{ maxHeight: 60 }}>
          <Text style={[{ fontSize: pxToDp(32) }]}>{detailsObj.meaning}</Text>
        </ScrollView>
      </Animated.View>
    );
  };
  nextTopaicHelp = () => {
    this.closeAudio();
    this.props.nextTopaicHelp();
  };
  render() {
    let wordHelpStatus = this.props.wordHelpStatus;
    let detailsObj = this.props.detailsObj;
    const { lineList, opacityList } = this.state;
    return (
      <Modal
        animationType="fade"
        title="字帮助"
        transparent
        presentationStyle={"fullScreen"}
        visible={wordHelpStatus}
        onShow={this.onShow}
      >
        <View style={[styles.modalContainer]}>
          <View
            style={[
              appStyle.ml48,
              appStyle.mr48,
              appStyle.flexTopLine,
              appStyle.height110,
              appStyle.flexCenter,
              borderRadius_tool(16),
              {
                backgroundColor: "#fff",
                marginTop: pxToDp(40),
              },
            ]}
          >
            <Text style={[{ color: "#FC6161", fontSize: pxToDp(42) }]}>
              {this.props.detailsObj.constArticle}
            </Text>
            <TouchableOpacity
              style={[
                appStyle.absolute,
                styles.nextText,
                margin_tool(0, 48, 0, 0),
                padding_tool(16, 48),
                borderRadius_tool(30),
              ]}
              onPress={this.nextTopaicHelp}
            >
              <Text style={[{ color: "#fff", fontSize: pxToDp(28) }]}>
                下一题
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              appStyle.flexCenter,
              { flex: 1, position: "relative", marginTop: pxToDp(40) },
            ]}
          >
            <View
              style={[
                styles.textWrap,
                appStyle.flexCenter,
                borderRadius_tool(16),
                {
                  backgroundColor: "#3BBBFC",
                  paddingLeft: pxToDp(25),
                  paddingRight: pxToDp(25),
                },
              ]}
            >
              <Text style={[{ color: "#fff", fontSize: pxToDp(80) }]}>
                {this.props.detailsObj.showHelpText}
              </Text>
            </View>
            {Object.keys(detailsObj).length > 0
              ? lineList.map((item, index) => {
                  return (
                    <Animated.View
                      style={[
                        {
                          transform: [
                            { rotate: item.rotate },
                            { translateY: item.translateY },
                          ],
                          zIndex: -1,
                          position: "absolute",
                          opacity: opacityList[index].opacity,
                        },
                      ]}
                      key={index}
                    >
                      <DashSecondLine
                        backgroundColor="rgba(255, 255, 255, .6)"
                        len={item.len}
                        width={item.width}
                      ></DashSecondLine>
                    </Animated.View>
                  );
                })
              : null}
            {Object.keys(detailsObj).length > 0
              ? this.renderWordPY(detailsObj)
              : null}
            {Object.keys(detailsObj).length > 0
              ? this.renderWordJyc(detailsObj)
              : null}
            {Object.keys(detailsObj).length > 0
              ? this.renderWordCy(detailsObj)
              : null}
            {Object.keys(detailsObj).length > 0
              ? this.renderWordHx(detailsObj)
              : null}
            {Object.keys(detailsObj).length > 0
              ? this.renderWordFyc(detailsObj)
              : null}
            {Object.keys(detailsObj).length > 0
              ? this.renderWordJg(detailsObj)
              : null}
            {Object.keys(detailsObj).length > 0
              ? this.renderWordSy(detailsObj)
              : null}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#373635",
  },
  nextText: {
    right: 0,
    backgroundColor: "#38B3FF",
  },
  contentWrap: {
    position: "absolute",
    backgroundColor: "#fff",
    fontSize: pxToDp(28),
    // zIndex: 1,
    // minWidth: pxToDp(220),
    // minHeight: pxToDp(100),
  },
  contentText: {
    color: "#34B9FC",
    fontSize: pxToDp(28),
  },
});
export default WordHelpModal;
