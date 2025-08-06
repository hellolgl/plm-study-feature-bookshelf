import React, { Component, PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  DeviceEventEmitter,
} from "react-native";
import {
  size_tool,
  pxToDp,
  padding_tool,
  fontFamilyRestoreMargin,
} from "../../../util/tools";
import CircleCard from "../../../component/CircleCard";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import NavigationUtil from "../../../navigator/NavigationUtil";
import { connect } from "react-redux";
// import ViewControl from 'react-native-zoom-view'
import AnswerStatisticsModal from "../../../component/AnswerStatisticsNoModal";
import { Toast } from "antd-mobile-rn";
import { appFont, appStyle } from "../../../theme";
// import RichShowView from "../../../component/richShowViewNew";
import RichShowView from "../../../component/chinese/newRichShowView";
import Header from "../../../component/Header";
import _ from "lodash";
import Audio from "../../../util/audio";
import url from "../../../util/url";
import ReadingHelpModal from "../../../component/chinese/ReadingHelpModal";

const zimu = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
let isUpload = true;
// let url = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/";
class ChineseBagExercise extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      canvasWidth: 0,
      canvasHeight: 0,
      topaicNum: 0,
      //题目列表，后期可能改动
      fromServeCharacterList: [],
      isEnd: false,
      topaicIndex: 0,
      status: false,
      diagnose_notes: "", // 诊断标记
      canvasData: "",
      isKeyExercise: 1,
      lookDetailNum: 0,
      answer_start_time: "",
      answer_end_time: "",
      checkedIndex: -1,
      //题目统计结果
      blank: 0,
      correct: 0,
      wrong: 0,
      answerStatisticsModalVisible: false,
      knowledgepoint_explanation: "", //知识讲解
      isImageHelp: false,
      optionList: [],
      isLookHelp: false,
      explanation_audio: "",
      isStartAudio: false,
      isStartAudio1: false,
      playStatus: false,
      playStatus1: false,
      paused: true,
      pausedPrivate: true,
      pausedHelp: true,
      // renderOptionList: true
    };
    this.isHelpClick = false; //诊断标记点击关闭还是帮助
    this.handlenNxtTopaicThrottled = _.throttle(this.nextTopaic, 1 * 1000);
    this.handlenOnCloseHelpThrottled = _.throttle(this.onCloseHelp, 3 * 1000);
    // this.handlenOnCloseThrottled = _.throttle(this.onClose, 3 * 1000);

    // this.handlePlayAudioThrottled = _.throttle(this.playAudio, 3 * 1000);
    this.audio1 = React.createRef();
    this.audio = React.createRef();
    this.scrollRef = React.createRef();
  }

  static navigationOptions = {
    // title:'答题'
  };
  renderOptionList = true;

  goBack = () => {
    this.audioPaused();
    this.audioPausedHelp();
    this.audioPausedPrivate();
    NavigationUtil.goBack(this.props);
  };

  getTime = () => {
    let date = new Date();
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1).toString();
    var day = date.getDate().toString();
    var hour = date.getHours().toString();
    var minute = date.getMinutes().toString();
    var seconds = date.getSeconds().toString();
    return (
      year +
      "-" +
      month +
      "-" +
      day +
      "" +
      " " +
      hour +
      ":" +
      minute +
      ":" +
      seconds
    );
  };

  //获取整套题作答结果
  getAnswerResult = () => {
    const { exercise_set_id } = this.state;
    const data = {};
    data.exercise_set_id = exercise_set_id;
    data.student_code = this.props.userInfo.toJS().id;
    data.subject = "01";
    //console.log("getAnswerResult", data);
    axios
      .post(api.yuwenBagResult, data)
      .then((res) => {
        // console.log('getAnswerResult', res)
        this.setState(() => ({
          wrong: res.data.data.wrong,
          blank: res.data.data.blank,
          correct: res.data.data.correct,
          answerStatisticsModalVisible: true,
          isEnd: true,
        }));
      })
      .catch((e) => {
        // console.log(e)
      });
  };
  closeAnswerStatisticsModal = () => {
    // console.log('MathCanvas closeDialog')
    this.setState({ answerStatisticsModalVisible: false });
    DeviceEventEmitter.emit("aiPlanDidExercise");
    NavigationUtil.goBack(this.props);
  };

  componentDidMount() {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    console.log("chineseBagExercise didmount");
    const data = {
      subject: "01",
      // grade_code: '03',
      // class_info: 'eEbFxkbDHe26ZgNWJe1vArn9',
      // team: '00',
      unit: "1",
      // student_code: '1',
      // learning_point: '01',
      // lesson_coding: '011003000101001000',
      origin: this.props.navigation.state.params.data.exercise_origin,
      exercise_set_id: this.props.navigation.state.params.data.exercise_set_id,
    };
    data.grade_code = userInfoJs.checkGrade;
    data.class_info = userInfoJs.class_code;
    data.team = userInfoJs.checkTeam;
    data.student_code = userInfoJs.id;
    axios.post(api.getChineseBagExercise, data).then((res) => {
      let list = res.data.data;
      // console.log('ti', list)
      let time = this.getTime();
      for (let i in list) {
        list[i].colorFlag = 0;
      }
      // list[0].colorFlag = 1
      //console.log("题目", list);
      this.setState(() => ({
        fromServeCharacterList: [...list],
        topaicNum: list.length,
        exercise_set_id: list.length > 0 ? list[0].exercise_set_id : "",
        answer_start_time: time,
      }));
    });
  }

  topaicContainerOnLayout = (e) => {
    let { width, height } = e.nativeEvent.layout;
    this.setState(() => ({
      canvasWidth: width,
      canvasHeight: height,
    }));
  };

  renderTopaicCard = (topaicNum) => {
    let cardList = new Array();
    const { topaicIndex, fromServeCharacterList } = this.state;
    for (let i = 0; i < fromServeCharacterList.length; i++) {
      cardList.push(
        <CircleCard
          key={i}
          text={i - 0 + 1}
          colorFlag={fromServeCharacterList[i].colorFlag}
        />
      );
    }
    return cardList;
  };
  //获取看拼音写汉字题型的拼音
  getPyDataFromServe = () => {
    const stateList = [...this.state.fromServeCharacterList];
    const selectMap = new Map();
    for (let i = 0; i < stateList.length; i++) {
      selectMap.set(i, { ...stateList[i] });
    }
    return selectMap;
  };

  checkAnswer = (index) => {
    this.setState({
      checkedIndex: index,
    });
  };

  saveExerciseDetail = (yesOrNo, answer) => {
    // 保存做题结果
    const { fromServeCharacterList, topaicIndex, isLookHelp } = this.state;
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();

    // console.log("jieguo", this.state)
    if (isUpload) {
      isUpload = false;
      axios
        .post(api.saveChineseBagExercise, {
          grade_code: userInfoJs.checkGrade,
          term_code: userInfoJs.checkTeam,
          class_info: userInfoJs.class_code,
          stu_origin: this.props.navigation.state.params.data.stu_origin,
          textbook: "10",
          unit_code: this.props.navigation.state.params.data.unit_code,
          student_code: userInfoJs.id,
          origin: this.props.navigation.state.params.data.exercise_origin,
          knowledge_point: fromServeCharacterList[topaicIndex].knowledge_point,
          knowledgepoint_type:
            fromServeCharacterList[topaicIndex].knowledgepoint_type,
          exercise_id: fromServeCharacterList[topaicIndex].exercise_id,
          exercise_level: fromServeCharacterList[topaicIndex].exercise_level,
          exercise_point_loc: "",
          exercise_result: answer,
          exercise_set_id: this.state.exercise_set_id,
          identification_results: "",
          is_modification: this.state.isKeyExercise,
          answer_start_time: this.state.answer_start_time, // 答题开始时间
          answer_end_time: this.getTime(), // 答题结束时间
          is_correction: "", // 是否批改
          correction_remarks: "", //批改备注信息
          correction: isLookHelp ? 1 : yesOrNo, //批改对错，0 正确 1错误
          record: "", //  批改记录
          is_help: this.state.lookDetailNum === 0 ? 1 : 0, //是都点击帮助0是，1是否
          tooltip_access_frequency: this.state.lookDetailNum, //点击帮助的次数
          tooltip_access_time: "", //点击帮助停留时间
          is_element_exercise: this.state.isKeyExercise, // 是否做错推送的要素题
          is_finish:
            topaicIndex + 1 == this.state.fromServeCharacterList.length ? 0 : 1, //整套题是否做完,0  做完，，1没做完
        })
        .then((res) => {
          isUpload = true;
          if (res.data.err_code === 0) {
            this.setState({
              isLookHelp: false,
            });
            if (yesOrNo === 0) {
              // 答对了 跳入下一道     或者是推送的要素题，this.state.isKeyExercise === 0 ||
              this.renderOptionList = true; //1
              //console.log("saveExercise");
              topaicIndex + 1 == this.state.fromServeCharacterList.length
                ? this.getAnswerResult()
                : this.setState({
                    topaicIndex:
                      topaicIndex + 1 ==
                      this.state.fromServeCharacterList.length
                        ? 0
                        : topaicIndex + 1,
                    isKeyExercise: 1,
                    lookDetailNum: 0,
                    status: false,
                    answer_start_time: this.getTime(),
                    checkedIndex: -1,
                    optionList: [],
                    // isLookHelp: false
                  });
            }
          }
        });
    }
  };
  renderWriteTopaic = () => {
    const map = this.getPyDataFromServe();
    const { topaicIndex, optionList } = this.state;
    const data = { ...map.get(topaicIndex) };
    let baseUrl =
      "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
      data.private_stem_picture;
    let arr = [];

    if (this.renderOptionList && data.exercise_content) {
      //console.log("更新");
      arr = data.exercise_content ? data.exercise_content.split("#") : [];
      let randomNumber = function () {
        // randomNumber(a,b) 返回的值大于 0 ，则 b 在 a 的前边；
        // randomNumber(a,b) 返回的值等于 0 ，则a 、b 位置保持不变；
        // randomNumber(a,b) 返回的值小于 0 ，则 a 在 b 的前边。
        return 0.5 - Math.random();
      };
      arr.sort(randomNumber);
      this.setState({
        optionList: [...arr],
      });
      this.renderOptionList = false; //1
    } else {
      arr = [...optionList];
    }

    if (!data.exercise_id) {
      return <Text style={[{ fontSize: pxToDp(26) }]}>数据加载中...</Text>;
    } else {
      return (
        // 不同题型组装题目
        <View style={{ flexDirection: "row", height: pxToDp(240) }}>
          <ScrollView
            style={{
              flex: 1,
              // height: pxToDp(200),
              // backgroundColor: "#ffffff",
              paddingRight: pxToDp(40),
            }}
          >
            <View
              style={{
                marginTop: pxToDp(32),
                // maxWidth: pxToDp(1420),
                flexDirection: data.content_picture === "1" ? "row" : "column",
              }}
            >
              {arr.map((item, index) => {
                // if (item.indexOf(".png") != -1 || item.indexOf(".jpg") != -1) {
                if (data.content_picture === "1") {
                  return (
                    <TouchableOpacity
                      onPress={() => this.checkAnswer(index)}
                      key={index}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "nowrap",
                          marginBottom: 20,
                          alignItems: "center",
                          marginRight: pxToDp(40),
                        }}
                      >
                        <View
                          style={
                            this.state.checkedIndex === index
                              ? styles.checkedOption
                              : styles.checkOptions
                          }
                        >
                          <Text
                            style={{
                              color:
                                this.state.checkedIndex === index
                                  ? "#FFFFFF"
                                  : "#666666",
                              fontSize: pxToDp(35),
                            }}
                          >
                            {zimu[index]}
                          </Text>
                        </View>
                        <View
                        // cropWidth={pxToDp(250)}
                        // cropHeight={pxToDp(250)}
                        // imageWidth={pxToDp(250)}
                        // imageHeight={pxToDp(250)}
                        >
                          <Image
                            style={{
                              width: pxToDp(250),
                              height: pxToDp(250),
                              marginLeft: pxToDp(0),
                            }}
                            source={{
                              uri:
                                "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
                                item,
                            }}
                            resizeMode={"contain"}
                          ></Image>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                } else {
                  return (
                    <TouchableOpacity
                      onPress={() => this.checkAnswer(index)}
                      key={index}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "nowrap",
                          marginBottom: 20,
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={
                            this.state.checkedIndex === index
                              ? styles.checkedOption
                              : styles.checkOptions
                          }
                        >
                          <Text
                            style={{
                              color:
                                this.state.checkedIndex === index
                                  ? "#FFFFFF"
                                  : "#666666",
                              fontSize: pxToDp(35),
                            }}
                          >
                            {zimu[index]}
                          </Text>
                        </View>
                        <Text
                          style={[
                            { fontSize: pxToDp(35), flex: 1 },
                            appFont.fontFamily_syst,
                            fontFamilyRestoreMargin(),
                          ]}
                        >
                          {item}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }
              })}
            </View>
          </ScrollView>
        </View>
      );
    }
  };

  //获取canvas手写数据

  nextTopaic = () => {
    // this.refs.canvas._nextTopaic();
    let { isLookHelp } = this.state;
    let index = this.state.checkedIndex;
    this.audioPaused();
    this.audioPausedPrivate();
    const { fromServeCharacterList, topaicIndex, optionList } = this.state;
    if (index === -1) {
      return;
    }
    if (
      !isLookHelp &&
      optionList[index] === fromServeCharacterList[topaicIndex].answer_content
    ) {
      // 正确，当前题目为推送的要素题时不论对错都保存

      this.saveExerciseDetail(0, optionList[index]);
      if (this.state.isKeyExercise === 1) {
        fromServeCharacterList[topaicIndex].colorFlag = 1;
      }

      Toast.info("恭喜你，答对了！", 1);
    } else {
      if (this.state.isKeyExercise === 1) {
        fromServeCharacterList[topaicIndex].colorFlag = 2;
      }
      this.saveExerciseDetail(1, optionList[index]);

      let arr = [
        ...fromServeCharacterList[topaicIndex].exercise_content.split("#"),
      ];
      let str = ""; // 讲解
      for (let i in arr) {
        if (optionList[index] === arr[i]) {
          str =
            fromServeCharacterList[topaicIndex].diagnose_notes.split("#")[i];
        }
      }
      //console.log("ishelpe", isLookHelp);
      isLookHelp ? (str = "请继续努力！") : "";
      this.helpMe(false);
      this.setState({
        // visible: true,
        diagnose_notes: str,
      });
    }
    this.scrollRef.current?.scrollTo({
      y: 0,
      animated: false,
    });
  };
  clear = () => {
    // console.log("clear")
    this.refs.canvas._clear();
  };
  showImg = () => {
    this.refs.canvas._addImageUrl(api.testCanvas);
  };

  showText = () => {
    let { status, lookDetailNum } = this.state;

    this.setState({
      status: status ? false : true,
      lookDetailNum: !status ? ++lookDetailNum : lookDetailNum,
    });
  };

  helpMe = (isHelp) => {
    // 点击查看帮助
    console.log("帮助", isHelp);
    let {
      status,
      lookDetailNum,
      fromServeCharacterList,
      topaicIndex,
      isImageHelp,
      isLookHelp,
      diagnose_notes,
    } = this.state;
    this.audioPaused();
    this.audioPausedPrivate();
    let flag = false;
    // 点击查看帮助的两种途径
    if (isHelp) {
      // 从页面点击过来，不用做任何别的操作
      isImageHelp = true;
      isLookHelp = true;
    } else {
      // 从诊断标记点击过来，需要改变参数
      isImageHelp = false;
      this.isHelpClick = true;
    }
    ++lookDetailNum;
    // console.log("hele", lookDetailNum)- 9
    // this.onClose(1)
    // await this.setState({
    //   visible: false,
    // })
    // await setTimeout(() => {
    this.setState({
      knowledgepoint_explanation:
        fromServeCharacterList[topaicIndex] &&
        fromServeCharacterList[topaicIndex].knowledgepoint_explanation != ""
          ? fromServeCharacterList[topaicIndex].knowledgepoint_explanation
          : " ",
      status: true,
      lookDetailNum,
      isImageHelp,
      isLookHelp,
      explanation_audio:
        fromServeCharacterList[topaicIndex] &&
        fromServeCharacterList[topaicIndex].explanation_audio
          ? fromServeCharacterList[topaicIndex].explanation_audio
          : "",
      diagnose_notes: isHelp ? "" : diagnose_notes,
    });
    // }, 600)
  };
  onCloseHelp = () => {
    const { fromServeCharacterList, topaicIndex, isImageHelp } = this.state;
    // Toast.loading('请等待', 3)
    if (!isImageHelp) {
      // 判断当前是要素题还是一般习题，如果是要素题就要跳到下一题，如果不是要素题就应该请求要素题
      // console.log('要素题', this.state.isKeyExercise)
      if (this.state.isKeyExercise === 0) {
        // 当前题目是要素题，应该切换到下一题
        this.isHelpClick = false;
        // modal回调两次，三元会造成报错
        if (topaicIndex + 1 == fromServeCharacterList.length) {
          this.setState({
            status: false,
          });
          this.getAnswerResult();
        } else {
          this.renderOptionList = true;
          //console.log("onCLoseHelp");
          this.setState(
            () => {
              return {
                topaicIndex:
                  topaicIndex + 1 == fromServeCharacterList.length
                    ? 0
                    : topaicIndex + 1,
                isKeyExercise: 1,
                lookDetailNum: 0,
                status: false,
                answer_start_time: this.getTime(),
                checkedIndex: -1,
              };
            },
            () => {
              //
            }
          );
        }
      } else {
        // 当前题目不是要素题，应该请求要素题
        console.log("获取要素题+++=========");
        this.getKeyExercise();
        this.setState({
          status: false,
        });
      }
    } else {
      this.setState({
        status: false,
      });
    }
    this.audioPaused();
    this.audioPausedHelp();
    this.audioPausedPrivate();
  };
  getKeyExercise = () => {
    const { fromServeCharacterList, topaicIndex } = this.state;
    if (isUpload) {
      isUpload = false;
      axios
        .post(api.getChineseKeyExercise, {
          // subject: '01',
          // grade_name: '03',
          // class_info: 'eEbFxkbDHe26ZgNWJe1vArn9',
          // team: '00',
          // unit: '1',
          // student_code: '1',
          // learning_point: '01',
          // lesson_coding: '011003000101001000',
          related_ability_primary:
            fromServeCharacterList[topaicIndex].related_ability_primary,
          related_ability_all:
            fromServeCharacterList[topaicIndex].related_ability_all,
          origin: this.props.navigation.state.params.data.exercise_origin,
          knowledge_point: fromServeCharacterList[topaicIndex].knowledge_point,
          exercise_id: fromServeCharacterList[topaicIndex].exercise_id,
          exercise_set_id: this.state.exercise_set_id,
        })
        .then((res) => {
          isUpload = true;
          if (res.data.err_code === 0) {
            this.isHelpClick = false;
            fromServeCharacterList[topaicIndex] = {
              ...fromServeCharacterList[topaicIndex],
              ...res.data.data,
            };
            this.renderOptionList = true; //1
            //console.log("getKeyExercise");
            this.setState({
              fromServeCharacterList,
              isKeyExercise: 0,
              checkedIndex: -1,
              optionList: [],
            });
          }
        });
    }
  };

  renderButton = () => {
    const { isEnd } = this.state;
    if (isEnd) {
      return (
        <TouchableOpacity
          style={styles.topaicBtn}
          ref="topaicBox"
          onLayout={(event) => this.topaicContainerOnLayout(event)}
          onPress={this.goBack}
        >
          <View
            style={[
              size_tool(180, 60),
              {
                borderRadius: pxToDp(50),
                backgroundColor: "#A86A33",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Text style={{ color: "#ffffff" }}>完成</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.topaicBtn}
          ref="topaicBox"
          onLayout={(event) => this.topaicContainerOnLayout(event)}
          onPress={this.handlenNxtTopaicThrottled}
        >
          <View
            style={[
              size_tool(180, 60),
              {
                borderRadius: pxToDp(50),
                backgroundColor: "#A86A33",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Text
              style={[
                { color: "#ffffff", fontSize: pxToDp(28) },
                appFont.fontFamily_syst,
              ]}
            >
              下一题
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  audioPaused = () => {
    this.setState({
      paused: true,
      playStatus1: false,
    });
  };

  audioPlay = () => {
    this.audioPausedPrivate();
    this.audio.current.replay();
    this.setState({
      paused: false,
      playStatus1: true,
    });
  };
  audioPausedPrivate = () => {
    this.setState({
      pausedPrivate: true,
      isStartAudio1: false,
    });
  };

  audioPlayPrivate = () => {
    this.audioPaused();
    this.audio1.current.replay();
    this.setState({
      pausedPrivate: false,
      isStartAudio1: true,
    });
  };
  audioPausedHelp = () => {
    this.setState({
      pausedHelp: true,
      isStartAudio: false,
    });
  };

  audioPlayHelp = () => {
    this.setState({
      pausedHelp: false,
      isStartAudio: true,
    });
  };
  renderCommonMCQ = (data) => {
    //console.log('renderCommonMCQ')
    let baseUrl =
      "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
      data.private_stem_picture;
    const {
      fromServeCharacterList,
      topaicIndex,
      isStartAudio1,
      paused,
      pausedPrivate,
    } = this.state;
    return (
      <View style={styles.topaicText}>
        <View
          style={[
            {
              padding: pxToDp(24),
              backgroundColor: "#FFFFFFFF",
              borderRadius: pxToDp(30),
              height: pxToDp(450),
              flex: 1,
            },
          ]}
        >
          <View>
            <ScrollView ref={this.scrollRef}>
              <View style={{ paddingRight: pxToDp(40) }}>
                {data.public_stem_audio ? (
                  this.state.playStatus1 ? (
                    <TouchableOpacity
                      style={{ marginTop: pxToDp(2) }}
                      onPress={() => {
                        this.audioPaused();
                      }}
                    >
                      <Image
                        style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                        source={require("../../../images/playing_icon.png")}
                      ></Image>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{ marginTop: pxToDp(2) }}
                      onPress={() => {
                        this.audioPlay();
                      }}
                    >
                      <Image
                        style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                        source={require("../../../images/play_icon.png")}
                      ></Image>
                    </TouchableOpacity>
                  )
                ) : null}
                {data.public_stem_audio ? (
                  <Audio
                    uri={`${url.baseURL}${data.public_stem_audio}`}
                    paused={paused}
                    pausedEvent={this.audioPaused}
                    ref={this.audio}
                  />
                ) : null}
                <RichShowView
                  width={pxToDp(1420)}
                  value={data.public_exercise_stem}
                  size={2}
                ></RichShowView>

                {fromServeCharacterList[topaicIndex] &&
                fromServeCharacterList[topaicIndex].public_stem_picture ? (
                  <View
                    style={{
                      borderRadius: pxToDp(30),
                      width: pxToDp(600),
                      height: pxToDp(450),
                      backgroundColor: "#FFFFFF",
                      marginRight: pxToDp(12),
                    }}
                  >
                    <Image
                      style={{
                        width: pxToDp(600),
                        height: pxToDp(450),
                        resizeMode: "contain",
                        borderRadius: pxToDp(30),
                      }}
                      source={{
                        uri:
                          "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
                          fromServeCharacterList[topaicIndex]
                            .public_stem_picture,
                      }}
                    ></Image>
                  </View>
                ) : null}
              </View>

              {fromServeCharacterList[topaicIndex] &&
              fromServeCharacterList[topaicIndex].public_exercise_stem != "" ? (
                <View style={{ height: pxToDp(48), width: pxToDp(48) }}></View>
              ) : null}

              <RichShowView
                width={pxToDp(1420)}
                value={data.private_exercise_stem}
                size={2}
              ></RichShowView>
              {data.private_stem_audio ? (
                isStartAudio1 ? (
                  <TouchableOpacity
                    style={{ marginTop: pxToDp(2) }}
                    onPress={() => {
                      this.audioPausedPrivate();
                    }}
                  >
                    <Image
                      style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                      source={require("../../../images/playing_icon.png")}
                    ></Image>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{ marginTop: pxToDp(2) }}
                    onPress={() => {
                      this.audioPlayPrivate();
                    }}
                  >
                    <Image
                      style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                      source={require("../../../images/play_icon.png")}
                    ></Image>
                  </TouchableOpacity>
                )
              ) : null}
            </ScrollView>
          </View>

          {data.private_stem_audio ? (
            <Audio
              uri={`${url.baseURL}${data.private_stem_audio}`}
              paused={pausedPrivate}
              pausedEvent={this.audioPausedPrivate}
              ref={this.audio1}
            />
          ) : null}
          <TouchableOpacity
            onPress={this.helpMe.bind(this, true)}
            style={{
              height: pxToDp(48),
              marginLeft: pxToDp(64),
              position: "absolute",
              right: 10,
              top: 5,
            }}
          >
            <Image
              source={require("../../../images/help.png")}
              style={[appStyle.helpBtn]}
            ></Image>
          </TouchableOpacity>
        </View>

        {data.private_stem_picture ? (
          <View style={{ flexDirection: "row", marginTop: pxToDp(36) }}>
            <View
              style={{
                borderRadius: pxToDp(30),
                width: pxToDp(400),
                height: pxToDp(380),
                backgroundColor: "#FFFFFF",
                marginRight: pxToDp(12),
              }}
            >
              <Image
                style={{
                  width: pxToDp(400),
                  height: pxToDp(380),
                  resizeMode: "contain",
                  borderRadius: pxToDp(30),
                }}
                source={{ uri: baseUrl }}
              ></Image>
            </View>
            <View
              style={{
                backgroundColor: "#FFFFFFFF",
                flex: 1,
                borderRadius: pxToDp(30),
                padding: pxToDp(24),
                alignItems: "flex-end",
              }}
            >
              {data.exercise_content ? this.renderWriteTopaic() : <View></View>}
              {this.renderButton()}
            </View>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              marginTop: pxToDp(36),
              height: pxToDp(380),
            }}
          >
            <View
              style={{
                backgroundColor: "#FFFFFFFF",
                width: "100%",
                borderRadius: 15,
                padding: pxToDp(24),
                alignItems: "flex-end",
              }}
            >
              {/* <ScrollView style={[{ flex: 1, width: '100%' }]}> */}

              {data.exercise_content ? this.renderWriteTopaic() : <View></View>}
              {/* </ScrollView> */}
              {this.renderButton()}
            </View>
          </View>
        )}
      </View>
    );
  };
  render() {
    const {
      topaicNum,
      fromServeCharacterList,
      topaicIndex,
      explanation_audio,
    } = this.state;

    return (
      <View style={styles.mainWrap}>
        <Header
          text={this.props.navigation.state.params.data.learning_name}
          goBack={() => {
            this.goBack();
          }}
        ></Header>
        <View style={styles.container}>
          <View
            style={styles.topaic}
            ref="topaicBox"
            onLayout={(event) => this.topaicContainerOnLayout(event)}
          >
            {/* <View style={styles.topaicText}> */}
            {fromServeCharacterList[topaicIndex] &&
            fromServeCharacterList[topaicIndex].exercise_id
              ? this.renderCommonMCQ(fromServeCharacterList[topaicIndex])
              : null}

            {/* </View> */}
          </View>
          <View style={styles.topaicCard}>
            <ScrollView
              style={[
                padding_tool(24, 10, 24, 30),
                {
                  flex: 1,
                  width: "100%",
                },
              ]}
            >
              <View
                style={[
                  {
                    flexDirection: "row",
                    flexWrap: "wrap",
                    flex: 1,
                  },
                ]}
              >
                {this.renderTopaicCard(topaicNum)}
              </View>
            </ScrollView>
            <Text
              style={[
                {
                  color: "#666666",
                  fontSize: pxToDp(42),
                  marginBottom: pxToDp(100),
                },
                appFont.fontFamily_syst,
                fontFamilyRestoreMargin(),
              ]}
            >
              答题卡{topaicIndex + 1}/{topaicNum}
            </Text>
          </View>
        </View>

        <ReadingHelpModal
          status={this.state.status}
          goback={this.handlenOnCloseHelpThrottled}
          audio={explanation_audio}
          knowledgepoint_explanation={this.state.knowledgepoint_explanation}
          diagnose_notes={this.state.diagnose_notes}
        />
        <AnswerStatisticsModal
          dialogVisible={this.state.answerStatisticsModalVisible}
          yesNumber={this.state.correct}
          noNumber={this.state.wrong}
          waitNumber={this.state.blank}
          closeDialog={this.closeAnswerStatisticsModal}
        ></AnswerStatisticsModal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrap: {
    backgroundColor:
      "linear - gradient(90deg, rgba(55, 55, 54, 1) 0 %, rgba(76, 76, 76, 1) 100 %)",
    height: "100%",
    width: "100%",
    padding: pxToDp(48),
    paddingTop: Platform.OS === "ios" ? pxToDp(80) : pxToDp(48),
    // paddingBottom: 24,
    // flex:1
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor:'red'
  },
  topaic: {
    // backgroundColor: "#FFFFFFFF",
    // width: "80%",
    // height: pxToDp(890),
    // marginRight: 24,
    borderRadius: pxToDp(30),
    flex: 1,
    // marginRight: pxToDp(24)
  },
  topaicBtn: {
    backgroundColor: "#FFFFFFFF",
    width: pxToDp(180),
    alignItems: "flex-end",
    // height: 80,
    // margin: 20,
  },
  topaicText: {
    // width: 712,
    height: "100%",
    // paddingLeft: 24,
    paddingRight: pxToDp(32),
    // flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "#ffffff"
  },
  topaicCard: {
    width: pxToDp(380),
    height: "100%",
    borderRadius: pxToDp(30),
    backgroundColor: "#FFFFFFFF",
    alignItems: "center",
  },
  topaicWrite: {
    position: "absolute",
  },
  buttonGroup: {
    flexDirection: "row",
    // flex: 1
  },
  checkOptions: {
    width: pxToDp(56),
    height: pxToDp(56),
    borderRadius: pxToDp(26),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D4D4D4",
    marginRight: pxToDp(22),
    fontSize: pxToDp(32),
  },
  checkedOption: {
    width: pxToDp(56),
    height: pxToDp(56),
    borderRadius: pxToDp(26),
    backgroundColor: "#FA603B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: pxToDp(22),
    fontSize: pxToDp(32),
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseBagExercise);
