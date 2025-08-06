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
} from "react-native";
import { pxToDp } from "../util/tools";
import { Toast } from "antd-mobile-rn";
import _ from "lodash";
import api from "../util/http/api";
// import axios from "../util/http/axios";
import axios from "axios";
export default class RecordAudio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: undefined, //录音 授权状态
      audioPath:
        AudioUtils.DocumentDirectoryPath +
        `/quick_audio_${new Date().getTime()}.aac`, // 文件路径
      stop: false, //录音是否停止
      currentTime: 0, //录音时长
      status: 0, //0：未录音 1：录音中 2：录音结束
    };
    this.handleStartAudioThrottled = _.throttle(
      this.handleStartAudio,
      3 * 1000
    );
    this.handleStopAudioThrottled = _.throttle(this.handleStopAudio, 3 * 1000);
    this.handlePlayAudioThrottled = _.throttle(this.handlePlayAudio, 3 * 1000);
    this.handleDelAudioThrottled = _.throttle(this.handleDelAudio, 3 * 1000);
    this.whoosh = undefined;

  }

  componentDidMount() {
    this.getAudioAuthorize();
  }
  componentWillUnmount() {
    console.log("销毁");
    this.handleStopAudio()
    if (this.whoosh) {
      this.whoosh.stop()
    }
    this.setState({
      currentTime: 0,
      stop: false,
      status: 0,
    });
  }
  // 请求录音授权
  getAudioAuthorize() {
    AudioRecorder.requestAuthorization().then((isAuthor) => {
      //console.log('是否授权: ' + isAuthor)
      if (!isAuthor) {
        return Alert("APP需要使用录音，请打开录音权限允许APP使用");
      }
      this.setState({ hasPermission: isAuthor });
      this.prepareRecordingPath(this.state.audioPath);
      // 录音进展
      AudioRecorder.onProgress = (data) => {
        this.setState({
          currentTime: Math.ceil(data.currentTime),
        });
      };
      // 完成录音
      AudioRecorder.onFinished = (data) => {
        // data 录音数据，可以在此存储需要传给接口的路径数据
        //console.log(this.state.currentTime)
      };
    });
  }

  /**
   * AudioRecorder.prepareRecordingAtPath(path,option)
   * 录制路径
   * path 路径
   * option 参数
   */
  prepareRecordingPath = (path) => {
    console.log('prepareRecordingPath start')
    const option = {
      SampleRate: 22050.0, //采样率
      Channels: 1, //通道
      AudioQuality: "Low", //音质
      AudioEncoding: "aac", //音频编码 aac
      OutputFormat: "mpeg_4", //输出格式
      MeteringEnabled: false, //是否计量
      MeasurementMode: false, //测量模式
      AudioEncodingBitRate: 32000, //音频编码比特率
      IncludeBase64: true, //是否是base64格式
      AudioSource: 0, //音频源
    };
    AudioRecorder.prepareRecordingAtPath(path, option);
    console.log('prepareRecordingPath end')
  };

  // 开始录音
  handleStartAudio = async () => {
    if (!this.state.hasPermission) {
      return Alert("APP需要使用录音，请打开录音权限允许APP使用");
    }
    //console.log('录音开始')
    Toast.info("录音开始", 1);
    this.setState(() => ({
      status: 1,
    }));
    if (this.state.stop) {
      // 初始化录音
      this.prepareRecordingPath(this.state.audioPath);
    }
    try {
      await AudioRecorder.startRecording();
    } catch (err) {
      console.error(err);
    }
  };

  // 停止录音
  handleStopAudio = async () => {
    console.log('录音结束', this.state.status)
    if (this.state.status === 2 || this.state.status === 0) return
    console.log('停止录音')
    this.setState(() => ({
      status: 2,
    }));
    try {
      await AudioRecorder.stopRecording();
      Toast.info("录音结束", 1);
      this.setState({ stop: true, recording: false });
    } catch (error) {
      console.error(error);
    }
  };

  // 播放录音
  handlePlayAudio = async () => {
    console.log('正在播放', this.state.audioPath)
    this.whoosh = new Sound(this.state.audioPath, null, (err) => {
      if (err) {
        Toast.fail("加载音频失败,未找到音频资源", 2);
        //console.log('加载音频失败',err)
        return console.log(err);
      }
      Toast.loading("即将播放录音", 1, () => {
        if (!this.whoosh) {
          Toast.fail("加载音频失败,请重新录音", 2);
          return;
        }
        this.whoosh.play((success) => {
          if (success) {
            this.whoosh.release()
            //console.log('success - 播放成功')
            //console.log('播放完毕')
          } else {
            Toast.fail("播放失败", 2);
            //console.log('fail - 播放失败')
            //console.log('播放失败')
          }
        });
      });
    });
  };

  // 删除录音
  handleDelAudio = async () => {
    // 初始化录音
    this.prepareRecordingPath(this.state.audioPath);
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
    console.log('handlesubmit')
    Toast.loading("上传录音", 1);
    let { stop, audioPath } = this.state;
    if (!audioPath) {
      Toast.info("请录音", 1);
      return;
    }
    this.handleStopAudio()
    console.log("录音信息", audioPath);
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

  render() {
    return (
      <View style={{ marginTop: pxToDp(48) }}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{ marginBottom: 20, marginRight: pxToDp(24) }}
            activeOpacity={0.8}
            onPress={this.handleStartAudioThrottled}
          >
            {/* <Text> 录音 </Text> */}
            <Image
              source={require("../images/ic_will_start_record.png")}
              style={{ width: pxToDp(70), height: pxToDp(70) }}
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginBottom: 20, marginRight: pxToDp(24) }}
            activeOpacity={0.8}
            onPress={this.handleStopAudioThrottled}
          >
            {/* <Text> 停止录音 </Text> */}
            <Image
              source={require("../images/ic_timeout.png")}
              style={{ width: pxToDp(70), height: pxToDp(70) }}
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginBottom: 20, marginRight: pxToDp(24) }}
            activeOpacity={0.8}
            onPress={this.handlePlayAudioThrottled}
          >
            {/* <Text> 播放录音 </Text> */}
            <Image
              source={require("../images/ic_play_record.png")}
              style={{ width: pxToDp(70), height: pxToDp(70) }}
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginBottom: 20, marginRight: pxToDp(24) }}
            activeOpacity={0.8}
            onPress={this.handleDelAudioThrottled}
          >
            {/* <Text> 删除录音 </Text> */}
            <Image
              source={require("../images/ic_delete.png")}
              style={{ width: pxToDp(70), height: pxToDp(70) }}
            ></Image>
          </TouchableOpacity>
          {this.props.uploadMP3 ? <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => this.handlesubmit()}
          >
            <Image style={{ width: pxToDp(70), height: pxToDp(70) }} source={require('../images/upload_icon.png')}></Image>
          </TouchableOpacity> : null}

        </View>
        <Text style={{ fontSize: pxToDp(36) }}>当前录音状态：{this.rednerAuidoStatus()}</Text>
      </View>
    );
  }
}
