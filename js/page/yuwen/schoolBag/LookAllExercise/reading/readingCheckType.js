import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { appStyle } from "../../../../../theme";
import {
  size_tool,
  pxToDp,
  borderRadius_tool,
} from "../../../../../util/tools";
import { connect } from "react-redux";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import api from "../../../../../util/http/api";
import axios from "../../../../../util/http/axios";

const img_map = {
  1: require("../../../../../images/readingHomePage_bg1.png"),
  2: require("../../../../../images/readingHomePage_bg2.png"),
  3: require("../../../../../images/readingHomePage_bg3.png"),
};

const img_active_map = {
  1: require("../../../../../images/readingHomePage_bg1_active.png"),
  2: require("../../../../../images/readingHomePage_bg2_active.png"),
  3: require("../../../../../images/readingHomePage_bg3_active.png"),
};

class Reading extends PureComponent {
  constructor(props) {
    super(props);
    console.log(props.userInfo.toJS());
    this.info = this.props.userInfo.toJS();
    this.grade = this.info.grade;
    this.term = this.info.term;
    this.state = {
      allList: [],
      lefList: [],
      rightList: [],
      currentIndex: 0,
    };
  }
  componentDidMount() {
    this.getlist();
  }
  getlist = () => {
    const { currentIndex } = this.state;

    axios
      .get(api.getChineseAllArticleType, {
        params: {
          grade_code: this.info.checkGrade,
          term_code: this.info.checkTeam,
        },
      })
      .then((res) => {
        if (res.data.err_code === 0) {
          const data = JSON.parse(JSON.stringify(res.data.data));
          console.log("题材", data);
          let lefList = [];
          let rightList = data[currentIndex].son_type;
          data.forEach((i, index) => {
            let type = "";
            let img = "";
            let activeImg = "";
            if (i.name === "现代文阅读理解") type = 1;
            if (i.name === "古诗文阅读理解") type = 2;
            if (i.name === "其他文体阅读理解") type = 3;
            img = img_map[type];
            activeImg = img_active_map[type];
            lefList.push({
              name: i.name,
              type,
              img,
              activeImg,
              isActive: index === currentIndex ? true : false,
            });
          });
          this.setState({
            allList: data,
            lefList,
            rightList,
          });
        }
      });
  };
  goBack = () => {
    NavigationUtil.goBack(this.props);
  };
  clickType = (item, index) => {
    const { lefList, allList } = this.state;
    let _lefList = JSON.parse(JSON.stringify(lefList));
    _lefList.forEach((childe) => {
      childe.isActive = false;
      if (childe.name === item.name) childe.isActive = true;
    });
    let fathetArr = allList.filter((child) => {
      return child.name === item.name;
    });
    this.setState({
      currentIndex: index,
      lefList: _lefList,
      rightList: fathetArr[0].son_type,
    });
  };
  clickDoExcersiz = (item, index) => {
    const { currentIndex, allList } = this.state;
    let article_category = item.name;
    let article_type = allList[currentIndex].name;
    console.log("选择", item),
      NavigationUtil.toChineseLookAllReadingExerciseCheckArticle({
        ...this.props,
        data: {
          article_category,
          article_type,
          ...item,
          updata: () => {
            this.getlist();
          },
        },
      });
  };

