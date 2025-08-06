import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Platform,
} from "react-native";
import { appStyle, appFont } from "../../../../../../../theme";
import url from "../../../../../../../util/url";
import {
    Shape,
    Surface,
    Path,
    Text as TextArt,
    Group,
} from "@react-native-community/art";
import { pxToDp, size_tool } from "../../../../../../../util/tools";
import Sound from "react-native-sound";
import Audio from "../../../../../../../util/audio";
import fonts from "../../../../../../../theme/fonts";

let baseUrl = url.baseURL;
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// 第一层是随机的颜色(5种) 第二层是根据单词长度取图片大小

const COLOR_MAP = {
    1: "rgba(171,229,237,0.4)",
    2: "rgba(170,167,239,0.4)",
    3: "rgba(242,164,120,0.4)",
    4: "rgba(214,132,113,0.4)",
    5: "rgba(127,216,201,0.4)",
};
class ConnectionOptions extends PureComponent {
    constructor(props) {
        super(props);
        // console.log('==============',this.props.sendobj)
        this.state = {
            currentTopic: {},
            nowCheckObj: {},
            checkList: [],
            leftList: [],
            rightList: [],
            isLeft: false,
            strokeList: [],
            lineViewArr: [],
            isRender: true,
            corlorIndex: 1,
            pausedfail: true,
        };
        this.pathArr = [];
        this.layoutMapLR = new Map(); //组件位置信息
        this.layoutMapLRitemL = new Map(); //组件位置信息
        this.layoutMapLRitemR = new Map(); //组件位置信息
        this.noNumber = 0;
        this.audio = undefined;
        this.clickNumber = 0;
        this.topicIndex = 0;
        this.rankingAudioMap = {
            0: "fantastic.m4a",
            2: "tryagain.m4a",
        };
        this.rankingAudio = undefined;
        this.failAudiopath = require("../../../../../../../res/data/fail.mp3");
        this.audio1 = React.createRef();
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    audioPausedSuccess = () => this.setState({ pausedfail: true });

    static getDerivedStateFromProps(props, state) {
        const { isRender } = state;
        // console.log("getDerivedStateFromProps渲染123", props.currentTopic.choice_content);

        if (
            props.currentTopic.l_p_id !== state.currentTopic.l_p_id ||
            (Object.keys(props?.currentTopic).length > 0 && isRender)
        ) {
            let tempState = { ...state };
            let currentTopic = JSON.parse(JSON.stringify(props.currentTopic));
            let list = [],
                leftList = [],
                rightList = [];
            for (let n = 0; n < currentTopic.choice_content.length; n++) {
                let i = currentTopic.choice_content[n];
                let obj = {
                    left: i.left,
                    right: [],
                };
                list.push(obj);
                leftList.push({
                    value: i.left,
                    index: n,
                });
                rightList.push(...i.right);
            }
            tempState.checkList = list;
            tempState.leftList = leftList.sort(() => Math.random() - 0.5);
            tempState.rightList = rightList.sort(() => Math.random() - 0.5);
            tempState.currentTopic = props.currentTopic;
            tempState.nowCheckObj = {};
            tempState.strokeList = [];
            tempState.lineViewArr = [];
            tempState.isRender = false;
            tempState.isLeft =
                props.currentTopic.combination_type === "1" ? false : true; //1上下   2左右
            // tempState.isLeft = props.currentTopic.combination_type === "1" ? true : false; //1上下   2左右
            tempState.exerciseLen = props.exerciseLen;
            tempState.corlorIndex = Math.floor(Math.random() * (5 - 1 + 1) + 1);
            return tempState;
        }
        return null;
    }

    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    onLayoutWrap = (key, e) => {
        let { x, y, width, height } = e.nativeEvent.layout;
        let obj = {};
        obj.x = x;
        obj.y = y;
        this.layoutMapLR.set(key, { ...obj });
        // console.log("最大父级左右父级", this.layoutMapLR, e.nativeEvent.layout);
    };
    onLayoutItem = (key, e, index) => {
        const { isLeft } = this.state;
        let { x, y, width, height } = e.nativeEvent.layout;
        let obj = {};
        if (isLeft) {
            // 左右坐标计算
            if (key === "leftItem") {
                obj.x = x + width; //换到右上角
                obj.y = y + height / 2;
                this.layoutMapLRitemL.set(index, { ...obj });
            }
            if (key === "rightItem") {
                obj.x = x; //右边不需要换
                obj.y = y + height / 2;
                this.layoutMapLRitemR.set(index, { ...obj });
            }
        } else {
            // 上下坐标计算
            if (key === "leftItem") {
                obj.x = x + width / 2; //换到中间那个点
                obj.y = y + height;
                this.layoutMapLRitemL.set(index, { ...obj });
            }
            if (key === "rightItem") {
                obj.x = x + width / 2;
                obj.y = y;
                this.layoutMapLRitemR.set(index, { ...obj });
            }
        }
        // console.log("左右子集", this.layoutMapLRitemL, this.layoutMapLRitemR);
    };
    checkValue = (index, leftOrRight, value) => {
        const { nowCheckObj, checkList, strokeList, currentTopic } = this.state;
        let checkObj = { ...nowCheckObj };
        let list = JSON.parse(JSON.stringify(checkList));
        let canvasList = [...strokeList];
        checkObj[leftOrRight] = value;
        let fatherLayout = this.layoutMapLR.get("father");
        let leftWrapLayout = this.layoutMapLR.get("leftWrap");
        let rightWrapLayout = this.layoutMapLR.get("rightWrap");
        // 上下选择题，左右选择题线的坐标算法一样
        if (leftOrRight === "left") {
            checkObj.index = index;
            let layout = this.layoutMapLRitemL.get(index);
            checkObj.left_y = layout.y + fatherLayout.y + leftWrapLayout.y; //本身对于父元素的y+父元素的y+父元素的父元素的y
            checkObj.left_x = layout.x + fatherLayout.x + leftWrapLayout.x; //本身对于父元素的x+父元素的x+父元素的父元素的x
        } else {
            let layout = this.layoutMapLRitemR.get(index);
            checkObj.right_y = layout.y + fatherLayout.y + rightWrapLayout.y; //本身对于父元素的y+父元素的y+父元素的父元素的y
            checkObj.right_x = layout.x + fatherLayout.x + rightWrapLayout.x; //本身对于父元素的x+父元素的x+父元素的父元素的x
        }

        if (checkObj.left && checkObj.right) {
            // 左右都选择了
            let littlelist = [];
            for (let i = 0; i < list.length; i++) {
                if (list[i].left === checkObj.left) {
                    littlelist = [...list[i].right];
                    break;
                }
            }
            if (littlelist.length > 0) {
                // 已经有连线
                if (littlelist.indexOf(checkObj.right) !== -1) {
                    // 有相同的，要去掉
                    littlelist.splice(littlelist.indexOf(checkObj.right), 1);
                    // 找到这根线，去掉
                    canvasList = canvasList.filter(
                        (item) =>
                            item.left !== checkObj.left || item.right !== checkObj.right
                    );
                } else {
                    littlelist.push(checkObj.right);
                    canvasList.push(checkObj);
                }
            } else {
                littlelist.push(checkObj.right);
                canvasList.push(checkObj);
            }
            for (let i = 0; i < list.length; i++) {
                if (list[i].left === checkObj.left) {
                    list[i].right = [...littlelist];
                    break;
                }
            }
            checkObj = {};
        }
        if (currentTopic.combination_two === "audio" && leftOrRight === "right") {
            this.playAudio(value);
        }
        if (currentTopic.combination_one === "audio" && leftOrRight === "left") {
            this.playAudio(value);
        }
        this.setState(
            {
                nowCheckObj: checkObj,
                strokeList: canvasList,
                checkList: list,
            },
            () => {
                this.renderLine(canvasList, true);
            }
        );
    };
    // 拿arr2中不存在在arr1中的值
    getArrDifference = (arr1, arr2) => {
        const difference = arr1.filter((v) => {
            return arr2.indexOf(v) === -1;
        });
        return difference;
    };
    getWrongList = () => {
        const { rightList, checkList, currentTopic, exerciseLen } = this.state;
        let list = currentTopic.choice_content; //答案
        let canvasList = this.state.strokeList;
        // console.log("/////////////////////", checkList, canvasList, list);
        if (canvasList.length === 0) {
            // console.log("请连线");
            return;
        }
        let wrongCanvasList = [];
        for (let i = 0; i < checkList.length; i++) {
            for (let j = 0; j < list.length; j++) {
                if (checkList[i].left === list[j].left) {
                    // console.log(checkList[i], list[j]);
                    let arrDifference = this.getArrDifference(
                        checkList[i].right,
                        list[j].right
                    );
                    // console.log("错误的答案", arrDifference);
                    if (arrDifference.length > 0) {
                        arrDifference.forEach((child) => {
                            wrongCanvasList.push(
                                ...canvasList.filter(
                                    (item) => item.left === list[i].left && item.right === child
                                )
                            );
                        });
                    }
                    break;
                }
            }
        }
        // if (canvasList.length >= rightList.length) {
        // 每个答案都被连了线的情况
        // this.renderLine(wrongCanvasList, false);   错误回显

        this.clickNumber++; // 某一题的点击次数
        if (this.clickNumber === 1) {
            console.log("连的线不够算错123", wrongCanvasList);

            if (canvasList.length < rightList.length) {
                // 连的线不够算错
                this.props.saveTopic([{}]);
            } else {
                this.props.saveTopic(wrongCanvasList);
            }
        }

        if (wrongCanvasList.length > 0) {
            // 有错
            this.noNumber++;
            // this.props.showHelp()
            if (this.noNumber < 2) {
                this.props.showHelp();
            } else {
                this.noNumber = 0;
                this.props.nextTopic(0);
                this.init();
            }
            // this.noNumber < 2 ? this.props.showHelp() : (this.noNumber = 0, this.props.nextTopic());
            // if (this.noNumber < 3) this.playRankingAudio(2)
            this.audio1.current.replay();
            this.setState({
                isRender: false,
                pausedfail: false,
            });
        } else {
            // 对
            if (canvasList.length < rightList.length) {
                console.log("连的线不够算错");
                // if (this.noNumber < 3) this.playRankingAudio(2)
                // 连的线不够算错
                this.noNumber++;
                // this.props.showHelp()
                if (this.noNumber < 2) {
                    this.props.showHelp();
                } else {
                    this.noNumber = 0;
                    this.props.nextTopic(0);
                    this.init();
                }
                this.audio1.current.replay();
                this.setState({
                    isRender: false,
                    pausedfail: false,
                });
                return;
            }
            // this.playRankingAudio(0)
            // if (this.topicIndex + 1 === exerciseLen) {
            // 已经是最后一题了
            // this.props.showStatistic();
            //   return;
            // }
            this.props.nextTopic(this.noNumber === 0 ? 1 : 0);
            this.init();
            this.setState({
                isRender: true,
            });
        }
    };
    //关闭解析后继续答题
    tryAgian = () => {
        const { exerciseLen } = this.state;
        if (this.props.isWrong) {
            this.init();
            this.props.nextTopic(0);
        }
        if (this.noNumber === 2) {
            // if (this.topicIndex + 1 === exerciseLen) {
            //   // 已经是最后一题了
            //   this.props.showStatistic();
            //   return;
            // }
            this.init();
            this.props.nextTopic(0);
        }
        // console.log("题目题号", this.noNumber, exerciseLen);
        this.setState({
            isRender: true,
        });
    };

    // 初始化数据
    init = () => {
        this.noNumber = 0;
        this.clickNumber = 0;
    };

    showLine = (pathArr, istrue) => {
        let lineArr = []; //根据父节点有几个子节点
        // console.log("showLine", this.pathArr);
        for (let i = 0; i < pathArr.length; i++) {
            lineArr.push(
                <Shape
                    key={Math.random(i) + "shape"}
                    d={this.pathArr[i]}
                    stroke={istrue ? "#4C94FF" : "red"}
                    strokeWidth={pxToDp(8)}
                />
            );
        }
        if (istrue) {
            // 没做错
            this.setState({ lineViewArr: [...lineArr] });
        } else {
            // 有做错
            let olsList = [...this.state.lineViewArr];
            this.setState({ lineViewArr: [...olsList, ...lineArr] }); //对的线和错的线
        }
    };

    //渲染两个节点之间的连线
    renderLine = (strokeList, isTrue) => {
        // console.log("renderLine");
        // const { strokeList } = this.state
        this.pathArr = [];
        for (let i = 0; i < strokeList.length; i++) {
            let path = Path();
            path.moveTo(strokeList[i].left_x, strokeList[i].left_y);
            path.lineTo(strokeList[i].right_x, strokeList[i].right_y);
            path.close();
            this.pathArr.push(path);
        }
        this.showLine(this.pathArr, isTrue);
    };
    getBgindex = (len) => {
        if (len <= 10) {
            return {
                index: 1,
                width: pxToDp(210),
                height: pxToDp(142),
            };
        }
        if (len > 10 && len <= 15) {
            return {
                index: 2,
                width: pxToDp(260),
                //   width: pxToDp(248),
                height: pxToDp(142),
            };
        }
        return {
            index: 3,
            width: pxToDp(300),
            height: pxToDp(142),
        };
        // if (len <= 2) {
        //   return {
        //     index: 1,
        //     width: pxToDp(200),
        //     height: pxToDp(142),
        //   };
        // }
        // if (len > 2 && len <= 3) {
        //   return {
        //     index: 2,
        //     width: pxToDp(248),
        //     height: pxToDp(142),
        //   };
        // }
        // return {
        //   index: 3,
        //   width: pxToDp(300),
        //   height: pxToDp(142),
        // };
    };
    renderLeft = () => {
        const { currentTopic, leftList, corlorIndex, isLeft, nowCheckObj } =
            this.state;
        let html = "";
        console.log("左边", nowCheckObj.left);
        if (currentTopic.combination_one === "text") {
            html = leftList.map((item, index) => {
                let detailObj = "";
                if (item.value.split(" ").length === 1)
                    detailObj = this.getBgindex(item.value.length);
                return (
                    <TouchableOpacity
                        style={[
                            styles.boxStyle,
                            {
                                backgroundColor:
                                    nowCheckObj.left === item.value ? "#447BE5" : "#E7E7F2",
                            },
                        ]}
                        onPress={() => this.checkValue(index, "left", item.value)}
                        key={index}
                        onLayout={(e) => this.onLayoutItem("leftItem", e, index)}
                    >
                        <View
                            style={[
                                styles.boxStyleIn,
                                {
                                    backgroundColor:
                                        nowCheckObj.left === item.value ? "#4C94FF" : "#F5F5FA",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    {
                                        color: nowCheckObj.left === item.value ? "#fff" : "#475266",
                                        fontSize: pxToDp(40),
                                        lineHeight: pxToDp(50),
                                    },
                                    appFont.fontFamily_syst,
                                    fonts.fontFamily_syst_bold,
                                ]}
                            >
                                {item.value}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            });
        }
        if (currentTopic.combination_one === "image") {
            let styleObj = {
                width: pxToDp(260),
                height: pxToDp(260),
            };
            if (Platform.OS === "android") {
                styleObj = {
                    width: pxToDp(200),
                    height: pxToDp(200),
                };
            }
            html = leftList.map((item, index) => {
                return (
                    <TouchableOpacity
                        style={[
                            styles.boxStyle,
                            {
                                backgroundColor:
                                    nowCheckObj.left === item.value ? "#447BE5" : "#E7E7F2",
                            },
                        ]}
                        onPress={() => this.checkValue(index, "left", item.value)}
                        key={index}
                        onLayout={(e) => this.onLayoutItem("leftItem", e, index)}
                    >
                        <View
                            style={[
                                styles.boxStyleIn,
                                {
                                    backgroundColor:
                                        nowCheckObj.left === item.value ? "#4C94FF" : "#F5F5FA",
                                },
                            ]}
                        >
                            <Image
                                style={{
                                    width: styleObj.width,
                                    height: styleObj.height,
                                }}
                                source={{
                                    uri: baseUrl + item.value,
                                }}
                                resizeMode={"contain"}
                            ></Image>
                        </View>
                    </TouchableOpacity>
                );
            });
        }
        if (currentTopic.combination_one === "audio") {
            html = leftList.map((item, index) => {
                console.log("左边item", item.value, nowCheckObj.left === item.value);
                return (
                    <TouchableOpacity
                        style={[
                            styles.boxStyle,
                            {
                                backgroundColor:
                                    nowCheckObj.left === item.value ? "#447BE5" : "#E7E7F2",
                            },
                        ]}
                        onPress={() => this.checkValue(index, "left", item.value)}
                        key={index}
                        onLayout={(e) => this.onLayoutItem("leftItem", e, index)}
                    >
                        <View
                            style={[
                                styles.boxStyleIn,
                                {
                                    backgroundColor:
                                        nowCheckObj.left === item.value ? "#4C94FF" : "#F5F5FA",
                                },
                            ]}
                        >
                            <Image
                                style={[size_tool(nowCheckObj.left === item.value ? 40 : 80)]}
                                source={
                                    nowCheckObj.left === item.value
                                        ? require("../../../../../../../images/chineseHomepage/pingyin/new/audioPlaying.png")
                                        : require("../../../../../../../images/chineseHomepage/pingyin/new/audioPlay.png")
                                }
                                resizeMode={"contain"}
                            ></Image>
                        </View>
                    </TouchableOpacity>
                );
            });
        }
        return (
            // <>
            <View
                onLayout={(e) => this.onLayoutWrap("leftWrap", e)}
                style={{
                    justifyContent: "space-around",
                    flexDirection: isLeft ? "column" : "row",
                    zIndex: 999,
                    paddingRight: isLeft ? pxToDp(10) : 0,
                    paddingBottom: isLeft ? 0 : pxToDp(10),
                    // width: !isLeft ? '100%' : pxToDp(412),
                }}
            >
                {html}
            </View>
            // </>
        );
    };
    renderRight = () => {
        const { currentTopic, rightList, corlorIndex, isLeft, nowCheckObj } =
            this.state;
        let html = "";
        console.log("右边", nowCheckObj.right);
        if (currentTopic.combination_two === "text") {
            html = rightList.map((item, index) => {
                let detailObj = "";
                if (item.split(" ").length === 1)
                    detailObj = this.getBgindex(item.length);
                return (
                    <TouchableOpacity
                        style={[
                            styles.boxStyle,
                            {
                                backgroundColor:
                                    nowCheckObj.right === item ? "#447BE5" : "#E7E7F2",
                            },
                        ]}
                        onPress={() => this.checkValue(index, "right", item)}
                        key={index}
                        onLayout={(e) => this.onLayoutItem("rightItem", e, index)}
                    >
                        <View
                            style={[
                                styles.boxStyleIn,
                                {
                                    backgroundColor:
                                        nowCheckObj.right === item ? "#4C94FF" : "#F5F5FA",
                                    paddingLeft: pxToDp(15),
                                    paddingRight: pxToDp(15),
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    {
                                        color: nowCheckObj.right === item ? "#fff" : "#475266",
                                        fontSize: pxToDp(40),
                                        lineHeight: pxToDp(50),
                                    },
                                    appFont.fontFamily_syst,
                                    fonts.fontFamily_syst_bold,
                                ]}
                            >
                                {item}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            });
        }
        if (currentTopic.combination_two === "image") {
            let styleObj = {
                width: pxToDp(260),
                height: pxToDp(260),
            };
            if (Platform.OS === "android") {
                styleObj = {
                    width: pxToDp(200),
                    height: pxToDp(200),
                };
            }
            html = rightList.map((item, index) => {
                return (
                    <TouchableOpacity
                        style={[
                            styles.boxStyle,
                            {
                                backgroundColor:
                                    nowCheckObj.right === item ? "#447BE5" : "#E7E7F2",
                            },
                        ]}
                        onPress={() => this.checkValue(index, "right", item)}
                        key={index}
                        onLayout={(e) => this.onLayoutItem("rightItem", e, index)}
                    >
                        <View
                            style={[
                                styles.boxStyleIn,
                                {
                                    backgroundColor:
                                        nowCheckObj.right === item ? "#4C94FF" : "#F5F5FA",
                                },
                            ]}
                        >
                            <Image
                                style={{
                                    width: styleObj.width,
                                    height: styleObj.height,
                                }}
                                source={{
                                    uri: baseUrl + item,
                                }}
                                resizeMode={"contain"}
                            ></Image>
                        </View>
                    </TouchableOpacity>
                );
            });
        }
        if (currentTopic.combination_two === "audio") {
            html = rightList.map((item, index) => {
                return (
                    <TouchableOpacity
                        style={[
                            styles.boxStyle,
                            {
                                backgroundColor:
                                    nowCheckObj.right === item ? "#447BE5" : "#E7E7F2",
                            },
                        ]}
                        onPress={() => this.checkValue(index, "right", item)}
                        key={index}
                        onLayout={(e) => this.onLayoutItem("rightItem", e, index)}
                    >
                        <View
                            style={[
                                styles.boxStyleIn,
                                {
                                    backgroundColor:
                                        nowCheckObj.right === item ? "#4C94FF" : "#F5F5FA",
                                },
                            ]}
                        >
                            <Image
                                style={[size_tool(nowCheckObj.right === item ? 40 : 80)]}
                                source={
                                    nowCheckObj.right === item
                                        ? require("../../../../../../../images/chineseHomepage/pingyin/new/audioPlaying.png")
                                        : require("../../../../../../../images/chineseHomepage/pingyin/new/audioPlay.png")
                                }
                                resizeMode={"contain"}
                            ></Image>
                        </View>
                    </TouchableOpacity>
                );
            });
        }
        return (
            <View
                onLayout={(e) => this.onLayoutWrap("rightWrap", e)}
                style={{
                    flexDirection: isLeft ? "column" : "row",
                    justifyContent: "space-around",
                    // backgroundColor: "yellow",
                    // backgroundColor: "#fff",
                    paddingLeft: isLeft ? pxToDp(10) : 0,
                    paddingTop: isLeft ? 0 : pxToDp(10),
                }}
            >
                {html}
            </View>
        );
    };
    playAudio = (path) => {
        // console.log("播放的地址", path);
        if (this.audio) {
            this.audio.stop();
            this.audio = undefined;
        }
        // let src = 'https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/english/05/01/exercise/audio/adbfe7dfcaf742f99bf0009f43d62162.m4a'
        this.audio = new Sound(baseUrl + path, null, (error) => {
            if (error) {
                // console.log("播放失败", error);
            } else {
                this.audio.play((success) => {
                    if (success) {
                        // console.log("播放成功", baseUrl + path);
                        this.audio.release();
                    }
                });
            }
        });
    };
    render() {
        const { isLeft, lineViewArr, pausedfail } = this.state;
        return (
            <View style={[styles.container]}>
                <View
                    style={[
                        {
                            flexDirection: isLeft ? "row" : "column",
                            zIndex: 999,
                            width: isLeft ? "80%" : "100%",
                            // width:'100%',
                            height:
                                Platform.OS === "ios"
                                    ? Dimensions.get("window").height * 0.6
                                    : Dimensions.get("window").height * 0.55,
                            marginTop: pxToDp(20),
                            paddingRight: pxToDp(0),
                            justifyContent: "space-between",
                            // backgroundColor:"red"
                        },
                        appStyle.flexJusBetween,
                    ]}
                    onLayout={(e) => this.onLayoutWrap("father", e)}
                >
                    {/* 左边 */}
                    {this.renderLeft()}
                    {/* 右边 */}
                    {this.renderRight()}
                </View>
                <Audio
                    isLocal={true}
                    uri={`${this.failAudiopath}`}
                    paused={pausedfail}
                    pausedEvent={this.audioPausedSuccess}
                    ref={this.audio1}
                />

                <TouchableOpacity
                    onPress={this.getWrongList}
                    style={[styles.nextBtn, appStyle.flexCenter, appStyle.flexLine]}
                >
                    {/* <Text style={[styles.nextBtnText, appFont.fontFamily_syst]}>{this.props.isdid ? '完成' : '下一题'}</Text> */}

                    <ImageBackground
                        style={[size_tool(200), appStyle.flexCenter]}
                        source={require("../../../../../../../images/chineseHomepage/pingyin//new/testMeBg.png")}
                    >
                        <Text
                            style={[
                                { color: "#ffffff", fontSize: pxToDp(36) },
                                fonts.fontFamily_jcyt_700,
                            ]}
                        >
                            OK
                        </Text>
                    </ImageBackground>
                </TouchableOpacity>
                <View
                    style={{
                        position: "absolute",
                        // backgroundColor: "pink",
                    }}
                >
                    <Surface
                        width={Dimensions.get("window").width * 0.9}
                        height={Dimensions.get("window").height * 0.7}
                        style={{}}
                    >
                        <Group>{lineViewArr}</Group>
                    </Surface>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    boxStyle: {
        zIndex: 999,
        width: pxToDp(412),
        minHeight: pxToDp(140),
        backgroundColor: "#E7E7F2",
        borderRadius: pxToDp(40),
    },
    boxStyleIn: {
        width: pxToDp(412),
        minHeight: pxToDp(136),
        backgroundColor: "#F5F5FA",
        borderRadius: pxToDp(40),
        ...appStyle.flexCenter,
    },
    nextBtn: {
        position: "absolute",
        zIndex: 999,
        right: pxToDp(-50),
        bottom: pxToDp(-50),
    },
    nextBtnText: {
        fontSize: pxToDp(32),
        color: "#fff",
    },
});

export default ConnectionOptions;
