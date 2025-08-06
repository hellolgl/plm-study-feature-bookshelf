import React, { Component } from 'react';
import {Platform, Alert, Linking, AppState, View, Text, StyleSheet, Animated} from 'react-native';
import { Toast } from "antd-mobile-rn";
import _ from "lodash";

import {
    isFirstTime,
    isRolledBack,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
    downloadAndInstallApk,
} from 'react-native-update';
import {pxToDp} from "../../util/tools";


export default function Update(WrappedComponent, options = {}) {
    state = {
        received: 0,
        total: 0,
        dialogVisible: false
    };
    const { appKey } = options;
    if (!appKey) {
        throw new Error('appKey is required for simpleUpdate()');
    }

    return __DEV__
        ? WrappedComponent
        : class AppUpdate extends Component {
            componentDidMount() {
                if (isRolledBack) {
                    Alert.alert('抱歉', '刚刚更新遭遇错误，已为您恢复到更新前版本');
                } else if (isFirstTime) {
                    markSuccess();
                }
                this.stateListener = AppState.addEventListener(
                    'change',
                    (nextAppState) => {
                        if (nextAppState === 'active') {
                            this.checkUpdate();
                        }
                    },
                );
                this.checkUpdate();
            }
            componentWillUnmount() {
                this.stateListener && this.stateListener.remove();
            }
            doUpdate = async (info, silent) => {
                try {
                    const hash = await downloadUpdate(info, {
                        onDownloadProgress: ({ received, total }) => {
                            // 下载完成 隐藏下载进度框
                            if (received === total) {
                            }
                        },
                    });
                    if (!hash) {
                        return;
                    }
                    this.stateListener && this.stateListener.remove();
                    // Alert.alert('提示', '更新包已为您下载完成。\n建议您立即更新，获得最佳体验！', [
                    //     {
                    //         text: '下次更新',
                    //         style: 'cancel',
                    //         onPress: () => {switchVersionLater(hash);},
                    //     },
                    //     {
                    //         text: '立即更新',
                    //         style: 'default',
                    //         onPress: () => {switchVersion(hash);},
                    //     },
                    // ]);
                    if (silent) {
                        switchVersionLater(hash);
                    } else {
                        Alert.alert('提示', '更新包已为您下载完成。\n建议您立即更新，获得最佳体验！', [
                            {
                                text: '下次更新',
                                style: 'cancel',
                                onPress: () => {switchVersionLater(hash);},
                            },
                            {
                                text: '立即更新',
                                style: 'default',
                                onPress: () => {switchVersion(hash);},
                            },
                        ]);
                    }
                } catch (err) {
                    Alert.alert('更新失败', err.message);
                }
            };

            renderProgressBar = () => {
                const { received, total } = this.state;
                // 进度
                let progress
                if (received === 0 && total === 0) {
                    progress = 0
                } else {
                    progress = Math.floor(received * 100 / total)
                }
                if (progress > 100) {
                    progress = 100
                }
                if (progress < 0) {
                    progress = 0
                }
                let w = `${progress}%`
                // star 位置
                let sw = progress + 5
                const styles = StyleSheet.create({
                    container: {
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                        padding: 8,
                        borderRadius: 5,
                        height: 100,
                        width: 100,
                        borderWidth: 1,
                        borderColor: "red",
                    },
                    progressBar: {
                        height: 30,
                        flexDirection: "row",
                        width: 350,
                        backgroundColor: '#e3e3e3',
                        borderColor: 'white',
                        borderWidth: 2,
                        borderRadius: 10
                    },
                    fillAllProgressBar: {
                        backgroundColor: "#6990cb",
                        width: w,
                        borderRadius: 10,
                    },
                    fillProgressBar: {
                        backgroundColor: "#6990cb",
                        width: w,
                        borderBottomLeftRadius: 10,
                        borderTopLeftRadius: 10,
                    },
                    contentPosition: {
                        // position: "absolute",
                        // left: left,
                        // top: top,
                        borderWidth: 1,
                        borderColor: "red",
                    },
                })
                let fillStyle
                if (w === "100%") {
                    fillStyle = styles.fillAllProgressBar
                } else {
                    fillStyle = styles.fillProgressBar
                }
                return (
                    <View>
                        <View>
                            <Animated.View/>
                        </View>
                    </View>
                )
            }

            renderPercent = () => {
                const { received, total } = this.state;
                let progress
                if (received === 0 && total === 0) {
                    progress = 0
                } else {
                    progress = Math.floor(received * 100 / total)
                }
                return progress
            }

            checkUpdate = async () => {
                let info;
                let metaInfo = {};
                try {
                    info = await checkUpdate(appKey);
                    if (_.has(info, "metaInfo")){
                        try {
                            metaInfo = JSON.parse(info.metaInfo);
                        } catch (err) {
                            console.log(err);
                        }
                    }
                } catch (err) {
                    Alert.alert('更新检查失败', err.message);
                    return;
                }
                if (info.expired) {
                    Alert.alert('提示', Platform.OS==="ios"? '您的应用版本已更新，点击跳转App Store进行更新。': '您的应用版本已更新，点击确定下载安装新版本。', [
                        {
                            text: "残忍拒绝",
                            onPress: () => {
                                this.setState({
                                    dialogVisible: false,
                                })
                            },
                        },
                        {
                            text: '确定',
                            onPress: () => {
                                if (Platform.OS==="ios") {
                                    Linking.openURL(info.downloadUrl);
                                } else {
                                    Toast.loading("下载最新版本中，请稍后...", 99999)
                                    if (info.downloadUrl) {
                                        if (
                                            Platform.OS === 'android' &&
                                            info.downloadUrl.endsWith('.apk')
                                        ) {
                                            downloadAndInstallApk({
                                                url: info.downloadUrl,
                                            });
                                        }
                                    }
                                }
                            },
                        },
                    ]);
                } else if (info.update) {
                    if (metaInfo.silent) {
                        // Alert.alert("静默更新")
                        this.doUpdate(info, true);
                    } else {
                        Alert.alert(
                            '提示',
                            '检查到新的版本' + info.name + ',是否下载?\n' + info.description,
                            [
                                { text: '否', style: 'cancel' },
                                {
                                    text: '是',
                                    style: 'default',
                                    onPress: () => {
                                        Toast.loading("更新中，请稍后...", 99999)
                                        this.doUpdate(info, false);
                                    },
                                },
                            ],
                        );
                    }
                }
            };
            render() {
                return <WrappedComponent {...this.props} />;
            }
        };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    normalFont: {
        fontSize: pxToDp(33),
    },
    specialFont: {
        fontSize: pxToDp(30),
        color: "#5074e7"
    },
});
