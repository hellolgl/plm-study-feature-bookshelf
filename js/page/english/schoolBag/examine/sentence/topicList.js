import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { appStyle } from "../../../../../theme";
import { pxToDp } from "../../../../../util/tools";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import Header from "../../../../../component/Header";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import { connect } from "react-redux";
import { haveNbsp } from "../../Sentences/tools";

class TopicList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      page: 1,
      page_size: 10,
      pageList: [],
    };
  }
  componentDidMount() {
    this.getData();
  }

  getData() {
    const { iid, unit_code } = this.props.navigation.state.params.data;
    const { page, page_size } = this.state;
    const userInfo = this.props.userInfo.toJS();
    const data = {
      iid,
      unit_code,
      grade_code: userInfo.checkGrade,
      term_code: userInfo.checkTeam,
      page,
      page_size,
    };
    axios.get(api.getEnExamineTopicList, { params: data }).then((res) => {
      console.log("数据", res.data);
      const total = res.data.total;
      let len = Math.ceil(total / page_size);
      let pageList = [];
      for (let i = 0; i < len; i++) {
        pageList.push(i);
      }
      this.setState({
        pageList,
        list: res.data.data,
      });
    });
  }

  render() {
    const { list, pageList, page } = this.state;
    const { name } = this.props.navigation.state.params.data;
    return (
      <View style={[styles.container]}>
        <Header
          text={name}
          goBack={() => {
            NavigationUtil.goBack(this.props);
          }}
        />
        <ScrollView
          style={[{ maxHeight: pxToDp(80) }]}
          horizontal={true}
          contentContainerStyle={[appStyle.flexLine]}
        >
          {pageList.map((i, x) => {
            return (
              <TouchableOpacity
                style={[
                  styles.circleItem,
                  page - 1 === x ? { backgroundColor: "#FFC662" } : null,
                ]}
                onPress={() => {
                  this.setState(
                    {
                      page: x + 1,
                    },
                    () => {
                      this.getData();
                    }
                  );
                }}
              >
                <Text style={[{ color: "#445268", fontSize: pxToDp(50) }]}>
                  {x + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={[styles.content]}>
          <ScrollView>
            {list.map((i, x) => {
              return (
                <TouchableOpacity
                  style={[styles.item]}
                  key={x}
                  onPress={() => {
                    NavigationUtil.toEnSentencesLearnTodayRecordDoExercise({
                      ...this.props,
                      data: { se_id: i.se_id, type: "examine" },
                    });
                  }}
                >
                  <View style={{ width: "85%" }}>
                    <Text style={[{ fontSize: pxToDp(36), color: "#ACB2BC" }]}>
                      {i.common_stem}
                    </Text>
                    <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
                      {i.sentence_stem.map((item, index) => {
                        return (
                          <Text
                            style={[{ fontSize: pxToDp(50), color: "#445368" }]}
                            key={index}
                          >
                            {index > 0 ? haveNbsp(item.content) : ""}
                            {item.content}
                          </Text>
                        );
                      })}
                    </View>
                  </View>
                  <View style={[appStyle.flexLine]}>
                    <Text
                      style={[
                        {
                          fontSize: pxToDp(36),
                          color: "#445368",
                          marginRight: pxToDp(20),
                        },
                      ]}
                    >
                      {i.save_phase === "1" || i.save_phase === "2"
                        ? "点选"
                        : "下拉"}
                      类型
                    </Text>
                    <Text style={[{ fontSize: pxToDp(36), color: "#445368" }]}>
                      等级：{i.exercise_level}
                    </Text>
                    <Image
                      source={require("../../../../../images/chineseHomepage/pingyin/new/next.png")}
                      style={[
                        { width: pxToDp(80), height: pxToDp(80), opacity: 0.3 },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: pxToDp(48),
  },
  content: {
    flex: 1,
    marginTop: pxToDp(30),
    borderRadius: pxToDp(40),
  },
  unitItem: {
    height: pxToDp(90),
    backgroundColor: "#AE82FF",
    ...appStyle.flexCenter,
    marginRight: pxToDp(32),
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20),
    borderRadius: pxToDp(40),
  },
  circleItem: {
    width: pxToDp(80),
    height: pxToDp(80),
    borderRadius: pxToDp(40),
    marginRight: pxToDp(40),
    ...appStyle.flexCenter,
    backgroundColor: "#fff",
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: pxToDp(40),
    marginBottom: pxToDp(20),
    padding: pxToDp(40),
    ...appStyle.flexLine,
    ...appStyle.flexJusBetween,
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

export default connect(mapStateToProps, mapDispathToProps)(TopicList);
