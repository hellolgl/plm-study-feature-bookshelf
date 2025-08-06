import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Modal, Toast } from "antd-mobile-rn";
import { appStyle ,appFont} from "../../../../../theme";
import { size_tool, pxToDp, padding_tool, fontFamilyRestoreMargin } from "../../../../../util/tools";
import HeaderCircleCard from "../../../../../component/HeaderCircleCard";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import axios from "../../../../../util/http/axios";
import AnswerStatisticsModal from "../../../../../component/AnswerStatisticsModal";
import { connect } from "react-redux";
import api from "../../../../../util/http/api";
import RichShowView from "../../../../../component/chinese/RichShowView";
import url from "../../../../../util/url";
import Sound from "react-native-sound";
import SentenceHelpModal from '../../../../../component/chinese/SentenceHelpModal'
import Select from "../../../../../component/Select";

const ranking_map = {
  "0": "太棒了，答对了哦！",
  "1": "一般，还有更好的组合,继续努力！",
  "2": "答错了，继续努力！",
};
const ranking_color_map = {
  "0": "#7FD23F",
  "1": "#FCAC14",
  "2": "#FC6161",
};
class SpeSentenceExercise extends PureComponent {
  constructor(props) {
    super(props);
    this.info = this.props.userInfo.toJS();
    this.grade_term = this.info.checkGrade + this.info.checkTeam
    this.name = props.navigation.state.params.data.name;
    this.inspect_name = props.navigation.state.params.data.inspect_name;
    this.myScrollView = undefined;
    this.heightArr = [];
    this.audioHelp = undefined;
    this.state = {
      topicList: [],
      visible: false,
      topicIndex: 0,
      currentTopic: {
        best_answer: [],
      },
      diagnose: "",
      doNumber: 0,
      ranking: "",
      answerNumber: {
        "0": 0,
        "1": 0,
        "2": 0,
      },
      answerStatisticsModalVisible: false,
      helpVisible: false,
      explanation: "",
      start_time: new Date().getTime(),
      end_time: "",
      topicStart_time: new Date().getTime(),
      maxHeight: 0,
      autoHeight: 0,
      ischangeHeight: true,
      best_answer_three: undefined,
      tip: "正在获取题目...",
      helpImg: "",
      helpHeight: 0, //确保帮助弹框的高度大于等于诊断标记
      changeData: {},
      isStartAudio: false,
      isStartAudio1: false,
      resetSelect: false
    };
  }
  componentDidMount() {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    let infoData = this.props.navigation.state.params.data
    let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam
    let obj = {
      grade_term,
      iid: infoData.iid,
      name: infoData.name,
      pName: infoData.inspect_name
    }
    axios.get(api.getChinesSenTopic, { params: obj }).then((res) => {
      const data = res.data.data;
      if (data.length > 0) {
        let currentTopic = this.changeCurrentTopic(data[0]);
        this.setState({
          topicList: data,
          currentTopic,
          tip: "",
        });
      }
      if (data.length === 0) {
        this.setState({
          tip: "本年级不涉及此知识点，请购买“拓展计划”进行拓展！",
        });
      }
    });
  }
  changeCurrentTopic = (arr) => {
    arr.change_word.forEach((i) => {
      for (let j = 0; j < i.word.length; j++) {
        if (i.word[j].length > 15) {
          i.bigWidth = true;
          break;
        }
      }
    });
    arr.sentence_stem.forEach((item, i) => {
      item.autowidth = pxToDp(400);
      arr.change_word.forEach((child, j) => {
        if (child.position === i) {
          item.contentSelect = [];
          item.slectLabel = "请选择";
          child.word.forEach((select, z) => {
            item.contentSelect.push({
              value: select,
              label: select,
              position: i,
            });
          });
          item.bigWidth = child.bigWidth;
          if (child.bigWidth) {
            item.autowidth = pxToDp(720);
          }
        }
      });
    });
    arr.sentence_stem.forEach((item, i) => {
      if (arr.center_word) {
        arr.center_word.forEach((child, j) => {
          if (child.position === i) {
            item.isCenter = true;
          }
        });
      }
    });
    return arr;
  };
  nextTopic = () => {
    const {
      currentTopic,
      topicList,
      doNumber,
      topicIndex,
      answerNumber,
      topicStart_time,
    } = this.state;
    if (topicList.length === 0) {
      this.goBack()
      return
    }

    if (!currentTopic) return;
    let _topicList = JSON.parse(JSON.stringify(topicList));
    let _doNumber = doNumber + 1;
    let diag_sentence_key_arr = [];
    let diag_sentence_key = "";
    currentTopic.sentence_stem.forEach((item) => {
      if (item.slectLabel) {
        diag_sentence_key_arr.push(item.slectLabel);
      }
    });
    diag_sentence_key = diag_sentence_key_arr.join("");
    if (!currentTopic.diag_sentence[diag_sentence_key]) {
      Toast.info("请选择答案", 1, undefined, false);
      return;
    }
    let ranking = currentTopic.diag_sentence[diag_sentence_key].ranking;
    this.setState({
      diagnose: currentTopic.diag_sentence[diag_sentence_key].diagnose,
      ranking,
    });
    if (_doNumber === 1) {
      _topicList[topicIndex].status = ranking;
      let endTime = new Date().getTime();
      let answer_times = parseInt((endTime - topicStart_time) / 1000);
      for (let i in answerNumber) {
        if (i === ranking) {
          answerNumber[i] = answerNumber[i] + 1;
        }
      }

      if (currentTopic.best_answer.length > 3) {
        let best_answer_three = [];
        let arr = [];
        for (var i = 0; i < currentTopic.best_answer.length; i++) {
          arr[i] = i;
        }
        arr.sort(function () {
          return 0.5 - Math.random();
        });
        currentTopic.best_answer.forEach((i, index) => {
          for (let j = 0; j < arr.slice(0, 3).length; j++) {
            if (index === arr.slice(0, 3)[j]) {
              best_answer_three.push(i);
              break;
            }
          }
        });
        this.setState({
          best_answer_three,
        });
      }
      let obj = {
        sentence_times_id: currentTopic.sentence_times_id,
        se_id: currentTopic.se_id,
        correct: ranking,
        answer_times,
        student_id: this.info.id,
        knowledge_id: currentTopic.knowledge_id,
        grade_term: this.grade_term,
        pName: currentTopic.inspect,
        exercise_time: currentTopic.exercise_time,
        is_push: currentTopic.is_push,
        name: currentTopic.tag1,
        tag1_id: currentTopic.iid,
        modular: '1', // π计划
        sub_modular: '2',//每日一练
        // origin: this.origin
      };
      // console.log('', obj)
      // axios.put(api.recordSingleStem, obj).then((res) => {
      axios.post(api.saveChinesSenTopic, obj).then((res) => {
        // console.log("单题保存成功");
        this.setState({
          topicList: _topicList,
          answerNumber,
          resetSelect: true
        });
      });
    }
    if (_doNumber < 4) {
      this.setState({
        // visible: true,
        helpVisible: true,
        doNumber: _doNumber,
        resetSelect: true
      });
      setTimeout(() => {
        this.setState({
          resetSelect: false
        })
      }, 500);
      return;
    }
  };
  ranking0 = () => {
    const { topicIndex, topicList, start_time } = this.state;
    if (topicIndex + 1 === topicList.length) {
      const { currentTopic } = this.state;
      let endTime = new Date().getTime();
      let spend_time = parseInt((endTime - start_time) / 1000);
      let obj = {
        sentence_times_id: currentTopic.sentence_times_id,
        spend_time,
      };
      axios
        .put(api.saveChinesSenTopicAll, obj)
        .then((res) => {
          // console.log("套题保存成功");
          this.setState({
            answerStatisticsModalVisible: true,
            ischangeHeight: false,
          });
        });
      return;
    }
    let currentTopic = this.changeCurrentTopic(topicList[topicIndex + 1]);
    this.setState({
      topicIndex: topicIndex + 1,
      currentTopic,
      doNumber: 0,
      topicStart_time: new Date().getTime(),
      ischangeHeight: true,
      autoHeight: 0,
      maxHeight: 0,
      best_answer_three: undefined,
    });
    this.heightArr = [];
  };
  ranking12 = () => {
    const { doNumber, currentTopic } = this.state;
    if (doNumber === 3) {
      this.ranking0();
      return;
    }
    let _currentTopic = JSON.parse(JSON.stringify(currentTopic));
    _currentTopic.sentence_stem.forEach((item) => {
      if (item.contentSelect) {
        item.contentSelect = this.shuffle(item.contentSelect);
        item.contentSelect.forEach((i) => {
          i.check = false;
        });
      }
      if (item.slectLabel) {
        item.slectLabel = "请选择";
      }
    });
    _currentTopic = this.changeScene(_currentTopic)
    this.setState({
      currentTopic: _currentTopic,
      ischangeHeight: true
    });
  };
  //打乱数组
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  shuffle = (arr) => {
    let _arr = arr.slice();
    for (let i = 0; i < _arr.length; i++) {
      let j = this.getRandomInt(0, i);
      let t = _arr[i];
      _arr[i] = _arr[j];
      _arr[j] = t;
    }
    return _arr;
  };
  changeScene = (currentTopic) => {
    if (currentTopic.scene_word.length === 0) return currentTopic
    currentTopic.scene_word.forEach((i, index) => {
      if (i.word.length > 0) {
        let random1 = this.getRandomInt(0, i.word.length - 1)
        currentTopic.sentence_stem[i.position].content = i.word[random1]
      }
    })
    currentTopic.isChangeSce = true
    return currentTopic
  }
  goBack = () => {
    this.closeHelpAudio1()
    this.closeHelpAudio()
    NavigationUtil.goBack(this.props);
  };
  selectChange = (item, _options) => {
    const { currentTopic } = this.state;
    let _currentTopic = JSON.parse(JSON.stringify(currentTopic));
    // for (let i = 0; i < _currentTopic.sentence_stem.length; i++) {

    //   if (item.position === i) {
    //     console.log('选择', item, _options)
    //     // _currentTopic.sentence_stem[i].slectValue = item.value;
    //     _currentTopic.sentence_stem[i].selectLabel = item.label;
    //     // _currentTopic.sentence_stem[i].contentSelect = _options;
    //     _currentTopic.sentence_stem[i].slectValue = item.value;
    //     // _currentTopic.sentence_stem[i].contentSelect = _options;
    //     if (item.value.length > 8) {
    //       // 放不下一排大于8个字
    //       _currentTopic.sentence_stem[i].autowidth = pxToDp(
    //         item.value.length * 50
    //       );
    //     }
    //     break;
    //   }
    // }

    _currentTopic.sentence_stem[item.position].slectValue = item.label
    _currentTopic.sentence_stem[item.position].slectLabel = item.label

    // this.myScrollView.scrollTo({ x: 0, y: 0, animated: true });
    this.setState({ currentTopic: _currentTopic });
  };
  onClose = () => {
    const { ranking } = this.state;
    this.closeHelpAudio()
    this.closeHelpAudio1()
    // this.setState({ helpVisible: false });
    this.setState({ helpVisible: false, maxHeight: 0 }, () => {
      ranking === "0" ? this.ranking0() : this.ranking12();
    });
  };

