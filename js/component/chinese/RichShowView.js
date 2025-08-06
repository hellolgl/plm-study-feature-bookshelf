import React, { PureComponent } from 'react';
import {
  Platform,
  useWindowDimensions,
} from 'react-native';
import { pxToDp } from '../../util/tools'
import RenderHtml from "react-native-render-html"
import IDOMParser from 'advanced-html-parser'

const log = console.log.bind(console)

const systemFonts = ['JiangCheng-Pai-Medium','JiangCheng-Pai-Bold']

class RichShowView extends PureComponent {

  constructor(props) {
    super(props);
    this.webview = undefined;
    this.time = 0
  }

  getImgWidth = (html) => {
    const doc = IDOMParser.parse(html)
    try {
      const imgWidth = doc.documentElement.querySelector("img")?.getAttribute("width")
      if (imgWidth === "") {
        return 1
      } else {
        return parseFloat(imgWidth) / 100
      }
    } catch (err) {
      console.error("i catch you.", err);
      return 1
    }
  }

  render() {
    if (!this.props.value) return null
    const {fontIndex} = this.props
    let { value, width } = this.props
    width = width ? width : useWindowDimensions()
    const baseStyle = {
      width: width,

    }
    let tagsStyles = {
      div: {
        fontSize: pxToDp(Platform.OS === "ios" ? 40 : 34),
      },
    }
    if(fontIndex > -1){
      // 有字体
      tagsStyles = {
        div: { fontFamily:systemFonts[fontIndex],fontSize: pxToDp(Platform.OS === "ios" ? 40 : 34) },
        span: {fontFamily:systemFonts[fontIndex]},
        p: {fontFamily:systemFonts[fontIndex]},
      }
    }
    console.log("html: ", value)
    value = value.replaceAll("max-width: 100%;", "")
    value = value.replaceAll("max-width:100%;", "")
    value = value.replaceAll("<p><br/></p>", "")
    value = value.replaceAll("font-size: 1em;", "")

    if (Platform.OS !== "ios") {
      // 安卓端有时显示加粗字体会空白
      value = value.replaceAll('font-weight: bold;', "color: rgb(194, 79, 74)")
    }
    let source = {
      html: `<html>
                   <head>
                   <meta name="viewport" http-equiv="content-type" content="text/html; charset=utf-8; width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
                   </head>
                   <body>
                   <div>${value}</div>
                   </body>
               </html>`
    }

    let imgWidth = this.getImgWidth(source.html)
    console.log('处理后的题干', source.html)
    return (
      <RenderHtml
        source={source}
        contentWidth={width * imgWidth}
        // contentWidth={width * 1}
        tagsStyles={tagsStyles}
        baseStyle={baseStyle}
        systemFonts={systemFonts}
      />
    );
  }
}

export default RichShowView
