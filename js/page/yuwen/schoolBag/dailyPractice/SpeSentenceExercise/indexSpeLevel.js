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
import { appStyle, appFont } from "../../../../../theme";
import { size_tool, pxToDp, fontFamilyRestoreMargin } from "../../../../../util/tools";
import HeaderCircleCard from "../../../../../component/HeaderCircleCard";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import axios from "../../../../../util/http/axios";
import AnswerStatisticsModal from "../../../../../component/AnswerStatisticsModal";
import { connect } from "react-redux";
import api from "../../../../../util/http/api";
// import RichShowView from "../../../../../component/chinese/RichShowView";
import url from "../../../../../util/url";
import Sound from "react-native-sound";
import SentenceHelpModal from '../../../../../component/chinese/SentenceHelpModal'
import Select from "../../../../../component/Select";

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
      se_idlist: [],
      resetSelect: false,
    };
  }
  componentDidMount() {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    let infoData = this.props.navigation.state.params.data
    let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam
    let obj = {
      grade_code: userInfoJs.checkGrade,
      term_code: userInfoJs.checkTeam,
      inspect: infoData.inspect_name
    }
    axios.get(api.chineseSpeSentenceLevelGetExercise, { params: obj }).then((res) => {
      const data = res.data.data.data;
      if (data?.length > 0) {
        let currentTopic = this.changeCurrentTopic(data[0]);
        this.setState({
          topicList: data,
          currentTopic,
          tip: "",
          se_idlist: res.data.data.se_ids
        });
      }
      if (data?.length === 0) {
        this.setState({
          tip: "当前没有题目",
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
      se_idlist
    } = this.state;
    if (topicList.length === 0) return;
    let _topicList = JSON.parse(JSON.stringify(topicList));
    let _doNumber = doNumber + 1;
    let diag_sentence_key_arr = [];
    let diag_sentence_key = "";
    currentTopic.sentence_stem.forEach((item) => {
      if (item.slectValue) {
        diag_sentence_key_arr.push(item.slectValue);
      }
    });
    diag_sentence_key = diag_sentence_key_arr.join("");
    if (!currentTopic.diag_sentence[diag_sentence_key]) {
      Toast.info("请选择答案", 1, undefined, false);
      return;
    }
    let ranking = currentTopic.diag_sentence[diag_sentence_key].ranking;
    // console.log('rankrankrankrank', ranking)
    this.setState({
      diagnose: currentTopic.diag_sentence[diag_sentence_key].diagnose,
      ranking,
    });
    let endTime = new Date().getTime();
    let answer_times = parseInt((endTime - topicStart_time) / 1000);
    if (_doNumber === 1 && currentTopic.is_push === 0) {
      _topicList[topicIndex].status = ranking;
      for (let i in answerNumber) {
        if (i === ranking) {
          answerNumber[i] = answerNumber[i] + 1;
        }
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
      exercise_time: currentTopic.exercise_time,
      isFirst: ranking !== '0' && _doNumber === 1 ? 1 : 0,  //第一次做错标识
      grade_term: this.grade_term,
      is_push: currentTopic.is_push,
      pName: this.inspect_name,
      name: currentTopic.tag1,
      next_level: '1',  // 传入该参数表示要推下一等级题目
      record_times: _doNumber, //第几次做题
      modular: '1', // π计划
      sub_modular: '3',//综合提升
      se_ids: se_idlist,
      exercise_level: currentTopic.exercise_level,
      tag1_id: currentTopic.iid,
    };
    axios.post(api.saveChinesSenTopic, obj).then((res) => {
      // console.log("单题保存成功", res.data.data, answerNumber, currentTopic);
      let se_list = [...se_idlist]
      res.data.data.se_id ? se_list.push(res.data.data.se_id) : ''
      this.setState({
        topicList: _topicList,
        answerNumber,
        changeData: res.data.data,
        se_idlist: se_list,
        resetSelect: true
      }, () => {
        // ranking === "0" ? this.ranking0() : this.ranking12();
      });
      setTimeout(() => {
        this.setState({
          resetSelect: false
        })
      }, 500);
    });
    if (_doNumber < 4) {
      this.setState({
        visible: true,
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
    const { topicIndex, topicList, start_time, changeData, currentTopic, doNumber } = this.state;

    //加如果有下一等级题的逻辑 
    // console.log('做对推的题', changeData, doNumber)
    if (Object.keys(changeData).length > 0 && !currentTopic.isChangeSce && doNumber === 1) {
      let _currentTopic = this.changeCurrentTopic(changeData);
      this.setState({
        currentTopic: _currentTopic,
        doNumber: 0,
        topicStart_time: new Date().getTime(),
        ischangeHeight: true,
        autoHeight: 0,
        maxHeight: 0,
        best_answer_three: undefined,
        changeData: {}
      });
      this.heightArr = [];
      return
    }
    // else{
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
          this.setState({
            answerStatisticsModalVisible: true,
            ischangeHeight: false,
          });
        });
      return;
    }
    // }
    let _currentTopic = this.changeCurrentTopic(topicList[topicIndex + 1]);
    this.setState({
      topicIndex: topicIndex + 1,
      currentTopic: _currentTopic,
      doNumber: 0,
      topicStart_time: new Date().getTime(),
      ischangeHeight: true,
      autoHeight: 0,
      maxHeight: 0,
      best_answer_three: undefined,
      changeData: {}
    });
    this.heightArr = [];
  };
  ranking12 = () => {
    const { doNumber, currentTopic, changeData } = this.state;
    if (doNumber === 3) {
      this.setState({
        changeData: {}
      }, () => {
        this.ranking0();
      });
      return;
    }
    let _currentTopic = JSON.parse(JSON.stringify(changeData.se_id ? changeData : currentTopic));
    // console.log("123", _currentTopic, changeData, currentTopic)
    // _currentTopic.best_answer = changeData.best_answer
    // _currentTopic.change_word = changeData.change_word
    // _currentTopic.diag_sentence = changeData.diag_sentence
    _currentTopic = this.changeCurrentTopic(_currentTopic);
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
      changeData: {}
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
    // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",currentTopic)
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
    _currentTopic.sentence_stem[item.position].slectValue = item.label
    _currentTopic.sentence_stem[item.position].slectLabel = item.label

    this.myScrollView.scrollTo({ x: 0, y: 0, animated: true });
    this.setState({ currentTopic: _currentTopic });
  };
  onClose = () => {
    const { ranking } = this.state;
    this.setState({ visible: false, maxHeight: 0 }, () => {
      ranking === "0" ? this.ranking0() : this.ranking12();
    });
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
    // console.log("通过onLayout得到的高度：" + height);
    if (ischangeHeight) {
      //console.log("通过onLayout得到的高度：" + height);
      this.setState({
        autoHeight: height,
        ischangeHeight: false,
      });
    }
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
          <Text style={[{ fontSize: pxToDp(42), color: "#fff" }, appFont.fontFamily_syst]}>
            综合提升-{this.inspect_name}
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
              {currentTopic?.sentence_stem ? (
                <>
                  {currentTopic.common_stem.indexOf('非顺序造句') === -1 ? <Text style={[{ fontSize: pxToDp(36), color: "#000" }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>
                    {currentTopic.common_stem}
                  </Text> : null}
                  {currentTopic.stem ? (
                    <Text style={[{ fontSize: pxToDp(36), color: "#000" }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>
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
                      {currentTopic?.sentence_stem
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
                            );
                          } else {
                            return (
                              <Text
                                style={[
                                  {
                                    fontSize: pxToDp(36),
                                    color: item.isCenter ? "#FC6161" : "#000",
                                    lineHeight: pxToDp(76),
                                  }, appFont.fontFamily_syst, fontFamilyRestoreMargin('', '', fontFamilyRestoreMargin('', '', Platform.OS === 'ios' ? null : { marginTop: pxToDp(16) }))
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
                              }, appFont.fontFamily_syst, fontFamilyRestoreMargin('', '', { lineHeight: pxToDp(60) })
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
                              }, appFont.fontFamily_syst, fontFamilyRestoreMargin('', '', { lineHeight: pxToDp(60) })
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

        <SentenceHelpModal
          status={this.state.visible}
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
