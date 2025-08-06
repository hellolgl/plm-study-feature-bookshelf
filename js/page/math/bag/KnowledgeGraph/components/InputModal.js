import React, { Component } from "react";
import {
    View, StyleSheet, TextInput, Modal, Text, TouchableOpacity, Image
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
            list: props.inputList,
            index: 0,
            iswrong: false,
            inputNum: [],
            showPen: true
        }
        this.indeexInterval = null
        this.textInputRef = React.createRef()
    }
    static getDerivedStateFromProps(props, state) {
        let tempState = { ...state };
        if (JSON.stringify(props.inputList) !== JSON.stringify(tempState.list)) {
            tempState.list = props.inputList
            tempState.index = 0
            tempState.iswrong = false
            tempState.inputNum = []
            tempState.showPen = true
            return tempState
        }
        return null
    }

    inputNum = (value) => {
        const { list, index, inputNum } = this.state
        let wrong = false
        let val = Number(value)
        let listnow = JSON.parse(JSON.stringify(inputNum))

        if (isNaN(val) || val < list[index].min || val > list[index].max) {
            wrong = true
        } else {
            typeof (listnow[index]) === 'number' ?
                listnow[index] = val : listnow.push(val)
        }
        this.setState({
            iswrong: wrong,
            inputNum: listnow
        })

    }
    sureInput = () => {
        const { list, index, iswrong, inputNum } = this.state
        // console.log('sureinput',list,index,iswrong,inputNum)
        if (iswrong) return
        if (index === list.length - 1) {
            // 最后一个输入，已经输入完毕
            // console.log(inputNum)
            if (list.length !== inputNum.length) return
            this.setState({ showPen: true, list: [] })
            this.props.close(inputNum)
        } else {
            let indexnow = index
            this.setState({
                index: indexnow + 1,
                iswrong: false,
            })
        }
    }
    blur = () => {
        this.setState({
            showPen: false
        })
    }
    clickPen = () => {
        this.textInputRef?.current.focus()
    }
    render() {
        const { visible, } = this.props
        const { list, index, iswrong, showPen } = this.state
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                supportedOrientations={['portrait', 'landscape']}
            >
                <View style={[styles.container]}>
                    <View style={[styles.content]}>
                        <Text style={[appFont.fontFamily_jcyt_500, { fontSize: pxToDp(28), color: '#5A5A68', lineHeight: pxToDp(32) }]}>{list[0]?.text_pinyin}</Text>
                        <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(48), color: '#5A5A68', lineHeight: pxToDp(56), marginBottom: pxToDp(40) }]}>{list[0]?.text}</Text>

                        <View style={[size_tool(840, 140), borderRadius_tool(40), { backgroundColor: '#F0F2F7', marginBottom: pxToDp(20), borderWidth: pxToDp(4), borderColor: '#D2D4DA', position: 'relative' }]} >
                            <TextInput ref={this.textInputRef} onFocus={this.blur} onChangeText={this.inputNum} keyboardType='numeric' placeholder=""
                                style={[size_tool(840, 140), appFont.fontFamily_jcyt_700, { fontSize: pxToDp(68), }, padding_tool(10, 20, 10, 20),]} />
                            {
                                showPen ? <TouchableOpacity style={[{ position: 'absolute', zIndex: 0, top: pxToDp(40), left: pxToDp(390) }]} onPress={this.clickPen}>
                                    <Image
                                        style={[size_tool(60), {}]}
                                        source={require('../../../../../images/mathProgram/pen.png')} />
                                </TouchableOpacity> : null
                            }
                        </View>
                        {
                            iswrong ? <View>
                                <Text style={[appFont.fontFamily_jcyt_500, { fontSize: pxToDp(20), color: '#FF7D7D', lineHeight: pxToDp(32) }]}>qǐng shū rù {list[index].min} -{list[index].max} nèi de shù zì</Text>
                                <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(32), color: '#FF7D7D', lineHeight: pxToDp(56), marginBottom: pxToDp(40) }]}>请输入{list[index].min} -{list[index].max} 内的数字</Text>

                            </View> : <View style={[{ marginBottom: pxToDp(40) }]}></View>
                        }
                        <TouchableOpacity style={{ marginBottom: pxToDp(40) }} onPress={this.sureInput}>
                            <View style={[size_tool(400, 150), borderRadius_tool(200), { backgroundColor: '#00836D', paddingBottom: pxToDp(6) }]}>
                                <View style={[appStyle.flexCenter, { flex: 1, backgroundColor: '#00B295', borderRadius: pxToDp(200) }]}>
                                    <Text style={[appFont.fontFamily_jcyt_500, { fontSize: pxToDp(20), color: '#fff', lineHeight: pxToDp(26) }]}>què dìng</Text>
                                    <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(40), color: '#fff', lineHeight: pxToDp(40) }]}>确定</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
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
        width: pxToDp(980),
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
