import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  DeviceEventEmitter,
} from "react-native";
import {
  margin_tool,
  size_tool,
  pxToDp,
  padding_tool,
  border_tool,
  borderRadius_tool,
} from "../../../../util/tools";
import { appStyle } from "../../../../theme";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import UserInfo from "../../../../component/userInfo";
import * as actionCreators from "../../../../action/english/bag/index";
import * as actionCreatorsMath from "../../../../action/math/bag/index";
import { connect } from "react-redux";
import Star from "./star";
import TestMeStatics from "./statics";
class ChooseTextbook extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: "word",
      list: [{}, {}, {}, {}, {}],
      isOpacity: false,
      staticsobj: {
        total: 0,
        wrong: 0,
        correct: 0,
        word: {
          total: 0,
          wrong: 0,
          right: 0,
        },
        phrases: {
          total: 0,
          wrong: 0,
          right: 0,
        },
        sentence: {
          total: 0,
          wrong: 0,
          right: 0,
        },
      },
    };
  }

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  checkType = (type) => {
    let pageType = this.props.navigation.state.params.data.mode;
    let kpg_type = type === "word" ? 1 : 2;

    // 直接做题
    NavigationUtil.toSynchronizeDiagnosisEn({
      ...this.props,
      data: {
        ...this.props.navigation.state.params.data,
        kpg_type,
      },
    });
  };
  toRecord(item, index) {
    // toEnglishTestMeRecordList
    if (item.has_record) {
      NavigationUtil.toEnglishTestMeRecordList({
        ...this.props,
        data: {
          ...this.props.navigation.state.params.data,
          ladder: item.ladder,
          isTestMe: true,
        },
      });
    }
  }
  componentDidMount() {
    this.getlist();
    this.getStatics();
    // stu_origin
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "backHome",
      () => {
        NavigationUtil.goBack(this.props);
        DeviceEventEmitter.emit("aiPlanDidExercise");
      }
    );
  }
  componentWillUnmount() {
    this.eventListenerRefreshPage.remove();
  }
  getlist = () => {
    axios
      .get(api.getEnglishTestMeItem, {
        params: { origin: this.props.navigation.state.params.data.origin },
      })
      .then((res) => {
        if (res.data.err_code === 0) {
          // console.log("res 参数", res.data)

          this.setState({
            list: res.data.data,
            isOpacity: res.data.data[4].has_record ? true : false,
          });
        }
      });
  };
  getStatics = () => {
    axios
      .get(api.getEnglishTestMeStatics, {
        params: { origin: this.props.navigation.state.params.data.origin },
      })
      .then((res) => {
        if (res.data.err_code === 0) {
          console.log(
            "res 参数",
            res.data.data.all_statistics,
            res.data.data.type
          );
          let staticsobj = {
            ...this.state.staticsobj,
            total: res.data.data.all_statistics.total,
            wrong: res.data.data.all_statistics.wrong,
            correct:
              res.data.data.all_statistics.total -
              res.data.data.all_statistics.wrong,
          };
          res.data.data.type.forEach((item) => {
            if (item.knowledgepoint_type === "1") {
              staticsobj.word = {
                total: item.total,
                wrong: item.wrong,
                right: item.total - item.wrong,
              };
            }
            if (item.knowledgepoint_type === "2") {
              staticsobj.phrases = {
                total: item.total,
                wrong: item.wrong,
                right: item.total - item.wrong,
              };
            }
            if (item.knowledgepoint_type === "3") {
              staticsobj.sentence = {
                total: item.total,
                wrong: item.wrong,
                right: item.total - item.wrong,
              };
            }
          });
          this.setState({
            staticsobj,
            // list: res.data.data,
            // isOpacity: res.data.data[4].has_record ? true : false
          });
        }
      });
  };
  toStart = (item, index) => {
    const { list } = this.state;
    if (item.has_record || item.ladder === 1 || list[index - 1]?.has_record) {
      NavigationUtil.toSynchronizeDiagnosisEn({
        ...this.props,
        data: {
          ...this.props.navigation.state.params.data,
          ladder: item.ladder,
          isTestMe: true,
          isUpload: true,
          updatalist: () => {
            this.getlist();
            this.getStatics();
          },
        },
      });
    }
  };
  render() {
    const { list, isOpacity, staticsobj } = this.state;
    return (
      <ImageBackground
        style={[styles.container, { zIndex: 10 }]}
        source={require("../../../../images/englishHomepage/testMe/testMeBg.png")}
      >
        <View
          style={[
            padding_tool(
              this.props.navigation.state.params.data.mode === 1 ? 0 : 49,
              80,
              0,
              80
            ),
            styles.header,
          ]}
        >
          <TouchableOpacity
            onPress={this.goBack.bind(this)}
            style={{
              paddingTop:
                this.props.navigation.state.params.data.pageType === 1
                  ? pxToDp(54)
                  : pxToDp(6),
            }}
          >
            <Image
              style={[size_tool(80)]}
              source={require("../../../../images/englishHomepage/wordHelpBack.png")}
            />
          </TouchableOpacity>
        </View>
        <View
          style={[
            appStyle.flexTopLine,
            appStyle.flexCenter,
            { flex: 1, position: "relative" },
          ]}
        >
          <Image
            style={[
              size_tool(115, 87),
              {
                marginRight: pxToDp(20),
                position: "absolute",
                top: pxToDp(40),
                left: pxToDp(60),
              },
            ]}
            source={require("../../../../images/englishHomepage/testMe/teseMeStart.png")}
          />
          <View
            style={[
              appStyle.flexTopLine,
              appStyle.flexJusEvenly,
              appStyle.flexAliCenter,
              {
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 999,
              },
            ]}
          >
            {list.map((item, index) => {
              return (
                <View
                  style={[
                    appStyle.flexAliCenter,
                    { marginBottom: index % 2 === 0 ? 0 : pxToDp(400) },
                  ]}
                  key={index}
                >
                  <ImageBackground
                    style={[
                      size_tool(312, 92),
                      appStyle.flexTopLine,
                      appStyle.flexCenter,
                      {
                        paddingLeft: pxToDp(18),
                        paddingBottom: pxToDp(10),
                        opacity: item.has_record ? 1 : 0,
                      },
                    ]}
                    source={require("../../../../images/englishHomepage/testMe/testMeTitle.png")}
                  >
                    {item.correct_rate >= 85 ? (
                      <View
                        style={[
                          size_tool(60),
                          borderRadius_tool(30),
                          appStyle.flexCenter,
                          { backgroundColor: "#fff" },
                        ]}
                      >
                        <Image
                          style={[size_tool(52), { marginRight: pxToDp(0) }]}
                          source={require("../../../../images/EN_Sentences/gold_icon.png")}
                        />
                      </View>
                    ) : null}
                    {item.correct_rate >= 75 && item.correct_rate < 85 ? (
                      <View
                        style={[
                          size_tool(60),
                          borderRadius_tool(30),
                          appStyle.flexCenter,
                          { backgroundColor: "#fff" },
                        ]}
                      >
                        <Image
                          style={[size_tool(52), { marginRight: pxToDp(0) }]}
                          source={require("../../../../images/EN_Sentences/silver_icon.png")}
                        />
                      </View>
                    ) : null}
                    {item.correct_rate >= 60 && item.correct_rate < 75 ? (
                      <View
                        style={[
                          size_tool(60),
                          borderRadius_tool(30),
                          appStyle.flexCenter,
                          { backgroundColor: "#fff" },
                        ]}
                      >
                        <Image
                          style={[size_tool(52), { marginRight: pxToDp(0) }]}
                          source={require("../../../../images/EN_Sentences/copper_icon.png")}
                        />
                      </View>
                    ) : null}
                    <Text
                      style={[
                        {
                          fontSize: pxToDp(23),
                          color: "#6F3428",
                          fontWeight: "bold",
                          flex: 1,
                          textAlign: "center",
                        },
                      ]}
                    >
                      Congratulations!
                    </Text>
                  </ImageBackground>
                  <ImageBackground
                    style={[
                      size_tool(332, 499),
                      appStyle.flexAliCenter,
                      padding_tool(98, 76, 89, 76),
                      { position: "relative" },
                    ]}
                    source={require("../../../../images/englishHomepage/testMe/testMeItembg.png")}
                  >
                    <Image
                      style={[size_tool(180), { marginBottom: pxToDp(8) }]}
                      source={
                        item.has_record
                          ? require("../../../../images/englishHomepage/testMe/testMeBoxOpen.png")
                          : require("../../../../images/englishHomepage/testMe/testMeBoxClose.png")
                      }
                    />
                    <View
                      style={[
                        size_tool(200, 40),
                        {
                          backgroundColor: "#E3E3E3",
                          borderRadius: pxToDp(20),
                          marginBottom: pxToDp(20),
                        },
                      ]}
                    >
                      {item.has_record ? (
                        item.correct_rate > 50 ? (
                          <View
                            style={[
                              size_tool(200 * (item.correct_rate / 100), 40),
                              appStyle.flexTopLine,
                              appStyle.flexAliCenter,
                              padding_tool(0, 4, 0, 4),
                              {
                                backgroundColor: "#FFAB32",
                                borderRadius: pxToDp(20),
                              },
                            ]}
                          >
                            <Text
                              style={[
                                {
                                  flex: 1,
                                  textAlign: "center",
                                  fontSize: pxToDp(24),
                                  color: "#fff",
                                },
                              ]}
                            >
                              {item.correct_rate}%
                            </Text>
                            <Image
                              style={[size_tool(32)]}
                              source={require("../../../../images/englishHomepage/testMe/testMeGood.png")}
                            />
                          </View>
                        ) : (
                          <View
                            style={[
                              size_tool(200 * (item.correct_rate / 100), 40),
                              appStyle.flexTopLine,
                              appStyle.flexAliCenter,
                              padding_tool(0, 4, 0, 4),
                              {
                                backgroundColor: "#FFAB32",
                                borderRadius: pxToDp(20),
                              },
                            ]}
                          ></View>
                        )
                      ) : null}
                    </View>
                    <View style={[appStyle.flexTopLine, appStyle.flexCenter]}>
                      <TouchableOpacity
                        onPress={this.toRecord.bind(this, item, index)}
                      >
                        <Image
                          style={[size_tool(161, 47)]}
                          source={
                            item.has_record
                              ? require("../../../../images/englishHomepage/testMe/testMeRecord.png")
                              : require("../../../../images/englishHomepage/testMe/testMeRecordNo.png")
                          }
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={this.toStart.bind(this, item, index)}
                      style={[
                        {
                          position: "absolute",
                          right: pxToDp(-10),
                          top: pxToDp(214),
                        },
                      ]}
                    >
                      <Image
                        style={[size_tool(70)]}
                        source={
                          item.has_record ||
                          index === 0 ||
                          list[index - 1].has_record
                            ? require("../../../../images/englishHomepage/testMe/testMeStart.png")
                            : require("../../../../images/englishHomepage/testMe/testMeStartNo.png")
                        }
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              );
            })}
          </View>

          <Image
            source={require("../../../../images/englishHomepage/testMe/testMeLittleBg.png")}
            style={[size_tool(1558, 649), { marginRight: pxToDp(26) }]}
          />
        </View>
        <View
          style={[
            {
              position: "absolute",
              right: pxToDp(126),
              top: pxToDp(140),
            },
            size_tool(196),
            padding_tool(27, 16, 33, 20),
          ]}
        >
          <TestMeStatics staticsobj={staticsobj} style={{ zIndex: 999 }} />
          <Star isOpacity={isOpacity} />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confirm: {
    position: "absolute",
    width: pxToDp(192),
    height: pxToDp(60),
    backgroundColor: "#35D37D",
    bottom: pxToDp(90),
    borderRadius: pxToDp(32),
  },
  header: {
    height: pxToDp(174),
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

const mapStateToProps = (state) => {
  return {};
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(ChooseTextbook);
