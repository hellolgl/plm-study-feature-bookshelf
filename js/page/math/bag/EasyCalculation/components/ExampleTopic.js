import React, { Component } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity, Image,
    Modal,
} from "react-native";
import {
  pxToDp,fitHeight
} from "../../../../../util/tools";
import { appStyle } from "../../../../../theme";
import Stem from './Stem'
import Explanation from './Explanation'
import Chioce from './Chioce'
import VideoPlayer from "../VideoPlayer";
import Explanation2 from '../../../../../component/math/Topic/Explanation2'

export default class ExampleTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
        videoIsVisible: false
    }
  }
  back = ()=>{
    this.props.close()
  }
  doVideoAction = () => {
    console.log("click video...", this.state.videoIsVisible)
    this.setState({"videoIsVisible": true})
  }
  hideVideoShow = () => {
    console.log("will hide video")
    this.setState({"videoIsVisible": false})
  }
  render() {
    const {currentTopaicData} = this.props   //type:0整数 1分数
      return (
        <View style={[styles.wrap]}>
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                visible={this.state.videoIsVisible}>
                <VideoPlayer hideVideoShow={this.hideVideoShow} fileUrl={currentTopaicData["exercise_video"]}
                />
            </Modal>
            {(currentTopaicData["exercise_video"] !== "" && currentTopaicData["exercise_video"] !== undefined) ?
                <View style={[appStyle.flexAliEnd]} >
                  <TouchableOpacity onPress={this.doVideoAction}>
                    <Image style={[{ width:pxToDp(224),height:pxToDp(80)}]} source={require('../../../../../images/study_page_video.png')} resizeMode="contain"></Image>
                  </TouchableOpacity>
                </View>
                :
                null
            }
          <ScrollView>
                {currentTopaicData.alphabet_value?null:<Stem currentTopaicData={currentTopaicData}></Stem>}
                {currentTopaicData.choice_content?<Chioce currentTopaicData={currentTopaicData}></Chioce>:null}
                {currentTopaicData.alphabet_value?<Explanation2 currentTopaicData={currentTopaicData} yinDaoNum={-1}></Explanation2>:<Explanation currentTopaicData={currentTopaicData}></Explanation>}
            </ScrollView>
            <View style={[appStyle.flexAliEnd]}>
              <TouchableOpacity style={[styles.baseBtn,appStyle.flexCenter]} onPress={this.back}>
                <Text style={[styles.btnText]}>返回</Text>
              </TouchableOpacity>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    wrap:{
        height:fitHeight(0.81,0.868),
        padding:pxToDp(32),
        backgroundColor:'#fff',
        borderRadius:pxToDp(32)
    },
    baseBtn:{
        height: pxToDp(56),
        paddingLeft:pxToDp(32),
        paddingRight:pxToDp(32),
        borderRadius: pxToDp(40),
        backgroundColor:'#33A1FDFF',
    },
    btnText:{
        fontSize: pxToDp(32),
        color:'#fff'
    },
});
