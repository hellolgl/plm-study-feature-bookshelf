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

} from "react-native";
import {
    size_tool,
    pxToDp,
    fontFamilyRestoreMargin
} from "../../../../../util/tools";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
// import ViewControl from 'react-native-zoom-view'
import ViewControl from "react-native-image-pan-zoom";
import AnswerStatisticsModalNoNum from "../../../../../component/AnswerStatisticsModalNoNum";
import Sound from "react-native-sound";
import RichShowView from "../../../../../component/chinese/newRichShowView";
import _ from "lodash";
import url from "../../../../../util/url";
import ReadingHelpModal from '../../../../../component/chinese/ReadingHelpModal'
import HeaderCircleCard from "../../../../../component/HeaderCircleCard";
import { appFont } from "../../../../../theme";


const zimu = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
let isUpload = true;
let audio = undefined;
// let url = url.baseURL;
class ChineseSpeReadingExerciseDaily extends PureComponent {
    constructor(props) {
        super(props);
        this.audioHelp = undefined;
        this.state = {
            canvasWidth: 0,
            canvasHeight: 0,
            topaicNum: 0,
            //题目列表，后期可能改动
            fromServeCharacterList: [],
            topaicIndex: 0,
            topicMap: new Map(),
            status: false,
            gifUrl: "",
            visible: false,
            diagnose_notes: "", // 诊断标记
            canvasData: "",
            isKeyExercise: 1,
            lookDetailNum: 0,
            answer_end_time: "",
            checkedIndex: -1,
            //题目统计结果
            blank: 0,
            correct: 0,
            wrong: 0,
            answerStatisticsModalVisible: false,
            isEnd: false,
            knowledgepoint_explanation: "", //知识讲解
            isImageHelp: false,
            optionList: [],
            isLookHelp: false,
            explanation_audio: "",
            playStatus: false,
            playStatus1: false,
            articleList: {},//文章列表
            start_time: new Date().getTime(),
            isOld: true
            // renderOptionList: true
        };
        this.isHelpClick = false; //诊断标记点击关闭还是帮助
        this.handlenNxtTopaicThrottled = _.throttle(this.nextTopaic, 1 * 1000);
        this.handlenOnCloseThrottled = _.throttle(this.onClose, 3 * 1000);
        // this.handlePlayAudioThrottled = _.throttle(this.playAudio, 3 * 1000);

    }

    static navigationOptions = {
        // title:'答题'
    };
    renderOptionList = true;

    goBack = () => {
        this.closeAudio();
        NavigationUtil.goBack(this.props);
    };

