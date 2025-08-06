import React, { Component } from "react";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import Sound from "react-native-sound";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { padding_tool, pxToDp } from "../../../util/tools";
import { Toast } from "antd-mobile-rn";
import _ from "lodash";
import api from "../../../util/http/api";
// import axios from "../../../util/http/axios";
import axios from "axios";
import { appStyle } from "../../../theme";
import url from "../../../util/url";
import Audio from "../../../util/audio"
import RNFS, {stat} from "react-native-fs"

export default class RecordAudio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: undefined, //录音 授权状态
      stop: false, //录音是否停止
      currentTime: 0, //录音时长
      status: 0, //0：未录音 1：录音中 2：录音结束
      isPasued: true,
      index: -1,
      audioPath: "",
    };
    this.handleStartAudioThrottled = _.throttle(
        this.handleStartAudio,
        3 * 1000
    );
    this.handleStopAudioThrottled = _.throttle(this.handleStopAudio, 3 * 1000);
    this.handlePlayAudioThrottled = _.throttle(this.handlePlayAudio, 3 * 1000);
    this.handleDelAudioThrottled = _.throttle(this.handleDelAudio, 3 * 1000);
    this.whoosh = undefined;
    this.audio = React.createRef()
    this.audioRecorderStatus = undefined
  }

  componentDidMount() {
    const {index} = this.props
    console.log("componentDidMount: ", index)
    // const audioPath = `${AudioUtils.DocumentDirectoryPath}/quick_audio_${index}.aac`
    const audioPath = `${AudioUtils.DocumentDirectoryPath}/quick_audio_${new Date().getTime()}.aac` // 文件路径
    this.setState({
      index,
      audioPath,
    })

    AudioRecorder.requestAuthorization().then((isAuthor) => {
      if (!isAuthor) {
        return Alert("APP需要使用录音，请打开录音权限允许APP使用");
      }
      // this.setState({ hasPermission: isAuthor });
      this.audioRecorderStatus = isAuthor
      // 录音进展
      AudioRecorder.onProgress = (data) => {
        this.setState({
          currentTime: Math.ceil(data.currentTime),
        });
      };
      // 完成录音
      AudioRecorder.onFinished = (data) => {
        if (data.status === "OK") {
          stat(audioPath).then(res => console.log("finish res: ", res))
          this.setState({ stop: true, recording: false });
        }
      };
    });
  }
  componentDidUpdate(prevProps, prevState,) {
    console.log("componentDidUpdate: ", this.props, prevProps)
    if (prevState.audioPath !== this.state.audioPath) {
      this.prepareRecordingPath(this.state.audioPath)
    } else if (this.props.isRender) {
      this.setState({
        currentTime: 0,
        stop: false,
        status: 0,
      });
    }
  }
  componentWillUnmount() {
    this.handleStopAudio()
    if (this.whoosh) {
      this.whoosh.stop()
    }
    this.setState({
      currentTime: 0,
      stop: false,
      status: 0,
    });
    RNFS.unlink(this.state.audioPath).then(() => {
        console.log('FILE DELETED: ', this.state.audioPath)
    })
    this.audioRecorderStatus = undefined
  }

  // 请求录音授权
  // getAudioAuthorize = () => {
  //
  // }

  /**
   * AudioRecorder.prepareRecordingAtPath(path,option)
   * 录制路径
   * path 路径
   * option 参数
   */
  prepareRecordingPath = (path) => {
    const option = {
      SampleRate: 16000,
      Channels: 1,
      AudioQuality: "High",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 16000,
    };
    AudioRecorder.prepareRecordingAtPath(path, option);
  };

  // 开始录音
  handleStartAudio = async () => {
    console.log("click start: ", this.props)
    if (this.audioRecorderStatus === false) {
      Alert("APP需要使用录音，请打开录音权限允许APP使用");
      return
    }
    const {audioPath} = this.state
    // await RNFS.writeFile(audioPath, "", 'base64')
    this.prepareRecordingPath(audioPath);
    Toast.info("录音开始", 1);
    this.setState(() => ({
      status: 1,
    }));
    try {
      await AudioRecorder.startRecording();
    } catch (err) {
      console.error(err);
    }
  };

  // 停止录音
  handleStopAudio = async () => {
    console.log("click end", this.props)
    // console.log('录音结束', this.state.status)
    if (this.state.status === 2 || this.state.status === 0) return
    // console.log('停止录音')
    this.setState(() => ({
      status: 2,
    }));
    try {
      const filePath = await AudioRecorder.stopRecording();
      Toast.info("录音结束", 1);
      const r = await stat(this.state.audioPath)
      console.log("finish1: ", this.props)
      this.setState({ stop: true, recording: false });
      return filePath
    } catch (error) {
      console.error(error);
    }
  };

  // 播放录音
  handlePlayAudio = async () => {
    if (this.state.recording) {
      await this.handleStopAudio();
    }
    console.log('正在播放', this.props)
    const r = await stat(this.state.audioPath)
    console.log(JSON.stringify(r))
    Toast.loading("即将播放", 1);
    this.audio.current.replay()
    this.setState({
      isPasued: false
    })
  };

  // 删除录音
  handleDelAudio = async () => {
    // 初始化录音
    // this.prepareRecordingPath(this.state.audioPath);
    this.setState(
        {
          currentTime: 0,
          stop: false,
          status: 0,
        },
        () => {
          Toast.success("录音已删除", 2);
        }
    );
  };

  // 注意⚠️，在此处调用接口，传递录音
  async handlesubmit() {
    Toast.loading("上传录音", 1);
    let { stop, audioPath } = this.state;
    if (!audioPath) {
      Toast.info("请录音", 1);
      return;
    }
    this.handleStopAudio()
    // let audioResult = await requestAudio(params); // requestAudio 是封装的请求接口的函数，具体内容在下面
    let formData = new FormData();
    let soundPath = `file://${audioPath}`; // 注意需要增加前缀 `file://
    let fileName = audioPath.substring(
        audioPath.lastIndexOf("/") + 1,
        audioPath.length
    ); // 文件名
    let file = { uri: soundPath, type: "multipart/form-data", name: fileName }; // 注意 `uri` 表示文件地址，`type` 表示接口接收的类型，一般为这个，跟后端确认一下
    formData.append("mp3_steam", file);
    this.props.uploadMP3(file)
  }
  rednerAuidoStatus = () => {
    const { status } = this.state;
    if (status == 0) {
      return <Text>未录音</Text>;
    } else if (status == 1) {
      return <Text>录音中</Text>;
    } else if (status == 2) {
      return <Text>录音结束</Text>;
    }
  };
  audioPausedPrivate = () => {
    this.setState({
      isPasued: true
    })
  }

  render() {
    const {audioPath} = this.state
    console.log("~~~ audioPath: ", audioPath)
    return (
        <View style={[appStyle.flexTopLine, appStyle.flexJusBetween, appStyle.flexAliCenter, padding_tool(0, 40, 0, 40),
          { width: '100%', flex: 1 }]}>
          <Text></Text>
          {this.state.status !== 1 ? <TouchableOpacity
                  style={{}}
                  activeOpacity={0.8}
                  onPress={this.handleStartAudioThrottled}
              >
                {/* <Text> 录音 </Text> */}
                <Image
                    source={require("../../../images/chineseHomepage/pingyin/studyVoice.png")}
                    style={{ width: pxToDp(70), height: pxToDp(70) }}
                ></Image>
              </TouchableOpacity>
              :
              <TouchableOpacity
                  style={{ marginRight: pxToDp(24) }}
                  activeOpacity={0.8}
                  onPress={this.handleStopAudioThrottled}
              >
                {/* <Text> 停止录音 </Text> */}

                <Image
                    source={require("../../../images/ic_timeout.png")}
                    style={{ width: pxToDp(70), height: pxToDp(70) }}
                ></Image>
              </TouchableOpacity>}
          <TouchableOpacity
              style={{}}
              activeOpacity={0.8}
              onPress={this.handlePlayAudioThrottled}
          >
            {/* <Text> 播放录音 </Text> */}
            <Image
                source={this.state.status === 2 ?
                    require("../../../images/chineseHomepage/pingyin/studyHaveVoice.png")
                    :
                    require("../../../images/chineseHomepage/pingyin/studyNoVoice.png")}
                style={{ width: pxToDp(70), height: pxToDp(70) }}
            ></Image>
          </TouchableOpacity>

          <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => this.handlesubmit()}
          >
            <Image style={{ width: pxToDp(70), height: pxToDp(70) }} source={require('../../../images/chineseHomepage/pingyin/studyUpload.png')}></Image>
          </TouchableOpacity>

          {this.state.status === 2 ?
              <Audio uri={`file://${this.state.audioPath}`} paused={this.state.isPasued} pausedEvent={this.audioPausedPrivate} ref={this.audio} />
              : null}
          {/* <Text style={{ fontSize: pxToDp(36) }}>当前录音状态：{this.rednerAuidoStatus()}</Text> */}
        </View>
    );
  }
}
const styles = StyleSheet.create({

})
