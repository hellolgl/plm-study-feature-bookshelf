import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text
} from "react-native";
import {
  pxToDp,
} from "../../../../../util/tools";
import RichShowView from '../../../../../component/math/RichShowView'
import { Modal } from "antd-mobile-rn";
import TextView from '../../../../../component/math/FractionalRendering/TextView'
import topaicTypes from '../../../../../res/data/MathTopaicType'
import ChioceFranction from '../../../../../component/math/FractionalRendering/Choice'

export default class Chioce extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  getMapType = (type)=>{
    switch (type) {
        case topaicTypes.Multipl_Choice_123:
          return {
            0:'1',
            1:'2',
            2:'3',
            3:'4',
        }
        case topaicTypes.Multipl_Choice_ABC:
          return {
            0:'A',
            1:'B',
            2:'C',
            3:'D',
        }
        default: 
          return {
            0:'a',
            1:'b',
            2:'c',
            3:'d',
        }
      }
  }

  renderContent = ()=>{
    const {currentTopaicData} = this.props
    let choice_content_type = currentTopaicData.choice_content_type
    let topic_type = currentTopaicData.topic_type
    let choice_content = currentTopaicData.choice_content
    let exercise_type_name = currentTopaicData.exercise_type_name
    let isFraction = currentTopaicData.isFraction
    let htm = null
    let map = this.getMapType(exercise_type_name)
    if(choice_content_type === '1'){
        return null
    }
    if(topic_type === '0' && !isFraction){
        htm = choice_content.split('#').map((item,index)=>{
            return <Text style={{fontSize:pxToDp(36)}}>{map[index]}.{item}</Text>
        })
    }else{
      return <ChioceFranction name = {exercise_type_name} choiceContent = {choice_content}></ChioceFranction>
    }
    return htm
  }

  render() {
    return (
        <>
            {this.renderContent()}
        </>
    );
  }
}

const styles = StyleSheet.create({
});
