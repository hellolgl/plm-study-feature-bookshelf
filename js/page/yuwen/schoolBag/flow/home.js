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
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import {
    pxToDp,
    padding_tool,
    fontFamilyRestoreMargin,
    getGradeInfo,
    size_tool,
} from "../../../../util/tools";
import { appFont, appStyle } from "../../../../theme";
import FreeTag from "../../../../component/FreeTag";
import * as actionCreators from "../../../../action/purchase/index";
import CoinView from '../../../../component/coinView'
import * as actionCreatorsDailyTask from "../../../../action/dailyTask";

// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
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
            nowIndex: 1,
            unitList: [],
            titleTxt: "",
        };
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    toDoHomework = (item, authority) => {
        if (authority) {
            if (item.done === "0") {
                this.toDidExerciseNow(item);
            } else {
                NavigationUtil.toChineseBagExercise({
                    ...this.props,
                    data: {
                        ...item,
                        hasRecord: false,
                    },
                });
            }
        } else {
            this.props.setVisible(true);
        }
    };

    toDidExerciseNow = (item) => {
        NavigationUtil.toChineseDidExercise({
            ...this.props,
            data: {
                ...item,
                hasRecord: true,
                type: "flow",
            },
        });
    };

    checkUnit = (checkIndex) => {
        this.setState({
            nowIndex: ++checkIndex,
        });
    };
    componentWillUnmount() {
        this.eventListenerRefreshPage.remove();
        this.props.getTaskData()
    }
    componentDidMount() {
        this.getlist();
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "backFlowhome",
            () => {
                this.getlist();
            }
        );
    }

    getlist() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const { checkGrade, class_code, checkTeam, id, grade, term } = userInfoJs;
        const data = {
            grade_code: checkGrade,
            class_info: class_code,
            term_code: checkTeam,
            student_code: id,
            subject: "01",
        };
        axios.post(api.getChineseBagClassList, data).then((res) => {
            let list = res.data.data.unit_data;
            let classList = [];
            for (let i in list) {
                classList.push(i);
            }
            let titleTxt = grade + term;

            this.setState(() => ({
                classList: list,
                unitList: classList,
                titleTxt,
            }));
        });
    }

    renderUnit = () => {
        const { nowIndex, unitList } = this.state;
        let returnDom = unitList.map((item, index) => {
            return (
                <TouchableOpacity
                    onPress={this.checkUnit.bind(this, index)}
                    key={index}
                    style={[
                        styles.unitWrap,
                        nowIndex === index + 1 && {
                            backgroundColor: "#EDEDF4",
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.unitInner,
                            nowIndex === index + 1 && {
                                backgroundColor: "#fff",
                                borderRadius: pxToDp(40),
                            },
                        ]}
                    >
                        <Text style={[styles.unitTxt]}> 第{chineseNum[index]}单元</Text>
                    </View>
                </TouchableOpacity>
            );
        });
        return returnDom;
    };
    renderClass = (authority) => {
        const { nowIndex, classList } = this.state;
        // console.log("权限", authority);
        const renderDom =
            classList[nowIndex] &&
            classList[nowIndex].map((item, index) => {
                return (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.classWrap,
                            index % 2 === 1 && { backgroundColor: "#F7F8FC" },
                        ]}
                        onPress={this.toDoHomework.bind(
                            this,
                            item,
                            nowIndex === 1 || authority
                        )}
                    >
                        <View style={[styles.classIndex]}>
                            <Text style={[styles.classIndexTxt]}>{index + 1}</Text>
                        </View>
                        <Text style={[styles.classTxt]}>{item.learning_name}</Text>
                        {!authority && nowIndex === 1 ? (
                            <FreeTag haveAllRadius={true} />
                        ) : null}
                        <Image
                            source={require("../../../../images/chineseHomepage/flow/flowGo.png")}
                            style={[size_tool(32, 54), { marginLeft: pxToDp(20) }]}
                            resizeMode="contain"
                        />
                        {item.done === "0" ? (
                            <View style={[styles.classDone]}>
                                <Text style={[styles.classDoneTxt1]}>正确</Text>
                                <Text style={[styles.classDoneTxt]}>
                                    {item.r_total + "/" + item.total}
                                </Text>
                            </View>
                        ) : null}
                    </TouchableOpacity>
                );
            });
        return renderDom;
    };
    render() {
        const { titleTxt } = this.state;
        const authority = this.props.authority;
        return (
            <ImageBackground
                style={styles.wrap}
                source={require("../../../../images/chineseHomepage/flow/flowBg.png")}
            >
                <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
                    <TouchableOpacity style={[size_tool(120, 80)]} onPress={this.goBack}>
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
                        同步诊断
                    </Text>
                    <View style={[size_tool(120, 80)]} />
                </View>
                <View
                    style={[
                        appStyle.flexTopLine,
                        padding_tool(0, 70, 0, 70),
                        { flex: 1 },
                    ]}
                >
                    <View style={[{ width: pxToDp(320), height: "100%" }]}>
                        <ScrollView style={[{ flex: 1 }]}>
                            <Text style={[styles.titleTxt]}>{titleTxt}</Text>
                            <View style={[{ paddingBottom: pxToDp(60) }]}>
                                {this.renderUnit()}
                            </View>
                        </ScrollView>
                        {/* 单元 */}
                    </View>
                    <View style={[styles.mainWrap]}>
                        {/* 课文 */}
                        <ScrollView style={[{ flex: 1 }]}>
                            <View style={[{ flex: 1, paddingBottom: pxToDp(60) }]}>
                                {this.renderClass(authority)}
                            </View>
                        </ScrollView>
                    </View>
                </View>
                <CoinView></CoinView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        ...padding_tool(Platform.OS === "ios" ? 80 : 20, 20, 0, 20),
    },
    unitWrap: {
        ...size_tool(320, 120),
        paddingBottom: pxToDp(10),
        borderRadius: pxToDp(40),
    },
    unitInner: {
        flex: 1,
        borderRadius: pxToDp(40),
        justifyContent: "center",
        alignItems: "center",
    },
    unitTxt: {
        ...appFont.fontFamily_syst_bold,
        fontSize: pxToDp(40),
        color: "#475266",
        lineHeight: pxToDp(50),
    },
    titleTxt: {
        ...appFont.fontFamily_syst_bold,
        fontSize: pxToDp(30),
        color: "#949CB2",
        lineHeight: pxToDp(40),
        marginBottom: pxToDp(20),
    },
    mainWrap: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: pxToDp(40),
        marginLeft: pxToDp(67),
        ...padding_tool(40, 40, 0, 40),
        height: "100%",
    },
    classWrap: {
        width: "100%",
        borderRadius: pxToDp(40),
        flexDirection: "row",
        minHeight: pxToDp(240),
        alignItems: "center",
        ...padding_tool(20, 60, 20, 20),
        position: "relative",
    },

    classIndex: {
        ...size_tool(80),
        borderRadius: pxToDp(100),
        backgroundColor: "#6DA4FF",
        alignItems: "center",
        justifyContent: "center",
    },
    classIndexTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(38),
        lineHeight: pxToDp(50),
        color: "#fff",
        marginBottom: pxToDp(Platform.OS === "android" ? -10 : 0),
    },
    classTxt: {
        ...appFont.fontFamily_syst_bold,
        fontSize: pxToDp(50),
        lineHeight: pxToDp(60),
        color: "#475266",
        flex: 1,
        marginLeft: pxToDp(30),
        marginRight: pxToDp(30),
    },
    classDone: {
        position: "absolute",
        flexDirection: "row",
        backgroundColor: "#FFE8B4",
        borderRadius: pxToDp(100),
        height: pxToDp(52),
        width: pxToDp(242),
        bottom: pxToDp(14),
        left: pxToDp(18),
        alignItems: "center",
        justifyContent: "space-between",
        ...padding_tool(10, 20, 10, 20),
    },
    classDoneTxt: {
        color: "#FE9943",
        fontSize: pxToDp(32),
        ...appFont.fontFamily_jcyt_700,
        lineHeight: pxToDp(40),
        marginBottom: pxToDp(Platform.OS === "android" ? -10 : 0),
    },
    classDoneTxt1: {
        color: "#FE9943",
        fontSize: pxToDp(32),
        ...appFont.fontFamily_jcyt_500,
        lineHeight: pxToDp(40),
        marginBottom: pxToDp(Platform.OS === "android" ? -10 : 0),
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        lock_primary_school: state.getIn(["userInfo", "lock_primary_school"]),
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

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
