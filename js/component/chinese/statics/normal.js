import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Platform,
} from "react-native";
import { appStyle, appFont } from "../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  fontFamilyRestoreMargin,
  borderRadius_tool,
} from "../../../util/tools";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import Bar from "../..//bar";
import NavigationUtil from "../../../navigator/NavigationUtil";
import UserInfo from "../..//userInfo";
import { connect } from "react-redux";
import CircleStatistcs from "../../circleStatistcs";
import MyManyBarChart from "../../myChart/myManyBarChart";
import MyLineChart from "../../myChart/myLineChart";
import MyPie from "../../../component/myChart/my";

class ChineseStatisticsItem extends PureComponent {
  constructor(props) {
    super(props);
    console.log("propsnow", props);
    this.state = {
      unitList: [],
      list: [],
      paiList: [],
      // type: '1',
      lineValue: [0],
      rightValue: [],
      namelist: [],
      totallist: [],
      englishType: this.props.data.englishType,
      checkSpeType: this.props.data.category,
      rate_correct: this.props.data.rate_correct,
      rate_speed: this.props.data.rate_speed,
      linename: [],
      arangelist: [],
      areaType: "class",
      stage_ranking: 0,
      maxMsg: "",
      minMsg: "",
      isShow: false,
      name: this.props.data.name,
      type: this.props.data.type,
    };
  }
  componentDidMount() {
    this.getlineChart("class");
    this.getList(this.state.englishType === "read" ? "1" : "");
  }
  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    let data = props.data;
    if (
      tempState.name !== data.name ||
      tempState.type !== data.type ||
      tempState.checkSpeType !== data.category
    ) {
      tempState.name = data.name;
      tempState.type = data.type;
      tempState.rate_correct = data.rate_correct;
      tempState.rate_speed = data.rate_speed;
      tempState.englishType = data.englishType;
      tempState.isShow = false;
      tempState.checkSpeType = data.category;
    }

