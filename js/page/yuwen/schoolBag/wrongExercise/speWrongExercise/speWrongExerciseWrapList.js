import React, { Component, PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { connect } from "react-redux";
import axios from " ../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { size_tool, pxToDp, padding_tool, fontFamilyRestoreMargin } from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
import Header from '../../../../../component/Header'
import OtherUserInfo from "../../../../../component/otherUserinfo";
import { T } from "lodash/fp";

const unitMap = {
  "1": "一单元",
  "2": "二单元",
  "3": "三单元",
  "4": "四单元",
  "5": "五单元",
  "6": "六单元",
  "7": "七单元",
  "8": "八单元",
  "9": "九单元",
  "10": "十单元",
  "11": "十一单元",
  "12": "十二单元",
  "13": "十三单元",
  "14": "十四单元",
  "15": "十五单元",
};
class SpeWrongExerciseErapList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkIndex: 0,
      leftNavList: [
        {
          color: "#3CB5FF",
          img: require("../../../../../images/flowList1.png"),
          selectIocn: require("../../../../../images/desk_gou2.png"),
          isActive: true,
          text: "今天的错题",
        },
        {
          color: "#F56B7F",
          img: require("../../../../../images/flowList2.png"),
          selectIocn: require("../../../../../images/desk_gou2.png"),
          isActive: false,
          text: "本周的错题",
        },
        {
          color: "#F7BF34",
          img: require("../../../../../images/flowList3.png"),
          selectIocn: require("../../../../../images/desk_gou2.png"),
          isActive: false,
          text: "本月的错题",
        },
        {
          color: "#F7BF34",
          img: require("../../../../../images/flowList4.png"),
          selectIocn: require("../../../../../images/desk_gou2.png"),
          isActive: false,
          text: "本学期的错题",
        },
      ],
      knowList: {},
      type: '1',
      page: 1,
      readingList: [],
      isNext: true,
    };
    this.isSend = true
  }

  static navigationOptions = {
    // title:'答题'
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  toDoHomework = (exercise) => {
    let { type } = this.state;
    //console.log("=========================", exercise);
    if (type === "0") {
      NavigationUtil.toSpeWrongExerciseList({
        ...this.props.propsData,
        data: {
          ...this.props.propsData,
          knowledge: exercise,
          index: this.state.checkIndex,
        },
      });
    }
    if (type === "1") {
      // 智能句
      NavigationUtil.toSpeWrongExerciseListSmart({
        ...this.props.propsData,
        data: {
          knowledge: exercise,
          index: this.state.checkIndex,
        },
      });
    }
    if (type === "2") {
      // 阅读理解
      NavigationUtil.toSpeWrongExerciseListRead({
        ...this.props.propsData,
        data: {
          knowledge: exercise,
          index: this.state.checkIndex,
        },
      });
    }
  };

  componentDidMount() {
    let type = this.props.type;
    this.setState({
      type,
    });
    this.getList(this.state.checkIndex);
  }
  getList = (index) => {
    const data = this.props.userInfo.toJS();
    let type = this.props.type;
    // type   0 字词  1 智能句 2 阅读 3 习作
    switch (type) {
      case "0":
        axios
          .get(
            `${api.getSpeWrongWord}/${data.checkGrade}/${data.checkTeam}/${index + 1}`
          )
          .then((res) => {
            let list = res.data.data;
            this.setState({
              knowList: list,
            });
          });
        break;
      case "1":
        this.getSentence()
        break;
      case "2":
        this.getArticle();
        break;
      case "3":
        break;
      default:
        break;
    }
  };
  getSentence = () => {
    const data = this.props.userInfo.toJS();
    const { page, checkIndex, knowList } = this.state;
    if (!this.isSend) return
    this.isSend = false
    axios
      .get(
        `${api.getSentenceWrongKno}/${data.checkGrade}/${data.checkTeam}/${checkIndex + 1}?page=${page}`
      )
      .then((res) => {
        let _readingList = page === 1 ? res.data.data : knowList.concat(res.data.data);
        let _isNext = _readingList.length === res.data.total ? false : true;
        // list.sentence = res.data.data;
        // console.log("list", _isNext, _readingList.length, res.data.total)
        this.isSend = true
        this.setState({
          knowList: _readingList,
          isNext: _isNext,
        });
      });
  }
  getArticle = () => {
    const data = this.props.userInfo.toJS();
    const { page, checkIndex, readingList } = this.state;
    if (!this.isSend) return
    this.isSend = false
    axios
      .get(
        `${api.errorReadArticle}/${data.checkGrade}/${data.checkTeam}/${checkIndex + 1
        }?page=${page}`
      )
      .then((res) => {
        let _readingList =
          page === 1 ? res.data.data : readingList.concat(res.data.data);
        let _isNext = _readingList.length === res.data.total ? false : true;
        this.isSend = true
        this.setState({
          readingList: _readingList,
          isNext: _isNext,
        });
      });
  };
  checkThis = (index) => {
    let leftNavList = [];
    leftNavList = leftNavList.concat(this.state.leftNavList);
    leftNavList.forEach((i) => {
      i.isActive = false;
    });
    leftNavList[index].isActive = true;
    this.setState(
      {
        checkIndex: index,
        leftNavList,
        page: 1,
        isNext: true
      },
      () => {
        this.getList(index);
      }
    );
  };
  nextPage = (e) => {
    const { page, isNext, type } = this.state;
    // 翻页
    if (!isNext) return;
    this.setState(
      {
        page: page + 1,
      },
      () => {
        type === '2' ?
          this.getArticle() :
          this.getSentence()
          ;
      }
    );
    // }
  };

  componentDidUpdate(props) {
    let temState = { ...this.state }
    // console.log("componentDidUpdate", props.type, temState.type)
    if (props.type !== temState.type) {
      this.setState({
        ...temState
      }, () => {
        this.getList(temState.checkIndex)
      })
    }

  }

  static getDerivedStateFromProps(props, state) {
    let temState = { ...state }
    // console.log("getDerivedStateFromProps", props.type, temState.type)
    if (props.type !== temState.type) {
      temState.type = props.type
    }
    return temState
  }

  render() {
    const { type, leftNavList, knowList, readingList } = this.state;

    let title = ''
    switch (type) {
      case "0":
        title = '字词积累'
        break;
      case "1":
        title = '智能句'

        break;
      case "2":
        title = '专项阅读理解'

        break;
    }
    return (
      <View
        style={[
          { flex: 1, },
        ]}
      >
        <View style={[styles.con,]}>
          <View style={[styles.left]}>
            {leftNavList.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.checkThis(index);
                  }}
                  key={index}
                  style={[styles.title, {
                    backgroundColor: item.isActive ? '#A86A33' : '#FFF5E4',
                  }]}
                >
                  <Text
                    style={[styles.titleTxt, {
                      color: item.isActive ? '#fff' : '#A86A33',
                      borderColor: item.isActive ? '#FFF1DE' : '#FFF5E4',
                    }, appFont.fontFamily_syst, fontFamilyRestoreMargin('', '', { lineHeight: pxToDp(52) })]}
                  >{item.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {type === "0" ? (
            <View style={styles.MainWrap}>
              <View style={[styles.bigItem, { marginRight: pxToDp(32) }]}>
                <View
                  style={styles.wordTitle}
                >
                  <Text style={[{ color: "#ffffff", fontSize: pxToDp(32) }, appFont.fontFamily_syst]}>字</Text>
                </View>
                <View
                  style={styles.wordItemWrap}
                >
                  <ScrollView style={{ maxHeight: pxToDp(540) }}>
                    <View style={styles.mainInWrap}>
                      {knowList.character && knowList.character.length > 0
                        ? knowList.character.map((item, index) => {
                          return (
                            <TouchableOpacity
                              key={index}
                              onPress={() => this.toDoHomework(item)}
                              style={styles.wordItem}
                            >
                              <Text style={[{ color: "#333", fontSize: pxToDp(32) }, appFont.fontFamily_syst]}>{item}</Text>
                            </TouchableOpacity>
                          );
                        })
                        : null}
                    </View>
                  </ScrollView>
                </View>
              </View>
              <View style={styles.bigItem}>
                <View
                  style={styles.wordTitle}
                >
                  <Text style={[{ color: "#ffffff", fontSize: pxToDp(36) }, appFont.fontFamily_syst]}>词语</Text>
                </View>
                <View
                  style={styles.wordItemWrap}
                >
                  <ScrollView style={{ maxHeight: pxToDp(540) }}>
                    <View style={styles.mainInWrap}>

                      {knowList.word && knowList.word.length > 0 ? (
                        knowList.word.map((item, index) => {
                          return (
                            <TouchableOpacity
                              key={index}
                              onPress={() => this.toDoHomework(item)}
                              style={{ flexDirection: 'row', marginRight: pxToDp(32), flexWrap: 'wrap' }}
                            >
                              {
                                item.split('').map((litem, lindex) => {
                                  return <View style={[styles.wordItem, { marginLeft: pxToDp(-3), marginRight: 0 }]} key={lindex}>
                                    <Text style={[{ color: "#333", fontSize: pxToDp(32) }, appFont.fontFamily_syst]}>{litem}</Text>
                                  </View>
                                })
                              }
                            </TouchableOpacity>
                          );
                        })
                      ) : (
                        <Text> </Text>
                      )}
                    </View>

                  </ScrollView>
                </View>
              </View>
            </View>
          ) : null}
          {type === "1" ? (
            <View style={styles.MainWrap}>
              <View style={[styles.wordItemWrap, { width: pxToDp(1580), flexDirection: 'column' }]}>
                <View
                  style={[styles.sentenceTitle, {}]}
                >
                  <Image style={size_tool(48)}
                    source={require('../../../../../images/chineseHomepage/wrongSentenceTitle.png')}
                  />
                  <Text style={[{ color: "#333", fontSize: pxToDp(36), marginLeft: pxToDp(12) }, appFont.fontFamily_syst, fontFamilyRestoreMargin('', -30)]}>智能句</Text>
                </View>
                <ScrollView style={{ maxHeight: pxToDp(540) }} onMomentumScrollEnd={this.nextPage}>
                  <View style={[styles.mainInWrap, { justifyContent: 'space-between', paddingTop: pxToDp(20) }]}>
                    {knowList && knowList.length > 0
                      ? knowList.map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={{ minHeight: pxToDp(200), width: '100%', borderRadius: pxToDp(16), backgroundColor: '#fff', marginBottom: pxToDp(32), padding: pxToDp(32) }}>
                            <View style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between', paddingBottom: pxToDp(18), borderBottomColor: '#EDEDED', borderBottomWidth: pxToDp(2),
                              marginBottom: pxToDp(14)
                            }}>
                              <Text style={[{ fontSize: pxToDp(28), color: '#FFAE00' }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>{item.unit_name + '/' + item.learning_name}</Text>
                              <TouchableOpacity
                                key={index}
                                onPress={() => this.toDoHomework(item)}
                                style={{
                                }}
                              >
                                <Image
                                  source={require('../../../../../images/chineseHomepage/wrongTodo.png')}
                                  style={[size_tool(48)]}
                                />
                              </TouchableOpacity>
                            </View>
                            <Text style={[{ color: "#333", fontSize: pxToDp(36), }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>
                              {item.sentence}
                            </Text>
                          </View>
                        );
                      })
                      : null}
                  </View>
                </ScrollView>
              </View>

            </View>
          ) : null}
          {type === "2" ? (
            <View style={styles.MainWrap}>
              <View style={[styles.bigItem,]}>
                <View
                  style={[styles.wordTitle, { width: pxToDp(196) }]}
                >
                  <Text style={[{ color: "#ffffff", fontSize: pxToDp(32) }, appFont.fontFamily_syst]}>阅读理解</Text>
                </View>
                <View style={[styles.wordItemWrap, { width: pxToDp(1580), flexDirection: 'column', }]}>

                  <ScrollView style={{ maxHeight: pxToDp(540) }} onMomentumScrollEnd={this.nextPage}>
                    <View style={[styles.mainInWrap, { justifyContent: 'space-between', paddingTop: pxToDp(20), width: pxToDp(1500) }]}>
                      {readingList && readingList.length > 0
                        ? readingList.map((item, index) => {
                          return (
                            <View
                              key={index}
                              style={{ minHeight: pxToDp(200), width: pxToDp(730), borderRadius: pxToDp(16), backgroundColor: '#fff', marginBottom: pxToDp(32), padding: pxToDp(32) }}>
                              <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between', paddingBottom: pxToDp(18), borderBottomColor: '#EDEDED', borderBottomWidth: pxToDp(2),
                                marginBottom: pxToDp(14)
                              }}>
                                <Text style={[{ fontSize: pxToDp(28), color: '#FFAE00' }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>{item.article_type + '/' + item.article_category}</Text>
                                <TouchableOpacity
                                  key={index}
                                  onPress={() => this.toDoHomework(item)}
                                  style={{
                                  }}
                                >
                                  <Image
                                    source={require('../../../../../images/chineseHomepage/wrongTodo.png')}
                                    style={[size_tool(48)]}
                                  />
                                </TouchableOpacity>
                              </View>
                              <Text style={[{ color: "#333", fontSize: pxToDp(36), }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>
                                {item.name} —— （作者：{item.author}）
                              </Text>
                            </View>
                          );
                        })
                        : null}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          ) : null}

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  con: {
    // flexDirection: "row",
  },
  left: {
    width: "100%",
    height: pxToDp(100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: pxToDp(165),
    paddingRight: pxToDp(165),
    marginBottom: pxToDp(-2)
  },
  wordTitle: {
    backgroundColor: '#FFAE00',
    width: pxToDp(140),
    height: pxToDp(72),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopEndRadius: pxToDp(8),
    borderTopLeftRadius: pxToDp(8),
    marginLeft: pxToDp(32)
  },
  wordItem: {
    width: pxToDp(64),
    height: pxToDp(64),
    borderWidth: pxToDp(2),
    borderColor: '#DFD7BC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: pxToDp(32),
    marginBottom: pxToDp(32),
    borderRadius: pxToDp(4)
  },
  wordItemWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    borderRadius: pxToDp(24),
    borderColor: '#FFAE00',
    backgroundColor: '#FFF5E4',
    width: pxToDp(770),
    height: '100%',
    borderWidth: pxToDp(8),
    padding: pxToDp(32)
  },
  MainWrap: {
    borderRadius: pxToDp(32),
    flexDirection: 'row',
    backgroundColor: '#A86A33',
    height: pxToDp(772),
    padding: pxToDp(32)
  },
  bigItem: {
    paddingBottom: pxToDp(23),
    height: pxToDp(648),
  },
  mainInWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // width: '100%',
    paddingLeft: pxToDp(3)
  },
  title: {
    width: pxToDp(286),
    height: pxToDp(100),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: pxToDp(24),
    borderTopEndRadius: pxToDp(24),
  },
  titleTxt: {
    fontSize: pxToDp(36),
    borderWidth: pxToDp(3),
    borderStyle: 'dashed',
    borderRadius: pxToDp(16),
    paddingTop: pxToDp(4),
    paddingBottom: pxToDp(4),
    width: pxToDp(250),
    textAlign: 'center'
  },
  sentenceTitle: {
    flexDirection: 'row',
    paddingLeft: pxToDp(32)
  }
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
)(SpeWrongExerciseErapList);
