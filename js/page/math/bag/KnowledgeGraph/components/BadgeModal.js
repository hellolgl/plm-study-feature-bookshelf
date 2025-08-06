import React, { PureComponent } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from "react-native";
import _ from "lodash";

import { pxToDp } from "../../../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../../../theme";
import { connect } from "react-redux";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

class BadgeModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    const { data } = this.props;
    this.setState({
      list: [
        {
          value: data[2],
        },
        {
          value: data[1],
        },
        {
          value: data[0],
        },
      ],
    });
    // {
    //     value:data[2]
    // },
    // {
    //     value:data[1]
    // },
    // {
    //     value:data[0]
    // },
  }

  close = () => {
    this.props.close();
  };

  render() {
    // const {show} = this.props
    // if(!show) return null
    const { list } = this.state;
    let language_data = this.props.language_data.toJS();
    const {
      main_language_map,
      other_language_map,
      show_type,
      show_main,
      show_translate,
    } = language_data;
    let page_base_data = {
      wodehzhgz_z: main_language_map.wodehzhgz,
      wodehzhgz_c: other_language_map.wodehzhgz,
    };
    const { wodehzhgz_z, wodehzhgz_c } = page_base_data;
    const { fromChildren } = this.props;

    let des_map = fromChildren
      ? {
          0: {
            badge_des_z: main_language_map.badge_des_1,
            badge_des_c: other_language_map.badge_des_1,
            img: require("../../../../../images/children/finishKnow.png"),
          },
          1: {
            badge_des_z: main_language_map.badge_des_2,
            badge_des_c: other_language_map.badge_des_2,
            img: require("../../../../../images/children/finishKnowNo.png"),
          },
        }
      : {
          0: {
            badge_des_z: main_language_map.badge_des_1,
            badge_des_c: other_language_map.badge_des_1,
            img: require("../../../../../images/MathKnowledgeGraph/badge_icon_1.png"),
          },
          1: {
            badge_des_z: main_language_map.badge_des_2,
            badge_des_c: other_language_map.badge_des_2,
            img: require("../../../../../images/MathKnowledgeGraph/badge_icon_2.png"),
          },
          2: {
            badge_des_z: main_language_map.badge_des_3,
            badge_des_c: other_language_map.badge_des_3,
            img: require("../../../../../images/MathKnowledgeGraph/badge_icon_3.png"),
          },
        };
    let listnow = fromChildren ? list.slice(0, 2) : list;
    return (
      <View style={[styles.container]}>
        <TouchableWithoutFeedback onPress={this.close}>
          <View style={[styles.click_region]}></View>
        </TouchableWithoutFeedback>
        <View style={[styles.content]}>
          <View style={[styles.inner]}>
            <View
              style={[appStyle.flexAliCenter, { marginBottom: pxToDp(40) }]}
            >
              {show_main ? (
                <Text
                  style={[
                    mathFont.txt_48_700,
                    mathFont.txt_4C4C59,
                    {
                      marginBottom:
                        Platform.OS === "android" ? pxToDp(-10) : pxToDp(10),
                    },
                  ]}
                >
                  {wodehzhgz_z}
                </Text>
              ) : null}
              {show_translate ? (
                <Text
                  style={[
                    mathFont.txt_32_500,
                    mathFont.txt_4C4C59_50,
                    { lineHeight: pxToDp(42) },
                  ]}
                >
                  {wodehzhgz_c}
                </Text>
              ) : null}
            </View>
            <View style={{ paddingLeft: pxToDp(40), paddingRight: pxToDp(40) }}>
              {listnow.map((i, x) => {
                return (
                  <View
                    key={x}
                    style={[appStyle.flexLine, { marginBottom: pxToDp(66) }]}
                  >
                    <View style={[styles.item_left]}>
                      <Image
                        style={{
                          width: pxToDp(80),
                          height: pxToDp(80),
                          marginRight: pxToDp(20),
                        }}
                        resizeMode="stretch"
                        source={des_map[x].img}
                      ></Image>
                      <Text style={[mathFont.txt_40_700, mathFont.txt_4C4C59]}>
                        x{i.value}
                      </Text>
                    </View>
                    <View style={[{ flex: 1 }]}>
                      {show_main ? (
                        <Text
                          style={[
                            mathFont.txt_36_500,
                            mathFont.txt_475266,
                            {
                              marginBottom:
                                Platform.OS === "android"
                                  ? pxToDp(-15)
                                  : pxToDp(10),
                            },
                          ]}
                        >
                          {des_map[x].badge_des_z}
                        </Text>
                      ) : null}
                      {show_translate ? (
                        <Text
                          style={[mathFont.txt_24_500, mathFont.txt_475266_50]}
                        >
                          {des_map[x].badge_des_c}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
          <View style={styles.triangle_up}></View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight - pxToDp(120),
    position: "absolute",
    top: pxToDp(120),
    left: 0,
    ...appStyle.flexAliCenter,
  },
  click_region: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(71, 82, 102, 0.5)",
  },
  content: {
    position: "absolute",
    right: pxToDp(20),
    top: pxToDp(24),
    borderRadius: pxToDp(40),
    width: pxToDp(880),
    backgroundColor: "#DAE2F2",
    paddingBottom: pxToDp(10),
  },
  inner: {
    width: "100%",
    backgroundColor: "#fff",
    paddingTop: pxToDp(40),
    borderRadius: pxToDp(40),
  },
  item_left: {
    width: pxToDp(260),
    height: pxToDp(120),
    backgroundColor: "rgba(71, 82, 102, 0.05)",
    borderRadius: pxToDp(200),
    ...appStyle.flexLine,
    padding: pxToDp(20),
    marginRight: pxToDp(20),
  },
  triangle_up: {
    width: 0,
    height: 0,
    borderLeftWidth: pxToDp(16),
    borderLeftColor: "transparent",
    borderRightWidth: pxToDp(16),
    borderRightColor: "transparent",
    borderBottomWidth: pxToDp(25),
    borderBottomColor: "#fff",
    position: "absolute",
    top: pxToDp(-20),
    right: pxToDp(60),
  },
});
const mapStateToProps = (state) => {
  return {
    language_data: state.getIn(["languageMath", "language_data"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(BadgeModal);
