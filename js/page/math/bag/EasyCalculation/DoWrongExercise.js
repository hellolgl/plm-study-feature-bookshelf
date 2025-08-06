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
  Dimensions,
  DeviceEventEmitter
} from "react-native";
import { appFont, appStyle ,mathTopicStyle,mathFont} from "../../../../theme";
import { pxToDp, pxToDpHeight } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import * as _ from "lodash";
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
import ApplicationStem from '../../../../component/math/Topic/ApplicationStem'
import ApplicationFillBlank from '../../../../component/math/Topic/ApplicationFillBlank'
import ApplicationExplanation from '../../../../component/math/Topic/ApplicationExplanation'
import ScribblingPadModal from "../../../../util/draft/ScribblingPadModal"
import HelpModal from "../../../../component/math/Topic/HelpModal";
import CorrectPrompt from '../../../../component/math/Topic/CorrectPrompt'
import BackBtn from "../../../../component/math/BackBtn";
let style = mathTopicStyle['2']
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


class DoExercise extends PureComponent {
  constructor(props) {
    super(props);
    this.TopicNumsRef = null
    this.Keyboard = null
    this.TopicStemTk = null
    this.FranctionInputView = null
    this.CalculationStem = null
    this.ApplicationStem = null
    this.sde_id = ''
    this.total = 0
    this.submitThrottle = _.debounce(this.submit, 300);
    this.exercise_ids = []
    this.state = {
      exercise_id:'',
      currentTopic:JSON.parse(JSON.stringify(props.navigation.state.params.data.currentTopic)),
      explanation_height:0,
      isWrong:false,
      clickFraction:false,
      tk_space_key:'',
      draftVisible:false,
      helpVisible:false,
      submitVisible:false,
      keyboard_y:0,
      keyboard_height:0,
      showCorrectPrompt:false,
    };
  }

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

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
    let _c = JSON.parse(JSON.stringify(this.state.currentTopic))
    _c.my_answer_tk_map = value
    this.setState({
      currentTopic:_c
    })
  }

  renderStem = () => {
    const {currentTopic} = this.state
    const {displayed_type_name} = currentTopic
    const {onlySeeExplain} = this.props.navigation.state.params.data
    let correct = currentTopic._correct
    let onlySee = false
    if(onlySeeExplain) onlySee = true
    if(displayed_type_name === topaicTypes.Fill_Blank){
      return <TopicStemTk my_style={style} correct={correct} onlySee={onlySee} data={currentTopic} onRef={(ref)=>{this.TopicStemTk = ref}} changeMyAnswerMap={this.changeMyAnswerMap} clickSpace={this.clickSpace}></TopicStemTk>
    }
    if(displayed_type_name === topaicTypes.Calculation_Problem){
      return <CalculationStem my_style={style} onlySee={onlySee} onRef={(ref)=>{this.CalculationStem = ref}} correct={correct} data={currentTopic} changeMyAnswerMap={this.changeMyAnswerMap} clickSpace={this.clickSpace}></CalculationStem>
    }
    if(displayed_type_name === topaicTypes.Application_Questions){
      return <ApplicationStem my_style={style} onlySee={onlySee} onRef={(ref)=>{this.ApplicationStem = ref}} correct={correct} data={currentTopic} changeMyAnswerMap={this.changeMyAnswerMap} clickSpace={this.clickSpace}></ApplicationStem>
    }
    return <Stem data={currentTopic} my_style={style}></Stem>
  }

  checkOption = (value)=>{
    let _c = JSON.parse(JSON.stringify(this.state.currentTopic))
    _c._my_answer = value
    this.setState({
      currentTopic:_c
    })
  }

  renderOptions = () => {
    const {onlySeeExplain} = this.props.navigation.state.params.data
    const {currentTopic} = this.state
    let onlySee = false
    if(onlySeeExplain) onlySee = true
    return <>
      <OptionView data={currentTopic} checkOption={this.checkOption} onlySee={onlySee}></OptionView>
    </>
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
    if(currentTopic.displayed_type_name === topaicTypes.Application_Questions){
      // 应用题
      this.ApplicationStem.changeValues(value)
    }
    if(currentTopic.displayed_type_name === topaicTypes.Fill_Blank){
      // 填空题
      this.TopicStemTk.changeValues(value)
    }
  }

  submit = () =>{
    const {currentTopic} = this.state
    let topic = JSON.parse(JSON.stringify(currentTopic))
    // const {result,wrong_arr} = diagnosis(topic)

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

    if(result){
      topic._correct = 1
      this.setState({
        showCorrectPrompt:true
      },()=>{
        setTimeout(()=>{
          this.setState({
            showCorrectPrompt:false
          },()=>{
            this.saveData()
          })
        },1000)
      })
    }else{
      topic._correct = 0
      if(wrong_arr){
        this.setState({
          currentTopic:''
        })
        // 填空题答案回显
        let my_answer_tk_map = topic.my_answer_tk_map
        wrong_arr.forEach((i,x)=>{
          my_answer_tk_map[i].isWrong = true
        })
        topic.my_answer_tk_map = my_answer_tk_map
      }
      this.setState({
        isWrong:true
      })
    }
    this.setState({
      currentTopic:topic,
    })
    console.log('诊断结果_____________________________________',result)
  }

  saveData = () =>{
    const {currentTopic} = this.state
      // 答对了才保存
    console.log('单题保存数据',{e_w_id:currentTopic.e_w_id})
    axios.get(api.saveExpandWrongRecord, {params:{e_w_id:currentTopic.e_w_id}}).then((res) => {
      console.log('保存————————————————————————',res.data, {e_w_id:currentTopic.e_w_id})
      if(res.data.err_code === 0){
        DeviceEventEmitter.emit("refreshWrongPage");
      }
    });
  }

  onLayoutHeader = (e) => {
    let {height } = e.nativeEvent.layout;
    let explanation_height = windowHeight - height
    if(Platform.OS === 'android'){
      explanation_height = explanation_height - pxToDp(90)
    }else{
      explanation_height = explanation_height - pxToDpHeight(100)
    }
    this.setState({
      explanation_height
    })
  }

  confirm = (value) => {
    const {tk_space_key,currentTopic} = this.state
    let topic = JSON.parse(JSON.stringify(currentTopic))
    if(value[2]){
      // 带分数
      if(value[0].init_char_mat.length !== 0 || value[1].init_char_mat.length !== 0 || value[2].init_char_mat.length !== 0){
        topic.my_answer_tk_map[tk_space_key] = value
        topic.my_answer_tk_map[tk_space_key].isFraction = true
      }else{
        topic.my_answer_tk_map[tk_space_key] = {init_char_mat:[],cursor_idx:-1}
      }
    }else{
      // 分数
      if(value[0].init_char_mat.length !== 0 || value[1].init_char_mat.length !== 0){
        topic.my_answer_tk_map[tk_space_key] = value
        topic.my_answer_tk_map[tk_space_key].isFraction = true
      }else{
        topic.my_answer_tk_map[tk_space_key] = {init_char_mat:[],cursor_idx:-1}
      }
    }
    this.setState({
      currentTopic: topic,
      clickFraction:false,
    },()=>{
      if(topic.displayed_type_name === topaicTypes.Fill_Blank) this.TopicStemTk.setInitdata(topic.my_answer_tk_map)   //分数答案时，点击分数在分数输入组件的数据回显
      if(topic.displayed_type_name === topaicTypes.Calculation_Problem) this.CalculationStem.setInitdata(topic.my_answer_tk_map)   //分数答案时，点击分数在分数输入组件的数据回显
      if(topic.displayed_type_name === topaicTypes.Application_Questions) this.ApplicationStem.setInitdata(topic.my_answer_tk_map)   //分数答案时，点击分数在分数输入组件的数据回显
    })
  }

  tryAgain = () => {
    this.setState({
      currentTopic:'',
    })
    setTimeout(()=>{
      this.setState({
        isWrong:false,
        currentTopic:JSON.parse(JSON.stringify(this.props.navigation.state.params.data.currentTopic)),
      })
    },100)
  }

  renderExplaination = () => {
    const {currentTopic} = this.state
    const {displayed_type_name,_correct} = currentTopic
    if(displayed_type_name === topaicTypes.Application_Questions){
      return <ApplicationExplanation my_style={style} data={currentTopic} correct={_correct}></ApplicationExplanation>
    }
    return <Explanation data={currentTopic} my_style={style} correct={_correct}></Explanation>
  }

  showdraft = () =>{
    this.setState({
      draftVisible:true
    })
  }

  submitWork = () => {
    this.setState({
      submitVisible:true
    })
  }
  onLayoutKeyBoard = (e) =>{
    let { y,height } = e.nativeEvent.layout;
    this.setState(() => ({
      keyboard_y: y,
      keyboard_height: height - pxToDp(40), //40 container的padingbottom,
    }));
  }
  
  render() {
    const {currentTopic,isWrong,clickFraction,draftVisible,helpVisible,keyboard_y,keyboard_height,explanation_height,showCorrectPrompt} = this.state
    const {displayed_type_name,_show_keyBoard,_show_options,_correct} = currentTopic
    const {onlySeeExplain} = this.props.navigation.state.params.data
    console.log('当前题目',currentTopic)
    return (
      <ImageBackground style={[styles.container]} source={require('../../../../images/MathSyncDiagnosis/bg_1.png')}>
        <BackBtn goBack={this.goBack}></BackBtn>
        <TouchableOpacity style={[styles.caogao_btn]} onPress={this.showdraft}>
          <Image style={{width:pxToDp(40),height:pxToDp(40)}} resizeMode="stretch" source={require('../../../../images/MathSyncDiagnosis/cg_icon.png')}></Image>
          <Text style={[{color:"#246666",fontSize:pxToDp(32),marginLeft:pxToDp(4)},appFont.fontFamily_jcyt_700]}>草稿</Text>
        </TouchableOpacity>
        <Text style={[styles.header]} onLayout={(e) => this.onLayoutHeader(e)}>{onlySeeExplain?'错题查看':'巧算错题'}</Text>
        <View style={[styles.content]}>
          <View style={[styles.content_inner,{paddingBottom:_show_keyBoard && _correct === -1?keyboard_height:pxToDp(36)},appStyle.flexJusBetween]}>
            {isWrong && displayed_type_name === topaicTypes.Application_Questions?null:<TouchableOpacity style={[styles.help_btn]} onPress={()=>{this.setState({helpVisible:true})}}>
              <Image source={require('../../../../images/MathSyncDiagnosis/help_btn_1.png')} resizeMode='contain' style={{width:pxToDp(100),height:pxToDp(100)}}></Image>
            </TouchableOpacity>}
            {currentTopic?<>
            <View style={[styles.type]}>
              <Text style={[styles.type_txt]}>{displayed_type_name}</Text>
            </View>
            <ScrollView contentContainerStyle={{paddingBottom:pxToDp(230),paddingRight:pxToDp(60)}}>
              <View style={[{paddingRight:pxToDp(50)}]}>
                {this.renderStem()}
              </View>
              {_show_options?this.renderOptions():null}
              {_correct !== -1?this.renderExplaination():null}
            </ScrollView>
            {onlySeeExplain?null:isWrong || _correct !== -1?<TouchableOpacity style={[styles.submit_btn,{backgroundColor:"#2278E9"}]} onPress={this.tryAgain}>
              <View style={[styles.submit_btn_inner,{backgroundColor:"#2697FF"}]}>
                <Text style={[mathFont.txt_32_700,mathFont.txt_fff]}>再练一次</Text>
              </View>
            </TouchableOpacity>:_show_keyBoard?null:<TouchableOpacity style={[styles.submit_btn]} onPress={this.submitThrottle}>
              <View style={[styles.submit_btn_inner]}>
                <Text style={[mathFont.txt_32_700,mathFont.txt_fff]}>提交</Text>
              </View>
            </TouchableOpacity>}
            </>:null}
          </View>
        </View>
        {_show_keyBoard && currentTopic._correct === -1?<View style={[styles.keyboard_wrap]} onLayout={(event) => this.onLayoutKeyBoard(event)}>
          <Keyboard currentTopic={currentTopic} changeValues={this.changeValues} onRef={(ref)=>{this.Keyboard = ref}} submit={this.submitThrottle}></Keyboard>
        </View>:null}
        {isWrong && displayed_type_name === topaicTypes.Application_Questions?<View style={[styles.explanation_wrap,{height:explanation_height,paddingLeft:pxToDp(0),paddingRight:pxToDp(0)}]}>
          <ApplicationFillBlank  my_style={style} doWrong={true} data={currentTopic} tryAgain={this.tryAgain} goBack={this.goBack}></ApplicationFillBlank>
        </View>:null}
        {clickFraction?<FranctionInputView onRef={(ref)=>{this.FranctionInputView = ref}} confirm={this.confirm} top={keyboard_y} close={()=>{this.setState({clickFraction:false})}}></FranctionInputView>:null}
        <ScribblingPadModal visible={draftVisible} toggleEvent={()=>{this.setState({draftVisible:false})}}/>
        <HelpModal visible={helpVisible} data={currentTopic} close={()=>{this.setState({helpVisible:false})}}></HelpModal>
        {showCorrectPrompt?<CorrectPrompt></CorrectPrompt>:null}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingTop:Platform.OS === 'android'?pxToDpHeight(10):pxToDpHeight(60),
    paddingBottom:pxToDp(40)
  },
  header:{
    textAlign:'center',
    ...appFont.fontFamily_jcyt_700,
    fontSize:pxToDp(40),
    color:"#246666",
    marginBottom:pxToDp(40),
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
    position:'absolute',
    top:Platform.OS === 'android'?pxToDpHeight(20):pxToDpHeight(40),
    right:pxToDp(20),
    zIndex:1,
    backgroundColor:"rgba(36, 102, 102, 0.10)",
    width:pxToDp(140),
    height:pxToDp(80),
    borderRadius:pxToDp(40),
    ...appStyle.flexCenter,
    ...appStyle.flexLine
  },
  type:{
    position:'absolute',
    top:0,
    left:pxToDp(114),
    paddingLeft:pxToDp(54),
    paddingRight:pxToDp(54),
    backgroundColor:"#FFB74B",
    borderBottomLeftRadius:pxToDp(20),
    borderBottomRightRadius:pxToDp(20),
    height:pxToDp(48),
    ...appStyle.flexCenter
  },
  type_txt:{
    color:"#B26B00",
    fontSize:pxToDp(24),
    ...appFont.fontFamily_jcyt_500,
  },
  keyboard_wrap:{
    position:'absolute',
    bottom:0,
    zIndex:1
  },
  explanation_wrap:{
    position:"absolute",
    bottom:0,
    width:windowWidth,
    backgroundColor:"#fff",
    borderTopLeftRadius:pxToDp(40),
    borderTopRightRadius:pxToDp(40),
    paddingTop:pxToDp(98),
    ...appStyle.flexJusBetween,
    paddingBottom:pxToDp(40)
  },
  explanation_btn_wrap:{
    width:windowWidth,
    ...appStyle.flexLine,
    ...appStyle.flexJusCenter,
  },
  help_btn:{
    position:'absolute',
    right:pxToDp(-26),
    top:Platform.OS === 'android'?pxToDp(-26):pxToDp(-20)
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
  }
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    textCode: state.getIn(["bagMath", "textBookCode"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(DoExercise);
