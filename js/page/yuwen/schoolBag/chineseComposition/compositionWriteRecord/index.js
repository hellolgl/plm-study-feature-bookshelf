import React, { Component, PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  DeviceEventEmitter,
  Platform,
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import {
  borderRadius_tool,
  padding_tool,
  pxToDp,
  size_tool,
} from "../../../../../util/tools";
import RichShowView from "../../../../../component/chinese/newRichShowView";

import { appFont, appStyle } from "../../../../../theme";
import fonts from "../../../../../theme/fonts";
import pinyin from "../../../../../util/languageConfig/chinese/pinyin";

const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseDidExercise extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      time: "",
    };
  }

  static navigationOptions = {
    // title:'答题'
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  toDoHomework = (item) => {
    // NavigationUtil.toChinesePinyinDoWrongExercise({
    //     ...this.props,
    //     data: { ...item },
    // });
  };

  checkUnit = (checkIndex) => {
    this.setState({
      nowIndex: ++checkIndex,
    });
  };
  componentWillUnmount() {
    const { type } = this.props.navigation.state.params.data;
    DeviceEventEmitter.emit("compositionWrite");

    // DeviceEventEmitter.removeListener("compositionRecord", () => this.getlist());  //移除
    this.eventListenerRefreshPage.remove();
  }
  componentDidMount() {
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "compositionRecord",
      () => this.getlist()
    );
    if (!this.props.navigation.state.params.data.has_record) {
      NavigationUtil.toChineseCompositionWriteDoExercise({
        ...this.props,
        data: this.props.navigation.state.params.data,
      });
    } else {
      this.getlist();
    }
  }

  getlist() {
    const data = this.props.navigation.state.params.data;
    const info = this.props.userInfo.toJS();
    const { type } = data;
    // info.checkGrade  checkTeam

    let url = api.getChineseCompositionWriteExerciseRecord,
      senobj = {
        te_id: data.te_id,
      };

    axios.get(url, { params: { ...senobj } }).then((res) => {
      let list = res.data.data;
      console.log("list", res.data.data);

      this.setState(() => ({
        list: JSON.stringify(list) === "{}" ? [] : list,
        time:
          JSON.stringify(list) === "{}"
            ? ""
            : list.length > 0
            ? list[0].create_time
            : "",
      }));
    });
    // }
  }

  todoExercise = () => {
    NavigationUtil.toChineseCompositionWriteDoExercise({
      ...this.props,
      data: this.props.navigation.state.params.data,
    });
  };
  doWrongExercise = (exercise) => {
    const { type } = this.props.navigation.state.params.data;
    NavigationUtil.toChineseCompositionWriteDoExercise({
      ...this.props,
      data: {
        ...exercise,
        ...this.props.navigation.state.params.data,
        isOne: true,
        // st_id: this.state.st_id
      },
    });
  };
  render() {
    const { list } = this.state;
    const { type } = this.props.navigation.state.params.data;
    return (
      <ImageBackground
        source={require("../../../../../images/chineseHomepage/sentence/sentenceBg.png")}
        style={[
          { flex: 1 },
          padding_tool(Platform.OS === "ios" ? 60 : 0, 20, 20, 20),
        ]}
        resizeMode="cover"
      >
        <View
          style={[
            appStyle.flexTopLine,
            appStyle.flexAliCenter,
            appStyle.flexJusBetween,
            padding_tool(20),
            {},
          ]}
        >
          <TouchableOpacity onPress={this.goBack} style={[{}]}>
            <Image
              source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
              style={[size_tool(120, 80)]}
            />
          </TouchableOpacity>
          <Text
            style={[
              appFont.fontFamily_jcyt_700,
              { fontSize: pxToDp(40), color: "#475266" },
            ]}
          >
            答题记录
          </Text>
          <View style={[size_tool(120, 80)]}></View>
        </View>

        <View style={[{ flex: 1 }, padding_tool(0, 200, 20, 200)]}>
          <View style={{ width: "100%", flex: 1 }}>
            {list.length === 0 ? (
              <View style={[appStyle.flexCenter, { flex: 1, height: "100%" }]}>
                <Image
                  source={require("../../../../../images/chineseHomepage/sentence/msgPanda.png")}
                  style={[size_tool(200)]}
                />
                <View
                  style={[
                    padding_tool(40),
                    { backgroundColor: "#fff" },
                    borderRadius_tool(40),
                  ]}
                >
                  <Text
                    style={[
                      appFont.fontFamily_jcyt_700,
                      { fontSize: pxToDp(48), color: "#475266" },
                    ]}
                  >
                    需要完成整套题才会有记录哦
                  </Text>
                </View>
              </View>
            ) : (
              <ScrollView style={{ paddingBottom: pxToDp(80), flex: 1 }}>
                {list.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={this.doWrongExercise.bind(this, item)}
                      style={[
                        appStyle.flexTopLine,
                        appStyle.flexAliCenter,
                        {
                          backgroundColor: "#fff",
                          padding: pxToDp(40),
                          borderRadius: pxToDp(40),
                          width: "100%",
                          marginBottom: pxToDp(20),
                        },
                      ]}
                      key={index}
                    >
                      <View
                        style={[
                          size_tool(80),
                          borderRadius_tool(80),
                          appStyle.flexCenter,
                          {
                            backgroundColor:
                              item.correct === "2" ? "#16C792" : "#F2645B",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            appFont.fontFamily_jcyt_700,
                            {
                              fontSize: pxToDp(36),
                              color: "#fff",
                              lineHeight: pxToDp(40),
                            },
                          ]}
                        >
                          {index + 1}
                        </Text>
                      </View>
                      <View style={[{ flex: 1, paddingLeft: pxToDp(40) }]}>
                        <RichShowView
                          width={pxToDp(1300)}
                          value={item.private_exercise_stem}
                          size={5}
                        />
                      </View>

                      <Image
                        source={require("../../../../../images/chineseHomepage/pingyin/new/next.png")}
                        style={[size_tool(80)]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
          <TouchableOpacity
            onPress={this.todoExercise}
            style={[
              size_tool(240),
              borderRadius_tool(240),
              {
                paddingBottom: pxToDp(8),
                backgroundColor: "#F07C39",
                position: "absolute",
                bottom: pxToDp(32),
                right: pxToDp(32),
              },
            ]}
          >
            <View
              style={[
                { flex: 1, backgroundColor: "#FF964A" },
                borderRadius_tool(240),
                appStyle.flexCenter,
              ]}
            >
              <Text
                style={[
                  appFont.fontFamily_jcyt_700,
                  { fontSize: pxToDp(48), color: "#fff" },
                ]}
              >
                测一测
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  mainWrap: {
    height: 570,
  },
  con: {
    flexDirection: "row",
    paddingLeft: pxToDp(48),
    paddingRight: pxToDp(48),
    height: "100%",
  },
  mainFont: {
    fontSize: pxToDp(60),
    color: "#475266",
    ...fonts.fontFamily_jcyt_500,
    marginRight: pxToDp(4),
  },
  tranFont: {
    fontSize: pxToDp(40),
    color: "#475266",
    ...fonts.fonts_pinyin,
    marginRight: pxToDp(4),
    marginBottom: pxToDp(10),
  },
  pinyinFont: {
    fontSize: pxToDp(40),
    color: "#475266",
    ...fonts.fonts_pinyin,
    marginRight: pxToDp(4),
    // lineHeight: pxToDp(56)
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    language_data: state.getIn(["languageChinese", "language_data"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseDidExercise);
