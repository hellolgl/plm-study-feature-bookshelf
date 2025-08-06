/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { PureComponent, Component } from 'react';
import {
    StyleSheet,
    View,
    Text as RN_Text
} from 'react-native';


import Svg, {
    Circle,
} from 'react-native-svg';
import { borderRadius_tool, padding_tool, pxToDp, size_tool } from '../../util/tools';



export default class myPie extends PureComponent {
    constructor(props) {
        super(props);
    }


    RadarMap = () => {
        let length = this.props.length
        let per = this.props.percent
        let x = length * Math.PI * per * 2
        let y = length * Math.PI * (1 - per) * 2
        return (<View style={[size_tool(this.props.width), borderRadius_tool(this.props.width / 2)]}>
            <Svg width={pxToDp(this.props.width + 1)} height={pxToDp(this.props.width + 1)} >
                <Circle
                    r={length}
                    cx={length * 2}
                    cy={length * 2}
                    // x1={100}
                    // y1={100}
                    fill={"transparent"}
                    stroke={this.props.color ? this.props.color : "#FFAA5C"}
                    // strokeLinecap={"butt"}
                    strokeWidth={length * 2}
                    strokeDasharray={[x, per === 0 ? y + 30 : y]}
                    strokeDashoffset={length * Math.PI * 0.5}
                />
            </Svg>
        </View>
        )
    }


    render() {

        return this.RadarMap()

    }
}

const styles = StyleSheet.create({
    radar_view: {
        // backgroundColor:'transparent',
        // backgroundColor: 'transparent',
        // borderWidth: pxToDp(4),
        // borderColor: '#E4E4F0',
    },
});

