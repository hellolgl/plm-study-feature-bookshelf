import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { appStyle } from "../../../../theme";
import {
    size_tool,
    pxToDp,
    padding_tool,
    borderRadius_tool,
} from "../../../../util/tools";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import OtherUserInfo from "../../../../component/otherUserinfo";
import { connect } from "react-redux";
import CircleStatistcs from "../../../../component/circleStatistcs";
import MyRadarChart from "../../../../component/myRadarChart";
import { Toast } from "antd-mobile-rn";
import MyPieChart from "../../../../component/myChart/myPieChart";
import MyPie from "../../../../component/myChart/my";
import NormalStaticsItem from "../../../../component/chinese/statics/normal";
import ArticleStaticsItem from "../../../../component/chinese/statics/article";
import SentenceStaticsItem from "../../../../component/chinese/statics/sentence";
import CheckType from "./components/checkType";
import UserInfo from "./components/userInfo";
import CheckSubject from "./components/checkSubject";

class ChineseStatisticsHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            paiList: [
                {
                    name: "识字",
                    total: 0,
                    rate_correct: 0,
                    r_total: 0,
                    score: 0,
                    rate_speed: "",
                    type: "character",
                },
                {
                    name: "词汇积累",
                    total: 0,
                    rate_correct: 0,
                    r_total: 0,
                    score: 0,
                    rate_speed: "",
                    type: "word",
                },
                {
                    name: "句型运用",
                    total: 0,
                    rate_correct: 0,
                    r_total: 0,
                    score: 0,
                    rate_speed: "",
                    type: "sentence",
                },
                {
                    name: "阅读",
                    total: 0,
                    rate_correct: 0,
                    r_total: 0,
                    score: 0,
                    rate_speed: "",
                    type: "read",
                },
                {
                    name: "口语交际",
                    total: 0,
                    rate_correct: 0,
                    r_total: 0,
                    score: 0,
                    rate_speed: "",
                    type: "oral",
                },
                {
                    name: "习作",
                    total: 0,
                    rate_correct: 0,
                    r_total: 0,
                    score: 0,
                    rate_speed: "",
                    type: "writing",
                },
            ],
            type: "1",
            rodarName: [],
            rodarvalue: [],
            paiNum: 0,
            paiPercent: 0,
            isShow: false,
            colorlist: {
                good: "#00CC88",
                normal: "#FFAA5C",
                bad: "#FF6680",
            },
            englishType: "character",
            checkItem: {
                name: "识字",
                total: 0,
                rate_correct: 0,
                r_total: 0,
                score: 0,
                rate_speed: "",
                type: "character",
            },
            goodorBad: {
                good: require("../../../../images/chineseHomepage/staticsGood.png"),
                normal: require("../../../../images/chineseHomepage/staticsNormal.png"),
                bad: require("../../../../images/chineseHomepage/staticsBad.png"),
            },
            right_rate: 0,
            speed_rate: 0,
            total_exercise: 0,
            isFlow: true,
        };
    }
    componentDidMount() {
        this.getList(this.state.type);
        this.getRodarValue(this.state.type);
        this.getTotalScore();
    }
    getList(type) {
        const { userInfo, textBookCode } = this.props;
        const userInfoJs = userInfo.toJS();
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam;
        axios
            .get(
                `${api.chineseGetStacisticsHome}/${userInfoJs.id}/${grade_term}/${type}`,
                { params: {} }
            )
            .then((res) => {
                console.log("外面的数据home", res.data.data);

                let list = res.data.data.data;
                let listnow = [];
                let classList = [...this.state.paiList];
                if (list.length > 0) {
                    listnow = [...list];
                } else {
                    for (let i in classList) {
                        if (classList[i].name) {
                            listnow.push({
                                name: classList[i].name,
                                total: 0,
                                rate_correct: 0,
                                r_total: 0,
                                score: 0,
                                rate_speed: "",
                                type: classList[i].type,
                            });
                        }
                    }
                }
                let checkitemnow = {};
                listnow.forEach((item, index) => {
                    if (item.type === this.state.englishType) {
                        checkitemnow = item;
                    }
                });
                this.setState(() => ({
                    paiList: listnow,
                    // englishType: listnow[2].type,
                    right_rate: res.data.data.right_rate,
                    speed_rate: res.data.data.speed_rate,
                    total_exercise: res.data.data.total_exercise,
                    checkItem: checkitemnow,
                    // list: classList
                }));
            });
    }
    getRodarValue(type) {
        // chineseGetStacisticsRodar
        const { userInfo, textBookCode } = this.props;
        const userInfoJs = userInfo.toJS();
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam;
        axios
            .get(
                `${api.chineseGetStacisticsRodar}/${userInfoJs.id}/${grade_term}/${type}`,
                { params: {} }
            )
            .then((res) => {
                let list = res.data.data;
                // if (list.length > 0) {
                console.log("雷达图数据", list);
                let listnow = [];
                let namelist = [];
                for (let i = 0; i < list.length; i++) {
                    listnow.push(list[i].rate_correct + "");
                    namelist.push(list[i].name);
                }
                console.log("iiiii_______", namelist, listnow);
                this.setState({
                    rodarName: namelist,
                    rodarvalue: listnow,
                });
                // }
            });
    }
    goBack() {
        NavigationUtil.goBack(this.props);
    }
    checkType = (typeItem) => {
        this.getList(typeItem.value);
        this.getRodarValue(typeItem.value);
        this.setState({
            type: typeItem.value,
        });
    };
    getTotalScore = () => {
        axios.get(api.getPaiNum, { params: { subject: "01" } }).then((res) => {
            console.log("useinfo pai", res.data.data);
            if (res && res.data.err_code === 0) {
                this.setState({
                    paiNum: res.data.data.score,
                    paiPercent: res.data.data.ranking,
                });
            }
        });
    };
    render() {
        const {
            right_rate,
            speed_rate,
            total_exercise,
            type,
            paiList,
            paiNum,
            paiPercent,
            isShow,
            colorlist,
            checkItem,
            englishType,
            goodorBad,
            isFlow,
        } = this.state;
        return (
            <View style={[styles.container]}>
                <ScrollView style={[{ flex: 1 }, padding_tool(20, 60, 60, 60)]}>
                    <View
                        style={[
                            appStyle.flexLine,
                            { justifyContent: "space-between", marginBottom: pxToDp(30) },
                        ]}
                    >
                        <CheckSubject
                            defaultSubject="chinese"
                            changeSubject={this.props.changeSubject}
                        />
                        <CheckType checkType={this.checkType} />
                    </View>
                    <View
                        style={[
                            {
                                width: "100%",
                                height: pxToDp(648),
                                backgroundColor: "#fff",
                                borderRadius: pxToDp(40),
                                position: "relative",
                                marginBottom: pxToDp(40),
                            },
                            padding_tool(0, 40, 40, 40),
                            appStyle.flexTopLine,
                            appStyle.flexJusBetween,
                            appStyle.flexAliCenter,
                        ]}
                    >
                        <View style={[size_tool(800, 500)]}>
                            {/* 左边 */}
                            <View
                                style={[
                                    appStyle.flexTopLine,
                                    appStyle.flexAliCenter,
                                    { marginBottom: pxToDp(72) },
                                ]}
                            >
                                <UserInfo />
                            </View>
                            <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                                <View style={[size_tool(240, 208)]}>
                                    <View style={[styles.circleWrap]}>
                                        <Image
                                            source={require("../../../../images/chineseHomepage/staticsStar.png")}
                                            style={[size_tool(72), borderRadius_tool(36)]}
                                        />
                                    </View>

                                    <Text style={[styles.circleText1]}>{total_exercise}</Text>
                                    <Text style={[styles.circleText2]}>合计已做题</Text>
                                </View>

                                <View style={[size_tool(240, 208)]}>
                                    {/* <MyPieChart /> */}
                                    <View style={[styles.circleWrap]}>
                                        <MyPie
                                            length={pxToDp(18)}
                                            width={72}
                                            percent={right_rate / 100}
                                            color={
                                                right_rate > 84
                                                    ? "#00CC88"
                                                    : right_rate > 69
                                                        ? "#FFAA5C"
                                                        : "#FF6680"
                                            }
                                        />
                                    </View>
                                    <Text style={[styles.circleText1]}>{right_rate + "%"}</Text>
                                    <Text style={[styles.circleText2]}>合计正确率</Text>
                                </View>

                                <View style={[size_tool(240, 208)]}>
                                    <View style={[styles.circleWrap]}>
                                        <Image
                                            source={
                                                speed_rate > 84
                                                    ? goodorBad.good
                                                    : speed_rate > 69
                                                        ? goodorBad.normal
                                                        : goodorBad.bad
                                            }
                                            style={[size_tool(72), borderRadius_tool(36)]}
                                        />
                                    </View>
                                    <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                                        <Text style={[styles.circleText1]}>{speed_rate + "%"}</Text>
                                        <TouchableOpacity
                                            style={[{ marginLeft: pxToDp(20) }]}
                                            onPress={() =>
                                                this.setState({
                                                    isShow: !isShow,
                                                })
                                            }
                                        >
                                            {isShow ? (
                                                <Image
                                                    source={require("../../../../images/chineseHomepage/staticsWhat2.png")}
                                                    style={[size_tool(40)]}
                                                />
                                            ) : (
                                                <Image
                                                    source={require("../../../../images/chineseHomepage/staticsWhat.png")}
                                                    style={[size_tool(40)]}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.circleText2]}>平均答题速率</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[size_tool(592, 568), { marginRight: pxToDp(60) }]}>
                            {/* y右边 */}
                            {this.state.rodarvalue.length > 0 ? (
                                <MyRadarChart
                                    valueList={this.state.rodarvalue}
                                    namelist={this.state.rodarName}
                                />
                            ) : (
                                <Image
                                    source={require("../../../../images/chineseHomepage/staticsNoData.png")}
                                    style={[size_tool(592, 568)]}
                                />
                            )}
                        </View>
                        {isShow ? (
                            <View
                                style={[
                                    size_tool(700, 212),
                                    borderRadius_tool(40),
                                    padding_tool(40),
                                    appStyle.flexTopLine,
                                    appStyle.flexJusBetween,
                                    {
                                        position: "absolute",
                                        backgroundColor: "#F5F5FA",
                                        bottom: pxToDp(20),
                                        left: pxToDp(700),
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        {
                                            width: pxToDp(520),
                                            fontSize: pxToDp(32),
                                            color: "#4C4C59",
                                        },
                                    ]}
                                >
                                    90%及以上答题时间低于建议答题时间为优秀；80%-89%为良好；79%及以下为较慢。
                                </Text>
                                <TouchableOpacity
                                    style={[{ marginLeft: pxToDp(20) }]}
                                    onPress={() =>
                                        isShow ? this.setState({ isShow: false }) : null
                                    }
                                >
                                    <Image
                                        source={require("../../../../images/chineseHomepage/staticsClose.png")}
                                        style={[
                                            size_tool(60),
                                            { backgroundColor: "#fff", borderRadius: pxToDp(30) },
                                        ]}
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : null}
                    </View>

                    <View
                        style={[
                            appStyle.flexTopLine,
                            appStyle.flexJusBetween,
                            { marginBottom: pxToDp(40) },
                        ]}
                    >
                        {paiList.map((item, index) => {
                            let bgtype =
                                item.rate_correct > 84
                                    ? "good"
                                    : item.rate_correct > 69
                                        ? "normal"
                                        : "bad";
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        appStyle.flexAliCenter,
                                        {
                                            // width: pxToDp(288),
                                            // height: pxToDp(414),
                                            paddingBottom: pxToDp(20),
                                        },
                                    ]}
                                    onPress={() =>
                                        this.setState({
                                            checkItem: item,
                                            englishType: item.type,
                                            isFlow: true,
                                        })
                                    }
                                >
                                    <View
                                        style={[
                                            styles.rightItem,
                                            {
                                                backgroundColor:
                                                    item.type === englishType ? "#4C4C59" : "#fff",
                                            },
                                        ]}
                                    >
                                        <View
                                            style={{
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                flex: 1,
                                            }}
                                        >
                                            <View style={{ marginBottom: pxToDp(10) }}>
                                                <CircleStatistcs
                                                    total={item.total}
                                                    right={Number(item.rate_correct)}
                                                    size={200}
                                                    width={20}
                                                    totalText={"正确率"}
                                                    tintColor={colorlist[bgtype]} //答对的颜色
                                                    backgroundColor={
                                                        item.type === englishType ? "#40404B" : "#E9E9F2"
                                                    }
                                                    type="percent"
                                                    percenteSize={40}
                                                    textColor1={
                                                        item.type === englishType ? "#fff" : "#4C4C59"
                                                    }
                                                    textColor={"#9595A6"}
                                                />
                                            </View>
                                            <Text
                                                style={[
                                                    {
                                                        fontSize: pxToDp(24),
                                                        color: "#9595A6",
                                                        marginBottom: pxToDp(20),
                                                    },
                                                ]}
                                            >
                                                已完成{item.total}题
                                            </Text>
                                            <Text
                                                style={[
                                                    {
                                                        fontSize: pxToDp(36),
                                                        color:
                                                            item.type === englishType ? "#fff" : "#4C4C59",
                                                    },
                                                ]}
                                            >
                                                {item.name}
                                            </Text>
                                        </View>
                                    </View>
                                    <Image
                                        style={[
                                            size_tool(40),
                                            { opacity: item.type === englishType ? 1 : 0 },
                                        ]}
                                        source={require("../../../../images/chineseHomepage/statistics/icon_5.png")}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View>
                        <View
                            style={[
                                { marginBottom: pxToDp(40) },
                                appStyle.flexTopLine,
                                appStyle.flexJusBetween,
                                appStyle.flexAliCenter,
                            ]}
                        >
                            <View style={[appStyle.flexTopLine]}>
                                <Text
                                    style={[
                                        {
                                            fontSize: pxToDp(48),
                                            color: "#4C4C59",
                                            fontWeight: "bold",
                                        },
                                    ]}
                                >
                                    {checkItem.name ? checkItem.name : ""}学术能力报告:
                                </Text>
                                {checkItem.type === "read" || checkItem.type === "sentence" ? (
                                    <View
                                        style={[
                                            size_tool(320, 60),
                                            borderRadius_tool(200),
                                            appStyle.flexTopLine,
                                            { backgroundColor: "#fff", marginLeft: pxToDp(40) },
                                        ]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({ isFlow: true })}
                                            style={[
                                                size_tool(160, 60),
                                                borderRadius_tool(200),
                                                appStyle.flexCenter,
                                                { backgroundColor: isFlow ? "#4C4C59" : "#fff" },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        fontSize: pxToDp(28),
                                                        color: isFlow ? "#fff" : "#A5A5AC",
                                                    },
                                                ]}
                                            >
                                                同步
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ isFlow: false })}
                                            style={[
                                                size_tool(160, 60),
                                                borderRadius_tool(200),
                                                appStyle.flexCenter,
                                                { backgroundColor: isFlow ? "#fff" : "#4C4C59" },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        fontSize: pxToDp(28),
                                                        color: isFlow ? "#A5A5AC" : "#fff",
                                                    },
                                                ]}
                                            >
                                                {checkItem.type === "read" ? "专项" : "智能句"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : null}
                            </View>
                            <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                                <View
                                    style={[
                                        size_tool(280, 108),
                                        appStyle.flexTopLine,
                                        appStyle.flexAliCenter,
                                    ]}
                                >
                                    <View
                                        style={[styles.circleWrap, { marginRight: pxToDp(20) }]}
                                    >
                                        <MyPie
                                            color={
                                                checkItem.rate_correct > 84
                                                    ? "#00CC88"
                                                    : checkItem.rate_correct > 69
                                                        ? "#FFAA5C"
                                                        : "#FF6680"
                                            }
                                            length={pxToDp(18)}
                                            width={72}
                                            percent={
                                                checkItem.rate_correct
                                                    ? checkItem.rate_correct / 100
                                                    : 0
                                            }
                                        />
                                    </View>
                                    <View>
                                        {console.log("正确率", checkItem)}
                                        <Text style={[styles.circleText1]}>
                                            {checkItem.rate_correct ? checkItem.rate_correct : "0"}%
                                        </Text>
                                        <Text style={[styles.circleText2]}>合计正确率</Text>
                                    </View>
                                </View>

                                <View
                                    style={[
                                        size_tool(280, 108),
                                        appStyle.flexTopLine,
                                        appStyle.flexAliCenter,
                                    ]}
                                >
                                    <View
                                        style={[styles.circleWrap, { marginRight: pxToDp(20) }]}
                                    >
                                        <Image
                                            source={
                                                checkItem.rate_speed > 84
                                                    ? goodorBad.good
                                                    : checkItem.rate_speed > 69
                                                        ? goodorBad.normal
                                                        : goodorBad.bad
                                            }
                                            style={[size_tool(72), borderRadius_tool(36)]}
                                        />
                                    </View>
                                    <View>
                                        <Text style={[styles.circleText1]}>
                                            {checkItem.rate_speed ? checkItem.rate_speed : "0"}%
                                        </Text>

                                        <Text style={[styles.circleText2]}>平均答题速率</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {checkItem.type === "writing" ? (
                            <ArticleStaticsItem
                                data={{
                                    ...checkItem,
                                    type: type,
                                    englishType: englishType,
                                }}
                            />
                        ) : checkItem.type === "sentence" && !isFlow ? (
                            <SentenceStaticsItem
                                data={{
                                    ...checkItem,
                                    type: type,
                                    englishType: englishType,
                                }}
                            />
                        ) : (
                            <NormalStaticsItem
                                data={{
                                    ...checkItem,
                                    type: type,
                                    englishType: englishType,
                                    category: isFlow ? "1" : "2",
                                }}
                            />
                        )}
                        <View style={[{ height: pxToDp(40) }]}></View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F4F0",
    },
    headerWrap: {
        width: "100%",
        height: pxToDp(124),
        backgroundColor: "#fff",
        marginBottom: pxToDp(0),
    },
    circleWrap: {
        backgroundColor: "transparent",
        borderWidth: pxToDp(4),
        borderColor: "#E4E4F0",
        justifyContent: "center",
        alignItems: "center",
        width: pxToDp(88),
        height: pxToDp(88),
        borderRadius: pxToDp(44),
        marginBottom: pxToDp(14),
    },
    circleText1: {
        fontSize: pxToDp(48),
        color: "#4C4C59",
        marginBottom: pxToDp(10),
    },
    circleText2: {
        fontSize: pxToDp(28),
        color: "#9595A6",
    },
    rightItem: {
        width: pxToDp(288),
        height: pxToDp(394),
        backgroundColor: "#fff",
        justifyContent: "space-between",
        borderRadius: pxToDp(32),
        padding: pxToDp(40),
        marginBottom: pxToDp(-20),
    },
    myCircle: {
        width: pxToDp(40),
        height: pxToDp(40),
        borderRadius: pxToDp(20),
        marginRight: pxToDp(14),
        marginLeft: pxToDp(20),
    },
    myCircleText: {
        fontSize: pxToDp(28),
        color: "#9595A6",
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        textBookCode: state.getIn(["bagEnglish", "textBookCode"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispathToProps
)(ChineseStatisticsHome);
