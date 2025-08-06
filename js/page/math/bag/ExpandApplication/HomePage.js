import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  DeviceEventEmitter
} from "react-native";
import { appStyle } from "../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from 'react-redux';
import axios from '../../../../util/http/axios'
import api from '../../../../util/http/api'
import { Toast } from 'antd-mobile-rn';
import SelectContinueModal from '../../../../component/math/SelectContinueModal'
class HomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.eventListenerRefreshPage = undefined
    this.state = {
      list:[],
      wrong_count:0,
      visible:false,
      currentItem:{}
    };
  }
  componentDidMount() {
    this.getData()
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener('refreshPage', (event) => {
      this.getData()
    })
  }
  componentWillUnmount(){
    this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove()
  }
  getData = () => {
    const { userInfo, textCode } = this.props
    const userInfoJs = userInfo.toJS();
    let obj = {
      textbook: textCode,
      grade_code: userInfoJs.checkGrade,
      term_code: userInfoJs.checkTeam,
    }
    axios.get(api.getExpandApplicationType, { params: obj }).then(
      res => {
        this.setState({
          list:res.data.data.format_type,
          wrong_count:res.data.data.wrong_count
        })
      }
    )
  }
  goBack = () => {
    NavigationUtil.goBack(this.props);
  }
  toEasyCalculationStudyPage = (item)=>{
    MathNavigationUtil.toMathExpandApplicationStudyPage({...this.props,data:{name:item.name,code:item.practical_category}})
  }
  startTodo = (item)=>{
    if(item.status ==='0') return
    if(item.now_level === item.max_level){
      this.setState({
        currentItem:item,
        visible:true
      })
      return
    }
    MathNavigationUtil.toMathExpandApplicationDoExercise({...this.props,data:{name:item.name,practical_category:item.practical_category,max_level:item.max_level}})
  }
  startTodoGoOn = (item)=>{
    this.setState({
      visible:false
    },()=>{
      MathNavigationUtil.toMathExpandApplicationDoExercise({...this.props,data:{name:item.name,practical_category:item.practical_category,max_level:item.max_level}})
    })
  }
  goWrongPage = ()=>{
    const {wrong_count} = this.state
    if(wrong_count === 0){
      Toast.info('当前没有错题', 1);
      return
    }
    MathNavigationUtil.toMathExpandApplicationWrongExercise({...this.props})
  }
  render() {
    const {list,wrong_count,visible,currentItem} = this.state
    return (
      <ImageBackground source={require('../../../../images/homePageMath/base_bg.png')} style={styles.mainWrap}>
          <View style={[styles.header,appStyle.flexCenter]}>
            <TouchableOpacity  style={[styles.headerBack]} onPress={this.goBack}>
                <Image style={[{ width:pxToDp(80),height:pxToDp(80),}]} source={require('../../../../images/homePageMath/base_back.png')} resizeMode="contain"></Image>
            </TouchableOpacity>
            <Text style={[{fontSize:pxToDp(48),color:'#004D6F',fontWeight:'bold'}]}>拓展应用</Text>
            <TouchableOpacity style={[styles.wrongBtn,appStyle.flexLine,appStyle.flexCenter]} onPress={this.goWrongPage}>
                <Image style={[{width:pxToDp(48),height:pxToDp(48)}]} source={require('../../../../images/m_qs_icon.png')} resizeMode="contain"></Image>
                <Text style={{fontSize:pxToDp(28),marginLeft:pxToDp(8)}}>错题集</Text>
                {wrong_count === 0?null:<View style={[styles.wrongTotal,appStyle.flexCenter]}>
                  <Text style={[styles.wrongtxt]}>{wrong_count}</Text>
                </View>}
            </TouchableOpacity>
          </View>
          <ScrollView style={[styles.con]} contentContainerStyle={{flexDirection:'row',flexWrap:'wrap'}}>
            {list.map((item,index)=>{
              return <View key={index} style={[styles.conItem, index % 2 !== 0 ? { marginRight: 0 } : null,]}>
                <Text style={{fontSize:pxToDp(40),marginBottom:pxToDp(32)}}>{item.name}</Text>
                <View
                  style={[
                    appStyle.flexLine,
                    appStyle.flexJusBetween,
                    styles.haveBgcolorWrap,
                    { marginBottom: pxToDp(24) },
                  ]}
                >
                  <Text
                    style={{ fontSize: pxToDp(36), color: "#0179FF" }}
                  >
                    最高等级：{item.max_level}
                  </Text>
                    <Text
                      style={{ fontSize: pxToDp(36), color: "#77D102" }}
                    >
                      当前等级：{item.exercise_level}
                    </Text>
                </View>
                <TouchableOpacity
                  style={[
                    appStyle.flexLine,
                    appStyle.flexJusBetween,
                    styles.haveBgcolorWrap,
                    { marginBottom: pxToDp(32) },
                  ]}
                  onPress={() =>
                    this.toEasyCalculationStudyPage(item)
                  }
                >
                  <Text style={{ fontSize: pxToDp(32) }}>
                    <Image
                      style={{ width: pxToDp(48), height: pxToDp(48) }}
                      resizeMode={"contain"}
                      source={require("../../../../images/m_qs_xx.png")}
                    ></Image>
                    &nbsp;例题学习
                  </Text>
                  <Image
                    style={{ width: pxToDp(64), height: pxToDp(64) }}
                    resizeMode={"contain"}
                    source={require("../../../../images/homePageMath/m_tbts_icon2.png")}
                  ></Image>
                </TouchableOpacity>
                {/* 1解锁，0是未解锁 */}
                <TouchableOpacity
                  style={[
                    appStyle.flexLine,
                    appStyle.flexJusBetween,
                    styles.haveBgcolorWrap,
                    { marginBottom: pxToDp(32) },
                  ]}
                  onPress={() =>
                    this.startTodo(item)
                  }
                >
                  <Text style={{ fontSize: pxToDp(32) }}>
                    <Image
                      style={{ width: pxToDp(48), height: pxToDp(48) }}
                      resizeMode={"contain"}
                      source={require("../../../../images/tongbuzd_zt.png")}
                    ></Image>
                    &nbsp;开始练习
                  </Text>
                  <Image
                    style={{ width: pxToDp(64), height: pxToDp(64) }}
                    resizeMode={"contain"}
                    source={item.status === '1'? require("../../../../images/homePageMath/m_tbts_icon2.png"):require("../../../../images/tongbuzd_zt_grey.png")}
                  ></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    appStyle.flexLine,
                    appStyle.flexJusBetween,
                    styles.haveBgcolorWrap,
                    { marginBottom: pxToDp(32) },
                  ]}
                >
                  <Text style={{ fontSize: pxToDp(32) }}>
                    <Image
                      style={{ width: pxToDp(48), height: pxToDp(48) }}
                      resizeMode={"contain"}
                      source={require("../../../../images/tongbuzd_ls.png")}
                    ></Image>
                    &nbsp;答题记录
                  </Text>
                  <Image
                    style={{ width: pxToDp(64), height: pxToDp(64) }}
                    resizeMode={"contain"}
                    source={require("../../../../images/homePageMath/m_tbts_icon2.png")}
                  ></Image>
                </TouchableOpacity>
                <View
                  style={[
                    appStyle.flexLine,
                    appStyle.flexJusBetween,
                    styles.haveBgcolorWrap,
                    { marginBottom: pxToDp(24) },
                  ]}
                >
                  <Text
                    style={{ fontSize: pxToDp(36), color: "#0179FF" }}
                  >
                    已答题目：
                    {item.answer_count
                      ? item.right_count + "/" + item.answer_count
                      : "0/0"}
                  </Text>
                  {item.answer_count ? (
                    <Text
                      style={{ fontSize: pxToDp(36), color: "#0179FF" }}
                    >
                      正确率：
                      {(
                        (Number(item.right_count) /
                          Number(item.answer_count)) *
                        100
                      ).toFixed(2)}
                      %
                    </Text>
                  ) : null}
                </View>
              </View>
            })}
          </ScrollView>
          <SelectContinueModal visible={visible} close={()=>{this.setState({visible:false})}} goOn={()=>{this.startTodoGoOn(currentItem)}}></SelectContinueModal>
      </ImageBackground>    
    );
  }
}
const styles = StyleSheet.create({
    mainWrap: {
        flex:1,
        paddingTop: pxToDp(40),
        paddingRight: pxToDp(48),
        paddingBottom: pxToDp(48),
        paddingLeft: pxToDp(48),
    },
    header: {
        height:pxToDp(80),
        position:'relative',
        marginBottom:pxToDp(32)
    },
    headerBack:{
        position:'absolute',
        left:0
    },
    wrongBtn:{
      position:'absolute',
      right:0,
      backgroundColor:'#fff',
      width:pxToDp(180),
      height:pxToDp(80),
      borderRadius:pxToDp(16)
    },
    wrongTotal:{
      width:pxToDp(40),
      height:pxToDp(40),
      borderRadius:pxToDp(20),
      backgroundColor:'#FF700A',
      position:'absolute',
      right:-10,
      top:-3,
    },
    wrongtxt:{
      fontSize:pxToDp(20),
      color:'#fff',
    },
    con:{
      // marginTop:pxToDp(40)
    },
    haveBgcolorWrap: {
      height: pxToDp(100),
      backgroundColor: "#EEF6FF",
      borderRadius: pxToDp(16),
      paddingLeft: pxToDp(26),
      paddingRight: pxToDp(26),
    },
    conItem:{
      width: pxToDp(955),
      backgroundColor: "#fff",
      marginRight: pxToDp(40),
      marginBottom: pxToDp(40),
      borderRadius: pxToDp(32),
      padding: pxToDp(40),
    }
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(['userInfo', 'currentUserInfo']),
    textCode: state.getIn(['bagMath', 'textBookCode'])
  }
}

const mapDispathToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispathToProps)(HomePage)
