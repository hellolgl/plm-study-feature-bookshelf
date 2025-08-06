import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    DeviceEventEmitter,
    ScrollView,
    Platform,
    Dimensions,
    ActivityIndicator,
    BackHandler,
} from "react-native";
import { appStyle, appFont, mathFont } from "../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";

import { connect } from "react-redux";
import api from "../../../../util/http/api";
import axios from "../../../../util/http/axios";
import * as actionCreators from "../../../../action/math/language/index";
import * as actionCreatorsPurchase from "../../../../action/purchase/index";
import * as actionCreatorsDailyTask from "../../../../action/dailyTask";
import SelectLanguageModal from "./components/SelectLanguageModal";
import BadgeModal from "./components/BadgeModal";
import DagGraph from "./components/DagGraph";
import Swiper from "react-native-swiper";
import FreeTag from "../../../../component/FreeTag";
import BackBtn from "../../../../component/math/BackBtn";
import Explain from "./knowProgress/explain";
import CoinView from '../../../../component/coinView'

const log = console.log.bind(console);

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

class Test extends PureComponent {
    constructor(props) {
        super(props);
        this.eventListenerRefreshPage = undefined;
        this.state = {
            page_data: {},
            show_language_modal: false,
            show_badge_modal: false,
            language_data: {},
            unit_list: [],
            current_unit: 0,
            elementUnit: [],
            badge_arr: [],
            badge_total: 0,
        };
        this.swiperIndex = 0;
    }

    static getDerivedStateFromProps(props, state) {
        let tempState = { ...state };
        let language_data = props.language_data.toJS();
        const { main_language_map, other_language_map, type, show_type } =
            language_data;
        // console.log("切换语言:12313 ", language_data);
        if (type !== tempState.language_data.type) {
            let page_base_data = {
                zstupu_z: main_language_map.zstupu,
                zstupu_c: other_language_map.zstupu,
                back_z: main_language_map.back,
                back_c: other_language_map.back,
                free_z: main_language_map.Free,
                free_c: other_language_map.Free,
                shijianxian_z: main_language_map.shijianxian,
                shijianxian_c: other_language_map.shijianxian,
                practice_z: main_language_map.practice,
                practice_c: other_language_map.practice,
            };
            if (tempState.unit_list.length > 0) {
                // 当前页面切换语言时，页面数据同步变化
                let _unit_list = JSON.parse(JSON.stringify(tempState.unit_list));
                _unit_list.forEach((i, x) => {
                    i._unit_name = i.unit_name.substr(0, 4);
                    if (i.language_unit_name.indexOf("Unit") > -1) {
                        i._language_unit_name = i.language_unit_name.substr(0, 6);
                    } else {
                        i._language_unit_name = i.language_unit_name;
                    }
                    if (show_type === "1") {
                        i.unit_name_z = i._unit_name;
                        i.unit_name_c = i._language_unit_name;
                    } else {
                        i.unit_name_z = i._language_unit_name;
                        i.unit_name_c = i._unit_name;
                    }
                });
                tempState.unit_list = _unit_list;
            }
            tempState.page_data = { ...page_base_data };
            tempState.language_data = JSON.parse(JSON.stringify(language_data));
            return tempState;
        }
        return null;
    }

