import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle, } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Animated,
    PanResponder,
    TouchableOpacity,
    Platform,
    UIManager,
    Image,
    DeviceEventEmitter,
    Pressable,
    TouchableHighlight
} from 'react-native';
import { pxToDp } from '../../../../util/tools';
import { get } from 'lodash';
import { appFont, appStyle } from '../../../../theme';
import CircleStatistcs from "../../../../component/circleStatistcs";
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 1️⃣ 背景图
const bg = Platform.OS === 'ios' ? require("../../../../images/MathUnitDiagnosis/content_list_item_ios.png") : require("../../../../images/MathUnitDiagnosis/content_list_item.png")

// 2️⃣ 题目数量
// const questions = Array.from({ length: 3 }, (_, i) => ({ id: i }));

export default function App({ questions, onRef, index, setIndex, onClickItem }) {
    // const [index, setIndex] = useState(0);
    const [bgSize, setBgSize] = useState({ width: 0, height: 0 });

    const translateX = useRef(new Animated.Value(0)).current;

    /* 3️⃣ 读取背景图原始宽高 */
    useEffect(() => {
        const eventListenerChangeUnit = DeviceEventEmitter.addListener(
            "changeUnit",
            (event) => {
                setIndex(0);
                translateX.setValue(0);
            }
        );
        const { width, height } = Image.resolveAssetSource(bg);
        setBgSize({ width, height });
        return () => {
            translateX.setValue(0);
            eventListenerChangeUnit && eventListenerChangeUnit.remove()
        };
    }, []);




    useImperativeHandle(onRef, () => {
        return {
            goTo
        }
    })

    const cardWidth = Platform.OS === 'ios' ? bgSize.width / 1.7 : bgSize.width / 1.5;
    const cardHeight = Platform.OS === 'ios' ? bgSize.height / 1.7 : bgSize.height / 1.5;
    const trackWidth = cardWidth * questions.length;

    /* 4️⃣ PanResponder */
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderMove: (_, { dx }) => {
                const base = -index * cardWidth;
                const min = -(questions.length - 1) * cardWidth;
                const max = 0;
                const next = base + dx;
                const clamped = Math.max(min, Math.min(next, max));
                translateX.setValue(clamped);
            },

            onPanResponderRelease: (_, { dx }) => {
                const threshold = cardWidth * 0.25;
                let next = index;
                if (dx > threshold) next = Math.max(index - 1, 0);
                else if (dx < -threshold) next = Math.min(index + 1, questions.length - 1);
                goTo(next);
            },
        })
    ).current;

    const goTo = (nextIdx) => {
        // setIndex(nextIdx);
        Animated.spring(translateX, {
            toValue: -nextIdx * cardWidth,
            useNativeDriver: true,
            // bounciness: 8,
        }).start();
    };



    return (
        <View style={styles.screen}>
            {/* 5️⃣ 父容器宽高 = 背景图宽高，不拉伸 */}
            {bgSize.width ? (
                <View style={[styles.parent, { width: cardWidth, height: cardHeight }]}>

                    {/* 1️⃣ 背景图轨道：只负责手势滑动 */}
                    <Animated.View
                        style={[
                            styles.track,
                            { width: trackWidth, height: cardHeight },
                            { transform: [{ translateX }] },
                        ]}
                        {...panResponder.panHandlers}
                    >
                        {questions.map((item) => (
                            <ImageBackground
                                key={item.id}
                                source={bg}
                                resizeMode="contain"
                                style={[styles.bg, { width: cardWidth, height: cardHeight }]}
                            />
                        ))}
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.track,
                            { width: trackWidth, height: cardHeight },
                            { transform: [{ translateX }] },
                        ]}
                        pointerEvents="box-none"
                    >
                        {questions.map((item) => (
                            <View
                                key={item.id}
                                source={bg}
                                resizeMode="contain"
                                style={[styles.card, { width: cardWidth, height: cardHeight }]}
                            >
                                <Text style={styles.unitTitle}>{item.name}</Text>
                                <View style={[styles.statistic_wrap]}>
                                    <View style={[appStyle.flexAliCenter]}>
                                        <Text
                                            style={[
                                                { color: "#fff", fontSize: pxToDp(44) },
                                                appFont.fontFamily_jcyt_700,
                                            ]}
                                        >
                                            {item.answer_count ? Math.round((item.right_count / item.answer_count) * 100) : 0}%
                                        </Text>
                                        <Text
                                            style={[
                                                { color: "#fff", fontSize: pxToDp(22) },
                                                appFont.fontFamily_jcyt_500,
                                                Platform.OS === "ios" ? { marginTop: pxToDp(36) } : null,
                                            ]}
                                        >
                                            {(item.answer_count ? Math.round((item.right_count / item.answer_count) * 100) : 0) > 0 ? '正确率' : '未开始'}

                                        </Text>
                                    </View>
                                    <View style={[styles.bar, { height: `${item.answer_count ? Math.round((item.right_count / item.answer_count) * 100) : 0}%` }]}></View>
                                </View>
                                <View style={styles.rate_con}>
                                    <View style={styles.score_flex}>
                                        <Text style={styles.score}>{item.count}</Text>
                                        <Text style={styles.score_name}>已做次数</Text>
                                    </View>
                                    <View style={styles.score_flex}>
                                        <Text style={styles.score}>{item.answer_count}</Text>
                                        <Text style={styles.score_name}>已做题目</Text>
                                    </View>
                                    <View style={styles.score_flex}>
                                        <Text style={styles.score}>{item.answer_count ? Math.round(item.max_acc * 100) : 0}%</Text>
                                        <Text style={styles.score_name}>最高准确率</Text>
                                    </View>
                                </View>
                                <TouchableOpacity pointerEvents="auto" onPress={() => { onClickItem(0, item) }}>
                                    <ImageBackground resizeMode="contain" style={styles.content_start} source={require('../../../../images/MathUnitDiagnosis/content_start.png')}>
                                        <Text style={[{ fontSize: pxToDp(32), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}>开始答题</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                                <TouchableOpacity pointerEvents="auto" onPress={() => { onClickItem(2, item) }} style={{
                                    position: 'absolute',
                                    bottom: Platform.OS === 'ios' ? pxToDp(112) : pxToDp(56),
                                    right: Platform.OS === 'ios' ? pxToDp(122) : pxToDp(80)
                                }}>
                                    <ImageBackground resizeMode="contain" style={styles.content_record} source={require('../../../../images/MathUnitDiagnosis/content_record.png')}>
                                        <Text style={[{ fontSize: pxToDp(32), color: 'white' }, appFont.fontFamily_jcyt_700]}>记录</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </Animated.View>

                    {/* 6️⃣ 按钮 */}

                </View>
            ) : null}

        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: pxToDp(24)
    },
    parent: {
        // 宽高由 bgSize 动态设定
        overflow: 'hidden',
        // borderRadius: 12,
    },
    track: {
        position: 'absolute',
        top: 0,
        left: 0,
        flexDirection: 'row',

        // flexDirection: 'row',

    },
    card: {
        alignItems: 'center',
        // justifyContent: 'space-between',
        // padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
    headerRight: { fontSize: 14, color: '#fff' },
    middle: { marginVertical: 20 },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: { fontSize: 16, color: '#fff' },
    number: { fontSize: 16, fontWeight: '600', color: '#fff' },
    startBtn: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    startTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
    nav: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
    },
    btn: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    btnTxt: { color: '#fff', fontWeight: '600' },
    unitTitle: {
        color: 'white',
        fontSize: pxToDp(32),
        ...appFont.fontFamily_jcyt_500,
        // textAlign: 'center',
        marginTop: Platform.OS === 'ios' ? pxToDp(70) : pxToDp(32)
    },
    cicleConPare: {
        width: pxToDp(158 * 2),
        height: pxToDp(158 * 2),
        borderRadius: pxToDp(158 * 2),
        backgroundColor: '#4C4C59',
        borderWidth: pxToDp(8),
        borderColor: '#8B8BA2',
        marginTop: pxToDp(24),
    },
    cicleCon: {
        width: '100%',
        height: '100%',

        ...appStyle.flexCenter,
    },
    rate_con: {
        flexDirection: 'row'
    },
    score_flex: {
        ...appStyle.flexCenter,
        marginRight: pxToDp(34)
        // marginLeft: pxToDp(34)
    },
    score: {
        fontWeight: 'bold',
        // ...appFont.fontFamily_jcyt_700,
        color: 'white',
        fontSize: pxToDp(48),
    },
    score_name: {
        ...appFont.fontFamily_jcyt_500,
        color: 'white',
        fontSize: pxToDp(24),
    },
    content_start: {
        ...appStyle.flexCenter,
        width: pxToDp(146 * 2),
        height: pxToDp(56 * 2),
        marginTop: Platform.OS === 'ios' ? pxToDp(114) : pxToDp(24)
    },
    content_record: {
        ...appStyle.flexCenter,
        width: pxToDp(72 * 2),
        height: pxToDp(80),
        marginTop: pxToDp(20),

    },
    circleWrap: {
        width: pxToDp(240),
        height: pxToDp(240),
        marginTop: pxToDp(20),
        marginBottom: pxToDp(60),
    },
    statistic_wrap: {
        width: pxToDp(158 * 2),
        height: pxToDp(158 * 2),
        backgroundColor: "#4C4C59",
        borderRadius: pxToDp(158 * 2),
        marginTop: Platform.OS === 'ios' ? pxToDp(66) : pxToDp(20),
        marginBottom: Platform.OS === 'ios' ? pxToDp(54) : pxToDp(24),
        ...appStyle.flexCenter,
        position: "relative",
        overflow: "hidden",
        borderWidth: pxToDp(10),
        borderColor: "#8B8BA2",
    },
    bar: {
        width: "100%",
        backgroundColor: "#FFAE64",
        position: "absolute",
        bottom: 0,
        zIndex: -1,
    },

});