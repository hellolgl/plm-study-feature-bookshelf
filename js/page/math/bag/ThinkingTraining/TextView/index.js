import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import {pxToDp} from "../../../../../util/tools"
import {appStyle} from "../../../../../theme"
import Franction from './Franction'

const log = console.log.bind(console)

export default class FractionStem extends Component {
    constructor(props) {
        super(props);
    }
    renderString = (item,indexJ)=>{
        let {textStyle} = this.props
        let _itemArr = item.split('')
        let htm = _itemArr.map((i,index)=>{
            return <Text key={index} style={[{fontSize:pxToDp(36)},item === '=' || item === '+' || item === '-' || item === '×' || item === '÷' || item === '○'?{marginLeft:pxToDp(4),marginRight:pxToDp(4)}:null,item === '○'?{fontSize:pxToDp(52)}:null, textStyle]}>{i}</Text>
        })
        return <>{htm}</>
    }
    render() {
        let {value, textStyle, contentStyle} = this.props
        if (textStyle === undefined) {
            textStyle = {}
        }
        if (contentStyle === undefined) {
            contentStyle = {}
        }
        if(value && value.length >0 && value[0][0] && !Array.isArray(value[0][0]) && !value[0][0].replace(/\s*/g,"")) return null
        return (
            <View
                // style={[styles.debug]}
            >
                {value && value.length>0?value.map((item,index)=>{
                    return <View style={[appStyle.flexLine, contentStyle]} key={index}>
                        {item.map((j,indexJ)=>{
                            if(Array.isArray(j)){
                                return <Franction value={j} key={indexJ} textStyle={textStyle}></Franction>
                            }else{
                                return this.renderString(j)
                            }
                        })}
                    </View>
                }):null}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    debug: {
        borderWidth: 1,
        borderColor: "green",
        // maxWidth: pxToDp(1760),
        maxWidth: pxToDp(300),
        flexWrap: "wrap"
    },
});