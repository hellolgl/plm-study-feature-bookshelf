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
  DeviceEventEmitter,
  Modal
} from "react-native";
import { appFont, appStyle,mathFont,mathTopicStyle } from "../../../../theme";
import { pxToDp, pxToDpHeight } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import TopicNums from '../../../../component/math/Topic/TopicNums'
import * as _ from "lodash";
import {changeTopicData,initTopicData,selectTopicData} from '../../tools'
import Stem from '../../../../component/math/Topic/Stem'
import Keyboard from '../../../../component/math/Keyboard/Keyboard'
import topaicTypes from '../../../../res/data/MathTopaicType'
import TopicStemTk from '../../../../component/math/Topic/TopicStemTk'
import {diagnosis} from '../../MathDiagnosis'
import Explanation from '../../../../component/math/Topic/Explanation'
import FranctionInputView from '../../../../component/math/FractionalRendering/FranctionInputView'
import CalculationStem from '../../../../component/math/Topic/CalculationStem'
import { Toast } from "antd-mobile-rn";
import OptionView from '../../../../component/math/Topic/OptionView'
import ScribblingPadModal from "../../../../util/draft/ScribblingPadModal"
import HelpModal from "../../../../component/math/Topic/HelpModal";
import CorrectPrompt from '../../../../component/math/Topic/CorrectPrompt'
import BackBtn from "../../../../component/math/BackBtn";
import StatisticModal from './components/StatisticModal'
import * as childrenCreators from "../../../../action/children"
import StatisticsModal from '../../../../component/math/StatisticsModal'
import Congrats from '../../../../component/Congrats'
import * as actionCreatorsUserInfo from "../../../../action/userInfo";
import {getRewardCoinLastTopic} from '../../../../util/coinTools'
import PlayAudio from "../../../../util/audio/playAudio";
import url from "../../../../util/url";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

let style = mathTopicStyle['1']


class DoExercise extends PureComponent {
  constructor(props) {
    super(props);
    this.TopicNumsRef = null
    this.Keyboard = null
    this.TopicStemTk = null
    this.FranctionInputView = null
    this.CalculationStem = null
    this.s_h_id = ''
    this.total = 0
    this.preOrNextThrottle = _.debounce(this.preOrNext, 300);
    this.submitThrottle = _.debounce(this.submit, 300);
    this.nextThrottle = _.debounce(this.next, 300);
    this.wrong_ids = []
    this.is_star = false //是否获得星星
    this.eventListener = undefined
    this.state = {
      topic_num_list:[],
      topicIndex:0,
      ex_id:'',
      currentTopic:'',
      isWrong:false,
      clickFraction:false,
      tk_space_key:'',
      statisticsVisible:false,
      draftVisible:false,
      helpVisible:false,
      page_data:{},
      language_data:{},
      keyboard_y:0,
      // showCorrectPrompt:false,
      keyboard_height:0,
      nextKnowledge:'',
      isUp:false,
      nextKnowledgeName:'',
      levelType:'', //0降级 1升级
      upData:{},
      noUpTopic:'',
      finish:false,
    };
  }

  static getDerivedStateFromProps(props, state){
    let tempState = { ...state };
    let language_data = props.language_data.toJS()
    const { show_type } = language_data
    const {main_language_map,other_language_map,type} = language_data
    const {knowledge_name,language_knowledge_name} = props.navigation.state.params.data
    if(type !== tempState.language_data.type){
        console.log('切换语言',language_data)
        let page_base_data = {
          back_z:main_language_map.back,
          back_c:other_language_map.back,
          draft_z:main_language_map.draft,
          draft_c:other_language_map.draft,
          submit_z:main_language_map.submit,
          submit_c:other_language_map.submit,
          next_z:main_language_map.next,
          next_c:other_language_map.next,
          ok_z:main_language_map.ok,
          ok_c:other_language_map.ok
        }
        let page_variable_data = {}
        if (show_type === '1') {
          // 中文为主
          page_variable_data = {
            element_name_z: knowledge_name,
            element_name_c: language_knowledge_name,
          }
        }
        if (show_type === '2') {
          // 英文为主
          page_variable_data = {
            element_name_z: language_knowledge_name,
            element_name_c: knowledge_name
          }
        }
        tempState.page_data = {...page_base_data,...page_variable_data}
        tempState.language_data = JSON.parse(JSON.stringify(language_data))
        return tempState
    }
    return null
  }

