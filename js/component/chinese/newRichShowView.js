import React, { PureComponent, Component } from "react";
import {
    StyleSheet,
    View,
    Platform,
    useWindowDimensions,
    Text,
} from "react-native";
import { WebView } from "react-native-webview";
import { connect } from "react-redux";
import { pxToDp, pxToDpHeight } from "../../util/tools";
import RenderHtml from "react-native-render-html";
import IDOMParser from "advanced-html-parser";
import _ from "lodash";

const log = console.log.bind(console);
const SIZE_MAP = {
    1: pxToDpHeight(40),
    2: pxToDpHeight(50),
    3: pxToDpHeight(35),
    4: pxToDpHeight(60),
    5: pxToDpHeight(Platform.OS === "ios" ? 37 : 45),
    6: pxToDp(40),
};

class RichShowView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            height: this.props.height || "100%",
            width: this.props.width || "100%",
        };
        this.webview = undefined;
        this.time = 0;
    }

    componentWillUnmount() {
        this._init();
    }

    _init = () => {
        this.time = 0;
        if (this.webview) this.webview?.injectJavaScript(`onMessage()`);
    };

    messageHandler(e) {
        if (this.time === 5) {
            this._init();
        } else {
            // console.log("e.nativeEvent.data this.state.height", e.nativeEvent.data);
            if (this.props.height) {
                this._init();
                return;
            }
            let data = e.nativeEvent.data;
            let width = +data.split("#")[0];
            let height = +data.split("#")[1];
            this.time++;
            this.setState({
                height: height + 8,  //字体变化的时候计算的高度，可能不够高，手动增加一些
                width: width + 8, //左边遮挡
            });
        }
    }

    getImgWidth = (html) => {
        const doc = IDOMParser.parse(html);
        try {
            const imgWidth = doc.documentElement
                .querySelector("img")
                .getAttribute("width");
            if (imgWidth === "") {
                return 1;
            } else {
                return parseFloat(imgWidth) / 100;
            }
        } catch (err) {
            console.error("i catch you.", err);
            return 1;
        }
    };

    render() {
        if (!this.props.value) return null;
        let { width, height } = this.state;
        const customFontFamily = _.get(this.props, "fontFamily", "siyuansongti");
        const siyuanFontUri = Platform.select({
            ios: "SourceHanSerifSC-Regular.ttf",
            android: "file:///android_asset/fonts/SourceHanSerifSC-Regular.ttf",
        });
        const jiangchengFontUri = Platform.select({
            ios: "JiangChengYuanTi-500W.ttf",
            android: "file:///android_asset/fonts/JiangChengYuanTi-500W.ttf",
        });

        const maxHeight = 860;
        let renderContent;
        let { value, size } = this.props;
        let fontSize_style = "";
        if (size) {
            fontSize_style = _.get(SIZE_MAP, size, pxToDp(34));
        }
        // console.log("字体大小", fontSize_style);
        value = value.replaceAll(
            `<span style="font-weight: bold;"><br/></span>`,
            ""
        );
        value = value.replaceAll(`<br/></p>`, "</p>");
        value = value
            .replaceAll("font-size: 1em;", "")
            .replaceAll("<p><o:p></o:p></p>", "")
            .replaceAll("-webkit-text-size-adjust: 100%;", "");
        value = value
            .replaceAll(`<font`, `<span`)
            .replaceAll(`</font`, "</span")
            .replaceAll(` color="#c24f4a"`, ' style="color:rgb(194, 79, 74)";')
            // .replaceAll("<br/>", "")
            .replaceAll(
                "font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;;",
                ""
            );
        // console.log("will render data: ", value);
        if (value.includes("<ruby>") === false || height > maxHeight) {
            if (!this.props.value) return null;
            let { width } = this.props;
            // width = width ? width : useWindowDimensions();
            width = width ? width : "100%";
            // console.log("宽度", width);
            const baseStyle = {
                width: width,
            };

            value = value.replaceAll("max-width: 100%;", "");
            value = value.replaceAll("max-width:100%;", "");
            value = value.replaceAll("<p><br/></p>", "");
            value = value.replaceAll("font-size:1em;", "");
            value = value
                .replaceAll(`<br>`, "")
                .replaceAll("<p><br></p>", "")
                .replaceAll("<p></p>", "")
                .replaceAll('<p><span style="font-weight: bold;"></span></p>', "")
                .replaceAll("font-style: italic;", "")
                .replaceAll("font-weight: 700;", "")
                .replaceAll(`<strong><br/></strong>`, "")
                .replaceAll(`<p style="text-align:center;"></p>`, "");
            // console.log("source123:value ", value);

            // '<p><span style=\"color: rgb(194, 79, 74)\"><br></span></p>'
            // value = value.replaceAll("font-weight: bold;", "");
            if (Platform.OS !== "ios") {
                // 安卓端有时显示加粗字体会空白
                //style="color: rgb(0, 0, 0);
                value = value
                    .replaceAll("font-weight: bold;", "")
                    .replaceAll("<b>", "")
                    .replaceAll("</b>", "")
                    .replaceAll(`<strong>`, ``)
                    .replaceAll(`</strong>`, ``);
            }
            let source = {
                html: `<div >${value}</div>`,
            };
            const systemFontsMap = {
                siyuansongti: "SourceHanSerifSC-Regular",
                jiangchengyuanti: "JiangChengYuanTi-500W",
            };
            const fontFamily = systemFontsMap[customFontFamily];
            let tagsStyles = {
                div: {
                    fontSize: fontSize_style
                        ? fontSize_style
                        : pxToDp(Platform.OS === "ios" ? 40 : 34),
                    fontFamily: fontFamily,
                    lineHeight: fontSize_style ? fontSize_style + pxToDp(20) : pxToDp(50),
                },
                span: { fontFamily: fontFamily },
                p: { fontFamily: fontFamily },
            };
            let imgWidth = this.getImgWidth(source.html);
            renderContent = (
                <RenderHtml
                    source={source}
                    contentWidth={width * imgWidth}
                    tagsStyles={tagsStyles}
                    baseStyle={baseStyle}
                    systemFonts={Object.values(systemFontsMap)}
                />
            );
        } else {
            try {
                if (
                    value.includes("<rp>(</rp>") ||
                    value.includes("……") ||
                    value.includes("text-align:center") ||
                    value.includes("<rt>")
                ) {
                    value = value.replaceAll("<rt>", "<rt>&nbsp;");
                    value = value.replaceAll("</rt>", "&nbsp;<rt>");
                } else {
                    const doc = IDOMParser.parse(`<div>${value}</div>`);
                    let rubyElements = doc.documentElement.querySelectorAll("ruby");
                    for (let i = 0; i < rubyElements.length; i++) {
                        const rubyElement = rubyElements[i];
                        const rtElements = rubyElement.getElementsByTagName("rt");

                        let text = "";
                        let pinyinList;
                        for (let j = 0; j < rtElements.length; j++) {
                            const t = rtElements[j].textContent;
                            text += rtElements[j].textContent.trim();
                            pinyinList = t.split(" ");
                        }
                        const t = rubyElement.textContent;
                        rubyElement.innerHTML = "";
                        const wordList = t.slice(0, pinyinList.length).split("");
                        const spanElement = doc.createElement("span");
                        for (let j = 0; j < pinyinList.length; j++) {
                            const pinyin = pinyinList[j];
                            const word = wordList[j];
                            const newRubyElement = doc.createElement("ruby");
                            newRubyElement.setAttribute("style", "margin-right:10px;");
                            const newRtElement = doc.createElement("rt");
                            newRtElement.textContent = ` ${pinyin} `;
                            newRubyElement.textContent = word;
                            // 清空原有内容
                            newRubyElement.appendChild(newRtElement);
                            spanElement.appendChild(newRubyElement);
                        }
                        doc.replaceChild(spanElement, rubyElement);
                        value = doc.toString();
                    }
                }
                console.log("filter value: ", value);
            } catch (err) {
                console.log("error: ", err);
                value = value.replaceAll("<rt>", "<rt>&nbsp;");
                value = value.replaceAll("</rt>", "&nbsp;</rt>");
            }
            renderContent = (
                <View
                    style={[
                        styles.container,
                        {
                            width: this.props.width ? this.props.width : width,
                            height,
                            backgroundColor: "rgba(255,0,0,0)",
                        },
                    ]}
                >
                    <WebView
                        style={{
                            width: this.props.width ? this.props.width : width,
                            height,
                            backgroundColor: "rgba(255,255,255,0)",
                            // backgroundColor: "pink",
                        }}
                        ref={(w) => {
                            this.webview = w;
                        }}
                        source={{
                            html: `<html>
                   <head>
                   <meta name="viewport" http-equiv="content-type" content="text/html; charset=utf-8; width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
                   <style type="text/css">
                      *{
                        margin: 0;
                        padding: 0;
                        backgroundColor:'rgba(255,255,255,0)';
                      }
                      @font-face {
                        font-family:'siyuansongti';
                        src: local('SourceHanSerifSC-Regular'), url('${siyuanFontUri}') format('truetype');
                      }
                      @font-face {
                        font-family:'jiangchengyuanti';
                        src: local('JiangChengYuanTi-500W'), url('${jiangchengFontUri}') format('truetype');
                      }
                      div{
                        font-size: ${fontSize_style};
                        font-family: ${customFontFamily};
                        ${this.props.divStyle}

                      }
                      p{
                        font-size: ${fontSize_style};
                        font-family: ${customFontFamily};
                        ${this.props.pStyle}
                      }
                      span{
                        font-size: ${fontSize_style};
                        font-family: ${customFontFamily};
                        ${this.props.spanStyle}
                      }
                      ruby {
                        ruby-align: space-around;
                       }
                      rt{
                        font-size: ${pxToDp(Platform.OS === "ios" ? 45 : 35)};
                      }
                  </style>
                   </head>
                   <body>
                   <div class='tour_product_explain' id='content'>${value}</div>
                   <script>
                    var interval = setInterval(() => {
                      let height = document.getElementById("content").clientHeight
                      let width = document.getElementById("content").clientWidth
                      let data =  width+"#"+height
                      window.ReactNativeWebView.postMessage(data)
                    }, 300)
                    function onMessage(data){
                        clearInterval(interval)
                    }
                   </script>
                   </body>
               </html>
               `,
                            baseUrl: "",
                        }}
                        onMessage={this.messageHandler.bind(this)}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        automaticallyAdjustContentInsets={true}
                        scalesPageToFit={false}
                        useWebKit={true}
                        originWhitelist={["*"]}
                        androidHardwareAccelerationDisabled //防止安卓端闪退
                        androidLayerType="hardware"
                        webviewDebuggingEnabled={true}
                    // cacheEnabled={true}
                    />
                </View>
            );
        }
        return <View>{renderContent}</View>;
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "flex-start",
    },
});

const mapStateToProps = (state) => {
    return {};
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(RichShowView);