    componentDidMount() {
        this.getUnit();
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "refreshPage",
            (data) => {
                this.swiperIndex = data.swiperIndex;
                this.setState(
                    {
                        current_unit: data.current_unit,
                    },
                    () => {
                        this.getUnit();
                    }
                );
            }
        );
    }

    componentWillUnmount() {
        this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
        this.backBtnListener && this.backBtnListener.remove();
        this.props.getTaskData()
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    getUnit = () => {
        const { language_data, current_unit } = this.state;
        const { trans_language, show_type } = language_data;
        let info = this.props.userInfo.toJS();
        let params = {
            textbook: this.props.textCode,
            grade_code: info.checkGrade,
            term_code: info.checkTeam,
            language: trans_language,
        };
        axios.get(api.getMathKGUnit, { params }).then((res) => {
            let data = JSON.parse(JSON.stringify(res.data.data));
            this.getElementUnit(data[current_unit]["origin"]);
            data.forEach((i, x) => {
                i._unit_name = i.unit_name.substr(0, 4);
                if (i.language_unit_name.indexOf("Unit") > -1) {
                    i._language_unit_name = i.language_unit_name.substr(0, 6);
                } else {
                    i._language_unit_name = i.language_unit_name;
                }
                if (show_type === "1") {
                    i.unit_name_z = i._unit_name;
                    i.unit_name_c = i._language_unit_name;
                } else {
                    i.unit_name_z = i._language_unit_name;
                    i.unit_name_c = i._unit_name;
                }
            });
            this.setState({
                unit_list: data,
            });
        })
    };

    getElementUnit = (origin) => {
        const { language_data } = this.state;
        const { trans_language } = language_data;
        let params = {
            language: trans_language,
            origin,
        };
        this.setState(
            {
                elementUnit: [],
                // swiperIndex: 0,
            },
            () => {
                axios.get(api.getMathKnowledgePointFlow, { params }).then((res) => {
                    const data = res.data.data.data;
                    const medal = res.data.data.medal;
                    this.setState({
                        elementUnit: data,
                        badge_arr: medal,
                        badge_total: medal.length > 0 ? medal[2] : 0,
                    });
                });
            }
        );
    };

    getCurrentLanguage = () => {
        const { language_data } = this.state;
        const { type } = language_data;
        const languageMap = {
            1: "ChineseAndEnglish",
            2: "EnglishAndChinese",
            3: "Chinese",
            4: "English",
        };
        return languageMap[type];
    };

    showLanguage = () => {
        const { show_language_modal } = this.state;
        this.setState({
            show_language_modal: !show_language_modal,
        });
    };

    showBadge = () => {
        const { show_badge_modal } = this.state;
        this.setState({
            show_badge_modal: !show_badge_modal,
        });
    };

    selectUnit = (i, x) => {
        this.swiperIndex = 0;
        this.setState({
            current_unit: x,
        });
        const { origin } = i;
        this.getElementUnit(origin);
    };

    prevBtn = () => {
        return (
            <View
                style={{
                    marginTop: Platform.OS === "ios" ? pxToDp(50) : pxToDp(150),
                }}
            >
                <Image
                    source={require("../../../../images/MathKnowledgeGraph/left-btn.png")}
                    style={{ width: pxToDp(100), height: pxToDp(100) }}
                    resizeMode={"contain"}
                ></Image>
            </View>
        );
    };

    nextBtn = () => {
        return (
            <View
                style={{
                    right: pxToDp(50),
                    marginTop: Platform.OS === "ios" ? pxToDp(50) : pxToDp(150),
                }}
            >
                <Image
                    source={require("../../../../images/MathKnowledgeGraph/right-btn.png")}
                    style={{
                        width: pxToDp(100),
                        height: pxToDp(100),
                        right: pxToDp(-40),
                    }}
                    resizeMode={"contain"}
                ></Image>
            </View>
        );
    };

    gotoDetailPage = (swiperIndex, index) => {
        const { elementUnit, unit_list, current_unit } = this.state;
        const authority = this.props.authority;
        if (current_unit > 0 && !authority) {
            this.props.setVisible(true);
            return;
        }
        const e = elementUnit[swiperIndex];
        const d = e["children"][parseInt(index)];
        console.log("数据", unit_list, current_unit);
        const { origin } = unit_list[current_unit];
        let data = { ...d, origin, swiperIndex, current_unit };
        NavigationUtil.toKnowledgeGraphExplainPage({ ...this.props, data });
    };

    render() {
        const {
            show_language_modal,
            show_badge_modal,
            page_data,
            language_data,
            unit_list,
            current_unit,
            elementUnit,
            badge_arr,
            badge_total,
        } = this.state;
        if (Object.keys(language_data).length === 0) return null;
        const {
            zstupu_z,
            zstupu_c,
            free_z,
            free_c,
        } = page_data;
        const { show_main, show_translate, label } = language_data;
        let txt = free_z;
        if (show_translate) txt = free_z + " " + free_c;
        const authority = this.props.authority;
        return (
            <ImageBackground
                style={{ flex: 1 }}
                source={require("../../../../images/MathKnowledgeGraph/bg_1.png")}
            >
                <View style={[styles.header]}>
                    <View style={[styles.header_inner]}>
                        <BackBtn goBack={this.goBack}></BackBtn>
                        <View style={[styles.header_right_content]}>
                            <TouchableOpacity
                                style={[styles.language_btn]}
                                onPress={this.showLanguage}
                            >
                                <Text
                                    style={[
                                        {
                                            color: "#475266",
                                            fontSize: pxToDp(28),
                                            marginRight: pxToDp(20),
                                        },
                                        appFont.fontFamily_jcyt_700,
                                    ]}
                                >
                                    {label}
                                </Text>
                                <View style={styles.triangle_down}></View>
                            </TouchableOpacity>
                            <View style={[styles.header_line]}></View>
                            <TouchableOpacity
                                style={[
                                    styles.badge_btn,
                                    Platform.OS === "ios" ? { paddingTop: pxToDp(30) } : null,
                                ]}
                                onPress={this.showBadge}
                            >
                                <Image
                                    style={[
                                        {
                                            width: pxToDp(60),
                                            height: pxToDp(60),
                                            marginRight: pxToDp(10),
                                        },
                                    ]}
                                    source={require("../../../../images/MathKnowledgeGraph/badge_icon_1.png")}
                                ></Image>
                                <Text style={[mathFont.txt_70_700, mathFont.txt_fff]}>
                                    x{badge_total}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[appStyle.flexAliCenter]}>
                            {show_main ? (
                                <Text
                                    style={[
                                        mathFont.txt_32_700,
                                        mathFont.txt_fff,
                                        {
                                            marginBottom:
                                                Platform.OS === "android" ? pxToDp(-10) : pxToDp(10),
                                        },
                                    ]}
                                >
                                    {zstupu_z}
                                </Text>
                            ) : null}
                            {show_translate ? (
                                <Text
                                    style={[
                                        mathFont.txt_24_500,
                                        mathFont.txt_fff_50,
                                        { lineHeight: pxToDp(34) },
                                    ]}
                                >
                                    {zstupu_c}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                </View>
                <View style={[styles.content]}>
                    <View style={[{ paddingLeft: pxToDp(20) }]}>
                        <ScrollView
                            contentContainerStyle={{
                                paddingBottom: pxToDp(100),
                                paddingTop: authority ? pxToDp(20) : pxToDp(40),
                            }}
                        >
                            {unit_list.map((i, x) => {
                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.unit_item,
                                            current_unit === x ? styles.unit_item_active : null,
                                        ]}
                                        key={x}
                                        onPress={() => {
                                            this.selectUnit(i, x);
                                        }}
                                    >
                                        {x === 0 && !authority ? (
                                            <View
                                                style={[
                                                    {
                                                        position: "absolute",
                                                        top: pxToDp(-50),
                                                        right: 0,
                                                        zIndex: 1,
                                                    },
                                                ]}
                                            >
                                                <FreeTag
                                                    txt={txt}
                                                    style={show_translate ? { width: pxToDp(158) } : {}}
                                                ></FreeTag>
                                            </View>
                                        ) : null}
                                        <View
                                            style={[
                                                styles.unit_inner,
                                                current_unit === x ? styles.unit_inner_active : null,
                                            ]}
                                        >
                                            {show_main ? (
                                                <Text
                                                    style={[
                                                        mathFont.txt_32_700,
                                                        mathFont.txt_fff,
                                                        current_unit === x ? styles.txt_active : null,
                                                    ]}
                                                >
                                                    {i.unit_name_z}
                                                </Text>
                                            ) : null}
                                            {show_translate ? (
                                                <Text
                                                    style={[
                                                        mathFont.txt_24_500,
                                                        mathFont.txt_fff_50,
                                                        current_unit === x ? styles.txt_active : null,
                                                        Platform.OS === "ios"
                                                            ? { marginTop: pxToDp(20) }
                                                            : null,
                                                    ]}
                                                >
                                                    {i.unit_name_c}
                                                </Text>
                                            ) : null}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {elementUnit.length > 0 ? (
                        <Swiper
                            style={swiperStyles.wrapper}
                            showsButtons={true}
                            loop={false}
                            prevButton={this.prevBtn()}
                            nextButton={this.nextBtn()}
                            index={this.swiperIndex}
                            onIndexChanged={(index) => {
                                this.swiperIndex = index;
                            }}
                            dot={
                                <View
                                    style={{
                                        marginLeft: pxToDp(10),
                                        marginRight: pxToDp(10),
                                        width: pxToDp(20),
                                        height: pxToDp(20),
                                        borderRadius: pxToDp(100),
                                        backgroundColor: "#979797",
                                    }}
                                ></View>
                            }
                            activeDot={
                                <View
                                    style={{
                                        marginLeft: pxToDp(10),
                                        marginRight: pxToDp(10),
                                        width: pxToDp(20),
                                        height: pxToDp(20),
                                        borderRadius: pxToDp(100),
                                        backgroundColor: "white",
                                    }}
                                ></View>
                            }
                            paginationStyle={{
                                marginLeft: pxToDp(-200),
                                bottom: pxToDp(80),
                            }}
                        >
                            {elementUnit.map((e, index) => {
                                return (
                                    <View style={swiperStyles.slide} key={index}>
                                        <DagGraph
                                            sendData={this.gotoDetailPage}
                                            swiperIndex={index}
                                            width={pxToDp(1800)}
                                            height={Dimensions.get("window").height - 70}
                                            data={e}
                                            showLanguage={this.getCurrentLanguage()}
                                        />
                                    </View>
                                );
                            })}
                        </Swiper>
                    ) : (
                        <View
                            style={{
                                position: "absolute",
                                top: "40%",
                                left: "50%",
                                zIndex: 10,
                            }}
                        >
                            <ActivityIndicator size={"large"} color={"white"} />
                        </View>
                    )}
                </View>
                <SelectLanguageModal
                    show={show_language_modal}
                    close={() => {
                        this.setState({ show_language_modal: false });
                    }}
                ></SelectLanguageModal>
                {show_badge_modal ? (
                    <BadgeModal
                        close={() => {
                            this.setState({ show_badge_modal: false });
                        }}
                        data={badge_arr}
                    ></BadgeModal>
                ) : null}
                <CoinView></CoinView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        ...appStyle.flexLine,
        flex: 1,
    },
    svgWrap: {
        position: "absolute",
        width: windowWidth,
        height: windowWidth,
        zIndex: 1,
        top: 0,
        left: 0,
        // backgroundColor:"blue"
    },
    father_1: {
        position: "absolute",
        bottom: pxToDp(200),
        right: pxToDp(500),
        zIndex: 1,
    },
    father_2: {
        position: "absolute",
        bottom: pxToDp(200),
        right: pxToDp(300),
        zIndex: 1,
    },
    item: {
        width: pxToDp(160),
        height: pxToDp(160),
        backgroundColor: "#00AFE7",
        borderRadius: pxToDp(80),
        ...appStyle.flexCenter,
        zIndex: 1,
    },
    header: {
        paddingBottom: pxToDp(10),
        backgroundColor: "#22294D",
    },
    header_inner: {
        height: Platform.OS === "android" ? pxToDp(110) : pxToDp(130),
        backgroundColor: "#4352A7",
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        ...appStyle.flexCenter,
    },
    back_btn: {
        ...appStyle.flexLine,
        position: "absolute",
        left: pxToDp(0),
        height: pxToDp(120),
    },
    header_right_content: {
        position: "absolute",
        right: pxToDp(40),
        ...appStyle.flexLine,
    },
    badge_btn: {
        ...appStyle.flexLine,
    },
    language_btn: {
        ...appStyle.flexLine,
        ...appStyle.flexJusCenter,
        backgroundColor: "#fff",
        width: pxToDp(200),
        height: pxToDp(68),
        borderRadius: pxToDp(80),
    },
    triangle_down: {
        width: 0,
        height: 0,
        borderLeftWidth: pxToDp(8),
        borderLeftColor: "transparent",
        borderRightWidth: pxToDp(8),
        borderRightColor: "transparent",
        borderTopWidth: pxToDp(15),
        borderTopColor: "#475266",
    },
    header_line: {
        width: pxToDp(4),
        height: pxToDp(40),
        backgroundColor: "rgba(255,255,255,0.2)",
        marginLeft: pxToDp(40),
        marginRight: pxToDp(40),
    },
    unit_item: {
        width: pxToDp(240),
        paddingBottom: pxToDp(8),
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: pxToDp(40),
        marginTop: pxToDp(20),
    },
    unit_item_active: {
        backgroundColor: "#FF9D42",
        borderRadius: pxToDp(40),
    },
    unit_inner: {
        paddingTop: pxToDp(20),
        paddingBottom: pxToDp(20),
        paddingLeft: pxToDp(30),
        paddingRight: pxToDp(30),
        ...appStyle.flexJusCenter,
        // backgroundColor:'red'
    },
    unit_inner_active: {
        borderRadius: pxToDp(40),
        backgroundColor: "#FFC85E",
    },
    txt_active: {
        color: "#FF7A30",
    },
});

const swiperStyles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    test: {
        width: pxToDp(1000),
        height: pxToDp(300),
    },
});

const mapStateToProps = (state) => {
    return {
        language_data: state.getIn(["languageMath", "language_data"]),
        textCode: state.getIn(["bagMath", "textBookCode"]),
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        authority: state.getIn(["userInfo", "selestModuleAuthority"]),
        selestModule: state.getIn(["userInfo", "selestModule"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setLanguageData(data) {
            dispatch(actionCreators.setLanguageData(data));
        },
        setVisible(data) {
            dispatch(actionCreatorsPurchase.setVisible(data));
        },
        getTaskData(data) {
            dispatch(actionCreatorsDailyTask.getTaskData(data));
        }
    };
};

export default connect(mapStateToProps, mapDispathToProps)(Test);
