import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
} from "react-native";
import { Modal, Toast } from "antd-mobile-rn";
import { appStyle } from "../../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../../util/tools";
import HeaderCircleCard from "../../../../../component/HeaderCircleCard";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import axios from "../../../../../util/http/axios";
import AnswerStatisticsModal from "../../../../../component/AnswerStatisticsModal";
import { connect } from "react-redux";
import api from "../../../../../util/http/api";
import RichShowView from "../../../../../component/chinese/RichShowView";
import url from "../../../../../util/url";
import Sound from "react-native-sound";
import SentenceHelpModal from '../../../../../component/chinese/SentenceHelpModal'

const ranking_map = {
    "0": "太棒了，答对了哦！",
    "1": "一般，还有更好的组合,继续努力！",
    "2": "答错了，继续努力！",
};
const ranking_color_map = {
    "0": "#7FD23F",
    "1": "#FCAC14",
    "2": "red",
};
class SpeSentenceExerciseTwo extends PureComponent {
    constructor(props) {
        super(props);
        this.info = this.props.userInfo.toJS();
        this.grade_term = this.info.checkGrade + this.info.checkTeam
        this.name = props.navigation.state.params.data.pName;
        this.inspect_name = props.navigation.state.params.data.name;
        this.myScrollView = undefined;
        this.heightArr = [];
        this.audioHelp = undefined;
        this.state = {
            topicList: [],
            visible: false,
            topicIndex: 0,
            currentTopic: {
                best_answer: [],
            },
            doNumber: 0,
            ranking: "",
            answerNumber: {
                "0": 0,
                "2": 0,
            },
            answerStatisticsModalVisible: false,
            helpVisible: false,
            explanation: "",
            start_time: new Date().getTime(),
            end_time: "",
            topicStart_time: new Date().getTime(),
            maxHeight: 0,
            autoHeight: 0,
            ischangeHeight: true,
            tip: "正在获取题目...",
            helpImg: "",
            helpHeight: 0, //确保帮助弹框的高度大于等于诊断标记
            changeData: {},
            isStartAudio: false,
            nowSelectArr: [],
            nowIndex: -1
        };
    }
    componentDidMount() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        let infoData = this.props.navigation.state.params.data
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam
        let obj = {
            grade_term,
            iid: infoData.se_id,
            name: infoData.pName,
            pName: '智能造句'
        }
        axios.get(`${api.getChinesSenTopic}/${infoData.se_id}`, { params: obj }).then((res) => {
            const data = res.data.data;
            console.log('题目', data[0].sentence_stem)
            if (data.length > 0) {
                let currentTopic = this.changeCurrentTopic(data[0]);
                this.setState({
                    topicList: data,
                    currentTopic,
                    tip: "",
                }, () => {
                    let item = currentTopic.sentence_stem[0]
                    this.clickSelect(item, 0)
                });
            }
            if (data.length === 0) {
                this.setState({
                    tip: "当前没有题目",
                });
            }
        });
    }
    changeCurrentTopic = (currentTopic) => {
        let _change_word = []
        let answer = []
        let answerContent = []
        let changeobj = {}
        currentTopic.sentence_stem.forEach((item, index) => {
            item.position = index
            item.slectLabel = ''
            answerContent.push(item.content)
            answer.push(index)
            if (!changeobj[item.content]) {
                _change_word.push(item)
                changeobj[item.content] = '1'
            }
        })
        currentTopic._change_word = this.shuffle(_change_word)
        currentTopic.answer = answer
        currentTopic.answerContent = answerContent
        return currentTopic;
    };
    nextTopic = () => {
        const {
            currentTopic,
            topicList,
            doNumber,
            topicIndex,
            answerNumber,
            topicStart_time,
        } = this.state;
        if (topicList.length === 0) return;
        let _topicList = JSON.parse(JSON.stringify(topicList));
        let myAnswer = currentTopic.sentence_stem.map((item, index) => {
            return item.slectLabel
        })
        let ranking = ''
        myAnswer.join('') === currentTopic.answerContent.join('') ? ranking = '0' : ranking = '2'
        let endTime = new Date().getTime();
        let answer_times = parseInt((endTime - topicStart_time) / 1000);
        if (currentTopic.is_push === 0) {
            _topicList[topicIndex].status = ranking;
            for (let i in answerNumber) {
                if (i === ranking) {
                    answerNumber[i] = answerNumber[i] + 1;
                }
            }
        }
        let obj = {
            sentence_times_id: currentTopic.sentence_times_id,
            se_id: currentTopic.se_id,
            correct: ranking,
            answer_times,
            exercise_time: currentTopic.exercise_time,
            grade_term: this.grade_term,
            is_push: currentTopic.is_push,
            pName: this.inspect_name,
            name: this.name
        };
        // console.log("单题保存成功", res.data.data, currentTopic);

        this.setState({
            topicList: _topicList,
            answerNumber,
            ranking
        }, () => {
            // this.changeTopic()
        });
        this.setState({
            visible: true,
        });
        return;
    };
    changeTopic = () => {
        const { topicIndex, topicList, start_time, currentTopic, ranking } = this.state;
        console.log('一套题做完',)
        let endTime = new Date().getTime();
        let spend_time = parseInt((endTime - start_time) / 1000);
        let obj = {
            sentence_times_id: currentTopic.sentence_times_id,
            spend_time,
        };

        let _currentTopic = this.changeCurrentTopic(topicList[topicIndex])
        this.setState({
            currentTopic: _currentTopic,
            topicStart_time: new Date().getTime(),
            ischangeHeight: true,
            autoHeight: 0,
            maxHeight: 0,
            changeData: {}
        }, () => {
            let item = _currentTopic.sentence_stem[0]
            this.clickSelect(item, 0)
        });
        this.heightArr = [];
    };
    //打乱数组
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    shuffle = (arr) => {
        let _arr = arr.slice();
        for (let i = 0; i < _arr.length; i++) {
            let j = this.getRandomInt(0, i);
            let t = _arr[i];
            _arr[i] = _arr[j];
            _arr[j] = t;
        }
        return _arr;
    };
    goBack = () => {
        NavigationUtil.goBack(this.props);
    };
    onClose = () => {
        const { ranking } = this.state;
        this.setState({ visible: false, maxHeight: 0 }, () => {
            this.changeTopic()
        });
    };

    onCloseHelp = () => {
        this.closeHelpAudio()
        this.setState({ helpVisible: false });
    };
    helpMe = () => {
        this.setState({ helpVisible: true });
    };
    closeAnswerStatisticsModal = () => {
        NavigationUtil.goBack(this.props);
        this.setState({
            answerStatisticsModalVisible: false,
        });
    };
    _onLayout = (event) => {
        const { ischangeHeight, currentTopic } = this.state;
        let { x, y, width, height } = event.nativeEvent.layout;
        // console.log("通过onLayout得到的高度：" + height);
        if (ischangeHeight) {
            //console.log("通过onLayout得到的高度：" + height);
            this.setState({
                autoHeight: height,
                ischangeHeight: false,
            });
        }
    };
    _onLayoutModal = (event) => {
        let { x, y, width, height } = event.nativeEvent.layout;
        // console.log("通过onLayout得到的高度：" + height);
        this.setState({
            helpHeight: height,
        });
    };
    renderTemplate = () => {
        const { currentTopic } = this.state
        let _currentTopic = JSON.parse(JSON.stringify(currentTopic))
        _currentTopic.template_word.forEach((i, index) => {
            _currentTopic.sentence_stem[i.position].desc = i.desc
        })
        // console.log('renderTemplate',_currentTopic)
        let htm = []
        _currentTopic.sentence_stem.forEach((item, index) => {
            let h = <View>
                <View style={[appStyle.flexJusCenter, appStyle.flexCenter]}>
                    <Text style={{ borderBottomWidth: item.desc ? 2 : 0, fontSize: pxToDp(36), paddingBottom: pxToDp(8), borderBottomColor: 'red', marginLeft: 2, marginRight: 2 }}>{item.content}</Text>
                    {item.desc ? <Text style={{ fontSize: pxToDp(26) }}>{item.desc}</Text> : null}
                </View>

            </View>
            htm.push(h)
        })
        return <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
            {htm}
        </View>
    }
    playHeplAudio = () => {
        const { currentTopic, isStartAudio } = this.state;
        // currentTopic.standard_audio = 'chinese/03/00/exercise/audio/0910562130a7482f9b742def14203f55.mp3'
        if (this.audioHelp) {
            isStartAudio
                ? this.audioHelp.pause()
                : this.audioHelp.play((success) => {
                    if (success) {
                        this.audioHelp.release();
                    }
                });
            this.setState({
                isStartAudio: !isStartAudio,
            });
            return;
        }
        this.audioHelp = new Sound(
            url.baseURL + currentTopic.standard_audio,
            null,
            (error) => {
                if (error) {
                    console.log("播放失败", error);
                } else {
                    this.audioHelp.setNumberOfLoops(-1);
                    this.audioHelp.play((success) => {
                        if (success) {
                            this.audioHelp.release();
                        }
                    });
                    this.setState(() => ({
                        isStartAudio: true,
                    }));
                }
            }
        );
    };
    // 关闭帮助播放
    closeHelpAudio = () => {
        if (this.audioHelp) {
            this.audioHelp.stop();
            this.audioHelp = undefined;
            this.setState(() => ({
                isStartAudio: false,
            }));
        }
    };
    clickSelect = (item, index) => {
        const { currentTopic } = this.state
        let _currentTopic = JSON.parse(JSON.stringify(currentTopic))
        _currentTopic.sentence_stem.forEach((i, x) => {
            i.isActive = false
            if (index === x) i.isActive = true
        })
        this.setState({
            currentTopic: _currentTopic,
            nowIndex: index
        })
    }
    selectItem = (item, index) => {
        const { currentTopic, nowIndex } = this.state
        let _currentTopic = JSON.parse(JSON.stringify(currentTopic))
        _currentTopic.sentence_stem[nowIndex].slectLabel = item.content
        this.setState({
            currentTopic: _currentTopic,
        })
    }
    renderStem = () => {
        const { currentTopic } = this.state
        if (this.name.indexOf('文化积累') !== -1) {
            return <Text style={[{ fontSize: pxToDp(36), color: "#000" }]}>默写</Text>
        }
        if (currentTopic.common_stem.indexOf('非顺序造句') === -1) {
            return <>
                <Text style={[{ fontSize: pxToDp(36), color: "#000" }]}>{currentTopic.common_stem}</Text>
                {currentTopic.stem ? (
                    <Text style={[{ fontSize: pxToDp(36), color: "#000" }]}>
                        {currentTopic.stem}
                    </Text>
                ) : null}
            </>
        }
        return <>
            {currentTopic.stem ? (
                <Text style={[{ fontSize: pxToDp(36), color: "#000" }]}>
                    {currentTopic.stem}
                </Text>
            ) : null}
        </>
    }
    render() {
        const {
            topicList,
            visible,
            currentTopic,
            ranking,
            answerStatisticsModalVisible,
            answerNumber,
            helpVisible,
            explanation,
            autoHeight,
            tip,
            helpImg,
            helpHeight,
            maxHeight,
            isStartAudio,
            nowSelectArr
        } = this.state;
        return (
            <View style={[styles.container]}>
                <ImageBackground
                    source={require("../../../../../images/chineseDailySpeReadingBg2.png")}
                    style={[styles.header, appStyle.flexCenter]}
                >
                    <TouchableOpacity
                        style={[styles.headerBack]}
                        onPress={() => this.goBack()}
                    >
                        <Image
                            source={require("../../../../../images/chineseDailySpeReadingBtn2.png")}
                            style={[size_tool(64)]}
                        ></Image>
                    </TouchableOpacity>
                    <Text style={[{ fontSize: pxToDp(42), color: "#fff" }]}>
                    </Text>
                    <View style={[styles.circleCard, appStyle.flexTopLine]}>

                    </View>
                </ImageBackground>

                <ImageBackground
                    source={require("../../../../../images/chineseDailySpeReadingBg1.png")}
                    style={[{ flex: 1 }]}
                >
                    <ScrollView style={{ maxHeight: 210 }}>
                        <View style={[appStyle.flexTopLine, appStyle.flexLineWrap, styles.topWrap]}>
                            {currentTopic._change_word ? currentTopic._change_word.map((item, index) => {
                                return <TouchableOpacity key={index} onPress={() => { this.selectItem(item, index) }} style={{ marginRight: pxToDp(20) }}>
                                    <ImageBackground style={[styles.selectItem]} source={require("../../../../../images/select_bg.png")} resizeMode="stretch">
                                        <Text style={{ fontSize: pxToDp(36), color: '#fff', lineHeight: pxToDp(80) }}>{item.content}</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            }) : null}
                        </View>
                    </ScrollView>
                    <View style={[appStyle.flexAliCenter]}>
                        <ImageBackground
                            source={require("../../../../../images/sentenceBg.png")}
                            style={[styles.content1]}
                            resizeMode='stretch'
                        >
                            <ScrollView style={[styles.contentExc]} ref={(view) => {
                                if (view) this.myScrollView = view;
                            }}>
                                {currentTopic.sentence_stem ? (
                                    <>
                                        {this.renderStem()}
                                        {/* {currentTopic.common_stem.indexOf('非顺序造句') === -1?<Text style={[{ fontSize: pxToDp(36), color: "#000" }]}>
                  {currentTopic.common_stem}
                </Text>:null}
                {currentTopic.stem ? (
                  <Text style={[{ fontSize: pxToDp(36), color: "#000" }]}>
                    {currentTopic.stem}
                  </Text>
                ) : null} */}
                                        <ScrollView>
                                            <View
                                                style={[
                                                    appStyle.flexLine,
                                                    appStyle.flexLineWrap,
                                                    {
                                                        marginTop: pxToDp(16),
                                                        height: maxHeight > 0 ? autoHeight + maxHeight : "auto",
                                                    },
                                                ]}
                                                onLayout={this._onLayout}
                                            >
                                                {currentTopic.sentence_stem
                                                    ? currentTopic.sentence_stem.map((item, index) => {
                                                        return <TouchableOpacity onPress={() => { this.clickSelect(item, index) }}><Text style={[styles.selectWrap, item.isActive ? { borderBottomColor: '#FC6161' } : null, item.slectLabel ? { color: '#8E2904' } : { color: 'rgba(245, 245, 245, .5)' }]}>{item.slectLabel ? item.slectLabel : '请点击'}</Text></TouchableOpacity>
                                                    })
                                                    : null}
                                            </View>
                                        </ScrollView>
                                    </>
                                ) : (
                                    <Text style={{ fontSize: pxToDp(32) }}>{tip}</Text>
                                )}
                            </ScrollView>

                        </ImageBackground >
                        <TouchableOpacity
                            onPress={this.nextTopic}
                        >
                            <Image
                                source={require("../../../../../images/sentenceNext.png")}
                                style={[size_tool(186, 71), { marginTop: pxToDp(-20) }]}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>

                <SentenceHelpModal
                    status={this.state.visible}
                    goback={this.onClose}
                    currentTopic={currentTopic}
                    doNumber={3}
                    best_answer_three={currentTopic.answerContent ? [currentTopic.answerContent.join('')] : []}
                    diagnose={''}
                    ranking={ranking}
                    isSpe={currentTopic.sentence_stem && this.name !== '文化积累' ? '1' : '2'}
                />

                <AnswerStatisticsModal
                    dialogVisible={answerStatisticsModalVisible}
                    exerciseStatistics={answerNumber}
                    closeDialog={this.closeAnswerStatisticsModal}
                ></AnswerStatisticsModal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: "#fff",
        width: "100%",
        height: pxToDp(124),
        borderRadius: pxToDp(16),
    },
    headerBack: {
        position: "absolute",
        left: pxToDp(32),
    },
    circleCard: {
        position: "absolute",
        right: pxToDp(48),
    },
    content1: {
        borderRadius: pxToDp(16),
        marginTop: pxToDp(20),
        width: pxToDp(1860),
        height: pxToDp(546),
        paddingTop: pxToDp(120),
        paddingLeft: pxToDp(127),
    },
    content2: {
        width: pxToDp(1615),
        height: pxToDp(180),
        borderRadius: pxToDp(16),
        marginTop: pxToDp(-40),
        padding: pxToDp(40),
        paddingLeft: pxToDp(60),
    },
    contentExc: {
        // backgroundColor:'red',
        maxHeight: pxToDp(400),
        width: pxToDp(1600)
    },
    selectWrap: {
        borderBottomWidth: 3,
        minWidth: pxToDp(140),
        fontSize: pxToDp(36),
        paddingRight: pxToDp(10),
        paddingLeft: pxToDp(10),
        textAlign: 'center',
        margin: pxToDp(4)
    },
    selectItem: {
        width: '100%',
        height: pxToDp(80),
        fontSize: pxToDp(36),
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        marginBottom: pxToDp(40)
    },
    topWrap: {
        // backgroundColor:'red',
        paddingTop: pxToDp(40),
        paddingLeft: pxToDp(193),
        paddingRight: pxToDp(193),
        minHeight: 210
    }
});
const mapStateToProps = (state) => {
    // 取数据
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    // 存数据
    return {};
};
export default connect(mapStateToProps, mapDispathToProps)(SpeSentenceExerciseTwo);
