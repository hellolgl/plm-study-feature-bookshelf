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
import { appFont, appStyle, mathFont } from "../../../theme";
import { pxToDp } from "../../../util/tools";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import topaicTypes from '../../../res/data/MathTopaicType'
const windowWidth = Dimensions.get('window').width;

const left_arr_1 = [
    {
        value: '1',
    },
    {
        value: '2',
    },
    {
        value: '3',
    },
    {
        value: '4',
    },
    {
        value: '5',
    },
    {
        value: '6',
    },
    {
        value: '7',
    },
    {
        value: '8',
    },
    {
        value: '9',
    },
    {
        value: '0',
    },
    {
        value: '.',
    },
]

const left_arr_2 = [
    {
        value: '1',
    },
    {
        value: '2',
    },
    {
        value: '3',
    },
    {
        value: '4',
    },
    {
        value: '5',
    },
    {
        value: '6',
    },
    {
        value: '7',
    },
    {
        value: '8',
    },
    {
        value: '9',
    },
    {
        value: '0',
    },
]

const right_arr_1 = [
    {
        value: '分数'
    },
    {
        value: '.'
    },
]


const right_arr_2 = [
    {
        value: '删除',
        img: require('./del_icon.png')
    },
    {
        value: '%'
    }
]
const top_arr_1 = [
    {
        value: '+',
    },
    {
        value: '-',
    },
    {
        value: '×',
    },
    {
        value: '÷',
    },
]
const top_arr_2 = [
    {
        value: '(',
    },
    {
        value: ')',
    },
    {
        value: '[',
    },
    {
        value: ']',
    },
    {
        value: '{',
    },
    {
        value: '}',
    },
]

