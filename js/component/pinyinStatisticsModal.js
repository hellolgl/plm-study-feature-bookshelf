import React, { Component } from "react";
import {
  Image,
  // Modal,
  Text,
  View,
  BackAndroid,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import {
  margin_tool,
  size_tool,
  pxToDp,
  borderRadius_tool,
  padding_tool,
} from "../util/tools";
import { appStyle, appFont } from "../theme";
import { Toast, Modal } from "antd-mobile-rn";
import fonts from "../theme/fonts";
export default class AnswerStatisticsModal extends Component {
  constructor(props) {
    super(props);
    console.log("AnswerStatisticsModal props", props);
    this.showTwo = this.props.exerciseStatistics
      ? Object.keys(this.props.exerciseStatistics).length === 2
        ? true
        : false
      : false;
  }

  static defaultProps = {
    dialogVisible: false,
    yesNumber: 0,
    noNumber: 0,
    waitNumber: 0,
  };

  render() {

    let { language_data, finishTxt } = this.props
    language_data ? '' : language_data = {
      show_main: true,
      show_translate: false,
      main_language: 'ch'
    }
    const { show_main, show_translate, main_language } = language_data
    return (this.props.dialogVisible ?
      <View style={styles.mainWrap}>
        <View style={[size_tool(560, 560), { position: 'relative' }]}>
          <View
            style={[
              {
                backgroundColor: "#DAE2F2",
                width: pxToDp(560),
                height: pxToDp(520)
              },
              borderRadius_tool(80),

            ]}
          >
            <View style={[
              {
                backgroundColor: "#fff",
                width: pxToDp(560),
                height: pxToDp(516)
              },
              borderRadius_tool(80),
              appStyle.flexAliCenter,
              padding_tool(40)
            ]}>

              <View style={[appStyle.flexCenter, { marginBottom: pxToDp(80) }]}>
                {/* <Text style={[{ color: "#4C4C59", fontSize: pxToDp(48) }, fonts.fontFamily_jcyt_700]}>
                    {this.props.finishTxt.main}
                  </Text> */}
                {show_main && main_language === 'zh' ? <Text style={[{ color: "#4C4C59", lineHeight: pxToDp(38), fontSize: pxToDp(28) }, fonts.fontFamily_jcyt_500]}>{finishTxt.pinyin}</Text> : null}
                {show_main ? <Text style={[{ color: "#4C4C59", fontSize: pxToDp(48), lineHeight: pxToDp(68) }, fonts.fontFamily_jcyt_700]}>{finishTxt.main}</Text> : null}
                {show_translate ? <Text style={[{ opacity: 0.5, color: "#4C4C59", fontSize: pxToDp(28), lineHeight: pxToDp(28) }, fonts.fontFamily_jcyt_500]}>{finishTxt.other}</Text> : null}

              </View>

              <View
                style={[
                  appStyle.flexTopLine,
                  appStyle.flexJusBetween,

                ]}
              >
                <View style={[appStyle.flexTopLine, appStyle.flexCenter, { marginRight: pxToDp(40), backgroundColor: 'rgba(49,216,96,0.1)', borderRadius: pxToDp(40), padding: pxToDp(20) }]}>

                  <Text style={[{ color: "#4C4C59", fontSize: pxToDp(80), marginRight: pxToDp(20), lineHeight: pxToDp(80), }, fonts.fontFamily_jcyt_700]}>
                    {this.props.yesNumber}
                  </Text>
                  <Image style={[size_tool(40)]} source={require('../images/chineseHomepage/pingyin/new/right.png')} />
                </View>
                <View style={[appStyle.flexTopLine, appStyle.flexCenter, { backgroundColor: 'rgba(255,102,128,0.1)', borderRadius: pxToDp(40), padding: pxToDp(20) }]}>

                  <Text style={[{ color: "#4C4C59", fontSize: pxToDp(80), marginRight: pxToDp(20), lineHeight: pxToDp(80), }, fonts.fontFamily_jcyt_700]}>
                    {this.props.noNumber}
                  </Text>
                  <Image style={[size_tool(40)]} source={require('../images/chineseHomepage/pingyin/new/wrong.png')} />

                </View>
              </View>



            </View>
          </View>
          <TouchableOpacity
            onPress={this.props.closeDialog}
            style={[
              size_tool(280, 120),
              {
                position: 'absolute',
                bottom: pxToDp(0),
                left: pxToDp(140)
              },
              borderRadius_tool(32),
              appStyle.flexCenter,
            ]}
          >
            <Image style={[size_tool(280, 120)]} source={require('../images/chineseHomepage/pingyin/new/closeHelp.png')} />
          </TouchableOpacity>
        </View>


      </View> : null
    );
  }
}

const styles = StyleSheet.create({
  mainWrap: {
    ...appStyle.flexCenter,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 99999
  },
});
