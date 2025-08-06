import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import NavigationUtil from "../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { appStyle } from "../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../util/tools";
import CheckBox from "react-native-check-box";
import { Toast } from "antd-mobile-rn";

class EnglishChooseKnowledge extends PureComponent {
  constructor(props) {
    super(props);
    (this.knowledge_type = 1), (this.isloading = true);
    this.flag = false;
    this.state = {
      classList: {},
      isCheckedAllPhrase: false,
      isCheckedAllExpress: false,
      sentenceCheckList: [],
      wordAndPhraseSelectList: [],
      expressCheckList: [],
      expressSelectList: [],
      wordAndPhraseCodeSelectList: [],
      expressCodeSelectList: [],
      checkImg: require("../../../images/englishHomepage/ic_checkbox_check.png"),
      uncheckImg: require("../../../images/englishHomepage/ic_checkbox_uncheck.png"),
      yesImg: require("../../../images/englishHomepage/ic_excellent.png"),
      noImg: require("../../../images/englishHomepage/ic_error.png"),
    };
  }

  componentDidMount() {
    this.getlist();
  }

  getlist() {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const item = this.props.navigation.state.params.data;
    this.knowledge_type = item.knowledge_type;
    const data = {
      origin: item.origin || "032001000707",
      mode: item.mode,
      sub_modular: item.kpg_type,
    };

    this.isloading = true;
    console.log("参数", data);
    axios.get(api.getEnglishKnowList, { params: data }).then((res) => {
      this.isloading = false;
      this.flag = false;
      let wordlist = [],
        expresslist = [];
      console.log("数据", res.data);

      let data = res.data.data;
      data.sentence.forEach((item) => {
        wordlist.push({
          check: false,
          value: item.knowledge_point,
          status: item.status,
          code: item.k_id,
        });
      });
      data.article.forEach((item) => {
        expresslist.push({
          check: false,
          value: item.knowledge_point,
          status: item.status,
          code: item.k_id,
        });
      });
      this.setState({
        sentenceCheckList: [...wordlist],
        wordAndPhraseSelectList: [],
        wordAndPhraseCodeSelectList: [],
        isCheckedAllPhrase: false,
        isCheckedAllExpress: false,
        expressCheckList: [...expresslist],
        expressCodeSelectList: [],
        expressSelectList: [],
      });
    });
  }
  getKnowledge = (kpg_type) => {
    switch (kpg_type) {
      case 1: //单词短语
        return this.renderChooserPhraseKnowledge();

      case 2: //句子
        return this.renderChooserExpressKnowledge();
    }
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  toDoHomework = () => {
    let item = this.props.navigation.state.params.data;
    // console.log('toDoHomework item',item)
    if (!item) return;
    switch (kpg_type) {
      case 1: //单词短语
        this.toHomeWork(kpg_type, mode, item);
        break;
      case 2: //句子
        if (+item.unit_code === "00") {
          return;
        }
        this.toHomeWork(kpg_type, mode, item);
        break;
    }
  };

  toHomeWork = (kpg_type, mode, item) => {
    this.getKnowledge(kpg_type, mode, item);
  };
  /**
   *
   * @param {*} kpg_type  1.单词短语 2.句子
   * @param {*} mode  1:勾选知识点生成题 2：系统自推题
   */
  toSynEnByWordKnowledge = (kpg_type, mode) => {
    let item = this.props.navigation.state.params.data;
    const {
      wordAndPhraseSelectList,
      expressSelectList,
      expressCodeSelectList,
      wordAndPhraseCodeSelectList,
    } = this.state;
    if (!item) return;
    let knowList = [...wordAndPhraseSelectList];
    let knowCodelist = [...wordAndPhraseCodeSelectList];
    if (knowCodelist.length + expressCodeSelectList.length === 0) {
      Toast.loading("请选择知识点", 1);
      return;
    }
    // Toast.loading('加载题目1', 1)

    NavigationUtil.toSynchronizeDiagnosisEn({
      ...this.props,
      data: {
        exercise_origin: item.origin,
        unit_name: item.unit_name,
        mode,
        knowledgeList: knowList,
        knowledge_type: this.knowledge_type,
        unit_code: item.unit_code,
        codeList: knowCodelist,
        kpg_type,
        isUpload: true,
        articleList: expressSelectList,
        articleCodeList: expressCodeSelectList,
        updatalist: () => {
          if (this.false === true) return;
          this.flag = true;
          this.getlist();
          this.isloading = true;
        },
      },
    });
  };

  checkSelectAllState = () => {
    const { sentenceCheckList } = this.state;
    let state = true;
    sentenceCheckList.forEach((item) => {
      if (!item.check) {
        state = false;
      }
    });

    this.setState(() => ({
      isCheckedAllPhrase: state,
    }));
  };

  setClickWordOrPhrase = (item) => {
    if (!item) return;
    //console.log('setClickWordOrPhrase',item)
    const { wordAndPhraseSelectList, wordAndPhraseCodeSelectList } = this.state;
    let list = [...wordAndPhraseSelectList];
    if (item.check && list.indexOf(item.value) < 0) {
      list.push(item.value);
    } else if (!item.check && list.indexOf(item.value) > -1) {
      list.remove(item.value);
    }
    //code数组
    let codeList = [...wordAndPhraseCodeSelectList];
    if (item.check && codeList.indexOf(item.code) < 0) {
      codeList.push(item.code);
    } else if (!item.check && codeList.indexOf(item.code) > -1) {
      codeList.remove(item.code);
    }
    this.setState(() => ({
      wordAndPhraseSelectList: [...list],
      wordAndPhraseCodeSelectList: [...codeList],
    }));
    this.checkSelectAllState();
  };

  wordAndPhraseSelectAll = () => {
    const { sentenceCheckList, isCheckedAllPhrase } = this.state;
    //console.log('wordAndPhraseSelectAll',isCheckedAllPhrase)
    let list = [];
    let codeList = [];
    let wordlist = sentenceCheckList.map((item) => {
      item.check = isCheckedAllPhrase;
      if (isCheckedAllPhrase) {
        list.push(item.value);
        codeList.push(item.code);
      }
      return item;
    });

    this.setState(() => ({
      sentenceCheckList: [...wordlist],
      wordAndPhraseSelectList: [...list],
      wordAndPhraseCodeSelectList: [...codeList],
    }));
  };

  checkExpressSelectAllState = () => {
    const { expressCheckList } = this.state;
    let state = true;
    expressCheckList.forEach((item) => {
      if (!item.check) {
        state = false;
      }
    });
    this.setState(() => ({
      isCheckedAllExpress: state,
    }));
  };

  setClickExpress = (item) => {
    if (!item) return;
    const { expressSelectList, expressCodeSelectList } = this.state;
    let list = [...expressSelectList];
    if (item.check && list.indexOf(item.value) < 0) {
      list.push(item.value);
    } else if (!item.check && list.indexOf(item.value) > -1) {
      list.remove(item.value);
    }

    let codeList = [...expressCodeSelectList];
    if (item.check && codeList.indexOf(item.code) < 0) {
      codeList.push(item.code);
    } else if (!item.check && codeList.indexOf(item.code) > -1) {
      codeList.remove(item.code);
    }
    this.setState(() => ({
      expressSelectList: [...list],
      expressCodeSelectList: [...codeList],
    }));
    this.checkExpressSelectAllState();
  };

  expressSelectAll = () => {
    const { expressCheckList, isCheckedAllExpress } = this.state;
    //console.log('expressSelectAll',isCheckedAllExpress)
    let list = [];
    let codeList = [];
    let expresslist = expressCheckList.map((item) => {
      item.check = isCheckedAllExpress;
      if (isCheckedAllExpress) {
        list.push(item.value);
        codeList.push(item.code);
      }
      return item;
    });

    this.setState(() => ({
      expressCheckList: [...expresslist],
      expressSelectList: [...list],
      expressCodeSelectList: [...codeList],
    }));
  };
  toRecord(type) {
    // toEnglishTestMeRecordList
    let kpg_type = type === "word" ? 1 : 2;
    NavigationUtil.toEnglishTestMeRecordList({
      ...this.props,
      data: {
        ...this.props.navigation.state.params.data,
        kpg_type: 2,
      },
    });
  }
  renderChooserPhraseKnowledge = () => {
    const { sentenceCheckList } = this.state;
    if (sentenceCheckList.length <= 0)
      return (
        <Text style={{ fontSize: pxToDp(32) }}>
          {this.isloading === true ? "" : "No Knowledge point"}
        </Text>
      );
    return (
      <View style={{ marginRight: pxToDp(4) }}>
        <View
          style={[
            appStyle.flexTopLine,
            appStyle.flexAliCenter,
            styles.leftItemTitleWrap,
            {
              width: pxToDp(1000),
            },
          ]}
        >
          <Text style={[styles.leftItemTitleLeft]}>Sentences</Text>
          <View
            style={[
              appStyle.flexTopLine,
              appStyle.flexAliCenter,
              size_tool(240, 40),
            ]}
          >
            <Text style={styles.leftItemTitleRight}>Select all</Text>
            <CheckBox
              style={styles.leftItemTitleRightCheck}
              onClick={() => {
                this.setState(
                  () => ({
                    isCheckedAllPhrase: !this.state.isCheckedAllPhrase,
                  }),
                  () => {
                    this.wordAndPhraseSelectAll();
                  }
                );
              }}
              isChecked={this.state.isCheckedAllPhrase}
              checkedImage={
                <Image
                  source={this.state.checkImg}
                  style={{ width: 25, height: 25 }}
                />
              }
              unCheckedImage={
                <Image
                  source={this.state.uncheckImg}
                  style={{ width: 25, height: 25 }}
                />
              }
            ></CheckBox>
          </View>
        </View>
        <ScrollView style={{ height: "88%" }}>
          {/** 句子*/}
          <View style={{ flex: 1, flexWrap: "wrap", flexDirection: "row" }}>
            {sentenceCheckList.map((item, index) => {
              let imgUrl = "";
              if (item.status == 1) {
                imgUrl = this.state.yesImg;
              }
              if (item.status == 2) {
                imgUrl = this.state.noImg;
              }
              return (
                <TouchableOpacity
                  onPress={() => {
                    item.check = !item.check;
                    this.setClickWordOrPhrase(item);
                  }}
                  style={[
                    styles.letItem,
                    appStyle.flexLine,
                    {
                      width: pxToDp(1000),
                      height: pxToDp(104),
                      minHeight: pxToDp(104),
                    },
                    {
                      borderColor: item.check ? "#FFB533" : "#FFEDCD",
                      borderWidth: pxToDp(4),
                    },
                  ]}
                  key={index}
                >
                  <Text
                    style={{
                      fontSize: pxToDp(38),
                      color: "#333",
                      maxWidth: pxToDp(800),
                    }}
                  >
                    {item.value}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      position: "absolute",
                      right: pxToDp(10),
                    }}
                  >
                    {imgUrl ? (
                      <Image source={imgUrl} style={[size_tool(48)]}></Image>
                    ) : null}
                    <CheckBox
                      style={{
                        flex: 1,
                        marginLeft: pxToDp(18),
                        marginEnd: pxToDp(10),
                      }}
                      onClick={() => {
                        item.check = !item.check;
                        this.setClickWordOrPhrase(item);
                      }}
                      isChecked={item.check}
                      checkedImage={
                        <Image
                          source={this.state.checkImg}
                          style={{ width: 25, height: 25 }}
                        />
                      }
                      unCheckedImage={
                        <Image
                          source={this.state.uncheckImg}
                          style={{ width: 25, height: 25 }}
                        />
                      }
                    ></CheckBox>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  renderChooserExpressKnowledge = () => {
    const { expressCheckList } = this.state;
    //console.log('renderChooserExpressKnowledge',expressCheckList)
    if (expressCheckList.length <= 0 && expressCheckList.length <= 0)
      return (
        <Text style={{ fontSize: pxToDp(32) }}>
          {this.isloading === true ? "" : "No Knowledge point"}
        </Text>
      );
    return (
      <View>
        <View
          style={[
            appStyle.flexTopLine,
            appStyle.flexAliCenter,
            styles.leftItemTitleWrap,
          ]}
        >
          <Text style={styles.leftItemTitleLeft}>Passages</Text>
          <View
            style={[
              appStyle.flexTopLine,
              appStyle.flexAliCenter,
              size_tool(240, 40),
            ]}
          >
            <Text style={styles.leftItemTitleRight}>Select all</Text>
            <CheckBox
              style={styles.leftItemTitleRightCheck}
              onClick={() => {
                //console.log('checkAllExpress')
                this.setState(
                  () => ({
                    isCheckedAllExpress: !this.state.isCheckedAllExpress,
                  }),
                  () => {
                    this.expressSelectAll();
                  }
                );
              }}
              isChecked={this.state.isCheckedAllExpress}
              checkedImage={
                <Image
                  source={this.state.checkImg}
                  style={{ width: 25, height: 25 }}
                />
              }
              unCheckedImage={
                <Image
                  source={this.state.uncheckImg}
                  style={{ width: 25, height: 25 }}
                />
              }
            ></CheckBox>
          </View>
        </View>
        <View style={[size_tool(740, 600)]}>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              {expressCheckList.map((item, index) => {
                let imgUrl = "";
                if (item.status == 1) {
                  imgUrl = this.state.yesImg;
                }
                if (item.status == 2) {
                  imgUrl = this.state.noImg;
                }
                return (
                  <TouchableOpacity
                    onPress={() => {
                      item.check = !item.check;
                      this.setClickExpress(item);
                    }}
                    style={[
                      styles.letItem,
                      appStyle.flexLine,
                      {
                        width: pxToDp(720),
                        height: pxToDp(172),
                      },
                      {
                        borderColor: item.check ? "#FFB533" : "#FFEDCD",
                        borderWidth: pxToDp(4),
                      },
                    ]}
                    key={index}
                  >
                    <Text style={{ fontSize: pxToDp(38), color: "#333" }}>
                      {item.value}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        position: "absolute",
                        right: pxToDp(10),
                      }}
                    >
                      {imgUrl ? (
                        <Image source={imgUrl} style={[size_tool(48)]}></Image>
                      ) : null}
                      <CheckBox
                        style={{
                          flex: 1,
                          marginLeft: pxToDp(18),
                          marginEnd: pxToDp(10),
                        }}
                        onClick={() => {
                          item.check = !item.check;
                          this.setClickExpress(item);
                        }}
                        isChecked={item.check}
                        checkedImage={
                          <Image
                            source={this.state.checkImg}
                            style={{ width: 25, height: 25 }}
                          />
                        }
                        unCheckedImage={
                          <Image
                            source={this.state.uncheckImg}
                            style={{ width: 25, height: 25 }}
                          />
                        }
                      ></CheckBox>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  render() {
    return (
      <ImageBackground
        style={[styles.mainWrap, { width: "100%", height: "100%" }]}
        source={require("../../../images/chineseHomepage/flowBigBg.png")}
      >
        {Platform.OS === "ios" ? (
          <View style={{ marginTop: pxToDp(20) }}></View>
        ) : null}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.goBack()}
            style={{ width: pxToDp(470) }}
          >
            <Image
              source={require("../../../images/englishHomepage/backBtn.png")}
              style={[{ width: pxToDp(80), height: pxToDp(80) }]}
            ></Image>
          </TouchableOpacity>
          <View>
            <Text
              style={[
                { color: "#fff", fontSize: pxToDp(48), fontWeight: "bold" },
              ]}
            >
              {this.props.navigation.state.params.data.unit_name}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={[styles.titleItem, { marginRight: pxToDp(32) }]}>
              <Image
                source={this.state.yesImg}
                style={styles.titleItemImg}
              ></Image>
              <Text style={[styles.titleItemText, { color: "#A0F06D" }]}>
                Excellent
              </Text>
            </View>
            <View style={styles.titleItem}>
              <Image
                source={this.state.noImg}
                style={styles.titleItemImg}
              ></Image>
              <Text style={[styles.titleItemText, { color: "#FD9A9A" }]}>
                Try again
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[
            {
              flex: 1,
            },
          ]}
        >
          <View style={styles.con}>
            <View style={[styles.left]}>
              {this.isloading === true ? null : this.getKnowledge(1)}
            </View>
            <View style={[styles.left, { width: pxToDp(800), marginRight: 0 }]}>
              {this.isloading === true ? null : this.getKnowledge(2)}
            </View>
          </View>
          <View
            style={[
              appStyle.flexCenter,
              appStyle.flexTopLine,
              { width: "100%", flex: 1 },
            ]}
          >
            <TouchableOpacity onPress={this.toRecord.bind(this, "sentence")}>
              <Image
                style={[size_tool(248, 80), { marginRight: pxToDp(20) }]}
                source={require("../../../images/englishHomepage/testMeRecord.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.toSynEnByWordKnowledge(2, 1);
              }}
            >
              <Image
                style={[size_tool(254, 80)]}
                source={require("../../../images/englishHomepage/checkKnowStart.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
    // backgroundColor: 'red'
    alignItems: "center",
    backgroundColor: "#F5D6A6",
  },
  header: {
    flexDirection: "row",
    height: pxToDp(144),
    width: "100%",
    borderRadius: 15,
    justifyContent: "space-between",
    paddingLeft: pxToDp(67),
    paddingRight: pxToDp(67),
    alignItems: "center",
  },
  con: {
    flexDirection: "row",
    height:
      Platform.OS === "ios"
        ? Dimensions.get("window").height * 0.8
        : Dimensions.get("window").height * 0.75,
    maxHeight:
      Platform.OS === "ios"
        ? Dimensions.get("window").height * 0.8
        : Dimensions.get("window").height * 0.75,
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
  },
  goDetailsBtn1: {
    width: pxToDp(240),
    height: pxToDp(64),
    backgroundColor: "#fff",
    textAlign: "center",
    lineHeight: pxToDp(64),
    borderRadius: pxToDp(32),
    fontSize: pxToDp(32),
    marginLeft: pxToDp(48),
    marginEnd: pxToDp(48),
    marginBottom: pxToDp(48),
    fontSize: pxToDp(38),
    fontWeight: "bold",
  },
  goDetailsBtn2: {
    width: pxToDp(240),
    height: pxToDp(64),
    backgroundColor: "#fff",
    textAlign: "center",
    lineHeight: pxToDp(64),
    borderRadius: pxToDp(32),
    fontSize: pxToDp(32),
    fontSize: pxToDp(38),
    fontWeight: "bold",
  },
  left: {
    width: pxToDp(1100),
    // height: pxToDp(800),
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    marginRight: pxToDp(48),
    padding: pxToDp(40),
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
  titleItemText: {
    fontSize: pxToDp(27),
    fontWeight: "bold",
    marginEnd: pxToDp(10),
  },
  titleItemImg: {
    width: pxToDp(44),
    height: pxToDp(44),
    marginRight: pxToDp(10),
  },
  letItem: {
    borderRadius: pxToDp(24),
    width: pxToDp(720),
    marginBottom: pxToDp(22),
    backgroundColor: "#FFEDCD",
    flexDirection: "row",
    paddingRight: pxToDp(40),
    height: pxToDp(172),
    alignItems: "center",
    position: "relative",
    paddingLeft: pxToDp(30),
  },
  leftItemTitleWrap: {
    borderRadius: pxToDp(8),
    width: pxToDp(720),
    height: pxToDp(70),
    marginBottom: pxToDp(22),
    justifyContent: "space-between",
  },
  leftItemTitleLeft: {
    fontSize: pxToDp(38),
    color: "#AAA",
    fontWeight: "bold",
  },
  leftItemTitleRight: {
    fontSize: pxToDp(38),
    color: "#DC7F00",
    fontWeight: "bold",
  },
  leftItemTitleRightCheck: {
    marginLeft: pxToDp(18),
    borderColor: "#FFEDCD",
    borderWidth: pxToDp(3),
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
)(EnglishChooseKnowledge);
