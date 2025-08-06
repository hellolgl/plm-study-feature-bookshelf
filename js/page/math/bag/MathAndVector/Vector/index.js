import React, {Component} from "react"
import {View, Text, Image, StyleSheet, Platform, ImageBackground, TouchableOpacity, ScrollView, Dimensions} from "react-native"
import SvgDrawTest from "./AppGradding"
import Svg, {Line} from "react-native-svg"
import {GriddingClass, BaseProcessClass} from "./GraphAndNumAlgorithm"
import {DrawSvgClass} from "./GraphAndNumSVG"
import {pxToDp} from "../../../../../util/tools"
import MathNavigationUtil from "../../../../../navigator/NavigationMathUtil"
import NavigationUtil from "../../../../../navigator/NavigationUtil"
import axios from "../../../../../util/http/axios"
import api from "../../../../../util/http/api"
import { appStyle } from "../../../../../theme"

const os = Platform.OS
const log = console.log.bind(console)

class Vector extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentModal: "平面几何",
        }
    }

    componentDidMount() {
        const url = `${api.getMathGraphNumberType}?parent_id=0`
        // 暂时不需要对数据进行处理，该请求只为检查用户是否有使用该商品的权限
        axios
            .get(url, )
            .then((res) => {
            });
    }

    toggleModal = (modalName) => {
        log("toggle modal name: ", modalName)
    }

    toVector = (vector) => {
        const vMap = {
            "平行四边形": 8,
        }
        MathNavigationUtil.toMathVectorOperator({...this.props, data: {g_n_id: vMap[vector]}})
    }

    toComprehensiveExercise = (vector)=>{
        const vMap = {
            "平行四边形": 8,
        }
        MathNavigationUtil.toMathVectorComprehensiveDoExercise({...this.props, data: {g_n_id: vMap[vector],name:vector}})

    } 
    render() {
        log("!!!! height: ", os, Dimensions.get("window").height)
        const {currentModal} = this.state
        const vectorList = ["三角形", "正方形", "长方形", "平行四边形", "菱形", "梯形", "不规则四边形", "圆形",]
        const vectorMap = {
            "三角形": {
                imgUrl: require(`../../../../../images/vector/sanjiao.png`),
                width: 217,
                height: 174,
            },
            "正方形": {
                imgUrl: require(`../../../../../images/vector/zhengfang.png`),
                width: 200,
                height: 200,
            },
            "长方形": {
                imgUrl: require(`../../../../../images/vector/changfang.png`),
                width: 240,
                height: 160,
            },
            "平行四边形": {
                imgUrl: require(`../../../../../images/vector/pingxing.png`),
                width: 240,
                height: 150,
            },
            "菱形": {
                imgUrl: require(`../../../../../images/vector/ling.png`),
                width: 256,
                height: 150,
            },
            "梯形": {
                imgUrl: require(`../../../../../images/vector/ti.png`),
                width: 234,
                height: 150,
            },
            "不规则四边形": {
                imgUrl: require(`../../../../../images/vector/buguize.png`),
                width: 244,
                height: 200,
            },
            "圆形": {
                imgUrl: require(`../../../../../images/vector/yuan.png`),
                width: 200,
                height: 200,
            },
        }
        return <View style={[styles.content]}>
            <View style={[]}>
                <ImageBackground
                    source={require("../../../../../images/vector/navigationBar.png")}
                    style={[{height: os === "ios"? pxToDp(148): pxToDp(128), width: "100%"}, styles.header]}
                    resizeMode={'stretch'}
                >
                    <TouchableOpacity style={[styles.backBtnPosition]}
                          onPress={() => {NavigationUtil.goBack(this.props)}}
                    >
                        <Image
                            source={require("../../../../../images/vector/back.png")}
                            style={{width: pxToDp(80), height: pxToDp(80)}}
                        ></Image>
                    </TouchableOpacity>
                    <View style={[styles.toggleHeader]}>
                        <TouchableOpacity
                            style={[styles.headerItemTouch, currentModal==="平面几何"? styles.selectedItem: {}]}
                            onPress={() => this.toggleModal("平面几何")}
                        >
                            <View style={[styles.headerItem]}>
                                <Image
                                    source={require("../../../../../images/vector/vector.png")}
                                    style={{width: pxToDp(80), height: pxToDp(80)}}
                                ></Image>
                                <Text style={[styles.headerItemFont]}>平面几何</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.headerItemTouch, styles.headerItem1Position, currentModal==="立体几何"? styles.selectedItem: {}]}
                            onPress={() => this.toggleModal("立体几何")}
                        >
                            <View style={[styles.headerItem]}>
                                <Image
                                    source={require("../../../../../images/vector/liti.png")}
                                    style={{width: pxToDp(80), height: pxToDp(80)}}
                                ></Image>
                                <Text style={[styles.headerItemFont]}>立体几何</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.headerItemTouch, styles.headerItem2Position, currentModal==="图形的位置与运动"? styles.selectedItem: {}]}
                            onPress={() => this.toggleModal("图形的位置与运动")}
                        >
                            <View style={[styles.headerItem]}>
                                <Image
                                    source={require("../../../../../images/vector/move_vector.png")}
                                    style={{width: pxToDp(80), height: pxToDp(80)}}
                                ></Image>
                                <Text style={[styles.headerItemFont]}>图形的位置与运动</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
            <View style={[styles.body]}>
                <View style={[styles.sideBar]}>
                    <TouchableOpacity style={[styles.sideBarItem0, styles.selectedSideBarItem]}>
                        <Image
                            source={require("../../../../../images/vector/line.png")}
                            style={{width: pxToDp(88), height: pxToDp(88)}}
                        ></Image>
                        <View style={[{width: pxToDp(88), alignItems: "center", textAlign: "center", justifyContent: "center"}]}>
                            <Text style={[styles.sideBarFont]}>
                                线
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.sideBarItem1, styles.selectedSideBarItem]}>
                        <Image
                            source={require("../../../../../images/vector/corner.png")}
                            style={{width: pxToDp(88), height: pxToDp(88)}}
                        ></Image>
                        <View style={[{width: pxToDp(88), alignItems: "center", textAlign: "center", justifyContent: "center"}]}>
                            <Text style={[styles.sideBarFont]}>
                                角
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.sideBarItem2, styles.selectedSideBarItem, styles.selectedSideBarItemColor]}>
                        <Image
                            source={require("../../../../../images/vector/jichu.png")}
                            style={{width: pxToDp(88), height: pxToDp(88)}}
                        ></Image>
                        <View style={[{width: pxToDp(88), alignItems: "center", textAlign: "center", justifyContent: "center"}]}>
                            <Text style={[styles.sideBarFont]}>
                                基础
                            </Text>
                            <Text style={[styles.sideBarFont]}>
                                图形
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.sideBarItem3, styles.selectedSideBarItem]}>
                        <Image
                            source={require("../../../../../images/vector/zuhe.png")}
                            style={{width: pxToDp(88), height: pxToDp(88)}}
                        ></Image>
                        <View style={[{width: pxToDp(88), alignItems: "center", textAlign: "center", justifyContent: "center"}]}>
                            <Text style={[styles.sideBarFont]}>
                                组合
                            </Text>
                            <Text style={[styles.sideBarFont]}>
                                图形
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    style={[styles.vectorContent]}
                >
                    <View style={[{flexDirection: "row", flexWrap: "wrap"}]}>
                        {vectorList.map(v => {
                            const vectorInfo = vectorMap[v]
                            return <View
                                style={[{
                                    width: pxToDp(413),
                                    height: pxToDp(413),
                                    backgroundColor: "#fff",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginLeft: pxToDp(35),
                                    marginTop: pxToDp(35),
                                    borderRadius: pxToDp(15),
                                }]}
                            >
                                <View style={{marginTop: pxToDp(0), marginBottom: pxToDp(20)}}>
                                    <Text style={[styles.vectorItemFont]}>{v}</Text>
                                </View>
                                <View
                                    style={[{
                                        width: pxToDp(349),
                                        height: pxToDp(240),
                                        backgroundColor: "#E7EFFF",
                                        borderRadius: pxToDp(15),
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }]}
                                >
                                    <Image
                                        source={vectorInfo["imgUrl"]}
                                        style={{width: pxToDp(vectorInfo["width"]), height: pxToDp(vectorInfo["height"])}}
                                    >
                                    </Image>
                                </View>
                                <View style={[appStyle.flexLine,appStyle.flexJusBetween,{width:'100%',paddingLeft:pxToDp(32),paddingRight:pxToDp(32)}]}>
                                    {v==="平行四边形"?
                                        <TouchableOpacity
                                            style={[{width: pxToDp(165), height: pxToDp(60),backgroundColor: "#43D3F4",borderRadius: pxToDp(10),marginTop:pxToDp(14)},appStyle.flexCenter]}
                                            onPress={() => {this.toVector(v)}}
                                        >
                                            <Text style={{color: "#fff", fontSize: pxToDp(30)}}>开始了解</Text>
                                        </TouchableOpacity>
                                        :
                                    <TouchableOpacity
                                            style={[{width: pxToDp(165), height: pxToDp(60),backgroundColor: "#dadada",borderRadius: pxToDp(10),marginTop:pxToDp(14)},appStyle.flexCenter]}
                                        >
                                            <Text style={{color: "#fff", fontSize: pxToDp(30)}}>开始了解</Text>
                                        </TouchableOpacity>
                                    }
                                    {v==="平行四边形"?
                                        <TouchableOpacity
                                            style={[{width: pxToDp(165), height: pxToDp(60),backgroundColor: "#FFC52D",borderRadius: pxToDp(10),marginTop:pxToDp(14)},appStyle.flexCenter]}
                                            onPress={() => {this.toComprehensiveExercise(v)}}
                                        >
                                            <Text style={{color: "#fff", fontSize: pxToDp(30)}}>综合测试</Text>
                                        </TouchableOpacity>
                                        :
                                    <TouchableOpacity
                                            style={[{width: pxToDp(165), height: pxToDp(60),backgroundColor: "#dadada",borderRadius: pxToDp(10),marginTop:pxToDp(14)},appStyle.flexCenter]}
                                        >
                                            <Text style={{color: "#fff", fontSize: pxToDp(30)}}>综合测试</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                              
                            </View>
                        })}
                    </View>
                </ScrollView>
            </View>
        </View>
    }
}

