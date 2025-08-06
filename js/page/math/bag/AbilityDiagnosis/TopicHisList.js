import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  DeviceEventEmitter,
  ScrollView,
  Platform,

} from "react-native";
import { appStyle } from "../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import api from "../../../../util/http/api";
import axios from "../../../../util/http/axios";
import TopicSteam from "../../../../component/math/Topic/TopicSteam";
import { Toast,Modal } from "antd-mobile-rn";
import Explanation1 from "../../../../component/math/Topic/Explanation1";
import * as actionCreators from "../../../../action/math/bag/index";
import ChioceNormal from "../../../../component/math/Topic/ChioceNormal";


class RecordList extends PureComponent {
  constructor(props) {
    super(props);
    this.userInfo = props.userInfo.toJS();
    this.lesson_code = this.props.navigation.state.params.data.lesson_code
    this.state = {
      list: [],
      visible:false,
      currentTopic:{}
    };
  }
  componentDidMount() {
    this.getList()
  }
  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  getList = ()=>{
    let obj = {
        lesson_code:this.lesson_code,
        page_index:1,
        page_size:50
    }
    axios.get(api.getMathDiagnosisRecordList, { params: obj}).then((res) => {
        let data = res.data.data
        data.forEach((i,x)=>{
          if(i.exercise_data_type === 'FS'){
            i.public_exercise_stem = JSON.parse(i.public_exercise_stem)
          }
        })
        this.setState({
            list:data
        })
    });
  }
  seeExplain = (item)=>{
    axios.get(api.getMathDiagnosisTopicDetails, { params: {m_e_s_id:item.m_e_s_id}}).then((res) => {
      this,this.setState({
        currentTopic:actionCreators.normalTopicChange(res.data.data),
        visible:true
      })
    });
  }
  showChoice = (currentTopaicData) => {
    return <ChioceNormal currentTopaicData={currentTopaicData}></ChioceNormal>;
  };
  render() {
    const { list, visible,currentTopic } = this.state;
    return (
      <ImageBackground
        source={require("../../../../images/math_bg_1.png")}
        style={styles.mainWrap}
      >
        <TouchableOpacity style={[styles.back]} onPress={this.goBack}>
            <Image  style={{width:pxToDp(80),height:pxToDp(80)}} source={require('../../../../images/MathAbilityDiagnosis/back_btn.png')}></Image>
        </TouchableOpacity>
        <View style={[styles.header,appStyle.flexAliCenter]}>
            <ImageBackground style={[{width:pxToDp(829),height:pxToDp(100)},appStyle.flexCenter]} source={require('../../../../images/MathAbilityDiagnosis/header_bg.png')}>
                <Text style={{fontSize:pxToDp(40),color:"#fff"}}>能力诊断</Text>
            </ImageBackground>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
            {list.map((item,index)=>{
                return <ImageBackground key={index} style={[styles.item]} source={require('../../../../images/MathAbilityDiagnosis/item_bg_2.png')}>
                  <View style={{height:pxToDp(250),overflow:'hidden'}}>
                      <TopicSteam data={item} width={pxToDp(660)}></TopicSteam>
                  </View>
                  <View style={[styles.bottomBtnWrap]}>
                    <TouchableOpacity style={[styles.correctBtn,appStyle.flexLine,appStyle.flexCenter,{backgroundColor:item.correct === '0'?'#EBF6F0':'#FEEBEB'}]}>
                      <Image style={{width:pxToDp(27),height:pxToDp(27),marginRight:pxToDp(20)}} source={item.correct === '0'?require('../../../../images/MathAbilityDiagnosis/dui.png'):require('../../../../images/MathAbilityDiagnosis/cuo.png')}></Image>
                      <Text style={[{fontSize:pxToDp(32),color:item.correct === '0'?'#42AC71':'#CB3533'}]}>{item.correct === '0'?'答题正确':'答题错误'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.see,appStyle.flexLine,appStyle.flexCenter]} onPress={()=>{this.seeExplain(item)}}>
                      <Image style={[{width:pxToDp(36),height:pxToDp(36),marginRight:pxToDp(20)}]} source={require('../../../../images/MathAbilityDiagnosis/explainBtn_icon.png')}></Image>
                      <Text style={{fontSize:pxToDp(32),color:"#FFFDF7"}}>查看解析</Text>
                    </TouchableOpacity>
                  </View>

                </ImageBackground>
            })}
        </ScrollView>
        <Modal
          animationType="slide"
          visible={visible}
          transparent
          style={[
            { width: "100%", height: "100%", backgroundColor: "transaparent" },
            appStyle.flexCenter,
          ]}
        >
          <View style={[styles.explanationWrap]}> 
            <ScrollView >
              <TopicSteam data={currentTopic} width={pxToDp(1700)}></TopicSteam>
              {currentTopic.choice_content ? this.showChoice(currentTopic) : null}
              <Text style={{marginTop:pxToDp(24),fontSize:pxToDp(48),fontWeight:'bold'}}>解析:</Text>
              <Explanation1 currentTopaicData={currentTopic} width={pxToDp(1700)}></Explanation1>
            </ScrollView>
            <View style={[appStyle.flexAliEnd]}>
              <TouchableOpacity style={[styles.close,appStyle.flexCenter,appStyle.flexCenter]} onPress={()=>{this.setState({visible:false})}}>
                <Text style={{fontSize:pxToDp(32),color:'#fff'}}>关闭</Text>
              </TouchableOpacity>
            </View>
          </View>
        
        </Modal>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
    position:'relative'
  },
  back:{
    position:'absolute',
    top:pxToDp(40),
    left:pxToDp(40),
    zIndex:1
  },
  content:{
    paddingLeft:pxToDp(120),
    paddingRight:pxToDp(120),
    ...appStyle.flexLine,
    ...appStyle.flexJusBetween,
    ...appStyle.flexLineWrap,
    marginTop:pxToDp(40),
    paddingBottom:pxToDp(40)
  },
  item:{
    position:'relative',
    width:pxToDp(850),
    height:pxToDp(570),
    marginBottom:pxToDp(40),
    paddingTop:pxToDp(90),
    paddingLeft:pxToDp(90),
    paddingRight:pxToDp(90),
    paddingBottom:pxToDp(140)
  },
  bottomBtnWrap:{
    ...appStyle.flexLine,
    ...appStyle.flexJusBetween,
    marginTop:pxToDp(20)
  },
  correctBtn:{
    width:pxToDp(328),
    height:pxToDp(76),
    borderRadius:pxToDp(12)
  },
  see:{
    width:pxToDp(328),
    height:pxToDp(76),
    borderRadius:pxToDp(12),
    backgroundColor:"#2F88FE"
  },
  explanationWrap:{
    width:pxToDp(1900),
    height:Platform.OS === 'android'?pxToDp(900):pxToDp(1200),
    backgroundColor:"#fff",
    borderRadius:pxToDp(32),
    padding:pxToDp(32),
  },
  close:{
    backgroundColor:'#2F88FE',
    borderRadius:pxToDp(40),
    width:pxToDp(200),
    height:pxToDp(80),
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

export default connect(mapStateToProps, mapDispathToProps)(RecordList);
