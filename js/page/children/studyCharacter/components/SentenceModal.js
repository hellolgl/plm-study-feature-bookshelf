import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { pxToDp } from "../../../../util/tools";
import { appFont, appStyle } from "../../../../theme";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import Audio from "../../../../util/audio/audio";
import url from "../../../../util/url";
import IDOMParser from "advanced-html-parser";
import { pinyin } from "pinyin-pro";

const specia_character_arr = ["地"]; //需要替换拼音的特殊字

export default class SentenceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sentence: {},
      zi_arr: [],
      pinyin_arr: [],
      high_light_index: [],
      loading: true,
    };
  }

  onCloseHelp = () => {
    this.props.onCloseHelp();
  };

  onShow = () => {
    const { data, isPinyin } = this.props;
    const { knowledge_point } = data;
    let params = {
      knowledge_point: data.knowledge_point,
      word_level_id: data.word_level_id,
    };
    let src = api.getChildSingleSentence;
    if (isPinyin) {
      params = {
        knowledge_point: data.knowledge_point,
      };
      src = api.getPinyinOneWordSentence;
    }
    axios
      .get(src, { params })
      .then((res) => {
        // console.log("res.data.data.knowledge_point: ", res.data.data)
        const doc = IDOMParser.parse(res.data.data.knowledge_point);
        const pElement = doc.querySelector("p");
        const textContent = pElement.textContent;
        const chineseAndPunctuation = textContent.match(
          /[\u4e00-\u9fa5，。！？；：“”‘’（）【】]/g
        );
        let zi_arr = [];
        zi_arr = chineseAndPunctuation;
        const specialList = [
          "，",
          "。",
          "：",
          "“",
          "‘",
          "……",
          "；",
          "！",
          "？",
          "（",
          "）",
          "【",
          "】",
        ];
        const pinyin_arr = pinyin(zi_arr.join(""), { type: "array" }).filter(
          (i) => specialList.includes(i) === false
        );
        // let knowledge_point_txt = res.data.data.knowledge_point.replace(/<[^>]+>/g,"").replaceAll('&nbsp;','').replace(/\s*/g,"").replaceAll('(','#').replaceAll(')','#')
        // let knowledge_point_txt_arr = knowledge_point_txt.split('#').filter(i => {return i})
        // knowledge_point_txt_arr.forEach((i,x)=>{
        //     // 匹配中文和中文标点
        //     let reg = new RegExp("([\u4E00-\u9FFF]|[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\uff01\u3010\u3011\uffe5])+","g");
        //     if(reg.test(i)){
        //         if(i.length>1){
        //             if(/[\u4E00-\u9FA5]+/g.test(i)){
        //                 //多。duō 这种情况
        //                 zi_arr = zi_arr.concat(i.substring(0,2).split(''))
        //                 pinyin_arr.push(i.substring(2))
        //             }else{
        //                 // le。这种情况
        //                 console.log('____',importScripts)
        //                 zi_arr.push(i.substring(i.length - 1))
        //                 pinyin_arr.push(i.substring(0,i.length - 1))
        //             }
        //
        //         }else{
        //             zi_arr.push(i)
        //         }
        //     }else{
        //         pinyin_arr.push(i)
        //     }
        // })

        let high_light_index = [];
        const pinyinArr = [];
        zi_arr.forEach((i, x) => {
          const word = i;
          if (word.match(/[\u4e00-\u9fa5]/g) !== null) {
            const pinyin = pinyin_arr.shift();
            pinyinArr.push(pinyin);
          } else {
            pinyinArr.push("");
          }
          if (knowledge_point.indexOf(i) > -1) {
            if (
              specia_character_arr.indexOf(i) > -1 &&
              data.character_pinyin2 !== pinyinArr[x]
            ) {
              // 替换成录入的拼音
              pinyinArr[x] = data.character_pinyin2;
            }
            if (high_light_index.length > 0) {
              if (x === high_light_index[high_light_index.length - 1] + 1) {
                high_light_index.push(x);
              } else {
                if (high_light_index.length !== knowledge_point.length) {
                  high_light_index[0] = x;
                }
              }
            } else {
              high_light_index.push(x);
            }
          }
        });
        this.setState({
          sentence: res.data.data,
          zi_arr,
          pinyin_arr: pinyinArr,
          high_light_index,
        });
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    const { visible } = this.props;
    const { sentence, zi_arr, pinyin_arr, high_light_index, loading } =
      this.state;
    const {
      english_knowledge_point,
      word_idiom_audio,
      sen_audio,
      knowledge_point,
    } = sentence;
    console.log(":pinyin_arr: ", pinyin_arr);
    return (
      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onShow={this.onShow}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View style={[styles.container]}>
          <View style={[styles.content]}>
            <View style={[styles.inner]}>
              {loading ? (
                <View style={[styles.inner]}>
                  <ActivityIndicator size="large" color="#4F99FF" />
                </View>
              ) : (
                <>
                  <View style={[styles.sentence_wrap]}>
                    {/* {knowledge_point?<View style={{minWidth:'90%',minHeight:pxToDp(160)}}>
                                    <RichShowView value={knowledge_point} size={4}></RichShowView>
                                </View>:null} */}
                    <View style={[appStyle.flexLine]}>
                      {zi_arr.map((i, x) => {
                        return (
                          <View key={x} style={[appStyle.flexAliCenter]}>
                            <Text
                              style={[
                                { color: "#363D4C", fontSize: pxToDp(28) },
                                appFont.fontFamily_jcyt_500,
                                high_light_index.indexOf(x) > -1
                                  ? { color: "#FF8845" }
                                  : null,
                                Platform.OS === "ios"
                                  ? {
                                      marginBottom: pxToDp(12),
                                      lineHeight: pxToDp(40),
                                    }
                                  : { marginBottom: pxToDp(-20) },
                              ]}
                            >
                              {pinyin_arr[x]}
                            </Text>
                            <Text
                              style={[
                                { color: "#363D4C", fontSize: pxToDp(60) },
                                appFont.fontFamily_jcyt_700,
                                high_light_index.indexOf(x) > -1
                                  ? { color: "#FF8845" }
                                  : null,
                              ]}
                            >
                              {" "}
                              {i}{" "}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                    {word_idiom_audio ? (
                      <View style={[styles.play_btn_1]}>
                        <Audio
                          audioUri={`${url.baseURL}${word_idiom_audio}`}
                          pausedBtnImg={require("../../../../images/childrenStudyCharacter/play_btn_2.png")}
                          pausedBtnStyle={{
                            width: pxToDp(120),
                            height: pxToDp(120),
                          }}
                          playBtnImg={require("../../../../images/childrenStudyCharacter/play_btn_2.png")}
                          playBtnStyle={{
                            width: pxToDp(120),
                            height: pxToDp(120),
                          }}
                        />
                      </View>
                    ) : null}
                  </View>
                  <View
                    style={[
                      appStyle.flexLine,
                      appStyle.flexAliCenter,
                      { marginTop: pxToDp(60), marginBottom: pxToDp(60) },
                    ]}
                  >
                    <Text
                      style={[
                        {
                          color: "#363D4C",
                          fontSize: pxToDp(36),
                          marginRight: pxToDp(20),
                        },
                        appFont.fontFamily_jcyt_500,
                        Platform.OS === "ios"
                          ? { lineHeight: pxToDp(50) }
                          : null,
                      ]}
                    >
                      {english_knowledge_point}
                    </Text>
                    {sen_audio ? (
                      <Audio
                        audioUri={`${url.baseURL}${sen_audio}`}
                        pausedBtnImg={require("../../../../images/childrenStudyCharacter/play_btn_1.png")}
                        pausedBtnStyle={{
                          width: pxToDp(60),
                          height: pxToDp(60),
                        }}
                        playBtnImg={require("../../../../images/childrenStudyCharacter/play_btn_1.png")}
                        playBtnStyle={{ width: pxToDp(60), height: pxToDp(60) }}
                        rate={0.75}
                      />
                    ) : null}
                  </View>
                </>
              )}
            </View>
            <TouchableOpacity
              style={[styles.close_btn]}
              onPress={() => {
                this.props.close();
              }}
            >
              <Image
                style={[{ width: pxToDp(280), height: pxToDp(120) }]}
                source={require("../../../../images/childrenStudyCharacter/close_btn_1.png")}
              ></Image>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(76, 76, 89, .6)",
    ...appStyle.flexCenter,
  },
  inner: {
    borderRadius: pxToDp(40),
    backgroundColor: "#fff",
    padding: pxToDp(80),
    position: "relative",
    // flex:1,
  },
  sentence_wrap: {
    padding: pxToDp(40),
    backgroundColor: "#F2F5F7",
    borderRadius: pxToDp(40),
    borderWidth: pxToDp(4),
    borderColor: "#E6ECF2",
    ...appStyle.flexAliCenter,
  },
  play_btn_1: {
    position: "absolute",
    top: pxToDp(-40),
    right: pxToDp(-40),
  },
  close_btn: {
    width: pxToDp(280),
    marginTop: pxToDp(-60),
  },
  content: {
    ...appStyle.flexAliCenter,
    width: "80%",
    // backgroundColor:"pink"
  },
});
