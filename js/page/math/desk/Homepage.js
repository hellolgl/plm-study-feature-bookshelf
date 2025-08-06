import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    DeviceEventEmitter,
    Platform,
} from "react-native";
import { connect } from "react-redux";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import NavigationUtil from "../../../navigator/NavigationUtil";
import NavigationUtilMath from "../../../navigator/NavigationMathUtil";
import {
    size_tool,
    pxToDp,
    padding_tool,
    borderRadius_tool,
} from "../../../util/tools";
import { appFont, appStyle, mathTopicStyle } from "../../../theme";
import BadgeExplainModal from "./component/BadgeExplainModal";
import Stem from "../../../component/math/Topic/Stem";
import TopicStemTk from "../../../component/math/Topic/TopicStemTk";
import CalculationStem from "../../../component/math/Topic/CalculationStem";
import ApplicationStem from "../../../component/math/Topic/ApplicationStem";
import { changeTopicData } from "../tools";
import topaicTypes from "../../../res/data/MathTopaicType";
import ChangeDeskSubject from '../../../component/homepage/changeDeskSubject'

const nav_list = ["我的作业", "历史记录", "错题集"];

const VALUES_ARR = [
    {
        img: require("../../../images/desk/icon_8.png"),
        img_gray: require("../../../images/desk/icon_8_gray.png"),
        label: "进步之星",
        des: "与前一次作业相比，准确率有提升。",
        color: "#F88C2C",
        bg: "#FFF9BF",
        key: 1,
    },
    {
        img: require("../../../images/desk/icon_9.png"),
        img_gray: require("../../../images/desk/icon_9_gray.png"),
        label: "飞跃之星",
        des: "与前一次作业相比，准确率提高超过30%。",
        color: "#F88C2C",
        bg: "#FFF9BF",
        key: 2,
    },
    {
        img: require("../../../images/desk/icon_2.png"),
        img_gray: require("../../../images/desk/icon_2_gray.png"),
        label: "闪亮之星",
        des: "作业全对即可获得该徽章。",
        color: "#2AC367",
        bg: "#E3FFEE",
        key: 0,
    },
    {
        img: require("../../../images/desk/icon_3.png"),
        img_gray: require("../../../images/desk/icon_3_gray.png"),
        label: "3冠王",
        des: "连续3次作业全对。",
        color: "#F47300",
        bg: "#FFEEDF",
        key: 3,
    },
    {
        img: require("../../../images/desk/icon_3.png"),
        img_gray: require("../../../images/desk/icon_3_gray.png"),
        label: "4冠王",
        des: "连续4次作业全对。",
        color: "#F47300",
        bg: "#FFEEDF",
        key: 4,
    },
    {
        img: require("../../../images/desk/icon_3.png"),
        img_gray: require("../../../images/desk/icon_3_gray.png"),
        label: "5冠王",
        des: "连续5次作业全对。",
        color: "#F47300",
        bg: "#FFEEDF",
        key: 5,
    },
    {
        img: require("../../../images/desk/icon_3.png"),
        img_gray: require("../../../images/desk/icon_3_gray.png"),
        label: "6冠王",
        des: "连续6次作业全对。",
        color: "#F47300",
        bg: "#FFEEDF",
        key: 6,
    },
    {
        img: require("../../../images/desk/icon_3.png"),
        img_gray: require("../../../images/desk/icon_3_gray.png"),
        label: "7冠王",
        des: "连续7次作业全对。",
        color: "#F47300",
        bg: "#FFEEDF",
        key: 7,
    },
    {
        img: require("../../../images/desk/icon_3.png"),
        img_gray: require("../../../images/desk/icon_3_gray.png"),
        label: "8冠王",
        des: "连续8次作业全对。",
        color: "#F47300",
        bg: "#FFEEDF",
        key: 8,
    },
    {
        img: require("../../../images/desk/icon_3.png"),
        img_gray: require("../../../images/desk/icon_3_gray.png"),
        label: "9冠王",
        des: "连续9次作业全对。",
        color: "#F47300",
        bg: "#FFEEDF",
        key: 9,
    },
    {
        img: require("../../../images/desk/icon_3.png"),
        img_gray: require("../../../images/desk/icon_3_gray.png"),
        label: "10冠王",
        des: "连续10次作业全对。",
        color: "#F47300",
        bg: "#FFEEDF",
        key: 10,
    },
    {
        img: require("../../../images/desk/icon_1.png"),
        img_gray: require("../../../images/desk/icon_1_gray.png"),
        label: "连胜之王",
        des: "连续11次及以上作业全对即可获得该徽章。",
        color: "#F47300",
        bg: "#FFEEDF",
        key: 12,
    },
];