  componentDidMount() {
    this.getData()
  }

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  componentWillUnmount(){
    const {swiperIndex,current_unit} = this.props.navigation.state.params.data
    DeviceEventEmitter.emit("refreshPage",{current_unit,swiperIndex}); //返回页面刷新
    DeviceEventEmitter.emit("refreshStatus"); //返回页面刷新
    DeviceEventEmitter.emit("refreshProgress"); //返回页面刷新 从时间线进入答题
  }

  getData = () => {
    const {knowledge_code,status,origin,knowledge_name} = this.props.navigation.state.params.data
    const {topicIndex} = this.state
    const {isGrade} = this.props.userInfo.toJS()
    let data = {
        knowledge_code,
        origin,
        status,
        knowledge_name
    };
    if(!isGrade) data.category_type = '1'
    axios.get(api.getMathKGIndex, { params: data }).then((res) => {
      let data = res.data.data.data
      this.total = data.length
      this.s_h_id = res.data.data.s_h_id
      this.is_star = res.data.data.is_star
      let ex_id = ''
      let _topicIndex = topicIndex
      if(data.length > 0){
        if(status === 0){
          // 继续作答
          data.forEach(i=>{
            if(i.correct === 0) this.wrong_ids.push(i.ex_id)
          })
          for(let i = 0 ; i<data.length ; i++){
            if(data[i].correct === -1){
              _topicIndex = i
              break
            }
          }
        }
        ex_id = data[_topicIndex].ex_id
      }
      this.setState({
        topic_num_list:data,
        ex_id,
        topicIndex:_topicIndex
      },()=>{
        if(status ===  0){
          let item = data[_topicIndex]
          this.TopicNumsRef.clickItem(item,_topicIndex)
          return
        }
        if(ex_id) this.getTopic()
      })
    })
  }

  getTopic = () => {
    const {ex_id,topicIndex,language_data,isUp} = this.state
    let topic_num_list = JSON.parse(JSON.stringify(this.state.topic_num_list))
    let data = {
      language:language_data.trans_language,
      ex_id,
      s_h_id:this.s_h_id
    }
    if(topic_num_list[topicIndex].topic){
      if(topic_num_list[topicIndex].correct === -1){
        // 表示当前题目没有提交就进行了跳转，要重置题目数据
        topic_num_list[topicIndex].topic = initTopicData(topic_num_list[topicIndex].topic)
      }
      this.setState({
        currentTopic:topic_num_list[topicIndex].topic,
        isWrong:false,
        topic_num_list
      })
      return
    }
    axios.get(api.getMathKGTopic, { params: data }).then((res) => {
      let data = res.data.data
      let currentTopic = selectTopicData(data,language_data)
      currentTopic._correct = topic_num_list[topicIndex].correct
      topic_num_list[topicIndex].topic = currentTopic
      if(isUp){
        // ai提升重新拿题,可能拿到曾经做过的保存有答案的题目，这里要初始化一下
        currentTopic = initTopicData(currentTopic)
      }
      this.setState({
        currentTopic,
        topic_num_list,
        isWrong:false
      })
    });
  }

  clickItem = (item,index) => {
    this.setState({
      topicIndex:index,
      ex_id:item.ex_id,
      currentTopic:''
    },()=>{
      this.getTopic()
    })
  }

  preOrNext = (type) => {
    const {topic_num_list} = this.state
    let index = type === 'pre'?this.state.topicIndex - 1:this.state.topicIndex + 1
    let item = topic_num_list[index]
    this.TopicNumsRef.clickItem(item,index)
  }

  clickSpace = (key,clickFraction)=>{
    const {currentTopic} = this.state
    this.setState({
      tk_space_key:key,
      clickFraction
    },()=>{
      if(this.FranctionInputView) this.FranctionInputView.setInitdata(currentTopic.my_answer_tk_map[key])
    })
  }

  changeMyAnswerMap = (value) =>{
    const {topicIndex} = this.state
    let topic_num_list = JSON.parse(JSON.stringify(this.state.topic_num_list))
    topic_num_list[topicIndex].topic.my_answer_tk_map = value
    this.setState({
      topic_num_list,
      currentTopic:topic_num_list[topicIndex].topic
    })
  }

