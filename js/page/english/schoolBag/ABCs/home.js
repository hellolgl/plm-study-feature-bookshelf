import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  DeviceEventEmitter,
} from "react-native";
import {
  size_tool,
  pxToDp,
  padding_tool,
  getGradeInfo,
} from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { appFont, appStyle } from "../../../../theme";
import * as actionCreators from "../../../../action/purchase/index";
import CoinView from '../../../../component/coinView'
import * as actionCreatorsDailyTask from "../../../../action/dailyTask";
class SelectUnitEn extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      unitList: [
        {
          text: "First Letters",
          key: "english_toEnglishAbcsTree",
          havethis: true,
          img: require("../../../../images/english/abcs/homeBtn2.png"),
        },
        {
          text: "Mix & Match",
          key: "english_toEnglishAbcsMix",
          havethis: true,
          img: require("../../../../images/english/abcs/homeBtn1.png"),
        },
        // {
        //     text: `Let's Write`,
        //     // key: 'english_toEnglishAbcsWrite',
        //     havethis: false,
        // },
      ],
    };
  }

  componentWillUnmount() {
    this.props.getTaskData()
  }

  goBack() {
    NavigationUtil.goBack(this.props);
  }

  goEnglishSchoolHome = (index, authority) => {
    if (!authority) {
      this.props.setVisible(true);
      return;
    }

    let { unitList } = this.state;
    if (!unitList[index].havethis) return;
    console.log("will render here.....: ", index);
    switch (index) {
      case 0:
        // 同步
        NavigationUtil.toEnglishAbcsTree(this.props);
        break;
      case 1:
        // 连线题
        NavigationUtil.toMatchDoExercise({
          ...this.props,
          data: {
            origin: "032001000000",
            unit_name: "Alphabet",
            unit: "00",
          },
        });
        break;
      case 2:
        // 手写 题
        // NavigationUtil.toMatchDoExercise({
        //     ...this.props,
        //     data: {
        //         origin: '032001000000',
        //         unit_name: 'Alphabet',
        //         unit: '00',
        //     },
        // });
        break;
      default:
        break;
    }
  };
  render() {
    const { unitList } = this.state;
    const authority = this.props.authority;
    return (
      <ImageBackground
        style={[{ flex: 1, position: "relative" }]}
        source={require("../../../../images/english/abcs/homeBg.png")}
        resizeMode="cover"
      >
        {/* {Platform.OS === "ios" ? <View style={[{ marginTop: pxToDp(20) }]}></View> : <></>} */}
        <ImageBackground
          source={require("../../../../images/english/abcs/homeTitleBg.png")}
          // resizeMode='cover'
          style={[padding_tool(0, 40, 20, 40), styles.header]}
        >
          <TouchableOpacity onPress={this.goBack.bind(this)}>
            <Image
              style={[size_tool(120, 80)]}
              source={require("../../../../images/chineseHomepage/pingyin/new/back.png")}
            />
          </TouchableOpacity>
          <Text
            style={[
              { fontSize: pxToDp(60), color: "#39334C" },
              appFont.fontFamily_jcyt_700,
            ]}
          >
            ABCs
          </Text>
          <Text style={[size_tool(80)]}></Text>
        </ImageBackground>
        {/* {Platform.OS === "ios" ? <View style={[{ marginTop: pxToDp(100) }]}></View> : <></>} */}
        <View
          style={[
            padding_tool(Platform.OS === "ios" ? 231 : 100, 366, 148, 366),
            { width: "100%", flex: 1, flexDirection: "row", flexWrap: "wrap" },
            appStyle.flexJusBetween,
          ]}
        >
          {unitList.map((item, index) => {
            return (
              <TouchableOpacity
                style={[
                  styles.rightItem,
                  { marginBottom: index < 4 ? pxToDp(30) : 0 },
                ]}
                key={index}
                onPress={this.goEnglishSchoolHome.bind(
                  this,
                  index,
                  index === 0 || authority
                )}
              >
                <ImageBackground
                  style={[
                    size_tool(460, 314),
                    padding_tool(137, 72, 65, 0),
                    {
                      alignItems: "center",
                      justifyContent: "space-between",
                      position: "relative",
                    },
                  ]}
                  source={item.img}
                ></ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>
        <CoinView></CoinView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF3F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: pxToDp(Platform.OS === "ios" ? 200 : 149),
  },
  left: {
    width: pxToDp(600),
    height: pxToDp(870),
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    marginRight: pxToDp(48),
  },
  right: {
    flex: 1,
  },
  goDetailsBtn: {
    width: pxToDp(192),
    height: pxToDp(64),
    backgroundColor: "#fff",
    textAlign: "center",
    lineHeight: pxToDp(64),
    borderRadius: pxToDp(32),
    position: "absolute",
    fontSize: pxToDp(32),
    left: pxToDp(28),
    bottom: pxToDp(28),
  },
  rightText: {
    fontSize: pxToDp(38),
    fontWeight: "bold",
    color: "#fff",
  },
  rightItem: {
    // width: pxToDp(384),
    // height: pxToDp(384),
    // backgroundColor: '#5CC1FF',
    justifyContent: "space-between",
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(20),
  },
  rightItemOpacity: {
    backgroundColor: "#FFFFFF",
    borderRadius: pxToDp(30),
    width: pxToDp(143),
    alignItems: "center",
    marginEnd: pxToDp(48),
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    textBookCode: state.getIn(["bagEnglish", "textBookCode"]),
    authority: state.getIn(["userInfo", "selestModuleAuthority"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    setVisible(data) {
      dispatch(actionCreators.setVisible(data));
    },
    getTaskData(data) {
      dispatch(actionCreatorsDailyTask.getTaskData(data));
    }
  };
};

export default connect(mapStateToProps, mapDispathToProps)(SelectUnitEn);
