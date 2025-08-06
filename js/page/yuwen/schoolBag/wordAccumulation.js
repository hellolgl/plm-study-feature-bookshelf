import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Animated,
    Platform,
    ImageBackground,
    DeviceEventEmitter,
} from "react-native";
import CircleCard from "../../../component/CircleCard";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import NavigationUtil from "../../../navigator/NavigationUtil";
import RenderHtml from "react-native-render-html";
import {
    margin_tool,
    size_tool,
    pxToDp,
    borderRadius_tool,
    padding_tool,
    fontFamilyRestoreMargin,
} from "../../../util/tools";
import { appStyle, appFont } from "../../../theme";
import { Toast, Modal } from "antd-mobile-rn";
import WordCard from "../../../component/WordCard";
import Sound from "react-native-sound";
import ViewControl from "react-native-image-pan-zoom";
import CharacterHelpModal from "../../../component/chinese/CharacterHelpModalNew";
import WordHelpModal from "../../../component/chinese/WordHelpModalNew";
// import AnswerStatisticsModal from "../../../component/AnswerStatisticsModal";
import AnswerStatisticsModal from "../../../component/chinese/sentence/staticsModal";

import url from "../../../util/url";
import Header from "../../../component/Header";
import Audio from "../../../util/audio/audio";
import { connect } from "react-redux";
import * as userAction from "../../../action/userInfo";
import RichShowView from "../../../component/chinese/newRichShowView";
import PlayAudio from "../../../util/audio/playAudio";
import Good from "../../../component/chinese/reading/good";
import { getRewardCoinLastTopic } from '../../../util/coinTools'

