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

import Canvas from '../util/canvas/YuwenWebCanvas'
import UsbDataUtil from '../util/canvas/UsbDataUtil'
import BaseButton from './BaseButton'
import _ from 'lodash'
import {appStyle} from '../theme'
let SCREEN_WIDTH = Dimensions.get('window').width;//宽
let SCREEN_HEIGHT = Dimensions.get('window').height;//高


export default class YuwenCanvasDialog extends Component {

    // 构造
    constructor(props) {
        super(props);
        this.usbUtil = new UsbDataUtil();
        this.handleDialogLeftBtnActionThrottled = _.throttle(this._dialogLeftBtnAction, 5 * 1000);
        this.state = {
            visible: props._dialogVisible,
            isUseBle: true
        }
    }

    static defaultProps = {
        _dialogTitle: '温馨提示',
        _dialogContent: '是否退出',
        _dialogLeftBtnTitle: '取消',
        _dialogRightBtnTitle: '确定',
        _dialogVisible: false,
    }


    onRef = (ref) => { this.canvas = ref }

    componentDidMount() {
        //console.log('CanvasDialog Didmount')
        //原生发来蓝牙数据
        DeviceEventEmitter.addListener('usbData', this.eventHandler);
    }

    componentWillUnmount() {
        //console.log('CanvasDialog WillUnmount')
        DeviceEventEmitter.removeListener('usbData', this.eventHandler);
    }

    componentDidUpdate() {
        //console.log('CanvasDialog componentDidUpdate')
        // this.canvas.clear()
        this._useBleData()
    }


    eventHandler = (message) => {
        if (!this.canvas || !this.canvas.webview || !this.props.useUsb) return
        this.usbUtil.initListXY(message);
        this.canvas.sendUsbData(message.usbCanvasDataX, message.usbCanvasDataY, message.usbCanvasDataPressure);
    }

    onBack = () => {
        //console.log('Canvasdialog Onback')

        this.props.destoryDialog();
        this.props.onBack();

    }

    onShow = () => {
        //console.log('CanvasDialog OnShow')
        this.usbUtil.clearListXY();
        if (!this.canvas.clear) return
        this.canvas.clear();
        this._useBleData()
    }

    _onRequestClose = () => {
        //console.log('CanvasDialog onRequestClose')
        // const {isBack} = this.state
        // if(isBack){
        //  this.props.onBack();
        // }
    }

    _dialogRightBtnAction = () => {
        this.props._dialogRightBtnAction();
        if (!this.canvas.clear) return
        this.canvas.clear();
        this.usbUtil.clearListXY();
        this.props.clearListXY()
    }

    _dialogLeftBtnAction = () => {
        //console.log('YuwenCanvasDialog _dialogLeftBtnAction')
        if (this.props.useUsb) {
            //console.log('getDataFromCanvas1',this.usbUtil.toServeXY)

            this.props._dialogLeftBtnAction();
            this.usbUtil.clearListXY();
        } else {
            this.canvas._padCanvasData()
            this.getPadDataFromCanvas()

        }

    }

    _useBleData = () => {
        const { isUseBle } = this.state;
        //console.log('YuwenCanvasDialog _useBleData',this.props.currentData)
        if (!this.props.currentData) return
        //console.log('YuwenCanvasDialog _useBleDataJS',this.props.currentData.toJS())
        if (!this.canvas || !this.props.currentData.toJS()) return
        //console.log('YuwenCanvasDialog _useBleData isUseBle',this.props.useUsb)
        if (!this.props.useUsb) {
            //console.log('YuwenCanvasDialog drawByCanvas')
            this.canvas.drawByCanvas();
        } else {
            //console.log('YuwenCanvasDialog drawByBle')
            DeviceEventEmitter.removeListener('usbData', this.eventHandler);
            DeviceEventEmitter.addListener('usbData', this.eventHandler);
            this.canvas.drawByBle();
        }
    }

    getDataFromCanvas = (canvasData) => {
        if (!canvasData) return
        //console.log(canvasData, 'canvasData')
    }

    getPadDataFromCanvas = (canvasData) => {
        //console.log('YuwenCanvasDialog getPadDataFromCanvas')
        if (!canvasData) return
        //console.log(canvasData, 'YuwenCanvasDialog canvasData')
        this.props.getPadDataFromCanvas(canvasData)
    }


    render() {
        const { isUseBle } = this.state
        // onPress事件直接与父组件传递进来的属性挂接
        return (
            <Modal
                animationType="none"
                visible={this.props._dialogVisible}
                transparent={true}
                onRequestClose={this._onRequestClose}
                onShow={this.onShow} //如果是Android设备 必须有此方法
                supportedOrientations={['portrait', 'landscape']}
            >

                <View style={styles.bg}>
                    <View style={styles.dialog}>
                        <TouchableOpacity onPress={this.onBack}>
                            <View style={styles.dialogTitleView}>
                                <Image source={require('../images/backBtn.png')} style={[appStyle.helpBtn]}></Image>
                            </View>
                        </TouchableOpacity>
                        {this.props.useUsb ?
                            <TouchableOpacity onPress={this.props.closeDialog} >
                                <View style={styles.dialogContentView}>
                                    <Canvas
                                        onRef={this.onRef}
                                        width={SCREEN_WIDTH * 0.8}
                                        height={SCREEN_HEIGHT * 0.8}
                                        getDataFromCanvas={this.getDataFromCanvas}
                                    >
                                    </Canvas>
                                </View>
                            </TouchableOpacity> :
                            <View style={styles.dialogContentView}>
                                <Canvas
                                    onRef={this.onRef}
                                    width={SCREEN_WIDTH * 0.8}
                                    height={SCREEN_HEIGHT * 0.8}
                                    // getDataFromCanvas={this.getDataFromCanvas}
                                    getPadDataFromCanvas={this.getPadDataFromCanvas}
                                >
                                </Canvas>
                            </View>
                        }
                        <View style={styles.dialogBtnView}>
                            <BaseButton style={{height:40,borderRadius: 80,}} onPress={this.handleDialogLeftBtnActionThrottled} text={'下一题'}></BaseButton>
                            <BaseButton style={{height:40,borderRadius: 80,}} onPress={this._dialogRightBtnAction} text={'清空'}></BaseButton>
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
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',  //rgba  a0-1  其余都是16进制数
        // position:'absolute',
        // top:35
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    dialog: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        borderRadius: 8,
    },
    dialogTitleView: {
        // position:'absolute',
        // left:57,
        // top:28,
        marginLeft: 57,
        paddingTop: 40,
        marginBottom: 10,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0)',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    dialogTitle: {
        textAlign: 'center',
        fontSize: 18,
        color: '#000000',
    },
    dialogContentView: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.65,
        backgroundColor: 'rgba(255,255,255,0)',
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    dialogContent: {
        textAlign: 'center',
        fontSize: 16,
        color: '#4A4A4A',
    },
    dialogBtnView: {
        marginLeft: 20,
        width: SCREEN_WIDTH * 0.65,
        height: SCREEN_HEIGHT * 0.08,
        flexDirection: 'row',
        // alignItems: 'flex-end',
        justifyContent:'flex-end'
    },
    dialogBtnViewItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5F2FF',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    leftButton: {
        fontSize: 18,
        color: '#007AFF',
        borderBottomLeftRadius: 8,
    },
    rightButton: {
        fontSize: 18,
        color: '#007AFF',
        borderBottomRightRadius: 8,
    }
});
