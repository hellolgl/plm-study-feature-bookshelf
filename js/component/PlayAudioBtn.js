import React, { useRef, useEffect, useState } from 'react';
import { Text, TouchableOpacity, AppState } from 'react-native';
import Sound from 'react-native-sound';
import EventRegister from '../util/eventListener';
import _ from 'lodash';
import { RecordingStatus } from "../util/storyRecord";
import { useSelector, useDispatch } from "react-redux";

function PlayAudioBtn({
    audioUri,
    onStartEvent,
    onPauseEvent,
    onStopEvent,
    children,
    failed,
    onPress
}) {
    const [eventId, setEventId] = useState('');
    const [paused, setPaused] = useState(true);
    const dispatch = useDispatch();
    const { recordingStatus } = useSelector(
        (state) => state.toJS().audioStatus,
    );
    const [appState, setAppState] = useState(AppState.currentState);
    let sound = useRef(undefined);
    useEffect(() => {
        AppState.addEventListener('change', handleAppStateChange);
        return () => {
            onStopEvent && onStopEvent();
            dispatch({
                type: "audio/setPlayingAudio",
                data: '',
            });
            handleRelease();
            AppState.removeEventListener('change', handleAppStateChange);
        };
    }, []);

    const handleAppStateChange = (nextAppState) => {
        if (appState === 'active' && nextAppState.match(/inactive|background/)) {
            onStopEvent && onStopEvent();
            dispatch({
                type: "audio/setPlayingAudio",
                data: '',
            });
            setPaused(true)
            handleRelease();
        }
    }

    useEffect(() => {
        if (sound.current) {
            if (paused) {
                sound.current.pause();
            }
        }
    }, [sound]);

    useEffect(() => {
        if (paused) {
            try {
                sound.current?.pause();
                onPauseEvent && onPauseEvent();
            } catch (err) {
                console.log('pause audio error: ', err);
            }
        }
    }, [paused]);

    const setPlayingStatus = (pausedValue) => {
        dispatch({
            type: "audio/setPlayingAudio",
            data: pausedValue ? '' : audioUri,
        });
    };

    const pausedEvent = () => {
        setPaused(true);
        setPlayingStatus(true);

        handleRelease()
    };

    const successEvent = () => {
        dispatch({
            type: "audio/setPlayingAudio",
            data: '',
        });
        setPaused(true);
        setPlayingStatus(true);
        handleRelease();
    };

    const handleRelease = () => {
        try {
            sound.current?.release();
            sound.current = undefined;
            setEventId('');
            EventRegister.removeEventListener(eventId);
        } catch (err) {
            console.log('release audio err: ', err);
        }
    };

    const playAudio = (uri) => {
        try {
            handleRelease();
        } catch (err) {
            console.log('!!!!! catch handleRelease err: ', err);
        }
        sound.current = new Sound(`${uri}`, undefined, error => {
            if (error) {
                handleRelease();
                dispatch({
                    type: "audio/setPlayingAudio",
                    data: '',
                });
                setPaused(true);
                // showToast('音频文件出错');
                failed && failed();
            } else {
                try {
                    sound.current?.play((success) => {
                        if (success) {
                            successEvent();
                        } else {
                            console.log('playback failed due to audio decoding errors');
                        }
                    });
                    onStartEvent && onStartEvent();
                } catch (err) {
                    console.log('!!!!! catch play err: ', err);
                }
            }
        });
    };

    const playCurrentAudio = () => {
        onStartEvent && onStartEvent();
        Sound.setCategory('Playback');
        // 创建事件监听
        if (eventId === '') {
            const eventId = EventRegister.addEventListener('pauseAudioEvent', () => {
                pausedEvent();
            });
            setEventId(eventId);
        }
        EventRegister.emitEvent('pauseAudioEvent', eventId, true);
        setPaused(false);
        setPlayingStatus(false);
        if (sound.current && paused) {
            sound.current.play((success) => {
                if (success) {
                    successEvent();
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
            setPaused(false);
            setPlayingStatus(false);
        } else {
            let url = audioUri;
            if (url.endsWith('#')) {
                url = url.slice(0, url.length - 1);
            }
            playAudio(url);
        }
    };

    return (
        <TouchableOpacity
            onPress={() => {
                if (!audioUri || recordingStatus === RecordingStatus.recording) {
                    return;
                }
                if (paused) {
                    playCurrentAudio();
                } else {
                    dispatch({
                        type: "audio/setPlayingAudio",
                        data: '',
                    });
                    pausedEvent();
                }
                onPress && onPress()
            }}>
            {children}
        </TouchableOpacity>
    );
}

export default PlayAudioBtn;
