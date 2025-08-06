import { T } from "lodash/fp";
import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { appFont, appStyle } from "../../../theme";
import { pxToDp, pxToDpHeight,isChinese } from "../../../util/tools";
import AnswerView from '../Keyboard/AnswerView'
import AutoImage from './AutoImage'
import AnswerTxtView from './AnswerTxtView'

// onlySee只显示题干信息

class TopicStemTk extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        currentIndex:-1,
        my_answer_tk_map:'',  //为了答错之后解析的回显
    };
  }

  componentDidMount(){
    const {data} = this.props
    this.props.onRef?this.props.onRef(this):null
    this.setState({
        my_answer_tk_map:data.my_answer_tk_map,
        currentIndex:data._answer_tk_key
    },()=>{
        this.props.clickSpace?this.props.clickSpace(data._answer_tk_key):null
    })
  }

  componentDidUpdate(prevProps, prevState){
    const {data} = this.props
    const {m_e_s_id} = data
    // console.log('____________________________',m_e_s_id,prevProps.data.m_e_s_id,data)
    if(m_e_s_id !== prevProps.data.m_e_s_id){
        this.setState({
            my_answer_tk_map:JSON.parse(JSON.stringify(data)).my_answer_tk_map,
            currentIndex:data._answer_tk_key
        },()=>{
            this.props.clickSpace?this.props.clickSpace(data._answer_tk_key):null
        })
    }
  }

  clickSpace = (x,xx,xxx)=>{
    const {correct} = this.props
    if(correct !== -1) return
    const {currentIndex,my_answer_tk_map} = this.state
    let _my_answer_tk_map = JSON.parse(JSON.stringify(my_answer_tk_map))
    if(xxx || xxx === 0){
        if(currentIndex === `${x}${xx}${xxx}`){
            this.setState({
                currentIndex:-1
            },()=>{
                this.props.clickSpace?this.props.clickSpace(-1):null
            })
            return
        }
    }else{
        if(currentIndex === `${x}${xx}`){
            this.setState({
                currentIndex:-1
            },()=>{
                this.props.clickSpace?this.props.clickSpace(-1):null
            })
            return
        }
    }
    let key = `${x}${xx}`
    if(xxx || xxx === 0){
        key = `${x}${xx}${xxx}`
    }
    if(!_my_answer_tk_map[key].isFraction)  _my_answer_tk_map[key].cursor_idx = _my_answer_tk_map[key].init_char_mat.length - 1   //切换时候光标始终在最后一位
    this.setState({
        currentIndex : key,
        my_answer_tk_map:_my_answer_tk_map
    },()=>{
        this.props.clickSpace?this.props.clickSpace(key,_my_answer_tk_map[key].isFraction):null
    })
  }

  changeValues = (value) =>{
    const {currentIndex,my_answer_tk_map} = this.state
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
        this.setState({
            my_answer_tk_map:_my_answer_tk_map
        },()=>{
            this.props.changeMyAnswerMap?this.props.changeMyAnswerMap(_my_answer_tk_map):null
        })
        return
    }
    now_init_char_mat.splice(now_cursor_idx + 1, 0, value)
    now_cursor_idx += 1
    let _my_answer_tk_map = JSON.parse(JSON.stringify(my_answer_tk_map))
    _my_answer_tk_map[currentIndex].init_char_mat = now_init_char_mat
    _my_answer_tk_map[currentIndex].cursor_idx = now_cursor_idx
    this.setState({
        my_answer_tk_map:_my_answer_tk_map
    },()=>{
        this.props.changeMyAnswerMap?this.props.changeMyAnswerMap(_my_answer_tk_map):null
    })
  }

  changeIdx = (idx)=>{
    const {currentIndex,my_answer_tk_map} = this.state
    let _my_answer_tk_map = JSON.parse(JSON.stringify(my_answer_tk_map))
    _my_answer_tk_map[currentIndex].cursor_idx = idx
    this.setState({
        my_answer_tk_map:_my_answer_tk_map
    },()=>{
        this.props.changeMyAnswerMap?this.props.changeMyAnswerMap(_my_answer_tk_map):null
    })
  }

  setInitdata = (my_answer_tk_map) =>{
    const {currentIndex} = this.state
    let _currentIndex = currentIndex
    if(my_answer_tk_map[currentIndex].isFraction) _currentIndex = -1
    this.setState({
        my_answer_tk_map,
        currentIndex:_currentIndex,
    },()=>{
        this.props.clickSpace?this.props.clickSpace(_currentIndex):null
    })
  }

  renderTxt = (value)=>{
    const {correct,onlySee} = this.props
    if(!value || onlySee) return
    return <AnswerTxtView correct={correct} value={value}></AnswerTxtView>
  }

  renderItem = (value,x,xx,xxx)=>{
    const {currentIndex,my_answer_tk_map} = this.state
    const {my_style,translate} = this.props
    if(value === 'k'){
        return <TouchableOpacity style={[styles.blank_k,`${x}${xx}${xxx}`===currentIndex?styles.blank_k_active:null,{marginBottom:pxToDp(20)}]} onPress={()=>{this.clickSpace(x,xx,xxx)}}>
            {`${x}${xx}${xxx}`===currentIndex?<AnswerView value={my_answer_tk_map[`${x}${xx}${xxx}`]} changeIdx={this.changeIdx}></AnswerView>:
            <View style={[appStyle.flexLine]}>
                {my_answer_tk_map[`${x}${xx}${xxx}`] && my_answer_tk_map[`${x}${xx}${xxx}`].init_char_mat.map((i,x)=>{
                    return <Text style={[{fontSize:pxToDpHeight(48)},appStyle.flexLine,appFont.fontFamily_jcyt_500]}>{i}</Text>
                })}
            </View>} 
        </TouchableOpacity>
    }else{
        return <View style={[appStyle.flexLine,appStyle.flexCenter]}>
            <Text style={[translate?my_style.stem_txt_trans:my_style.stem_txt,styles.txt_fz_fm]}>{value}</Text>
        </View>
    }
  }

  render() {
    const {currentIndex,my_answer_tk_map} = this.state
    const {data,correct,hidden_stem_picture,translate,my_style} = this.props  //correct:-1没提交 0错误 1正确
    let {stem_tk,public_exercise_image,stem_tk_c,public_exercise_image_c} = data
    if(translate){
        stem_tk = stem_tk_c
        public_exercise_image = public_exercise_image_c
    }
    if(!my_answer_tk_map) return null
    return (
        <View>
            <View>
                {stem_tk && stem_tk.length > 0?stem_tk.map((i,x)=>{
                    return <View style={[appStyle.flexLine,appStyle.flexLineWrap]} key={x}>
                        {i.map((ii,xx)=>{
                            if(ii === 'k'){
                                return <TouchableOpacity style={[translate?my_style.stem_answer_line:styles.line,`${x}${xx}`===currentIndex && correct === -1?styles.line_active:null]} key={xx} onPress={()=>{this.clickSpace(x,xx)}}>
                                    {`${x}${xx}`===currentIndex && correct === -1 && !my_answer_tk_map[`${x}${xx}`].isFraction?<AnswerView value={my_answer_tk_map[`${x}${xx}`]} changeIdx={this.changeIdx}></AnswerView>:
                                    this.renderTxt(my_answer_tk_map[`${x}${xx}`])
                                    } 
                                </TouchableOpacity>
                            }else{
                                if(Array.isArray(ii)){
                                    if(ii.length === 2){
                                        return <View key={xx}>
                                            <View>
                                                {this.renderItem(ii[0],x,xx,0)}
                                                <View style={[translate?[{borderBottomColor:my_style.stem_txt_trans.color},my_style.stem_txt_borderBottom_trans]:[styles.line_f,{borderBottomColor:my_style.stem_txt.color}]]}></View>
                                            </View>
                                            <View>{this.renderItem(ii[1],x,xx,1)}</View>
                                        </View>
                                    }
                                    if(ii.length === 3){
                                        return <View key={xx} style={[appStyle.flexLine]}>
                                            <View style={{marginRight:pxToDp(2)}}>{this.renderItem(ii[0],x,xx,0)}</View>
                                            <View>
                                                <View>
                                                    {this.renderItem(ii[1],x,xx,1)}
                                                    <View style={[translate?[{borderBottomColor:my_style.stem_txt_trans.color},my_style.stem_txt_borderBottom_trans]:[styles.line_f,{borderBottomColor:my_style.stem_txt.color}]]}></View>
                                                </View>
                                                <View>{this.renderItem(ii[2],x,xx,2)}</View>
                                            </View>
                                        </View>
                                    }
                                }
                                if(isChinese(ii)){
                                    // console.log('中文',ii)
                                    return ii.split('').map((iii,xxx)=>{
                                        return <Text key={xxx} style={[translate?my_style.stem_txt_trans:my_style.stem_txt,{lineHeight:pxToDp(70)}]}>{iii}</Text>
                                    })
                                }else{
                                    // console.log('英文',ii)
                                    return ii.split(' ').map((iii,xxx)=>{
                                        if(!iii) return null
                                        return <Text key={xxx} style={[translate?my_style.stem_txt_trans:my_style.stem_txt,{lineHeight:pxToDp(70)}]}> {iii}</Text>
                                    })
                                }
                                
                            }
                        })}
                    </View>
                }):null}
            </View>
            {public_exercise_image && !hidden_stem_picture?<AutoImage url={public_exercise_image}></AutoImage>:null} 
        </View>
    );
  }
}

const styles = StyleSheet.create({
    txt_fz_fm:{
        textAlign:"center",
        paddingLeft:pxToDp(4),
        paddingRight:pxToDp(4),
    },
    line:{
        borderBottomColor:'#4c4c59',
        borderBottomWidth:pxToDp(4),
        minWidth:pxToDp(100),
        minHeight:pxToDp(50),
        paddingLeft:pxToDp(10),
        paddingRight:pxToDp(10),
        ...appStyle.flexAliCenter
    },
    line_active:{
        borderBottomColor:'#FFAE66'
    },
    line_f:{
        borderBottomWidth:pxToDp(4),
    },
    blank_k:{
        minWidth:pxToDp(50),
        height:pxToDp(50),
        borderWidth:pxToDp(4),
        paddingLeft:pxToDp(4),
        paddingRight:pxToDp(4),
        ...appStyle.flexCenter
    },
    blank_k_active:{
        borderColor:'#FFAE66'
    },
});

export default TopicStemTk
