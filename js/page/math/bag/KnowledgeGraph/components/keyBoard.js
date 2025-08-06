import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    Platform
} from "react-native";
import { appFont, appStyle, mathFont } from "../../../../../theme";
import { pxToDp, size_tool } from "../../../../../util/tools";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
const windowWidth = Dimensions.get('window').width;



class Keyboard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_guide: props.is_guide,
            nowValue: '',
            litleindex: 0,
            bigindex: 0,
            isfinish: false,
            nowBtn: props.exercise.exercise_steps[0].name_json[0],
            keyboard: props.keyboard
        };
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    clickItem = (item, type) => {
        // if (type === 'left') {
        //     this.setState({
        //         currentIndex_left: index
        //     })
        // }
        const { litleindex, bigindex, isfinish, is_guide, nowBtn } = this.state
        let lindexnow = litleindex, bindexnow = bigindex, finish = isfinish

        if (finish) return
        if (is_guide) {

            let steps = this.props.exercise.exercise_steps
            if (item !== nowBtn) {
                return
            }

            if (lindexnow + 1 < steps[bigindex].name_json.length) {
                // 这一行没有点击完
                ++lindexnow
            } else {
                // 这一行点击完了
                lindexnow = 0
                if (bindexnow + 1 === steps.length) {
                    // 点击完毕
                    finish = true
                }
                bindexnow + 1 === steps.length ? bindexnow = -1 : ++bindexnow

            }
            this.setState({
                litleindex: lindexnow,
                bigindex: bindexnow,
                nowBtn: bindexnow >= 0 ? steps[bindexnow].name_json[lindexnow] : '',
                isfinish: finish
            })
        }

        is_guide ? this.props.guidChangeValues(item, type, bindexnow) :
            this.props.changeValues(item, type)
    }

    static getDerivedStateFromProps(props, state) {
        let tempState = { ...state };
        if (props.is_guide !== tempState.is_guide || JSON.stringify(props.keyboard) !== JSON.stringify(tempState.keyboard)) {
            tempState.is_guide = props.is_guide
            tempState.litleindex = 0
            tempState.bigindex = 0
            tempState.isfinish = false
            tempState.keyboard = props.keyboard
            tempState.nowBtn = props.exercise.exercise_steps[0].name_json[0]
            return tempState
        }
        return null
    }

    render() {
        const { is_guide, litleindex, bigindex, nowBtn, keyboard } = this.state
        // const { keyboard, } = this.props
        const { jia, num, one, other } = keyboard
        return (
            <View>
                <LinearGradient
                    style={[styles.shadow]}
                    colors={[
                        "rgba(76, 76, 89, 0.1)",
                        "rgba(76, 76, 89, 0.8)",
                        "rgba(76, 76, 89, 1)",
                    ]}
                >
                </LinearGradient>
                {is_guide && litleindex === 0 ? <View style={[{ position: 'absolute', top: pxToDp(-200), left: pxToDp(100) }, appStyle.flexTopLine]}>
                    <Image source={require('../.././../../../images/mathProgram/pandaHead.png')} style={[size_tool(200)]} />
                    <View style={[{ backgroundColor: '#172F49', marginLeft: pxToDp(60), borderRadius: pxToDp(40), height: pxToDp(174), padding: pxToDp(40), position: 'relative' }]}>
                        <Text style={[{ color: '#fff', fontSize: pxToDp(26), lineHeight: pxToDp(30) }, appFont.fontFamily_jcyt_500]}>{bigindex === -1 ?
                            'dài mǎ yǐ wán chéng ，qǐng diǎn jī yòu shàng jiǎo yùn xíng àn niǔ chá kàn jié guǒ 。'
                            : this.props.exercise.exercise_steps[bigindex]?.guide_tip_pinyin}</Text>

                        <Text style={[{ color: '#fff', fontSize: pxToDp(48), lineHeight: pxToDp(50) }, appFont.fontFamily_jcyt_700]}>{bigindex === -1 ?
                            '代码已完成 ， 请 点击右 上 角运 行  按钮查看结果'
                            : this.props.exercise.exercise_steps[bigindex]?.guide_tip}</Text>
                        <View style={styles.triangle_up}></View>
                    </View>
                </View> : null}
                <View style={[styles.container]}>

                    <View style={[appStyle.flexLine]}>

                        <View style={[appStyle.flexLine, { flex: 1, marginRight: pxToDp(18) }]}>
                            {num.map((item, index) => {
                                return <TouchableOpacity style={[styles.item,
                                appStyle.flexCenter,
                                {
                                    backgroundColor: `rgba(207, 214, 229, ${is_guide ? nowBtn === item ? 1 : 0.2 : 1})`,
                                    // 
                                }]} key={index} onPress={() => { this.clickItem(item, 'num') }} >

                                    <Text style={[styles.itemtxt, { color: `rgba(76, 76, 89, ${is_guide ? nowBtn === item ? 1 : 0.2 : 1})`, }]}>{item}</Text>
                                </TouchableOpacity>
                            })}
                            {jia.map((item, index) => {
                                // let opacity = !() ? 1 : 0.2
                                // console.log('a透明度', opacity)
                                return <TouchableOpacity style={[styles.item,
                                appStyle.flexCenter,
                                {
                                    backgroundColor: `rgba(47, 220, 168, ${is_guide ? nowBtn === item ? 1 : 0.2 : 1})`,

                                },]} key={index} onPress={() => { this.clickItem(item, 'jia') }} >

                                    <Text style={[styles.itemtxt, { color: `rgba(76, 76, 89, ${is_guide ? nowBtn === item ? 1 : 0.2 : 1})`, }]}>{item}</Text>
                                </TouchableOpacity>
                            })}
                            {one.map((item, index) => {
                                return <TouchableOpacity style={[styles.item,
                                appStyle.flexCenter,
                                { backgroundColor: `rgba(255, 147, 94, ${is_guide ? nowBtn === item ? 1 : 0.2 : 1})`, }]} key={index} onPress={() => { this.clickItem(item, 'one') }} >

                                    <Text style={[styles.itemtxt, { color: `rgba(76, 76, 89,  ${is_guide ? nowBtn === item ? 1 : 0.2 : 1})`, },]}>{item}</Text>
                                </TouchableOpacity>
                            })}
                            {other.map((item, index) => {
                                return <TouchableOpacity style={[styles.item,
                                appStyle.flexCenter,
                                { backgroundColor: `rgba(90, 90, 104, ${is_guide ? nowBtn === item ? 1 : 0.2 : 1})`, }]} key={index} onPress={() => { this.clickItem(item, 'other') }} >

                                    <Text style={[styles.itemtxt, { color: `rgba(255, 255, 255, ${is_guide ? nowBtn === item ? 1 : 0.2 : 1})`, },]}>{item}</Text>
                                </TouchableOpacity>
                            })}
                        </View>


                    </View>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    shadow: {
        width: windowWidth,
        height: pxToDp(60),
        position: 'absolute',
        top: pxToDp(-30),
        opacity: .1,
    },
    container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: pxToDp(40),
        borderTopRightRadius: pxToDp(40),
        padding: pxToDp(40),
        width: windowWidth,
    },
    item: {
        height: pxToDp(100),
        padding: pxToDp(32),
        borderRadius: pxToDp(20),
        marginRight: pxToDp(40),
        paddingTop: 0,
        paddingBottom: 0
    },
    triangle_up: {
        width: 0,
        height: 0,
        borderLeftWidth: pxToDp(16),
        borderLeftColor: 'transparent',
        borderRightWidth: pxToDp(20),
        borderRightColor: '#172F49',
        borderBottomWidth: pxToDp(20),
        borderBottomColor: 'transparent',
        borderTopWidth: pxToDp(20),
        borderTopColor: 'transparent',
        position: 'absolute',
        top: pxToDp(70),
        left: pxToDp(-30)
    },
    itemtxt: {
        fontSize: pxToDp(44),
        lineHeight: pxToDp(100),
        ...appFont.fontFamily_jcyt_700
    }
});
const mapStateToProps = (state) => {
    return {
        language_data: state.getIn(["languageMath", "language_data"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(Keyboard);
