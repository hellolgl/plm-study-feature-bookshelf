import React, { Component } from "react";
import { Text, StyleSheet, TouchableHighlight, TouchableOpacity, View, Platform,TouchableWithoutFeedback,Dimensions } from "react-native";
import { pxToDp, pxToDpHeight } from '../../../util/tools'
import {appFont, appStyle, mathFont} from '../../../theme'
import Franction from './Franction'
import AnswerViewFranction from '../Keyboard/AnswerViewFranction'
import { connect } from "react-redux";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



class FranctionInputView extends Component {
constructor(props) {
    super(props);
    this.state = {
        currentIndex:0,
        currentIndex_type:0,
        input_data_1:{
            0:{
                init_char_mat:[],
                cursor_idx:-1
            },
            1:{
                init_char_mat:[],
                cursor_idx:-1
            },
        },
        input_data_2:{
            0:{
                init_char_mat:[],
                cursor_idx:-1
            },
            1:{
                init_char_mat:[],
                cursor_idx:-1
            },
            2:{
                init_char_mat:[],
                cursor_idx:-1
            },
        },
        page_data:{},
        language_data:{}
    }
}

static getDerivedStateFromProps(props, state){
    let tempState = { ...state };
    let language_data = props.language_data.toJS()
    const {main_language_map,other_language_map,type} = language_data
    if(type !== tempState.language_data.type){
        console.log('切换语言',language_data)
        let page_base_data = {
          ok_z:main_language_map.ok,
          ok_c:other_language_map.ok,
          fenshu_z:main_language_map.fenshu,
          fenshu_c:other_language_map.fenshu,
          daifenshu_z:main_language_map.daifenshu,
          daifenshu_c:other_language_map.daifenshu,
        }
        tempState.page_data = {...page_base_data}
        tempState.language_data = JSON.parse(JSON.stringify(language_data))
        return tempState
    }
    return null
  }

componentDidMount(){
    this.props.onRef?this.props.onRef(this):null
}

setInitdata = (v) =>{
    if(!v || !v.isFraction) return
    let value = JSON.parse(JSON.stringify(v))
    delete value.isFraction
    delete value.isWrong
    if(Object.keys(value).length === 2){
        // 初始化光标位置
        value[0].cursor_idx = value[0].init_char_mat.length -1
        value[1].cursor_idx = value[1].init_char_mat.length -1
        this.setState({
            input_data_1:value,
            currentIndex_type:0,
            currentIndex:0
        })
    }
    if(Object.keys(value).length === 3){
        // 初始化光标位置
        value[0].cursor_idx = value[0].init_char_mat.length -1
        value[1].cursor_idx = value[1].init_char_mat.length -1
        value[2].cursor_idx = value[2].init_char_mat.length -1
        this.setState({
            input_data_2:value,
            currentIndex_type:1,
            currentIndex:0
        })
    }
}

changeValues = (value) =>{
    const {currentIndex,currentIndex_type,input_data_1,input_data_2} = this.state
    let my_answer_tk_map = input_data_1
    if(currentIndex_type === 1) my_answer_tk_map = input_data_2
    let now_init_char_mat = my_answer_tk_map[currentIndex].init_char_mat
    let now_cursor_idx = my_answer_tk_map[currentIndex].cursor_idx
    if(value === '删除'){
        if(now_cursor_idx !== -1){now_init_char_mat.splice(now_cursor_idx , 1)}  //删到头不能在删了
        // now_init_char_mat.splice(now_cursor_idx , 1)   //需要光标自动到最后
        if(now_cursor_idx > 0){
            now_cursor_idx -= 1
        }else{
            // now_cursor_idx = now_init_char_mat.length - 1   //需要光标自动到最后
            now_cursor_idx = -1
        }
        let _my_answer_tk_map = JSON.parse(JSON.stringify(my_answer_tk_map))
        _my_answer_tk_map[currentIndex].init_char_mat = now_init_char_mat
        _my_answer_tk_map[currentIndex].cursor_idx = now_cursor_idx
        if(currentIndex_type === 0){
            this.setState({
                input_data_1:_my_answer_tk_map
            })
        }
        if(currentIndex_type === 1){
            this.setState({
                input_data_2:_my_answer_tk_map
            })
        }
        return
    }
    now_init_char_mat.splice(now_cursor_idx + 1, 0, value)
    now_cursor_idx += 1
    let _my_answer_tk_map = JSON.parse(JSON.stringify(my_answer_tk_map))
    _my_answer_tk_map[currentIndex].init_char_mat = now_init_char_mat
    _my_answer_tk_map[currentIndex].cursor_idx = now_cursor_idx
    if(currentIndex_type === 0){
        this.setState({
            input_data_1:_my_answer_tk_map
        })
    }
    if(currentIndex_type === 1){
        this.setState({
            input_data_2:_my_answer_tk_map
        })
    }
  }

