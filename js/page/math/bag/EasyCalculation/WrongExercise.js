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
  DeviceEventEmitter,
  Modal
} from "react-native";
import { appFont, appStyle, mathTopicStyle } from "../../../../theme";
import { size_tool, pxToDp, padding_tool, pxToDpHeight } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import CircleStatistcs from '../../../../component/circleStatistcs'
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil";
import { changeTopicData } from '../../tools'
import Explanation from '../../../../component/math/Topic/Explanation'
import TopicStemTk from '../../../../component/math/Topic/TopicStemTk'
import CalculationStem from '../../../../component/math/Topic/CalculationStem'
import Stem from '../../../../component/math/Topic/Stem'
import topaicTypes from '../../../../res/data/MathTopaicType'
import BackBtn from "../../../../component/math/BackBtn";

let style = mathTopicStyle['2']

class WrongExercise extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        list: [],
        page_index: 1,
        loading_wrong_data:false,
    };
  }
  componentDidMount() {
    this.getData()
  }

  getData = () => {
    const { page_index, list } = this.state
    const { userInfo } = this.props
    const userInfoJs = userInfo.toJS();
    this.setState({
      loading_wrong_data:true
    })
    let obj = {
      wrong_type: '0',  //表示没对两次的错题
      page_index,
      page_size: 10,
      grade_code: userInfoJs.checkGrade,
      term_code: userInfoJs.checkTeam,
    }
    axios.get(api.getExpandCalWrongExerciseList, { params: obj }).then((res) => {
      let data = JSON.parse(JSON.stringify(res.data.data)) 
      console.log('错题集',res.data.data)
      data.forEach((item, index) => {
        item.displayed_type_name = item.display_type_name
        item = changeTopicData(item,'easyCalculation')
        item._correct = -1 //未答状态
      })
      let _list = list.concat(data)
      // console.log('llllll',_list.length)
      this.setState({
        list: _list,
        loading_wrong_data:false
      })
    });
  }

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  hideVideoShow = () => {
    this.setState({ videoIsVisible: false })
  }

  doVideoAction = () => {
    this.setState({ videoIsVisible: true })
  }

  renderStem = (currentTopic) => {
    const {displayed_type_name} = currentTopic
    let correct = 0
    if(displayed_type_name === topaicTypes.Fill_Blank){
      return <TopicStemTk my_style={style} onlySee={true} correct={correct} data={currentTopic}></TopicStemTk>
    }
    if(displayed_type_name === topaicTypes.Calculation_Problem){
      return <CalculationStem my_style={style} onlySee={true} correct={correct} data={currentTopic}></CalculationStem>
    }
    // if(displayed_type_name === topaicTypes.Application_Questions){
    //   return <ApplicationStem my_style={style} onlySee={true} correct={correct} data={currentTopic}></ApplicationStem>
    // }
    return <Stem my_style={style} data={currentTopic}></Stem>
  }

  doTopic = () => {
    MathNavigationUtil.toEasyCalculationDoExercise({ ...this.props, data: this.props.navigation.state.params.data })
  }

  toWrongDoExercisePage = (currentTopaicData) => {
    NavigationUtil.toEasyCalculationDoWrongExercise({ ...this.props, data: { currentTopic: { ...currentTopaicData } } })
  }

  onMomentumScrollEnd = (e) => {
    const {page_index,loading_wrong_data} = this.state
    let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    let contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    let oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
    if (parseInt(offsetY + oriageScrollHeight) + 3 >= parseInt(contentSizeHeight) && !loading_wrong_data){
        console.log('上传滑动到底部事件')
        this.setState({
          page_index:page_index+1
        },()=>{
          this.getData()
        })
    }
  }


  render() {
    const {list} = this.state
    return (
      <ImageBackground style={[styles.container]} source={require('../../../../images/MathSyncDiagnosis/bg_1.png')}>
        <BackBtn goBack={this.goBack}></BackBtn>
        <Text style={[styles.header]}>错题集</Text>
        <ScrollView style={[styles.content]} contentContainerStyle={[styles.scrollContent]} onMomentumScrollEnd={this.onMomentumScrollEnd}>
          {list.map((i,x)=>{
            return <View key={x} style={[styles.item]}>
                <View style={[styles.item_left]}>
                    <Text style={[{color:"#A3A8B3",fontSize:pxToDp(32),marginBottom:pxToDpHeight(10)},appFont.fontFamily_jcyt_500]}>{i.expand_name}</Text>
                    {this.renderStem(i)}
                </View>
                <TouchableOpacity style={[styles.btn_wrap]} onPress={()=>{this.toWrongDoExercisePage(i)}}>
                    <View style={[styles.btn_wrap_inner,appStyle.flexCenter]}>
                        <Text style={[{color:"#fff",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_700]}>再练一次</Text>
                    </View>
                </TouchableOpacity>
            </View>
          })}
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingTop:Platform.OS === 'android'?pxToDpHeight(10):pxToDpHeight(60),
  },
  header:{
    textAlign:'center',
    ...appFont.fontFamily_jcyt_700,
    fontSize:pxToDp(40),
    color:"#246666",
    marginBottom:pxToDp(40)
  },
  content:{
    // borderTopLeftRadius:pxToDp(40),
    // borderTopRightRadius:pxToDp(40),
    // backgroundColor:'red',
    paddingLeft:pxToDp(230),
    paddingRight:pxToDp(230),
    flex:1,

  },
  scrollContent:{
    paddingBottom:pxToDp(160),
    // paddingLeft:pxToDp(80),
    // paddingRight:pxToDp(380),
    paddingTop:pxToDp(60),
  },
  item:{
    width:'100%',
    borderRadius:pxToDp(40),
    backgroundColor:"#fff",
    marginBottom:pxToDp(20),
    padding:pxToDp(40),
    ...appStyle.flexLine,
    ...appStyle.flexJusBetween
  },
  item_left:{
    width:'65%',
    maxHeight:pxToDpHeight(500),
    overflow:'hidden'
  },
  btn_wrap:{
    width:pxToDp(280),
    height:pxToDp(120),
    backgroundColor:'#2278E9',
    borderRadius:pxToDp(50),
    paddingBottom:pxToDp(6),
    marginTop:pxToDp(20)
  },
  btn_wrap_inner:{
    width:pxToDp(280),
    height:'100%',
    backgroundColor:"#2697FF",
    borderRadius:pxToDp(50),
  },
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

export default connect(mapStateToProps, mapDispathToProps)(WrongExercise);