class Keyboard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex_left: -1,
            page_data: {},
            language_data: {}
        };
    }
    static getDerivedStateFromProps(props, state) {
        let tempState = { ...state };
        let language_data = props.language_data.toJS()
        const { main_language_map, other_language_map, type } = language_data
        if (type !== tempState.language_data.type) {
            console.log('切换语言', language_data)
            let page_base_data = {
                submit_z: main_language_map.submit,
                submit_c: other_language_map.submit,
            }
            tempState.page_data = { ...page_base_data }
            tempState.language_data = JSON.parse(JSON.stringify(language_data))
            return tempState
        }
        return null
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    clickItem = (item, index, type) => {
        const { currentTopic } = this.props
        // if (type === 'left') {
        //     this.setState({
        //         currentIndex_left: index
        //     })
        // }
        // this.props.changeValues(item.value)
        if(currentTopic.exercise_type_name === topaicTypes.Text_Much_Operation_Symbol){
            // 巧算-巧填运算符 禁用其他按钮
            if(type === 'top_left' || item.value === '删除') this.props.changeValues(item.value)
        }else{
            this.props.changeValues(item.value)
        }
    }
    render() {
        const { currentIndex_left, page_data, language_data } = this.state
        const { currentTopic, show_submit_btn } = this.props
        const { exercise_data_type, _is_translate,showKeyBoardSymbol } = currentTopic
        let left_arr = left_arr_1
        if (exercise_data_type === 'FS') {
            left_arr = left_arr_2
        }
        const { submit_z, submit_c } = page_data
        const { show_main, show_translate } = language_data
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
                <View style={[styles.container]}>

                    {showKeyBoardSymbol ? <View style={[appStyle.flexTopLine]}>
                        <View style={[appStyle.flexLine, { marginRight: pxToDp(18) }]}>
                            {top_arr_1.map((item, index) => {
                                return <TouchableOpacity style={[styles.item_top_1, appStyle.flexCenter, index === left_arr.length - 1 ? { marginRight: 0 } : null]} key={index} onPressIn={() => { this.clickItem(item, index, 'top_left') }} onPressOut={() => { this.setState({ currentIndex_left: -1 }) }}>
                                    <View style={[{ width: '100%', height: '100%', backgroundColor: '#FFDC61', borderRadius: pxToDp(40) }, appStyle.flexCenter]}>
                                        <Text style={[{ fontSize: pxToDp(44), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}>{item.value}</Text>
                                    </View>
                                </TouchableOpacity>
                            })}
                        </View>
                        <View style={[appStyle.flexLine, { marginRight: pxToDp(18) }]}>
                            {top_arr_2.map((item, index) => {
                                return <TouchableOpacity style={[styles.item_top_2, appStyle.flexCenter, index === left_arr.length - 1 ? { marginRight: 0 } : null]} key={index} onPressIn={() => { this.clickItem(item, index, 'top_right') }} onPressOut={() => { this.setState({ currentIndex_left: -1 }) }}>
                                    <View style={[{ width: '100%', height: '100%', backgroundColor: '#F5F5FA', borderRadius: pxToDp(40) }, appStyle.flexCenter]}>
                                        <Text style={[{ fontSize: pxToDp(44), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}>{item.value}</Text>
                                    </View>
                                </TouchableOpacity>
                            })}
                        </View>
                    </View> : null
                    }
                    <View style={[appStyle.flexLine]}>

                        <View style={[appStyle.flexLine, { flex: 1, marginRight: pxToDp(18) }]}>
                            {left_arr.map((item, index) => {
                                return <TouchableOpacity style={[styles.item, appStyle.flexCenter, index === left_arr.length - 1 ? { marginRight: 0 } : null]} key={index} onPressIn={() => { this.clickItem(item, index, 'left') }} onPressOut={() => { this.setState({ currentIndex_left: -1 }) }}>
                                    <ImageBackground style={[{ width: '100%', height: '100%' }, appStyle.flexCenter]} resizeMode='stretch' source={currentIndex_left === index ? require('../../../images/keyboard/item_bg_active_1.png') : require('../../../images/keyboard/item_bg_1.png')}>
                                        <Text style={[{ fontSize: pxToDp(44), color: '#fff' }, appFont.fontFamily_jcyt_700]}>{item.value}</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            })}
                        </View>
                        {exercise_data_type === 'FS' ? <View style={{ marginRight: pxToDp(18) }}>
                            {right_arr_1.map((item, index) => {
                                return <TouchableOpacity style={[styles.item_right, index === right_arr_2.length - 1 ? { marginBottom: 0 } : null]} key={index} onPress={() => { this.clickItem(item, index, 'right2') }}>
                                    <View style={[styles.item_right_inner]}>
                                        <Text style={[{ fontSize: pxToDp(40), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}>{item.value === '分数' ? 'A/B' : item.value}</Text>
                                    </View>
                                </TouchableOpacity>
                            })}
                        </View> : null}
                        <View>
                            {right_arr_2.map((item, index) => {
                                return <TouchableOpacity style={[styles.item_right, index === right_arr_2.length - 1 ? { marginBottom: 0 } : null]} key={index} onPress={() => { this.clickItem(item, index, 'right2') }}>
                                    <View style={[styles.item_right_inner]}>
                                        {item.img ? <Image style={{ width: pxToDp(48), height: pxToDp(48) }} resizeMode='stretch' source={item.img}></Image> : <Text style={[{ fontSize: pxToDp(40), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}>{item.value}</Text>}
                                    </View>
                                </TouchableOpacity>
                            })}
                        </View>
                        {show_submit_btn || true ? <TouchableOpacity style={[styles.submit_btn]} onPress={this.props.submit}>
                            <View style={[styles.submit_btn_inner]}>
                                {_is_translate ? <>
                                    {show_main ? <Text style={[mathFont.txt_36_700, mathFont.txt_fff, { marginBottom: Platform.OS === 'android' ? pxToDp(-15) : pxToDp(10) }]}>{submit_z}</Text> : null}
                                    {show_translate ? <Text style={[mathFont.txt_24_500, mathFont.txt_fff]}>{submit_c}</Text> : null}
                                </> : <Text style={[mathFont.txt_36_700, mathFont.txt_fff]}>提交</Text>}
                            </View>
                        </TouchableOpacity> : null}
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
        flex: 1,
        height: pxToDp(180),
        marginRight: pxToDp(16),
        fontSize: pxToDp(36),
        borderRadius: pxToDp(40),
        paddingBottom: pxToDp(6)
    },
    item_right: {
        width: pxToDp(125),
        height: pxToDp(80),
        borderRadius: pxToDp(40),
        backgroundColor: "#E7E7F2",
        marginBottom: pxToDp(20),
        paddingBottom: pxToDp(6)
    },
    item_right_inner: {
        width: '100%',
        height: '100%',
        borderRadius: pxToDp(40),
        backgroundColor: '#F5F5FA',
        ...appStyle.flexCenter,
    },
    submit_btn: {
        width: pxToDp(200),
        height: pxToDp(200),
        backgroundColor: '#00836D',
        borderRadius: pxToDp(100),
        marginLeft: pxToDp(20),
        paddingBottom: pxToDp(6)
    },
    submit_btn_inner: {
        width: '100%',
        height: '100%',
        backgroundColor: "#00B295",
        borderRadius: pxToDp(100),
        ...appStyle.flexCenter
    },
    item_top_1: {
        width: pxToDp(180),
        height: pxToDp(120),
        backgroundColor: '#FFCA42',
        paddingBottom: pxToDp(8),
        borderRadius: pxToDp(40),
        marginRight: pxToDp(20)
    },
    item_top_2: {
        width: pxToDp(138),
        height: pxToDp(120),
        backgroundColor: '#E7E7F2',
        paddingBottom: pxToDp(8),
        borderRadius: pxToDp(40),
        marginRight: pxToDp(20)

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
