import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { pxToDp} from '../util/tools';

/*水平方向的虚线
 * len 虚线个数
 * width 总长度
 * backgroundColor 背景颜色
 * */
export default class DashSecondLine extends Component {
    render() {
        var len = this.props.len;
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }
        const style = this.props.style||styles.dashLine
        const dashItemStyle = this.props.dashItemStyle||styles.dashItem
        return (
            <View style={[style, { height: this.props.width,},]}>
                {arr.map((item, index) => {
                    return (
                        <Text style={[dashItemStyle, { backgroundColor: this.props.backgroundColor }]} key={'dash' + index}>
                        </Text>
                    );
                })}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    dashLine: {
        flexDirection: 'column',
    },
    dashItem: {
        height: pxToDp(4),
        width: pxToDp(4),
        marginTop: pxToDp(6),
        flex: 1,
    },
});
