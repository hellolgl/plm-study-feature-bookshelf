import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform
} from "react-native";
import { appStyle, mathFont } from "../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../util/tools";
import url from '../../../util/url'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { connect } from "react-redux";

class CorrectPrompt extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    const {translate} = this.props
    let language_data = this.props.language_data.toJS();
    const {show_main,show_translate,main_language_map,other_language_map} = language_data
    let page_base_data = {
        excellent_z:main_language_map.excellent,
        excellent_c:other_language_map.excellent,
    }
    return <View style={[styles.container]}>
        <View style={[styles.wrap]}>
            <Image style={[{width:pxToDp(224),height:pxToDp(160)},Platform.OS === 'ios'?{marginBottom:pxToDp(20)}:null]} resizeMode='stretch' source={require('../../../images/MathKnowledgeGraph/excellent_monkey.png')}></Image>
            {translate?<>
              {show_main?<Text style={[mathFont.txt_48_700,mathFont.txt_4C4C59,{marginBottom:Platform.OS === 'android'?pxToDp(-20):pxToDp(10)}]}>{page_base_data.excellent_z}!</Text>:null}
              {show_translate?<Text style={[mathFont.txt_32_500,mathFont.txt_4C4C59_50]}>{page_base_data.excellent_c}!</Text>:null}
            </>:<Text style={[mathFont.txt_48_700,mathFont.txt_4C4C59]}>太棒啦!</Text>}
        </View>
    </View>
  }
}

const styles = StyleSheet.create({
    container:{
        width:windowWidth,
        height:windowHeight,
        position:"absolute",
        top:0,
        left:0,
        zIndex:2,
        ...appStyle.flexCenter,
    },
    wrap:{
        width:pxToDp(304),
        height:pxToDp(370),
        backgroundColor:'#fff',
        borderRadius:pxToDp(40),
        elevation:10,
        shadowColor:"rgba(0, 0, 0, 0.20)",
        shadowOpacity:.5,
        shadowOffset:{width:0,height:pxToDp(10)},
        shadowRadius:pxToDp(20),
        ...appStyle.flexCenter
    }
});
const mapStateToProps = (state) => {
    return {
        language_data: state.getIn(["languageMath", "language_data"]),
    };
  };
  
  const mapDispathToProps = (dispatch) => {
    return {};
  };
  
  export default connect(mapStateToProps, mapDispathToProps)(CorrectPrompt);
