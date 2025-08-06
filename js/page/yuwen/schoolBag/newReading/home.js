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
} from "react-native";
import {
    borderRadius_tool,
    margin_tool,
    padding_tool,
    pxToDp,
    size_tool,
    getGradeInfo,
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

const log = console.log.bind(console);

const imglist = [
    require("../../../../images/chineseHomepage/sentence/icon13.png"),
    require("../../../../images/chineseHomepage/sentence/icon14.png"),
    require("../../../../images/chineseHomepage/sentence/icon15.png"),
    require("../../../../images/chineseHomepage/sentence/icon16.png"),
    require("../../../../images/chineseHomepage/sentence/icon17.png"),
    require("../../../../images/chineseHomepage/sentence/icon18.png"),
    require("../../../../images/chineseHomepage/sentence/icon19.png"),
    require("../../../../images/chineseHomepage/sentence/icon20.png"),
    require("../../../../images/chineseHomepage/sentence/icon21.png"),
    require("../../../../images/chineseHomepage/sentence/icon22.png"),
    require("../../../../images/chineseHomepage/sentence/icon23.png"),
    require("../../../../images/chineseHomepage/sentence/icon24.png"),

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
const titleType = [
    {
        name: "现代文",
        backgroundColor: "#9876E5",
    },
    {
        name: "古诗问",
        backgroundColor: "#E7B452",
    },
    {
        name: "其他",
        backgroundColor: "#61C9E7",
    },
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
            exercise_set_id: -1,
        };
        this.audio = null;
    }
    componentWillUnmount() {
        this.eventListenerRefreshPage.remove();
        this.props.getTaskData()
    }
    componentDidMount() {
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "backReadingHome",
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
        // console.log(userInfoJs, "userInfoJs");
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam;

        axios
            .get(`${api.chinesDailySpeReadingStatics}?grade_term=${grade_term}`, {
                params: {},
            })
            .then((res) => {
                if (res.data.err_code === 0) {
                    let listnow = [];
                    let data = res.data.data.data;
                    data.forEach((item, index) => {
                        let itemlist = item.son_category.map((i) => ({
                            ...i,
                            type: index,
                            category: item.category,
                        }));
                        listnow = listnow.concat([...itemlist]);
                    });
                    // let listnow = res.data.data.son_category.filter((item) => item.inspect_name !== '智能造句')
                    // console.log('listnow', listnow)
                    this.setState({
                        list: listnow,
                        rate_correct: res.data.data.right_rate
                            ? res.data.data.right_rate
                            : 0,
                        has_record: res.data.data.exercise_set_id !== -1,
                        exercise_set_id: res.data.data.exercise_set_id,
                    });
                }
            });
    };
    toDaily = (authority) => {
        if (!authority) {
            this.props.setVisible(true);
            return;
        }

        const { has_record, exercise_set_id } = this.state;
        let data = {
            has_record: has_record,
            type: "daily",
            exercise_set_id,
        };
        if (has_record) {
            NavigationUtil.toNewReadingRecord({
                ...this.props,
                data,
            });
        } else {
            NavigationUtil.toNewReadingDailyExercise({
                ...this.props,
                data,
            });
        }
    };
    toFlow = () => {
        NavigationUtil.toNewReadingFlowList(this.props);
    };
    toSpe = (item, authority) => {
        if (!authority) {
            this.props.setVisible(true);
            return;
        }
        NavigationUtil.toNewReadingExplain({
            ...this.props,
            data: {
                ...item,
            },
        });
    };
    render() {
        const { list, rate_correct, lookMsg } = this.state;
        // log("cn checkGrade: ", checkGrade)
        // log("cn checkTerCode: ", this.state.visible)
        let rightIndex = 0;

        const authority = this.props.authority;
        return (
            <View style={[styles.container]}>
                <ImageBackground
                    source={require("../../../../images/chineseHomepage/reading/homeBg.png")}
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
                            阅读理解
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
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={[padding_tool(48, 148, 0, 148)]}>
                        <View
                            style={[
                                appStyle.flexTopLine,
                                padding_tool(42),
                                appStyle.flexJusBetween,
                                { marginBottom: pxToDp(40) },
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
                                            },
                                        ]}
                                    >
                                        正确率： {rate_correct}%
                                    </Text>
                                </View>
                            </View>
                            <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                                <TouchableOpacity
                                    onPress={this.toFlow}
                                    style={[size_tool(224, 128), { marginRight: pxToDp(120) }]}
                                >
                                    <View
                                        style={[
                                            size_tool(254, 128),
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
                                                拓展阅读
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.toDaily.bind(this, authority)}>
                                    <Image style={[styles.saraAi, {
                                        transform: [{ rotate: '-8deg' }],
                                    }]} resizeMode="contain" source={require("../../../../images/sara_ai.png")} />
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
                                                        appFont.fontFamily_jcyt_500,
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

                        <View style={[appStyle.flexTopLine, appStyle.flexLineWrap, {}]}>
                            {list.map((item, index) => {
                                let img =
                                    item.rate_correct > 84
                                        ? imglist[index]
                                        : require("../../../../images/chineseHomepage/sentence/icon.png");
                                let height =
                                    item.rate_correct > 84 ? 0 : 2.6 * item.rate_correct;
                                item.has_article !== "0" ? rightIndex++ : "";
                                return item.has_article !== "0" ? (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={this.toSpe.bind(
                                            this,
                                            item,
                                            index === 0 || authority
                                        )}
                                    >
                                        <View
                                            key={index}
                                            style={[
                                                size_tool(320, 546),
                                                borderRadius_tool(40),
                                                {
                                                    backgroundColor: "#EDEDF4",
                                                    paddingBottom: pxToDp(8),
                                                    marginRight: rightIndex % 5 === 0 ? 0 : pxToDp(27),
                                                    marginBottom: pxToDp(38),
                                                },
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    borderRadius_tool(40),
                                                    padding_tool(40),
                                                    appStyle.flexAliCenter,
                                                    { backgroundColor: "#fff", flex: 1 },
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
                                                <Text
                                                    style={[
                                                        appFont.fontFamily_syst_bold,
                                                        {
                                                            fontSize: pxToDp(item.name.length > 5 ? 36 : 40),
                                                            color: "#475266",
                                                            lineHeight: pxToDp(50),
                                                            marginBottom: pxToDp(10),
                                                        },
                                                    ]}
                                                >
                                                    {item.name}
                                                </Text>
                                                <View
                                                    style={[
                                                        size_tool(125, 45),
                                                        borderRadius_tool(20),
                                                        appStyle.flexCenter,
                                                        {
                                                            backgroundColor:
                                                                titleType[item.type].backgroundColor,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            appFont.fontFamily_syst_bold,
                                                            {
                                                                fontSize: pxToDp(32),
                                                                color: "#fff",
                                                                // lineHeight: pxToDp(
                                                                //   Platform.OS === "ios" ? 40 : 40
                                                                // ),
                                                            },
                                                        ]}
                                                    >
                                                        {titleType[item.type].name}
                                                    </Text>
                                                </View>
                                                <View
                                                    style={[
                                                        size_tool(240, 280),
                                                        margin_tool(10, 0, 10, 0),
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
                                                            {item.correct_num}
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
                                ) : null;
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
        ...appFont.fontFamily_syst_bold,
        fontSize: pxToDp(32),
        color: "#475266",
        lineHeight: pxToDp(40),
    },
    itemTxt2: {
        ...appFont.fontFamily_syst,
        fontSize: pxToDp(24),
        color: "#475266",
        opacity: 0.5,
        lineHeight: pxToDp(30),
    },
    itemTitle1: {
        ...appFont.fontFamily_syst_bold,
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
        width: pxToDp(189),
        height: pxToDp(120),
        position: "absolute",
        top: pxToDp(-80),
        left: pxToDp(-40),
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
