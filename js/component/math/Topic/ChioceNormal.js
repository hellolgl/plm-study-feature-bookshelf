import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image
} from "react-native";
import { appStyle } from "../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../util/tools";
import url from '../../../util/url'
import topaicTypes from '../../../res/data/MathTopaicType'
import AutoImage from './AutoImage'
import Choice from '../FractionalRendering/Choice'


class Chioce extends PureComponent {
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
        default: 
          return {
            0:'A',
            1:'B',
            2:'C',
            3:'D',
        }
      }
  }

  renderContent = ()=>{
    const {currentTopaicData} = this.props
    if(currentTopaicData.displayed_type !== topaicTypes.Multipl_Choice) return null
    if(!Array.isArray(currentTopaicData.choice_content))currentTopaicData.choice_content = currentTopaicData.choice_content.split('#')
    let htm = ''
    let _map = this.getMapType(currentTopaicData.name)
    if((currentTopaicData.exercise_data_type === 'FS' || currentTopaicData.data_type === 'FS') && currentTopaicData.choice_content_type !== 'img'){
      return <Choice name = {currentTopaicData.name} choiceContent = {currentTopaicData.choice_content}></Choice>
    }
    if(!currentTopaicData.choice_content_type || currentTopaicData.choice_content_type === 'text'){
        htm = currentTopaicData.choice_content.map((item,index)=>{
            return <Text style={[{fontSize:pxToDp(36),marginBottom:pxToDp(8)}]}>{_map[index]}.{item}</Text>
        })
    }
    if(currentTopaicData.choice_content_type === 'img'){
        htm = currentTopaicData.choice_content.map((item,index)=>{
            return <View style={[appStyle.flexTopLine]} key={index}>
                <Text style={[{fontSize:pxToDp(36)}]}>{_map[index]}.</Text>
                <AutoImage url={item}></AutoImage>
            </View>
        })
    }
    
    return <View>{htm}</View>
  }
  render() {
    
    return <View>
        {this.renderContent()}
    </View>
  }
}

const styles = StyleSheet.create({
});
export default Chioce;
