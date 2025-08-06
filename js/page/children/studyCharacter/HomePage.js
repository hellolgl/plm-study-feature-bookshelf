import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Dimensions,
  Platform,
  ActivityIndicator,
  DeviceEventEmitter,
} from "react-native";
import { appFont, appStyle } from "../../../theme";
import { pxToDp, pxToDpHeight } from "../../../util/tools";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import NavigationUtil from "../../../navigator/NavigationUtil";
import Swiper from "react-native-swiper";
import Lottie from "lottie-react-native";
import FreeTag from "../../../component/FreeTag";
import { connect } from "react-redux";
import * as actionCreators from "../../../action/purchase";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CoinView from '../../../component/coinView'
import * as actionCreatorsDailyTask from "../../../action/dailyTask";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const bg_map = {
  0: require("../../../images/childrenStudyCharacter/1_01.jpg"),
  1: require("../../../images/childrenStudyCharacter/1_02.jpg"),
  2: require("../../../images/childrenStudyCharacter/1_03.jpg"),

  3: require("../../../images/childrenStudyCharacter/2_01.jpg"),
  4: require("../../../images/childrenStudyCharacter/2_02.jpg"),
  5: require("../../../images/childrenStudyCharacter/2_03.jpg"),

  6: require("../../../images/childrenStudyCharacter/3_01.jpg"),
  7: require("../../../images/childrenStudyCharacter/3_02.jpg"),
  8: require("../../../images/childrenStudyCharacter/3_03.jpg"),

  9: require("../../../images/childrenStudyCharacter/4_01.jpg"),
  10: require("../../../images/childrenStudyCharacter/4_02.jpg"),
  11: require("../../../images/childrenStudyCharacter/4_03.jpg"),

  12: require("../../../images/childrenStudyCharacter/5_01.jpg"),
  13: require("../../../images/childrenStudyCharacter/5_02.jpg"),
  14: require("../../../images/childrenStudyCharacter/5_03.jpg"),

  15: require("../../../images/childrenStudyCharacter/6_01.jpg"),
  16: require("../../../images/childrenStudyCharacter/6_02.jpg"),
  17: require("../../../images/childrenStudyCharacter/6_03.jpg"),

  18: require("../../../images/childrenStudyCharacter/7_01.jpg"),
  19: require("../../../images/childrenStudyCharacter/7_02.jpg"),
  20: require("../../../images/childrenStudyCharacter/7_03.jpg"),

  21: require("../../../images/childrenStudyCharacter/8_01.jpg"),
  22: require("../../../images/childrenStudyCharacter/8_02.jpg"),
  23: require("../../../images/childrenStudyCharacter/8_03.jpg"),

  24: require("../../../images/childrenStudyCharacter/8_01.jpg"),
  25: require("../../../images/childrenStudyCharacter/8_02.jpg"),
  26: require("../../../images/childrenStudyCharacter/8_03.jpg"),

  27: require("../../../images/childrenStudyCharacter/9_01.jpg"),
  28: require("../../../images/childrenStudyCharacter/9_02.jpg"),
  29: require("../../../images/childrenStudyCharacter/9_03.jpg"),

  30: require("../../../images/childrenStudyCharacter/10_01.jpg"),
  31: require("../../../images/childrenStudyCharacter/10_02.jpg"),
  32: require("../../../images/childrenStudyCharacter/10_03.png"),
};

const star_bg_map = {
  0: require("../../../images/childrenStudyCharacter/star_0_bg.png"),
  1: require("../../../images/childrenStudyCharacter/star_1_bg.png"),
  2: require("../../../images/childrenStudyCharacter/star_2_bg.png"),
  3: require("../../../images/childrenStudyCharacter/star_3_bg.png"),
};

class StudyCharacterHomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.eventListenerRefreshPage = undefined;
    this.total_page = 29;
    this.state = {
      list: [],
      page_index: 0,
      current_index: 0, //每页字的下标
      character_page_index: 0, //上一次点击的字所在页
      total_star: 0,
      loading: true,
      animation_value: new Animated.Value(0),
    };
  }

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  componentDidMount() {
    this.getData();
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "refreshPage",
      (event) => {
        this.getData();
      }
    );
  }

  componentWillUnmount() {
    this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
    this.props.getTaskData()
  }

  showProgress = (page_index) => {
    const { animation_value } = this.state;
    const one_cell_width = pxToDp(600) / this.total_page;
    let value = one_cell_width * (page_index + 1);
    Animated.timing(animation_value, {
      toValue: value,
      duration: 300,
      useNativeDriver: false,
    }).start(({ finished }) => {});
  };

  getData = () => {
    axios
      .get(api.getChildAllChar)
      .then(async (res) => {
        // console.log('****',res.data.data)
        const study_char = res.data.data.study_char;
        let { list, character_page_index, current_index } = this.splitArray(
          res.data.data.data,
          study_char
        );
        this.showProgress(character_page_index);
        const total_star = res.data.data.total_star;
        this.setState({
          list,
          total_star,
          character_page_index,
          page_index: character_page_index,
          current_index,
        });
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  splitArray = (array, study_char) => {
    const { char, word_level_id } = study_char;
    let newArray = [];
    let character_page_index = 0;
    let current_index = 0;
    for (let i = 0; i < array.length; i += 10) {
      let l = array.slice(i, i + 10);
      newArray.push(l);
      let arr = l.map((j, x) => {
        return j.knowledge_point;
      });
      if (
        arr.indexOf(char) !== -1 &&
        l[arr.indexOf(char)].word_level_id === word_level_id
      ) {
        // console.log('ooooo',arr,char,l[arr.indexOf(char)])
        let char_index = arr.indexOf(char);
        character_page_index = newArray.length - 1;
        current_index = char_index;
      }
    }
    return {
      list: newArray,
      character_page_index,
      current_index,
    };
  };

  onIndexChanged = (index) => {
    this.showProgress(index);
    this.setState({
      page_index: index,
    });
  };

  clickCharacter = (i, x, page, authority) => {
    if (!authority && page !== 0) {
      this.props.setVisible(true);
      return;
    }
    const { page_index } = this.state;
    this.setState(
      {
        current_index: x,
        character_page_index: page_index,
      },
      () => {
        NavigationUtil.toChildrenStudyCharacter({
          ...this.props,
          data: { bg: bg_map[page_index], ...i },
        });
      }
    );
  };

  renderCharacterContent = (page_data, page) => {
    const { current_index, character_page_index } = this.state;
    let authority = this.props.authority;
    return (
      <View style={[styles.character_wrap]}>
        {page_data.map((i, x) => {
          return (
            <View
              key={x}
              style={[
                x === 9 ? null : { marginRight: pxToDp(24) },
                appStyle.flexAliCenter,
              ]}
            >
              {current_index === x && character_page_index === page ? (
                <View style={[styles.avatar_wrap]}>
                  <Image
                    style={[styles.avatar]}
                    source={require("../../../images/children/pandaHead.png")}
                  ></Image>
                </View>
              ) : null}
              {page === 0 && !authority ? (
                <View
                  style={[
                    { position: "absolute", zIndex: 1, bottom: pxToDp(-20) },
                  ]}
                >
                  <FreeTag haveAllRadius={true}></FreeTag>
                </View>
              ) : null}
              <TouchableOpacity
                onPress={() => {
                  this.clickCharacter(i, x, page, authority);
                }}
              >
                <ImageBackground
                  style={[
                    { width: pxToDp(180), height: pxToDp(252) },
                    appStyle.flexCenter,
                  ]}
                  source={star_bg_map[i.star_num]}
                >
                  <Text
                    style={[
                      {
                        color: "#363D4C",
                        fontSize: pxToDp(32),
                        marginTop: pxToDp(20),
                      },
                      appFont.fontFamily_jcyt_500,
                      Platform.OS === "android"
                        ? { marginBottom: pxToDp(-30) }
                        : { marginBottom: pxToDp(20), lineHeight: pxToDp(40) },
                    ]}
                  >
                    {i.pinyin_2}
                  </Text>
                  <Text
                    style={[
                      { color: "#363D4C", fontSize: pxToDp(64) },
                      appFont.fontFamily_jcyt_700,
                    ]}
                  >
                    {i.knowledge_point}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };
  prevBtn = () => {
    return (
      <Image
        source={require("../../../images/childrenStudyCharacter/preBtn.png")}
        style={{
          width: pxToDp(265),
          height: pxToDp(203),
          right: pxToDp(-40),
          top: pxToDp(-80),
        }}
        resizeMode={"contain"}
      ></Image>
    );
  };

  nextBtn = () => {
    return (
      <Image
        source={require("../../../images/childrenStudyCharacter/nextBtn.png")}
        style={{
          width: pxToDp(265),
          height: pxToDp(203),
          right: pxToDp(34),
          top: pxToDp(-80),
        }}
        resizeMode={"contain"}
      ></Image>
    );
  };
  render() {
    const { list, page_index, total_star, loading, animation_value } =
      this.state;
    return (
      <View style={[styles.container]}>
        <TouchableOpacity style={[styles.back_btn]} onPress={this.goBack}>
          <Image
            style={[{ width: pxToDp(140), height: pxToDp(100) }]}
            source={require("../../../images/childrenStudyCharacter/back_btn_1.png")}
          ></Image>
        </TouchableOpacity>
        {loading ? (
          <ImageBackground
            style={[styles.bg, appStyle.flexCenter]}
            source={bg_map[0]}
          >
            <ActivityIndicator size="large" color="#4F99FF" />
          </ImageBackground>
        ) : (
          <>
            <View style={[styles.progrees_out]}>
              <Animated.View
                style={[
                  styles.progrees_inner,
                  {
                    width: animation_value,
                  },
                ]}
              ></Animated.View>
            </View>
            <View style={[styles.star_num_wrap]}>
              <Image
                style={[
                  {
                    width: pxToDp(60),
                    height: pxToDp(60),
                    marginRight: pxToDp(20),
                  },
                ]}
                source={require("../../../images/childrenStudyCharacter/star_2.png")}
              ></Image>
              <Text
                style={[
                  { color: "#FF8755", fontSize: pxToDp(36) },
                  appFont.fontFamily_jcyt_700,
                ]}
              >
                x{total_star}
              </Text>
            </View>
            {list.length > 0 ? (
              <Swiper
                prevButton={this.prevBtn()}
                nextButton={this.nextBtn()}
                showsButtons={true}
                showsPagination={false}
                height={windowHeight}
                index={page_index}
                loop={false}
                onIndexChanged={this.onIndexChanged}
              >
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[0]}>
                    {this.renderCharacterContent(list[0], 0)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[1]}>
                    {this.renderCharacterContent(list[1], 1)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[2]}>
                    {this.renderCharacterContent(list[2], 2)}
                  </ImageBackground>
                </View>

                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[3]}>
                    {this.renderCharacterContent(list[3], 3)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[4]}>
                    {this.renderCharacterContent(list[4], 4)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[5]}>
                    {this.renderCharacterContent(list[5], 5)}
                  </ImageBackground>
                </View>

                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[6]}>
                    {this.renderCharacterContent(list[6], 6)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[7]}>
                    {this.renderCharacterContent(list[7], 7)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[8]}>
                    {this.renderCharacterContent(list[8], 8)}
                  </ImageBackground>
                </View>

                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[9]}>
                    {this.renderCharacterContent(list[9], 9)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[10]}>
                    {this.renderCharacterContent(list[10], 10)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[11]}>
                    {this.renderCharacterContent(list[11], 11)}
                  </ImageBackground>
                </View>

                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[12]}>
                    {this.renderCharacterContent(list[12], 12)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[13]}>
                    {this.renderCharacterContent(list[13], 13)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[14]}>
                    {this.renderCharacterContent(list[14], 14)}
                  </ImageBackground>
                </View>

                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[15]}>
                    {this.renderCharacterContent(list[15], 15)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[16]}>
                    {this.renderCharacterContent(list[16], 16)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[17]}>
                    {this.renderCharacterContent(list[17], 17)}
                  </ImageBackground>
                </View>

                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[18]}>
                    {this.renderCharacterContent(list[18], 18)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[19]}>
                    {this.renderCharacterContent(list[19], 19)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[20]}>
                    {this.renderCharacterContent(list[20], 20)}
                  </ImageBackground>
                </View>

                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[21]}>
                    {this.renderCharacterContent(list[21], 21)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[22]}>
                    {this.renderCharacterContent(list[22], 22)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[23]}>
                    {this.renderCharacterContent(list[23], 23)}
                  </ImageBackground>
                </View>

                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[24]}>
                    {this.renderCharacterContent(list[24], 24)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[25]}>
                    {this.renderCharacterContent(list[25], 25)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[26]}>
                    {this.renderCharacterContent(list[26], 26)}
                  </ImageBackground>
                </View>

                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[27]}>
                    {this.renderCharacterContent(list[27], 27)}
                  </ImageBackground>
                </View>
                <View style={[styles.wrap]}>
                  <ImageBackground style={[styles.bg]} source={bg_map[28]}>
                    {this.renderCharacterContent(list[28], 28)}
                  </ImageBackground>
                </View>
              </Swiper>
            ) : (
              <ImageBackground
                style={[styles.bg, appStyle.flexCenter]}
                source={bg_map[0]}
              >
                <Text
                  style={[
                    { color: "#fff", fontSize: pxToDp(40) },
                    appFont.fontFamily_jcyt_500,
                  ]}
                >
                  暂无数据
                </Text>
              </ImageBackground>
            )}
          </>
        )}
        <CoinView></CoinView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  back_btn: {
    position: "absolute",
    top: Platform.OS === "android" ? pxToDp(20) : pxToDp(40),
    left: pxToDp(20),
    zIndex: 1,
  },
  item: {
    width: "100%",
    height: "100%",
  },
  wrap: {
    width: windowWidth,
    height: windowHeight,
    position: "relative",
  },
  bg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 0,
  },
  character_wrap: {
    ...appStyle.flexTopLine,
    ...appStyle.flexAliEnd,
    position: "absolute",
    bottom: pxToDp(132),
  },
  character: {
    width: pxToDp(100),
    height: pxToDp(100),
    backgroundColor: "pink",
    ...appStyle.flexCenter,
  },
  direction_bg: {
    width: pxToDp(52),
    height: pxToDp(252),
    position: "absolute",
    bottom: pxToDpHeight(132),
  },
  avatar_wrap: {
    width: pxToDp(140),
    height: pxToDp(140),
    borderRadius: pxToDp(70),
    backgroundColor: "#fff",
    ...appStyle.flexCenter,
    marginBottom: pxToDp(16),
  },
  avatar: {
    width: pxToDp(130),
    height: pxToDp(130),
  },
  star_num_wrap: {
    width: pxToDp(248),
    height: pxToDp(100),
    borderRadius: pxToDp(200),
    backgroundColor: "#fff",
    position: "absolute",
    top: Platform.OS === "android" ? pxToDp(20) : pxToDp(40),
    right: pxToDp(20),
    zIndex: 1,
    ...appStyle.flexLine,
    ...appStyle.flexCenter,
  },
  progrees_out: {
    width: pxToDp(600),
    height: pxToDp(8),
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: pxToDp(80),
    position: "absolute",
    bottom: pxToDp(30),
    zIndex: 999,
    left: windowWidth * 0.5 - pxToDp(300),
    overflow: "hidden",
  },
  progrees_inner: {
    height: pxToDp(8),
    backgroundColor: "#fff",
  },
});

const mapStateToProps = (state) => {
  return {
    authority: state.getIn(["userInfo", "selestModuleAuthority"]),
  };
};

const mapDispathToProps = (dispatch) => {
  // 存数据
  return {
    setVisible(data) {
      dispatch(actionCreators.setVisible(data));
    },
    getTaskData(data) {
      dispatch(actionCreatorsDailyTask.getTaskData(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispathToProps
)(StudyCharacterHomePage);
