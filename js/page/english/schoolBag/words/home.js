import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Animated,
    DeviceEventEmitter,
    Platform,
} from "react-native";
import {
    size_tool,
    pxToDp,
    padding_tool,
    getGradeInfo,
    borderRadius_tool,
} from "../../../../util/tools";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import FreeTag from "../../../../component/FreeTag";
import * as actionCreators from "../../../../action/purchase/index";
import * as purchaseCreators from "../../../../action/purchase";
import { appFont, appStyle } from "../../../../theme";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CheckKnow from "./components/checkKnow";
import CoinView from "../../../../component/coinView";
import * as actionCreatorsDailyTask from "../../../../action/dailyTask";
import _ from 'lodash'
class SelectUnitEn extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            unitList: [],
            list: [],
            unitIndex: 0,
            titleList: {
                word: {
                    name: "Word",
                    know: [],
                },
                phrase: {
                    name: "Phrase",
                    know: [],
                },
                sentence: {
                    name: "Sentence",
                    know: [],
                },
                article: {
                    name: "Article",
                    know: [],
                },
                origin: ''
            },
            showType: "word",
            staticsObj: {
                word: {
                    name: "Word",
                    detail: {},
                },
                phrase: {
                    name: "Phrase",
                    detail: {},
                },
                sentence: {
                    name: "Sentence",
                    detail: {},
                },
                article: {
                    name: "Article",
                    detail: {},
                },
            },
            nowIndex: 1,
            navIndex: 1,
            zimu: 'A',
            showAll: false,
            allUnitList: [],
            zimuArr: [],
        };
    }
    componentWillUnmount() {
        this.eventListenerRefreshPage.remove();
        this.props.getTaskData();
    }
    componentDidMount() {
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "backRecordList",
            () => {
                const { unitIndex, unitList, titleList, showType, showAll, allUnitList, zimu } = this.state;
                let listnow = JSON.parse(JSON.stringify(titleList));
                listnow[showType].know = [];
                this.setState({
                    titleList: listnow,
                });
                let unit_list = unitList
                if (showAll) {
                    const classList = allUnitList[zimu] ? allUnitList[zimu].filter(i => i.unit_code !== '00') : []
                    unit_list = classList
                }
                this.getlist(unit_list[unitIndex], showType);
                this.getStatics(unit_list[unitIndex]);
            }
        );
        this.getUnitList()
    }

    getUnitList = () => {
        const { userInfo, textBookCode } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.student_code = userInfoJs.id;
        data.subject = "03"; //英语学科
        data.textbook_origin = textBookCode || "20"; //教材code
        axios.post(api.QueryEnTextbookLesson, data).then((res) => {
            let list = res.data.data.unit_data;
            const courses = _.cloneDeep(res.data.data.courses)
            courses['R'] = courses['R'].filter(i => !i.unit_name.includes('Revision')) //去掉复习单元
            let classList = list.filter((item) => item.unit_code !== "00");
            this.getlist(classList[0]);
            this.getStatics(classList[0]);
            this.setState(() => ({
                unitList: classList,
                allUnitList: courses,
                zimuArr: Object.keys(courses)
            }));
        });
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    lookUnit = (item, index, authority) => {
        if (authority) {
            this.getlist(item);
            this.getStatics(item);
            this.setState({
                unitIndex: index,
                nowIndex: 1
            });
        } else {
            // 没权限
            this.props.setVisible(true);
        }
    };
    getlist = (item, type = "word") => {
        const data = {
            origin: item.origin,
        };
        axios.get(api.getEnglishKnowList, { params: data }).then((res) => {
            if (res.data.err_code === 0) {
                let titlenow = {
                    word: {
                        name: "Word",
                        know: [],
                    },
                    phrase: {
                        name: "Phrase",
                        know: [],
                    },
                    sentence: {
                        name: "Sentence",
                        know: [],
                    },
                    article: {
                        name: "Article",
                        know: [],
                    },
                    origin: item.origin
                }
                let getObj = res.data.data;
                for (let i in getObj) {
                    titlenow[i].know = getObj[i];
                }
                this.setState({
                    titleList: titlenow,
                    showType: type,
                });
            }
        });
    };
    getStatics = (item) => {
        const { staticsObj } = this.state;
        axios
            .get(api.getEnglishMyStudyStatics, {
                params: {
                    origin: item.origin,
                },
            })
            .then((res) => {
                // console.log('getStaticsgetStaticsgetStaticsgetStaticsgetStatics', res.data.data, {
                //     origin: item.origin,
                // })
                if (res.data.err_code === 0) {
                    if (res.data.err_code === 0) {
                        let getObj = res.data.data;
                        let staticsnow = { ...staticsObj };
                        for (let i in getObj) {
                            staticsnow[i].detail = getObj[i];
                        }
                        this.setState({
                            staticsObj: staticsnow,
                        });
                    }
                }
            });
    };
    lookThis = (type, index) => {
        this.setState({
            showType: type,
            nowIndex: index,
        });
    };
    toExercise = (know) => {
        const { unitIndex, unitList, nowIndex, showType, showAll, zimu, allUnitList } = this.state;
        let unit_list = unitList
        if (showAll) {
            const classList = allUnitList[zimu] ? allUnitList[zimu].filter(i => i.unit_code !== '00') : []
            unit_list = classList
        }
        let item = unit_list[unitIndex];
        NavigationUtil.toSynchronizeDiagnosisEn({
            ...this.props,
            data: {
                exercise_origin: item.origin,
                unit_name: item.unit_name,
                mode: 1,
                kpg_type: nowIndex,
                knowledgeList: know,
                knowledge_type: showType,
                unit_code: item.unit_code,
                codeList: know,
            },
        });
    };
    toRecord = () => {
        const { token } = this.props;
        if (!token) {
            NavigationUtil.resetToLogin(this.props);
            return;
        }
        const { unitIndex, unitList, nowIndex, showType, showAll, zimu, allUnitList } = this.state;
        let unit_list = unitList
        if (showAll) {
            const classList = allUnitList[zimu] ? allUnitList[zimu].filter(i => i.unit_code !== '00') : []
            unit_list = classList
        }
        let item = unit_list[unitIndex];
        NavigationUtil.toEnglishTextMeRecord({
            ...this.props,
            data: {
                origin: item.origin,
                unit_name: item.unit_name,
                mode: 1,
                kpg_type: nowIndex,
                knowledge_type: showType,
                unit_code: item.unit_code,
                isTestMe: false,
            },
        });
    };
    renderUnit = () => {
        const { unitList, unitIndex, showAll, zimu, allUnitList } = this.state;
        const authority = this.props.authority;
        let unit_list = unitList
        if (showAll) {
            const classList = allUnitList[zimu] ? allUnitList[zimu].filter(i => i.unit_code !== '00') : []
            unit_list = classList
        }
        let renderlist = unit_list.map((item, index) => {
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
                                appStyle.flexLine,
                                appStyle.flexAliCenter,
                            ]}
                        >
                            <View style={[{ flex: 1 }]}>
                                <Text style={[styles.unitName]}>{item.unit_name}</Text>
                                {showAll ? null : <Text style={[styles.unitNum]}>
                                    Unit {Number(item.unit_code)}
                                </Text>}
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
                                    style={{ color: "#FABC0D", marginLeft: pxToDp(10) }}
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
    renderTitle = () => {
        const { titleList, showType } = this.state;
        let title = [];
        let index = 0;
        for (let i in titleList) {
            let item = titleList[i];
            ++index;
            title.push(
                <TouchableOpacity
                    onPress={this.lookThis.bind(this, i, index)}
                    style={[
                        appStyle.flexTopLine,
                        {
                            width: pxToDp(280),
                            height: pxToDp(80),
                            alignItems: "flex-end",
                            marginBottom: pxToDp(-2),
                        },
                    ]}
                >
                    {showType === i ? (
                        <Image
                            source={require("../../../../images/english/myStudy/leftBg.png")}
                            style={[size_tool(40)]}
                        />
                    ) : null}
                    <View
                        style={[
                            {
                                backgroundColor: showType === i ? "#fff" : "transparent",
                                flex: 1,
                                height: "100%",
                            },
                            borderRadius_tool(40, 40, 0, 0),
                            appStyle.flexCenter,
                        ]}
                    >
                        <Text
                            style={[
                                appFont.fontFamily_jcyt_500,
                                { fontSize: pxToDp(32), color: "#000" },
                            ]}
                        >
                            {item.name}
                        </Text>
                    </View>
                    {showType === i ? (
                        <Image
                            source={require("../../../../images/english/myStudy/rightBg.png")}
                            style={[size_tool(40), { marginLeft: pxToDp(-1) }]}
                        />
                    ) : null}
                </TouchableOpacity>
            );
        }
        return title;
    };
    renderProgressBar = (progress = 0) => {
        // const { top, left } = position;
        // let progress = 100
        // 进度

        if (progress > 100) {
            progress = 100;
        }
        if (progress < 0) {
            progress = 0;
        }
        let w = `${progress}%`;
        // 59及以下 红色，60-84 黄色 85以上绿色
        let bgColor =
            progress < 60 ? "#FF7B7B" : progress < 85 ? "#FDC14C" : "#4FE381";
        // star 位置
        const styles = StyleSheet.create({
            progressBar: {
                height: pxToDp(64),
                flexDirection: "row",
                width: pxToDp(480),
                backgroundColor: "#EFF3F7",
                borderRadius: pxToDp(200),
                position: "absolute",
                top: pxToDp(0),
                left: pxToDp(0),
            },
            fillAllProgressBar: {
                backgroundColor: "#4FE381",
                width: w,
                borderRadius: pxToDp(200),
            },
            fillProgressBar: {
                backgroundColor: bgColor,
                width: w,
                borderRadius: pxToDp(200),
                // borderRadius: 30,
            },
            mask: { position: "absolute", top: 0, left: 0, zIndex: 999 },
        });
        let fillStyle;
        if (w === "100%") {
            fillStyle = styles.fillAllProgressBar;
        } else {
            fillStyle = styles.fillProgressBar;
        }
        // let left1 = progress === 100 ? 1.8 * progress - 20 : 1.8 * progress
        return (
            <View style={styles.progressBar}>
                <Animated.View style={[fillStyle]} />
                <Image
                    source={require("../../../../images/english/myStudy/progressMask.png")}
                    style={[size_tool(480, 64), styles.mask]}
                />
            </View>
        );
    };
    renderStatics = () => {
        const { staticsObj, showType } = this.state;
        let detail = staticsObj[showType].detail;
        return (
            <View
                style={[
                    { height: pxToDp(144) },
                    appStyle.flexTopLine,
                    padding_tool(40),
                ]}
            >
                <View
                    style={[
                        appStyle.flexTopLine,
                        { width: pxToDp(480), alignItems: "center" },
                        padding_tool(0, 30, 0, 30),
                    ]}
                >
                    {this.renderProgressBar(detail.correct_rate)}
                    <Text style={[styles.txt1]}>Accuracy:</Text>
                    <Text style={[styles.txt2]}>{detail.correct_rate}%</Text>
                </View>
                <View style={[appStyle.flexLine]}>
                    <Text style={[styles.txt2]}>{detail.total}</Text>
                    <Text style={[styles.txt3]}>Total</Text>
                </View>
                <View style={[appStyle.flexLine]}>
                    <Text style={[styles.txt2]}>{detail.correct}</Text>
                    <Text style={[styles.txt3]}>Correct</Text>
                </View>
            </View>
        );
    };
    handleWordsAIbot = () => {
        // AI bot
        if (!this.props.token) {
            NavigationUtil.resetToLogin(this.props);
            return;
        }
        const { unitIndex, unitList, allUnitList, zimu, showAll } = this.state;
        let unit_list = unitList
        if (showAll) {
            const classList = allUnitList[zimu] ? allUnitList[zimu].filter(i => i.unit_code !== '00') : []
            unit_list = classList
        }
        const unit_data = unit_list[unitIndex]
        NavigationUtil.toEnglishWordsAIHelp({
            ...this.props,
            data: {
                origin: unit_data.origin,
            },
        });
    };
    render() {
        const { titleList, showType, navIndex, zimu, showAll, allUnitList, unitList, zimuArr } = this.state;
        const authority = this.props.authority;
        return (
            <ImageBackground
                style={[
                    { flex: 1, paddingTop: Platform.OS === "ios" ? pxToDp(60) : 0 },
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
                    <View style={[{ width: pxToDp(360) }]}>
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
                        Let’s Check/Words
                    </Text>
                    <View style={[styles.headRight, appStyle.flexLine]}>
                        <View style={[styles.titleItem, { marginRight: pxToDp(40) }]}>
                            <Image
                                source={require("../../../../images/englishHomepage/ic_excellent.png")}
                                style={[styles.titleImage]}
                            ></Image>
                            <Text style={[styles.titleTxt]}>Excellent</Text>
                        </View>
                        <View style={styles.titleItem}>
                            <Image
                                source={require("../../../../images/englishHomepage/ic_error.png")}
                                style={[styles.titleImage]}
                            ></Image>
                            <Text style={[styles.titleTxt]}>Try again</Text>
                        </View>
                    </View>
                </View>
                <View
                    style={[
                        { flex: 1 },
                        appStyle.flexTopLine,
                        padding_tool(0, 40, 40, 20),
                    ]}
                >
                    <View
                        style={[
                            {
                                width: pxToDp(508),
                                marginRight: pxToDp(18),
                            },
                        ]}
                    >
                        {/* 单元 */}
                        <View style={[styles.selectNav, appStyle.flexLine, appStyle.flexCenter]}>
                            <TouchableOpacity style={[styles.navBtn, { marginRight: pxToDp(36) }, navIndex === 0 ? { backgroundColor: "#fff" } : null]} onPress={() => {
                                if (!authority) {
                                    this.props.setVisible(true);
                                    return
                                }
                                this.setState({
                                    navIndex: 0,
                                    showAll: true,
                                    unitIndex: 0
                                }, () => {
                                    const classList = allUnitList[zimu] ? allUnitList[zimu].filter(i => i.unit_code !== '00') : []
                                    if (classList.length) {
                                        this.getlist(classList[0]);
                                        this.getStatics(classList[0])
                                    }
                                })
                            }}>
                                <Text style={[styles.navBtntxt, navIndex === 0 ? appFont.fontFamily_jcyt_700 : null]}>全部</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.navBtn, navIndex === 1 ? { backgroundColor: "#fff" } : null]} onPress={() => {
                                this.setState({
                                    navIndex: 1,
                                    showAll: false,
                                    unitIndex: 0
                                }, () => {
                                    this.getlist(unitList[0]);
                                    this.getStatics(unitList[0])
                                })
                            }}>
                                <Text style={[styles.navBtntxt, navIndex === 0 ? appFont.fontFamily_jcyt_700 : null]}>本学期</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[appStyle.flexTopLine]}>
                            {showAll ? <View style={{ width: pxToDp(56), marginRight: pxToDp(16) }}>
                                <ScrollView contentContainerStyle={{ paddingBottom: pxToDp(80) }}>
                                    {zimuArr.map((i, x) => {
                                        return <TouchableOpacity style={[styles.zimuItem, appStyle.flexCenter, zimu === i ? { backgroundColor: "#FF9900" } : null]} key={x} onPress={() => {
                                            this.setState({
                                                zimu: i,
                                                unitIndex: 0
                                            }, () => {
                                                const classList = allUnitList[i] ? allUnitList[i].filter(i => i.unit_code !== '00') : []
                                                if (classList.length) {
                                                    this.getlist(classList[0]);
                                                    this.getStatics(classList[0])
                                                }
                                            })
                                        }}>
                                            <Text style={[{ color: "#2D3040", fontSize: pxToDp(24) }, appFont.fontFamily_jcyt_700]}>{i}</Text>
                                        </TouchableOpacity>
                                    })}
                                </ScrollView>
                            </View> : null}
                            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: pxToDp(120) }}>{this.renderUnit()}</ScrollView>
                        </View>

                    </View>
                    <View
                        style={[
                            {
                                flex: 1,
                                backgroundColor: "#DCC7F6",
                                borderRadius: pxToDp(60),
                            },
                            padding_tool(8),
                        ]}
                    >
                        <View
                            style={[
                                appStyle.flexTopLine,
                                padding_tool(0, 40, 0, 40),
                                appStyle.flexJusCenter,
                            ]}
                        >
                            {this.renderTitle()}
                        </View>
                        <View
                            style={[
                                { flex: 1, backgroundColor: "#fff", borderRadius: pxToDp(60) },
                            ]}
                        >
                            {this.renderStatics()}
                            {/* 详情 */}

                            <CheckKnow
                                knowList={titleList[showType].know}
                                origin={titleList.origin}
                                type={showType}
                                toExercise={this.toExercise}
                                toRecord={this.toRecord}
                            />
                        </View>
                        <TouchableOpacity
                            style={[styles.helpBtn]}
                            onPress={() => {
                                this.handleWordsAIbot();
                            }}
                        >
                            <Image
                                style={[size_tool(200, 150)]}
                                source={require("../../../../images/chineseHomepage/reading/saraHelp.png")}
                                resizeMode="contain"
                            ></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <CoinView></CoinView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF3F5",
    },
    unitWrap: {
        width: "100%",
        height: pxToDp(106),
        paddingBottom: pxToDp(6),
        borderRadius: pxToDp(40),
    },
    unitInnder: {
        borderRadius: pxToDp(40),
        flex: 1,
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20),
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
    txt1: {
        ...appFont.fontFamily_jcyt_500,
        fontSize: pxToDp(32),
        color: "#2D3040",
    },
    txt2: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(36),
        color: "#2D3040",
        marginLeft: pxToDp(20),
        marginRight: pxToDp(10),
    },
    txt3: {
        ...appFont.fontFamily_jcyt_500,
        fontSize: pxToDp(24),
        color: "#96979F",
    },
    titleItem: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: pxToDp(36),
        width: pxToDp(160),
        height: pxToDp(72),
        justifyContent: "center",
    },
    titleImage: {
        width: pxToDp(44),
        height: pxToDp(44),
        marginRight: pxToDp(10),
    },
    titleTxt: {
        color: "#2D3040",
        fontSize: pxToDp(24),
        ...appFont.fontFamily_jcyt_500,
    },
    helpBtn: {
        position: "absolute",
        top: pxToDp(-20),
        right: pxToDp(8),
        zIndex: 99,
    },
    selectNav: {
        width: '100%',
        height: pxToDp(90),
        backgroundColor: "#DCC7F6",
        borderRadius: pxToDp(40),
        marginBottom: pxToDp(6)
    },
    navBtn: {
        width: pxToDp(196),
        height: pxToDp(68),
        borderRadius: pxToDp(40),
        ...appStyle.flexCenter
    },
    navBtntxt: {
        color: '#2D3040',
        fontSize: pxToDp(30),
        ...appFont.fontFamily_jcyt_500
    },
    zimuItem: {
        width: pxToDp(56),
        height: pxToDp(56),
        borderRadius: pxToDp(20),
    }
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        token: state.getIn(["userInfo", "token"]),
        textBookCode: state.getIn(["bagEnglish", "textBookCode"]),
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
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(SelectUnitEn);
