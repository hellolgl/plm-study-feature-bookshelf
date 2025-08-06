import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity, Image, Platform, Alert} from 'react-native'
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication'
import {Toast, Modal} from "antd-mobile-rn"
import {pxToDp} from "../tools"
import { WebView } from "react-native-webview"
import NavifationUtil from "../../navigator/NavigationUtil"
import axios from "../http/axios"
import api from "../http/api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import bg from "../../images/IOSLogin/apple.png";


const log = console.log.bind(console)

export default class IosLogin extends React.Component {
    constructor() {
        super();
        this.authCredentialListener = null;
        this.user = null;
        this.state = {
            credentialStateForUser: -1,
            modalShow: false,
            loginModal: false,
        }
    }
    componentDidMount() {
        this.authCredentialListener = appleAuth.onCredentialRevoked(async () => {
            console.warn('Credential Revoked');
            this.fetchAndUpdateCredentialState().catch(error =>
                this.setState({ credentialStateForUser: `Error: ${error.code}` }),
            );
        });

        this.fetchAndUpdateCredentialState()
            .then(res => this.setState({ credentialStateForUser: res }))
            .catch(error => this.setState({ credentialStateForUser: `Error: ${error.code}` }))
    }

    componentWillUnmount() {
        this.authCredentialListener();
    }

    getAllStudents = async (token) => {
        axios.defaults.headers.common['token'] = token
        axios.defaults.headers.common['platform'] = Platform.OS
        const res = await axios.get(`http://www.pailaimi.com/api${api.createStudent}`)
        return res.data["err_code"]
    }

