import React, { PureComponent } from "react"
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    ScrollView,
    DeviceEventEmitter,
    Keyboard,
} from "react-native"
import { pxToDp } from "../../../../util/tools"
import { appFont, appStyle } from "../../../../theme"
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil"
import axios from '../../../../util/http/axios'
import api from '../../../../util/http/api'
import { connect } from "react-redux";
import * as actionCreators from "../../../../action/math/bagProgram/index";
import SyntaxHighlighter from 'react-native-syntax-highlighter'
import { qtcreatorDark } from 'react-syntax-highlighter/styles/hljs'
import RunningResultsModal from './components/RunningResultsModal'
import StarModal from './components/StarModal'
import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor';
import WordModal from './components/WordModal'
import Stem from './components/Stem'
import PyRuntime from "./runCode"
import _ from "lodash"
import RichShowViewHtml from '../../../../component/math/RichShowViewHtml'
import KnowledgeModal from './components/KnowledgeModal'
import ImmediatelyPlay from "../../../../util/audio/playAudio"
import BackBtn from "../../../../component/math/BackBtn"
import * as actionCreatorsUserInfo from "../../../../action/userInfo";

const TXT_MAP = {
    0: '主程序',
    1: '学编程',
    2: '学英语',
    3: '自主编程'
}

class Study extends PureComponent {
    constructor(props) {
        super()
        this.knowledge_click_arr = []
        this.word_clicl_arr = []
        const { topic_data } = props
        const { stars } = topic_data.toJS()
        this.state = {
            step_index: 3,   //首次进入，代码编辑组件不会自动聚焦，先设置为3渲染出来
            stars: [0, 0, 0, 0],
            running_visible: false,
            result: '',
            star_visible: false,
            list_knowledge: [],  //编程知识点
            knowledge_index: -1,
            list_word: [], // 编程中的英语知识点
            word_index: -1,
            word_visible: false,
            my_code: '',
            autoFocus: JSON.stringify(stars) === JSON.stringify([1, 1, 1, 0]) ? true : false,
            word_highLight_code: '',
            knowledge_visible: false,
            knowledge_highLight_code: '',
            current_stem_passed: false,
        }
        this.pyRuntimeRef = React.createRef()
    }

    goBack = () => {
        MathNavigationUtil.goBack(this.props);
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit("refreshPage"); //返回页面刷新
        setTimeout(() => {
            DeviceEventEmitter.emit("refreshHomePage"); //返回 首页页面刷新
        }, 500)

    }

    componentDidMount() {
        const { topic_data } = this.props
        const { stars, key_words, words } = topic_data.toJS()
        let list_knowledge = Object.keys(key_words)
        let list_word = _.uniq(words)
        this.setState({
            stars,
            list_knowledge,
            autoFocus: true,
            list_word,
        }, () => {
            let len = stars.filter((i, x) => {
                return i
            }).length
            if (len === 4) {
                // 表示已经获得4颗星星的题目
                this.setState({
                    step_index: 0
                })
            } else {
                this.getStepIndex()
            }
        })
    }

    runCode = () => {
        const { token } = this.props
        if (!token) {
            MathNavigationUtil.resetToLogin(this.props);
            return
        }
        const { topic_data } = this.props
        const { code } = topic_data.toJS()
        // 运行示例代码之后，播放成功的音频
        ImmediatelyPlay.playCodeSuccess()
        axios.post(api.runProgramCode, { code }).then(res => {
            let data = res.data.data
            this.setState({
                running_visible: true,
                result: data.substring(0, data.length - 1)
            })
        })
    }

    onChangeCode = (v) => {
        this.setState({
            my_code: v
        })
    }

    runMyCode = () => {
        const { token } = this.props
        if (!token) {
            MathNavigationUtil.resetToLogin(this.props);
            return
        }
        Keyboard.dismiss()
        this.setState({
            result: "",
            current_stem_passed: false,
        }, () => {
            this.pyRuntimeRef.current.executePythonScript()
        })
    }