  render() {
    const { allList, lefList, rightList } = this.state;
    // console.log('______________________',allList,lefList,rightList)
    return (
      <ImageBackground
        style={{ width: "100%", height: "100%" }}
        source={require("../../../../../images/englishHomepage/checkUnitBg.png")}
      >
        <View style={[styles.header, appStyle.flexCenter]}>
          <TouchableOpacity
            onPress={this.goBack}
            style={{ position: "absolute", top: pxToDp(32), left: pxToDp(64) }}
          >
            <Image
              style={{ width: pxToDp(80), height: pxToDp(80) }}
              source={require("../../../../../images/reding_back_icon.png")}
              resizeMode={"contain"}
            ></Image>
          </TouchableOpacity>
          <ImageBackground
            style={[
              { width: pxToDp(500), height: pxToDp(141) },
              appStyle.flexCenter,
            ]}
            source={require("../../../../../images/reading_head.png")}
          >
            <Text
              style={{
                fontSize: pxToDp(36),
                color: "#fff",
                fontWeight: "bold",
                marginTop: pxToDp(20),
              }}
            >
              阅读理解-{this.grade}
              {this.term}
            </Text>
          </ImageBackground>
        </View>

        {allList.length > 0 ? (
          <View style={[styles.content, appStyle.flexLine]}>
            <View
              style={[
                styles.left,
                appStyle.flexAliCenter,
                appStyle.flexJusBetween,
              ]}
            >
              {lefList.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      this.clickType(item, index);
                    }}
                  >
                    <ImageBackground
                      style={{
                        width: pxToDp(228),
                        height: pxToDp(270),
                        paddingTop: pxToDp(32),
                        paddingLeft: pxToDp(32),
                      }}
                      source={item.isActive ? item.activeImg : item.img}
                      resizeMode={"contain"}
                    ></ImageBackground>
                  </TouchableOpacity>
                );
              })}
            </View>
            <ScrollView
              style={[styles.right]}
              contentContainerStyle={[
                appStyle.flexTopLine,
                appStyle.flexLineWrap,
              ]}
            >
              {rightList && rightList.length > 0
                ? rightList.map((item, index) => {
                    return (
                      <View
                        style={[
                          styles.rightItem,
                          index % 2 !== 0 ? { marginRight: 0 } : null,
                          appStyle.flexJusBetween,
                        ]}
                        key={index}
                      >
                        <View style={[appStyle.flexLine]}>
                          <Text style={[styles.numCircle]}>{index + 1}</Text>
                          <Text style={[{ fontSize: pxToDp(40) }]}>
                            {item.name}
                          </Text>
                        </View>
                        <View style={[appStyle.flexTopLine, appStyle.flexEnd]}>
                          <View style={[appStyle.flexLine]}>
                            <TouchableOpacity
                              style={[
                                styles.btn1,
                                styles.btn2,
                                appStyle.flexCenter,
                              ]}
                              onPress={() => {
                                this.clickDoExcersiz(item, index);
                              }}
                            >
                              <Text
                                style={[
                                  { fontSize: pxToDp(28), color: "#fff" },
                                ]}
                              >
                                {
                                  "查看文章"
                                  // '开始答题'
                                }
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  })
                : null}
            </ScrollView>
          </View>
        ) : null}
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    height: pxToDp(141),
    position: "relative",
    marginBottom: pxToDp(27),
  },
  content: {
    padding: pxToDp(40),
    paddingTop: 0,
    flex: 1,
  },
  left: {
    backgroundColor: "#FFF1DE",
    width: pxToDp(286),
    height: "100%",
    borderRadius: pxToDp(32),
    padding: pxToDp(32),
  },
  right: {
    flex: 1,
    height: "100%",
    marginLeft: pxToDp(40),
  },
  rightItem: {
    width: pxToDp(800),
    height: pxToDp(290),
    backgroundColor: "#fff",
    marginRight: pxToDp(40),
    marginBottom: pxToDp(40),
    borderRadius: pxToDp(32),
    padding: pxToDp(32),
    paddingTop: pxToDp(55),
  },
  numCircle: {
    width: pxToDp(80),
    height: pxToDp(80),
    borderRadius: pxToDp(40),
    backgroundColor: "#FBF6E8",
    textAlign: "center",
    lineHeight: pxToDp(80),
    fontSize: pxToDp(40),
    color: "#A86A33",
    marginRight: pxToDp(32),
  },
  btn1: {
    width: pxToDp(152),
    height: pxToDp(60),
    borderRadius: pxToDp(16),
    backgroundColor: "#E2E2E2",
  },
  btn2: {
    backgroundColor: "#A86A33",
    marginLeft: pxToDp(32),
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

export default connect(mapStateToProps, mapDispathToProps)(Reading);
