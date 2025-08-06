import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import {
  size_tool,
  pxToDp,
  borderRadius_tool,
  margin_tool,
  padding_tool,
  getIsTablet,
  pxToDpWidthLs,
} from "../../util/tools";
import { connect } from "react-redux";
// import MasonryList from "@react-native-seoul/masonry-list";
import MasonryList from "reanimated-masonry-list";
import url from "../../util/url";
import RenderTag from "./tag";
import _ from "lodash";
import GoodAndCoin from "./goodAndCoin";
const hashStringToNumber = (str) => {
  const s = str;
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash += s.charCodeAt(i);
  }
  return hash;
};

const getImgUrl = (title, subject = "math") => {
  let defaultImgList = ["兜底图"];
  if (subject === "math") {
    defaultImgList = [
      "s1",
      "s10",
      "s12",
      "s13",
      "s14",
      "s15",
      "s17",
      "s19",
      "s2",
      "s20",
      "s21",
      "s22",
      "s23",
      "s24",
      "s25",
      "s26",
      "s27",
      "s28",
      "s29",
      "s3",
      "s4",
      "s40",
      "s42",
      "s43",
      "s44",
      "s6",
      "s7",
      "s8",
    ];
  } else if (subject === "chinese") {
    defaultImgList = [
      "c1",
      "c2",
      "c3",
      "c4",
      "c5",
      "c6",
      "c7",
      "c8",
      "c9",
      "c10",
    ];
  }
  const existImgList = [
    "8的乘法口诀",
    "9的乘法口诀",
    "用乘法算式解决问题",
    "认识东南西北",
    "2的乘法口诀",
    "3的乘法口诀",
    "认识计数单位“千”",
    "初步感知轴对称现象",
    "认识锐角、直角和钝角",
    "乘法的意义",
    "认识大面额人民币",
    "认识分",
    "除法算式个部分的名称",
    "选择合适的测量工具进行测量",
    "认识厘米",
    "除法的意义",
    "计算经过的时间",
    "乘法算式各部分的名称",
    "解决简单的购物问题",
    "调查数据的方法",
    "宣城见杜鹃花",
    "5的乘法口诀",
    "4的乘法口诀",
    "认识米",
    "枫桥夜泊",
    "千米与米的换算",
    "按每几个一份平均分",
    "100以内数连加的计算",
    "凉州词",
    "池上",
    "绝句",
    "渔歌子",
    "认识东北、西北、东南、西南",
    "认识时",
    "逢雪宿芙蓉山主人",
    "认识平均分",
    "记录数据解决问题",
    "寄扬州韩绰判官",
    "饮湖上初晴后雨",
    "钟面的认识",
    "认识毫米",
    "用不同的方式分物",
    "新嫁娘",
    "宿新市徐公店",
    "认识小面额人民币",
    "6的乘法口诀",
    "7的乘法口诀",
    "认识角",
    "子夜秋歌",
    "《浪淘沙》九首·其七",
    "认识分米",
    "认识千米",
    "时间单位的换算",
    "按指定的份数平均分",
    "用表内除法解决平均分问题",
  ];
  const existImgDict = _.zipObject(existImgList, "");
  return `paixiaoxue/square/${
    _.has(existImgDict, title)
      ? title
      : defaultImgList[hashStringToNumber(title) % defaultImgList.length]
  }.png`;
};

class WaterFull extends PureComponent {
  constructor(props) {
    super(props);
    // console.log(props.userInfo.toJS());
    const { needPage, page, total, totalPage, data } = this.props;
    this.state = {
      isPhone: !getIsTablet(),
      list: [],
      allList: [],
      // page: 1,
      safeInsets: props.safeInsets?.toJS(),
      needPage,
      page,
      total: 0,
      totalPage,
      data,
    };
    this.cannext = true;
  }

