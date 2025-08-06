import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Platform
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { pxToDp, padding_tool } from "../../../../../util/tools";
// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            canvasWidth: 0,
            canvasHeight: 0,
            topaicNum: 0,
            //题目列表，后期可能改动
            fromServeCharacterList: [],
            isEnd: false,
            topaicIndex: 0,
            topicMap: new Map(),
            status: 0,
            gifUrl: "",
            classList: {},
            nowIndex: 1,
            unitList: [],
            titleTxt: ''
        };
    }

    static navigationOptions = {
        // title:'答题'
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    toDoHomework = (
        item
    ) => {
        NavigationUtil.toChineseLookAllFlowExerciseList({
            ...this.props,
            data: {
                ...item,
                updata: () => {
                    this.getlist()
                }
            },
        });
    };


    checkUnit = (checkIndex) => {
        this.setState({
            nowIndex: ++checkIndex,
        });
    };
    componentDidMount() {
        this.getlist()
    }

    getlist() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        axios.get(api.getChineseAllFlowExercisehome, { params: data }).then((res) => {
            let list = res.data.data;
            console.log('list1234', data, res.data)
            let classList = [];
            for (let i in list) {
                classList.push(i);
            }
            let titleTxt = userInfoJs.grade + userInfoJs.term
            // console.log(userInfoJs, 'userInfoJs')

            this.setState(() => ({
                classList: list,
                unitList: classList,
                // nowIndex: 1,
                titleTxt
            }));
        });
    }
    render() {
        const { nowIndex, classList, unitList, titleTxt } = this.state;
        return (
            <ImageBackground
                style={styles.wrap}
                source={require('../../../../../images/chineseHomepage/flowBigBg.png')}
            >
                <View style={[padding_tool(40, 48, 0, 48), { justifyContent: 'flex-start', width: '100%', marginBottom: pxToDp(37) }]}>
                    <TouchableOpacity
                        onPress={this.goBack}
                    >
                        <Image
                            source={require('../../../../../images/chineseHomepage/flowGoback.png')}
                            style={{ width: pxToDp(144), height: pxToDp(48) }}
                        ></Image>
                    </TouchableOpacity>
                </View>
                <View
                    // source={require('../../../../../images/chineseHomepage/flowMainBg.png')}
                    style={styles.con}>
                    <View style={[styles.con1]}>

                        <View
                            style={styles.mainWrap}
                        >
                            {unitList.length > 0 ? (
                                unitList.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => this.checkUnit(index)}
                                            style={{ marginBottom: pxToDp(32) }}
                                        >
                                            <ImageBackground
                                                source={index + 1 === nowIndex ? require('../../../../../images/chineseHomepage/flowMainItemCheckedBg.png') : require('../../../../../images/chineseHomepage/flowMainItemBg.png')}
                                                style={styles.unitBg}
                                            >
                                                <Text style={{ fontSize: pxToDp(36), color: index + 1 === nowIndex ? "#A25817" : '#AAAAAA' }}>
                                                    第{chineseNum[index]}单元
                                                </Text>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    );
                                })
                            ) : (
                                <Text></Text>
                            )}
                        </View>
                        <ScrollView >
                            <View style={styles.classListWrap}>
                                {classList[nowIndex] ? (
                                    classList[nowIndex].map((item, index) => {
                                        return (
                                            <View
                                                style={[styles.classItemWrap,]}
                                                key={index}
                                            >
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.numberStyle}
                                                    >
                                                        {++index}
                                                    </Text>
                                                    <Text style={styles.learningName}>
                                                        {item.learning_name}
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: "row", justifyContent: 'flex-end', alignItems: 'center', }}>
                                                    <View style={{ flexDirection: 'row' }}>

                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.toDoHomework(
                                                                    item,
                                                                )
                                                            }
                                                            key={index}
                                                            style={styles.itemBtn}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontSize: pxToDp(28),
                                                                    color: "#fff",
                                                                    textAlign: "center",
                                                                }}
                                                            >
                                                                查看习题
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>

                                            </View>
                                        );
                                    })
                                ) : (
                                    <Text>正在加载中。。。</Text>
                                )}
                            </View>
                        </ScrollView>
                        <ImageBackground
                            style={{
                                width: pxToDp(740),
                                height: pxToDp(170),
                                paddingBottom: pxToDp(40),
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'absolute',
                                margin: 0,
                                left: pxToDp(596),
                                top: pxToDp(-126)
                            }}
                            source={require('../../../../../images/chineseHomepage/flowTitleBg.png')}
                        >
                            <Text style={{ fontSize: pxToDp(44), color: '#fff' }}>同步习题-{titleTxt}</Text>
                        </ImageBackground>
                    </View>

                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: pxToDp(60),
        paddingTop: Platform.OS === 'ios' ? pxToDp(60) : 0
    },
    con: {

        // height: pxToDp(906),
        flex: 1,
        width: pxToDp(1920),
        padding: pxToDp(30),
        position: 'relative',
        backgroundColor: '#A86A33',
        borderRadius: pxToDp(32),
    },
    con1: {
        flex: 1,
        backgroundColor: '#FFF1DE',
        borderRadius: pxToDp(32),
        paddingTop: pxToDp(92),
        paddingBottom: pxToDp(55),
        paddingLeft: pxToDp(30),
        paddingRight: pxToDp(30),
    },
    mainWrap: {
        alignItems: "center",
        paddingLeft: pxToDp(64),
        paddingRight: pxToDp(64),
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    unitBg: {
        height: pxToDp(78),
        width: pxToDp(188),
        justifyContent: "center",
        alignItems: "center",
    },
    classListWrap: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'space-between',
    },
    classItemWrap: {
        borderRadius: pxToDp(32),
        backgroundColor: "#fff",
        padding: pxToDp(32),
        justifyContent: 'space-between',
        minHeight: pxToDp(240),
        width: pxToDp(884),
        marginBottom: pxToDp(32)
    },
    numberStyle: {
        fontSize: pxToDp(40),
        color: "#A25817",
        marginRight: pxToDp(61),
        backgroundColor: '#FFF8EE',
        width: pxToDp(80),
        height: pxToDp(80),
        borderRadius: pxToDp(40),
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: pxToDp(80),
        textAlign: "center",
        fontWeight: 'bold'
    },
    learningName: {
        fontSize: pxToDp(38),
        color: "#333",
        width: pxToDp(708),
        paddingRight: pxToDp(20)
    },
    itemBtn: {
        backgroundColor: "#A86A33",
        width: pxToDp(152),
        height: pxToDp(60),
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: pxToDp(16),
        marginLeft: pxToDp(32),
    },
    itemBtnNoCheck: {
        backgroundColor: "#E2E2E2",
        width: pxToDp(152),
        height: pxToDp(60),
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: pxToDp(16),
        marginLeft: pxToDp(32),
    }
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
