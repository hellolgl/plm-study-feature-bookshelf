import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { appFont, appStyle } from "../../theme";
import { pxToDp } from "../../util/tools";
import NavigationUtil from "../../navigator/NavigationUtil";
import { connect } from "react-redux";
import MathNavigationUtil from "../../navigator/NavigationMathUtil";
import * as actionCreators from "../../action/userInfo/index";
//
class RenderTag extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      typeObj: {
        paistory: [
          {
            msg: "一起开始",
            type: "normal",
          },
          {
            msg: "Pai Story",
            type: "spe",
          },
          {
            msg: "阅读之旅",
            type: "normal",
          },
        ],
        common_story: [
          {
            msg: "一起来用AI ",
            type: "normal",
          },
          {
            msg: "创作",
            type: "spe",
          },
          {
            msg: "故事吧",
            type: "normal",
          },
        ],
      },
    };
  }
  componentDidMount() {}
  getAuth = (alias) => {
    let i = {
      alias,
    };
    this.props.setSelectModule(i);
    this.props.setSelestModuleAuthority();
  };
  renderTag = (type, tagMsg) => {
    const { fontStyle } = this.props;
    const { typeObj } = this.state;
    let tagDom = null;
    let typeNow = typeObj[type];
    tagDom = typeNow && (
      <View style={[styles.tagWrap]}>
        {typeNow.map((item, index) => {
          return item.type === "spe" ? (
            <View
              key={index}
            >
              <Text style={[styles.speTag, fontStyle]}>#{item.msg} </Text>
            </View>
          ) : (
            <Text key={index} style={[styles.normalTag, fontStyle]}>
              {item.msg}
            </Text>
          );
        })}
        {tagMsg ? (
          <Text style={[styles.normalTag, fontStyle]}>{tagMsg}</Text>
        ) : null}
      </View>
    );

    return tagDom;
  };
  render() {
    const { type, tagMsg } = this.props;
    return <View>{this.renderTag(type, tagMsg)}</View>;
  }
}

const styles = StyleSheet.create({
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: pxToDp(10),
  },
  normalTag: {
    // ...appFont.fontFamily_jcyt_500,
    fontSize: pxToDp(25),
    color: "#283139",
  },
  speTag: {
    // ...appFont.fontFamily_jcyt_500,
    fontSize: pxToDp(25),
    color: "#228F86",
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    setPlanIndex(data) {
      dispatch(actionCreators.setPlanIndex(data));
    },
    setSelestModuleAuthority(data) {
      dispatch(actionCreators.setSelestModuleAuthority(data));
    },
    setSelectModule(data) {
      dispatch(actionCreators.setSelectModule(data));
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(RenderTag);