    signIn = async () => {
        const iosToken = await AsyncStorage.getItem('ios-token')
        log("iosToken: ", iosToken)
        if (iosToken !== null) {
            await this.setState({
                modalShow: false,
            })
            const errCode = await this.getAllStudents(iosToken)
            log("errCode: ", errCode)
            if (errCode === 200) {
                NavifationUtil.toStudentManagePage({...this.props, data: iosToken})
            } else if (errCode === 3) {
                try {
                    const appleAuthRequestResponse = await appleAuth.performRequest({
                        requestedOperation: appleAuth.Operation.LOGIN,
                        requestedScopes: [
                            appleAuth.Scope.EMAIL,
                            appleAuth.Scope.FULL_NAME,
                        ],
                    });

                    console.log('appleAuthRequestResponse', appleAuthRequestResponse);

                    const {
                        user: newUser,
                        email,
                        nonce,
                        identityToken,
                        realUserStatus /* etc */,
                        authorizationCode,
                    } = appleAuthRequestResponse;

                    this.user = newUser;

                    this.fetchAndUpdateCredentialState()
                        .then(res => this.setState({ credentialStateForUser: res }))
                        .catch(error =>
                            this.setState({ credentialStateForUser: `Error: ${error.code}` }),
                        );

                    if (identityToken) {
                        // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
                        console.log(nonce, identityToken);
                    } else {
                        // no token - failed sign-in?
                    }

                    if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
                        console.log("I'm a real person!");
                    }

                    console.warn(`Apple Authentication Completed, ${this.user}, ${email}`);
                    axios.post(`${api.getParentToken}`, { code: authorizationCode}).then(
                        res => {
                            const {token} = res.data.data
                            log("receive response token: ", token)
                            AsyncStorage.setItem('ios-token', token)
                            NavifationUtil.toStudentManagePage({...this.props, data: token})
                            this.setState({
                                modalShow: false,
                            })
                        }
                    )
                } catch (error) {
                    if (error.code === appleAuth.Error.CANCELED) {
                        console.warn('User canceled Apple Sign in.');
                    } else {
                        console.error(error);
                    }
                }
            } else {
                Alert.alert("登录失败，请联系客服。")
            }
        } else {
            try {
                const appleAuthRequestResponse = await appleAuth.performRequest({
                    requestedOperation: appleAuth.Operation.LOGIN,
                    requestedScopes: [
                        appleAuth.Scope.EMAIL,
                        appleAuth.Scope.FULL_NAME,
                    ],
                });

                console.log('appleAuthRequestResponse', appleAuthRequestResponse);

                const {
                    user: newUser,
                    email,
                    nonce,
                    identityToken,
                    realUserStatus /* etc */,
                    authorizationCode,
                } = appleAuthRequestResponse;

                this.user = newUser;

                this.fetchAndUpdateCredentialState()
                    .then(res => this.setState({ credentialStateForUser: res }))
                    .catch(error =>
                        this.setState({ credentialStateForUser: `Error: ${error.code}` }),
                    );

                if (identityToken) {
                    // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
                    console.log(nonce, identityToken);
                } else {
                    // no token - failed sign-in?
                }

                if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
                    console.log("I'm a real person!");
                }

                console.warn(`Apple Authentication Completed, ${this.user}, ${email}`);
                axios.post(`${api.getParentToken}`, { code: authorizationCode}).then(
                    res => {
                        const {token} = res.data.data
                        log("receive response token: ", token)
                        AsyncStorage.setItem('ios-token', token)
                        NavifationUtil.toStudentManagePage({...this.props, data: token})
                        this.setState({
                            modalShow: false,
                        })
                    }
                )
            } catch (error) {
                if (error.code === appleAuth.Error.CANCELED) {
                    console.warn('User canceled Apple Sign in.');
                } else {
                    console.error(error);
                }
            }
        }
    };

    fetchAndUpdateCredentialState = async () => {
        if (this.user === null) {
            this.setState({ credentialStateForUser: 'N/A' });
        } else {
            const credentialState = await appleAuth.getCredentialStateForUser(this.user);
            if (credentialState === appleAuth.State.AUTHORIZED) {
                this.setState({ credentialStateForUser: 'AUTHORIZED' });
            } else {
                this.setState({ credentialStateForUser: credentialState });
            }
        }
    }

    toggleModal = (t) => {
        this.setState({
            modalShow: t
        })
    }

    toggleProtocolModal = async (t) => {
        const {isSelected} = this.props
        // if (isSelected) {
        //     const iosToken = await AsyncStorage.getItem('ios-token')
        //     if (iosToken === null) {
        //         this.setState({
        //             modalShow: t
        //         })
        //     } else {
        //         this.signIn()
        //     }
        // }
        const iosToken = await AsyncStorage.getItem('ios-token')
        if (iosToken === null) {
            this.setState({
                modalShow: t
            })
        } else {
            this.signIn()
        }
    }

    gotoProtocol = async (type) => {
        const m = {
            'ruanjian': require("../../images/IOSLogin/ruanjian.png"),
            'ertong': require("../../images/IOSLogin/ertong.png"),
            'yinsi': require("../../images/IOSLogin/yinsi.png"),
        }
        await this.toggleModal(false)
        NavifationUtil.toProtocolPage({...this.props, data: { img: m[type] }})
    }

    render() {
        const {modalShow, loginModal} = this.state
        const {isSelected} = this.props

        let bc = "#e5e5e5"
        let textBc = "#aaa"
        let bg = require('../../images/IOSLogin/apple.png')

        if (isSelected) {
            bg = require('../../images/IOSLogin/black_apple.png')
            bc = "#FFAB32"
            textBc = "#fff"
        }

        return (
            <View>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={loginModal}
                    style={{
                        width: pxToDp(400),
                        borderRadius: pxToDp(40),
                        alignItems: "center",
                        height: pxToDp(100),
                    }}
                >
                    <Text>Apple授权成功，登录中...</Text>
                </Modal>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={modalShow}
                    style={{
                        width: pxToDp(800),
                        borderRadius: pxToDp(40),
                        alignItems: "center",
                        height: pxToDp(300),
                    }}
                >

                    <View
                        style={{
                            height: "100%",
                            justifyContent: "space-around"
                        }}
                    >
                        <View
                            style={{
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: pxToDp(30),
                                    fontWeight: "bold",
                                }}
                            >服务条款与隐私协议</Text>
                        </View>
                        <View
                            style={{
                                margin: pxToDp(30),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: pxToDp(24),
                                }}
                            >获取苹果ID,阅读相关
                                <TouchableOpacity
                                    onPress={() => this.gotoProtocol("ruanjian")}
                                >
                                    <Text style={{color: "#3896ab", fontSize: pxToDp(24), top: pxToDp(6)}}>《软件许可协议》</Text>
                                </TouchableOpacity>
                                <Text style={{color: "#3896ab"}}
                                      onPress={() => this.gotoProtocol("yinsi")}
                                >《隐私政策》</Text>
                                <Text style={{color: "#3896ab"}}
                                      onPress={() => this.gotoProtocol("ertong")}
                                >《儿童隐私政策》</Text>
                                同意后，可以完成登录注册。</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => this.toggleModal(false)}
                            >
                                <View
                                    style={{
                                        width: pxToDp(180),
                                        height: pxToDp(60),
                                        backgroundColor: "#D3D5D9",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: pxToDp(30),
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#fff",
                                            fontSize: pxToDp(28),
                                            fontWeight: "bold",
                                        }}
                                    >取 消</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.signIn()
                                }}
                            >
                                <View
                                    style={{
                                        width: pxToDp(180),
                                        height: pxToDp(60),
                                        backgroundColor: "#FFAB32",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: pxToDp(30),
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#fff",
                                            fontSize: pxToDp(28),
                                            fontWeight: "bold",
                                        }}
                                    >同 意</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <TouchableOpacity
                    onPress={() => this.toggleProtocolModal(true)}
                >
                    <View
                        style={{
                            width: pxToDp(460),
                            height: pxToDp(90),
                            borderRadius: pxToDp(60),
                            backgroundColor: bc,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",

                        }}
                    >
                        <View
                            style={{
                                marginTop: pxToDp(-4)
                            }}
                        >
                            <Image style={[{ width:pxToDp(44),height:pxToDp(44)}]} source={bg} resizeMode="contain"></Image>
                        </View>
                        <Text style={{color: textBc, fontSize: pxToDp(30), fontWeight: "bold", marginLeft: pxToDp(16)}}>通过Apple登录</Text>
                    </View>
                </TouchableOpacity>
                {/*<AppleButton*/}
                {/*    buttonStyle={AppleButton.Style.WHITE}*/}
                {/*    buttonType={AppleButton.Type.SIGN_IN}*/}
                {/*    style={{*/}
                {/*        // width: 160, // You must specify a width*/}
                {/*        // height: 45, // You must specify a height*/}
                {/*        width: pxToDp(460),*/}
                {/*        height: pxToDp(90),*/}
                {/*        borderRadius: pxToDp(60),*/}
                {/*    }}*/}
                {/*    onPress={() => this.toggleProtocolModal(true)}*/}
                {/*/>*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    appleButton: {
        width: 200,
        height: 60,
        margin: 10,
    },
    header: {
        margin: 10,
        marginTop: 30,
        fontSize: 18,
        fontWeight: '600',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        // backgroundColor: 'pink',
    },
    horizontal: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
});