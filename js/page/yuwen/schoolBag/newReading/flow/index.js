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
} from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
import NavigationUtil from "../../../../../navigator/NavigationUtil";

import { connect } from "react-redux";
import CircleStatistcs from "../../../../../component/circleStatistcs";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import FreeTag from "../../../../../component/FreeTag";
import * as actionCreators from "../../../../../action/purchase/index";

const titleType = [
    {
        name: "现代文",
        backgroundColor: "#9876E5",
    },
    {
        name: "古诗词",
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
        // console.log('学生数据', props.userInfo.toJS())
        this.state = {
            list: [],
            rate_correct: 0,
            lookMsg: false,
            has_record: false,
            littleIndex: 0,
            bigIndex: 0,
            articleList: [],
        };
        this.audio = null;
        this.scrollRef = React.createRef();
    }
    componentWillUnmount() {
        DeviceEventEmitter.emit("backReadingHome"); //返回页面刷新
        this.eventListenerRefreshPage.remove();
        this.backBtnListener && this.backBtnListener.remove();
    }
    componentDidMount() {
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "flowReadingBack",
            () => {
                const { list, bigIndex, littleIndex } = this.state;

                this.getArticle(
                    list[bigIndex]?.name,
                    list[bigIndex]?.son_type[littleIndex]
                );
            }
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
            .get(
                `${api.availableReadCategory +
                "/" +
                userInfoJs.checkGrade +
                "/" +
                userInfoJs.checkTeam
                }`,
                { params: {} }
            )
            .then((res) => {
                if (res.data.err_code === 0) {
                    console.log("userInfoJs", res.data);

                    let nowindex = 0;
                    this.getArticle(
                        res.data.data[nowindex].name,
                        res.data.data[nowindex]?.son_type[0]
                    );

                    let listnow = res.data.data.map((item) => ({
                        ...item,
                        type:
                            item.name.indexOf("现代文") !== -1
                                ? 0
                                : item.name.indexOf("古诗") !== -1
                                    ? 1
                                    : 2,
                    }));

                    this.setState({
                        list: listnow,
                        bigIndex: nowindex,
                        littleIndex: 0,
                    });
                }
            });
    };

    checkUnit = (index, n) => {
        const { list } = this.state;
        this.getArticle(list[index].name, list[index].son_type[n]);
        this.setState({
            bigIndex: index,
            littleIndex: n,
        });
    };
    getArticle = (article_type, article_category) => {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        console.log("碎片化", article_type, article_category);

        axios
            .get(api.getChineseArticlelist, {
                params: {
                    article_type,
                    article_category,
                    grade_code: userInfoJs.checkGrade,
                    term_code: userInfoJs.checkTeam,
                },
            })
            .then((res) => {
                if (res.data.err_code === 0) {
                    // console.log("list===", res.data)
                    this.scrollRef &&
                        this.scrollRef.scrollTo({ x: 0, y: 0, animated: false });

                    this.setState({
                        articleList: res.data.data,
                    });
                }
            });
    };
    todoExercise = (item, authority) => {
        if (!authority) {
            this.props.setVisible(true);
            return;
        }
        let data = {
            has_record: !(item.status === "1"),
            a_id: item.a_id,
            type: "flow",
            article_type: item.article_type,
            article_category: item.article_category,
        };

        if (data.has_record) {
            NavigationUtil.toNewReadingRecord({
                ...this.props,
                data,
            });
        } else {
            NavigationUtil.toNewReadingFlowExercise({
                ...this.props,
                data,
            });
        }
    };
    render() {
        const { list, littleIndex, bigIndex, articleList } = this.state;

        // log("cn checkTerCode: ", this.state.visible)
        const authority = this.props.authority;
        return (
            <View style={[styles.container]}>
                <ImageBackground
                    source={require("../../../../../images/chineseHomepage/reading/homeBg.png")}
                    style={[
                        { flex: 1 },
                        padding_tool(Platform.OS === "ios" ? 60 : 20, 20, 0, 20),
                    ]}
                    resizeMode="cover"
                >
                    <View
                        style={[
                            appStyle.flexTopLine,
                            appStyle.flexJusBetween,
                            { height: pxToDp(100) },
                        ]}
                    >
                        <TouchableOpacity
                            style={[size_tool(120, 80)]}
                            onPress={this.goback}
                        >
                            <Image
                                style={[size_tool(120, 80)]}
                                source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
                            />
                        </TouchableOpacity>
                        <Text
                            style={[
                                appFont.fontFamily_jcyt_700,
                                { fontSize: pxToDp(58), color: "#475266" },
                            ]}
                        >
                            拓展阅读
                        </Text>
                        <View
                            style={[
                                size_tool(120, 80),
                                {},
                                borderRadius_tool(200),
                                appStyle.flexCenter,
                            ]}
                        ></View>
                    </View>
                    <View
                        style={[
                            { flex: 1 },
                            appStyle.flexTopLine,
                            padding_tool(0, 60, 0, 40),
                        ]}
                    >
                        <View style={[{ width: pxToDp(328) }]}>
                            <ScrollView>
                                {list.map((item, index) => {
                                    return (
                                        <View key={index} style={[{ alignItems: "flex-start" }]}>
                                            <View
                                                style={[
                                                    {
                                                        backgroundColor: titleType[index].backgroundColor,
                                                        height: pxToDp(58),
                                                        minWidth: pxToDp(160),
                                                        marginBottom: pxToDp(20),
                                                    },
                                                    appStyle.flexCenter,
                                                    borderRadius_tool(30),
                                                    padding_tool(0, 10, 0, 10),
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        appFont.fontFamily_syst,
                                                        { fontSize: pxToDp(42), color: "#fff" },
                                                    ]}
                                                >
                                                    {titleType[item.type].name}
                                                </Text>
                                            </View>
                                            <View>
                                                {item.son_type.map((i, n) => {
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={this.checkUnit.bind(this, index, n)}
                                                            key={n}
                                                            style={[
                                                                bigIndex === index && littleIndex === n
                                                                    ? styles.left_item_wrap
                                                                    : styles.left_item_wrap_n,
                                                            ]}
                                                        >
                                                            <View
                                                                style={[
                                                                    bigIndex === index && littleIndex === n
                                                                        ? styles.left_item_inner
                                                                        : styles.left_item_inner_n,
                                                                ]}
                                                            >
                                                                <Text
                                                                    style={[
                                                                        bigIndex === index && littleIndex === n
                                                                            ? styles.left_item_text_check
                                                                            : styles.left_item_text,
                                                                    ]}
                                                                >
                                                                    {i}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        </View>
                        <View
                            style={[
                                { flex: 1, backgroundColor: "#fff", marginLeft: pxToDp(56) },
                                borderRadius_tool(70, 70, 0, 0),
                                padding_tool(20),
                            ]}
                        >
                            <ScrollView ref={(scrollRef) => (this.scrollRef = scrollRef)}>
                                {articleList.map((item, index) => {
                                    let authorityNow =
                                        bigIndex === 0 && littleIndex === 0 && index < 3;
                                    return (
                                        <TouchableOpacity
                                            onPress={this.todoExercise.bind(
                                                this,
                                                item,
                                                authorityNow || authority
                                            )}
                                            key={index}
                                            style={[
                                                styles.rightItem,
                                                {
                                                    backgroundColor: index % 2 === 0 ? "#fff" : "#F7F8FC",
                                                },
                                            ]}
                                        >
                                            {/* <View style={[appStyle.flexTopLine]}> */}
                                            <View
                                                style={[
                                                    size_tool(80),
                                                    borderRadius_tool(200),
                                                    {
                                                        backgroundColor:
                                                            titleType[bigIndex].backgroundColor,
                                                    },
                                                    appStyle.flexCenter,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        appFont.fontFamily_syst_bold,
                                                        { color: "#fff", fontSize: pxToDp(50) },
                                                    ]}
                                                >
                                                    {index + 1}
                                                </Text>
                                            </View>
                                            <View style={[appStyle.flexTopLine, { flex: 1 }]}>
                                                <Text
                                                    style={[
                                                        styles.rightTxt,
                                                        Platform.OS === "ios"
                                                            ? { lineHeight: pxToDp(64) }
                                                            : {},
                                                    ]}
                                                >
                                                    {item.name}
                                                </Text>
                                                {authorityNow && !authority ? (
                                                    <FreeTag haveAllRadius={true} style={{}} />
                                                ) : null}
                                            </View>

                                            {item.status === "1" ? (
                                                <Image
                                                    style={[size_tool(24, 40)]}
                                                    source={require("../../../../../images/chineseHomepage/reading/rightGo.png")}
                                                />
                                            ) : (
                                                <ImageBackground
                                                    style={[size_tool(213, 179)]}
                                                    source={require("../../../../../images/chineseHomepage/reading/recordPanda.png")}
                                                />
                                            )}
                                            {/* </View> */}
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>
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
    left_item_wrap_n: {
        ...size_tool(320, 120),
        borderRadius: pxToDp(40),
        backgroundColor: "transparent",
        paddingBottom: pxToDp(8),
    },
    left_item_inner_n: {
        flex: 1,
        borderRadius: pxToDp(40),
        backgroundColor: "transparent",
        ...appStyle.flexCenter,
    },
    left_item_wrap: {
        ...size_tool(320, 120),
        borderRadius: pxToDp(40),
        backgroundColor: "#EDEDF4",
        paddingBottom: pxToDp(8),
    },
    left_item_inner: {
        flex: 1,
        borderRadius: pxToDp(40),
        backgroundColor: "#fff",
        ...appStyle.flexCenter,
    },
    left_item_text: {
        ...appFont.fontFamily_syst,
        fontSize: pxToDp(40),
        color: "#475266",
    },
    left_item_text_check: {
        ...appFont.fontFamily_syst_bold,
        fontSize: pxToDp(40),
        color: "#475266",
    },
    rightItem: {
        width: "100%",
        alignItems: "center",
        ...padding_tool(15, 70, 15, 70),
        borderRadius: pxToDp(49),
        height: pxToDp(216),
        ...appStyle.flexTopLine,
    },
    rightTxt: {
        ...appFont.fontFamily_syst_bold,
        fontSize: pxToDp(54),
        color: "#445268",
        marginLeft: pxToDp(54),
        marginRight: pxToDp(54),
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
    // 存数据
    return {
        setUser(data) {
            dispatch(actionCreators.setUserInfoNow(data));
        },
        setVisible(data) {
            dispatch(actionCreators.setVisible(data));
        },
    };
};
export default connect(mapStateToProps, mapDispathToProps)(homePage);
