import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { appStyle } from "../../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  borderRadius_tool,
} from "../../../../util/tools";
import Header from "../../../../component/Header";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { Toast } from "antd-mobile-rn";

const router_key_map = {
  同步: "flow",
  智能句: "sentence",
  阅读理解: "reading",
  习作: "composition",
  拼音: "pinyin",
  Sentence: "englishSentence",
};

class LookAllExerciseHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          type: "flow",
          name: "同步习题",
          haveThis: false,
        },
        {
          type: "sentence",
          name: "智能句",
          haveThis: false,
        },
        {
          type: "reading",
          name: "专项阅读理解",
          haveThis: false,
        },
        {
          type: "composition",
          name: "习作",
          haveThis: false,
        },
        {
          type: "pinyin",
          name: "拼音",
          haveThis: false,
        },
        {
          type: "englishSentence",
          name: "Sentence",
          haveThis: false,
        },
      ],
    };
  }
  componentDidMount() {
    const { list } = this.state;
    const { router } = this.props.navigation.state.params.data;
    let router_keys = router.map((i, x) => {
      return router_key_map[i];
    });
    let _l = JSON.parse(JSON.stringify(list));
    _l.forEach((i, x) => {
      if (router_keys.indexOf(i.type) > -1) {
        _l[x].haveThis = true;
      }
    });
    this.setState({
      list: _l,
    });
  }
  goBack() {
    NavigationUtil.goBack(this.props);
  }
  toLook = (item) => {
    if (!item.haveThis) {
      Toast.info("暂无该题目审核权限！", 1);
      return;
    }
    switch (item.type) {
      case "flow":
        // 同步习题
        NavigationUtil.toChineseLookFlowExerciseHome({ ...this.props });
        break;
      case "reading":
        // 阅读理解
        NavigationUtil.toChineseLookAllReadingExerciseCheckType({
          ...this.props,
        });
        break;
      case "sentence":
        // 智能句
        NavigationUtil.toChineseLookAllSentenceExerciseCheckType({
          ...this.props,
        });
        break;
      case "pinyin":
        NavigationUtil.toLookAllPinyinExerciseHome({ ...this.props });
        break;
      case "englishSentence":
        NavigationUtil.toEnExamineSentenceHomePage({ ...this.props });
        break;
      default:
        break;
    }
  };

  render() {
    const { list } = this.state;
    return (
      <View style={[padding_tool(48, 48, 48, 48), { flex: 1 }]}>
        <Header
          text={"习题审核"}
          goBack={() => {
            this.goBack();
          }}
        />
        <View
          style={[
            { flex: 1 },
            appStyle.flexTopLine,
            appStyle.flexLineWrap,
            appStyle.flexJusBetween,
          ]}
        >
          {list.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={[
                  size_tool(950, 200),
                  appStyle.flexCenter,
                  borderRadius_tool(40),
                  { backgroundColor: "#fff", marginBottom: pxToDp(40) },
                ]}
                onPress={this.toLook.bind(this, item)}
              >
                <Text
                  style={[
                    {
                      fontSize: pxToDp(40),
                      color: item.haveThis ? "#333" : "#ccc",
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
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
