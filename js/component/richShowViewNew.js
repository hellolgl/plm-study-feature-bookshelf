/**
 *
 * 基于webview的Canvas画布
 */
import React, { PureComponent, Component } from "react";
import { StyleSheet, View, Platform, Text } from "react-native";
import { WebView } from "react-native-webview";
import {
    // isURL,
    log,
    pxToDpHeight,
} from "../util/tools";

const SIZE_MAP = {
    1: pxToDpHeight(40),
    2: pxToDpHeight(50),
    3: pxToDpHeight(35),
    4: pxToDpHeight(60),
};

class RichShowView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            width: "100%",
        };
        this.webview = undefined;
        this.time = 0;
    }

    componentWillUnmount() {
        this._init();
    }

    _init = () => {
        this.time = 0;
        if (this.webview) this.webview.injectJavaScript(`onMessage()`);
    };

    // onShouldStartLoadWithRequest = (e) => {
    //     const { url } = e
    //     // console.log('*************',url)
    //     if (url === 'about:blank') return true
    //     if (isURL(url)) {
    //         if (this.props.goWeb) this.props.goWeb(url)
    //         return false
    //     } else {
    //         return true
    //     }
    // }

    messageHandler(e) {
        if (this.time === 5) {
            this._init();
        } else {
            // console.log('e.nativeEvent.data this.state.height', e.nativeEvent.data)
            let data = e.nativeEvent.data;
            let width = +data.split("#")[0];
            let height = +data.split("#")[1];
            // console.log('e.nativeEvent.data this.state.height', height)
            this.time++;
            this.setState({
                height,
                width,
            });
        }
    }

    filter = (v) => {
        let _v = v;
        const replaceArr = [
            ["<rp>(", "<rp>"],
            [")</rp>", "</rp>"],
        ];

        for (let i = 0; i < replaceArr.length; i++) {
            const r = replaceArr[i];
            _v = _v.replaceAll(r[0], r[1]);
        }
        return _v;
    };

    render() {
        //  console.log('RichShowView render————————————————————————————————————————',this.props.value)
        const { value, width, size, height } = this.props;
        if (!value) return null;
        const fontUrl = Platform.select({
            ios: [
                "SourceHanSerifSC-Regular.ttf",
                "1574320058.ttf",
                "JiangCheng-Pai-Medium.ttf",
                "JiangCheng-Pai-Bold.ttf",
            ],
            android: [
                "file:///android_asset/fonts/SourceHanSerifCN-Regular.ttf",
                "file:///android_asset/fonts/1574320058.ttf",
                "file:///android_asset/fonts/JiangCheng-Pai-Medium.ttf",
                "file:///android_asset/fonts/JiangCheng-Pai-Bold.ttf",
            ],
        });
        let fontSize_style = "";
        if (size) {
            fontSize_style = SIZE_MAP[size];
        }
        const v = this.filter(value);
        // console.log("vvv: ", v);
        return (
            <WebView
                style={{
                    width: width ? width : this.state.width,
                    height: this.state.height,
                    backgroundColor: "rgba(0,255,255,0)",
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
                                     src: local('siyuansongti'), url('${fontUrl[0]}') format('truetype');
                                 }
                                 @font-face {
                                     font-family:'jiangchengyuanti';
                                     src: local('jiangchengyuanti'), url('${fontUrl[2]}') format('truetype');
                                 }
                                 @font-face {
                                     font-family:'pinyin';
                                     src: local('1574320058'), url('${fontUrl[1]}') format('truetype');
                                 }
                                 @font-face {
                                    font-family:'jiangchengyuantiBold';
                                    src: local('jiangchengyuanti'), url('${fontUrl[3]}') format('truetype');
                                }

                                 div{
                                     ${this.props.divStyle};
                                     font-family:'siyuansongti';
                                     font-size: ${fontSize_style};
                                 }
                                 p{
                                     ${this.props.pStyle};
                                     font-family:'siyuansongti';
                                     font-size: ${fontSize_style};
                                 }
                                 span{
                                     ${this.props.spanStyle};
                                     font-family:'siyuansongti';
                                     font-size: ${fontSize_style};
                                 }
                                 ruby{
                                     font-family:'siyuansongti';
                                     font-size: ${fontSize_style};
                                 }
                                 rt{
                                   font-family:'siyuansongti';
                                   font-size: ${fontSize_style};
                                 }
                                 #content span{
                                     ${this.props.otherStyle}
                                 }
                                 #content p{
                                     ${this.props.otherStyle}
                                 }
                                 #content {
                                     ${this.props.containerStyle}
                                 }
                                 #jiangchengyuanti{
                                     font-family:'pinyin';
                                 }
                                 #jiangchengyuanti p{
                                     font-family:'pinyin';
                                 }
                                 #jiangchengyuanti ruby{
                                     font-family:'pinyin';
                                 }
                                 #jiangchengyuanti rt{
                                     font-family:'pinyin';
                                 }
                                 #jiangchengyuanti span{
                                     font-family:'pinyin';
                                 }

                                 #yuanti{
                                    font-family:'jiangchengyuanti';
                                    line-height:50px;
                                }
                                #yuanti p{
                                    font-family:'jiangchengyuanti';
                                    line-height:50px;
                                }
                                #yuanti ruby{
                                    font-family:'jiangchengyuanti';
                                    line-height:50px;
                                }
                                #yuanti rt{
                                    font-family:'jiangchengyuanti';
                                    line-height:50px;
                                }
                                #yuanti span{
                                    font-family:'jiangchengyuanti';
                                    line-height:50px
                                }

                                #yuantiBold{
                                    font-family:'jiangchengyuantiBold';
                                }
                                #yuantiBold p{
                                    font-family:'jiangchengyuantiBold';
                                }
                                #yuantiBold ruby{
                                    font-family:'jiangchengyuantiBold';
                                }
                                #yuantiBold rt{
                                    font-family:'jiangchengyuantiBold';
                                }
                                #yuantiBold span{
                                    font-family:'jiangchengyuantiBold';
                                }




                             </style>
                         </head>
                         <body>
                             <div id='content'>${v}</div>
                             <script>
                             var interval = setInterval(() => {
                                 let height = document.getElementById("content").clientHeight
                                 let width = document.getElementById("content").clientWidth
                                 let data =  width+"#"+height
                                 window.ReactNativeWebView.postMessage(data)
                             }, 500)
                             function onMessage(data){
                                 clearInterval(interval)
                             }
                             </script>
                         </body>
                     </html>`,
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
            // onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "flex-start",
    },
    reset: {
        width: 120,
        height: 40,
        alignContent: "center",
        marginEnd: 5,
    },
});

export default RichShowView;