  renderStem = () => {
    const {currentTopic,topic_num_list,topicIndex,language_data} = this.state
    const {displayed_type_name} = currentTopic
    const {show_main,show_translate} = language_data
    let correct = topic_num_list[topicIndex].correct
    if(displayed_type_name === topaicTypes.Fill_Blank){
      return <>
        {show_main?<TopicStemTk my_style={style} correct={correct} data={currentTopic} onRef={(ref)=>{this.TopicStemTk = ref}} changeMyAnswerMap={this.changeMyAnswerMap} clickSpace={this.clickSpace}></TopicStemTk>:null}
        {show_translate?<View style={[Platform.OS === 'ios'?{marginTop:pxToDp(20)}:null]}>
          <TopicStemTk my_style={style} correct={0} data={currentTopic} onlySee={true} translate={true}></TopicStemTk>
        </View>:null}
      </>
    }
    if(displayed_type_name === topaicTypes.Calculation_Problem){
      return <>
        {show_main?<CalculationStem my_style={style} onRef={(ref)=>{this.CalculationStem = ref}} correct={correct} data={currentTopic} changeMyAnswerMap={this.changeMyAnswerMap} clickSpace={this.clickSpace}></CalculationStem>:null}
        {show_translate?<View style={[Platform.OS === 'ios'?{marginTop:pxToDp(20)}:null]}>
          <CalculationStem my_style={style} correct={0} data={currentTopic} onlySee={true} translate={true}></CalculationStem>
        </View>:null}
      </>
    }
    return <>
      {show_main?<Stem my_style={style} data={currentTopic}></Stem>:null}
      {show_translate?<View style={[Platform.OS === 'ios'?{marginTop:pxToDp(20)}:null]}>
        <Stem my_style={style} data={currentTopic} translate={true}></Stem>
      </View>:null}
    </>
    
  }

  checkOption = (value)=>{
    const {topicIndex} = this.state
    let topic_num_list = JSON.parse(JSON.stringify(this.state.topic_num_list))
    topic_num_list[topicIndex].topic._my_answer = value
    this.setState({
      topic_num_list,
    })
  }

  renderOptions = () => {
    const {currentTopic} = this.state
    return <OptionView data={currentTopic} checkOption={this.checkOption}></OptionView>
  }

  changeValues = (value)=>{
    const {clickFraction,currentTopic,tk_space_key} = this.state
    if(tk_space_key === -1){
      Toast.info('请选择空格',2);
      return
    }
    if(value === '分数'){
      this.setState({
        clickFraction:!clickFraction,
      },()=>{
        if(currentTopic.my_answer_tk_map[tk_space_key].isFraction){
          if(this.FranctionInputView) this.FranctionInputView.setInitdata(currentTopic.my_answer_tk_map[tk_space_key]) //当有key值时点击分数回显答案
        }
      })
      return
    }
    if(clickFraction){
      this.FranctionInputView.changeValues(value)
      return
    }
    if(currentTopic.displayed_type_name === topaicTypes.Calculation_Problem){
      // 计算题
      this.CalculationStem.changeValues(value)
    }
    if(currentTopic.displayed_type_name === topaicTypes.Fill_Blank){
      // 填空题
      this.TopicStemTk.changeValues(value)
    }
  }

  submit = () =>{
    const {token} = this.props
    if(!token){
      NavigationUtil.resetToLogin(this.props);
      return
    }
    const {topic_num_list,topicIndex} = this.state
    let topic = topic_num_list[topicIndex].topic
    let _topic_num_list = JSON.parse(JSON.stringify(topic_num_list))
    const {result,wrong_arr} = diagnosis(topic)
    if(result){
      PlayAudio.playSuccessSound(url.successAudiopath2)
      _topic_num_list[topicIndex].correct = 1
      _topic_num_list[topicIndex].topic._correct = 1
      this.setState({
        topic_num_list:_topic_num_list,
        // showCorrectPrompt:true
      },()=>{
        // setTimeout(()=>{
        //   this.setState({
        //     showCorrectPrompt:false
        //   },()=>{
        //     this.next()
        //   })
        // },500)
      })
    }else{
      PlayAudio.playSuccessSound(url.failAudiopath)
      _topic_num_list[topicIndex].correct = 0
      _topic_num_list[topicIndex].topic._correct = 0
      this.wrong_ids.push(topic.ex_id)
      if(wrong_arr){
        this.setState({
          currentTopic:''
        })
        // 填空题答案回显
        let my_answer_tk_map = topic.my_answer_tk_map
        wrong_arr.forEach((i,x)=>{
          my_answer_tk_map[i].isWrong = true
        })
        _topic_num_list[topicIndex].topic.my_answer_tk_map = my_answer_tk_map
      }
      this.setState({
        topic_num_list:_topic_num_list,
        currentTopic:_topic_num_list[topicIndex].topic,   //设置题目是为了错误回显
        isWrong:true
      })
    }
    let answer = topic._my_answer?topic._my_answer:''
    if(topic._show_keyBoard){
      // 表示用了键盘的那一类题
      answer = JSON.stringify(topic.my_answer_tk_map)
    }
    let data = {
      s_h_id:this.s_h_id,
      ex_id:topic.ex_id,
      answer,
      correct:result?1:0
    }
    this.saveData(data)
    console.log('诊断结果_____________________________________',result)
  }