class MathdeskHomePage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            list: [],
            list_his: [],
            list_wrong: [],
            visible: false,
            badge_type: "",
            page_index: 1,
            page_size: 5,
            total: 0,
            loading_wrong_data: false,
            current_wrong_topic: {},
            statistic_list: VALUES_ARR,
            seeStatistic: false,
            all_count: 0,
            show: false,
        };
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    getData = (wrong_page) => {
        const { currentIndex } = this.state;
        if (currentIndex === 0) {
            axios.post(api.getMathDeskHomework).then((res) => {
                this.setState({
                    list: res.data.data,
                });
            });
            return;
        }
        if (currentIndex === 1) {
            axios.post(api.getMathDeskRecord).then((res) => {
                this.setState({
                    list_his: res.data.data,
                });
            });
            return;
        }
        if (currentIndex === 2) {
            const { page_index, page_size, list_wrong, total, current_wrong_topic } =
                this.state;
            let _l = JSON.parse(JSON.stringify(list_wrong));
            let obj = {
                page_index,
                page_size,
            };
            this.setState({
                loading_wrong_data: true,
            });
            axios.get(api.getMathDeskWrongTopic, { params: obj }).then((res) => {
                let data = res.data.data.data;
                let total = res.data.data.total;
                data.forEach((i, x) => {
                    data[x] = changeTopicData(i, "desk");
                    data[x].page_index = page_index;
                });
                if (wrong_page) {
                    _l.splice((page_index - 1) * 5, 5, ...data);
                } else {
                    if (page_index === 1) {
                        _l = data;
                    } else {
                        _l = _l.concat(data);
                    }
                }
                this.setState({
                    list_wrong: _l,
                    total,
                    loading_wrong_data: false,
                });
            });
            return;
        }
    };

    getStatistic = () => {
        const { statistic_list } = this.state;
        axios.get(api.getMathDeckMedal).then((res) => {
            let data = res.data.data;
            let _s = JSON.parse(JSON.stringify(statistic_list));
            let all = 0;
            _s.forEach((i, x) => {
                i.count = data[x].count;
                all += parseInt(i.count);
            });
            this.setState({
                statistic_list: _s,
                all_count: all,
            });
            return;
        });
    };

    componentDidMount() {
        this.getData();
        this.getStatistic();
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "refreshPage",
            (wrong_page) => {
                if (wrong_page) {
                    this.setState(
                        {
                            page_index: wrong_page,
                        },
                        () => {
                            this.getData(wrong_page);
                        }
                    );
                } else {
                    this.getData();
                }
                this.getStatistic();
            }
        );
    }
    componentWillUnmount() {
        this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
    }

    clickNav = (i, x) => {
        this.setState(
            {
                currentIndex: x,
                seeStatistic: false,
            },
            () => {
                if (x === 2) {
                    this.setState(
                        {
                            page_index: 1,
                        },
                        () => {
                            this.getData();
                        }
                    );
                    return;
                }
                this.getData();
            }
        );
    };

    toDoHomework = (i) => {
        const { exercise_set_id, homework_name, status } = i;
        this.setState(
            {
                seeStatistic: false,
            },
            () => {
                NavigationUtilMath.toMathDeskDoExercise({
                    ...this.props,
                    data: { exercise_set_id, homework_name, status: status + "" },
                });
            }
        );
    };

    toDoWrongHomework = (i) => {
        if (i.status === 1) {
            i._correct = i.status;
            this.setState(
                {
                    seeStatistic: false,
                },
                () => {
                    NavigationUtilMath.toMathDeskDoWrongExercise({
                        ...this.props,
                        data: { currentTopic: i, onlySeeExplain: true },
                    });
                }
            );
            return;
        }
        i._correct = -1; //重置为未作答的状态
        this.setState(
            {
                current_wrong_topic: i,
                seeStatistic: false,
            },
            () => {
                NavigationUtilMath.toMathDeskDoWrongExercise({
                    ...this.props,
                    data: { currentTopic: i },
                });
            }
        );
    };

    clickBadge = (ii) => {
        this.setState({
            badge_type: ii,
            visible: true,
        });
    };

    renderNoData = (text) => {
        return (
            <View style={[appStyle.flexAliCenter]}>
                <Image
                    source={require("../../../images/english/panda.png")}
                    style={{ width: pxToDp(412), height: pxToDp(230) }}
                    resizeMode="stretch"
                ></Image>
                <ImageBackground
                    source={require("../../../images/desk/content_bg_2.png")}
                    style={[
                        { width: pxToDp(800), height: pxToDp(220) },
                        appStyle.flexCenter,
                    ]}
                    resizeMode="stretch"
                >
                    <Text
                        style={[
                            { color: "#475266", fontSize: pxToDp(52) },
                            appFont.fontFamily_jcyt_700,
                        ]}
                    >
                        暂无数据
                    </Text>
                    {text ? (
                        <Text
                            style={[
                                { color: "#C6C9CF", fontSize: pxToDp(28) },
                                appFont.fontFamily_jcyt_500,
                                Platform.OS === "ios" ? { marginTop: pxToDp(20) } : null,
                            ]}
                        >
                            {text}
                        </Text>
                    ) : null}
                </ImageBackground>
            </View>
        );
    };

    renderList = () => {
        const { list } = this.state;
        if (list.length === 0) {
            return this.renderNoData("等待老师发送作业中...");
        }
        return list.map((i, x) => {
            return (
                <TouchableOpacity
                    key={x}
                    onPress={() => {
                        this.toDoHomework(i, x);
                    }}
                >
                    <ImageBackground
                        resizeMode="stretch"
                        source={require("../../../images/desk/content_bg_1.png")}
                        style={[styles.item]}
                    >
                        <View>
                            <Text
                                style={[
                                    { color: "#475266", fontSize: pxToDp(52) },
                                    appFont.fontFamily_jcyt_700,
                                ]}
                            >
                                {i.homework_name}
                            </Text>
                            <Text
                                style={[
                                    { color: "#A3A8B3", fontSize: pxToDp(28) },
                                    appFont.fontFamily_jcyt_500,
                                    Platform.OS === "ios"
                                        ? { marginTop: pxToDp(30), marginBottom: pxToDp(30) }
                                        : null,
                                ]}
                            >
                                发送人：{i.teacher_name}
                            </Text>
                            <View style={[styles.tag]}>
                                <View style={[styles.txt_new]}>
                                    <Text
                                        style={[
                                            { color: "#fff", fontSize: pxToDp(24) },
                                            appFont.fontFamily_jcyt_700,
                                        ]}
                                    >
                                        新
                                    </Text>
                                </View>
                                <Text
                                    style={[
                                        { color: "#FF7664", fontSize: pxToDp(28) },
                                        appFont.fontFamily_jcyt_500,
                                    ]}
                                >
                                    24:00截止
                                </Text>
                            </View>
                        </View>
                        {i.status === 0 ? (
                            <TouchableOpacity
                                onPress={() => {
                                    this.toDoHomework(i, x);
                                }}
                            >
                                <ImageBackground
                                    resizeMode="stretch"
                                    style={[styles.btn]}
                                    source={require("../../../images/desk/btn_bg_2.png")}
                                >
                                    <Text style={[styles.txt_1, { color: "#fff" }]}>去完成</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => {
                                    this.toDoHomework(i, x);
                                }}
                            >
                                <ImageBackground
                                    resizeMode="stretch"
                                    style={[styles.btn]}
                                    source={require("../../../images/desk/btn_bg_3.png")}
                                >
                                    <Text style={[styles.txt_1, { color: "#fff" }]}>
                                        继续作答
                                    </Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        )}
                    </ImageBackground>
                </TouchableOpacity>
            );
        });
    };

    clickRecord = (i, x) => {
        const { exercise_set_id, homework_name, status } = i;
        this.setState(
            {
                seeStatistic: false,
            },
            () => {
                NavigationUtilMath.toMathDeskDoExercise({
                    ...this.props,
                    data: {
                        exercise_set_id,
                        homework_name,
                        status: status + "",
                        isRecord: true,
                    },
                });
            }
        );
    };

    renderListHis = () => {
        const { list_his } = this.state;
        if (list_his.length === 0) {
            return this.renderNoData();
        }
        return list_his.map((i, x) => {
            const { last_time } = i;
            return (
                <TouchableOpacity
                    key={x}
                    onPress={() => {
                        this.clickRecord(i, x);
                    }}
                >
                    <ImageBackground
                        resizeMode="stretch"
                        source={require("../../../images/desk/content_bg_1.png")}
                        style={[
                            styles.item,
                            { marginBottom: pxToDp(60), paddingRight: pxToDp(136) },
                            x === 0 ? { marginTop: pxToDp(40) } : null,
                        ]}
                    >
                        <Image
                            resizeMode="stretch"
                            style={[styles.finish_icon]}
                            source={
                                i.status === 0
                                    ? require("../../../images/desk/icon_5.png")
                                    : require("../../../images/desk/icon_4.png")
                            }
                        ></Image>
                        <View>
                            <Text
                                style={[
                                    { color: "#475266", fontSize: pxToDp(52) },
                                    appFont.fontFamily_jcyt_700,
                                ]}
                            >
                                {i.homework_name}
                            </Text>
                            <Text
                                style={[
                                    { color: "#A3A8B3", fontSize: pxToDp(28) },
                                    appFont.fontFamily_jcyt_500,
                                    Platform.OS === "ios" ? { marginTop: pxToDp(30) } : null,
                                ]}
                            >
                                {i.status === 0
                                    ? ""
                                    : last_time
                                        ? "完成时间：" + last_time
                                        : ""}
                            </Text>
                            <View style={[{ marginTop: pxToDp(30) }, appStyle.flexLine]}>
                                {i.medal.map((ii, xx) => {
                                    let data = VALUES_ARR[ii];
                                    return (
                                        <TouchableOpacity
                                            key={xx}
                                            style={[styles.badge, { backgroundColor: data.bg }]}
                                            onPress={() => {
                                                this.clickBadge(ii, xx);
                                            }}
                                        >
                                            <Image
                                                resizeMode="stretch"
                                                style={[styles.badge_icon]}
                                                source={data.img}
                                            ></Image>
                                            <Text style={[styles.txt_1, { color: data.color }]}>
                                                {data.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                this.clickRecord(i, x);
                            }}
                        >
                            <Text style={[styles.txt_1, { color: "#2697FF" }]}>查看详情</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </TouchableOpacity>
            );
        });
    };

    seeCorrectTopic = (i, x) => {
        if (i.status === 0) return;
        this.setState(
            {
                seeStatistic: false,
            },
            () => {
                NavigationUtilMath.toMathDeskDoWrongExercise({
                    ...this.props,
                    data: { currentTopic: i, onlySeeExplain: true },
                });
            }
        );
    };

    renderListWrong = () => {
        const { list_wrong } = this.state;
        if (list_wrong.length === 0) {
            return this.renderNoData();
        }
        return list_wrong.map((i, x) => {
            return (
                <TouchableOpacity
                    key={x}
                    style={[
                        styles.wrong_item,
                        x === 0 ? { marginTop: pxToDp(40) } : null,
                    ]}
                    onPress={() => {
                        this.toDoWrongHomework(i, x);
                    }}
                >
                    <View style={[styles.wrong_item_inner]}>
                        <View style={[styles.left]}>
                            <Text
                                style={[
                                    { color: "#A3A8B3", fontSize: pxToDp(28) },
                                    appFont.fontFamily_jcyt_500,
                                ]}
                            >
                                {i.homework_name}
                            </Text>
                            {this.renderStem(i)}
                        </View>
                        {i.status === 0 ? (
                            <TouchableOpacity
                                onPress={() => {
                                    this.toDoWrongHomework(i, x);
                                }}
                            >
                                <ImageBackground
                                    resizeMode="stretch"
                                    style={[styles.btn]}
                                    source={require("../../../images/desk/btn_bg_3.png")}
                                >
                                    <Text style={[styles.txt_1, { color: "#fff" }]}>练习</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        ) : (
                            <Image
                                resizeMode="stretch"
                                style={[styles.finish_icon]}
                                source={require("../../../images/desk/icon_6.png")}
                            ></Image>
                        )}
                        {i.status === 1 ? (
                            <TouchableOpacity
                                style={[{ marginRight: pxToDp(76) }]}
                                onPress={() => {
                                    this.toDoWrongHomework(i, x);
                                }}
                            >
                                <Text style={[styles.txt_1, { color: "#2697FF" }]}>
                                    查看详情
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </TouchableOpacity>
            );
        });
    };

    renderStem = (i) => {
        const { displayed_type_name } = i;
        let correct = 0;
        let style = mathTopicStyle["2"];
        if (displayed_type_name === topaicTypes.Fill_Blank) {
            return (
                <TopicStemTk
                    my_style={style}
                    onlySee={true}
                    correct={correct}
                    data={i}
                ></TopicStemTk>
            );
        }
        if (displayed_type_name === topaicTypes.Calculation_Problem) {
            return (
                <CalculationStem
                    my_style={style}
                    onlySee={true}
                    correct={correct}
                    data={i}
                ></CalculationStem>
            );
        }
        if (displayed_type_name === topaicTypes.Application_Questions) {
            return (
                <ApplicationStem
                    my_style={style}
                    onlySee={true}
                    correct={correct}
                    data={i}
                ></ApplicationStem>
            );
        }
        return <Stem my_style={style} data={i}></Stem>;
    };

    getNowList = () => {
        const { currentIndex, list, list_his, list_wrong } = this.state;
        if (currentIndex === 0) return list;
        if (currentIndex === 1) return list_his;
        if (currentIndex === 2) return list_wrong;
    };

    onMomentumScrollEnd = (e) => {
        const { currentIndex, page_index, loading_wrong_data } = this.state;
        let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        let contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
        let oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
        if (
            parseInt(offsetY + oriageScrollHeight) >= parseInt(contentSizeHeight) &&
            currentIndex === 2 &&
            !loading_wrong_data
        ) {
            // console.log('上传滑动到底部事件')
            this.setState(
                {
                    page_index: page_index + 1,
                },
                () => {
                    this.getData();
                }
            );
        }
    };

    seeStatistic = () => {
        const { seeStatistic } = this.state;
        this.setState({
            seeStatistic: !seeStatistic,
        });
    };

    render() {
        const {
            currentIndex,
            visible,
            badge_type,
            statistic_list,
            seeStatistic,
            all_count,
            show
        } = this.state;
        let list_len = this.getNowList().length;
        return (
            <ImageBackground
                style={[styles.container]}
                source={require("../../../images/MathSyncDiagnosis/bg_1.png")}
            >
                <View style={[styles.header]}>
                    <View style={[styles.inner]}>
                        <TouchableOpacity style={[styles.backBtn]} onPress={this.goBack}>
                            <Image
                                resizeMode="stretch"
                                style={{ width: pxToDp(120), height: pxToDp(120) }}
                                source={require("../../../images/desk/back_btn_1.png")}
                            ></Image>
                        </TouchableOpacity>
                        <View style={[appStyle.flexLine]}>
                            {nav_list.map((i, x) => {
                                return (
                                    <TouchableOpacity
                                        key={x}
                                        onPress={() => {
                                            this.clickNav(i, x);
                                        }}
                                    >
                                        <ImageBackground
                                            source={
                                                currentIndex === x
                                                    ? require("../../../images/desk/btn_bg_1.png")
                                                    : null
                                            }
                                            style={[
                                                { width: pxToDp(280), height: pxToDp(100) },
                                                appStyle.flexCenter,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.txt_1,
                                                    { color: currentIndex === x ? "#DF631D" : "#475266" },
                                                ]}
                                            >
                                                {i}
                                            </Text>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <View style={[styles.h_right]}>
                            <TouchableOpacity
                                style={[appStyle.flexLine]}
                                onPress={this.seeStatistic}
                            >
                                <Image
                                    resizeMode="stretch"
                                    style={[styles.icon]}
                                    source={require("../../../images/desk/icon_7.png")}
                                ></Image>
                                <Text
                                    style={[
                                        { color: "#F47300", fontSize: pxToDp(36) },
                                        appFont.fontFamily_jcyt_700,
                                    ]}
                                >
                                    x{all_count}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => this.setState({ show: true })}
                            style={[styles.changeBtnWrap]}
                        >
                            <Text style={[styles.changeBtnTxt]}>数学作业</Text>
                            <Image
                                source={require("../../../images/chineseHomepage/wrong/changeIcon.png")}
                                style={[size_tool(20)]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView
                    onMomentumScrollEnd={this.onMomentumScrollEnd}
                    contentContainerStyle={[
                        {
                            ...appStyle.flexAliCenter,
                            marginTop: pxToDp(20),
                            paddingBottom: pxToDp(100),
                        },
                        list_len === 0
                            ? { flex: 1, ...appStyle.flexCenter, marginTop: pxToDp(-40) }
                            : null,
                    ]}
                >
                    {currentIndex === 0 ? this.renderList() : null}
                    {currentIndex === 1 ? this.renderListHis() : null}
                    {currentIndex === 2 ? this.renderListWrong() : null}
                </ScrollView>
                <BadgeExplainModal
                    visible={visible}
                    data={VALUES_ARR[badge_type]}
                    close={() => {
                        this.setState({ visible: false });
                    }}
                ></BadgeExplainModal>
                {seeStatistic ? (
                    <View style={[styles.statistic_wrap]}>
                        <View style={[styles.statistic_inner]}>
                            <Text
                                style={[
                                    {
                                        color: "#475266",
                                        fontSize: pxToDp(40),
                                        marginBottom:
                                            Platform.OS === "android" ? pxToDp(10) : pxToDp(40),
                                        textAlign: "center",
                                    },
                                    appFont.fontFamily_jcyt_700,
                                ]}
                            >
                                我的徽章
                            </Text>
                            <View style={[appStyle.flexLine, appStyle.flexLineWrap]}>
                                {statistic_list.map((i, x) => {
                                    return (
                                        <TouchableOpacity
                                            style={[
                                                styles.badge_item,
                                                i.count > 0 ? { backgroundColor: i.bg } : null,
                                            ]}
                                            key={x}
                                            onPress={() => {
                                                this.clickBadge(x);
                                            }}
                                        >
                                            <Image
                                                source={i.count ? i.img : i.img_gray}
                                                style={[styles.icon]}
                                            ></Image>
                                            <Text
                                                style={[
                                                    styles.txt_1,
                                                    { color: i.count > 0 ? i.color : "#9AA0AB" },
                                                ]}
                                            >
                                                {i.label} x{i.count}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                ) : null}
                <ChangeDeskSubject
                    show={show}
                    paddingTop={Platform.OS === 'android' ? null : 36}
                    close={() =>
                        this.setState({
                            show: false,
                        })
                    }
                    typeName={'数学作业'}
                    check={(key) => {
                        this.setState({
                            show: false
                        })
                        if (key === 'chinese') {
                            NavigationUtil.toYuwenHomepage(this.props)
                        } else {
                            NavigationUtil.toEnglishDeskHomepage(this.props)
                        }
                    }}
                />
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: Platform.OS === 'android' ? pxToDp(132) : pxToDp(150),
        backgroundColor: "#DAE2F2",
    },
    inner: {
        height: Platform.OS === 'android' ? pxToDp(120) : pxToDp(140),
        backgroundColor: "#fff",
        position: "relative",
        ...appStyle.flexJusCenter,
        ...appStyle.flexAliCenter,
    },
    backBtn: {
        position: "absolute",
        left: 0,
    },
    icon: {
        width: pxToDp(60),
        height: pxToDp(60),
        marginRight: pxToDp(10),
    },
    txt_1: {
        fontSize: pxToDp(32),
        ...appFont.fontFamily_jcyt_700,
    },
    h_right: {
        position: "absolute",
        right: pxToDp(350),
        ...appStyle.flexLine,
    },
    content: {
        marginTop: pxToDp(40),
    },
    item: {
        width: pxToDp(1586),
        height: pxToDp(342),
        padding: pxToDp(60),
        marginBottom: pxToDp(20),
        ...appStyle.flexLine,
        ...appStyle.flexJusBetween,
    },
    wrong_item: {
        width: pxToDp(1586),
        paddingBottom: pxToDp(10),
        backgroundColor: "#DAE2F2",
        marginBottom: pxToDp(60),
        borderRadius: pxToDp(40),
    },
    wrong_item_inner: {
        backgroundColor: "#fff",
        padding: pxToDp(60),
        ...appStyle.flexLine,
        ...appStyle.flexJusBetween,
        // ...appStyle.flexCenter,
        // ...appStyle.flexAliCenter,
        borderRadius: pxToDp(40),
    },
    tag: {
        width: pxToDp(256),
        height: pxToDp(82),
        borderRadius: pxToDp(80),
        backgroundColor: "#FFF1EF",
        ...appStyle.flexLine,
        paddingLeft: pxToDp(20),
    },
    txt_new: {
        width: pxToDp(58),
        height: pxToDp(42),
        borderRadius: pxToDp(170),
        backgroundColor: "#FF7664",
        ...appStyle.flexCenter,
        marginRight: pxToDp(10),
    },
    btn: {
        width: pxToDp(280),
        height: pxToDp(120),
        ...appStyle.flexCenter,
    },
    finish_icon: {
        width: pxToDp(160),
        height: pxToDp(160),
        position: "absolute",
        top: pxToDp(-40),
        right: 0,
    },
    badge: {
        width: pxToDp(288),
        height: pxToDp(80),
        ...appStyle.flexLine,
        borderRadius: pxToDp(2000),
        ...appStyle.flexCenter,
        marginRight: pxToDp(40),
    },
    badge_icon: {
        width: pxToDp(60),
        height: pxToDp(60),
        marginRight: pxToDp(20),
    },
    left: {
        width: "75%",
        maxHeight: pxToDp(220),
        overflow: "hidden",
    },
    statistic_wrap: {
        width: pxToDp(800),
        backgroundColor: "#DAE2F2",
        borderRadius: pxToDp(40),
        position: "absolute",
        top: pxToDp(150),
        right: pxToDp(20),
        paddingBottom: pxToDp(10),
    },
    statistic_inner: {
        backgroundColor: "#fff",
        padding: pxToDp(40),
        borderRadius: pxToDp(40),
    },
    badge_item: {
        height: pxToDp(80),
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        backgroundColor: "rgba(71, 82, 102, 0.10)",
        borderRadius: pxToDp(40),
        marginRight: pxToDp(20),
        marginBottom: pxToDp(20),
        ...appStyle.flexCenter,
        ...appStyle.flexLine,
    },
    changeBtnWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFB649",
        width: pxToDp(240),
        height: pxToDp(80),
        borderRadius: pxToDp(40),
        justifyContent: "center",
        position: 'absolute',
        right: pxToDp(30),
        top: Platform.OS === 'android' ? pxToDp(20) : pxToDp(36)
    },
    changeBtnTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(32),
        color: "#fff",
        marginRight: pxToDp(10),
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(MathdeskHomePage);
