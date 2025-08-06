/**
 * 
 * 基于webview的Canvas画布
 */
 import React, { PureComponent } from 'react';
 import {
   StyleSheet,
   View,
 } from 'react-native';
 import { WebView } from "react-native-webview";
 import { connect } from 'react-redux';
 import { pxToDp } from "../../util/tools";
 
 class RichShowView extends PureComponent {
 
   constructor(props) {
     super(props);
     this.state = {
       height: this.props.height||'100%',
       width: this.props.width||'100%',
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
            width
        })
    }
  }
   render() {
    const {height,width} = this.state
    if(!this.props.value || !this.props.value.replace(/\s*/g,"")) return null
    return (
       <View style={[styles.container, { width: this.props.width?this.props.width:width, height, backgroundColor: 'rgba(255,255,255,0)' }]}>
         <WebView
           style={{ width: this.props.width?this.props.width:width ,height, backgroundColor: 'rgba(255,255,255,0)' }}
           ref={(w) => { this.webview = w }}
           source={{ html:  
              `<html>
                   <head>
                   <title>canvas</title>
                   <meta name="viewport" content="width=device-width, initial-scale=1">
                   <style>
                   *{
                     margin: 0;
                     padding: 0;
                     backgroundColor:'rgba(255,255,255,0)';
                   }
                   div{
                    ${this.props.divStyle}
                   }  
                   p{
                    ${this.props.pStyle}
                   }
                   span{
                    ${this.props.spanStyle}
                   }  
                   img{
                    ${this.props.imgStyle}
                   }                 
                 </style>
                   </head> 
                   <body>
                   <div class='tour_product_explain' id='content'>${this.props.value}</div>
                   <script>
                    var interval = setInterval(() => { 
                      let height = document.getElementById("content").clientHeight
                      let width = document.getElementById("content").clientWidth
                      let data =  width+"#"+height
                      window.ReactNativeWebView.postMessage(data)
                    }, 200)
                    function onMessage(data){
                        clearInterval(interval)
                    }
                   </script>
                   </body>
               </html>
               ` }}
           onMessage={this.messageHandler.bind(this)}
           javaScriptEnabled={true}
           domStorageEnabled={true}
           automaticallyAdjustContentInsets={true}
           scalesPageToFit={false}
           androidHardwareAccelerationDisabled //防止安卓端闪退
         />
       </View>
     );
   }
 }
 
 const styles = StyleSheet.create({
   container: {
     alignItems: 'flex-start',
   },
 });
 
 
 const mapStateToProps = (state) => {
   return {
   }
 }
 
 const mapDispathToProps = (dispatch) => {
   return {
 
   }
 }
 
 export default connect(mapStateToProps, mapDispathToProps)(RichShowView)
 