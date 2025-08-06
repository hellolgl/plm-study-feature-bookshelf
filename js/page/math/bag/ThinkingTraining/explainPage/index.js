import React, {PureComponent} from "react"
import {
    Text,
    StyleSheet,
    View,
    Image,
    ScrollView,
    Dimensions,
} from "react-native"
import _ from "lodash"

import {pxToDp} from "../../../../../util/tools"
import RenderHtml from 'react-native-render-html'
import TextView from "../TextView"

const log = console.log.bind(console)

class ExplainPage extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            imgWidth: 0,
            imgHeight: 0,
            hasImg: false,
            imgUrl: "",
            content: null,
        }
    }

    componentDidMount() {
        let {explain} = this.props
        if (typeof(explain) === "object") {
            this.parseStem(explain)
        } else if (typeof(explain) === "string") {
            this.parseHTML(explain)
        }
    }

    componentWillUpdate(nextProps) {
        if (_.isEqual(this.props.explain, nextProps.explain) === false) {
            if (typeof(nextProps.explain) === "object") {
                this.parseStem(nextProps.explain)
            } else if (typeof(nextProps.explain) === "string") {
                this.parseHTML(nextProps.explain)
            }
        }
    }

    getImageSize = async (uri) => new Promise(resolve => {
        Image.getSize(uri, (width, height) => {
            resolve([pxToDp(width), pxToDp(height)])
        })
    })

    parseStem = async (explain) => {
        // log("receive explain: ", explain)
        const contentStyle = {
            flexWrap: "wrap",
        }
        const [understand, understandImg, method, methodImg, correctAnswer] = explain
        let understandImgWidth, understandImgHeight, methodImgWidth, methodImgHeight
        // let understandImg = explain[1]
        if (understandImg !== "") {
            let imgUri = `https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/${understandImg}`
            let [w, h] = await this.getImageSize(imgUri)
            understandImgWidth = w
            understandImgHeight = h
        }
        // let methodImg = explain[3]
        if (methodImg !== "") {
            let imgUri = `https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/${methodImg}`
            let [w, h] = await this.getImageSize(imgUri)
            methodImgWidth = w
            methodImgHeight = h
        }
        // log(`understand: ${understand}, method: ${method}, correctAnswer: ${correctAnswer}`)
        // log(`understandImgWidth1: ${understandImgWidth} understandImgHeight: ${understandImgHeight}`)
        // log(`methodImgWidth1: ${methodImgWidth} methodImgHeight: ${methodImgHeight}`)
        const content = <View>
            {understand !== "" ?
                <TextView value={JSON.parse(understand)} contentStyle={contentStyle}/>
                :
                null
            }
            {understandImg !== "" ?
                <View style={[styles.imgPosition]}>
                    <Image style={[{width: understandImgWidth, height: understandImgHeight}]}
                           source={{uri: `https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/${understandImg}`}}
                           resizeMode="contain"></Image>
                </View>
                :
                null
            }
            {method !== "" ?
                <TextView value={JSON.parse(method)} contentStyle={contentStyle}/>
                :
                null
            }
            {methodImg !== "" ?
                <View style={[styles.imgPosition]}>
                    <Image style={[{width: methodImgWidth, height: methodImgHeight}]}
                           source={{uri: `https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/${methodImg}`}}
                           resizeMode="contain"></Image>
                </View>
                :
                null
            }
            {correctAnswer !== "" ?
                <TextView value={JSON.parse(correctAnswer)} contentStyle={contentStyle}/>
                :
                null
            }
        </View>
        // log("content: ", content)
        await this.setState({
            content
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
            Image.getSize(uri, (imgWidth, imgHeight) => {
                this.setState({
                    content: <View>
                        <RenderHtml source={{html:`${content}`}} tagsStyles={{p: {fontSize: pxToDp(36)}, span: {fontSize: pxToDp(36)}}}/>
                        <View style={[styles.imgPosition]}>
                            <Image style={[{ width:pxToDp(imgWidth) * 1.5,height:pxToDp(imgHeight) * 1.5}]} source={{uri: uri}} resizeMode="contain"></Image>
                        </View>
                        </View>
                })
            })
        } else {
            if (html.startsWith("<p>") === false) {
                html = `<p>${html}</p>`
            }
            this.setState({
                content: <View><RenderHtml source={{html: html}} tagsStyles={{p: {fontSize: pxToDp(36)}, span: {fontSize: pxToDp(36)}}}/></View>
            })
        }
    }

    render() {
        const { content } = this.state
        return (
            <ScrollView style={[styles.content]}>
                {
                    content === null?
                        null
                        :
                        content
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        maxWidth: pxToDp(1750),
        marginTop: pxToDp(120),
        left: pxToDp(70),
        height: Platform.OS === "ios" ? Dimensions.get('window').height * 0.85 - pxToDp(130):  Dimensions.get('window').height * 0.8 - pxToDp(130),
        // top: pxToDp(150),
        // height: 100,
        // height: pxToDp(460)
        flexWrap: "wrap",
        // borderWidth: 1,
        // borderColor: "red",
    },
    questionText: {
        fontSize: pxToDp(35),
        fontWeight: "100",
    },
    imgPosition: {
        left: pxToDp(70),
    },
})

export default ExplainPage
