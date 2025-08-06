import React, { Component } from "react";
import {
    View,
    Text,
    ImageBackground,
    Image,
    TouchableOpacity,
    TextInput,
    Platform,
    KeyboardAvoidingView,
    DeviceEventEmitter,
    StyleSheet,
    BackHandler,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions
} from "react-native";
import { padding_tool, pxToDp, size_tool } from "../../util/tools";
import NavigationUtil from "../../navigator/NavigationUtil";
import _ from "lodash";
import { Toast } from "antd-mobile-rn";
import axios from "../../util/http/axios";
import api from "../../util/http/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as actionCreators from "../../action/userInfo";
import { connect } from "react-redux";
import UpdateApp from "../updateApp";
import { appStyle, appFont } from "../../theme";
import * as actionCreatorsMath from "../../action/math/bag/index";
import IosLogin from "../../util/iosLogin";
import MyToast from "../../component/myToast";

const log = console.log.bind(console);

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


class StudentRoleHomePage extends Component {
    constructor(props) {
        super();
        const userInfo = props.userInfo.toJS();
        console.log("userInfo", userInfo);
        this.state = {
            info: {},
            username: "",
            password: "",
            isStudent: userInfo.isStudent ? userInfo.isStudent : false,
            code: "",
            num: 60,
            timing: false,
            passwordTips: "",
            telTips: "",
            tel: "",
            islook: false,
            isAgree: false,
            isTel: false,
            textbookObj: {},
            showToast: false
        };
        this.updateAppRef = React.createRef();
        this.handleClickThrottled = _.throttle(this.LoginNow, 5 * 1000);
        this.appleLoginRef = React.createRef();
    }

    componentDidMount() {
        this.getTextbook();
        try {
            const propsUserName = this.props.navigation.state.params.data;
            if (propsUserName) {
                this.getUserInfo().then((data) => {
                    if (propsUserName === data.username) {
                        this.setState(() => ({
                            username: data.username,
                            password: data.password,
                            info: data,
                        }));
                    } else {
                        this.setState(() => ({
                            username: propsUserName,
                            password: "",
                            info: {
                                username: propsUserName,
                                password: "",
                            },
                        }));
                    }
                });
            } else {
                this.getUserInfo().then((data) => {
                    this.setState(() => ({
                        username: data.username,
                        password: data.password,
                        info: data,
                    }));
                });
            }
            DeviceEventEmitter.addListener("navigationBarHeight", this.eventHandler);
        } catch (err) {
            this.getUserInfo().then((data) => {
                this.setState(() => ({
                    username: data.username,
                    password: data.password,
                    info: data,
                }));
            });
            DeviceEventEmitter.addListener("navigationBarHeight", this.eventHandler);
        }
    }
    getTextbook = () => {
        axios.get(api.mathGetTextbook).then((res) => {
            if (res.data.err_code === 0) {
                let obj = {};
                res.data.data.forEach((item) => {
                    obj[item.textbook + ""] = item.name;
                });
                this.setState({
                    textbookObj: obj,
                });
            }
        });
    };
    getUserInfo = async (value) => {
        try {
            const username = await AsyncStorage.getItem("username");
            const password = await AsyncStorage.getItem("password");
            return { username, password };
        } catch (e) { }
    };

    check = () => {
        log("check update: ");
        this.updateAppRef.current.checkUpdate();
    };

    setToken = async (value, type) => {
        // console.log("token", value);
        try {
            type === "tel"
                ? await AsyncStorage.setItem("teltoken", value)
                : await AsyncStorage.setItem("token", value);
        } catch (e) { }
    };

    setUserInfo = async (value) => {
        try {
            await AsyncStorage.setItem("username", value.username);
            await AsyncStorage.setItem("password", value.password);
            await AsyncStorage.setItem("userInfo", JSON.stringify(value));
        } catch (e) { }
    };

