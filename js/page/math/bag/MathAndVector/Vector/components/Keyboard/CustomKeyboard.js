import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { appStyle } from "../../../../../../../theme";
import { size_tool, pxToDp, fitHeight } from "../../../../../../../util/tools";

const commonBtn2 = [
    {
        value:1,
    },
    {
        value:2,
    },
    {
        value:3,
    },
    {
        value:4,
    },
    {
        value:5,
    },
    {
        value:6,
    },
    {
        value:7,
    },
    {
        value:8,
    },
    {
        value:9,
    },
    {
        value:0,
    },
    {
        value:'.',
    },
    {
        value:'删除',
    },
]


class CustomKeyboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount(){
    this.props.onRef(this)
  }
  clickConstItem = (item,index)=>{
    this.props.changeValues(item.value)
  }
  render() {
    return (
        <View style={[styles.container,appStyle.flexLine,appStyle.flexLineWrap]}>
            {commonBtn2.map((item,index)=>{
                let radiusStyle = {}
                if(item.value === 1){
                    radiusStyle = {
                        borderTopLeftRadius:pxToDp(20)
                    }
                }
                if(item.value === 3){
                    radiusStyle = {
                        borderTopRightRadius:pxToDp(20)
                    }
                }
                if(item.value === 0){
                    radiusStyle = {
                        borderBottomLeftRadius:pxToDp(20)
                    }
                }
                if(item.value === '删除'){
                    radiusStyle = {
                        borderBottomRightRadius:pxToDp(20)
                    }
                }
            return <TouchableOpacity style={[styles.commonItem,appStyle.flexCenter,radiusStyle]} key={index} onPress={()=>{this.clickConstItem(item,index)}}>
                <Text style={[{fontSize:pxToDp(48),color:'#999',fontWeight:'bold'}]}>{item.value}</Text>
            </TouchableOpacity>
            })}
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#E7E7E7',
        borderRadius:pxToDp(24),
        padding:pxToDp(4),
        paddingRight:0
    },
    commonItem:{
        width:pxToDp(211.2),
        height:pxToDp(87),
        marginBottom:pxToDp(4),
        marginRight:pxToDp(4),
        backgroundColor:'#fff',
        lineHeight:pxToDp(56),
        textAlign:'center',
        color:'#FFF',
        fontSize:pxToDp(36),
    }
});
export default CustomKeyboard;
