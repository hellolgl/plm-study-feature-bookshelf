import React, { Component, PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { pxToDp, padding_tool, size_tool } from "../../../../util/tools";
import Header from "../../../../component/Header";
import RichShowView from "../../../../component/chinese/RichShowView";

import { appStyle } from "../../../../theme";
import RenderHtml from "react-native-render-html";
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseDidExercise extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      canvasWidth: 0,
      canvasHeight: 0,
      topaicNum: 0,
      //题目列表，后期可能改动
      fromServeCharacterList: [],
      isEnd: false,
      topaicIndex: 0,
      topicMap: new Map(),
      status: 0,
      gifUrl: "",
      classList: {},
      nowIndex: -1,
      unitList: [],
      time: "",
      page: 1,
      total_page: 0,
    };
  }

  static navigationOptions = {
    // title:'答题'
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  toDoHomework = (item) => {
    NavigationUtil.toEnglishTestMeRecordListDetail({
      ...this.props,
      data: { exercise_id: item.exercise_id },
    });
  };

  checkUnit = (checkIndex) => {
    this.setState({
      nowIndex: ++checkIndex,
    });
  };
  componentDidMount() {
    let isTestMe = this.props.navigation.state.params.data.isTestMe;
    let type = this.props.navigation.state.params.data.type;
    if (type === "desc") {
      this.getDescList(this.state.page);
    } else {
      isTestMe
        ? this.getTestmeExercise(this.state.page)
        : this.getDailyList(this.state.page);
    }
  }
  getDescList = (page) => {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = {};

    data.exercise_set_id =
      this.props.navigation.state.params.data.exercise_set_id;

    data.page = page;
    axios.get(api.getEnglishMyDescHistorylist, { params: data }).then((res) => {
      let list = res.data.data;
      console.log("test me 答题记录", res.data.data);

      let time = list.length > 0 ? list[0].create_time : "";
      this.setState(() => ({
        unitList: list,
        time,
        page,
        total_page: res.data.total_page,
      }));
    });
  };
  getTestmeExercise(page) {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = {};

    data.origin = this.props.navigation.state.params.data.origin;
    data.page = page;
    data.ladder = this.props.navigation.state.params.data.ladder;
    axios.get(api.getTestMeExerciseRecord, { params: data }).then((res) => {
      let list = res.data.data;
      console.log("test me 答题记录", res.data.data);

      let time = list.length > 0 ? list[0].create_time : "";
      this.setState(() => ({
        unitList: list,
        time,
        page,
        total_page: res.data.total_page,
      }));
    });
  }
  getDailyList(page) {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = {};
    // data.grade_code = userInfoJs.checkGrade;
    // data.term_code = userInfoJs.checkTeam;
    data.modular = this.props.navigation.state.params.data.mode;
    data.sub_modular = this.props.navigation.state.params.data.kpg_type;
    data.origin = this.props.navigation.state.params.data.origin;
    data.page = page;
    axios.get(api.getMyStudyRecord, { params: data }).then((res) => {
      let list = res.data.data;
      console.log("每日一练答题记录123", data, res.data.data);

      let time = list.length > 0 ? list[0].create_time : "";
      this.setState(() => ({
        unitList: list,
        time,
        page,
        total_page: res.data.total_page,
      }));
    });
  }

  renderNormalExercise = () => {
    const { page, classList, unitList } = this.state;
    return unitList.map((item, index) => {
      console.log("item.private_exercise_stem: ", item.private_exercise_stem);
      return (
        <TouchableOpacity
          key={index}
          onPress={() => this.toDoHomework(item)}
          style={[
            {
              width: "100%",
              minHeight: pxToDp(267),
              backgroundColor: "#fff",
              marginBottom: pxToDp(32),
              // flexDirection: 'row',
              borderRadius: 8,
              justifyContent: "space-between",
              // alignItems: 'center',
              paddingLeft: pxToDp(40),
              paddingRight: pxToDp(40),
              // paddingTop: 12,
              paddingBottom: pxToDp(50),
            },
            appStyle.flexJusBetween,
            // appStyle.flexLine,
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: pxToDp(104),
              borderBottomColor: "#EEF3F5",
              borderBottomWidth: pxToDp(2),
              marginBottom: pxToDp(24),
            }}
          >
            <Text
              style={{
                fontSize: pxToDp(40),
                color: "#999",
                marginRight: pxToDp(24),
              }}
            >
              Exercise {(page - 1) * 10 + index + 1}
            </Text>
            {item.correction === "0" ? (
              <Image
                source={require("../../../../images/englishHomepage/ic_excellent.png")}
                style={[size_tool(40)]}
              />
            ) : (
              <Image
                source={require("../../../../images/englishHomepage/ic_error.png")}
                style={[size_tool(40)]}
              />
            )}
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <View style={{ flex: 1 }}>
              <RenderHtml
                source={{ html: `${item.private_exercise_stem}` }}
                divStyle={"font-size: x-large"}
                pStyle={"font-size: x-large"}
                spanStyle={"font-size: x-large"}
                width={pxToDp(1420)}
                tagsStyles={{
                  p: { fontSize: pxToDp(36) },
                  span: { fontSize: pxToDp(36) },
                }}
              />
              {/*<RichShowView*/}
              {/*    divStyle={"font-size: x-large"}*/}
              {/*    pStyle={"font-size: x-large"}*/}
              {/*    spanStyle={"font-size: x-large"}*/}
              {/*    width={pxToDp(1420)}*/}
              {/*    value={*/}
              {/*        item.private_exercise_stem*/}
              {/*    }*/}
              {/*></RichShowView>*/}
            </View>
            <Text
              style={{
                color: "#fff",
                width: pxToDp(176),
                height: pxToDp(60),
                backgroundColor: "#38B3FF",
                borderRadius: pxToDp(32),
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                lineHeight: pxToDp(60),
                fontSize: pxToDp(32),
              }}
            >
              Try again
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };
  renderPage = () => {
    const { page, total_page } = this.state;
    let renturnobj = [];
    for (let i = 1; i <= total_page; i++) {
      renturnobj.push(
        <TouchableOpacity
          onPress={this.checkpage.bind(this, i)}
          style={[
            size_tool(64),
            appStyle.flexCenter,
            {
              backgroundColor: page === i ? "#77D102" : "#fff",
              borderRadius: pxToDp(32),
              marginRight: pxToDp(pxToDp(32)),
            },
          ]}
        >
          <Text
            style={{
              fontSize: pxToDp(32),
              color: page === i ? "#fff" : "#aaa",
            }}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    return renturnobj;
  };
  checkpage = (page) => {
    let isTestMe = this.props.navigation.state.params.data.isTestMe;
    isTestMe ? this.getTestmeExercise(page) : this.getDailyList(page);
  };
  render() {
    return (
      <View
        style={[
          padding_tool(72, 48, 48, 48),
          { backgroundColor: "#EEF3F5" },
          { flex: 1 },
        ]}
      >
        <View
          style={[styles.header, appStyle.flexLine, appStyle.flexJusBetween]}
        >
          <TouchableOpacity onPress={this.goBack.bind(this)}>
            <Image
              source={require("../../../../images/goBack_icon.png")}
              style={[size_tool(64)]}
            />
          </TouchableOpacity>
          <View style={[styles.headRight, appStyle.flexLine]}>
            <View style={[styles.titleItem, { marginRight: pxToDp(32) }]}>
              <Image
                source={require("../../../../images/englishHomepage/ic_excellent.png")}
                style={{
                  width: pxToDp(44),
                  height: pxToDp(44),
                  marginRight: pxToDp(10),
                }}
              ></Image>
              <Text
                style={[
                  {
                    color: "#A0F06D",
                    fontSize: pxToDp(27),
                    fontWeight: "bold",
                    marginEnd: pxToDp(10),
                  },
                ]}
              >
                Excellent
              </Text>
            </View>
            <View style={styles.titleItem}>
              <Image
                source={require("../../../../images/englishHomepage/ic_error.png")}
                style={{
                  width: pxToDp(44),
                  height: pxToDp(44),
                  marginRight: pxToDp(10),
                }}
              ></Image>
              <Text
                style={[
                  {
                    color: "#FD9A9A",
                    fontSize: pxToDp(27),
                    fontWeight: "bold",
                    marginEnd: pxToDp(10),
                  },
                ]}
              >
                Try again
              </Text>
            </View>
          </View>
        </View>
        <View style={{ width: "100%", flex: 1 }}>
          <View
            style={[
              appStyle.flexTopLine,
              appStyle.flexAliCenter,
              { height: pxToDp(100) },
            ]}
          >
            <View style={[{ flexDirection: "row", alignItems: "center" }]}>
              <Text
                style={{
                  fontSize: pxToDp(32),
                  color: "#999999",
                  width: pxToDp(480),
                  marginRight: pxToDp(20),
                }}
              >
                Record: {this.state.time}
              </Text>
              {this.renderPage()}
            </View>
          </View>
          <ScrollView
            style={{
              height: Dimensions.get("window").height * 0.65,
              paddingBottom: 80,
            }}
          >
            {this.renderNormalExercise()}
          </ScrollView>
        </View>
      </View>
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
  header: {
    height: pxToDp(104),
    backgroundColor: "#fff",
    borderRadius: pxToDp(16),
    // marginBottom: pxToDp(40),
    paddingLeft: pxToDp(20),
  },
  titleItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: pxToDp(36),
    width: pxToDp(218),
    height: pxToDp(72),
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  headRight: {},
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseDidExercise);
