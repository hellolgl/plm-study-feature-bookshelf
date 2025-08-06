import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    ScrollView,
    ActivityIndicator,
    DeviceEventEmitter,
    Dimensions,
} from "react-native";
import { appFont, appStyle } from "../../../../theme";
import {
    size_tool,
    pxToDp,
    padding_tool,
    pxToDpHeight,
    borderRadius_tool,
} from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil";
import Statics from "./component/statics";
import Msg from "./component/msg";
import Rule from "./component/rule";
import History from "./component/history";
import FreeTag from "../../../../component/FreeTag";
import * as actionCreators from "../../../../action/purchase/index";
import BackBtn from "../../../../component/math/BackBtn";
import _ from "lodash";
import CoinView from '../../../../component/coinView'
import * as actionCreatorsDailyTask from "../../../../action/dailyTask";

class SyncDiagnosisHomePage extends PureComponent {
    constructor(props) {
        super(props);
        this.eventListenerRefreshPage = undefined;
        this.state = {
            unit_list: [],
            unit_index: -1,
            origin: "",
            lesson_list: [],
            isAllRight: false,
            statisticsVisible: false,
            exercise_set_id: {},
            rodarvalue: [],
            rodarName: [],
            msgVisible: false,
            isGood: true,
            know: "",
            knowItem: {},
            showRule: false,
            improve_rate: 0,
            showHistory: false,
            knowledge_name: "",
            knowledge_code: "",
            is_guide: "1",
        };
        this.scroll = null;
    }
    componentDidMount() {
        this.getUnit();
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "refreshPage",
            (event) => {
                this.getUnit();
            }
        );
    }

    componentWillUnmount() {
        this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
        this.props.getTaskData()
    }

    getUnit = async () => {
        const { userInfo, textCode } = this.props;
        const { unit_index } = this.state;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.textbook = textCode;
        axios.get(api.getMathSyncDiagnosisUnit, { params: data }).then((res) => {
            let data = res.data.data.unit_data;
            // console.log("单元", res.data);
            let unit_list = [];
            let origin = "";
            let _unit_index = -1;
            if (data.length > 0) {
                unit_list = data;
                _unit_index = 0;
                if (unit_index > -1) {
                    _unit_index = unit_index;
                }
                origin = unit_list[_unit_index].origin;
                _unit_index = _unit_index;
            }
            this.setState(
                {
                    unit_list,
                    origin,
                    unit_index: _unit_index,
                },
                () => {
                    this.getLesson();
                }
            );
        });
    };

    getLesson = () => {
        const { origin } = this.state;
        axios
            .get(api.getMathAiGiveExerciseHomeList, { params: { origin } })
            .then((res) => {
                let data = res.data.data.element;
                let lesson_list = [],
                    plan = [],
                    element = [],
                    sync = [];
                console.log("要素", res.data.data);

                if (data.length > 0) {
                    lesson_list = data.filter((i) => {
                        return i.right_rate.legnth === 0 || Number(i.right_rate) < 90;
                    });
                    data.forEach((i) => {
                        plan.push(i.exercise_set_id.plan || "");
                        element.push(i.exercise_set_id.element || "");
                        sync.push(i.exercise_set_id.sync || "");
                    });
                }
                let id_list = {
                    plan,
                    element,
                    sync,
                };
                // console.log('id_list', id_list)

                this.setState({
                    lesson_list: [...data],
                    isAllRight: lesson_list.length === 0,
                    exercise_set_id: { ...id_list },
                    improve_rate: res.data.data.improve_rate,
                    is_guide: res.data.data.is_guide,
                });
            });
    };

    getRodar = () => {
        const { origin, exercise_set_id } = this.state;
        axios
            .get(api.getMathAiGiveExerciseRodar, {
                params: { origin, ...exercise_set_id },
            })
            .then((res) => {
                let data = res.data.data;
                let value = [],
                    name = [];
                data.forEach((i) => {
                    name.push(i.ability);
                    value.push(i.right_rate + "");
                });
                // console.log("要素", data);

                this.setState(
                    {
                        rodarName: name,
                        rodarvalue: value,
                    },
                    () => [
                        this.setState({
                            statisticsVisible: true,
                        }),
                    ]
                );
            });
    };
    goBack = () => {
        NavigationUtil.goBack(this.props);
    };
    allDoExercise = () => {
        const { origin, isAllRight } = this.state;
        if (!isAllRight) return;
        MathNavigationUtil.toMathAIGiveExerciseDoExercise({
            ...this.props,
            data: { origin, isAll: true },
        });
    };
    todo = () => {
        const { origin, knowItem, isAllRight } = this.state;
        const { textCode } = this.props;
        this.setState({
            msgVisible: false,
        });
        MathNavigationUtil.toMathAIGiveExerciseDoExercise({
            ...this.props,
            data: {
                ...knowItem,
                origin,
                element_status: isAllRight ? "1" : "0",
            },
        });
    };
    toDoExercise = (item) => {
        // item.status = 0
        const { textCode, authority } = this.props;
        const { origin, unit_index } = this.state;
        if (!authority && unit_index > 0) {
            this.props.setVisible(true);
            return;
        }
        if (
            item.right_rate.length === 0 ||
            (Number(item.right_rate) < 90 && Number(item.right_rate) >= 60)
        ) {
            MathNavigationUtil.toMathAIGiveExerciseDoExercise({
                ...this.props,
                data: {
                    ...item,
                    origin,
                    element_status: this.state.isAllRight ? "1" : "0",
                },
            });
        } else {
            axios
                .get(api.getMathAiGiveExerciseKnow, {
                    params: {
                        knowledge_code: item.knowledge_code,
                        category_type:
                            item.right_rate.length === 0
                                ? "0"
                                : Number(item.right_rate) < 90
                                    ? "2"
                                    : "1",
                        element_status: this.state.isAllRight ? "1" : "0",
                        right_rate: item.right_rate,
                        textbook: textCode,
                    },
                })
                .then((res) => {
                    let data = res.data.data;
                    console.log(data);
                    this.setState({
                        know: data.knowledge_name,
                        knowItem: item,
                        msgVisible: true,
                        isGood: Number(item.right_rate) >= 90,
                    });
                });
        }

        // MathNavigationUtil.toMathAIGiveExerciseDoExercise({ ...this.props, data: { ...item } });
    };
    clickUnit = (item, index) => {
        // console.log("=======", this.scroll);

        this.scroll && this.scroll.scrollTo({ x: 0, y: 0, animated: false });

        this.setState(
            {
                unit_index: index,
                origin: item.origin,
            },
            () => {
                this.getLesson();
            }
        );
    };
    gethistory = (item) => {
        const { origin, knowItem, isAllRight } = this.state;
        this.setState({
            knowledge_name: item.knowledge_name,
            knowledge_code: item.knowledge_code,
            showHistory: true,
        });
        // axios.get(api.getMathAiGiveHistoryKnow, {
        //     params: {
        //         origin, knowledge_code: item.knowledge_code, textbook: '11'
        //     }
        // }).then((res) => {
        //     let data = res.data.data
        //     console.log(data)
        //     // this.setState({
        //     //     know: data.knowledge_name,
        //     //     knowItem: item, msgVisible: true,
        //     //     isGood: Number(item.right_rate) >= 90,
        //     // })

        // });
    };
    lookexercise = (id) => {
        this.setState({
            knowledge_name: "",
            knowledge_code: "",
            showHistory: false,
        });

        NavigationUtil.toMathAIGiveExerciseLookExercise({
            ...this.props,
            data: {
                exercise_set_id: id,
            },
        });
    };
    render() {
        const {
            unit_list,
            unit_index,
            lesson_list,
            isAllRight,
            statisticsVisible,
            rodarName,
            rodarvalue,
            msgVisible,
            isGood,
            know,
            showRule,
            improve_rate,
            showHistory,
            origin,
            knowledge_name,
            knowledge_code,
            is_guide,
        } = this.state;
        const { authority } = this.props;
        return (
            <ImageBackground
                style={[styles.container]}
                source={require("../../../../images/MathSyncDiagnosis/bg_1.png")}
            >
                <BackBtn goBack={this.goBack}></BackBtn>
                <Text style={[styles.header]}>AI推题</Text>
                <TouchableOpacity
                    style={[styles.rule_btn, appStyle.flexTopLine, appStyle.flexCenter]}
                    onPress={() => this.setState({ showRule: !this.state.showRule })}
                >
                    <Image
                        style={{ width: pxToDp(40), height: pxToDp(40) }}
                        resizeMode="contain"
                        source={require("../../../../images/aiGiveExercise/rule.png")}
                    ></Image>
                    <Text
                        style={[
                            {
                                fontSize: pxToDp(32),
                                color: "#006868",
                                marginLeft: pxToDp(20),
                            },
                            appFont.fontFamily_jcyt_700,
                        ]}
                    >
                        规则
                    </Text>
                </TouchableOpacity>
                <View style={[appStyle.flexTopLine, styles.content]}>
                    {unit_list.length === 0 ? (
                        <View
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "40%",
                            }}
                        >
                            <ActivityIndicator size={"large"} color={"#999999"} />
                        </View>
                    ) : (
                        <>
                            <ScrollView
                                style={[styles.left]}
                                contentContainerStyle={{ paddingBottom: pxToDp(100) }}
                            >
                                {unit_list.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                this.clickUnit(item, index);
                                            }}
                                        >
                                            <View
                                                style={[
                                                    styles.unit_item_img,
                                                    {
                                                        backgroundColor:
                                                            unit_index === index ? "#B8D9DB" : "transparent",
                                                    },
                                                ]}
                                            >
                                                <View
                                                    style={[
                                                        styles.unit_item_img_nei,
                                                        appStyle.flexCenter,
                                                        {
                                                            backgroundColor:
                                                                unit_index === index ? "#fff" : "transparent",
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        numberOfLines={1}
                                                        ellipsizeMode={"tail"}
                                                        style={[
                                                            styles.ui_name,
                                                            unit_index === index
                                                                ? appFont.fontFamily_jcyt_700
                                                                : null,
                                                        ]}
                                                    >
                                                        {item.ui_name.trim().split(" ")[0]}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                            <View style={[{ flex: 1 }, padding_tool(0, 40, 40, 0)]}>
                                <View style={[styles.right, padding_tool(40)]}>
                                    <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
                                        <Text
                                            style={[
                                                appFont.fontFamily_jcyt_700,
                                                { color: "#475266", fontSize: pxToDp(40) },
                                            ]}
                                        >
                                            {unit_list[unit_index].ui_name}
                                        </Text>
                                        <TouchableOpacity
                                            style={[appStyle.flexTopLine, appStyle.flexAliCenter]}
                                            onPress={this.getRodar}
                                        >
                                            <Image
                                                source={require("../../../../images/aiGiveExercise/statics.png")}
                                                style={[size_tool(40), { marginRight: pxToDp(24) }]}
                                            />
                                            <Text
                                                style={[
                                                    appFont.fontFamily_jcyt_700,
                                                    { fontSize: pxToDp(32), color: "#00B295" },
                                                ]}
                                            >
                                                能力分布
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView
                                        ref={(scrollRef) => (this.scroll = scrollRef)}
                                        horizontal={true}
                                        style={[{ flex: 1, position: "relative" }]}
                                        contentContainerStyle={styles.right_contentContainerStyle}
                                    >
                                        <View
                                            style={[
                                                { position: "absolute", left: pxToDp(200), zIndex: 0 },
                                                appStyle.flexTopLine,
                                            ]}
                                        >
                                            {lesson_list.map((item, index) => {
                                                return index < lesson_list.length - 1 ? (
                                                    <Image
                                                        key={index}
                                                        source={
                                                            index % 2 === 0
                                                                ? require("../../../../images/aiGiveExercise/line_down.png")
                                                                : require("../../../../images/aiGiveExercise/line_top.png")
                                                        }
                                                        style={[size_tool(406, 120), {}]}
                                                    />
                                                ) : null;
                                            })}
                                        </View>
                                        {lesson_list.map((item, index) => {
                                            let bg = require("../../../../images/aiGiveExercise/bg3.png"),
                                                color = "#fff";
                                            if (item.right_rate.length !== 0) {
                                                let num = Number(item.right_rate);
                                                console.log("分数", num >= 90);
                                                switch (true) {
                                                    case num >= 90:
                                                        bg = require("../../../../images/aiGiveExercise/bg4.png");
                                                        break;
                                                    case num < 90 && num >= 60:
                                                        bg = require("../../../../images/aiGiveExercise/bg2.png");
                                                        break;
                                                    default:
                                                        bg = require("../../../../images/aiGiveExercise/bg1.png");
                                                        break;
                                                }
                                            }
                                            // let bg = item.right_rate.length === 0 ? require('../../../../images/aiGiveExercise/bg3.png')
                                            //     : Number(item.right_rate) < 90 ? require('../../../../images/aiGiveExercise/bg1.png')
                                            //         : require('../../../../images/aiGiveExercise/bg4.png')
                                            // let color = item.right_rate.length === 0 ? '#4BA9FF'
                                            //     : Number(item.right_rate) < 90 ? '#F35B5B' : '#1DB061'
                                            return (
                                                <View
                                                    key={index}
                                                    style={[
                                                        appStyle.flexCenter,
                                                        { width: pxToDp(400) },
                                                        index % 2 === 0
                                                            ? { paddingBottom: pxToDp(120) }
                                                            : { paddingTop: pxToDp(140) },
                                                    ]}
                                                >
                                                    {index % 2 === 0 ? (
                                                        <Text style={[styles.titleTxt]}>
                                                            {item.knowledge_name}
                                                        </Text>
                                                    ) : null}
                                                    <TouchableOpacity
                                                        style={[{ zIndex: 999 }]}
                                                        onPress={this.toDoExercise.bind(this, item)}
                                                    >
                                                        {!authority && unit_index === 0 ? (
                                                            <View
                                                                style={[
                                                                    {
                                                                        position: "absolute",
                                                                        zIndex: 1,
                                                                        right: pxToDp(-20),
                                                                    },
                                                                ]}
                                                            >
                                                                <FreeTag></FreeTag>
                                                            </View>
                                                        ) : null}
                                                        <ImageBackground
                                                            source={bg}
                                                            style={[size_tool(280), appStyle.flexCenter, ,]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    { color: color, fontSize: pxToDp(56) },
                                                                    appFont.fontFamily_jcyt_700,
                                                                ]}
                                                            >{`${item.right_rate}${item.right_rate.length === 0 ? "0" : "%"
                                                                }`}</Text>
                                                            <Text
                                                                style={[
                                                                    { color: color, fontSize: pxToDp(28) },
                                                                    appFont.fontFamily_jcyt_500,
                                                                ]}
                                                            >
                                                                {item.right_rate.length === 0
                                                                    ? "未作答"
                                                                    : "综合正确率"}
                                                            </Text>
                                                        </ImageBackground>
                                                    </TouchableOpacity>

                                                    {index % 2 === 1 ? (
                                                        <Text style={[styles.titleTxt]}>
                                                            {item.knowledge_name}
                                                        </Text>
                                                    ) : null}
                                                    <TouchableOpacity
                                                        onPress={this.gethistory.bind(this, item)}
                                                    >
                                                        <Text
                                                            style={[
                                                                { fontSize: pxToDp(32), color: "#00B295" },
                                                                appFont.fontFamily_jcyt_700,
                                                            ]}
                                                        >
                                                            答题记录
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            );
                                        })}
                                    </ScrollView>
                                    <View
                                        style={[
                                            appStyle.flexTopLine,
                                            appStyle.flexJusBetween,
                                            appStyle.flexAliCenter,
                                            {
                                                height: pxToDp(160),
                                                borderRadius: pxToDp(200),
                                                backgroundColor: isAllRight
                                                    ? "rgba(255,172,74,0.1)"
                                                    : "rgba(199,174,146,0.1)",
                                                padding: pxToDp(20),
                                            },
                                        ]}
                                    >
                                        <View
                                            style={[appStyle.flexTopLine, appStyle.flexAliCenter]}
                                        >
                                            <Image
                                                source={
                                                    isAllRight
                                                        ? require("../../../../images/aiGiveExercise/icon1.png")
                                                        : require("../../../../images/aiGiveExercise/icon2.png")
                                                }
                                                style={[size_tool(120), { marginRight: pxToDp(20) }]}
                                            />
                                            {isAllRight ? (
                                                <View>
                                                    <Text
                                                        style={[
                                                            { color: "#EF8F00", fontSize: pxToDp(40) },
                                                            appFont.fontFamily_jcyt_700,
                                                        ]}
                                                    >
                                                        太棒了！
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            { color: "#EF8F00", fontSize: pxToDp(28) },
                                                            appFont.fontFamily_jcyt_500,
                                                        ]}
                                                    >
                                                        所有要素综合正确率达到了90%以上。
                                                    </Text>
                                                </View>
                                            ) : (
                                                <View>
                                                    <Text
                                                        style={[
                                                            { color: "#9D8E78", fontSize: pxToDp(40) },
                                                            appFont.fontFamily_jcyt_700,
                                                        ]}
                                                    >
                                                        加油!
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            { color: "#9D8E78", fontSize: pxToDp(28) },
                                                            appFont.fontFamily_jcyt_500,
                                                        ]}
                                                    >
                                                        所有要素综合正确率达到了90%以上解锁。
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                        <View
                                            style={[appStyle.flexTopLine, appStyle.flexAliCenter]}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        fontSize: pxToDp(64),
                                                        color: isAllRight ? "#FFA41C" : "#9D8E78",
                                                        marginRight: pxToDp(40),
                                                    },
                                                    appFont.fontFamily_jcyt_700,
                                                ]}
                                            >
                                                {improve_rate === -1 ? "" : improve_rate + "%"}
                                            </Text>
                                            <TouchableOpacity onPress={this.allDoExercise}>
                                                <View
                                                    style={[
                                                        size_tool(360, 100),
                                                        borderRadius_tool(120),
                                                        {
                                                            backgroundColor: isAllRight
                                                                ? "#FF862F"
                                                                : "#CCCCCC",
                                                            paddingBottom: pxToDp(8),
                                                        },
                                                    ]}
                                                >
                                                    <View
                                                        style={[
                                                            {
                                                                flex: 1,
                                                                backgroundColor: isAllRight
                                                                    ? "#FFAC4A"
                                                                    : "#DCDCDC",
                                                            },
                                                            borderRadius_tool(120),
                                                            appStyle.flexCenter,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                { fontSize: pxToDp(40), color: "#fff" },
                                                                appFont.fontFamily_jcyt_700,
                                                            ]}
                                                        >
                                                            单元综合提升1
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </>
                    )}
                    <Statics
                        visible={statisticsVisible}
                        close={() => {
                            this.setState({
                                statisticsVisible: false,
                            });
                        }}
                        rodarName={rodarName}
                        rodarvalue={rodarvalue}
                    ></Statics>
                    <Msg
                        visible={msgVisible}
                        close={() => {
                            this.setState({
                                msgVisible: false,
                            });
                        }}
                        isGood={isGood}
                        know={know}
                        todo={this.todo}
                    />
                </View>
                <Rule
                    show={showRule}
                    close={() => {
                        this.setState({ showRule: false });
                    }}
                />
                {showHistory ? (
                    <History
                        lookexercise={this.lookexercise}
                        show={showHistory}
                        close={() => {
                            this.setState({ showHistory: false });
                        }}
                        knowledge_code={knowledge_code}
                        knowledge_name={knowledge_name}
                        origin={origin}
                    />
                ) : null}
                {is_guide === "0" ? (
                    <View
                        style={[
                            {
                                width: "100%",
                                height: Dimensions.get("window").height,
                                backgroundColor: "rgba(0,0,0,0.5)",
                                position: "absolute",
                                top: pxToDp(0),
                                left: pxToDp(0),
                                zIndex: 99999,
                                paddingLeft: pxToDp(360),
                                paddingBottom: pxToDp(120),
                            },
                            appStyle.flexAliCenter,
                            appStyle.flexTopLine,
                        ]}
                    >
                        <View
                            style={[
                                size_tool(316),
                                appStyle.flexCenter,
                                borderRadius_tool(200),
                                { backgroundColor: "#fff" },
                            ]}
                        >
                            <ImageBackground
                                source={require("../../../../images/aiGiveExercise/bg3.png")}
                                style={[size_tool(280), appStyle.flexCenter]}
                            >
                                <Text
                                    style={[
                                        { color: "#fff", fontSize: pxToDp(56) },
                                        appFont.fontFamily_jcyt_700,
                                    ]}
                                >
                                    0
                                </Text>
                                <Text
                                    style={[
                                        { color: "#fff", fontSize: pxToDp(28) },
                                        appFont.fontFamily_jcyt_500,
                                    ]}
                                >
                                    未作答
                                </Text>
                            </ImageBackground>
                        </View>
                        <View style={[{ marginLeft: pxToDp(40) }]}>
                            <Text
                                style={[
                                    {
                                        fontSize: pxToDp(40),
                                        color: "#fff",
                                        marginBottom: pxToDp(20),
                                    },
                                    appFont.fontFamily_jcyt_700,
                                ]}
                            >
                                点击这里可以进入答题页面哦
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ is_guide: "1" });
                                }}
                            >
                                <View
                                    style={[
                                        size_tool(300, 100),
                                        borderRadius_tool(40),
                                        padding_tool(0, 0, 6, 0),
                                        { backgroundColor: "#00836D" },
                                    ]}
                                >
                                    <View
                                        style={[
                                            { flex: 1, backgroundColor: "#00B295" },
                                            borderRadius_tool(40),
                                            appStyle.flexCenter,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                { fontSize: pxToDp(32), color: "#fff" },
                                                appFont.fontFamily_jcyt_700,
                                            ]}
                                        >
                                            知道了
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}
                <CoinView></CoinView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? pxToDpHeight(10) : pxToDpHeight(60),
    },
    rule_btn: {
        position: "absolute",
        top: Platform.OS === "android" ? pxToDpHeight(0) : pxToDpHeight(40),
        right: pxToDp(0),
        zIndex: 0,
        width: pxToDp(194),
        height: pxToDp(120),
    },
    header: {
        textAlign: "center",
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(40),
        color: "#246666",
        marginBottom: pxToDp(40),
    },
    content: {
        flex: 1,
    },
    unit_item_img: {
        width: pxToDp(220),
        height: pxToDp(118),
        paddingBottom: pxToDp(6),
        borderRadius: pxToDp(40),
        marginBottom: pxToDp(24),
    },
    unit_item_img_nei: {
        width: pxToDp(220),
        height: pxToDp(112),
        borderRadius: pxToDp(40),
    },
    left: {
        paddingLeft: pxToDp(40),
        width: pxToDp(300),
        flexGrow: 0,
        paddingTop: pxToDp(40),
    },
    right: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: pxToDp(40),
    },
    ui_name: {
        fontSize: pxToDp(36),
        ...appFont.fontFamily_jcyt_500,
        color: "#246666",
    },
    lesson_item_img: {
        width: pxToDp(440),
        height: pxToDp(798),
        marginRight: pxToDp(40),
        marginBottom: pxToDp(40),
        ...appStyle.flexAliCenter,
        paddingTop: pxToDp(60),
        paddingLeft: pxToDp(32),
        paddingRight: pxToDp(32),
    },
    right_contentContainerStyle: {
        ...appStyle.flexLine,
    },

    titleTxt: {
        ...appFont.fontFamily_jcyt_500,
        fontSize: pxToDp(32),
        color: "#475266",
        textAlign: "center",
        opacity: 0.8,
    },
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        textCode: state.getIn(["bagMath", "textBookCode"]),
        authority: state.getIn(["userInfo", "selestModuleAuthority"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setVisible(data) {
            dispatch(actionCreators.setVisible(data));
        },
        getTaskData(data) {
            dispatch(actionCreatorsDailyTask.getTaskData(data));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispathToProps
)(SyncDiagnosisHomePage);
