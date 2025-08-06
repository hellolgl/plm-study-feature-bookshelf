import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  DeviceEventEmitter,
  Alert,
} from "react-native";
import CircleCard from "../../../component/CircleCard";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import NavigationUtil from "../../../navigator/NavigationUtil";
import RenderHtml from "react-native-render-html";
import { connect } from "react-redux";
// import ViewControl from "react-native-image-pan-zoom";
import AnswerStatisticsModal from "../../../component/AnswerStatisticsModal";
import {
  margin_tool,
  size_tool,
  pxToDp,
  borderRadius_tool,
  padding_tool,
} from "../../../util/tools";
import EngTypes from "../../../res/data/EngTopaicType";
import Sound from "react-native-sound";
import { getEngPicWord, randomNum } from "../../../util/commonUtils";
import AudioComponent from "../../../component/AudioComponent";
import * as actionCreators from "../../../action/english/bag/index";
import HelpWordModal from "../../../component/english/HelpWordModal";
import EngLishCanvasDialog from "../../../component/EnglishCanvasDialog";
import UsbDataUtil from "../../../util/canvas/UsbDataUtil";
import Canvas from "../../../util/canvas/EnglishCanvas";
import { EngProcessingFunc } from "../../../util/diagnosis/pyramidhwr";
import _ from "lodash";
import { Toast, Radio } from "antd-mobile-rn";
import { appStyle } from '../../../theme'
import Audio from '../../../util/audio'
const zimu = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
let isUpload = true;
let url = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/";
// let audio = undefined;
let diagnosisUtil = new EngProcessingFunc();
Sound.setCategory("Playback");
class EnglishDeskCanvas extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.usbUtil = new UsbDataUtil();
    (this.isInExplain = false), //是否处于讲解阶段
      (this.state = {
        topaicNum: 0,
        //题目列表，后期可能改动
        fromServeCharacterList: [],
        isEnd: false,
        topaicIndex: 0,
        topicMap: new Map(),
        status: false,
        visible: false,
        diagnose_notes: "", // 诊断标记
        isKeyExercise: 1,//判断是否为要素题,0:是 1:否
        lookDetailNum: 0,
        answer_start_time: "",
        answer_end_time: "",
        checkedIndex: -1,
        private_exercise_stem: -1, //子题干，为了回显时刷新View
        imgMCQAnswer: -1, //选项为字母卡图片的答案缓存
        playStatus: false, //是否正在播放语音
        knowledgeBody: undefined,
        wrongNum: 0, //错误的次数，如果错误次数大于1，则进入下一题
        //题目统计结果
        blank: 0,
        correct: 0,
        wrong: 0,
        answerStatisticsModalVisible: false,
        knowledgepoint_explanation: "", //知识讲解
        isImageHelp: false,
        haveAudio: false,
        isDialogVisible: false,
        audioPausedPrivate: false,
        ImgMCQCRaidoButtonChekckSatutsList: [false, false, false, false, false, false, false, false, false, false,]
      });
    this.handlePlayAudioThrottled = _.throttle(this.playAudio, 3 * 1000);
    // this.saveEnBagExerciseTimer = null
    this.isHelpClick = false; //诊断标记点击关闭还是帮助
    this.successAudiopath = "excellent.m4a";
    this.successAudiopath1 = "fantastic.m4a";
    this.successAudiopath2 = "goodjob.m4a";
    this.successAudiopath3 = "great.m4a";
    this.successAudiopath4 = "perfect.m4a";
    this.failAudiopath = "tryagain.m4a";
    this.successMusicArr = [this.successAudiopath, this.successAudiopath1, this.successAudiopath2, this.successAudiopath3, this.successAudiopath4]
    this.audio = React.createRef()
  }
  componentDidMount() {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    console.log("this.props.navigation english", this.props.navigation);
    const data = {
      choose_exercise: this.props.navigation.state.params.exercise_origin
        .choose_exercise,
      exercise_origin: this.props.navigation.state.params.exercise_origin
        .exercise_origin,
      origin: this.props.navigation.state.params.exercise_origin.origin,
      exercise_set_id: this.props.navigation.state.params.exercise_origin
        .exercise_set_id,
      subject: "03",
    };
    data.student_code = userInfoJs.id + "";
    axios.post(api.enStudenthomework, data).then((res) => {
      let list = res.data.data;
      let time = this.getTime();
      for (let i in list) {
        list[i].colorFlag = 0;
      }
      //console.log("题目", list);
      this.setState(() => ({
        fromServeCharacterList: [...list],
        topaicNum: list.length,
        exercise_set_id: list.length > 0 ? list[0].exercise_set_id : "",
        answer_start_time: time,
      }));
    });
    //原生发来蓝牙数据
    DeviceEventEmitter.addListener("usbData", this.eventHandler);
  }

  componentDidUpdate() {
    console.log('componentDidUpdate')
    const map = this.getPyDataFromServe();
    const { topaicIndex, isDialogVisible } = this.state;
    const data = { ...map.get(topaicIndex) };
    if (data.exercise_type_public === EngTypes.FTB && data.exercise_element === EngTypes.W && !isDialogVisible) {
      Toast.loading('进入手写题目', 1)
    }
  }

  componentWillUnmount() {
    console.log('this.saveEnBagExerciseTimer', this.saveEnBagExerciseTimer)
    DeviceEventEmitter.removeListener("usbData", this.eventHandler);
    this.saveEnBagExerciseTimer && clearTimeout(this.saveEnBagExerciseTimer)
    this.closeDialog();
  }


  eventHandler = (message) => {
    if (this.isInExplain) {
      //如果处于讲解阶段，则不显示手写dialog和获取手写数据
      return;
    }
    const map = this.getPyDataFromServe();
    const { topaicIndex, isDialogVisible } = this.state;
    const data = { ...map.get(topaicIndex) };
    if (data.exercise_type_public === EngTypes.FTB && data.exercise_element === EngTypes.W && !isDialogVisible) {
      this.showDialog()
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
    NavigationUtil.goBack(this.props);
  };
  showDialog = () => {
    // this.isDialogVisible = true;
    this.setState({ isDialogVisible: true });
  };

  closeDialog = () => {
    //console.log('closeDialog')
    // this.isDialogVisible = false;
    if (!this.state.isDialogVisible) return
    this.clear()
    this.setState({ isDialogVisible: false });
  };

  destoryDialog = () => {
    this.setState({ isDestoryDialog: true, isDialogVisible: false });
  };

  clear = () => {
    //console.log('clear:::::::::::::::::::::::', this.canvas)
    // if (!this.canvas || !this.canvas.clear) return;
    // this.canvas.clear();
    this.usbUtil.clearListXY();
  };

  // 播放读音
  audioPausedPrivate = () => {
    this.setState({
      playStatus: false
    })
  }
  playAudio = () => {
    const map = this.getPyDataFromServe();
    const { topaicIndex, playStatus } = this.state;
    const data = { ...map.get(topaicIndex) };
    if (!data) return;
    if (playStatus) {
      // Toast.loading('即将停止播放听力语音', 1)
      this.closeAudio()
      return
    } else {
      console.log("click here...", this.audio)
      this.audio?.current?.replay()
      this.setState(() => ({
        playStatus: true
      }))
    }
    //console.log("播放语音地址", url + path);
    // if (playStatus) {
    //   Toast.loading("即将停止播放听力语音", 1);
    //   this.closeAudio();
    //   return;
    // }
    // audio = new Sound(url + path, null, (error) => {
    //   if (error) {
    //     // Alert.alert("播放失败");
    //     console.log('error', error)
    //     Toast.fail('音频加载失败', 1)
    //   } else {
    //     Toast.loading('加载音频', 1, () => {
    //       audio.play((success) => {
    //         console.log('audio', success)
    //         if (success) {
    //           audio.release()
    //           this.setState({
    //             playStatus: false
    //           })
    //         } else {
    //           Toast.fail('播放失败', 1)
    //         }
    //       });
    //       this.setState(() => ({
    //         playStatus: true
    //       }))
    //     })
    //   }
    // });

  };

  //关闭语音播放
  closeAudio = () => {
    this.setState(() => ({
      playStatus: false
    }))
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
    // const { exercise_set_id } = this.state;
    const data = {};
    data.exercise_set_id = this.props.navigation.state.params.exercise_origin.exercise_set_id;
    data.student_code = this.props.userInfo.toJS().id;
    data.subject = "03";
    console.log("getAnswerResult", data);
    axios
      .post(api.yuwenResult, data)
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
        //console.log(e);
      });
  };

  closeAnswerStatisticsModal = () => {
    this.setState({ answerStatisticsModalVisible: false });
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
    let checkList = [...this.state.ImgMCQCRaidoButtonChekckSatutsList].map((item, i) => {
      if (i != index) {
        return false
      }
      return item
    })
    console.log('checkAnswerImg checkList', checkList)
    checkList[index] = !checkList[index]
    //单选情况下
    private_exercise_stem = private_exercise_stem.replaceAll(
      "_",
      getEngPicWord(data)
    );
    this.setState(() => ({
      private_exercise_stem,
      imgMCQAnswer: data,
      ImgMCQCRaidoButtonChekckSatutsList: [...checkList]
    }));
  };

  saveExerciseDetail = (yesOrNo, answer, isWrite = false) => {
    const { fromServeCharacterList, topaicIndex, wrongNum } = this.state;
    // 保存做题结果
    if (yesOrNo === 0) {
      this.playSuccessAudio
        .then(() => {
          let index = randomNum(0, 4);
          const successMusic = new Sound(this.successMusicArr[index], Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log('error', error)
              // Alert.alert("播放失败");
            } else {
              successMusic.play((success) => {
                successMusic.release()
              })
            }
          });
        })
        .then(() => {
          this.saveEnBagExerciseTimer = setTimeout(() => {
            this.saveEnBagExercise(yesOrNo, answer, isWrite);
          }, 10);
        });
    } else {
      this.playFaileAudio
        .then(() => {
          if (wrongNum + 1 < 2) {
            const failMusic = new Sound(this.failAudiopath, Sound.MAIN_BUNDLE, (error) => {
              if (error) {
                // Alert.alert("播放失败");
              } else {
                failMusic.play((success) => {
                  if (success) {
                    failMusic.release()
                  }
                })
              }
            });
          }
        })
        .then(() => {
          this.saveEnBagExerciseTimer = setTimeout(() => {
            this.saveEnBagExercise(yesOrNo, answer, isWrite);
          }, 10);
        });
    }
  };

  saveEnBagExercise = (yesOrNo, answer, isWrite) => {
    // console.log('saveEnBagExercise')
    const {
      fromServeCharacterList,
      topaicIndex,
      wrongNum,
      haveAudio,
    } = this.state;
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    if (
      fromServeCharacterList[topaicIndex].exercise_type_public ===
      EngTypes.FTB &&
      fromServeCharacterList[topaicIndex].exercise_element === EngTypes.S
    ) {
      console.log("录音题跳下一题");
      if (!haveAudio) {
        Toast.info("请提交录音", 1);
        return;
      }
      topaicIndex + 1 == this.state.fromServeCharacterList.length
        ? this.getAnswerResult()
        : this.setState({
          topaicIndex:
            topaicIndex + 1 == this.state.fromServeCharacterList.length
              ? 0
              : topaicIndex + 1,
          isKeyExercise: 1,
          lookDetailNum: 0,
          status: false,
          answer_start_time: this.getTime(),
          checkedIndex: -1,
          private_exercise_stem: -1,
          wrongNum: 0,
          haveAudio: false,
          ImgMCQCRaidoButtonChekckSatutsList: [false, false, false, false, false, false, false, false, false, false,]
        });
      this.clear();
      this.closeDialog();
      return;
    }
    if (isUpload) {
      isUpload = false;
      let data = {
        subject: "03",
        // grade_name: '03',
        // class_info: 'eEbFxkbDHe26ZgNWJe1vArn9',
        // team: '00',
        // unit: '1',
        student_code: userInfoJs.id,
        origin: this.props.navigation.state.params.exercise_origin
          .exercise_origin,
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
        correction: answer === "Speaking" ? 0 : yesOrNo, //批改对错，0 正确 1错误
        record: "", //  批改记录
        is_help: this.state.lookDetailNum === 0 ? 1 : 0, //是都点击帮助0是，1是否
        tooltip_access_frequency: this.state.lookDetailNum, //点击帮助的次数
        tooltip_access_time: "", //点击帮助停留时间
        is_element_exercise: this.state.isKeyExercise, // 是否做错推送的要素题
        is_finish:
          topaicIndex + 1 == this.state.fromServeCharacterList.length ? 0 : 1, //整套题是否做完,0  做完，，1没做完
        kpg_type: this.props.navigation.state.params.exercise_origin.kpg_type, //知识点类型1：单词短语2：句子
      };
      console.log("saveExerciseDetail correction", data.correction);
      axios.post(api.finshOneHomeWork, data).then((res) => {
        isUpload = true;
        //console.log('saveExerciseDetail res', res)
        if (res.data.err_code === 0) {
          // if (yesOrNo === 0) {
          // 答对了 跳入下一道
          topaicIndex + 1 == this.state.fromServeCharacterList.length
            ? this.getAnswerResult()
            : this.setState({
              topaicIndex:
                topaicIndex + 1 == this.state.fromServeCharacterList.length
                  ? 0
                  : topaicIndex + 1,
              isKeyExercise: 1,
              lookDetailNum: 0,
              status: false,
              answer_start_time: this.getTime(),
              checkedIndex: -1,
              private_exercise_stem: -1,
              wrongNum: 0,
              ImgMCQCRaidoButtonChekckSatutsList: [false, false, false, false, false, false, false, false, false, false,]
            });
          this.clear();
          // } else {
          //   if (wrongNum + 1 < 2) {
          //     this.setState((preState) => ({
          //       wrongNum: preState.wrongNum + 1,
          //       checkedIndex: -1,
          //       private_exercise_stem: -1,
          //       isKeyExercise: 0,
          //       ImgMCQCRaidoButtonChekckSatutsList: [false, false, false, false, false, false, false, false, false, false,]
          //     }));
          //     this.clear();
          //   } else {
          //     topaicIndex + 1 == this.state.fromServeCharacterList.length
          //       ? this.getAnswerResult()
          //       : this.setState({
          //         topaicIndex:
          //           topaicIndex + 1 ==
          //             this.state.fromServeCharacterList.length
          //             ? 0
          //             : topaicIndex + 1,
          //         isKeyExercise: 1,
          //         lookDetailNum: 0,
          //         status: false,
          //         answer_start_time: this.getTime(),
          //         checkedIndex: -1,
          //         private_exercise_stem: -1,
          //         wrongNum: 0,
          //         ImgMCQCRaidoButtonChekckSatutsList: [false, false, false, false, false, false, false, false, false, false,]
          //       });
          //     this.clear();
          //   }

          // }
          this.closeDialog();
        }
      });
    }
  };
  uploadMP3 = (file) => {
    const { fromServeCharacterList, topaicIndex, wrongNum } = this.state;
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    let formData = new FormData();
    formData.append("mp3_steam", file);
    formData.append("subject", "03");
    formData.append("student_code", userInfoJs.id);
    formData.append(
      "origin",
      this.props.navigation.state.params.exercise_origin.exercise_origin
    );
    formData.append(
      "knowledge_point",
      fromServeCharacterList[topaicIndex].knowledge_point
    );
    formData.append(
      "exercise_id",
      fromServeCharacterList[topaicIndex].exercise_id
    );
    formData.append("exercise_point_loc", "");
    formData.append("exercise_result", "Speaking");
    formData.append(
      "exercise_set_id",
      fromServeCharacterList[topaicIndex].exercise_set_id
    );
    formData.append("identification_results", "");
    formData.append("is_modification", this.state.isKeyExercise);
    formData.append("answer_start_time", this.state.answer_start_time);
    formData.append("answer_end_time", this.getTime());
    formData.append("is_correction", "");
    formData.append("correction_remarks", "");
    formData.append("correction", 0);
    formData.append("record", "");
    formData.append("is_help", this.state.lookDetailNum === 0 ? 1 : 0);
    formData.append("tooltip_access_frequency", this.state.lookDetailNum);
    formData.append("tooltip_access_time", "");
    formData.append("is_element_exercise", this.state.isKeyExercise);
    formData.append(
      "is_finish",
      topaicIndex + 1 == this.state.fromServeCharacterList.length ? 0 : 1
    );
    formData.append(
      "kpg_type",
      this.props.navigation.state.params.exercise_origin.kpg_type
    );
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    axios
      .post(
        "http://www.pailaimi.com/api/student_blue/upload_mp3_data",
        formData,
        config
      )
      .then((res) => {
        if (res.data.err_code === 0) {
          this.setState({
            haveAudio: true,
          }, () => {
            Toast.info("上传成功", 1);
          });
        }
      });
  };
  nextTopaic = () => {
    //console.log("nextTopaic");
    let index = this.state.checkedIndex;
    const { fromServeCharacterList, topaicIndex, imgMCQAnswer, haveAudio } = this.state;
    this.closeAudio();
    if (!fromServeCharacterList[topaicIndex]) return;
    if (
      fromServeCharacterList[topaicIndex].exercise_type_public ===
      EngTypes.FTB &&
      fromServeCharacterList[topaicIndex].exercise_element === EngTypes.W
    ) {
      //填空手写题
      this.getDataFromCanvas(this.usbUtil.toServeXY);
      this.usbUtil.clearListXY();
      return;
    }
    if (
      fromServeCharacterList[topaicIndex].exercise_type_public ===
      EngTypes.FTB &&
      fromServeCharacterList[topaicIndex].exercise_element === EngTypes.S
    ) {
      console.log('Speaking')
      if (!haveAudio) {
        Toast.info("请提交录音", 1);
        this.saveExerciseDetail(1, "Speaking");
        return
      } else {
        this.saveExerciseDetail(0, "Speaking");

      }
      // if (this.state.isKeyExercise === 1) {
      fromServeCharacterList[topaicIndex].colorFlag = 1;
      // }
      return;
    }
    if (
      fromServeCharacterList[topaicIndex].choice_content_type === 'image'
    ) {
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
      fromServeCharacterList[topaicIndex].choice_content
        .split("#")
      [index].trim() ===
      fromServeCharacterList[topaicIndex].answer_content.trim()
    ) {
      // 正确，当前题目为推送的要素题时不论对错都保存
      this.saveExerciseDetail(
        0,
        fromServeCharacterList[topaicIndex].choice_content
          .split("#")
        [index].trim()
      );
      if (this.state.isKeyExercise === 1) {
        fromServeCharacterList[topaicIndex].colorFlag = 1;
      }
    } else {
      if (this.state.isKeyExercise === 1) {
        fromServeCharacterList[topaicIndex].colorFlag = 2;
      }
      this.saveExerciseDetail(
        1,
        fromServeCharacterList[topaicIndex].choice_content
          .split("#")
        [index].trim()
      );
      // this.setState({
      //     visible: true,
      //     diagnose_notes: fromServeCharacterList[topaicIndex].diagnose_notes.split("#")[index],
      // })
    }
  };

  helpMe = (isHelp) => {
    // 点击查看帮助
    let {
      lookDetailNum,
      fromServeCharacterList,
      topaicIndex,
      isImageHelp,
    } = this.state;
    // 点击查看帮助的两种途径
    if (isHelp) {
      // 从页面点击过来，不用做任何别的操作
      isImageHelp = true;
    } else {
      // 从诊断标记点击过来，需要改变参数
      isImageHelp = false;
      this.isHelpClick = true;
    }
    ++lookDetailNum;
    this.isInExplain = true;
    let data = {};
    data.origin = fromServeCharacterList[topaicIndex].origin;
    data.knowledge = fromServeCharacterList[topaicIndex].knowledge_point;
    data.knowledge_type = fromServeCharacterList[topaicIndex].origin.substring(fromServeCharacterList[topaicIndex].origin.length - 4) === '0000' ? 1 : 2;
    console.log("helpMe SynchronizeDiagnosisEnKnowPoint", fromServeCharacterList[topaicIndex].origin);
    axios
      .get(api.SynchronizeDiagnosisEnKnowPoint, { params: data })
      .then((res) => {
        this.setState(() => ({
          knowledgepoint_explanation:
            fromServeCharacterList[topaicIndex] &&
              fromServeCharacterList[topaicIndex].knowledgepoint_explanation != ""
              ? fromServeCharacterList[topaicIndex].knowledgepoint_explanation
              : " ",
          status: true,
          lookDetailNum,
          isImageHelp,
          knowledgeBody: { ...res.data.data },
        }));
      });
  };

  onCloseHelp = () => {
    this.isInExplain = false;
    this.setState({
      status: false,
    });
  };

  judgeAnswerContent = (data) => {
    //console.log('judgeAnswerContent data',data)
    //console.log('judgeAnswerContent dataLength',data.length)
    if (data.length == 1) {
      //console.log('judgeAnswerContent toLocaleLowerCase',data.toLocaleLowerCase())
      if (data.toLocaleLowerCase() == 'c' || data.toLocaleLowerCase() == 'o' || data.toLocaleLowerCase() == 'k'
        || data.toLocaleLowerCase() == 'p'
        || data.toLocaleLowerCase() == 's' || data.toLocaleLowerCase() == 'x' || data.toLocaleLowerCase() == 'v'
        || data.toLocaleLowerCase() == 'u' || data.toLocaleLowerCase() == 'w' || data.toLocaleLowerCase() == 'z') {
        //console.log('judgeAnswerContent true')
        return true
      }
      return false
    }
    return false
  }

  //获取canvas手写数据
  getDataFromCanvas = (canvasData) => {
    //console.log('getDataFromCanvas canvasData::::::::::', canvasData)
    const { fromServeCharacterList, topaicIndex } = this.state;
    //console.log('getDataFromCanvas fromServeCharacterList[topaicIndex]::::::::::', fromServeCharacterList[topaicIndex])
    if (!canvasData) {
      return;
    }
    if (canvasData.length === 0) {
      //对于不诊断的题目，若是没有作答则判定为作答错误

      return;
    }
    //console.log('getDataFromCanvas::::::::', diagnosisUtil.SingleLetterStrokeOder(canvasData))
    let answerArr = diagnosisUtil.SingleLetterStrokeOder(canvasData)
    if (this.judgeAnswerContent(fromServeCharacterList[topaicIndex].answer_content)) {
      answerArr = diagnosisUtil.DisorderMultiLetterJudge(canvasData)
      let answerContentArr = fromServeCharacterList[topaicIndex].answer_content.split(',')
      console.log('getDataFromCanvas1111111::::::::', answerArr.join('').toLocaleLowerCase)
      console.log('getDataFromCanvas2222222::::::::', answerContentArr.join('').toLocaleLowerCase)
      if (answerArr.join('').toLocaleLowerCase === answerContentArr.join('').toLocaleLowerCase) {
        this.saveExerciseDetail(0, canvasData, true)
        fromServeCharacterList[topaicIndex].colorFlag = 1
      } else {
        this.saveExerciseDetail(1, canvasData, true)
        fromServeCharacterList[topaicIndex].colorFlag = 2
      }
    } else {
      answerArr = diagnosisUtil.DisorderMultiLetterJudge(canvasData)
      let answerContentArr = fromServeCharacterList[topaicIndex].answer_content.split(',')
      if (answerArr.join('') === answerContentArr.join('')) {
        this.saveExerciseDetail(0, canvasData, true)
        fromServeCharacterList[topaicIndex].colorFlag = 1
      } else {
        this.saveExerciseDetail(1, canvasData, true)
        fromServeCharacterList[topaicIndex].colorFlag = 2
      }
    }
  };

  renderTopaicCard = () => {
    let cardList = new Array();
    const { topaicIndex, fromServeCharacterList } = this.state;
    console.log("renderTopaicCard", fromServeCharacterList);
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
    switch (data.exercise_element) {
      case EngTypes.L:
        console.log("renderMCQType L");
        return this.renderROrLType(data);
      case EngTypes.R:
        console.log("renderMCQType R");
        return this.renderROrLType(data);
      case EngTypes.S:
        console.log("renderMCQType S");
        return this.renderSType(data);
      case EngTypes.W:
        console.log("renderMCQType W");
        return this.renderROrLType(data);
    }
  };

  renderFTBType = (data) => {
    switch (data.exercise_element) {
      case EngTypes.L:
        console.log("renderFTBType L");
        return this.renderROrLType(data);
      case EngTypes.R:
        console.log("renderFTBType R");
        return this.renderROrLType(data);
      case EngTypes.S:
        console.log("renderFTBType S");
        return this.renderSType(data);
      case EngTypes.W:
        console.log("renderFTBType W");
        return this.renderFTBWType(data);
    }
  };

  renderROrLType = (data) => {
    if (data.choice_content_type === 'image') {
      return this.renderImgMCQ(data);
    }
    return this.renderCommonMCQ(data);
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
    } = this.state;
    if (private_exercise_stem && private_exercise_stem != -1) {
      data.private_exercise_stem = private_exercise_stem;
    }
    //   data.private_exercise_stem=data.private_exercise_stem.replaceAll('\/x-large','24px')
    data.private_exercise_stem = data.private_exercise_stem.replaceAll(
      "xx-large",
      "48px"
    );
    // //console.log('renderImgMCQ private_exercise_stem',data.private_exercise_stem)
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <View>
            <View style={{ flexDirection: "row" }}>

              {data.private_stem_audio ? (
                <TouchableOpacity
                  style={{ marginTop: pxToDp(8) }}
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
                </TouchableOpacity>
              ) : null}
              {
                data.private_stem_audio ?
                  <Audio uri={`${url}${data.private_stem_audio}`} paused={!this.state.playStatus} pausedEvent={this.audioPausedPrivate} ref={this.audio} />
                  : null
              }

              <RenderHtml
                source={{ html: data.private_exercise_stem ? data.private_exercise_stem : "" }}
                tagsStyles={{ p: { fontSize: 24 }, div: { fontSize: 24 }, span: { fontSize: 24 } }}
              />
            </View>
            {data.private_stem_picture ?
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                {data.choice_content ? data.choice_content.split("#").map((item, index) => {
                  if (data.choice_content_type === 'image') {
                    return (
                      <View style={{ flexDirection: 'row' }}>
                        <Radio
                          checked={this.state.ImgMCQCRaidoButtonChekckSatutsList[index]}
                          style={{ borderWidth: 0, borderColor: '#FC6161', width: 15, height: 15, marginRight: pxToDp(5) }}
                        ></Radio>
                        <TouchableOpacity onPress={() => this.checkAnswerImg(item, fromServeCharacterList[topaicIndex].private_exercise_stem, index)} key={index}>
                          <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginRight: 20, marginTop: 10, alignItems: 'center' }}>
                            <Image style={{ width: 50, height: 50, marginRight: 20, resizeMode: 'contain' }} source={{ uri: 'https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/' + item }}></Image>
                          </View>
                        </TouchableOpacity>

                      </View>
                    )
                  }
                }) : <View></View>}
              </View> :
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                {data.choice_content ? data.choice_content.split("#").map((item, index) => {
                  if (data.choice_content_type === 'image') {
                    return (
                      <View style={{ flexDirection: 'row' }}>
                        <Radio
                          checked={this.state.ImgMCQCRaidoButtonChekckSatutsList[index]}
                          style={{ borderWidth: 0, borderColor: '#FC6161', width: 15, height: 15, marginRight: pxToDp(5) }}
                        ></Radio>
                        <TouchableOpacity onPress={() => this.checkAnswerImg(item, fromServeCharacterList[topaicIndex].private_exercise_stem, index)} key={index}>
                          <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginRight: 20, marginTop: 10, alignItems: 'center' }}>
                            <Image style={{ width: 120, height: 120, resizeMode: 'contain' }} source={{ uri: 'https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/' + item }}></Image>
                          </View>
                        </TouchableOpacity>

                      </View>
                    )
                  }
                }) : <View></View>}
              </View>
            }
          </View>

          <View style={{ marginTop: 20 }}>
            {data.private_stem_picture ? (

              <Image
                style={{ width: 300, height: 300, resizeMode: "contain" }}
                source={{ uri: baseUrl }}
              ></Image>
            ) : (
              <Text></Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  renderCommonMCQ = (data) => {
    let baseUrl =
      "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
      data.private_stem_picture;
    return (
      <View>
        <View style={{ flexDirection: "row" }}>

          {data.private_stem_audio ? (
            <TouchableOpacity
              style={{ marginTop: pxToDp(8) }}
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
            </TouchableOpacity>
          ) : null}
          {
            data.private_stem_audio ?
              <Audio uri={`${url}${data.private_stem_audio}`} paused={!this.state.playStatus} pausedEvent={this.audioPausedPrivate} ref={this.audio} />
              : null
          }

          <RenderHtml
            source={{ html: data.private_exercise_stem ? data.private_exercise_stem : "" }}
            tagsStyles={{ p: { fontSize: 24 }, div: { fontSize: 24 }, span: { fontSize: 24 } }}
          />
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
        <View style={{ marginTop: pxToDp(48) }}>
          {data.choice_content ? (
            data.choice_content.split("#").map((item, index) => {
              if (data.choice_content_type === 'image') {
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
                          width: 300,
                          height: 300,
                          marginLeft: 20,
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
        </View>
      </View>
    );
  };

  renderFTBWType = (data) => {
    let baseUrl =
      "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
      data.private_stem_picture;
    // this.showDialog();
    return (
      <View>
        <View style={{ flexDirection: "row" }}>

          {data.private_stem_audio ? (
            <TouchableOpacity
              style={{ marginTop: pxToDp(8) }}
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
            </TouchableOpacity>
          ) : null}
          {
            data.private_stem_audio ?
              <Audio uri={`${url}${data.private_stem_audio}`} paused={!this.state.playStatus} pausedEvent={this.audioPausedPrivate} ref={this.audio} />
              : null
          }

          <RenderHtml
            source={{ html: data.private_exercise_stem ? data.private_exercise_stem : "" }}
            tagsStyles={{ p: { fontSize: 24 }, div: { fontSize: 24 }, span: { fontSize: 24 } }}
          />
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
      </View>
    );
  };

  renderSType = (data) => {
    let baseUrl =
      "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
      data.private_stem_picture;
    return (
      <View>
        <View style={{ flexDirection: "row" }}>

          {data.private_stem_audio ? (
            <TouchableOpacity
              style={{ marginTop: pxToDp(8) }}
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
            </TouchableOpacity>
          ) : null}
          {
            data.private_stem_audio ?
              <Audio uri={`${url}${data.private_stem_audio}`} paused={!this.state.playStatus} pausedEvent={this.audioPausedPrivate} ref={this.audio} />
              : null
          }

          <RenderHtml
            source={{ html: data.private_exercise_stem ? data.private_exercise_stem : "" }}
            tagsStyles={{ p: { fontSize: 24 }, div: { fontSize: 24 }, span: { fontSize: 24 } }}
          />
        </View>
        {data.private_stem_picture ? (
          <Image
            style={{ marginTop: pxToDp(48), width: 300, height: 250, resizeMode: "contain" }}
            source={{ uri: baseUrl }}
          ></Image>
        ) : (
          <Text></Text>
        )}
        <AudioComponent uploadMP3={this.uploadMP3}></AudioComponent>
      </View>
    );
  };

  renderWType = (data) => {
    return this.renderCommonMCQ(data);
  };
  renderWriteTopaic = () => {
    const map = this.getPyDataFromServe();
    const { topaicIndex } = this.state;
    const data = { ...map.get(topaicIndex) };
    console.log('类型', data.exercise_type_public)
    if (!data.exercise_id) {
      return <Text>数据加载中...</Text>;
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
    //console.log('renderButton:::::', fromServeCharacterList[topaicIndex])
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
              width: 90, height: 40, borderRadius: 50,
              backgroundColor: "#38B3FF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#ffffff" }}>完成</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      if (!fromServeCharacterList[topaicIndex]) {
        return (
          <TouchableOpacity
            style={styles.topaicBtn}
            ref="topaicBox"
            onLayout={(event) => this.topaicContainerOnLayout(event)}
            onPress={this.nextTopaic}
          >
            <View
              style={{
                width: 90, height: 40, borderRadius: 50,
                backgroundColor: "#38B3FF",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: pxToDp(32) }}>next</Text>
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
            style={styles.topaicBtn}
            ref="topaicBox"
            onLayout={(event) => this.topaicContainerOnLayout(event)}
            onPress={this.nextTopaic}
          >
            <View
              style={{
                width: 90, height: 40, borderRadius: 50,
                backgroundColor: "#38B3FF",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: pxToDp(32) }}>next</Text>
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
    } = this.state;
    console.log('题干信息', fromServeCharacterList[topaicIndex])

    return (
      <View style={styles.mainWrap}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.goBack()}>
            <Image
              source={require("../../../images/backBtn.png")}
              style={[appStyle.helpBtn]}
            ></Image>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>我的作业</Text>
          {/* <Text style={styles.headerTitle}>{this.props.navigation.state.params.data.unit_name}</Text> */}
          <Text></Text>
        </View>
        <View style={styles.container}>
          <View
            style={styles.topaic}
            ref="topaicBox"
            onLayout={(event) => this.topaicContainerOnLayout(event)}
          >
            <View style={styles.topaicText}>
              <View style={{ flex: 1 }}>
                <ScrollView>
                  <RenderHtml
                    source={{
                      html: fromServeCharacterList[topaicIndex] &&
                        fromServeCharacterList[topaicIndex]
                          .public_exercise_stem != ""
                        ? fromServeCharacterList[topaicIndex]
                          .public_exercise_stem
                        : " "
                    }}
                    tagsStyles={{ p: { fontSize: 24 }, div: { fontSize: 24 }, span: { fontSize: 24 } }}
                  />
                  {this.renderWriteTopaic()}
                </ScrollView>
              </View>

              <TouchableOpacity onPress={this.helpMe} style={[appStyle.helpBtn,]}>
                <Image
                  source={require("../../../images/help.png")}
                  style={[appStyle.helpBtn]}
                ></Image>
              </TouchableOpacity>
            </View>
            {this.renderButton()}
          </View>
          <View style={styles.topaicCard}>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                flexWrap: "wrap",
                padding: 24,
              }}
            >
              {this.renderTopaicCard(topaicNum)}
            </View>
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
          unitName="我的作业"
        >
          {/* unitName = {this.props.navigation.state.params.data.unit_name} */}
        </HelpWordModal>
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
          _dialogLeftBtnAction={this.nextTopaic}
        ></EngLishCanvasDialog>
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
    padding: pxToDp(40),
    // paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: pxToDp(110),
    marginBottom: pxToDp(40),
    paddingLeft: pxToDp(30),
    backgroundColor: "#FFFFFFFF",
    borderRadius: pxToDp(30),
  },
  headerTitle: {
    fontSize: pxToDp(40),
    color: "#3F403F",
    fontWeight: "bold",
  },
  container: {
    // flex: 1,
    flexDirection: "row",
  },
  topaic: {
    backgroundColor: "#FFFFFFFF",
    // width: '80%',
    flex: 1,
    height: pxToDp(890),
    marginRight: pxToDp(40),
    borderRadius: pxToDp(30),
  },
  topaicBtn: {
    backgroundColor: "#FFFFFFFF",
    width: '95%',
    alignItems: "flex-end",
    // height: 80,
    // margin: 20,
  },
  topaicText: {
    // width: 712,
    height: pxToDp(800),
    padding: pxToDp(48),
    flexDirection: "row",
    // justifyContent: 'space-between'
  },
  topaicCard: {
    width: pxToDp(500),
    height: pxToDp(890),
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
      "deskEnglish",
      "fromServeCharacterList",
    ]),
    currentTopaicData: state.getIn(["deskEnglish", "currentTopaicData"]),
    topaicNum: state.getIn(["deskEnglish", "topaicNum"]),
    topaicIndex: state.getIn(["deskEnglish", "topaicIndex"]),
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    getTopaciData(data) {
      // dispatch(actionCreators.getTopaic(data));
    },
    changeCurrentTopaic(changeTopaicData) {
      if (!changeTopaicData) throw new TypeError("题目上限");
      //console.log("changeTopaicData", changeTopaicData);
      dispatch(actionCreators.changeCurrentTopaic(changeTopaicData));
    },
    changeTopaicIndex(index) {
      dispatch(actionCreators.changeTopaicIndex(index));
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(EnglishDeskCanvas);
