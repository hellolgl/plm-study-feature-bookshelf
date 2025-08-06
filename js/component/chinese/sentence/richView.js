import React, { useRef, useState } from 'react'
import { View, Platform, Text } from 'react-native';
import { WebView } from "react-native-webview";
import {
    // isURL,
    log, pxToDpHeight
} from '../../../util/tools'

const SIZE_MAP = {
    1: pxToDpHeight(40),
    2: pxToDpHeight(50),
    3: pxToDpHeight(35),
    4: pxToDpHeight(60),
    5: pxToDpHeight(37),
}

const WebViewWithAutoHeight = ({ value, size }) => {
    const [contentHeight, setContentHeight] = useState(0);
    const webview = useRef()

    const handleMessage = event => {
        if (event.nativeEvent.data) {
            const height = parseInt(event.nativeEvent.data.split('#')[1], 10);
            // const height = parseInt(event.nativeEvent.data, 10);
            if (height > 0 && height !== contentHeight) {
                console.log('高度', event.nativeEvent.data, height)
                // setContentHeight(height > 1320 ? 1320 : height);
                setContentHeight(height);

                if (webview) {
                    // console.log("run clear....")
                    webview.current?.injectJavaScript("onMessage()")
                }
            }
        }
    };

    const fontUrl = Platform.select({
        ios: ["SourceHanSerifSC-Regular.ttf",
            "1574320058.ttf",
            "JiangCheng-Pai-Medium.ttf",
        ],
        android: ["file:///android_asset/fonts/SourceHanSerifCN-Regular.ttf",
            "file:///android_asset/fonts/1574320058.ttf",
            "file:///android_asset/fonts/JiangCheng-Pai-Medium.ttf",
        ],
    });
    let fontSize_style = ''
    if (size) {
        fontSize_style = SIZE_MAP[size]
    }

    return (
        <View style={{ height: 1330 }}>
            {console.log('现在的高度!!!!!!', contentHeight)}
            <WebView
                ref={webview}
                source={{
                    html:
                        `<html>
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
                                
                                 div{
                                     font-family:'siyuansongti';
                                     font-size: ${fontSize_style};
                                 }  
                                 p{
                                     font-family:'siyuansongti';
                                     font-size: ${fontSize_style};
                                 }
                                 span{
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
                                 }  
                                 #content p{
                                 }      
                                 #content {
                                 } 
                                /* #jiangchengyuanti{*/
                                /*     font-family:'pinyin';*/
                                /* }*/
                                /* #jiangchengyuanti p{*/
                                /*     font-family:'pinyin';*/
                                /* }*/
                                /* #jiangchengyuanti ruby{*/
                                /*     font-family:'pinyin';*/
                                /* }*/
                                /* #jiangchengyuanti rt{*/
                                /*     font-family:'pinyin';*/
                                /* }*/
                                /* #jiangchengyuanti span{*/
                                /*     font-family:'pinyin';*/
                                /* }  */
                                /* */
                                /* #yuanti{*/
                                /*    font-family:'siyuansongti';*/
                                /*}*/
                                /*#yuanti p{*/
                                /*    font-family:'siyuansongti';*/
                                /*}*/
                                /*#yuanti ruby{*/
                                /*    font-family:'siyuansongti';*/
                                /*}*/
                                /*#yuanti rt{*/
                                /*    font-family:'siyuansongti';*/
                                /*}*/
                                /*#yuanti span{*/
                                /*    font-family:'siyuansongti';*/
                                /*}  */
                                 
                             </style>
                         </head> 
                         <body>
                             <div id='content'>${value}</div>
                             <script>
                             var interval = setInterval(() => { 
                                 let height = document.getElementById("content").clientHeight
                                 // let height = document.documentElement.scrollHeight
                                 // let width = document.getElementById("content").clientWidth
                                 let width = 0
                                 let data =  width+"#"+height
                                 window.ReactNativeWebView.postMessage(data)
                             }, 500)
                             function onMessage(){
								 // console.log("webview run clear....")
                                 clearInterval(interval)
                             }
                             </script>
                         </body>
                     </html>`,
                    baseUrl: "",
                }}
                onMessage={handleMessage}
                domStorageEnabled={false}
                scalesPageToFit={false}
                useWebKit={true}
                originWhitelist={['*']}
                style={{ opacity: 0.99, height: 1000 }}
                cacheEnabled={false} // 禁用缓存
                cacheMode="LOAD_NO_CACHE"
                incognito={Platform.OS !== 'ios'}
                androidHardwareAccelerationDisabled
            // androidHardwareAccelerationDisabled //防止安卓端闪退
            // injectedJavaScript={`window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight);`}
            // injectedJavaScript={`window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight);`}
            />
        </View>
    );
};

export default WebViewWithAutoHeight;
