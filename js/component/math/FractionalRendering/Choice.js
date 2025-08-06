import React, { Component } from "react";
import { Text, StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { pxToDp } from '../../../util/tools'
import {appStyle} from '../../../theme'
import types from '../../../res/data/MathTopaicType'
import TextView from './TextView'

const mapABC = {
    0:'A',
    1:'B',
    2:'C',
    3:'D',
}
const mapabc = {
    0:'a',
    1:'b',
    2:'c',
    3:'d'
}
const map123 = {
    0:'1',
    1:'2',
    2:'3',
    3:'4'
}



export default class Choice extends Component {
constructor(props) {
    super(props);
}
renderContent = (item,index)=>{
    const {name} = this.props 
    let MAP = mapABC
    switch (name) {
        case types.Multipl_Choice_123:
            MAP = map123
        case types.Multipl_Choice_ABC:
            MAP = mapABC
    }
    return <View style={[appStyle.flexLine]} key={index}>
                <Text style={[{fontSize:pxToDp(32),marginRight:pxToDp(16)}]}>{MAP[index]}.</Text>
                <TextView value={item}></TextView>
            </View>
}
  render() {
    const {name,choiceContent} = this.props 
    return (
      <View style={[appStyle.flexTopLine]}>
        <View>
            {choiceContent.map((item,index)=>{
                return this.renderContent(item,index)
            })}
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
});