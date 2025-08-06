import React, { Component, PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import NavigationUtil from "../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { appStyle } from "../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../util/tools";
import * as actionCreators from "../../../action/english/bag/index";
import CheckBox from "react-native-check-box";
import LinearGradient from "react-native-linear-gradient";
import OtherUserInfo from "../../../component/otherUserinfo";
import Bar from "../../../component/bar";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Header from "../../../component/Header";

const ModeBody = {
  my: 1,
  lets: 2,
};
class EnglishSchoolHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          text: "Listening",
          value: "20%",
          bgColor: ["#6384F0", "#8BA0F8"],
        },
        {
          text: "Speaking",
          value: "60%",
          bgColor: ["#FDAE00", "#FAC845"],
        },
        {
          text: "Reading",
          value: "10%",
          bgColor: ["#FA7528", "#FC8A4B"],
        },
        {
          text: "Writing",
          value: "50%",
          bgColor: ["#3AB4FF", "#78D7FE"],
        },
      ],
      classList: {},
      isCheckedAllPhrase: false,
      isCheckedAllExpress: false,
      wordCheckList: [],
      phraseCheckList: [],
      wordAndPhraseSelectList: [],
      wordFill: 0, //单词短语学习进度，默认50%
      expressFill: 0, //句子学习进度，默认50%
    };
  }

  static navigationOptions = {
    // title:'答题'
  };

  componentDidMount() {
    console.log("EnglishSchoolHome componentDidMount");
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const item = this.props.navigation.state.params.data;
    const data = {
      origin: item.origin || "032001000707",
      student_code: userInfoJs.id,
    };
    axios.post(api.QueryEnSynchronizeProgress, data).then((res) => {
      //console.log('progress data',res)
      this.setState(() => ({
        wordFill: res.data.data.progress_1,
        expressFill: res.data.data.progress_2,
      }));
    });
  }

  updataData = () => {
    //console.log('EnglishSchoolHome updataData')
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const item = this.props.navigation.state.params.data;
    const data = {
      origin: item.origin || "032001000707",
      student_code: userInfoJs.id,
    };
    axios.post(api.QueryEnSynchronizeProgress, data).then((res) => {
      //console.log('progress data',res)
      this.setState(() => ({
        wordFill: res.data.data.progress_1,
        expressFill: res.data.data.progress_2,
      }));
    });
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  toDoHomework = (kpg_type, mode) => {
    let item = this.props.navigation.state.params.data;
    //console.log('toDoHomework item',item)
    if (!item) return;
    switch (kpg_type) {
      case 1: //单词短语
        this.toHomeWork(kpg_type, mode, item);
        break;
      case 2: //句子
        if (+item.unit_code === "00") {
          return;
        }
        this.toHomeWork(kpg_type, mode, item);
        break;
    }
  };

  toHomeWork = (kpg_type, mode, item) => {
    switch (mode) {
      case 1: //勾选知识点
        NavigationUtil.toEnglishChooseKnowledge({
          ...this.props,
          data: {
            origin: item.origin,
            unit_name: item.unit_name,
            mode,
            kpg_type,
            knowledge_type: 2,
            unit_code: item.unit_code,
          },
        });
        break;
      case 2: //系统自动推送题目
        if (!item.origin || !item.unit_name) return;
        NavigationUtil.toSynchronizeDiagnosisEn({
          ...this.props,
          data: {
            exercise_origin: item.origin,
            unit_name: item.unit_name,
            mode,
            kpg_type,
            knowledge_type: 2,
            unit_code: item.unit_code,
            updata: () => {
              this.updataData();
            },
          },
        });
        break;
    }
  };

  checkUnit = (checkIndex) => {
    this.setState({
      nowIndex: checkIndex,
    });
  };

  checkSelectAllState = () => {
    const { wordCheckList, phraseCheckList } = this.state;
    let state = true;
    wordCheckList.forEach((item) => {
      if (!item.check) {
        state = false;
      }
    });
    phraseCheckList.forEach((item) => {
      if (!item.check) {
        state = false;
      }
    });
    this.setState(() => ({
      isCheckedAllPhrase: state,
    }));
  };

  setClickWordOrPhrase = (item) => {
    if (!item) return;
    //console.log('setClickWordOrPhrase',item)
    const { wordAndPhraseSelectList } = this.state;
    this.setState(() => ({
      wordAndPhraseSelectList: [...wordAndPhraseSelectList, item.value],
    }));
    this.checkSelectAllState();
  };

  wordAndPhraseSelectAll = () => {
    const { wordCheckList, phraseCheckList, isCheckedAllPhrase } = this.state;
    //console.log('wordAndPhraseSelectAll',isCheckedAllPhrase)
    let wordlist = wordCheckList.map((item) => {
      item.check = isCheckedAllPhrase;
      return item;
    });
    let phraselist = phraseCheckList.map((item) => {
      item.check = isCheckedAllPhrase;
      return item;
    });
    this.setState(() => ({
      wordCheckList: [...wordlist],
      phraseCheckList: [...phraselist],
    }));
  };

  render() {
    const { list } = this.state;
    return (
      <View>
        <View style={[padding_tool(40, 48, 0, 48)]}>
          <Header
            text={this.props.navigation.state.params.data.unit_name}
            txtStyle={{ fontWeight: "bold" }}
            haveAvatar={true}
            goBack={() => {
              this.goBack();
            }}
          ></Header>
        </View>
        <View style={styles.con}>
          <View style={[styles.left]}>
            <OtherUserInfo
              avatarSize={164}
              isRow={true}
              hiddenBg={true}
            ></OtherUserInfo>
            <View style={[padding_tool(48)]}>
              <Bar list={list}></Bar>
            </View>
          </View>
          <View>
            <LinearGradient
              style={[styles.content, { marginBottom: pxToDp(40) }]}
              colors={["rgba(99, 132, 240, 1)", "rgba(150, 165, 248, 1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={[styles.title]}>Learn New Words</Text>
              <View
                style={[
                  appStyle.flexLine,
                  appStyle.flexJusBetween,
                  styles.bgWrap,
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.toDoHomework(1, ModeBody.my);
                  }}
                >
                  <ImageBackground
                    style={[styles.bj]}
                    source={require("../../../images/en_check_bj1.png")}
                    resizeMode={"contain"}
                  ></ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.toDoHomework(1, ModeBody.lets);
                  }}
                >
                  <ImageBackground
                    style={[styles.bj]}
                    source={require("../../../images/en_check_bj3.png")}
                    resizeMode={"contain"}
                  >
                    <View style={[styles.percentWrap]}>
                      <AnimatedCircularProgress
                        lineCap="round"
                        rotation={0}
                        size={98}
                        width={12}
                        fill={this.state.wordFill}
                        tintColor="#738CFCFF"
                        onAnimationComplete={() =>
                          console.log("onAnimationComplete")
                        }
                        backgroundColor="#EEF3F5FF"
                      >
                        {(fill) => (
                          <View
                            style={[
                              {
                                backgroundColor: "#FFFFFFFF",
                                width: "100%",
                                height: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                {
                                  color: "#8CA1F8FF",
                                  fontSize: pxToDp(30),
                                  fontWeight: "bold",
                                },
                              ]}
                            >
                              {this.state.wordFill + "%"}
                            </Text>
                            <Text
                              style={[
                                {
                                  color: "#8CA1F8FF",
                                  fontSize: pxToDp(18),
                                  fontWeight: "bold",
                                },
                              ]}
                            >
                              Progress
                            </Text>
                          </View>
                        )}
                      </AnimatedCircularProgress>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </LinearGradient>
            <LinearGradient
              style={styles.content}
              colors={[
                "rgba(250, 122, 48, 1)",
                "rgba(253, 147, 89, 1)",
                "rgba(250, 169, 117, 1)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={[styles.title]}>Express Myself</Text>
              <View
                style={[
                  appStyle.flexLine,
                  appStyle.flexJusBetween,
                  styles.bgWrap,
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.toDoHomework(2, ModeBody.my);
                  }}
                >
                  <ImageBackground
                    style={[styles.bj]}
                    source={require("../../../images/en_check_bj2.png")}
                    resizeMode={"contain"}
                  ></ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.toDoHomework(2, ModeBody.lets);
                  }}
                >
                  <ImageBackground
                    style={[styles.bj]}
                    source={require("../../../images/en_check_bj4.png")}
                    resizeMode={"contain"}
                  >
                    <View style={[styles.percentWrap]}>
                      <AnimatedCircularProgress
                        lineCap="round"
                        rotation={0}
                        size={98}
                        width={12}
                        fill={this.state.expressFill}
                        tintColor="#FFB367FF"
                        onAnimationComplete={() =>
                          console.log("onAnimationComplete")
                        }
                        backgroundColor="#EEF3F5FF"
                      >
                        {(fill) => (
                          <View
                            style={[
                              {
                                backgroundColor: "#FFFFFFFF",
                                width: "100%",
                                height: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                {
                                  color: "#FF975FFF",
                                  fontSize: pxToDp(30),
                                  fontWeight: "bold",
                                },
                              ]}
                            >
                              {this.state.expressFill + "%"}
                            </Text>
                            <Text
                              style={[
                                {
                                  color: "#FF975FFF",
                                  fontSize: pxToDp(18),
                                  fontWeight: "bold",
                                },
                              ]}
                            >
                              Progress
                            </Text>
                          </View>
                        )}
                      </AnimatedCircularProgress>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    height: pxToDp(110),
    backgroundColor: "#FFffff",
    width: "95%",
    margin: 24,
    borderRadius: 15,
    justifyContent: "space-between",
    paddingLeft: 32,
    paddingRight: 12,
    alignItems: "center",
  },
  con: {
    flexDirection: "row",
    height: pxToDp(895),
    paddingLeft: pxToDp(48),
  },
  content: {
    width: pxToDp(1308),
    height: pxToDp(415),
    borderRadius: pxToDp(32),
    padding: pxToDp(48),
  },
  title: {
    color: "#fff",
    fontSize: pxToDp(60),
    fontWeight: "bold",
    marginBottom: pxToDp(20),
  },
  bj: {
    width: pxToDp(586),
    height: pxToDp(223),
    position: "relative",
  },
  percentWrap: {
    width: pxToDp(170),
    height: pxToDp(170),
    backgroundColor: "#fff",
    position: "absolute",
    top: pxToDp(30),
    right: pxToDp(30),
    borderRadius: pxToDp(18),
    padding: pxToDp(10),
  },
  left: {
    width: pxToDp(600),
    height: pxToDp(872),
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    marginRight: pxToDp(48),
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    textBookCode: state.getIn(["bagEnglish", "textBookCode"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(EnglishSchoolHome);
