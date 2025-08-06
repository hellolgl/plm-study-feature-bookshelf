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
    Dimensions,
    Animated,
} from "react-native";
import {
    borderRadius_tool,
    margin_tool,
    padding_tool,
    pxToDp,
    size_tool,
    getIsTablet,
} from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { Modal, Toast } from "antd-mobile-rn";

import { connect } from "react-redux";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
// import RichShowView from "../../../../../component/chinese/RichShowView";
import RichShowView from "../../../../../component/chinese/newRichShowView";

import url from "../../../../../util/url";
import Audio from "../../../../../util/audio/audio";
import MyManyBarChart from "../../../../../component/myChart/myManyBarChart";
import MsgModal from "../../../../../component/chinese/sentence/msgModal";
import SentenceTalk from "./sentenceTalk";
const speList = ["关联词运用", "修辞手法", "文化积累", "句型训练"];
class homePage extends PureComponent {
    constructor(props) {
        super(props);
        this.info = this.props.userInfo.toJS();
        this.rotateValue = new Animated.Value(1);
        this.state = {
            list: [],
            inspect_name: this.props.navigation.state.params.data.inspect_name,
            has_exercise: false,
            rate_correct: this.props.navigation.state.params.data.rate_correct,
            hasSpe:
                speList.filter(
                    (i) => i === this.props.navigation.state.params.data.inspect_name
                ).length > 0,
            iid: this.props.navigation.state.params.data.iid,
            explain: "",
            audio: "",
            checkIndex: 0,
            exercise_id: -1,
            ab_exercise_id: -1,
            rightValue: [],
            namelist: [],
            totallist: [],
            speItem: {},
            rightvisible: false,
            lookMsg: false,
            name: this.props.navigation.state.params.data.inspect_name,
            sendIid: 0,
            threeList: [],
            showExplain: false,
            isPhone: !getIsTablet(),
            hasAiList: ["陈述句", "感叹句", "祈使句", "疑问句"],
            showAi: false,
            tag: "",
        };
        this.audio = React.createRef();
        this.scrollRef = React.createRef();
    }
    componentWillUnmount() {
        const { fromflow } = this.props.navigation.state.params.data;
        if (!fromflow) {
            DeviceEventEmitter.emit("backSentenceHome"); //刷新首页
        }
        this.eventListenerRefreshPage.remove();
    }
    componentDidMount() {
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "sentenceSpeList",
            () => {
                let index =
                    this.state.name === this.state.inspect_name
                        ? 0
                        : this.state.checkIndex + 1;
                this.getlist(this.state.sendIid, index, this.state.name);
            }
        );
        this.getData(this.props.navigation.state.params.data.iid, 0);
        const { fromflow } = this.props.navigation.state.params.data;
        if (!fromflow) {
            this.getlist(
                this.state.iid,
                0,
                this.props.navigation.state.params.data.inspect_name
            );
        }
    }
    getData = (iid) => {
        const { fromflow, tag1 } = this.props.navigation.state.params.data;
        // api.knowledgeSystem + this.props.preOrigin + '/' + this.props.userInfo.id + '?knowledge_code=' + knowledge_code + '&code=' + this.props.code+'&element_type='+1
        let grade_code = this.info.checkGrade;
        let term_code = this.info.checkTeam;
        // chineseNewSentenceGetKnow
        let obj = {
            grade_code,
            term_code,
            iid,
        };

        axios
            .get(api.getChinspect, {
                params: obj,
            })
            .then((res) => {
                if (res.data?.err_code === 0) {
                    let list = res.data.data;
                    // console.log("======", tag1, res.data.data);

                    // let havespe = speList.filter((i) => i === inspect_name)
                    let threeList = [],
                        iidnow = iid,
                        indexnow = 0;
                    let namelist = [];
                    namelist.push(...list);
                    if (fromflow) {
                        namelist.forEach((item, index) => {
                            if (item.name === tag1) {
                                threeList = item.child_data ? item.child_data : [];
                                iidnow = item.iid;
                                indexnow = index;
                                this.getlist(item.iid, 0, item.name);
                            }
                        });
                    }

                    // if (index === 0) {
                    this.setState({
                        list: namelist,
                        threeList,
                        sendIid: iidnow,
                        checkIndex: indexnow,
                    });
                }
            });
    };

    getlist = (iid, index, name) => {
        const { inspect_name } = this.state;
        let grade_code = this.info.checkGrade;
        let term_code = this.info.checkTeam;
        // chineseNewSentenceGetKnow
        let obj = {
            grade_code,
            term_code,
            inspect: inspect_name,
            iid,
            name,
        };
        index === 0 ? (obj.first_category = 1) : "";
        this.setState({
            explain: "",
        });
        // Toast.loading('加载中...', 1)
        axios
            .get(api.getSentenceSpeList, {
                params: obj,
            })
            .then((res) => {
                // Toast.hide()
                if (res.data.err_code === 0) {
                    // ab_times_id 智能造句 improve_times_id 提升  times_id专项学习
                    let total = res.data.data.total,
                        right_total = res.data.data.right_total;
                    let exercise_id =
                        name === this.state.inspect_name
                            ? res.data.data.improve_times_id
                            : res.data.data.times_id;
                    // this.scrollRef.scrollTo({ y: 0 })
                    let rate_correct = Math.floor(Number(right_total / total) * 100);
                    this.setState({
                        explain: res.data.data.data.explain,
                        audio: res.data.data.data.audio,
                        has_exercise: !(exercise_id === -1),
                        ab_exercise_id: res.data.data.ab_times_id,
                        exercise_id,
                        name,
                        // sendIid: iid,
                        rate_correct: isNaN(rate_correct) ? 0 : rate_correct,
                    });
                }
            });
    };

    goback = () => {
        this.audio?.current?.pausedEvent();
        NavigationUtil.goBack(this.props);
    };
    todoExercise = () => {
        const { checkIndex, hasSpe, has_exercise, inspect_name, list, name } =
            this.state;
        //  { sub_modular: this.infoData.type === 'spe' ? '3' : '2', modular: '1', ... this.props.navigation.state.params.data }
        let data = {
            has_record: has_exercise,
            modular: "1",
            sub_modular: name === inspect_name ? "3" : "2",
            type: name === inspect_name ? "speLevel" : "speStudy",
            iid: list[checkIndex].iid,
            name: list[checkIndex].name,
            inspect_name,
        };
        if (has_exercise) {
            NavigationUtil.toNewSentenceExerciseRercord({
                ...this.props,
                data,
            });
        } else {
            NavigationUtil.toNewSentenceDoExercise({
                ...this.props,
                data,
            });
        }
    };
    todoAiExercise = () => {
        const { inspect_name, ab_exercise_id } = this.state;
        // console.log('智能造句')
        let data = {
            has_record: ab_exercise_id !== -1,
            // modular: '1',
            // sub_modular:  '2',
            type: "Ai",
            inspect_name: "智能造句",
            name: inspect_name,
            modular: "1", // π计划
            sub_modular: "4", //智能造句
        };
        if (ab_exercise_id !== -1) {
            NavigationUtil.toNewSentenceExerciseRercord({
                ...this.props,
                data,
            });
        } else {
            NavigationUtil.toNewSentenceDoExercise({
                ...this.props,
                data,
            });
        }
    };
    lookThis = (index, iid) => {
        const { list } = this.state;

        this.setState(
            {
                checkIndex: index,
                sendIid: iid,
                threeList: list[index].child_data ? list[index].child_data : [],
            },
            () => {
                this.scrollRef?.scrollTo &&
                    this.scrollRef?.scrollTo({ x: 0, y: 0, animated: false });
            }
        );
        this.getlist(
            list[index].iid,
            index + 1,
            list[index].name === "综合" ? "" : list[index].name
        );
    };
    renderAbBtn = () => {
        const { has_exercise, ab_exercise_id } = this.state;
        if (has_exercise) {
            if (ab_exercise_id === -1) {
                return (
                    <TouchableOpacity onPress={this.todoAiExercise}>
                        <View
                            style={[styles.btnWrap1]}
                            source={require("../../../../../images/chineseHomepage/sentence/noAISentence.png")}
                        >
                            <View style={[styles.btnInner1]}>
                                <Text style={[styles.btnTxt1]}>进阶挑战</Text>
                                <View style={[styles.btnTxwWrap1]}>
                                    <Text style={[styles.spebtnTxt1]}>AI造句</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            } else {
                return (
                    <TouchableOpacity onPress={this.todoAiExercise}>
                        <View
                            style={[styles.btnWrap2]}
                            source={require("../../../../../images/chineseHomepage/sentence/noAISentence.png")}
                        >
                            <View style={[styles.btnInner2]}>
                                <Text style={[styles.btnTxt1]}>进阶挑战</Text>
                                <View style={[styles.btnTxwWrap2]}>
                                    <Text style={[styles.btnTxt2]}>AI造句</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            }
        } else {
            return (
                <TouchableOpacity onPress={() => this.setState({ lookMsg: true })}>
                    <View
                        style={[styles.btnWrap3]}
                        source={require("../../../../../images/chineseHomepage/sentence/noAISentence.png")}
                    >
                        <View style={[styles.btnInner3]}>
                            <Text
                                style={[
                                    styles.btnTxt4,
                                    Platform.OS === "ios" ? { lineHeight: pxToDp(60) } : {},
                                ]}
                            >
                                进阶挑战
                            </Text>
                            <View style={[styles.btnTxwWrap3]}>
                                <Text style={[styles.btnTxt3]}>AI造句</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    };
    getListDetail = (name) => {
        // const { userInfo } = this.props;\
        if (this.state.namelist.length > 0) {
            this.setState({
                rightvisible: true,
            });
            return;
        }
        const userInfoJs = this.info;
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam;
        axios
            .get(
                `${api.getChinesSenstatistics}?grade_term=${grade_term}&iid=${this.state.iid}`,
                { params: {} }
            )
            .then((res) => {
                let list = res.data.data.son_category;
                let listnow = [];
                // listnow = [...list]
                let rightValue = [],
                    namelist = [""],
                    totallist = [];

                for (let i = 0; i < list.length; i++) {
                    let tagname = "";
                    if (name === "句式变换") {
                        // 单独处理名字，不然名字太长会互相遮住
                        let oldname = list[i].inspect_name;
                        tagname = oldname[0] + oldname[3] + oldname[4] + oldname[5];
                        oldname === "“把”“被”字句转换" ? (tagname = "把被转换") : "";
                        oldname === "直接叙述变转述" ? (tagname = "直变转述") : "";
                    } else {
                        tagname = list[i].inspect_name;
                    }
                    namelist.push(tagname);
                    let rightobj = {
                        x: i + 1,
                        y: list[i].rate_correct,
                    };
                    rightValue.push(rightobj);
                    totallist.push({
                        x: i + 1,
                        y: list[i].total > 0 ? 100 : 0,
                    });
                }
                if (list.length < 8) {
                    for (let i = list.length; i < 8; i++) {
                        namelist.push("");
                        let rightobj = {
                            x: i + 1,
                            y: 0,
                        };
                        rightValue.push(rightobj);
                        totallist.push({
                            x: i + 1,
                            y: 0,
                        });
                    }
                }
                // console.log('_______________', namelist, totallist, rightValue)

                this.setState({
                    totallist,
                    rightValue,
                    namelist,
                    rightvisible: true,
                });
            });
    };

    renderLine = () => {
        const { isPhone } = this.state;
        return Platform.OS === "ios" && !isPhone ? (
            <Image
                source={require("../../../../../images/chineseHomepage/sentence/lineLong.png")}
                style={[size_tool(4, 260)]}
            />
        ) : (
            <Image
                source={require("../../../../../images/chineseHomepage/sentence/lineShort.png")}
                style={[size_tool(4, 100), isPhone && { height: pxToDp(50) }]}
            />
        );
    };
    renderNoData = () => {
        return (
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
                        本年级不涉及{this.state.inspect_name}知识点。
                    </Text>
                </View>
            </View>
        );
    };
    clickItem = (item) => {
        const { token } = this.props;
        if (!token) {
            NavigationUtil.resetToLogin(this.props);
            return;
        }
        const { name, inspect_name, hasAiList } = this.state;
        let hasThis = hasAiList.filter((i) => i === name);
        if (
            inspect_name === "句型训练" &&
            hasThis.length > 0
        ) {
            console.log("点击", item, name, inspect_name, hasThis);
            this.setState({
                showAi: true,
                tag: item.name,
            });
        }
    };
    handleAbSenAIbot = () => {
        // AI bot
        if (!this.props.token) {
            NavigationUtil.resetToLogin(this.props);
            return
        }
        const { name, inspect_name, list } = this.state;
        const secondList = [];
        list.forEach((item, index) => {
            secondList.push(item.name);

        });
        NavigationUtil.toChineseAbSenAIHelp({
            ...this.props,
            data: {
                inspect: inspect_name,
                tags: secondList
            },
        });
    };

    render() {
        let {
            inspect_name,
            has_exercise,
            rate_correct,
            list,
            showExplain,
            explain,
            hasSpe,
            audio,
            lookMsg,
            sendIid,
            iid,
            threeList,
            name,
            showAi,
            tag,
        } = this.state;
        console.log("cn checkGrade: ", iid, sendIid);
        // log("cn checkTerCode: ", this.state.visible)

        // explain = explain.replaceAll('<br>', '').replaceAll('<br/>', '')
        explain = explain.replaceAll(
            '<p><span style="font-weight: bold;"></span></p>',
            ""
        );
        explain = explain.replaceAll("<o:p></o:p>", "");
        if (
            explain.includes("<rp>(</rp>") ||
            explain.includes("……") ||
            explain.includes("text-align:center")
        ) {
            explain = explain.replaceAll("<rt>", "<rt>&nbsp;");
            explain = explain.replaceAll("</rt>", "&nbsp;<rt>");
        }
        // console.log('参数------', explain)
        return (

            <View style={[styles.container]}>
                <ImageBackground
                    source={require("../../../../../images/chineseHomepage/sentence/sentenceBg.png")}
                    style={[
                        { flex: 1 },
                        padding_tool(Platform.OS === "ios" ? 60 : 20, 0, 0, 0),
                    ]}
                    resizeMode="cover"
                >
                    <View style={[styles.headWrap]}>
                        <View style={[size_tool(276, 80)]}>
                            <TouchableOpacity
                                style={[size_tool(120, 80)]}
                                onPress={this.goback}
                            >
                                <Image
                                    style={[size_tool(120, 80)]}
                                    source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(48), color: '#475266' }]} >{inspect_name}</Text> */}
                        <TouchableOpacity
                            onPress={this.getListDetail.bind(this, inspect_name)}
                            style={[styles.btnWrap]}
                        >
                            <Text style={[styles.headBtnTxt]}>正确率：{rate_correct}%</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={[styles.abAiItem]}
                        onPress={() => {
                            this.handleAbSenAIbot();
                        }
                        }
                    >
                        <Image
                            style={[size_tool(317, 268)]}
                            source={require("../../../../../images/square/ab_ai_item.png")}

                        />
                    </TouchableOpacity>
                    {list.length === 0 ? (
                        <View style={[{ flex: 1 }]}>{this.renderNoData()}</View>
                    ) : (
                        <View style={[{ flex: 1 }, padding_tool(60, 0, 0, 0)]}>
                            <View style={[appStyle.flexCenter]}>
                                {/* 一级 */}
                                <TouchableOpacity
                                    onPress={() => {
                                        this.getlist(this.state.iid, 0, this.state.inspect_name);
                                        this.setState({
                                            threeList: [],
                                            sendIid: this.state.iid,
                                        });
                                    }}
                                    style={[
                                        styles.firstWrap,
                                        {
                                            backgroundColor: sendIid === iid ? "#F07C39" : "#E2E7F0",
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.firstinner,
                                            {
                                                backgroundColor: sendIid === iid ? "#FF964A" : "#fff",
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.itemText,
                                                sendIid === iid ? { color: "#fff" } : null,
                                            ]}
                                        >
                                            {inspect_name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {list.length > 0 ? this.renderLine() : null}
                            </View>
                            <View style={[{ alignItems: "center" }]}>
                                <ScrollView horizontal={true}>
                                    <View style={[styles.twoWrap]}>
                                        {/* 二级 */}
                                        <View style={[styles.twoListWrap]}></View>
                                        {list.map((item, index) => {
                                            return (
                                                <TouchableOpacity
                                                    onPress={this.lookThis.bind(this, index, item.iid)}
                                                    key={index}
                                                    style={[
                                                        appStyle.flexCenter,
                                                        {
                                                            marginRight:
                                                                index < list.length - 1 ? pxToDp(80) : 0,
                                                        },
                                                    ]}
                                                >
                                                    <View
                                                        style={[
                                                            {
                                                                paddingBottom: pxToDp(8),
                                                                backgroundColor:
                                                                    sendIid === item.iid ? "#F07C39" : "#E2E7F0",
                                                            },
                                                            borderRadius_tool(40),
                                                        ]}
                                                    >
                                                        <View
                                                            style={[
                                                                styles.twoInner,

                                                                {
                                                                    backgroundColor:
                                                                        sendIid === item.iid ? "#FF964A" : "#fff",
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.itemText,
                                                                    sendIid === item.iid ? { color: "#fff" } : {},
                                                                ]}
                                                            >
                                                                {item.name}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    {sendIid === item.iid && threeList.length > 0
                                                        ? this.renderLine()
                                                        : null}
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </ScrollView>
                            </View>
                            {threeList.length > 0 ? (
                                <View style={[{ width: "100%" }, appStyle.flexAliCenter]}>
                                    <ScrollView
                                        ref={(view) => (this.scrollRef = view)}
                                        horizontal={true}
                                        style={[{}]}
                                    >
                                        <View style={[padding_tool(0, 80, 0, 80)]}>
                                            <View style={[styles.threeWrap]}>
                                                {threeList.map((item, index) => {
                                                    let showBot = inspect_name === "句型训练";
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={this.clickItem.bind(this, item)}
                                                            key={index}
                                                            style={[
                                                                styles.threeItem,
                                                                showBot && {
                                                                    borderBottomWidth: pxToDp(8),
                                                                    position: "relative",
                                                                },
                                                            ]}
                                                        >
                                                            <Text style={[styles.threeTxt]}>{item.name}</Text>
                                                            {showBot ? <Image
                                                                style={[styles.aiItem]}
                                                                source={require("../../../../../images/chineseHomepage/sentence/ai_item.png")}
                                                            /> : null}
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>
                            ) : null}
                            <View
                                style={[
                                    { flex: 1, justifyContent: "flex-end" },
                                    padding_tool(0, 80, 0, 80),
                                ]}
                            >
                                <View
                                    style={[
                                        {
                                            width: "100%",
                                            backgroundColor: "#fff",
                                            height: pxToDp(208),
                                        },
                                        borderRadius_tool(60, 60, 0, 0),
                                        appStyle.flexTopLine,
                                        appStyle.flexJusBetween,
                                        padding_tool(40),
                                    ]}
                                >
                                    <TouchableOpacity
                                        onPress={() => this.setState({ showExplain: true })}
                                        style={[appStyle.flexTopLine, appStyle.flexAliCenter]}
                                    >
                                        <Image
                                            source={require("../../../../../images/chineseHomepage/sentence/explainUp.png")}
                                            style={[size_tool(80)]}
                                        />
                                        <Text
                                            style={[
                                                appFont.fontFamily_syst_bold,
                                                {
                                                    fontSize: pxToDp(60),
                                                    color: "#475266",
                                                    marginLeft: pxToDp(40),
                                                },
                                            ]}
                                        >
                                            {name}
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                                        {name === inspect_name && hasSpe && list.length > 0
                                            ? this.renderAbBtn()
                                            : null}
                                        {
                                            list.length > 0 ? (
                                                <TouchableOpacity
                                                    onPress={this.todoExercise}
                                                    style={[
                                                        size_tool(304, 128),
                                                        borderRadius_tool(40),
                                                        {
                                                            paddingBottom: pxToDp(8),
                                                            backgroundColor: has_exercise
                                                                ? "#17A97D"
                                                                : "#F07C39",
                                                            marginLeft: pxToDp(20),
                                                        },
                                                    ]}
                                                >
                                                    <View
                                                        style={[
                                                            {
                                                                flex: 1,
                                                                backgroundColor: has_exercise
                                                                    ? "#26C595"
                                                                    : "#FF964A",
                                                            },
                                                            borderRadius_tool(40),
                                                            appStyle.flexCenter,
                                                            appStyle.flexTopLine,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                appFont.fontFamily_jcyt_700,
                                                                {
                                                                    fontSize: pxToDp(48),
                                                                    color: "#fff",
                                                                    marginRight: pxToDp(40),
                                                                },
                                                            ]}
                                                        >
                                                            {inspect_name === name ? "综合测" : "专项学"}
                                                        </Text>
                                                        <Image
                                                            source={require("../../../../../images/chineseHomepage/sentence/go.png")}
                                                            style={[size_tool(40)]}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            ) : null
                                            // <TouchableOpacity
                                            //   style={[
                                            //     size_tool(304, 128),
                                            //     borderRadius_tool(40),
                                            //     {
                                            //       paddingBottom: pxToDp(8),
                                            //       backgroundColor: "#CFDAE9",
                                            //       marginLeft: pxToDp(40),
                                            //     },
                                            //   ]}
                                            // >
                                            //   <View
                                            //     style={[
                                            //       { flex: 1, backgroundColor: "#E5E9EF" },
                                            //       borderRadius_tool(40),
                                            //       appStyle.flexCenter,
                                            //       appStyle.flexTopLine,
                                            //     ]}
                                            //   >
                                            //     <Text
                                            //       style={[
                                            //         appFont.fontFamily_jcyt_700,
                                            //         { fontSize: pxToDp(48), color: "#fff" },
                                            //       ]}
                                            //     >
                                            //       {"测一测"}
                                            //     </Text>
                                            //     <Image
                                            //       source={require("../../../../../images/chineseHomepage/sentence/go.png")}
                                            //       style={[size_tool(40)]}
                                            //     />
                                            //   </View>
                                            // </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                    {showExplain ? (
                        <View style={[styles.explainWrap]}>
                            <View
                                style={[
                                    { flex: 1, backgroundColor: "#fff" },
                                    borderRadius_tool(60, 60, 0, 0),
                                ]}
                            >
                                <View style={[styles.explainInner]}>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ showExplain: false })}
                                        style={[appStyle.flexTopLine, appStyle.flexAliCenter]}
                                    >
                                        <Animated.Image
                                            source={require("../../../../../images/chineseHomepage/sentence/explainUp.png")}
                                            style={[
                                                size_tool(80),
                                                {
                                                    transform: [
                                                        {
                                                            rotateZ: this.rotateValue.interpolate({
                                                                inputRange: [0, 1],
                                                                outputRange: ["0deg", "180deg"],
                                                            }),
                                                        },
                                                    ],
                                                },
                                            ]}
                                        />
                                        {/* <Image source={require('../../../../../images/chineseHomepage/sentence/explainUp.png')} style={[size_tool(80)]} /> */}
                                        <Text
                                            style={[
                                                appFont.fontFamily_syst_bold,
                                                {
                                                    fontSize: pxToDp(60),
                                                    color: "#475266",
                                                    marginLeft: pxToDp(40),
                                                },
                                            ]}
                                        >
                                            {name}
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                                        {name === inspect_name && hasSpe
                                            ? this.renderAbBtn()
                                            : null}
                                        {list.length > 0 ? (
                                            <TouchableOpacity
                                                onPress={this.todoExercise}
                                                style={[
                                                    styles.btnWrap5,
                                                    {
                                                        backgroundColor: has_exercise
                                                            ? "#17A97D"
                                                            : "#F07C39",
                                                    },
                                                ]}
                                            >
                                                <View
                                                    style={[
                                                        styles.btnInner5,
                                                        {
                                                            backgroundColor: has_exercise
                                                                ? "#26C595"
                                                                : "#FF964A",
                                                        },
                                                    ]}
                                                >
                                                    <Text style={[styles.btntxt5]}>
                                                        {inspect_name === name ? "综合测" : "专项学"}
                                                    </Text>
                                                    <Image
                                                        source={require("../../../../../images/chineseHomepage/sentence/go.png")}
                                                        style={[size_tool(40)]}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                </View>
                                <View style={[styles.mainWrap]}>
                                    <ScrollView>
                                        {audio ? (
                                            <View
                                                style={[
                                                    {
                                                        marginBottom:
                                                            Platform.OS === "ios" ? pxToDp(40) : pxToDp(20),
                                                    },
                                                ]}
                                            >
                                                <Audio
                                                    audioUri={`${url.baseURL}${audio}`}
                                                    pausedBtnImg={require("../../../../../images/chineseHomepage/sentence/audioPlaying.png")}
                                                    pausedBtnStyle={{
                                                        width: pxToDp(200),
                                                        height: pxToDp(120),
                                                    }}
                                                    playBtnImg={require("../../../../../images/chineseHomepage/sentence/audioStop.png")}
                                                    playBtnStyle={{
                                                        width: pxToDp(200),
                                                        height: pxToDp(120),
                                                    }}
                                                />
                                            </View>
                                        ) : null}

                                        <RichShowView
                                            width={pxToDp(1660)}
                                            size={2}
                                            value={`${explain}`}
                                            fontIndex={1}
                                        ></RichShowView>
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    ) : null}
                    <Modal
                        animationType="fade"
                        transparent
                        // onClose={() => this.handlenOnCloseRight()}
                        maskClosable={false}
                        visible={this.state.rightvisible}
                        // closable   //有无左上角的关闭
                        // footer={null}
                        style={{ width: pxToDp(1300) }}
                    >
                        <View style={[[appStyle.flexCenter, { marginBottom: pxToDp(24) }]]}>
                            <Text style={[styles.goodTxt]}>正确率</Text>
                        </View>
                        <View style={styles.chartWrap}>
                            <MyManyBarChart
                                width={pxToDp(1200)}
                                height={pxToDp(400)}
                                totallist={[]}
                                rightValue={this.state.rightValue}
                                namelist={this.state.namelist}
                                textFount={pxToDp(30)}
                                rightColor={"#7076FF"}
                            />
                        </View>
                        <View style={[appStyle.flexCenter]}>
                            <TouchableOpacity
                                onPress={() => this.setState({ rightvisible: false })}
                                style={[styles.chartBtnWrap]}
                            >
                                <View style={[styles.chartBtnInner]}>
                                    <Text style={[styles.chartBtnTxt]}>好的</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <MsgModal
                        btnText="好的"
                        todo={() => this.setState({ lookMsg: false })}
                        visible={lookMsg}
                        title="规则说明"
                        msg="需要先完成一次“测一测”哦。 基于“测一测”的答题情况进行分析和推题。"
                    />
                    <SentenceTalk
                        visible={showAi}
                        close={() =>
                            this.setState({
                                showAi: false,
                            })
                        }
                        inspect_name={name}
                        tag={tag}
                        name={name}
                    />
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
    itemText: {
        fontSize: pxToDp(48),
        ...appFont.fontFamily_syst_bold,
        color: "#475266",
    },
    btnTxt1: {
        ...appFont.fontFamily_jcyt_700,
        color: "#fff",
        fontSize: pxToDp(48),
        lineHeight: pxToDp(60),
        marginBottom: Platform.OS === "android" ? pxToDp(-20) : 0,
    },
    threeItem: {
        ...borderRadius_tool(36),
        ...padding_tool(20),
        borderColor: "#E2E7F0",
        borderWidth: pxToDp(4),
        marginRight: pxToDp(20),
    },
    threeTxt: {
        ...appFont.fontFamily_syst_bold,
        color: "#475266",
        fontSize: pxToDp(40),
        lineHeight: pxToDp(60),
    },
    threeWrap: {
        ...appStyle.flexTopLine,
        ...appStyle.flexCenter,
        backgroundColor: "#fff",
        minWidth: pxToDp(1800),
        ...padding_tool(40),
        ...borderRadius_tool(40),
    },
    twoInner: {
        ...borderRadius_tool(40),
        height: pxToDp(120),
        minWidth: pxToDp(312),
        ...padding_tool(10, 20, 10, 20),
        ...appStyle.flexCenter,
    },
    twoListWrap: {
        height: pxToDp(4),
        backgroundColor: "#A8B5CE",
        width: "100%",
        position: "absolute",
        top: pxToDp(58),
        marginLeft: pxToDp(80),
    },
    twoWrap: {
        ...appStyle.flexTopLine,
        position: "relative",
        alignItems: "flex-start",
        ...padding_tool(0, 80, 0, 80),
    },
    firstinner: {
        ...borderRadius_tool(40),
        height: pxToDp(120),
        minWidth: pxToDp(312),
        ...padding_tool(10, 20, 10, 20),
        ...appStyle.flexCenter,
    },
    firstWrap: {
        paddingBottom: pxToDp(8),
        ...borderRadius_tool(40),
    },
    headWrap: {
        ...appStyle.flexTopLine,
        ...appStyle.flexJusBetween,
        ...padding_tool(0, 20, 0, 20),
        zIndex: 1000,
    },
    btnWrap: {
        ...size_tool(276, 80),
        ...borderRadius_tool(200),
        ...appStyle.flexCenter,
        backgroundColor: "#fff",
    },
    headBtnTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(32),
        color: "#475266",
    },
    goodTxt: {
        fontSize: pxToDp(48),
        color: "#475266",
        lineHeight: pxToDp(60),
        ...appFont.fontFamily_jcyt_700,
    },
    chartWrap: {
        backgroundColor: "#F9F9F9",
        width: pxToDp(1260),
        height: pxToDp(532),
        padding: pxToDp(50),
        marginBottom: pxToDp(40),
    },
    chartBtnWrap: {
        ...size_tool(216, 128),
        ...borderRadius_tool(200),
        backgroundColor: "#F07C39",
        paddingBottom: pxToDp(8),
    },
    chartBtnInner: {
        ...borderRadius_tool(200),
        ...appStyle.flexCenter,
        flex: 1,
        backgroundColor: "#FF964A",
    },
    chartBtnTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(48),
        color: "#fff",
    },
    explainWrap: {
        position: "absolute",
        width: "100%",
        height: "100%",
        bottom: pxToDp(0),
        zIndex: 999,
        ...padding_tool(Platform.OS === "ios" ? 100 : 120, 80, 0, 80),
    },
    explainInner: {
        width: "100%",
        backgroundColor: "#fff",
        height: pxToDp(208),
        ...borderRadius_tool(60, 60, 0, 0),
        ...appStyle.flexTopLine,
        ...appStyle.flexJusBetween,
        ...padding_tool(40),
    },
    btnWrap1: {
        paddingBottom: pxToDp(8),
        backgroundColor: "#7A4CFD",
        borderRadius: pxToDp(40),

        ...size_tool(480, 128),
    },
    btnInner1: {
        flex: 1,
        backgroundColor: "#946EFF",
        borderRadius: pxToDp(40),

        ...appStyle.flexTopLine,
        ...appStyle.flexCenter,
    },
    btnTxwWrap1: {
        ...size_tool(126, 48),
        ...borderRadius_tool(100),
        ...appStyle.flexCenter,
        backgroundColor: "#fff",
        marginLeft: pxToDp(40),
    },
    spebtnTxt1: {
        ...appFont.fontFamily_syst,
        fontSize: pxToDp(28),
        color: "#946EFF",
    },
    btnWrap2: {
        paddingBottom: pxToDp(8),
        backgroundColor: "#17A97D",
        borderRadius: pxToDp(40),
        ...size_tool(480, 128),
    },
    btnInner2: {
        flex: 1,
        backgroundColor: "#26C595",
        borderRadius: pxToDp(40),
        ...appStyle.flexTopLine,
        ...appStyle.flexCenter,
    },
    btnTxwWrap2: {
        ...size_tool(126, 48),
        ...borderRadius_tool(100),
        ...appStyle.flexCenter,
        backgroundColor: "#fff",
        marginLeft: pxToDp(40),
    },
    btnTxt2: {
        ...appFont.fontFamily_syst,
        fontSize: pxToDp(28),
        color: "#26C595",
    },
    btnWrap3: {
        paddingBottom: pxToDp(8),
        backgroundColor: "#CFDAE9",
        borderRadius: pxToDp(40),

        ...size_tool(480, 128),
    },
    btnInner3: {
        flex: 1,
        backgroundColor: "#E5E9EF",
        borderRadius: pxToDp(40),
        ...appStyle.flexTopLine,
        ...appStyle.flexCenter,
    },
    btnTxwWrap3: {
        ...size_tool(126, 48),
        ...borderRadius_tool(100),
        ...appStyle.flexCenter,
        backgroundColor: "#fff",
        marginLeft: pxToDp(40),
    },
    btnTxt3: {
        ...appFont.fontFamily_syst,
        fontSize: pxToDp(28),
        color: "#E5E9EF",
    },
    btnTxt4: {
        ...appFont.fontFamily_jcyt_700,
        color: "#fff",
        fontSize: pxToDp(48),
    },
    btnWrap5: {
        ...size_tool(304, 128),
        ...borderRadius_tool(40),
        paddingBottom: pxToDp(8),
        marginLeft: pxToDp(20),
    },
    btnInner5: {
        flex: 1,
        ...borderRadius_tool(40),
        ...appStyle.flexCenter,
        ...appStyle.flexTopLine,
    },
    btntxt5: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(48),
        color: "#fff",
        marginRight: pxToDp(40),
    },
    mainWrap: {
        flex: 1,
        borderRadius: pxToDp(40),
        position: "relative",

        ...padding_tool(0, 48, 48, 48),
    },
    aiItem: {
        width: pxToDp(101),
        height: pxToDp(80),
        position: "absolute",
        bottom: pxToDp(-4),
        right: pxToDp(6),
        zIndex: -1
    },
    abAiItem: {
        position: "absolute",
        top: pxToDp(80),
        left: pxToDp(222),
        zIndex: 12
    }
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        token: state.getIn(["userInfo", "token"]),
    };
};

const mapDispathToProps = (dispatch) => {
    // 存数据
    return {
        setUser(data) {
            dispatch(actionCreators.setUserInfoNow(data));
        },
    };
};
export default connect(mapStateToProps, mapDispathToProps)(homePage);
