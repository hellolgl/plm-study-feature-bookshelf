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
import RenderHtml from "react-native-render-html";
import Sound from "react-native-sound";
import url from "../../util/url";
class CharacterHelpModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      translate: new Animated.Value(0),
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
        // 字源
        {
          translateY: 70,
          rotate: "-10deg",
          len: 5,
          width: 80,
        },
        // 听力，拼音
        {
          translateY: -120,
          rotate: "-10deg",
          len: 8,
          width: 150,
        },
        // 笔顺
        {
          translateY: 95,
          rotate: "70deg",
          len: 15,
          width: 280,
        },
        // 部首
        {
          translateY: 100,
          rotate: "-115deg",
          len: 12,
          width: 250,
        },
        // 字义
        {
          translateY: 90,
          rotate: "-73deg",
          len: 13,
          width: 260,
        },
        // 词组
        {
          translateY: 100,
          rotate: "110deg",
          len: 12,
          width: 240,
        },
      ],
    };
    this.audio = undefined;
  }
  onShow = () => {
    const { opacityList } = this.state;
    this.playAudioHelp(0);
    // let topicKey = "pinyin";
    let topicKey = this.props.detailsObj.topicKey;
    let _opacityList = opacityList.concat([]);
    _opacityList.forEach((item, index) => {
      item.opacity = new Animated.Value(0);
    });
    if (topicKey === "pinyin" || topicKey === "listen") {
      let aniArr = this.props.detailsObj.character_origin
        ? [
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
          ]
        : [
            Animated.timing(_opacityList[1].opacity, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ];
      Animated.parallel(aniArr).start();

      // Animated.sequence([
      //   Animated.parallel([
      //     Animated.timing(_opacityList[0].opacity, {
      //       toValue: 1,
      //       duration: 1000,
      //       useNativeDriver: true,
      //     }),
      //     Animated.timing(_opacityList[1].opacity, {
      //       toValue: 1,
      //       duration: 1000,
      //       useNativeDriver: true,
      //     }),
      //   ]),
      //   Animated.timing(_opacityList[2].opacity, {
      //     toValue: 1,
      //     duration: 1000,
      //     useNativeDriver: true,
      //   }),
      //   Animated.timing(_opacityList[3].opacity, {
      //     toValue: 1,
      //     duration: 1000,
      //     useNativeDriver: true,
      //   }),
      //   Animated.parallel([
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
      //   ]),
      // ]).start();
    }
    if (topicKey === "order") {
      let aniArr = this.props.detailsObj.character_origin
        ? [
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
          ]
        : [
            Animated.timing(_opacityList[1].opacity, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ];
      Animated.sequence([
        Animated.parallel(aniArr),
        Animated.timing(_opacityList[2].opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
    if (topicKey === "structure") {
      let aniArr = this.props.detailsObj.character_origin
        ? [
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
          ]
        : [
            Animated.timing(_opacityList[1].opacity, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ];
      Animated.sequence([
        Animated.parallel(aniArr),
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
      ]).start();
    }
    if (topicKey === "meaning") {
      let aniArr = this.props.detailsObj.character_origin
        ? [
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
          ]
        : [
            Animated.timing(_opacityList[1].opacity, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ];
      Animated.sequence([
        Animated.parallel(aniArr),
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
        Animated.parallel([
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
        ]),
      ]).start();
    }
    Animated.timing(this.state.translate, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
    this.setState({
      opacityList: _opacityList,
    });
  };
  //关闭语音播放
  closeAudio = () => {
    if (this.audio) {
      this.audio.stop();
      this.audio = undefined;
    }
  };
  // 播放读音
  playAudioHelp = (index) => {
    let path = url.baseURL + this.props.detailsObj.audio[index];
    console.log("播放语音地址", path);
    if (!path) {
      return;
    }
    if (this.audio) {
      this.audio.stop(() => {
        this.audio.play();
     });
      this.audio = undefined
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
  renderPY = (detailsObj) => {
    const { translate, opacityList } = this.state;
    // detailsObj.pinyin_tag = 1
    // detailsObj.pinyin = [['ch','ao'], "cheng","cheng","cheng"];
    // detailsObj.pinyin_tag = 0
    if (detailsObj.pinyin) {
      let top = 0;
      let left = 510;
      let rederIndex0 = (item, index) => {
        if (index === 0) {
          return (
            <View style={[appStyle.flexTopLine]}>
              <Animated.Text
                style={[
                  {
                    color: "#FC6161",
                    fontSize: pxToDp(36),
                    transform: [
                      {
                        translateX: translate.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-15, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {item[0]}
              </Animated.Text>
              <Animated.Text
                style={[
                  {
                    color: "#FC6161",
                    fontSize: pxToDp(36),
                    transform: [
                      {
                        translateX: translate.interpolate({
                          inputRange: [0, 1],
                          outputRange: [25, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {item[1]}
              </Animated.Text>
            </View>
          );
        } else {
          return <Text style={[{ fontSize: pxToDp(36) }]}>{item}</Text>;
        }
      };
      //1为多音字，0为非多音字
      if (detailsObj.pinyin_tag) {
        return (
          <Animated.View
            style={[
              styles.contentWrap,
              borderRadius_tool(18),
              padding_tool(26, 30, 0, 30),
              {
                left,
                top,
                width: pxToDp(420),
                opacity: opacityList[1].opacity,
              },
            ]}
          >
            <Text style={[styles.contentText]}>拼音:</Text>
            <View
              style={[
                appStyle.flexTopLine,
                appStyle.flexLineWrap,
                appStyle.flexJusBetween,
              ]}
            >
              {detailsObj.pinyin.map((item, index) => {
                let source =
                  index === 0
                    ? require("../../images/dyz1.png")
                    : require("../../images/dyz2.png");
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      this.playAudioHelp(index);
                    }}
                    style={[
                      {
                        width: "45%",
                        marginRight: index % 2 === 0 ? pxToDp(24) : 0,
                        marginBottom: pxToDp(24),
                      },
                      appStyle.flexTopLine,
                      appStyle.flexJusBetween,
                      appStyle.flexAliCenter,
                    ]}
                  >
                    {rederIndex0(item, index)}

                    <Image style={[size_tool(42)]} source={source}></Image>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        );
      } else {
        return (
          <Animated.View
            style={[
              styles.contentWrap,
              borderRadius_tool(18),
              padding_tool(26, 30),
              {
                left: 550,
                top: 0,
                width: pxToDp(250),
                opacity: opacityList[1].opacity,
              },
            ]}
          >
            <Text style={[styles.contentText]}>拼音:</Text>
            <View style={[appStyle.flexTopLine]}>
              <Animated.Text
                style={[
                  {
                    color: "#333",
                    fontSize: pxToDp(63),
                    transform: [
                      {
                        translateX: translate.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-15, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {detailsObj.sm}
              </Animated.Text>
              <Animated.Text
                style={[
                  {
                    color: "#333",
                    fontSize: pxToDp(63),
                    transform: [
                      {
                        translateX: translate.interpolate({
                          inputRange: [0, 1],
                          outputRange: [25, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {detailsObj.ym}
              </Animated.Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.playAudioHelp(0);
              }}
            >
              <View
                style={[
                  {
                    backgroundColor:
                      "linear - gradient(90deg, rgba(54,187,254, 1) 0 %, rgba(93,199,254, 1) 100 %)",
                  },
                  appStyle.flexTopLine,
                  appStyle.flexJusBetween,
                  appStyle.flexAliCenter,
                  padding_tool(0, 23),
                  borderRadius_tool(8),
                  margin_tool(30, 0, 0, 0),
                ]}
              >
                <Text style={[{ color: "#fff", fontSize: pxToDp(32) }]}>
                  {detailsObj.pinyin}
                </Text>
                <Image
                  style={[{ width: pxToDp(27), height: pxToDp(24) }]}
                  source={require("../../images/voice.png")}
                ></Image>
              </View>
            </TouchableOpacity>
          </Animated.View>
        );
      }
    }
  };
  renderLY = () => {
    const { opacityList } = this.state;
    return (
      <Animated.View
        style={[
          styles.contentWrap,
          borderRadius_tool(18),
          padding_tool(25),
          {
            left: 640,
            top: 380,
            opacity: opacityList[0].opacity,
            fontSize: pxToDp(28),
          },
        ]}
      >
        <Text style={[styles.contentText]}>字源:</Text>
      </Animated.View>
    );
  };
  renderCZ = (detailsObj) => {
    const { opacityList } = this.state;
    return (
      <Animated.View
        style={[
          styles.contentWrap,
          borderRadius_tool(18),
          padding_tool(25),
          {
            left: 140,
            top: 150,
            minWidth: pxToDp(480),
            opacity: opacityList[5].opacity,
            fontSize: pxToDp(28),
          },
        ]}
      >
        <Text style={[styles.contentText]}>词组:</Text>
        <ScrollView style={{ maxHeight: 60 }}>
          <RenderHtml
            source={{html:detailsObj.html}}
            tagsStyles={{
              p: { fontSize: 21 },
              div: { fontSize: 21 },
              span: { fontSize: 21 },
            }}
          />
        </ScrollView>
      </Animated.View>
    );
  };
  renderBS = (detailsObj) => {
    const { opacityList } = this.state;
    return (
      <Animated.View
        style={[
          styles.contentWrap,
          borderRadius_tool(18),
          padding_tool(25),
          {
            left: 860,
            top: 90,
            opacity: opacityList[3].opacity,
            fontSize: pxToDp(28),
          },
          appStyle.flexTopLine,
        ]}
      >
        <View>
          <Text style={[styles.contentText]}>部首:</Text>
          <Text style={[{ color: "#38B3FF", fontSize: pxToDp(63) }]}>
            {detailsObj.radical}
          </Text>
        </View>
        <View style={{ marginLeft: pxToDp(40) }}>
          <Text style={[styles.contentText]}>结构:</Text>
          <Text style={[{ color: "#333", fontSize: pxToDp(32)}]}>
            {detailsObj.structure}
          </Text>
          <Text style={[{ color: "#333", fontSize: pxToDp(32) }]}>结构</Text>
        </View>
      </Animated.View>
    );
  };
  renderBH = (detailsObj) => {
    const { opacityList } = this.state;
    //console.log("笔画地址", detailsObj.order);
    return (
      <Animated.View
        style={[
          styles.contentWrap,
          borderRadius_tool(18),
          padding_tool(25),
          {
            left: 280,
            top: 310,
            opacity: opacityList[2].opacity,
          },
        ]}
      >
        <Text style={[styles.contentText]}>笔顺:</Text>
        <Image
          style={[size_tool(200), margin_tool(17, 0, 0, 0)]}
          source={{
            uri: detailsObj.order,
          }}
        ></Image>
      </Animated.View>
    );
  };
  renderZY = (detailsObj) => {
    const { opacityList } = this.state;
    return (
      <Animated.View
        style={[
          styles.contentWrap,
          borderRadius_tool(18),
          padding_tool(25),
          {
            left: 880,
            top: 280,
            width: pxToDp(546),
            opacity: opacityList[4].opacity,
            fontSize: pxToDp(28),
          },
        ]}
      >
        <Text style={[styles.contentText]}>字义:</Text>
        <ScrollView style={{ maxHeight: 130 }}>
          <Text style={{ fontSize: pxToDp(32)}}>{detailsObj.meaning}</Text>
        </ScrollView>
      </Animated.View>
    );
  };
  nextTopaicHelp = () => {
    this.closeAudio();
    this.props.nextTopaicHelp();
  };
  render() {
    let characterHelpStatus = this.props.characterHelpStatus;
    let detailsObj = this.props.detailsObj;
    const { lineList, opacityList } = this.state;
    return (
      <Modal
        animationType="fade"
        title="字帮助"
        transparent
        presentationStyle={"fullScreen"}
        visible={characterHelpStatus}
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
              <Text style={[{ color: "#fff" ,fontSize:pxToDp(28)}]}>下一题</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              appStyle.flexCenter,
              { flex: 1, position: "relative", marginTop: pxToDp(90) },
            ]}
          >
            <View
              style={[
                appStyle.flexCenter,
                borderRadius_tool(16),
                {
                  backgroundColor: "#3BBBFC",
                  width: pxToDp(128),
                  height: pxToDp(128),
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
              ? this.renderPY(detailsObj)
              : null}
            {Object.keys(detailsObj).length > 0
              ? this.renderBS(detailsObj)
              : null}
            {Object.keys(detailsObj).length > 0
              ? this.renderLY(detailsObj)
              : null}
            {Object.keys(detailsObj).length > 0
              ? this.renderCZ(detailsObj)
              : null}
            {Object.keys(detailsObj).length > 0
              ? this.renderBH(detailsObj)
              : null}
            {Object.keys(detailsObj).length > 0
              ? this.renderZY(detailsObj)
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
    // zIndex: 1,
    // minWidth: pxToDp(220),
    // minHeight: pxToDp(100),
  },
  contentText: {
    color: "#34B9FC",
    fontSize: pxToDp(28),
  },
});
export default CharacterHelpModal;