  getTitle = (item) => {
    let title = "",
      type = item.module,
      imgUrl = "",
      tagMsg = "",
      auther = "派效学",
      avater = require("../../images/square/ic_launcher.png"),
      showLike = false,
      itemAvatar = "personal_customized/pandaHead.png";

    switch (item.module) {
      case "math_knowledgeGraph":
        title = item.knowledge_name;
        imgUrl = getImgUrl(title, "math");
        break;
      case "chinese_toChineseDailySpeReadingStatics":
        // 古诗词
        title = `${item.name}`;
        imgUrl = getImgUrl(title, "chinese");
        tagMsg = item.author;
        break;
      case "paistory":
        title = item.name;
        imgUrl = item.title_image;
        break;
      case "math_thinkingTraining":
        title = `思维训练: ${item.name}`;
        imgUrl = getImgUrl(title, "math");
        break;
      case "math_cleverCalculation":
        title = `巧算: ${item.name} 等级:${item.level}`;
        imgUrl = getImgUrl(title, "math");
        break;
      case "common_story":
        title = item.title;
        imgUrl = item.image_cover ? item.image_cover : getImgUrl(title, "math");
        auther = item.user_name;
        itemAvatar = item.avatar ? item.avatar : itemAvatar;
        avater = { uri: `${url.baseURL}${itemAvatar}` };
        showLike = true;

        break;
      case "common_story_v2":
        title = item.title;
        imgUrl = item.image_cover ? item.image_cover : getImgUrl(title, "math");
        auther = item.user_name;
        itemAvatar = item.avatar ? item.avatar : itemAvatar;
        avater = { uri: `${url.baseURL}${itemAvatar}` };
        tagMsg = item.tag;
        showLike = true;
        break;
      case "common_story_v3":
        title = item.title;
        imgUrl = item.image_cover ? item.image_cover : getImgUrl(title, "math");
        auther = item.user_name;
        itemAvatar = item.avatar ? item.avatar : itemAvatar;
        avater = { uri: `${url.baseURL}${itemAvatar}` };
        tagMsg = item.tag;
        showLike = true;
        break;
      default:
        title = item.title;
        imgUrl = item.image_cover ? item.image_cover : getImgUrl(title, "math");
        auther = item.user_name;
        itemAvatar = item.avatar ? item.avatar : itemAvatar;
        avater = { uri: `${url.baseURL}${itemAvatar}` };
        tagMsg = item.tag;
        showLike = true;
        break;
    }
    return { title, type, imgUrl, tagMsg, auther, avater, showLike };
  };
  renderItem = (item) => {
    const { isPhone } = this.state;
    const { title, type, imgUrl, tagMsg, auther, avater, showLike } =
      this.getTitle(item);
    const { toDetail, bgColor } = this.props;
    const { status } = item;
    // let imgUrl = oldData[Math.floor(Math.random() * oldData.length)].url;
    return (
      <TouchableOpacity
        onPress={
          toDetail &&
          toDetail.bind(this, { ...item, imgUrl, title, auther, avater })
        }
      >
        <View
          style={[
            {
              width: pxToDp(isPhone ? 420 : 395),
              marginBottom: pxToDp(10),
              borderRadius: pxToDp(15),
              backgroundColor: "#D4CFCB",
              paddingBottom: pxToDp(5),
            },
          ]}
        >
          <View
            style={[
              {
                flex: 1,
                borderRadius: pxToDp(15),
                backgroundColor: bgColor ? bgColor : "#EFE9E6",
                overflow: "hidden",
              },
              status === "1" && {
                borderColor: "#FF925E",
                borderWidth: pxToDp(4),
                backgroundColor: "#fff",
              },
            ]}
          >
            <View
              style={[size_tool(isPhone ? 420 : 395), borderRadius_tool(15)]}
            >
              <Image
                source={{ uri: url.baseURL + imgUrl }}
                style={[
                  size_tool(isPhone ? 420 : 395),
                  borderRadius_tool(15),
                  status === "1" && {
                    borderColor: "#FF925E",
                    borderWidth: pxToDp(4),
                    position: "absolute",
                    top: pxToDp(-4),
                    left: pxToDp(-4),
                  },
                ]}
              />
              {status === "1" ? (
                <Image
                  source={require("../../images/square/hasHistory.png")}
                  style={[
                    size_tool(143, 71),
                    {
                      position: "absolute",
                      bottom: pxToDp(10),
                      right: pxToDp(10),
                    },
                  ]}
                  resizeMode="contain"
                />
              ) : null}
            </View>
            <View style={[padding_tool(6, 20, 10, 26)]}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[
                  styles.itemTitle,
                  isPhone && { fontSizex: pxToDpWidthLs(38) },
                ]}
              >
                {title}
              </Text>
              {/* {this.renderTag(type, tagMsg)} */}
              <RenderTag
                type={type}
                navigation={this.props.navigation}
                tagMsg={tagMsg}
              />
              <View style={[styles.bottomWrap]}>
                <View style={[styles.autherWrap]}>
                  <View
                    style={[
                      size_tool(50),
                      borderRadius_tool(25),
                      { overflow: "hidden" },
                    ]}
                  >
                    <Image
                      source={avater}
                      style={[size_tool(50), borderRadius_tool(25)]}
                      resizeMode="contain"
                    />
                  </View>

                  <Text
                    style={[
                      styles.autherName,
                      isPhone && { fontSizex: pxToDpWidthLs(25) },
                    ]}
                  >
                    {auther}
                  </Text>
                </View>

                {showLike ? (
                  <GoodAndCoin
                    current_user_like={item.current_user_like}
                    user_like_nums={item.user_like_nums}
                    onlyLike={true}
                    card_id={item.id}
                  />
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    if (
      props.total !== tempState.total ||
      !_.isEqual(props.data, tempState.data)
    ) {
      tempState.needPage = props.needPage;
      tempState.total = props.total;
      tempState.page = props.page;
      tempState.totalPage = props.totalPage;
      tempState.data = props.data;
      tempState.list = props.data;
      return tempState;
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(this.props.data, prevProps.data) && this.props.needPage) {
      this.splitArray(this.props.data);
    }
  }
  splitArray = (data) => {
    const chunkSize = 10;
    const chunkedData = data.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / chunkSize);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // 创建一个新的组
      }

      resultArray[chunkIndex].push(item);
      return resultArray;
    }, []);
    // console.log("需要分页", chunkedData[0]);
    this.setState({
      page: 1,
      list: chunkedData.length > 0 ? chunkedData[0] : [],
      allList: chunkedData,
    });
    // console.log("切割后的数组", chunkedData);
  };
  nextPage = () => {
    const { list, page, allList, needPage, totalPage } = this.state;
    const { token, nextPage } = this.props;

    if (!token && page === 2) {
      return;
    }
    if (needPage) {
      // 前端分页
      if (page < allList.length && this.cannext) {
        this.cannext = false;
        let listnow = [...list, ...allList[page]];
        this.setState(
          {
            page: page + 1,
            list: listnow,
          },
          () => {
            this.cannext = true;
          }
        );
      }
    } else {
      // console.log("页数", page, totalPage);
      if (page < totalPage) {
        nextPage && nextPage();
      }
    }
  };
  render() {
    const { isPhone, list, safeInsets } = this.state;
    const { data, loading, update, token } = this.props;
    // let listnow = data.slice(0, 10);
    // this.splitArray(data);
    // console.log("安全区", list);
    return (
      <View
        style={[
          { flex: 1 },
          isPhone
            ? padding_tool(
                0,
                safeInsets.right ? 20 : 50,
                0,
                safeInsets.left ? 20 : 50
              )
            : padding_tool(0, 20, 0, 20),
        ]}
      >
        <MasonryList
          data={list}
          numColumns={isPhone ? 4 : 5}
          renderItem={({ item }) => {
            return this.renderItem(item);
          }}
          refreshing={loading}
          onRefresh={() => {
            this.setState(
              {
                list: [],
                page: 1,
                allList: [],
              },
              () => update && update()
            );
          }}
          onEndReached={() => this.nextPage()}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  itemTitle: {
    fontSize: pxToDp(38),
    color: "#283139",
    // ...appFont.fontFamily_jcyt_700,
    marginBottom: pxToDp(10),
    fontWeight: "bold",
  },
  autherName: {
    fontSize: pxToDp(21),
    color: "#283139",
    marginLeft: pxToDp(15),
  },
  autherWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    safeInsets: state.getIn(["userInfo", "safeInsets"]),
    avatar: state.getIn(["userInfo", "avatar"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(WaterFull);
