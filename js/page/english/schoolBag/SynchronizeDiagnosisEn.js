import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  DeviceEventEmitter,
  Dimensions,
  Platform,
} from "react-native";
import CircleCard from "../../../component/CircleCard";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import NavigationUtil from "../../../navigator/NavigationUtil";
import RenderHtml from "react-native-render-html";
import { connect } from "react-redux";
// import ViewControl from 'react-native-image-pan-zoom'
import AnswerStatisticsModal from "../../../component/AnswerStatisticsNoModal";
import { size_tool, pxToDp } from "../../../util/tools";
import EngTypes from "../../../res/data/EngTopaicType";
import Sound from "react-native-sound";
import { getEngPicWord, randomNum } from "../../../util/commonUtils";
import AudioComponent from "../../../component/AudioComponent";
import * as actionCreators from "../../../action/english/bag/index";
import HelpWordModal from "../../../component/english/HelpWordModal";
import EngLishCanvasDialog from "../../../component/EnglishCanvasDialog";
import UsbDataUtil from "../../../util/canvas/UsbDataUtil";
import { EngProcessingFunc } from "../../../util/diagnosis/pyramidhwr";
import { appStyle } from "../../../theme";
import _ from "lodash";
import { Toast, Radio } from "antd-mobile-rn";
import Header from "../../../component/Header";
import ArticleHelpModal from "../../../component/english/ArticleHelpModal";
import Audio from "../../../util/audio";
const zimu = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
let isUpload = true;
let url = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/";
let audio = undefined;
let diagnosisUtil = new EngProcessingFunc();
Sound.setCategory("Playback");

const log = console.log.bind(console);

