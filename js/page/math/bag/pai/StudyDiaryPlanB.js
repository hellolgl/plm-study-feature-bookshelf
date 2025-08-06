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
import { size_tool, pxToDp, padding_tool, fitHeight } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from 'react-redux';
import axios from '../../../../util/http/axios'
import api from '../../../../util/http/api'

const day_map = {
  0: '星期天',
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六'
}

const typeList = [
  // '基础学习',
  '同步诊断',
  '错题练习'
]
class StudyDiaryB extends PureComponent {
  constructor(props) {
    super(props);
    this.eventListenerRefreshPage = undefined
    const { userInfo } = props;
    const userInfoJs = userInfo.toJS();
    this.mathGoods = userInfoJs.mathGoods;
    this.state = {
      nowTime: '',
      day: '',
      list: [],
      dialogVisible: false
    };
  }
  componentDidMount() {
    Date.prototype.format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
    }
    let nowTime = new Date().format("yyyy-MM-dd");
    let day = new Date().getDay()
    this.setState({
      nowTime,
      day
    })
    this.getData()
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "refreshPage",
      (event) => {
        this.getData();
      }
    );
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
      student_code: userInfoJs.id,
    }
    axios.get(api.getDiaryLessonPlanB, { params: obj }).then(
      res => {
        let oldlist = res.data.data.data
        let oldObj = {}
        let newlist = []
        let expandobj = {}
        for (let i = 0; i < oldlist.length; i++) {
          if( oldlist[i].m_total>0){
            // 代表做了题
            oldlist[i].right_rate = Math.round(oldlist[i].m_r_total/ oldlist[i].m_total *100)
          }else{
            oldlist[i].right_rate = 0
          }
          if (oldlist[i].unit_code === oldObj.unit_code) {
            newlist.push(oldlist[i])
          } else {
            if (i === 0) {
              oldObj = oldlist[i]
              newlist.push(oldlist[i])
            } else {
              // 处理oldObj
              if (oldObj.unit_category && oldObj.unit_category.split(',').length > 0) {
                let typelist = oldObj.unit_category.split(',')
                let unit_code = oldObj.unit_code
                typelist.map((item) => {
                  if (item === '计算类') {
                    // type 1计算类   2  同步应用，拓展应用   3 只有拓展应用
                    newlist.push({
                      ...oldObj,
                      type: '1',
                      statistic:{...this.getStatistic('sync_expand_cal',res.data.data.expand,unit_code)}
                    })
                  }
                  if (item === '应用类') {
                    // 判断方向是否大于2
                    if (expandobj[unit_code] && expandobj[unit_code].length > 2) {
                      newlist.push(...[{
                        ...oldObj,
                        type: '2',
                        statistic:{...this.getStatistic('sync_expand_practical',res.data.data.expand,unit_code)}
                      },
                      {
                        ...oldObj,
                        type: '3',
                        statistic:{...this.getStatistic('expand_practical',res.data.data.expand,unit_code)}
                      }])
                    } else {
                      newlist.push({
                        ...oldObj,
                        type: '2',
                        statistic:{...this.getStatistic('sync_expand_practical',res.data.data.expand,unit_code)}
                      })
                    }
                  }
                })
              }
              oldObj = oldlist[i]
              newlist.push(oldlist[i])
            }

          }
        }
        this.setState({
          list: newlist.filter((i => {
            return i.lesson_name.indexOf('复习') === -1 && i.lesson_name.indexOf('练习') === -1
          }))
        })
      }
    )
  }
  getStatistic = (type,expand,unit_code) =>{
    let statistic = expand[type][unit_code]?expand[type][unit_code][0]:''
    let obj = {...statistic,showBgred:true}
    if(statistic) {
      if(statistic.m_total>0){
        obj.show = true
        obj.right_rate = Math.round(statistic.m_r_total/statistic.m_total*100)
      }
      if(statistic.m_total === statistic.m_exercise_count) obj.showBgred = false
    }
    return obj
    
  }
  goBack = () => {
    if(this.mathGoods.math_paiDiaryB && this.mathGoods.math_paiDiaryA){
      NavigationUtil.goBack(this.props);
      return
    }
    // NavigationUtil.toHomePageMath({ ...this.props });  //老首页（已废弃）
  }
  checkLesson = (item) => {
    const { userInfo, textCode } = this.props
    const userInfoJs = userInfo.toJS();
    let obj = {
      textbook: textCode,
      grade_code: userInfoJs.checkGrade,
      term_code: userInfoJs.checkTeam,
      student_code: userInfoJs.id,
      unit_code: item.unit_code,
      lesson_code: item.lesson_code,
    }
    // console.log('_______________', obj)
    if(!item.type){
      MathNavigationUtil.toDoExerciseMath({
        ...this.props, data: {
        ...obj,pageType:{name:'派学日记',answer_origin:'paiAB'}
        }
      })
      return
    }
    if(item.type === '1'){
      // 同步计算 拓展计算
      MathNavigationUtil.toDoExerciseMath({
        ...this.props, data: {
        ...obj,pageType:{name:'派学日记',answer_origin:'cal'}
        }
      })
      return
    }
    if(item.type === '2'){
      // 同步应用 拓展应用
      MathNavigationUtil.toDoExerciseMath({
        ...this.props, data: {
        ...obj,pageType:{name:'派学日记',answer_origin:'app'}
        }
      })
      return
    }
    if(item.type === '3'){
      // 拓展应用
      MathNavigationUtil.toDoExerciseMath({
        ...this.props, data: {
        ...obj,pageType:{name:'派学日记',answer_origin:'appExp'}
        }
      })
      return
    }
  }
  renderType = (type) => {
    if (type === '1') {
      return <View style={[appStyle.flexLine, { justifyContent: 'space-between' ,marginTop:pxToDp(15),marginBottom:pxToDp(20)}]}>
        <View style={[appStyle.flexLine, styles.typeTxt]}>
          <View style={[styles.circle]}></View>
          <Text style={[{ color: '#0179FF', fontSize: pxToDp(24) }]}>同步计算</Text>
        </View>
        {/* <View style={[appStyle.flexLine, styles.typeTxt]}>
          <Text style={[styles.circle]}></Text>
          <Text style={[{ color: '#0179FF', fontSize: pxToDp(24) }]}>拓展计算</Text>
        </View> */}
      </View>
    }
    if (type === '2') {
      return <View style={[appStyle.flexLine, { justifyContent: 'space-between'  ,marginTop:pxToDp(15),marginBottom:pxToDp(20)}]}>
        <View style={[appStyle.flexLine, styles.typeTxt]}>
          <View style={[styles.circle]}></View>
          <Text style={[{ color: '#0179FF', fontSize: pxToDp(24) }]}>同步应用</Text>
        </View>
        {/* <View style={[appStyle.flexLine, styles.typeTxt]}>
          <Text style={[styles.circle]}></Text>
          <Text style={[{ color: '#0179FF', fontSize: pxToDp(24) }]}>拓展应用</Text>
        </View> */}
      </View>
    }
    if (type === '3') {
      return <View style={[appStyle.flexLine, styles.typeTxt,{marginTop:pxToDp(36),marginBottom:pxToDp(40)}]}>
        <View style={[styles.circle]}></View>
        <Text style={[{ color: '#0179FF', fontSize: pxToDp(24) }]}>拓展应用</Text>
      </View>
    }
  }
  render() {
    const { nowTime, day, list, dialogVisible } = this.state;
    return (
      <ImageBackground source={require('../../../../images/math_diary_bg.png')} style={[styles.container, appStyle.flexAliCenter]}>
        <TouchableOpacity style={[styles.backBtn]} onPress={this.goBack}>
          <Image source={require('../../../../images/math_diary_back.png')} style={{ width: pxToDp(64), height: pxToDp(67) }}></Image>
        </TouchableOpacity>
        <Image source={require('../../../../images/math_jh_titlePlanB.png')} style={[styles.titleBg]} resizeMode={'contain'}></Image>
        <Text style={[styles.time, { transform: [{ rotate: "0deg" }] }]}>{nowTime}&nbsp;&nbsp;{day_map[day]}</Text>
        <View style={[styles.content]}>
          <ScrollView style={[styles.contentInner, { maxHeight:fitHeight(0.68,0.78) }]} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {list.length > 0 ? list.map((item, index) => {
              return <TouchableOpacity key={index} style={[styles.itemStyle]} onPress={() => { this.checkLesson(item) }}>
                <View style={[appStyle.flexLine, appStyle.flexJusBetween]}>
                  <View>
                    <Text style={[styles.txt1, { fontSize: pxToDp(28) }]}>{item.unit_name ? item.unit_name.substring(0, 4) : null}</Text>
                    {item.unit_name === '期末复习' || item.unit_name === '期中复习'?<Text style={[styles.txt1]}></Text>:<Text style={[styles.txt1, { fontSize: pxToDp(26) }]}>{item.unit_name ? item.unit_name.substring(item.unit_name.indexOf('元') + 1).trim() : null}</Text>}
                  </View>
                  {item.m_total > 0 && item.m_total == item.m_exercise_count && !item.type ? <Image source={require('../../../../images/math_start.png')} style={[{ width: pxToDp(82), height: pxToDp(82), marginLeft: pxToDp(100), marginTop: pxToDp(-50) }]}></Image> : null}
                  { item.type && item.statistic && item.statistic.m_total> 0 && item.statistic.m_total == item.statistic.m_exercise_count ? <Image source={require('../../../../images/math_start.png')} style={[{ width: pxToDp(82), height: pxToDp(82), marginLeft: pxToDp(100), marginTop: pxToDp(-50) }]}></Image> : null}
                </View>
                {item.type ? null : <Text style={[styles.txt2]}>{item.lesson_name}</Text>}
                {
                  item.type ? this.renderType(item.type)
                    :
                    <View style={[appStyle.flexLine, { marginBottom: pxToDp(15) }]}>
                      {item.lesson_name.indexOf('期中')>-1 || item.lesson_name.indexOf('期末')>-1?<View style={[appStyle.flexLine,{marginRight:pxToDp(16)}]}>
                          <View style={[styles.circle]}></View>
                          <Text>同步诊断</Text>
                        </View>:typeList.map((child, indexC) => {
                        return <View style={[appStyle.flexLine,{marginRight:pxToDp(16)}]} key={indexC}>
                          <View style={[styles.circle]}></View>
                          <Text>{child}</Text>
                        </View>
                      })}
                    </View>
                }
                {
                  item.type && item.statistic.show?<View style={[appStyle.flexLine, appStyle.flexJusBetween]}>
                  <ImageBackground source={item.statistic.showBgred?require('../../../../images/math_diary_ydr.png'):require('../../../../images/math_diary_yd.png')} style={[{ width: pxToDp(166), height: pxToDp(76), paddingLeft: pxToDp(12) }]}>
                    <Text style={[styles.txt3]}>{item.statistic.m_total}/{item.statistic.m_exercise_count}</Text>
                    <Text style={[styles.txt4]}>已答题目</Text>
                  </ImageBackground>
                     <ImageBackground source={require('../../../../images/math_diary_zq.png')} style={[{ width: pxToDp(166), height: pxToDp(76), paddingLeft: pxToDp(12) },]}>
                    <Text style={[styles.txt3]}>{item.statistic.right_rate}%</Text>
                    <Text style={[styles.txt4]}>正确率</Text>
                    </ImageBackground>
                  </View>:item.m_total > 0 && !item.type ? <View style={[appStyle.flexLine, appStyle.flexJusBetween]}>
                    {item.m_total > 0 && item.m_total !== item.m_exercise_count ? <ImageBackground source={require('../../../../images/math_diary_ydr.png')} style={[{ width: pxToDp(166), height: pxToDp(76), paddingLeft: pxToDp(12) }]}>
                      <Text style={[styles.txt3]}>{item.m_total}/{item.m_exercise_count}</Text>
                      <Text style={[styles.txt4]}>已答题目</Text>
                    </ImageBackground> : <ImageBackground source={require('../../../../images/math_diary_yd.png')} style={[{ width: pxToDp(166), height: pxToDp(76), paddingLeft: pxToDp(12) }]}>
                      <Text style={[styles.txt3]}>{item.m_total}/{item.m_exercise_count}</Text>
                      <Text style={[styles.txt4]}>已答题目</Text>
                    </ImageBackground>}
                    <ImageBackground source={require('../../../../images/math_diary_zq.png')} style={[{ width: pxToDp(166), height: pxToDp(76), paddingLeft: pxToDp(12) },]}>
                      <Text style={[styles.txt3]}>{item.right_rate}%</Text>
                      <Text style={[styles.txt4]}>正确率</Text>
                    </ImageBackground>
                </View> : null
                }
              </TouchableOpacity>
            }) : null}
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#EEF3F5",
    paddingTop: pxToDp(40),
    paddingBottom: pxToDp(40),
    paddingLeft: pxToDp(63),
    paddingRight: pxToDp(63)
  },
  backBtn: {
    position: 'absolute',
    left: pxToDp(63),
    top: pxToDp(40)
  },
  upBtn: {
    position: 'absolute',
    right: pxToDp(63),
    top: pxToDp(40)
  },
  titleBg: {
    width: pxToDp(658),
    height: pxToDp(267),
    zIndex: 1
  },
  content: {
    width:'100%',
    backgroundColor: '#FBD252',
    height: fitHeight(0.68,0.75),
    marginTop: pxToDp(-30),
    borderRadius: pxToDp(32),
    paddingBottom: pxToDp(48)
  },
  time: {
    fontSize: pxToDp(32),
    fontWeight: 'bold',
    position: 'absolute',
    top: pxToDp(55),
    zIndex: 2,
    left: pxToDp(940),
    color: '#fff',

  },
  contentInner: {
    padding: pxToDp(48),
    paddingRight: 0,
    paddingTop: 0
  },
  itemStyle: {
    width: pxToDp(420),
    height: pxToDp(369),
    backgroundColor: '#fff',
    borderRadius: pxToDp(16),
    marginTop: pxToDp(48),
    padding: pxToDp(32),
    paddingTop: pxToDp(30),
    marginRight: pxToDp(42)
  },
  txt1: {
    color: '#AAAAAA'
  },
  txt2: {
    fontSize: pxToDp(32),
    color: '#0179FF',
    height: pxToDp(76),
    backgroundColor: '#E0EEFF',
    lineHeight: pxToDp(76),
    borderRadius: pxToDp(8),
    paddingLeft: pxToDp(17),
    marginTop: pxToDp(22),
    marginBottom: pxToDp(22)
  },
  typeTxt: {
    fontSize: pxToDp(32),
    color: '#0179FF',
    height: pxToDp(76),
    width: pxToDp(166),
    backgroundColor: '#E0EEFF',
    lineHeight: pxToDp(76),
    borderRadius: pxToDp(8),
    paddingLeft: pxToDp(17),
    paddingRight: pxToDp(17),
    marginTop: pxToDp(22),
    marginBottom: pxToDp(22),
  },
  txt3: {
    fontSize: pxToDp(28),
    color: '#fff',
  },
  txt4: {
    color: '#fff'
  },
  modalContent: {
    width: pxToDp(420),
    height: pxToDp(522),
    backgroundColor: '#fff',
    borderRadius: pxToDp(32)
  },
  modalBtn1: {
    width: pxToDp(246),
    height: pxToDp(64),
    marginTop: pxToDp(300)
  },
  modalBtn2: {
    width: pxToDp(246),
    height: pxToDp(64),
  },
  circle: {
    width: pxToDp(16),
    height: pxToDp(16),
    borderRadius: pxToDp(8),
    backgroundColor: '#0179FF',
    marginRight: pxToDp(8)
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

export default connect(mapStateToProps, mapDispathToProps)(StudyDiaryB)