  saveData = (data) =>{
    const {topic_num_list} = this.state
    const {isGrade} = this.props.userInfo.toJS()
    const {origin,knowledge_code,knowledge_name} = this.props.navigation.state.params.data
    let obj = {...data}
    obj.origin = origin
    obj.knowledge_code = knowledge_code
    if(!isGrade){
      // 幼小衔接需要增加的参数
      const finishNum = topic_num_list.filter(i => {
        return i.correct !== -1
      }).length
      this.wrong_ids = [...new Set(this.wrong_ids)]
      if(finishNum === topic_num_list.length){
        // 最后一题
        obj.knowledge_name = knowledge_name
        obj.all_count = topic_num_list.length
        obj.right_count = finishNum - this.wrong_ids.length
        obj.is_finish = '1'
      }
    }
    axios.post(api.saveMathKGTopic, obj).then((res) => {
        console.log('保存————————————————————————',res.data,obj)
        if(data.correct === 1){
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
    });
  }

  next = ()=>{
    const {topic_num_list} = this.state
    let next_topicIndex = this.getTopicIndex()
    this.setState({
      isWrong:false
    },()=>{
      if(next_topicIndex === -1){
        // 所有题做完
        this.setState({
          finish:true
        },()=>{
          this.wrong_ids = [...new Set(this.wrong_ids)]
          console.log('所有题做完，弹统计')
          const {userInfo} = this.props
          const {isGrade} = userInfo.toJS()
          if(!isGrade){
            if(!this.wrong_ids.length){
              // 全答对
              if(this.is_star){
                this.setState({
                  statisticsVisible:true
                })
              }else{
                this.props.getStars('knowledge')
              }
            }else{
              this.setState({
                statisticsVisible:true
              })
            }
          }else{
            // 小学阶段直接弹统计
            this.setState({
              statisticsVisible:true
            })
          }   
        })
      }else{
        let item = topic_num_list[next_topicIndex]
        this.TopicNumsRef.clickItem(item,next_topicIndex)
      }
    })
  }

  getTopicIndex = () => {
    const {topicIndex,topic_num_list} = this.state
    let index = -1
    for(let i = 0; i<topic_num_list.length; i++ ){
      if(topic_num_list[i].correct === -1 && i>topicIndex){
        index = i
        return i
      }
      index = -1
    }
    if(index === -1){
      // 当前题号往后没有未做完的题，所以要在往前找
      for(let i = 0; i<topic_num_list.length; i++ ){
        if(topic_num_list[i].correct === -1 && i < topicIndex){
          index = i
          return i
        }
        index = -1
      }
    }
    return index
  }

  confirm = (value) => {
    const {topic_num_list,topicIndex,tk_space_key} = this.state
    let _topic_num_list = JSON.parse(JSON.stringify(topic_num_list))
    if(value[2]){
      // 带分数
      if(value[0].init_char_mat.length !== 0 || value[1].init_char_mat.length !== 0 || value[2].init_char_mat.length !== 0){
        _topic_num_list[topicIndex].topic.my_answer_tk_map[tk_space_key] = value
        _topic_num_list[topicIndex].topic.my_answer_tk_map[tk_space_key].isFraction = true
      }else{
        _topic_num_list[topicIndex].topic.my_answer_tk_map[tk_space_key] = {init_char_mat:[],cursor_idx:-1}
      }
    }else{
      // 分数
      if(value[0].init_char_mat.length !== 0 || value[1].init_char_mat.length !== 0){
        _topic_num_list[topicIndex].topic.my_answer_tk_map[tk_space_key] = value
        _topic_num_list[topicIndex].topic.my_answer_tk_map[tk_space_key].isFraction = true
      }else{
        _topic_num_list[topicIndex].topic.my_answer_tk_map[tk_space_key] = {init_char_mat:[],cursor_idx:-1}
      }
    }
    this.setState({
      topic_num_list:_topic_num_list,
      currentTopic: _topic_num_list[topicIndex].topic,
      clickFraction:false,
    },()=>{
      if(_topic_num_list[topicIndex].topic.displayed_type_name === topaicTypes.Fill_Blank) this.TopicStemTk.setInitdata(_topic_num_list[topicIndex].topic.my_answer_tk_map)   //分数答案时，点击分数在分数输入组件的数据回显
      if(_topic_num_list[topicIndex].topic.displayed_type_name === topaicTypes.Calculation_Problem) this.CalculationStem.setInitdata(_topic_num_list[topicIndex].topic.my_answer_tk_map)   //分数答案时，点击分数在分数输入组件的数据回显
    })
  }

  showdraft = () =>{
    this.setState({
      draftVisible:true
    })
  }

  onLayoutKeyBoard = (e) =>{
    let { y,height } = e.nativeEvent.layout;
    this.setState(() => ({
        keyboard_y: y,
        keyboard_height: height - pxToDp(40), //40 container的padingbottom
    }));
  }

  upLevel = () => {
    const {topic_num_list,nextKnowledge} = this.state
    const {knowledge_code,origin} = this.props.navigation.state.params.data
    const finishNum = topic_num_list.filter(i => {
      return i.correct !== -1
    }).length
    const correctNum =  topic_num_list.filter(i => {
      return i.correct === 1
    }).length
    // console.log('题目总数:::::::',this.total,halfNum)
    // console.log('做了的题目数量:::::::',finishNum)
    // console.log('答对的题：：：：：',correctNum)
    const params = {
      knowledge_code:nextKnowledge?nextKnowledge:knowledge_code,
      origin,
      exercise_count:this.total,
      completed_count:finishNum,
      right_count:correctNum,
      textbook:this.props.textCode
    }
    // console.log('请求参数:::::::',params)
    axios.get(api.getImproveElementTopic, { params }).then(res => {
      // console.log('+++++++++',res.data.data)
      const res_knowledge_code = res.data.data.knowledge_code
      const preKnowledge = nextKnowledge
      this.setState({
        levelType:res.data.data.is_up,
        upData:res.data.data,
        noUpTopic:(res_knowledge_code === preKnowledge) || (!preKnowledge && res_knowledge_code === knowledge_code) || !res_knowledge_code //时间轴往上没有题了，返回数据没有knowledge_code，时间轴往下没有题了，返回数据的knowledge_code会等于上一个knowledge_code,首次就选择了最高的等级，preKnowledge是空
      })
    })
  }

  clickOk = () => {
    const {upData,levelType,noUpTopic} = this.state
    if(noUpTopic){
      this.setState({
        levelType:''
      })
      return
    }
    if(levelType){
      // 可以进行升级降级的操作
      this.s_h_id = upData.s_h_id
      let data = upData.data
      const res_knowledge_code = upData.knowledge_code
      this.total = data.length
      if(data.length > 0){
        let ex_id = data[0].ex_id
        this.setState({
          topic_num_list:data,
          ex_id,
          topicIndex:0,
          nextKnowledge:res_knowledge_code,
          nextKnowledgeName:upData.knowledge_name,
          isUp:true,
          levelType:''
        },()=>{
          let item = data[0]
          this.TopicNumsRef.clickItem(item,0)
          this.getTopic()
          this.wrong_ids = []
        })
      }
    }
  }

  tryAgain = () => {
    let topic_num_list = JSON.parse(JSON.stringify(this.state.topic_num_list))
    topic_num_list.forEach((i,x) => {
      topic_num_list[x].topic = initTopicData(i.topic)
      i.correct = -1
      i.topic._correct = -1
    })
    this.setState({
      topic_num_list,
      topicIndex:0,
      levelType:''
    },()=>{
      let item = topic_num_list[0]
      this.TopicNumsRef.clickItem(item,0)
      this.getTopic()
      this.wrong_ids = []
    })
  }

  render() {
    const {topic_num_list,currentTopic,topicIndex,isWrong,clickFraction,statisticsVisible,draftVisible,helpVisible,page_data,language_data,keyboard_y,showCorrectPrompt,keyboard_height,nextKnowledgeName,levelType,upData,noUpTopic} = this.state
    const {displayed_type_name,_show_keyBoard,_show_options,displayed_type_name_c,_correct,displayed_type_name_z} = currentTopic
    const {show_main,show_translate,main_language_map,other_language_map} = language_data
    const {draft_z,draft_c,submit_z,submit_c,next_z,next_c,ok_z,ok_c,element_name_z,element_name_c} = page_data
    const {userInfo} = this.props
    const {isGrade} = userInfo.toJS()
    console.log('当前题目',currentTopic)
    return (
      <ImageBackground style={[styles.container]} source={require('../../../../images/MathSyncDiagnosis/bg_1.png')}>
        <BackBtn goBack={this.goBack}></BackBtn>
        <TouchableOpacity style={[styles.caogao_btn]} onPress={this.showdraft}>
          <Image style={{width:pxToDp(40),height:pxToDp(40)}} resizeMode="stretch" source={require('../../../../images/MathSyncDiagnosis/cg_icon.png')}></Image>
          {show_main?<Text style={[{marginLeft:pxToDp(10),marginRight:pxToDp(8)},mathFont.txt_32_700,mathFont.txt_246666]}>{draft_z}</Text>:null} 
          {show_translate?<Text style={[mathFont.txt_24_500,mathFont.txt_006868]}>{draft_c}</Text>:null} 
        </TouchableOpacity>
        <View style={[appStyle.flexAliCenter,{marginBottom:Platform.OS === 'android'? pxToDp(10):pxToDp(20)}]}>
          {/* 点了ai提升后有nextKnowledgeName数据，但是暂时没有翻译，只有显示中文 */}
          {nextKnowledgeName?<Text style={[mathFont.txt_32_700, mathFont.txt_4C4C59, { marginBottom: Platform.OS === 'ios' ? pxToDp(6) : pxToDp(-10) }]}>{nextKnowledgeName}</Text>:<>
          {show_main ? <Text style={[mathFont.txt_32_700, mathFont.txt_4C4C59, { marginBottom: Platform.OS === 'ios' ? pxToDp(6) : pxToDp(-10) }]}>{element_name_z}</Text> : null}
          {show_translate ? <Text style={[mathFont.txt_24_500, mathFont.txt_A5A5AC, { lineHeight: pxToDp(34) }]}>{element_name_c}</Text> : null}
          </>}
        </View>
        <View style={[appStyle.flexAliCenter,{
              marginBottom: pxToDp(38),
              paddingLeft: pxToDp(60),
              paddingRight: pxToDp(60),
            },]}>
          <TopicNums onRef={(ref) => {this.TopicNumsRef = ref;}} list={topic_num_list} clickItem={this.clickItem}></TopicNums>
        </View>
        <View style={[styles.content]}>
          {topic_num_list === 0?<View
            style={{
                position: "absolute",
                left: "53%",
                top: "40%",
            }}
        >
            <ActivityIndicator size={"large"} color={"#999999"}/>
        </View>:<>
          <View style={[styles.content_inner,{paddingBottom:_show_keyBoard && topic_num_list[topicIndex].correct === -1?keyboard_height:pxToDp(36)},appStyle.flexJusBetween]}>
            <TouchableOpacity style={[styles.help_btn]} onPress={()=>{this.setState({helpVisible:true})}}>
              <Image source={require('../../../../images/MathSyncDiagnosis/help_btn_1.png')} resizeMode='contain' style={{width:pxToDp(100),height:pxToDp(100)}}></Image>
            </TouchableOpacity>
            {currentTopic?<>
            <View style={[styles.type]}>
               {show_main?<Text style={[mathFont.txt_24_500,mathFont.txt_fff]}>{main_language_map[displayed_type_name]}</Text>:null} 
               {show_translate? <Text style={[mathFont.txt_24_500,mathFont.txt_fff,{marginLeft:pxToDp(20)}]}>{other_language_map[displayed_type_name]}</Text>:null}
            </View>
            <ScrollView contentContainerStyle={{paddingBottom:pxToDp(230),paddingRight:pxToDp(60)}}>
              <View style={[{paddingRight:pxToDp(50),marginTop:Platform.OS ==='android'? pxToDp(20):pxToDp(30)}]}>
                {this.renderStem()}
              </View>
              {_show_options?this.renderOptions():null}
              {_correct !== -1?<Explanation data={currentTopic} my_style={style} correct={topic_num_list[topicIndex].correct}></Explanation>:null}
            </ScrollView>
            {isWrong || _correct !== -1?<TouchableOpacity style={[styles.submit_btn,{backgroundColor:"#2278E9"}]} onPress={this.nextThrottle}>
              <View style={[styles.submit_btn_inner,{backgroundColor:"#2697FF"}]}>
                {show_main?<Text style={[mathFont.txt_32_700,mathFont.txt_fff]}>{next_z}</Text>:null}
                {show_translate?<Text style={[mathFont.txt_24_500,mathFont.txt_fff]}>{next_c}</Text>:null}
              </View>
            </TouchableOpacity>:_show_keyBoard?null:<TouchableOpacity style={[styles.submit_btn]} onPress={this.submitThrottle}>
              <View style={[styles.submit_btn_inner]}>
                {show_main?<Text style={[mathFont.txt_32_700,mathFont.txt_fff,{marginBottom:Platform.OS === 'android'?pxToDp(-20):pxToDp(10)}]}>{submit_z}</Text>:null}
                {show_translate?<Text style={[mathFont.txt_24_500,mathFont.txt_fff]}>{submit_c}</Text>:null}
              </View>
            </TouchableOpacity>}
            </>:null}
          </View>
        </>}
        {topicIndex === 0?null:<TouchableOpacity style={[styles.pre_btn]} onPress={()=>{this.preOrNextThrottle('pre')}}>
          <View style={[styles.pre_btn_inner]}>
              <Image style={[{width:pxToDp(16),height:pxToDp(80)}]} resizeMode='stretch' source={require('../../../../images/MathKnowledgeGraph/pre_icon_1.png')} ></Image>
          </View>
        </TouchableOpacity>}
        {topicIndex === topic_num_list.length - 1 ?null:<TouchableOpacity style={[styles.next_btn]} onPress={()=>{this.preOrNextThrottle('next')}}>
          <View style={[styles.next_btn_inner]}>
              <Image style={[{width:pxToDp(16),height:pxToDp(80)}]} resizeMode='stretch' source={require('../../../../images/MathKnowledgeGraph/next_icon_1.png')} ></Image>
          </View>
        </TouchableOpacity>}
        </View>
        {_show_keyBoard && topic_num_list[topicIndex].correct === -1?<View style={[styles.keyboard_wrap]} onLayout={(event) => this.onLayoutKeyBoard(event)}>
          <Keyboard currentTopic={currentTopic} changeValues={this.changeValues} onRef={(ref)=>{this.Keyboard = ref}} submit={this.submitThrottle}></Keyboard>
        </View>:null}
        {clickFraction?<FranctionInputView onRef={(ref)=>{this.FranctionInputView = ref}} translate={true} confirm={this.confirm} top={keyboard_y} close={()=>{this.setState({clickFraction:false})}}></FranctionInputView>:null}
        {isGrade? <StatisticModal visible={statisticsVisible} total={this.total} wrong={this.wrong_ids.length} levelType={levelType} upLevel={this.upLevel} noUpTopic={noUpTopic} close={()=>{
          this.setState({
            statisticsVisible:false
          },()=>{
            this.goBack()
          })
        }} confirm={(isTryAgain)=>{
          this.setState({
            statisticsVisible:false
          },()=>{
            isTryAgain?this.tryAgain():this.clickOk()
          })
        }} ></StatisticModal>:
        <StatisticsModal visible={statisticsVisible} close={()=>{
            this.setState({
            statisticsVisible:false
          },()=>{
            this.goBack()
          })
        }} total={this.total} wrong={this.wrong_ids.length} translate={true}></StatisticsModal>}
        <ScribblingPadModal visible={draftVisible} toggleEvent={()=>{this.setState({draftVisible:false})}}/>
        <HelpModal visible={helpVisible} data={currentTopic} close={()=>{this.setState({helpVisible:false})}}></HelpModal>
        {/* {showCorrectPrompt?<CorrectPrompt translate={true}></CorrectPrompt>:null} */}
        <Congrats finish={()=>{
          this.setState({
            statisticsVisible:true
          })
        }}></Congrats> 
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingBottom:pxToDp(40),
    paddingTop: Platform.OS === "android" ? pxToDpHeight(10) : pxToDpHeight(40),
  },
  content:{
    flex:1,
    paddingLeft:pxToDp(80),
    paddingRight:pxToDp(80),
    ...appStyle.flexJusCenter
  },
  content_inner:{
    flex:1,
    paddingLeft:pxToDp(60),
    paddingTop:pxToDp(60),
    backgroundColor:"#fff",
    borderRadius:pxToDp(40),
  },
  caogao_btn:{
    ...appStyle.flexLine,
    position: "absolute",
    top: Platform.OS === "android" ? pxToDpHeight(20) : pxToDpHeight(40),
    right: pxToDp(20),
    zIndex: 1,
  },
  type:{
    position:'absolute',
    top:0,
    left:pxToDp(114),
    paddingLeft:pxToDp(54),
    paddingRight:pxToDp(54),
    backgroundColor:"#00B295",
    borderBottomLeftRadius:pxToDp(20),
    borderBottomRightRadius:pxToDp(20),
    height:pxToDp(48),
    ...appStyle.flexCenter,
    ...appStyle.flexLine
  },
  keyboard_wrap:{
    position:'absolute',
    bottom:0,
    zIndex:1
  },
  explanation_btn_wrap:{
    width:windowWidth,
    ...appStyle.flexLine,
    ...appStyle.flexJusCenter,
  },
  pre_btn:{
    position:"absolute",
    left:0,
    width:pxToDp(70),
    height:pxToDp(820),
  },
  pre_btn_inner:{
    width:pxToDp(40),
    height:'100%',
    backgroundColor:"#fff",
    borderTopRightRadius:pxToDp(40),
    borderBottomRightRadius:pxToDp(40),
    ...appStyle.flexCenter
  },
  next_btn:{
    position:"absolute",
    right:0,
    width:pxToDp(70),
    height:pxToDp(820),
    ...appStyle.flexAliEnd
  },
  next_btn_inner:{
    width:pxToDp(40),
    height:'100%',
    backgroundColor:"#fff",
    borderTopLeftRadius:pxToDp(40),
    borderBottomLeftRadius:pxToDp(40),
    ...appStyle.flexCenter
  },
  help_btn:{
    position:'absolute',
    right:pxToDp(-26),
    top:pxToDp(-26),
    zIndex:1
  },
  submit_btn:{
    position:'absolute',
    width:pxToDp(200),
    height:pxToDp(200),
    borderRadius:pxToDp(100),
    backgroundColor:"#00836D",
    right:pxToDp(40),
    bottom:pxToDp(40)
  },
  submit_btn_inner:{
    width:pxToDp(200),
    height:pxToDp(192),
    backgroundColor:"#00B295",
    borderRadius:pxToDp(100),
    ...appStyle.flexCenter
  },
  mContainer:{
    flex:1,
    backgroundColor:"rgba(76, 76, 89, .6)",
    ...appStyle.flexCenter
  },
  mContent:{
    width:pxToDp(800),
    borderRadius:pxToDp(40),
    backgroundColor:"#D9E2F2",
    paddingBottom:pxToDp(10)
  },
  mContentInner:{
    backgroundColor:"#fff",
    padding:pxToDp(40),
    ...appStyle.flexAliCenter,
    borderRadius:pxToDp(40),
  },
  mClose_btn:{
    width:pxToDp(400),
    height:pxToDp(110),
    backgroundColor:"#00836D",
    paddingBottom:pxToDp(6),
    borderRadius:pxToDp(40),
    marginTop:pxToDp(40)
  },
  mClose_btn_inner:{
    flex:1,
    backgroundColor:"#00B295",
    borderRadius:pxToDp(40),
    ...appStyle.flexCenter
  }
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    token: state.getIn(["userInfo", "token"]),
    textCode: state.getIn(["bagMath", "textBookCode"]),
    language_data: state.getIn(["languageMath", "language_data"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    getStars(data) {
      dispatch(childrenCreators.getStars(data));
    },
    getRewardCoin() {
      dispatch(actionCreatorsUserInfo.getRewardCoin());
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(DoExercise);
