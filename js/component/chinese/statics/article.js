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
import Bar from "../../bar";
import NavigationUtil from "../../../navigator/NavigationUtil";
import UserInfo from "../../userInfo";
import { connect } from "react-redux";
import CircleStatistcs from "../../circleStatistcs";
import MyManyBarChart from "../../myChart/myManyBarChart";
import MyLineChart from "../../myChart/myLineChart";
import ArticleDetail from "./articleDetail";
import { Modal } from "antd-mobile-rn";

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
      checkSpeType: "1",
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
      rodarvalue: [],
      rodarname: [],
      visible: false,
      rodarvalue2: [],
    };
  }
  componentDidMount() {
    console.log("参数", this.props.data);
    this.getlineChart("class");
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
    if (
      prevState.name !== this.state.name ||
      prevState.type !== this.state.type ||
      prevState.checkSpeType !== this.state.checkSpeType
    ) {
      this.getlineChart("class");
    }
  }
  // getData = async () => {
  //     await this.getlineChart('class')
  //     await this.getList(prevState.englishType === 'read' ? '1' : '')
  //     this.setState({
  //         isShow: true
  //     })
  // }

  getList() {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    //console.log(userInfoJs, 'userInfoJs')
    let infoData = this.props.data;

    axios
      .get(`${api.getChineseCompositionAllStatics}`, {
        params: {
          grade_code: userInfoJs.checkGrade,
          exercise_time: infoData.type,
        },
      })
      .then((res) => {
        if (res && res.data.err_code === 0) {
          console.log("所有数据", res.data.data.inspect_data);
          let rlist = res.data.data.element_data;
          let rname = [],
            rvalue = [],
            rvalue2 = [];
          let color = {
            good: "#00CC88",
            normal: "#FFAA5C",
            bad: "#FF6680",
          };
          rlist.forEach((item, index) => {
            let colornow =
              item.right_rate > 84
                ? color.good
                : item.right_rate > 69
                ? color.normal
                : color.bad;
            index < 3
              ? rvalue.push({
                  text: item.name,
                  value: item.right_rate + "%",
                  bgColor: [colornow, colornow],
                })
              : rvalue2.push({
                  text: item.name,
                  value: item.right_rate + "%",
                  bgColor: [colornow, colornow],
                });
          });
          // console.log("参数", rname, rvalue)
          let barlist = res.data.data.inspect_data;
          let rightlist = [];
          let totallist = [];
          let namelist = [""];
          let allnamelist = [];
          barlist.forEach((item, index) => {
            let rightobj = {
              x: index + 1,
              y: item.right_rate,
            };
            rightlist.push(rightobj);
            totallist.push({
              x: index + 1,
              y: 100,
            });
            namelist.push((item.name + "").replaceAll(" ", ""));
            allnamelist.push({ ...item });
          });
          console.log("数据", rvalue2);
          this.setState({
            rodarvalue: rvalue,
            rodarvalue2: rvalue2,
            rightValue: rightlist,
            totallist,
            rodarname: rname,
            namelist,
            isShow: true,

            // list: res.data.data.data.data,
            // rate_correct: res.data.data.data.right_rate,
            // rate_speed: res.data.data.data.rate_speed,
            maxMsg: res.data.data.msg.strong_msg,
            minMsg: res.data.data.msg.weak_msg,
            allnamelist,
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
    axios
      .get(`${api.getChineseCompositionPaiStatics}`, {
        params: {
          grade_code: userInfoJs.checkGrade,
          exercise_time: infoData.type,
          category: "composition",
        },
      })
      .then((res) => {
        this.getList();
        let list = res.data.data.data;
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
          console.log("派分", res.data);

          this.setState({
            lineValue: lineList,
            arangelist,
            linename,
            stage_ranking: res.data.data.transcend_position,
          });
        }
      });
  }

  render() {
    const {
      lineValue,
      arangelist,
      linename,
      rodarvalue,
      allnamelist,
      rodarvalue2,
    } = this.state;
    // rate_correct 成功率  rate_speed  答题速度
    return (
      <View style={[padding_tool(0), { flex: 1 }]}>
        <View
          style={[
            padding_tool(40),
            borderRadius_tool(40),
            {
              marginBottom: pxToDp(40),
              borderWidth: pxToDp(4),
              borderColor: "#E9E9F2",
              width: "100%",
            },
          ]}
        >
          <View>
            <Text
              style={[
                {
                  fontSize: pxToDp(36),
                  color: "#4C4C59",
                  marginBottom: pxToDp(20),
                },
              ]}
            >
              习作正确率{" "}
            </Text>
          </View>
          <View
            style={[
              { width: "100%" },
              appStyle.flexTopLine,
              appStyle.flexJusBetween,
            ]}
          >
            <View style={[{ width: "49%" }]}>
              <Bar list={rodarvalue} height={pxToDp(250)}></Bar>
            </View>
            <View style={[{ width: "49%" }]}>
              <Bar list={rodarvalue2} height={pxToDp(250)}></Bar>
            </View>
          </View>
        </View>
        <View style={[styles.left]}>
          <View style={styles.bottomWrap}>
            <View
              style={[
                appStyle.flexTopLine,
                appStyle.flexJusBetween,
                { width: "100%" },
              ]}
            >
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

              {allnamelist?.length > 0 ? (
                <TouchableOpacity
                  onPress={() => this.setState({ visible: true })}
                  style={[
                    size_tool(152, 60),
                    borderRadius_tool(30),
                    appStyle.flexCenter,
                    { backgroundColor: "#fff" },
                  ]}
                >
                  <Text style={[{ fontSize: pxToDp(28), color: "#4C4C59" }]}>
                    查看详情
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <View
              style={[
                // padding_tool(40),
                borderRadius_tool(40),
                {
                  marginBottom: pxToDp(10),
                  width: "100%",
                  height: pxToDp(402),
                },
              ]}
            >
              {this.state.isShow ? (
                <MyManyBarChart
                  totallist={[]}
                  rightValue={this.state.rightValue}
                  namelist={this.state.namelist}
                  enabledLegend={true}
                  height={pxToDp(350)}
                  width={pxToDp(800)}
                  rightColor={"#7076FF"}
                />
              ) : null}
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
                  marginBottom: pxToDp(24),
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
                borderRadius_tool(40),
                {
                  marginBottom: pxToDp(10),
                  width: "100%",
                  height: pxToDp(402),
                },
              ]}
            >
              {/* <View style={{ flexDirection: 'row', marginBottom: pxToDp(40), }}> */}

              {this.state.isShow ? (
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
              ) : null}

              {/* </View> */}
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
        <Modal
          transparent
          visible={this.state.visible}
          presentationStyle={"fullScreen"}
          style={[{ width: pxToDp(1680) }]}
        >
          {/* <View style={[appStyle.flexCenter, { backgroundColor: 'pink', flex: 1, height: '100%', width: '100%' }]}> */}
          <View style={[size_tool(1630, 900), { position: "relative" }]}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ visible: false });
              }}
              style={[
                {
                  position: "absolute",
                  top: pxToDp(20),
                  right: pxToDp(20),
                  zIndex: 999,
                },
              ]}
            >
              <Image
                style={[
                  size_tool(60),
                  borderRadius_tool(30),
                  { backgroundColor: "#EDEDF5" },
                ]}
                source={require("../../../images/chineseHomepage/staticsClose.png")}
              />
            </TouchableOpacity>
            <ArticleDetail
              data={{ ...this.props.data, namelist: allnamelist }}
            />
          </View>
          {/* </View> */}
        </Modal>
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
    height: "100%",
    borderRadius: pxToDp(32),
    marginBottom: pxToDp(40),
    borderWidth: pxToDp(4),
    borderColor: "#E9E9F2",
    padding: pxToDp(40),
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
  },
  bottomTextRight: {
    fontSize: pxToDp(24),
    lineHeight: pxToDp(34),
    color: "#4C4C59",
    flex: 1,
    ...appFont.fontFamily_syst,
    ...fontFamilyRestoreMargin(),
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
