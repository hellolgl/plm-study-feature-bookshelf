import React, { Component } from 'react';
import {
    Image,
    Modal,
    Text,
    TouchableHighlight,
    View,
    StyleSheet,
    BackAndroid, Dimensions, DeviceEventEmitter,
    TouchableOpacity
} from 'react-native';

import _ from 'lodash'
import { pxToDp } from '../../util/tools'
import KeyButton from './BaseButton'

let SCREEN_WIDTH = Dimensions.get('window').width;//宽
let SCREEN_HEIGHT = Dimensions.get('window').height;//高


export default class MathKeyboard extends Component {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            visible: props._dialogVisible,
            text:''
        }

    }



    componentDidMount() {
        //console.log('CanvasDialog Didmount')
        //原生发来蓝牙数据
    }

    componentDidUpdate() {
        //console.log('CanvasDialog componentDidUpdate')
    }

    componentWillUnmount() {
        //console.log('CanvasDialog WillUnmount')
    }


    onShow = () => {

    }


    _onRequestClose = () => {

    }

    buttonOnpress = (value) =>{
        console.log('buttonOnpress',value)
        this.setState( (preState)=>({
            text:preState.text += value
        }))
    }

    /**
     * 确定键盘输入
     */
    sure = () =>{
        if(typeof this.props.sure ==='function'){
            this.props.sure()
        }
    }


    render() {
        // onPress事件直接与父组件传递进来的属性挂接
        return (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                animationType="none"
                visible={this.props._dialogVisible}
                transparent={true}
                onRequestClose={this._onRequestClose}
                onShow={this.onShow} //如果是Android设备 必须有此方法
            >
                <View style={styles.bg}>
                    <View style={styles.dialog}>
                        <View>
                            <Text style={[{fontSize:pxToDp(36)}]}>{this.state.text||'待输入'}</Text>
                        </View>
                        <View style={[styles.firstLine]}>
                            <TouchableOpacity style={[styles.buttonStyle]} onPress={()=>this.buttonOnpress('1')}>
                                    <Text style={[styles.buttonText]}>
                                        1
                                    </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buttonStyle]} onPress={()=>this.buttonOnpress('2')}>
                                    <Text style={[styles.buttonText]}>
                                        2
                                    </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buttonStyle]} onPress={()=>this.buttonOnpress('3')}>
                                    <Text style={[styles.buttonText]}>
                                        3
                                    </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.firstLine]}>
                            <TouchableOpacity style={[styles.buttonStyle]} onPress={()=>this.buttonOnpress('4')}>
                                    <Text style={[styles.buttonText]}>
                                        4
                                    </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buttonStyle]} onPress={()=>this.buttonOnpress('5')}>
                                    <Text style={[styles.buttonText]}>
                                        5
                                    </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buttonStyle]} onPress={()=>this.buttonOnpress('6')}>
                                    <Text style={[styles.buttonText]}>
                                        6
                                    </Text>
                            </TouchableOpacity>

                        </View>
                        <View>
                         <KeyButton style={{height:40,borderRadius: 80,}} onPress={this.sure}></KeyButton>

                        </View>

                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    bg: {  //全屏显示 半透明 可以看到之前的控件但是不能操作了
        width: SCREEN_WIDTH,
        height: pxToDp(400),
        // backgroundColor: 'rgba(255,255,255,0)',  //rgba  a0-1  其余都是16进制数
        position:'absolute',
        flex: 1,
        // top:35
        // justifyContent: 'center',
        // alignItems: 'center',
         backgroundColor: 'blue',
        //  left: pxToDp(450),
         bottom:1
    },
    dialog: {
        width: SCREEN_WIDTH,
        // height: SCREEN_HEIGHT*0.1,
        backgroundColor: 'rgba(255,255,255,0)',
        borderRadius: 8,
        // backgroundColor:'red'
    },
    buttonStyle:{
        width:pxToDp(100),
        height:pxToDp(100),
        borderRadius:pxToDp(120),
        backgroundColor:'#33A1FDFF',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize:10,
        textAlign: 'center',
        color: '#000',
    },
    firstLine:{
        flexDirection:'row'
    },
    sureBtnView: {
        // marginLeft: 20,
        // width: SCREEN_WIDTH * 0.5,
        // height: SCREEN_HEIGHT * 0.1,
        // flexDirection: 'row',
        // justifyContent: 'flex-end',
        zIndex:999
    },





});
