import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  DeviceEventEmitter
} from "react-native";
import { appFont, appStyle, mathTopicStyle, mathFont } from "../../../../theme";
import { pxToDp, pxToDpHeight } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import TopicNums from '../../../../component/math/Topic/TopicNums'
import * as _ from "lodash";
import { changeTopicData, initTopicData } from '../../tools'
import Stem from '../../../../component/math/Topic/Stem'
import Keyboard from '../../../../component/math/Keyboard/Keyboard'
import topaicTypes from '../../../../res/data/MathTopaicType'
import TopicStemTk from '../../../../component/math/Topic/TopicStemTk'
import { diagnosis } from '../../MathDiagnosis'
import Explanation from '../../../../component/math/Topic/Explanation'
import FranctionInputView from '../../../../component/math/FractionalRendering/FranctionInputView'
import CalculationStem from '../../../../component/math/Topic/CalculationStem'
import { Toast } from "antd-mobile-rn";
import OptionView from '../../../../component/math/Topic/OptionView'
import ApplicationStem from '../../../../component/math/Topic/ApplicationStem'
import ApplicationFillBlank from '../../../../component/math/Topic/ApplicationFillBlank'
import StatisticsModal from './components/StatisticsModal'
import ApplicationExplanation from '../../../../component/math/Topic/ApplicationExplanation'
import ScribblingPadModal from "../../../../util/draft/ScribblingPadModal"
import HelpModal from "../../../../component/math/Topic/HelpModal";
import CorrectPrompt from '../../../../component/math/Topic/CorrectPrompt'
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil";
import BackBtn from "../../../../component/math/BackBtn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getRewardCoinLastTopic} from '../../../../util/coinTools'
import * as actionCreatorsUserInfo from "../../../../action/userInfo";
import PlayAudio from "../../../../util/audio/playAudio";
import url from "../../../../util/url";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
let style = mathTopicStyle['2']


class DoExercise extends PureComponent {
  constructor(props) {
    super(props);
    this.TopicNumsRef = null
    this.Keyboard = null
    this.TopicStemTk = null
    this.FranctionInputView = null
    this.CalculationStem = null
    this.ApplicationStem = null
    this.s_h_id = ''
    this.total = 0
    this.preOrNextThrottle = _.debounce(this.preOrNext, 300);
    this.submitThrottle = _.debounce(this.submit, 300);
    this.nextThrottle = _.debounce(this.next, 300);
    this.wrong_ids = []
    this.code = this.props.navigation.state.params.data.expand_code
    this.name = this.props.navigation.state.params.data.expand_name
    this.max_level = this.props.navigation.state.params.data.max_level
    this.seleceLevel = this.props.navigation.state.params.data.seleceLevel
    this.e_h_id = ''
    this.state = {
      topic_num_list: [],
      topicIndex: 0,
      m_e_s_id: '',
      currentTopic: '',
      explanation_height: 0,
      isWrong: false,
      clickFraction: false,
      tk_space_key: '',
      statisticsVisible: false,
      draftVisible: false,
      helpVisible: false,
      keyboard_y: 0,
      keyboard_height: 0,
      // showCorrectPrompt: false,

      topic_list:[]
    };
  }

  goBack = async () => {
    const status = await AsyncStorage.getItem("smartMathEasyCalculation");
    if (status === "1") {
      NavigationUtil.goBack(this.props);
      AsyncStorage.setItem("smartMathEasyCalculation", "0");
    } else {
      MathNavigationUtil.toMathEasyCalculationHomePage(this.props);
    }
  };

  componentDidMount() {
    this.getData()
  }

  componentWillUnmount() {
    DeviceEventEmitter.emit("refreshPage"); //返回页面刷新
  }

