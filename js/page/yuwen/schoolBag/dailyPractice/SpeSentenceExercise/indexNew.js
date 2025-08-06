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
import { appStyle } from "../../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../../util/tools";
import HeaderCircleCard from "../../../../../component/HeaderCircleCard";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import axios from "../../../../../util/http/axios";
import AnswerStatisticsModal from "../../../../../component/AnswerStatisticsModal";
import { connect } from "react-redux";
import api from "../../../../../util/http/api";
import RichShowView from "../../../../../component/chinese/RichShowView";
import url from "../../../../../util/url";
import Sound from "react-native-sound";

const ranking_map = {
  "0": "太棒了，答对了哦！",
  "1": "良好，还有更好的组合,继续努力！",
  "2": "答错了，继续努力！",
};
const ranking_color_map = {
  "0": "#7FD23F",
  "1": "#FCAC14",
  "2": "red",
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
      selectIndex: -1
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
        }, () => {
          let index = currentTopic.change_word[0].position
          let item = currentTopic.sentence_stem[index]
          this.clickSelect(item, index)
        });
      }
      if (data.length === 0) {
        this.setState({
          tip: "当前考察要素没有题目",
        });
      }
    });
  }
  changeCurrentTopic = (currentTopic) => {
    let selectArr = []
    currentTopic.change_word.forEach((i) => {
      selectArr = selectArr.concat(i.word)
    });
    currentTopic.sentence_stem.forEach((item, i) => {
      currentTopic.change_word.forEach((child, j) => {
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
        }
      });
    });
    currentTopic.sentence_stem.forEach((item, i) => {
      if (currentTopic.center_word) {
        currentTopic.center_word.forEach((child, j) => {
          if (child.position === i) {
            item.isCenter = true;
          }
        });
      }
    });
    currentTopic.selectArr = this.shuffle(Array.from(new Set(selectArr)))
    return currentTopic;
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
      name: this.name
    };

    axios.post(api.saveChinesSenTopic, obj).then((res) => {
      console.log("单题保存成功", res.data.data, answerNumber, currentTopic);
      this.setState({
        topicList: _topicList,
        answerNumber,
        changeData: res.data.data
      }, () => {
        // ranking === "0" ? this.ranking0() : this.ranking12();
      });
    });
    if (_doNumber < 4) {
      this.setState({
        visible: true,
        doNumber: _doNumber,
      });
      return;
    }
  };
  ranking0 = () => {
    const { topicIndex, topicList, start_time, changeData, currentTopic } = this.state;

    //加如果有下一等级题的逻辑 
    console.log('做对推的题', changeData)
    if (Object.keys(changeData).length > 0 && !currentTopic.isChangeSce) {
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
      }, () => {
        let index = _currentTopic.change_word[0].position
        let item = _currentTopic.sentence_stem[index]
        this.clickSelect(item, index)
      });
      this.heightArr = [];
      return
    }
    // else{
    if (topicIndex + 1 === topicList.length) {
      console.log('一套题做完',)
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
          console.log("套题保存成功");
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
    }, () => {
      let index = _currentTopic.change_word[0].position
      let item = _currentTopic.sentence_stem[index]
      this.clickSelect(item, index)
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
    let _currentTopic = JSON.parse(JSON.stringify(currentTopic));
    _currentTopic.best_answer = changeData.best_answer
    _currentTopic.change_word = changeData.change_word
    _currentTopic.diag_sentence = changeData.diag_sentence
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
    }, () => {
      let index = _currentTopic.change_word[0].position
      let item = _currentTopic.sentence_stem[index]
      this.clickSelect(item, index)
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
    NavigationUtil.goBack(this.props);
  };
  onClose = () => {
    const { ranking } = this.state;
    this.setState({ visible: false, maxHeight: 0 }, () => {
      ranking === "0" ? this.ranking0() : this.ranking12();
    });
  };

  onCloseHelp = () => {
    this.closeHelpAudio()
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
  _onLayoutModal = (event) => {
    let { x, y, width, height } = event.nativeEvent.layout;
    // console.log("通过onLayout得到的高度：" + height);
    this.setState({
      helpHeight: height,
    });
  };
  renderTemplate = () => {
    const { currentTopic } = this.state
    let _currentTopic = JSON.parse(JSON.stringify(currentTopic))
    _currentTopic.template_word.forEach((i, index) => {
      _currentTopic.sentence_stem[i.position].desc = i.desc
    })
    // console.log('renderTemplate',_currentTopic)
    let htm = []
    _currentTopic.sentence_stem.forEach((item, index) => {
      let h = <View>
        <View style={[appStyle.flexJusCenter, appStyle.flexCenter]}>
          <Text style={{ borderBottomWidth: item.desc ? 2 : 0, fontSize: pxToDp(36), paddingBottom: pxToDp(8), borderBottomColor: 'red' }}>{item.content}</Text>
          {item.desc ? <Text style={{ fontSize: pxToDp(26) }}>{item.desc}</Text> : null}
        </View>

      </View>
      htm.push(h)
    })
    return <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
      {htm}
    </View>
  }
  playHeplAudio = () => {
    const { currentTopic, isStartAudio } = this.state;
    // currentTopic.standard_audio = 'chinese/03/00/exercise/audio/0910562130a7482f9b742def14203f55.mp3'
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
  clickSelect = (item, index) => {
    const { currentTopic } = this.state
    let _currentTopic = JSON.parse(JSON.stringify(currentTopic))
    _currentTopic.sentence_stem.forEach((i, x) => {
      i.isActive = false
      if (index === x) i.isActive = true
    })
    // console.log('_____________',item.contentSelect,_currentTopic)
    this.setState({
      currentTopic: _currentTopic,
      selectIndex: index
    })
  }
  selectItem = (item, index) => {
    const { currentTopic, selectIndex } = this.state
    let _currentTopic = JSON.parse(JSON.stringify(currentTopic))
    _currentTopic.sentence_stem[selectIndex].slectLabel = item
    this.setState({
      currentTopic: _currentTopic,
    })
  }
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
          <Text style={[{ fontSize: pxToDp(42), color: "#fff" }]}>
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
          style={[{ flex: 1 }]}
        >
          <ScrollView style={{ maxHeight: 210 }}>
            <View style={[appStyle.flexTopLine, styles.topWrap]}>
              {currentTopic.selectArr ? currentTopic.selectArr.map((item, index) => {
                return <TouchableOpacity key={index} onPress={() => { this.selectItem(item, index) }} style={{ marginRight: pxToDp(20) }}>
                  <ImageBackground style={[styles.selectItem]} source={require("../../../../../images/select_bg.png")} resizeMode="stretch">
                    <Text style={{ fontSize: pxToDp(36), color: '#fff', lineHeight: pxToDp(80) }}>{item}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              }) : null}
            </View>
          </ScrollView>
          <View style={[appStyle.flexAliCenter]}>
            <ImageBackground
              source={require("../../../../../images/sentenceBg.png")}
              style={[styles.content1]}
              resizeMode='stretch'
            >
              <ScrollView style={[styles.contentExc]} ref={(view) => {
                if (view) this.myScrollView = view;
              }}>
                {currentTopic.sentence_stem ? (
                  <>
                    <Text style={[{ fontSize: pxToDp(36), color: "#000" }]}>
                      {currentTopic.common_stem}
                    </Text>
                    {currentTopic.stem ? (
                      <Text style={[{ fontSize: pxToDp(36), color: "#000" }]}>
                        {currentTopic.stem}
                      </Text>
                    ) : null}
                    <ScrollView>
                      <View
                        style={[
                          appStyle.flexLine,
                          appStyle.flexLineWrap,
                          {
                            // marginTop: pxToDp(16),
                            height: maxHeight > 0 ? autoHeight + maxHeight : "auto",
                          },
                        ]}
                        onLayout={this._onLayout}
                      >
                        {currentTopic.sentence_stem
                          ? currentTopic.sentence_stem.map((item, index) => {
                            if (item.contentSelect) {
                              return (
                                <TouchableOpacity onPress={() => { this.clickSelect(item, index) }}><Text style={[styles.selectWrap, item.isActive ? { borderBottomColor: '#892804' } : null, { color: '#8E2904' }]}>{item.slectLabel === '请选择' ? '' : item.slectLabel}</Text></TouchableOpacity>
                              );
                            } else {
                              return (
                                <Text
                                  style={[
                                    {
                                      fontSize: pxToDp(36),
                                      color: item.isCenter ? "#FC6161" : "#000",
                                      lineHeight: pxToDp(76),
                                    },

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
                  <Text style={{ fontSize: pxToDp(32) }}>{tip}</Text>
                )}
              </ScrollView>

            </ImageBackground >
            <TouchableOpacity
              onPress={this.nextTopic}
            >
              <Image
                source={require("../../../../../images/sentenceNext.png")}
                style={[size_tool(186, 71), { marginTop: pxToDp(-20) }]}
              ></Image>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <Modal
          visible={visible}
          transparent={true}
          footer={[
            { text: "关闭", onPress: this.onClose },
            { text: "帮助", onPress: this.helpMe },
          ]}
          style={[{ width: pxToDp(1500) }]}
        >
          <ScrollView
            style={[{ maxHeight: 400 }]}
            onLayout={this._onLayoutModal}
          >
            <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
              {currentTopic.sentence_stem ? currentTopic.sentence_stem.map((item, index) => {
                return <Text style={[item.isCenter ? { color: 'red' } : null, { fontSize: pxToDp(36) }, item.slectLabel ? { color: '#8E2904' } : null]}>{item.slectLabel ? item.slectLabel : item.content}</Text>
              }) : null}
            </View>
            <Text
              style={{
                textAlign: "center",
                color: ranking_color_map[ranking],
                marginBottom: pxToDp(20),
                fontSize: pxToDp(36),
              }}
            >
              {ranking_map[ranking]}
            </Text>
            {diagnose ? (
              <Text style={[{ fontSize: pxToDp(36) }]}>{diagnose}</Text>
            ) : null}
            <View
              style={{
                display: doNumber === 3 || ranking === "0" ? "flex" : "none",
                marginTop: pxToDp(20),
              }}
            >
              <Text style={{ color: "#7FD23F", fontSize: pxToDp(36) }}>
                最佳选择:
              </Text>
              {best_answer_three
                ? best_answer_three.map((item, index) => {
                  return (
                    <Text
                      style={{
                        color: "#7FD23F",
                        fontSize: pxToDp(36),
                      }}
                      key={index}
                    >
                      {item.replaceAll('#去掉#', '')}
                    </Text>
                  );
                })
                : currentTopic.best_answer.map((item, index) => {
                  return (
                    <Text
                      style={{
                        color: "#7FD23F",
                        fontSize: pxToDp(36),
                      }}
                      key={index}
                    >
                      {item.replaceAll('#去掉#', '')}
                    </Text>
                  );
                })}
            </View>
            <View>
              {currentTopic.sentence_stem ? this.renderTemplate() : null}
            </View>
          </ScrollView>
        </Modal>
        <Modal
          visible={helpVisible}
          transparent={true}
          footer={[{ text: "关闭", onPress: this.onCloseHelp }]}
          style={[{ width: pxToDp(1200) }]}
        >
          <ScrollView
            style={[
              helpHeight < 250
                ? {
                  minHeight: helpHeight,
                  maxHeight: 300,
                }
                : {
                  minHeight: helpHeight,
                  maxHeight: helpHeight + 50,
                },
            ]}
          >
            {currentTopic.standard_audio ? (
              <TouchableOpacity onPress={this.playHeplAudio}>
                {isStartAudio ? (
                  <Image
                    style={{ width: 48, height: 48 }}
                    source={require("../../../../../images/stop_icon.png")}
                  ></Image>
                ) : (
                  <Image
                    style={{ width: 48, height: 48 }}
                    source={require("../../../../../images/playAudio_icon.png")}
                  ></Image>
                )}
              </TouchableOpacity>
            ) : null}
            <RichShowView
              divStyle={"font-size: x-large"}
              pStyle={"font-size: x-large"}
              spanStyle={"font-size: x-large"}
              width={pxToDp(1100)}
              value={currentTopic.explanation ? currentTopic.explanation : ""}
            ></RichShowView>
            <RichShowView
              divStyle={"font-size: x-large"}
              pStyle={"font-size: x-large"}
              spanStyle={"font-size: x-large"}
              width={pxToDp(1100)}
              value={currentTopic.standard_explain ? currentTopic.standard_explain : ""}
            ></RichShowView>
          </ScrollView>
        </Modal>
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
    height: pxToDp(546),
    paddingTop: pxToDp(147),
    paddingLeft: pxToDp(127),
  },
  content2: {
    width: pxToDp(1615),
    height: pxToDp(180),
    borderRadius: pxToDp(16),
    marginTop: pxToDp(-40),
    padding: pxToDp(40),
    paddingLeft: pxToDp(60),
  },
  contentExc: {
    // backgroundColor:'red',
    maxHeight: pxToDp(400),
    width: pxToDp(1600)
  },
  selectWrap: {
    borderBottomWidth: 2,
    minWidth: pxToDp(100),
    fontSize: pxToDp(36),
    paddingRight: pxToDp(10),
    paddingLeft: pxToDp(10),
    textAlign: 'center'
  },
  selectItem: {
    width: '100%',
    height: pxToDp(80),
    fontSize: pxToDp(36),
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
  },
  topWrap: {
    // backgroundColor:'red',
    paddingTop: pxToDp(40),
    paddingLeft: pxToDp(193),
    paddingRight: pxToDp(193),
    minHeight: 210
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
