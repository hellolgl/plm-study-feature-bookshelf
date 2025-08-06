import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { appStyle } from "../theme";
import { size_tool, pxToDp, padding_tool } from "../util/tools";

const activeImgMap = {
  '0': require("../images/yes_correct.png"),
  '1': require("../images/no_correct.png"),
  '2': require("../images/yesHalf_correct.png"),
};

class CorrectionCheck extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        {
          value: "0",
          label: "正确",
          isActive: false,
        },
        {
          value: "1",
          label: "错误",
          isActive: false,
        },
        {
          value: "2",
          label: "半对",
          isActive: false,
        },
      ],
    };
  }
  componentDidMount(){
    const { options } = this.state;
    const {details} = this.props
    let _p_correct = ''
    if(details.p_correct){
        _p_correct = details.p_correct
    }
    if(!details.p_correct && details.correction){
        _p_correct = details.correction
    }
    let _options = JSON.parse(JSON.stringify(options))
    if(_p_correct === '0'){
        _options[0].isActive = true
    }
    if(_p_correct === '1'){
        _options[1].isActive = true
    }
    if(_p_correct === '2'){
        _options[2].isActive = true
    }
    this.setState({
        options:_options
    })
  }
  render() {
    const { options } = this.state;
    return (
      <View
        style={[appStyle.flexLine, styles.itemWrap, appStyle.flexJusBetween]}
      >
        {options.map((item, index) => {
          return (
            <View style={[appStyle.flexCenter]} key={index}>
              <View style={[styles.imgWrap]}>
                <Image
                  source={activeImgMap[item.value]}
                  style={[{ width: pxToDp(52), height: pxToDp(52) },item.isActive?styles.itemImg:styles.itemImgNone]}
                  resizeMode={'contain'}
                ></Image>
              </View>
              <Text style={[styles.itemLabel]}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemWrap: {
    // backgroundColor:'red',
    marginTop: pxToDp(40),
    marginRight: pxToDp(40),
    width: pxToDp(300),
  },
  itemLabel: {
    fontSize: pxToDp(24),
    marginTop: pxToDp(10),
  },
  imgWrap:{
      position:'relative',
      width:pxToDp(50),
      height:pxToDp(50),
      borderWidth:pxToDp(1),
      borderColor:'#aaaaaa'
  },
  itemImg:{
      position:'absolute',
      top:pxToDp(-2),
      left:pxToDp(-2)
  },
  itemImgNone:{
      display:'none'
  }
});
export default CorrectionCheck;
