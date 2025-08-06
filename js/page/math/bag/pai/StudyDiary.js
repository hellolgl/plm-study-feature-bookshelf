import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  DeviceEventEmitter,
} from "react-native";
import { appStyle } from "../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../util/tools";
import Bar from "../../../../component/bar";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil";
import { Modal } from "antd-mobile-rn";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";

const day_map = {
  0: "星期天",
  1: "星期一",
  2: "星期二",
  3: "星期三",
  4: "星期四",
  5: "星期五",
  6: "星期六",
};

const typeList = ["基础学习", "同步学习", "错题练习"];
class StudyDiary extends PureComponent {
  constructor(props) {
    super(props);
    this.eventListenerRefreshPage = undefined;
    const { userInfo } = props;
    const userInfoJs = userInfo.toJS();
    this.mathGoods = userInfoJs.mathGoods;
    this.state = {
      nowTime: "",
      day: "",
      list: [],
      dialogVisible: false,
    };
  }
  componentDidMount() {
    if(this.mathGoods.math_paiDiaryB && !this.mathGoods.math_paiDiaryA){
      MathNavigationUtil.toMathStudyDiaryPlanB({ ...this.props });
      return
    }
    Date.prototype.format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    };
    let nowTime = new Date().format("yyyy-MM-dd");
    let day = new Date().getDay();
    this.setState({
      nowTime,
      day,
    });
    this.getData();
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "refreshPage",
      (event) => {
        this.getData();
      }
    );
  }
  componentWillUnmount() {
    this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
    DeviceEventEmitter.emit("refreshPageHome"); //返回主页刷新
  }
  getData = () => {
    const { userInfo, textCode } = this.props;
    const userInfoJs = userInfo.toJS();
    let obj = {
      textbook: textCode,
      grade_code: userInfoJs.checkGrade,
      term_code: userInfoJs.checkTeam,
      student_code: userInfoJs.id,
    };
    axios.get(api.getDiaryLesson, { params: obj }).then((res) => {
      this.setState({
        list: res.data.data.filter((i) => {
          return (
            i.lesson_name.indexOf("复习") === -1 &&
            i.lesson_name.indexOf("练习") === -1
          );
        }),
      });
    });
  };
  goBack = () => {
    NavigationUtil.goBack(this.props);
  };
  toUpLeval = () => {
    this.setState({
      dialogVisible: true,
    });
  };
  confirmUp = () => {
    MathNavigationUtil.toMathStudyDiaryPlanB({ ...this.props });
    this.setState({
      dialogVisible: false,
    });
  };
  cancel = () => {
    this.setState({
      dialogVisible: false,
    });
  };
  checkLesson = (item) => {
    const { userInfo, textCode } = this.props;
    const userInfoJs = userInfo.toJS();
    let obj = {
      textbook: textCode,
      grade_code: userInfoJs.checkGrade,
      term_code: userInfoJs.checkTeam,
      student_code: userInfoJs.id,
      unit_code: item.unit_code,
      lesson_code: item.lesson_code,
    };
    // console.log('_______________', obj)
    MathNavigationUtil.toDoExerciseMath({
      ...this.props,
      data: {
        ...obj,
        pageType: { name: "A学习日记", answer_origin: "paiAB" },
      },
    });
  };
  render() {
    const { nowTime, day, list, dialogVisible } = this.state;
    return (
      <ImageBackground
        source={require("../../../../images/math_diary_bg.png")}
        style={[styles.container, appStyle.flexAliCenter]}
      >
        <TouchableOpacity style={[styles.backBtn]} onPress={this.goBack}>
          <Image
            source={require("../../../../images/math_diary_back.png")}
            style={{ width: pxToDp(64), height: pxToDp(67) }}
          ></Image>
        </TouchableOpacity>
        {this.mathGoods["math_paiDiaryB"] ? (
          <TouchableOpacity style={[styles.upBtn]} onPress={this.toUpLeval}>
            <Image
              source={require("../../../../images/upB.png")}
              style={{ width: pxToDp(216), height: pxToDp(64) }}
              resizeMode="contain"
            ></Image>
          </TouchableOpacity>
        ) : null}

        <Image
          source={require("../../../../images/math_jh_title.png")}
          style={[styles.titleBg]}
          resizeMode={"contain"}
        ></Image>
        <Text style={[styles.time, { transform: [{ rotate: "0deg" }] }]}>
          {nowTime}&nbsp;&nbsp;{day_map[day]}
        </Text>
        <View style={[styles.content]}>
          <ScrollView
            style={[styles.contentInner, { maxHeight: pxToDp(750) }]}
            contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
          >
            {list.length > 0
              ? list.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.itemStyle]}
                      onPress={() => {
                        this.checkLesson(item);
                      }}
                    >
                      <View
                        style={[appStyle.flexLine, appStyle.flexJusBetween]}
                      >
                        <View>
                          <Text style={[styles.txt1, { fontSize: pxToDp(28) }]}>
                            {item.unit_name
                              ? item.unit_name.substring(0, 4)
                              : null}
                          </Text>
                          <Text style={[styles.txt1, { fontSize: pxToDp(26) }]}>
                            {item.unit_name
                              ? item.unit_name
                                  .substring(item.unit_name.indexOf("元") + 1)
                                  .trim()
                              : null}
                          </Text>
                        </View>
                        {item.total_ > 0 &&
                        item.total_ == item.exercise_count_ ? (
                          <Image
                            source={require("../../../../images/math_start.png")}
                            style={[
                              {
                                width: pxToDp(82),
                                height: pxToDp(82),
                                marginLeft: pxToDp(100),
                                marginTop: pxToDp(-50),
                              },
                            ]}
                          ></Image>
                        ) : null}
                      </View>
                      <Text style={[styles.txt2]}>{item.lesson_name}</Text>
                      <View
                        style={[
                          appStyle.flexLine,
                          appStyle.flexJusBetween,
                          { marginBottom: pxToDp(15) },
                        ]}
                      >
                        {typeList.map((item, indexC) => {
                          return (
                            <View style={[appStyle.flexLine]} key={indexC}>
                              <Text style={[styles.circle]}></Text>
                              <Text>{item}</Text>
                            </View>
                          );
                        })}
                      </View>

                      {item.total_ > 0 ? (
                        <View
                          style={[appStyle.flexLine, appStyle.flexJusBetween]}
                        >
                          {item.total_ > 0 &&
                          item.total_ !== item.exercise_count_ ? (
                            <ImageBackground
                              source={require("../../../../images/math_diary_ydr.png")}
                              style={[
                                {
                                  width: pxToDp(166),
                                  height: pxToDp(76),
                                  paddingLeft: pxToDp(12),
                                },
                              ]}
                            >
                              <Text style={[styles.txt3]}>
                                {item.total_}/{item.exercise_count_}
                              </Text>
                              <Text style={[styles.txt4]}>已答题目</Text>
                            </ImageBackground>
                          ) : (
                            <ImageBackground
                              source={require("../../../../images/math_diary_yd.png")}
                              style={[
                                {
                                  width: pxToDp(166),
                                  height: pxToDp(76),
                                  paddingLeft: pxToDp(12),
                                },
                              ]}
                            >
                              <Text style={[styles.txt3]}>
                                {item.total_}/{item.exercise_count_}
                              </Text>
                              <Text style={[styles.txt4]}>已答题目</Text>
                            </ImageBackground>
                          )}
                          <ImageBackground
                            source={require("../../../../images/math_diary_zq.png")}
                            style={[
                              {
                                width: pxToDp(166),
                                height: pxToDp(76),
                                paddingLeft: pxToDp(12),
                              },
                            ]}
                          >
                            <Text style={[styles.txt3]}>
                              {item.right_rate === 1
                                ? item.right_rate * 100
                                : (item.right_rate * 100).toFixed(2)}
                              %
                            </Text>
                            <Text style={[styles.txt4]}>正确率</Text>
                          </ImageBackground>
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                })
              : null}
          </ScrollView>
        </View>
        <Modal
          animationType="slide"
          visible={dialogVisible}
          transparent
          style={[
            { width: "100%", height: "100%", backgroundColor: "transparent" },
            appStyle.flexCenter,
          ]}
        >
          <ImageBackground
            source={require("../../../../images/diary_modal_bg.png")}
            style={[styles.modalContent, appStyle.flexCenter]}
            resizeMode={"contain"}
          >
            <TouchableOpacity
              style={[styles.modalBtn1]}
              onPress={this.confirmUp}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={["#7EB4FF", "#4F8AFF"]}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: pxToDp(64),
                }}
              >
                <Text
                  style={[
                    {
                      color: "#fff",
                      fontSize: pxToDp(32),
                      textAlign: "center",
                      lineHeight: pxToDp(64),
                    },
                  ]}
                >
                  B学习日记
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn2]} onPress={this.cancel}>
              <Text
                style={[
                  {
                    color: "#AAA",
                    fontSize: pxToDp(32),
                    textAlign: "center",
                    lineHeight: pxToDp(64),
                  },
                ]}
              >
                以后再说
              </Text>
            </TouchableOpacity>
          </ImageBackground>
        </Modal>
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
    paddingRight: pxToDp(63),
  },
  backBtn: {
    position: "absolute",
    left: pxToDp(63),
    top: pxToDp(40),
  },
  upBtn: {
    position: "absolute",
    right: pxToDp(63),
    top: pxToDp(40),
  },
  titleBg: {
    width: pxToDp(658),
    height: pxToDp(267),
    zIndex: 1,
  },
  content: {
    backgroundColor: "#FBD252",
    width: "100%",
    height: pxToDp(770),
    marginTop: pxToDp(-30),
    borderRadius: pxToDp(32),
    paddingBottom: pxToDp(48),
  },
  time: {
    fontSize: pxToDp(32),
    fontWeight: "bold",
    position: "absolute",
    top: pxToDp(55),
    zIndex: 2,
    left: pxToDp(900),
    color: "#fff",
  },
  contentInner: {
    padding: pxToDp(48),
    paddingRight: 0,
    paddingTop: 0,
  },
  itemStyle: {
    width: pxToDp(420),
    height: pxToDp(369),
    backgroundColor: "#fff",
    borderRadius: pxToDp(16),
    marginTop: pxToDp(48),
    padding: pxToDp(32),
    paddingTop: pxToDp(30),
    marginRight: pxToDp(42),
  },
  txt1: {
    color: "#AAAAAA",
  },
  txt2: {
    fontSize: pxToDp(32),
    color: "#0179FF",
    height: pxToDp(76),
    backgroundColor: "#E0EEFF",
    lineHeight: pxToDp(76),
    borderRadius: pxToDp(8),
    paddingLeft: pxToDp(17),
    marginTop: pxToDp(22),
    marginBottom: pxToDp(22),
  },
  txt3: {
    fontSize: pxToDp(28),
    color: "#fff",
  },
  txt4: {
    color: "#fff",
  },
  modalContent: {
    width: pxToDp(420),
    height: pxToDp(522),
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
  },
  modalBtn1: {
    width: pxToDp(246),
    height: pxToDp(64),
    marginTop: pxToDp(300),
  },
  modalBtn2: {
    width: pxToDp(246),
    height: pxToDp(64),
  },
  circle: {
    width: pxToDp(16),
    height: pxToDp(16),
    borderRadius: pxToDp(8),
    backgroundColor: "#0179FF",
    marginRight: pxToDp(8),
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

export default connect(mapStateToProps, mapDispathToProps)(StudyDiary);
