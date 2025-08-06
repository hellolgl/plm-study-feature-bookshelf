import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from "react-native";
import { size_tool, pxToDp, padding_tool } from "../../../util/tools";
import { appStyle } from "../../../theme";
import NavigationUtil from "../../../navigator/NavigationUtil";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import { connect } from "react-redux";
import CircleStatistcs from "../../../component/circleStatistcs";

class ChooseTextbook extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: "word",
      staticsObj: {},
    };
  }
  componentDidMount() {
    this.getStatics();
  }
  getStatics = () => {
    axios
      .get(api.getEnglishMyStudyStatics, {
        params: {
          origin: this.props.navigation.state.params.data.origin,
        },
      })
      .then((res) => {
        if (res.data.err_code === 0) {
          console.log("数据", res.data.data);
          this.setState({
            staticsObj: res.data.data,
          });
        }
      });
  };
  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  checkType = (type) => {
    let pageType = this.props.navigation.state.params.data.mode;
    let kpg_type = type === "word" ? 1 : 2;
    if (pageType === 1) {
      // 选知识点
      type === "word"
        ? NavigationUtil.toEnglishChooseKnowledge({
            ...this.props,
            data: {
              ...this.props.navigation.state.params.data,
              kpg_type,
              updata: () => {
                this.getStatics();
              },
            },
          })
        : NavigationUtil.toEnglishChooseKnowledgeSentence({
            ...this.props,
            data: {
              ...this.props.navigation.state.params.data,
              kpg_type,
              updata: () => {
                this.getStatics();
              },
            },
          });
    } else {
      // 直接做题
      NavigationUtil.toSynchronizeDiagnosisEn({
        ...this.props,
        data: {
          ...this.props.navigation.state.params.data,
          kpg_type,
          updata: () => {
            this.getStatics();
          },
        },
      });
    }
  };
  renderStudy() {
    const { staticsObj } = this.state;
    return (
      <View
        style={[
          { flex: 1 },
          appStyle.flexTopLine,
          appStyle.flexJusBetween,
          padding_tool(70, 80, 0, 80),
        ]}
      >
        <ImageBackground
          source={require("../../../images/englishHomepage/englishCheckTypeBg.png")}
          style={[
            size_tool(886, 770),
            padding_tool(30, 102, 128, 102),
            {
              position: "relative",
              alignItems: "center",
            },
          ]}
        >
          <Text
            style={{
              fontSize: pxToDp(48),
              color: "#FFFFFD",
              fontWeight: "bold",
              marginBottom: pxToDp(52),
              paddingLeft: pxToDp(20),
            }}
          >
            Learn New Words
          </Text>
          <View
            style={[
              size_tool(672, 352),
              appStyle.flexTopLine,
              appStyle.flexJusBetween,
              appStyle.flexAliCenter,
              padding_tool(0, 35, 0, 35),
              {
                backgroundColor: "#FFFFFD",
                marginBottom: pxToDp(21),
              },
            ]}
          >
            {staticsObj["1"] ? (
              <CircleStatistcs
                total={staticsObj["1"].total}
                right={Number(staticsObj["1"].correct_rate)}
                width={24}
                tintColor={"#77D102"}
                backgroundColor={"#FFEDCD"}
                textColor={"#77D102"}
                textColor1={"#AAAAAA"}
              />
            ) : null}
            <View style={[appStyle.flexAliCenter]}>
              <Text style={{ fontSize: pxToDp(68), color: "#77D102" }}>
                {staticsObj["1"]?.correct_rate}%
              </Text>
              <Text style={{ fontSize: pxToDp(28), color: "#AAAAAA" }}>
                Correct
              </Text>
            </View>
            <View style={[appStyle.flexAliCenter]}>
              <Text style={{ color: "#77D102", fontSize: pxToDp(64) }}>
                {staticsObj["1"]?.correct}
              </Text>
              <Text style={{ fontSize: pxToDp(28), color: "#AAAAAA" }}>
                Correct
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={this.checkType.bind(this, "word")}>
            <Image
              style={[size_tool(248, 88)]}
              source={require("../../../images/englishHomepage/englishStudyCHeckType.png")}
            />
          </TouchableOpacity>
        </ImageBackground>
        <ImageBackground
          source={require("../../../images/englishHomepage/englishCheckTypeBg1.png")}
          style={[
            size_tool(886, 770),
            padding_tool(30, 102, 128, 102),
            {
              position: "relative",
              alignItems: "center",
            },
          ]}
        >
          <Text
            style={{
              fontSize: pxToDp(48),
              color: "#A65902",
              fontWeight: "bold",
              marginBottom: pxToDp(52),
              paddingLeft: pxToDp(20),
            }}
          >
            Express Myself
          </Text>
          <View
            style={[
              size_tool(672, 352),
              appStyle.flexTopLine,
              appStyle.flexJusBetween,
              appStyle.flexAliCenter,
              padding_tool(0, 35, 0, 35),
              {
                backgroundColor: "#FFFFFD",
                marginBottom: pxToDp(21),
              },
            ]}
          >
            {staticsObj["2"] ? (
              <CircleStatistcs
                total={staticsObj["2"].total}
                right={Number(staticsObj["2"].correct_rate)}
                width={24}
                tintColor={"#77D102"}
                backgroundColor={"#FFEDCD"}
                textColor={"#77D102"}
                textColor1={"#AAAAAA"}
              />
            ) : null}
            <View style={[appStyle.flexAliCenter]}>
              <Text style={{ fontSize: pxToDp(68), color: "#77D102" }}>
                {staticsObj["2"]?.correct_rate}%
              </Text>
              <Text style={{ fontSize: pxToDp(28), color: "#AAAAAA" }}>
                Correct
              </Text>
            </View>
            <View style={[appStyle.flexAliCenter]}>
              <Text style={{ color: "#77D102", fontSize: pxToDp(64) }}>
                {staticsObj["2"]?.correct}
              </Text>
              <Text style={{ fontSize: pxToDp(28), color: "#AAAAAA" }}>
                Correct
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={this.checkType.bind(this, "sentence")}>
            <Image
              style={[size_tool(248, 88)]}
              source={require("../../../images/englishHomepage/englishStudyCHeckType.png")}
            />
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  }
  render() {
    return (
      <ImageBackground
        style={[styles.container]}
        source={require("../../../images/englishHomepage/checkUnitBg.png")}
      >
        {Platform.OS === "ios" ? (
          <View style={[{ marginTop: pxToDp(40) }]}></View>
        ) : (
          <></>
        )}
        <View
          style={[
            padding_tool(
              this.props.navigation.state.params.data.mode === 1 ? 0 : 49,
              80,
              0,
              80
            ),
            styles.header,
          ]}
        >
          <TouchableOpacity
            onPress={this.goBack.bind(this)}
            style={{
              paddingTop:
                this.props.navigation.state.params.data.pageType === 1
                  ? pxToDp(54)
                  : pxToDp(6),
            }}
          >
            <Image
              style={[size_tool(80)]}
              source={require("../../../images/englishHomepage/wordHelpBack.png")}
            />
          </TouchableOpacity>
          {this.props.navigation.state.params.data.mode === 1 ? null : (
            <ImageBackground
              style={[
                size_tool(523, 97),
                { justifyContent: "center", alignItems: "center" },
              ]}
              source={require("../../../images/englishHomepage/testmeTitle.png")}
            >
              <Text
                style={{
                  fontSize: pxToDp(40),
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                Let's Check/Test Me
              </Text>
            </ImageBackground>
          )}
          <Text style={{ width: pxToDp(200), height: pxToDp(98) }}></Text>
        </View>
        {Platform.OS === "ios" ? (
          <View style={[{ marginTop: pxToDp(150) }]}></View>
        ) : (
          <></>
        )}
        {this.renderStudy()}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confirm: {
    position: "absolute",
    width: pxToDp(192),
    height: pxToDp(60),
    backgroundColor: "#35D37D",
    bottom: pxToDp(90),
    borderRadius: pxToDp(32),
  },
  header: {
    height: pxToDp(174),
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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

export default connect(mapStateToProps, mapDispathToProps)(ChooseTextbook);
