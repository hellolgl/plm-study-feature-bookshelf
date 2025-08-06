import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";
import { appStyle } from "../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../util/tools";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import Bar from "../../../../component/bar";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import UserInfo from "../../../../component/userInfo";
import { connect } from "react-redux";
import { LineChart } from "react-native-charts-wrapper";
import CircleStatistcs from "../../../../component/circleStatistcs";
class StatisticsHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      unitList: [],
      list: [
        {
          text: "Listening",
          value: "0%",
          bgColor: ["#6384F0", "#8BA0F8"],
        },
        {
          text: "Speaking",
          value: "0%",
          bgColor: ["#FDAE00", "#FAC845"],
        },
        {
          text: "Reading",
          value: "0%",
          bgColor: ["#FA7528", "#FC8A4B"],
        },
        {
          text: "Writing",
          value: "0%",
          bgColor: ["#3AB4FF", "#78D7FE"],
        },
      ],
      typeList: [
        {
          text: "Daily Review",
          value: "1",
        },
        {
          text: "Weekly Review",
          value: "2",
        },
        {
          text: "Monthly Review",
          value: "3",
        },
        {
          text: "Term Review",
          value: "4",
        },
      ],
      paiList: [
        {
          exercise_element: "Listening",
          total: 0,
          percent: 0,
          r_total: 0,
        },
        {
          exercise_element: "Speaking",
          total: 0,
          percent: 0,
          r_total: 0,
        },
        {
          exercise_element: "Reading",
          total: 0,
          percent: 0,
          r_total: 0,
        },
        {
          exercise_element: "Writing",
          total: 0,
          percent: 0,
          r_total: 0,
        },
      ],
      checkType: "1",
    };
  }
  componentDidMount() {
    this.getList(this.state.checkType);
  }
  getList(type) {
    const { userInfo, textBookCode } = this.props;
    const userInfoJs = userInfo.toJS();
    //console.log(userInfoJs, 'userInfoJs')
    const data = {};
    data.grade_code = userInfoJs.checkGrade;
    data.term_code = userInfoJs.checkTeam;
    data.student_code = userInfoJs.id;
    data.subject = "03"; //英语学科
    console.log("textBook", this.props.textBookCode);

    data.textbook = textBookCode || "20"; //教材code
    data.time_segment = type;
    axios
      .get(api.englishGetStacisticsHome, { params: { ...data } })
      .then((res) => {
        let list = res.data.data;
        let listnow = [];
        let classList = [...this.state.list];
        for (let n = 0; n < classList.length; n++) {
          for (let i = 0; i < list.length; i++) {
            if (classList[n].text === list[i].exercise_element) {
              classList[n].value = list[i].percent + "%";
              listnow.push({ ...list[i] });
              continue;
            }
          }
        }

        this.setState(() => ({
          paiList: listnow,
          list: classList,
        }));
      });
  }
  goBack() {
    NavigationUtil.goBack(this.props);
  }
  checkType(typeItem) {
    this.getList(typeItem.value);
    this.setState({
      checkType: typeItem.value,
    });
  }

  lookMore(type) {
    NavigationUtil.toEnglishStatisticsItem({
      ...this.props,
      data: { type: this.state.checkType, exercise_element: type },
    });
  }
  render() {
    const { list, typeList, checkType, paiList } = this.state;
    return (
      <View style={[padding_tool(72, 48, 48, 48)]}>
        <View style={[styles.header, appStyle.flexCenter]}>
          <View style={{ flexDirection: "row" }}>
            {typeList.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={
                    checkType === item.value ? styles.checked : styles.unChecked
                  }
                  onPress={() => this.checkType(item)}
                >
                  <Text
                    style={
                      checkType === item.value
                        ? styles.checkedText
                        : styles.unCheckedText
                    }
                  >
                    {item.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            onPress={() => this.goBack()}
            style={[
              {
                position: "absolute",
                top: pxToDp(0),
                left: pxToDp(0),
                width: pxToDp(128),
                height: pxToDp(104),
                borderRadius: pxToDp(32),
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Image
              source={require("../../../../images/statisticsGoBack.png")}
              style={[size_tool(64)]}
            ></Image>
          </TouchableOpacity>
        </View>
        <View style={[appStyle.flexTopLine]}>
          <View style={[styles.left, padding_tool(48)]}>
            <UserInfo avatarSize={164} isRow={true}></UserInfo>
            <Bar list={list}></Bar>
          </View>
          <View style={[styles.right]}>
            {paiList.map((item, index) => {
              console.log("debug pai : ", paiList);
              return (
                <View
                  key={index}
                  style={{
                    ...styles.rightItem,
                    marginBottom: index < 2 ? pxToDp(40) : pxToDp(0),
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      height: pxToDp(110),
                      alignItems: "center",
                      paddingLeft: pxToDp(40),
                      paddingRight: pxToDp(40),
                    }}
                  >
                    {/* 上面 */}
                    <Text
                      style={{
                        color: "#333333",
                        fontSize: pxToDp(32),
                        fontWeight: "bold",
                      }}
                    >
                      {item.exercise_element}
                    </Text>
                    <TouchableOpacity
                      onPress={() => this.lookMore(item.exercise_element)}
                    >
                      <Text style={{ fontSize: pxToDp(24), color: "#0179FF" }}>
                        Details
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flex: 1,
                      paddingLeft: pxToDp(40),
                      paddingRight: pxToDp(40),
                    }}
                  >
                    {/* 下面 */}
                    <View>
                      {/* 左边 */}
                      <CircleStatistcs
                        total={item.total}
                        right={Number(item.percent)}
                      />
                    </View>
                    <View>
                      {/* 右边 */}
                      <Text style={{ fontSize: pxToDp(48), color: "#333" }}>
                        {item.percent + "%"}
                      </Text>
                      <Text
                        style={{
                          fontSize: pxToDp(28),
                          color: "#AAA",
                          marginBottom: pxToDp(50),
                        }}
                      >
                        Correct
                      </Text>
                      <Text style={{ fontSize: pxToDp(48), color: "#333" }}>
                        {item.r_total}
                      </Text>
                      <Text style={{ fontSize: pxToDp(28), color: "#AAA" }}>
                        Correct
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF3F5",
  },
  header: {
    height: pxToDp(110),
    // backgroundColor: "#fff",
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(48),
    position: "relative",
    justifyContent: "space-between",
  },
  left: {
    width: pxToDp(572),
    height: Dimensions.get("window").height * 0.7,
    backgroundColor: "#fff",
    // backgroundColor: "red",
    borderRadius: pxToDp(32),
    marginRight: pxToDp(48),
    justifyContent: "space-between",
  },
  right: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // backgroundColor: "green",
    height: Dimensions.get("window").height * 0.7,
  },
  goDetailsBtn: {
    width: pxToDp(192),
    height: pxToDp(64),
    backgroundColor: "#fff",
    textAlign: "center",
    lineHeight: pxToDp(64),
    borderRadius: pxToDp(32),
    position: "absolute",
    fontSize: pxToDp(32),
    left: pxToDp(28),
    bottom: pxToDp(28),
  },
  rightText: {
    fontSize: pxToDp(38),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  rightItem: {
    // width: pxToDp(634),
    width: Dimensions.get("window").width * 0.31,
    height: Dimensions.get("window").height * 0.33,
    maxHeight: pxToDp(410),
    backgroundColor: "#fff",
    justifyContent: "space-between",
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(20),
  },
  rightItemOpacity: {
    backgroundColor: "#FFFFFF",
    borderRadius: pxToDp(30),
    width: pxToDp(143),
    alignItems: "center",
    marginEnd: pxToDp(48),
  },
  checked: {
    // padding: pxToDp(48),
    backgroundColor: " rgba(1, 121, 255, 0.2)",
    borderRadius: pxToDp(32),
    alignItems: "center",
    justifyContent: "center",
    marginRight: pxToDp(40),
    height: pxToDp(104),
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
  },
  unChecked: {
    // padding: pxToDp(48),
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    alignItems: "center",
    justifyContent: "center",
    marginRight: pxToDp(40),
    height: pxToDp(104),
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
  },
  checkedText: {
    color: "#0179FF",
    fontSize: pxToDp(28),
  },
  unCheckedText: {
    color: "#AAAAAA",
    fontSize: pxToDp(28),
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

export default connect(mapStateToProps, mapDispathToProps)(StatisticsHome);
