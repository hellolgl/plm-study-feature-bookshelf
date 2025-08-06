import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Modal,
  ImageBackground,
  Image,
} from "react-native";
import { pxToDp } from "../../util/tools";
import { appStyle, appFont } from "../../theme";
import NavigationUtil from "../../navigator/NavigationUtil";
import { connect } from "react-redux";
import Label from "./components/Label";
import axios from "../../util/http/axios";
import api from "../../util/http/api";
import * as _ from "lodash";
import Voice from "./components/Voice";
import Choice from "./components/Choice";
import QuantitativeRelationship from "./components/QuantitativeRelationship";
import CheckType from "./components/checkType";
// import SelectGradeAndTerm from "../../component/SelectGradeAndTerm";
// const step_arr = ["学生自测", "家长评估", "测试结果"];
const step_arr = ["学生自测", "测试结果"];

const log = console.log.bind(console);

class CustomHomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.nextThrottle = _.debounce(this.next, 300);
    this.customThrottle = _.debounce(this.custom, 300);
    this.exercise_set_id = "";
    this.state = {
      visible: false,
      step_index: 0,
      topic_data: {},
      topic_list: [],
      topic_index: 0,
      exercise_set_id: "",
      finish_step_arr: [],
      chartData: [],
    //   fromPlan: props.navigation.state.params.data.fromPlan,
      gradeVisible: false,
      checkedGrade: false,
    };
    this.refMap = {};
  }

  goBack = () => {
    //
    // if (this.props.navigation.state.params.data.fromPlan) {
      NavigationUtil.goBack(this.props);
    // } else {
    //   NavigationUtil.toHomePage(this.props);
    // }
  };

  componentDidMount() {
    this.getData();
    // this.getTagList()
  }

  formatData = (rawData) => {
    return rawData.map((d, index) => {
      const tagData = this.addQuestionTag(d, index);
      const formatData = this.formatParams(tagData);
      return formatData;
    });
  };

  formatParams = (data) => {
    const d = data;
    if (d.alias === "chinese_toPinyinHome") {
      d.stem = d.private_exercise_stem;
      d.choice_content = d.exercise_content;
      d.answerList = [d.answer_content];
    } else if (
      d.alias === "chinese_toPinyinHome" ||
      d.alias === "chinese_toWisdomTree" ||
      d.alias === "chinese_toChooseText"
    ) {
      d.choice_content = d.exercise_content;
      d.stem = d.private_exercise_stem;
      d.answerList = [d.answer_content];
    } else if (
      d.alias === "english_toSelectUnitEn2" ||
      d.alias === "english_toSelectUnitEn1"
    ) {
      d.stem = d.private_exercise_stem;
      d.answerList = [d.answer_content];
    } else if (d.alias === "math_program") {
      d.choice_content = d.option.join("#");
      d.answerList = [d.answer];
    } else if (d.alias === "math_cleverCalculation") {
      d.choice_content = d.exercise_content;
      d.stem_audio = "";
      d.answerList = [d.right_answer];
      if (d.topic_type === "1") {
        let s = '"' + d.exercise_stem + '"';
        d.stem = JSON.parse(JSON.parse(s));
        let _c = d.choice_content.split("#");
        _c.forEach((i, index) => {
          let _i = '"' + i + '"';
          _c[index] = JSON.parse(JSON.parse(_i));
        });
        d.choice_content = _c;
      } else {
        d.stem = d.exercise_stem
          .replace(/<[^>]+>/g, "")
          .replace(/ /gi, "")
          .replace(/\s/g, "");
      }
    } else if (
      d.alias === "math_thinkingTraining" &&
      d["questionType"] === "choiceQuestion"
    ) {
      d.choice_content = d.options.map((_d) => _d["option"]).join("#");
      const m = {
        A: 0,
        B: 1,
        C: 2,
        D: 3,
      };
      d.answerList = d.answer_contents[0]["answer"]
        .split(",")
        .map((_d) => d.options[m[_d]]["option"]);
      if (d.answerList.length > 1) {
        d.stem = `<h4>多选题: </h4>${d.stem}`;
        // 添加多选字段
        d.exercise_type = "2";
      }
    }
    return d;
  };

  addQuestionTag = (data, index) => {
    const { step_index } = this.state;
    const i = index;
    const d = data;
    const choiceQuestionModuleList = [
      "chinese_toPinyinHome", // 拼音
      "chinese_toWisdomTree", // 字学树
      "chinese_toChooseText", // 字词积累
      "math_cleverCalculation", // 巧算
      "math_program", // 编程
      "english_toSelectUnitEn1", // words
      "english_toSelectUnitEn2", // testMe
    ];
    const voiceQuestionModuleList = [
      "english_toAbcs", // ABC's
    ];

    if (i === 0 && step_index === 0) {
      d["canChooseNum"] = 3;
    } //学生自测第一题特殊处理，最多选三个
    if (!_.has(d, "questionType")) {
      if (d["alias"] === "math_thinkingTraining") {
        // 数量关系题型
        if (d["displayed_type"] === "e-t-aGVyAN8DW8YwduwG3scXnV") {
          d["questionType"] = "QRQuestion";
        } else {
          d["questionType"] = "choiceQuestion";
        }
      } else if (!_.has(d, "alias")) {
        d["questionType"] = "choiceQuestion";
      } else if (_.includes(choiceQuestionModuleList, d["alias"])) {
        d["questionType"] = "choiceQuestion";
      } else if (_.includes(voiceQuestionModuleList, d["alias"])) {
        d["questionType"] = "voiceQuestion";
      } else {
        d["questionType"] = "otherQuestion";
      }
    }
    return d;
  };

  getData = () => {
    const userInfo = this.props.userInfo.toJS();
    const { checkedGrade } = this.state;
    let params = {
      grade_code: userInfo.checkGrade,
      term_code: userInfo.checkTeam,
    };
    console.log("数据=======", params);

    axios.get(api.getCustomExercise, { params }).then((res) => {
      this.exercise_set_id = res.data.data.exercise_set_id;
      let data = res.data.data;
      // let isFinish =
      //   data.heart_data.length === 0 &&
      //   // data.parent_data.length === 0 &&
      //   data.stu_data.length === 0;
      let isFinish = data.is_finish === "1";
    //   let isFinish = false;
      console.log("========", res.data.data);

      this.setState(
        {
          topic_data: res.data.data,
          step_index: isFinish ? 1 : 0,
          finish_step_arr: isFinish ? [0] : [],
          checkedGrade: true,
          gradeVisible: !isFinish && !checkedGrade,
        },
        () => {
          isFinish ? this.getTagList() : this.setNowTopicList();
        }
      );
    });
  };

  setNowTopicList = () => {
    const _getItemNums = (d) => {
      return _.has(d, "exercise_answer") && d["exercise_answer"] !== "";
    };
    const { step_index, topic_data } = this.state;
    let topic_list = [];
    const isParentMode =
        _.concat(topic_data["heart_data"], topic_data["stu_data"]).filter((d) =>
            _getItemNums(d)
        ).length ===
            _.concat(topic_data["heart_data"], topic_data["stu_data"]).length ||
        step_index === 1;
        if (isParentMode) {
        topic_list = topic_data.parent_data;
        } else {
        topic_list = _.concat(topic_data["heart_data"], topic_data["stu_data"]);
        }
        this.setState({
        topic_list: this.formatData(topic_list),
        topic_index: topic_list.filter((d) => _getItemNums(d)).length,
        finish_step_arr: isParentMode ? [0] : [],
        step_index: isParentMode ? 1 : 0,
        // step_index: 0,
    });
    };

    diagnosis = () => {
        const { topic_index, topic_list } = this.state;
        const currentTopic = topic_list[topic_index];
        const { questionType } = currentTopic;
        const currentRef = this.refMap[questionType];
        const result = currentRef?.current.diagnosis();
        return result;
    };