const sideBarItemHeight = os === "ios"? 260: 225
const fontSize = os === "ios"? 30: 25

const styles = StyleSheet.create({
    content: {
        flexDirection: "column",
    },
    header: {
        flexDirection: "row",
    },
    backBtnPosition:{
        marginLeft: pxToDp(64),
        top: os === "ios"? pxToDp(37): pxToDp(24),
    },
    toggleHeader: {
        marginLeft: pxToDp(444),
    },
    selectedItem: {
        backgroundColor: "#43D3F4",
    },
    headerItemTouch: {
        backgroundColor: "#80DBF0",
        height: pxToDp(92),
        // width: pxToDp(278),
        paddingLeft: pxToDp(30),
        paddingRight: pxToDp(30),
        borderTopLeftRadius: pxToDp(15),
        borderTopRightRadius: pxToDp(15),
        position: "absolute",
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        // marginRight: pxToDp(30),
    },
    headerItem: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    headerItem1Position: {
        left: pxToDp(278 + 10)
    },
    headerItem2Position: {
        left: pxToDp(278 * 2 + 20)
    },
    headerItemFont: {
        marginLeft: pxToDp(10),
        fontSize: pxToDp(32),
        color: "#fff",
    },
    body: {
        backgroundColor: "#E7EFFF",
        width: "100%",
        height: "100%",
        flexDirection: "row",
    },
    sideBar: {
        width: pxToDp(200),
        height: "100%",
        backgroundColor: "#fff",
        flexDirection: "column",
        alignItems: "center",
    },
    sideBarItem0: {
        marginTop: os==="ios"? pxToDp(130): pxToDp(0),
    },
    sideBarItem1: {
        marginTop: os==="ios"? pxToDp(130 + sideBarItemHeight): pxToDp(sideBarItemHeight),
    },
    sideBarItem2: {
        marginTop: os==="ios"? pxToDp(130 + sideBarItemHeight * 2): pxToDp( sideBarItemHeight * 2),
    },
    sideBarItem3: {
        marginTop: os==="ios"? pxToDp(130 + sideBarItemHeight * 3): pxToDp( sideBarItemHeight * 3),
    },
    sideBarFont: {
        fontSize: pxToDp(fontSize),
    },
    selectedSideBarItem: {
        position: "absolute",
        left: pxToDp(30),
        paddingLeft: pxToDp(36),
        // backgroundColor: "#f00",
        width: "86%",
        height: pxToDp(sideBarItemHeight),
        borderTopLeftRadius: pxToDp(20),
        borderBottomLeftRadius: pxToDp(20),
        // alignItems: "center",
        justifyContent: "center",
    },
    selectedSideBarItemColor: {
        backgroundColor: "#E3ECFE",
    },
    vectorContent: {
        width: "91%",
        maxHeight: Dimensions.get("window").height - (os === "ios"? 80: 128),
    },
    vectorItem: {
        height: pxToDp(200),
    },
    vectorItemFont: {
        color: "#43D3F4",
        fontSize: pxToDp(24),
    },

});

export default Vector
