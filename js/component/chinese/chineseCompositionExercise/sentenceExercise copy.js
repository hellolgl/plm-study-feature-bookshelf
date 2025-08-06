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
import { appStyle, appFont } from "../../../theme";
import { size_tool, pxToDp, padding_tool, fontFamilyRestoreMargin } from "../../../util/tools";
import DropdownSelect from "../../../component/Select";
import NavigationUtil from "../../../navigator/NavigationUtil";
import axios from "../../../util/http/axios";
import { connect } from "react-redux";
import api from "../../../util/http/api";
import RichShowView from "../../../component/chinese/RichShowView";
import Sound from "react-native-sound";
import url from "../../../util/url";
import SentenceHelpModal from '../../../component/chinese/SentenceHelpModal'
import MsgModal from '../../../component/chinese/sentence/msgModal'
import HelpModal from '../../../component/chinese/sentence/helpModal'

const ranking_map = {
  "0": "太棒了，答对了哦！",
  "1": "良好，还有更好的组合,继续努力！",
  "2": "答错了，继续努力！",
};
const ranking_color_map = {
  "0": "#7FD23F",
  "1": "#FCAC14",
  "2": "#FC6161",
};
class doWrongExerciseSmart extends PureComponent {
  constructor(props) {
    super(props);
    // this.info = this.props.userInfo.toJS();
    // this.se_id = props.navigation.state.params.data.se_id;
    this.myScrollView = undefined;
    this.heightArr = [];
    this.audioHelp = undefined;
    this.audioHelp1 = undefined;

    this.state = {
      topicList: [],
      visible: false,
      topicIndex: 0,
      currentTopic: {
        best_answer: [],
      },
      diagnose: "",
      ranking: "",
      answerStatisticsModalVisible: false,
      helpVisible: false,
      explanation: "",
      maxHeight: 0,
      autoHeight: 0,
      ischangeHeight: true,
      best_answer_three: undefined,
      helpImg: "",
      helpHeight: 0,
      isStartAudio1: false,
      isStartAudio: false,
      answer_times: 0,
      answer_start_time: new Date().getTime(),
      exerciseInfo: {},
      isKeyExercise: false,
      correct: 0,
      answer_content: [],
      resetSelect: false,
    };
  }
  componentDidMount() {
    let currentTopic = this.changeCurrentTopic(this.props.exercise);
    this.setState({
      currentTopic,
      exerciseInfo: this.props.exercise,
    })
    console.log("题目", this.props.exercise.best_answer)
  }
  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state }
    if (JSON.stringify(props.exercise) !== JSON.stringify(tempState.exerciseInfo)) {
      tempState.exerciseInfo = props.exercise
      tempState.isKeyExercise = false
      tempState.answer_times = 0
      tempState.start_time = new Date().getTime()
      tempState.correct = 0
      tempState.ranking = ''
      return tempState

    }

  }
  componentDidUpdate(prevProps, prevState,) {
    if (prevState.exerciseInfo.se_id !== this.state.exerciseInfo.se_id) {
      let currentTopic = this.changeCurrentTopic(this.state.exerciseInfo);
      this.setState({
        currentTopic,
      })
    }

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
    const { currentTopic, answer_start_time, isKeyExercise, correct, answer_content, answer_times } = this.state;
    let diag_sentence_key_arr = [];
    let diag_sentence_key = "";
    let answer_contentnow = []
    currentTopic.sentence_stem.forEach((item) => {
      if (item.slectLabel) {
        diag_sentence_key_arr.push(item.slectLabel);
        answer_contentnow.push(item.slectLabel)
      } else {
        answer_contentnow.push(item.content)
      }
    });
    console.log("最佳答案res", currentTopic.best_answer)

    console.log("答案res", answer_contentnow)
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
    // console.log("111111111111111111", best_answer_three,currentTopic.best_answer);
    diag_sentence_key = diag_sentence_key_arr.join("");
    if (!currentTopic.diag_sentence[diag_sentence_key]) {
      Toast.info("请选择答案", 1, undefined, false);
      return;
    }
    let ranking = currentTopic.diag_sentence[diag_sentence_key].ranking;
    let endTime = new Date().getTime();
    let answer_timesnow = parseInt((endTime - answer_start_time) / 1000);
    let correctnow = ranking === '2' ? 0 : ranking === '0' ? 2 : 1
    this.setState({
      diagnose: currentTopic.diag_sentence[diag_sentence_key].diagnose,
      ranking,
      visible: true,
      answer_times: isKeyExercise ? answer_times : answer_timesnow,
      correct: isKeyExercise ? correct : correctnow,
      answer_content: isKeyExercise ? answer_content : answer_contentnow,
      resetSelect: true
    });
    setTimeout(() => {
      this.setState({
        resetSelect: false,
      })
    }, 200)
  };
  ranking012 = () => {
    const { currentTopic } = this.state;
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
    this.setState({
      currentTopic: _currentTopic,
      best_answer_three: undefined
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
  goBack = () => {
    this.closeHelpAudio()
    this.closeHelpAudio1()
    NavigationUtil.goBack(this.props);
  };
  selectChange = (item, _options) => {
    const { currentTopic } = this.state;
    let _currentTopic = JSON.parse(JSON.stringify(currentTopic));

    _currentTopic.sentence_stem[item.position].slectLabel = item.label

    this.setState({ currentTopic: _currentTopic });
  };
  onClose = () => {
    const { currentTopic, answer_times, correct, isKeyExercise, answer_content } = this.state;
    if (correct !== 2 && !isKeyExercise) {
      this.ranking012();
      this.setState({ visible: false, maxHeight: 0, answer_start_time: new Date().getTime(), isKeyExercise: true });
    } else {
      this.ranking012();
      this.setState({ visible: false, maxHeight: 0, answer_start_time: new Date().getTime(), isKeyExercise: false });
      this.props.nextExercise({
        se_id: currentTopic.se_id,
        correct,
        answer_times,
        exercise_type: currentTopic.exercise_type,
        exercise_id: currentTopic.exercise_id,
        ability: currentTopic.ability,
        element_id: currentTopic.element_id,
        answer_content,
      })
    }

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
  };
  selectShow = (height) => {
    const { currentTopic } = this.state;
    this.heightArr.push(height);
    console.log("this.heightArrthis.heightArr", this.heightArr);
    this.setState({
      maxHeight: Math.max(...this.heightArr),
    });
  };
  _onLayout = (event) => {
    const { ischangeHeight, currentTopic } = this.state;
    let { x, y, width, height } = event.nativeEvent.layout;
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
    console.log("通过onLayout得到的高度：" + height);
    this.setState({
      helpHeight: height,
    });
  };
  renderTemplate = () => {
    const { currentTopic } = this.state
    let _currentTopic = JSON.parse(JSON.stringify(currentTopic))
    console.log('renderTemplate', _currentTopic)

    _currentTopic.template_word ? _currentTopic.template_word.forEach((i, index) => {
      _currentTopic.sentence_stem[i.position].desc = i.desc
    }) : ''
    let htm = []
    _currentTopic.template_word ? _currentTopic.sentence_stem.forEach((item, index) => {
      let h = <View>
        <View style={[appStyle.flexJusCenter, appStyle.flexCenter]}>
          <Text style={{ borderBottomWidth: item.desc ? 2 : 0, fontSize: pxToDp(36), paddingBottom: pxToDp(8), borderBottomColor: 'red', marginLeft: 2, marginRight: 2 }}>{item.content}</Text>
          {item.desc ? <Text style={{ fontSize: pxToDp(26) }}>{item.desc}</Text> : null}
        </View>

      </View>
      htm.push(h)
    }) : ''
    return <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
      {htm}
    </View>
  }
  playHeplAudio = () => {
    const { currentTopic, isStartAudio } = this.state;
    this.closeHelpAudio1()
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
      visible,
      currentTopic,
      diagnose,
      ranking,
      helpVisible,
      explanation,
      // optionsLength,
      autoHeight,
      best_answer_three,
      helpImg,
      helpHeight,
      maxHeight,
      isStartAudio1,
      isStartAudio,
      resetSelect
    } = this.state;
    return (
      <View style={[styles.container,]}>
        <View style={[styles.content1,]}>
          {currentTopic.sentence_stem ? (
            <>
              <Text style={[{ fontSize: pxToDp(36), color: "#000" }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>
                {currentTopic.common_stem}
              </Text>
              {currentTopic.stem ? (
                <Text style={[{ fontSize: pxToDp(36), color: "#000" }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>
                  {currentTopic.stem}
                </Text>
              ) : null}
              {
                currentTopic.stem_picture ?
                  <Image source={{ uri: url.baseURL + currentTopic.stem_picture }}
                    style={[size_tool(400, 300), { marginBottom: pxToDp(20) }]}
                  />
                  : null
              }
              {/* <View style={{ height: pxToDp(300), backgroundColor: '#fff' }}> */}
              {/* <ScrollView
                ref={(view) => {
                  if (view) this.myScrollView = view;
                }}

              > */}
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
                        <DropdownSelect
                          options={item.contentSelect}
                          dropItemStyleCheckBg={'#F99C32'}
                          selectStyle={{
                            minWidth: pxToDp(400),
                            height: pxToDp(76),
                            width: item.autowidth + 6,
                            borderColor: '#FD942D',
                            color: '#FF9F0A'
                          }}
                          selectWrapStyle={{
                            marginRight: pxToDp(10),
                            marginLeft: pxToDp(10),
                            marginBottom: pxToDp(30),
                          }}
                          // 下拉框定位是为了避免多行的时候把下一行挤的看不见
                          dropWrapStyle={{
                            position: "absolute",
                            zIndex: 1,
                            top: pxToDp(80),
                            borderColor: '#FD942D',
                            color: '#fff'
                          }}
                          dropItemStyle={{
                            minHeight: pxToDp(76),
                            // borderRightWidth: 1,
                            // borderColor: "#38B3FF",
                          }}
                          dropItemText={{ fontSize: pxToDp(36), }}
                          selectItem={this.selectChange}
                          selectShow={this.selectShow}
                          resetSelect={resetSelect}
                          key={index}
                        ></DropdownSelect>
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
              {/* </ScrollView> */}
              {/* </View> */}
            </>
          ) : (
            <Text>...</Text>
          )}
        </View>
        <View style={[styles.content2,]}>
          <ScrollView style={[{ marginRight: pxToDp(200) }]}>

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
                                  : "#38B3FF",
                              marginBottom: pxToDp(20),
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
                              marginBottom: pxToDp(20),
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

          <TouchableOpacity style={[styles.nextBtn, appStyle.flexCenter]} onPress={this.nextTopic}>
            <Text style={[styles.nextText, appFont.fontFamily_syst]}>下一题</Text>
          </TouchableOpacity>
        </View>
        {console.log("===============", best_answer_three, currentTopic.best_answer)}
        <SentenceHelpModal
          status={visible}
          goback={this.onClose}
          currentTopic={currentTopic}
          doNumber={3}
          best_answer_three={best_answer_three}
          diagnose={diagnose}
          ranking={ranking}
        />


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between'
  },

  content1: {
    // height: pxToDp(580),
    flex: 1,
    borderRadius: pxToDp(16),
  },
  content2: {
    height: pxToDp(200),
    borderRadius: pxToDp(16),
    marginTop: pxToDp(48),
    borderWidth: pxToDp(8),
    borderColor: '#F9AD63',
    padding: pxToDp(16)
  },
  nextBtn: {
    position: "absolute",
    right: pxToDp(20),
    bottom: pxToDp(28),
    width: pxToDp(192),
    height: pxToDp(64),
    backgroundColor: "#773813",
    borderRadius: pxToDp(32),
  },
  nextText: {
    fontSize: pxToDp(32),
    color: "#fff",
  },
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
export default connect(
  mapStateToProps,
  mapDispathToProps
)(doWrongExerciseSmart);