  onCloseHelp = () => {
    this.closeHelpAudio()
    this.closeHelpAudio1()
    this.setState({ helpVisible: false });
  };
  helpMe = () => {
    this.setState({ helpVisible: true });
  };
  closeAnswerStatisticsModal = () => {
    NavigationUtil.goBack(this.props);
    this.setState({
      answerStatisticsModalVisible: false,
    });
  };
  selectShow = (height) => {
    const { currentTopic } = this.state;
    this.heightArr.push(height);
    // console.log("this.heightArrthis.heightArr", this.heightArr);
    this.setState({
      maxHeight: Math.max(...this.heightArr),
    });
  };
  _onLayout = (event) => {
    const { ischangeHeight, currentTopic } = this.state;
    let { x, y, width, height } = event.nativeEvent.layout;
    console.log("通过onLayout得到的高度：" + height);
    if (ischangeHeight) {
      //console.log("通过onLayout得到的高度：" + height);
      this.setState({
        autoHeight: height,
        ischangeHeight: false,
      });
    }
  };
  _onLayoutModal = (event) => {
    let { x, y, width, height } = event.nativeEvent.layout;
    // console.log("通过onLayout得到的高度：" + height);
    this.setState({
      helpHeight: height,
    });
  };

  playHeplAudio = () => {
    const { currentTopic, isStartAudio } = this.state;
    // currentTopic.standard_audio = 'chinese/03/00/exercise/audio/0910562130a7482f9b742def14203f55.mp3'
    this.closeHelpAudio1()
    if (this.audioHelp) {
      isStartAudio
        ? this.audioHelp.pause()
        : this.audioHelp.play((success) => {
          if (success) {
            this.audioHelp.release();
          }
        });
      this.setState({
        isStartAudio: !isStartAudio,
      });
      return;
    }
    this.audioHelp = new Sound(
      url.baseURL + currentTopic.standard_audio,
      null,
      (error) => {
        if (error) {
          console.log("播放失败", error);
        } else {
          this.audioHelp.setNumberOfLoops(-1);
          this.audioHelp.play((success) => {
            if (success) {
              this.audioHelp.release();
            }
          });
          this.setState(() => ({
            isStartAudio: true,
          }));
        }
      }
    );
  };
  // 关闭帮助播放
  closeHelpAudio = () => {
    if (this.audioHelp) {
      this.audioHelp.stop();
      this.audioHelp = undefined;
      this.setState(() => ({
        isStartAudio: false,
      }));
    }
  };
  playHeplAudio1 = () => {
    const { currentTopic, isStartAudio1 } = this.state;
    // currentTopic.standard_audio = 'chinese/03/00/exercise/audio/0910562130a7482f9b742def14203f55.mp3'
    this.closeHelpAudio()
    if (this.audioHelp1) {
      isStartAudio1
        ? this.audioHelp1.pause()
        : this.audioHelp1.play((success) => {
          if (success) {
            this.audioHelp1.release();
          }
        });
      this.setState({
        isStartAudio1: !isStartAudio1,
      });
      return;
    }
    this.audioHelp1 = new Sound(
      url.baseURL + currentTopic.explanation_audio,
      null,
      (error) => {
        if (error) {
          console.log("播放失败", error);
        } else {
          this.audioHelp1.setNumberOfLoops(-1);
          this.audioHelp1.play((success) => {
            if (success) {
              this.audioHelp1.release();
            }
          });
          this.setState(() => ({
            isStartAudio1: true,
          }));
        }
      }
    );
  };
  // 关闭帮助播放
  closeHelpAudio1 = () => {
    if (this.audioHelp1) {
      this.audioHelp1.stop();
      this.audioHelp1 = undefined;
      this.setState(() => ({
        isStartAudio1: false,
      }));
    }
  };
  render() {
    const {
      topicList,
      visible,
      currentTopic,
      diagnose,
      ranking,
      answerStatisticsModalVisible,
      answerNumber,
      helpVisible,
      explanation,
      doNumber,
      autoHeight,
      best_answer_three,
      tip,
      helpImg,
      helpHeight,
      maxHeight,
      isStartAudio,
      isStartAudio1,
      resetSelect
    } = this.state;
    return (
      <View style={[styles.container]}>
        <ImageBackground
          source={require("../../../../../images/chineseDailySpeReadingBg2.png")}
          style={[styles.header, appStyle.flexCenter]}
        >
          <TouchableOpacity
            style={[styles.headerBack]}
            onPress={() => this.goBack()}
          >
            <Image
              source={require("../../../../../images/chineseDailySpeReadingBtn2.png")}
              style={[size_tool(64)]}
            ></Image>
          </TouchableOpacity>
          <Text style={[{ fontSize: pxToDp(42), color: "#fff" },appFont.fontFamily_syst]}>
            {this.inspect_name}-{this.name}
          </Text>
          <View style={[styles.circleCard, appStyle.flexTopLine]}>
            {topicList.map((item, index) => {
              return (
                <HeaderCircleCard
                  status={item.status}
                  key={index}
                ></HeaderCircleCard>
              );
            })}
          </View>
        </ImageBackground>
        <ImageBackground
          source={require("../../../../../images/chineseDailySpeReadingBg1.png")}
          style={[appStyle.flexCenter, { flex: 1 }]}
        >
          <ImageBackground
            source={require("../../../../../images/sentenceBg.png")}
            style={[styles.content1]}
          >
            <ScrollView style={[styles.contentExc]} ref={(view) => {
              if (view) this.myScrollView = view;
            }}>
              {currentTopic.sentence_stem ? (
                <>
                  {currentTopic.common_stem.indexOf('非顺序造句') === -1 ? <Text style={[{ fontSize: pxToDp(36), color: "#000" },appFont.fontFamily_syst,fontFamilyRestoreMargin()]}>
                    {currentTopic.common_stem}
                  </Text> : null}
                  {currentTopic.stem ? (
                    <Text style={[{ fontSize: pxToDp(36), color: "#000" },appFont.fontFamily_syst,fontFamilyRestoreMargin()]}>
                      {currentTopic.stem}
                    </Text>
                  ) : null}
                  <ScrollView

                  >
                    <View
                      style={[
                        appStyle.flexTopLine,
                        appStyle.flexLineWrap,
                        {
                          marginTop: pxToDp(16),
                          height: maxHeight > 0 ? autoHeight + maxHeight : "auto",
                        },
                      ]}
                      onLayout={this._onLayout}
                    >
                      {currentTopic.sentence_stem
                        ? currentTopic.sentence_stem.map((item, index) => {
                          if (item.contentSelect) {
                            return (
                              <Select key={index}
                                options={item.contentSelect}
                                selectItem={this.selectChange}
                                subject={'chinese'}
                                resetSelect={resetSelect}
                                activeBg={'#FCDAA5'}
                                fatherColor={'#8E2904'}
                                borderStyle={{
                                  borderColor: '#8E2904',
                                  backgroundColor: '#F9CD8B'
                                }}
                                textColor={'#fff'}
                                activeTextColor={'#8E2904'}
                              ></Select>

                              // <SentenceDropdownSelect
                              //   options={item.contentSelect}
                              //   selectStyle={{
                              //     minWidth: pxToDp(400),
                              //     height: pxToDp(76),
                              //     width: item.autowidth + 1,
                              //   }}
                              //   selectWrapStyle={{
                              //     marginRight: pxToDp(10),
                              //     marginLeft: pxToDp(10),
                              //     marginBottom: pxToDp(30),
                              //   }}
                              //   // 下拉框定位是为了避免多行的时候把下一行挤的看不见
                              //   dropWrapStyle={{
                              //     position: "absolute",
                              //     zIndex: 1,
                              //     top: pxToDp(80),
                              //   }}
                              //   dropItemStyle={{
                              //     minHeight: pxToDp(76),
                              //     // borderRightWidth: 1,
                              //     // borderColor: "#38B3FF",
                              //   }}
                              //   dropItemText={{ fontSize: pxToDp(36) }}
                              //   selectChange={this.selectChange}
                              //   selectShow={this.selectShow}
                              //   isSmart={true}
                              //   showDropItemIcon={true}
                              //   label={item.slectLabel}
                              //   key={index}
                              // ></SentenceDropdownSelect>
                            );
                          } else {
                            return (
                              <Text
                                style={[
                                  {
                                    fontSize: pxToDp(36),
                                    color: item.isCenter ? "#FC6161" : "#000",
                                    lineHeight: pxToDp(76),
                                  },appFont.fontFamily_syst,fontFamilyRestoreMargin('','',fontFamilyRestoreMargin('','',Platform.OS === 'ios'?null:{marginTop:pxToDp(16)}))
                                ]}
                                key={index}
                              >
                                {item.content}
                              </Text>
                            );
                          }
                        })
                        : null}
                    </View>
                  </ScrollView>
                </>
              ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  {/* <Text style={{ fontSize: pxToDp(32) }}>{tip}</Text> */}
                  <Image
                    style={{ width: pxToDp(905), height: pxToDp(288) }}
                    source={require('../../../../../images/chineseHomepage/chineseSentenceNoExercise.png')}></Image>
                </View>
              )}
            </ScrollView>

          </ImageBackground >
          <ImageBackground source={require("../../../../../images/sentenceBg2.png")} style={[styles.content2]}>
            <ScrollView style={[{ marginRight: pxToDp(20) }]}>
              {currentTopic ? (
                <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
                  {currentTopic.sentence_stem
                    ? currentTopic.sentence_stem.map((item, index) => {
                      if (item.slectLabel) {
                        return (
                          <Text
                            style={[
                              {
                                fontSize: pxToDp(36),
                                color:
                                  item.slectLabel === "请选择"
                                    ? "#000"
                                    : "#892804",
                              },appFont.fontFamily_syst,fontFamilyRestoreMargin('','',{lineHeight:pxToDp(60)})
                            ]}
                            key={index}
                          >
                            {item.slectLabel === "请选择"
                              ? "_____"
                              : item.slectLabel.indexOf("#去掉") === -1
                                ? item.slectLabel
                                : null}
                          </Text>
                        );
                      } else {
                        return (
                          <Text
                            style={[
                              {
                                fontSize: pxToDp(36),
                                color: item.isCenter ? "#FC6161" : "#000",
                              },appFont.fontFamily_syst,fontFamilyRestoreMargin('','',{lineHeight:pxToDp(60)})
                            ]}
                            key={index}
                          >
                            {item.content}

                          </Text>
                        );
                      }
                    })
                    : null}
                </View>
              ) : null}
            </ScrollView>
          </ImageBackground>
          <TouchableOpacity
            onPress={this.nextTopic}
          >
            <Image
              source={require("../../../../../images/sentenceNext.png")}
              style={[size_tool(186, 71), { marginTop: pxToDp(20) }]}
            ></Image>
          </TouchableOpacity>
        </ImageBackground>

        {/* <Modal
          visible={visible}
          transparent={true}
          footer={[
            { text: "关闭", onPress: this.onClose },
            { text: "帮助", onPress: this.helpMe },
          ]}
          style={[{ width: pxToDp(1500) }]}
        >

        </Modal> */}

        <SentenceHelpModal
          status={helpVisible}
          goback={this.onClose}
          currentTopic={currentTopic}
          doNumber={doNumber}
          best_answer_three={best_answer_three}
          diagnose={diagnose}
          ranking={ranking}
        />
        <AnswerStatisticsModal
          dialogVisible={answerStatisticsModalVisible}
          exerciseStatistics={answerNumber}
          closeDialog={this.closeAnswerStatisticsModal}
        ></AnswerStatisticsModal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6EDE4'
  },
  header: {
    backgroundColor: "#fff",
    width: "100%",
    height: pxToDp(124),
    borderRadius: pxToDp(16),
  },
  headerBack: {
    position: "absolute",
    left: pxToDp(32),
  },
  circleCard: {
    position: "absolute",
    right: pxToDp(48),
  },
  content1: {
    borderRadius: pxToDp(16),
    marginTop: pxToDp(20),
    width: pxToDp(1860),
    height: pxToDp(696),
    paddingTop: pxToDp(147),
    paddingLeft: pxToDp(127)
  },
  content2: {
    width: pxToDp(1615),
    height: pxToDp(180),
    borderRadius: pxToDp(16),
    marginTop: pxToDp(-40),
    padding: pxToDp(40),
    paddingLeft: pxToDp(60),
  },
  nextBtn: {
    position: "absolute",
    right: pxToDp(56),
    bottom: pxToDp(28),
    width: pxToDp(192),
    height: pxToDp(64),
    backgroundColor: "#38B3FF",
    borderRadius: pxToDp(32),
  },
  nextText: {
    fontSize: pxToDp(32),
    color: "#fff",
    textAlign: "center",
    lineHeight: pxToDp(64),
  },
  contentExc: {
    // backgroundColor:'red',
    maxHeight: pxToDp(400),
    width: pxToDp(1600)
  }
});
const mapStateToProps = (state) => {
  // 取数据
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  // 存数据
  return {};
};
export default connect(mapStateToProps, mapDispathToProps)(SpeSentenceExercise);
