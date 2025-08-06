import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Toast, Modal } from "antd-mobile-rn";
import { appStyle } from "../../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../../util/tools";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import api from "../../../../../util/http/api";
import axios from "../../../../../util/http/axios";
import { connect } from "react-redux";
import WordCard from "../../../../../component/WordCard";
import ViewControl from "react-native-image-pan-zoom";
import url from "../../../../../util/url";
import RichShowView from "../../../../../component/chinese/RichShowView";
import Header from '../../../../../component/Header'
let baseUrl = url.baseURL;

const zimu = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

class DoWrongExerciseDrag extends PureComponent {
  constructor(props) {
    super(props);
    this.info = this.props.userInfo.toJS();
    this.r_id = props.navigation.state.params.data.r_id;
    this.dropAnswer = "";
    this.state = {
      article: {},
      correct: "",
      answerIndex: -1,
      diagnose_notes: "",
      visible: false,
      explanation: "",
      orderImgArr: [], //笔画图片数组
      dropLine: [
        {
          width: 60,
          height: 60,
          marginRight: 12,
          borderBottomWidth: 2,
        },
      ],
      currentTopc: props.navigation.state.params.data,
    };
  }
  componentDidMount() {
    const { dropLine, currentTopc } = this.state;
    let data = currentTopc;
    let arr = [];
    if (data.strokes_image) {
      for (let i in data.strokes_image) {
        let obj = {};
        obj.order = i;
        obj.img = data.strokes_image[i];
        obj.child = data.strokes_image[i];
        arr.push(obj);
      }
    }
    if (dropLine.length > 1) {
      let arr = [];
      dropLine[0].child = null;
      arr = arr.concat(dropLine[0]);
      this.setState({
        dropLine: arr,
      });
    }
    this.setState({
      orderImgArr: arr,
    });
  }
  goBack() {
    NavigationUtil.goBack(this.props);
  }
  nextTopic = () => {
    const { currentTopc, dropLine } = this.state;
    if (!this.dropAnswer) {
      Toast.info("请选择答案", 1, undefined, false);
      return;
    }
    if (this.dropAnswer === currentTopc.correct_order) {
      //console.log("对对对对对对对对对对");
      Toast.success("恭喜你答对了 !!!", 2);
    } else {
      //console.log("错错错错错");
      this.setState({
        visible: true,
      });
    }
    let _dropLine = JSON.parse(JSON.stringify(dropLine)).splice(0, 1);
    _dropLine[0].child = "";
    this.setState({
      dropLine: _dropLine,
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  helpMe = (_isConst) => {
    this.setState({
      visible: true,
    });
  };
  onCloseHelp = () => {
    this.setState({
      visible: false,
    });
  };
  // 两个点的距离
  getDistance = (x1, y1, x2, y2) => {
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    var dis = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    return parseInt(dis);
  };
  // 拖拽的位置
  _onPanResponderRelease = (data) => {
    const { orderImgArr } = this.state;
    let dropLine = [];
    let rows = parseInt(orderImgArr.length / 12) + 1; //12 是一行能有多少张笔画图
    dropLine = dropLine.concat(this.state.dropLine); //这样才会更新视图
    let moveX = data.moveX; //结束坐标
    let moveY = data.moveY; //结束坐标
    let ditanceArr = [];
    let y = 200 + rows * 60; // 200是距离顶的距离，题目笔画图片行高60
    dropLine.forEach((i, index) => {
      ditanceArr.push(this.getDistance(moveX - 83, moveY - y, i.x, i.y)); //转化为答题区域的坐标值
    });
    let min = Math.min.apply(null, ditanceArr);
    let toIndex = ditanceArr.indexOf(min);

    if (min < 80) {
      if (!dropLine[toIndex].child) {
        dropLine.push({
          width: 60,
          height: 60,
          marginRight: 12,
          borderBottomWidth: 2,
        });
      }
      dropLine[toIndex].child = orderImgArr[data.indexImg].img;
      dropLine[toIndex].order = orderImgArr[data.indexImg].order;
      let answer = [];
      dropLine.forEach((i, index) => {
        if (i.child) {
          answer.push(i.order);
        }
      });
      this.dropAnswer = answer.join("");
      this.setState({
        dropLine,
      });
    }
  };
  _onLayout = (e) => {
    let dropLine = [];
    dropLine = dropLine.concat(this.state.dropLine); //这样才会更新视图
    if (dropLine.length === 1) {
      dropLine[0].target = e.nativeEvent.target;
      dropLine[0].x = e.nativeEvent.layout.x;
      dropLine[0].y = e.nativeEvent.layout.y;
    } else {
      dropLine[dropLine.length - 1].target = e.nativeEvent.target;
      dropLine[dropLine.length - 1].x = e.nativeEvent.layout.x;
      dropLine[dropLine.length - 1].y = e.nativeEvent.layout.y;
    }
    this.setState({
      dropLine,
    });
  };
  render() {
    const {
      article,
      visible,
      diagnose_notes,
      explanation,
      currentTopc,
      orderImgArr,
      dropLine,
    } = this.state;
    return (
      <View style={[padding_tool(40, 48, 48, 48), styles.container]}>
        <Header goBack={() => { this.goBack() }}></Header>
        <View style={[styles.content, padding_tool(48)]}>
          <ScrollView>
            <RichShowView
              divStyle={"font-size: x-large"}
              pStyle={"font-size: x-large"}
              spanStyle={"font-size: x-large"}
              width={pxToDp(1700)}
              value={
                currentTopc.private_exercise_stem
                  ? currentTopc.private_exercise_stem
                  : ""
              }
            ></RichShowView>
            {/* <HTML
            html={
              currentTopc.private_exercise_stem
                ? currentTopc.private_exercise_stem
                : " "
            }
          /> */}
            <View style={[appStyle.flexLine, appStyle.flexLineWrap]}>
              {orderImgArr.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      {
                        width: 60,
                        height: 60,
                        marginRight: 12,
                        marginBottom: 12,
                      },
                    ]}
                  >
                    <Image
                      style={[{ width: 60, height: 60, marginRight: 12 }]}
                      source={{ uri: item.img }}
                    ></Image>

                    {item.child ? (
                      <WordCard
                        imgUrl={item.child}
                        indexImg={index}
                        _onPanResponderRelease={(data) => {
                          this._onPanResponderRelease(data);
                        }}
                      ></WordCard>
                    ) : null}
                  </View>
                );
              })}
            </View>
            <View style={[appStyle.flexLine, appStyle.flexLineWrap]}>
              {dropLine.map((item, index) => {
                return (
                  <View
                    key={index}
                    onLayout={(event) => {
                      this._onLayout(event);
                    }}
                    style={[
                      {
                        width: item.width,
                        height: item.height,
                        marginRight: item.marginRight,
                        marginBottom: item.marginRight,
                        borderBottomWidth: item.borderBottomWidth,
                      },
                    ]}
                  >
                    {item.child ? (
                      <Image
                        source={{ uri: item.child }}
                        style={[
                          {
                            width: item.width,
                            height: item.height,
                            position: "absolute",
                            bottom: item.borderBottomWidth,
                          },
                        ]}
                      ></Image>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <TouchableOpacity style={[styles.nextBtn]} onPress={this.nextTopic}>
            <Text style={[styles.nextText]}>完成</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.helpBtn]} onPress={this.helpMe}>
            <Image
              source={require("../../../../../images/help.png")}
              style={[appStyle.helpBtn]}
            ></Image>
          </TouchableOpacity>
        </View>
        <Modal
          visible={visible}
          transparent={true}
          footer={[{ text: "关闭", onPress: this.onClose }]}
          style={[{ width: 180 }]}
        >
          <Image
            source={{ uri: baseUrl + currentTopc.character_order_image }}
            style={{ width: 150, height: 150 }}
          ></Image>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#373635",
  },
  content: {
    height: pxToDp(898),
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
  },
  aiticleTitle: {
    textAlign: "center",
    fontSize: pxToDp(40),
  },
  option: {
    width: pxToDp(52),
    height: pxToDp(52),
    borderRadius: pxToDp(26),
    borderWidth: pxToDp(2),
    borderColor: "#AAAAAA",
    color: "#AAAAAA",
    lineHeight: pxToDp(52),
    textAlign: "center",
    marginRight: pxToDp(24),
    fontSize: pxToDp(32),
  },
  isActive: {
    backgroundColor: "#FC6161",
    color: "#fff",
    borderColor: "#FC6161",
  },
  nextBtn: {
    width: pxToDp(192),
    height: pxToDp(64),
    backgroundColor: "#A86A33",
    borderRadius: pxToDp(48),
    position: "absolute",
    right: pxToDp(48),
    bottom: pxToDp(48),
  },
  nextText: {
    textAlign: "center",
    lineHeight: pxToDp(64),
    color: "#fff",
    fontSize: pxToDp(28),
  },
  helpBtn: {
    position: "absolute",
    top: pxToDp(48),
    right: pxToDp(48),
  },
});
const mapStateToProps = (state) => {
  // 取数据
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  // 存数据
  return {};
};
export default connect(mapStateToProps, mapDispathToProps)(DoWrongExerciseDrag);
