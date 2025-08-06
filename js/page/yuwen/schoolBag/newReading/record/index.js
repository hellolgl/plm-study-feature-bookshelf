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
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import {
    borderRadius_tool,
    padding_tool,
    pxToDp,
    size_tool,
} from "../../../../../util/tools";
// import RichShowView from "../../../../../component/richShowViewNew";
import { appFont, appStyle } from "../../../../../theme";
import fonts from "../../../../../theme/fonts";
import pinyin from "../../../../../util/languageConfig/chinese/pinyin";

const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseDidExercise extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            list: [],
            time: "",
        };
    }

    static navigationOptions = {
        // title:'答题'
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    toDoHomework = (item) => {
        // NavigationUtil.toChinesePinyinDoWrongExercise({
        //     ...this.props,
        //     data: { ...item },
        // });
    };

    checkUnit = (checkIndex) => {
        this.setState({
            nowIndex: ++checkIndex,
        });
    };
    componentWillUnmount() {
        const { type } = this.props.navigation.state.params.data;
        if (type === "daily") {
            DeviceEventEmitter.emit("backReadingHome"); //返回页面刷新
        } else if (type === "flow") {
            DeviceEventEmitter.emit("flowReadingBack"); //返回页面刷新
        } else if (type === "spe") {
            DeviceEventEmitter.emit("readExplain"); //返回页面刷新
        }

        this.eventListenerRefreshPage.remove();
    }
    componentDidMount() {
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "readingRecordList",
            () => this.getlist()
        );
        if (this.props.navigation.state.params.data.type === "diary") {
            this.getlist();
            return;
        }
        if (this.props.navigation.state.params.data.has_record) {
            this.getlist();
        } else {
            this.todoExercise();
            // NavigationUtil.toNewReadingSpeExercise({ ...this.props, data: { name: this.props.navigation.state.params.data.name } })
            return;
        }
    }

    getlist() {
        const data = this.props.navigation.state.params.data;
        const info = this.props.userInfo.toJS();
        const { type } = data;
        // info.checkGrade  checkTeam

        let url = "",
            senobj = {};
        switch (type) {
            case "spe":
                url = api.getChineseReadingRecord;
                senobj = {
                    grade_code: info.checkGrade,
                    term_code: info.checkTeam,
                    article_type: data.article_type,
                    article_category: data.name,
                    module: "2",
                };
                break;
            case "daily":
                url = api.getChineseReadingRecord;
                senobj = {
                    grade_code: info.checkGrade,
                    term_code: info.checkTeam,
                    module: "3",
                };
                break;
            case "flow":
                url = api.getFlowReadingRecordList;
                senobj = {
                    grade_code: info.checkGrade,
                    term_code: info.checkTeam,
                    a_id: data.a_id,
                    module: "1",
                    article_type: data.article_type,
                    article_category: data.article_category,
                };
                break;
            case "diary":
                url = api.getChineseDiaryWordRecordList;
                senobj = {
                    exercise_set_id: data.exercise_set_id,
                    exercise_origin: data.exercise_origin,
                };
                break;
            default:
                break;
        }

        axios.get(url, { params: { ...senobj } }).then((res) => {
            let list = res.data.data;

            this.setState(() => ({
                list: JSON.stringify(list) === "{}" ? [] : list,
                time:
                    JSON.stringify(list) === "{}"
                        ? ""
                        : list.length > 0
                            ? list[0].create_time
                            : "",
            }));
        });
        // }
    }

    todoExercise = () => {
        const data = this.props.navigation.state.params.data;
        const info = this.props.userInfo.toJS();
        const { type } = data;
        switch (type) {
            case "spe":
                NavigationUtil.toNewReadingSpeExercise({
                    ...this.props,
                    data: { name: data.name },
                });

                break;
            case "daily":
                NavigationUtil.toNewReadingDailyExercise({
                    ...this.props,
                    data: { name: data.name },
                });
                break;
            case "flow":
                NavigationUtil.toNewReadingFlowExercise({ ...this.props, data });
                break;
            default:
                break;
        }
    };
    doWrongExercise = (exercise) => {
        NavigationUtil.toDoWrongExerciseRead({
            ...this.props,
            data: { ...exercise, ...this.props.navigation.state.params.data },
        });
    };

    extractChineseCharactersAndPunctuation = (html) => {
        // 使用正则表达式匹配所有汉字和汉语标点符号，同时排除英文字符
        // const chineseCharsAndPunctuation = html.match(/[^\x00-\x7F]+/g);
        const chineseCharsAndPunctuation = html.match(
            /(?:>)(.|\s)*?(?=<\/?\w+[^<]*>)/g
        );

        //  /(?)(.|\s)*?(?=<\/?\w+[^)/g
        // console.log('数据', html.match(/(?<=>)(.|\s)*?(?=<\/?\w+[^<]*>)/g).join('').replaceAll('&nbsp;', ''))

        // value.split("</p>").map((item) => {
        //     if (item.length > 0) {
        //         list.push(item + '</p>')
        //         let str = item + '</p>'
        //         let arr = str.match(/(?:>)(.|\s)*?(?=<\/?\w+[^<]*>)/g)
        //         htmllist.push(<View><Text style={[{ fontSize: pxToDp(36) }]}>{arr.join('').replaceAll('>', '').replaceAll('&nbsp;', '')}</Text></View>)
        //     }
        // })

        //  /(?)(.|\s)*?(?=<\/?\w+[^)/g
        // console.log('数据', html.match(/(?<=>)(.|\s)*?(?=<\/?\w+[^<]*>)/g).join('').replaceAll('&nbsp;', ''))
        if (chineseCharsAndPunctuation) {
            // 如果匹配成功，将匹配到的字符数组连接成一个字符串
            const chineseText = chineseCharsAndPunctuation.join("");
            return (
                chineseText
                    // .replaceAll("（）", "")
                    .replaceAll("&nbsp;", "")
                    .replaceAll(">", "")
            );
        } else {
            // 如果没有匹配到字符，返回空字符串或者其他适当的值
            return "";
        }
    };

    render() {
        const { list } = this.state;
        const { type } = this.props.navigation.state.params.data;
        return (
            <ImageBackground
                source={require("../../../../../images/chineseHomepage/reading/homeBg.png")}
                style={[
                    { flex: 1 },
                    padding_tool(Platform.OS === "ios" ? 60 : 0, 20, 20, 20),
                ]}
                resizeMode="cover"
            >
                <View
                    style={[
                        appStyle.flexTopLine,
                        appStyle.flexAliCenter,
                        appStyle.flexJusBetween,
                        padding_tool(20),
                        {},
                    ]}
                >
                    <TouchableOpacity onPress={this.goBack} style={[{}]}>
                        <Image
                            source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
                            style={[size_tool(120, 80)]}
                        />
                    </TouchableOpacity>
                    <Text
                        style={[
                            appFont.fontFamily_jcyt_700,
                            { fontSize: pxToDp(40), color: "#475266" },
                        ]}
                    >
                        答题记录
                    </Text>
                    <View style={[size_tool(120, 80)]}></View>
                </View>

                <View style={[{ flex: 1 }, padding_tool(20, 200, 20, 200)]}>
                    <View style={{ width: "100%", flex: 1 }}>
                        {list.length === 0 ? (
                            <View style={[appStyle.flexCenter, { flex: 1, height: "100%" }]}>
                                <Image
                                    source={require("../../../../../images/chineseHomepage/sentence/msgPanda.png")}
                                    style={[size_tool(200)]}
                                />
                                <View
                                    style={[
                                        padding_tool(40),
                                        { backgroundColor: "#fff" },
                                        borderRadius_tool(40),
                                    ]}
                                >
                                    <Text
                                        style={[
                                            appFont.fontFamily_jcyt_700,
                                            { fontSize: pxToDp(48), color: "#475266" },
                                        ]}
                                    >
                                        需要完成整套题才会有记录哦
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <ScrollView style={{ paddingBottom: pxToDp(80), flex: 1 }}>
                                {list.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={this.doWrongExercise.bind(this, item)}
                                            style={[
                                                appStyle.flexTopLine,
                                                appStyle.flexAliCenter,
                                                {
                                                    backgroundColor: "#fff",
                                                    padding: pxToDp(40),
                                                    borderRadius: pxToDp(40),
                                                    width: "100%",
                                                    marginBottom: pxToDp(20),
                                                },
                                            ]}
                                            key={index}
                                        >
                                            <View
                                                style={[
                                                    size_tool(80),
                                                    borderRadius_tool(80),
                                                    appStyle.flexCenter,
                                                    {
                                                        backgroundColor:
                                                            item.correct === "0" ? "#16C792" : "#F2645B",
                                                        marginRight: pxToDp(20),
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        appFont.fontFamily_jcyt_700,
                                                        {
                                                            fontSize: pxToDp(36),
                                                            color: "#fff",
                                                            lineHeight: pxToDp(40),
                                                        },
                                                    ]}
                                                >
                                                    {index + 1}
                                                </Text>
                                            </View>
                                            <View
                                                style={[
                                                    {
                                                        alignItems: "center",
                                                        flex: 1,
                                                    },
                                                ]}
                                            >
                                                <Text style={[styles.stemFont]}>
                                                    {this.extractChineseCharactersAndPunctuation(
                                                        item.stem
                                                    )}
                                                </Text>
                                                {/*<RichShowView*/}
                                                {/*    width={pxToDp(1320)}*/}
                                                {/*    value={*/}
                                                {/*        `<div id="yuanti">${item.stem}</div>`*/}
                                                {/*    }*/}
                                                {/*    size={2}*/}
                                                {/*></RichShowView>*/}
                                            </View>
                                            <Image
                                                source={require("../../../../../images/chineseHomepage/pingyin/new/next.png")}
                                                style={[size_tool(80)]}
                                            />
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        )}
                    </View>
                    {type === "diary" ? null : (
                        <TouchableOpacity
                            onPress={this.todoExercise}
                            style={[
                                size_tool(240),
                                borderRadius_tool(240),
                                {
                                    paddingBottom: pxToDp(8),
                                    backgroundColor: "#F07C39",
                                    position: "absolute",
                                    bottom: pxToDp(32),
                                    right: pxToDp(32),
                                },
                            ]}
                        >
                            <View
                                style={[
                                    { flex: 1, backgroundColor: "#FF964A" },
                                    borderRadius_tool(240),
                                    appStyle.flexCenter,
                                ]}
                            >
                                <Text
                                    style={[
                                        appFont.fontFamily_jcyt_700,
                                        { fontSize: pxToDp(48), color: "#fff" },
                                    ]}
                                >
                                    测一测
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    mainWrap: {
        height: 570,
    },
    con: {
        flexDirection: "row",
        paddingLeft: pxToDp(48),
        paddingRight: pxToDp(48),
        height: "100%",
    },
    mainFont: {
        fontSize: pxToDp(60),
        color: "#475266",
        ...fonts.fontFamily_syst,
        marginRight: pxToDp(4),
    },
    tranFont: {
        fontSize: pxToDp(40),
        color: "#475266",
        ...fonts.fonts_pinyin,
        marginRight: pxToDp(4),
        marginBottom: pxToDp(10),
    },
    pinyinFont: {
        fontSize: pxToDp(40),
        color: "#475266",
        ...fonts.fonts_pinyin,
        marginRight: pxToDp(4),
        // lineHeight: pxToDp(56)
    },
    stemFont: {
        fontSize: pxToDp(40),
        color: "#475266",
        // ...fonts.fontFamily_jcyt_500,
        marginRight: pxToDp(4),
        ...appFont.fontFamily_syst,
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        language_data: state.getIn(["languageChinese", "language_data"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseDidExercise);
