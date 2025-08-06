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
  DeviceEventEmitter,
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
} from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
import KnowledgeTreeModal from "../../../../../component/chinese/chineseCompositionExercise/KnowledgeTreeModal";
import ChineseMindMappingTree from "../../../../../component/chinese/chineseCompositionExercise/ChineseMindMappingAuto";
import { Modal, Toast } from "antd-mobile-rn";
import Btn from "../../../../../component/chinese/btn";
import * as purchaseCreators from "../../../../../action/yuwen/composition";

const listnow = {
  23: {
    children: ["96", "97", "98"],
    parent: "",
    text: "《记一次元旦晚会》",
    title: "",
  },
  96: {
    children: [],
    parent: "23",
    text: "开头",
    title: "",
  },
  97: {
    children: ["99", "100", "101"],
    parent: "23",
    text: "分写",
    title: "",
  },
  98: {
    children: ["XawzzEL8gaiwD8BGuDnq7C"],
    parent: "23",
    text: "结尾",
    title: "",
  },
  99: {
    children: [],
    parent: "97",
    text: "早上",
    title: "",
  },
  100: {
    children: [],
    parent: "97",
    text: "中午",
    title: "",
  },
  101: {
    children: [],
    parent: "97",
    text: "晚上",
    title: "",
  },
  XawzzEL8gaiwD8BGuDnq7C: {
    children: [],
    parent: "98",
    text: "真是令人难忘的元旦晚会啊！",
  },
};
// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: {},
      st_id: 0,
      isFinish: false,
      visible: false,
      msg: [],
      theme: "",
      islook: false,
    };
  }

  static navigationOptions = {
    // title:'答题'
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
    //
  };
  componentWillUnmount() {
    this.props.hasRecord === "1"
      ? DeviceEventEmitter.emit("compositionRecord")
      : DeviceEventEmitter.emit("compostitionHome");
  }

  componentDidMount() {
    this.props.navigation.state.params.data.isModel
      ? this.getModel()
      : this.getlist();
  }
  getModel = () => {
    axios
      .get(api.getChineseCompositionArticleOverMindMapNow, {
        params: {
          ...this.props.navigation.state.params.data,
        },
      })
      .then((res) => {
        if (res.data?.err_code === 0) {
          this.setState({
            // minmaplist: res.data.data.mind_maps,
            // isFinish: true
            list: res.data.data.mind_maps,
            theme: res.data.data.article_struct,
            islook: this.props.navigation.state.params.data.islookmap
              ? true
              : false,
          });
        }
      });
  };

  getlist = () => {
    axios
      .get(api.getChineseCompositionStructureAll, {
        params: {
          ...this.props.navigation.state.params.data,
        },
      })
      .then((res) => {
        if (res.data?.err_code === 0) {
          this.setState({
            // minmaplist: res.data.data.mind_maps,
            // isFinish: true
            list: res.data.data.mind_maps,
            theme: res.data.data.theme,
            islook: this.props.navigation.state.params.data.islookmap
              ? true
              : false,
          });
        }
      });
  };
  overCreate = () => {
    this.props.navigation.state.params.data.isModel
      ? axios
          .post(api.saveChineseCompositionArticleOverMindMapNow, {
            st_id: this.props.navigation.state.params.data.st_id,
            ar_map_id: this.props.navigation.state.params.data.ar_map_id,
          })
          .then((res) => {
            if (res.data?.err_code === 0) {
              // this.props.navigation.state.params.data.islookmap ?
              //     this.goBack() :
              this.props.navigation.goBack(
                this.props.navigation.state.params.data.homeKey
              );
            }
          })
      : axios
          .post(api.saveCompositionAllMsg, {
            st_id: this.props.navigation.state.params.data.st_id,
          })
          .then((res) => {
            if (res.data?.err_code === 0) {
              this.props.navigation.state.params.data.islookmap
                ? this.goBack()
                : this.props.navigation.goBack(
                    this.props.navigation.state.params.data.homeKey
                  );
            }
          });
  };
  lookModel = () => {
    NavigationUtil.toCompositionModelArticle({
      ...this.props,
      data: {
        ...this.props.navigation.state.params.data,
      },
    });
  };
  todoMore = () => {
    NavigationUtil.toCompositionWriteMindMap({
      ...this.props,
      data: {
        ...this.props.navigation.state.params.data,
        updata: () => {
          this.props.navigation.state.params.data.isModel
            ? this.getModel()
            : this.getlist(this.state.st_id);
        },
      },
    });
  };
  checkthis = (value) => {
    const { list } = this.state;
    let listnow = list[value].text.split("#");
    this.setState({
      msg: listnow,
      visible: true,
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    const { list, visible, msg, theme, islook } = this.state;
    // console.log("数据", list)
    return (
      <ImageBackground
        style={styles.wrap}
        source={require("../../../../../images/chineseHomepage/sentence/sentenceBg.png")}
        resizeMode="cover"
      >
        <View
          style={[
            appStyle.flexLine,
            appStyle.flexJusBetween,
            padding_tool(0, 64, 0, 64),
            { width: "100%", height: pxToDp(128) },
          ]}
        >
          {/* header */}
          <TouchableOpacity onPress={this.goBack}>
            <Image
              source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
              style={[size_tool(120, 80)]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text
            style={[
              appFont.fontFamily_jcyt_700,
              { fontSize: pxToDp(40), color: "#475266" },
            ]}
          >
            思维导图
          </Text>
          <TouchableOpacity
            onPress={this.overCreate.bind(this)}
            style={[
              appStyle.flexCenter,
              size_tool(144, 78),
              { borderRadius: pxToDp(200), backgroundColor: "#fff" },
            ]}
          >
            <Text
              style={[
                appFont.fontFamily_jcyt_700,
                { fontSize: pxToDp(32), color: "#475266" },
              ]}
            >
              退出
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            {
              flex: 1,
              marginBottom: pxToDp(20),
              paddingLeft: pxToDp(50),
              paddingBottom: pxToDp(0),
            },
            appStyle.flexCenter,
          ]}
        >
          {/* <View style={[appStyle.flexTopLine, appStyle.flexCenter,]}>
                        <Text style={[{ fontSize: pxToDp(40), paddingLeft: pxToDp(20), fontFamily: Platform.OS === 'ios' ? 'Muyao-Softbrush' : 'Muyao-Softbrush-2' }]}>
                            {this.props.navigation.state.params.data.isModel ? '结构：' : '中心思想:'}
                        </Text>
                        <Text style={[{ fontSize: pxToDp(40), paddingLeft: pxToDp(20), flex: 1 }, appFont.fontFamily_syst]}>{theme}</Text>
                    </View> */}

          {/* <KnowledgeTreeModal treeData={list} spanStyle={{ 'font-size': "32px" }} /> */}
          <ScrollView style={[{}]}>
            {JSON.stringify(list) === "{}" ? null : (
              <ChineseMindMappingTree
                mindmapping={list}
                _getData={this.checkthis.bind(this)}
              />
            )}
          </ScrollView>
          {/* <ChineseMindMappingTree mindmapping={listnow} _getData={this.checkthis.bind(this)} /> */}
        </View>

        {this.props.navigation.state.params.data.isModel ? null : (
          <Btn
            styleObj={{
              bgColor: "#16C792",
              bottomColor: "#13A97C",
              borderRadius: pxToDp(200),
              height: pxToDp(120),
              width: pxToDp(280),
            }}
            clickBtn={this.lookModel.bind(this)}
            txt={"查看范文"}
            otherStyle={{
              position: "absolute",
              bottom: pxToDp(100),
              right: pxToDp(100),
            }}
          />
        )}
        {islook ? (
          <Btn
            styleObj={{
              bgColor: "#fff",
              bottomColor: "#E7E7F2",
              borderRadius: pxToDp(200),
              height: pxToDp(120),
              width: pxToDp(280),
              fontColor: "#475266",
            }}
            clickBtn={this.todoMore.bind(this)}
            txt={"重新创作"}
            otherStyle={{
              position: "absolute",
              bottom: pxToDp(100),
              right: pxToDp(400),
            }}
          />
        ) : null}
        {/* </View> */}
        <Modal
          visible={visible}
          // visible={true}

          transparent={true}
          footer={[]}
          style={[
            {
              width: pxToDp(1540),
              padding: 0,
              backgroundColor: "rgba(0,0,0,0)",
            },
          ]}
          // closable
          // onClose={this.onClose}
        >
          <View
            style={[
              appStyle.flexAliCenter,
              { position: "relative" },
              padding_tool(70, 0, 100, 0),
            ]}
          >
            <Image
              style={[
                size_tool(1080, 140),
                { position: "absolute", top: pxToDp(10), zIndex: 999 },
              ]}
              source={require("../../../../../images/chineseHomepage/composition/minmapTitle.png")}
            />
            <View
              style={[
                {
                  width: pxToDp(1080),
                  backgroundColor: "#fff",
                  height: pxToDp(600),
                },
                padding_tool(50, 40, 100, 40),
                borderRadius_tool(80),
              ]}
            >
              <View
                style={[
                  {
                    flex: 1,
                    backgroundColor: "#F5F6FA",
                    borderRadius: pxToDp(40),
                    padding: pxToDp(40),
                  },
                ]}
              >
                <ScrollView>
                  {msg.map((item, index) => {
                    return (
                      <Text
                        style={[
                          { fontSize: pxToDp(32) },
                          appFont.fontFamily_syst,
                        ]}
                        key={index}
                      >
                        {"*" + item}
                      </Text>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
            {/* <TouchableOpacity style={[size_tool(60), { position: 'absolute', top: pxToDp(60), right: pxToDp(80) }]} onPress={this.onClose}></TouchableOpacity> */}
            <Btn
              styleObj={{
                bgColor: "#FF964A",
                bottomColor: "#F07C39",
                borderRadius: pxToDp(200),
                height: pxToDp(128),
                width: pxToDp(270),
              }}
              clickBtn={this.onClose.bind(this)}
              txt={"X"}
              otherStyle={{
                position: "absolute",
                bottom: pxToDp(40),
                zIndex: 999,
              }}
            />
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
    position: "relative",
    paddingTop: Platform.OS === "ios" ? pxToDp(40) : 0,
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
  newBtn: {
    position: "absolute",
    right: pxToDp(100),
    bottom: pxToDp(100),
    ...size_tool(280, 120),
    backgroundColor: "#E7E7F2",
    borderRadius: pxToDp(200),
    paddingBottom: pxToDp(8),
  },
  newBtnInner: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: pxToDp(200),
    ...appStyle.flexCenter,
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    hasRecord: state.getIn(["Compositon", "has_record"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
