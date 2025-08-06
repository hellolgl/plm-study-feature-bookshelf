import React, { Component } from 'react';

import { StyleSheet, Platform, Text, View, Alert, TouchableOpacity, Linking, Image, Animated } from 'react-native';
import { Modal } from "antd-mobile-rn"
import {
    isFirstTime,
    isRolledBack,
    packageVersion,
    currentVersion,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
    downloadAndInstallApk,
} from 'react-native-update';
import _updateConfig from '../../../update.json';
import { appStyle } from "../../theme";
import { pxToDp } from "../../util/tools";
const { appKey } = _updateConfig[Platform.OS];

const log = console.log.bind(console)

export default class UpdateApp extends Component {
    state = {
        received: 0,
        total: 0,
        dialogVisible: false
    };
    componentDidMount() {
        if (isFirstTime) {
            // 必须调用此更新成功标记方法
            // 否则默认更新失败，下一次启动会自动回滚
            markSuccess();
        } else if (isRolledBack) {
            console.log('刚刚更新失败了,版本被回滚.');
        }
    }

    doUpdate = async (info) => {
        try {
            const hash = await downloadUpdate(info, {
                onDownloadProgress: ({ received, total }) => {
                    // 下载完成 隐藏下载进度框
                    if (received === total) {
                        this.setState({
                            dialogVisible: false
                        })
                    }
                    this.setState({
                        received,
                        total,
                    });
                },
            });
            if (!hash) {
                return;
            }
            Alert.alert('提示', '下载完毕,是否重启应用?', [
                {
                    text: '下次启动时',
                    onPress: () => {
                        switchVersionLater(hash);
                    },
                },
                {
                    text: '是',
                    onPress: () => {
                        switchVersion(hash);
                    },
                },
            ]);
        } catch (err) {
            Alert.alert('更新失败', err.message);
        }
    };

    checkUpdate = async () => {
        if (__DEV__) {
            // 开发模式不支持热更新，跳过检查
            return;
        }
        let info;
        try {
            info = await checkUpdate(appKey);
        } catch (err) {
            Alert.alert('更新检查失败', err.message);
            return;
        }
        if (info.expired) {
            Alert.alert('提示', '您的应用版本已更新，点击确定下载安装新版本', [
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
                        this.setState({
                            dialogVisible: true
                        })
                        if (info.downloadUrl) {
                            // apk可直接下载安装
                            if (Platform.OS === 'android' && info.downloadUrl.endsWith('.apk')) {
                                downloadAndInstallApk({
                                    url: info.downloadUrl,
                                    onDownloadProgress: ({ received, total }) => {
                                        this.setState({
                                            received,
                                            total,
                                        });
                                    },
                                });
                            } else {
                                Linking.openURL(info.downloadUrl);
                            }
                        }
                    },
                },
            ]);
        } else if (info.upToDate) {
            Alert.alert('提示', '您的应用版本已是最新.');
        } else {
            Alert.alert('提示', '检查到新的版本' + info.name + ',是否下载?\n' + info.description, [
                { text: '否' },
                {
                    text: '是',
                    onPress: () => {
                        this.doUpdate(info);
                    },
                },
            ]);
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
            <View style={[{ alignItems: "center" }]}>
                <View style={styles.progressBar}>
                    <Animated.View style={[fillStyle]} />
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

    render() {
        const { received, total, dialogVisible } = this.state;
        return (
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    visible={dialogVisible}
                    transparent
                    style={[
                        { width: 400, height: 150, },
                    ]}
                >
                    <View style={[{}]}>
                        <Text style={[styles.instructions, styles.normalFont]}>
                            更新中...
                            {'\n'}
                        </Text>
                        {this.renderProgressBar()}
                        <Text style={[styles.instructions, styles.specialFont]}>
                            {`${this.renderPercent()}%`}
                        </Text>
                    </View>
                </Modal>
            </View>
        );
    }
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