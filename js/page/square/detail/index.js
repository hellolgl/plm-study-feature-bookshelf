import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ImageBackground,
  DeviceEventEmitter,
  Modal,
  Platform,
  ScrollView,
  BackHandler,
} from "react-native";
import { appFont, appStyle } from "../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  borderRadius_tool,
  pxToDpWidthLs,
  getIsTablet,
} from "../../../util/tools";
import NavigationUtil from "../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import Story from "./components/story";
import * as WeChat from "react-native-wechat-lib";
import url from "../../../util/url";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import Create from "./components/create";
import Msg from "../../../component/square/msg";
import EventRegister from "../../../util/eventListener";
import Encyclopedias from "./components/encyclopedias";
import _ from "lodash";
import * as actionSquare from "../../../action/square/index";
import { getPaiCoin } from "../../../util/axiosMethod";
import ParentCreate from "./components/parentCreate";
import * as purchaseAction from "../../../action/purchase";
import ShareModal from '../../../component/ShareModal'

const bg_map = {
  'paistory':{
    bg:require("../../../images/square/squareDetailBg.png")
  },
  'common_story':{
    bgColor: "#FDF3E4",
  },
  'common_story_v3':{
    bg: require("../../../images/square/bg_7.png"),
  },
  'encyclopedias':{
    bg: require("../../../images/square/bg_2.png"),
  }
}

class SquareDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      shareModalVisible: false,
      userName: "",
      isPhone: !getIsTablet(),
      showMsg: false,
      isWord: false,
      wordDetails: {},
    };
  }
  componentDidMount() {
    this.backBtnListener = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        this.goBack()
        return true;
      }
    );
  }
  componentWillUnmount() {
    DeviceEventEmitter.emit("squareHistoryRefresh"); //返回页面刷新
    DeviceEventEmitter.emit("refreshSquareList"); //返回页面刷新
    this.backBtnListener && this.backBtnListener.remove();
  }
  goBack = () => {
    if(this.props.navigation.state.params.data.isHistory){
      // 从浏览记录进返回就到浏览记录，因为ket阅读最后可能会直接跳到浏览记录，会打乱路由栈，所以强行加这个判断
      NavigationUtil.toSquareHistory({navigation:this.props.navigation,data:{type:'history'}});
    }else{
      NavigationUtil.goBack(this.props)
    }
  };
  goCreate = () => {
    const { token } = this.props;
    EventRegister.emitEvent("pauseAudioEvent");
    if (token) {
      this.setState({
        showMsg: true,
      });
    } else {
      NavigationUtil.resetToLogin(this.props);
    }
  };
  goExercise = () => {
    const { token } = this.props;
    if (token) {
      NavigationUtil.toSquareDoexercise({
        ...this.props,
        data: this.props.navigation.state.params.data,
      });
    } else {
      NavigationUtil.resetToLogin(this.props);
    }
  };

  parseData = async (d) => {
    console.log("raw data: ", d);
    const { module, imgUrl } = d;
    let name = "";
    let subTitle = "";
    let id = "";
    let tag = "";
    let queryInfo = "";
    let createUser = "派效学";
    if (module === "paistory") {
      const { title_id } = d;
      id = title_id;
      const detail = await this.getStoryDetail(module, id);
      name = `KET拓展阅读: ${d.name}`;
      subTitle = detail.desc.en;
      tag = "一起开始 #PaiStory 阅读之旅吧！";
      queryInfo = `title_id=${d.title_id}`;
    }  else if (module === "common_story" || module === "common_story_v2") {
      name = d.title;
      subTitle = "一起来用AI创作故事吧";
      tag = "一起来用AI #创作 故事吧";
      queryInfo = `id=${d.id}&check_word_list=${["占位数据"]}`;
      createUser = d.user_name;
      id = d.id;
    } else if (module === "common_story_v3") {
      name = d.title;
      subTitle = "一起来用AI与专家对话吧";
      tag = "一起来用AI #创作 与专家对话吧";
      queryInfo = `id=${d.id}&check_word_list=${["占位数据"]}`;
      createUser = d.auther;
      id = d.id;
    }
    return {
      name,
      subTitle,
      img: url.baseURL + imgUrl,
      tag,
      queryInfo,
      createUser,
      id,
      module,
    };
  };

  getStoryDetail = async (moduleType, id) => {
    let detail;
    let sendData;
    if (moduleType === "paistory") {
      sendData = {
        title_id: id,
      };
      const res = await axios.get(api.getStoryDesc, { params: sendData });
      detail = res.data.data;
    }
    return detail;
  };

  shareEvent = async (targetType) => {
    const { userName } = this.state;
    const p = this.props.navigation.state.params.data;
    const defaultAvatar = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/paixiaoxue/avatar/default.png";
    const { name, subTitle, img, tag, queryInfo, createUser, id, module } =
      await this.parseData(p);
    console.log("raw share data: ", p);
    // nowIndex
    console.log("queryInfo: ", queryInfo);
    console.log(
      "U: ",
      `https://test.pailaimi.com?readUser=${userName}&createUser=${createUser}&createUserImg=${defaultAvatar}&tag=${encodeURIComponent(
        tag
      )}&${queryInfo}`
    );
    await WeChat.registerApp("wxedf6fb113c40f47e", "https://pailaimi.com/");
    if (
      module === "common_story" ||
      module === "common_story_v2" ||
      module === "common_story_v3"
    ) {
      getPaiCoin({ source: "share", card_id: id });
    }
    await WeChat.shareWebpage({
      title: name,
      description: subTitle,
      thumbImageUrl: img,
      // webpageUrl: "https://www.share.paistory.com?a_id=1120", // knowledge_code a_id title_id
      webpageUrl: `https://test.pailaimi.com?readUser=${userName}&createUser=${createUser}&createUserImg=${defaultAvatar}&tag=${encodeURIComponent(
        // webpageUrl: `http://192.168.0.155:5173?readUser=${userName}&createUser=${createUser}&createUserImg=${defaultAvatar}&tag=${encodeURIComponent(
        tag
      )}&${queryInfo}`, // knowledge_code a_id title_id
      scene: targetType === "friends" ? 0 : 1, // 0 微信好友；1 朋友圈
    });
  };

  seeKnowledgePoint = (knowledge_point) => {
    this.setState({
      isWord: true,
      showMsg: true,
      wordDetails: knowledge_point,
    });
  };

  renderContent = (module) => {
    switch(module) {
      case 'paistory':
        return  <Story
        data={this.props.navigation.state.params.data}
        next={this.goExercise}
        navigation={this.props.navigation}
      />
      case 'common_story':
        return  <Create
        data={this.props.navigation.state.params.data}
        goCreate={this.goCreate}
        goTalk={this.goExercise}
        seeKnowledgePoint={this.seeKnowledgePoint}
        navigation={this.props.navigation}
      />
      case 'common_story_v3':
        return  <ParentCreate
        data={this.props.navigation.state.params.data}
        goCreate={this.goCreate}
        goTalk={this.goExercise}
        navigation={this.props.navigation}
      />
      case 'encyclopedias':
        return  <Encyclopedias
        data={this.props.navigation.state.params.data}
        next={this.goExercise}
        goCreate={this.goCreate}
        seeKnowledgePoint={this.seeKnowledgePoint}
        navigation={this.props.navigation}
      />
    }
  }

  render() {
    const {
      shareModalVisible,
      isPhone,
      showMsg,
      isWord,
      wordDetails,
    } = this.state;
    const { avater, auther, title } = this.props.navigation.state.params.data;
    let { module } = this.props.navigation.state.params.data;
    const { token, questionMap } = this.props;
    const { meaning, knowledge_point, pinyinList, pinyin_2, word } =
      wordDetails;
    // common_story 知识点故事 common_story_v2 百科故事  common_story_v3 家长创作
    const isEncyclopedia = !_.isEmpty(questionMap.toJS()[title]);
    if (isEncyclopedia) {
      // 百科故事
      module = "encyclopedias";
    }
    return (
      <ImageBackground
        style={[
          { flex: 1 },
          bg_map[module].bgColor
            ? { backgroundColor: bg_map[module].bgColor }
            : null,
        ]}
        source={bg_map[module].bg ? bg_map[module].bg : null}
      >
        <ShareModal visible={shareModalVisible} shareEvent={this.shareEvent} onCancel={()=>{
          this.setState({
            shareModalVisible: false,
          });
        }}></ShareModal>
        <View
          style={[
            {
              height: isPhone
                ? pxToDpWidthLs(116)
                : pxToDp(Platform.OS === "ios" ? 170 : 150),
              borderBottomColor: "#D4CFCB",
              borderBottomWidth: pxToDp(3),
              backgroundColor: "#EDE8E4",
              // marginBottom: pxToDp(30),
            },
            padding_tool(Platform.OS === "ios" ? 20 : 0, 26, 0, 26),
            appStyle.flexTopLine,
            appStyle.flexJusBetween,
            appStyle.flexAliCenter,
            isPhone && padding_tool(Platform.OS === "ios" ? 20 : 0, 36, 0, 36),
          ]}
        >
          <View style={[appStyle.flexTopLine]}>
            <TouchableOpacity
              style={[{ marginLeft: pxToDp(25) }]}
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
            <View style={[styles.autherWrap]}>
              <Image
                source={avater}
                style={[size_tool(100), borderRadius_tool(50)]}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.autherName,
                  isPhone && { fontSize: pxToDpWidthLs(34) },
                ]}
              >
                {auther}
              </Text>
            </View>
          </View>

          {token && Platform.OS === "ios" ? (
            <TouchableOpacity
              style={[
                size_tool(196, 83),
                appStyle.flexTopLine,
                appStyle.flexCenter,
                {
                  backgroundColor: "#F5F3F2",
                  borderWidth: pxToDp(3),
                  borderColor: "#D4CFCB",
                  borderRadius: pxToDp(40),
                },
              ]}
              onPress={() => {
                const userInfo = this.props.userInfo.toJS();
                const { name } = userInfo;
                this.setState({
                  shareModalVisible: true,
                  userName: name,
                });
              }}
            >
              <Image
                source={require("../../../images/square/shareIcon.png")}
                style={[size_tool(41, 43)]}
              />
              <Text
                style={[
                  appFont.fontFamily_jcyt_500,
                  {
                    fontSize: isPhone ? pxToDpWidthLs(29) : pxToDp(34),
                    color: "#727475",
                    marginLeft: pxToDp(16),
                  },
                ]}
              >
                分享
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <SafeAreaView style={[{ flex: 1 }]}>
           {this.renderContent(module)}
        </SafeAreaView>
        <Msg
          showMsg={showMsg}
          navigation={this.props.navigation}
          titleDom={
            isWord ? (
              <View style={[appStyle.flexTopLine]}>
                {word.map((i, x) => {
                  return (
                    <View key={x} style={[appStyle.flexAliCenter]}>
                      <Text
                        style={[
                          word.length > 2
                            ? styles.wordPinyin_four
                            : styles.wordPinyin,
                        ]}
                      >
                        {pinyinList[x]}
                      </Text>
                      <Text
                        style={[
                          word.length > 2
                            ? styles.wordTxt_four
                            : styles.wordTxt,
                        ]}
                      >
                        {i}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : null
          }
          mainDOm={
            isWord ? (
              <View style={[{ flex: 1 }, padding_tool(10, 0, 10, 0)]}>
                <ScrollView>
                  <Text
                    style={[
                      styles.meaningMsg,
                      isPhone ? { fontSize: pxToDpWidthLs(36) } : null,
                    ]}
                  >
                    {meaning}
                  </Text>
                </ScrollView>
              </View>
            ) : null
          }
          onClose={() => {
            this.setState({
              showMsg: false,
              isWord: false,
            });
          }}
          onOk={() => {
            this.setState(
              {
                showMsg: false,
              },
              () => {
                if (isWord) {
                  this.setState({
                    isWord: false,
                  });
                } else {
                  if (this.props.coin < 80) {
                    // 余额不足
                    this.props.setPayCoinVisible(true);
                    return;
                  }
                  DeviceEventEmitter.emit("initCreateCheckData");
                  if (module === "common_story") {
                    if (this.props.squareType === "parent") {
                      this.props.setStoryCreateType("science");
                      NavigationUtil.toSquareCheckQuestion(this.props);
                    } else {
                      this.props.setStoryCreateType("know");
                      NavigationUtil.toSquareCheckWords(this.props);
                    }
                  } else if (
                    module === "common_story_v2" ||
                    module === "encyclopedias"
                  ) {
                    this.props.setStoryCreateType("science");
                    NavigationUtil.toSquareCheckQuestion(this.props);
                  } else if (module === "common_story_v3") {
                    if (this.props.squareType === "parent") {
                      this.props.setStoryCreateType("science");
                      NavigationUtil.toSquareCheckQuestion(this.props);
                    } else {
                      // 学生进到家长创作的内容
                      NavigationUtil.toSquareCheckCreateType(this.props);
                    }
                  }
                }
              }
            );
          }}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  autherName: {
    fontSize: pxToDp(45),
    color: "#283139",
    marginLeft: pxToDp(37),
  },
  autherWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: pxToDp(57),
  },
  wordTxt_four: {
    fontSize: pxToDp(80),
    color: "#1F1F26",
    lineHeight: pxToDp(90),
  },
  wordTxt: {
    fontSize: pxToDp(100),
    color: "#1F1F26",
    lineHeight: pxToDp(110),
  },
  wordPinyin_four: {
    fontSize: pxToDp(32),
    color: "#1F1F26",
    lineHeight: pxToDp(42),
  },
  wordPinyin: {
    fontSize: pxToDp(46),
    color: "#1F1F26",
    lineHeight: pxToDp(56),
  },
  meaningMsg: {
    fontSize: pxToDp(38),
    color: "#283139",
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    token: state.getIn(["userInfo", "token"]),
    safeInsets: state.getIn(["userInfo", "safeInsets"]),
    questionMap: state.getIn(["square", "questionMap"]),
    squareType: state.getIn(["userInfo", "squareType"]),
    coin: state.getIn(["userInfo", "coin"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    setStoryCreateType(data) {
      dispatch(actionSquare.setStoryCreateType(data));
    },
    setPayCoinVisible(data) {
      dispatch(purchaseAction.setPayCoinVisible(data));
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(SquareDetail);
