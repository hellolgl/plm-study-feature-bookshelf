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
import Btn from "../../../../../component/chinese/btn";

const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseDidExercise extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      time: "",
      nowPage: 1,
      haveNextPage: true,
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
    DeviceEventEmitter.emit("compostitionHome");

    // DeviceEventEmitter.removeListener("compositionRecord", () => this.getlist());  //移除
    this.eventListenerRefreshPage.remove();
  }
  componentDidMount() {
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "compositionRecord",
      () => this.renderList()
    );
    if (this.props.navigation.state.params.data.stem.has_record === "0") {
      NavigationUtil.toCompositionWriteCheckTitle({
        ...this.props,
        data: this.props.navigation.state.params.data,
      });
    } else {
      this.getlist();
    }
  }
  renderList = () => {
    console.log("render");
    this.setState(
      {
        list: [],
        time: "",
        nowPage: 1,
        haveNextPage: true,
      },
      () => this.getlist(1)
    );
  };
  getlist(page = 1) {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const datanow = this.props.navigation.state.params.data;
    const data = {};
    data.grade_code = userInfoJs.checkGrade;
    data.class_info = userInfoJs.class_code;
    data.term_code = userInfoJs.checkTeam;
    data.student_code = userInfoJs.id;
    data.subject = "01";
    data.c_id = datanow.c_id;
    data.page = page;
    data.es_id = datanow.stem.es_id;
    axios.get(api.getCompositionMyCreaterList, { params: data }).then((res) => {
      let listnow = res.data.data.data;
      console.log("翻页", res.data.data);
      let { list, haveNextPage } = this.state;
      let nowList = list.concat(listnow);
      if (nowList.length === res.data.data.page_info.total) {
        haveNextPage = false;
      }

      if (res.data?.err_code === 0) {
        this.setState({
          list: nowList,
          haveNextPage,
        });
      }
    });
    // }
  }

  todoExercise = () => {
    NavigationUtil.toCompositionWriteCheckTitle({
      ...this.props,
      data: this.props.navigation.state.params.data,
    });
  };
  doWrongExercise = (exercise) => {
    const { type } = this.props.navigation.state.params.data;
    NavigationUtil.toCompositionLookMindmap({
      ...this.props,
      data: {
        ...exercise,
        islookmap: true,
        // c_id: this.props.navigation.state.params.data.c_id
        updata: () => {
          this.setState(
            {
              list: [],
              haveNextPage: true,
              nowPage: 1,
            },
            () => this.getlist(1)
          );
        },
      },
    });
  };
  nextPage = () => {
    // 翻页
    let { nowPage, haveNextPage } = this.state;
    console.log("翻页", nowPage, haveNextPage);
    if (haveNextPage) {
      let page = ++nowPage;
      this.getlist(page);
      this.setState({
        nowPage: page,
      });
    }
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
              <ScrollView
                style={{ paddingBottom: pxToDp(80), flex: 1 }}
                onMomentumScrollEnd={() => this.nextPage()}
              >
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
                          size_tool(120),
                          borderRadius_tool(80),
                          appStyle.flexCenter,
                          {
                            backgroundColor:
                              item.status === "0" ? "#C2CADB" : "#16C792",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            appFont.fontFamily_jcyt_500,
                            {
                              fontSize: pxToDp(28),
                              color: "#fff",
                              lineHeight: pxToDp(40),
                            },
                          ]}
                        >
                          {item.status === "0" ? "未完成" : "已完成"}
                        </Text>
                      </View>
                      <View style={[{ flex: 1, paddingLeft: pxToDp(40) }]}>
                        <Text
                          style={[
                            appFont.fontFamily_syst_bold,
                            {
                              fontSize: pxToDp(48),
                              color: "#475266",
                              marginBottom: pxToDp(20),
                              lineHeight: pxToDp(60),
                            },
                          ]}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            appFont.fontFamily_jcyt_500,
                            {
                              fontSize: pxToDp(32),
                              color: "#475266",
                              lineHeight: pxToDp(
                                Platform.OS === "ios" ? 40 : 32
                              ),
                            },
                          ]}
                        >
                          {item.operate_time}
                        </Text>
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
          {/* <TouchableOpacity onPress={this.todoExercise} style={[size_tool(240), borderRadius_tool(240),
                    {
                        paddingBottom: pxToDp(8), backgroundColor: '#F07C39',
                        position: 'absolute', bottom: pxToDp(32), right: pxToDp(32)
                    }]} >
                        <View style={[{ flex: 1, backgroundColor: '#FF964A' }, borderRadius_tool(240), appStyle.flexCenter]} >
                            <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(48), color: '#fff' }]} >在写一篇</Text>
                        </View>
                    </TouchableOpacity> */}
          <Btn
            styleObj={{
              bgColor: "#FF964A",
              bottomColor: "#F07C39",
              fontColor: "#fff",
              borderRadius: pxToDp(200),
              height: pxToDp(120),
              fontSize: pxToDp(40),
              width: pxToDp(280),
            }}
            clickBtn={this.todoExercise}
            txt={"再写一篇"}
            otherStyle={{
              position: "absolute",
              bottom: pxToDp(32),
              right: pxToDp(32),
            }}
          />
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
