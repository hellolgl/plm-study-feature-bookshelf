import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    DeviceEventEmitter,
    Modal,
} from "react-native";
import {
    size_tool,
    pxToDp,
    padding_tool,
    getIsTablet,
    borderRadius_tool,
} from "../../../../util/tools";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { Toast } from "antd-mobile-rn";
import { appFont, appStyle } from "../../../../theme";
import FreeTag from "../../../../component/FreeTag";
import * as actionCreators from "../../../../action/purchase/index";
import * as purchaseCreators from "../../../../action/purchase";
import { T } from "lodash/fp";
class SelectUnitEn extends PureComponent {
    constructor(props) {
        super(props);
        this.isPhone = !getIsTablet()
        this.state = {
            wordlist: [],
            styleList: [
                {
                    bigImg: require("../../../../images/english/abcs/treeItemBg_1_1.png"),
                    littleImg: require("../../../../images/english/abcs/treeItemBg_1_2.png"),
                    c_bigImg: require("../../../../images/english/abcs/treeItemBg_1_3.png"),
                    c_littleImg: require("../../../../images/english/abcs/treeItemBg_1_4.png"),
                    bigstyle: [
                        size_tool(187, 164),
                        padding_tool(20, 0, 0, 30),
                        { position: "absolute" },
                    ],
                    littleStyle: [
                        size_tool(101, 94),
                        { position: "absolute", bottom: pxToDp(-10), right: pxToDp(0) },
                    ],
                },
                {
                    bigImg: require("../../../../images/english/abcs/treeItemBg_2_1.png"),
                    littleImg: require("../../../../images/english/abcs/treeItemBg_2_2.png"),
                    c_bigImg: require("../../../../images/english/abcs/treeItemBg_2_3.png"),
                    c_littleImg: require("../../../../images/english/abcs/treeItemBg_2_4.png"),
                    bigstyle: [
                        size_tool(170, 165),
                        padding_tool(40, 0, 0, 30),
                        { position: "absolute" },
                    ],
                    littleStyle: [
                        size_tool(94, 95),
                        { position: "absolute", top: pxToDp(10), right: pxToDp(-20) },
                    ],
                },
                {
                    bigImg: require("../../../../images/english/abcs/treeItemBg_3_1.png"),
                    littleImg: require("../../../../images/english/abcs/treeItemBg_3_2.png"),
                    c_bigImg: require("../../../../images/english/abcs/treeItemBg_3_3.png"),
                    c_littleImg: require("../../../../images/english/abcs/treeItemBg_3_4.png"),
                    bigstyle: [
                        size_tool(198, 166),
                        padding_tool(33, 0, 0, 100),
                        { position: "absolute" },
                    ],
                    littleStyle: [
                        size_tool(95, 94),
                        { position: "absolute", bottom: pxToDp(-10), left: pxToDp(0) },
                    ],
                },
            ],
            positionList: [
                {
                    styleIndex: 0,
                    position: { top: pxToDp(108), left: pxToDp(141) },
                },
                {
                    styleIndex: 1,
                    position: { top: pxToDp(63), left: pxToDp(355) },
                },
                {
                    styleIndex: 2,
                    position: { top: pxToDp(44), left: pxToDp(604) },
                },
                {
                    styleIndex: 0,
                    position: { top: pxToDp(62), left: pxToDp(870) },
                },
                {
                    styleIndex: 1,
                    position: { top: pxToDp(81), left: pxToDp(1079) },
                },
                {
                    styleIndex: 2,
                    position: { top: pxToDp(37), left: pxToDp(1296) },
                },
                {
                    styleIndex: 1,
                    position: { top: pxToDp(87), left: pxToDp(1515) },
                },

                {
                    styleIndex: 2,
                    position: { top: pxToDp(304), left: pxToDp(141) },
                },
                {
                    styleIndex: 0,
                    position: { top: pxToDp(257), left: pxToDp(361) },
                },
                {
                    styleIndex: 0,
                    position: { top: pxToDp(264), left: pxToDp(604) },
                },
                {
                    styleIndex: 1,
                    position: { top: pxToDp(289), left: pxToDp(811) },
                },
                {
                    styleIndex: 2,
                    position: { top: pxToDp(284), left: pxToDp(1045) },
                },
                {
                    styleIndex: 0,
                    position: { top: pxToDp(287), left: pxToDp(1267) },
                },
                {
                    styleIndex: 2,
                    position: { top: pxToDp(279), left: pxToDp(1480) },
                },
                {
                    styleIndex: 2,
                    position: { top: pxToDp(243), left: pxToDp(1680) },
                },
                {
                    styleIndex: 0,
                    position: { top: pxToDp(604), left: pxToDp(73) },
                },
                {
                    styleIndex: 1,
                    position: { top: pxToDp(521), left: pxToDp(270) },
                },
                {
                    styleIndex: 2,
                    position: { top: pxToDp(441), left: pxToDp(499) },
                },
                {
                    styleIndex: 0,
                    position: { top: pxToDp(514), left: pxToDp(719) },
                },
                {
                    styleIndex: 1,
                    position: { top: pxToDp(507), left: pxToDp(930) },
                },
                {
                    styleIndex: 2,
                    position: { top: pxToDp(449), left: pxToDp(1181) },
                },
                {
                    styleIndex: 1,
                    position: { top: pxToDp(502), left: pxToDp(1400) },
                },
                {
                    styleIndex: 0,
                    position: { top: pxToDp(452), left: pxToDp(1649) },
                },
                {
                    styleIndex: 0,
                    position: { top: pxToDp(710), left: pxToDp(260) },
                },
                {
                    styleIndex: 2,
                    position: { top: pxToDp(755), left: pxToDp(490) },
                },
                {
                    styleIndex: 0,
                    position: { top: pxToDp(640), left: pxToDp(1600) },
                },
            ],
            visible: false,
            star: 0,
        };
    }
    componentDidMount() {
        this.getlist();
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "backRecordList",
            () => this.getlist()
        );
    }
    componentWillUnmount() {
        this.eventListenerRefreshPage.remove();
    }
    getlist() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        // const item = this.props.navigation.state.params.data
        // console.log("EnglishChooseKnowledge DidMount");
        // this.knowledge_type = item.knowledge_type
        const data = {
            origin: "032001000000",
            modular: 3,
            sub_modular: 1,
            student_code: userInfoJs.id,
        };
        if (this.isloading) {
            return;
        }

        this.isloading = true;
        axios.get(api.getEnglishKnowList, { params: data }).then((res) => {
            this.isloading = false;
            this.flag = false;
            let wordlist = [];
            let list = res.data.data.data;

            if (list) {
                console.log("数据123", list);
                let star = res.data.data.star_num;
                list.forEach((item, index) => {
                    index % 2 === 0
                        ? wordlist.push({
                            check: false,
                            value: item.knowledge_point,
                            status: item.status,
                            code: item.k_id,
                            littlevalue: list[index + 1].knowledge_point,
                            littlestatus: list[index + 1].status,
                            littlecode: list[index + 1].k_id,
                        })
                        : "";
                });
                this.setState({
                    wordlist,
                    star
                });
            }
        });
    }
    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    checknow = (index, authority) => {
        if (!authority) {
            this.props.setVisible(true);
            return;
        }

        let listnow = JSON.parse(JSON.stringify(this.state.wordlist));
        listnow[index].check = !listnow[index].check;
        this.setState({
            wordlist: listnow,
        });
    };
    goexercise = () => {
        const { wordlist } = this.state;
        let knowlist = [],
            codelist = [];
        wordlist.forEach((item) => {
            if (item.check) {
                knowlist.push(item.value);
                knowlist.push(item.littlevalue);
                codelist.push(item.code);
                codelist.push(item.littlecode);
            }
        });
        console.log("选择", knowlist, codelist);
        if (knowlist.length > 0) {
            // NavigationUtil.toSynchronizeDiagnosisEn({
            NavigationUtil.toEnglishAbcsDoexercise({
                ...this.props,
                data: {
                    exercise_origin: "032001000000",
                    unit_name: "Alphabet",
                    kpg_type: 1,
                    knowledgeList: knowlist,
                    knowledge_type: 1,
                    unit_code: "00",
                    codeList: codelist,
                    isUpload: true,
                    mode: 3,
                    // updatalist: () => {
                    //   console.log("重新加载");
                    //   if (this.false === true) return;
                    //   this.flag = true;
                    //   this.getlist();
                    //   this.isloading = true;
                    // },
                },
            });
        } else {
            Toast.loading("请选择知识点", 1);
            return;
        }
    };
    goRecord = () => {
        const { token } = this.props
        if (!token) {
            NavigationUtil.resetToLogin(this.props);
            return
        }
        NavigationUtil.toEnglishAbcsExerciseRrecord({
            ...this.props,
            data: {
                ...this.props.navigation.state.params.data,
                kpg_type: 1,
                exercise_origin: "032001000000",
                origin: "032001000000",
                mode: 3,
            },
        });
    };
    lookRule = () => {
        this.setState({
            visible: true,
        });
    };
    render() {
        // console.log("字母连线气泡...");
        const { wordlist, styleList, positionList, visible, star } = this.state;
        let authority = this.props.authority;
        return (
            <ImageBackground
                style={[
                    {
                        flex: 1,
                        position: "relative",
                        paddingTop: pxToDp(Platform.OS === "ios" ? 100 : 0),
                    },
                    appStyle.flexCenter,
                ]}
                source={require("../../../../images/english/abcs/treeBg.png")}
            >
                <TouchableOpacity
                    onPress={this.goBack.bind(this)}
                    style={[
                        {
                            position: "absolute",
                            zIndex: 99,
                            left: pxToDp(40),
                            top: pxToDp(60),
                        },
                    ]}
                >
                    <Image
                        style={[size_tool(120, 80), {}]}
                        source={require("../../../../images/chineseHomepage/pingyin/new/back.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        size_tool(219, 97),
                        {
                            position: "absolute",
                            top: pxToDp(30),
                            right: pxToDp(234),
                            backgroundColor: "rgba(255,255,255,0.7)",
                            borderRadius: pxToDp(100),
                            flexDirection: "row",
                            alignItems: "center",
                            zIndex: 999,
                        },
                        padding_tool(0, 20, 0, 20),
                    ]}
                    onPress={this.lookRule}
                >
                    <Image
                        source={require("../../../../images/chineseHomepage/pingyin/itmBg.png")}
                        style={[size_tool(87, 85)]}
                    />
                    <Text
                        style={[
                            appFont.fontFamily_jcyt_700,
                            {
                                color: "#FFB051",
                                fontSize: pxToDp(36),
                                marginLeft: pxToDp(10),
                            },
                        ]}
                    >
                        X {star}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.recordBtn]} onPress={this.goRecord}>
                    <View style={[styles.recordBtnInner]}>
                        <Text style={[{ color: '#fff', fontSize: pxToDp(44) }, appFont.fontFamily_jcyt_700]}>Record</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.testBtn]} onPress={this.goexercise}>
                    <View style={[styles.testBtnInner]}>
                        <Text style={[{ color: '#fff', fontSize: pxToDp(44) }, appFont.fontFamily_jcyt_700]}>Test</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.testBtn, { backgroundColor: '#10A17B', left: pxToDp(92) }]} onPress={() => {
                    NavigationUtil.toAbcsStudy({
                        ...this.props,
                    });
                }}>
                    <View style={[styles.testBtnInner, { backgroundColor: '#1DD2A3' }]}>
                        <Text style={[{ color: '#fff', fontSize: pxToDp(44) }, appFont.fontFamily_jcyt_700]}>Learn</Text>
                    </View>
                </TouchableOpacity>
                {/* {Platform.OS === "ios" ? <View style={[{ marginTop: pxToDp(200) }]}></View> : <></>} */}
                <View style={[{ flex: 1 }]}></View>
                <ImageBackground
                    source={
                        Platform.OS === "ios"
                            ? require("../../../../images/english/abcs/tree.png")
                            : require("../../../../images/english/abcs/treeA.png")
                    }
                    style={[
                        padding_tool(0),
                        Platform.OS === "ios"
                            ? size_tool(2014, 1383)
                            : size_tool(1908, 1067),
                        { position: "relative" },
                        this.isPhone ?
                            {
                                transform: [{ scale: 0.75 }],
                            } : null
                    ]}
                >
                    {wordlist.map((item, index) => {
                        let fontcolor = "#39334C";
                        if (item.status == 1) {
                            fontcolor = "#00AC7D";
                        }
                        if (item.status == 2) {
                            fontcolor = "#FF6A63";
                        }
                        let littlefontcolor = "#39334C";
                        if (item.littlestatus == 1) {
                            littlefontcolor = "#00AC7D";
                        }
                        if (item.littlestatus == 2) {
                            littlefontcolor = "#FF6A63";
                        }
                        let styleItemIndex = positionList[index].styleIndex;
                        let styleItem = styleList[styleItemIndex];
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={this.checknow.bind(
                                    this,
                                    index,
                                    index < 3 || authority
                                )}
                                style={{
                                    width: pxToDp(200),
                                    height: pxToDp(180),
                                    // backgroundColor: 'pink',
                                    ...positionList[index].position,
                                    position: "absolute",
                                    zIndex: 999,
                                }}
                            >
                                <ImageBackground
                                    source={item.check ? styleItem.c_bigImg : styleItem.bigImg}
                                    style={[...styleItem.bigstyle, {}]}
                                >
                                    {index < 3 && !authority ? (
                                        <View
                                            style={[
                                                { position: "absolute" },
                                                index === 0 ? { right: pxToDp(0), top: pxToDp(0) } : "",
                                                index === 1
                                                    ? { right: pxToDp(0), bottom: pxToDp(0) }
                                                    : "",
                                            ]}
                                        >
                                            <FreeTag haveAllRadius={true} txt={"free"} />
                                        </View>
                                    ) : null}
                                    <Text
                                        style={{
                                            fontSize: pxToDp(80),
                                            color: fontcolor,
                                            lineHeight: pxToDp(90),
                                            ...appFont.fontFamily_jcyt_700,
                                            // fontFamily: 'AaBanruokaishu (Non-Commercial Use)',
                                        }}
                                    >
                                        {item.value}
                                    </Text>

                                    <ImageBackground
                                        source={
                                            item.check ? styleItem.c_littleImg : styleItem.littleImg
                                        }
                                        style={[...styleItem.littleStyle, appStyle.flexCenter]}
                                    >
                                        <Text
                                            style={{
                                                // fontFamily: 'AaBanruokaishu (Non-Commercial Use)',
                                                fontSize: pxToDp(70),
                                                lineHeight: pxToDp(80),
                                                color: littlefontcolor,
                                                ...appFont.fontFamily_jcyt_700,
                                            }}
                                        >
                                            {item.littlevalue}
                                        </Text>
                                    </ImageBackground>
                                </ImageBackground>
                                {/* <ImageBackground
                                    style={[size_tool(180), {
                                        position: 'relative'
                                    }]}
                                    source={item.check ? require('../../../../images/englishHomepage/abcsTreeItemChecked.png') : require('../../../../images/englishHomepage/abcsTreeItem.png')}
                                >
                                    <Text style={{ position: 'absolute', top: pxToDp(20), left: pxToDp(116), fontSize: pxToDp(40), color: littlefontcolor }}>{item.littlevalue}</Text>
                                </ImageBackground> */}
                            </TouchableOpacity>
                        );
                    })}
                    <ImageBackground
                        style={[
                            size_tool(330, 229),
                            appStyle.flexCenter,
                            padding_tool(20, 0, 0, 0),
                            {
                                position: "absolute",
                                top: pxToDp(Platform.OS === "ios" ? 941 : 780),
                                left: pxToDp(Platform.OS === "ios" ? 1129 : 1070),
                            },
                        ]}
                        source={require("../../../../images/english/abcs/treeWhy.png")}
                    >
                        <Text style={[styles.whyText]}>选择知识点开始答题</Text>
                        <Text style={[styles.whyText]}>绿色标记为已掌握</Text>
                        <Text style={[styles.whyText]}>红色标记为未掌握</Text>
                    </ImageBackground>
                </ImageBackground>
                <Modal
                    supportedOrientations={['portrait', 'landscape']}
                    visible={visible} animationType="fade" transparent={true}>
                    <View style={[styles.container]}>
                        <View style={[styles.contentWrap]}>
                            <View style={[styles.content]}>
                                <Text
                                    style={[
                                        {
                                            fontSize: pxToDp(32),
                                            color: "#4C4C59",
                                            lineHeight: pxToDp(60),
                                            textAlign: "left",
                                        },
                                        appFont.fontFamily_jcyt_500,
                                    ]}
                                >
                                    每组字母题目全部正确获得一颗星星
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.btn]}
                                onPress={() => this.setState({ visible: false })}
                            >
                                <View
                                    style={[
                                        size_tool(216, 128),
                                        borderRadius_tool(200),
                                        { backgroundColor: "#F07C39", paddingBottom: pxToDp(6) },
                                    ]}
                                >
                                    <View
                                        style={[
                                            appStyle.flexCenter,
                                            {
                                                flex: 1,
                                                backgroundColor: "#FF964A",
                                                borderRadius: pxToDp(200),
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                appFont.fontFamily_jcyt_700,
                                                { fontSize: pxToDp(46), color: "#fff" },
                                            ]}
                                        >
                                            关闭
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    whyText: {
        fontSize: pxToDp(26),
        color: "#39334C",
        lineHeight: pxToDp(40),
        ...appFont.fontFamily_jcyt_500,
    },
    container: {
        flex: 1,
        backgroundColor: "rgba(76, 76, 89, .6)",
        ...appStyle.flexCenter,
    },
    content: {
        width: pxToDp(714),
        height: pxToDp(200),
        borderRadius: pxToDp(60),
        backgroundColor: "#fff",
        ...appStyle.flexAliCenter,
        ...padding_tool(40, 60, 100, 60),
    },
    contentWrap: {
        width: pxToDp(714),
        ...appStyle.flexAliCenter,
        ...padding_tool(40, 60, 40, 60),
        position: "relative",
    },
    btn: {
        position: "absolute",
        bottom: pxToDp(-20),
        ...size_tool(216, 128),
    },
    recordBtn: {
        position: "absolute",
        top: pxToDp(30),
        right: pxToDp(22),
        ...size_tool(200, 100),
        paddingBottom: pxToDp(6),
        backgroundColor: '#F57D31',
        borderRadius: pxToDp(40),
        zIndex: 1
    },
    recordBtnInner: {
        ...appStyle.flexCenter,
        flex: 1,
        backgroundColor: "#FFB051",
        borderRadius: pxToDp(40)
    },
    testBtn: {
        position: "absolute",
        bottom: pxToDp(34),
        right: pxToDp(40),
        ...size_tool(200, 200),
        borderRadius: pxToDp(100),
        paddingBottom: pxToDp(6),
        backgroundColor: '#F57D31',
        zIndex: 1
    },
    testBtnInner: {
        ...appStyle.flexCenter,
        flex: 1,
        backgroundColor: "#FFB051",
        borderRadius: pxToDp(100)
    }
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        token: state.getIn(["userInfo", "token"]),
        textBookCode: state.getIn(["bagEnglish", "textBookCode"]),
        authority: state.getIn(["userInfo", "selestModuleAuthority"]),
        starData: state.getIn(["children", "starData"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setVisible(data) {
            dispatch(actionCreators.setVisible(data));
        },
        setModules(data) {
            dispatch(purchaseCreators.setModules(data));
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(SelectUnitEn);