  getData = (isContinue) => {
    const { userInfo, textCode } = this.props
    const userInfoJs = userInfo.toJS();
    const { topicIndex } = this.state
    let obj = {
        textbook: textCode,
        grade_code: userInfoJs.checkGrade,
        term_code: userInfoJs.checkTeam,
        code: this.code,
    }
    if(this.seleceLevel && (!isContinue || isContinue === 'again')) obj.expand_level = this.seleceLevel
    axios.get(api.getExpandCalExercise, { params: obj }).then(
        res => {
          let data = res.data.data.data
        //   console.log('xxxxxxxxxx',res.data.data)
          let topic_num_list = []
          data.forEach(i => {
            i = changeTopicData(i,'easyCalculation')
            topic_num_list.push({
                m_e_s_id: i.m_e_s_id,
                correct:-1, //初始状态都设置为没有做
            })
          })
          let m_e_s_id = topic_num_list[topicIndex].m_e_s_id
          this.total = topic_num_list.length
          this.e_h_id = res.data.data.set_id
          this.exercise_type = res.data.data.exercise_type
          this.exercise_num = res.data.data.exercise_num
          this.expand_level = res.data.data.expand_level
          this.setState({
            topic_num_list,
            m_e_s_id,
            topic_list:data
          },()=>{
            if(m_e_s_id) this.getTopic()
          })
        }
    )
  }

  getTopic = () => {
    const { m_e_s_id, topicIndex,topic_list, } = this.state
    let topic_num_list = JSON.parse(JSON.stringify(this.state.topic_num_list))
    if (topic_num_list[topicIndex].topic) {
      if (topic_num_list[topicIndex].correct === -1) {
        // 表示当前题目没有提交就进行了跳转，要重置题目数据
        topic_num_list[topicIndex].topic = initTopicData(topic_num_list[topicIndex].topic)
      }
        this.setState({
            currentTopic: topic_num_list[topicIndex].topic,
            isWrong: false,
            topic_num_list
        })
        return
    }
    let currentTopic = topic_list.filter(i => {
        return i.m_e_s_id === m_e_s_id
    })[0]
    currentTopic._correct = topic_num_list[topicIndex].correct
    topic_num_list[topicIndex].topic = currentTopic
    this.setState({
        currentTopic,
        topic_num_list,
        isWrong: false
    })
  }

  clickItem = (item, index) => {
    this.setState({
      topicIndex: index,
      m_e_s_id: item.m_e_s_id,
      currentTopic: ''
    }, () => {
      this.getTopic()
    })
  }

  preOrNext = (type) => {
    const { topic_num_list } = this.state
    let index = type === 'pre' ? this.state.topicIndex - 1 : this.state.topicIndex + 1
    let item = topic_num_list[index]
    this.TopicNumsRef.clickItem(item, index)
  }

  clickSpace = (key, clickFraction) => {
    const { currentTopic } = this.state
    this.setState({
      tk_space_key: key,
      clickFraction
    }, () => {
      if (this.FranctionInputView) this.FranctionInputView.setInitdata(currentTopic.my_answer_tk_map[key])
    })
  }

  changeMyAnswerMap = (value) => {
    const { topicIndex } = this.state
    let topic_num_list = JSON.parse(JSON.stringify(this.state.topic_num_list))
    topic_num_list[topicIndex].topic.my_answer_tk_map = value
    this.setState({
      topic_num_list,
      currentTopic: topic_num_list[topicIndex].topic
    })
  }

  renderStem = () => {
    const { currentTopic, topic_num_list, topicIndex } = this.state
    const { displayed_type_name } = currentTopic
    let correct = topic_num_list[topicIndex].correct
    if (displayed_type_name === topaicTypes.Fill_Blank) {
      return <TopicStemTk my_style={style} correct={correct} data={currentTopic} onRef={(ref) => { this.TopicStemTk = ref }} changeMyAnswerMap={this.changeMyAnswerMap} clickSpace={this.clickSpace}></TopicStemTk>
    }
    if (displayed_type_name === topaicTypes.Calculation_Problem) {
      return <CalculationStem my_style={style} onRef={(ref) => { this.CalculationStem = ref }} correct={correct} data={currentTopic} changeMyAnswerMap={this.changeMyAnswerMap} clickSpace={this.clickSpace}></CalculationStem>
    }
    if (displayed_type_name === topaicTypes.Application_Questions) {
      return <ApplicationStem my_style={style} onRef={(ref) => { this.ApplicationStem = ref }} correct={correct} data={currentTopic} changeMyAnswerMap={this.changeMyAnswerMap} clickSpace={this.clickSpace}></ApplicationStem>
    }
    return <Stem my_style={style} data={currentTopic}></Stem>
  }

