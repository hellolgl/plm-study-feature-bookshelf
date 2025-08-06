/**
 *
 * 基于webview的Canvas画布
 */
 import React, { PureComponent, Component } from 'react';
 import {
     StyleSheet,
     View,
     Platform,
     Text
 } from 'react-native';
 import { WebView } from "react-native-webview";
 import { pxToDp} from '../../util/tools'

 const SIZE_MAP = {
     36:Math.round(pxToDp(36)),
     28:Math.round(pxToDp(28)),
     40:Math.round(pxToDp(40)),
 }

 const FAMILY_MAP = {
  500:{
    ios: "JiangChengYuanTi-500W.ttf",
    android: "file:///android_asset/fonts/JiangChengYuanTi-500W.ttf",
  },
  700:{
    ios: "JiangChengYuanTi-700W.ttf",
    android: "file:///android_asset/fonts/JiangChengYuanTi-700W.ttf",
  },
 }

 class RichShowView extends PureComponent {

     constructor(props) {
         super(props);
         this.state = {
             height:  0,
             width:'100%',
         }
         this.webview = undefined;
         this.time = 0

     }

     componentWillUnmount() {
         this._init()
     }

     _init = () => {
         this.time = 0
         if(this.webview) this.webview.injectJavaScript(`onMessage()`)
     }

     messageHandler(e) {
         if (this.time === 5) {
             this._init()
         } else {
             //  console.log('e.nativeEvent.data this.state.height',e.nativeEvent.data )
             let data = e.nativeEvent.data
             let width = + data.split('#')[0]
             let height = + data.split('#')[1]
             this.time++
             this.setState({
                 height,
             })
         }
     }

     render() {
         //  console.log('RichShowView render————————————————————————————————————————',this.props.value)
         const {value,width,size,family,color} = this.props
         if (!value) return null
         let v = value.replace(/\s+style="[^"]*"/g, '')
         let fontUrl = Platform.select(FAMILY_MAP[500]);
         if(family) fontUrl = Platform.select(FAMILY_MAP[family]);
         let fontSize_style = SIZE_MAP[36]
         if(size) fontSize_style = SIZE_MAP[size]
         const {height} = this.state
         let h = height
         const maxHeight = 1130
         if (Platform.OS === "android") {
             if (height > maxHeight) {
                 h = maxHeight
             }
         }
         return (
             <WebView
                 style={{ width: width?width:this.state.width, height: h,backgroundColor:'rgba(255,255,255,0)'}}
                 ref={(w) => { this.webview = w }}
                 source={{
                     html:
                         `<html>
                         <head>
                             
                             <style type="text/css">
                                 *{
                                     margin: 0;
                                     padding: 0;
                                     backgroundColor:'rgba(255,255,255,0)';
                                 }
                                 @font-face {
                                     font-family:'JiangChengYuanTi';
                                     src: local('JiangChengYuanTi'), url('${fontUrl}') format('truetype');
                                 }
                                 div{
                                     font-family:'JiangChengYuanTi';
                                     font-size: ${fontSize_style};
                                     color:${color?color:'#4C4C59'};
                                     ${this.props.divStyle};
                                 }  
                                 p{
                                     font-family:'JiangChengYuanTi';
                                     font-size: ${fontSize_style};
                                     color:${color?color:'#4C4C59'};
                                     line-height:1.4;
                                     ${this.props.pStyle};
                                 }
                                 span{
                                     font-family:'JiangChengYuanTi';
                                     font-size: ${fontSize_style};
                                     color:${color?color:'#4C4C59'};
                                     ${this.props.spanStyle};
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
                             }, 300)
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
                 originWhitelist={['*']}
                 androidHardwareAccelerationDisabled    //防止安卓闪退
             />
         );
     }
 }



 export default RichShowView
