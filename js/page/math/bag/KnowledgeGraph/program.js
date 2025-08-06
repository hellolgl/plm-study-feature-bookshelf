import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    ScrollView,
    DeviceEventEmitter
} from "react-native";
import { appFont, appStyle, mathFont } from "../../../../theme";
import { size_tool, pxToDp, padding_tool, borderRadius_tool } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import ProgramExercise from "./components/programExercise";
class KnowledgeGraphPage extends PureComponent {
    constructor(props) {
        super(props);
        this.eventListenerRefreshPage = undefined
        this.state = {
            nowindex: 0,
            list: [],
            nowExercise: {},
            numlist: []
        };
    }
    goBack = () => {
        NavigationUtil.goBack(this.props);
    }
    componentDidMount() {
        let obj = {
            knowledge_code: this.props.navigation.state.params.data.knowledge_code
        }
        // console.log('aaaaaa', obj)

        axios.get(api.getMathProgramExercise, { params: obj }).then((res) => {
            console.log('ExplainPage res', res.data.data)
            if (res.data.err_code === 0) {
                let numlist = []
                for (let i = 0; i < res.data.data.length; i++) {
                    numlist.push(i)
                }
                let now = this.setExercise(res.data.data[this.state.nowindex])
                this.setState({
                    list: res.data.data,
                    nowExercise: now,
                    numlist
                })
            }

        })
    }

    setExercise = (value) => {
        let obj = {}
        let jisObj = {
            '+': '1', '-': '1', '*': '1', '/': '1', '=': '1'
        }
        let list = value.exercise_steps
        let listNum = [], listA = [], listAdd = [], listOther = []
        // obj.namelist = value.name.split("#")
        list.forEach((item, index) => {
            let str = ''
            item.name.split('#').forEach((i) => {
                str += i
                str += ' '
                if (!obj[i]) {
                    obj[i] = '1'
                    if (jisObj[i]) {
                        listAdd.push(i)

                    } else if (!isNaN(Number(i))) {
                        listNum.push(i)
                    } else if (i.length === 1) {
                        listA.push(i)
                    } else {
                        listOther.push(i)
                    }
                    // nlist.push(i)
                }
            })
            value.exercise_steps[index].nameStr = str
            value.exercise_steps[index].inputValue = []
            value.exercise_steps[index].name_json = item.name.split('#')
        })
        return {
            ...value,
            keyboard: {
                jia: listAdd,
                num: listNum,
                one: listA,
                other: listOther
            }
        }
    }

    next = () => {
        const { list, nowindex } = this.state
        if (nowindex + 1 === list.length) {
            // 做完了
            this.goBack()
        } else {
            let index = nowindex + 1
            let exercise = this.setExercise(list[index])
            this.setState({
                nowindex: index,
                nowExercise: exercise
            })

        }

    }

    render() {
        const { nowExercise, numlist, nowindex } = this.state

        return (
            <ImageBackground source={require("../../../../images/MathSyncDiagnosis/bg_1.png")} style={styles.container}>
                <View style={[styles.header]}>
                    <TouchableOpacity style={[size_tool(120, 80)]} onPress={this.goBack}>
                        <Image style={[{ width: pxToDp(120), height: pxToDp(80), }]} source={require('../../../../images/MathSyncDiagnosis/back_btn_1.png')} resizeMode="contain"></Image>
                    </TouchableOpacity>
                    <View style={[appStyle.flexTopLine, { position: 'relative' }]}>
                        <View style={[{
                            width: '100%',
                            borderBottomColor: '#fff',
                            borderBottomWidth: pxToDp(4),
                            position: 'absolute',
                            left: 0,
                            top: pxToDp(40)
                        }]}></View>
                        {
                            numlist.map((item, index) => {
                                return <View style={[size_tool(80), borderRadius_tool(40), appStyle.flexCenter, {
                                    borderColor: '#fff',
                                    borderWidth: pxToDp(4),
                                    backgroundColor: index === nowindex ? '#fff' : '#CBEFFF',
                                    marginRight: pxToDp(index < numlist.length - 1 ? 120 : 0)
                                }]}>
                                    {
                                        index < nowindex ?
                                            <Image style={[size_tool(40)]} source={require('../../../../images/mathProgram/statusIcon2.png')} />
                                            :
                                            <Text style={[{ fontSize: pxToDp(32), color: '#75ABC2' }, appFont.fontFamily_jcyt_700]}>{item + 1}</Text>
                                    }
                                </View>
                            })

                        }
                    </View>
                    {/* <View style={[size_tool(120, 80)]} > </View> */}
                    <View style={[size_tool(120, 80)]}></View>
                </View>
                {
                    nowExercise.exercise_id ?
                        <ProgramExercise exercise={nowExercise} goBack={this.goBack} next={this.next} />
                        : null
                }


            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: pxToDp(Platform.OS === 'ios' ? 40 : 0)
        // paddingLeft: pxToDp(40),
        // paddingRight: pxToDp(40)
    },
    header: {
        height: pxToDp(120),
        ...appStyle.flexLine,
        ...appStyle.flexJusBetween,
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20),

    },
    back_btn: {
        ...appStyle.flexLine,
        position: "absolute",
        left: pxToDp(0)
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

export default connect(mapStateToProps, mapDispathToProps)(KnowledgeGraphPage);
