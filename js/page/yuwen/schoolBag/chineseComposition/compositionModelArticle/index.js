import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Animated,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
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
import { appStyle, appFont } from "../../../../../theme";
import KnowledgeTreeModal from "../../../../../component/chinese/chineseCompositionExercise/KnowledgeTreeModal";
import RichShowView from "../../../../../component/chinese/newRichShowView";
import DropdownSelect from "../../../../../component/DropdownSelect";
import ArticleItem from "./articleItem";
import Btn from "../../../../../component/chinese/btn";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      rotateValue: new Animated.Value(0),
      isOpen: false,
      title: "",
      expanation: "",
      word: [],
      sentence: [],
      maxHeight: 0,
      autoHeight: 0,
      ischangeHeight: true,
      author: "",
      speMsg: {},
    };
    this.heightArr = [];
  }

  static navigationOptions = {
    // title:'答题'
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
    // this.props.navigation.goBack(this.props.navigation.state.params.data.homeKey)
  };

  componentDidMount() {
    this.getlist();
  }
  getlist = () => {
    axios
      .get(api.getChineseCompositionModelArticleDetail, {
        params: {
          c_id: this.props.navigation.state.params.data.c_id,
        },
      })
      .then((res) => {
        if (res.data?.err_code === 0) {
          let know = res.data.data.knowledge_point;
          console.log("数据", res.data.data);
          this.setState({
            list: res.data.data.sentence,
            title: res.data.data.name,
            expanation: res.data.data.knowledge_point_explanation,
            word: know[2] ? know[2] : [],
            sentence: know[3] ? know[3] : [],
            author: res.data.data.author,
            speMsg: res.data.data,
          });
        }
      });
  };
  overCreate = () => {};
  openStatistic(isOpennow) {
    // const { rotateValue } = this.state;
    // if (!isOpennow) {
    //     Animated.timing(rotateValue, {
    //         toValue: 0,
    //         useNativeDriver: true,
    //     }).start();
    //     this.setState({
    //         isOpen: true,
    //     });
    //     return;
    // }
    // Animated.timing(rotateValue, {
    //     toValue: 1,
    //     useNativeDriver: true,
    // }).start();
    // this.setState({
    //     isOpen: false,
    // });
    this.setState({
      isOpen: isOpennow,
    });
  }
  lookgood = (knowledge_type, knowledge_point) => {
    return;
    NavigationUtil.toCompositionLookKnowDetail({
      ...this.props,
      data: {
        knowledge_type,
        knowledge_point,
      },
    });
  };
  renderExplain = () => {
    const { list, isOpen, title, expanation, word, sentence, author, speMsg } =
      this.state;
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;

    if (!isOpen) return null;

    return (
      <View
        style={[
          appStyle.flexCenter,
          {
            width: windowWidth,
            height: windowHeight,
            position: "absolute",
            top: pxToDp(0),
            left: 0,
            ...appStyle.flexAliCenter,
          },
        ]}
      >
        <TouchableWithoutFeedback
          onPress={this.openStatistic.bind(this, false)}
        >
          <View style={[styles.click_region]}></View>
        </TouchableWithoutFeedback>
        <View style={[styles.statisticsMain]}>
          <TouchableOpacity
            onPress={() => this.openStatistic(false)}
            style={[styles.open]}
          >
            <View style={[styles.openInnder]}>
              <FontAwesome name={"close"} size={20} style={{ color: "#fff" }} />

              {/* <Text style={[{ fontSize: pxToDp(24), color: '#fff', }]}>X</Text> */}
            </View>
          </TouchableOpacity>

          <ScrollView>
            <RichShowView width={pxToDp(900)} value={expanation}></RichShowView>
            <View style={[{ paddingTop: pxToDp(40) }]}>
              <View
                style={[appStyle.flexLineWrap, { marginBottom: pxToDp(40) }]}
              >
                <Text style={[styles.wordTitle]}>好词:</Text>
                <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
                  {word.map((item, index) => {
                    return (
                      <TouchableOpacity
                        onPress={this.lookgood.bind(this, "2", item)}
                        style={[styles.wordWrap]}
                        key={index}
                      >
                        <Text
                          style={[
                            {
                              fontSize: pxToDp(32),
                              color: "#475266",
                            },
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View>
                <Text style={[styles.wordTitle]}>佳句:</Text>
                {sentence.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={this.lookgood.bind(this, "3", item)}
                      style={[styles.wordWrap]}
                      key={index}
                    >
                      <Text
                        key={index}
                        style={[
                          {
                            fontSize: pxToDp(32),
                            color: "#475266",
                          },
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
  render() {
    const { list, isOpen, title, expanation, word, sentence, author, speMsg } =
      this.state;
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
            appStyle.flexAliCenter,
            padding_tool(Platform.OS === "ios" ? 60 : 0, 30, 0, 30),
            { width: "100%", height: pxToDp(128) },
          ]}
        >
          {/* header */}
          <TouchableOpacity style={[size_tool(150, 80)]} onPress={this.goBack}>
            <Image
              source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
              style={[size_tool(120, 80)]}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text
            style={[
              { fontSize: pxToDp(40), color: "#475266" },
              appFont.fontFamily_syst_bold,
            ]}
          >
            {title}
            {author ? `(${author})` : ""}
          </Text>

          <TouchableOpacity
            onPress={() => this.openStatistic(true)}
            style={[
              size_tool(150, 80),
              { backgroundColor: "#fff", borderRadius: pxToDp(100) },
              appStyle.flexCenter,
            ]}
          >
            <Text
              style={[
                { fontSize: pxToDp(32), color: "#475266" },
                appFont.fontFamily_jcyt_700,
              ]}
            >
              解析
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[{ width: "100%", flex: 1, alignItems: "center" }]}>
          <View
            style={[
              appStyle.flexLineWrap,
              {
                marginTop: pxToDp(16),
                // height: maxHeight > 0 ? pxToDp(200) + maxHeight : "auto",
                width: "100%",
                flex: 1,
              },
            ]}
            // onLayout={this._onLayout}
          >
            {list.length > 0 ? (
              <ArticleItem list={list} speMsg={speMsg} />
            ) : null}
          </View>
        </View>
        {this.renderExplain()}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    position: "relative",
    backgroundColor: "#FFEFD7",
  },
  statisticsWrap: {
    width: pxToDp(1080),
    height: "100%",
    position: "absolute",
    top: pxToDp(0),
    right: pxToDp(-1100),
    // right: 0
  },
  statisticsMain: {
    width: pxToDp(1000),
    height: "100%",
    backgroundColor: "#fff",
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(20),
    paddingBottom: pxToDp(100),
    paddingTop: pxToDp(40),
    ...borderRadius_tool(32, 0, 0, 32),
    position: "absolute",
    right: pxToDp(0),
  },

  close: {
    // position: "absolute",
    // left: pxToDp(0),
    // top: pxToDp(280),
    width: pxToDp(80),
    height: pxToDp(56),
    borderTopRightRadius: pxToDp(49),
    borderBottomRightRadius: pxToDp(49),
    paddingRight: pxToDp(8),
    paddingBottom: pxToDp(4),
    zIndex: 9999,
  },
  speTxt: {
    fontSize: pxToDp(36),
    color: "#000",
    lineHeight: pxToDp(76),
  },
  wordWrap: {
    ...padding_tool(10, 20, 10, 20),
    fontSize: pxToDp(34),
    marginRight: pxToDp(10),
    borderRadius: pxToDp(40),
    marginBottom: pxToDp(8),
    backgroundColor: "#F5F5FA",
  },
  wordTitle: {
    color: "#8D99AE",
    fontSize: pxToDp(32),
    paddingBottom: pxToDp(20),
  },
  click_region: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(71, 82, 102, 0.5)",
  },
  open: {
    ...size_tool(80),
    backgroundColor: "#E56045",
    paddingBottom: pxToDp(6),
    borderRadius: pxToDp(80),
    position: "absolute",
    right: pxToDp(40),
    top: pxToDp(40),
    zIndex: 999,
  },
  openInnder: {
    flex: 1,
    ...appStyle.flexCenter,
    borderRadius: pxToDp(80),
    backgroundColor: "#FF884C",
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
