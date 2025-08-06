/**
 * 
 * 基于webview的Canvas画布
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native';
import { WebView } from "react-native-webview";
import { connect } from 'react-redux';
import { getYuwenPicTopaicUrl } from '../commonUtils'
import UsbDataUtil from './UsbDataUtil'
import types from '../../res/data/YuwenTopaicType'

var html =
  `<html>
<head>
  <title>canvas</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="referrer" content="never">
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
  <canvas id='can'>
    您的浏览器不支持canvas
  </canvas>
  <script>
    var $can = $('#can'),isclean=false,drawState=false,lastX,lastY,ctx;
    var _width,_height;
    var ox;
    var oy;
    var ox2;
    var oy2;
    let toServeX = new Array();
    let toServeY = new Array();
    let toServeXY = new Array();
    window.document.addEventListener('message', function (e){
        // alert('message')
        var obj = JSON.parse(e.data);
        switch (parseInt(obj.action)){
          case 1:
              /* 铅笔 */
              isclean=false;
              break;
          case 2:
              /* 橡皮 */
              isclean=true;
              break;
          case 3:
              /* 右转 */
              rotateRight();
              break;
          case 4:
              /* url */
              createImg(obj.data);
              break;
          case 5:
              /* case64 */
              createImg(obj.data);
              break;
          case 6:
              getCanvasData();
              break;
          case 7:
              drawUsbData(obj.data.lastX,obj.data.lastY,obj.data.x,obj.data.y,obj.data.pressure,obj.data.count);
              break;
          case 8:
              registDraw();
              break;
          case 9:
              removeDraw()
              break;
          case 10:
              getPadCanvasData()
              break;
          case 11:
              createImgYueDuHuaXian(obj.data)
                break;         
          case 0:
              /* 返回base64 */
              returnBase64();
              break;
          case -1:
              /* 初始化画板 */
              ctx.clearRect(0,0, _width, _height)
              toServeXY = []
              // alert('init')
              break;
        }
    });

    function init_canvas(width,height){
      _width = width;
      _height = height;
      $can.attr('width', width);
      $can.attr('height', height);
      ctx = $can[0].getContext("2d");
      ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    }

    function touchstartFuc(e){
      e = e.originalEvent.touches[0];
      ox2 = e.screenX;
      oy2 = e.screenY;
      drawState = true;
      var x = e.clientX -  $can.offset().left;
      var y = e.clientY -  $can.offset().top + $(document).scrollTop();
      lastX = x;
      lastY = y;  
      toServeY = new Array();
      toServeX = new Array();
      toServeX.push(x)
      toServeY.push(y)
      draw(x, y, true, isclean);
      return false;
    }

    function touchmoveFuc(ev){
      e = ev.originalEvent.touches[0];
      if (drawState){
          if (lastX == null || lastY == null ){
              $can.lastX = $can.lastY = null;
              lastX = e.clientX - $can.offset().left;
              lastY = e.clientY - $can.offset().top + $(document).scrollTop();
          }
          draw(e.clientX - $can.offset().left, 
              e.clientY - $can.offset().top + $(document).scrollTop(),true,isclean);
          return false;
      }
      return false;
    }

    function touchendFuc(e){
      drawState = false;
      if(toServeX.length > 0){
        toServeXY.push([toServeX,toServeY]) 
      }
    }
    
    function removeDraw(){
      $can.off("touchstart", touchstartFuc);
      $can.off("touchmove", touchmoveFuc);
      $(document).off("touchend", touchendFuc);
      // alert('removeDraw')
    }

    function registDraw(){ 
        removeDraw() //在绑定钱先解绑否则会造成返回多组重复数据
        $can.on("touchstart", touchstartFuc);
        $can.on("touchmove", touchmoveFuc);
        $(document).on("touchend", touchendFuc);
        // alert('registDraw')
    };

    function draw(x, y, isDown, isclean){
        if (isDown) {
            ctx.globalCompositeOperation = isclean ? "destination-out" : "source-over";
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = isclean ? 30 : 8;
            ctx.lineJoin = "round";
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
            toServeX.push(x)
            toServeY.push(y)
        }
        lastX = x;
        lastY = y;
    };

    /* 旋转 */
    function rotateRight(){
        var obj = ctx.getImageData(0,0,_width, _height);
        var new_obj = ctx.createImageData(obj.height, obj.width);
        var num = 0;
        for (var j=0;j<obj.width;j++){
            for (var i=obj.height;i>0;i--){
                new_obj.data[num++] = obj.data[(j + obj.width*(i-1))*4];
                new_obj.data[num++] = obj.data[(j + obj.width*(i-1))*4+1];
                new_obj.data[num++] = obj.data[(j + obj.width*(i-1))*4+2];
                new_obj.data[num++] = obj.data[(j + obj.width*(i-1))*4+3];
            }
        }
        _width = new_obj.width;
        _height = new_obj.height;
        $can.attr("width", this.width);
        $can.attr("height",this.height);
        ctx.clearRect(0,0,this.width,this.height);  
        ctx.putImageData(new_obj, 0, 0);
    };

    function createImg(data){
      var img = new Image();
      // img.crossOrigin = '*';
      img.src = data;
    
      img.onload = function (){ 
        // alert(data)
        var width = img.naturalWidth;
        var height = img.naturalHeight;
        can = $can[0];
        ctx = can.getContext("2d");
        ctx.drawImage(img, 60, 115, 850, 150);
      };
      // $(img).attr('src', data);
    }

    function createImgYueDuHuaXian(data){
      var img = new Image();
      // img.crossOrigin = '*';
      img.src = data;
    
      img.onload = function (){ 
        // alert(data)
        var width = img.naturalWidth;
        var height = img.naturalHeight;
        can = $can[0];
        ctx = can.getContext("2d");
        ctx.drawImage(img, 30, 200, 600, 300);
      };
      // $(img).attr('src', data);
    }

    function imageData2base64(imgdata){
        var can = $("<canvas>").attr("width", imgdata.width).attr("height", imgdata.height);
        can = can[0];
        var ctx = can.getContext("2d");
        ctx.putImageData(imgdata, 0, 0);
        return can.toDataURL();
    }

    /*
        保存图片功能，将图片保存成一张图片并返回base64
    */
    function saveAsBase64(){
        var obj = this.ctx_img.getImageData(0,0,this.width, this.height);
        var obj2 = this.ctx_edit.getImageData(0,0,this.width, this.height);
        var new_obj = this.ctx_img.createImageData(this.width, this.height);
        var len = obj2.data.length / 4;
        for(var i=0;i<len;i++){
            if (obj2.data[i*4+3] != 0){
                new_obj.data[i*4] = obj2.data[i*4];
                new_obj.data[i*4+1] = obj2.data[i*4+1];
                new_obj.data[i*4+2] = obj2.data[i*4+2];
                new_obj.data[i*4+3] = 255;
            }else{
                new_obj.data[i*4] = obj.data[i*4];
                new_obj.data[i*4+1] = obj.data[i*4+1];
                new_obj.data[i*4+2] = obj.data[i*4+2];
                new_obj.data[i*4+3] = obj.data[i*4+3];
            }
        } 
        return imageData2base64(new_obj);
    }


    /* 将图片处理成base64返回 */
    function returnBase64(){
      var data = $can[0].toDataURL();
      window.postMessage(JSON.stringify({action: 0, data: data}));
    }
    /* 返回canvas数据 */
    function getCanvasData(){
      // alert('message6')

      var data = {
    };
    
    // alert(window.ReactNativeWebView.postMessage)
    window.ReactNativeWebView.postMessage(JSON.stringify({action: 6, data: toServeXY}));
    }
    /* 返回canvas数据 */
    function getPadCanvasData(){

      var data = {};
    
    // alert(window.ReactNativeWebView.postMessage)
    window.ReactNativeWebView.postMessage(JSON.stringify({action: 10, data: toServeXY}));
    toServeXY = []
    // alert('message10')

    }
    
  </script>