  checkOption = (value) => {
    const { topicIndex } = this.state
    let topic_num_list = JSON.parse(JSON.stringify(this.state.topic_num_list))
    topic_num_list[topicIndex].topic._my_answer = value
    this.setState({
      topic_num_list,
    })
  }

  renderOptions = () => {
    const { currentTopic } = this.state
    return <OptionView data={currentTopic} checkOption={this.checkOption}></OptionView>
  }

  changeValues = (value) => {
    const { clickFraction, currentTopic, tk_space_key } = this.state
    if (tk_space_key === -1) {
      Toast.info('请选择空格', 2);
      return
    }
    if (value === '分数') {
      this.setState({
        clickFraction: !clickFraction,
      }, () => {
        if (currentTopic.my_answer_tk_map[tk_space_key].isFraction) {
          if (this.FranctionInputView) this.FranctionInputView.setInitdata(currentTopic.my_answer_tk_map[tk_space_key]) //当有key值时点击分数回显答案
        }
      })
      return
    }
    if (clickFraction) {
      this.FranctionInputView.changeValues(value)
      return
    }
    if (currentTopic.displayed_type_name === topaicTypes.Calculation_Problem) {
      // 计算题
      this.CalculationStem.changeValues(value)
    }
    if (currentTopic.displayed_type_name === topaicTypes.Application_Questions) {
      // 应用题
      this.ApplicationStem.changeValues(value)
    }
    if (currentTopic.displayed_type_name === topaicTypes.Fill_Blank) {
      // 填空题
      this.TopicStemTk.changeValues(value)
    }
  }

  submit = () => {
    const {token} = this.props
    if(!token){
      NavigationUtil.resetToLogin(this.props);
      return
    }
    const { topic_num_list, topicIndex } = this.state
    let topic = topic_num_list[topicIndex].topic
    let _topic_num_list = JSON.parse(JSON.stringify(topic_num_list))
    // const { result, wrong_arr } = diagnosis(topic)

    let result = true
    let wrong_arr = []
    try {
        let res = diagnosis(topic)
        result = res.result
        wrong_arr = res.wrong_arr
    } catch(err) {
        console.log("诊断出错，题目算错",err);
        result = true
    }

    if (result) {
      PlayAudio.playSuccessSound(url.successAudiopath2)
      _topic_num_list[topicIndex].correct = 1
      _topic_num_list[topicIndex].topic._correct = 1
      this.setState({
        topic_num_list: _topic_num_list,
        // showCorrectPrompt: true
      }, () => {
        // setTimeout(() => {
        //   this.setState({
        //     showCorrectPrompt: false
        //   }, () => {
        //     this.next()
        //   })
        // }, 500)
      })
    } else {
      PlayAudio.playSuccessSound(url.failAudiopath)
      _topic_num_list[topicIndex].correct = 0
      _topic_num_list[topicIndex].topic._correct = 0
      this.wrong_ids.push(topic.m_e_s_id)
      if (wrong_arr) {
        this.setState({
          currentTopic: ''
        })
        // 填空题答案回显
        let my_answer_tk_map = topic.my_answer_tk_map
        wrong_arr.forEach((i, x) => {
          my_answer_tk_map[i].isWrong = true
        })
        _topic_num_list[topicIndex].topic.my_answer_tk_map = my_answer_tk_map
      }
      this.setState({
        topic_num_list: _topic_num_list,
        currentTopic: _topic_num_list[topicIndex].topic,   //设置题目是为了错误回显
        isWrong: true
      })
    }
    let answer = topic._my_answer ? topic._my_answer : ''
    if (topic._show_keyBoard) {
      // 表示用了键盘的那一类题
      answer = JSON.stringify(topic.my_answer_tk_map)
    }
    let data = {
        correction: result ? '1' : '0',
        e_h_id: this.e_h_id,
        e_c_id: topic.e_c_id,
        exercise_type: this.exercise_type,
        exercise_stem: topic.topic_type === '0' ? topic.exercise_stem : JSON.stringify(topic.exercise_stem),
        right_answer: topic.topic_type === '0' ? topic.right_answer : topic.right_answer?JSON.stringify(topic.right_answer):'',
        expand_level: topic.exercise_level,
        expand_code: topic.expand_code,
        suggested_time: topic.suggested_time,
        exercise_explanation: topic.topic_type === '0' ? topic.exercise_explanation :topic.exercise_explanation? JSON.stringify(topic.exercise_explanation):'',
        exercise_num: this.exercise_num,
        exercise_result:answer
    }
    this.saveData(data)
    console.log('诊断结果_____________________________________', result)
  }
  saveData = (data) => {
    // console.log('保存的数据', data)
    axios.post(api.saveExpandStudyrecord, data).then(res => {
      console.log('保存___________', res.data)
      if(data.correction === '1'){
        // 做对
        if(this.getTopicIndex() === -1){
          // 最后一题
          getRewardCoinLastTopic().then(res => {
            if(res.isReward){
              // 展示奖励弹框,在动画完后在弹统计框
              this.eventListener = DeviceEventEmitter.addListener(
                "rewardCoinClose",
                () => {
                  this.next()
                  this.eventListener && this.eventListener.remove()
                }
              );
            }else{
              this.next()
            }
          })
        }else{
          this.props.getRewardCoin()
          this.next()
        }
      }
    })
  }

