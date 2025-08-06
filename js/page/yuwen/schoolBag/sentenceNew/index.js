import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ImageBackground,
    Image,
    ScrollView,
    DeviceEventEmitter,
    BackHandler,
} from "react-native";
import {
    borderRadius_tool,
    margin_tool,
    padding_tool,
    pxToDp,
    size_tool,
} from "../../../../util/tools";
import { appStyle, appFont } from "../../../../theme";
import NavigationUtil from "../../../../navigator/NavigationUtil";

import { connect } from "react-redux";
import CircleStatistcs from "../../../../component/circleStatistcs";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";

import MsgModal from "../../../../component/chinese/sentence/ruleModal";
import FreeTag from "../../../../component/FreeTag";
import * as actionCreators from "../../../../action/purchase/index";
import CoinView from '../../../../component/coinView'
import * as actionCreatorsDailyTask from "../../../../action/dailyTask";

const imglist = [
    require("../../../../images/chineseHomepage/sentence/icon1.png"),
    require("../../../../images/chineseHomepage/sentence/icon2.png"),
    require("../../../../images/chineseHomepage/sentence/icon3.png"),
    require("../../../../images/chineseHomepage/sentence/icon4.png"),
    require("../../../../images/chineseHomepage/sentence/icon5.png"),
    require("../../../../images/chineseHomepage/sentence/icon6.png"),
    require("../../../../images/chineseHomepage/sentence/icon7.png"),
    require("../../../../images/chineseHomepage/sentence/icon8.png"),
    require("../../../../images/chineseHomepage/sentence/icon9.png"),
    require("../../../../images/chineseHomepage/sentence/icon10.png"),
    require("../../../../images/chineseHomepage/sentence/icon11.png"),
    require("../../../../images/chineseHomepage/sentence/icon12.png"),
];
class homePage extends PureComponent {
    constructor(props) {
        super(props);
        console.log("学生数据", props.userInfo.toJS());
        this.state = {
            list: [],
            rate_correct: 0,
            lookMsg: false,
            has_record: false,
            exercise_total: 0,
        };
        this.audio = null;
    }
    componentWillUnmount() {
        this.eventListenerRefreshPage.remove();
        this.backBtnListener && this.backBtnListener.remove();
        this.props.getTaskData()
    }
    componentDidMount() {
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "backSentenceHome",
            () => this.getlist()
        );
        this.getlist();
    }

    goback = () => {
        NavigationUtil.goBack(this.props);
    };

    getlist = () => {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam;
        axios
            .get(`${api.getChinesSenstatistics}?grade_term=${grade_term}`, {
                params: {},
            })
            .then((res) => {
                console.log("数据", res.data);
                if (res.data.err_code === 0) {
                    let listnow = res.data.data.son_category.filter(
                        (item) => item.inspect_name !== "智能造句"
                    );
                    // console.log("listnow", listnow);
                    this.setState({
                        list: listnow,
                        rate_correct: res.data.data.rate_correct
                            ? res.data.data.rate_correct
                            : 0,
                        has_record: res.data.data.has_record,
                        exercise_total: res.data.data.exercise_total,
                    });
                }
                // let list = res.data.data.son_category
                // let listnow = []
                // let speObj = {}
                // // listnow = [...list]
                // list.map((item) => {
                //     item.inspect_name === '智能造句' ? speObj = { ...item } : listnow.push({ ...item })
                // })

                // this.setState({
                //     list: listnow,
                //     longlist: list,
                //     rate_speed: res.data.data.rate_speed,
                //     rate_correct: res.data.data.rate_correct,
                //     speItem: speObj
                // })
            });
    };
    toDaily = (authority) => {
        const { has_record } = this.state;
        let data = {
            has_record: this.state.has_record,
            sub_modular: "1",
            modular: "1",
            type: "diary",
        };
        if (authority) {
            if (has_record) {
                NavigationUtil.toNewSentenceExerciseRercord({
                    ...this.props,
                    data,
                });
            } else {
                NavigationUtil.toNewSentenceDoExercise({
                    ...this.props,
                    data,
                });
            }
        } else {
            this.props.setVisible(true);
        }
    };
    toFlow = () => {
        NavigationUtil.toNewSentenceFlowList(this.props);
    };
    AiAnswerQuestions = () => {
        NavigationUtil.toYuwenAIGiveExerciseDoExercise(this.props);
    }
    toSpe = (item, authority) => {
        if (authority) {
            NavigationUtil.toNewSentenceSpeList({
                ...this.props,
                data: {
                    ...item,
                },
            });
        } else {
            this.props.setVisible(true);
        }
    };
    render() {
        const { list, rate_correct, lookMsg, exercise_total } = this.state;
        // log("cn checkGrade: ", checkGrade)
        // log("cn checkTerCode: ", this.state.visible)

        const authority = this.props.authority;
        return (
            <View style={[styles.container]}>
                <ImageBackground
                    source={require("../../../../images/chineseHomepage/sentence/sentenceBg.png")}
                    style={[
                        { flex: 1 },
                        padding_tool(Platform.OS === "ios" ? 60 : 20, 20, 20, 20),
                    ]}
                    resizeMode="cover"
                >
                    <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
                        <TouchableOpacity
                            style={[size_tool(120, 80)]}
                            onPress={this.goback}
                        >
                            <Image
                                style={[size_tool(120, 80)]}
                                source={require("../../../../images/chineseHomepage/pingyin/new/back.png")}
                            />
                        </TouchableOpacity>
                        <Text
                            style={[
                                appFont.fontFamily_jcyt_700,
                                { fontSize: pxToDp(48), color: "#475266" },
                            ]}
                        >
                            中文句法
                        </Text>
                        <TouchableOpacity
                            style={[size_tool(120, 80)]}
                            onPress={() => this.setState({ lookMsg: true })}
                        >
                            <View
                                style={[
                                    size_tool(120, 80),
                                    { backgroundColor: "#FF964A" },
                                    borderRadius_tool(200),
                                    appStyle.flexCenter,
                                ]}
                            >
                                <Text
                                    style={[
                                        appFont.fontFamily_jcyt_700,
                                        { fontSize: pxToDp(36), color: "#fff" },
                                    ]}
                                >
                                    规则
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* padding_tool(0, 148, 0, 148) */}
                    <ScrollView style={[{ flex: 1 }]}>
                        <View
                            style={[
                                appStyle.flexTopLine,
                                padding_tool(42, 190, 42, 190),
                                appStyle.flexJusBetween,
                                { marginBottom: pxToDp(20) },
                            ]}
                        >
                            <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                                <CircleStatistcs
                                    total={100}
                                    right={Number(rate_correct)}
                                    size={140}
                                    width={20}
                                    tintColor={rate_correct > 74 ? "#60E093" : "#FF867E"} //答对的颜色
                                    backgroundColor={"#fff"}
                                    type="percent"
                                    noTxt={true}
                                />
                                <View style={[{ marginLeft: pxToDp(20) }]}>
                                    <Text
                                        style={[
                                            appFont.fontFamily_jcyt_700,
                                            {
                                                fontSize: pxToDp(64),
                                                color: "#475266",
                                                lineHeight: pxToDp(80),
                                            },
                                        ]}
                                    >
                                        综合能力
                                    </Text>
                                    <Text
                                        style={[
                                            appFont.fontFamily_jcyt_500,
                                            {
                                                fontSize: pxToDp(32),
                                                color: "#475266",
                                                lineHeight: pxToDp(40),
                                                marginBottom: pxToDp(10),
                                            },
                                        ]}
                                    >
                                        正确率： {rate_correct}%
                                    </Text>
                                    <Text
                                        style={[
                                            appFont.fontFamily_jcyt_500,
                                            {
                                                fontSize: pxToDp(32),
                                                color: "#475266",
                                                lineHeight: pxToDp(40),
                                            },
                                        ]}
                                    >
                                        题目数量： {exercise_total}
                                    </Text>
                                </View>
                            </View>
                            <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>

                                <TouchableOpacity
                                    onPress={this.AiAnswerQuestions}
                                    style={[size_tool(224, 128), { marginRight: pxToDp(120) }]}
                                >
                                    <View
                                        style={[
                                            size_tool(224, 128),
                                            {
                                                backgroundColor: "#EDEDF4",
                                                paddingBottom: pxToDp(8),
                                                position: "relative",
                                            },
                                            borderRadius_tool(40),
                                        ]}
                                    >
                                        {!authority ? (
                                            <FreeTag
                                                style={{
                                                    position: "absolute",
                                                    top: pxToDp(-40),
                                                    right: pxToDp(-50),
                                                    zIndex: 99,
                                                }}
                                            />
                                        ) : null}
                                        <View
                                            style={[
                                                { flex: 1, backgroundColor: "#fff" },
                                                appStyle.flexCenter,
                                                borderRadius_tool(40),
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    appFont.fontFamily_jcyt_700,
                                                    { fontSize: pxToDp(48), color: "#475266" },
                                                ]}
                                            >
                                                答题
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.toFlow}
                                    style={[size_tool(224, 128), { marginRight: pxToDp(120) }]}
                                >
                                    <View
                                        style={[
                                            size_tool(224, 128),
                                            {
                                                backgroundColor: "#EDEDF4",
                                                paddingBottom: pxToDp(8),
                                                position: "relative",
                                            },
                                            borderRadius_tool(40),
                                        ]}
                                    >
                                        {!authority ? (
                                            <FreeTag
                                                style={{
                                                    position: "absolute",
                                                    top: pxToDp(-40),
                                                    right: pxToDp(-50),
                                                    zIndex: 99,
                                                }}
                                            />
                                        ) : null}
                                        <View
                                            style={[
                                                { flex: 1, backgroundColor: "#fff" },
                                                appStyle.flexCenter,
                                                borderRadius_tool(40),
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    appFont.fontFamily_jcyt_700,
                                                    { fontSize: pxToDp(48), color: "#475266" },
                                                ]}
                                            >
                                                校内同步
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.toDaily.bind(this, authority)}>
                                    <View
                                        style={[
                                            size_tool(498, 128),
                                            { backgroundColor: "#F07C39", paddingBottom: pxToDp(8) },
                                            borderRadius_tool(40),
                                        ]}
                                    >
                                        <View
                                            style={[
                                                { flex: 1, backgroundColor: "#FF964A" },
                                                appStyle.flexCenter,
                                                borderRadius_tool(40),
                                                appStyle.flexTopLine,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    appFont.fontFamily_jcyt_700,
                                                    { fontSize: pxToDp(48), color: "#fff" },
                                                ]}
                                            >
                                                每日一练
                                            </Text>
                                            <View
                                                style={[
                                                    size_tool(126, 48),
                                                    margin_tool(0, 20, 0, 40),
                                                    borderRadius_tool(100),
                                                    appStyle.flexCenter,
                                                    { backgroundColor: "#fff" },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        appFont.fontFamily_syst,
                                                        { fontSize: pxToDp(28), color: "#FF964A" },
                                                    ]}
                                                >
                                                    AI推题
                                                </Text>
                                            </View>
                                            <Image
                                                style={[size_tool(40)]}
                                                source={require("../../../../images/chineseHomepage/sentence/go.png")}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[appStyle.flexTopLine, appStyle.flexLineWrap, { paddingLeft: pxToDp(148) }]}>
                            {list.map((item, index) => {
                                let img =
                                    item.rate_correct > 84
                                        ? imglist[index]
                                        : require("../../../../images/chineseHomepage/sentence/icon.png");
                                let height =
                                    item.rate_correct > 84 ? 0 : 2.6 * item.rate_correct;
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={this.toSpe.bind(
                                            this,
                                            item,
                                            index === 0 || authority
                                        )}
                                    >
                                        {/* {item.inspect_name === '句型训练' ? <Image style={[styles.saraAi, {
                                            transform: [{ rotate: '-8deg' }],
                                        },]} resizeMode="contain" source={require("../../../../images/sara_ai.png")} /> : null} */}
                                        <View
                                            key={index}
                                            style={[
                                                size_tool(320, 546),
                                                borderRadius_tool(40),
                                                {
                                                    backgroundColor: "#EDEDF4",
                                                    paddingBottom: pxToDp(8),
                                                    marginRight: index % 5 === 4 ? 0 : pxToDp(27),
                                                    marginBottom: pxToDp(38),
                                                },
                                            ]}
                                        >
                                            {index === 0 && !authority ? (
                                                <FreeTag
                                                    style={{
                                                        position: "absolute",
                                                        top: pxToDp(-40),
                                                        right: pxToDp(-20),
                                                        zIndex: 99,
                                                    }}
                                                />
                                            ) : null}
                                            <View
                                                style={[
                                                    borderRadius_tool(40),
                                                    padding_tool(40),
                                                    appStyle.flexAliCenter,
                                                    { backgroundColor: "#fff", flex: 1 },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        appFont.fontFamily_syst_bold,
                                                        {
                                                            fontSize: pxToDp(40),
                                                            color: "#475266",
                                                            lineHeight: pxToDp(50),
                                                        },
                                                    ]}
                                                >
                                                    {item.inspect_name}
                                                </Text>
                                                <View
                                                    style={[
                                                        size_tool(240, 280),
                                                        margin_tool(40, 0, 30, 0),
                                                        {
                                                            position: "relative",
                                                            justifyContent: "flex-end",
                                                            paddingBottom: pxToDp(10),
                                                            alignItems: "center",
                                                        },
                                                    ]}
                                                >
                                                    <View
                                                        style={[
                                                            {
                                                                width: pxToDp(180),
                                                                height: pxToDp(height),
                                                                backgroundColor:
                                                                    item.rate_correct > 74
                                                                        ? "#60E093"
                                                                        : "#FF867E",
                                                            },
                                                        ]}
                                                    ></View>
                                                    <ImageBackground
                                                        style={[
                                                            size_tool(240, 280),
                                                            { position: "absolute", top: 0, left: 0 },
                                                            appStyle.flexCenter,
                                                        ]}
                                                        source={img}
                                                    >
                                                        {item.rate_correct > 84 ? null : (
                                                            <View style={[appStyle.flexCenter]}>
                                                                <Text style={[styles.itemTitle1]}>
                                                                    {item.rate_correct}%
                                                                </Text>
                                                                <Text style={[styles.itemTitle2]}>正确率</Text>
                                                            </View>
                                                        )}
                                                    </ImageBackground>
                                                </View>

                                                <View
                                                    style={[
                                                        appStyle.flexTopLine,
                                                        appStyle.flexJusBetween,
                                                        { width: pxToDp(200) },
                                                    ]}
                                                >
                                                    <View style={[appStyle.flexAliCenter]}>
                                                        <Text style={[styles.itemTxt1]}>
                                                            {item.right_total}
                                                        </Text>
                                                        <Text style={[styles.itemTxt2]}>正确数</Text>
                                                    </View>
                                                    <View style={[appStyle.flexAliCenter]}>
                                                        <Text style={[styles.itemTxt1]}>{item.total}</Text>
                                                        <Text style={[styles.itemTxt2]}>答题数</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>
                    <MsgModal
                        btnText="好的"
                        todo={() => this.setState({ lookMsg: false })}
                        visible={lookMsg}
                        title="规则说明"
                        msg="“同步练”，“每日一练”的题都会影响对应的统计。 当某一个类型达到85%正确率即可得到徽章。"
                    />
                    <CoinView></CoinView>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        // padding: pxToDp(40),
        // backgroundColor: 'pink'
    },
    itemTxt1: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(32),
        color: "#475266",
        lineHeight: pxToDp(40),
    },
    itemTxt2: {
        ...appFont.fontFamily_jcyt_500,
        fontSize: pxToDp(24),
        color: "#475266",
        opacity: 0.5,
        lineHeight: pxToDp(30),
    },
    itemTitle1: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(48),
        lineHeight: pxToDp(56),
        color: "#475266",
    },
    itemTitle2: {
        ...appFont.fontFamily_syst,
        fontSize: pxToDp(24),
        lineHeight: pxToDp(32),
        color: "#475266",
    },
    saraAi: {
        width: pxToDp(160),
        height: pxToDp(120),
        position: "absolute",
        top: pxToDp(-70),
        left: pxToDp(-50),
        zIndex: 1
    }
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        lock_primary_school: state.getIn(["userInfo", "lock_primary_school"]),
        authority: state.getIn(["userInfo", "selestModuleAuthority"]),
    };
};

const mapDispathToProps = (dispatch) => {
    // 存数据
    return {
        setUser(data) {
            dispatch(actionCreators.setUserInfoNow(data));
        },
        setVisible(data) {
            dispatch(actionCreators.setVisible(data));
        },
        getTaskData(data) {
            dispatch(actionCreatorsDailyTask.getTaskData(data));
        }
    };
};
export default connect(mapStateToProps, mapDispathToProps)(homePage);
