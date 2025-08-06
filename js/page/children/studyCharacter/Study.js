import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Dimensions,
  Platform,
  DeviceEventEmitter,
  ActivityIndicator,
} from "react-native";
import { appFont, appStyle } from "../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  pxToDpHeight,
} from "../../../util/tools";
import { connect } from "react-redux";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import NavigationUtil from "../../../navigator/NavigationUtil";
import Microphone from "../../../component/microphone/index";
import SentenceModal from "./components/SentenceModal";
import StarModal from "./components/StarModal";
import HanZiGuideDrawModule from "../../../util/writingTool/HanZiGuideDrawModule";
import { ChineseCharacterWritingClass } from "../../../util/writingTool/ChineseCharacterWritingClass";
import Audio from "../../../util/audio/audio";
import url from "../../../util/url";
import Congrats from "../../../component/Congrats";
import * as childrenCreators from "../../../action/children";
import * as userAction from "../../../action/userInfo/index";
import * as actionCreatorsUserInfo from "../../../action/userInfo";
import {getRewardCoinLastTopic} from '../../../util/coinTools'

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

class StudyCharacterPage extends PureComponent {
  constructor(props) {
    super(props);
    this.CustomKeyboard = null;
    this.StemTk = null;
    this.bg = this.props.navigation.state.params.data.bg;
    this.word_level_id = this.props.navigation.state.params.data.word_level_id;
    this.knowledge_point =this.props.navigation.state.params.data.knowledge_point;
    this.eventListener = undefined
    this.state = {
      list: [],
      step_list: [
        {
          is_finish: false,
        },
        {
          is_finish: false,
        },
        {
          is_finish: false,
        },
      ],
      isRecording_1: false,
      scoreAnim_1: new Animated.Value(0),
      score_1: "0",
      init_score_1: "0",
      step_index: 0,
      scoreAnim_2: new Animated.Value(0),
      score_2: "0",
      init_score_2: "0",
      isRecording_2: false,
      visible: false,
      visibleStar: false,
      character: {},
      word: {},
      loading: true,
      struck_data: {},
      star_num: 0,
    };
  }

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  componentDidMount() {
    this.getData();
  }

  componentWillUnmount() {
    DeviceEventEmitter.emit("refreshPage"); //返回页面刷新
  }

