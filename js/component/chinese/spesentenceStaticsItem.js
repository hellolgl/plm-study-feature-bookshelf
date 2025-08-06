
import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import {
    fontFamilyRestoreMargin,
    padding_tool,
    pxToDp, size_tool,
} from "../../util/tools";
import LinearGradient from "react-native-linear-gradient";
import { appStyle ,appFont} from "../../theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import MyBarChart from '../myBarChart'

class SpesentenceStaticsItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            width: new Animated.Value(0),
            list: this.props.list
        };
    }
    componentDidMount() {
        Animated.timing(this.state.width, {
            toValue: 1,
            duration: 1000,
        }).start();
    }
    render() {
        const { list, width } = this.state;
        return (
            <View style={[
                appStyle.flexJusBetween,
                padding_tool(40),
                {
                    backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : '#fff',
                    borderRadius: pxToDp(32),
                    marginRight: pxToDp(32),
                    width: pxToDp(this.props.width ? this.props.width : 440),
                    height: pxToDp(this.props.height ? this.props.height : 578)
                }]}>
                <View style={[appStyle.flexJusBetween, appStyle.flexLine]}>
                    <Text style={[{ fontSize: pxToDp(32), color: '#666' },appFont.fontFamily_syst,fontFamilyRestoreMargin()]}>{this.props.title}</Text>
                    {
                        this.props.lookDetail ?
                            <TouchableOpacity
                                onPress={this.props.lookDetail}
                            >
                                <Text style={[{ fontSize: pxToDp(28), color: '#0179FF' },appFont.fontFamily_syst,fontFamilyRestoreMargin()]}>{'查看详情'}</Text>
                            </TouchableOpacity>
                            : null
                    }

                </View>
                <View style={[size_tool(this.props.lineWidth ? this.props.lineWidth : 360, 314), {
                    backgroundColor: this.props.backgroundColor ? '#fff' : '#EEF6FF',
                    borderRadius: pxToDp(24),
                    marginTop: pxToDp(32),
                    marginBottom: pxToDp(32)
                }]}>
                    <MyBarChart
                        height={300}
                        width={this.props.lineWidth ? this.props.lineWidth - 10 : 350}
                        right={Number(this.props.right)}
                        wrong={Number(this.props.wrong)}
                        wrongBg={'#FF9898'}
                        rightBg={'#77D102'}
                        rightText={'正确'}
                        wrongText={'错误'}
                    />
                </View>
                {this.props.total ? <View style={[]}>
                    <Text style={[{ fontSize: pxToDp(32), color: '#84D816' },appFont.fontFamily_syst,fontFamilyRestoreMargin()]}>正确率：{((this.props.right / this.props.total) * 100).toFixed(2)}%</Text>
                    <Text style={[{ fontSize: pxToDp(32), color: '#0179FF' },appFont.fontFamily_syst,fontFamilyRestoreMargin()]}>答题量：{this.props.total}</Text>
                </View>
                    : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outer: {
        height: pxToDp(46),
        backgroundColor: "#EEF3F5",
        borderRadius: pxToDp(32),
    },
    inner: {
        position: "absolute",
        left: 0,
        top: 0,
        height: pxToDp(46),
        borderRadius: pxToDp(32),
    },
});

export default SpesentenceStaticsItem;
