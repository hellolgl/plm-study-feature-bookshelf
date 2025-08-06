import React, { Component, PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import axios from " ../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import {
  size_tool,
  pxToDp,
  padding_tool,
  ChangeRichToTxt,
} from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
// import RichShowView from "../../../../../component/chinese/RichShowView";
import Header from "../../../../../component/Header";
import RichShowView from "../../../../../component/richShowViewNew";

class SpeWrongExerciseListRead extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      canvasWidth: 0,
      canvasHeight: 0,
      //题目列表，后期可能改动
      fromServeCharacterList: [],
      isEnd: false,
      topaicIndex: 0,
      topicMap: new Map(),
      status: 0,
      gifUrl: "",
      checkIndex: 0,
      nowPage: 1,
      haveNextPage: true,
      data: props.navigation.state.params.data,
    };
  }

  static navigationOptions = {
    // title:'答题'
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  toDoHomework = (exercise) => {
    NavigationUtil.toDoWrongExerciseRead({
      ...this.props,
      data: { ...exercise },
    });
  };

  componentDidMount() {
    this.getList(1);
  }
  getList = (page) => {
    const data = this.props.navigation.state.params.data;
    //console.log("列表咯", data);
    const info = this.props.userInfo.toJS();
    axios
      .get(
        `${api.errorArticleStem}/${info.checkGrade}/${info.checkTeam}/${
          data.index + 1
        }/${data.knowledge.a_id}?page=${page}&page_size=100`
      )
      .then((res) => {
        let list = res.data.data;
        let { fromServeCharacterList, haveNextPage } = this.state;
        let nowList = fromServeCharacterList.concat(list);
        //console.log("list1111111111111111111111111111111", nowList);
        if (nowList.length === res.data.total) {
          haveNextPage = false;
        }
        this.setState(() => ({
          fromServeCharacterList: nowList,
          haveNextPage,
        }));
      });
  };

  renderitem = ({ item, index }) => {
    const { nowPage } = this.state;
    return (
      <TouchableOpacity
        onPress={() => this.toDoHomework(item)}
        key={index}
        style={[styles.itemWrap]}
      >
        <View style={[styles.itemInner]}>
          <View style={[styles.itemNumWrap]}>
            <Text style={[styles.itemNum]}>
              {(nowPage - 1) * 10 + (index + 1)}
            </Text>
          </View>
          <View style={[styles.itemTxtWrap]}>
            <Text style={[styles.itemTxt]}>{ChangeRichToTxt(item.stem)}</Text>
          </View>
          <Image
            source={require("../../../../../images/chineseHomepage/flow/flowGo.png")}
            style={[size_tool(22, 38)]}
          />
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const { data } = this.state;
    return (
      <ImageBackground
        style={[styles.container]}
        source={require("../../../../../images/chineseHomepage/wrong/wrongBg.png")}
        resizeMode="stretch"
      >
        <View style={[styles.headerWrap]}>
          <TouchableOpacity onPress={this.goBack}>
            <Image
              source={require("../../../../../images/MathSyncDiagnosis/back_btn_1.png")}
              style={[size_tool(120, 80)]}
            />
          </TouchableOpacity>
          <Text style={[styles.headerxt]}>
            {data.knowledge.name} {data.knowledge.author}
          </Text>
          <View style={[size_tool(120, 80)]} />
        </View>
        <View style={[{ flex: 1 }, padding_tool(18, 44, 0, 44)]}>
          <FlatList
            data={this.state.fromServeCharacterList}
            renderItem={this.renderitem}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF3F5",
  },
  headerWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: pxToDp(172),
    borderColor: "#E0DBD7",
    borderBottomWidth: pxToDp(4),
    backgroundColor: "#fff",
    alignItems: "center",
    paddingLeft: pxToDp(36),
    paddingRight: pxToDp(36),
  },
  headerxt: {
    ...appFont.fontFamily_syst_bold,
    fontSize: pxToDp(48),
    lineHeight: pxToDp(60),
    color: "#475266",
  },
  itemWrap: {
    width: "100%",
    minHeight: pxToDp(160),
    paddingBottom: pxToDp(4),
    borderRadius: pxToDp(40),
    backgroundColor: "#EDEDF4",
    marginBottom: pxToDp(20),
  },
  itemInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: pxToDp(40),
    padding: pxToDp(40),
  },
  itemNumWrap: {
    width: pxToDp(80),
    height: pxToDp(80),
    backgroundColor: "#F2645B",
    borderRadius: pxToDp(40),
    justifyContent: "center",
    alignItems: "center",
  },
  itemNum: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(36),
    lineHeight: pxToDp(36),
    color: "#fff",
  },
  itemTxtWrap: {
    flex: 1,
    marginLeft: pxToDp(56),
    marginRight: pxToDp(56),
  },
  itemTxt: {
    ...appFont.fontFamily_syst_bold,
    fontSize: pxToDp(40),
    lineHeight: pxToDp(50),
    color: "#475266",
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

export default connect(
  mapStateToProps,
  mapDispathToProps
)(SpeWrongExerciseListRead);