    getTime = () => {
        let date = new Date();
        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 1).toString();
        var day = date.getDate().toString();
        var hour = date.getHours().toString();
        var minute = date.getMinutes().toString();
        var seconds = date.getSeconds().toString();
        return (
            year +
            "-" +
            month +
            "-" +
            day +
            "" +
            " " +
            hour +
            ":" +
            minute +
            ":" +
            seconds
        );
    };

    //获取整套题作答结果
    getAnswerResult = () => {
        const { start_time, topaicIndex, fromServeCharacterList } = this.state;
        let endTime = new Date().getTime();
        let spend_time = parseInt((endTime - start_time) / 1000);
        let obj = {
            // student_id: this.info.id,
            spend_time,
            r_times_id: fromServeCharacterList[topaicIndex].r_times_id,
        };
        axios.put(api.studentReadStem, obj).then((res) => {
            console.log("一套题保存成功");

            this.setState({
                isEnd: true,
                answerStatisticsModalVisible: true
            })
        });

    };
    closeAnswerStatisticsModal = () => {
        // console.log('MathCanvas closeDialog')
        this.setState({ answerStatisticsModalVisible: false });
        NavigationUtil.goBack(this.props);
    };

    // 播放读音
    playAudio = (path, type) => {
        const { playStatus } = this.state;
        //console.log("播放语音地址", url + path);
        // let _path =
        //   url + "chinese/03/00/exercise/audio/f0360c89e1bf4feca57b0ee67891df7b.mp3";
        if (audio) {
            audio.stop(() => {
                audio.play();
            });
            audio = undefined;
        }
        audio = new Sound(url.baseURL + path, null, (error) => {
            if (error) {
                console.log("播放失败", error);
            } else {
                audio.play((success) => {
                    if (success) {
                        audio.release();
                    }
                });
                if (type === 'playStatus') {
                    this.setState(() => ({
                        playStatus: true,
                    }));
                } else {
                    this.setState(() => ({
                        playStatus1: true,
                    }));
                }

            }
        });
    };

    //关闭语音播放
    closeAudio = () => {
        if (audio) {
            //console.log("关闭语音");
            audio.stop();
            audio = undefined;
            this.setState(() => ({
                playStatus: false,
                playStatus1: false
            }));
        }
    };

    componentDidMount() {
        const { userInfo } = this.props;
        console.log('this.props.navigation.state.params', this.props.navigation.state.params)
        const userInfoJs = userInfo.toJS();
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam
        axios.get(`${api.getChineseReadingDailyExercise}?grade_code=${userInfoJs.checkGrade}&term_code=${userInfoJs.checkTeam}`, { params: {} }).then((res) => {
            // let list = [...res.data.data.sentence, ...res.data.data.article];
            console.log("res", res)
            if (res && res.data.err_code === 0) {
                let list = res.data.data
                this.setState(() => ({
                    fromServeCharacterList: [...list],
                    topaicNum: list.length,
                }));
            }

        });
    }

    topaicContainerOnLayout = (e) => {
        let { width, height } = e.nativeEvent.layout;
        this.setState(() => ({
            canvasWidth: width,
            canvasHeight: height,
        }));
    };

    renderTopaicCard = (topaicNum) => {
        let cardList = new Array();
        const { topaicIndex, fromServeCharacterList } = this.state;
        for (let i = 0; i < fromServeCharacterList.length; i++) {
            if (i <= topaicIndex) {
                cardList.push(
                    <HeaderCircleCard
                        status={fromServeCharacterList[i].colorFlag + ''}
                        key={i}
                    ></HeaderCircleCard>
                );
            }

        }
        return cardList;
    };
    //获取看拼音写汉字题型的拼音
    getPyDataFromServe = () => {
        const stateList = [...this.state.fromServeCharacterList];
        const selectMap = new Map();
        for (let i = 0; i < stateList.length; i++) {
            selectMap.set(i, { ...stateList[i] });
        }
        return selectMap;
    };

    checkAnswer = (index) => {
        this.setState({
            checkedIndex: index,
        });
    };

    saveExerciseDetail = (yesOrNo, answer) => {
        // 保存做题结果
        const { fromServeCharacterList, topaicIndex, start_time,
            isOld
        } = this.state;
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        let endTime = new Date().getTime();
        let answer_times = parseInt((endTime - start_time) / 1000);
        // console.log("jieguo", this.state)
        let score = 0
        if ((answer_times < fromServeCharacterList[topaicIndex].exercise_time || answer_times === fromServeCharacterList[topaicIndex].exercise_time) && yesOrNo === 0) {
            score = 3
        }
        if (answer_times > fromServeCharacterList[topaicIndex].exercise_time && yesOrNo === 0) {
            score = 2
        }
        if (yesOrNo === 2) {
            score = 1
        }
        if (isUpload) {
            isUpload = false;
            let obj = {
                grade_term: userInfoJs.checkGrade + userInfoJs.checkTeam,
                knowledge: fromServeCharacterList[topaicIndex].knowledge,
                exercise_id: fromServeCharacterList[topaicIndex].exercise_id,
                correct: yesOrNo + '', //批改对错，0 正确 2错误
                // push_tag: fromServeCharacterList[topaicIndex].push_tag,   //是否需要推送题目
                knowledge_type: fromServeCharacterList[topaicIndex].knowledge_type,
                exercise_level: fromServeCharacterList[topaicIndex].exercise_level,
                exercise_element: fromServeCharacterList[topaicIndex].exercise_element,
                push_num: fromServeCharacterList[topaicIndex].push_num,
                record_id: fromServeCharacterList[topaicIndex].record_id,
                a_id: fromServeCharacterList[topaicIndex].a_id,
                exercise_type: fromServeCharacterList[topaicIndex].exercise_type,
                answer_origin: fromServeCharacterList[topaicIndex].answer_origin,
                r_id: fromServeCharacterList[topaicIndex].r_id,
                r_times_id: fromServeCharacterList[topaicIndex].r_times_id,
                answer_times: score,
                ability: fromServeCharacterList[topaicIndex].ability,
                module: '3'
            }
            if (obj.answer_origin === '3' && isOld) {
                axios
                    .post(api.recordSingleRead, obj)
                    .then((res) => {
                        isUpload = true;
                        if (res.data.err_code === 0) {
                            this.setState({
                                isLookHelp: false,
                            });
                            if (yesOrNo === 2) {
                                // 有下一等级题目
                                console.log("send", obj)

                                let isOldonw = isOld
                                let listnow = [...fromServeCharacterList]
                                let topaicNumnow = this.state.topaicNum + 1
                                if (res.data.data.exercise_id) {

                                    let insertObj = res.data.data
                                    // insertObj.colorFlag = 0
                                    listnow.splice(topaicIndex + 1, 0, insertObj)
                                    isOldonw = true
                                } else {
                                    let insertObj = { ...fromServeCharacterList[topaicIndex] }
                                    insertObj.colorFlag = 3
                                    // insertObj.colorFlag = 0
                                    listnow.splice(topaicIndex + 1, 0, insertObj)
                                    isOldonw = false
                                }
                                this.setState({
                                    fromServeCharacterList: listnow,
                                    topaicNum: topaicNumnow,
                                }, () => {
                                    this.renderOptionList = true; //1

                                    this.setState({
                                        topaicIndex: topaicIndex + 1,
                                        status: false,
                                        checkedIndex: -1,
                                        optionList: [],
                                        isOld: isOldonw
                                    })
                                })
                            } else {
                                // 没有要素题
                                this.renderOptionList = true; //1

                                topaicIndex + 1 == this.state.fromServeCharacterList.length
                                    ? this.getAnswerResult()
                                    : this.setState({
                                        topaicIndex:
                                            topaicIndex + 1 ==
                                                this.state.fromServeCharacterList.length
                                                ? 0
                                                : topaicIndex + 1,
                                        status: false,
                                        checkedIndex: -1,
                                        optionList: [],
                                        isOld: true
                                        // isLookHelp: false
                                    });

                                //console.log("saveExercise");

                            }


                        }
                    })
            } else {
                isUpload = true;
                this.renderOptionList = true; //1
                topaicIndex + 1 == this.state.fromServeCharacterList.length
                    ? this.getAnswerResult()
                    : this.setState({
                        topaicIndex:
                            topaicIndex + 1 ==
                                this.state.fromServeCharacterList.length
                                ? 0
                                : topaicIndex + 1,
                        status: false,
                        checkedIndex: -1,
                        optionList: [],
                        isOld: true
                        // isLookHelp: false
                    });
            }

        }
    };
    renderWriteTopaic = (data) => {

        let arr = [];
        let choice = data.answer_origin === '3' ? data.choice_content : data.exercise_content
        if (this.renderOptionList && choice) {
            arr = choice ? choice.split("#") : [];
            let randomNumber = function () {
                // randomNumber(a,b) 返回的值大于 0 ，则 b 在 a 的前边；
                // randomNumber(a,b) 返回的值等于 0 ，则a 、b 位置保持不变；
                // randomNumber(a,b) 返回的值小于 0 ，则 a 在 b 的前边。
                return 0.5 - Math.random();
            };
            arr.sort(randomNumber);
            this.setState({
                optionList: arr,
            })
            this.renderOptionList = false
        } else {
            arr = this.state.optionList
        }

        if (!data.exercise_id) {
            return <Text style={[{ fontSize: pxToDp(26) }]}>数据加载中...</Text>;
        } else {
            return (
                // 不同题型组装题目
                <View style={{ flexDirection: 'row' }}>
                    <ScrollView style={{
                        flex: 1,
                        // height: pxToDp(200),
                        backgroundColor: "#ffffff"
                    }}>
                        <View style={{ marginTop: pxToDp(32), width: pxToDp(700), }}>
                            {arr.map((item, index) => {
                                // if (item.indexOf(".png") != -1 || item.indexOf(".jpg") != -1) {
                                if (data.content_picture === "1" || data.choice_type === '1') {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => this.checkAnswer(index)}
                                            key={index}
                                        >
                                            <View
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    flexWrap: "nowrap",
                                                    marginBottom: 20,
                                                    alignItems: "center",
                                                    marginRight: pxToDp(40)
                                                }}
                                            >
                                                <View
                                                    style={
                                                        this.state.checkedIndex === index
                                                            ? styles.checkedOption
                                                            : styles.checkOptions
                                                    }
                                                >
                                                    <Text
                                                        style={{
                                                            color:
                                                                this.state.checkedIndex === index
                                                                    ? "#FFFFFF"
                                                                    : "#666666",
                                                            fontSize: pxToDp(35),
                                                        }}
                                                    >
                                                        {zimu[index]}
                                                    </Text>
                                                </View>
                                                <ViewControl
                                                    cropWidth={pxToDp(250)}
                                                    cropHeight={pxToDp(250)}
                                                    imageWidth={pxToDp(250)}
                                                    imageHeight={pxToDp(250)}
                                                >
                                                    <Image
                                                        style={{
                                                            width: pxToDp(250),
                                                            height: pxToDp(250),
                                                            marginLeft: pxToDp(0),
                                                        }}
                                                        source={{
                                                            uri:
                                                                url.baseURL +
                                                                item,
                                                        }}
                                                        resizeMode={'contain'}
                                                    ></Image>
                                                </ViewControl>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                } else {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => this.checkAnswer(index)}
                                            key={index}
                                        >
                                            <View
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    flexWrap: "nowrap",
                                                    marginBottom: 20,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <View
                                                    style={
                                                        this.state.checkedIndex === index
                                                            ? styles.checkedOption
                                                            : styles.checkOptions
                                                    }
                                                >
                                                    <Text
                                                        style={{
                                                            color:
                                                                this.state.checkedIndex === index
                                                                    ? "#FFFFFF"
                                                                    : "#666666",
                                                            fontSize: pxToDp(35),
                                                        }}
                                                    >
                                                        {zimu[index]}
                                                    </Text>
                                                </View>
                                                <Text style={[{ marginRight: 10, fontSize: pxToDp(35) }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>
                                                    {item}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }
                            })}
                        </View>
                    </ScrollView>



                </View>
            );
        }
    };

    //获取canvas手写数据

    onClose = () => {
        const { optionList, topaicIndex } = this.state;
        if (!this.isHelpClick) {
            // 不是点击帮助关闭的modal，是直接关闭的
            this.isHelpClick = false;
            this.saveExerciseDetail(2, optionList[topaicIndex]);

        }
        this.setState({
            visible: false,
        });
        // let { isHelpClick } = this.state
    };
    nextTopaic = () => {
        // this.refs.canvas._nextTopaic();
        let { isLookHelp } = this.state;
        let index = this.state.checkedIndex;
        this.closeAudio();
        const { fromServeCharacterList, topaicIndex, optionList } = this.state;

        if (index === -1) {
            return;
        }
        if (
            !isLookHelp &&
            optionList[index] === fromServeCharacterList[topaicIndex].answer_content
        ) {
            // 正确，当前题目为推送的要素题时不论对错都保存

            this.saveExerciseDetail(0, optionList[index]);
            if (this.state.isKeyExercise === 1) {
                fromServeCharacterList[topaicIndex].colorFlag = 0;
            }
        } else {
            if (this.state.isKeyExercise === 1) {
                fromServeCharacterList[topaicIndex].colorFlag = 2;
            }

            let arr = fromServeCharacterList[topaicIndex].answer_origin === '3' ?
                [...fromServeCharacterList[topaicIndex].choice_content.split('#')]
                :
                [
                    ...fromServeCharacterList[topaicIndex].exercise_content.split("#"),
                ];
            let str = ""; // 讲解
            for (let i in arr) {
                if (optionList[index] === arr[i]) {
                    str = fromServeCharacterList[topaicIndex].diagnose_notes.split("#")[
                        i
                    ];
                }
            }
            //console.log("ishelpe", isLookHelp);
            isLookHelp ? (str = "请继续努力！") : "";
            let explanation = fromServeCharacterList[topaicIndex].answer_origin === '3' ? fromServeCharacterList[topaicIndex].explanation : fromServeCharacterList[topaicIndex].knowledgepoint_explanation

            this.setState({
                visible: true,
                diagnose_notes: str,
                knowledgepoint_explanation: explanation,
                explanation_audio:
                    fromServeCharacterList[topaicIndex] &&
                        fromServeCharacterList[topaicIndex].explanation_audio
                        ? fromServeCharacterList[topaicIndex].explanation_audio
                        : "",
            });
        }
    };


    helpMe = (isHelp) => {
        // 点击查看帮助
        let {
            status,
            lookDetailNum,
            fromServeCharacterList,
            topaicIndex,
            isImageHelp,
            isLookHelp,
        } = this.state;
        this.closeAudio();
        let flag = false;
        // 点击查看帮助的两种途径
        if (isHelp) {
            // 从页面点击过来，不用做任何别的操作
            isImageHelp = true;
            isLookHelp = true;
        } else {
            // 从诊断标记点击过来，需要改变参数
            isImageHelp = false;
            this.isHelpClick = true;
        }
        ++lookDetailNum;
        // console.log("hele", fromServeCharacterList[topaicIndex])
        // this.onClose(1)
        let explanation = fromServeCharacterList[topaicIndex].answer_origin === '3' ? fromServeCharacterList[topaicIndex].explanation : fromServeCharacterList[topaicIndex].knowledgepoint_explanation
        this.setState({
            knowledgepoint_explanation: explanation,
            status: true,
            lookDetailNum,
            isImageHelp,
            isLookHelp,
            visible: false,
            explanation_audio:
                fromServeCharacterList[topaicIndex] &&
                    fromServeCharacterList[topaicIndex].explanation_audio
                    ? fromServeCharacterList[topaicIndex].explanation_audio
                    : "",
        });
    };

    renderButton = () => {
        const { isEnd } = this.state;
        return (
            <TouchableOpacity
                style={styles.topaicBtn}
                ref="topaicBox"
                onLayout={(event) => this.topaicContainerOnLayout(event)}
                onPress={this.handlenNxtTopaicThrottled}
            >
                <View
                    style={{
                        width: pxToDp(160),
                        height: pxToDp(60),
                        borderRadius: pxToDp(100),
                        backgroundColor: "#A86A33",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={[{ color: "#ffffff", fontSize: pxToDp(28) }, appFont.fontFamily_syst]}>下一题</Text>
                </View>
            </TouchableOpacity>
        );
        // }
    };
    // 关闭帮助播放

    renderCommonMCQ = (data) => {
        let baseUrl = url.baseURL + data.private_stem_picture
        const { fromServeCharacterList, topaicIndex, articleList } = this.state;
        let article = data
        return (
            <View style={styles.topaicText}>
                <View style={[{ padding: pxToDp(24), backgroundColor: '#FFFFFFFF', borderRadius: 15, height: '100%', flex: 1, }]}>
                    <ScrollView >
                        <View style={{ paddingRight: pxToDp(40) }}>
                            {data.public_stem_audio ? (

                                this.state.playStatus1 ?
                                    <TouchableOpacity
                                        style={{ marginTop: pxToDp(2) }}
                                        onPress={() => {
                                            this.closeAudio();
                                        }}
                                    >
                                        <Image
                                            style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                                            source={require("../../../../../images/playing_icon.png")}
                                        ></Image>
                                    </TouchableOpacity> :
                                    <TouchableOpacity
                                        style={{ marginTop: pxToDp(2) }}
                                        onPress={() => {
                                            this.playAudio(data.public_stem_audio, 'playStatus1');
                                        }}
                                    >
                                        <Image
                                            style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                                            source={require("../../../../../images/play_icon.png")}
                                        ></Image>
                                    </TouchableOpacity>

                            ) : null}
                            <RichShowView
                                width={pxToDp(1080)}
                                value={
                                    data.public_exercise_stem
                                }
                            ></RichShowView>
                            {fromServeCharacterList[topaicIndex] && fromServeCharacterList[topaicIndex].public_stem_picture ?
                                <View style={{ borderRadius: 15, width: 300, height: 225, backgroundColor: '#FFFFFF', marginRight: pxToDp(12) }}>
                                    <Image style={{ width: 300, height: 225, resizeMode: 'contain', borderRadius: 15, }} source={{ uri: url.baseURL + fromServeCharacterList[topaicIndex].public_stem_picture }}></Image>
                                </View> : null}
                        </View>
                        {data.private_stem_audio ? (
                            <TouchableOpacity
                                style={{ marginTop: pxToDp(2) }}
                                onPress={() => {
                                    this.playAudio(data.private_stem_audio, 'playStatus');
                                }}
                            >
                                {this.state.playStatus ?
                                    <Image
                                        style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                                        source={require("../../../../../images/playing_icon.png")}
                                    ></Image> :
                                    <Image
                                        style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                                        source={require("../../../../../images/play_icon.png")}
                                    ></Image>
                                }
                            </TouchableOpacity>
                        ) : null}
                        {fromServeCharacterList[topaicIndex] && fromServeCharacterList[topaicIndex].public_exercise_stem != ''
                            ?
                            <View style={{ height: pxToDp(48), width: pxToDp(48) }}></View> : null}
                        <RichShowView
                            width={pxToDp(750)}
                            value={
                                data.private_exercise_stem
                            }
                        ></RichShowView>
                        {data.private_stem_picture ?
                            <View style={{ borderRadius: 15, width: 300, height: 250, backgroundColor: '#FFFFFF', marginRight: pxToDp(12) }}>
                                <Image style={{ width: 300, height: 250, resizeMode: 'contain', borderRadius: 15, }} source={{ uri: baseUrl }}></Image>

                            </View>
                            : null}
                        {data.exercise_content ?
                            this.renderWriteTopaic(data)
                            : <View></View>}
                    </ScrollView>
                    <View style={{ alignItems: 'flex-end', paddingRight: pxToDp(40) }}>
                        {this.renderButton()}

                    </View>

                </View>
            </View>
        )
    }
    renderCommonReading = (data) => {
        let baseUrl = url.baseURL + data.stem_image
        const { fromServeCharacterList, topaicIndex, articleList } = this.state;
        let article = data
        return (
            <View style={styles.topaicText}>
                <View style={[{ flexDirection: 'row', padding: pxToDp(24), backgroundColor: '#FFFFFFFF', borderRadius: 15, height: '100%', flex: 1, }]}>

                    <View style={{}}>
                        <ScrollView >
                            {
                                data.exercise_type === 's' ?
                                    <View style={{ paddingRight: pxToDp(40) }}>
                                        {data.public_stem_audio ? (

                                            this.state.playStatus1 ?
                                                <TouchableOpacity
                                                    style={{ marginTop: pxToDp(2) }}
                                                    onPress={() => {
                                                        this.closeAudio();
                                                    }}
                                                >
                                                    <Image
                                                        style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                                                        source={require("../../../../../images/playing_icon.png")}
                                                    ></Image>
                                                </TouchableOpacity> :
                                                <TouchableOpacity
                                                    style={{ marginTop: pxToDp(2) }}
                                                    onPress={() => {
                                                        this.playAudio(data.public_stem_audio, 'playStatus1');
                                                    }}
                                                >
                                                    <Image
                                                        style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                                                        source={require("../../../../../images/play_icon.png")}
                                                    ></Image>
                                                </TouchableOpacity>

                                        ) : null}
                                        <RichShowView
                                            width={pxToDp(1080)}
                                            value={
                                                data.public_exercise_stem
                                            }
                                        ></RichShowView>
                                        {fromServeCharacterList[topaicIndex] && fromServeCharacterList[topaicIndex].public_stem_picture ?
                                            <View style={{ borderRadius: 15, width: 300, height: 225, backgroundColor: '#FFFFFF', marginRight: pxToDp(12) }}>
                                                <Image style={{ width: 300, height: 225, resizeMode: 'contain', borderRadius: 15, }} source={{ uri: url.baseURL + fromServeCharacterList[topaicIndex].public_stem_picture }}></Image>
                                            </View> : null}
                                    </View>
                                    :
                                    // 专项阅读理解
                                    <View style={{ paddingRight: pxToDp(40) }}>
                                        {article.audio ? (

                                            this.state.playStatus1 ?
                                                <TouchableOpacity
                                                    style={{ marginTop: pxToDp(2) }}
                                                    onPress={() => {
                                                        this.closeAudio();
                                                    }}
                                                >
                                                    <Image
                                                        style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                                                        source={require("../../../../../images/playing_icon.png")}
                                                    ></Image>
                                                </TouchableOpacity> :
                                                <TouchableOpacity
                                                    style={{ marginTop: pxToDp(2) }}
                                                    onPress={() => {
                                                        this.playAudio(article.audio, 'playStatus1');
                                                    }}
                                                >
                                                    <Image
                                                        style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                                                        source={require("../../../../../images/play_icon.png")}
                                                    ></Image>
                                                </TouchableOpacity>

                                        ) : null}
                                        <Text style={[{ fontSize: pxToDp(40), textAlign: 'center' }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>{article.name}</Text>
                                        <Text style={[{
                                            // lineHeight: pxToDp(48),
                                            fontSize: pxToDp(28),
                                            textAlign: 'center'
                                        }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}
                                        >作者：{article.author}</Text>
                                        <RichShowView
                                            width={pxToDp(1080)}
                                            value={
                                                article.content
                                            }
                                        ></RichShowView>
                                        {article && article.image ?
                                            <View style={{ borderRadius: 15, height: 225, backgroundColor: '#FFFFFF', marginRight: pxToDp(12), alignItems: 'center' }}>
                                                <Image style={{ width: 300, height: 225, resizeMode: 'contain', borderRadius: 15, }} source={{ uri: url.baseURL + article.image }}></Image>
                                            </View> : null}
                                    </View>
                            }

                        </ScrollView>

                    </View>

                </View>




                <View style={{ flexDirection: 'row', marginLeft: pxToDp(40), height: '100%', width: pxToDp(800) }}>
                    <View style={{ backgroundColor: '#FFFFFFFF', width: '100%', borderRadius: 15, paddingLeft: pxToDp(24), paddingTop: pxToDp(24), paddingBottom: pxToDp(24) }}>
                        <ScrollView>
                            {data.stem_audio ? (
                                <TouchableOpacity
                                    style={{ marginTop: pxToDp(2) }}
                                    onPress={() => {
                                        this.playAudio(data.stem_audio, 'playStatus');
                                    }}
                                >
                                    {this.state.playStatus ?
                                        <Image
                                            style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                                            source={require("../../../../../images/playing_icon.png")}
                                        ></Image> :
                                        <Image
                                            style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                                            source={require("../../../../../images/play_icon.png")}
                                        ></Image>
                                    }
                                </TouchableOpacity>
                            ) : null}
                            <RichShowView
                                width={pxToDp(750)}
                                value={
                                    data.stem
                                }
                            ></RichShowView>
                            {data.stem_image ?
                                <View style={{ borderRadius: 15, width: 300, height: 250, backgroundColor: '#FFFFFF', marginRight: pxToDp(12) }}>
                                    <Image style={{ width: 300, height: 250, resizeMode: 'contain', borderRadius: 15, }} source={{ uri: baseUrl }}></Image>

                                </View>
                                : null}
                            {data.choice_content ?
                                this.renderWriteTopaic(data)
                                : <View></View>}
                        </ScrollView>
                        <View style={{ alignItems: 'flex-end', paddingRight: pxToDp(40) }}>
                            {this.renderButton()}

                        </View>

                    </View>
                </View>


            </View>
        )
    }
    renderCommon = (data) => {
        return data.answer_origin === '3' ? this.renderCommonReading(data) : this.renderCommonMCQ(data)
    }
    render() {
        const {
            topaicNum,
            status,
            fromServeCharacterList,
            topaicIndex,
            explanation_audio,
        } = this.state;
        // console.log(fromServeCharacterList, 'topaicNum')
        const footerButtons = [
            { text: "关闭", onPress: this.handlenOnCloseThrottled },
            { text: "帮助", onPress: this.helpMe },
        ];

        return (
            <View style={{ flex: 1 }}>
                <View style={{
                    width: '100%',
                    height: pxToDp(124)
                }}>
                    {/* 头部 */}
                    <ImageBackground source={require('../../../../../images/chineseDailySpeReadingBg2.png')} style={[

                        {
                            width: '100%',
                            height: pxToDp(124),
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingLeft: pxToDp(40)
                        },
                    ]}>
                        <TouchableOpacity
                            onPress={() => this.goBack()}
                        >
                            <Image source={require("../../../../../images/chineseDailySpeReadingBtn2.png")}
                                style={[size_tool(64),]} />
                        </TouchableOpacity>

                        <Text style={{ color: "#fff", fontSize: pxToDp(60), fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'jiangxizhuokai' : 'Jiangxizhuokai' }} >阅读理解-每日一练</Text>
                        <Text></Text>
                    </ImageBackground>
                </View>

                <View style={styles.container}>
                    <ImageBackground source={require('../../../../../images/chineseDailySpeReadingBg1.png')} style={[
                        {
                            // width: '100%',
                            flex: 1,
                            height: pxToDp(975),
                            alignItems: 'center',
                            padding: pxToDp(40),

                        },
                    ]}>

                        <View style={styles.topaicCard}>
                            {this.renderTopaicCard(topaicNum)}
                        </View>
                        <View
                            style={styles.topaic}
                            ref="topaicBox"
                            onLayout={(event) => this.topaicContainerOnLayout(event)}
                        >
                            {/* <View style={styles.topaicText}> */}
                            {fromServeCharacterList[topaicIndex] && fromServeCharacterList[topaicIndex].exercise_id ? this.renderCommon(fromServeCharacterList[topaicIndex]) : null}

                            {/* </View> */}
                        </View>
                    </ImageBackground>

                </View>

                {/* <Modal
                    animationType="fade"
                    title="讲解"
                    transparent
                    // onClose={() => this.handlenOnCloseThrottled()}
                    // onClose={() => this.helpMe()}
                    maskClosable={false}
                    visible={this.state.visible}
                    // closable
                    footer={footerButtons}
                    style={{ width: 600 }}
                >
                    <View style={{ paddingVertical: 20 }}>
                        <Text style={{ fontSize: pxToDp(32) }}>
                            {this.state.diagnose_notes}
                        </Text>
                    </View>
                </Modal> */}
                <ReadingHelpModal
                    status={this.state.visible}
                    goback={this.handlenOnCloseThrottled}
                    audio={explanation_audio}
                    knowledgepoint_explanation={this.state.knowledgepoint_explanation}
                    diagnose_notes={this.state.diagnose_notes}
                />
                <AnswerStatisticsModalNoNum
                    closeDialog={this.closeAnswerStatisticsModal}
                    dialogVisible={this.state.answerStatisticsModalVisible}
                    msg={'恭喜你完成今日的“每日一练”！'}
                ></AnswerStatisticsModalNoNum>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainWrap: {
        // backgroundColor:
        //     "linear - gradient(90deg, rgba(55, 55, 54, 1) 0 %, rgba(76, 76, 76, 1) 100 %)",
        // height: "100%",
        // width: "100%",
        // padding: 24,
        // paddingBottom: 24,
        flex: 1
    },
    container: {
        flex: 1,
        // flexDirection: "row",
        justifyContent: 'space-between',

    },
    topaic: {
        flex: 1,
        width: '100%'
    },
    topaicBtn: {
        backgroundColor: "#FFFFFFFF",
        width: pxToDp(90),
        alignItems: "flex-end",
        // height: 80,
        // margin: 20,
    },
    topaicText: {
        flex: 1,
        // paddingBottom: pxToDp(40),
        flexDirection: "row",
        justifyContent: 'space-between'
        // backgroundColor: "#ffffff"
    },
    topaicCard: {
        width: '100%',
        height: pxToDp(40),
        // borderRadius: pxToDp(32),
        // backgroundColor: "#FFFFFFFF",
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'center',
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        marginBottom: pxToDp(20)
    },

    topaicWrite: {
        position: "absolute",
    },
    buttonGroup: {
        flexDirection: "row",
        // flex: 1
    },
    checkOptions: {
        width: pxToDp(56),
        height: pxToDp(56),
        borderRadius: pxToDp(26),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#D4D4D4",
        marginRight: pxToDp(22),
        fontSize: pxToDp(32),
    },
    checkedOption: {
        width: pxToDp(56),
        height: pxToDp(56),
        borderRadius: pxToDp(26),
        backgroundColor: "#FA603B",
        alignItems: "center",
        justifyContent: "center",
        marginRight: pxToDp(22),
        fontSize: pxToDp(32),
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

export default connect(mapStateToProps, mapDispathToProps)(ChineseSpeReadingExerciseDaily);