  next = () => {
    const { topic_num_list } = this.state
    let next_topicIndex = this.getTopicIndex()
    this.setState({
      isWrong: false,
    }, () => {
      if (next_topicIndex === -1) {
        // 所有题做完
        this.wrong_ids = [...new Set(this.wrong_ids)]
        console.log('所有题做完，弹统计', this.wrong_ids,  this.max_level,this.expand_level)
        this.setState({
          statisticsVisible: true
        })
      } else {
        let item = topic_num_list[next_topicIndex]
        this.TopicNumsRef.clickItem(item, next_topicIndex)
      }
    })
  }

  getTopicIndex = () => {
    const { topicIndex, topic_num_list } = this.state
    let index = -1
    for (let i = 0; i < topic_num_list.length; i++) {
      if (topic_num_list[i].correct === -1 && i > topicIndex) {
        index = i
        return i
      }
      index = -1
    }
    if (index === -1) {
      // 当前题号往后没有未做完的题，所以要在往前找
      for (let i = 0; i < topic_num_list.length; i++) {
        if (topic_num_list[i].correct === -1 && i < topicIndex) {
          index = i
          return i
        }
        index = -1
      }
    }
    return index
  }

  onLayoutHeader = (e) => {
    let { height } = e.nativeEvent.layout;
    let explanation_height = windowHeight - height
    if (Platform.OS === 'android') {
      explanation_height = explanation_height - pxToDp(90)
    } else {
      explanation_height = explanation_height - pxToDpHeight(100)
    }
    this.setState({
      explanation_height
    })
  }

  confirm = (value) => {
    const { topic_num_list, topicIndex, tk_space_key } = this.state
    let _topic_num_list = JSON.parse(JSON.stringify(topic_num_list))
    if (value[2]) {
      // 带分数
      if (value[0].init_char_mat.length !== 0 || value[1].init_char_mat.length !== 0 || value[2].init_char_mat.length !== 0) {
        _topic_num_list[topicIndex].topic.my_answer_tk_map[tk_space_key] = value
        _topic_num_list[topicIndex].topic.my_answer_tk_map[tk_space_key].isFraction = true
      } else {
        _topic_num_list[topicIndex].topic.my_answer_tk_map[tk_space_key] = { init_char_mat: [], cursor_idx: -1 }
      }
    } else {
      // 分数
      if (value[0].init_char_mat.length !== 0 || value[1].init_char_mat.length !== 0) {
        _topic_num_list[topicIndex].topic.my_answer_tk_map[tk_space_key] = value
        _topic_num_list[topicIndex].topic.my_answer_tk_map[tk_space_key].isFraction = true
      } else {
        _topic_num_list[topicIndex].topic.my_answer_tk_map[tk_space_key] = { init_char_mat: [], cursor_idx: -1 }
      }
    }
    this.setState({
      topic_num_list: _topic_num_list,
      currentTopic: _topic_num_list[topicIndex].topic,
      clickFraction: false,
    }, () => {
      if (_topic_num_list[topicIndex].topic.displayed_type_name === topaicTypes.Fill_Blank) this.TopicStemTk.setInitdata(_topic_num_list[topicIndex].topic.my_answer_tk_map)   //分数答案时，点击分数在分数输入组件的数据回显
      if (_topic_num_list[topicIndex].topic.displayed_type_name === topaicTypes.Calculation_Problem) this.CalculationStem.setInitdata(_topic_num_list[topicIndex].topic.my_answer_tk_map)   //分数答案时，点击分数在分数输入组件的数据回显
      if (_topic_num_list[topicIndex].topic.displayed_type_name === topaicTypes.Application_Questions) this.ApplicationStem.setInitdata(_topic_num_list[topicIndex].topic.my_answer_tk_map)   //分数答案时，点击分数在分数输入组件的数据回显
    })
  }

