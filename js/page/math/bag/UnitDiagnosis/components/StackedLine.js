import React, { PureComponent } from "react"
import {
    Text,
    StyleSheet,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    Platform,
    ImageBackground,
    processColor,
    ActivityIndicator
} from "react-native"
import _, { size } from "lodash"

import { pxToDp, size_tool } from "../../../../../util/tools"
import { appFont, appStyle, mathFont } from "../../../../../theme"
import { connect } from "react-redux";
import * as actionCreators from "../../../../../action/yuwen/language";
import fonts from "../../../../../theme/fonts"
// import { LineChart } from 'react-native-charts-wrapper';
import DashedLineVertical from './DashedLineVertical';
import LineChartComponent from './LineChartComponent';
import index from "../../../../../reducer"
import { color } from "react-native-reanimated"
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class SelectLanguageModal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            list: [],
            xAxis: [],
            series: [],
            imageBase64: {
                width: 0,
                height: 0
            }
        }
    }



    componentDidMount() {
        // Image.getSize(this.props.image, (width, height) => {
        //     const maxWidth = pxToDp(1600);
        //     const scaleFactor = maxWidth / width;
        //     let obj = { width: maxWidth, height: height * scaleFactor, }
        //     this.setState({
        //         imageBase64: obj
        //     })

        // });
    }








    startLoading = (val) => {
        this.setState({
            isLoading: val
        })
    }


    close = () => {
        this.props.close()
    }
    render() {
        const { imageBase64 } = this.state;
        const { show, ruleConfig, img } = this.props
        if (!show) return null
        return <View style={[styles.container]}>
            <TouchableWithoutFeedback onPress={this.close}>
                <View style={[styles.click_region]}></View>
            </TouchableWithoutFeedback>
            <View style={[styles.content]}>
                <ScrollView>


                    <View style={{
                        ...appStyle.flexAliCenter
                    }}>
                        <Image style={{
                            width: this.props.imageBase64.width,
                            height: this.props.imageBase64.height,
                            marginTop: pxToDp(40)
                        }} source={{
                            uri: this.props.image
                        }} />
                        <View style={styles.common_btn}>
                            <Text style={[{ fontSize: pxToDp(32), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}>学生水平分布图</Text>
                        </View>
                    </View>
                    <View style={styles.line_container}>

                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                this.props.data.keys.map((item, index) => {
                                    return <LineChartComponent index={index} option={{
                                        xAxis: {
                                            type: "category",
                                            data: item,
                                            name: '做题数',
                                            axisLabel: {
                                                fontSize: pxToDp(30),
                                                color: '#4C4C59',
                                                ...appFont.fontFamily_jcyt_500
                                            }
                                        },
                                        yAxis: {
                                            type: "value",
                                            name: '能力',
                                            axisLabel: {
                                                fontSize: pxToDp(30),
                                                color: '#4C4C59',
                                                ...appFont.fontFamily_jcyt_500
                                            }
                                        },
                                        series: [
                                            {
                                                data: this.props.data.values[index],
                                                type: "line",
                                                smooth: true,
                                                lineStyle: {
                                                    color: '#5470c6' // 线条颜色
                                                },
                                                itemStyle: {
                                                    color: '#5470c6' // 点颜色
                                                }

                                            },
                                        ]
                                    }} />
                                })
                            }

                            {/* <LineChartComponent option={{
                            xAxis: {
                                type: "category",
                                data: Object.keys(this.props.data.ability[0]),
                                axisLabel: {
                                    fontSize: pxToDp(30),
                                    color: '#4C4C59',
                                    ...appFont.fontFamily_jcyt_500
                                }
                            },
                            yAxis: {
                                type: "value",
                                axisLabel: {
                                    fontSize: pxToDp(30),
                                    color: '#4C4C59',
                                    ...appFont.fontFamily_jcyt_500
                                }
                            },
                            series: [
                                {
                                    data: Object.values(this.props.data.ability[0]),
                                    type: "line"
                                },
                            ]
                        }} /> */}
                        </ScrollView>
                        {/* <View style={styles.dashedLine}>
                        <DashedLineVertical height={pxToDp(600)} width={pxToDp(4)} />
                    </View> */}

                        {/* <LineChartComponent /> */}



                    </View>
                </ScrollView>
                <TouchableOpacity onPress={this.close} style={[styles.closeBtnWrap]}>
                    <Image
                        style={[styles.closeBtn]}
                        source={require("../../../../../images/chineseHomepage/sentence/status2.png")}
                    />
                </TouchableOpacity>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        height: windowHeight,
        position: 'absolute',
        // top: pxToDp(Platform.OS === 'ios' ? 140 : 120),
        left: 0,
        ...appStyle.flexAliCenter,
        zIndex: 3,
        elevation: 3,
        // justifyContent: 'center'
    },
    click_region: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(71, 82, 102, 0.5)',
    },
    content: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? pxToDp(250) : pxToDp(90),
        width: pxToDp(1680),
        height: pxToDp(920),
        backgroundColor: "#fff",
        borderRadius: pxToDp(40),
        // paddingTop: pxToDp(108),
        // paddingBottom: pxToDp(108)
        // backgroundColor: '#E7E7F2',
        // borderRadius: pxToDp(60),
        // ...appStyle.flexAliCenter,
        // paddingBottom: pxToDp(8),
        // right: pxToDp(-40)
    },
    line_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: pxToDp(37 * 2),
        paddingBottom: pxToDp(100)
    },
    inner: {
        width: '100%',
        padding: pxToDp(40),
        backgroundColor: "#fff",
        borderRadius: pxToDp(60),
    },
    item: {
        paddingBottom: pxToDp(6)
    },
    item_inner: {
        paddingLeft: pxToDp(20),
        ...appStyle.flexLine
    },
    triangle_up: {
        width: 0,
        height: 0,
        borderLeftWidth: pxToDp(16),
        borderLeftColor: 'transparent',
        borderRightWidth: pxToDp(16),
        borderRightColor: 'transparent',
        borderBottomWidth: pxToDp(20),
        borderBottomColor: '#fff',
        position: 'absolute',
        top: pxToDp(-20),
        right: pxToDp(50)
    },
    rule_img: {
        width: pxToDp(183 * 2),
        height: pxToDp(162 * 2),
        top: pxToDp(24)
    },
    rule_skill_con: {
        width: pxToDp(120),
        height: pxToDp(26 * 2),
        backgroundColor: '#F0F0FA',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        borderRadius: pxToDp(200),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
        elevation: 20,
        top: pxToDp(-44),
        right: pxToDp(274)

    },
    rule_skill: {
        width: pxToDp(28),
        height: pxToDp(28),
        marginRight: pxToDp(4),
        top: pxToDp(-2)
    },
    closeBtn: {
        width: pxToDp(100),
        height: pxToDp(100),
    },
    closeBtnWrap: {
        position: "absolute",
        top: pxToDp(-36),
        right: pxToDp(-36),
    },
    line_con: {
        width: pxToDp(372 * 2),
        height: pxToDp(244 * 2),
        marginTop: pxToDp(40)
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    left_con: {

    },
    right_con: {

    },
    common_btn: {
        width: pxToDp(320),
        height: pxToDp(36 * 2),
        backgroundColor: '#F5F5FA',
        borderRadius: pxToDp(200),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: pxToDp(100),

    },
    dashedLine: {
        width: pxToDp(60)
    }

})
const mapStateToProps = (state) => {
    return {
        language_data: state.getIn(["languageChinese", "language_data"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setLanguageData(data) {
            dispatch(actionCreators.setLanguageData(data));
        }
    };
};

export default connect(mapStateToProps, mapDispathToProps)(SelectLanguageModal);