class SynchronizeDiagnosisEn extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.usbUtil = new UsbDataUtil();
    this.isInExplain = false; //是否处于讲解阶段
    this.isSave = false;
    this.isNext = true;
    this.state = {
      topaicNum: 0,
      //题目列表，后期可能改动
      fromServeCharacterList: [],
      topaicIndex: 0,
      topicMap: new Map(),
      status: false,
      visible: false,
      diagnose_notes: "", // 诊断标记
      isKeyExercise: 1,
      lookDetailNum: 0,
      answer_start_time: "",
      answer_end_time: "",
      checkedIndex: -1,
      private_exercise_stem: -1, //子题干，为了回显时刷新View
      imgMCQAnswer: -1, //选项为字母卡图片的答案缓存
      playStatus: false, //是否正在播放语音
      knowledgeBody: undefined,
      wrongNum: 0, //错误的次数，如果错误次数大于1，则进入Next
      //题目统计结果
      blank: 0,
      correct: 0,
      wrong: 0,
      answerStatisticsModalVisible: false,
      isEnd: false,
      knowledgepoint_explanation: "", //知识讲解
      isImageHelp: false,
      isDialogVisible: false,
      ImgMCQCRaidoButtonChekckSatutsList: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      isRenderOptions: true,
      optionList: [],
      articleStatus: false,
      isStartAudio: false,
    };

    this.handlePlayAudioThrottled = _.throttle(this.playAudio, 3 * 1000);

    this.isHelpClick = false; //诊断标记点击关闭还是帮助
    // this.saveEnBagExerciseTimer = null
    this.successAudiopath = "excellent.m4a";
    this.successAudiopath1 = "fantastic.m4a";
    this.successAudiopath2 = "goodjob.m4a";
    this.successAudiopath3 = "great.m4a";
    this.successAudiopath4 = "perfect.m4a";
    this.failAudiopath = "tryagain.m4a";
    this.successMusicArr = [
      this.successAudiopath,
      this.successAudiopath1,
      this.successAudiopath2,
      this.successAudiopath3,
      this.successAudiopath4,
    ];
    this.handlenOnCloseHelpThrottled = _.throttle(
      this.onCloseHelpNow,
      3 * 1000
    );
    this.handelNextTopic = _.throttle(this.nextTopaic, 2 * 1000);

    this.audio = React.createRef();
  }
  componentDidMount() {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    console.log("this.props.navigation", this.props.navigation.state.params);
    let dataFromLast = this.props.navigation.state.params.data;
    if (dataFromLast.isTestMe) {
      axios
        .get(api.getEnglishTestMeExercise, {
          params: {
            origin: dataFromLast.origin,
            ladder: dataFromLast.ladder,
          },
        })
        .then((res) => {
          let list = res.data.data;
          let time = this.getTime();
          for (let i in list) {
            list[i].colorFlag = 0;
          }
          //console.log("题目", list)
          this.setState(() => ({
            fromServeCharacterList: [...list],
            topaicNum: list.length,
            exercise_set_id: list.length > 0 ? list[0].exercise_set_id : "",
            answer_start_time: time,
          }));
        });
    } else {
      const data = {
        origin: this.props.navigation.state.params.data.exercise_origin,
        // mode: this.props.navigation.state.params.data.mode === 3 ? 1 : this.props.navigation.state.params.data.mode,
        // kpg_type: this.props.navigation.state.params.data.kpg_type,
        knowledge_point_code: this.props.navigation.state.params.data.codeList,
        modular: this.props.navigation.state.params.data.mode, //1 my study 2 test me 3 泡泡
        sub_modular: this.props.navigation.state.params.data.kpg_type, // 1 单词短语  2 句子文章
      };
      // data.student_code = userInfoJs.id;
      if (this.props.navigation.state.params.data.articleCodeList) {
        data.article_knowledge_point_code =
          this.props.navigation.state.params.data.articleCodeList;
      }
      console.log("data", data);

      this.props.getTopaciData(data);
      if (
        this.props.navigation.state.params.data.mode == 1 ||
        this.props.navigation.state.params.data.mode == 3
      ) {
        axios.post(api.getEnglishKnowExerciseList, data).then((res) => {
          let list = res.data.data;
          let time = this.getTime();
          for (let i in list) {
            list[i].colorFlag = 0;
          }
          this.setState(() => ({
            fromServeCharacterList: [...list],
            topaicNum: list.length,
            exercise_set_id: list.length > 0 ? list[0].exercise_set_id : "",
            answer_start_time: time,
          }));
        });
      } else {
        axios.post(api.SynchronizeDiagnosisEn, data).then((res) => {
          let list = res.data.data;
          let time = this.getTime();
          for (let i in list) {
            list[i].colorFlag = 0;
          }
          //console.log("题目", list)
          this.setState(() => ({
            fromServeCharacterList: [...list],
            topaicNum: list.length,
            exercise_set_id: list.length > 0 ? list[0].exercise_set_id : "",
            answer_start_time: time,
          }));
        });
      }
    }

    //原生发来蓝牙数据
    DeviceEventEmitter.addListener("usbData", this.eventHandler);
  }

  componentDidUpdate() {
    console.log(
      "this.saveEnBagExerciseTimer",
      this.props.navigation.state.params.data
    );
    const map = this.getPyDataFromServe();
    const { topaicIndex, isDialogVisible } = this.state;
    const data = { ...map.get(topaicIndex) };
    if (
      data.exercise_type_public === EngTypes.FTB &&
      data.exercise_element === EngTypes.W &&
      !isDialogVisible
    ) {
      Toast.loading("进入手写题目", 1);
    }
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener("usbData", this.eventHandler);
    this.saveEnBagExerciseTimer && clearTimeout(this.saveEnBagExerciseTimer);
    this.closeDialog();
    this.closeAudio();
    if (
      this.props &&
      this.props.navigation &&
      this.props.navigation.state.params.data.isUpload
    ) {
      // NavigationUtil.goBack({ ...this.props, isGo: 'false' })
      this.props.navigation.state.params.data.updatalist();
    }
  }
  closeHelpAudio = () => {
    if (this.audioHelp) {
      this.audioHelp.stop();
      this.audioHelp = undefined;
      this.setState(() => ({
        isStartAudio: false,
      }));
    }
  };
  playHeplAudio = () => {
    const { isStartAudio, fromServeCharacterList, topaicIndex } = this.state;
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
      url + fromServeCharacterList[topaicIndex].explanation_audio,
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
  eventHandler = (message) => {
    if (this.isInExplain) {
      //如果处于讲解阶段，则不显示手写dialog和获取手写数据
      return;
    }

    const map = this.getPyDataFromServe();
    const { topaicIndex, isDialogVisible } = this.state;
    const data = { ...map.get(topaicIndex) };
    if (
      data.exercise_type_public === EngTypes.FTB &&
      data.exercise_element === EngTypes.W &&
      !isDialogVisible
    ) {
      this.showDialog();
    }
    this.usbUtil.initListXY(message);
    if (!this.canvas || !this.canvas.webview) return;
    this.canvas.sendUsbData(
      message.usbCanvasDataX,
      message.usbCanvasDataY,
      message.usbCanvasDataPressure
    );
  };

  onRef = (ref) => {
    this.canvas = ref;
  };

  goBack = () => {
    this.closeAudio();
    NavigationUtil.goBack({ ...this.props });
  };
  showDialog = () => {
    // console.log('showDialog')
    // this.isDialogVisible = true
    this.setState({ isDialogVisible: true });
  };

  closeDialog = () => {
    // this.isDialogVisible = false
    if (!this.state.isDialogVisible) return;
    this.clear();
    this.setState({ isDialogVisible: false });
  };

  destoryDialog = () => {
    // this.isDialogVisible = false
    this.setState({ isDestoryDialog: true, isDialogVisible: false });
  };

  clear = () => {
    //console.log('clear:::::::::::::::::::::::',this.canvas)
    // this.canvas.clear();
    this.usbUtil.clearListXY();
  };

  // 播放读音
  playAudio = () => {
    // const map = this.getPyDataFromServe();
    const { topaicIndex, playStatus } = this.state;
    // const data = { ...map.get(topaicIndex) };
    // if (!data) return
    // if (!data.private_stem_audio) return
    // let path = data.private_stem_audio
    // //console.log("播放语音地址",url+path);
    if (playStatus) {
      // Toast.loading('即将停止播放听力语音', 1)
      this.closeAudio();
      return;
    } else {
      console.log("click here...");
      this.audio.current.replay();
      this.setState(() => ({
        playStatus: true,
      }));
    }
    // audio = new Sound(url + path, null, (error) => {
    //     if (error) {
    //         // Alert.alert("播放失败");
    //         console.log('error', error)
    //         Toast.fail('音频加载失败', 1)
    //     } else {
    //         // Toast.loading('加载音频', 1, () => {
    //
    //         // })
    //         audio.play((success) => {
    //             // console.log('audio', success, url + path)
    //             if (success) {
    //                 audio.release()
    //                 this.closeAudio()
    //             } else {
    //                 Toast.fail('播放失败', 1)
    //             }
    //         });
    //         this.setState(() => ({
    //             playStatus: true
    //         }))
    //     }
    // });
  };

  //关闭语音播放
  closeAudio = () => {
    if (audio) {
      // console.log("关闭语音");
      audio.stop();
      this.setState(() => ({
        playStatus: false,
      }));
    }
  };

  //播放本地成功音频

  playSuccessAudio = new Promise((resolve, reject) => {
    resolve();
  });

  //播放本地失败音频
  playFaileAudio = new Promise((resolve, reject) => {
    resolve();
  });

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
    const { exercise_set_id, fromServeCharacterList } = this.state;
    const data = {};
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    data.exercise_set_id = exercise_set_id;
    data.student_code = this.props.userInfo.toJS().id;
    //console.log('getAnswerResult', data)
    this.props.navigation.state.params.data.isTestMe
      ? (data.ladder = this.props.navigation.state.params.data.ladder)
      : "";
    this.props.navigation.state.params.data.isTestMe
      ? (data.num = fromServeCharacterList.length)
      : "";
    // this.props.navigation.state.params.data.isTestMe ? data.correct_num = this.props.navigation.state.params.data.ladder : ''
    if (this.props.navigation.state.params.data.stu_origin) {
      data.stu_origin = this.props.navigation.state.params.data.stu_origin;
      data.class_info = userInfoJs.class_code;
    }

    this.props.navigation.state.params.data.isTestMe
      ? axios
          .put(api.saveTestmeAllExercise, data)
          .then((res) => {
            this.setState(() => ({
              wrong: res.data.data.wrong || 0,
              blank: res.data.data.blank || 0,
              correct: res.data.data.correct || 0,
              answerStatisticsModalVisible: true,
              isEnd: true,
            }));
          })
          .catch((e) => {
            //console.log(e)
          })
      : axios
          .put(api.saveMystudyExerciseAll, data)
          .then((res) => {
            // axios.post(api.enBagResult, data).then(res => {
            //
            //
            this.setState(() => ({
              wrong: res.data.data.wrong || 0,
              blank: res.data.data.blank || 0,
              correct: res.data.data.correct || 0,
              answerStatisticsModalVisible: true,
              isEnd: true,
            }));
          })
          .catch((e) => {
            //console.log(e)
          });
  };

  closeAnswerStatisticsModal = () => {
    this.setState({ answerStatisticsModalVisible: false });
    this.props.navigation.state.params.data.stu_origin &&
      DeviceEventEmitter.emit("backHome");
    NavigationUtil.goBack(this.props);
  };

  topaicContainerOnLayout = (e) => {
    let { width, height } = e.nativeEvent.layout;
    this.setState(() => ({
      canvasWidth: width,
      canvasHeight: height,
    }));
  };

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
  //选项为图片字母卡，进行回显
  checkAnswerImg = (data, dataOrigin, index) => {
    if (!dataOrigin || !data) return;

    let private_exercise_stem = dataOrigin;
    let checkList = [...this.state.ImgMCQCRaidoButtonChekckSatutsList].map(
      (item, i) => {
        if (i != index) {
          return false;
        }
        return item;
      }
    );
    // console.log('checkAnswerImg checkList', data)
    checkList[index] = !checkList[index];
    //单选情况下
    private_exercise_stem = private_exercise_stem.replaceAll(
      "_",
      getEngPicWord(data)
    );
    this.setState(() => ({
      private_exercise_stem,
      imgMCQAnswer: data,
      ImgMCQCRaidoButtonChekckSatutsList: [...checkList],
    }));
  };

  saveExerciseDetail = (yesOrNo, answer, isWrite = false) => {
    //console.log('saveExerciseDetail isWrite',isWrite)
    const { wrongNum } = this.state;
    if (!this.isNext) return;
    this.isNext = false;
    // 保存做题结果
    if (yesOrNo === 0) {
      this.playSuccessAudio
        .then(() => {
          let index = randomNum(0, 4);
          const successMusic = new Sound(
            this.successMusicArr[index],
            Sound.MAIN_BUNDLE,
            (error) => {
              if (error) {
                console.log("error", error);
                // Alert.alert("播放失败");
              } else {
                successMusic.play((success) => {
                  successMusic.release();
                });
              }
            }
          );
        })
        .then(() => {
          this.saveEnBagExerciseTimer = setTimeout(() => {
            this.saveEnBagExercise(yesOrNo, answer, isWrite);
          }, 100);
        });
    } else {
      log("play err audio.");
      this.playFaileAudio
        .then(() => {
          if (wrongNum + 1 < 2) {
            const failMusic = new Sound(
              this.failAudiopath,
              Sound.MAIN_BUNDLE,
              (error) => {
                if (error) {
                  // Alert.alert("播放失败");
                } else {
                  failMusic.play((success) => {
                    if (success) {
                      failMusic.release();
                    }
                  });
                }
              }
            );
          }
        })
        .then(() => {
          this.saveEnBagExerciseTimer = setTimeout(() => {
            this.helpMe();
            this.isSave = true;
          }, 50);
        });
    }
  };

  saveEnBagExercise = (yesOrNo, answer, isWrite) => {
    //console.log('saveEnBagExercise',isUpload)
    const { fromServeCharacterList, topaicIndex, wrongNum } = this.state;
    const { userInfo, textBookCode } = this.props;
    const userInfoJs = userInfo.toJS();

    if (isUpload) {
      isUpload = false;
      let data = {
        grade_code: userInfoJs.checkGrade,
        term_code: userInfoJs.checkTeam,
        textbook: textBookCode,
        student_code: userInfoJs.id,
        unit_code: this.props.navigation.state.params.data.unit_code,
        origin: this.props.navigation.state.params.data.exercise_origin,
        knowledge_point: fromServeCharacterList[topaicIndex].knowledge_point,
        exercise_id: fromServeCharacterList[topaicIndex].exercise_id,
        exercise_point_loc: isWrite ? answer : "",
        exercise_result: answer,
        exercise_set_id: fromServeCharacterList[topaicIndex].exercise_set_id,
        identification_results: "",
        is_modification: this.state.isKeyExercise,
        answer_start_time: this.state.answer_start_time, // 答题开始时间
        answer_end_time: this.getTime(), // 答题结束时间
        is_correction: "", // 是否批改
        correction_remarks: "", //批改备注信息
        correction: yesOrNo, //批改对错，0 正确 1错误
        record: "", //  批改记录
        is_help: this.state.lookDetailNum === 0 ? 1 : 0, //是都点击帮助0是，1是否
        tooltip_access_frequency: this.state.lookDetailNum, //点击帮助的次数
        tooltip_access_time: "", //点击帮助停留时间
        is_element_exercise: this.state.isKeyExercise, // 是否做错推送的要素题
        is_finish:
          topaicIndex + 1 == this.state.fromServeCharacterList.length ? 0 : 1, //整套题是否做完,0  做完，，1没做完
        kpg_type: this.props.navigation.state.params.data.kpg_type, //知识点类型1：单词短语2：句子
        modular: this.props.navigation.state.params.data.mode, //1 my study 2 test me 3 泡泡
        sub_modular: this.props.navigation.state.params.data.kpg_type, // 1 单词短语  2 句子文章
      };
      //console.log('saveExerciseDetail',data)
      this.props.navigation.state.params.data.isTestMe
        ? (data.ladder = this.props.navigation.state.params.data.ladder)
        : "";

      axios
        .post(
          this.props.navigation.state.params.data.isTestMe
            ? api.saveTestmeExercise
            : api.saveMystudyExercise,
          data
        )
        .then((res) => {
          isUpload = true;
          console.log("saveExerciseDetail res", res.data.data);
          if (res.data.err_code === 0) {
            if (yesOrNo === 0) {
              // 答对了 跳入下一道
              topaicIndex + 1 == this.state.fromServeCharacterList.length
                ? this.getAnswerResult()
                : this.setState(
                    {
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
                      private_exercise_stem: -1,
                      wrongNum: 0,
                      ImgMCQCRaidoButtonChekckSatutsList: [
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                      ],
                      isRenderOptions: true,
                    },
                    () => {
                      this.isNext = true;
                    }
                  );
              this.clear();
            } else {
              if (wrongNum + 1 < 2) {
                this.setState(
                  (preState) => ({
                    isKeyExercise: 0,
                    wrongNum: preState.wrongNum + 1,
                    checkedIndex: -1,
                    private_exercise_stem: -1,
                    ImgMCQCRaidoButtonChekckSatutsList: [
                      false,
                      false,
                      false,
                      false,
                      false,
                      false,
                      false,
                      false,
                      false,
                      false,
                    ],
                    isRenderOptions: true,
                  }),
                  () => {
                    this.isNext = true;
                  }
                );
                this.clear();
              } else {
                topaicIndex + 1 == this.state.fromServeCharacterList.length
                  ? this.getAnswerResult()
                  : this.setState(
                      {
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
                        private_exercise_stem: -1,
                        wrongNum: 0,
                        ImgMCQCRaidoButtonChekckSatutsList: [
                          false,
                          false,
                          false,
                          false,
                          false,
                          false,
                          false,
                          false,
                          false,
                          false,
                        ],
                        isRenderOptions: true,
                      },
                      () => {
                        this.isNext = true;
                      }
                    );
                this.clear();
              }
            }
            this.closeDialog();
          } else {
            Toast.fail(res.data.err_msg, 3);
          }
        });
    }
  };

  nextTopaic = () => {
    let index = this.state.checkedIndex;
    const { fromServeCharacterList, topaicIndex, imgMCQAnswer, optionList } =
      this.state;

    this.closeAudio();

    if (!fromServeCharacterList[topaicIndex]) return;
    log("0");
    if (
      fromServeCharacterList[topaicIndex].exercise_type_public ===
        EngTypes.FTB &&
      fromServeCharacterList[topaicIndex].exercise_element === EngTypes.W
    ) {
      //填空手写题
      log("1");
      this.getDataFromCanvas(this.usbUtil.toServeXY);
      this.usbUtil.clearListXY();
      return;
    }

    if (
      fromServeCharacterList[topaicIndex].exercise_type_public ===
        EngTypes.FTB &&
      fromServeCharacterList[topaicIndex].exercise_element === EngTypes.S
    ) {
      log("2");
      this.saveExerciseDetail(0, "Speaking");
      if (this.state.isKeyExercise === 1) {
        fromServeCharacterList[topaicIndex].colorFlag = 1;
      }
      return;
    }
    if (fromServeCharacterList[topaicIndex].choice_content_type === "image") {
      log("3");
      if (imgMCQAnswer === -1) {
        return;
      }
      if (imgMCQAnswer === fromServeCharacterList[topaicIndex].answer_content) {
        // 正确，当前题目为推送的要素题时不论对错都保存
        this.saveExerciseDetail(0, imgMCQAnswer.trim());
        if (this.state.isKeyExercise === 1) {
          fromServeCharacterList[topaicIndex].colorFlag = 1;
        }
      } else {
        if (this.state.isKeyExercise === 1) {
          fromServeCharacterList[topaicIndex].colorFlag = 2;
        }
        this.saveExerciseDetail(1, imgMCQAnswer.trim());
      }
    } else if (index === -1) {
      return;
    } else if (
      optionList[index].trim() ===
      fromServeCharacterList[topaicIndex].answer_content.trim()
    ) {
      log("4");
      // 正确，当前题目为推送的要素题时不论对错都保存
      this.saveExerciseDetail(0, optionList[index].trim());
      if (this.state.isKeyExercise === 1) {
        fromServeCharacterList[topaicIndex].colorFlag = 1;
      }
    } else {
      log("5");
      if (this.state.isKeyExercise === 1) {
        fromServeCharacterList[topaicIndex].colorFlag = 2;
      }
      this.saveExerciseDetail(1, optionList[index].trim());
    }
  };

  helpMe = (isHelp) => {
    // 点击查看帮助
    let { lookDetailNum, fromServeCharacterList, topaicIndex, isImageHelp } =
      this.state;
    // 点击查看帮助的两种途径
    if (isHelp) {
      // 从页面点击过来，不用做任何别的操作
      isImageHelp = true;
    } else {
      // 从诊断标记点击过来，需要改变参数
      isImageHelp = false;
      this.isHelpClick = true;
    }
    this.isInExplain = true;
    ++lookDetailNum;
    let data = {};
    data.origin = fromServeCharacterList[topaicIndex].origin;
    data.knowledge = fromServeCharacterList[topaicIndex].knowledge_point;
    data.knowledge_type =
      this.props.navigation.state.params.data.knowledge_type; //1.字母单元 2.非字母单元
    if (
      fromServeCharacterList[topaicIndex].knowledgepoint_type === "4" &&
      fromServeCharacterList[topaicIndex].exercise_type_public === "Dialogue"
    ) {
      this.setState(() => ({
        knowledgepoint_explanation:
          fromServeCharacterList[topaicIndex] &&
          fromServeCharacterList[topaicIndex].knowledgepoint_explanation != ""
            ? fromServeCharacterList[topaicIndex].knowledgepoint_explanation
            : " ",
        articleStatus: true,
        lookDetailNum,
        isImageHelp,
      }));
    } else {
      axios
        .get(api.SynchronizeDiagnosisEnKnowPoint, { params: data })
        .then((res) => {
          //console.log('helpMe SynchronizeDiagnosisEnKnowPoint',res)
          log("@@@ res: ", res);
          this.setState(() => ({
            knowledgepoint_explanation:
              fromServeCharacterList[topaicIndex] &&
              fromServeCharacterList[topaicIndex].knowledgepoint_explanation !=
                ""
                ? fromServeCharacterList[topaicIndex].knowledgepoint_explanation
                : " ",
            status: true,
            lookDetailNum,
            isImageHelp,
            knowledgeBody: { ...res.data.data },
          }));
        });
    }
  };

  onCloseHelp = () => {
    this.isInExplain = false;
    const { fromServeCharacterList, topaicIndex, imgMCQAnswer, optionList } =
      this.state;

    console.log(
      "this.state.optionList",
      this.state.optionList,
      this.state.checkedIndex
    );
    this.isSave
      ? this.saveEnBagExercise(
          1,
          fromServeCharacterList[topaicIndex].choice_content_type === "image"
            ? imgMCQAnswer
            : optionList[this.state.checkedIndex].trim(),
          false
        )
      : "";
    this.isSave = false;
    this.setState({
      status: false,
    });
  };
  onCloseHelpNow = () => {
    this.isInExplain = false;
    const { fromServeCharacterList, topaicIndex, imgMCQAnswer, optionList } =
      this.state;

    this.isSave
      ? this.saveEnBagExercise(
          1,
          fromServeCharacterList[topaicIndex].choice_content_type === "image"
            ? imgMCQAnswer
            : optionList[this.state.checkedIndex].trim(),
          false
        )
      : "";
    this.isSave = false;
    this.closeHelpAudio();
    this.setState({
      articleStatus: false,
    });
  };

  //获取canvas手写数据
  getDataFromCanvas = (canvasData) => {
    // console.log('getDataFromCanvas canvasData::::::::::', canvasData)
    const { fromServeCharacterList, topaicIndex } = this.state;
    // console.log('this.props.navigation.state.params.data.knowledge_type::::::::::', this.props.navigation.state.params.data.knowledge_type)
    if (!canvasData) {
      return;
    }
    if (canvasData.length === 0) {
      //对于不诊断的题目，若是没有作答则判定为作答错误

      return;
    }
    let answerArr = "";
    if (this.props.navigation.state.params.data.knowledge_type == 1) {
      answerArr = diagnosisUtil.SingleLetterStrokeOder(canvasData);
      // console.log('answerArr', answerArr)
      if (
        this.judgeAnswerContentType1(
          fromServeCharacterList[topaicIndex].answer_content
        )
      ) {
        if (
          answerArr[0].toLocaleLowerCase() ===
            fromServeCharacterList[
              topaicIndex
            ].answer_content.toLocaleLowerCase() &&
          answerArr[1] === 1
        ) {
          //字母与正确答案一致，并且字母笔顺正确
          this.saveExerciseDetail(0, canvasData, true);
          fromServeCharacterList[topaicIndex].colorFlag = 1;
        } else {
          this.saveExerciseDetail(1, canvasData, true);
          fromServeCharacterList[topaicIndex].colorFlag = 2;
        }
      } else {
        if (
          answerArr[0] === fromServeCharacterList[topaicIndex].answer_content &&
          answerArr[1] === 1
        ) {
          //字母与正确答案一致，并且字母笔顺正确
          this.saveExerciseDetail(0, canvasData, true);
          fromServeCharacterList[topaicIndex].colorFlag = 1;
        } else {
          this.saveExerciseDetail(1, canvasData, true);
          fromServeCharacterList[topaicIndex].colorFlag = 2;
        }
      }
    } else if (this.props.navigation.state.params.data.knowledge_type == 2) {
      //console.log('getDataFromCanvas::::::::',diagnosisUtil.DisorderMultiLetterJudge(canvasData))
      if (
        this.judgeAnswerContent(
          fromServeCharacterList[topaicIndex].answer_content
        )
      ) {
        answerArr = diagnosisUtil.DisorderMultiLetterJudge(canvasData);
        let answerContentArr =
          fromServeCharacterList[topaicIndex].answer_content.split(",");
        // console.log('getDataFromCanvas1111111::::::::',answerArr.join('').toLocaleLowerCase())
        // console.log('getDataFromCanvas2222222::::::::',answerContentArr.join('').toLocaleLowerCase())
        if (
          answerArr.join("").toLocaleLowerCase() ===
          answerContentArr.join("").toLocaleLowerCase()
        ) {
          this.saveExerciseDetail(0, canvasData, true);
          fromServeCharacterList[topaicIndex].colorFlag = 1;
        } else {
          this.saveExerciseDetail(1, canvasData, true);
          fromServeCharacterList[topaicIndex].colorFlag = 2;
        }
      } else {
        answerArr = diagnosisUtil.DisorderMultiLetterJudge(canvasData);
        // console.log('getDataFromCanvas33333333::::::::', answerArr)
        let answerContentArr =
          fromServeCharacterList[topaicIndex].answer_content.split(",");
        if (answerArr.join("") === answerContentArr.join("")) {
          this.saveExerciseDetail(0, canvasData, true);
          fromServeCharacterList[topaicIndex].colorFlag = 1;
        } else {
          this.saveExerciseDetail(1, canvasData, true);
          fromServeCharacterList[topaicIndex].colorFlag = 2;
        }
      }
    }
  };

  judgeAnswerContent = (data) => {
    //console.log('judgeAnswerContent data',data)
    //console.log('judgeAnswerContent dataLength',data.length)
    if (data.length == 1) {
      //console.log('judgeAnswerContent toLocaleLowerCase',data.toLocaleLowerCase())
      if (
        data.toLocaleLowerCase() == "c" ||
        data.toLocaleLowerCase() == "o" ||
        data.toLocaleLowerCase() == "k" ||
        data.toLocaleLowerCase() == "p" ||
        data.toLocaleLowerCase() == "s" ||
        data.toLocaleLowerCase() == "x" ||
        data.toLocaleLowerCase() == "v" ||
        data.toLocaleLowerCase() == "u" ||
        data.toLocaleLowerCase() == "w" ||
        data.toLocaleLowerCase() == "z"
      ) {
        //console.log('judgeAnswerContent true')
        return true;
      }
      return false;
    }
    return false;
  };

  judgeAnswerContentType1 = (data) => {
    if (data.length == 1) {
      //console.log('judgeAnswerContent toLocaleLowerCase',data.toLocaleLowerCase())
      if (
        data.toLocaleLowerCase() == "c" ||
        data.toLocaleLowerCase() == "o" ||
        data.toLocaleLowerCase() == "s" ||
        data.toLocaleLowerCase() == "z"
      ) {
        //console.log('judgeAnswerContent true')
        return true;
      }
      return false;
    }
    return false;
  };
  renderTopaicCard = (topaicNum) => {
    let cardList = new Array();
    const { topaicIndex, fromServeCharacterList } = this.state;
    //console.log('renderTopaicCard',fromServeCharacterList)
    for (let i = 0; i < fromServeCharacterList.length; i++) {
      cardList.push(
        <CircleCard
          key={i}
          text={i - 0 + 1}
          className={"oldCheck"}
          colorFlag={fromServeCharacterList[i].colorFlag}
        />
      );
    }
    return cardList;
  };

  renderMCQType = (data) => {
    log("renderMCQType: ", data.exercise_element);
    switch (data.exercise_element) {
      case EngTypes.L:
        return this.renderROrLType(data);
      case EngTypes.R:
        return this.renderROrLType(data);
      case EngTypes.S:
        return this.renderSType(data);
      case EngTypes.W:
        return this.renderROrLType(data);
    }
  };

  renderFTBType = (data) => {
    log("FTB,  data.exercise_element: ", data.exercise_element);
    switch (data.exercise_element) {
      case EngTypes.L:
        return this.renderROrLType(data);
      case EngTypes.R:
        return this.renderROrLType(data);
      case EngTypes.S:
        return this.renderSType(data);
      case EngTypes.W:
        return this.renderFTBWType(data);
    }
  };

  renderROrLType = (data) => {
    if (data.choice_content_type === "image") {
      return this.renderImgMCQ(data);
    }
    return this.renderCommonMCQ(data);
  };

  renderOptions = (content) => {
    let arr = content.split("#");
    let randomNumber = function () {
      return 0.5 - Math.random();
    };
    arr.sort(randomNumber);

    return arr;
  };

  //选项为图片的选择题
  renderImgMCQ = (data) => {
    let baseUrl =
      "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
      data.private_stem_picture;
    const {
      private_exercise_stem,
      fromServeCharacterList,
      topaicIndex,
      isRenderOptions,
      optionList,
    } = this.state;
    if (private_exercise_stem && private_exercise_stem != -1) {
      data.private_exercise_stem = private_exercise_stem;
    }
    //   data.private_exercise_stem=data.private_exercise_stem.replaceAll('\/x-large','24px')
    data.private_exercise_stem = data.private_exercise_stem.replaceAll(
      "xx-large",
      "48px"
    );
    let optionListnow = [...optionList];
    if (isRenderOptions) {
      let optionListnow = data.choice_content
        ? this.renderOptions(data.choice_content)
        : [];
      this.setState({
        optionList: optionListnow,
        isRenderOptions: false,
      });
    }
    return (
      <View style={{ height: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#FFFFFF",
            flex: 1,
            borderRadius: pxToDp(32),
          }}
        >
          <View style={{ padding: pxToDp(40), borderRadius: pxToDp(32) }}>
            <View style={{ width: "100%" }}>
              <RenderHtml
                source={{
                  html:
                    fromServeCharacterList[topaicIndex] &&
                    fromServeCharacterList[topaicIndex]?.public_exercise_stem
                      ? fromServeCharacterList[topaicIndex].public_exercise_stem
                      : " ",
                }}
                tagsStyles={{
                  p: { fontSize: 24 },
                  div: { fontSize: 24 },
                  span: { fontSize: 24 },
                }}
              />
              <View style={{ flexDirection: "row" }}>
                {data.private_stem_audio ? (
                  <TouchableOpacity
                    style={{
                      marginTop: pxToDp(8),
                      marginRight: pxToDp(20),
                    }}
                    onPress={() => {
                      this.handlePlayAudioThrottled();
                    }}
                  >
                    {this.state.playStatus ? (
                      <Image
                        style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                        source={require("../../../images/playing_icon.png")}
                      ></Image>
                    ) : (
                      <Image
                        style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                        source={require("../../../images/play_icon.png")}
                      ></Image>
                    )}
                    <Audio
                      uri={`${url}${data.private_stem_audio}`}
                      paused={!this.state.playStatus}
                      pausedEvent={this.audioPausedPrivate}
                      ref={this.audio}
                    />
                  </TouchableOpacity>
                ) : null}
                <RenderHtml
                  source={{
                    html: data.private_exercise_stem
                      ? data.private_exercise_stem
                      : "",
                  }}
                  tagsStyles={{
                    p: { fontSize: 24 },
                    div: { fontSize: 24 },
                    span: { fontSize: 24 },
                  }}
                />
              </View>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              {data.choice_content
                ? optionListnow.map((item, index) => {
                    if (data.choice_content_type === "image") {
                      return (
                        <View style={{ flexDirection: "row" }}>
                          <Radio
                            checked={
                              this.state.ImgMCQCRaidoButtonChekckSatutsList[
                                index
                              ]
                            }
                            style={{
                              borderWidth: 0,
                              borderColor: "#FC6161",
                              width: 15,
                              height: 15,
                              marginRight: pxToDp(5),
                            }}
                          ></Radio>
                          <TouchableOpacity
                            onPress={() =>
                              this.checkAnswerImg(
                                item,
                                fromServeCharacterList[topaicIndex]
                                  .private_exercise_stem,
                                index
                              )
                            }
                            key={index}
                          >
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                marginRight: 20,
                                marginTop: 10,
                                alignItems: "center",
                              }}
                            >
                              <Image
                                style={{
                                  width: pxToDp(200),
                                  height: pxToDp(200),
                                  marginRight: pxToDp(20),
                                  resizeMode: "contain",
                                }}
                                source={{
                                  uri:
                                    "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
                                    item,
                                }}
                              ></Image>
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    }
                  })
                : null}
            </View>
          </View>

          <TouchableOpacity
            onPress={this.helpMe}
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
          {data.private_stem_picture ? null : this.renderButton()}
        </View>
        {data.private_stem_picture ? (
          <View
            style={{
              backgroundColor: "#fff",
              height: pxToDp(360),
              borderRadius: pxToDp(32),
              marginTop: pxToDp(30),
            }}
          >
            <Image
              style={{
                width: pxToDp(300),
                height: pxToDp(300),
                resizeMode: "contain",
                marginLeft: pxToDp(32),
              }}
              source={{ uri: baseUrl }}
            ></Image>
            {this.renderButton()}
          </View>
        ) : null}
      </View>
    );
  };

  renderCommonMCQ = (data) => {
    let baseUrl =
      "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
      data.private_stem_picture;
    const { fromServeCharacterList, topaicIndex, isRenderOptions, optionList } =
      this.state;
    let optionListnow = [...optionList];
    if (isRenderOptions) {
      let optionListnow = data.choice_content
        ? this.renderOptions(data.choice_content)
        : [];
      this.setState({
        optionList: optionListnow,
        isRenderOptions: false,
      });
    }
    log("data.private_stem_picture111: ", data.private_stem_picture);
    log("data.private_stem_audio: ", data.private_stem_audio);
    return (
      <View style={{ height: "100%" }}>
        <View
          style={[
            {
              flexDirection: "row",
              paddingLeft: pxToDp(24),
              borderRadius: 15,
              backgroundColor: "white",
              flex: 1,
            },
          ]}
        >
          <View style={{ padding: pxToDp(30) }}>
            <ScrollView>
              <View style={{ paddingRight: pxToDp(40) }}>
                <RenderHtml
                  source={{
                    html:
                      fromServeCharacterList[topaicIndex] &&
                      fromServeCharacterList[topaicIndex]?.public_exercise_stem
                        ? fromServeCharacterList[topaicIndex]
                            .public_exercise_stem
                        : " ",
                  }}
                  tagsStyles={{
                    p: { fontSize: 24 },
                    div: { fontSize: 24 },
                    span: { fontSize: 24 },
                  }}
                />
                {fromServeCharacterList[topaicIndex] &&
                fromServeCharacterList[topaicIndex].public_stem_picture ? (
                  <View
                    style={{
                      borderRadius: 15,
                      width: 200,
                      height: 150,
                      backgroundColor: "#FFFFFF",
                      marginRight: pxToDp(12),
                    }}
                  >
                    <Image
                      style={{
                        width: 200,
                        height: 150,
                        resizeMode: "contain",
                        borderRadius: 15,
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
              fromServeCharacterList[topaicIndex]?.public_exercise_stem ? (
                <View style={{ height: pxToDp(48), width: pxToDp(48) }}></View>
              ) : null}
              <View style={{ flexDirection: "row" }}>
                {data.private_stem_audio ? (
                  <TouchableOpacity
                    style={{ marginRight: pxToDp(20) }}
                    onPress={() => {
                      this.handlePlayAudioThrottled();
                    }}
                  >
                    {this.state.playStatus ? (
                      <Image
                        style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                        source={require("../../../images/playing_icon.png")}
                      ></Image>
                    ) : (
                      <Image
                        style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                        source={require("../../../images/play_icon.png")}
                      ></Image>
                    )}
                    <Audio
                      uri={`${url}${data.private_stem_audio}`}
                      paused={!this.state.playStatus}
                      pausedEvent={this.audioPausedPrivate}
                      ref={this.audio}
                    />
                  </TouchableOpacity>
                ) : null}
                <RenderHtml
                  source={{
                    html: data.private_exercise_stem
                      ? data.private_exercise_stem
                      : "",
                  }}
                  tagsStyles={{
                    p: { fontSize: 24 },
                    div: { fontSize: 24 },
                    span: { fontSize: 24 },
                  }}
                />
              </View>
            </ScrollView>
          </View>
          <TouchableOpacity
            onPress={this.helpMe}
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
          <View
            style={{
              flexDirection: "row",
              marginTop: Dimensions.get("window").height * 0.02,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 15,
                width: Dimensions.get("window").width * 0.25,
                height: Dimensions.get("window").height * 0.33,
                backgroundColor: "white",
              }}
            >
              <Image
                style={{
                  width: Dimensions.get("window").width * 0.2,
                  height: Dimensions.get("window").height * 0.3,
                  resizeMode: "contain",
                  borderRadius: 15,
                }}
                source={{ uri: baseUrl }}
              ></Image>
            </View>
            <View
              style={{
                backgroundColor: "#fff",
                width: Dimensions.get("window").width * 0.5,
                borderRadius: 15,
                paddingLeft: pxToDp(24),
                paddingTop: pxToDp(24),
                marginLeft: "auto",
              }}
            >
              {data.choice_content ? (
                optionListnow.map((item, index) => {
                  if (data.choice_content_type === "image") {
                    return (
                      <TouchableOpacity
                        onPress={() => this.checkAnswer(index)}
                        key={index}
                      >
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
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
                                fontSize: pxToDp(32),
                              }}
                            >
                              {zimu[index]}
                            </Text>
                          </View>
                          <Image
                            style={{
                              width: pxToDp(350),
                              height: pxToDp(350),
                              marginLeft: 20,
                              marginBottom: pxToDp(12),
                              resizeMode: "contain",
                            }}
                            source={{
                              uri:
                                "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
                                item,
                            }}
                          ></Image>
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
                            flexWrap: "wrap",
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
                                fontSize: pxToDp(32),
                              }}
                            >
                              {zimu[index]}
                            </Text>
                          </View>
                          <Text style={{ marginRight: 10, fontSize: 24 }}>
                            {item}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }
                })
              ) : (
                <View></View>
              )}
              {this.renderButton()}
            </View>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              marginTop: Dimensions.get("window").height * 0.02,
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                width: "100%",
                borderRadius: 15,
                paddingLeft: pxToDp(24),
                paddingTop: pxToDp(24),
                height: Dimensions.get("window").height * 0.33,
              }}
            >
              {data.choice_content ? (
                optionListnow.map((item, index) => {
                  if (data.choice_content_type === "image") {
                    return (
                      <TouchableOpacity
                        onPress={() => this.checkAnswer(index)}
                        key={index}
                      >
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
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
                                fontSize: pxToDp(32),
                              }}
                            >
                              {zimu[index]}
                            </Text>
                          </View>
                          <Image
                            style={{
                              width: pxToDp(350),
                              height: pxToDp(300),
                              marginLeft: 20,
                              marginBottom: pxToDp(12),
                              resizeMode: "contain",
                            }}
                            source={{
                              uri:
                                "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
                                item,
                            }}
                          ></Image>
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
                            flexWrap: "wrap",
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
                                fontSize: pxToDp(32),
                              }}
                            >
                              {zimu[index]}
                            </Text>
                          </View>
                          <Text style={{ marginRight: 10, fontSize: 24 }}>
                            {item}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }
                })
              ) : (
                <View></View>
              )}
              {this.renderButton()}
            </View>
          </View>
        )}
      </View>
    );
  };

  renderSType = (data) => {
    console.log("!!!!!!!!!! debug FTB S !!!!!!");
    let baseUrl =
      "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
      data.private_stem_picture;
    const { fromServeCharacterList, topaicIndex } = this.state;
    return (
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 15,
          padding: 24,
          height: "100%",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <RenderHtml
            source={{
              html:
                fromServeCharacterList[topaicIndex] &&
                fromServeCharacterList[topaicIndex]?.public_exercise_stem
                  ? fromServeCharacterList[topaicIndex].public_exercise_stem
                  : " ",
            }}
            tagsStyles={{
              p: { fontSize: 24 },
              div: { fontSize: 24 },
              span: { fontSize: 24 },
            }}
          />
          <View style={{ flexDirection: "row" }}>
            {data.private_stem_audio ? (
              <TouchableOpacity
                style={{ marginTop: pxToDp(8), marginRight: pxToDp(20) }}
                onPress={() => {
                  this.handlePlayAudioThrottled();
                }}
              >
                {this.state.playStatus ? (
                  <Image
                    style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                    source={require("../../../images/playing_icon.png")}
                  ></Image>
                ) : (
                  <Image
                    style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                    source={require("../../../images/play_icon.png")}
                  ></Image>
                )}
                <Audio
                  uri={`${url}${data.private_stem_audio}`}
                  paused={!this.state.playStatus}
                  pausedEvent={this.audioPausedPrivate}
                  ref={this.audio}
                />
              </TouchableOpacity>
            ) : null}
            <RenderHtml
              source={{
                html: data.private_exercise_stem
                  ? data.private_exercise_stem
                  : "",
              }}
              tagsStyles={{
                p: { fontSize: 24 },
                div: { fontSize: 24 },
                span: { fontSize: 24 },
              }}
            />
          </View>
          <TouchableOpacity
            onPress={this.helpMe}
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
          <Image
            style={{
              marginTop: pxToDp(48),
              width: pxToDp(450),
              height: pxToDp(375),
              resizeMode: "contain",
            }}
            source={{ uri: baseUrl }}
          ></Image>
        ) : (
          <Text></Text>
        )}
        <AudioComponent></AudioComponent>
        {this.renderButton()}
      </View>
    );
  };

  renderWType = (data) => {
    return this.renderCommonMCQ(data);
  };

  audioPausedPrivate = () => {
    this.setState({
      playStatus: false,
    });
  };

  renderFTBWType = (data) => {
    let baseUrl =
      "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
      data.private_stem_picture;
    const { private_exercise_stem, fromServeCharacterList, topaicIndex } =
      this.state;
    return (
      <View
        style={{
          backgroundColor: "#FFFFFFFF",
          borderRadius: 15,
          padding: 24,
          height: pxToDp(865),
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <RenderHtml
            source={{
              html:
                fromServeCharacterList[topaicIndex] &&
                fromServeCharacterList[topaicIndex]?.public_exercise_stem
                  ? fromServeCharacterList[topaicIndex].public_exercise_stem
                  : " ",
            }}
            tagsStyles={{
              p: { fontSize: 24 },
              div: { fontSize: 24 },
              span: { fontSize: 24 },
            }}
          />
          {/* <Text>{data.small_question_number}</Text> */}
          <View style={{ flexDirection: "row" }}>
            {data.private_stem_audio ? (
              <TouchableOpacity
                style={{ marginTop: pxToDp(8), marginRight: pxToDp(20) }}
                onPress={() => {
                  this.handlePlayAudioThrottled();
                }}
              >
                {this.state.playStatus ? (
                  <Image
                    style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                    source={require("../../../images/playing_icon.png")}
                  ></Image>
                ) : (
                  <Image
                    style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                    source={require("../../../images/play_icon.png")}
                  ></Image>
                )}
                <Audio
                  uri={`${url}${data.private_stem_audio}`}
                  paused={!this.state.playStatus}
                  pausedEvent={this.audioPausedPrivate}
                  ref={this.audio}
                />
              </TouchableOpacity>
            ) : null}
            <RenderHtml
              source={{
                html: data.private_exercise_stem
                  ? data.private_exercise_stem
                  : "",
              }}
              tagsStyles={{
                p: { fontSize: 24 },
                div: { fontSize: 24 },
                span: { fontSize: 24 },
              }}
            />
          </View>

          <TouchableOpacity
            onPress={this.helpMe}
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
          <Image
            style={{
              marginTop: pxToDp(48),
              width: 300,
              height: 250,
              marginLeft: 20,
              resizeMode: "contain",
            }}
            source={{ uri: baseUrl }}
          ></Image>
        ) : (
          <Text></Text>
        )}
        {this.renderButton()}
      </View>
    );
  };

  renderWriteTopaic = () => {
    const map = this.getPyDataFromServe();
    const { topaicIndex } = this.state;
    const data = { ...map.get(topaicIndex) };
    if (!data.exercise_id) {
      return (
        <Text
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 15,
            textAlign: "center",
            fontSize: pxToDp(32),
          }}
        >
          数据加载中...
        </Text>
      );
    } else {
      switch (data.exercise_type_public) {
        case EngTypes.MCQ:
          return this.renderMCQType(data);
        case EngTypes.FTB:
          return this.renderFTBType(data);
        case EngTypes.Dialogue:
          return this.renderMCQType(data);
        default:
          break;
      }
    }
  };

  renderButton = () => {
    const { isEnd, fromServeCharacterList, topaicIndex } = this.state;
    if (isEnd) {
      return (
        <TouchableOpacity
          style={styles.topaicBtn}
          ref="topaicBox"
          onLayout={(event) => this.topaicContainerOnLayout(event)}
          onPress={this.goBack}
        >
          <View
            style={{
              width: 90,
              height: 40,
              borderRadius: 50,
              backgroundColor: "#38B3FF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: pxToDp(30) }}>Done</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      if (!fromServeCharacterList[topaicIndex]) {
        return (
          <TouchableOpacity
            style={[
              styles.topaicBtn,
              {
                width: 90,
                height: 40,
                borderRadius: 50,
                backgroundColor: "#38B3FF",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
            ref="topaicBox"
            onLayout={(event) => this.topaicContainerOnLayout(event)}
            onPress={this.handelNextTopic}
          >
            <View>
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: pxToDp(30),
                }}
              >
                Next
              </Text>
            </View>
          </TouchableOpacity>
        );
      } else if (
        fromServeCharacterList[topaicIndex].exercise_type_public ===
          EngTypes.FTB &&
        fromServeCharacterList[topaicIndex].exercise_element === EngTypes.W
      ) {
        return null;
      } else {
        return (
          <TouchableOpacity
            style={[
              styles.topaicBtn,
              {
                width: 90,
                height: 40,
                borderRadius: 50,
                backgroundColor: "#38B3FF",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
            ref="topaicBox"
            onLayout={(event) => this.topaicContainerOnLayout(event)}
            onPress={this.handelNextTopic}
          >
            <View>
              <Text style={{ color: "#ffffff", fontSize: pxToDp(30) }}>
                Next
              </Text>
            </View>
          </TouchableOpacity>
        );
      }
    }
  };

  render() {
    const {
      topaicNum,
      fromServeCharacterList,
      topaicIndex,
      knowledgeBody,
      playStatus,
    } = this.state;
    console.log("timutimu", fromServeCharacterList[topaicIndex]);
    return (
      <View style={styles.mainWrap}>
        <View>
          <Header
            text={this.props.navigation.state.params.data.unit_name}
            txtStyle={{ fontWeight: "bold" }}
            goBack={() => {
              this.goBack();
            }}
          ></Header>
        </View>
        <View style={styles.container}>
          <View
            style={styles.topaic}
            ref="topaicBox"
            onLayout={(event) => this.topaicContainerOnLayout(event)}
          >
            <View style={{ flex: 1 }}>{this.renderWriteTopaic()}</View>
          </View>
          <View style={styles.topaicCard}>
            <ScrollView>
              <View
                style={{ flexDirection: "row", flexWrap: "wrap", padding: 24 }}
              >
                {this.renderTopaicCard(topaicNum)}
              </View>
            </ScrollView>
            <Text
              style={{
                color: "#666666",
                height: 30,
                fontSize: 21,
                marginBottom: 50,
              }}
            >
              答题卡{topaicIndex + 1}/{topaicNum}
            </Text>
          </View>
        </View>
        <HelpWordModal
          closeModal={this.onCloseHelp}
          visible={this.state.status}
          currentTopaicData={fromServeCharacterList[topaicIndex]}
          knowledgeBody={knowledgeBody}
          kygType={fromServeCharacterList[topaicIndex]?.knowledgepoint_type}
          unitName={this.props.navigation.state.params.data.unit_name}
        ></HelpWordModal>
        <AnswerStatisticsModal
          dialogVisible={this.state.answerStatisticsModalVisible}
          yesNumber={this.state.correct}
          noNumber={this.state.wrong}
          waitNumber={this.state.blank}
          closeDialog={this.closeAnswerStatisticsModal}
        ></AnswerStatisticsModal>
        <EngLishCanvasDialog
          _dialogVisible={this.state.isDialogVisible}
          onBack={this.goBack}
          closeDialog={this.closeDialog}
          destoryDialog={this.destoryDialog}
          _dialogRightBtnAction={this.clear}
          _dialogLeftBtnAction={this.handelNextTopic}
        ></EngLishCanvasDialog>
        <ArticleHelpModal
          status={this.state.articleStatus}
          goback={this.handlenOnCloseHelpThrottled}
          audio={fromServeCharacterList[topaicIndex]?.explanation_audio}
          knowledgepoint_explanation={
            fromServeCharacterList[topaicIndex]?.knowledgepoint_explanation
          }
        />
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
    // padding: pxToDp(60),
    padding: pxToDp(50),
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
  topaic: {
    width: "80%",
    height: "100%",
    borderRadius: 15,
  },
  topaicBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: "20%",
    alignItems: "flex-end",
  },
  topaicText: {},
  topaicCard: {
    width: pxToDp(360),
    marginLeft: "auto",
    borderRadius: 15,
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
    marginRight: 23,
    fontSize: pxToDp(32),
  },
  checkedOption: {
    width: pxToDp(56),
    height: pxToDp(56),
    borderRadius: pxToDp(26),
    backgroundColor: "#FA603B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 23,
    fontSize: pxToDp(32),
  },
});

const mapStateToProps = (state) => {
  return {
    fromServeCharacterList: state.getIn([
      "bagEnglish",
      "fromServeCharacterList",
    ]),
    currentTopaicData: state.getIn(["bagEnglish", "currentTopaicData"]),
    topaicNum: state.getIn(["bagEnglish", "topaicNum"]),
    topaicIndex: state.getIn(["bagEnglish", "topaicIndex"]),
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    textBookCode: state.getIn(["bagEnglish", "textBookCode"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    getTopaciData(data) {
      // dispatch(actionCreators.getTopaic(data));
    },
    changeCurrentTopaic(changeTopaicData) {
      if (!changeTopaicData) throw new TypeError("题目上限");
      //console.log('changeTopaicData', changeTopaicData)
      dispatch(actionCreators.changeCurrentTopaic(changeTopaicData));
    },
    changeTopaicIndex(index) {
      dispatch(actionCreators.changeTopaicIndex(index));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispathToProps
)(SynchronizeDiagnosisEn);
