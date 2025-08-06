import React, { PureComponent, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  DeviceEventEmitter,
  BackHandler,
  Modal,
} from "react-native";
import { appFont, appStyle } from "../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  getIsTablet,
  pxToDpWidthLs,
  borderRadius_tool,
} from "../../../util/tools";
import NavigationUtil from "../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { Toast } from "antd-mobile-rn";
import Waterfall from "../../../component/square/waterfall";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import * as squareAction from "../../../action/square";

// import { withNavigationFocus } from "@react-navigation/compat";

class LookSquareHistory extends PureComponent {
  constructor(props) {
    super(props);
    // console.log('======',props.navigation.state.params.data)
    this.state = {
      list: [],
      loading: false,
      safeInsets: props.safeInsets.toJS(),
      isPhone: !getIsTablet(),
      nowType: props.navigation.state.params.data.type,
      needPage: false,
      page: 1,
      total: 0,
      totalPage: 0,
    };
    this.flag = false;
  }
  componentWillUnmount() {
    this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
    this.backBtnListener && this.backBtnListener.remove();
  }
  componentDidMount() {
    const { list } = this.state;
    // /api/student_blue/card/foot_data
    this.getlist(1, this.state.nowType);
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "squareHistoryRefresh",
      () => {
        this.getlist(1, this.state.nowType);
      }
    );
    this.backBtnListener = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        this.goBack()
        return true;
      }
    );
  }
  nextPage = () => {
    this.getlist(this.state.page + 1, this.state.nowType);
  };
  getlist = (page = 1, type) => {
    // const { nowType } = this.state;
    const { squareType } = this.props;
    const nowType = type;
    const data = {
      // category_type: type,
      parent: squareType === "parent" ? 1 : 0,
      page,
    };
    if (this.flag) {
      return;
    }
    if (page === 1) {
      this.setState({
        list: [],
      });
    }
    this.setState({
      loading: true,
    });
    this.flag = true;
    let url =
      nowType === "history" ? api.getSquareHistory : api.getMyCreateStory;
    axios
      .get(url, { params: data })
      .then((res) => {
        // console.log("记录", page, res.data);
        this.flag = false;
        if (res.data.err_code === 0) {
          let listnow = [];
          if (page === 1) {
            listnow = res.data.data;
          } else {
            listnow = [...this.state.list, ...res.data.data];
          }
          this.setState({
            list: listnow,
            // checkIndex: index,
            loading: false,
            page,
            total: res.data.total,
            totalPage: Math.ceil(res.data.total / 10),
          });
        } else {
          Toast.fail("请求失败");
        }
      })
      .catch((err) => {
        console.log("err:::::::", err);
      });
  };
  goBack = () => {
    const {isBack} = this.props.navigation.state.params.data
    if(isBack){
        //查看历史或者返回需要直接返回上一页
        NavigationUtil.goBack(this.props)
    }else{
      //创作完跳此页面（我的发布）返回必须直接到首页，否则在返回会回到创作流程页面
      NavigationUtil.toHomePage(this.props);
    }
  };
  lookDetail = (item) => {
    this.props.setHomeSelectItem(item);
    NavigationUtil.toSquareDetail({
      ...this.props,
      data: { ...item, isHistory: true},
    });
  };
  checkType = (type) => {
    this.getlist(1, type);
    this.setState({
      nowType: type,
    });
  };
  render() {
    const {
      list,
      loading,
      safeInsets,
      isPhone,
      nowType,
      page,
      total,
      totalPage,
      needPage,
    } = this.state;
    return (
      <View style={[{ flex: 1, backgroundColor: "#EDE9E7", position: "relative" }]}>
          <View style={[{height:pxToDp(120)},appStyle.flexCenter]}>
            <Text style={[{color:"#283139",fontSize:pxToDp(40)},appFont.fontFamily_jcyt_700]}>{nowType === "history" ?'共创浏览记录':'已发布故事'}</Text>
          </View>
          <TouchableOpacity
            style={[{position:'absolute',left:pxToDp(20),top:pxToDp(20)}]}
            onPress={this.goBack}
          >
            <Image
              style={[
                {
                  width: pxToDp(120),
                  height: pxToDp(80),
                },
              ]}
              source={require("../../../images/chineseHomepage/pingyin/new/back.png")}
            />
          </TouchableOpacity>
        <View
          style={[
            {
              flex: 1,
              borderWidth: pxToDp(4),
              borderColor: "#fff",
              borderBottomWidth: pxToDp(0),
              backgroundColor: "#E1DBD7",
            },
            borderRadius_tool(33, 33, 0, 0),
          ]}
        >
          <View
            style={[
              appStyle.flexTopLine,
              appStyle.flexJusBetween,
              padding_tool(19, 43, 19, 43),
            ]}
          >
            <View
              style={[
                size_tool(18),
                borderRadius_tool(20),
                { backgroundColor: "#283139" },
              ]}
            />
            <View
              style={[
                size_tool(18),
                borderRadius_tool(20),
                { backgroundColor: "#283139" },
              ]}
            />
          </View>
          <SafeAreaView
            style={[
              { flex: 1 },
              isPhone &&
                padding_tool(
                  0,
                  safeInsets.right ? 0 : 30,
                  0,
                  safeInsets.left ? 0 : 30
                ),
            ]}
          >
            {list.length === 0 ? (
              <View style={[{ flex: 1 }, appStyle.flexCenter]}>
                <Image
                  source={require("../../../images/square/noData.png")}
                  style={[size_tool(601, 431)]}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <Waterfall
                data={list}
                loading={loading}
                update={() => this.getlist(1, nowType)}
                toDetail={this.lookDetail}
                navigation={this.props.navigation}
                token={this.props.token}
                bgColor={"#E8E2DF"}
                needPage={needPage}
                page={page}
                total={total}
                totalPage={totalPage}
                nextPage={this.nextPage}
              />
            )}
          </SafeAreaView>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  typeBtnWrap: {
    borderRadius: pxToDp(60),
    flexDirection: "row",
    height: pxToDp(120),
    alignItems: "center",
    backgroundColor: "rgba(98,165,155,0.2)",
    marginRight: pxToDp(26),
    ...padding_tool(8, 25, 8, 15),
  },
  typeBtnImgWrap: {
    width: pxToDp(104),
    height: pxToDp(104),
    backgroundColor: "#fff",
    borderRadius: pxToDp(52),
    justifyContent: "center",
    alignItems: "center",
  },
  typeBtnTxt: {
    fontSize: pxToDp(42),
    color: "#228F86",
    ...appFont.fontFamily_jcyt_500,
    marginLeft: pxToDp(16),
  },
});
const mapStateToProps = (state) => {
  return {
    token: state.getIn(["userInfo", "token"]),
    safeInsets: state.getIn(["userInfo", "safeInsets"]),
    squareType: state.getIn(["userInfo", "squareType"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    setHomeSelectItem(data) {
      dispatch(squareAction.setHomeSelectItem(data));
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(LookSquareHistory);