    return tempState;
  }
  componentDidUpdate(prevProps, prevState) {
    console.log(
      "首次进来",
      prevState.name,
      this.state.name,
      prevState.type,
      this.state.type,
      prevState.checkSpeType,
      this.state.checkSpeType
    );
    if (
      prevState.name !== this.state.name ||
      prevState.type !== this.state.type ||
      prevState.checkSpeType !== this.state.checkSpeType
    ) {
      console.log(
        "首次进来123",
        prevState.name === this.state.name,
        prevState.type === this.state.type,
        prevState.checkSpeType === this.state.checkSpeType
      );

      this.getlineChart("class");
      this.getList(this.state.englishType === "read" ? "1" : "");
    }
  }
  // getData = async () => {
  //     await this.getlineChart('class')
  //     await this.getList(prevState.englishType === 'read' ? '1' : '')
  //     this.setState({
  //         isShow: true
  //     })
  // }

  getList(category) {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    let infoData = this.state;
    let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam;
    // this.setState({
    //     checkSpeType: category
    // })
    let obj = {
      exercise_time: infoData.type,
      grade_term,
      category: infoData.englishType === "read" ? infoData.checkSpeType : "",
      url_category: infoData.englishType,
    };
    // /${userInfoJs.id}/${grade_term}/${infoData.type}/${infoData.englishType}?category=${infoData.englishType === 'read' ? category : ''}
    axios
      .get(`${api.chineseGetStacisticsItem}`, { params: obj })
      .then((res) => {
        let list = res.data.data.report;
        let listmsg = res.data.data.ability_msg;

        if (this.state.type === "sentence" || this.state.type === "read") {
          this.setState({
            rate_correct: res.data.data.rate_correct,
            rate_speed: res.data.data.rate_speed,
          });
        }
        let classList = [];
        if (list.length > 0) {
          let rightlist = [];
          let totallist = [];
          let namelist = [""];
          let minNum = 100,
            minName = "";
          let maxNum = -1,
            maxName = "";
          let index = 0;
          for (let i = 0; i < list.length; i++) {
            if (list[i].total !== 0) {
              let right =
                Number((list[i].correct_num / list[i].total).toFixed(3)) * 100;
              if (minNum > right) {
                minNum = right;
                minName = list[i].name;
              }
              if (maxNum < right) {
                maxNum = right;
                maxName = list[i].name;
              }
              let rightobj = {
                x: index + 1,
                y: right,
              };
              rightlist.push(rightobj);
              totallist.push({
                x: index + 1,
                y: 100,
              });
              namelist.push(list[i].name);
              ++index;
            }
          }
          let maxMsg = "",
            minMsg = "";
          for (let i in listmsg) {
            if (listmsg[i].ability === maxName && maxNum >= 90) {
              maxMsg = listmsg[i].msg_strong;
            }

            if (listmsg[i].ability === minName && minNum < 75) {
              minMsg = listmsg[i].msg_weak;
            }
          }
          this.setState({
            rightValue: rightlist,
            totallist,
            namelist,
            maxMsg,
            minMsg,
            isShow: rightlist.length > 0 ? true : false,
          });
        } else {
          this.setState({
            rightValue: [],
            totallist: [],
            namelist: [],
            maxMsg: "",
            minMsg: "",
          });
        }
      });
  }

  getlineChart(type) {
    //
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    //console.log(userInfoJs, 'userInfoJs')
    let infoData = this.props.data;
    let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam;
    this.setState({
      areaType: type,
    });
    console.log("测试数柱状图请求");

    axios
      .get(`${api.getChineseCompositionPaiStatics}`, {
        params: {
          grade_term,
          category: infoData.englishType,
          exercise_time: infoData.type,
        },
      })
      .then((res) => {
        let list = res.data.data.data;
        console.log("测试数据", res.data.data);
        if (list.length > 0) {
          let lineList = [];
          let arangelist = [];
          let linename = [""];
          for (let i = 0; i < list.length; i++) {
            lineList.push({
              x: i + 1,
              y:
                Platform.OS === "ios"
                  ? list[i].current_score / 100
                  : list[i].current_score, // π学分
            });
            arangelist.push({
              x: i + 1,
              y:
                Platform.OS === "ios"
                  ? list[i].single_avg_score / 100
                  : list[i].single_avg_score, // π学分
            });
            linename.push(list[i].score_date.slice(5).replaceAll("-", "."));
          }
          console.log("测试折线图数据", lineList);

          this.setState({
            lineValue: lineList,
            arangelist,
            linename,
            stage_ranking: res.data.data.transcend_position,
          });
        } else {
          this.setState({
            lineValue: [],
            arangelist: [],
            linename: [],
            stage_ranking: 0,
          });
        }
      });
  }

  render() {
    const { lineValue, name, rate_correct, rate_speed, arangelist, linename } =
      this.state;
    // rate_correct 成功率  rate_speed  答题速度
    return (
      <View style={[padding_tool(0), { flex: 1 }]}>
        <View style={[styles.left]}>
          <View style={styles.bottomWrap}>
            <Text
              style={[
                {
                  fontSize: pxToDp(36),
                  color: "#4C4C59",
                  marginBottom: pxToDp(10),
                },
              ]}
            >
              正确率
            </Text>
            <View
              style={[
                // padding_tool(40),
                // size_tool(924, 402),
                {
                  width: "100%",
                  height: pxToDp(402),
                },
              ]}
            >
              <MyManyBarChart
                totallist={[]}
                rightValue={this.state.rightValue}
                namelist={this.state.namelist}
                enabledLegend={true}
                height={pxToDp(350)}
                width={pxToDp(800)}
                rightColor={"#7076FF"}
              />
            </View>

            <View
              style={[
                {
                  backgroundColor: "#EDEDF5",
                  padding: pxToDp(20),
                  borderRadius: pxToDp(20),
                  minHeight: pxToDp(168),
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: pxToDp(20),
                  alignItems: "center",
                }}
              >
                <View style={{ alignItems: "center", flexDirection: "row" }}>
                  <Image
                    source={require("../../../images/chineseStrong.png")}
                    style={[
                      size_tool(40),
                      { zIndex: 99, marginRight: pxToDp(12) },
                    ]}
                  />
                </View>

                <Text style={styles.bottomTextRight}>{this.state.maxMsg}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ alignItems: "center", flexDirection: "row" }}>
                  <Image
                    source={require("../../../images/chineseWeak.png")}
                    style={[
                      size_tool(40),
                      { zIndex: 99, marginRight: pxToDp(12) },
                    ]}
                  />
                </View>

                <Text style={styles.bottomTextRight}>{this.state.minMsg}</Text>
              </View>
            </View>
          </View>
          <View style={styles.bottomWrap}>
            <View>
              <Text
                style={[
                  {
                    fontSize: pxToDp(36),
                    color: "#4C4C59",
                    marginBottom: pxToDp(10),
                  },
                ]}
              >
                π分相对排名
              </Text>
            </View>
            <View
              style={[
                // padding_tool(40),
                // size_tool(924, 402),
                { width: "100%", height: pxToDp(402) },
              ]}
            >
              <MyLineChart
                value={lineValue}
                arangelist={arangelist}
                linename={linename}
                height={pxToDp(350)}
                width={pxToDp(800)}
                myColor={"#906FFF"}
                perColor={"#C3C3D9"}
                perlintType={"solid"}
              />
            </View>
            <View
              style={[
                {
                  backgroundColor: "#EDEDF5",
                  padding: pxToDp(20),
                  borderRadius: pxToDp(20),
                  minHeight: pxToDp(168),
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: pxToDp(44),
                  marginBottom: pxToDp(24),
                }}
              >
                {this.state.stage_ranking > 50 ? (
                  <Image
                    source={require("../../../images/chineseStrong.png")}
                    style={[
                      size_tool(40),
                      { zIndex: 99, marginRight: pxToDp(12) },
                    ]}
                  />
                ) : (
                  <Image
                    source={require("../../../images/chineseWeak.png")}
                    style={[
                      size_tool(40),
                      { zIndex: 99, marginRight: pxToDp(12) },
                    ]}
                  />
                )}
                <Text style={styles.bottomTextRight}>
                  {this.state.stage_ranking > 50
                    ? `超越了${this.state.stage_ranking}%的同学，请继续加油哦！`
                    : "请继续加油哦!"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: pxToDp(838),
    backgroundColor: "#EEF3F5",
  },
  left: {
    width: "100%",
    flex: 1,
    // backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: pxToDp(40),
  },
  bottomWrap: {
    width: pxToDp(954),
    // height: pxToDp(720),
    height: "100%",
    borderRadius: pxToDp(32),
    // marginBottom: pxToDp(40),
    borderWidth: pxToDp(4),
    borderColor: "#E9E9F2",
    padding: pxToDp(40),
    justifyContent: "space-between",
  },
  bottomItemText: {
    // width: pxToDp(96),
    // height: pxToDp(40),
    color: "#666666",
    fontSize: pxToDp(24),
    lineHeight: pxToDp(36),
    ...appFont.fontFamily_syst,
  },
  bottomItemTextWrap: {
    width: pxToDp(96),
    height: pxToDp(40),
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: pxToDp(20),
    textAlign: "center",
    marginBottom: pxToDp(40),
  },
  bottomItemTextCheckedWrap: {
    width: pxToDp(96),
    height: pxToDp(40),
    backgroundColor: "#0179FF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: pxToDp(20),
    textAlign: "center",
    lineHeight: pxToDp(36),
    marginBottom: pxToDp(40),
  },
  bottomItemTextChecked: {
    // width: pxToDp(96),
    // height: pxToDp(40),
    color: "#fff",
    fontSize: pxToDp(24),
    textAlign: "center",
    lineHeight: pxToDp(36),
    ...appFont.fontFamily_syst,
  },
  bottomTextLeft: {
    marginRight: pxToDp(24),
    fontSize: pxToDp(24),
    color: "#333333",
    fontWeight: "bold",
    lineHeight: pxToDp(34),
  },
  bottomTextRight: {
    fontSize: pxToDp(24),
    lineHeight: pxToDp(34),
    color: "#4C4C59",
    width: pxToDp(724),
    ...appFont.fontFamily_syst,
    // ...fontFamilyRestoreMargin(),
  },
  circleWrap: {
    backgroundColor: "transparent",
    borderWidth: pxToDp(4),
    borderColor: "#E4E4F0",
    justifyContent: "center",
    alignItems: "center",
    width: pxToDp(88),
    height: pxToDp(88),
    borderRadius: pxToDp(44),
    marginRight: pxToDp(20),
  },
  circleText1: {
    fontSize: pxToDp(48),
    color: "#4C4C59",
  },
  circleText2: {
    fontSize: pxToDp(28),
    color: "#9595A6",
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

export default connect(
  mapStateToProps,
  mapDispathToProps
)(ChineseStatisticsItem);
