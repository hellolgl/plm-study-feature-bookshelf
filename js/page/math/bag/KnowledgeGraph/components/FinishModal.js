import React, { Component } from "react";
import {
    View, StyleSheet, Image, Modal, Text, TouchableOpacity,
} from "react-native";
import {
    borderRadius_tool,
    padding_tool,
    pxToDp, pxToDpHeight, size_tool,
} from "../../../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../../../theme";
import { connect } from "react-redux";

class StatisticsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resultIndex: 1,
            visible: props.visible,
        }
        this.indeexInterval = null
    }
    componentDidMount() {
    }

    setIndex = () => {

        const { exercise_type, result } = this.props
        if (exercise_type === '2') {
            this.setState({
                resultIndex: result.length
            })
        } else {
            this.indeexInterval = setInterval(() => {
                this.setState((state) => ({
                    resultIndex: state.resultIndex + 1
                }), () => {
                    console.log('完成定时器', this.props.result)

                    if (this.state.resultIndex === this.props.result.length) {
                        clearInterval(this.indeexInterval)
                        // this.setState({
                        //     timing: false,
                        //     num: 60
                        // })
                    }
                });
            }, 300);
        }

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.visible !== this.props.visible && this.props.visible) {
            this.setIndex()
        }
    }

    render() {
        const { visible, result, is_guide, pinyin, exercise_type } = this.props
        const { resultIndex } = this.state
        let resultlist = result.split(''), pinyinlist = pinyin.split('#')
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                supportedOrientations={['portrait', 'landscape']}
            >
                <View style={[styles.container]}>
                    <View style={[styles.content]}>
                        <Text style={[appFont.fontFamily_jcyt_500, { fontSize: pxToDp(28), color: '#5A5A68', lineHeight: pxToDp(32) }]}>yùn xíng jié guǒ</Text>
                        <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(48), color: '#5A5A68', lineHeight: pxToDp(56), marginBottom: pxToDp(40) }]}>运行结果</Text>

                        <View style={[appStyle.flexTopLine]}>
                            <View style={[size_tool(680, 440), padding_tool(40), borderRadius_tool(40), appStyle.flexTopLine, appStyle.flexLineWrap, { backgroundColor: '#EFEFF6' }]}>
                                {/* {console.log('定时器', resultIndex)} */}
                                {exercise_type === '2' ?
                                    <Text style={[{ fontSize: pxToDp(48), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}>{result} </Text>

                                    :
                                    resultlist.map((item, index) =>
                                        index < resultIndex ? <View key={index} style={[appStyle.flexAliCenter, {
                                            width:
                                                pxToDp(pinyinlist[index] && pinyinlist[index].length > 3 ? 20 * pinyinlist[index].length :
                                                    isNaN(Number(item)) ?
                                                        70 : 40)
                                        }]}>
                                            {pinyin.length > 0 ?
                                                <Text style={[{ fontSize: pxToDp(28), color: '#4C4C59' }, appFont.fontFamily_jcyt_500]}>{pinyinlist[index]} </Text>
                                                : null}
                                            <Text style={[{ fontSize: pxToDp(48), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}>{item}</Text>
                                        </View>

                                            : null)
                                }
                                {/* <Text style={[{ fontSize: pxToDp(48), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}> {
                                    result.split('').map((item, index) => index < resultIndex ? item : '')
                                }
                                </Text> */}
                            </View>
                            <Image source={require('../../../../../images/mathProgram/pandaFinish.png')} style={[size_tool(476, 440), { marginBottom: pxToDp(40) }]} />

                        </View>
                        <View style={[appStyle.flexTopLine]}>
                            {is_guide ? <TouchableOpacity style={{ marginBottom: pxToDp(40) }} onPress={() => {
                                this.setState({
                                    resultIndex: 0
                                })
                                clearInterval(this.indeexInterval)
                                this.props.todo()
                            }}>
                                <View style={[size_tool(400, 150), borderRadius_tool(200), { backgroundColor: '#00836D', paddingBottom: pxToDp(6) }]}>
                                    <View style={[appStyle.flexCenter, { flex: 1, backgroundColor: '#00B295', borderRadius: pxToDp(200) }]}>
                                        <Text style={[appFont.fontFamily_jcyt_500, { fontSize: pxToDp(20), color: '#fff', lineHeight: pxToDp(26) }]}>zì zhǔ mó shì</Text>
                                        <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(32), color: '#fff', lineHeight: pxToDp(40) }]}>自主模式</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                                :
                                <TouchableOpacity style={{ marginBottom: pxToDp(40) }} onPress={() => {
                                    this.setState({
                                        resultIndex: 0
                                    })
                                    clearInterval(this.indeexInterval)
                                    this.props.todo()
                                }}>
                                    <View style={[size_tool(400, 150), borderRadius_tool(200), { backgroundColor: '#00836D', paddingBottom: pxToDp(6) }]}>
                                        <View style={[appStyle.flexCenter, { flex: 1, backgroundColor: '#00B295', borderRadius: pxToDp(200) }]}>
                                            <Text style={[appFont.fontFamily_jcyt_500, { fontSize: pxToDp(20), color: '#fff', lineHeight: pxToDp(26) }]}>hǎo de</Text>
                                            <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(32), color: '#fff', lineHeight: pxToDp(40) }]}>好的</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={[size_tool(400, 150), appStyle.flexCenter]} onPress={() => {
                                this.setState({
                                    resultIndex: 1
                                })
                                clearInterval(this.indeexInterval)
                                this.props.close()
                            }}>
                                <Text style={[appFont.fontFamily_jcyt_500, { fontSize: pxToDp(20), color: '#00B295', lineHeight: pxToDp(26) }]}>tuì chū</Text>
                                <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(32), color: '#00B295', lineHeight: pxToDp(40) }]}>退出</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(76, 76, 89, .6)",
        ...appStyle.flexCenter
    },
    content: {
        width: pxToDp(1356),
        borderRadius: pxToDp(60),
        backgroundColor: "#fff",
        ...appStyle.flexAliCenter,
        paddingTop: pxToDp(40),
        paddingBottom: pxToDp(40)
    },

});

const mapStateToProps = (state) => {
    return {
        language_data: state.getIn(["languageMath", "language_data"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(StatisticsModal);