const zimu = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
let baseUrl = url.baseURL;
class wordAccumulation extends PureComponent {
    constructor(props) {
        super(props);
        this.audio = undefined;
        this.dropAnswer = "";
        this.lastTime = "";
        this.yesNumber = 0;
        this.noNumber = 0;
        this.audioArr = [];
        this.answer_start_time = "";
        this.const_answer_start_time = "";
        this.eventListener = undefined
        this.state = {
            canvasWidth: 0,
            canvasHeight: 0,
            topaicNum: 0,
            //题目列表，后期可能改动
            fromServeCharacterList: [],
            topaicIndex: 0,
            diagnose_notes: "", // 诊断标记
            canvasData: "",
            isKeyExercise: 0, //1表示是要素题，0表示不是要素题
            answer_end_time: "",
            checkedIndex: -1,
            allList: "",
            exerciseIndex: 0, //当前字的
            detailsObj: {},
            translate: new Animated.Value(0),
            exerciseYsArr: [], //每个字每个题做错后需要推送的要素题
            dropAnswer: "", //拖拽题答案
            dropLine: [
                {
                    width: 60,
                    height: 60,
                    marginRight: 12,
                    borderBottomWidth: 2,
                },
            ],
            orderImgArr: [], //笔画图片数组
            exercise_set_id: "",
            explainStatus: false,
            // diagnose_notes: "", //诊断标记
            characterHelpStatus: false,
            wordHelpStatus: false,
            answerStatisticsModalVisible: false,
            fatherHeight: 0,
            isStartAudio: false,
            pausedPrivate: true,
            goodVisible: false,
        };
        this.audio1 = React.createRef();
    }
    goBack = () => {
        NavigationUtil.goBack(this.props);
    };
    // 设置题列表,加字词标，排序
    setList = (obj) => {
        // this.addKey(obj);
        let exerciseArr = [];
        let exerciseYsArr = [];
        let character_exercise_obj = {};
        let word_exercise_obj = {};
        character_exercise_obj.listen = obj.character_exercise.listen;
        character_exercise_obj.pinyin = obj.character_exercise.pinyin;
        character_exercise_obj.order = obj.character_exercise.order;
        character_exercise_obj.structure = obj.character_exercise.structure;
        character_exercise_obj.meaning = obj.character_exercise.meaning;
        for (let i in character_exercise_obj) {
            if (character_exercise_obj[i]) {
                exerciseArr.push(character_exercise_obj[i][0]);
                exerciseYsArr.push(character_exercise_obj[i][1]);
                character_exercise_obj[i].forEach((j) => {
                    j.knowledge_type = 1;
                    j.key = i;
                });
            }
        }
        if (obj.word_exercise) {
            word_exercise_obj.listen = obj.word_exercise.listen;
            word_exercise_obj.pinyin = obj.word_exercise.pinyin;
            word_exercise_obj.structure = obj.word_exercise.structure;
            word_exercise_obj.meaning = obj.word_exercise.meaning;
            for (let i in word_exercise_obj) {
                if (word_exercise_obj[i]) {
                    exerciseArr.push(word_exercise_obj[i][0]);
                    exerciseYsArr.push(word_exercise_obj[i][1]);
                    word_exercise_obj[i].forEach((j) => {
                        j.knowledge_type = 2;
                        j.key = i;
                    });
                }
            }
        }

        exerciseArr.forEach((i, index) => {
            i.colorFlag = 0;
        });
        this.setState(() => ({
            exerciseYsArr,
        }));
        return exerciseArr;
    };
    componentWillUnmount() {
        DeviceEventEmitter.emit("refreshPage"); //返回页面刷新
    }
    componentDidMount() {
        axios
            .get(api.characterExercise, {
                params: {
                    origin: this.props.navigation.state.params.data.origin,
                },
            })
            .then((res) => {
                let allList = JSON.parse(JSON.stringify(res.data.data.exercise));
                let exercise_set_id = res.data.data.exercise_set_id;
                let exerciseArr = "";
                if (allList.length > 0) {
                    exerciseArr = this.setList(allList[0]);
                    // 如果一开始第一题就是拖拽题就需要下面的操作
                    // if (exerciseArr[0].key === "order") {
                    //   this.isOrder(exerciseArr[0]);
                    // }
                }
                // let exerciseArr = this.setList(allList[4]);
                this.setState(() => ({
                    fromServeCharacterList: JSON.parse(JSON.stringify(exerciseArr)),
                    topaicNum: exerciseArr.length,
                    allList,
                    exercise_set_id,
                }));
                this.answer_start_time = new Date().getTime();
                this.const_answer_start_time = new Date().getTime();
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
        const { fromServeCharacterList, allList, exerciseIndex } = this.state;
        for (let i = 0; i < fromServeCharacterList.length; i++) {
            let status = fromServeCharacterList[i].colorFlag;
            cardList.push(
                <View
                    key={i}
                    style={[
                        styles.itemWrap,
                        status === 2
                            ? styles.wrongItem
                            : status === 1
                                ? styles.rightItem
                                : styles.normalItem,
                    ]}
                >
                    <Text
                        style={[
                            styles.itemTxt,
                            status === 0 ? styles.normalTxt : styles.speTxt,
                        ]}
                    >
                        {allList[exerciseIndex] ? allList[exerciseIndex].character : ""}
                    </Text>
                </View>
            );
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

    checkAnswer = (item, index) => {
        this.setState({
            checkedIndex: index,
        });
    };
    saveExerciseDetail = (result, answer) => {
        // 保存做题结果
        const {
            fromServeCharacterList,
            topaicIndex,
            exercise_set_id,
            allList,
            exerciseIndex,
        } = this.state;

        let time = parseInt(
            Math.ceil((new Date().getTime() - this.answer_start_time) / 1000)
        );
        console.log(
            "fromServeCharacterList[topaicIndex]",
            fromServeCharacterList[topaicIndex]
        );
        let topic = fromServeCharacterList[topaicIndex];
        let obj = {
            origin: this.props.navigation.state.params.data.origin,
            knowledge:
                topic.knowledge_type === 1
                    ? allList[exerciseIndex].character
                    : allList[exerciseIndex].word,
            knowledge_id:
                topic.knowledge_type === 1
                    ? allList[exerciseIndex].character_id
                    : allList[exerciseIndex].word_id,
            result,
            answer,
            answer_time: time,
            exercise_id: topic.exercise_id,
            exercise_type: topic.key,
            s_c_times_id: exercise_set_id,
            alias: "chinese_toChooseText",
        };
        // if (topic.key === 'order') {
        //   obj.answer = ''
        // }
        console.log("单题保存", obj);
        axios.put(api.saveCharacterExercise, obj).then((res) => {
            if (result === 1) {
                // 答对
                if (topaicIndex + 1 === fromServeCharacterList.length && !allList[exerciseIndex + 1]) {
                    getRewardCoinLastTopic().then(res => {
                        if (res.isReward) {
                            // 展示奖励弹框,在动画完后在弹统计框
                            this.eventListener = DeviceEventEmitter.addListener(
                                "rewardCoinClose",
                                () => {
                                    this.nextTopic();
                                    this.eventListener && this.eventListener.remove()
                                }
                            );
                        } else {
                            this.nextTopic();
                        }
                    })
                } else {
                    this.props.getRewardCoin()
                    this.nextTopic();
                }
            }
        });
        this.answer_start_time = new Date().getTime();
    };

    renderWriteTopaic = () => {
        const map = this.getPyDataFromServe();
        const {
            topaicIndex,
            dropLine,
            orderImgArr,
            allList,
            isStartAudio,
            pausedPrivate,
        } = this.state;
        const data = { ...map.get(topaicIndex) };
        // data.audio =
        //   baseUrl +
        //   "chinese/03/00/exercise/audio/f0360c89e1bf4feca57b0ee67891df7b.mp3";
        if (allList) {
            // return (
            // 不同题型组装题目
            return allList.length === 0 ? (
                <Text style={{ fontSize: pxToDp(40) }}>本课文无“字词积累”题目</Text>
            ) : (
                <View style={[{ flex: 1 }]}>
                    <View style={[{}]}>
                        <ScrollView>
                            <View style={[appStyle.flexTopLine]}>
                                {data.private_stem_audio ? (
                                    <Audio
                                        audioUri={`${url.baseURL}${data.private_stem_audio}`}
                                        pausedBtnImg={require("../../../images/chineseHomepage/composition/audioPlay.png")}
                                        pausedBtnStyle={{ width: pxToDp(360), height: pxToDp(140) }}
                                        playBtnImg={require("../../../images/chineseHomepage/composition/audiostop.png")}
                                        playBtnStyle={{ width: pxToDp(360), height: pxToDp(140) }}
                                    />
                                ) : null}

                                {data.stem_audio ? (
                                    <Audio
                                        audioUri={`${url.baseURL}${data.stem_audio}`}
                                        pausedBtnImg={require("../../../images/audio/audioPlay.png")}
                                        pausedBtnStyle={{
                                            width: pxToDp(198),
                                            height: pxToDp(95),
                                        }}
                                        playBtnImg={require("../../../images/audio/audioPause.png")}
                                        playBtnStyle={{ width: pxToDp(198), height: pxToDp(95) }}
                                        // rate={0.75}
                                        onRef={(ref) => {
                                            this.audioRef = ref;
                                        }}
                                    >
                                        <RichShowView
                                            width={pxToDp(1300)}
                                            value={
                                                data.private_exercise_stem
                                                    ? data.private_exercise_stem
                                                    : ""
                                            }
                                            size={6}
                                        />
                                    </Audio>
                                ) : (
                                    <RichShowView
                                        width={pxToDp(1300)}
                                        value={
                                            data.private_exercise_stem
                                                ? data.private_exercise_stem
                                                : ""
                                        }
                                        size={6}
                                    />
                                )}
                            </View>
                            {data.public_stem_picture ? (
                                <Image
                                    style={{
                                        width: pxToDp(600),
                                        height: pxToDp(300),
                                        marginLeft: pxToDp(40),
                                    }}
                                    source={{ uri: url.baseURL + data.public_stem_picture }}
                                ></Image>
                            ) : null}
                            {data.picture ? (
                                <Image
                                    resizeMode={"contain"}
                                    style={[
                                        {
                                            width: pxToDp(300),
                                            height: pxToDp(220),
                                            marginBottom: pxToDp(40),
                                        },
                                    ]}
                                    source={{
                                        uri: url.baseURL + data.picture,
                                    }}
                                ></Image>
                            ) : null}
                        </ScrollView>
                    </View>
                    <View
                        style={{
                            paddingTop: pxToDp(20),
                            flex: 1,
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        {data.exercise_content && !data.strokes_image
                            ? data.exercise_content.split("#").map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => this.checkAnswer(item, index)}
                                        key={index}
                                        style={[
                                            {
                                                minWidth: pxToDp(860),
                                                minHeight: pxToDp(140),
                                                backgroundColor:
                                                    this.state.checkedIndex === index
                                                        ? "#FFAE2F"
                                                        : "#E7E7F2",
                                                marginBottom: pxToDp(40),
                                                paddingBottom: pxToDp(10),
                                                borderRadius: pxToDp(40),
                                            },
                                        ]}
                                    >
                                        <View
                                            style={[
                                                appStyle.flexCenter,
                                                {
                                                    felx: 1,
                                                    minHeight: pxToDp(136),
                                                    backgroundColor:
                                                        this.state.checkedIndex === index
                                                            ? "#FFD983"
                                                            : "#F5F5FA",
                                                    borderRadius: pxToDp(40),
                                                    padding: pxToDp(20),
                                                },
                                            ]}
                                        >
                                            {data?.content_picture === "1" ? (
                                                <Image
                                                    style={{
                                                        width: pxToDp(400),
                                                        height: pxToDp(200),
                                                        resizeMode: "contain",
                                                        borderRadius: pxToDp(40),
                                                    }}
                                                    source={{
                                                        uri:
                                                            "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
                                                            item,
                                                    }}
                                                />
                                            ) : (
                                                <Text
                                                    style={[
                                                        {
                                                            fontSize: pxToDp(40),
                                                            lineHeight: pxToDp(50),
                                                            color: "#475266",
                                                        },
                                                        appFont.fontFamily_syst,
                                                    ]}
                                                >
                                                    {item}
                                                </Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                            : null}
                    </View>
                </View>
            );
        } else {
            return <Text style={{ fontSize: pxToDp(26) }}>获取题目中...</Text>;
        }
    };
    closeAnswerStatisticsModal = () => {
        NavigationUtil.goBack(this.props);
        this.setState({
            answerStatisticsModalVisible: false,
        });
    };
    nextTopic = () => {
        const { fromServeCharacterList, topaicIndex, allList, exerciseIndex } = this.state;
        if (topaicIndex + 1 === fromServeCharacterList.length) {
            // 当前字的题目做完后跳下一个字的题
            if (allList[exerciseIndex + 1]) {
                // 有才跳
                let exerciseArr = this.setList(allList[exerciseIndex + 1]);
                // if (exerciseArr[0].key === "order") {
                //   this.isOrder(exerciseArr[0]);
                // }
                this.setState({
                    topaicIndex: 0,
                    exerciseIndex: exerciseIndex + 1,
                    fromServeCharacterList: exerciseArr,
                    topaicNum: exerciseArr.length,
                });
            } else {
                // 最后一题正确直接展示统计
                this.setState({
                    answerStatisticsModalVisible: true,
                });
            }
        } else {
            // 跳当前字的下一道题
            // if (fromServeCharacterList[topaicIndex + 1].key === "order") {
            //   this.isOrder(fromServeCharacterList[topaicIndex + 1]);
            // }
            this.setState({
                topaicIndex: topaicIndex + 1,
            });
        }
    };
    clickNextTopaic = () => {
        // this.refs.canvas._nextTopaic();
        let index = this.state.checkedIndex;
        const {
            fromServeCharacterList,
            topaicIndex,
            exerciseIndex,
            allList,
            isKeyExercise,
            exercise_set_id,
        } = this.state;
        if (!fromServeCharacterList[topaicIndex]) return;
        const { token } = this.props;
        // console.log("token----", token);
        if (!token) {
            NavigationUtil.resetToLogin(this.props);
            return;
        }

        if (
            fromServeCharacterList[topaicIndex].exercise_content.split("#")[index] ===
            fromServeCharacterList[topaicIndex].answer_content ||
            this.dropAnswer === fromServeCharacterList[topaicIndex].answer_content
        ) {
            if (isKeyExercise !== 1) {
                fromServeCharacterList[topaicIndex].answer = 1;
                fromServeCharacterList[topaicIndex].colorFlag = 1;
                this.saveExerciseDetail(
                    1,
                    fromServeCharacterList[topaicIndex].exercise_content.split("#")[index],
                );
                this.yesNumber++;
                PlayAudio.playSuccessSound(url.successAudiopath2);
                this.setState(
                    {
                        goodVisible: this.props.moduleCoin < 30 ? false : true,
                    },
                    () => {
                        setTimeout(() => {
                            this.setState({
                                goodVisible: false,
                            });
                        }, 1000);
                    }
                );
            } else {
                this.nextTopic();
                this.setState({
                    isKeyExercise: 0, //做对重置为不是要素题
                });
            }
        } else {
            // 做错了有诊断出诊断，没诊断直接出帮助
            PlayAudio.playSuccessSound(url.failAudiopath);
            if (index !== -1 || this.dropAnswer) {
                // 不是要素题
                if (isKeyExercise !== 1) {
                    fromServeCharacterList[topaicIndex].colorFlag = 2;
                    this.saveExerciseDetail(
                        0,
                        fromServeCharacterList[topaicIndex].exercise_content.split("#")[
                        index
                        ]);
                    this.noNumber++;
                }
                if (fromServeCharacterList[topaicIndex].diagnose_notes) {
                    this.helpMe();
                    this.setState({
                        // explainStatus: true,
                        diagnose_notes:
                            fromServeCharacterList[topaicIndex].diagnose_notes.split("#")[
                            index
                            ],
                    });
                } else {
                    fromServeCharacterList[topaicIndex].colorFlag = 2;
                    this.helpMe();
                }
            }
        }
        // 课文所有字词题做完保存
        if (
            exerciseIndex + 1 === allList.length &&
            topaicIndex + 1 === fromServeCharacterList.length &&
            isKeyExercise !== 1
        ) {
            let time = parseInt(
                Math.ceil((new Date().getTime() - this.const_answer_start_time) / 1000)
            );
            let obj = {
                s_c_times_id: exercise_set_id,
                spend_time: time,
            };
            axios.post(api.recordExerciseSet, obj).then((res) => {
                console.log("做完保存做完保存做完保存做完保存做完保存做完保存", obj);
            });
        }
        this.setState({
            checkedIndex: -1,
        });
        this.dropAnswer = "";
    };
    // 点击查看帮助
    helpMe = async () => {
        //1是字，2是词
        const { allList, exerciseIndex, fromServeCharacterList, topaicIndex } =
            this.state;
        let knowledge =
            fromServeCharacterList[topaicIndex].knowledge_type === 1
                ? allList[exerciseIndex].character
                : allList[exerciseIndex].word;
        // console.log('正在做的题', fromServeCharacterList[topaicIndex]);
        await this.setState({
            explainStatus: false,
        });
        axios
            .get(api.knowledgeDetail, {
                params: {
                    origin: this.props.navigation.state.params.data.origin,
                    knowledge: knowledge,
                    // knowledge: "落",
                    knowledge_type: fromServeCharacterList[topaicIndex].knowledge_type,
                },
            })
            .then((res) => {
                console.log("查看帮助", res.data.data);
                let detailsObj = res.data.data;
                if (fromServeCharacterList[topaicIndex].knowledge_type === 1) {
                    let reg = new RegExp(knowledge, "g");
                    // let reg = new RegExp('假', "g");
                    let arr = [];
                    // detailsObj.word_idiom = ["放假", "假条", "狐假虎威", "假如","放假", "假条", "狐假虎威", "假如","放假", "假条", "狐假虎威", "假如"]
                    detailsObj.word_idiom.forEach((i) => {
                        let item = i.replace(
                            reg,
                            '<span style="color:red">' + knowledge + "</span>"
                        );
                        arr.push("<span style='padding-top:10px'>" + item + "</span>");
                    });
                    detailsObj.html = "<div>" + arr.join("、") + "</div>";
                    if (!detailsObj.pinyin_tag) {
                        detailsObj.sm = detailsObj.pinyin[0];
                        detailsObj.ym = detailsObj.pinyin[1];
                    }
                }
                detailsObj.showHelpText = knowledge;
                detailsObj.topicKey = fromServeCharacterList[topaicIndex].key;
                detailsObj.constArticle =
                    this.props.navigation.state.params.data.learning_name;
                if (fromServeCharacterList[topaicIndex].knowledge_type === 1) {
                    // setTimeout(() => {
                    //   this.setState({
                    //     detailsObj,
                    //     showHelpText: knowledge,
                    //     characterHelpStatus: true,
                    //   });
                    // }, 550)
                    this.setState({
                        detailsObj,
                        showHelpText: knowledge,
                        characterHelpStatus: true,
                    });
                } else {
                    // setTimeout(() => {
                    //   this.setState({
                    //     detailsObj,
                    //     showHelpText: knowledge,
                    //     // explainStatus: false,
                    //     wordHelpStatus: true,
                    //   });
                    // }, 550)
                    this.setState({
                        detailsObj,
                        showHelpText: knowledge,
                        // explainStatus: false,
                        wordHelpStatus: true,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    onCloseExplain = () => {
        this.setState({
            explainStatus: false,
        });
        this.nextTopaicHelp();
    };
    // 帮助里面点下一题（推送要素题）
    nextTopaicHelp = () => {
        const {
            exerciseYsArr,
            topaicIndex,
            fromServeCharacterList,
            dropLine,
            isKeyExercise,
        } = this.state;
        // 是要素题进入下一题
        if (isKeyExercise) {
            // 推的要素题答错
            this.nextTopic();
            this.setState({
                isKeyExercise: 0,
            });
        } else {
            console.log("退要素题");
            // 非要素题下一题推送要素题
            fromServeCharacterList[topaicIndex] = { ...exerciseYsArr[topaicIndex] };
            fromServeCharacterList[topaicIndex].colorFlag = 2;
            if (dropLine.length > 1) {
                let arr = [];
                dropLine[0].child = null;
                arr = arr.concat(dropLine[0]);
                this.setState({
                    dropLine: arr,
                });
            }
            this.setState({
                fromServeCharacterList,
                checkedIndex: -1,
                isKeyExercise: 1, //表示当前题是要素题
            });
        }
        if (fromServeCharacterList[topaicIndex].knowledge_type === 1) {
            this.setState({
                characterHelpStatus: false,
            });
        } else {
            this.setState({
                wordHelpStatus: false,
            });
        }
    };
    render() {
        const {
            topaicNum,
            fromServeCharacterList,
            topaicIndex,
            explainStatus,
            diagnose_notes,
            allList,
            exerciseIndex,
            characterHelpStatus,
            detailsObj,
            wordHelpStatus,
            answerStatisticsModalVisible,
            goodVisible,
        } = this.state;

        return (
            <ImageBackground
                style={styles.wrap}
                source={require("../../../images/chineseHomepage/flow/flowBg.png")}
                resizeMode="cover"
            >
                {/* <Header
          text={this.props.navigation.state.params.data.learning_name}
          goBack={() => {
            this.goBack();
          }}
        ></Header> */}
                <View style={[styles.headerwrap]}>
                    <TouchableOpacity style={[size_tool(120, 80)]} onPress={this.goBack}>
                        <Image
                            style={[size_tool(120, 80)]}
                            source={require("../../../images/chineseHomepage/pingyin/new/back.png")}
                        />
                    </TouchableOpacity>
                    <View style={[appStyle.flexLine]}>{this.renderTopaicCard()}</View>
                    <View style={[size_tool(120, 80)]} />
                </View>
                <View style={styles.container}>
                    <View style={[styles.topaicText]}>
                        <View style={[styles.nameWrap]}>
                            <Text style={[styles.nameTxt]}>
                                {this.props.navigation.state.params.data.learning_name}
                            </Text>
                        </View>
                        <View style={{ flex: 1, width: "100%" }}>
                            {/* <ScrollView> */}
                            {fromServeCharacterList[topaicIndex] &&
                                fromServeCharacterList[topaicIndex].public_exercise_stem != "" ? (
                                <RichShowView
                                    width={pxToDp(1300)}
                                    value={
                                        fromServeCharacterList[topaicIndex].public_exercise_stem
                                    }
                                    size={6}
                                />
                            ) : null}

                            {this.renderWriteTopaic()}
                            {/* </ScrollView> */}
                        </View>

                        <TouchableOpacity
                            style={styles.topaicBtn}
                            ref="topaicBox"
                            onLayout={(event) => this.topaicContainerOnLayout(event)}
                            onPress={this.clickNextTopaic}
                        >
                            <View style={[styles.topaicBtninner]}>
                                <Text
                                    style={[
                                        { color: "#ffffff", fontSize: pxToDp(36) },
                                        appFont.fontFamily_jcyt_700,
                                    ]}
                                >
                                    下一题
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* 统计正确题，错题 */}
                <AnswerStatisticsModal
                    dialogVisible={answerStatisticsModalVisible}
                    yesNumber={this.yesNumber}
                    noNumber={this.noNumber}
                    waitNumber={0}
                    closeDialog={this.closeAnswerStatisticsModal}
                    finishTxt={"完成"}
                // isNoNum={true}
                />
                {/* <AnswerStatisticsModal
          dialogVisible={answerStatisticsModalVisible}
          exerciseStatistics={{
            0: this.yesNumber,
            2: this.noNumber,
          }}
          closeDialog={this.closeAnswerStatisticsModal}
        ></AnswerStatisticsModal> */}
                {/* 知识讲解 */}

                {/* 字帮助 */}
                <CharacterHelpModal
                    characterHelpStatus={characterHelpStatus}
                    detailsObj={detailsObj}
                    nextTopaicHelp={this.nextTopaicHelp}
                    diagnose_notes={diagnose_notes}
                ></CharacterHelpModal>
                {/* 词帮助 */}
                <WordHelpModal
                    wordHelpStatus={wordHelpStatus}
                    detailsObj={detailsObj}
                    nextTopaicHelp={this.nextTopaicHelp}
                    diagnose_notes={diagnose_notes}
                ></WordHelpModal>
                {goodVisible ? <Good /> : null}
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        paddingTop: Platform.OS === "ios" ? pxToDp(40) : 0,
    },
    container: {
        flex: 1,
        ...padding_tool(0, 80, 80, 80),
    },
    topaicText: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: pxToDp(80),
        ...padding_tool(32, 48, 32, 48),
        alignItems: "flex-start",
    },
    headerwrap: {
        height: pxToDp(120),
        marginBottom: pxToDp(20),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        ...padding_tool(0, 20, 0, 20),
    },
    topaicBtn: {
        position: "absolute",
        right: pxToDp(40),
        bottom: pxToDp(40),
        width: pxToDp(200),
        height: pxToDp(200),
        borderRadius: pxToDp(100),
        backgroundColor: "#F07C39",
        paddingBottom: pxToDp(8),
    },
    topaicBtninner: {
        flex: 1,
        borderRadius: pxToDp(100),
        backgroundColor: "#FF964A",
        ...appStyle.flexCenter,
    },
    nameWrap: {
        ...padding_tool(10, 26, 10, 26),
        borderRadius: pxToDp(46),
        backgroundColor: "#FFE8B4",
        justifyContent: "center",
    },
    nameTxt: {
        ...appFont.fontFamily_syst_bold,
        fontSize: pxToDp(36),
        lineHeight: pxToDp(46),
        color: "#FE9943",
        marginBottom: pxToDp(0),
    },
    itemWrap: {
        width: pxToDp(72),
        height: pxToDp(72),
        borderRadius: pxToDp(36),
        justifyContent: "center",
        alignItems: "center",
        marginRight: pxToDp(34),
    },
    normalItem: {
        borderWidth: pxToDp(6),
        borderColor: "#FF964A",
    },
    itemTxt: {
        ...appFont.fontFamily_syst_bold,
        fontSize: pxToDp(36),
        lineHeight: pxToDp(46),
    },
    wrongItem: {
        backgroundColor: "#F2645B",
    },
    rightItem: {
        backgroundColor: "#16C792",
    },
    speTxt: {
        color: "#fff",
    },
    normalTxt: {
        color: "#475266",
    },
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        token: state.getIn(["userInfo", "token"]),
        moduleCoin: state.getIn(["userInfo", "moduleCoin"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        getRewardCoin() {
            dispatch(userAction.getRewardCoin());
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(wordAccumulation);