  renderExplaination = () => {
    const { topic_num_list, currentTopic, topicIndex } = this.state
    const { displayed_type_name } = currentTopic
    if (displayed_type_name === topaicTypes.Application_Questions) {
      return <ApplicationExplanation my_style={style} data={currentTopic} correct={topic_num_list[topicIndex].correct}></ApplicationExplanation>
    }
    return <Explanation data={currentTopic} my_style={style}></Explanation>
  }

  showdraft = () => {
    this.setState({
      draftVisible: true
    })
  }

  onLayoutKeyBoard = (e) => {
    let { y, height } = e.nativeEvent.layout;
    this.setState(() => ({
      keyboard_y: y,
      keyboard_height: height - pxToDp(40), //40 container的padingbottom
    }));
  }

  continueTodoTopic = () => {
    this.total = 0
    this.wrong_ids = []
    this.setState({
      isWrong: false,
      statisticsVisible: false,
      topicIndex: 0,
      currentTopic:""
    },()=>{
        this.getData(true)
        this.TopicNumsRef.initIndex()
    })
  }

  tryAgain = () => {
    this.total = 0
    this.wrong_ids = []
    this.setState({
      isWrong: false,
      statisticsVisible: false,
      topicIndex: 0,
      currentTopic:""
    },()=>{
        this.getData('again')
        this.TopicNumsRef.initIndex()
    })
  }


