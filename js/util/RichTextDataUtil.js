/**
 * 
 * 基于webview的Canvas画布
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,

} from 'react-native';
import { WebView } from "react-native-webview";
import { connect } from 'react-redux';


var html =
  `<html>
<head>
  <title>canvas</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="http://www.jq22.com/jquery/jquery-1.10.2.js"></script>
  <style>
    *{
      margin: 0;
      padding: 0;
      backgroundColor:'rgba(255,255,255,0)';
    }
    #can{
      cursor: crosshair;
      // background:transparent;
      // background:rgba(255,255,255,0);
      z-index:1;
    }
    
  </style>
</head> 
<body>
  <div id='can'>
    您的浏览器不支持canvas
  </div>
  <script>
    var $can = $('#can')
    var _width,_height;
    window.document.addEventListener('message', function (e){
        // alert('message')
        var obj = JSON.parse(e.data);
        switch (parseInt(obj.action)){
          case 4:
              /* url */
              createImg(obj.data);
              break;
          case 1:
              /* url */
              addImgNode(obj.data);
              break;
      
        }
    });

    function createImg(data){
      var img = new Image();
      img.src = data;
      // img.crossOrigin = '*';
      img.onload = function (){
        // alert('img onload')
        var width = img.naturalWidth;
        var height = img.naturalHeight;
        can = $can[0];
        ctx = can.getContext("2d");
        ctx.drawImage(img, 0, 0, _width, _height);
      };
      // $(img).attr('src', data);
    }

    function addImgNode(node){
      // alert('node')
      var $div = node;
      $('#can').append($div); //将新创建的div节点插入到nav容器的内容顶部
      // alert($('img').attr('src'))
      window.ReactNativeWebView.postMessage(JSON.stringify({action: 1, data: $('img').attr('src')}));
    }
    
  </script>
</body>
</html>
`;

var _width, _height;
class RichTextDataUtil extends Component {

  constructor(props) {
    super(props);
    this.state = {
      height: this.props.height,
      width: this.props.width,
    }
    this.webview = {};
    this.lastX = 0;
    this.lastY = 0;

  }
  componentDidMount() {
    //console.log('RichTextDataUtil Didmount')
    this.props.onRef(this)
  }

  componentDidUpdate() {

  }

  // 以url的形式添加背景
  _addImageUrl = (data) => {
    //console.log('canvas添加图片',data)
    this.post({ action: 4, data: data })
  }

  _addImageNode = (data) => {
    //console.log('RichTextDataUtil添加图片节点',data)
    if (!data) return
    var imgReg = /<img [^>]*src=['"]([^'"]+)[^>]*>/gi;
    let imgUrl = data.match(imgReg)
    //console.log('RichTextDataUtil添加图片节点 imgUrl',imgUrl)
    this.post({ action: 1, data: data })
  }

  post(obj) {
    if(this.webview && this.webview.postMessage) this.webview.postMessage(JSON.stringify(obj));
  }

  webviewload() {
    this.webview.injectJavaScript('init_canvas(' + this.props.width + ', ' + this.props.height + ');');
    if (this.props.onLoad) {
      this.props.onLoad();
    }
  }



  messageHandler(e) {
    // console.log('nativeEvent',e)
    var obj = JSON.parse(e.nativeEvent.data);
    // console.log('nativeEventData',obj)
    if (obj.action == 1) {
      if (this.props.getImgRichSrc) {
        this.props.getImgRichSrc(obj.data);
      }
    }
  }
  nextTopaic = () => {
    //console.log('webcanvas','下一题')
    // this._canvasData();  
  }

  render() {
    const INJECTED_JAVASCRIPT = `(function() {
      // This is the important part!
      if (!window.ReactNativeWebView) {
        window.ReactNativeWebView = window['ReactABI33_0_0NativeWebView'];
      }
      // End of the important part! Now continue using it as usual
  
      window.ReactNativeWebView.postMessage(JSON.stringify(window.location));
      })();`;
    return (
      <View style={[styles.container, { width: this.props.width, height: this.props.height, backgroundColor: 'rgba(255,255,255,0)', marginTop: 10 }]}>
        <WebView
          injectedJavaScript={INJECTED_JAVASCRIPT}
          style={{ width: this.props.width, height: this.props.height, backgroundColor: 'rgba(255,255,255,0)' }}
          ref={(w) => { this.webview = w }}
          onLoad={this.webviewload.bind(this)}
          source={{ html: html }}
          onMessage={this.messageHandler.bind(this)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          automaticallyAdjustContentInsets={true}
          scalesPageToFit={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  reset: {
    width: 120,
    height: 40,
    alignContent: 'center',
    marginEnd: 5
  }
});


const mapStateToProps = (state) => {
  return {
    currentTopaicData: state.getIn(['deskMath', 'currentTopaicData']),
  }
}

const mapDispathToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispathToProps)(RichTextDataUtil)