    getProgramResult = (msgDict) => {
        const { type, msg } = msgDict
        const { result } = this.state
        const { topic_data } = this.props
        const stem = topic_data.toJS()
        console.log('学习_当前题目______', stem.answer)
        const regex = /[0-9]+(\.[0-9]+)?/g;
        const numbers = msg.match(regex);
        let t = false
        if (numbers) {
            for (let i = 0; i < numbers.length; i++) {
                let n = numbers[i]

                if (n.toString() === stem.answer) {
                    t = true
                    // 代码结果正确播放成功的音频
                    ImmediatelyPlay.playCodeSuccess()
                }
            }
        }

        if (t === false) {
            if (type === "stderr") {
                // 代码运行异常播放失败的音频
                ImmediatelyPlay.playCodeFailed()
            } else {
                ImmediatelyPlay.playCodeFinish()
            }
        }

        this.setState({
            result: `${type === "stderr" ? "运行错误: " : ""}${result}\n${msg}\n`,
        }, () => {
            this.setState({
                running_visible: true,
                current_stem_passed: t,
            })
        })
    }

    initNowWord = () => {
        const { list_word, word_index } = this.state
        let index = 0
        if (word_index > -1) index = word_index
        this.selectWord(list_word[index], index)
    }

    initNowKnowledge = () => {
        const { list_knowledge, knowledge_index_index } = this.state
        let index = 0
        if (knowledge_index_index > -1) index = knowledge_index_index
        this.selectKnowledge(list_knowledge[index], index)
    }

    getStepIndex = () => {
        const { stars } = this.state
        let step_index = -1
        for (let i = 0; i < stars.length; i++) {
            if (!stars[i]) {
                step_index = i
                break
            }
        }
        if (step_index === -1) {
            // 所有步骤都获得星星
            MathNavigationUtil.toMathProgramSyncOrExpand({ ...this.props })
        } else {
            if (step_index === 1) this.initNowKnowledge()
            if (step_index === 2) this.initNowWord()
            this.setState({
                step_index
            })
        }
    }

    saveStatus = (stars) => {
        const { step_index } = this.state
        if (stars[step_index]) {
            return
        }
        const { topic_data } = this.props
        const { id } = topic_data.toJS()
        const MAP = {
            0: 'code',
            1: 'english',
            2: 'point',
            3: 'aware'
        }
        let params = {
            s_id: id,
            source: MAP[step_index]
        }
        console.log('保存数据_______________', params)
        axios.post(api.saveProgramStatus, params).then(res => {
            this.getStepIndex()
            this.props.getRewardCoin()
        })
    }

    selectKnowledge = (i, x) => {
        const { topic_data } = this.props
        const { key_words, code } = topic_data.toJS()
        let arr = key_words[i]
        arr = _.uniq(arr.sort(function (a, b) {
            return b.length - a.length;
        }))
        // console.log('ppppp',arr)
        let _c = JSON.parse(JSON.stringify(code))
        const special_str = ['*', '.', '?', '+', '$', '^', '[', ']', '(', ')', '{', '}', '|', '\', ' / '']   //正则匹配需要转义的字符
        const special_symbol = ['+=', '-=', '*=', '/=', '%=', '==', '!=', '>=', '<=', '//', '**']
        arr.forEach((ii, x) => {
            let rule = ii
            let txt = ii
            if (special_str.indexOf(ii) > -1) rule = "\\" + ii
            if (i === '整数') {
                rule = ' ' + ii
                txt = `&nbsp;${ii}`
            }
            if (ii === '*') {
                rule = " \\* "
                txt = '&nbsp;*&nbsp;'
            }
            if (ii === '/') {
                rule = " \\/ "
                txt = '&nbsp;/&nbsp;'
            }
            if (ii === '**=') {
                rule = "\\*\\*\\="
            }
            if (special_symbol.indexOf(ii) > -1) {
                rule = "\\" + i[0] + "\\" + ii[1]
            }
            const reg = new RegExp(rule, "gi")
            _c = _c.replace(reg, `<span style="color:lightskyblue">${txt}</span>`)
            // console.log('pppppp',_c)
        })
        this.setState({
            knowledge_index: x,
            knowledge_highLight_code: `<p>${_c}</p>`.replaceAll('\n', '<br/>')
        })
    }

    selectWord = (i, x) => {
        this.setState({
            word_highLight_code: ''  //让renderhtml重新渲染
        }, () => {
            const { topic_data } = this.props
            const { code } = topic_data.toJS()
            const reg = new RegExp(i, 'gi')
            let word_highLight_code = code.replace(reg, `<span style="color:coral">${i}</span>`).replaceAll('\n', '<br/>')
            this.setState({
                word_index: x,
                word_highLight_code
            })
        })
    }

