import React, { PureComponent } from "react";
import {
  StyleSheet, View,Text
} from "react-native";
import {pxToDp, pxToDpHeight } from "../../../util/tools";
import AutoImage from './AutoImage'
import { appFont, appStyle } from "../../../theme";
import Franction from '../FractionalRendering/Franction_new'

class ApplicationExplanation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        understand:[],
        method:[],
        correct_answer:[],
    };
  }

  componentDidMount(){
    const {data} = this.props
    const {understand,method,correct_answer} = data
    let _understand = this.getArr(understand)
    let _method = this.getArr(method)
    let _correct_answer = this.getArr(correct_answer)
    this.setState({
        understand:_understand,
        method:_method,
        correct_answer:_correct_answer,
    })
  }

  getArr = (value) =>{
    if(!value) return []
    const {data} = this.props
    const {exercise_data_type} = data
    let arr = []
    if(exercise_data_type === 'FS'){
        arr = JSON.parse(value)
    }else{
        arr = value.split('\n').filter(i=>{
            return i
        })
        arr.forEach((i,x)=>{
            arr[x] = i.split('#')
        })
    }    
    return arr
  }

  renderContent = (arr) =>{
    const {data,my_style} = this.props
    const {exercise_data_type} = data
    if(exercise_data_type === "FS"){
        return arr.map((i,x)=>{
            return <View style={[appStyle.flexLine,appStyle.flexLineWrap]} key={x}>
                {i.map((ii,xx)=>{
                    if(Array.isArray(ii)){
                        return <Franction key={xx} value={ii} txt_style={[my_style.explanation_content_txt]} fraction_border_style={{borderBottomColor:my_style.explanation_content_txt.color}}></Franction>
                    }
                    return <Text style={[my_style.explanation_content_txt,{lineHeight:pxToDp(70)}]} key={xx}>{ii}</Text>
                })}
            </View>
        })
    }
    return arr.map((i,x)=>{
        return <View style={[appStyle.flexLine,appStyle.flexLineWrap]} key={x}>
            {i.map((ii,xx)=>{
                return <Text style={[my_style.explanation_content_txt,{lineHeight:pxToDp(70)}]} key={xx}>{ii}</Text>
            })}
        </View>
    })
  }

  renderAnswer = () => {
    const {data,my_style} = this.props
    const {answer_content,exercise_data_type} = data
    const {explanation_correct_answer_txt} = my_style
    let htm = null
    if(exercise_data_type === 'FS'){
      htm = answer_content.map((i,x)=>{
        return <View style={[appStyle.flexLine,{marginRight:pxToDp(40)}]}>
          {i.map((ii,xx)=>{
            if(Array.isArray(ii)){
              return <View style={[appStyle.flexLine,{marginRight:pxToDp(20)}]}>
                <Franction key={xx} value={ii} txt_style={[explanation_correct_answer_txt]} fraction_border_style={{borderBottomColor:explanation_correct_answer_txt.color}}></Franction>
              </View>
            }else{
              return <View style={[appStyle.flexLine,{marginRight:pxToDp(20)}]}>
                <Text key={xx} style={[explanation_correct_answer_txt]}>{ii}</Text>
              </View>
            }
          })}
        </View>
      })
    }else{
      htm = answer_content.split(';').map((i,x)=>{
        return <Text key={x} style={[explanation_correct_answer_txt,{marginRight:pxToDp(40)}]}>{i}</Text>
      })
    }
    return <View style={[appStyle.flexLine,Platform.OS === 'ios'?{marginTop:pxToDp(10),marginBottom:pxToDp(20)}:null]}>
      <Text style={[explanation_correct_answer_txt]}>正确答案：</Text>
      {htm}
    </View>
  }
  render() {
    const {data,my_style} = this.props
    const {understand_img,method_img,correct_answer_img,_correct,exercise_data_type,answer_content} = data
    const {understand,method,correct_answer} = this.state
    return (
      <>
        {_correct === 0?this.renderAnswer():null}
        <Text style={[my_style.explanation_txt]}>解析：</Text>
        {understand?this.renderContent(understand):null}
        <AutoImage url={understand_img}></AutoImage>
        {method?this.renderContent(method):null}
        <AutoImage url={method_img}></AutoImage>
        {correct_answer?this.renderContent(correct_answer):null}
        <AutoImage url={correct_answer_img}></AutoImage>
      </>
    );
  }
}

export default ApplicationExplanation;