  changeIdx = (idx)=>{
    const {currentIndex,currentIndex_type,input_data_1,input_data_2} = this.state
    let my_answer_tk_map = input_data_1
    if(currentIndex_type === 1) my_answer_tk_map = input_data_2
    let _my_answer_tk_map = JSON.parse(JSON.stringify(my_answer_tk_map))
    _my_answer_tk_map[currentIndex].cursor_idx = idx
    if(currentIndex_type === 0){
        this.setState({
            input_data_1:_my_answer_tk_map
        })
    }
    if(currentIndex_type === 1){
        this.setState({
            input_data_2:_my_answer_tk_map
        })
    }
  }

  clickSpace = (index) => {
    const {input_data_1,input_data_2,currentIndex_type} = this.state
    let my_answer_tk_map = input_data_1
    if(currentIndex_type === 1) my_answer_tk_map = input_data_2
    let _my_answer_tk_map = JSON.parse(JSON.stringify(my_answer_tk_map))
    _my_answer_tk_map[index].cursor_idx = _my_answer_tk_map[index].init_char_mat.length - 1
    this.setState({
        currentIndex:index
    })
    if(currentIndex_type === 0){
        this.setState({
            input_data_1:_my_answer_tk_map
        })
    }
    if(currentIndex_type === 1){
        this.setState({
            input_data_2:_my_answer_tk_map
        })
    }
  }

  confirm = ()=>{
    const {currentIndex_type,input_data_1,input_data_2} = this.state
    if(currentIndex_type === 0) this.props.confirm(JSON.parse(JSON.stringify(input_data_1)))
    if(currentIndex_type === 1) this.props.confirm(JSON.parse(JSON.stringify(input_data_2)))
  }

  renderTxt = (value) =>{
    return <View style={[appStyle.flexLine]}>
        {value.map((i,x)=>{
            return <Text style={[{fontSize:pxToDp(36),color:'#4C4C59'},appStyle.flexLine,appFont.fontFamily_jcyt_500]}>{i}</Text>
        })}
    </View>
  }

  render() {
    const {currentIndex_type,input_data_1,input_data_2,currentIndex,language_data,page_data} = this.state
    const {translate,top} = this.props
    const {show_main,show_translate} = language_data
    const {ok_z,ok_c,fenshu_z,fenshu_c,daifenshu_z,daifenshu_c} = page_data
    return ( 
        <View style={[styles.container]}>
            <TouchableWithoutFeedback onPress={this.props.close?this.props.close:null}>
                <View style={[styles.click_region]}></View>
            </TouchableWithoutFeedback>
            <View style={[styles.content,{top:top - pxToDp(304)-pxToDp(20)},currentIndex_type === 1?{minWidth:pxToDp(964)}:null]}>
                <View style={styles.triangle_down}></View>
                <View style={[styles.inner]}>
                    <View style={[styles.content_1]}>
                        <TouchableOpacity onPress={()=>{this.setState({currentIndex_type:0})}} style={[Platform.OS === 'ios'?{marginBottom:pxToDp(20)}:null]}>
                            {translate?<>
                                {show_main?<Text style={[mathFont.txt_40_700,mathFont.txt_4C4C59_50,currentIndex_type === 0?{color:"#4C4C59"}:null,{marginBottom:Platform.OS === 'android'?pxToDp(-20):0}]}>{fenshu_z}</Text>:null}
                                {show_translate?<Text style={[mathFont.txt_28_500,mathFont.txt_4C4C59_50,currentIndex_type === 0?{color:"#4C4C59"}:null]}>{fenshu_c}</Text>:null}
                            </>:<Text style={[mathFont.txt_40_700,mathFont.txt_4C4C59_50,currentIndex_type === 0?{color:"#4C4C59"}:null]}>分数</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.setState({currentIndex_type:1})}}>
                            {translate?<>
                                {show_main?<Text style={[mathFont.txt_40_700,mathFont.txt_4C4C59_50,currentIndex_type === 1?{color:"#4C4C59"}:null,{marginBottom:Platform.OS === 'android'?pxToDp(-20):0}]}>{daifenshu_z}</Text>:null}
                                {show_translate?<Text style={[mathFont.txt_28_500,mathFont.txt_4C4C59_50,currentIndex_type === 1?{color:"#4C4C59"}:null]}>{daifenshu_c}</Text>:null}
                            </>:<Text style={[mathFont.txt_40_700,mathFont.txt_4C4C59_50,currentIndex_type === 1?{color:"#4C4C59"}:null]}>带分数</Text>}
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.content_2]}>
                        {currentIndex_type === 0?<View style={[appStyle.flexAliCenter]}>
                            <TouchableOpacity style={[styles.wrap]} onPress={()=>{this.clickSpace(0)}}>
                                {currentIndex === 0?<AnswerViewFranction value={input_data_1[0]} changeIdx={this.changeIdx}></AnswerViewFranction>:this.renderTxt(input_data_1[0].init_char_mat)}
                            </TouchableOpacity>
                            <View style={[styles.line]}></View>
                            <TouchableOpacity style={[styles.wrap]} onPress={()=>{this.clickSpace(1)}}>
                                {currentIndex === 1?<AnswerViewFranction value={input_data_1[1]} changeIdx={this.changeIdx}></AnswerViewFranction>:this.renderTxt(input_data_1[1].init_char_mat)}
                            </TouchableOpacity>
                        </View>:<View style={[appStyle.flexLine]}>
                            <TouchableOpacity style={[styles.wrap,{width:pxToDp(80)}]} onPress={()=>{this.clickSpace(0)}}>
                                {currentIndex === 0?<AnswerViewFranction value={input_data_2[0]} changeIdx={this.changeIdx}></AnswerViewFranction>:this.renderTxt(input_data_2[0].init_char_mat)}
                            </TouchableOpacity>
                            <View>
                                <TouchableOpacity style={[styles.wrap]} onPress={()=>{this.clickSpace(1)}}>
                                    {currentIndex === 1?<AnswerViewFranction value={input_data_2[1]} changeIdx={this.changeIdx}></AnswerViewFranction>:this.renderTxt(input_data_2[1].init_char_mat)}
                                </TouchableOpacity>
                                <View style={[styles.line]}></View>
                                <TouchableOpacity style={[styles.wrap]} onPress={()=>{this.clickSpace(2)}}>
                                    {currentIndex === 2?<AnswerViewFranction value={input_data_2[2]} changeIdx={this.changeIdx}></AnswerViewFranction>:this.renderTxt(input_data_2[2].init_char_mat)}
                                </TouchableOpacity>
                            </View>
                        </View>}
                    </View>
                    <TouchableOpacity style={[styles.confirm_btn]} onPress={this.confirm}>
                        <View style={[styles.confirm_btn_inner]}>
                            {translate?<>
                                {show_main?<Text style={[mathFont.txt_32_700,mathFont.txt_fff,{marginBottom:Platform.OS === 'android'?pxToDp(-15):pxToDp(10)}]}>{ok_z}</Text>:null}
                                {show_translate?<Text style={[mathFont.txt_24_500,mathFont.txt_fff_50]}>{ok_c}</Text>:null}
                            </>:<Text style={[{color:"#FFFFFF",fontSize:pxToDp(32)}]}>确定</Text>}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    );
  }

}

