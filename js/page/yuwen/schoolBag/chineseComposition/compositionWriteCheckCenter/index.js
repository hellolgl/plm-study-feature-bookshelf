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
import axios from "../../../../../util/http/axios";
import { Toast, Modal } from "antd-mobile-rn";

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
import { appStyle, appFont } from "../../../../../theme";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import fonts from "../../../../../theme/fonts";
import MsgModal from "../../../../../component/chinese/sentence/msgModal";

// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      typelist: [],
      type: 0,
      es_id: 0,
      titlelist: [],
      typeDetail: {},
      exercise: {
        exercise: [],
      },
      c_id: 0,
      titleCheckindex: -1,
      titleObj: {},
      centerList: [],
      center: {},
      checkCenterindex: -1,
      structurelist: [],
      structureIndex: -1,
      centerobj: {},
      visible: false,
      diagnose_notes: "",
      headerList: ["写作技法", "作文审题", "作文创作"],
    };
  }

  static navigationOptions = {
    // title:'答题'
  };

  componentDidMount() {
    this.getlist();
    // this.getexercise()
  }
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  shuffle = (arr) => {
    let _arr = arr;
    for (let i = 0; i < _arr.length; i++) {
      let j = this.getRandomInt(0, i);
      let t = _arr[i];
      _arr[i] = _arr[j];
      _arr[j] = t;
    }
    return _arr;
  };
  getlist() {
    console.log("typeDetail", this.props);

    axios
      .get(api.getchineseCompositionArticleTitle, {
        params: {
          es_id: this.props.es_id,
        },
      })
      .then((res) => {
        if (res.data?.err_code === 0) {
          console.log("饭回来数据", res.data.data);
          let listnow = this.shuffle(res.data.data);
          this.setState({
            titlelist: listnow,
            type: 0,
            es_id: this.props.es_id,
            typeDetail: this.props,
          });
        }
      });
  }
  getCenter = (item) => {
    if (!item?.c_id) return;
    if (item.level !== "1") {
      this.setState({
        visible: true,
        diagnose_notes: item.diagnose_notes,
        titleCheckindex: -1,
      });
      return;
    } else {
      this.setState({
        type: 1,
        titleObj: item,
      });
      axios
        .get(api.getchineseCompositionArticleCenter, {
          params: { c_id: item.c_id },
        })
        .then((res) => {
          if (res.data?.err_code === 0) {
            let listnow = this.shuffle(
              res.data.data.themes ? res.data.data.themes : []
            );
            this.setState({
              centerList: listnow,
              type: 1,
              titleObj: item,
              center: res.data.data,
            });
          }
        });
    }
  };
  getstructure = (item) => {
    const { titleObj } = this.state;
    if (!item?.t_id) return;
    if (item.level !== "1") {
      this.setState({
        visible: true,
        diagnose_notes: item.diagnose_notes,
        checkCenterindex: -1,
      });
      return;
    } else {
      axios
        .get(api.getchineseCompositionArticleStructure, {
          params: { t_id: item.t_id, c_id: titleObj.c_id },
        })
        .then((res) => {
          if (res.data?.err_code === 0) {
            this.setState({
              structurelist: res.data.data,
              type: 2,
              centerobj: item,
            });
          }
        });
    }
  };
  nextpage = () => {
    const { centerobj, titleObj, structureIndex, structurelist } = this.state;
    if (structureIndex === -1) return;
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = {};
    data.grade_code = userInfoJs.checkGrade;
    data.c_id = titleObj.c_id;
    data.t_id = centerobj.t_id;
    data.m_id = structurelist[structureIndex].m_id;
    data.inspect_id = userInfoJs.c_id;
    (data.homeKey = this.props.navigation.state.key),
      (data.myCheck = {
        title: titleObj.name,
        center: centerobj.choice_content,
        structure: structurelist[structureIndex].name,
      });
    NavigationUtil.toCompositionWriteMindMap({ ...this.props, data });
  };
  renderBtn = (styleObj, txt, clickBtn, otherStyle) => {
    const {
      paddingHeight,
      borderRadius,
      width,
      height,
      bgColor,
      bottomColor,
      fontSize,
      fontColor,
    } = styleObj;
    return (
      <TouchableOpacity
        onPress={clickBtn}
        style={[
          {
            width: width ? width : "100%",
            minHeight: height ? height : pxToDp(120),
            paddingBottom: paddingHeight ? paddingHeight : pxToDp(8),
            borderRadius: borderRadius ? borderRadius : pxToDp(200),
            backgroundColor: bottomColor ? bottomColor : "transparent",
          },
          otherStyle,
        ]}
      >
        <View
          style={[
            padding_tool(20),
            {
              flex: 1,
              backgroundColor: bgColor ? bgColor : "transparent",
              borderRadius: borderRadius ? borderRadius : pxToDp(200),
            },
            appStyle.flexCenter,
          ]}
        >
          <Text
            style={[
              {
                fontSize: fontSize ? fontSize : pxToDp(46),
                color: fontColor ? fontColor : "#fff",
                lineHeight: pxToDp(60),
              },
              appFont.fontFamily_syst,
            ]}
          >
            {txt}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  renderTitle1 = () => {
    const { titlelist, titleCheckindex } = this.state;
    console.log("123", titlelist);
    return (
      <View style={[{ flex: 1 }]}>
        <Text style={[styles.rightTitle]}>
          给自己的文章选择一个恰当的题目：
        </Text>

        <ScrollView style={{ flex: 1, width: "100%" }}>
          <View style={[{ width: "100%", flex: 1 }]}>
            {titlelist.map((item, index) => {
              return this.renderBtn(
                {
                  bgColor: titleCheckindex === index ? "#FF964A" : "#F5F5FA",
                  bottomColor:
                    titleCheckindex === index ? "#F07C39" : "#E7E7F2",
                  fontColor: titleCheckindex === index ? "#fff" : "#475266",
                  borderRadius: pxToDp(40),
                  height: pxToDp(100),
                  fontSize: pxToDp(36),
                },
                item.name,
                () => this.setState({ titleCheckindex: index }),
                { marginBottom: pxToDp(20) }
              );
            })}
          </View>
        </ScrollView>
        <View style={[styles.rightBottom]}>
          {this.renderBtn(
            {
              width: pxToDp(200),
              bgColor: "#FF964A",
              bottomColor: "#F07C39",
            },
            "继续",
            this.getCenter.bind(this, titlelist[titleCheckindex])
          )}
        </View>
      </View>
    );
  };
  renderTitle2 = () => {
    const { centerList, checkCenterindex, center } = this.state;
    console.log("123", centerList);
    return (
      <View style={[{ flex: 1 }]}>
        <Text style={[styles.rightTitle]}>{center.exercise_stem}</Text>

        <ScrollView style={{ flex: 1, width: "100%" }}>
          <View style={[padding_tool(0, 80, 0, 0), { width: "100%", flex: 1 }]}>
            {centerList.map((item, index) => {
              return this.renderBtn(
                {
                  bgColor: checkCenterindex === index ? "#FF964A" : "#F5F5FA",
                  bottomColor:
                    checkCenterindex === index ? "#F07C39" : "#E7E7F2",
                  fontColor: checkCenterindex === index ? "#fff" : "#475266",
                  borderRadius: pxToDp(40),
                  height: pxToDp(100),
                  fontSize: pxToDp(36),
                },
                item.choice_content,
                () => this.setState({ checkCenterindex: index }),
                { marginBottom: pxToDp(20) }
              );
            })}
          </View>
        </ScrollView>
        <View style={[styles.rightBottom]}>
          {this.renderBtn(
            {
              width: pxToDp(200),
              bgColor: "#FF964A",
              bottomColor: "#F07C39",
            },
            "继续",
            this.getstructure.bind(this, centerList[checkCenterindex])
          )}
        </View>
      </View>
    );
  };
  renderTitle3 = () => {
    const { structurelist, structureIndex, center } = this.state;
    console.log("123", structurelist);
    return (
      <View style={[{ flex: 1 }]}>
        <Text style={[styles.rightTitle]}>请选择文章的结构：</Text>

        <ScrollView style={{ flex: 1, width: "100%" }}>
          <View style={[padding_tool(0, 80, 0, 0), { width: "100%", flex: 1 }]}>
            {structurelist.map((item, index) => {
              return this.renderBtn(
                {
                  bgColor: structureIndex === index ? "#FF964A" : "#F5F5FA",
                  bottomColor: structureIndex === index ? "#F07C39" : "#E7E7F2",
                  fontColor: structureIndex === index ? "#fff" : "#475266",
                  borderRadius: pxToDp(40),
                  height: pxToDp(100),
                  fontSize: pxToDp(36),
                },
                item.name,
                () => this.setState({ structureIndex: index }),
                { marginBottom: pxToDp(20) }
              );
            })}
          </View>
        </ScrollView>
        <View style={[styles.rightBottom]}>
          {this.renderBtn(
            {
              width: pxToDp(200),
              bgColor: "#FF964A",
              bottomColor: "#F07C39",
            },
            "继续",
            this.nextpage
          )}
        </View>
      </View>
    );
  };
  onClose = () => {
    this.setState({
      visible: false,
      diagnose_notes: "",
    });
  };
  renderLeft = () => {
    const {
      type,
      titlelist,
      titleCheckindex,
      centerList,
      checkCenterindex,
      structureIndex,
      structurelist,
    } = this.state;
    return (
      <View style={[appStyle.flexAliCenter, { width: pxToDp(640) }]}>
        <View
          style={[
            styles.leftBorder,
            type === 0 ? { borderColor: "#FF964A" } : {},
          ]}
        >
          <Text style={[styles.leftTitle]}>题目</Text>
          <Text style={[styles.leftContent]}>
            {titlelist[titleCheckindex]?.name}
          </Text>
        </View>
        <View style={[styles.leftLine]} />
        <View
          style={[
            styles.leftBorder,
            { flex: 1 },
            ,
            type === 1 ? { borderColor: "#FF964A" } : {},
          ]}
        >
          <Text style={[styles.leftTitle]}>中心思想</Text>
          <Text style={[styles.leftContent]}>
            {centerList[checkCenterindex]?.choice_content}
          </Text>
        </View>
        <View style={[styles.leftLine]} />
        <View
          style={[
            styles.leftBorder,
            ,
            type === 2 ? { borderColor: "#FF964A" } : {},
          ]}
        >
          <Text style={[styles.leftTitle]}>结构</Text>
          <Text style={[styles.leftContent]}>
            {structurelist[structureIndex]?.name}
          </Text>
        </View>
      </View>
    );
  };
  render() {
    const {
      type,
      titlelist,
      titleCheckindex,
      centerobj,
      visible,
      diagnose_notes,
      headerList,
    } = this.state;
    return (
      <View style={[{ flex: 1 }, padding_tool(0, 60, 60, 60)]}>
        <View
          style={[
            {
              flex: 1,
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: pxToDp(40),
              padding: pxToDp(40),
            },
            appStyle.flexTopLine,
          ]}
        >
          {this.renderLeft()}

          <View
            style={[
              {
                flex: 1,
              },
              padding_tool(0, 40, 0, 40),
            ]}
          >
            {type === 0 ? this.renderTitle1() : null}
            {type === 1 ? this.renderTitle2() : null}
            {type === 2 ? this.renderTitle3() : null}
          </View>
        </View>
        <MsgModal
          btnText="好的"
          todo={() => this.setState({ visible: false })}
          visible={visible}
          title="提示"
          msg={diagnose_notes}
        />
        {/* <Modal
                    visible={visible}
                    transparent={true}
                    // onClose={this.onClose}
                    // closable
                    footer={[
                        { text: "关闭", onPress: this.onClose },
                    ]}
                    style={[{ width: pxToDp(900) }]}
                >
                    <Text style={[{ fontSize: pxToDp(35) }]}>{diagnose_notes}</Text>
                </Modal> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: pxToDp(40),
    color: "#fff",
    fontFamily: Platform.OS === "ios" ? "Muyao-Softbrush" : "Muyao-Softbrush-2",
    marginBottom: pxToDp(20),
  },
  text1: {
    fontSize: pxToDp(40),
    color: "#FFB211",
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "#A86A33",
    borderRadius: pxToDp(16),
    marginRight: pxToDp(24),
  },
  text2: {
    fontSize: pxToDp(28),
    color: "#fff",
  },
  leftBorder: {
    borderRadius: pxToDp(40),
    borderWidth: pxToDp(4),
    borderColor: "#DADFE6",
    width: "100%",
    height: pxToDp(166),
    ...padding_tool(30, 40, 30, 40),
  },
  leftLine: {
    width: pxToDp(4),
    height: pxToDp(20),
    backgroundColor: "#DADFE6",
  },
  leftTitle: {
    // ...appFont.fontFamily_jcyt_500,
    ...appFont.fontFamily_syst,
    fontSize: pxToDp(32),
    color: "#475266",
    lineHeight: pxToDp(40),
  },
  leftContent: {
    // ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(40),
    color: "#475266",
    lineHeight: pxToDp(50),
    ...appFont.fontFamily_syst_bold,
  },
  rightTitle: {
    fontSize: pxToDp(36),
    color: "#333",
    // ...fonts.fontFamily_jcyt_700,
    marginBottom: pxToDp(40),
    ...appFont.fontFamily_syst_bold,
  },
  rightBottom: {
    alignItems: "flex-end",
    paddingTop: pxToDp(20),
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
