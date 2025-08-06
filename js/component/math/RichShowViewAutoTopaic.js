/**
 *
 * 基于webview的Canvas画布
 */
import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { connect } from "react-redux";
import { pxToDp } from "../../util/tools";
import TreeShow from "./TreeShow1";


class RichShowViewAutoTopaic extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      height: this.props.height || 0,
      width: this.props.width || 0,
    };
    this.webview = {};
    this.time = 0;
  }
  componentDidMount() {
    //console.log('Webcanvas Dismount')
    //  this.props.onRef(this)
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    console.log("RichShowView componentWillUnmount");
  }

  post(obj) {
    if(this.webview && this.webview.postMessage) this.webview.postMessage(JSON.stringify(obj));
  }

  webviewload() {
    // alert('加载成功！')
    console.log("首次加载webview");
    //  this.webview.injectJavaScript('init_canvas(' + this.props.width + ', ' + this.props.height + ');');
    if (this.props.onLoad) {
      this.props.onLoad();
    }
  }

  _init = () => {
    //console.log('初始化画板')
    this.time = 0;
    this.post({ action: "-1" });
  };

  messageHandler(e) {
    // console.log("e.nativeEvent.data", e.nativeEvent.data);
    if (this.time === 20) {
      this._init();
    } else {
      if (!Number.isNaN(+e.nativeEvent.data)) {
        // console.log('e.nativeEvent.data this.state.height',this.state.height )
        this.time++;
        this.setState({ height: +e.nativeEvent.data });
      }
    }
  }

  render() {
    const INJECTED_JAVASCRIPT = `(function() {
       // This is the important part!
       if (!window.ReactNativeWebView) {
         window.ReactNativeWebView = window['ReactABI33_0_0NativeWebView'];
       }
       // End of the important part! Now continue using it as usual
   
       window.ReactNativeWebView.postMessage(JSON.stringify(window.location));
       window.ReactNativeWebView.postMessage(document.getElementById("content").clientHeight)

      //  setInterval(() => { window.ReactNativeWebView.postMessage(document.getElementById("content").clientHeight)}, 1000)
       })();
       `;
    return (
      <View>
        <View
          style={[
            styles.container,
            {
              width: this.props.width || 600,
              height: this.state.height,
              backgroundColor: "rgba(255,255,255,0)",
              marginTop: 10,
            },
          ]}
        >
          <WebView
            injectedJavaScript={INJECTED_JAVASCRIPT}
            style={{
              width: this.props.width || 600,
              height: this.state.height,
              backgroundColor: "rgba(255,255,255,0)",
            }}
            ref={(w) => {
              this.webview = w;
            }}
            onLoad={this.webviewload.bind(this)}
            source={{
              html: `<html>
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
                    var interval = setInterval(() => { window.ReactNativeWebView.postMessage(document.getElementById("content").clientHeight)}, 1000)
                    window.document.addEventListener('message', function (e){
                      // alert('message')
                      var obj = JSON.parse(e.data);
                      switch (parseInt(obj.action)){
                        case -1:
                            /* 清空计时器 */
                            clearInterval(interval)
                            // alert('interval')
                            break;
                      }
                    });
                   </script>
                   </body>
               </html>
               `,
            }}
            onMessage={this.messageHandler.bind(this)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            automaticallyAdjustContentInsets={true}
            scalesPageToFit={false}
          />
        </View>
        {this.props.treeData ? (
          <View style={{ height: pxToDp(400) }}>
            <TreeShow
              treeData={this.props.treeData}
              parseData={this.props.parseData}
              variableValue = {this.props.variableValue}
              equationExercise = {this.props.equationExercise}
            ></TreeShow>
          </View>
        ) : null}
      </View>
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

const mapStateToProps = (state) => {
  return {};
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispathToProps
)(RichShowViewAutoTopaic);
