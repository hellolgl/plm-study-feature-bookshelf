import React, { PureComponent } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from "react-native";
import _, { size } from "lodash";

import {
  borderRadius_tool,
  pxToDp,
  size_tool,
} from "../../../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../../../theme";
import { connect } from "react-redux";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

class TimeLineModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      now_grade_code: "",
      language_data: {},
    };
  }
  componentDidMount() {
    this.getData();
  }

  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    let language_data = props.language_data.toJS();
    const { type } = language_data;
    if (type !== tempState.language_data.type) {
      console.log("切换语言", language_data);
      tempState.language_data = JSON.parse(JSON.stringify(language_data));
      return tempState;
    }
    return null;
  }

  getData = () => {
    const { language_data } = this.state;
    const { knowledge_code, origin } = this.props;
    const { main_language_map, other_language_map, show_type, trans_language } =
      language_data;
    let info = this.props.userInfo.toJS();
    const { textCode } = this.props;
    // let params = {
    //     knowledge_code,
    //     language: trans_language,
    //     textbook: this.props.textCode
    // }
    axios
      .get(api.getMathAiGiveHistoryKnow, {
        params: {
          origin,
          knowledge_code: knowledge_code,
          textbook: textCode,
        },
      })
      .then((res) => {
        let data = JSON.parse(JSON.stringify(res.data.data));
        data.forEach((i, x) => {
          i.grade_code_z = main_language_map[i.grade_code];
          // i.grade_code_c = other_language_map[i.grade_code]
          i.children.forEach((ii, xx) => {
            // if (show_type === '1') {
            ii.knowledge_name_z = ii.knowledge_name;
            // ii.knowledge_name_c = ii.language_knowledge_name
            // } else {
            // ii.knowledge_name_z = ii.language_knowledge_name
            // ii.knowledge_name_c = ii.knowledge_name
            // }
          });
        });
        console.log("history", data);

        this.setState({
          list: data,
          now_grade_code: info.checkGrade + info.checkTeam,
        });
      });
  };

  close = () => {
    this.props.close();
  };
  lookexercise = (id) => {
    this.props.lookexercise(id);
  };

  render() {
    const { list, now_grade_code } = this.state;
    const { knowledge_code } = this.props;
    return (
      <View style={[styles.container]}>
        <TouchableWithoutFeedback onPress={this.close}>
          <View style={[styles.click_region]}></View>
        </TouchableWithoutFeedback>
        <View style={[styles.content]}>
          <View style={[styles.inner]}>
            <View
              style={[
                appStyle.flexTopLine,
                appStyle.flexJusBetween,
                appStyle.flexAliCenter,
                { paddingRight: pxToDp(40), marginBottom: pxToDp(20) },
              ]}
            >
              <Text
                style={[
                  { fontSize: pxToDp(48), color: "#4C4C59" },
                  appFont.fontFamily_jcyt_700,
                ]}
              >
                答题记录
              </Text>
              <Text
                style={[
                  { fontSize: pxToDp(28), color: "#4C4C59" },
                  appFont.fontFamily_jcyt_500,
                ]}
              >
                知识点正确率仅针对智能学习计划的答题情况
              </Text>
            </View>
            <ScrollView
              contentContainerStyle={{
                paddingBottom: pxToDp(100),
                paddingRight: pxToDp(40),
              }}
            >
              {list.map((i, x) => {
                return (
                  <View key={x} style={[appStyle.flexTopLine, styles.item]}>
                    <View style={[styles.left]}>
                      <View
                        style={[
                          appStyle.flexLine,
                          {
                            marginBottom:
                              Platform.OS === "android"
                                ? pxToDp(-10)
                                : pxToDp(10),
                          },
                        ]}
                      >
                        <Text
                          style={[mathFont.txt_36_700, mathFont.txt_4C4C59]}
                        >
                          {i.grade_code_z}
                        </Text>
                        <View
                          style={[
                            styles.circle,
                            now_grade_code === i.grade_code
                              ? { borderColor: "#FFB74C" }
                              : null,
                          ]}
                        ></View>
                      </View>
                      {/* {show_translate?<Text style={[mathFont.txt_28_500,mathFont.txt_4C4C59_50]}>{i.grade_code_c}</Text>:null} */}
                    </View>
                    <View
                      style={[
                        styles.right,
                        x === list.length - 1 ? { paddingBottom: 0 } : null,
                      ]}
                    >
                      {i.children.map((ii, xx) => {
                        return (
                          <View
                            key={xx}
                            style={[
                              styles.right_item,
                              appStyle.flexTopLine,
                              appStyle.flexJusBetween,
                              ii.knowledge_code === knowledge_code
                                ? styles.right_item_active
                                : null,
                            ]}
                          >
                            <View
                              style={[{ flex: 1, paddingRight: pxToDp(20) }]}
                            >
                              <Text
                                style={[
                                  mathFont.txt_36_700,
                                  mathFont.txt_4C4C59,
                                  {
                                    marginBottom:
                                      Platform.OS === "android"
                                        ? pxToDp(-10)
                                        : pxToDp(10),
                                  },
                                ]}
                              >
                                {ii.knowledge_name_z}
                              </Text>
                              {ii.exercise_times_id === 0 ? null : (
                                <View
                                  style={[
                                    appStyle.flexTopLine,
                                    appStyle.flexAliCenter,
                                  ]}
                                >
                                  <Text
                                    style={[
                                      mathFont.txt_32_500,
                                      mathFont.txt_4C4C59,
                                      {
                                        marginBottom:
                                          Platform.OS === "android"
                                            ? pxToDp(-10)
                                            : pxToDp(10),
                                        marginRight: pxToDp(20),
                                      },
                                    ]}
                                  >
                                    正确率
                                  </Text>

                                  <Text
                                    style={[
                                      mathFont.txt_40_700,
                                      {
                                        marginBottom:
                                          Platform.OS === "android"
                                            ? pxToDp(-10)
                                            : pxToDp(10),
                                        color:
                                          ii.right_rate >= 90
                                            ? "#35CAB2"
                                            : ii.right_rate >= 59
                                            ? "#89A3FF"
                                            : "#FFA190",
                                      },
                                    ]}
                                  >
                                    {ii.right_rate + "%"}
                                  </Text>
                                </View>
                              )}
                            </View>
                            {ii.exercise_times_id === 0 ? null : (
                              <TouchableOpacity
                                onPress={this.lookexercise.bind(
                                  this,
                                  ii.exercise_times_id
                                )}
                              >
                                <View
                                  style={[
                                    size_tool(150, 72),
                                    borderRadius_tool(40),
                                    {
                                      paddingBottom: pxToDp(4),
                                      backgroundColor: "#00836D",
                                    },
                                  ]}
                                >
                                  <View
                                    style={[
                                      appStyle.flexCenter,
                                      borderRadius_tool(40),
                                      { flex: 1, backgroundColor: "#00B295" },
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        { fontSize: pxToDp(32), color: "#fff" },
                                        appFont.fontFamily_jcyt_700,
                                      ]}
                                    >
                                      查看
                                    </Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            )}
                            {/* {show_translate?<Text style={[mathFont.txt_24_500,mathFont.txt_4C4C59]}>{ii.knowledge_name_c}</Text>:null} */}
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    position: "absolute",
    top: 0,
    left: 0,
  },
  click_region: {
    flex: 1,
    backgroundColor: "rgba(71, 82, 102, 0.5)",
  },
  content: {
    position: "absolute",
    right: 0,
    top: 0,
    borderTopLeftRadius: pxToDp(40),
    borderBottomLeftRadius: pxToDp(40),
    width: pxToDp(1160),
    backgroundColor: "#DAE2F2",
    height: windowHeight,
    zIndex: 1,
  },
  inner: {
    width: "100%",
    height: windowHeight - pxToDp(6),
    backgroundColor: "#fff",
    padding: pxToDp(40),
    borderTopLeftRadius: pxToDp(40),
    borderBottomLeftRadius: pxToDp(40),
    paddingRight: 0,
  },
  left: {
    width: "26%",
    // backgroundColor:"red",
    ...appStyle.flexAliEnd,
    paddingRight: pxToDp(48),
    zIndex: 1,
  },
  right: {
    // backgroundColor:"pink",
    flex: 1,
    borderLeftWidth: pxToDp(4),
    borderColor: "#DFDFEC",
    paddingLeft: pxToDp(28),
    paddingBottom: pxToDp(60),
  },
  right_item: {
    marginBottom: pxToDp(20),
    paddingLeft: pxToDp(20),
  },
  right_item_active: {
    backgroundColor: "#FFF0D2",
    borderRadius: pxToDp(40),
    padding: pxToDp(20),
  },
  circle: {
    width: pxToDp(16),
    height: pxToDp(16),
    borderRadius: pxToDp(8),
    borderWidth: pxToDp(4),
    borderColor: "#DFDFEC",
    backgroundColor: "#fff",
    position: "absolute",
    right: pxToDp(-58),
    zIndex: 1,
  },
});
const mapStateToProps = (state) => {
  return {
    language_data: state.getIn(["languageMath", "language_data"]),
    textCode: state.getIn(["bagMath", "textBookCode"]),
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(TimeLineModal);
