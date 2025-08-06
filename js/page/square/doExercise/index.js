import React, { createRef, PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ImageBackground,
    Platform,
    Modal,
    ScrollView,
    BackHandler,
    DeviceEventEmitter
} from "react-native";
import { appFont, appStyle } from "../../../theme";
import {
    size_tool,
    pxToDp,
    padding_tool,
    borderRadius_tool,
    pxToDpWidthLs,
    getIsTablet,
} from "../../../util/tools";
import NavigationUtil from "../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import Story from "./components/story";
import Good from "./components/good";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import url from "../../../util/url";
import * as WeChat from "react-native-wechat-lib";
import Encyclopedias from "./components/encyclopedias";
import _ from "lodash";
import Msg from "../../../component/square/msg";
import ParentTalk from "./components/parentTalk";
import ShareModal from "../../../component/ShareModal";
import * as actionCreators from "../../../action/userInfo/index";
import PublicTips from '../../../component/publicTips'

class SquareExercise extends PureComponent {
    constructor(props) {
        super(props);
        this.exerciseRef = createRef();
        this.state = {
            childrenDom: {
                paistory: {
                    dom: (
                        <Story
                            data={props.navigation.state.params.data}
                            showGood={this.showGood}
                            goBack={this.goBack}
                            ref={this.exerciseRef}
                        />
                    ),
                    bg: require("../../../images/square/squareDetailBg.png"),
                },
                encyclopedias: {
                    dom: (
                        <Encyclopedias
                            showGood={this.showGood}
                            seeKnowledgePoint={this.seeKnowledgePoint}
                            goBack={this.goBack}
                            onRef={(ref) => (this.exerciseRef = ref)}
                            navigation={this.props.navigation}
                        />
                    ),
                    bg: require("../../../images/square/bg_5.png"),
                },
                common_story_v3: {
                    dom: (
                        <ParentTalk
                            goBack={this.goBack}
                            onRef={(ref) => (this.exerciseRef = ref)}
                        />
                    ),
                    bg: require("../../../images/square/bg_5.png"),
                },
            },
            goodVisible: false,
            shareModalVisible: false,
            userName: "",
            showMsg: false,
            isWord: false,
            wordDetails: {},
            isPhone: !getIsTablet(),
            visible: false
        };
    }
    componentDidMount() {
        this.backBtnListener = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                this.goBack()
                return true;
            }
        );
    }
    componentWillUnmount() {
        this.backBtnListener && this.backBtnListener.remove();
    }
    getAuth = (alias) => {
        let i = {
            alias,
        };
        this.props.setSelectModule(i);
        this.props.setSelestModuleAuthority();
    };
    goBack = () => {
        let { module } = this.props.navigation.state.params.data;
        if (module === 'paistory') {
            this.setState({
                visible: true
            });
        } else {
            NavigationUtil.goBack(this.props);
        }
    };
    seeKnowledgePoint = (knowledge_point) => {
        this.setState({
            isWord: true,
            showMsg: true,
            wordDetails: knowledge_point,
        });
    };

    showGood = () => {
        this.setState({
            goodVisible: true,
        });
    };
    renderExercise = () => {
        this.setState({
            goodVisible: false,
        });
        this.exerciseRef.initExercise();
    };

    parseData = async (d) => {
        const { module, imgUrl } = d;
        let name = "";
        let subTitle = "";
        let id = "";
        let tag = "";
        let queryInfo = "";
        let createUser = "派效学";
        if (module === "paistory") {
            const { title_id } = d;
            id = title_id;
            const detail = await this.getStoryDetail(module, id);
            name = `KET拓展阅读: ${d.name}`;
            subTitle = detail.desc.en;
            tag = "一起开始 #PaiStory 阅读之旅吧！";
            const userInfo = this.props.userInfo.toJS();
            const dd = this.exerciseRef.current?.share();
            const o = Object.assign(dd, { user_id: userInfo.id });
            queryInfo = Object.keys(o)
                .map((k) => `${k}=${o[k]}`)
                .join("&");
            console.log("query info: ", queryInfo);
        } else if (module === "common_story" || module === "common_story_v2") {
            name = d.title;
            subTitle = "一起来用AI创作故事吧";
            tag = "一起来用AI #创作 故事吧";
            queryInfo = `id=${d.id}&check_word_list=${["占位数据"]}`;
            createUser = d.user_name;
        }
        return {
            name,
            subTitle,
            img: url.baseURL + imgUrl,
            tag,
            queryInfo,
            createUser,
        };
    };

    getStoryDetail = async (moduleType, id) => {
        let detail;
        let sendData;
        if (moduleType === "paistory") {
            sendData = {
                title_id: id,
            };
            const res = await axios.get(api.getStoryDesc, { params: sendData });
            detail = res.data.data;
        }
        return detail;
    };

    shareEvent = async (targetType) => {
        const { userName } = this.state;
        const p = this.props.navigation.state.params.data;
        console.log("raw: ", p);
        const defaultAvatar =
            "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/paixiaoxue/avatar/default.png";
        const { name, subTitle, img, tag, queryInfo, createUser } =
            await this.parseData(p);
        // console.log("raw share data: ", p);
        // nowIndex
        // console.log("queryInfo: ", queryInfo);
        // console.log("U: ", `https://test.pailaimi.com?readUser=${userName}&createUser=${defaultUser}&createUserImg=${defaultAvatar}&tag=${encodeURIComponent(
        //     tag
        // )}&${queryInfo}`)
        await WeChat.registerApp("wxedf6fb113c40f47e", "https://pailaimi.com/");
        await WeChat.shareWebpage({
            title: name,
            description: subTitle,
            thumbImageUrl: img,
            // webpageUrl: "https://www.share.paistory.com?a_id=1120", // knowledge_code a_id title_id
            webpageUrl: `https://test.pailaimi.com?readUser=${userName}&createUser=${createUser}&createUserImg=${defaultAvatar}&tag=${encodeURIComponent(
                tag
            )}&${queryInfo}`, // knowledge_code a_id title_id
            scene: targetType === "friends" ? 0 : 1, // 0 微信好友；1 朋友圈
        });
    };

    render() {
        const { auther } = this.props.homeSelectItem;
        const {
            childrenDom,
            goodVisible,
            shareModalVisible,
            showMsg,
            isWord,
            wordDetails,
            isPhone,
            visible
        } = this.state;
        const { meaning, knowledge_point, pinyinList, pinyin_2, words } =
            wordDetails;
        const { questionMap, squareType } = this.props;
        let { module, title } = this.props.navigation.state.params.data;
        // common_story_v2 百科故事  common_story_v3 家长
        const isEncyclopedia = !_.isEmpty(questionMap.toJS()[title]);
        if (isEncyclopedia) {
            // 百科故事
            module = "encyclopedias";
        }
        return (
            <ImageBackground
                style={[
                    { flex: 1, position: "relative" },
                    childrenDom[module].bgColor
                        ? { backgroundColor: childrenDom[module].bgColor }
                        : null,
                ]}
                // source={require("../../../images/square/squareDetailBg.png")}
                source={childrenDom[module].bg ? childrenDom[module].bg : null}
            >
                <ShareModal
                    visible={shareModalVisible}
                    shareEvent={this.shareEvent}
                    onCancel={() => {
                        this.setState({
                            shareModalVisible: false,
                        });
                    }}
                ></ShareModal>
                <View
                    style={[
                        {
                            height: pxToDp(Platform.OS === "ios" ? 170 : 150),
                            borderBottomColor: "#D4CFCB",
                            borderBottomWidth: pxToDp(3),
                            backgroundColor: "#EDE8E4",
                            // marginBottom: pxToDp(30),
                        },
                        padding_tool(Platform.OS === "ios" ? 20 : 0, 26, 0, 26),
                        appStyle.flexTopLine,
                        appStyle.flexJusBetween,
                        appStyle.flexAliCenter,
                    ]}
                >
                    <View style={[appStyle.flexTopLine]}>
                        <TouchableOpacity
                            style={[{ marginLeft: pxToDp(25) }]}
                            onPress={this.goBack}
                        >
                            <Image
                                style={[
                                    {
                                        width: pxToDp(120),
                                        height: pxToDp(80),
                                    },
                                ]}
                                source={require("../../../images/chineseHomepage/pingyin/new/back.png")}
                            />
                        </TouchableOpacity>
                        {module === "common_story_v3" ||
                            module === "encyclopedias" ? null : (
                            <View style={[styles.autherWrap]}>
                                <Image
                                    source={{ uri: url.baseURL + this.props.avatar }}
                                    style={[size_tool(100), borderRadius_tool(50)]}
                                />
                                <Text style={[styles.autherName]}>{auther}</Text>
                            </View>
                        )}
                    </View>

                    {Platform.OS === "ios" && module !== "common_story_v3" ? (
                        <TouchableOpacity
                            style={[
                                size_tool(196, 83),
                                appStyle.flexTopLine,
                                appStyle.flexCenter,
                                {
                                    backgroundColor: "#F5F3F2",
                                    borderWidth: pxToDp(3),
                                    borderColor: "#D4CFCB",
                                    borderRadius: pxToDp(40),
                                },
                            ]}
                            onPress={() => {
                                console.log("user info: ", this.props.userInfo);
                                const userInfo = this.props.userInfo.toJS();
                                const { name } = userInfo;
                                this.setState({
                                    shareModalVisible: true,
                                    userName: name,
                                });
                            }}
                        >
                            <Image
                                source={require("../../../images/square/shareIcon.png")}
                                style={[size_tool(41, 43)]}
                            />

                            <Text
                                style={[
                                    appFont.fontFamily_jcyt_500,
                                    {
                                        fontSize: pxToDp(34),
                                        color: "#727475",
                                        marginLeft: pxToDp(16),
                                    },
                                ]}
                            >
                                分享
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
                <SafeAreaView style={[{ flex: 1 }]}>
                    {childrenDom[module].dom}
                </SafeAreaView>
                {goodVisible ? (
                    <Good
                        type={module}
                        renderExercise={this.renderExercise}
                        goBack={() => {
                            this.goBack();
                        }}
                    />
                ) : null}
                <Msg
                    showMsg={showMsg}
                    navigation={this.props.navigation}
                    titleDom={
                        isWord ? (
                            <View style={[appStyle.flexTopLine]}>
                                {words.map((i, x) => {
                                    return (
                                        <View key={x} style={[appStyle.flexAliCenter]}>
                                            <Text
                                                style={[
                                                    words.length > 2
                                                        ? styles.wordPinyin_four
                                                        : styles.wordPinyin,
                                                ]}
                                            >
                                                {pinyinList[x]}
                                            </Text>
                                            <Text
                                                style={[
                                                    words.length > 2
                                                        ? styles.wordTxt_four
                                                        : styles.wordTxt,
                                                ]}
                                            >
                                                {i}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        ) : null
                    }
                    mainDOm={
                        isWord ? (
                            <View style={[{ flex: 1 }, padding_tool(10, 0, 10, 0)]}>
                                <ScrollView>
                                    <Text
                                        style={[
                                            styles.meaningMsg,
                                            isPhone ? { fontSize: pxToDpWidthLs(36) } : null,
                                        ]}
                                    >
                                        {meaning}
                                    </Text>
                                </ScrollView>
                            </View>
                        ) : null
                    }
                    onClose={() => {
                        this.setState({
                            showMsg: false,
                            isWord: false,
                        });
                    }}
                    onOk={() => {
                        this.setState({
                            showMsg: false,
                            isWord: false,
                        });
                    }}
                />
                <PublicTips btnTxt={'立即查看'} back={() => {
                    this.setState({
                        visible: false
                    })
                    NavigationUtil.goBack(this.props);
                }} confirm={() => {
                    this.setState({
                        visible: false
                    })

                    NavigationUtil.toSquareHistory({ navigation: this.props.navigation, data: { type: 'history' } });
                }} cancel={() => {
                    this.setState({
                        visible: false
                    })
                }} visible={visible} tips={`退出后可在【共创浏览记录】中查看此篇文章读过的段落得分。\n\n注意：重新进入此页面，所有数据将刷新，段落得分将会清空。`}></PublicTips>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    autherName: {
        fontSize: pxToDp(45),
        color: "#283139",
        marginLeft: pxToDp(37),
    },
    autherWrap: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: pxToDp(57),
    },
    wordTxt_four: {
        fontSize: pxToDp(80),
        color: "#1F1F26",
        lineHeight: pxToDp(90),
    },
    wordTxt: {
        fontSize: pxToDp(100),
        color: "#1F1F26",
        lineHeight: pxToDp(110),
    },
    wordPinyin_four: {
        fontSize: pxToDp(32),
        color: "#1F1F26",
        lineHeight: pxToDp(42),
    },
    wordPinyin: {
        fontSize: pxToDp(46),
        color: "#1F1F26",
        lineHeight: pxToDp(56),
    },
    meaningMsg: {
        fontSize: pxToDp(38),
        color: "#283139",
    },
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        avatar: state.getIn(["userInfo", "avatar"]),
        questionMap: state.getIn(["square", "questionMap"]),
        homeSelectItem: state.getIn(["square", "homeSelectItem"]),
        squareType: state.getIn(["userInfo", "squareType"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setSelestModuleAuthority(data) {
            dispatch(actionCreators.setSelestModuleAuthority(data));
        },
        setSelectModule(data) {
            dispatch(actionCreators.setSelectModule(data));
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(SquareExercise);
