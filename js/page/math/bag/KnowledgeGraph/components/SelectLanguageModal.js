import React, {PureComponent} from "react"
import {
    Text,
    StyleSheet,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    Platform
} from "react-native"
import _ from "lodash"

import {pxToDp} from "../../../../../util/tools"
import {appFont, appStyle, mathFont} from "../../../../../theme"
import { connect } from "react-redux";
import * as actionCreators from "../../../../../action/math/language/index";
import chinese from "../../../../../util/languageConfig/chinese";
import english from "../../../../../util/languageConfig/english";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const list = [
    {
        label:'中英双语',
        des:'中文为主的页面布局',
        key:1
    },
    {
        label:'英中双语',
        des:'英文为主的页面布局',
        key:2
    },
    {
        label:'中文',
        des:'只有中文的布局',
        key:3
    },
    {
        label:'英文',
        des:'只有英文的布局',
        key:4
    }
]

class SelectLanguageModal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            currentIndex:0
        }
    }

    componentDidMount(){

    }

    close = () => {
        this.props.close()
    }

    select = (i,x) => {
        let language_data = {}
        if(i.key === 1){
            // 中英
            language_data = {
                show_main:true,
                show_translate:true,
                main_language_map:chinese,
                other_language_map:english,
                show_type:'1',
                type:i.key,
                main_language:'zh',
                other_language:'en',
                label:'中英双语'
            }
        }
        if(i.key === 2){
           // 英中
            language_data = {
                show_main:true,
                show_translate:true,
                main_language_map:english,
                other_language_map:chinese,
                show_type:'2',
                type:i.key,
                main_language:'en',
                other_language:'zh',
                label:'英中双语'
            }
        }
        if(i.key === 3){
            // 中文
            language_data = {
                show_main:true,
                show_translate:false,
                main_language_map:chinese,
                other_language_map:english,
                show_type:'1',
                type:i.key,
                main_language:'zh',
                other_language:'',
                label:'中文'
            }
        }
        if(i.key === 4){
            // 英文
            language_data = {
                show_main:true,
                show_translate:false,
                main_language_map:english,
                other_language_map:chinese,
                show_type:'2',
                type:i.key,
                main_language:'en',
                other_language:'',
                label:'英文'
            }
        }
        language_data.trans_language = 'en'
        this.props.setLanguageData(language_data)
    }

    render() {
        const {show} = this.props
        if(!show) return null
        let language_data = this.props.language_data.toJS();
        const {type} = language_data
        return  <View style={[styles.container]}>
            <TouchableWithoutFeedback onPress={this.close}>
                <View style={[styles.click_region]}></View>
            </TouchableWithoutFeedback>
            <View style={[styles.content]}>
                <View style={[styles.inner]}>
                    <Text style={[mathFont.txt_48_700,mathFont.txt_4C4C59,{textAlign:'center',marginBottom:Platform.OS === 'android'?pxToDp(10):pxToDp(40)}]}>语言切换</Text>
                    {list.map((i,x)=>{
                        return <TouchableOpacity style={[styles.item,type === i.key?{backgroundColor:"#FF9D42",borderRadius:pxToDp(40)}:null]} key={x} onPress={()=>{this.select(i,x)}}>
                            <View style={[styles.item_inner,type === i.key?{backgroundColor:"#FFC85D",borderRadius:pxToDp(40)}:null,Platform.OS === 'ios'?{paddingTop:pxToDp(20),paddingBottom:pxToDp(20)}:null]}>
                                <Image style={{width:pxToDp(40),height:pxToDp(40),marginRight:pxToDp(20)}} resizeMode={'contain'} source={type === i.key?require('../../../../../images/MathKnowledgeGraph/select_icon_1.png'):''}></Image>
                                <View>
                                    <Text style={[mathFont.txt_36_700,mathFont.txt_475266,{marginBottom:Platform.OS === 'android'?pxToDp(-15):pxToDp(10)}]}>{i.label}</Text>
                                    <Text style={[mathFont.txt_24_500,mathFont.txt_475266_50]}>{i.des}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    })}
                </View>
                <View style={styles.triangle_up}></View>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    container:{
        width:windowWidth,
        height:windowHeight-pxToDp(120),
        position:'absolute',
        top:pxToDp(120),
        left:0,
        ...appStyle.flexAliCenter,
    },
    click_region:{
        flex:1,
        width:'100%',
        backgroundColor:'rgba(71, 82, 102, 0.5)',
    },
    content:{
        position:'absolute',
        top:pxToDp(24),
        right:pxToDp(50),
        width:pxToDp(580),
        backgroundColor:'#E7E7F2',
        borderRadius:pxToDp(60),
        ...appStyle.flexAliCenter,
        paddingBottom:pxToDp(8)
    },
    inner:{
        width:'100%',
        padding:pxToDp(40),
        backgroundColor:"#fff",
        borderRadius:pxToDp(60),
    },
    item:{
        paddingBottom:pxToDp(6)
    },
    item_inner:{
        paddingLeft:pxToDp(20),
        ...appStyle.flexLine
    },
    triangle_up:{
        width:0,
        height:0,
        borderLeftWidth:pxToDp(16),
        borderLeftColor:'transparent',
        borderRightWidth:pxToDp(16),
        borderRightColor:'transparent',
        borderBottomWidth:pxToDp(20),
        borderBottomColor:'#fff',
        position:'absolute',
        top:pxToDp(-20)
    },


})
const mapStateToProps = (state) => {
    return {
        language_data: state.getIn(["languageMath", "language_data"]),
    };
  };

  const mapDispathToProps = (dispatch) => {
    return {
        setLanguageData(data) {
            dispatch(actionCreators.setLanguageData(data));
        }
    };
  };

  export default connect(mapStateToProps, mapDispathToProps)(SelectLanguageModal);
