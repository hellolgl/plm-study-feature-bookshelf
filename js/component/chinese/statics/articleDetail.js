import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { appStyle, appFont } from "../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  border_tool,
  borderRadius_tool,
  fontFamilyRestoreMargin,
} from "../../../util/tools";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import Bar from "../../../component/bar";
import NavigationUtil from "../../../navigator/NavigationUtil";
import UserInfo from "../../../component/userInfo";
import { connect } from "react-redux";
import MyRadarChart from "../../../component/myRadarChart";

class ChineseStatisticsItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      unitList: [],
      list: [],
      paiList: [],
      checkType: "1",
      lineValue: [],
      rightValue: [],
      namelist: [],
      totallist: [],
      // type: this.props.data.englishType,
      checkSpeType: "1",
      rate_correct: 0,
      rate_speed: "",
      linename: [],
      arangelist: [],
      areaType: "class",
      stage_ranking: 0,
      maxMsg: "",
      minMsg: "",
      isShow: false,
      visible: false,
      detailVisible: false,
      detailList: [],
      detail: {},
      strong: "",
      weak: "",
      rodarvalue: [],
      rodarName: [],
      checkedname: "",
    };
  }
  componentDidMount() {
    this.getList(this.state.namelist[0]);
    // this.getlineChart('class')
  }
  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    let data = props.data;
    if (JSON.stringify(data.namelist) !== JSON.stringify(tempState.namelist)) {
      tempState.namelist = data.namelist;
      tempState.checkedname = data.namelist[0];
    }

    return tempState;
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevState.namelist) !== JSON.stringify(this.state.namelist)
    ) {
      this.getList(prevState.namelist[0]);
    }
  }
  getList(item) {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    //console.log(userInfoJs, 'userInfoJs')

    let infoData = this.props.data;
    // let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam

    axios
      .get(`${api.getChineseCompositionAllStatics}`, {
        params: {
          grade_code: userInfoJs.checkGrade,
          inspect_name: item.name,
          c_id: item.c_id,
          exercise_time: infoData.type,
        },
      })
      .then((res) => {
        if (res && res.data.err_code === 0) {
          let list = [];
          res.data.data?.tag_data.forEach((item) => {
            list.push(this.changeNumberlist(item));
          });
          this.setState({
            list,
            checkedname: item.name,
            // rate_correct: res.data.data.data.right_rate,
            // rate_speed: res.data.data.data.rate_speed,
            // strong: res.data.data.ability_msg.msg_strong,
            // weak: res.data.data.ability_msg.msg_weak,
          });
        }
      });
  }
  changeNumberlist = (data) => {
    let itemnow = { ...data };
    let rname = [],
      rvalue = [];
    data.data.forEach((item) => {
      rname.push(item.name);
      rvalue.push(item.right_rate + "");
    });
    console.log("雷达图", rname, rvalue);
    return {
      ...itemnow,
      rname,
      rvalue,
    };
  };
  goBack() {
    NavigationUtil.goBack(this.props);
  }
  checkname = (item) => {
    this.getList(item);
    this.setState({
      checkedname: item.name,
    });
  };

  render() {
    const { namelist, checkedname, list } = this.state;
    return (
      <View style={[padding_tool(40), { flex: 1 }]}>
        <View
          style={[
            appStyle.flexTopLine,
            appStyle.flexAliCenter,
            {
              width: "100%",
              marginBottom: pxToDp(40),
              paddingRight: pxToDp(60),
            },
          ]}
        >
          <ScrollView horizontal={true}>
            {namelist.map((item, index) => {
              return item ? (
                <TouchableOpacity
                  onPress={this.checkname.bind(this, item)}
                  key={index}
                  style={[
                    {
                      backgroundColor:
                        checkedname === item.name ? "#4C4C59" : "#fff",
                      marginRight: pxToDp(20),
                    },
                    appStyle.flexCenter,
                    size_tool(186, 80),
                    borderRadius_tool(40),
                  ]}
                >
                  <Text
                    style={[
                      {
                        fontSize: pxToDp(28),
                        color: checkedname === item.name ? "#fff" : "#4C4C59",
                      },
                      appFont.fontFamily_syst,
                    ]}
                  >
                    {item.name.replaceAll(" ", "")}
                  </Text>
                </TouchableOpacity>
              ) : null;
            })}
          </ScrollView>
        </View>
        <View style={[appStyle.flexJusCenter, { flex: 1 }]}>
          <View style={[{ height: pxToDp(700) }]}>
            <ScrollView horizontal={true}>
              {list.map((item, index) => {
                return (
                  <View
                    style={[
                      size_tool(732, 700),
                      {
                        backgroundColor: "#fff",
                        borderRadius: pxToDp(38),
                        position: "relative",
                        padding: pxToDp(32),
                        marginRight: pxToDp(40),
                        borderWidth: pxToDp(4),
                        borderColor: "#E9E9F2",
                      },
                    ]}
                    key={index}
                  >
                    <View
                      style={[
                        appStyle.flexTopLine,
                        appStyle.flexJusBetween,
                        appStyle.flexAliCenter,
                        { marginBottom: pxToDp(24) },
                      ]}
                    >
                      <Text
                        style={[
                          {
                            fontSize: pxToDp(34),
                            color: "#333333",
                            fontWeight: "bold",
                          },
                        ]}
                      >
                        {item.name + ":"}
                      </Text>
                      <View
                        style={[
                          size_tool(234, 60),
                          { borderWidth: pxToDp(4), borderColor: "#E9E9F2" },
                          appStyle.flexTopLine,
                          appStyle.flexCenter,
                          borderRadius_tool(30),
                        ]}
                      >
                        <Text
                          style={[
                            {
                              fontSize: pxToDp(28),
                              color: "#9595A6",
                              paddingRight: pxToDp(10),
                            },
                          ]}
                        >
                          正确率：
                        </Text>
                        <Text
                          style={[{ fontSize: pxToDp(28), color: "#00CC88" }]}
                        >
                          {item.right_rate}%
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        size_tool(592, 568),
                        appStyle.flexCenter,
                        { borderRadius: pxToDp(24) },
                      ]}
                    >
                      {true ? (
                        <MyRadarChart
                          r={pxToDp(200)}
                          size={[500, 500]}
                          valueList={item.rvalue}
                          namelist={item.rname}
                        />
                      ) : null}
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
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: pxToDp(110),
    backgroundColor: "#fff",
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(48),
    position: "relative",
    justifyContent: "space-between",
  },

  titlebtn: {
    backgroundColor: "#0179FF",
    marginRight: pxToDp(24),
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