  render() {
    const { topic_num_list, currentTopic, topicIndex, isWrong, clickFraction, statisticsVisible, draftVisible, helpVisible, keyboard_y, keyboard_height, explanation_height, showCorrectPrompt } = this.state
    const { displayed_type_name, _show_keyBoard, _show_options, _correct } = currentTopic
    console.log('当前题目', currentTopic)
    return (
      <ImageBackground style={[styles.container]} source={require('../../../../images/MathSyncDiagnosis/bg_1.png')}>
        <BackBtn goBack={this.goBack}></BackBtn>
        <TouchableOpacity style={[styles.caogao_btn]} onPress={this.showdraft}>
          <Image style={{ width: pxToDp(40), height: pxToDp(40) }} resizeMode="stretch" source={require('../../../../images/MathSyncDiagnosis/cg_icon.png')}></Image>
          <Text style={[{ color: "#246666", fontSize: pxToDp(32), marginLeft: pxToDp(4) }, appFont.fontFamily_jcyt_700]}>草稿</Text>
        </TouchableOpacity>
        <Text style={[styles.header]} onLayout={(e) => this.onLayoutHeader(e)}>{this.name}</Text>
        <View style={[appStyle.flexAliCenter, { marginBottom: pxToDp(28), paddingLeft: pxToDp(60), paddingRight: pxToDp(60) }]}>
          <TopicNums onRef={(ref) => { this.TopicNumsRef = ref; }} list={topic_num_list} clickItem={this.clickItem}></TopicNums>
        </View>
        <View style={[styles.content]}>
          {topic_num_list === 0 ? <View
            style={{
              position: "absolute",
              left: "53%",
              top: "40%",
            }}
          >
            <ActivityIndicator size={"large"} color={"#999999"} />
          </View> : <>
            <View style={[styles.content_inner, { paddingBottom: _show_keyBoard && topic_num_list[topicIndex].correct === -1 ? keyboard_height : pxToDp(36) }, appStyle.flexJusBetween]}>
              {isWrong && displayed_type_name === topaicTypes.Application_Questions ? null : <TouchableOpacity style={[styles.help_btn]} onPress={() => { this.setState({ helpVisible: true }) }}>
                <Image source={require('../../../../images/MathSyncDiagnosis/help_btn_1.png')} resizeMode='contain' style={{ width: pxToDp(100), height: pxToDp(100) }}></Image>
              </TouchableOpacity>}
              {currentTopic ? <>
                <View style={[styles.type]}>
                  <Text style={[styles.type_txt]}>{displayed_type_name}</Text>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: pxToDp(230), paddingRight: pxToDp(60) }}>
                  <View style={[{ paddingRight: pxToDp(50) }]}>
                    {this.renderStem()}
                  </View>
                  {_show_options ? this.renderOptions() : null}
                  {_correct !== -1 ? this.renderExplaination() : null}
                </ScrollView>
                {isWrong || _correct !== -1 ? <TouchableOpacity style={[styles.submit_btn, { backgroundColor: "#2278E9" }]} onPress={this.nextThrottle}>
                  <View style={[styles.submit_btn_inner, { backgroundColor: "#2697FF" }]}>
                    <Text style={[mathFont.txt_32_700, mathFont.txt_fff]}>下一题</Text>
                  </View>
                </TouchableOpacity> : _show_keyBoard ? null : <TouchableOpacity style={[styles.submit_btn]} onPress={this.submitThrottle}>
                  <View style={[styles.submit_btn_inner]}>
                    <Text style={[mathFont.txt_32_700, mathFont.txt_fff]}>提交</Text>
                  </View>
                </TouchableOpacity>}
              </> : null}
            </View>
          </>}
          {topicIndex === 0 ? null : <TouchableOpacity style={[styles.pre_btn]} onPress={() => { this.preOrNextThrottle('pre') }}>
            <View style={[styles.pre_btn_inner]}>
              <Image style={[{ width: pxToDp(16), height: pxToDp(80) }]} resizeMode='stretch' source={require('../../../../images/MathKnowledgeGraph/pre_icon_1.png')} ></Image>
            </View>
          </TouchableOpacity>}
          {topicIndex === topic_num_list.length - 1 ? null : <TouchableOpacity style={[styles.next_btn]} onPress={() => { this.preOrNextThrottle('next') }}>
            <View style={[styles.next_btn_inner]}>
              <Image style={[{ width: pxToDp(16), height: pxToDp(80) }]} resizeMode='stretch' source={require('../../../../images/MathKnowledgeGraph/next_icon_1.png')} ></Image>
            </View>
          </TouchableOpacity>}
        </View>
        {_show_keyBoard && topic_num_list[topicIndex].correct === -1 ? <View style={[styles.keyboard_wrap]} onLayout={(event) => this.onLayoutKeyBoard(event)}>
          <Keyboard currentTopic={currentTopic} changeValues={this.changeValues} onRef={(ref) => { this.Keyboard = ref }} submit={this.submitThrottle}></Keyboard>
        </View> : null}
        {isWrong && displayed_type_name === topaicTypes.Application_Questions ? <View style={[styles.explanation_wrap, { height: explanation_height, paddingLeft: pxToDp(0), paddingRight: pxToDp(0) }]}>
          <ApplicationFillBlank my_style={style} data={currentTopic} toNext={this.nextThrottle}></ApplicationFillBlank>
        </View> : null}
        {clickFraction ? <FranctionInputView onRef={(ref) => { this.FranctionInputView = ref }} confirm={this.confirm} top={keyboard_y} close={() => { this.setState({ clickFraction: false }) }}></FranctionInputView> : null}
        <StatisticsModal exercise_level={currentTopic.exercise_level} visible={statisticsVisible} close={() => {
          this.setState({
            statisticsVisible: false
          }, () => {
            this.goBack()
          })
        }} total={this.total} wrong={this.wrong_ids.length}
        tryAgain={this.tryAgain}
        continue={this.continueTodoTopic}
        isMax={(this.max_level === this.expand_level || this.max_level === this.seleceLevel) && this.wrong_ids.length === 0}
        content={(this.max_level === this.expand_level || this.max_level === this.seleceLevel) && this.wrong_ids.length === 0? '恭喜你已完成最高等级练习' : null}
        ></StatisticsModal>
        <ScribblingPadModal visible={draftVisible} toggleEvent={() => { this.setState({ draftVisible: false }) }} />
        <HelpModal visible={helpVisible} data={currentTopic} close={() => { this.setState({ helpVisible: false }) }}></HelpModal>
        {/* {showCorrectPrompt ? <CorrectPrompt></CorrectPrompt> : null} */}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? pxToDpHeight(10) : pxToDpHeight(60),
    paddingBottom: pxToDp(40)
  },
  header: {
    textAlign: 'center',
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(40),
    color: "#246666",
    marginBottom: pxToDp(40),
  },
  content: {
    flex: 1,
    paddingLeft: pxToDp(80),
    paddingRight: pxToDp(80),
    ...appStyle.flexJusCenter
  },
  content_inner: {
    flex: 1,
    paddingLeft: pxToDp(60),
    paddingTop: pxToDp(60),
    backgroundColor: "#fff",
    borderRadius: pxToDp(40),
  },
  caogao_btn: {
    position: 'absolute',
    top: Platform.OS === 'android' ? pxToDpHeight(20) : pxToDpHeight(40),
    right: pxToDp(20),
    zIndex: 1,
    backgroundColor: "rgba(36, 102, 102, 0.10)",
    width: pxToDp(140),
    height: pxToDp(80),
    borderRadius: pxToDp(40),
    ...appStyle.flexCenter,
    ...appStyle.flexLine
  },
  type: {
    position: 'absolute',
    top: 0,
    left: pxToDp(114),
    paddingLeft: pxToDp(54),
    paddingRight: pxToDp(54),
    backgroundColor: "#FFB74B",
    borderBottomLeftRadius: pxToDp(20),
    borderBottomRightRadius: pxToDp(20),
    height: pxToDp(48),
    ...appStyle.flexCenter
  },
  type_txt: {
    color: "#B26B00",
    fontSize: pxToDp(24),
    ...appFont.fontFamily_jcyt_500,
  },
  keyboard_wrap: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1
  },
  explanation_wrap: {
    position: "absolute",
    bottom: 0,
    width: windowWidth,
    backgroundColor: "#fff",
    borderTopLeftRadius: pxToDp(40),
    borderTopRightRadius: pxToDp(40),
    paddingTop: pxToDp(98),
    ...appStyle.flexJusBetween,
    paddingBottom: pxToDp(40)
  },
  explanation_btn_wrap: {
    width: windowWidth,
    ...appStyle.flexLine,
    ...appStyle.flexJusCenter,
  },
  pre_btn: {
    position: "absolute",
    left: 0,
    width: pxToDp(70),
    height: pxToDp(720),
  },
  pre_btn_inner: {
    width: pxToDp(40),
    height: '100%',
    backgroundColor: "#fff",
    borderTopRightRadius: pxToDp(40),
    borderBottomRightRadius: pxToDp(40),
    ...appStyle.flexCenter
  },
  next_btn: {
    position: "absolute",
    right: 0,
    width: pxToDp(70),
    height: pxToDp(720),
    ...appStyle.flexAliEnd
  },
  next_btn_inner: {
    width: pxToDp(40),
    height: '100%',
    backgroundColor: "#fff",
    borderTopLeftRadius: pxToDp(40),
    borderBottomLeftRadius: pxToDp(40),
    ...appStyle.flexCenter
  },
  help_btn: {
    position: 'absolute',
    right: pxToDp(-26),
    top: pxToDp(-26),
  },
  submit_btn: {
    position: 'absolute',
    width: pxToDp(200),
    height: pxToDp(200),
    borderRadius: pxToDp(100),
    backgroundColor: "#00836D",
    right: pxToDp(40),
    bottom: pxToDp(40)
  },
  submit_btn_inner: {
    width: pxToDp(200),
    height: pxToDp(192),
    backgroundColor: "#00B295",
    borderRadius: pxToDp(100),
    ...appStyle.flexCenter
  }
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    token: state.getIn(["userInfo", "token"]),
    textCode: state.getIn(["bagMath", "textBookCode"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    getRewardCoin() {
      dispatch(actionCreatorsUserInfo.getRewardCoin());
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(DoExercise);
