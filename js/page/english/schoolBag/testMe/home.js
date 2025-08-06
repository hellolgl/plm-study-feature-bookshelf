import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
    DeviceEventEmitter,
    ScrollView,
    Modal,
    Platform,
} from "react-native";
import {
    margin_tool,
    size_tool,
    pxToDp,
    padding_tool,
    border_tool,
    borderRadius_tool,
    getGradeInfo,
} from "../../../../util/tools";
import { appFont, appStyle } from "../../../../theme";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import * as actionCreators from "../../../../action/purchase/index";
import { connect } from "react-redux";
import Star from "./star";
import CircleStatistcs from "../../../../component/circleStatistcs";
import FreeTag from "../../../../component/FreeTag";
import * as purchaseCreators from "../../../../action/purchase";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MsgModal from "../../../../component/chinese/sentence/msgModal";
import ImmediatelyPlay from "../../../../util/audio/playAudio";
import CoinView from "../../../../component/coinView";
import * as actionCreatorsDailyTask from "../../../../action/dailyTask";
class ChooseTextbook extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            type: "word",
            list: [{}, {}, {}, {}, {}],
            isOpacity: false,
            staticsobj: {
                total: 0,
                wrong: 0,
                correct: 0,
                word: {
                    total: 0,
                    wrong: 0,
                    right: 0,
                },
                phrases: {
                    total: 0,
                    wrong: 0,
                    right: 0,
                },
                sentence: {
                    total: 0,
                    wrong: 0,
                    right: 0,
                },
                article: {
                    total: 0,
                    wrong: 0,
                    right: 0,
                },
            },
            unitList: [],
            unitIndex: 0,
            bgList: [
                {
                    bg: require("../../../../images/english/testMe/itemBg1.png"),
                    bgNo: require("../../../../images/english/testMe/itemBgNo1.png"),
                },
                {
                    bg: require("../../../../images/english/testMe/itemBg2.png"),
                    bgNo: require("../../../../images/english/testMe/itemBgNo2.png"),
                },
                {
                    bg: require("../../../../images/english/testMe/itemBg3.png"),
                    bgNo: require("../../../../images/english/testMe/itemBgNo3.png"),
                },
                {
                    bg: require("../../../../images/english/testMe/itemBg4.png"),
                    bgNo: require("../../../../images/english/testMe/itemBgNo4.png"),
                },
                {
                    bg: require("../../../../images/english/testMe/itemBg5.png"),
                    bgNo: require("../../../../images/english/testMe/itemBgNo5.png"),
                },
            ],
            boxBgList: [
                require("../../../../images/english/testMe/box1.png"),
                require("../../../../images/english/testMe/box2.png"),
                require("../../../../images/english/testMe/box3.png"),
            ],
            goldList: [
                require("../../../../images/english/testMe/medal_jin.png"),
                require("../../../../images/english/testMe/medal_yin.png"),
                require("../../../../images/english/testMe/medal_tong.png"),
            ],
            ruleVisible: false,
            lookMsg: false,
        };
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };
    toRecord(item, status) {
        // toEnglishTestMeRecordList
        const { unitIndex, unitList } = this.state;
        if (status) {
            let data = {
                ...this.props.navigation.state.params.data,
                ...unitList[unitIndex],
                ...item,
                isTestMe: true,
            };
            if (item.has_record) {
                NavigationUtil.toEnglishTextMeRecord({
                    ...this.props,
                    data,
                });
            } else {
                NavigationUtil.toSynchronizeDiagnosisEn({
                    ...this.props,
                    data,
                });
            }
        } else {
            this.setState({
                lookMsg: true,
            });
        }
    }
    componentDidMount() {
        const { userInfo, textBookCode } = this.props;
        const { checkGrade, checkTeam, id } = userInfo.toJS();
        const data = {
            grade_code: checkGrade,
            term_code: checkTeam,
            id,
            subject: "03",
            textbook_origin: textBookCode || "20",
        };
        axios.post(api.QueryEnTextbookLesson, data).then((res) => {
            if (res.data.err_code === 0) {
                let list = res.data.data.unit_data;
                let classList = list.filter((item) => item.unit_code !== "00");
                this.getlist(classList[0]);
                this.getStatics(classList[0]);
                this.setState(() => ({
                    unitList: classList,
                }));
            }
        });
        // this.getlist();
        // this.getStatics();
        // stu_origin
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "renderTestMeHome",
            () => {
                // NavigationUtil.goBack(this.props);
                // DeviceEventEmitter.emit("aiPlanDidExercise");
                this.specialGetList(this.state.unitList[this.state.unitIndex]);
                this.getStatics(this.state.unitList[this.state.unitIndex]);
            }
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.unitIndex === this.state.unitIndex &&
            this.state.list.filter((d) => d["correct_rate"] > 0).length >
            prevState.list.filter((d) => d["correct_rate"] > 0).length
        ) {
            // ImmediatelyPlay.playFailGold();
        }
    }

    componentWillUnmount() {
        this.eventListenerRefreshPage.remove();
        this.props.getTaskData();
    }
    getlist = (unitobj) => {
        axios
            .get(api.getEnglishTestMeItem, {
                params: { origin: unitobj.origin },
            })
            .then((res) => {
                if (res.data.err_code === 0) {
                    console.log("res 参数", res.data);
                    this.setState({
                        list: res.data.data,
                        isOpacity: res.data.data[4].has_record ? true : false,
                    });
                }
            });
    };

    specialGetList = (unitobj) => {
        axios
            .get(api.getEnglishTestMeItem, {
                params: { origin: unitobj.origin },
            })
            .then((res) => {
                if (res.data.err_code === 0) {
                    if (
                        res.data.data.filter((d) => d["correct_rate"] > 0).length >
                        this.state.list.filter((d) => d["correct_rate"] > 0).length
                    ) {
                        ImmediatelyPlay.playFailGold();
                    }
                    this.setState({
                        list: res.data.data,
                        isOpacity: res.data.data[4].has_record ? true : false,
                    });
                }
            });
    };

    getStatics = (unitobj) => {
        axios
            .get(api.getEnglishTestMeStatics, {
                params: { origin: unitobj.origin },
            })
            .then((res) => {
                if (res.data.err_code === 0) {
                    console.log("统计", res.data.data);
                    let staticsobj = {
                        ...this.state.staticsobj,
                        total: res.data.data.all_statistics.total,
                        wrong: res.data.data.all_statistics.wrong,
                        correct:
                            res.data.data.all_statistics.total -
                            res.data.data.all_statistics.wrong,
                        word: { total: 0, wrong: 0, right: 0 },
                        phrases: { total: 0, wrong: 0, right: 0 },
                        sentence: { total: 0, wrong: 0, right: 0 },
                        article: { total: 0, wrong: 0, right: 0 },
                    };

                    res.data.data.type.forEach((item) => {
                        if (item.knowledgepoint_type === "1") {
                            staticsobj.word = {
                                total: item.total,
                                wrong: item.wrong,
                                right: item.total - item.wrong,
                            };
                        }
                        if (item.knowledgepoint_type === "2") {
                            staticsobj.phrases = {
                                total: item.total,
                                wrong: item.wrong,
                                right: item.total - item.wrong,
                            };
                        }
                        if (item.knowledgepoint_type === "3") {
                            staticsobj.sentence = {
                                total: item.total,
                                wrong: item.wrong,
                                right: item.total - item.wrong,
                            };
                        }
                        if (item.knowledgepoint_type === "4") {
                            staticsobj.article = {
                                total: item.total,
                                wrong: item.wrong,
                                right: item.total - item.wrong,
                            };
                        }
                    });
                    this.setState({
                        staticsobj,
                        // list: res.data.data,
                        // isOpacity: res.data.data[4].has_record ? true : false
                    });
                }
            });
    };
    lookUnit = (item, index, authority) => {
        if (authority) {
            this.getlist(item);
            this.getStatics(item);
            this.setState({
                unitIndex: index,
            });
        } else {
            // 没权限
            this.props.setVisible(true);
        }
    };
    renderUnit = () => {
        const { unitList, unitIndex } = this.state;
        const authority = this.props.authority;
        let renderlist = unitList.map((item, index) => {
            return (
                <TouchableOpacity
                    key={index}
                    onPress={this.lookUnit.bind(
                        this,
                        item,
                        index,
                        index === 0 || authority
                    )}
                >
                    <View
                        style={[
                            styles.unitWrap,
                            index === unitIndex && {
                                backgroundColor: "#EDEDF7",
                                borderRadius: pxToDp(40),
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.unitInnder,
                                index === unitIndex && {
                                    backgroundColor: "#fff",
                                    borderRadius: pxToDp(40),
                                },
                                appStyle.flexTopLine,
                                appStyle.flexAliCenter,
                            ]}
                        >
                            <View style={[{ flex: 1 }]}>
                                <Text style={[styles.unitName]}>{item.unit_name}</Text>
                                <Text style={[styles.unitNum]}>
                                    Unit {Number(item.unit_code)}
                                </Text>
                            </View>
                            {index === 0 && !authority ? (
                                <FreeTag
                                    txt="Free"
                                    style={{ marginRight: pxToDp(10) }}
                                    haveAllRadius={true}
                                />
                            ) : null}
                            {index === unitIndex ? (
                                <FontAwesome
                                    name={"chevron-right"}
                                    size={20}
                                    style={{ color: "#FABC0D" }}
                                />
                            ) : null}
                            {/* <Image /> */}
                        </View>
                    </View>
                </TouchableOpacity>
            );
        });
        return renderlist;
    };
    renderStaticsItem = (obj, title) => {
        return (
            <View
                style={[
                    appStyle.flexTopLine,
                    appStyle.flexAliCenter,
                    styles.staticsCenterWrap,
                ]}
            >
                <Text style={[styles.staticsCenterTxt]}>{title}:</Text>
                <View
                    style={[
                        appStyle.flexTopLine,
                        appStyle.flexAliCenter,
                        styles.staticsItem,
                    ]}
                >
                    <Image
                        source={require("../../../../images/englishHomepage/ic_excellent.png")}
                        style={[size_tool(40)]}
                    />
                    <Text style={[styles.staticsRightTxt]}>{obj.right}</Text>
                </View>
                <View
                    style={[
                        appStyle.flexTopLine,
                        appStyle.flexAliCenter,
                        styles.staticsItem,
                    ]}
                >
                    <Image
                        source={require("../../../../images/englishHomepage/ic_error.png")}
                        style={[size_tool(40)]}
                    />
                    <Text style={[styles.staticsWrongTxt]}>{obj.wrong}</Text>
                </View>
            </View>
        );
    };
    renderStatics = () => {
        const { staticsobj, isOpacity } = this.state;
        return (
            <View
                style={[
                    appStyle.flexTopLine,
                    {
                        height: pxToDp(250),
                        paddingRight: pxToDp(40),
                        marginBottom: pxToDp(60),
                    },
                ]}
            >
                <View
                    style={[
                        appStyle.flexTopLine,
                        appStyle.flexAliCenter,
                        padding_tool(20, 0, 20, 0),
                    ]}
                >
                    <CircleStatistcs
                        total={staticsobj.total}
                        right={Number(
                            staticsobj.total > 0
                                ? (staticsobj.correct / staticsobj.total) * 100
                                : 0
                        ).toFixed(0)}
                        width={24}
                        tintColor={"#2CD666"}
                        backgroundColor={"#EFF3F7"}
                        textColor={"#B0B1B7"}
                        textColor1={"#2D3040"}
                        size={180}
                        type={"percent"}
                        totalText={"Accuracy"}
                    />
                    <View
                        style={[
                            appStyle.flexJusBetween,
                            padding_tool(20, 40, 20, 40),
                            {
                                borderRightColor: "#EFF3F7",
                                borderRightWidth: pxToDp(4),
                                height: "100%",
                            },
                        ]}
                    >
                        <View>
                            <Text style={[styles.staticsTxt]}>{staticsobj.total}</Text>
                            <Text style={[styles.staticsTxt1]}>Total</Text>
                        </View>
                        <View>
                            <Text style={[styles.staticsTxt]}>{staticsobj.correct}</Text>
                            <Text style={[styles.staticsTxt1]}>Correct</Text>
                        </View>
                    </View>
                </View>

                <View style={[appStyle.flexJusBetween, { paddingLeft: pxToDp(40) }]}>
                    {this.renderStaticsItem(staticsobj.word, "Word")}
                    {this.renderStaticsItem(staticsobj.phrases, "Phrases")}
                    {this.renderStaticsItem(staticsobj.sentence, "Sentences")}
                    {this.renderStaticsItem(staticsobj.article, "Article")}
                </View>
                <View
                    style={[
                        appStyle.flexTopLine,
                        {
                            flex: 1,
                            position: "relative",
                            paddingRight: pxToDp(50),
                            justifyContent: "flex-end",
                            paddingLeft: pxToDp(20),
                        },
                    ]}
                >
                    <View style={[{ height: "100%", width: pxToDp(360) }]}>
                        <View
                            style={[
                                padding_tool(20, 40, 20, 40),
                                borderRadius_tool(80),
                                { backgroundColor: "#FFF466" },
                            ]}
                        >
                            <Text
                                style={[
                                    appFont.fontFamily_jcyt_700,
                                    {
                                        fontSize: pxToDp(32),
                                        color: "#872A2A",
                                        lineHeight: pxToDp(40),
                                    },
                                ]}
                            >
                                {isOpacity ? `You're amazing!` : `Keep going!`}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={[
                            { position: "absolute", right: pxToDp(0), top: pxToDp(50) },
                        ]}
                    >
                        {isOpacity ? (
                            <Star isOpacity={isOpacity} />
                        ) : (
                            <Image
                                source={require("../../../../images/englishHomepage/testMe/testMeStar.png")}
                                style={[size_tool(160, 136)]}
                            />
                        )}
                    </View>
                </View>
            </View>
        );
    };
    renderMain = () => {
        const { list, bgList, boxBgList, goldList } = this.state;
        let itemList = list.map((item, index) => {
            // 2 有记录 1 可以点击 0不可以点击
            let status = item.has_record
                ? 2
                : index === 0 || list[index - 1].has_record
                    ? 1
                    : 0;
            let gold =
                item.correct_rate >= 85
                    ? 0
                    : item.correct_rate >= 75
                        ? 1
                        : item.correct_rate >= 60
                            ? 2
                            : -1;
            return (
                <TouchableOpacity
                    onPress={this.toRecord.bind(this, item, status !== 0)}
                    style={[{ marginRight: pxToDp(40), marginBottom: pxToDp(50) }]}
                >
                    <ImageBackground
                        source={status > 0 ? bgList[index].bg : bgList[index].bgNo}
                        style={[size_tool(388, 470), appStyle.flexCenter]}
                        resizeMode="contain"
                    >
                        <View
                            style={[
                                {
                                    position: "absolute",
                                    backgroundColor: status > 0 ? "#9863FC" : "#CAD3DB",
                                    top: pxToDp(6),
                                    right: pxToDp(8),
                                },
                                size_tool(236, 80),
                                borderRadius_tool(0, 60, 0, 60),
                                padding_tool(0, 10, 0, 36),
                                appStyle.flexTopLine,
                                appStyle.flexJusBetween,
                            ]}
                        >
                            <View style={[appStyle.flexCenter]}>
                                <Text
                                    style={[
                                        appFont.fontFamily_jcyt_700,
                                        {
                                            fontSize: pxToDp(28),
                                            color: "#fff",
                                            lineHeight: pxToDp(30),
                                        },
                                    ]}
                                >
                                    {item.correct_rate}%
                                </Text>
                            </View>

                            {gold === -1 ? null : (
                                <Image
                                    source={goldList[gold]}
                                    style={[
                                        size_tool(105, 117),
                                        // {
                                        //   position: "absolute",
                                        //   top: pxToDp(6),
                                        //   right: pxToDp(50),
                                        // },
                                    ]}
                                />
                            )}
                        </View>

                        <Text style={[{ opacity: 0 }, styles.startTxt]}>Start</Text>
                        <Image source={boxBgList[status]} style={[size_tool(272)]} />
                        <Text style={[styles.startTxt]}>Start</Text>
                    </ImageBackground>
                </TouchableOpacity>
            );
        });
        return itemList;
    };
    lookRule = () => {
        this.setState({
            ruleVisible: true,
        });
    };
    render() {
        const { ruleVisible, goldList, lookMsg } = this.state;
        return (
            <ImageBackground
                style={[
                    styles.container,
                    { zIndex: 10 },
                    Platform.OS === "ios" && { paddingTop: pxToDp(60) },
                ]}
                source={require("../../../../images/english/sentence/sentenceBg.png")}
            >
                <View
                    style={[
                        appStyle.flexTopLine,
                        appStyle.flexJusBetween,
                        appStyle.flexAliCenter,
                        { height: pxToDp(120) },
                        padding_tool(0, 40, 0, 40),
                    ]}
                >
                    <View style={[{ width: pxToDp(220) }]}>
                        <TouchableOpacity onPress={this.goBack} style={[]}>
                            <Image
                                source={require("../../../../images/chineseHomepage/pingyin/new/back.png")}
                                style={[size_tool(120, 80)]}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text
                        style={[
                            appFont.fontFamily_jcyt_700,
                            { fontSize: pxToDp(32), color: "#2D3040" },
                        ]}
                    >
                        Let's Check / Test Me
                    </Text>
                    <TouchableOpacity
                        style={[
                            appStyle.flexTopLine,
                            appStyle.flexAliCenter,
                            { width: pxToDp(220) },
                        ]}
                        onPress={this.lookRule}
                    >
                        <FontAwesome
                            name={"question-circle"}
                            size={30}
                            style={{ color: "#2D3040" }}
                        />
                        <Text
                            style={[
                                appFont.fontFamily_jcyt_700,
                                {
                                    fontSize: pxToDp(36),
                                    color: "#2D3040",
                                    marginLeft: pxToDp(24),
                                },
                            ]}
                        >
                            奖牌规则
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={[
                        { flex: 1 },
                        appStyle.flexTopLine,
                        padding_tool(0, 40, 40, 40),
                    ]}
                >
                    <View
                        style={[
                            {
                                width: pxToDp(560),
                                marginRight: pxToDp(40),
                            },
                        ]}
                    >
                        {/* 单元 */}
                        <ScrollView>{this.renderUnit()}</ScrollView>
                    </View>
                    <View
                        style={[
                            {
                                flex: 1,
                                backgroundColor: "#fff",
                                borderRadius: pxToDp(60),
                            },
                            padding_tool(60, 20, 0, 60),
                        ]}
                    >
                        <ScrollView>
                            {/* 详情 */}
                            {this.renderStatics()}
                            <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
                                {this.renderMain()}
                            </View>
                        </ScrollView>
                    </View>
                </View>
                <Modal
                    animationType="fade"
                    transparent
                    visible={ruleVisible}
                    supportedOrientations={["portrait", "landscape"]}
                >
                    <View style={[styles.m_container]}>
                        <View style={[styles.m_content]}>
                            <Text
                                style={[
                                    {
                                        color: "#445368",
                                        fontSize: pxToDp(50),
                                        textAlign: "center",
                                        marginBottom: pxToDp(40),
                                    },
                                    appFont.fontFamily_jcyt_700,
                                ]}
                            >
                                奖牌规则
                            </Text>

                            <View
                                style={[
                                    appStyle.flexTopLine,
                                    appStyle.flexCenter,
                                    { marginBottom: pxToDp(40) },
                                ]}
                            >
                                {goldList.map((item, index) => {
                                    return (
                                        <View
                                            key={index}
                                            style={[
                                                appStyle.flexCenter,
                                                index === 1 && {
                                                    marginLeft: pxToDp(68),
                                                    marginRight: pxToDp(68),
                                                },
                                            ]}
                                        >
                                            <Image
                                                source={item}
                                                style={[size_tool(75, 85)]}
                                                resizeMode="contain"
                                            />
                                            <Text
                                                style={[
                                                    appFont.fontFamily_jcyt_500,
                                                    {
                                                        fontSize: pxToDp(24),
                                                        color:
                                                            index === 0
                                                                ? "#D49435"
                                                                : index === 1
                                                                    ? "#9DA0F3"
                                                                    : "#D47B27",
                                                    },
                                                ]}
                                            >
                                                {index === 0
                                                    ? "金徽章"
                                                    : index === 1
                                                        ? "银徽章"
                                                        : "铜徽章"}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>

                            <Text style={[styles.m_txt]}>
                                当答题正确率大于等于85%时，获得金徽章。
                            </Text>
                            <Text style={[styles.m_txt]}>
                                当答题正确率为75%（含）- 85%之间时，获得银徽章。
                            </Text>
                            <Text style={[styles.m_txt]}>
                                当答题正确率为60%（含）- 75%之间时，获得铜徽章。
                            </Text>
                            <Text style={[styles.m_txt]}>
                                当答题正确率小于60%时，没有徽章。
                            </Text>

                            <View style={[appStyle.flexCenter, { marginTop: pxToDp(40) }]}>
                                <TouchableOpacity
                                    style={[styles.m_btn]}
                                    onPress={() => {
                                        this.setState({
                                            ruleVisible: false,
                                        });
                                    }}
                                >
                                    <View style={[styles.m_btn_inner]}>
                                        <Text
                                            style={[
                                                { color: "#fff", fontSize: pxToDp(50) },
                                                appFont.fontFamily_jcyt_700,
                                            ]}
                                        >
                                            好的
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <MsgModal
                    btnText="好的"
                    todo={() => this.setState({ lookMsg: false })}
                    visible={lookMsg}
                    title="提示"
                    msg="小朋友，请先完成上一关哦！"
                />
                <CoinView></CoinView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    unitWrap: {
        width: "100%",
        minHeight: pxToDp(116),
        paddingBottom: pxToDp(6),
        borderRadius: pxToDp(40),
    },
    unitInnder: {
        borderRadius: pxToDp(40),
        // flex: 1,
        ...padding_tool(20, 40, 20, 40),
        width: "100%",
    },
    unitName: {
        fontSize: pxToDp(32),
        ...appFont.fontFamily_jcyt_700,
        color: "#2D3040",
        lineHeight: pxToDp(40),
        width: "100%",
    },
    unitNum: {
        fontSize: pxToDp(24),
        color: "#2D3040",
        ...appFont.fontFamily_jcyt_500,
        opacity: 0.5,
        lineHeight: pxToDp(30),
    },
    staticsTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(36),
        color: "#2D3040",
        lineHeight: pxToDp(40),
    },
    staticsTxt1: {
        ...appFont.fontFamily_jcyt_500,
        fontSize: pxToDp(24),
        color: "#96979F",
        lineHeight: pxToDp(28),
    },
    staticsCenterWrap: {
        borderRadius: pxToDp(100),
        borderWidth: pxToDp(4),
        borderColor: "#EFF3F7",
        minWidth: pxToDp(394),
        // justifyContent: "space-between",
        ...padding_tool(0, 20, 0, 20),
        height: pxToDp(60),
    },
    staticsItem: {
        minWidth: pxToDp(100),
        marginRight: pxToDp(20),
    },
    staticsCenterTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(20),
        color: "#2D3040",
        width: pxToDp(130),
    },
    staticsRightTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(32),
        color: "#50E22C",
        marginLeft: pxToDp(10),
    },
    staticsWrongTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(32),
        color: "#FF6F78",
        marginLeft: pxToDp(10),
    },
    startTxt: {
        ...appFont.fontFamily_jcyt_700,
        color: "#2D3040",
        fontSize: pxToDp(36),
        lineHeight: pxToDp(40),
    },
    m_container: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        ...appStyle.flexCenter,
    },
    m_content: {
        padding: pxToDp(40),
        borderRadius: pxToDp(80),
        backgroundColor: "#fff",
    },
    m_btn: {
        width: pxToDp(220),
        height: pxToDp(140),
        paddingBottom: pxToDp(10),
        backgroundColor: "#FF741D",
        borderRadius: pxToDp(80),
    },
    m_btn_inner: {
        flex: 1,
        borderRadius: pxToDp(80),
        backgroundColor: "#FF8F32",
        ...appStyle.flexCenter,
    },
    m_txt: {
        fontSize: Platform.OS === "android" ? pxToDp(32) : pxToDp(42),
        color: "#4C4C59",
        ...appFont.fontFamily_jcyt_500,
    },
    staticsTitle: {
        ...appFont.fontFamily_jcyt_500,
        fontSize: pxToDp(28),
        color: "#2D3040",
        lineHeight: pxToDp(38),
    },
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        authority: state.getIn(["userInfo", "selestModuleAuthority"]),
        lock_primary_school: state.getIn(["userInfo", "lock_primary_school"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setModules(data) {
            dispatch(purchaseCreators.setModules(data));
        },
        setVisible(data) {
            dispatch(actionCreators.setVisible(data));
        },
        getTaskData(data) {
            dispatch(actionCreatorsDailyTask.getTaskData(data));
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(ChooseTextbook);