</body>
</html>
`;

var _width, _height;
class WebCanvas extends Component {

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
    //console.log('Webcanvas Dismount')
    this.props.onRef(this)
  }

  componentDidUpdate() {
    setTimeout(() => {
      this.clear()
    }, 0);

  }
  // 铅笔
  _pen() {
    this.post({ action: 1 })
  }
  // 橡皮
  _clean() {
    this.post({ action: 2 })
  }
  // 初始化画板
  _init() {
    //console.log('初始化画板')
    this.post({ action: '-1' })
  }

  // 以url的形式添加背景
  _addImageUrl = (data) => {
    //console.log('canvas添加图片',data)
    this.post({ action: 4, data: data })
  }

  // 以base64的形式添加背景
  _addImageBase64(data) {
    this.post({ action: 5, data: data })
  }

  // 得到图片的base64形式
  _getBase64() {
    this.post({ action: 0 })
  }

  // 图片右转
  _rotateRight() {
    this.post({ action: 3 })
  }
  _canvasData() {
    this.post({ action: 6 })
  }

  _padCanvasData() {
    console.log('YuwenWebCanvas _padCanvasData')
    this.post({ action: 10 })
  }


  clear = () => {
    this.post({ action: '-1' })
    // const { currentTopaicData } = this.props;
    // if (currentTopaicData) {
    //   const data = currentTopaicData.toJS();
    //   //console.log(data,'webcanvas clear')
    //   if (data.exercise_point && data.exercise_type_public === types.Gou_Xuan) {
    //     //console.log('webcanvas clear img',getYuwenPicTopaicUrl(data.private_stem_picture))
    //     this._addImageUrl(getYuwenPicTopaicUrl(data.private_stem_picture))
    //   }
    //   if(data.exercise_point && data.exercise_type_public === types.YUE_DU&&data.exercise_type_private === types.HUA_XIAN ){
    //     // this.addImageUrlueDuHuaXian(getYuwenPicTopaicUrl(data.public_stem_picture))
    //   }
    // }

  }

  /**
   * 正常canvas绘制，不通过蓝牙接收的点位进行绘制
   */
  drawByCanvas = () => {
    //console.log('YuwenWebCanvas drawByCanvas')
    this.post({ action: 8 })
  }

  /**
   * 获取平板作答的数据
   * @param {*} obj 
   */
  getPadDataFromCanvas(data) {
    if (!this.props.getPadDataFromCanvas) return
    this.props.getPadDataFromCanvas(data)
  }

  post(obj) {
    if (!this.webview) return
    this.webview.postMessage(JSON.stringify(obj));
  }

  webviewload() {
    // alert('加载成功！')
    // console.log('首次加载canvas')
    this.webview.injectJavaScript('init_canvas(' + this.props.width + ', ' + this.props.height + ');');
    if (this.props.onLoad) {
      this.props.onLoad();
    }
    this._pen()
    // this._addImageUrl('https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3879130010,3467339482&fm=26&gp=0.jpg')
    this.drawByCanvas()
    // const { currentTopaicData } = this.props;
    // if (currentTopaicData) {
    //   const data = currentTopaicData.toJS();
    //   if (data.exercise_point && data.exercise_type_public === types.Gou_Xuan) {
    //     // console.log('首次加载YwCanvas',)
    //     this._addImageUrl(getYuwenPicTopaicUrl(data.private_stem_picture))
    //     this.drawByCanvas()
    //   }
    //   if(data.exercise_point && data.exercise_type_public === types.YUE_DU&&data.exercise_type_private === types.HUA_XIAN ){
    //     // this.addImageUrlueDuHuaXian(getYuwenPicTopaicUrl(data.public_stem_picture))
    //     // this.drawByCanvas()
    //   }
    // }
  }



  messageHandler(e) {
    console.log('nativeEvent',e)
    var obj = JSON.parse(e.nativeEvent.data);
    //console.log('nativeEventData',obj)
    if (obj.action == 0) {
      this.props.handleBase64(obj.data);
    } else if (obj.action == 6) {
      if (this.props.getDataFromCanvas) {
        // console.log(obj.data,'canvasdata')
        this.props.getDataFromCanvas(obj.data);
      }
    } else if (obj.action == 10) {
      //console.log(obj.data,'obj.data')
      this.getPadDataFromCanvas(obj.data)
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
      <View style={[styles.container, { width: this.props.width, height: this.props.height, backgroundColor: 'rgba(255,255,255,0)', marginTop: 10,position:'absolute',zIndex:999 }]}>
        <WebView
          injectedJavaScript={INJECTED_JAVASCRIPT}
          style={{ width: this.props.width, height: this.props.height, backgroundColor: 'rgba(255,255,255,0)'}}
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
    currentTopaicData: state.getIn(['deskYuwen', 'currentTopaicData']),
  }
}

const mapDispathToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispathToProps)(WebCanvas)
