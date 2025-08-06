import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  TextInput,
  Platform,
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import {
  pxToDp,
  padding_tool,
  size_tool,
  borderRadius_tool,
  fontFamilyRestoreMargin,
} from "../../../../../util/tools";
import { appFont, appStyle } from "../../../../../theme";
import * as actionCreators from "../../../../../action/userInfo/index";
import UploadImage from "./uploadImage";
import DownImage from "./downImage";
import { Modal, Toast } from "antd-mobile-rn";
import PayModal from "../../../../../util/pay/zuowenPayModal";
import PayModalAndroid from "../../../../../util/pay/zuowenPayModalAndroid";

// import Svg,{ ForeignObject } from 'react-native-svg';
class ChineseSchoolHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      list: [],
      nowPage: 1,
      haveNextPage: true,
      islook: false,
      articleDetail: {},
      islookReview: false,
      times: 0,
      payModalVisible: false,
    };
  }

  static navigationOptions = {
    // title:'答题'
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  componentDidMount() {
    this.getlist();
  }
  goMyCreater = () => {
    NavigationUtil.toChineseDiaryCompositionType(this.props);
  };

  uploadDown = () => {
    this.getlist(1);
    this.setState({
      visible: false,
    });
  };
  getlist = (page) => {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = {};
    data.grade_code = userInfoJs.checkGrade;
    data.term_code = userInfoJs.checkTeam;
    data.page = page;
    axios
      .get(api.getCompositionMyUploadArticleList, { params: data })
      .then((res) => {
        console.log("id", res.data.data);
        let listnow = res.data.data.data;

        let { list, haveNextPage } = this.state;
        let nowList = list.concat(listnow);
        if (nowList.length === res.data.data.page_info.total) {
          haveNextPage = false;
        }
        if (res.data.err_code === 0) {
          this.setState({
            list: page === 1 ? listnow : nowList,
            haveNextPage,
            times: res.data.data.times,
          });
        }
      });
  };

  refreshTimes = () => {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = {};
    data.grade_code = userInfoJs.checkGrade;
    data.term_code = userInfoJs.checkTeam;
    data.page = "1";
    axios
      .get(api.getCompositionMyUploadArticleList, { params: data })
      .then((res) => {
        if (res.data.err_code === 0) {
          this.setState({
            times: res.data.data.times,
          });
        }
      });
  };

  nextPage = () => {
    // 翻页
    let { nowPage, haveNextPage } = this.state;
    if (haveNextPage) {
      let page = ++nowPage;
      this.getlist(page);
      this.setState({
        nowPage: page,
      });
    }
  };
  lookImage = (item) => {
    this.setState({
      islook: true,
      visible: true,
      articleDetail: item,
      islookReview: false,
    });
  };
  lookReviewImage = (item) => {
    item.status === "4"
      ? this.setState({
          islook: true,
          visible: true,
          articleDetail: item,
          islookReview: true,
        })
      : "";
  };
  render() {
    const {
      visible,
      list,
      islook,
      articleDetail,
      islookReview,
      times,
      payModalVisible,
    } = this.state;
    console.log("times: ", times);
    return (
      <ImageBackground
        style={styles.wrap}
        source={require("../../../../../images/chineseHomepage/flowBigBg.png")}
      >
        {Platform.OS === "ios" ? (
          <PayModal
            visible={payModalVisible}
            selectModule={"chinese_composition"}
            subject={"01"}
            onClose={() =>
              this.setState({
                payModalVisible: false,
              })
            }
            refreshGoods={() => {
              setTimeout(() => {
                this.refreshTimes();
              }, 3000);
            }}
            checkGrade={"01"}
            checkTerCode={"00"}
          />
        ) : (
          <PayModalAndroid
            visible={payModalVisible}
            selectModule={"chinese_composition"}
            subject={"01"}
            onClose={() =>
              this.setState({
                payModalVisible: false,
              })
            }
            refreshGoods={() => {
              setTimeout(() => {
                this.refreshTimes();
              }, 3000);
            }}
            checkGrade={"01"}
            checkTerCode={"00"}
            toPay={async (data) => {
              this.setState({
                payModalVisible: false,
              });
              NavigationUtil.toChineseDailyHome({
                ...this.props,
                data: {
                  upload: this.refreshTimes,
                  ...data,
                  selectGrade: "01",
                  selectTerm: "00",
                  lenth: 0,
                },
              });
            }}
          />
        )}
        <View
          style={[
            appStyle.flexLine,
            appStyle.flexJusBetween,
            padding_tool(0, 64, 0, 64),
            { width: "100%", marginBottom: pxToDp(24) },
          ]}
        >
          {/* header */}
          <TouchableOpacity onPress={this.goBack}>
            <Image
              source={require("../../../../../images/chineseHomepage/wrongTypeGoback.png")}
              style={[size_tool(80)]}
            />
          </TouchableOpacity>
          <ImageBackground
            source={require("../../../../../images/chineseHomepage/wrongTypeHeader.png")}
            style={[size_tool(500, 141), appStyle.flexCenter]}
          >
            <Text
              style={[
                {
                  fontSize: pxToDp(36),
                  color: "#fff",
                  paddingTop: pxToDp(20),
                  lineHeight: pxToDp(46),
                },
                appFont.fontFamily_syst,
              ]}
            >
              我的创作/作文批改
            </Text>
          </ImageBackground>
          <Text style={[size_tool(80)]}></Text>
        </View>
        <View style={[{ flex: 1 }, appStyle.flexCenter]}>
          <ImageBackground
            source={require("../../../../../images/chineseHomepage/upArticlelist.png")}
            style={[size_tool(1872, 851)]}
          >
            <View
              style={[
                appStyle.flexCenter,
                appStyle.flexTopLine,
                size_tool(1872, 200),
              ]}
            >
              <Text
                style={[
                  {
                    fontSize: pxToDp(40),
                    color: "#B75416",
                    fontWeight: "bold",
                    marginRight: pxToDp(100),
                  },
                ]}
              >
                小朋友，点击上传按钮拍照并上传自己创作的作文哦！
              </Text>
              <TouchableOpacity
                onPress={() => {
                  // if (times === 0) {
                  //     // if (Platform.OS === "ios") {
                  //     this.setState({
                  //         payModalVisible: true
                  //     })
                  //     // } else {
                  //     //     Toast.fail('您没有作文批改次数，请前往 [派效学] 微信小程序购买!', 3)
                  //     // }
                  //     return
                  // }

                  this.setState({ visible: true, islook: false });
                }}
              >
                <Image
                  source={require("../../../../../images/chineseHomepage/uploadImageBtn.png")}
                  style={[size_tool(314, 93)]}
                />
              </TouchableOpacity>
            </View>
            {list.length === 0 ? (
              <View
                style={[
                  { flex: 1, alignItems: "center", paddingTop: pxToDp(100) },
                ]}
              >
                {/* <Image source={require('../../../../../images/chineseHomepage/noArticle.png')}
                                    style={[size_tool(440, 290)]}
                                /> */}
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
                    还没有上传作文哦~
                  </Text>
                </View>
              </View>
            ) : (
              <View style={[padding_tool(56), size_tool(1872, 660)]}>
                <ScrollView
                  onMomentumScrollEnd={() => this.nextPage()}
                  style={[{ width: "100%" }]}
                >
                  <View
                    style={[
                      appStyle.flexTopLine,
                      appStyle.flexJusBetween,
                      appStyle.flexLineWrap,
                    ]}
                  >
                    {list.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={[
                            size_tool(860, 265),
                            borderRadius_tool(32),
                            padding_tool(32),
                            appStyle.flexJusBetween,
                            {
                              backgroundColor: "#fff",
                              marginBottom: pxToDp(32),
                            },
                          ]}
                        >
                          <View
                            style={[
                              appStyle.flexTopLine,
                              appStyle.flexJusBetween,
                            ]}
                          >
                            <Text
                              style={[
                                {
                                  fontSize: pxToDp(40),
                                  color: "#B75416",
                                  lineHeight: pxToDp(50),
                                },
                                appFont.fontFamily_syst,
                                // fontFamilyRestoreMargin("", -30),
                              ]}
                            >
                              《{item.name}》
                            </Text>
                            <TouchableOpacity
                              onPress={this.lookImage.bind(this, item)}
                              style={[
                                appStyle.flexCenter,
                                size_tool(160, 56),
                                borderRadius_tool(8),
                                { backgroundColor: "#FDE7BE" },
                              ]}
                            >
                              <Text
                                style={[
                                  { fontSize: pxToDp(26), color: "#B75416" },
                                  appFont.fontFamily_syst,
                                ]}
                              >
                                查看作文
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View style={[appStyle.flexTopLine]}>
                            <Text
                              style={[
                                {
                                  fontSize: pxToDp(32),
                                  color: "#AAAAAA",
                                  lineHeight: pxToDp(42),
                                },
                                appFont.fontFamily_syst,
                              ]}
                            >
                              上传状态：已交给老师 上传日期：{item.commit_date}
                            </Text>
                          </View>
                          <View
                            style={[
                              appStyle.flexTopLine,
                              appStyle.flexJusBetween,
                            ]}
                          >
                            <View
                              style={[
                                appStyle.flexTopLine,
                                appStyle.flexAliCenter,
                              ]}
                            >
                              <Text
                                style={[
                                  {
                                    fontSize: pxToDp(32),
                                    color: "#333333",
                                    marginRight: pxToDp(20),
                                    lineHeight: pxToDp(42),
                                  },
                                  appFont.fontFamily_syst,
                                  //   fontFamilyRestoreMargin(),
                                ]}
                              >
                                批改状态：
                                {item.status === "4" ? "已批改" : "未批改"}
                              </Text>
                              <Text
                                style={[
                                  size_tool(42),
                                  borderRadius_tool(21),
                                  {
                                    fontSize: pxToDp(30),
                                    color: "#fff",
                                    backgroundColor:
                                      item.status === "4"
                                        ? "#8DD92B"
                                        : "#AAAAAA",
                                    textAlign: "center",
                                  },
                                ]}
                              >
                                √
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={this.lookReviewImage.bind(this, item)}
                              style={[
                                appStyle.flexCenter,
                                size_tool(160, 56),
                                borderRadius_tool(8),
                                {
                                  backgroundColor:
                                    item.status === "4" ? "#FDE7BE" : "#F1F1F1",
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  {
                                    fontSize: pxToDp(26),
                                    color:
                                      item.status === "4"
                                        ? "#B75416"
                                        : "#999999",
                                  },
                                  appFont.fontFamily_syst,
                                ]}
                              >
                                已批作文
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )}
          </ImageBackground>
        </View>
        <Modal
          visible={visible}
          // visible={true}

          transparent={true}
          footer={[]}
          style={[
            {
              width: pxToDp(2000),
              padding: 0,
              backgroundColor: "rgba(0,0,0,0)",
            },
          ]}
        >
          <View style={[appStyle.flexCenter, { width: "100%" }]}>
            <ImageBackground
              source={require("../../../../../images/chineseHomepage/chineseUploadBg.png")}
              style={[
                size_tool(1901, 956),
                padding_tool(200, 40, 40, 100),
                { position: "relative" },
              ]}
            >
              <TouchableOpacity
                onPress={() => this.setState({ visible: false })}
                style={[
                  size_tool(60),
                  { position: "absolute", right: pxToDp(10), top: pxToDp(200) },
                ]}
              ></TouchableOpacity>
              {islook ? (
                <DownImage
                  uplodDown={this.uploadDown}
                  articleDetail={articleDetail}
                  islookReview={islookReview}
                />
              ) : (
                <UploadImage uplodDown={this.uploadDown} />
              )}
            </ImageBackground>
          </View>
        </Modal>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    setUser(data) {
      dispatch(actionCreators.setUserInfoNow(data));
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