    getGradeAndTerm = async (username) => {
        let checkGrade = await AsyncStorage.getItem(`${username}_grade`);
        let checkTerCode = await AsyncStorage.getItem(`${username}_term`);
        let textBook = await AsyncStorage.getItem(`${username}_textbook`); //数学教材版本
        checkGrade = checkGrade === null ? "03" : checkGrade;
        checkTerCode = checkTerCode === null ? "00" : checkTerCode;
        textBook = textBook === null ? "11" : textBook;
        return [checkGrade, checkTerCode, textBook];
    };
    loginSuccess = async (res, isStudent) => {
        const { textbookObj } = this.state;
        const username = !isStudent ? res.data.data.stu_name : res.data.data.name;
        console.log("username", res);
        const [checkGrade, checkTerCode, textBook] = await this.getGradeAndTerm(
            username
        );
        const gradeMap = {
            "01": "一年级",
            "02": "二年级",
            "03": "三年级",
            "04": "四年级",
            "05": "五年级",
            "06": "六年级",
        };
        const termMap = {
            "00": "上学期",
            "01": "下学期",
        };
        const info = { ...this.state.info, name: username };
        info["checkGrade"] = checkGrade;
        info["checkTeam"] = checkTerCode;
        info["textBook"] = textBook;
        this.props.setTextBook(textBook);
        info["grade"] = gradeMap[checkGrade];
        info["term"] = termMap[checkTerCode];
        info["textbookname"] = textbookObj[textBook];
        info["isGrade"] = true; //登录默认是小学
        info["isStudent"] = isStudent;
        console.log("userInfo", info);
        if (res.data.err_code === 0) {
            console.log(
                "登录",
                res.data.data.is_finish,
                "=====",
                JSON.parse(JSON.stringify(res.data.data))
            );
            this.props.setUser(Object.assign(res.data.data, info));
            this.setToken(res.data.data.token, "");
            this.props.setTokenStore(res.data.data.token);
            this.setUserInfo(Object.assign(res.data.data, info));
            this.props.setAvatar(res.data.data.avatar);
            DeviceEventEmitter.emit('refreshHomePageConfig')
            this.toHome(res, info);
        } else {
            let t = res.data.err_msg;
            if (t.includes("username")) {
                t = t.replace("username", "");
            } else if (t.includes("password")) {
                t = t.replace("password", "");
            }
            Toast.fail(t, 1);
        }
    };
    toHome = (res, info) => {
        DeviceEventEmitter.emit("afterPay");
        NavigationUtil.toHomePage({ ...this.props });
    };
    LoginNow = async () => {
        // 账号登录
        const { password, username } = this.state;
        if (!password || !username) {
            return;
        }
        Toast.loading("登录中", 0);
        axios
            .post(api.loginNow, this.state.info, { timeout: 30000 })
            .then(async (res) => {
                Toast.hide();
                this.loginSuccess(res, true);
            })
            .catch((e) => {
                Toast.hide();
            });
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    onChangeText = (text, type) => {
        let info = this.state.info;
        // console.log('info', info)
        info[type] = text;
        this.setState({
            info,
            username: info.username,
            password: info.password,
        });
    };

    check = () => {
        log("click check update btn");
        this.updateAppRef.current.checkUpdate();
    };
    changeCode = (value) => {
        this.setState({
            code: value,
        });
    };
    sendCode = () => {
        const { tel, timing, telTips } = this.state;
        if (timing || telTips || !tel) return;
        this.setState({
            timing: true,
        });
        this.interval = setInterval(() => {
            this.setState(
                (state) => ({
                    num: state.num - 1,
                }),
                () => {
                    if (this.state.num === 0) {
                        clearInterval(this.interval);
                        this.setState({
                            timing: false,
                            num: 60,
                        });
                    }
                }
            );
        }, 1000);
        axios.get(api.getCodeByEmail, { params: { mobile: tel } }).then((res) => {
            // console.log("验证码", res.data);
            if (res.data.err_code !== 0) {
                let t = res.data.err_msg;
                Toast.fail(t, 1);
            }
        });
    };
    changeEmail = (value) => {
        let isTel = false;
        let reg = /^1[3456789]\d{9}$/;
        if (reg.test(value)) {
            isTel = true;
        }
        console.log(reg.test(value));
        this.setState({
            tel: value,
            isTel,
        });
    };
    loginTel = () => {
        // 手机号登录
        const { tel, code, isAgree, isTel, info } = this.state;
        if (code && tel && isAgree && isTel) {
            info.username = tel;
            this.setState({
                info,
                username: tel,
                // password: info.password,
            });
            axios.post(api.loginBtyTel, { mobile: tel, code }).then((res) => {
                console.log("登录数据", res);
                if (res.data.err_code === 0) {
                    this.loginSuccess(res, false);
                    // let info = {};
                    // info.tel = tel;
                    // info.code = code;
                    // this.props.setUser(info);
                    // this.setToken(res.data.data.token, "tel").then(() => {
                    // NavigationUtil.toParentRoleHomePageAndroid({
                    //   ...this.props,
                    //   data: {
                    //     tel,
                    //     code,
                    //   },
                    // });
                    // });
                } else {
                    let t = res.data.err_msg;

                    Toast.fail(t, 1);
                }
            });
            // axios.post(api.loginBtyTel, { tel, code }).then((res) => {
            //   if (res.data.err_code === 0) {
            //     let info = {};
            //     info.tel = tel;
            //     info.code = code;
            //     this.props.setUser(info);
            //     this.setToken(res.data.data.token, "tel").then(() => {
            //       // NavigationUtil.toParentRoleHomePageAndroid({
            //       //   ...this.props,
            //       //   data: {
            //       //     tel,
            //       //     code,
            //       //   },
            //       // });
            //     });
            //   } else {
            //     let t = res.data.err_msg;

            //     Toast.fail(t, 1);
            //   }
            // });
        } else {
            if (!isAgree) {
                // Toast.fail("请同意隐私政策", 1);
                this.setState({
                    showToast: true,
                });
                setTimeout(() => {
                    this.setState({
                        showToast: false,
                    });
                }, 1000);
            }
        }
    };
    gotoProtocol = (type) => {
        if (Platform.OS === "ios") {
            const m = {
                ruanjian: require("../../images/IOSLogin/ruanjian.png"),
                ertong: require("../../images/IOSLogin/ertong.png"),
                yinsi: require("../../images/IOSLogin/yinsi.png"),
            };
            NavigationUtil.toProtocolPage({ ...this.props, data: { img: m[type] } });
        } else {
            NavigationUtil.toProtocolPage({ ...this.props, data: { img: type } });
        }
    };
    render() {
        const {
            username,
            password,
            isStudent,
            timing,
            code,
            telTips,
            num,
            tel,
            islook,
            isAgree,
            isTel,
            showToast,
        } = this.state;

        return (
            <View>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <ImageBackground
                        style={[{
                            width: '100%',
                            height: "100%",
                        },
                        appStyle.flexCenter
                        ]}
                        source={
                            Platform.OS === "ios"
                                ? require("../../images/androidLogin/bgIos.png")
                                : require("../../images/androidLogin/loginBg.png")
                        }
                    >
                        <KeyboardAvoidingView
                            // behavior={Platform.OS == "ios" ? "padding" : "height"}
                            behavior={"height"}
                        >
                            <View
                                style={{
                                    width: pxToDp(800),
                                    height: pxToDp(850),
                                    alignItems: "center",
                                    backgroundColor: "#fff",
                                    borderRadius: pxToDp(60),
                                    padding: pxToDp(40),
                                }}
                            >
                                <Text
                                    style={[
                                        {
                                            fontSize: pxToDp(52),
                                            color: "#5C7099",
                                            marginBottom: pxToDp(40),
                                        },
                                        appFont.fontFamily_jcyt_700,
                                    ]}
                                >
                                    登录
                                </Text>
                                {/* <Text style={[styles.inputMsgTitle]}>需要先登录才能继续哦</Text> */}
                                {isStudent ? (
                                    <View
                                        style={[
                                            appStyle.flexAliCenter,
                                            { width: "100%", flex: 1 },
                                        ]}
                                    >
                                        <View
                                            style={{
                                                // height: pxToDp(400),
                                                alignItems: "center",
                                                // marginBottom: pxToDp(60),
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: pxToDp(600),
                                                    marginBottom: pxToDp(40),
                                                }}
                                            >
                                                <ImageBackground
                                                    source={require("../../images/androidLogin/loginInputBg.png")}
                                                    style={[
                                                        size_tool(600, 120),
                                                        appStyle.flexJusCenter,
                                                    ]}
                                                >
                                                    <TextInput
                                                        style={[styles.input]}
                                                        placeholder="请输入账号"
                                                        placeholderTextColor="#999999"
                                                        onChangeText={(text) =>
                                                            this.onChangeText(text, "username")
                                                        }
                                                        value={username}
                                                    />
                                                </ImageBackground>
                                            </View>
                                            <View
                                                style={{
                                                    width: pxToDp(600),
                                                    marginBottom: pxToDp(40),
                                                }}
                                            >
                                                <ImageBackground
                                                    source={require("../../images/androidLogin/loginInputBg.png")}
                                                    style={[
                                                        size_tool(600, 120),
                                                        appStyle.flexJusCenter,
                                                        { position: "relative" },
                                                    ]}
                                                >
                                                    <TextInput
                                                        style={[styles.input]}
                                                        placeholder="默认密码为手机号后6位"
                                                        placeholderTextColor="#999999"
                                                        onChangeText={(text) =>
                                                            this.onChangeText(text, "password")
                                                        }
                                                        textContentType="password"
                                                        value={password}
                                                        secureTextEntry={!islook}
                                                    />
                                                    {islook ? (
                                                        <TouchableOpacity
                                                            onPress={() => this.setState({ islook: false })}
                                                            style={[
                                                                {
                                                                    position: "absolute",
                                                                    right: pxToDp(20),
                                                                },
                                                            ]}
                                                        >
                                                            <Image
                                                                style={[size_tool(80)]}
                                                                source={require("../../images/androidLogin/eyeOpen.png")}
                                                            />
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <TouchableOpacity
                                                            onPress={() => this.setState({ islook: true })}
                                                            style={[
                                                                {
                                                                    position: "absolute",
                                                                    right: pxToDp(20),
                                                                },
                                                            ]}
                                                        >
                                                            <Image
                                                                style={[size_tool(80)]}
                                                                source={require("../../images/androidLogin/eyeClose.png")}
                                                            />
                                                        </TouchableOpacity>
                                                    )}
                                                </ImageBackground>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            style={[{ marginBottom: pxToDp(40) }]}
                                            onPress={() => this.setState({ isStudent: false })}
                                        >
                                            <View
                                                style={[
                                                    appStyle.flexTopLine,
                                                    styles.checkTypeTxtWrap,
                                                ]}
                                            >
                                                <Text style={[styles.checkTypeTxt]}>验证码登录</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{
                                                width: pxToDp(600),
                                                height: pxToDp(120),

                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                            onPress={() => this.handleClickThrottled()}
                                        >
                                            <ImageBackground
                                                source={
                                                    password && username
                                                        ? require("../../images/androidLogin/btnBg.png")
                                                        : require("../../images/androidLogin/btnBgNo.png")
                                                }
                                                style={{
                                                    width: pxToDp(600),
                                                    height: pxToDp(120),
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                resizeMode="contain"
                                            >
                                                <Text style={[styles.btnTxt]}>登录</Text>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View
                                        style={[
                                            appStyle.flexAliCenter,
                                            { width: "100%", flex: 1 },
                                        ]}
                                    >
                                        {/* <Text
                      style={[
                        {
                          fontSize: pxToDp(52),
                          color: "#5C7099",
                          // fontWeight: "bold",
                          marginBottom: pxToDp(40),
                        },
                        appFont.fontFamily_jcyt_700,
                      ]}
                    >
                      登录
                    </Text> */}

                                        <View style={[appStyle.flexAliCenter]}>
                                            <View
                                                style={{
                                                    width: pxToDp(600),
                                                    marginBottom: pxToDp(40),
                                                }}
                                            >
                                                <View
                                                    style={[
                                                        appStyle.flexTopLine,
                                                        appStyle.flexJusBetween,
                                                    ]}
                                                >
                                                    {!isTel && tel.length > 0 ? (
                                                        <View
                                                            style={[
                                                                appStyle.flexTopLine,
                                                                appStyle.flexAliCenter,
                                                            ]}
                                                        >
                                                            <Image
                                                                source={require("../../images/androidLogin/nameNoOk.png")}
                                                                style={[size_tool(24)]}
                                                            />
                                                            <Text
                                                                style={[
                                                                    {
                                                                        fontSize: pxToDp(24),
                                                                        color: "#FF884D",
                                                                        marginLeft: pxToDp(12),
                                                                    },
                                                                ]}
                                                            >
                                                                请输入正确的手机号
                                                            </Text>
                                                        </View>
                                                    ) : null}
                                                </View>
                                                <ImageBackground
                                                    source={require("../../images/androidLogin/loginInputBg.png")}
                                                    style={[
                                                        size_tool(600, 120),
                                                        appStyle.flexJusCenter,
                                                        { position: "relative" },
                                                    ]}
                                                >
                                                    <TextInput
                                                        placeholderTextColor={"#9B9B9B"}
                                                        value={tel}
                                                        onChangeText={this.changeEmail}
                                                        placeholder={"请输入手机号"}
                                                        style={[styles.input]}
                                                        keyboardType="numeric"
                                                    />
                                                </ImageBackground>
                                            </View>
                                        </View>
                                        <View style={{}}>
                                            <View
                                                style={[
                                                    appStyle.flexTopLine,
                                                    appStyle.flexJusBetween,
                                                    { width: pxToDp(600), marginBottom: pxToDp(40) },
                                                ]}
                                            >
                                                <ImageBackground
                                                    source={require("../../images/androidLogin/inputBgLittle.png")}
                                                    style={[
                                                        size_tool(320, 120),
                                                        appStyle.flexJusCenter,
                                                        { position: "relative" },
                                                    ]}
                                                >
                                                    <TextInput
                                                        placeholderTextColor={"#9B9B9B"}
                                                        placeholder={"请输入验证码"}
                                                        value={code}
                                                        onChangeText={this.changeCode}
                                                        style={[styles.input, { width: pxToDp(280) }]}
                                                        keyboardType="numeric"
                                                    />
                                                </ImageBackground>
                                                {timing || !isTel ? (
                                                    <View>
                                                        <ImageBackground
                                                            source={require("../../images/androidLogin/sendCodeNo.png")}
                                                            style={[
                                                                size_tool(260, 120),
                                                                appStyle.flexCenter,
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    { fontSize: pxToDp(36), color: "#D3D8E5" },
                                                                    appFont.fontFamily_jcyt_700,
                                                                ]}
                                                            >
                                                                {isTel ? num : "获取验证码"}
                                                            </Text>
                                                        </ImageBackground>
                                                    </View>
                                                ) : (
                                                    <TouchableOpacity
                                                        style={{ marginLeft: pxToDp(36) }}
                                                        onPress={this.sendCode}
                                                    >
                                                        <ImageBackground
                                                            source={require("../../images/androidLogin/sendCode.png")}
                                                            style={[
                                                                size_tool(260, 120),
                                                                appStyle.flexCenter,
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    { fontSize: pxToDp(38), color: "#fff" },
                                                                    appFont.fontFamily_jcyt_700,
                                                                ]}
                                                            >
                                                                获取验证码
                                                            </Text>
                                                        </ImageBackground>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                            <View style={[appStyle.flexCenter]}>
                                                <TouchableOpacity
                                                    style={[
                                                        {
                                                            marginBottom: pxToDp(20),
                                                        },
                                                    ]}
                                                    onPress={() => this.setState({ isStudent: true })}
                                                >
                                                    <View
                                                        style={[
                                                            appStyle.flexTopLine,
                                                            styles.checkTypeTxtWrap,
                                                        ]}
                                                    >
                                                        <Text style={[styles.checkTypeTxt]}>
                                                            账号密码登录
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>

                                            <TouchableOpacity onPress={this.loginTel}>
                                                <ImageBackground
                                                    source={
                                                        code && tel && isAgree && isTel
                                                            ? require("../../images/androidLogin/btnBg.png")
                                                            : require("../../images/androidLogin/btnBgNo.png")
                                                    }
                                                    style={{
                                                        width: pxToDp(600),
                                                        height: pxToDp(120),
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.btnTxt,
                                                            {
                                                                color: code && tel ? "#fff" : "#D3D8E5",
                                                            },
                                                        ]}
                                                    >
                                                        登录
                                                    </Text>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                            {/* {Platform.OS === "ios" ? (
                        <View
                          style={[
                            appStyle.flexCenter,
                            padding_tool(20, 0, 20, 0),
                          ]}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              this.appleLoginRef.current.toggleProtocolModal(
                                true
                              );
                            }}
                          >
                            <Image
                              source={require("../../images/androidLogin/iosIcon.png")}
                              style={[size_tool(90)]}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : null} */}
                                        </View>
                                    </View>
                                )}

                                {isStudent ? null : (
                                    <View
                                        style={[
                                            appStyle.flexTopLine,
                                            appStyle.flexJusBetween,
                                            // { backgroundColor: "pink" },
                                        ]}
                                    >
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.setState({ isAgree: !this.state.isAgree })
                                            }
                                        >
                                            <Image
                                                style={[size_tool(60)]}
                                                source={
                                                    isAgree
                                                        ? require("../../images/androidLogin/checked.png")
                                                        : require("../../images/androidLogin/noCheck.png")
                                                }
                                            />
                                        </TouchableOpacity>
                                        <View
                                            style={[
                                                {
                                                    width: pxToDp(500),
                                                    flexDirection: "row",
                                                    flexWrap: "wrap",
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: pxToDp(24),
                                                }}
                                            >
                                                勾选后表示同意
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => this.gotoProtocol("ruanjian")}
                                                style={[styles.checkTypeTxtWrap]}
                                            >
                                                <Text
                                                    style={{
                                                        color: "#4C88FF",
                                                        fontSize: pxToDp(24),
                                                        // top: pxToDp(6),
                                                    }}
                                                >
                                                    《软件许可协议》
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => this.gotoProtocol("yinsi")}
                                                style={[styles.checkTypeTxtWrap]}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: pxToDp(24),
                                                        color: "#4C88FF",
                                                        // top: pxToDp(6),
                                                    }}
                                                >
                                                    《隐私政策》
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => this.gotoProtocol("ertong")}
                                                style={[styles.checkTypeTxtWrap]}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: pxToDp(24),
                                                        color: "#4C88FF",
                                                        // top: pxToDp(6),
                                                    }}
                                                >
                                                    《儿童隐私政策》
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </KeyboardAvoidingView>
                    </ImageBackground>
                </TouchableWithoutFeedback>
                <UpdateApp ref={this.updateAppRef} />
                {/* {Platform.OS === "ios" ? (
          <IosLogin
            navigation={this.props.navigation}
            isSelected={true}
            ref={this.appleLoginRef}
          />
        ) : null} */}
                {showToast ? <MyToast text={"请同意隐私政策!"} /> : null}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: pxToDp(139),
        ...appStyle.flexAliCenter,
    },
    backBtn: {
        position: "absolute",
        top: pxToDp(70),
        left: pxToDp(90),
    },
    input: {
        width: pxToDp(600),
        height: pxToDp(120),
        fontSize: pxToDp(38),
        paddingLeft: pxToDp(14),
        ...appFont.fontFamily_jcyt_500,
        // color:''
    },
    num: {
        width: pxToDp(100),
        height: pxToDp(100),
        borderRadius: pxToDp(50),
        backgroundColor: "#DDAD4B",
        borderWidth: pxToDp(4),
        borderColor: "#fff",
        ...appStyle.flexCenter,
        marginLeft: pxToDp(26),
    },
    tips: {
        fontSize: pxToDp(26),
        color: "red",
    },
    inputTitle: {
        fontSize: pxToDp(28),
        color: "#5C7099",
        marginBottom: pxToDp(20),
    },
    inputMsgTitle: {
        fontSize: pxToDp(25),
        color: "#5C7099",
        opacity: 0.6,
        marginBottom: pxToDp(20),
    },
    checkTypeTxt: {
        fontSize: pxToDp(28),
        color: "#4C88FF",
        fontWeight: "bold",

        ...appFont.fontFamily_jcyt_500,
    },
    btnTxt: {
        fontSize: pxToDp(40),
        fontWeight: "bold",
        ...appFont.fontFamily_jcyt_700,
        color: "#fff",
    },
    checkTypeTxtWrap: {
        borderBottomColor: "#4C88FF",
        borderBottomWidth: pxToDp(2),
        paddingBottom: pxToDp(4),
        marginRight: pxToDp(4),
    },
});
const mapStateToProps = (state) => {
    // 取数据
    return {
        token: state.getIn(["userInfo", "token"]),
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    // 存数据
    return {
        setUser(data) {
            dispatch(actionCreators.setUserInfoNow(data));
        },
        setTokenStore(data) {
            dispatch(actionCreators.setToken(data));
        },
        setTextBook(data) {
            dispatch(actionCreatorsMath.setMathTextBook(data));
        },
        setAvatar(data) {
            dispatch(actionCreators.setavatar(data));
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(StudentRoleHomePage);
