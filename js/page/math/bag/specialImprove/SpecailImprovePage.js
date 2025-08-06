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
  Platform
} from "react-native";
import { appStyle } from "../../../../theme";
import {  pxToDp, fitHeight } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import { connect } from "react-redux";
import CircleStatistcsImprove from "../../../../component/CircleStatistcsImprove";
import { Modal } from "antd-mobile-rn";
import NavigationMathUtil from "../../../../navigator/NavigationMathUtil";
import DataGraphicalDisplayFrame from "../../../../component/math/DataGraphicalDisplayFrame";
import LoadingModal from "../../../../component/LoadingModal";
import _axios from "axios";

class SpecailImprovePage extends PureComponent {
  constructor(props) {
    super(props);
    const data = this.props.navigation.state.params.data;
    this.unit_name = data.unit_name;
    this.unit_code = data.unit_code;
    this.unit_category = data.unit_category;
    this.source = _axios.CancelToken.source(); //生成取消令牌用于组件卸载阻止axios请求
    this.cancelToken = this.source.token;
    this.eventListenerRefreshPage = undefined;
    this.state = {
      typeList: [
        {
          text: "知识图谱",
          value: "7",
        },
        {
          text: "同步诊断",
          value: "6",
        },
        {
          text: "同步计算",
          value: "2",
        },
        {
          text: "同步应用",
          value: "4",
        },
        // {
        //   text: '拓展应用',
        //   value: '5'
        // },
        // {
        //     text: '拓展计算',
        //     value: '3'
        // },
      ],
      currentTypeIndex: 0,
      nowType: "7",
      nameList: [],
      rodarValueList: [],
      rightRate: [],
      knowledge: {},
      dialogVisible: false,
      paiNameList: [],
      paiRodarValueList: [],
      pieValue: {},
      animating: true,
      right_rate_map: {},
    };
  }
  goBack = () => {
    NavigationUtil.goBack(this.props);
  };
  componentDidMount() {
    const { nowType } = this.state;
    if (this.unit_category === "应用类") {
      this.setState({
        typeList: [
          {
            text: "知识图谱",
            value: "7",
          },
          {
            text: "同步诊断",
            value: "6",
          },
          {
            text: "同步应用",
            value: "4",
          },
          // {
          //   text: '拓展应用',
          //   value: '5'
          // },
        ],
      });
    }
    if (this.unit_category === "其他") {
      this.setState({
        typeList: [
          {
            text: "知识图谱",
            value: "7",
          },
          {
            text: "同步诊断",
            value: "6",
          },
        ],
      });
    }
    if (this.unit_name === "期中复习" || this.unit_name === "期末复习") {
      this.setState({
        typeList: [
          {
            text: "同步诊断",
            value: "6",
          },
        ],
        nowType: "6",
      });
    }
    if (this.unit_name === "期中复习" || this.unit_name === "期末复习") {
      this.getDate("6");
      this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
        "refreshPage",
        (event) => {
          let answer_origin = "7";
          if (event.indexOf("improve") > -1) {
            answer_origin = event.substring(7);
          }
          this.getDate(answer_origin);
        }
      );
    } else {
      this.getDate(nowType);
      this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
        "refreshPage",
        (event) => {
          let answer_origin = "7";
          if (event.indexOf("improve") > -1) {
            answer_origin = event.substring(7);
          }
          // console.log('________________________________',answer_origin)
          this.getDate(answer_origin);
        }
      );
    }
  }

  componentWillUnmount() {
    this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
    this.source.cancel("组件卸载,取消请求");
    this.setState = (state, callback) => {
      return;
    };
  }
  getDate = (nowType) => {
    const { userInfo, textBookCode } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = this.props.navigation.state.params.data;
    data.grade_code = userInfoJs.checkGrade;
    data.term_code = userInfoJs.checkTeam;
    data.textbook = textBookCode;
    data.student_code = userInfoJs.id;
    data.answer_origin = nowType;
    this.setState({
      animating: true,
    });
    // console.log('___________',data)
    axios
      .get(api.getSpeciaImproveOtherDetail, {
        params: data,
        cancelToken: this.cancelToken,
      })
      .then((res) => {
        if (nowType === "7" || nowType === "6" || nowType === "5") {
          // 基础学习 同步诊断
          let rightRate = res.data.data.right_rate;
          let knowledge = res.data.data.data;
          let nameList = [];
          let rodarValueList = [];
          let right_rate_map = {};
          rightRate.forEach((item, index) => {
            nameList.push(item.name);
            item.code = Math.round(item.code);
            rodarValueList.push(item.code+'');
            if (item.type === "2") {
              rodarValueList[index] = "null";
            }
            if (nowType === "6" || nowType === "5") {
              right_rate_map[item.name] = {
                right_total: item.right_total ? item.right_total : item.r_total,
                total: item.total,
              };
            }
          });
          if (nowType === "7") {
            for (let i in knowledge) {
              knowledge[i].forEach((j, index) => {
                right_rate_map[j.name] = {
                  right_total: j.right_count,
                  total: j.answer_count,
                };
              });
            }
          }
          this.setState({
            nameList,
            rodarValueList,
            rightRate,
            knowledge,
            animating: false,
            right_rate_map,
          });
        } else {
          this.setState({
            pieValue: res.data.data[0],
            animating: false,
          });
        }
      });
  };
  getPaiData = () => {
    const { userInfo, textBookCode } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = {};
    data.grade_code = userInfoJs.checkGrade;
    data.term_code = userInfoJs.checkTeam;
    data.textbook = textBookCode;
    data.student_code = userInfoJs.id;
    data.unit_code = this.unit_code;
    axios.get(api.getSpeciaImproveDetail, { params: data }).then((res) => {
      let resData = res.data.data;
      let paiRodarValueList = [];
      let paiNameList = [];
      resData.forEach((item) => {
        if (item.name !== "拓展计算题" && item.name !== "拓展应用题") {
          if (item.name === "基础学习题") item.name = "知识图谱";
          if (item.name === "同步学习题") item.name = "同步诊断";
          paiNameList.push(item.name.replaceAll("题", ""));
          paiRodarValueList.push(Math.round(item.rate)+"");
        }
      });
      this.setState(
        {
          paiNameList,
          paiRodarValueList,
        },
        () => {
          this.setState({
            dialogVisible: true,
          });
        }
      );
    });
  };
  clickType = (item, index) => {
    const { animating, currentTypeIndex } = this.state;
    if (animating && currentTypeIndex !== index) return;
    this.setState({
      currentTypeIndex: index,
      nowType: item.value,
    });
    this.getDate(item.value);
  };
  seePai = () => {
    this.getPaiData();
  };
  closeModal = () => {
    this.setState({
      dialogVisible: false,
    });
  };
  getKnowledge = () => {
    // 0 掌握较好 3 掌握一般 1没有掌握 2未做
    const { knowledge, nowType } = this.state;
    let knowledge_code = [];
    if (knowledge["1"] && knowledge["1"].length > 0) {
      knowledge_code = knowledge["1"].map((item) => {
        return item.code;
      });
      return knowledge_code;
    }
    if (knowledge["3"] && knowledge["3"].length > 0 && nowType === "5") {
      knowledge_code = knowledge["3"].map((item) => {
        return item.code;
      });
      return knowledge_code;
    }
    if (knowledge["2"] && knowledge["2"].length > 0) {
      knowledge_code = knowledge["2"].map((item) => {
        return item.code;
      });
      return knowledge_code;
    }
    return [];
  };
  getKnowledgeExpand = () => {
    // 1.未学习  0.未练习 -3.未掌握-2.掌握一般,-1已掌握
    const { knowledge, nowType } = this.state;
    let knowledge_code = [];
    if (knowledge["0"] && knowledge["0"].length > 0) {
      knowledge_code = knowledge["0"].map((item) => {
        return item.et_id;
      });
      return knowledge_code;
    }
    if (knowledge["-3"] && knowledge["-3"].length > 0 && nowType === "5") {
      knowledge_code = knowledge["-3"].map((item) => {
        return item.et_id;
      });
      return knowledge_code;
    }
    if (knowledge["-2"] && knowledge["-2"].length > 0) {
      knowledge_code = knowledge["-2"].map((item) => {
        return item.et_id;
      });
      return knowledge_code;
    }
    return [];
  };
  goExcersize = () => {
    const { knowledge, nowType, rightRate } = this.state;
    const { userInfo, textBookCode } = this.props;
    const userInfoJs = userInfo.toJS();
    let data = {};
    data.grade_code = userInfoJs.checkGrade;
    data.term_code = userInfoJs.checkTeam;
    data.textbook = textBookCode;
    data.student_code = userInfoJs.id;
    data.answer_origin = nowType;
    data.unit_code = this.props.navigation.state.params.data.unit_code;
    // console.log('提升',knowledge,nowType)
    let knowledge_code = [];
    if (nowType != "2" && nowType != "4" && nowType != "5") {
      knowledge_code = this.getKnowledge();
      if (knowledge_code.length === 0) {
        if (nowType === "7") {
          data.right_rate = JSON.stringify(rightRate);
        } else {
          // 表示全部掌握，全部掌握从rightRate拿lesson_code 同步诊断和拓展应用
          let code_arr = rightRate.sort((a, b) => {
            return a.code - b.code;
          });
          if (code_arr.length > 0) {
            let knowledge_code = code_arr[0].lesson_code;
            data.knowledge_code = JSON.stringify([knowledge_code]);
          }
        }
      } else {
        data.knowledge_code = JSON.stringify(knowledge_code);
      }
    }
    if (nowType === "7") {
      NavigationMathUtil.toDoExerciseMath({
        ...this.props,
        data: {
          ...data,
          pageType: { name: "知识图谱", answer_origin: "improve7" },
        },
      });
    }
    if (nowType === "6") {
      NavigationMathUtil.toDoExerciseMath({
        ...this.props,
        data: {
          ...data,
          pageType: { name: "同步学习", answer_origin: "improve6" },
        },
      });
    }
    if (nowType === "2") {
      NavigationMathUtil.toDoExerciseMath({
        ...this.props,
        data: {
          ...data,
          pageType: { name: "同步计算题", answer_origin: "improve2" },
        },
      });
    }
    if (nowType === "4") {
      NavigationMathUtil.toDoExerciseMath({
        ...this.props,
        data: {
          ...data,
          pageType: { name: "同步应用题", answer_origin: "improve4" },
        },
      });
    }
    if (nowType === "5") {
      let pageType = { name: "拓展应用题", answer_origin: "improve5" };
      if (knowledge[1] && knowledge[1].length > 0) {
        // 表示有未学习的，拿题要走学习题的接口
        pageType.isExpandStudy = true;
        let len = knowledge[1].length;
        let random = Math.floor(Math.random() * (-1 - len + 1) + len);
        data.practical_category = knowledge[1][random].et_id;
      } else {
        // code 0.未练习 -3.未掌握-2.掌握一般 的有值
        let code_arr = this.getKnowledgeExpand();
        if (code_arr.length > 0) {
          let len = code_arr.length;
          let random = Math.floor(Math.random() * (-1 - len + 1) + len);
          data.practical_category = code_arr[random];
        } else {
          // 全部已掌握，用rate_right的code排序
          let code_arr = rightRate.sort((a, b) => {
            return a.code - b.code;
          });
          if (code_arr.length > 0) {
            let et_id = code_arr[0].et_id;
            data.practical_category = et_id;
          }
        }
      }
      NavigationMathUtil.toDoExerciseMath({
        ...this.props,
        data: {
          ...data,
          pageType,
        },
      });
    }
  };
  render() {
    const {
      typeList,
      currentTypeIndex,
      rodarValueList,
      nameList,
      knowledge,
      rightRate,
      nowType,
      dialogVisible,
      paiRodarValueList,
      paiNameList,
      pieValue,
      animating,
      right_rate_map,
    } = this.state;
    return (
      <>
        <ImageBackground
          style={[{ width: "100%", height: "100%" }, styles.container]}
          source={require("../../../../images/improveBg.png")}
        >
          <View
            style={[styles.header, appStyle.flexLine, appStyle.flexJusBetween]}
          >
            <TouchableOpacity onPress={() => this.goBack()}>
              <Image
                style={{ width: pxToDp(64), height: pxToDp(64) }}
                source={require("../../../../images/improveBack.png")}
              ></Image>
            </TouchableOpacity>
            <View style={[appStyle.flexLine]}>
              {typeList.map((item, index) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.typeItem,
                      index === typeList.length - 1 ? { marginRight: 0 } : null,
                    ]}
                    key={index}
                    onPress={() => {
                      this.clickType(item, index);
                    }}
                  >
                    <ImageBackground
                      style={[
                        { width: pxToDp(158), height: pxToDp(104) },
                        appStyle.flexCenter,
                      ]}
                      source={
                        currentTypeIndex === index
                          ? require("../../../../images/improveItemActive.png")
                          : require("../../../../images/improveItem.png")
                      }
                    >
                      <Text
                        style={[
                          { fontSize: pxToDp(28), color: "#fff" },
                          currentTypeIndex === index
                            ? { color: "#0179FF" }
                            : null,
                        ]}
                      >
                        {item.text}
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              onPress={() => {
                this.seePai();
              }}
            >
              <Text style={{ fontSize: pxToDp(32), color: "#fff" }}>
                查看π分排名
              </Text>
            </TouchableOpacity>
          </View>
          {animating ? (
            <LoadingModal animating={animating}></LoadingModal>
          ) : (
            <View style={[appStyle.flexLine, appStyle.flexJusBetween,Platform.OS === 'ios'?{marginTop:pxToDp(80)}:null]}>
              {nowType === "7" || nowType === "6" || nowType === "5" ? (
                <>
                  <View style={[styles.left]}>
                    <Text style={[styles.unitName]}>{this.unit_name}</Text>
                    <View style={[styles.chartWrap]}>
                      <Text
                        style={[{ fontSize: pxToDp(28), color: "#AAAAAA" }]}
                      >
                        答题正确率
                      </Text>
                      {/* {rightRate.length>0? <MyRadarChart width={pxToDp(780)} height={pxToDp(550)} valueList={rodarValueList} namelist={nameList}  />:null} */}
                      <View
                        style={[
                          appStyle.flexCenter,
                          { width: pxToDp(760),flex:1},
                        ]}
                      >
                        {/* {rightRate.length>0?<DataGraphicalDisplayFrame math_frame_svg={['radar_mode1',rodarValueList,nameList,120]}></DataGraphicalDisplayFrame>:null} */}
                        {rightRate.length > 0 ? (
                          <DataGraphicalDisplayFrame
                            math_frame_svg={[
                              "radar_mode2",
                              rodarValueList,
                              nameList,
                              100,
                              [490, 380],
                            ]}
                          ></DataGraphicalDisplayFrame>
                        ) : null}
                      </View>
                    </View>
                    {/* <View style={[appStyle.flexCenter]}>
              <TouchableOpacity style={[appStyle.flexTopLine,appStyle.flexCenter,styles.startBtn]}  onPress={this.goExcersize}>
                <Text style={{fontSize:pxToDp(28),color:"#fff"}}>开始提升</Text>
              </TouchableOpacity>
            </View> */}
                  </View>
                  <ScrollView style={[styles.right]}>
                    {knowledge["0"] ? (
                      <View style={[styles.rightItem]}>
                        <Text
                          style={[
                            styles.statusText,
                            nowType === "5"
                              ? { backgroundColor: "#AAAAAA" }
                              : null,
                          ]}
                        >
                          {nowType === "5" ? "未练习" : "已掌握"}
                        </Text>
                        <View style={[{ padding: pxToDp(20) }]}>
                          {knowledge["0"].map((item, index) => {
                            return (
                              <View style={[appStyle.flexLine]}>
                                {nowType === "5" ? (
                                  <Image
                                    style={{
                                      width: pxToDp(48),
                                      height: pxToDp(48),
                                    }}
                                    source={require("../../../../images/improveStatus_2.png")}
                                  ></Image>
                                ) : (
                                  <Image
                                    style={{
                                      width: pxToDp(48),
                                      height: pxToDp(48),
                                    }}
                                    source={require("../../../../images/improveStatus_0.png")}
                                  ></Image>
                                )}

                                <Text style={{ fontSize: pxToDp(32) }}>
                                  {item.name}
                                </Text>
                                {right_rate_map[item.name] &&
                                right_rate_map[item.name].right_total &&
                                right_rate_map[item.name].right_total !==
                                  "None" ? (
                                  <Text style={{ fontSize: pxToDp(28) }}>
                                    （{right_rate_map[item.name].right_total}/
                                    {right_rate_map[item.name].total}）
                                  </Text>
                                ) : null}
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    ) : null}
                    {knowledge["3"] ? (
                      <View style={[styles.rightItem]}>
                        <Text
                          style={[
                            styles.statusText,
                            { backgroundColor: "#FF9F0A" },
                          ]}
                        >
                          掌握一般
                        </Text>
                        <View style={[{ padding: pxToDp(20) }]}>
                          {knowledge["3"].map((item, index) => {
                            return (
                              <View style={[appStyle.flexLine]}>
                                <Image
                                  style={{
                                    width: pxToDp(48),
                                    height: pxToDp(48),
                                  }}
                                  source={require("../../../../images/improveStatus_3.png")}
                                ></Image>
                                <Text style={{ fontSize: pxToDp(32) }}>
                                  {item.name}
                                </Text>
                                {right_rate_map[item.name] &&
                                right_rate_map[item.name].right_total &&
                                right_rate_map[item.name].right_total !==
                                  "None" ? (
                                  <Text style={{ fontSize: pxToDp(28) }}>
                                    （{right_rate_map[item.name].right_total}/
                                    {right_rate_map[item.name].total}）
                                  </Text>
                                ) : null}
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    ) : null}
                    {/* 拓展应用 */}
                    {knowledge["-3"] ? (
                      <View style={[styles.rightItem]}>
                        <Text
                          style={[
                            styles.statusText,
                            { backgroundColor: "#FC6161" },
                          ]}
                        >
                          未掌握
                        </Text>
                        <View style={[{ padding: pxToDp(20) }]}>
                          {knowledge["-3"].map((item, index) => {
                            return (
                              <View style={[appStyle.flexLine]}>
                                <Image
                                  style={{
                                    width: pxToDp(48),
                                    height: pxToDp(48),
                                  }}
                                  source={require("../../../../images/improveStatus_1.png")}
                                ></Image>
                                <Text style={{ fontSize: pxToDp(32) }}>
                                  {item.name}
                                </Text>
                                {right_rate_map[item.name] &&
                                right_rate_map[item.name].right_total &&
                                right_rate_map[item.name].right_total !==
                                  "None" ? (
                                  <Text style={{ fontSize: pxToDp(28) }}>
                                    （{right_rate_map[item.name].right_total}/
                                    {right_rate_map[item.name].total}）
                                  </Text>
                                ) : null}
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    ) : null}
                    {knowledge["1"] ? (
                      <View style={[styles.rightItem]}>
                        <Text
                          style={[
                            styles.statusText,
                            nowType === "5"
                              ? { backgroundColor: "#AAAAAA" }
                              : { backgroundColor: "#FC6161" },
                          ]}
                        >
                          {nowType === "5" ? "未学习" : "未掌握"}
                        </Text>
                        <View style={[{ padding: pxToDp(20) }]}>
                          {knowledge["1"].map((item, index) => {
                            return (
                              <View style={[appStyle.flexLine]}>
                                {nowType === "5" ? (
                                  <Image
                                    style={{
                                      width: pxToDp(48),
                                      height: pxToDp(48),
                                    }}
                                    source={require("../../../../images/improveStatus_2.png")}
                                  ></Image>
                                ) : (
                                  <Image
                                    style={{
                                      width: pxToDp(48),
                                      height: pxToDp(48),
                                    }}
                                    source={require("../../../../images/improveStatus_1.png")}
                                  ></Image>
                                )}
                                <Text style={{ fontSize: pxToDp(32) }}>
                                  {item.name}
                                </Text>
                                {right_rate_map[item.name] &&
                                (right_rate_map[item.name].right_total ||
                                  right_rate_map[item.name].right_total ===
                                    0) &&
                                right_rate_map[item.name].right_total !==
                                  "None" ? (
                                  <Text style={{ fontSize: pxToDp(28) }}>
                                    （{right_rate_map[item.name].right_total}/
                                    {right_rate_map[item.name].total}）
                                  </Text>
                                ) : null}
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    ) : null}
                    {/* 拓展应用 */}
                    {knowledge["-1"] ? (
                      <View style={[styles.rightItem]}>
                        <Text
                          style={[
                            styles.statusText,
                            { backgroundColor: "#77D102" },
                          ]}
                        >
                          已掌握
                        </Text>
                        <View style={[{ padding: pxToDp(20) }]}>
                          {knowledge["-1"].map((item, index) => {
                            return (
                              <View style={[appStyle.flexLine]}>
                                <Image
                                  style={{
                                    width: pxToDp(48),
                                    height: pxToDp(48),
                                  }}
                                  source={require("../../../../images/improveStatus_0.png")}
                                ></Image>
                                <Text style={{ fontSize: pxToDp(32) }}>
                                  {item.name}
                                </Text>
                                {right_rate_map[item.name] &&
                                right_rate_map[item.name].right_total &&
                                right_rate_map[item.name].right_total !==
                                  "None" ? (
                                  <Text style={{ fontSize: pxToDp(28) }}>
                                    （{right_rate_map[item.name].right_total}/
                                    {right_rate_map[item.name].total}）
                                  </Text>
                                ) : null}
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    ) : null}
                    {knowledge["2"] ? (
                      <View style={[styles.rightItem]}>
                        <Text
                          style={[
                            styles.statusText,
                            { backgroundColor: "#AAAAAA" },
                          ]}
                        >
                          未作答
                        </Text>
                        <View style={[{ padding: pxToDp(20) }]}>
                          {knowledge["2"].map((item, index) => {
                            return (
                              <View style={[appStyle.flexLine]}>
                                <Image
                                  style={{
                                    width: pxToDp(48),
                                    height: pxToDp(48),
                                  }}
                                  source={require("../../../../images/improveStatus_2.png")}
                                ></Image>
                                <Text style={{ fontSize: pxToDp(32) }}>
                                  {item.name}
                                </Text>
                                {right_rate_map[item.name] &&
                                right_rate_map[item.name].right_total &&
                                right_rate_map[item.name].right_total !==
                                  "None" ? (
                                  <Text style={{ fontSize: pxToDp(28) }}>
                                    （{right_rate_map[item.name].right_total}/
                                    {right_rate_map[item.name].total}）
                                  </Text>
                                ) : null}
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    ) : null}
                    {/* 拓展应用 */}
                    {knowledge["-2"] ? (
                      <View style={[styles.rightItem]}>
                        <Text
                          style={[
                            styles.statusText,
                            { backgroundColor: "#FF9F0A" },
                          ]}
                        >
                          掌握一般
                        </Text>
                        <View style={[{ padding: pxToDp(20) }]}>
                          {knowledge["-2"].map((item, index) => {
                            return (
                              <View style={[appStyle.flexLine]}>
                                <Image
                                  style={{
                                    width: pxToDp(48),
                                    height: pxToDp(48),
                                  }}
                                  source={require("../../../../images/improveStatus_3.png")}
                                ></Image>
                                <Text style={{ fontSize: pxToDp(32) }}>
                                  {item.name}
                                </Text>
                                {right_rate_map[item.name] &&
                                right_rate_map[item.name].right_total &&
                                right_rate_map[item.name].right_total !==
                                  "None" ? (
                                  <Text style={{ fontSize: pxToDp(28) }}>
                                    （{right_rate_map[item.name].right_total}/
                                    {right_rate_map[item.name].total}）
                                  </Text>
                                ) : null}
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    ) : null}
                  </ScrollView>
                </>
              ) : (
                <>
                  <ImageBackground
                    source={
                      nowType === "2"
                        ? null
                        : require("../../../../images/improveNodata.png")
                    }
                    style={[styles.left, { width: "49%" }]}
                    resizeMode={"contain"}
                  >
                    {nowType === "2" ? (
                      <>
                        <Text style={[styles.unitName]}>{this.unit_name}</Text>
                        <View style={[styles.chartWrap]}>
                          <View
                            style={[appStyle.flexLine, appStyle.flexJusBetween]}
                          >
                            <Text
                              style={{ fontSize: pxToDp(32), color: "#0179FF" }}
                            >
                              同步计算:答题正确率
                            </Text>
                            <Text
                              style={{ fontSize: pxToDp(32), color: "#0179FF" }}
                            >
                              （{pieValue.r_total}/{pieValue.total}）
                            </Text>
                          </View>
                          {pieValue.right_rate || pieValue.wrong_rate ? (
                            <View
                              style={[
                                appStyle.flexCenter,
                                { marginTop: pxToDp(74),flex:1 },
                              ]}
                            >
                              <CircleStatistcsImprove
                                backgroundColor={"#B2D6FF"}
                                tintColor={"#028BFF"}
                                right={pieValue.right_rate}
                                size={pxToDp(600)}
                                width={pxToDp(110)}
                                total={
                                  Math.round(pieValue.right_rate)+"%"
                                }
                                totalText={"正确率"}
                              />
                            </View>
                          ) : null}
                        </View>
                        {/* <View style={[appStyle.flexCenter]}>
                    <TouchableOpacity style={[appStyle.flexTopLine,appStyle.flexCenter,styles.startBtn]} onPress={this.goExcersize}>
                      <Text style={{fontSize:pxToDp(28),color:"#fff"}}>开始提升</Text>
                    </TouchableOpacity>
                  </View> */}
                      </>
                    ) : null}
                  </ImageBackground>
                  <ImageBackground
                    source={
                      nowType === "4"
                        ? null
                        : require("../../../../images/improveNodata.png")
                    }
                    style={[styles.right2]}
                    resizeMode={"contain"}
                  >
                    {nowType === "4" ? (
                      <>
                        <Text style={[styles.unitName]}>{this.unit_name}</Text>
                        <View style={[styles.chartWrap]}>
                          <View
                            style={[appStyle.flexLine, appStyle.flexJusBetween]}
                          >
                            <Text
                              style={{ fontSize: pxToDp(32), color: "#0179FF" }}
                            >
                              同步应用:答题正确率
                            </Text>
                            <Text
                              style={{ fontSize: pxToDp(32), color: "#0179FF" }}
                            >
                              （{pieValue.r_total}/{pieValue.total}）
                            </Text>
                          </View>
                          {pieValue.right_rate || pieValue.wrong_rate ? (
                            <View
                              style={[
                                appStyle.flexCenter,
                                { marginTop: pxToDp(74),flex:1},
                              ]}
                            >
                              <CircleStatistcsImprove
                                backgroundColor={"#B2D6FF"}
                                tintColor={"#028BFF"}
                                right={pieValue.right_rate}
                                size={pxToDp(600)}
                                width={pxToDp(110)}
                                total={
                                  Math.round(pieValue.right_rate)+"%"
                                }
                                totalText={"正确率"}
                              />
                            </View>
                          ) : null}
                        </View>
                        {/* <View style={[appStyle.flexCenter]}>
                  <TouchableOpacity style={[appStyle.flexTopLine,appStyle.flexCenter,styles.startBtn]} onPress={this.goExcersize}>
                    <Text style={{fontSize:pxToDp(28),color:"#fff"}}>开始提升</Text>
                  </TouchableOpacity>
                </View> */}
                      </>
                    ) : null}
                  </ImageBackground>
                </>
              )}
            </View>
          )}
        </ImageBackground>

        <Modal
          animationType="slide"
          visible={dialogVisible}
          transparent
          style={[
            { width: "100%", height: "100%", backgroundColor: "transparent" },
            appStyle.flexCenter,
          ]}
        >
          <View style={[styles.modalContentWrap]}>
            <View style={[appStyle.flexLine, appStyle.flexJusBetween]}>
              <Text style={{ fontSize: pxToDp(40) }}>{this.unit_name}</Text>
              <TouchableOpacity
                onPress={() => {
                  this.closeModal();
                }}
                style={[{ position: "relative", zIndex: 1 }]}
              >
                <Image
                  style={{ width: pxToDp(64), height: pxToDp(64) }}
                  source={require("../../../../images/modalCloseIcon.png")}
                ></Image>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: pxToDp(32), color: "#AAAAAA" }}>
              π分排名
            </Text>
            {/* <MyRadarChart width={pxToDp(660)} height={pxToDp(630)} valueList={paiRodarValueList} namelist={paiNameList}  /> */}
            {/* <DataGraphicalDisplayFrame math_frame_svg={['radar_mode1',paiRodarValueList,paiNameList,120]}></DataGraphicalDisplayFrame> */}
            <View style={[appStyle.flexCenter]}>
              {rightRate.length > 0 ? (
                <DataGraphicalDisplayFrame
                  math_frame_svg={[
                    "radar_mode2",
                    paiRodarValueList,
                    paiNameList,
                    100,
                    [490, 380],
                  ]}
                ></DataGraphicalDisplayFrame>
              ) : null}
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: pxToDp(40),
  },
  header: {
    marginBottom: pxToDp(40),
  },
  typeItem: {
    marginRight: pxToDp(40),
  },
  left: {
    width: pxToDp(880),
    height:fitHeight(0.75,0.75),
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    paddingTop: pxToDp(40),
    paddingBottom: pxToDp(40),
    paddingLeft: pxToDp(30),
    paddingRight: pxToDp(30),
  },
  right: {
    height:fitHeight(0.75,0.75),
    borderRadius: pxToDp(32),
    marginLeft: pxToDp(40),
  },
  right2: {
    width: "49%",
    height:fitHeight(0.75,0.75),
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    marginLeft: pxToDp(40),
    paddingTop: pxToDp(40),
    paddingBottom: pxToDp(40),
    paddingLeft: pxToDp(30),
    paddingRight: pxToDp(30),
  },
  unitName: {
    fontSize: pxToDp(40),
    color: "#0179FF",
  },
  chartWrap: {
    height: fitHeight(0.63,0.653),
    backgroundColor: "#F6FBFF",
    borderRadius: pxToDp(24),
    marginTop: pxToDp(28),
    padding: pxToDp(32),
  },
  startBtn: {
    width: pxToDp(360),
    height: pxToDp(64),
    backgroundColor: "#0179FF",
    marginTop: pxToDp(30),
    borderRadius: pxToDp(8),
  },
  rightItem: {
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    marginBottom: pxToDp(40),
  },
  statusText: {
    borderTopLeftRadius: pxToDp(32),
    borderBottomRightRadius: pxToDp(32),
    backgroundColor: "#77D102",
    width: pxToDp(192),
    height: pxToDp(64),
    textAlign: "center",
    lineHeight: pxToDp(64),
    fontSize: pxToDp(32),
    color: "#fff",
  },
  circle: {
    width: pxToDp(20),
    height: pxToDp(20),
    borderRadius: pxToDp(10),
    marginRight: pxToDp(12),
  },
  dui: {
    color: "#77D102",
    fontSize: pxToDp(36),
    position: "absolute",
    right: pxToDp(100),
    top: pxToDp(140),
  },
  cuo: {
    color: "#FC6161",
    fontSize: pxToDp(36),
    position: "absolute",
    left: pxToDp(120),
    bottom: pxToDp(50),
  },
  modalContentWrap: {
    width: pxToDp(800),
    // height: fitHeight(0.4),
    backgroundColor: "#fff",
    borderRadius: pxToDp(64),
    padding: pxToDp(64),
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    textBookCode: state.getIn(["bagMath", "textBookCode"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(SpecailImprovePage);
