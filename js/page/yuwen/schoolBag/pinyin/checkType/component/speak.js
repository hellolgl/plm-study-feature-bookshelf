import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import { appStyle } from "../../../../../../theme";
import { padding_tool } from "../../../../../../util/tools";
import axios from "../../../../../../util/http/axios";
import api from "../../../../../../util/http/api";
import NavigationUtil from "../../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import LookPinyinItem from "../../../../../../component/chinese/pinyin/LookPinyinItem";

class LookAllExerciseHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [{}, {}, {}, {}],
      isloading: false,
      visible: false,
      explanation: {},
      isPasued: true,
      videoIsVisible: false,
    };
  }
  componentDidMount() {
    const { list } = this.state;
    // let info = this.props.userInfo.toJS();
    // console.log('参数', this.props.data)
    axios
      .get(api.chinesePinyinGetKnowDetail, {
        params: { p_id: this.props.data.p_id },
      })
      .then((res) => {
        // console.log("回调", res.data.data)
        if (res.data.err_code === 0) {
          let listnow = JSON.parse(JSON.stringify(list));
          res.data.data.data.forEach((item) => {
            let index = Number(item.level) - 1;
            listnow[index] = {
              name: this.props.data.knowledge_point,
              ...listnow[index],
              ...item,
            };
          });
          this.setState({
            list: listnow,
            isloading: true,
          });
        }
      });
  }
  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  render() {
    const { list, isloading } = this.state;
    return (
      <View style={[{ flex: 1 }]}>
        <View
          style={[
            {
              flex: 1,
              backgroundColor: "rgba(255,0,0,0)",
              position: "relative",
            },
            appStyle.flexJusCenter,
            appStyle.flexTopLine,
            appStyle.flexAliCenter,
          ]}
        >
          <ScrollView>
            <View
              style={[
                { flex: 1 },
                padding_tool(50, 60, 50, 60),
                appStyle.flexTopLine,
                appStyle.flexLineWrap,
                appStyle.flexCenter,
              ]}
            >
              {isloading
                ? list.map((item, index) => {
                    return (
                      <LookPinyinItem
                        resetToLogin={this.props.resetToLogin}
                        key={index}
                        value={item}
                        index={index}
                        showStar={this.props.showStar}
                      />
                    );
                  })
                : null}
              {/*  */}
            </View>
          </ScrollView>
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
