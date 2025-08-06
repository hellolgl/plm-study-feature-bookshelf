import React, { PureComponent } from "react"
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
    DeviceEventEmitter,
    StyleSheet,
    Dimensions,
    Platform,
} from "react-native"

import { appFont, appStyle } from "../../../../../theme"
import { borderRadius_tool, pxToDp, size_tool } from "../../../../../util/tools"
import NavigationUtil from "../../../../../navigator/NavigationUtil"
import MathNavigationUtil from "../../../../../navigator/NavigationMathUtil"
import RenderHtml from "react-native-render-html";
import BackBtn from "../../../../../component/math/BackBtn"

const log = console.log.bind(console)

class QuestionKindPage extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            explain: [],
            title: "",
            show: false,
            imgWidth: 0,
            imgHeight: 0,
            hasImg: false,
            imgUrl: "",
            content: [],
        }
    }

    componentDidMount() {
        const { tid, explain, name } = this.props.navigation.state.params.data
        let { show } = this.state
        this.parseHTML(explain)
        this.setState({
            title: name,
            tid: tid,
            show: true,
        })
    }

    parseHTML = (html) => {
        if (html.includes("<img src=")) {
            let imgStart = html.indexOf("<img src")
            let p = html.slice(imgStart, html.length)
            let imgEnd = p.indexOf("/>")
            // parse html
            let content = html.slice(0, imgStart) + p.slice(imgEnd + 2, html.length)
            let ep = p.indexOf("</p")
            let imgDiv = p.slice(p, ep)
            let s = imgDiv.indexOf("src=")
            let t = imgDiv.slice(s + 5, imgDiv.length - 1)
            let e = t.indexOf('"')
            let uri = t.slice(0, e)
            // get img size
            Image.getSize(uri, (imgWidth, imgHeight) => {
                this.setState({
                    imgWidth,
                    imgHeight,
                    imgUri: uri,
                    content,
                    hasImg: true,
                })
            })
        } else {
            if (html.startsWith("<p>") === false) {
                html = `<p>${html}</p>`
            }
            this.setState({
                content: html
            })
            this.setState({
                content: html
            })
        }
    }

    goBack = () => {
        DeviceEventEmitter.emit("refreshBlood")
        NavigationUtil.goBack(this.props)
    }

    goStudy = () => {
        MathNavigationUtil.toMathDoExercisePage({ ...this.props, data: { tid: this.state.tid, title: this.state.title } })
    }

    render() {
        let { content, title, show } = this.state
        const iosTag = 'font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;;'
        log("123: ", content, content.includes(iosTag))
        if (content.includes(iosTag)) {
            log("here...")
            content = content.replaceAll(iosTag, "")
        }
        log("content: ", content)
        // .replace("font-family: -apple-system", "font-family: test")
        return (
            <ImageBackground
                style={styles.mainWrap}
                source={require('../../../../../images/thinkingTraining/exercise_bg.png')}
            >
                {/* 适配ios布局 */}
                {Platform.OS === "ios" ? <View style={[{ marginTop: pxToDp(30) }]}></View> : <></>}
                <View style={[appStyle.flexCenter]}>
                    <BackBtn goBack={this.goBack} style={{left:pxToDp(20),top:pxToDp(-10)}}></BackBtn>
                    <Text style={[{ fontSize: pxToDp(60), color: '#47304C', }, appFont.fontFamily_jcyt_700]}>{title}</Text>
                    {Platform.OS === "ios" ? <View style={[{ marginTop: pxToDp(40) }]}></View> : <></>}
                    <View style={[styles.content]}>
                        <View style={{ top: pxToDp(60), marginLeft: pxToDp(50), marginRight: pxToDp(50) }}>
                            <RenderHtml source={{ html: content }} tagsStyles={{ p: { fontSize: pxToDp(36) }, span: { fontSize: pxToDp(36) } }} />
                        </View>
                    </View>
                    <View style={[styles.startBtnPosition]}>
                        {show ?
                            <TouchableOpacity onPress={this.goStudy}>
                                <ImageBackground source={require('../../../../../images/thinkingTraining/btn_bg_1.png')}
                                    style={[size_tool(240, 80), appStyle.flexCenter,]}>
                                    <Text style={[{ fontSize: pxToDp(36), color: '#fff', }, appFont.fontFamily_jcyt_700]}>开始练习</Text>
                                </ImageBackground>
                                {/* <Image style={[{ width: pxToDp(240), height: pxToDp(80) }, styles.bg_8_position]} source={require('../../../../../images/thinkingTraining/start_exercise.png')} resizeMode="contain"></Image> */}
                            </TouchableOpacity>
                            :
                            <Image style={[{ width: pxToDp(240), height: pxToDp(80) }, styles.bg_8_position]} source={require('../../../../../images/thinkingTraining/start_study_unfinish.png')} resizeMode="contain"></Image>
                        }
                    </View>
                    <View style={[styles.noticeTextPosition]}>
                        <Text style={[styles.noticeText]}>
                            注意: 题量为每次推送3道题目，每个难度各1道题。
                        </Text>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    unShow: {
        fontSize: 30,
    },
    unShowPosition: {
        // textAlign: "center",
        alignItems: "center",
        top: 200,
    },
    mainWrap: {
        flex: 1,
        zIndex: -10,
        paddingTop: pxToDp(40),
        paddingRight: pxToDp(48),
        paddingBottom: pxToDp(48),
        paddingLeft: pxToDp(48),
    },
    content: {
        // fontFamily: "sans-serif",
        // borderColor: "red",
        // borderWidth: 1,
        top: pxToDp(50),
        height: Dimensions.get('window').height * 0.75,
        width: pxToDp(1910),
        // textAlign: "center",
        backgroundColor: "white",
        borderRadius: pxToDp(32),
        // justifyContent: "center",
    },
    contentText: {
        fontSize: pxToDp(40),
        color: "#333333",
    },
    startBtnPosition: {
        top: pxToDp(-130),
    },
    noticeText: {
        color: "#999999",
        fontSize: pxToDp(28),
        ...appFont.fontFamily_jcyt_500
    },
    noticeTextPosition: {
        top: pxToDp(-100),
    }
})

export default QuestionKindPage