saveTopic = ({ correction, answer_content }, step_index, topic) => {
    const { alias, id, exercise_id, pb_id, t_s_id, e_c_id } = topic;
    let params = {
      exercise_id: id,
      answer_content: answer_content,
      exercise_set_id: this.exercise_set_id,
    };
    if (alias) params.exercise_id = exercise_id;
    if (alias === "math_program") params.exercise_id = id;
    if (alias === "chinese_toPinyinHome") params.exercise_id = pb_id;
    if (alias === "math_thinkingTraining") params.exercise_id = t_s_id;
    if (alias === "math_cleverCalculation") params.exercise_id = e_c_id;
    let save_api = api.saveCustomHeartRecords; //保存心理题目api
    if (step_index === 0 && alias) {
      //第一步的学生题目
      const userInfo = this.props.userInfo.toJS();
      save_api = api.saveCustomStudentRecords; //保存学生题目api
      params.correction = correction;
      params.grade_code = userInfo.checkGrade;
      params.term_code = userInfo.checkTeam;
    }
    if (step_index === 1) save_api = api.saveCustomParentRecords; //保存家长题目api
    console.log("题目保存数据::::::::::::", params, save_api);
    axios
      .post(save_api, params)
      .then((res) => {
        log("保存单个题目结果: ", res);
      })
      .catch((error) => {
        log("ERROR: ", error);
      });
  };

  saveExercise = () => {
    let params = {
      exercise_set_id: this.exercise_set_id,
    };
    console.log("套题保存数据:::::::::", params);
    axios.put(api.saveExerciseRecords, params).then((res) => {
      this.getTagList();
    });
  };

  getTagList = () => {
    // const userInfo = this.props.userInfo.toJS();
    // let params = {};
    // params.grade_code = userInfo.checkGrade;
    // params.term_code = userInfo.checkTeam;
    // params.exercise_set_id = this.exercise_set_id;
    // axios.get(api.getCustomTags, { params }).then((res) => {
    //   console.log("标签:::::::::", res.data);
    //   const data = res.data.data;
    //   let data_arr = [];
    //   data.forEach((i, x) => {
    //     let item = {
    //       name: i.tag,
    //       value: 1,
    //       check: i.status === "0" ? 0 : 1,
    //     };
    //     data_arr.push(item);
    //   });
    //   this.setState({
    //     chartData: data_arr,
    //     step_index: 1,
    //   });
    // });
    this.setState({
      step_index: 1,
    });
  };

  next = () => {
    const { topic_index, step_index, topic_list, finish_step_arr } = this.state;
    console.log("数据", topic_index, topic_list, finish_step_arr);
    if (topic_list.length === 0) {
      this.saveExercise();
      this.custom();
      return;
    }
    // 增加诊断逻辑
    const result = this.diagnosis();

    // 单个题目保存
    this.saveTopic(result, step_index, topic_list[topic_index]);

    if (topic_index + 1 === topic_list.length) {
      //当前阶段最后一道题做完
      console.log("当前阶段最后一道题做完");
      if (step_index + 1 === step_arr.length - 1) this.saveExercise(); //一套题做完保存
      let _f = _.cloneDeep(finish_step_arr);
      _f.push(step_index);
      this.setState(
        {
          // step_index: step_index + 1,
          finish_step_arr: _f,
        },
        () => {
          if (step_index + 1 < step_arr.length - 1) this.setNowTopicList();
        }
      );
      return;
    }
    this.setState({
      topic_index: topic_index + 1,
    });
  };

  custom = () => {
    NavigationUtil.toHomePage({ ...this.props });
  };

  renderChoiceQuestion = (topic) => {
    const choiceRef = React.createRef();
    this.refMap["choiceQuestion"] = choiceRef;
    return <Choice topic={topic} ref={choiceRef}></Choice>;
  };

  renderVoiceQuestion = (topic) => {
    const voiceComponentRef = React.createRef();
    this.refMap["voiceQuestion"] = voiceComponentRef;
    return <Voice topic={topic} ref={voiceComponentRef} />;
  };

  renderOtherQuestion = (topic) => {
    return <Text>renderOtherQuestion</Text>;
  };

  renderQRQuestion = (topic) => {
    const QRComponentRef = React.createRef();
    this.refMap["QRQuestion"] = QRComponentRef;
    return <QuantitativeRelationship topic={topic} ref={QRComponentRef} />;
  };

  renderTopic = (topic) => {
    const { questionType } = topic;
    const m = {
      choiceQuestion: this.renderChoiceQuestion,
      voiceQuestion: this.renderVoiceQuestion,
      QRQuestion: this.renderQRQuestion,
      otherQuestion: this.renderOtherQuestion,
    };
    return m[questionType](topic);
  };

  render() {
    const userInfo = this.props.userInfo.toJS();
    const {
      visible,
      step_index,
      topic_list,
      topic_index,
      finish_step_arr,
      chartData,
    //   fromPlan,
      gradeVisible,
    } = this.state;
    const currentTopic = topic_list[topic_index];
    console.log("当前题目::::::::", currentTopic, finish_step_arr);
    let length = step_arr.length - 1;
    return (
      <ImageBackground
        source={require("../../images/custom/bg_1.png")}
        style={[styles.container]}
      >
        <View style={[styles.header]}>
          <TouchableOpacity
            style={[
              styles.back_btn,
              Platform.OS === "ios" ? { top: pxToDp(40) } : null,
            ]}
            onPress={this.goBack}
          >
            <Image
              style={[
                {
                  width: pxToDp(40),
                  height: pxToDp(40),
                  marginRight: pxToDp(20),
                },
              ]}
              source={require("../../images/custom/back_icon_1.png")}
            ></Image>
            <Text
              style={[
                appFont.fontFamily_jcyt_500,
                { color: "#2D3040", fontSize: pxToDp(28) },
              ]}
            >
              {/* {fromPlan ? "返回" : "返回派小学"} */}
             返回
            </Text>
          </TouchableOpacity>
          <View style={[appStyle.flexLine]}>
            {step_arr.map((i, x) => {
              let active = x === step_index;
              let finish = finish_step_arr.indexOf(x) > -1;
              return (
                <View key={i} style={[styles.nav_item]}>
                  <View
                    style={[
                      styles.nav_item_left,
                      active
                        ? { backgroundColor: "#2D3040", borderWidth: 0 }
                        : null,
                      finish
                        ? {
                            backgroundColor: "rgba(45, 48, 64, 0.50)",
                            borderWidth: 0,
                          }
                        : null,
                    ]}
                  >
                    {finish ? (
                      <Image
                        style={[
                          {
                            width: pxToDp(40),
                            height: pxToDp(40),
                            marginRight: pxToDp(20),
                          },
                        ]}
                        source={require("../../images/custom/icon_1.png")}
                      ></Image>
                    ) : (
                      <View
                        style={[
                          styles.nav_item_circle,
                          active ? { borderColor: "#fff" } : null,
                        ]}
                      ></View>
                    )}
                    <Text
                      style={[
                        { color: "#2D3040", fontSize: pxToDp(32) },
                        appFont.fontFamily_jcyt_500,
                        active || finish ? { color: "#fff" } : null,
                      ]}
                    >
                      {i}
                    </Text>
                  </View>
                  {x === length ? null : (
                    <View
                      style={[
                        styles.nav_item_right,
                        active || finish
                          ? { backgroundColor: "#908F94" }
                          : null,
                      ]}
                    ></View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
        <View style={[styles.content]}>
          <View
            style={[
              styles.content_inner,
              step_index === length ? { padding: 0 } : null,
            ]}
          >
            {step_index < length ? (
              <View
                style={[{ marginBottom: pxToDp(40) }, appStyle.flexAliCenter]}
              >
                <View style={[appStyle.flexLine]}>
                  {topic_list.map((i, x) => {
                    return (
                      <View
                        key={x}
                        style={[
                          styles.topic_circle,
                          x === topic_list.length - 1
                            ? { marginRight: 0 }
                            : null,
                          topic_index === x
                            ? { backgroundColor: "#2D3040" }
                            : null,
                        ]}
                      ></View>
                    );
                  })}
                </View>
              </View>
            ) : null}
            {currentTopic && step_index < length ? (
              <ScrollView
                contentContainerStyle={[{ paddingBottom: pxToDp(240) }]}
              >
                <View>{this.renderTopic(currentTopic)}</View>
              </ScrollView>
            ) : step_index === length ? (
              <View style={[styles.content_3]}>
                <View style={[styles.content_3_left]}>
                  {/* <Text
                    style={[
                      { color: "#2D3040", fontSize: pxToDp(48) },
                      appFont.fontFamily_jcyt_700,
                      Platform.OS === "ios"
                        ? { marginBottom: pxToDp(20) }
                        : null,
                    ]}
                  >
                    我的标签：
                  </Text> */}
                  <CheckType navigation={this.props.navigation} />
                  {/* {chartData.length > 0 ? (
                      // <Label chartData={chartData}></Label>
                  <CheckType />
                  ) : (
                    <Text>加载中...</Text>
                  )} */}
                </View>
                <View style={[styles.content_3_right]}>
                  <Text
                    style={[
                      { color: "#2D3040", fontSize: pxToDp(36) },
                      appFont.fontFamily_jcyt_700,
                      Platform.OS === "ios"
                        ? { marginBottom: pxToDp(20) }
                        : null,
                    ]}
                  >
                    定制规则：
                  </Text>
                  <Text
                    style={[
                      {
                        color: "rgba(45, 48, 64, 0.50)",
                        fontSize: pxToDp(32),
                      },
                      appFont.fontFamily_jcyt_500,
                    ]}
                  >
                    以提升学生学习能力为基础，智能推荐模块内容。
                  </Text>
                  <Text
                    style={[
                      {
                        color: "rgba(45, 48, 64, 0.50)",
                        fontSize: pxToDp(32),
                      },
                      appFont.fontFamily_jcyt_500,
                    ]}
                  >
                    首次完成个性化测试，系统奖励200派币。
                  </Text>
                  {step_index < length ? null : (
                    <TouchableOpacity
                      style={[styles.btn]}
                      onPress={this.customThrottle}
                    >
                      <View
                        style={[
                          {
                            backgroundColor: "#2D3040",
                            width: pxToDp(260),
                            height: pxToDp(168),
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: pxToDp(50),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            {
                              color: "#fff",
                              fontSize: pxToDp(40),
                              lineHeight: pxToDp(40),
                              marginBottom: pxToDp(20),
                            },
                            appFont.fontFamily_jcyt_700,
                          ]}
                        >
                          去派小学
                        </Text>
                        <Text
                          style={[
                            {
                              color: "#fff",
                              fontSize: pxToDp(28),
                              opacity: 0.5,
                              lineHeight: pxToDp(30),
                            },
                            appFont.fontFamily_jcyt_700,
                          ]}
                        >
                          暂不体验
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : null}
            {step_index < length ? (
              <TouchableOpacity
                style={[styles.btn_continue]}
                onPress={this.nextThrottle}
              >
                <View style={[styles.btn_inner]}>
                  <Text
                    style={[
                      { color: "#2D3040", fontSize: pxToDp(40) },
                      appFont.fontFamily_jcyt_700,
                    ]}
                  >
                    继续
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <Modal animationType="fade" transparent visible={visible}>
          <View style={[styles.m_container]}>
            <View style={[styles.m_avatar_wrap]}>
              <View style={[styles.m_avatar]}>
                <Image
                  source={require("../../images/homepage/head.png")}
                  style={[
                    {
                      width: pxToDp(160),
                      height: pxToDp(160),
                      borderRadius: pxToDp(80),
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  { color: "#2D3040", fontSize: pxToDp(40) },
                  appFont.fontFamily_jcyt_500,
                ]}
              >
                {userInfo.name}
              </Text>
            </View>
            <View style={[styles.m_content]}>
              <Text
                style={[
                  styles.m_txt_1,
                  Platform.OS === "android"
                    ? { marginBottom: pxToDp(-30) }
                    : null,
                ]}
              >
                您好！
              </Text>
              <Text style={[styles.m_txt_1]}>
                个性化服务定制可以帮助我们更好的了解您的学习情况，
                通过您的学习情况深度定制您的专属学习模块。
              </Text>
              <TouchableOpacity
                style={[styles.m_btn]}
                onPress={() => {
                  this.setState({
                    visible: false,
                  });
                }}
              >
                <View style={[styles.m_btn_inner]}>
                  <Text
                    style={[
                      { color: "#2D3040", fontSize: pxToDp(40) },
                      appFont.fontFamily_jcyt_700,
                    ]}
                  >
                    个性化服务定制
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* <SelectGradeAndTerm
          visible={gradeVisible}
          close={() => {
            this.getData();
            this.setState({
              gradeVisible: false,
            });
          }}
          fromPlan={true}
        ></SelectGradeAndTerm> */}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    ...appStyle.flexCenter,
    height: pxToDp(120),
  },
  back_btn: {
    position: "absolute",
    left: pxToDp(20),
    top: pxToDp(20),
    ...appStyle.flexLine,
  },
  nav_item: {
    ...appStyle.flexLine,
  },
  nav_item_left: {
    width: pxToDp(248),
    height: pxToDp(72),
    borderColor: "rgba(36, 39, 47, 0.10)",
    borderWidth: pxToDp(4),
    borderRadius: pxToDp(60),
    ...appStyle.flexCenter,
    ...appStyle.flexLine,
  },
  nav_item_right: {
    width: pxToDp(80),
    height: pxToDp(4),
    backgroundColor: "rgba(36, 39, 47, 0.10)",
  },
  nav_item_circle: {
    width: pxToDp(40),
    height: pxToDp(40),
    borderRadius: pxToDp(20),
    borderWidth: pxToDp(3),
    borderColor: "#2D3040",
    marginRight: pxToDp(20),
  },
  content: {
    flex: 1,
    paddingLeft: pxToDp(80),
    paddingRight: pxToDp(80),
    paddingBottom: pxToDp(40),
  },
  content_inner: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: pxToDp(80),
    padding: pxToDp(40),
  },
  topic_circle: {
    width: pxToDp(20),
    height: pxToDp(20),
    borderRadius: pxToDp(10),
    marginRight: pxToDp(20),
    borderColor: "#2D3040",
    borderWidth: pxToDp(2),
  },
  btn: {
    position: "absolute",
    bottom: pxToDp(80),
    alignSelf: "center",
  },
  btn_continue: {
    width: pxToDp(200),
    height: pxToDp(200),
    borderRadius: pxToDp(100),
    backgroundColor: "#FFB649",
    paddingBottom: pxToDp(8),
    position: "absolute",
    bottom: pxToDp(40),
    right: pxToDp(40),
  },
  btn_inner: {
    flex: 1,
    backgroundColor: "#FFDB5D",
    ...appStyle.flexCenter,
    borderRadius: pxToDp(100),
  },
  m_container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    ...appStyle.flexCenter,
  },
  m_content: {
    width: pxToDp(1480),
    height: pxToDp(742),
    borderRadius: pxToDp(80),
    backgroundColor: "#fff",
    paddingLeft: pxToDp(140),
    paddingRight: pxToDp(140),
    ...appStyle.flexAliCenter,
    paddingTop: pxToDp(260),
  },
  m_avatar_wrap: {
    marginBottom: pxToDp(-180),
    zIndex: 1,
    ...appStyle.flexCenter,
  },
  m_txt_1: {
    color: "#2D3040",
    fontSize: pxToDp(48),
    ...appFont.fontFamily_jcyt_500,
    textAlign: "center",
  },
  m_btn: {
    width: pxToDp(440),
    height: pxToDp(128),
    backgroundColor: "#FFB649",
    borderRadius: pxToDp(40),
    paddingBottom: pxToDp(8),
    marginTop: pxToDp(80),
  },
  m_btn_inner: {
    flex: 1,
    borderRadius: pxToDp(40),
    backgroundColor: "#FFDB5D",
    ...appStyle.flexCenter,
  },
  m_avatar: {
    backgroundColor: "#fff",
    padding: pxToDp(4),
    borderRadius: pxToDp(80),
  },
  content_3: {
    flex: 1,
    ...appStyle.flexLine,
  },
  content_3_left: {
    // width: "82%",
    // height: "100%",
    flex: 1,
    paddingLeft: pxToDp(80),
    paddingRight: pxToDp(80),
    paddingTop: pxToDp(60),
    paddingBottom: pxToDp(60),
    borderRightWidth: pxToDp(4),
    borderRightColor: "rgba(45, 48, 64, 0.10)",
  },
  content_3_right: {
    width: "18%",
    height: "100%",
    // backgroundColor:"pink",
    paddingLeft: pxToDp(60),
    paddingRight: pxToDp(60),
    paddingTop: pxToDp(60),
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  // 存数据
  return {};
};
export default connect(mapStateToProps, mapDispathToProps)(CustomHomePage);
