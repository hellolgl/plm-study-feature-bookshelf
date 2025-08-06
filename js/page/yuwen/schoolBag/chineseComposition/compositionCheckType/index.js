import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Platform,
    DeviceEventEmitter,
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import {
    pxToDp,
    padding_tool,
    size_tool,
    borderRadius_tool,
    margin_tool,
    getGradeInfo,
} from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
import * as actionCreators from "../../../../../action/userInfo/index";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MsgModal from "../../../../../component/chinese/sentence/msgModal";
import * as actionCreators1 from "../../../../../action/purchase/index";
import Freebtn from "../../../../../component/FreeTag";
import CoinView from '../../../../../component/coinView'
import * as actionCreatorsDailyTask from "../../../../../action/dailyTask";
// import Svg,{ ForeignObject } from 'react-native-svg';
// const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            canvasWidth: 0,
            canvasHeight: 0,
            topaicNum: 0,
            //题目列表，后期可能改动
            fromServeCharacterList: [],
            isEnd: false,
            topaicIndex: 0,
            topicMap: new Map(),
            status: 0,
            gifUrl: "",
            classList: {},
            nowIndex: 0,
            unitList: [],
            titleTxt: "",
            bgList: [
                "#FFD9A0",
                "#DAF666",
                "#8CEDB9",
                "#CAC1FF",
                "#F4B2F5",
                "#FFB1B1",
            ],
            bigBgList: [
                "#FFEDD1",
                "#F0F7D1",
                "#DEF8EA",
                "#EDEAFF",
                "#F9E5F3",
                "#FFE7E7",
            ],
            bigTypelist: [],
            littleTypelist: [],
            checkC_id: 0,
            inspect: "",
            technology: [],
            explanation: "",
            articles: [],
            lookMsg: false,
            gold: 0,
            has_comp_prop: 0,
        };
    }

    static navigationOptions = {
        // title:'答题'
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    componentWillUnmount() {
        this.eventListenerRefreshPage.remove();
        this.props.getTaskData()
    }
    componentDidMount() {
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "compostition",
            () => {
                this.getlist();
            }
        );
        this.getlist();
    }

    getlist() {
        const { nowIndex, checkC_id } = this.state;
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.class_info = userInfoJs.class_code;
        data.term_code = userInfoJs.checkTeam;
        data.student_code = userInfoJs.id;
        data.subject = "01";
        axios.get(api.getchineseCompositionType, { params: data }).then((res) => {
            let list = res.data.data.data;
            // console.log("列表", res.data.data);
            let titleTxt = userInfoJs.grade + userInfoJs.term;
            this.getModel(list[nowIndex]?.children[checkC_id]?.c_id);
            this.setState(() => ({
                bigTypelist: list,
                littleTypelist: list[nowIndex].children ? list[nowIndex].children : [],
                titleTxt,
                gold: res.data.data.gold,
                inspect: list[nowIndex].name,
            }));
        });
    }
    checkBig = (index, item) => {
        this.getModel(item.children[0].c_id);
        this.setState({
            littleTypelist: item.children,
            nowIndex: index,
            checkC_id: 0,
            inspect: item.name,
        });
    };
    checkItem = (item) => {
        this.getModel(this.state.littleTypelist[item].c_id);
        this.setState({
            checkC_id: item,
        });
    };
    getModel(c_id) {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.c_id = c_id;

        axios
            .get(api.getchineseCompositionTypeDetail, { params: data })
            .then((res) => {
                if (res.data?.err_code === 0) {
                    let data = res.data.data;
                    console.log("参数", c_id, data);
                    this.setState({
                        explanation: data.intro,
                        technology: data.technology,
                        articles: data.articles,
                        // has_comp_exam_prop: data.has_comp_exam_prop,
                        has_comp_prop: data.has_comp_prop,
                    });
                }
            });
    }
    toArticle = () => {
        // 开始创作  大展身手
        const { checkC_id, littleTypelist } = this.state;
        const { userInfo } = this.props;
        let info = userInfo.toJS();
        info.c_id = littleTypelist[checkC_id].c_id;
        this.props.setUser(info);
        NavigationUtil.toCompositionWriteHome({
            ...this.props,
            data: {
                ...littleTypelist[checkC_id],
            },
        });
    };
    toRecord = (item, index) => {
        // 范文练手 记录页面
        //判断权限
        const authority = this.props.authority;
        if (authority || index === 0) {
            const { checkC_id, littleTypelist } = this.state;
            const { userInfo } = this.props;
            let info = userInfo.toJS();
            info.c_id = littleTypelist[checkC_id].c_id;
            this.props.setUser(info);
            NavigationUtil.toChineseCompisitionModelRecord({
                ...this.props,
                data: {
                    ...this.props.navigation.state.params.data,
                    ...item,
                },
            });
        } else {
            this.props.setVisible(true);
        }
    };

    toLookExplain = (item) => {
        const { checkC_id, littleTypelist } = this.state;
        const { userInfo } = this.props;
        let info = userInfo.toJS();
        info.c_id = littleTypelist[checkC_id].c_id;
        this.props.setUser(info);
        NavigationUtil.toChineseCompisitionWrite({
            ...this.props,
            data: {
                ...this.props.navigation.state.params.data,
                ...item,
            },
        });
    };
    handleAIbot = () => {
        // AI bot
        if (!this.props.token) {
            NavigationUtil.resetToLogin(this.props);
            return
        }
        const { checkC_id, littleTypelist, inspect } = this.state;
        NavigationUtil.toChineseCompAIHelp({
            ...this.props,
            data: {
                inspect: inspect,
                tag: littleTypelist[checkC_id].name,
            },
        });
    };
    render() {
        const {
            nowIndex,
            littleTypelist,
            bigTypelist,
            articles,
            bgList,
            checkC_id,
            bigBgList,
            technology,
            explanation,
            lookMsg,
            gold,
            has_comp_prop,
        } = this.state;
        const authority = this.props.authority;
        return (
            <ImageBackground
                style={styles.wrap}
                source={require("../../../../../images/chineseHomepage/sentence/sentenceBg.png")}
                resizeMode="cover"
            >
                <TouchableOpacity
                    style={[size_tool(120, 80), styles.backBtn]}
                    onPress={this.goBack}
                >
                    <Image
                        style={[size_tool(120, 80)]}
                        source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
                    />
                </TouchableOpacity>
                <View style={[appStyle.flexTopLine, { flex: 1 }]}>
                    <View style={[styles.leftWrap]}>
                        {/* 左边 */}
                        <ScrollView>
                            {bigTypelist.map((item, index) => {
                                return item.children.length > 0 ? (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor:
                                                nowIndex === index ? "#E2E7F0" : "transparent",
                                            borderRadius: pxToDp(40),
                                            paddingBottom: pxToDp(8),
                                            marginBottom: pxToDp(20),
                                            height: pxToDp(108),
                                        }}
                                        key={index}
                                        onPress={this.checkBig.bind(this, index, item)}
                                    >
                                        <View
                                            style={[
                                                {
                                                    flex: 1,
                                                    backgroundColor:
                                                        nowIndex === index ? "#fff" : "transparent",
                                                },
                                                appStyle.flexCenter,
                                                borderRadius_tool(40),
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        color: "#475266",
                                                        fontSize: pxToDp(50),
                                                    },
                                                    nowIndex === index
                                                        ? appFont.fontFamily_jcyt_700
                                                        : appFont.fontFamily_jcyt_500,
                                                ]}
                                            >
                                                {item.name.replaceAll(" ", "")}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ) : null;
                            })}
                        </ScrollView>
                    </View>
                    <View style={[styles.bookWrap]}>
                        <View style={[styles.rightTopWrap]}>
                            {littleTypelist.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={this.checkItem.bind(this, index)}
                                        style={[
                                            padding_tool(0, 40, 0, 40),
                                            borderRadius_tool(20, 20, 0, 0),
                                            appStyle.flexCenter,
                                            {
                                                height: pxToDp(checkC_id === index ? 118 : 78),
                                                backgroundColor: bgList[index % 6],
                                                marginRight: pxToDp(10),
                                            },
                                        ]}
                                        key={index}
                                    >
                                        <Text
                                            style={[
                                                checkC_id === index
                                                    ? {
                                                        fontSize: pxToDp(32),
                                                        color: "#475266",
                                                        ...appFont.fontFamily_jcyt_700,
                                                    }
                                                    : {
                                                        fontSize: pxToDp(32),
                                                        color: "#475266",
                                                        ...appFont.fontFamily_jcyt_500,
                                                    },
                                            ]}
                                        >
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <View
                            style={[
                                borderRadius_tool(60),
                                {
                                    backgroundColor: "#6D6CAC",
                                    flex: 1,
                                    paddingBottom: pxToDp(8),
                                },
                            ]}
                        >
                            <View
                                style={[
                                    { flex: 1, backgroundColor: "#8A88C8", position: "relative" },
                                    padding_tool(10, 20, 40, 20),
                                    borderRadius_tool(60),
                                    appStyle.flexAliCenter,
                                ]}
                            >
                                <View
                                    style={[
                                        {
                                            width: pxToDp(40),
                                            backgroundColor: "#7978B6",
                                            height: "100%",
                                            borderLeftWidth: pxToDp(8),
                                            borderLeftColor: "#6D6CAC",
                                            borderRightWidth: pxToDp(8),
                                            borderRightColor: "#6D6CAC",
                                            position: "absolute",
                                            bottom: 0,
                                            zIndex: -1,
                                        },
                                    ]}
                                ></View>
                                <View
                                    style={[
                                        ,
                                        {
                                            flex: 1,
                                            backgroundColor: "#E7E7F2",
                                            height: "100%",
                                            width: "100%",
                                            borderRadius: pxToDp(40),
                                            paddingBottom: pxToDp(8),
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            padding_tool(40, 40, 50, 40),
                                            {
                                                flex: 1,
                                                backgroundColor: "#fff",
                                                borderRadius: pxToDp(40),
                                                position: "relative",
                                            },
                                            appStyle.flexTopLine
                                        ]}
                                    >
                                        <View
                                            style={[
                                                { width: pxToDp(1024) },
                                                appStyle.flexTopLine,
                                                appStyle.flexJusBetween,
                                            ]}
                                        >
                                            {articles?.length > 0 ? (
                                                <View
                                                    style={[
                                                        { flex: 1, backgroundColor: bigBgList[checkC_id] },
                                                        styles.rightBigWrap,
                                                    ]}
                                                >
                                                    <Text style={[styles.titleTxt]}>范文练手</Text>
                                                    <ScrollView style={[{ width: "100%" }]}>
                                                        {articles.map((item, index) => {
                                                            return (
                                                                <View key={index}>
                                                                    <Text style={[styles.itemTitle]}>
                                                                        {item.name}
                                                                    </Text>
                                                                    <View
                                                                        style={[
                                                                            appStyle.flexTopLine,
                                                                            appStyle.flexJusBetween,
                                                                            appStyle.flexLineWrap,
                                                                            { width: "100%" },
                                                                        ]}
                                                                    >
                                                                        {item?.articles.map((i, n) => {
                                                                            return (
                                                                                <TouchableOpacity
                                                                                    onPress={this.toRecord.bind(
                                                                                        this,
                                                                                        i,
                                                                                        index === 0 && n === 0 ? 0 : 1
                                                                                    )}
                                                                                    style={[
                                                                                        borderRadius_tool(30),
                                                                                        styles.itemWrap,
                                                                                    ]}
                                                                                    key={n}
                                                                                >
                                                                                    <View style={[styles.itemBg]}>
                                                                                        <Text
                                                                                            style={[
                                                                                                styles.itemTxt,
                                                                                                { fontSize: pxToDp(38) },
                                                                                            ]}
                                                                                        >
                                                                                            {i.article_name}
                                                                                        </Text>
                                                                                        {!authority &&
                                                                                            index === 0 &&
                                                                                            n === 0 ? (
                                                                                            <Freebtn haveAllRadius={true} />
                                                                                        ) : null}
                                                                                        <FontAwesome
                                                                                            name={"chevron-right"}
                                                                                            size={20}
                                                                                            style={{
                                                                                                color:
                                                                                                    "rgba(71, 82, 102, 0.50)",
                                                                                                marginLeft: pxToDp(10),
                                                                                            }}
                                                                                        />
                                                                                    </View>
                                                                                </TouchableOpacity>
                                                                            );
                                                                        })}
                                                                    </View>
                                                                </View>
                                                            );
                                                        })}
                                                    </ScrollView>
                                                </View>
                                            ) : null}
                                            {technology?.length > 0 ? (
                                                <View
                                                    style={[
                                                        {
                                                            flex: 1,
                                                            backgroundColor: bigBgList[checkC_id],
                                                            marginLeft: articles.length > 0 ? pxToDp(40) : 0,
                                                        },
                                                        styles.rightBigWrap,
                                                    ]}
                                                >
                                                    <Text style={[styles.titleTxt]}>写作技法</Text>
                                                    <ScrollView style={[{ width: "100%" }]}>
                                                        <View
                                                            style={[
                                                                { paddingBottom: pxToDp(60), width: "100%" },
                                                                appStyle.flexTopLine,
                                                                appStyle.flexJusBetween,
                                                                appStyle.flexLineWrap,
                                                            ]}
                                                        >
                                                            {technology.map((i, n) => {
                                                                return (
                                                                    <TouchableOpacity
                                                                        onPress={this.toLookExplain.bind(this, i)}
                                                                        style={[
                                                                            borderRadius_tool(30),
                                                                            styles.itemWrap,
                                                                        ]}
                                                                        key={n}
                                                                    >
                                                                        <View style={[styles.itemBg]}>
                                                                            <Text style={[styles.itemTxt]}>
                                                                                {i.name}
                                                                            </Text>
                                                                            <FontAwesome
                                                                                name={"chevron-right"}
                                                                                size={20}
                                                                                style={{
                                                                                    color: "rgba(71, 82, 102, 0.50)",
                                                                                }}
                                                                            />
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                );
                                                            })}
                                                        </View>
                                                    </ScrollView>
                                                </View>
                                            ) : null}
                                            {articles?.length > 0 || technology?.length > 0 ? null : (
                                                <View
                                                    style={[
                                                        {
                                                            flex: 1,
                                                            backgroundColor: bigBgList[checkC_id],
                                                            borderRadius: pxToDp(20)
                                                        },
                                                        appStyle.flexCenter
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            appFont.fontFamily_jcyt_500,
                                                            { fontSize: pxToDp(40), color: "#475266", opacity: .5 },
                                                        ]}
                                                    >
                                                        暂时没有学习内容哦
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            appFont.fontFamily_jcyt_700,
                                                            { fontSize: pxToDp(40), color: "#475266", opacity: .5 },
                                                        ]}
                                                    >
                                                        点击“作文创作”开始创作吧！
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                        <View style={[{ flex: 1 }, appStyle.flexJusBetween, appStyle.flexAliEnd]}>
                                            {explanation.length > 0 ? (
                                                <TouchableOpacity
                                                    style={[appStyle.flexTopLine, appStyle.flexAliCenter]}
                                                    onPress={() =>
                                                        explanation.length > 0 &&
                                                        this.setState({ lookMsg: true })
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            appFont.fontFamily_jcyt_700,
                                                            { fontSize: pxToDp(48), color: "#475266" },
                                                            margin_tool(0, 20, 0, 50),
                                                        ]}
                                                    >
                                                        {" "}
                                                        学习目标
                                                    </Text>
                                                    <FontAwesome
                                                        name={"question-circle"}
                                                        size={30}
                                                        style={{ color: "#475266" }}
                                                    />
                                                </TouchableOpacity>
                                            ) : <View></View>}
                                            <View>
                                                <TouchableOpacity onPress={this.handleAIbot}>
                                                    <Image
                                                        style={[{ width: pxToDp(370), height: pxToDp(396) }]}
                                                        source={
                                                            require("../../../../../images/chineseComposition/comp_sara_ai.png")
                                                        }
                                                    ></Image>
                                                </TouchableOpacity>

                                                {has_comp_prop ? (
                                                    <TouchableOpacity
                                                        onPress={this.toArticle}
                                                        style={[
                                                            size_tool(400, 120),
                                                            borderRadius_tool(200),
                                                            {
                                                                backgroundColor: "#F07C39",
                                                                paddingBottom: pxToDp(8),
                                                            },
                                                        ]}
                                                    >
                                                        <View
                                                            style={[
                                                                borderRadius_tool(200),
                                                                padding_tool(20),
                                                                { flex: 1, backgroundColor: "#FF964A" },
                                                                appStyle.flexTopLine,
                                                                appStyle.flexAliCenter,
                                                            ]}
                                                        >
                                                            <View
                                                                style={[
                                                                    appStyle.flexCenter,
                                                                    {
                                                                        backgroundColor: "#fff",
                                                                        borderRadius: pxToDp(80),
                                                                        marginRight: pxToDp(40),
                                                                    },
                                                                    size_tool(80),
                                                                ]}
                                                            >
                                                                <FontAwesome
                                                                    name={"pencil"}
                                                                    size={28}
                                                                    style={{ color: "#FF964A" }}
                                                                />
                                                            </View>

                                                            <Text
                                                                style={[
                                                                    appFont.fontFamily_jcyt_700,
                                                                    { fontSize: pxToDp(40), color: "#fff" },
                                                                ]}
                                                            >
                                                                作文创作
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                ) : null}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <MsgModal
                    btnText="X"
                    todo={() => this.setState({ lookMsg: false })}
                    visible={lookMsg}
                    title=""
                    msg={explanation}
                    isHtml={true}
                    showPanda={true}
                />
                <CoinView></CoinView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        alignItems: "center",
        ...padding_tool(Platform.OS === "ios" ? 60 : 40, 40, 40, 40),
    },
    backBtn: {
        position: "absolute",
        top: pxToDp(40),
        left: pxToDp(40),
        zIndex: 999,
    },
    titleTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(40),
        color: "#475266",
        marginBottom: pxToDp(30),
    },
    leftWrap: {
        width: pxToDp(300),
        height: "100%",
        paddingTop: pxToDp(120),
    },
    bookWrap: {
        flex: 1,
        marginLeft: pxToDp(40),
        height: "100%",
        paddingTop: pxToDp(120),
        position: "relative",
    },
    rightBigWrap: {
        height: "100%",
        ...appStyle.flexAliCenter,
        ...borderRadius_tool(40),
        ...padding_tool(40),
    },
    itemWrap: {
        width: '100%',
        backgroundColor: "#F5F5FA",
        paddingBottom: pxToDp(8),
        minHeight: pxToDp(100),
        marginBottom: pxToDp(20),
    },
    itemBg: {
        flex: 1,
        borderRadius: pxToDp(30),
        backgroundColor: "#fff",
        ...appStyle.flexTopLine,
        ...appStyle.flexAliCenter,
        ...padding_tool(10, 30, 10, 30),
    },
    itemTxt: {
        flex: 1,
        fontSize: pxToDp(32),
        color: "#475266",
        ...appFont.fontFamily_jcyt_700,
    },
    itemTitle: {
        ...appFont.fontFamily_jcyt_500,
        fontSize: pxToDp(28),
        color: "#475266",
        marginBottom: pxToDp(8),
    },
    rightTopWrap: {
        ...padding_tool(0, 60, 0, 60),
        position: "absolute",
        width: "100%",
        height: pxToDp(120),
        top: pxToDp(10),
        zIndex: 999,
        ...appStyle.flexTopLine,
        ...appStyle.flexAliEnd,
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        lock_primary_school: state.getIn(["userInfo", "lock_primary_school"]),
        authority: state.getIn(["userInfo", "selestModuleAuthority"]),
        token: state.getIn(["userInfo", "token"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setUser(data) {
            dispatch(actionCreators.setUserInfoNow(data));
        },
        setVisible(data) {
            dispatch(actionCreators1.setVisible(data));
        },
        getTaskData(data) {
            dispatch(actionCreatorsDailyTask.getTaskData(data));
        }
    };
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