const styles = StyleSheet.create({
    container:{
        width:windowWidth,
        height:windowHeight,
        position:'absolute',
        top:0,
        left:0,
    },
    click_region:{
        flex:1,
        width:'100%',
        backgroundColor:'rgba(71, 82, 102, 0.5)',
    },
    content:{
        position:'absolute',
        minWidth:pxToDp(850),
        backgroundColor:"#E7E7F2",
        borderRadius:pxToDp(60),
        paddingBottom:pxToDp(6),
        right:pxToDp(350),
        height:pxToDp(304)
    },
    inner:{
        width:'100%',
        height:'100%',
        backgroundColor:"#fff",
        padding:pxToDp(40),
        ...appStyle.flexLine,
        borderRadius:pxToDp(60)
    },
    txt_1:{
        fontSize:pxToDp(40),
        color:"#B9B9C4",
        ...appFont.fontFamily_jcyt_500
    },
    content_1:{
        // flex:1,
        // ...appStyle.flexAliCenter,
        // backgroundColor:"red"
        marginRight:pxToDp(40)
    },
    content_2:{
        minWidth:pxToDp(200),
        height:pxToDp(224),
        backgroundColor:"#fff",
        borderRadius:pxToDp(40),
        ...appStyle.flexCenter,
        backgroundColor:"#F5F5FA",
        flex:1
    },
    confirm_btn:{
        width:pxToDp(160),
        height:pxToDp(160),
        borderRadius:pxToDp(80),
        backgroundColor:"#404050",
        marginLeft:pxToDp(40),
        paddingBottom:pxToDp(6),
    },
    confirm_btn_inner:{
        width:'100%',
        height:'100%',
        backgroundColor:"#5A5A68",
        borderRadius:pxToDp(80),
        ...appStyle.flexCenter,
    },
    line:{
        borderBottomColor:'#4C4C59',
        borderBottomWidth:pxToDp(4),
        width:pxToDp(160),
        marginTop:pxToDp(4),
        marginBottom:pxToDp(4)
    },
    wrap:{
        width:pxToDp(160),
        height:pxToDp(60),
        ...appStyle.flexCenter,
    },
    triangle_down:{
        position:"absolute",
        width:0,
        height:0,
        borderLeftWidth:pxToDp(13),
        borderLeftColor:'transparent',
        borderRightWidth:pxToDp(13),
        borderRightColor:'transparent',
        borderTopWidth:pxToDp(20),
        borderTopColor:'#E7E7F2',
        bottom:pxToDp(-18),
        right:pxToDp(120)
    },
});
const mapStateToProps = (state) => {
    return {
        language_data: state.getIn(["languageMath", "language_data"]),
    };
  };
  
  const mapDispathToProps = (dispatch) => {
    return {};
  };
  
export default connect(mapStateToProps, mapDispathToProps)(FranctionInputView);