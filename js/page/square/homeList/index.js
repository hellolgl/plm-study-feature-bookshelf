import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  DeviceEventEmitter,
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
import * as purchaseAction from "../../../action/purchase";
import { ScrollView } from "react-native-gesture-handler";
import CoinView from '../../../component/coinView'

class SquareHomeList extends PureComponent {
  constructor(props) {
    super(props);
    // category_type=all 所有全部， category_type = 'knowledge'知识图谱， category_type = 'reading'阅读理解， category_type = 'paistory'
    this.state = {
      list: [],
      typeObj: props.navigation.state.params.data,
      checkIndex: 0,
      loading: false,
      isPhone: !getIsTablet(),
      safeInsets: props.safeInsets?.toJS(),
      needPage: false,
      page: 1,
      total: 0,
      totalPage: 0,
      checkItem: {},
      typeList: [],
      checkedType: "全部",
    };
    this.flag = false;
  }
  componentDidMount() {
    // console.log("参数", this.props.navigation.state.params.data);
    this.getlist(1);
    if (this.state.typeObj.type === "common_story_v2") {
      this.getType();
    }

    // const a = havSafe();
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "refreshSquareList",
      () => {
        this.getlist(1);
      }
    );
  }
  componentWillUnmount() {
    this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
  }
  getType = async () => {
    const res = await axios.get(api.getQuestionType);
    // console.log(res.data.data);
    if (res.data.err_code === 0) {
      let list = ["全部", ...res.data.data];
      this.setState({
        typeList: list,
      });
    }
  };
  updateNow = () => {
    this.getlist(1);
  };
  nextPage = () => {
    const { page } = this.state;
    this.getlist(page + 1);
  };
  getlist(page = 1) {
    const { typeObj, checkedType } = this.state;
    const { squareType } = this.props;
    const data = {
      category_type: typeObj.type,
      page,
    };
    if (squareType === "parent") {
      data.name = typeObj.title;
    }
    if (typeObj.type === "common_story_v2" && checkedType !== "全部") {
      data.story_tag = checkedType;
    }
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
    // console.log("广场111", data);
    axios.get(api.getSquareHome, { params: data }).then((res) => {
      this.flag = false;
      if (res.data.err_code === 0) {
        let total = res.data.total,
          totalPage = 0,
          needPage = false;
        let data = [];
        if (res.data.data.length > 10) {
          // 返回来一页超过10条，为没做分页的数据
          totalPage = 1;
          needPage = true;
          data = res.data.data;
        } else {
          totalPage = Math.ceil(total / 10);
          data = [...this.state.list, ...res.data.data];
        }
        console.log("总条数", data);
        this.setState({
          list: data,
          loading: false,
          needPage,
          page,
          total: total,
          totalPage: totalPage,
        });
      } else {
        Toast.fail("请求失败");
      }
    })
  }
  lookDetail = (item) => {
    const { token } = this.props;
    if (!token) {
      NavigationUtil.resetToLogin(this.props);
      return;
    }
    this.props.setHomeSelectItem(item);
    NavigationUtil.toSquareDetail({ ...this.props, data: item });
  };
  goBack = () => {
    NavigationUtil.goBack(this.props);
  };
  checkedType = (item) => {
    this.setState(
      {
        checkedType: item,
      },
      () => this.getlist(1)
    );
  };
  render() {
    const {
      list,
      loading,
      isPhone,
      needPage,
      page,
      total,
      totalPage,
      typeObj,
      typeList,
      checkedType,
    } = this.state;
    const { token } = this.props;
    return (
      <View style={[{ flex: 1, backgroundColor: "#E1DBD7" }]}>
        <View
          style={[
            {
              height: pxToDp(Platform.OS === "ios" ? 170 : 150),
              borderBottomColor: "#fff",
              borderBottomWidth: pxToDp(3),
              backgroundColor: "#EDE9E7",
              marginBottom: pxToDp(20),
            },
            appStyle.flexCenter
          ]}
        >
          <TouchableOpacity style={[styles.backBtn]} onPress={this.goBack}>
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
          <Text
            style={[
              appFont.fontFamily_jcyt_700,
              {
                fontSize: isPhone ? pxToDpWidthLs(42) : pxToDp(42),
                color: "#283139",
              },
            ]}
          >
            {typeObj.title}
          </Text>
          <TouchableOpacity style={[styles.historyBtn,appStyle.flexLine,appStyle.flexCenter]} onPress={()=>{
            NavigationUtil.toSquareHistory({navigation:this.props.navigation,data:{type:'history',isBack:true}});
          }}>
            <Image style={{width:pxToDp(56),height:pxToDp(56)}} source={require('../../../images/homepage/icon_26.png')}></Image>
            <Text style={[{color:"#727475",fontSize:pxToDp(36)},appFont.fontFamily_jcyt_500]}>共创浏览记录</Text>
          </TouchableOpacity>
        </View>

        <SafeAreaView
          style={[{ flex: 1 }, isPhone && padding_tool(0, 30, 0, 30)]}
        >
          <View
            style={[
              {
                height: typeList.length > 0 ? pxToDp(70) : 0,
                alignItems: "center",
              },
            ]}
          >
            <ScrollView horizontal>
              <View
                style={[
                  appStyle.flexTopLine,
                  { justifyContent: "center", alignItems: "center" },
                ]}
              >
                {typeList.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={this.checkedType.bind(this, item)}
                      key={index}
                      style={[styles.typeWrap]}
                    >
                      {index === 0 ? null : <View style={[styles.typeLine]} />}

                      <Text
                        style={[
                          styles.typeTxt,
                          checkedType === item && appFont.fontFamily_jcyt_700,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          <Waterfall
            data={list}
            loading={loading}
            update={this.updateNow}
            toDetail={this.lookDetail}
            navigation={this.props.navigation}
            token={token}
            needPage={needPage}
            page={page}
            total={total}
            totalPage={totalPage}
            nextPage={this.nextPage}
          />
        </SafeAreaView>
        {typeObj.type === 'paistory'?<CoinView right={isPhone?pxToDpWidthLs(60):null}></CoinView>:null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
  },
  backBtn:{
    position:'absolute',
    left:pxToDp(40),
    zIndex:1
  },
  typeWrap: {
    width: pxToDp(366),
    alignItems: "center",
    flexDirection: "row",
  },
  typeTxt: {
    fontSize: pxToDp(34),
    color: "#283139",
    ...appFont.fontFamily_jcyt_500,
    flex: 1,
    textAlign: "center",
  },
  typeLine: {
    width: pxToDp(5),
    height: pxToDp(30),
    backgroundColor: "#CECAC7",
    borderRadius: pxToDp(3),
  },
  historyBtn:{
    width:pxToDp(336),
    height:pxToDp(80),
    backgroundColor:"#F5F3F2",
    position:"absolute",
    right:pxToDp(40),
    borderRadius:pxToDp(80),
    borderWidth:pxToDp(4),
    borderColor:'#D4CFCB'
  }
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
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
    setPayCoinVisible(data) {
      dispatch(purchaseAction.setPayCoinVisible(data));
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(SquareHomeList);
