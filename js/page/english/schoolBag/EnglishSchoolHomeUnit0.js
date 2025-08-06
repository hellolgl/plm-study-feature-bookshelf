import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
} from "react-native";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import NavigationUtil from "../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { appStyle } from "../../../theme";
import { pxToDp, padding_tool } from "../../../util/tools";
import CheckBox from "react-native-check-box";
import EnglishBar from "../../../component/english/bar";
import Bar from "../../../component/bar";
import Header from '../../../component/Header'
import OtherUserInfo from "../../../component/otherUserinfo";


const ModeBody = {
  my: 1,
  lets: 2,
};

Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) {
      return i;
    }
  }
  return -1;
};
// 通过索引删除数组元素
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

class EnglishSchoolHomeUnit0 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          text: "Listening",
          value: "20%",
          bgColor: ["#6384F0", "#8BA0F8"],
        },
        {
          text: "Speaking",
          value: "60%",
          bgColor: ["#FDAE00", "#FAC845"],
        },
        {
          text: "Reading",
          value: "10%",
          bgColor: ["#FA7528", "#FC8A4B"],
        },
        {
          text: "Writing",
          value: "50%",
          bgColor: ["#3AB4FF", "#78D7FE"],
        },

      ],
      classList: {},
      isCheckedAllPhrase: false,
      wordCheckList: [],
      phraseCheckList: [],
      wordAndPhraseSelectList: [],
      wordAndPhraseCodeSelectList: [],
      wordFilllist: [
        {
          value: "0%",
          bgColor: ["#FFE93CFF", "#FFE93CFF"],
        },
      ],
    };
  }

  static navigationOptions = {
    // title:'答题'
  };

  componentDidMount() {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    // const item = this.props.navigation.state.params.data
    //console.log("componentDid SelectUnit0");
    const data = {
      origin: "032001000000",
      mode: 1,
      kpg_type: 1,
      student_code: userInfoJs.id,
    };

    axios.post(api.QueryEnSynchronizeProgressUnit0, data).then((res) => {
      //console.log("progress data", res);
      let wordlist = [];
      let phraselist = [];
      let filllist = [];
      if (res.data.data.word) {
        res.data.data.word.map((item) => {
          wordlist.push({
            check: false,
            value: item.knowledgepoint,
            status: item.status,
            code: item.code
          });
        });
      }
      if (res.data.data.phrase) {
        res.data.data.phrase.map((item) => {
          phraselist.push({
            check: false,
            value: item.knowledgepoint,
            status: item.status,
            code: item.code
          });
        });
      }
      filllist = [
        {
          value: res.data.data.progress + "%",
          bgColor: ["#FFE93CFF", "#FFE93CFF"],
        },
      ];

      this.setState(() => ({
        wordCheckList: [...wordlist],
        phraseCheckList: [...phraselist],
        wordFilllist: [...filllist],
      }));
    });
  }

  updataData = () => {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    // const item = this.props.navigation.state.params.data
    //console.log("updataData SelectUnit0");
    const data = {
      origin: "032001000000",
      mode: 1,
      kpg_type: 1,
      student_code: userInfoJs.id,
    };

    axios.post(api.QueryEnSynchronizeProgressUnit0, data).then((res) => {
      //console.log("progress data", res);
      let wordlist = [];
      let phraselist = [];
      let filllist = [];
      if (res.data.data.word) {
        res.data.data.word.map((item) => {
          wordlist.push({
            check: false,
            value: item.knowledgepoint,
            status: item.status,
            code: item.code
          });
        });
      }
      if (res.data.data.phrase) {
        res.data.data.phrase.map((item) => {
          phraselist.push({
            check: false,
            value: item.knowledgepoint,
            status: item.status,
            code: item.code
          });
        });
      }
      filllist = [
        {
          value: res.data.data.progress + "%",
          bgColor: ["#FFE93CFF", "#FFE93CFF"],
        },
      ];

      this.setState(() => ({
        wordCheckList: [...wordlist],
        phraseCheckList: [...phraselist],
        wordFilllist: [...filllist],
      }));
    });
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  toDoHomework = (kpg_type, mode) => {
    let item = this.props.navigation.state.params.data;
    if (!item) return;
    item.origin = "032001000000";
    //console.log("toDoHomework item", item);
    switch (kpg_type) {
      case 1: //单词短语
        this.toHomeWork(kpg_type, mode, item);
        break;
    }
  };

  toHomeWork = (kpg_type, mode, item) => {
    switch (mode) {
      case 1: //勾选知识点
        NavigationUtil.toEnglishChooseKnowledge({
          ...this.props,
          data: {
            origin: item.origin,
            unit_name: item.unit_name,
            mode,
            kpg_type,
            knowledge_type: 1,
            unit_code: item.unit_code,
          },
        });
        break;
      case 2: //系统自动推送题目
        if (!item.origin || !item.unit_name) return;
        NavigationUtil.toSynchronizeDiagnosisEn({
          ...this.props,
          data: {
            exercise_origin: item.origin,
            unit_name: item.unit_name,
            mode,
            kpg_type,
            knowledge_type: 1,
            unit_code: item.unit_code,
            updata: () => {
              this.updataData();
            },
          },
        });
        break;
    }
  };

  toSynchronizeDiagnosisEnByMy = (kpg_type, mode) => {
    let item = this.props.navigation.state.params.data;
    const { wordAndPhraseSelectList, wordAndPhraseCodeSelectList } = this.state;
    console.log("toSynchronizeDiagnosisEnByMy", wordAndPhraseCodeSelectList);
    if (!item) return;
    item.origin = "032001000000";
    if (!item.origin || !item.unit_name) return;
    NavigationUtil.toSynchronizeDiagnosisEn({ ...this.props, data: { exercise_origin: item.origin, unit_name: item.unit_name, mode, kpg_type, knowledgeList: wordAndPhraseSelectList, knowledge_type: 1, unit_code: item.unit_code, codeList: wordAndPhraseCodeSelectList } })
  };

  checkUnit = (checkIndex) => {
    this.setState({
      nowIndex: checkIndex,
    });
  };

  checkSelectAllState = () => {
    const { wordCheckList, phraseCheckList } = this.state;
    let state = true;
    wordCheckList.forEach((item) => {
      if (!item.check) {
        state = false;
      }
    });
    phraseCheckList.forEach((item) => {
      if (!item.check) {
        state = false;
      }
    });
    this.setState(() => ({
      isCheckedAllPhrase: state,
    }));
  };

  setClickWordOrPhrase = (item, index) => {
    if (!item) return;

    const { wordAndPhraseSelectList, wordCheckList, wordAndPhraseCodeSelectList } = this.state;
    console.log("wordCheckList", wordCheckList);
    console.log("item", item);
    if ((index + 1) % 2 > 0) {
      item.check
        ? (wordCheckList[index + 1].check = true)
        : (wordCheckList[index + 1].check = false);
    } else {
      item.check
        ? (wordCheckList[index - 1].check = true)
        : (wordCheckList[index - 1].check = false);
    }
    let list = [...wordAndPhraseSelectList];
    let codeList = [...wordAndPhraseCodeSelectList]
    //知识点knowpoint数组新增
    if (item.check && list.indexOf(item.value) < 0) {
      (index + 1) % 2 > 0
        ? list.push(wordCheckList[index + 1].value)
        : list.push(wordCheckList[index - 1].value);
      list.push(item.value);
    } else if (!item.check && list.indexOf(item.value) > -1) {
      (index + 1) % 2 > 0
        ? list.remove(wordCheckList[index + 1].value)
        : list.remove(wordCheckList[index - 1].value);
      list.remove(item.value);
    }
    //知识点code数组新增
    if (item.check && codeList.indexOf(item.code) < 0) {
      (index + 1) % 2 > 0
        ? codeList.push(wordCheckList[index + 1].code)
        : codeList.push(wordCheckList[index - 1].code);
      codeList.push(item.code);
    } else if (!item.check && codeList.indexOf(item.code) > -1) {
      (index + 1) % 2 > 0
        ? codeList.remove(wordCheckList[index + 1].code)
        : codeList.remove(wordCheckList[index - 1].code);
      codeList.remove(item.code);
    }
    this.setState(() => ({
      wordAndPhraseSelectList: [...list],
      wordAndPhraseCodeSelectList: [...codeList]
    }));
    this.checkSelectAllState();
  };

  wordAndPhraseSelectAll = () => {
    const { wordCheckList, phraseCheckList, isCheckedAllPhrase } = this.state;
    //console.log("wordAndPhraseSelectAll", isCheckedAllPhrase);
    let wordlist = wordCheckList.map((item) => {
      item.check = isCheckedAllPhrase;
      return item;
    });
    let phraselist = phraseCheckList.map((item) => {
      item.check = isCheckedAllPhrase;
      return item;
    });

    this.setState(() => ({
      wordCheckList: [...wordlist],
      phraseCheckList: [...phraselist],
    }));
  };

  renderChooserPhraseKnowledge = () => {
    const { phraseCheckList, wordCheckList } = this.state;
    if (phraseCheckList.length <= 0 && wordCheckList.length <= 0) return;
    return (
      <View>
        <View style={{ height: pxToDp(350), width: pxToDp(1280) }}>
          <ScrollView style={{ flex: 1 }}>
            {/** 单词*/}
            <View style={{ flex: 1, flexWrap: "wrap", flexDirection: "row" }}>
              {wordCheckList.map((item, index) => {
                let textColor = "#FFFFFFFF";
                if (item.status == 1) {
                  textColor = "green";
                }
                if (item.status == 2) {
                  textColor = "red";
                }
                return (
                  <View
                    key={index}
                    style={[
                      appStyle.flexTopLine,
                      appStyle.flexAliCenter,
                      {
                        borderRadius: pxToDp(8),
                        width: pxToDp(120),
                        height: pxToDp(40),
                        marginBottom: pxToDp(30),
                        marginStart: pxToDp(30),
                        marginTop: pxToDp(10),
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: pxToDp(38),
                        color: textColor,
                        fontWeight: "bold",
                        marginLeft: pxToDp(21),
                      }}
                    >
                      {item.value}
                    </Text>
                    <CheckBox
                      style={{
                        flex: 1,
                        marginLeft: pxToDp(18),
                        marginEnd: pxToDp(10),
                        position: "absolute",
                        right: 0,
                      }}
                      onClick={() => {
                        item.check = !item.check;
                        this.setClickWordOrPhrase(item, index);
                      }}
                      isChecked={item.check}
                      checkedImage={
                        <Image
                          source={require("../../../images/ic_circle_checkbox_check.png")}
                          style={{ width: 25, height: 25 }}
                        />
                      }
                      unCheckedImage={
                        <Image
                          source={require("../../../images/ic_circle_checkbox_uncheck.png")}
                          style={{ width: 25, height: 25 }}
                        />
                      }
                    ></CheckBox>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  render() {
    const { list, wordFilllist } = this.state;
    return (
      <View>
        <View style={[padding_tool(40, 48, 0, 48)]}>
          <Header text={'Alphabet'} txtStyle={{fontWeight:"bold"}} haveAvatar={true}  goBack={()=>{this.goBack()}}></Header>
        </View>
        <View style={styles.con}>
          <View style={[styles.left]}>
          <OtherUserInfo avatarSize={164} isRow={true} hiddenBg={true}></OtherUserInfo>
          <View style={[padding_tool(48),{paddingTop:0}]}>
                <Bar list={list}></Bar>
              </View>
          </View>
          <View>
            <ImageBackground
              source={require("../../../images/englishSchoolHomeunit0_bg1.png")}
              style={[
                appStyle.flexTopLine,
                {
                  width: pxToDp(1300),
                  height: pxToDp(298),
                  borderRadius: pxToDp(32),
                  marginLeft: pxToDp(24),
                  marginBottom: pxToDp(48),
                },
              ]}
            >
              <View
                style={{
                  width: pxToDp(461),
                  flexDirection: "row",
                  position: "absolute",
                  bottom: 0,
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.toDoHomework(1, ModeBody.lets);
                  }}
                >
                  <Text style={[styles.goDetailsBtn1, { color: "#FA7A30FF",width:pxToDp(200) }]}>
                    Test Me
                  </Text>
                </TouchableOpacity>
                <View
                  style={[
                    appStyle.flexTopLine,
                    appStyle.flexAliCenter,
                    { height: pxToDp(42), marginStart: pxToDp(208) },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: pxToDp(38),
                      color: "#FFFFFF",
                      fontWeight: "bold",
                    }}
                  >
                    Progress
                  </Text>
                  <EnglishBar list={wordFilllist}></EnglishBar>
                </View>
              </View>
            </ImageBackground>
            <ImageBackground
              source={require("../../../images/englishSchoolHomeunit0_bg2.png")}
              resizeMode="stretch"
              style={[
                {
                  width: pxToDp(1300),
                  height: pxToDp(529),
                  borderRadius: pxToDp(32),
                  marginLeft: pxToDp(24),
                  marginBottom: pxToDp(48),
                },
              ]}
            >
              <View style={{ marginTop: pxToDp(48) }}>
                <View
                  style={[
                    { width: pxToDp(1300), flexDirection: "row-reverse" },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.toSynchronizeDiagnosisEnByMy(1, ModeBody.my);
                    }}
                  >
                    <Text
                      style={[styles.goDetailsBtn2, { color: "#5CC1FFFF" }]}
                    >
                      Start
                    </Text>
                  </TouchableOpacity>
                </View>

                {this.renderChooserPhraseKnowledge()}
              </View>
            </ImageBackground>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  con: {
    flexDirection: "row",
    height: pxToDp(875),
    paddingLeft:pxToDp(48)
  },
  goDetailsBtn1: {
    width: pxToDp(143),
    height: pxToDp(54),
    backgroundColor: "#fff",
    textAlign: "center",
    // lineHeight: pxToDp(64),
    borderRadius: pxToDp(32),
    marginLeft: pxToDp(48),
    marginEnd: pxToDp(48),
    marginBottom: pxToDp(48),
    fontSize: pxToDp(38),
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
  },
  goDetailsBtn2: {
    width: pxToDp(143),
    height: pxToDp(54),
    backgroundColor: "#fff",
    textAlign: "center",
    // lineHeight: pxToDp(64),
    borderRadius: pxToDp(32),
    marginLeft: pxToDp(48),
    marginEnd: pxToDp(48),
    marginBottom: pxToDp(48),
    fontSize: pxToDp(38),
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
  },
  left: {
    width: pxToDp(600),
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    marginRight: pxToDp(30),
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
)(EnglishSchoolHomeUnit0);
