import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { size_tool, pxToDp, padding_tool, margin_tool } from "../../util/tools";
import { appStyle } from "../../theme";
import HelpCard from "./HelpCardNew1";
import HelpSentenceModal from "./HelpSentenceModal";
/**
 * kygType 1:单词 2:句子
 */
export default class HelpModal extends Component {
  constructor(props) {
    super(props);
    this.url = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/";
  }

  componentDidMount() {}

  nextTopaicHelp = () => {
    this.props.closeModal();
  };

  renderCard = () => {
    if (!this.props.knowledgeBody) return;
    switch (+Object.getOwnPropertyNames(this.props.knowledgeBody).length) {
      case 3:
        return this.render2child();
    }
  };

  render2child = () => {
    // if (this.props.kygType === '1') {
    //单词短语
    return (
      <View style={[styles.wordWrap, appStyle.flexJusBetween]}>
        <View style={[styles.wordItemWrap]}>
          <Image
            source={require("../../images/englishHomepage/englishHelpItem1.png")}
            style={[size_tool(140, 61), styles.wordheader]}
          ></Image>
          <HelpCard
            audioPath={this.url + this.props.knowledgeBody[1].audio}
            imgUrl={this.url + this.props.knowledgeBody[1].picture}
            word_phoneticspelling={
              this.props.knowledgeBody[1].word_phoneticspelling
            }
            word={this.props.knowledgeBody[1].word}
          />
        </View>
        <Image
          source={require("../../images/englishHomepage/wordHelpLeft.png")}
          style={[size_tool(120, 45), margin_tool(0, 20, 0, 20)]}
        ></Image>

        <View style={[styles.wordItemWrap]}>
          <Image
            source={require("../../images/englishHomepage/englishHelpItem2.png")}
            style={[size_tool(140, 61), styles.wordheader]}
          ></Image>
          <HelpCard
            marginLeft={70}
            autoPlayAudio={false}
            audioPath={this.url + this.props.knowledgeBody[0].audio}
            imgUrl={this.url + this.props.knowledgeBody[0].picture}
            word_phoneticspelling={
              this.props.knowledgeBody[0].word_phoneticspelling
            }
            word={this.props.knowledgeBody[0].word}
          ></HelpCard>
        </View>
        <Image
          source={require("../../images/englishHomepage/wordHelpright.png")}
          style={[size_tool(120, 45), margin_tool(0, 20, 0, 20)]}
        ></Image>

        <View style={[styles.wordItemWrap]}>
          <Image
            source={require("../../images/englishHomepage/englishHelpItem3.png")}
            style={[size_tool(140, 61), styles.wordheader]}
          ></Image>
          <HelpCard
            audioPath={this.url + this.props.knowledgeBody[2].audio}
            imgUrl={this.url + this.props.knowledgeBody[2].picture}
            word_phoneticspelling={
              this.props.knowledgeBody[2].word_phoneticspelling
            }
            word={this.props.knowledgeBody[2].word}
            wordWidth={460}
            wordHeight={570}
            showLine={true}
            translateX={-50}
            translateY={0}
            wordRotate={0}
            lineLen={280}
          ></HelpCard>
        </View>
      </View>
    );

    // }
  };

  render() {
    console.log("render help modal...");
    const { currentTopaicData } = this.props;
    var len = this.props.len;
    var arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(i);
    }
    let length = this.props.knowledgeBody
      ? +Object.getOwnPropertyNames(this.props.knowledgeBody).length
      : 0;
    let isSen = length === 3 && this.props.kygType !== "1" ? true : false;
    return (
      <View>
        <Modal animationType="fade" visible={this.props.visible}>
          {!isSen ? (
            <View
              style={[
                {
                  flex: 1,
                  width: pxToDp(2048),
                  height: pxToDp(600),
                  backgroundColor: "#F5D6A6",
                  alignItems: "center",
                },
              ]}
            >
              <View
                style={[
                  styles.modalHeader,
                  appStyle.height110,
                  appStyle.flexJusCenter,
                ]}
              >
                <TouchableOpacity
                  style={[styles.nextText]}
                  onPress={this.nextTopaicHelp}
                >
                  <Image
                    source={require("../../images/englishHomepage/wordHelpBack.png")}
                    style={[
                      size_tool(80),
                      { transform: [{ rotate: "180deg" }] },
                    ]}
                  ></Image>
                </TouchableOpacity>
              </View>
              <View style={[padding_tool(40, 40, 0, 40), styles.wordmainWrap]}>
                <View style={[styles.wordmainInBg]}>{this.renderCard()}</View>
              </View>
              <View style={[styles.wordFooter]}>
                <View style={[styles.wordFooterbg1]}></View>
                <View style={[styles.wordFooterbg2]}></View>
                <View style={[styles.wordFooterbg3]}></View>
              </View>
            </View>
          ) : (
            <HelpSentenceModal
              defaultValue={this.props.knowledgeBody[0]}
              goback={this.props.closeModal}
            />
          )}
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  modalHeader: {
    height: pxToDp(123),
    width: "100%",
    paddingRight: pxToDp(70),
    paddingTop: pxToDp(40),
    alignItems: "flex-end",
  },
  nextText: {
    width: pxToDp(80),
    height: pxToDp(80),
  },
  contentWrap: {
    // position: "absolute",
    backgroundColor: "#fff",
    zIndex: 1,
    minWidth: pxToDp(220),
    minHeight: pxToDp(100),
  },
  wordWrap: {
    flexDirection: "row",
    width: pxToDp(1640),
    flex: 1,
    alignItems: "center",
  },
  wordItemWrap: {
    backgroundColor: "#474747",
    height: pxToDp(620),
    width: pxToDp(420),
    borderRadius: pxToDp(32),
    paddingTop: pxToDp(20),
    position: "relative",
  },
  wordheader: {
    position: "absolute",
    left: pxToDp(130),
    top: pxToDp(-30),
  },
  wordmainWrap: {
    alignItems: "center",
    flex: 1,
    width: pxToDp(1800),
    backgroundColor: "#A86A33",
    borderTopLeftRadius: pxToDp(64),
    borderTopRightRadius: pxToDp(64),
  },
  wordmainInBg: {
    alignItems: "center",
    flex: 1,
    width: pxToDp(1720),
    backgroundColor: "#1F1F1F",
    borderTopLeftRadius: pxToDp(56),
    borderTopRightRadius: pxToDp(56),
  },
  wordFooter: {
    height: pxToDp(100),
    width: "100%",
  },
  wordFooterbg1: {
    height: pxToDp(16),
    backgroundColor: "#FDC798",
  },
  wordFooterbg2: {
    height: pxToDp(24),
    backgroundColor: "#A86A33",
  },
  wordFooterbg3: {
    flex: 1,
    backgroundColor: "#6F2F09",
  },
});
