import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, AppState, DeviceEventEmitter } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import Tts from 'react-native-tts';
import { setPlayText } from '../action/aiTalk'
import { setShowTips } from '../action/tts'
import EventRegister from '../util/eventListener';

function TtsPlayAudio({ text, disablePlay, children, language, emit }) {
    const dispatch = useDispatch()
    const { statusData } = useSelector(
        (state) => state.toJS().tts
    );
    const { selestModule } = useSelector((state) => state.toJS().userInfo);
    const [playing, setPlaying] = useState(false)
    const [eventId, setEventId] = useState('');
    const [appState, setAppState] = useState(AppState.currentState);
    useEffect(() => {
        if (language) {
            Tts.setDefaultLanguage(language);
        }
        AppState.addEventListener('change', handleAppStateChange);
        return () => {
            pausedEvent()
            if (language) {
                // 恢复默认
                Tts.setDefaultLanguage("zh-CN");
            }
            AppState.removeEventListener('change', handleAppStateChange);
        };
    }, [])
    const handleAppStateChange = (nextAppState) => {
        if (appState === 'active' && nextAppState.match(/inactive|background/)) {
            pausedEvent()
        }
    }

    const play = () => {
        if (disablePlay) {
            return
        }
        if (!statusData.canUse) {
            if (emit) {
                // 对话外层是modal组件的需要触发事件，因为不支持两个modal弹窗
                DeviceEventEmitter.emit("showTtsTips");
            } else {
                dispatch(setShowTips(true))
            }
            return
        }
        if (playing) {
            pausedEvent();
        } else {
            const { alias } = selestModule
            let filterText = text
            if (['math_AIPractice', 'math_knowledgeGraph'].includes(alias)) {
                // 数学模块
                filterText = text.replaceAll('+', '加').replaceAll('-', '减').replaceAll('×', '乘').replaceAll('x', '乘').replaceAll('÷', '除').replaceAll('=', '等于')
            }
            if (eventId === '') {
                const eventId = EventRegister.addEventListener('pauseAudioEvent', () => {
                    pausedEvent();
                });
                setEventId(eventId);
            }
            EventRegister.emitEvent('pauseAudioEvent', eventId, true);
            Tts.speak(filterText)
            dispatch(setPlayText(text));
            setPlaying(true)
            Tts.addEventListener('tts-finish', onFinishListener);
        }

    }
    const pausedEvent = () => {
        Tts.stop()
        setPlaying(false)
        dispatch(setPlayText(''));
        setEventId('');
        Tts.removeAllListeners('tts-finish');
        EventRegister.removeEventListener(eventId);
    };
    const onFinishListener = () => {
        // console.log('播放完毕：：：：：：：',text)
        setPlaying(false);
        Tts.removeAllListeners('tts-finish');
        dispatch(setPlayText(''));
    };
    return (
        <TouchableOpacity onPress={play}>
            {children}
        </TouchableOpacity>
    );
}

export default TtsPlayAudio;