  getData = () => {
    const { step_list, step_index, star_num } = this.state;
    if (star_num === 3) return;
    axios
      .get(api.getChildSingleChar, {
        params: {
          word_level_id: this.word_level_id,
          knowledge_point: this.knowledge_point,
        },
      })
      .then((res) => {
        // console.log('kkkkk',res.data.data,this.word_level_id)
        const star_num = res.data.data.star_num;
        let character = res.data.data.character;
        let word = res.data.data.word;
        let _step_index = step_index;
        if (star_num > 0) {
          let _step_list = JSON.parse(JSON.stringify(step_list));
          if (character.light === "1") {
            _step_list[0].is_finish = true;
            _step_index = 1;
          }
          if (word.light === "1") {
            _step_list[1].is_finish = true;
            if (character.light === "0") {
              _step_index = 0;
            } else {
              _step_index = 2;
            }
          }
          if (character.light === "0") {
            _step_index = 0;
          }
          if (word.light === "0") {
            if (character.light === "0") {
              _step_index = 0;
            } else {
              _step_index = 1;
            }
          }
          if (star_num === 1 && character.light === "0" && word.light === "0") {
            _step_list[2].is_finish = true;
          }
          if (
            star_num === 2 &&
            ((character.light === "1" && word.light === "0") ||
              (character.light === "0" && word.light === "1"))
          ) {
            _step_list[2].is_finish = true;
          }
          if (star_num === 3) {
            _step_list[2].is_finish = true;
            _step_index = step_index;
          }
          this.setState(
            {
              step_list: _step_list,
              step_index: _step_index,
            },
            () => {
              if (_step_index === 2) {
                this.getStruck();
              }
            }
          );
        }
        this.setState({
          character,
          word,
          init_score_1: character.score,
          init_score_2: word.score,
          star_num,
        });
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  getStruck = () => {
    axios
      .get(api.getChildCharStruck, {
        params: {
          word_level_id: this.word_level_id,
          knowledge_point: this.knowledge_point,
        },
      })
      .then((res) => {
        const { struck } = res.data.data;
        let ccwc = new ChineseCharacterWritingClass(); // 初始汉字处理
        let struck_data = ccwc.getHanZiData(struck); // 类引用---处理
        this.setState({
          struck_data,
        });
      });
  };

  showPercent = (step_index) => {
    const { scoreAnim_1, scoreAnim_2, score_1, score_2, character, word } =
      this.state;
    switch (step_index) {
      case 0:
        Animated.timing(scoreAnim_1, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start(({ finished }) => {
          if (score_1 >= 85 && character.light === "0") {
            getRewardCoinLastTopic().then(res => {
              if(res.isReward){
                // 展示奖励弹框,在动画完后在弹统计框
                this.eventListener = DeviceEventEmitter.addListener(
                  "rewardCoinClose",
                  () => {
                    this.props.getStars("character");
                    this.eventListener && this.eventListener.remove()
                  }
                );
              }else{
                this.props.getStars("character");
              }
            })
          }
        });
        break;
      case 1:
        Animated.timing(scoreAnim_2, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start(({ finished }) => {
          if (score_2 >= 85 && word.light === "0") {
            getRewardCoinLastTopic().then(res => {
              if(res.isReward){
                // 展示奖励弹框,在动画完后在弹统计框
                this.eventListener = DeviceEventEmitter.addListener(
                  "rewardCoinClose",
                  () => {
                    this.props.getStars("character");
                    this.eventListener && this.eventListener.remove()
                  }
                );
              }else{
                this.props.getStars("character");
              }
            })
          }
        });
        break;
    }
  };

  onIndexChanged = (index) => {
    this.setState(
      {
        step_index: index,
      },
      () => {
        if (index === 2) {
          this.getStruck();
        }
      }
    );
  };

  clickCharacter = (i) => {
    console.log(i);
  };

  renderItem = (arr) => {
    if (arr) {
      return arr.map((i, x) => {
        return (
          <TouchableOpacity
            key={x}
            style={[styles.character]}
            onPress={() => {
              this.clickCharacter(i);
            }}
          >
            <Text>{i}</Text>
          </TouchableOpacity>
        );
      });
    }
  };

  clickSentence = () => {
    this.setState({
      visible: true,
    });
  };

  renderContent1 = () => {
    const { isRecording_1, scoreAnim_1, score_1, character, init_score_1 } =
      this.state;
    const {
      knowledge_point,
      pinyin_2,
      english_knowledge_point,
      pinyin_1,
      audio,
    } = character;
    return (
      <View style={[appStyle.flexCenter, { height: "100%" }]}>
        <Image
          style={[styles.contentBg]}
          source={require("../../../images/childrenStudyCharacter/bg_1.png")}
        ></Image>
        <ImageBackground
          style={[styles.tong_bg]}
          source={
            isRecording_1
              ? ""
              : require("../../../images/childrenStudyCharacter/tong_bg_1.png")
          }
        >
          <Image
            style={[styles.qipao_bg]}
            source={
              isRecording_1
                ? ""
                : require("../../../images/childrenStudyCharacter/qipao_bg_1.png")
            }
          ></Image>
          <Image
            style={[styles.boxShadowBg]}
            source={
              isRecording_1
                ? ""
                : require("../../../images/childrenStudyCharacter/box_shadow_bg_1.png")
            }
          ></Image>
          <View
            style={[
              appStyle.flexCenter,
              { position: "relative", zIndex: 2, flex: 1 },
              Platform.OS === "android" ? { marginTop: pxToDp(60) } : null,
            ]}
          >
            <Text
              style={[
                { color: "#363D4C", fontSize: pxToDp(60) },
                Platform.OS === "android"
                  ? { marginBottom: pxToDpHeight(-140) }
                  : { marginBottom: pxToDp(20), lineHeight: pxToDp(70) },
                appFont.fontFamily_jcyt_500,
              ]}
            >
              {pinyin_2}
            </Text>
            <Text
              style={[
                { fontSize: pxToDp(240), color: "#363D4C" },
                appFont.fontFamily_jcyt_700,
              ]}
            >
              {knowledge_point}
            </Text>
          </View>
          {parseInt(init_score_1) > -1 ? (
            <View
              style={[
                styles.percent_bg,
                { height: init_score_1 + "%" },
                parseInt(init_score_1) < 85
                  ? { backgroundColor: "#FF809E" }
                  : null,
              ]}
            ></View>
          ) : isRecording_1 ? null : (
            <Animated.View
              style={[
                styles.percent_bg,
                {
                  height: scoreAnim_1.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", score_1 + "%"],
                  }),
                },
                parseInt(score_1) < 85 ? { backgroundColor: "#FF809E" } : null,
              ]}
            ></Animated.View>
          )}
          {isRecording_1 ? null : pinyin_1 ? (
            <View style={[styles.play_btn]}>
              <Audio
                audioUri={`${url.baseURL}${pinyin_1}`}
                pausedBtnImg={require("../../../images/childrenStudyCharacter/play_btn_2.png")}
                pausedBtnStyle={{ width: pxToDp(120), height: pxToDp(120) }}
                playBtnImg={require("../../../images/childrenStudyCharacter/play_btn_2.png")}
                playBtnStyle={{ width: pxToDp(120), height: pxToDp(120) }}
              />
            </View>
          ) : null}
        </ImageBackground>
        <View style={[appStyle.flexLine, { height: pxToDpHeight(180) }]}>
          {isRecording_1 ? null : (
            <>
              <Text
                style={[
                  {
                    fontSize:
                      english_knowledge_point.length > 40
                        ? pxToDp(48)
                        : pxToDp(60),
                    color: "#363D4D",
                    marginRight: pxToDp(20),
                  },
                  appFont.fontFamily_jcyt_500,
                  Platform.OS === "ios" ? { lineHeight: pxToDp(70) } : null,
                ]}
              >
                {english_knowledge_point}
              </Text>
              {audio ? (
                <Audio
                  audioUri={`${url.baseURL}${audio}`}
                  pausedBtnImg={require("../../../images/childrenStudyCharacter/play_btn_1.png")}
                  pausedBtnStyle={{ width: pxToDp(60), height: pxToDp(60) }}
                  playBtnImg={require("../../../images/childrenStudyCharacter/play_btn_1.png")}
                  playBtnStyle={{ width: pxToDp(60), height: pxToDp(60) }}
                />
              ) : null}
            </>
          )}
        </View>
      </View>
    );
  };

  renderContent2 = () => {
    const { isRecording_2, scoreAnim_2, score_2, word, init_score_2 } =
      this.state;
    const {
      knowledge_point,
      pinyin_2,
      english_knowledge_point,
      pinyin_1,
      audio,
    } = word;
    if (!pinyin_2) {
      return (
        <View style={[appStyle.flexCenter, { height: "100%" }]}>
          <Text style={[{ fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_500]}>
            暂无相关词语
          </Text>
        </View>
      );
    }
    let pinyin_2_arr = pinyin_2
      .replaceAll("  ", " ")
      .split(" ")
      .filter((i) => {
        return i;
      });
    let knowledge_point_arr = knowledge_point.split("");
    return (
      <View style={[appStyle.flexCenter, { height: "100%" }]}>
        <Image
          style={[styles.contentBg]}
          source={require("../../../images/childrenStudyCharacter/bg_1.png")}
        ></Image>
        <ImageBackground
          style={[, styles.tong_bg, { width: pxToDp(600) }]}
          resizeMode="stretch"
          source={
            isRecording_2
              ? ""
              : require("../../../images/childrenStudyCharacter/tong_bg_2.png")
          }
        >
          <Image
            style={[styles.qipao_bg, { width: pxToDp(600) }]}
            resizeMode="stretch"
            source={
              isRecording_2
                ? ""
                : require("../../../images/childrenStudyCharacter/qipao_bg_2.png")
            }
          ></Image>
          <Image
            style={[
              styles.boxShadowBg,
              { width: pxToDp(672), height: pxToDp(90) },
            ]}
            source={
              isRecording_2
                ? ""
                : require("../../../images/childrenStudyCharacter/box_shadow_bg_1.png")
            }
          ></Image>
          <View
            style={[
              appStyle.flexLine,
              appStyle.flexCenter,
              { position: "relative", zIndex: 2, flex: 1 },
              Platform.OS === "android" ? { marginTop: pxToDp(60) } : null,
            ]}
          >
            {knowledge_point_arr.map((i, x) => {
              return (
                <View key={x} style={[appStyle.flexAliCenter]}>
                  <Text
                    style={[
                      { color: "#363D4C", fontSize: pxToDp(60) },
                      Platform.OS === "android"
                        ? { marginBottom: pxToDpHeight(-140) }
                        : { marginBottom: pxToDp(20), lineHeight: pxToDp(70) },
                      appFont.fontFamily_jcyt_500,
                    ]}
                  >
                    {pinyin_2_arr[x]}
                  </Text>
                  <Text
                    style={[
                      { fontSize: pxToDp(240), color: "#363D4C" },
                      appFont.fontFamily_jcyt_700,
                      knowledge_point_arr.length === 3
                        ? { fontSize: pxToDp(180), marginTop: pxToDp(20) }
                        : null,
                      knowledge_point_arr.length === 4
                        ? { fontSize: pxToDp(140), marginTop: pxToDp(40) }
                        : null,
                    ]}
                  >
                    {i}
                  </Text>
                </View>
              );
            })}
          </View>
          {parseInt(init_score_2) > -1 ? (
            <View
              style={[
                styles.percent_bg,
                { height: init_score_2 + "%" },
                parseInt(init_score_2) < 85
                  ? { backgroundColor: "#FF809E" }
                  : null,
              ]}
            ></View>
          ) : isRecording_2 ? null : (
            <Animated.View
              style={[
                styles.percent_bg,
                {
                  height: scoreAnim_2.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", score_2 + "%"],
                  }),
                },
                parseInt(score_2) < 85 ? { backgroundColor: "#FF809E" } : null,
              ]}
            ></Animated.View>
          )}
          {isRecording_2 ? null : pinyin_1 ? (
            <View style={[styles.play_btn]}>
              <Audio
                audioUri={`${url.baseURL}${pinyin_1}`}
                pausedBtnImg={require("../../../images/childrenStudyCharacter/play_btn_2.png")}
                pausedBtnStyle={{ width: pxToDp(120), height: pxToDp(120) }}
                playBtnImg={require("../../../images/childrenStudyCharacter/play_btn_2.png")}
                playBtnStyle={{ width: pxToDp(120), height: pxToDp(120) }}
              />
            </View>
          ) : null}
        </ImageBackground>
        <View style={[appStyle.flexLine, { height: pxToDpHeight(180) }]}>
          {isRecording_2 ? null : (
            <>
              <Text
                style={[
                  {
                    fontSize: pxToDp(60),
                    color: "#363D4D",
                    marginRight: pxToDp(20),
                  },
                  appFont.fontFamily_jcyt_500,
                  Platform.OS === "ios" ? { lineHeight: pxToDp(70) } : null,
                ]}
              >
                {english_knowledge_point}
              </Text>
              {audio ? (
                <Audio
                  audioUri={`${url.baseURL}${audio}`}
                  pausedBtnImg={require("../../../images/childrenStudyCharacter/play_btn_1.png")}
                  pausedBtnStyle={{ width: pxToDp(60), height: pxToDp(60) }}
                  playBtnImg={require("../../../images/childrenStudyCharacter/play_btn_1.png")}
                  playBtnStyle={{ width: pxToDp(60), height: pxToDp(60) }}
                />
              ) : null}
            </>
          )}
        </View>
      </View>
    );
  };

  renderContent3 = () => {
    const { struck_data } = this.state;
    if (Object.keys(struck_data).length === 0) return;
    return (
      <View style={[{ width: "100%", height: "100%" }, appStyle.flexCenter]}>
        <Image
          style={[
            { width: "100%", height: "100%", position: "absolute", bottom: 0 },
          ]}
          source={require("../../../images/childrenStudyCharacter/bg_2.png")}
        ></Image>
        <View style={[styles.zi_border]}>
          <HanZiGuideDrawModule
            ref={this.drawModeRef}
            hanzi_data={struck_data}
            guide_zoom_num={pxToDpHeight(3.5)}
            guide_stroke_idx={0}
            state_flag={1}
            hanzi_char={this.knowledge_point}
            errEvent={() => this.shakePaperEvent()}
            finishEvent={() => this.finishEvent()}
            base_color="#F2F5F7"
            animated_color="#999"
            writing_color="#363D4C"
          />
        </View>
      </View>
    );
  };

  shakePaperEvent = () => {
    console.log("笔画错误");
  };

  finishEvent = () => {
    const { token } = this.props;
    if (!token) {
      this.resetToLogin();
      return;
    }

    console.log("完成写字", {
      word_level_id: this.word_level_id,
      knowledge_point: this.knowledge_point,
      write_status: "1",
    });
    axios
      .post(api.saveChildCharStruck, {
        word_level_id: this.word_level_id,
        knowledge_point: this.knowledge_point,
        write_status: "1",
      })
      .then((res) => {
        console.log("写字保存", res.data);
        getRewardCoinLastTopic().then(res => {
          if(res.isReward){
            // 展示奖励弹框,在动画完后在弹统计框
            this.eventListener = DeviceEventEmitter.addListener(
              "rewardCoinClose",
              () => {
                this.props.getStars("character");
                this.eventListener && this.eventListener.remove()
              }
            );
          }else{
            this.props.getStars("character");
          }
        })
      });
  };

  saveCharacter = () => {
    const { score_1, character } = this.state;
    const { knowledge_point } = character;
    console.log("字评分", score_1);
    axios
      .post(api.saveChildSingleChar, {
        word_level_id: this.word_level_id,
        knowledge_point,
        score: score_1,
      })
      .then((res) => {
        console.log("读字保存", res.data);
      });
  };

  saveWord = () => {
    const { score_2, word } = this.state;
    const { knowledge_point } = word;
    console.log("词评分", score_2);
    axios
      .post(api.saveChildSingleWord, {
        word_level_id: this.word_level_id,
        knowledge_point,
        score: score_2,
        character: this.knowledge_point,
      })
      .then((res) => {
        console.log("读词保存", res.data);
      });
  };
  resetToLogin = () => {
    NavigationUtil.resetToLogin(this.props);
  };
  renderMicrophone = () => {
    const {
      step_index,
      step_list,
      visible,
      loading,
      word,
      character,
      star_num,
    } = this.state;
    let iseInfo = {
      xun_fei: character.knowledge_point,
      origin_tone: character.xunfei_word,
      words: [character.knowledge_point],
    };
    if (step_index === 1) {
      iseInfo = {
        xun_fei: word.knowledge_point,
        origin_tone: word.xunfei_word,
        words: [word.knowledge_point],
      };
    }
    console.log("pppp", iseInfo, character);
    if (step_index === 0 || (step_index === 1 && word.pinyin_2)) {
      return (
        <View style={[styles.microphone_wrap]}>
          <Microphone
            microphoneImg={require("../../../images/childrenStudyCharacter/read_btn_1.png")}
            microphoneImgStyle={{ width: pxToDp(600), height: pxToDp(140) }}
            activeMicrophoneImg={require("../../../images/childrenStudyCharacter/read_btn_1.png")}
            activeMicrophoneImgStyle={{
              width: pxToDp(600),
              height: pxToDp(140),
            }}
            iseInfo={iseInfo}
            animation={true}
            onStartRecordEvent={() => {
              const { token } = this.props;
              if (!token) {
                this.resetToLogin();
                return;
              }
              if (step_index === 0) {
                this.setState({
                  init_score_1: -1,
                  isRecording_1: true,
                });
              }
              if (step_index === 1) {
                this.setState({
                  init_score_2: -1,
                  isRecording_2: true,
                });
              }
            }}
            onFinishRecordEvent={(score) => {
              if (step_index === 0) {
                this.setState(
                  {
                    isRecording_1: false,
                    scoreAnim_1: new Animated.Value(0),
                    score_1: parseInt(score).toFixed(0),
                    // score_1:(Math.floor(Math.random() * (100 - 80 + 1)) + 80).toFixed(0)
                  },
                  () => {
                    this.showPercent(step_index);
                    this.saveCharacter();
                  }
                );
              }
              if (step_index === 1) {
                this.setState(
                  {
                    isRecording_2: false,
                    scoreAnim_2: new Animated.Value(0),
                    score_2: parseInt(score).toFixed(0),
                    // score_2:(Math.floor(Math.random() * (100 - 80 + 1)) + 80).toFixed(0)
                  },
                  () => {
                    this.showPercent(step_index);
                    this.saveWord();
                  }
                );
              }
            }}
            waveStyle={{
              width: pxToDp(300),
              height: pxToDp(60),
            }}
            soundWavePosition={{
              top: pxToDp(-70),
              left: pxToDp(150),
            }}
            lineColor={"#58DABB"}
          />
        </View>
      );
    }
    return null;
  };

  render() {
    const {
      step_index,
      step_list,
      visible,
      loading,
      word,
      character,
      star_num,
    } = this.state;

    return (
      <ImageBackground source={this.bg} style={[styles.container]}>
        <TouchableOpacity style={[styles.back_btn]} onPress={this.goBack}>
          <Image
            style={[{ width: pxToDp(140), height: pxToDp(100) }]}
            source={require("../../../images/childrenStudyCharacter/back_btn_1.png")}
          ></Image>
        </TouchableOpacity>
        {loading ? (
          <View
            style={[
              { width: windowWidth, height: windowHeight },
              appStyle.flexCenter,
            ]}
          >
            <ActivityIndicator size="large" color="#4F99FF" />
          </View>
        ) : (
          <>
            <View
              style={[styles.header, appStyle.flexLine, appStyle.flexCenter]}
            >
              {step_list.map((i, x) => {
                return (
                  <View style={[appStyle.flexLine]} key={x}>
                    <View
                      style={[
                        styles.item,
                        appStyle.flexCenter,
                        step_index === x ? { backgroundColor: "#fff" } : null,
                      ]}
                    >
                      <Image
                        style={[{ width: pxToDp(72), height: pxToDp(72) }]}
                        source={
                          i.is_finish
                            ? require("../../../images/childrenStudyCharacter/start_1_active.png")
                            : require("../../../images/childrenStudyCharacter/start_1.png")
                        }
                      ></Image>
                    </View>
                    {x === 2 ? null : <View style={[styles.line]}></View>}
                  </View>
                );
              })}
            </View>
            <View style={[styles.content]}>
              <View
                style={[
                  styles.page_btn_wrap,
                  step_index === 0 ? appStyle.flexEnd : null,
                ]}
              >
                {step_index === 0 ? null : (
                  <TouchableOpacity
                    style={[styles.page_btn]}
                    onPress={() => {
                      this.onIndexChanged(step_index - 1);
                    }}
                  >
                    <Image
                      style={[{ width: pxToDp(40), height: pxToDp(40) }]}
                      source={require("../../../images/childrenStudyCharacter/left_icon_1.png")}
                    ></Image>
                  </TouchableOpacity>
                )}
                {step_index === 2 ? null : (
                  <TouchableOpacity
                    style={[styles.page_btn]}
                    onPress={() => {
                      this.onIndexChanged(step_index + 1);
                    }}
                  >
                    <Image
                      style={[{ width: pxToDp(40), height: pxToDp(40) }]}
                      source={require("../../../images/childrenStudyCharacter/right_icon_1.png")}
                    ></Image>
                  </TouchableOpacity>
                )}
              </View>
              <View style={[styles.content_inner]}>
                {step_index === 0 ? this.renderContent1() : null}
                {step_index === 1 ? this.renderContent2() : null}
                {step_index === 2 ? this.renderContent3() : null}
              </View>
            </View>
            {step_index === 1 ? (
              <TouchableOpacity
                style={[styles.juzi_btn]}
                onPress={this.clickSentence}
              >
                <Image
                  style={[{ width: pxToDp(200), height: pxToDp(246) }]}
                  source={require("../../../images/childrenStudyCharacter/btn_bg_1.png")}
                ></Image>
              </TouchableOpacity>
            ) : null}
            <SentenceModal
              visible={visible}
              data={{
                knowledge_point: word.knowledge_point,
                word_level_id: this.word_level_id,
                character_knowledge_point: character.knowledge_point,
                character_pinyin2: character.pinyin_2,
              }}
              close={() => {
                this.setState({ visible: false });
              }}
            ></SentenceModal>
            <Congrats
              finish={() => {
                const { star_num } = this.state;
                if (star_num + 1 === 3) {
                  this.goBack();
                  return;
                }
                this.getData();
              }}
            ></Congrats>
            {this.renderMicrophone()}
          </>
        )}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: pxToDp(160),
  },
  back_btn: {
    position: "absolute",
    top: Platform.OS === "android" ? pxToDp(20) : pxToDp(40),
    left: pxToDp(20),
    zIndex: 1,
  },
  item: {
    width: pxToDp(152),
    height: pxToDp(140),
    backgroundColor: "rgba(255, 255, 255, 0.50)",
    borderBottomLeftRadius: pxToDp(180),
    borderBottomRightRadius: pxToDp(180),
  },
  line: {
    width: pxToDp(120),
    height: pxToDp(4),
    backgroundColor: "#fff",
  },
  content_inner: {
    width: pxToDp(1536),
    height: "100%",
    flex: 1,
    borderRadius: pxToDp(80),
    backgroundColor: "#fff",
    ...appStyle.flexCenter,
    overflow: "hidden",
  },
  header: {
    marginBottom: pxToDp(40),
  },
  content: {
    flex: 1,
    ...appStyle.flexAliCenter,
    ...appStyle.flexLine,
    paddingLeft: pxToDp(240),
    paddingRight: pxToDp(240),
  },
  page_btn: {
    width: pxToDp(120),
    height: pxToDp(200),
    backgroundColor: "#fff",
    borderRadius: pxToDp(200),
    ...appStyle.flexCenter,
  },
  percent_bg: {
    width: "100%",
    height: "100%",
    backgroundColor: "#58DABB",
    position: "absolute",
    bottom: pxToDpHeight(30),
    borderTopLeftRadius: pxToDp(20),
    borderTopRightRadius: pxToDp(20),
    borderBottomLeftRadius: pxToDp(40),
    borderBottomRightRadius: pxToDp(40),
    left: pxToDp(10),
  },
  tong_bg: {
    width: pxToDp(440),
    height: pxToDp(440),
    paddingTop: pxToDp(10),
    paddingLeft: pxToDp(10),
    paddingRight: pxToDp(10),
    paddingBottom: pxToDpHeight(30),
    ...appStyle.flexAliCenter,
  },
  qipao_bg: {
    width: pxToDp(440),
    height: pxToDp(440),
    position: "absolute",
    ...appStyle.flexCenter,
    zIndex: 1,
  },
  play_btn: {
    position: "absolute",
    top: pxToDp(-40),
    right: pxToDp(-40),
    zIndex: 5,
  },
  microphone_wrap: {
    position: "absolute",
    bottom: pxToDpHeight(130),
    width: "100%",
    ...appStyle.flexCenter,
  },
  juzi_btn: {
    position: "absolute",
    top: pxToDpHeight(150),
    right: pxToDp(300),
  },
  page_btn_wrap: {
    width: windowWidth,
    position: "absolute",
    ...appStyle.flexLine,
    ...appStyle.flexJusBetween,
    paddingLeft: pxToDp(60),
    paddingRight: pxToDp(60),
  },
  contentBg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 0,
  },
  boxShadowBg: {
    width: pxToDp(512),
    height: pxToDp(70),
    position: "absolute",
    zIndex: -1,
    bottom: pxToDp(-28),
  },
  zi_border: {
    borderWidth: pxToDp(8),
    borderColor: "#FFC56D",
    borderRadius: pxToDp(80),
    backgroundColor: "#fff",
  },
});
const mapStateToProps = (state) => {
  return {
    token: state.getIn(["userInfo", "token"])
  };
};

const mapDispathToProps = (dispatch) => {
  // 存数据
  return {
    getStars(data) {
      dispatch(childrenCreators.getStars(data));
    }
  };
};
export default connect(mapStateToProps, mapDispathToProps)(StudyCharacterPage);
