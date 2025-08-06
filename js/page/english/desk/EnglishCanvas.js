import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Platform,
  DeviceEventEmitter,
  Dimensions,
  ScrollView
} from "react-native";
import { appStyle, appFont } from "../../../theme";
import { size_tool, pxToDp, padding_tool, fontFamilyRestoreMargin, borderRadius_tool } from "../../../util/tools";
import axios from '../../../util/http/axios'
import api from '../../../util/http/api'
import Header from '../../../component/Header'
import NavigationUtil from "../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { Modal, Toast } from "antd-mobile-rn";
// import MixExercise from './mix/DoExercise'
import CheckExercise from './checkExercise'
import AnswerStatisticsModal from "../../../component/pinyinStatisticsModal";
import Audio from "../../../util/audio"
import fonts from "../../../theme/fonts";
import SpeakExercise from './speakExercise'
import pinyin from "../../../util/languageConfig/chinese/pinyin";
import PlayAudio from '../../../util/audio/playAudio'
import url from '../../../util/url'
class LookAllExerciseHome extends PureComponent {
  constructor(props) {
    super(props);
    let language_data = props.language_data.toJS()
    const { main_language_map, other_language_map, type, show_type } = language_data
    this.state = {
      list: [],
      listindex: 0,
      exercise_set_id: '',
      answerStatisticsModalVisible: false,
      correct: 0,
      wrong: 0,
      blank: 0,
      pausedSuccess: true,
      pausedfail: true,
      audioIndex: '',
      statuslist: [],
      language_data,
      finishTxt: {
        main: main_language_map.finish,
        other: other_language_map.finish,
        pinyin: pinyin.finish
      },
      visibleGood: false,
      answer_start_time: this.getTime(),
    };
    this.successAudiopath = url.baseURL + 'pinyin_new/pc/audio/good.mp3';
    this.successAudiopath2 = url.baseURL + 'pinyin_new/pc/audio/good2.mp3';
    this.successAudiopath3 = url.baseURL + 'pinyin_new/pc/audio/good3.mp3';

    this.failAudiopath = url.baseURL + 'pinyin_new/pc/audio/fail.mp3';

    this.exerciseRef = undefined
  }
  componentDidMount() {
    this.getList()

  }
  getList = () => {
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
      let statuslist = []
      res.data.data.forEach(() => {
        statuslist.push('')
      })
      this.setState({
        list: res.data.data,
        exercise_set_id: res.data.data[0]?.exercise_set_id,
        statuslist
      })
    });
  }
  goBack = () => {
    NavigationUtil.goBack(this.props);
  }
  componentWillUnmount() {
    DeviceEventEmitter.emit("backRecordList"); //返回页面刷新
  }

  checkThis = (item) => {
    NavigationUtil.toChinesePinyinLookWordDetail({
      ...this.props, data: {
        ...item,
        updata: () => { this.getList() }
      }
    })
  }
  getTime = () => {
    let date = new Date()
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1).toString();
    var day = date.getDate().toString();
    var hour = date.getHours().toString();
    var minute = date.getMinutes().toString();
    var seconds = date.getSeconds().toString();
    return year + '-' + month + '-' + day + '' + ' ' + hour + ':' + minute + ':' + seconds
  }
  saveExercise = async (value) => {
    let index = this.state.listindex
    const { listindex, list } = this.state
    let { correct, wrong } = this.state
    const { userInfo, textBookCode } = this.props;
    const userInfoJs = userInfo.toJS();
    console.log(value)
    let obj = {
      subject: "03",
      student_code: userInfoJs.id,
      origin: this.props.navigation.state.params.exercise_origin
        .exercise_origin,
      knowledge_point: list[listindex].knowledge_point,
      exercise_id: list[listindex].exercise_id,
      exercise_point_loc: "",
      // exercise_result: answer,
      exercise_set_id: list[listindex].exercise_set_id,
      identification_results: "",
      is_modification: 1,
      answer_start_time: this.state.answer_start_time, // 答题开始时间
      answer_end_time: this.getTime(), // 答题结束时间
      correction: value.correct === 1 ? 0 : 1, //批改对错，0 正确 1错误
      is_help: this.state.lookDetailNum === 0 ? 1 : 0, //是都点击帮助0是，1是否
      // tooltip_access_frequency: this.state.lookDetailNum, //点击帮助的次数  
      is_element_exercise: 1, // 是否做错推送的要素题
      is_finish: index === list.length - 1 ? 0 : 1, //整套题是否做完,0  做完，，1没做完
      kpg_type: this.props.navigation.state.params.exercise_origin.kpg_type, //知识点类型1：单词短语2：句子
    }
    console.log('保存数据123', obj)
    axios.post(api.finshOneHomeWork, obj).then((res) => {
      console.log('回调', index === this.state.list.length - 1 ? 0 : 1)
      if (res.data.err_code === 0) {
        ++index
        value.correct === 1 ? ++correct : ++wrong
        console.log("回调456", index, this.state.list.length, index < this.state.list.length)
        let arr = ['1', '2', '3']
        let listnow = [...this.state.statuslist]
        listnow[index - 1] = value.correct === 1 ? 'right' : 'wrong'
        let flag = true, audioFlag = true
        if (value.correct === 1) {
          flag = false
        }
        let audioindex = Math.floor(Math.random() * 3)
        const audiolist = [this.successAudiopath, this.successAudiopath2, this.successAudiopath3,]

        !flag ? PlayAudio.playSuccessSound(audiolist[audioindex]) : ''
        this.setState({
          // pausedSuccess: flag,
          // pausedfail: audioFlag,
          correct, wrong,
          audioIndex: arr[audioindex] + '',
          statuslist: listnow,
          visibleGood: !flag
        })
        if (index < this.state.list.length) {

          this.setState({
            listindex: flag ? index : index - 1,
          })
          if (!flag) {
            setTimeout(() => {
              this.setState({
                visibleGood: false,
                listindex: index
              }, () => {

              })
            }, 500);
          }

        } else {
          console.log("这儿呢这儿呢人")

          this.saveAll()
          if (!flag) {
            console.log("！flag")
            setTimeout(() => {
              this.setState({
                visibleGood: false,
              }, () => {
                this.setState({
                  // statuslist: listnow,
                  // correct, wrong,
                  answerStatisticsModalVisible: true,
                  // pausedSuccess: value.correct === 1 ? false : true
                },
                  () => {
                    // console.log('变了的数据', this.state.answerStatisticsModalVisible)
                  });
              })
            }, 500);
          } else {
            console.log('flag=====')

            this.setState({
              answerStatisticsModalVisible: true,
            }, () => console.log('this.state.answerStatisticsModalVisible', this.state.answerStatisticsModalVisible));

          }


        }
        // 异步问题没解决，要封装一个promise



      }
    })
  }
  saveAll = () => {
    const { exercise_set_id, } = this.state
    const data = {}
    data.exercise_set_id = exercise_set_id
    data.student_code = this.props.userInfo.toJS().id
    data.subject = "03";
    console.log('getAnswerResult', data)


    axios.post(api.yuwenResult, data).then(res => {
      // axios.post(api.enBagResult, data).then(res => {
      // 
      // 

    }).catch(e => {
      //console.log(e)
    })
  }
  closeAnswerStatisticsModal = () => {
    this.setState({ answerStatisticsModalVisible: false });
    this.goBack()
  }
  audioPausedSuccess = () => this.setState({ pausedSuccess: true, pausedfail: true })
  helpMe = () => {
    console.log(this.exerciseRef)
    this.exerciseRef?.helpMe(true)
  }
  render() {
    const { list, listindex, pausedSuccess, pausedfail, audioIndex, statuslist } = this.state
    console.log('题干信息', list[listindex])

    return (
      <ImageBackground
        source={require('../../../images/english/abcs/doBg.png')}
        resizeMode='cover'
        style={[, { flex: 1, position: 'relative', paddingTop: 0 }, appStyle.flexCenter]}>

        <TouchableOpacity
          onPress={this.goBack}
          style={[{ position: 'absolute', top: pxToDp(48), left: pxToDp(40), zIndex: 0 }]}>
          <Image
            source={require('../../../images/chineseHomepage/pingyin/new/back.png')}
            style={[size_tool(120, 80),
            ]}
          />

        </TouchableOpacity>
        <View style={[{ height: pxToDp(140), width: pxToDp(1700), backgroundColor: '#F5F1F8', marginBottom: pxToDp(20) }, borderRadius_tool(0, 0, 30, 30), appStyle.flexCenter, padding_tool(0, 40, 0, 80)]}>
          <ScrollView style={[{ flex: 1, },]} horizontal={true}  >
            <View style={[appStyle.flexTopLine, appStyle.flexCenter, { height: pxToDp(140), }]}>

              {
                statuslist.map((item, index) => {
                  return <View key={index} style={[appStyle.flexCenter, borderRadius_tool(100),
                  { height: pxToDp(72), minWidth: pxToDp(72), borderWidth: pxToDp(6), borderColor: index === listindex ? '#864FE3' : 'transparent', backgroundColor: item === 'right' ? '#16C792' : item === 'wrong' ? '#F2645B' : 'transparent', marginRight: pxToDp(index === statuslist.length - 1 ? 0 : 24) }]}>
                    <Text style={[{ fontSize: pxToDp(36), color: item ? '#fff' : '#475266' }, fonts.fontFamily_jcyt_700]}>{index + 1}</Text>
                  </View>
                })
              }
            </View>
          </ScrollView>
        </View>


        <View style={[{ flex: 1, position: 'relative' },
        appStyle.flexTopLine, appStyle.flexCenter,
        padding_tool(0, 80, 80, 80),
        ]}>
          <TouchableOpacity onPress={this.helpMe} style={[size_tool(100),
          { position: 'absolute', top: (-20), right: pxToDp(60), zIndex: 999, }]}>
            <Image style={[size_tool(120, 80)]}
              resizeMode="contain"
              source={require('../../../images/MathKnowledgeGraph/help_btn_1.png')} />
          </TouchableOpacity>
          <View
            style={[appStyle.flexCenter, { flex: 1, backgroundColor: '#fff', borderRadius: pxToDp(40), }]}
          >
            {
              list.length > 0 ?
                <View style={[{
                  flex: 1, width: '100%',
                }, appStyle.flexCenter,
                ]}>
                  {list.length > 0 && list[listindex]?.exercise_type_public === 'MCQ' || list[listindex]?.exercise_type_private === 'MCQ' ?
                    <CheckExercise exercise={{
                      ...list[listindex],
                    }}
                      saveExercise={this.saveExercise}
                      ref={(view) => {
                        console.log('ref', view)
                        if (view) this.exerciseRef = view
                      }}
                    /> : null}

                  {list.length > 0 && list[listindex]?.exercise_type_public === 'FTB' ?
                    <SpeakExercise exercise={{
                      ...list[listindex],

                    }} saveExercise={this.saveExercise} ref={(view) => {
                      console.log('ref', view)
                      if (view) this.exerciseRef = view
                    }} /> : null}


                </View>
                :
                <View style={[{ flex: 1, paddingTop: Platform.OS === 'ios' ? pxToDp(200) : 0 }]}>
                  <ImageBackground
                    source={require('../../../images/chineseHomepage/chineseNoExercise.png')}
                    style={[size_tool(760, 770), appStyle.flexCenter, padding_tool(0, 30, 300, 0),]}
                    resizeMode={"contain"}
                  >
                    <Text style={[{ fontSize: pxToDp(56), color: '#b75526', fontFamily: Platform.OS === 'ios' ? 'Muyao-Softbrush' : 'Muyao-Softbrush-2', }]}>暂无习题</Text>
                  </ImageBackground>
                </View>
            }

          </View>

        </View>
        <AnswerStatisticsModal
          dialogVisible={this.state.answerStatisticsModalVisible}
          yesNumber={this.state.correct}
          noNumber={this.state.wrong}
          waitNumber={this.state.blank}
          closeDialog={this.closeAnswerStatisticsModal}
          finishTxt={this.state.finishTxt}
          language_data={this.state.language_data}
        ></AnswerStatisticsModal>
        {/* {
                    pausedSuccess ? null :
                        <Audio isLocal={true} uri={`${audioIndex === '3' ? this.successAudiopath3 : audioIndex === '2' ? this.successAudiopath2 : this.successAudiopath}`} paused={pausedSuccess} pausedEvent={this.audioPausedSuccess} ref={this.audio1} />

                }
                <Audio isLocal={true} uri={`${this.failAudiopath}`} paused={pausedfail} pausedEvent={this.audioPausedSuccess} ref={this.audio1} /> */}
        {
          this.state.visibleGood ?
            <View style={[
              appStyle.flexCenter,
              {
                width: '100%',
                height: Dimensions.get('window').height,
                backgroundColor: 'rgba(0,0,0,0.5)',
                position: 'absolute',
                left: 0,
                top: 0, zIndex: 999
              }
            ]}>
              <Image style={[size_tool(660)]} source={require('../../../images/chineseHomepage/pingyin/new/good.png')} />

            </View>
            : null
        }
        {/* <Modal
                    visible={this.state.visibleGood}
                    transparent
                    style={[{ width: pxToDp(800), backgroundColor: 'transparent' }, appStyle.flexCenter]}
                >

                </Modal> */}

      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink"
  }
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    language_data: state.getIn(['languageChinese', 'language_data']),
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
      //console.log("changeTopaicData", changeTopaicData);
      dispatch(actionCreators.changeCurrentTopaic(changeTopaicData));
    },
    changeTopaicIndex(index) {
      dispatch(actionCreators.changeTopaicIndex(index));
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(LookAllExerciseHome);