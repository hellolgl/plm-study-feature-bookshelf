import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Platform,
  DeviceEventEmitter,
  Dimensions,
} from "react-native";
import { appStyle, appFont } from "../../../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  fontFamilyRestoreMargin,
  borderRadius_tool,
} from "../../../../../util/tools";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import Header from "../../../../../component/Header";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { Modal, Toast } from "antd-mobile-rn";

import AnswerStatisticsModal from "../../../../../component/chinese/sentence/staticsModal";
import Audio from "../../../../../util/audio";
import fonts from "../../../../../theme/fonts";
import pinyin from "../../../../../util/languageConfig/chinese/pinyin";
import PlayAudio from "../../../../../util/audio/playAudio";
import url from "../../../../../util/url";
import Sentence from "./sentence";
import SpeSentence from "./sentence/speSentence";

class LookAllExerciseHome extends PureComponent {
  constructor(props) {
    super(props);
    const data = this.props.navigation.state.params.data;

    this.state = {
      list: [],
      statuslist: [],
      listindex: 0,
      start_time: null,
      type: data.type,
      inspect_name: data.inspect_name,
      name: data.name,
    };
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    this.grade_term = userInfoJs.checkGrade;
    this.info = userInfoJs;
    this.se_id = props.navigation.state.params.data.se_id;
  }
  componentDidMount() {
    this.getlist();
  }

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };
  componentWillUnmount() {}

  getlist = () => {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    let infoData = this.props.navigation.state.params.data;
    let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam;
    let obj = {
      grade_term,
      iid: infoData.se_id,
      name: infoData.name,
      pName: "智能造句",
    };
    infoData.inspect_name !== "智能造句"
      ? axios.get(api.errorSentenceStem + "/" + this.se_id).then((res) => {
          console.log("请求", res.data);
          const data = res.data.data;
          this.setState({
            list: [data],
          });
        })
      : axios
          .get(`${api.getChinesSenTopic}/${infoData.se_id}`, { params: obj })
          .then((res) => {
            // console.log('请求1231231', res.data)
            const data = res.data.data;
            this.setState({
              list: data,
            });
          });
  };

  saveExercise = () => {};

  render() {
    const { list, statuslist, listindex, type, name } = this.state;

    return (
      <ImageBackground
        source={require("../../../../../images/chineseHomepage/sentence/sentenceBg.png")}
        style={[
          { flex: 1 },
          padding_tool(Platform.OS === "ios" ? 60 : 20, 20, 20, 20),
        ]}
        resizeMode="cover"
      >
        <TouchableOpacity
          onPress={this.goBack}
          style={[
            {
              position: "absolute",
              top: pxToDp(48),
              left: pxToDp(20),
              zIndex: 99999,
            },
          ]}
        >
          <Image
            source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
            style={[size_tool(120, 80)]}
          />
        </TouchableOpacity>
        <View
          style={[
            appStyle.flexTopLine,
            appStyle.flexCenter,
            { height: pxToDp(140) },
          ]}
        >
          {statuslist.map((item, index) => {
            return (
              <View
                key={index}
                style={[
                  size_tool(72),
                  appStyle.flexCenter,
                  borderRadius_tool(100),
                  {
                    borderWidth: pxToDp(6),
                    borderColor:
                      index === listindex ? "#FF964A" : "transparent",
                    backgroundColor:
                      item === "right"
                        ? "#16C792"
                        : item === "wrong"
                        ? "#F2645B"
                        : "transparent",
                    marginRight: pxToDp(
                      index === statuslist.length - 1 ? 0 : 24
                    ),
                  },
                ]}
              >
                <Text
                  style={[
                    { fontSize: pxToDp(36), color: item ? "#fff" : "#475266" },
                    fonts.fontFamily_jcyt_700,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={[{ flex: 1 }, padding_tool(0, 80, 20, 80)]}>
          {list.length > 0 ? (
            type === "Ai" && (name === "句型训练" || name === "文化积累") ? (
              <SpeSentence
                isWrong={true}
                exercise={list[listindex]}
                saveExercise={this.saveExercise}
              />
            ) : (
              <Sentence
                isWrong={true}
                exercise={list[listindex]}
                saveExercise={this.saveExercise}
                type={type}
              />
            )
          ) : null}
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
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

export default connect(mapStateToProps, mapDispathToProps)(LookAllExerciseHome);
