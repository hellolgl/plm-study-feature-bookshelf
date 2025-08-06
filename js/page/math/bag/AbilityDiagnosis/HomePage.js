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
} from "react-native";
import { appStyle } from "../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import ExplainModal from './components/ExplainModal'
import api from "../../../../util/http/api";
import axios from "../../../../util/http/axios";
import { Toast } from "antd-mobile-rn";


const btn_arr = [
    {
        bg:'#2F88FE',
        label:'查看已做'
    },
    {
        bg:'#F9793B',
        label:'开始检测' 
    },
    {
        bg:'#F9793B',
        label:'重新检测'  
    },
    {
        bg:'#F9B43B',
        label:'继续检测'
    }
]

class HomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.userInfo = props.userInfo.toJS();
    this.state = {
      list: [],
      currentIndex: 0,
      visible:false
    };
  }
  componentDidMount() {
    // console.log("TongbuMathSchoolHome didmount");
    this.getList()
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "refreshPage",
      (event) => {
        this.getList()
      }
    );
  }
  componentWillUnmount(){
    this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove()
  }
  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  getList = ()=>{
    const info = this.props.userInfo.toJS();
    let obj = {
        textbook:this.props.textCode,
        grade_code: info.checkGrade,
        term_code: info.checkTeam,
    }
    axios.get(api.getMathDiagnosisLesson, { params: obj}).then((res) => {
        let data = res.data.data
        this.setState({
            list:data
        })
    });
  }

  seeExplain = ()=>{
    this.setState({
        visible:true
    })
  }
  clickItem = (child,childIndex,item)=>{
    console.log('点击',child,item,childIndex)
    if(childIndex === 0){
        // 查看已做的题
        if(item.answer_count === 0){
            Toast.info('你还没有答题哟')
            return
        }
        let obj = {
            lesson_code:item.lesson_code,
            lesson_name:item.lesson_name
        }
        NavigationUtil.toMtahAbilityDiagnosisHis({
            ...this.props,
            data: { ...obj},
        });
        return
    }
    let obj = {
        origin:item.origin,
        lesson_code:item.lesson_code,
        lesson_name:item.lesson_name,
    }
    if(childIndex === 1 || childIndex === 2){
        console.log('开始检测或者做过题重新开始')
        obj.status = 0  //0重新开始 1继续作答
    }
    if(childIndex === 3){
        console.log('做过题,继续做')
        obj.status = 1
    }
    NavigationUtil.toMtahAbilityDiagnosisDoexercise({
        ...this.props,
        data: { ...obj},
    });
    
  }
  render() {
    const { list, visible, currentIndex } = this.state;
    return (
      <ImageBackground
        source={require("../../../../images/math_bg_1.png")}
        style={styles.mainWrap}
      >
        <TouchableOpacity style={[styles.back]} onPress={this.goBack}>
            <Image  style={{width:pxToDp(80),height:pxToDp(80)}} source={require('../../../../images/MathAbilityDiagnosis/back_btn.png')}></Image>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.explain]} onPress={this.seeExplain}>
            <Image  style={{width:pxToDp(158),height:pxToDp(60)}} source={require('../../../../images/MathAbilityDiagnosis/explain_icon.png')}></Image>
        </TouchableOpacity>
        <View style={[styles.header,appStyle.flexAliCenter]}>
            <ImageBackground style={[{width:pxToDp(829),height:pxToDp(100)},appStyle.flexCenter]} source={require('../../../../images/MathAbilityDiagnosis/header_bg.png')}>
                <Text style={{fontSize:pxToDp(40),color:"#fff"}}>复习巩固</Text>
            </ImageBackground>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
            {list.map((item,index)=>{
                return <ImageBackground key={index} style={{width:pxToDp(849),height:pxToDp(520),marginBottom:pxToDp(40)}} source={require('../../../../images/MathAbilityDiagnosis/item_bg.png')}>
                    <Text style={[styles.unit]}>{item.lesson_name}</Text>
                    <View style={[styles.btnWrap,appStyle.flexLine,appStyle.flexJusBetween,appStyle.flexCenter]}>
                        {btn_arr.map((i,x)=>{
                            if(item.status === 0 && item.refresh === 1 && x ===1 && item.all_count === 0){
                                // 可以答题，初始状态
                                return <TouchableOpacity style={[styles.btnItem,{backgroundColor:i.bg},appStyle.flexCenter]} key={x} onPress={()=>{this.clickItem(i,x,item)}}>
                                        <Text style={{color:'#FFFDF7',fontSize:pxToDp(32)}}>{i.label}</Text>
                                    </TouchableOpacity>
                            }
                            if(item.status === 0 && item.refresh === 1 && x !==1 && item.all_count > 0){
                                // 可以答题，点进去过一次，但是没有作答题目
                                return <TouchableOpacity style={[styles.btnItem,{backgroundColor:i.bg,marginRight:x === 3?0:pxToDp(32)},appStyle.flexCenter]} key={x} onPress={()=>{this.clickItem(i,x,item)}}>
                                        <Text style={{color:'#FFFDF7',fontSize:pxToDp(32)}}>{i.label}</Text>
                                    </TouchableOpacity>
                            }
                            if(item.status === 0 && item.refresh === 0 && x!== 1){
                                // 可以答题，不允许重新答题
                                return <TouchableOpacity style={[styles.btnItem,{backgroundColor:i.bg,marginRight:x === 3?0:pxToDp(32)},appStyle.flexCenter]} key={x} onPress={()=>{this.clickItem(i,x,item)}}>
                                        <Text style={{color:'#FFFDF7',fontSize:pxToDp(32)}}>{i.label}</Text>
                                    </TouchableOpacity>
                            }
                            if(item.status === 1 && item.refresh === 1 && x === 0){
                                // 这套题做完
                                return  <TouchableOpacity style={[styles.btnItem,{backgroundColor:i.bg},appStyle.flexCenter]} key={x} onPress={()=>{this.clickItem(i,x,item)}}>
                                    <Text style={{color:'#FFFDF7',fontSize:pxToDp(32)}}>{i.label}</Text>
                                </TouchableOpacity>
                            }
                        })}
                    </View>
                    <View style={[styles.statisticWrap,appStyle.flexLine,appStyle.flexJusBetween]}>
                        <View style={[styles.statisticItem,appStyle.flexAliCenter]}>
                            <Text style={[styles.txt1]}>{item.answer_count}</Text>
                            <Text style={[styles.txt2]}>已做题目</Text>
                        </View>
                        <View style={[styles.statisticItem,appStyle.flexAliCenter]}>
                            <Text style={[styles.txt1]}>{item.all_count - item.answer_count}</Text>
                            <Text style={[styles.txt2]}>剩余题目</Text>
                        </View>
                        <View style={[styles.statisticItem,appStyle.flexAliCenter]}>
                            <Text style={[styles.txt1]}>{item.answer_count?Math.round((item.right_count / item.answer_count) * 100):0}%</Text>
                            <Text style={[styles.txt2]}>准确率</Text>
                        </View>
                    </View>
                </ImageBackground>
            })}
        </ScrollView>
        <ExplainModal visible={visible} close={()=>{
            this.setState({visible:false})
            }}></ExplainModal>
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
  unit:{
    textAlign:"center",
    fontSize:pxToDp(36),
    color:'#fff',
    marginTop:pxToDp(40),
    paddingRight:pxToDp(40)
  },
  btnWrap:{
    paddingLeft:pxToDp(90),
    paddingRight:pxToDp(119),
    marginTop:pxToDp(81)
  },
  btnItem:{
    width:pxToDp(192),
    height:pxToDp(76),
    borderRadius:pxToDp(12)
  },
  statisticWrap:{
    paddingLeft:pxToDp(120),
    paddingRight:pxToDp(149),
    marginTop:pxToDp(30)
  },
  txt1:{
    color:'#2F88FE',
    fontSize:pxToDp(64),
    marginBottom:pxToDp(4)
  },
  txt2:{
    color:"#AAAAAA",
    fontSize:pxToDp(28)
  },
  explain:{
    position:'absolute',
    top:pxToDp(50),
    right:pxToDp(76),
    zIndex:1
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

export default connect(mapStateToProps, mapDispathToProps)(HomePage);
