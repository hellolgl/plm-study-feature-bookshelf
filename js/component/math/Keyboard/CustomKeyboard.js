import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView
} from "react-native";
import { appStyle } from "../../../theme";
import { size_tool, pxToDp, fitHeight } from "../../../util/tools";

const commonBtn2 = [
    {
        value:'(',
    },
    {
        value:')',
    },
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
        value:'[',
    },
    {
        value:']',
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
        value:'+',
    },
    {
        value:'—',
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
        value:'×',
    },
    {
        value:'÷',
    },
    {
        value:'0',
    },
    {
        value:'.',
    },
    {
        value:'=',
    },
    {
        value:'删除',
    },
    {
        value:'，',
    },
    {
        value:'换行',
    },

    {
        value:'%',
    },
    
]
const commonBtn1 = [
    {
        value:':',
    },
    {
        value:'π',
    },
    {
        value:'分数',
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
  clearData = ()=>{
    // this.props.changeValues('')
  }
  render() {
    const {unitBtnArr,checkBtnArr,currentIndex} = this.props
    return (
        <ImageBackground source={require('../../../images/keyboard/bg.png')} style={[styles.container,appStyle.flexCenter]} resizeMode={'stretch'}>
            <View style={[styles.content,appStyle.flexLine]}>
                {unitBtnArr && unitBtnArr.length>0?
                    <View style={[styles.one,unitBtnArr.length === 2?appStyle.flexJusEvenly:appStyle.flexJusBetween]}>
                        {unitBtnArr.map((item,index)=>{
                            return <TouchableOpacity key={index} onPress={()=>{this.clickConstItem(item,index)}}>
                            <Text style={[styles.tkText,{fontWeight:'bold'},index === unitBtnArr.length - 1?{marginBottom:0}:null]}>{item.value}</Text>
                        </TouchableOpacity>
                        })}
                    </View>    
                :null}
                {checkBtnArr && checkBtnArr.length>0?
                    <View style={[styles.one,checkBtnArr.length === 2?appStyle.flexJusEvenly:appStyle.flexJusBetween]}>
                    {checkBtnArr.map((item,index)=>{
                        return <TouchableOpacity key={index} onPress={()=>{this.clickConstItem(item,index)}}>
                            <Text style={[styles.tkText,{fontSize:pxToDp(36)}]}>{item.value}</Text>
                        </TouchableOpacity>
                    })}
                    </View>    
                :null    
                }
                <View style={[styles.three,appStyle.flexLine,appStyle.flexLineWrap,appStyle.flexJusBetween]}>
                    {commonBtn2.map((item,index)=>{
                    return <TouchableOpacity key={index} onPress={()=>{this.clickConstItem(item,index)}}>
                        <Text style={[styles.commonItem2,styles.commonItem3,item.value === '删除'?{width:pxToDp(216)}:null]}>{item.value}</Text>
                         </TouchableOpacity>
                    })}
                </View>
                <View style={[styles.two,appStyle.flexJusBetween]}>
                    {commonBtn1.map((item,index)=>{
                        return <TouchableOpacity key={index} onPress={()=>{this.clickConstItem(item,index)}}>
                        <Text style={[styles.commonItem1]}>{item.value}</Text>
                    </TouchableOpacity>
                    })}
                </View>
            </View>
        </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        height:fitHeight(0.34,0.28),
        paddingTop:pxToDp(24),
        paddingLeft:pxToDp(24),
        paddingRight:pxToDp(24),
    },
    one:{
        borderRightWidth:pxToDp(2),
        borderRightColor:'#99CCFF',
        paddingRight:pxToDp(12),
        marginRight:pxToDp(12)
    },
    two:{
        marginLeft:pxToDp(12)
    },
    three:{
        width:pxToDp(560),
    },
    unitItem:{
        width:pxToDp(130),
        height:pxToDp(74),
    },
    tkText:{
        width:pxToDp(130),
        height:pxToDp(74),
        backgroundColor:'#fff',
        borderRadius:pxToDp(8),
        textAlign:'center',
        lineHeight:pxToDp(74),
        fontSize:pxToDp(26),
        marginBottom:pxToDp(16)
    },
    commonItem1:{
        width:pxToDp(130),
        height:pxToDp(56),
        backgroundColor:'#fff',
        lineHeight:pxToDp(56),
        textAlign:'center',
        fontSize:pxToDp(34),
        marginBottom:pxToDp(16)
    },
    commonItem2:{
        width:pxToDp(100),
        height:pxToDp(56),
        marginBottom:pxToDp(16)
    },
    commonItem3:{
        backgroundColor:'#80BFFF',
        lineHeight:pxToDp(56),
        textAlign:'center',
        borderRadius:pxToDp(8),
        color:'#FFF',
        fontSize:pxToDp(36),
    }
});
export default CustomKeyboard;
