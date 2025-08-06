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
import { appStyle } from "../../../../../../../theme";
import { size_tool, pxToDp, fitHeight } from "../../../../../../../util/tools";
import AnswerView from './AnswerView'

class StemTk extends PureComponent {
  constructor(props) {
    super(props);
    this.AnswerView = undefined
    this.state = {
        currentIndex:-1,
        my_answer_tk_map:props.data.my_answer_tk_map
    };
  }



  componentDidMount(){
    const {my_answer_tk_map} = this.state
    let key_arr = Object.keys(my_answer_tk_map)
    this.setState({
        currentIndex:key_arr[0]
    })
    this.props.onRef(this)
  }

  clickSpace = (x,xx,xxx)=>{
    const {currentIndex,my_answer_tk_map} = this.state
    let _my_answer_tk_map = JSON.parse(JSON.stringify(my_answer_tk_map))
    if(xxx || xxx === 0){
        if(currentIndex === `${x}${xx}${xxx}`){
            this.setState({
                currentIndex:-1
            })
            return
        }
    }else{
        if(currentIndex === `${x}${xx}`){
            this.setState({
                currentIndex:-1
            })
            return
        }
    }
    let key = `${x}${xx}`
    if(xxx || xxx === 0){
        key = `${x}${xx}${xxx}`
    }
    _my_answer_tk_map[key].cursor_idx = _my_answer_tk_map[key].init_char_mat.length - 1   //切换时候光标始终在最后一位
    this.setState({
        currentIndex : key,
        my_answer_tk_map:_my_answer_tk_map
    })
  }

  changeValues = (value) =>{
    const {currentIndex,my_answer_tk_map} = this.state
    console.log('键盘输入',value,currentIndex)
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
    })
  }

  changeIdx = (idx)=>{
    const {currentIndex,my_answer_tk_map} = this.state
    let _my_answer_tk_map = JSON.parse(JSON.stringify(my_answer_tk_map))
    _my_answer_tk_map[currentIndex].cursor_idx = idx
    this.setState({
        my_answer_tk_map:_my_answer_tk_map
    })
  }

  renderItem = (value,x,xx,xxx)=>{
    const {currentIndex,my_answer_tk_map} = this.state
    if(value === 'k'){
        return <TouchableOpacity style={[styles.blank_k,`${x}${xx}${xxx}`===currentIndex?styles.blank_k_active:null]} onPress={()=>{this.clickSpace(x,xx,xxx)}}>
            {`${x}${xx}${xxx}`===currentIndex?<AnswerView value={my_answer_tk_map[`${x}${xx}${xxx}`]} onRef={(ref)=>{this.AnswerView = ref}} changeIdx={this.changeIdx}></AnswerView>:
            <View style={[appStyle.flexLine]}>
                {my_answer_tk_map[`${x}${xx}${xxx}`].init_char_mat.map((i,x)=>{
                    return <Text style={[{fontSize:pxToDp(36)},appStyle.flexLine]}>{i}</Text>
                })}
            </View>} 
        </TouchableOpacity>
    }else{
        return <View style={[appStyle.flexLine,appStyle.flexCenter]}>
            <Text style={[styles.txt_1,styles.txt_fz]}>{value}</Text>
        </View>
        
    }
  }

  render() {
    const {currentIndex,my_answer_tk_map} = this.state
    const {data} = this.props
    const {stem_tk} = data
    return (
        <View style={[styles.container]}>
            {stem_tk.length > 0?stem_tk.map((i,x)=>{
                return <View style={[appStyle.flexLine]} key={x}>
                    {i.map((ii,xx)=>{
                        if(ii === 'k'){
                            return <TouchableOpacity style={[styles.line,`${x}${xx}`===currentIndex?styles.line_active:null]} key={xx} onPress={()=>{this.clickSpace(x,xx)}}>
                                {`${x}${xx}`===currentIndex?<AnswerView value={my_answer_tk_map[`${x}${xx}`]} onRef={(ref)=>{this.AnswerView = ref}} changeIdx={this.changeIdx}></AnswerView>:
                                <View style={[appStyle.flexLine]}>
                                    {my_answer_tk_map[`${x}${xx}`].init_char_mat.map((i,x)=>{
                                        return <Text style={[{fontSize:pxToDp(36)},appStyle.flexLine]} key={x}>{i}</Text>
                                    })}
                                </View>} 
                            </TouchableOpacity>
                        }else{
                            if(Array.isArray(ii)){
                                if(ii.length === 2){
                                    return <View key={xx}>
                                        <View>
                                            {this.renderItem(ii[0],x,xx,0)}
                                            <View style={[styles.line_f]}></View>
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
                                                <View style={[styles.line_f]}></View>
                                            </View>
                                            <View>{this.renderItem(ii[2],x,xx,2)}</View>
                                        </View>
                                        
                                    </View>
                                }
                            }
                            return <Text key={xx} style={[styles.txt_1]}>{ii}</Text>
                        }
                    })}
                </View>
            }):null}
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
    txt_1:{
        fontSize:pxToDp(40)
    },
    line:{
        borderBottomColor:'#333',
        borderBottomWidth:pxToDp(4),
        minWidth:pxToDp(100),
        height:pxToDp(50),
        paddingLeft:pxToDp(8),
        paddingRight:pxToDp(8)
    },
    line_active:{
        borderBottomColor:'red'
    },
    txt_fz:{
        textAlign:"center",
        paddingLeft:pxToDp(4),
        paddingRight:pxToDp(4),
        // borderBottomColor:'#333',
        // borderBottomWidth:pxToDp(4),
        // marginBottom:pxToDp(4)
    },
    line_f:{
        borderBottomColor:'#333',
        borderBottomWidth:pxToDp(4),
        marginBottom:pxToDp(4),
        marginTop:pxToDp(4)
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
        borderColor:'red'
    }
});
export default StemTk;