    showKnowLedgeModal = (i, x) => {
        const { token } = this.props
        if (!token) {
            MathNavigationUtil.resetToLogin(this.props);
            return
        }
        this.knowledge_click_arr.push(x)
        this.setState({
            knowledge_visible: true
        })
    }

    showWordModal = (i, x) => {
        const { token } = this.props
        if (!token) {
            MathNavigationUtil.resetToLogin(this.props);
            return
        }
        this.word_clicl_arr.push(x)
        this.setState({
            word_visible: true
        })
    }
    renderStepConten = () => {
        const { step_index } = this.state
        switch (step_index) {
            case 0:
                return this.renderContent1()
            case 1:
                return this.renderContent2()
            case 2:
                return this.renderContent3()
            case 3:
                return this.renderContent4()
        }
    }

    renderContent1 = () => {
        const { topic_data } = this.props
        const { code } = topic_data.toJS()
        return <View style={[styles.content1]}>
            <ScrollView contentContainerStyle={{ paddingBottom: pxToDp(240) }}>
                <SyntaxHighlighter fontSize={Platform.OS === 'android' ? pxToDp(26) : pxToDp(36)} language="python" highlighter={'hljs'} style={qtcreatorDark}>
                    {code}
                </SyntaxHighlighter>
            </ScrollView>
            <TouchableOpacity style={[styles.run_btn]} onPress={this.runCode}>
                <View style={[styles.run_btn_inner]}>
                    <Text style={[{ color: '#2D2D40', fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>运行</Text>
                    <View
                        style={{
                            marginTop: pxToDp(10),
                        }}
                    >
                        <Image style={[{ width: pxToDp(70), height: pxToDp(70) }]} source={require('../../../../images/mathProgramming/run_pass.png')}></Image>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    }

    renderContent2 = () => {
        const { list_knowledge, knowledge_index, knowledge_highLight_code } = this.state
        return <View style={[styles.content2]}>
            <ScrollView style={[styles.left]} contentContainerStyle={{ padding: pxToDp(40) }}>
                <RichShowViewHtml value={knowledge_highLight_code} size={48} haveStyle={true} p_style={Platform.OS === 'android' ? { lineHeight: pxToDp(70) } : {}}></RichShowViewHtml>
            </ScrollView>
            <View>
                <ScrollView>
                    {list_knowledge.map((i, x) => {
                        return <TouchableOpacity style={[styles.content_item, knowledge_index === x ? styles.content_item_active : null]} key={x} onPress={() => {
                            this.selectKnowledge(i, x)
                        }}>
                            <View style={[styles.content_item_inner, knowledge_index === x ? styles.content_item_inner_active : null]}>
                                <Text style={[{ color: "#fff", fontSize: pxToDp(40) }, Platform.OS === 'ios' ? { lineHeight: pxToDp(50) } : null, appFont.fontFamily_jcyt_500, knowledge_index === x ? { color: "#1F1F26", ...appFont.fontFamily_jcyt_700 } : null]}>{i}</Text>
                                {knowledge_index === x ? <TouchableOpacity style={[{ height: pxToDp(88), width: pxToDp(88) }, appStyle.flexCenter]} onPress={() => {
                                    this.showKnowLedgeModal(i, x)
                                }}>
                                    <Image style={[{ width: pxToDp(40), height: pxToDp(40) }]} source={require('../../../../images/mathProgramming/right_icon_2.png')}></Image>
                                </TouchableOpacity> : <View style={{ height: pxToDp(88), width: pxToDp(88) }}></View>}
                            </View>
                        </TouchableOpacity>
                    })}
                </ScrollView>
            </View>
        </View>
    }

    renderContent3 = () => {
        const { list_word, word_index, word_highLight_code } = this.state
        return <View style={[styles.content2]}>
            <ScrollView style={[styles.left]} contentContainerStyle={{ padding: pxToDp(40) }}>
                {word_highLight_code ? <RichShowViewHtml value={word_highLight_code} size={48} haveStyle={true} p_style={Platform.OS === 'android' ? { lineHeight: pxToDp(70) } : {}}></RichShowViewHtml> : null}
            </ScrollView>
            <View>
                <ScrollView>
                    {list_word.map((i, x) => {
                        return <TouchableOpacity style={[styles.content_item, word_index === x ? styles.content_item_active : null]} key={x} onPress={() => {
                            this.selectWord(i, x)
                        }}>
                            <View style={[styles.content_item_inner, word_index === x ? styles.content_item_inner_active : null]}>
                                <Text style={[{ color: "#fff", fontSize: pxToDp(40) }, Platform.OS === 'ios' ? { lineHeight: pxToDp(50) } : null, appFont.fontFamily_jcyt_500, word_index === x ? { color: "#1F1F26", ...appFont.fontFamily_jcyt_700 } : null]}>{i}</Text>
                                {word_index === x ? <TouchableOpacity style={[{ height: pxToDp(88), width: pxToDp(88) }, appStyle.flexCenter]} onPress={() => {
                                    this.showWordModal(i, x)
                                }}>
                                    <Image style={[{ width: pxToDp(40), height: pxToDp(40) }]} source={word_index === x ? require('../../../../images/mathProgramming/right_icon_2.png') : ''}></Image>
                                </TouchableOpacity> : <View style={{ height: pxToDp(88), width: pxToDp(88) }}></View>}
                            </View>
                        </TouchableOpacity>
                    })}
                </ScrollView>
            </View>
        </View>
    }

    renderContent4 = () => {
        const { autoFocus, my_code } = this.state
        return <View style={[styles.content4]}>
            <PyRuntime
                ref={this.pyRuntimeRef}
                code={my_code}
                getProgramResult={this.getProgramResult}
            />
            <ScrollView contentContainerStyle={{ paddingBottom: pxToDp(240) }}>
                <CodeEditor
                    style={{
                        fontSize: pxToDp(36),
                        inputLineHeight: pxToDp(40),
                        highlighterLineHeight: pxToDp(40),
                    }}
                    language="python"
                    syntaxStyle={CodeEditorSyntaxStyles.qtcreatorDark}
                    showLineNumbers
                    autoFocus={autoFocus}
                    initialValue={my_code}
                    onChange={this.onChangeCode}
                />
            </ScrollView>
            <TouchableOpacity style={[styles.run_btn]} onPress={this.runMyCode}>
                <View style={[styles.run_btn_inner]}>
                    <Text style={[{ color: '#2D2D40', fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>运行</Text>
                    <View
                        style={{
                            marginTop: pxToDp(10),
                        }}
                    >
                        <Image style={[{ width: pxToDp(70), height: pxToDp(70) }]} source={require('../../../../images/mathProgramming/run_pass.png')}></Image>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    }

    render() {
        const { step_index, stars, running_visible, result, star_visible, word_visible, list_word, word_index, knowledge_visible, list_knowledge, knowledge_index, current_stem_passed } = this.state
        const { topic_data } = this.props
        const stem = topic_data.toJS()
        // console.log('学习_当前题目______', stem.answer)
        return (
            <ImageBackground style={[styles.container]} source={require('../../../../images/mathProgramming/bg_1.png')}>
                <BackBtn goBack={this.goBack} style={{ left: pxToDp(10) }}></BackBtn>
                <View style={[styles.content]}>
                    <View style={{ marginBottom: Platform.OS === 'android' ? pxToDp(20) : pxToDp(30), marginLeft: pxToDp(40) }}>
                        <Stem data={topic_data.toJS()} size={32}></Stem>
                    </View>
                    {this.renderStepConten()}
                </View>
                <View style={[styles.footer]}>
                    {stars.map((i, x) => {
                        return <TouchableOpacity key={x} style={[styles.footer_item, i === 3 ? { marginRight: 0 } : null, step_index === x ? { backgroundColor: "#fff" } : null]} onPress={() => {
                            if (x === 1) this.initNowKnowledge()
                            if (x === 2) this.initNowWord()
                            this.setState({
                                step_index: x
                            })
                        }}>
                            <Image style={[{ width: pxToDp(40), height: pxToDp(40), marginRight: pxToDp(20) }]} source={i ? require('../../../../images/mathProgramming/star_icon_1_active.png') : require('../../../../images/mathProgramming/star_icon_1.png')}></Image>
                            <Text style={[{ color: '#fff', fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_500, step_index === x ? { color: "#1F1F26", ...appFont.fontFamily_jcyt_700 } : null]}>{TXT_MAP[x]}</Text>
                        </TouchableOpacity>
                    })}
                </View>
                <RunningResultsModal visible={running_visible} data={result} close={() => {
                    const { step_index } = this.state

                    this.setState({
                        running_visible: false
                    })
                    if ((step_index !== 3) || (step_index === 3 && current_stem_passed)) {
                        const { stars, step_index } = this.state
                        if (!stars[step_index]) {
                            // 没有星星才会弹
                            this.setState({
                                star_visible: true
                            })
                        }
                    }
                }}></RunningResultsModal>
                <StarModal visible={star_visible} stars={stars} close={() => {
                    const { step_index, stars } = this.state
                    let _s = JSON.parse(JSON.stringify(stars))
                    _s[step_index] = 1
                    const { topic_data } = this.props
                    let topic = topic_data.toJS()
                    topic.stars = _s
                    this.props.setTopicData({ ...topic })
                    this.setState({
                        star_visible: false,
                        stars: _s
                    }, () => {
                        this.saveStatus(stars)
                    })
                }}></StarModal>
                <WordModal visible={word_visible} word={list_word[word_index]} close={() => {
                    this.setState({
                        word_visible: false
                    }, () => {
                        let arr = _.uniq(this.word_clicl_arr)
                        if (arr.length === this.state.list_word.length && !stars[step_index]) {
                            // 点击完成弹获得星星弹窗
                            this.setState({
                                star_visible: true
                            })
                        }
                    })
                }}></WordModal>
                <KnowledgeModal visible={knowledge_visible} knowledge={list_knowledge[knowledge_index]} close={() => {
                    this.setState({
                        knowledge_visible: false
                    }, () => {
                        let arr = _.uniq(this.knowledge_click_arr)
                        if (arr.length === list_knowledge.length && !stars[step_index]) {
                            // 点击完成弹获得星星弹窗
                            this.setState({
                                star_visible: true
                            })
                        }
                    })
                }}></KnowledgeModal>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingLeft: pxToDp(140),
        paddingRight: pxToDp(140),
        paddingTop: Platform.OS === 'android' ? pxToDp(20) : pxToDp(60),
        paddingBottom: pxToDp(40)
    },
    footer: {
        backgroundColor: "#2D2D40",
        ...appStyle.flexLine,
        ...appStyle.flexCenter,
        height: pxToDp(128)
    },
    footer_item: {
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        height: pxToDp(88),
        borderRadius: pxToDp(200),
        ...appStyle.flexCenter,
        marginRight: pxToDp(40),
        ...appStyle.flexLine
    },
    content1: {
        flex: 1,
        backgroundColor: "#000",
        borderRadius: pxToDp(40),
        padding: pxToDp(20)
    },
    run_btn: {
        width: pxToDp(200),
        height: pxToDp(200),
        borderRadius: pxToDp(100),
        backgroundColor: "#FFB649",
        paddingBottom: pxToDp(8),
        position: "absolute",
        bottom: pxToDp(40),
        right: pxToDp(40)
    },
    run_btn_inner: {
        flex: 1,
        backgroundColor: "#FFDB5D",
        borderRadius: pxToDp(100),
        ...appStyle.flexCenter
    },
    content4: {
        flex: 1,
        backgroundColor: "#000",
        padding: pxToDp(20),
        borderRadius: pxToDp(40),
    },
    content2: {
        flex: 1,
        ...appStyle.flexTopLine,
    },
    left: {
        borderRadius: pxToDp(40),
        backgroundColor: "#242433",
        marginRight: pxToDp(40),
        flex: 1
    },
    content_item: {
        height: pxToDp(88),
        backgroundColor: "#3A3A59",
        marginBottom: pxToDp(20),
        borderRadius: pxToDp(40),
        minWidth: pxToDp(200)
    },
    content_item_active: {
        backgroundColor: "#FFB649"
    },
    content_item_inner: {
        paddingLeft: pxToDp(40),
        // paddingRight:pxToDp(40),
        flex: 1,
        backgroundColor: '#474766',
        borderRadius: pxToDp(40),
        ...appStyle.flexLine,
        ...appStyle.flexJusBetween
    },
    content_item_inner_active: {
        backgroundColor: "#FFDB5D",
        borderRadius: pxToDp(40),
    }
})

const mapStateToProps = (state) => {
    return {
        topic_data: state.getIn(["bagMathProgram", "topic_data"]),
        token: state.getIn(["userInfo", "token"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setTopicData(data) {
            dispatch(actionCreators.setTopicData(data));
        },
        getRewardCoin() {
            dispatch(actionCreatorsUserInfo.getRewardCoin());
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(Study)
