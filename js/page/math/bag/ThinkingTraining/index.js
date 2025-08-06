import React, { PureComponent } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  BackHandler,
  DeviceEventEmitter
} from "react-native";
import { pxToDp } from "../../../../util/tools";
import { appFont, appStyle } from "../../../../theme";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import { Toast } from "antd-mobile-rn";
import BackBtn from "../../../../component/math/BackBtn";
import { connect } from "react-redux";
import HomeNavigationUtil from "../../../../navigator/NavigationUtil";
import CoinView from '../../../../component/coinView'
import * as actionCreatorsDailyTask from "../../../../action/dailyTask";

const log = console.log.bind(console);

class ThinkingTraining extends PureComponent {
  constructor() {
    super();
    this.message = [];
    this.eventListenerRefreshCoin = undefined
    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    let obj = {
      parent_id: "0",
    };
    axios.get(api.getMathThinkingIndex, { params: obj }).then((res) => {
      this.message = res.data.data;
    });
  }
  componentWillUnmount() {
    this.backBtnListener && this.backBtnListener.remove();
    this.eventListenerRefreshCoin && this.eventListenerRefreshCoin.remove();
    this.props.getTaskData()
  }
  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  goStructExercise = (title) => {
    MathNavigationUtil.toMathThinkingTrainingExercisePage({
      ...this.props,
      data: title,
    });
  };

  goQtyRelationship = (title) => {
    MathNavigationUtil.toMathThinkingQtyRelationshipPage({
      ...this.props,
      data: title,
    });
  };

  goMindTraining = (title) => {
    MathNavigationUtil.toMathThinkingMindTrainingPage({
      ...this.props,
      data: title,
    });
  };

  goComprehensiveTraining = () => {
    let filtet_data = this.message.filter((item, index) => {
      return item.name.indexOf("综合练习") > -1;
    })[0];
    MathNavigationUtil.toMathTTComprehensiveHomePage({
      ...this.props,
      data: { ...filtet_data, label: "综合练习" },
    });
  };
  render() {
    return (
      <ImageBackground
        resizeMode="contain"
        style={[styles.mainWrap, { backgroundColor: "#fffdf1" }]}
        source={require("../../../../images/thinkingTraining/home_bg.png")}
      >
        {Platform.OS === "ios" ? (
          <View style={[{ marginTop: pxToDp(10) }]}></View>
        ) : (
          <></>
        )}
        <View
          style={[appStyle.flexCenter, { width: "100%", height: pxToDp(100) }]}
        >
          <BackBtn
            goBack={this.goBack}
            style={{ left: pxToDp(20), top: pxToDp(10) }}
          ></BackBtn>
          <Text
            style={[
              { fontSize: pxToDp(48), color: "#273339", top: pxToDp(10) },
              appFont.fontFamily_jcyt_700,
            ]}
          >
            思维训练
          </Text>
        </View>
        {/* 适配ios布局 */}
        {/*{Platform.OS === "ios" ? <View style={[{ marginTop: pxToDp(170) }]}></View>: <></>}*/}
        <View style={[styles.content, { flexDirection: "row" }]}>
          <TouchableOpacity
            style={[styles.module_1]}
            onPress={() => this.goStructExercise("结构训练")}
          >
            <Image
              style={[{ width: pxToDp(420), height: pxToDp(539) }]}
              source={require("../../../../images/thinkingTraining/module_1.png")}
              resizeMode="contain"
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.module_2]}
            onPress={() => this.goQtyRelationship("数量关系训练")}
          >
            <Image
              style={[{ width: pxToDp(420), height: pxToDp(539) }]}
              source={require("../../../../images/thinkingTraining/module_2.png")}
              resizeMode="contain"
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.module_3]}
            onPress={() => this.goMindTraining("思路训练")}
          >
            <Image
              style={[{ width: pxToDp(420), height: pxToDp(539) }]}
              source={require("../../../../images/thinkingTraining/module_3.png")}
              resizeMode="contain"
            ></Image>
          </TouchableOpacity>
          {/* <TouchableOpacity style={[styles.module_4]} onPress={() => this.goComprehensiveTraining()}>
                        <Image style={[{ width: pxToDp(420), height: pxToDp(539), }]} source={require('../../../../images/thinkingTraining/module_4.png')} resizeMode="contain"></Image>
                    </TouchableOpacity> */}
        </View>
        <CoinView></CoinView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    // top: pxToDp(-20),
    alignItems: "center",
    flex: 1,
    paddingBottom: pxToDp(100),
    // backgroundColor: "red",
  },
  mainWrap: {
    flex: 1,
    paddingTop: pxToDp(40),
    paddingRight: pxToDp(48),
    paddingBottom: pxToDp(48),
    paddingLeft: pxToDp(48),
  },
  module_1: {
    left: pxToDp(44),
  },
  module_2: {
    left: pxToDp(84),
  },
  module_3: {
    left: pxToDp(124),
  },
  module_4: {
    left: pxToDp(220),
  },
  err_task_button: {
    margin: pxToDp(60),
  },
});

const mapStateToProps = (state) => {
  return {
    token: state.getIn(["userInfo", "token"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    getTaskData(data) {
      dispatch(actionCreatorsDailyTask.getTaskData(data));
    }
  };
};

export default connect(mapStateToProps, mapDispathToProps)(ThinkingTraining);
