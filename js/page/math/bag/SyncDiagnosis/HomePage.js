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
} from "react-native";
import { appFont, appStyle } from "../../../../theme";
import { pxToDp, padding_tool, pxToDpHeight } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import CircleStatistcs from "../../../../component/circleStatistcs";
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil";
import FreeTag from "../../../../component/FreeTag";
import * as actionCreators from "../../../../action/purchase/index";
import BackBtn from "../../../../component/math/BackBtn";
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
        };
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

    getUnit = () => {
        const { userInfo, textCode } = this.props;
        const { unit_index } = this.state;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.textbook = textCode;
        data.subject = "02";
        axios.get(api.getMathSyncDiagnosisUnit, { params: data }).then((res) => {
            let data = res.data.data.unit_data;
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
        })
    };

    getLesson = () => {
        const { origin } = this.state;
        axios
            .get(api.getMathSyncDiagnosisLesson, { params: { origin } })
            .then((res) => {
                let data = res.data.data;
                let lesson_list = [];
                if (data.length > 0) {
                    lesson_list = data.filter((i) => {
                        return i.type === 0;
                    });
                }
                this.setState({
                    lesson_list,
                });
            });
    };

    clickUnit = (item, index) => {
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

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    clickBtn = (item, index, authority) => {
        const { unit_index } = this.state;
        if (!authority && unit_index !== 0) {
            this.props.setVisible(true);
            return;
        }
        MathNavigationUtil.toSyncDiagnosisDoExercise({
            ...this.props,
            data: { ...item },
        });
    };

    renderStatistic = (item) => {
        if (item.all_count === 0 && item.status === "0") {
            // 从来没有答过题
            return (
                <View style={[styles.statistic_wrap]}>
                    <View style={[appStyle.flexAliCenter]}>
                        <Text
                            style={[
                                { color: "#fff", fontSize: pxToDp(44) },
                                appFont.fontFamily_jcyt_700,
                            ]}
                        >
                            0%
                        </Text>
                        <Text
                            style={[
                                { color: "#fff", fontSize: pxToDp(22) },
                                appFont.fontFamily_jcyt_500,
                                Platform.OS === "ios" ? { marginTop: pxToDp(36) } : null,
                            ]}
                        >
                            未开始
                        </Text>
                    </View>
                </View>
            );
        }
        if (item.status === "1") {
            let percent = Math.round((item.answer_count / item.all_count) * 100);
            // 可以继续作答
            return (
                <View style={[styles.statistic_wrap]}>
                    <View style={[appStyle.flexAliCenter]}>
                        <Text
                            style={[
                                { color: "#fff", fontSize: pxToDp(44) },
                                appFont.fontFamily_jcyt_700,
                            ]}
                        >
                            {percent}%
                        </Text>
                        <Text
                            style={[
                                { color: "#fff", fontSize: pxToDp(22) },
                                appFont.fontFamily_jcyt_500,
                                Platform.OS === "ios" ? { marginTop: pxToDp(36) } : null,
                            ]}
                        >
                            进度
                        </Text>
                    </View>
                    <View style={[styles.bar, { height: `${percent}%` }]}></View>
                </View>
            );
        }
        // 做完一套可以重新做
        let percent = Math.round((item.right_count / item.answer_count) * 100);
        return (
            <View style={[styles.circleWrap]}>
                <CircleStatistcs
                    total={1}
                    right={percent}
                    size={240}
                    width={30}
                    backgroundWidth={30}
                    totalText={"正确率"}
                    tintColor={"#FFAE64"} //答对的颜色
                    backgroundColor={"#0A7360"}
                    type="percent"
                    percenteSize={40}
                    textColor1={"#fff"}
                    textColor={"#fff"}
                    fontFamily_1={appFont.fontFamily_jcyt_700}
                    fontFamily={appFont.fontFamily_jcyt_500}
                />
            </View>
        );
    };

    renderTxt = (item) => {
        if (item.all_count === 0 && item.status === "0") {
            // 从来没有答过题
            return "答题";
        }
        if (item.status === "1") {
            // 可以继续作答
            return "继续作答";
        }
        return "再答一次";
    };

    render() {
        const { unit_list, unit_index, lesson_list } = this.state;
        let authority = this.props.authority;
        return (
            <ImageBackground
                style={[styles.container]}
                source={require("../../../../images/MathSyncDiagnosis/bg_1.png")}
            >
                <BackBtn goBack={this.goBack}></BackBtn>
                <Text style={[styles.header]}>同步诊断</Text>
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
                                            <ImageBackground
                                                style={[styles.unit_item_img]}
                                                resizeMode="stretch"
                                                source={
                                                    unit_index === index
                                                        ? require("../../../../images/MathSyncDiagnosis/active_bg_1.png")
                                                        : null
                                                }
                                            >
                                                <Text
                                                    numberOfLines={1}
                                                    ellipsizeMode={"tail"}
                                                    style={[
                                                        styles.ui_name,
                                                        unit_index === index ? { color: "#fff" } : null,
                                                    ]}
                                                >
                                                    {item.ui_name}
                                                </Text>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                            <ScrollView
                                style={[styles.right]}
                                contentContainerStyle={styles.right_contentContainerStyle}
                            >
                                {lesson_list.map((item, index) => {
                                    let lesson_font_size = pxToDp(40);
                                    if (item.lesson_name.length > 8)
                                        lesson_font_size = pxToDp(28);
                                    return (
                                        <ImageBackground
                                            style={[styles.lesson_item_img]}
                                            resizeMode="stretch"
                                            source={require("../../../../images/MathSyncDiagnosis/item_bg_1.png")}
                                            key={index}
                                        >
                                            {unit_index === 0 && !authority ? (
                                                <View
                                                    style={[
                                                        {
                                                            position: "absolute",
                                                            zIndex: 1,
                                                            top: pxToDp(-20),
                                                            right: pxToDp(-20),
                                                        },
                                                    ]}
                                                >
                                                    <FreeTag
                                                        style={{ backgroundColor: "#fff" }}
                                                        color={"#00B295"}
                                                    ></FreeTag>
                                                </View>
                                            ) : null}
                                            <Text
                                                style={[
                                                    { fontSize: pxToDp(24), color: "#fff" },
                                                    appFont.fontFamily_jcyt_500,
                                                ]}
                                            >
                                                课时{index + 1}
                                            </Text>
                                            <Text
                                                style={[
                                                    {
                                                        fontSize: lesson_font_size,
                                                        color: "#fff",
                                                        height: pxToDp(100),
                                                    },
                                                    appFont.fontFamily_jcyt_700,
                                                    Platform.OS === "android"
                                                        ? { marginTop: pxToDp(-20) }
                                                        : null,
                                                ]}
                                            >
                                                {item.lesson_name}
                                            </Text>
                                            {this.renderStatistic(item)}
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.clickBtn(item, index, authority);
                                                }}
                                            >
                                                <ImageBackground
                                                    source={require("../../../../images/MathSyncDiagnosis/btn_bg_1.png")}
                                                    style={[
                                                        { width: pxToDp(292), height: pxToDp(112) },
                                                        appStyle.flexCenter,
                                                    ]}
                                                    resizeMode="stretch"
                                                >
                                                    <Text
                                                        style={[
                                                            { color: "#0A7360", fontSize: pxToDp(32) },
                                                            appFont.fontFamily_jcyt_700,
                                                        ]}
                                                    >
                                                        {this.renderTxt(item)}
                                                    </Text>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                            <View
                                                style={[
                                                    appStyle.flexLine,
                                                    {
                                                        marginTop:
                                                            Platform.OS === "android"
                                                                ? pxToDp(20)
                                                                : pxToDp(60),
                                                    },
                                                ]}
                                            >
                                                <View
                                                    style={[
                                                        appStyle.flexAliCenter,
                                                        { marginRight: pxToDp(40) },
                                                    ]}
                                                >
                                                    <Text style={[styles.txt_1]}>{item.count}</Text>
                                                    <Text
                                                        style={[
                                                            styles.txt_2,
                                                            Platform.OS === "android"
                                                                ? { marginTop: pxToDp(-20) }
                                                                : null,
                                                        ]}
                                                    >
                                                        已做次数
                                                    </Text>
                                                </View>
                                                <View style={[appStyle.flexAliCenter]}>
                                                    <Text style={[styles.txt_1]}>{item.max_acc}%</Text>
                                                    <Text
                                                        style={[
                                                            styles.txt_2,
                                                            Platform.OS === "android"
                                                                ? { marginTop: pxToDp(-20) }
                                                                : null,
                                                        ]}
                                                    >
                                                        最高正确率
                                                    </Text>
                                                </View>
                                            </View>
                                        </ImageBackground>
                                    );
                                })}
                            </ScrollView>
                        </>
                    )}
                </View>
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
        width: pxToDp(488),
        height: pxToDp(160),
        ...appStyle.flexJusCenter,
        paddingLeft: pxToDp(40),
        paddingTop: pxToDp(50),
        paddingRight: pxToDp(50),
    },
    left: {
        paddingLeft: pxToDp(40),
        width: pxToDp(600),
        flexGrow: 0,
    },
    right: {
        flex: 1,
    },
    ui_name: {
        fontSize: pxToDp(36),
        ...appFont.fontFamily_jcyt_700,
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
        ...appStyle.flexLineWrap,
    },
    freeTag: {
        position: "absolute",
        top: 0,
        right: 0,
        width: pxToDp(128),
        height: pxToDp(44),
    },
    txt_1: {
        color: "#BAFAEF",
        fontSize: pxToDp(48),
        ...appFont.fontFamily_jcyt_500,
    },
    txt_2: {
        color: "#BAFAEF",
        fontSize: pxToDp(24),
        ...appFont.fontFamily_jcyt_500,
    },
    circleWrap: {
        width: pxToDp(240),
        height: pxToDp(240),
        marginTop: pxToDp(20),
        marginBottom: pxToDp(60),
    },
    statistic_wrap: {
        width: pxToDp(240),
        height: pxToDp(240),
        backgroundColor: "#0A7360",
        borderRadius: pxToDp(120),
        marginTop: pxToDp(20),
        marginBottom: pxToDp(60),
        ...appStyle.flexCenter,
        position: "relative",
        overflow: "hidden",
        borderWidth: pxToDp(10),
        borderColor: "#109A81",
    },
    bar: {
        width: "100%",
        backgroundColor: "#FFAE64",
        position: "absolute",
        bottom: 0,
        zIndex: -1,
    },
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        textCode: state.getIn(["bagMath", "textBookCode"]),
        authority: state.getIn(["userInfo", "selestModuleAuthority"]),
        selestModule: state.getIn(["userInfo", "selestModule"]),
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
