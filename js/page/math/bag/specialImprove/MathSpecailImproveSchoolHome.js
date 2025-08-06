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
} from "react-native";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import { pxToDp ,fitHeight} from "../../../../util/tools";
import { appStyle } from "../../../../theme";
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil";
import MyManyBarChart from "../../../../component/myChart/myManyBarChart";
import { Modal } from "antd-mobile-rn";
//基础学习计算能力获取单元
class MathSpecailImproveSchoolHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      classList: [],
      namelist: [],
      totallist: [],
      rightValue: [],
      visible: false,
    };
  }

  static navigationOptions = {
    // title:'答题'
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  toSpecailImprovePage = (unit_code, unit_name, unit_category) => {
    // MathNavigationUtil.toSpecailImprovePage({...this.props,data:{unit_code,unit_name,unit_category, updata: () => {
    //     this.updataData();
    //   }}})
  };

  checkUnit = (checkIndex) => {
    // this.setState((perState)=>({
    //     nowIndex: checkIndex
    // }))
  };

  updataData = () => {
    const { userInfo, textCode } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = {};
    data.grade_code = userInfoJs.checkGrade;
    data.term_code = userInfoJs.checkTeam;
    data.textbook = textCode;
    data.student_code = userInfoJs.id;
    // console.log('MathSchoolHome Didmount',data)
    axios.get(api.getBasicStatistical, { params: data }).then((res) => {
      let list = res.data.data;
      let namelist = [""];
      let totallist = [];
      let rightValue = [];
      console.log("getAutoUnitList", list);
      list.forEach((i, index) => {
        namelist.push(
          i.unit_name.indexOf("元") !== -1
            ? i.unit_name.substring(0, i.unit_name.indexOf("元") + 1)
            : i.unit_name
        );
        totallist.push({
          x: index + 1,
          y: i.answer_count > 0 ? 100 : 0,
        });
        rightValue.push({
          x: index + 1,
          y:
            i.answer_count > 0
              ? Math.round((i.right_count / i.answer_count) * 100)
              : 0,
        });
      });
      //   console.log("11111111111111111111111", namelist, totallist, rightValue);
      this.setState(() => ({
        classList: list,
        nowIndex: 0,
        namelist,
        totallist,
        rightValue,
      }));
    });
  };
  componentDidMount() {
    this.updataData();
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "refreshPage",
      (event) => {
        this.updataData();
      }
    );
  }
  componentWillUnmount() {
    DeviceEventEmitter.emit("refreshPageHome"); //返回主页刷新
    this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
  }
  toSpecailImprovePage = (unit_code, unit_name, unit_category) => {
    MathNavigationUtil.toSpecailImprovePage({
      ...this.props,
      data: { unit_code, unit_name, unit_category },
    });
  };
  handlenOnClose = () => {
    this.setState({
      visible: false,
    });
  };
  seeDetails = () => {
    this.setState({
      visible: true,
    });
  };
  render() {
    const { nowIndex, classList, unitList } = this.state;
    return (
      <ImageBackground
        source={require("../../../../images/homePageMath/base_bg.png")}
        style={styles.mainWrap}
      >
        <View style={[styles.header, appStyle.flexCenter]}>
          <TouchableOpacity style={[styles.headerBack]} onPress={this.goBack}>
            <Image
              style={[{ width: pxToDp(80), height: pxToDp(80) }]}
              source={require("../../../../images/homePageMath/base_back.png")}
              resizeMode="contain"
            ></Image>
          </TouchableOpacity>
          <Text
            style={[
              { fontSize: pxToDp(48), color: "#004D6F", fontWeight: "bold" },
            ]}
          >
            学习效能
          </Text>
          <TouchableOpacity
            style={[
              styles.headerDetails,
              appStyle.flexLine,
              appStyle.flexCenter,
            ]}
            onPress={() => {
              this.seeDetails();
            }}
          >
            <Image
              style={[
                {
                  width: pxToDp(40),
                  height: pxToDp(40),
                  marginRight: pxToDp(12),
                },
              ]}
              source={require("../../../../images/m_xxxn_icon.png")}
              resizeMode="contain"
            ></Image>
            <Text style={{ fontSize: pxToDp(32), color: "#21A6F4" }}>
              统计信息
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.con}>
          <ScrollView
            style={{ flex: 1, paddingBottom: 20 }}
            contentContainerStyle={styles.contentContainerStyle}
          >
            {/* <View style={[appStyle.flexLine,appStyle.flexLineWrap]}> */}
            {classList.length > 0
              ? classList.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={[
                        styles.conItem,
                        index % 2 === 0 ? null : { marginRight: 0 },
                      ]}
                    >
                      <Text style={{ fontSize: pxToDp(32), color: "#666666" }}>
                        {item.unit_name.indexOf("元") !== -1
                          ? item.unit_name.substring(
                              0,
                              item.unit_name.indexOf("元") + 1
                            )
                          : ""}
                      </Text>
                      <Text
                        style={{
                          fontSize: pxToDp(40),
                          marginBottom: pxToDp(24),
                        }}
                      >
                        {item.unit_name.indexOf("元") !== -1
                          ? item.unit_name
                              .substring(item.unit_name.indexOf("元") + 1)
                              .trim()
                          : item.unit_name}
                      </Text>
                      <View
                        style={[
                          appStyle.flexLine,
                          appStyle.flexJusBetween,
                          styles.haveBgcolorWrap,
                          { marginBottom: pxToDp(24) },
                        ]}
                      >
                        <Text
                          style={{ fontSize: pxToDp(36), color: "#0179FF" }}
                        >
                          已答题目：{item.right_count}/{item.answer_count}
                        </Text>
                        {item.answer_count === 0 ? null : (
                          <Text
                            style={{ fontSize: pxToDp(36), color: "#0179FF" }}
                          >
                            正确率：
                            {Math.round(item.right_count / item.answer_count *100)}%
                          </Text>
                        )}
                      </View>
                      <TouchableOpacity
                        style={[
                          appStyle.flexLine,
                          appStyle.flexJusBetween,
                          styles.haveBgcolorWrap,
                        ]}
                        onPress={() =>
                          this.toSpecailImprovePage(
                            item.unit_code,
                            item.unit_name,
                            item.unit_category
                          )
                        }
                      >
                        <Text style={{ fontSize: pxToDp(32) }}>
                          <Image
                            style={{ width: pxToDp(48), height: pxToDp(48) }}
                            resizeMode={"contain"}
                            source={require("../../../../images/homePageMath/m_tbts_icon1.png")}
                          ></Image>
                          &nbsp;查看详情
                        </Text>
                        <Image
                          style={{ width: pxToDp(64), height: pxToDp(64) }}
                          resizeMode={"contain"}
                          source={require("../../../../images/homePageMath/m_tbts_icon2.png")}
                        ></Image>
                      </TouchableOpacity>
                    </View>
                  );
                })
              : null}
            {/* </View> */}
          </ScrollView>
        </View>
        <Modal
          animationType="fade"
          title=" "
          transparent
          onClose={() => this.handlenOnClose()}
          maskClosable={false}
          visible={this.state.visible}
          // closable   //有无左上角的关闭
          footer={[{ text: "关闭", onPress: this.handlenOnClose }]}
          style={{ width: pxToDp(1300) }}
        >
          <View style={{ flexDirection: "row", marginBottom: pxToDp(24) }}>
            <Image
              source={require("../../../../images/chineseSentenceStaticsIcon.png")}
              style={{ width: pxToDp(48), height: pxToDp(48) }}
            />
            <Text style={{ fontSize: pxToDp(32), color: "#666" }}>
              学习效能
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#F9F9F9",
              width: pxToDp(1260),
              height: pxToDp(532),
              padding: pxToDp(50),
            }}
          >
            <MyManyBarChart
              width={pxToDp(1200)}
              height={pxToDp(400)}
              totallist={this.state.totallist}
              rightValue={this.state.rightValue}
              namelist={this.state.namelist}
              textFount={pxToDp(30)}
            />
          </View>
        </Modal>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
    paddingTop: pxToDp(40),
    paddingRight: pxToDp(48),
    paddingBottom: pxToDp(48),
    paddingLeft: pxToDp(48),
  },
  header: {
    height: pxToDp(80),
    position: "relative",
    marginBottom: pxToDp(32),
  },
  headerBack: {
    position: "absolute",
    left: 0,
  },
  con: {
    height:fitHeight(0.78,0.86)
  },
  contentContainerStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  conItem: {
    width: pxToDp(950),
    padding: pxToDp(40),
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    marginRight: pxToDp(40),
    marginBottom: pxToDp(40),
  },
  haveBgcolorWrap: {
    height: pxToDp(100),
    borderRadius: pxToDp(16),
    paddingLeft: pxToDp(26),
    paddingRight: pxToDp(26),
    backgroundColor: "#EEF6FF",
  },
  headerDetails: {
    position: "absolute",
    right: 0,
    width: pxToDp(226),
    height: pxToDp(80),
    borderRadius: pxToDp(16),
    backgroundColor: "#fff",
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    textCode: state.getIn(["bagMath", "textBookCode"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispathToProps
)(MathSpecailImproveSchoolHome);
