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
import RichShowView from "../../../../../component/chinese/newRichShowView";
import ChineseCompositionExercise from "../../../../../component/chinese/chineseCompositionExercise";
import MsgModal from "../../../../../component/chinese/sentence/msgModal";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CheckCenter from "../compositionWriteCheckCenter";
import Audio from "../../../../../util/audio/audio";
import url from "../../../../../util/url";

// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      typelist: [],
      type: 0,
      es_id: 0,
      titlelist: ["写作技法", "作文审题", "作文创作"],
      typeDetail: this.props.navigation.state.params.data.stem,
      exercise: {
        exercise: [],
      },
      c_id: this.props.navigation.state.params.data.c_id,
      lookMsg: false,
      msg: this.props.navigation.state.params.data.stem.stem,
    };
  }

  static navigationOptions = {
    // title:'答题'
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  componentDidMount() {
    let data = this.props.navigation.state.params.data;
    console.log("data", data);
    //
    if (data.isUnit) {
      // this.checkType({ stem: data })
    }
  }
  getexercise = () => {
    const { token } = this.props;
    if (!token) {
      NavigationUtil.resetToLogin(this.props);
      return;
    }

    const { typeDetail } = this.state;
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = {};
    data.grade_code = userInfoJs.checkGrade;
    data.c_id = this.props.navigation.state.params.data.c_id;
    console.log("typeDetail", typeDetail, data);
    axios
      .get(api.getchineseCompositionArticleExercise, {
        params: {
          es_id: typeDetail.es_id,
          // es_id: 11,
          ...data,
        },
      })
      .then((res) => {
        console.log("res", res.data);
        if (res.data?.err_code === 0) {
          this.setState({
            exercise: res.data.data,
            type: 1,
            c_id: this.props.navigation.state.params.data.c_id,
          });
        }
      });
  };

  renderTypedetail2 = () => {
    const { typeDetail } = this.state;
    return (
      <View
        style={[
          appStyle.flexCenter,
          padding_tool(0, 80, 0, 80),
          { flex: 1, width: "100%" },
        ]}
      >
        <View
          style={[
            {
              width: "100%",
              borderRadius: pxToDp(24),
              backgroundColor: "#fff",
              // height: pxToDp(900),
              padding: pxToDp(20),
              marginBottom: pxToDp(60),
              alignItems: "center",
              flex: 1,
            },
          ]}
        >
          <ScrollView style={{ flex: 1, width: "100%" }}>
            {typeDetail.technique_audio ? (
              <Audio
                audioUri={`${url.baseURL}${typeDetail.technique_audio}`}
                pausedBtnImg={require("../../../../../images/audio/audioPlay.png")}
                pausedBtnStyle={{
                  width: pxToDp(198),
                  height: pxToDp(95),
                }}
                playBtnImg={require("../../../../../images/audio/audioPause.png")}
                playBtnStyle={{
                  width: pxToDp(198),
                  height: pxToDp(95),
                }}
                // rate={0.75}
              >
                <RichShowView
                  width={pxToDp(1800)}
                  value={typeDetail.stem_technique}
                ></RichShowView>
              </Audio>
            ) : (
              <RichShowView
                width={pxToDp(1800)}
                value={typeDetail.stem_technique}
              ></RichShowView>
            )}
          </ScrollView>
          <View style={[appStyle.flexAliEnd, { width: "100%" }]}>
            <TouchableOpacity
              onPress={this.getexercise.bind(this)}
              style={[
                size_tool(240, 120),
                {
                  backgroundColor: "#F07C39",
                  borderRadius: pxToDp(200),
                  paddingBottom: pxToDp(8),
                },
              ]}
            >
              <View
                style={[
                  {
                    flex: 1,
                    borderRadius: pxToDp(100),
                    backgroundColor: "#FF964A",
                  },
                  appStyle.flexCenter,
                ]}
              >
                <Text
                  style={[
                    { fontSize: pxToDp(40), color: "#fff" },
                    appFont.fontFamily_jcyt_700,
                  ]}
                >
                  下一步
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  renderTitle1 = () => {
    const { titlelist, type } = this.state;

    return (
      <View style={[appStyle.flexTopLine, appStyle.flexCenter, { flex: 1 }]}>
        {titlelist.map((item, index) => {
          let isDeep = type === index;
          let isold = type > index;
          return (
            <View
              key={index}
              style={[appStyle.flexAliCenter, appStyle.flexTopLine]}
            >
              <View
                style={[
                  {
                    borderRadius: pxToDp(100),
                    borderColor: isDeep ? "#475266" : "rgba(71,82,102,0.1)",
                    borderWidth: pxToDp(4),
                    padding: pxToDp(16),
                  },
                  isDeep ? { backgroundColor: "#475266" } : "",
                  size_tool(232, 72),
                  appStyle.flexAliCenter,
                  appStyle.flexTopLine,
                  isold ? { borderWidth: 0, backgroundColor: "#8D99AE" } : {},
                ]}
              >
                <View
                  style={[
                    size_tool(40),
                    {
                      borderWidth: pxToDp(4),
                      borderColor: isDeep || isold ? "#fff" : "#475266",
                      borderRadius: pxToDp(40),
                    },
                    isold ? { backgroundColor: "#fff" } : "",
                    appStyle.flexCenter,
                  ]}
                >
                  {isold ? (
                    <FontAwesome
                      name={"check"}
                      size={16}
                      style={{ color: "#8D99AE" }}
                    />
                  ) : null}
                </View>
                <Text
                  style={[
                    {
                      fontSize: pxToDp(28),
                      color: isDeep || isold ? "#fff" : "#475266",
                      textAlign: "center",
                      flex: 1,
                    },
                    appFont.fontFamily_jcyt_500,
                  ]}
                >
                  {item}
                </Text>
              </View>
              {index < 2 ? (
                <View
                  style={[size_tool(80, 4), { backgroundColor: "#8D99AE" }]}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    );
  };
  doneExercise = () => {
    // 做完习题
    // NavigationUtil.toCompositionWriteChecCenter({
    //     ...this.props,
    //     data: {
    //         ...this.state.typeDetail,
    //         homeKey: this.props.navigation.state.key
    //     }
    // })
    this.setState({
      type: 2,
    });
  };
  render() {
    const { type, lookMsg, typeDetail } = this.state;
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
            padding_tool(0, 30, 0, 30),
            { width: "100%", height: pxToDp(128) },
          ]}
        >
          {/* header */}
          <TouchableOpacity style={[size_tool(208, 80)]} onPress={this.goBack}>
            <Image
              source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
              style={[size_tool(120, 80)]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {this.renderTitle1()}

          <TouchableOpacity
            onPress={() => this.setState({ lookMsg: true })}
            style={[
              size_tool(208, 80),
              { backgroundColor: "#fff", borderRadius: pxToDp(100) },
              appStyle.flexCenter,
            ]}
          >
            <Text
              style={[
                { fontSize: pxToDp(32), color: "#475266", fontWeight: "bold" },
              ]}
            >
              查看题目
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            {
              flex: 1,
              width: "100%",
            },
            appStyle.flexCenter,
          ]}
        >
          {/* 命题 */}

          {type === 0 ? this.renderTypedetail2() : null}

          {type === 1 && this.state.exercise.exercise.length > 0 ? (
            <ChineseCompositionExercise
              exercise={this.state.exercise}
              c_id={this.state.c_id}
              doneExercise={this.doneExercise}
            />
          ) : null}
          {type === 2 ? (
            <CheckCenter
              {...this.props}
              es_id={typeDetail.es_id}
              typeDetail={typeDetail}
              homeKey={this.props.navigation.state.params.data.homeKey}
            />
          ) : null}
        </View>
        <MsgModal
          btnText="好的"
          todo={() => this.setState({ lookMsg: false })}
          visible={lookMsg}
          title="题干"
          msg={typeDetail.stem}
          isHtml={true}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? pxToDp(60) : 0,
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
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    token: state.getIn(["userInfo", "token"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
