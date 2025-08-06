import React, { Component } from 'react';
import { StyleSheet, Image, PanResponder, Animated, Text } from 'react-native';
class WordCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pan: new Animated.ValueXY(),
        };
    }
    componentWillMount() {
        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            // 设置初始位置
            onPanResponderGrant: (e, gestureState) => {
                // console.log('拖拽开始', e.nativeEvent.target, gestureState);
                this.state.pan.setOffset({
                    x: this.state.pan.x._value,
                    y: this.state.pan.y._value,
                });
                this.state.pan.setValue({ x: 0, y: 0 });
            },
            // 使用拖拽的偏移量来定位
            onPanResponderMove: Animated.event([null, { dx: this.state.pan.x, dy: this.state.pan.y }]),
            onPanResponderRelease: (e, gestureState) => {
                // console.log('拖拽结束','拖拽结束X：',gestureState.moveX,'拖拽结束y：', gestureState.moveY );
                // console.log('拖拽结束','拖拽结束X：',e.nativeEvent );
                this.props._onPanResponderRelease({ moveX: gestureState.moveX, moveY: gestureState.moveY, indexImg: this.props.indexImg });
                Animated.timing(this.state.pan, { toValue: { x: 0, y: 0 }, duration: 0 }).start();
                this.state.pan.flattenOffset();
            },
        });
    }
    render() {
        // 从state中取出pan
        const { pan, scale } = this.state;
        // 从pan里计算出偏移量]
        const [translateX, translateY] = [pan.x, pan.y];
        // 设置transform为偏移量
        const imageStyle = { transform: [{ translateX }, { translateY }] };
        return (
            <Animated.View style={[styles.container, imageStyle]} {...this._panResponder.panHandlers}>
                <Image style={{ width: 60, height: 60 }} source={{ uri: this.props.imgUrl }} />
                {/* <Image style={{ width: 60, height: 60 }} source={this.props.imgUrl} /> */}
            </Animated.View>
        );
    }
}
export default WordCard;
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        // left: 50,
        // top: 50,
        zIndex: 5,
    },
});
