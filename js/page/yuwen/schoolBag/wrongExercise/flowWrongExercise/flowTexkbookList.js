import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
} from "react-native";
import { connect } from 'react-redux';
import axios from " ../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import {
    size_tool,
    pxToDp,
    padding_tool,
    borderRadius_tool,
    fontFamilyRestoreMargin,
} from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
import { T } from "lodash/fp";
import EnglishBar from "../../../../../component/english/bar";
import OtherUserInfo from "../../../../../component/otherUserinfo";

const unitMap = {
    "1": "一单元",
    "2": "二单元",
    "3": "三单元",
    "4": "四单元",
    "5": "五单元",
    "6": "六单元",
    "7": "七单元",
    "8": "八单元",
    "9": "九单元",
    "10": "十单元",
    "11": "十一单元",
    "12": "十二单元",
    "13": "十三单元",
    "14": "十四单元",
    "15": "十五单元",
};
class FlowTextbookList extends PureComponent {
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
            checkIndex: 0,
            leftNavList: [
                {
                    color: "#3CB5FF",
                    img: require("../../../../../images/flowList1.png"),
                    selectIocn: require("../../../../../images/desk_gou2.png"),
                    isActive: true,
                    text: '今日错题',
                },
                {
                    color: "#F56B7F",
                    img: require("../../../../../images/flowList2.png"),
                    selectIocn: require("../../../../../images/desk_gou2.png"),
                    isActive: false,
                    text: '本周错题',

                },
                {
                    color: "#F7BF34",
                    img: require("../../../../../images/flowList3.png"),
                    selectIocn: require("../../../../../images/desk_gou2.png"),
                    isActive: false,
                    text: '本月错题',

                },
                {
                    color: "#F7BF34",
                    img: require("../../../../../images/flowList4.png"),
                    selectIocn: require("../../../../../images/desk_gou2.png"),
                    isActive: false,
                    text: '本学期错题',

                },
            ],
            nowPage: 1,
            haveNextPage: true,
        };
    }

    static navigationOptions = {
        // title:'答题'
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    toDoHomework = (exercise) => {
        NavigationUtil.toFlowWrongExerciseList(

            {
                ...this.props,
                data: {
                    ...this.props,
                    ...exercise,
                    index: this.state.checkIndex
                },
            }
        );
    };

    componentDidMount() {
        this.getList(1, 1)
    }
    getList = (index, page) => {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {}
        data.grade_code = userInfoJs.checkGrade;
        data.class_info = userInfoJs.class_code;
        data.team = userInfoJs.checkTeam;
        data.student_code = userInfoJs.id;
        axios
            .get(`${api.chineseGetWrongTextbookList}/${data.grade_code}/${data.team}/${index}?page=${page}`, data)
            .then((res) => {
                let list = res.data.data;

                let { fromServeCharacterList, haveNextPage } = this.state
                let nowList = fromServeCharacterList.concat(list)
                if (nowList.length === res.data.total) {
                    haveNextPage = false
                }
                this.setState(() => ({
                    fromServeCharacterList: [...nowList],
                    topaicNum: list.length,
                    haveNextPage
                })
                );
            });
    }
    checkThis = (index) => {
        let leftNavList = [];
        leftNavList = leftNavList.concat(this.state.leftNavList);
        leftNavList.forEach((i) => {
            i.isActive = false;
        });
        leftNavList[index].isActive = true;
        this.setState({
            checkIndex: index,
            leftNavList,
            fromServeCharacterList: [],
            haveNextPage: true,
            nowPage: 1
        });
        this.getList(index + 1, 1)
    };

    nextPage = () => {
        // 翻页
        let { nowPage, haveNextPage, checkIndex } = this.state
        if (haveNextPage) {
            let page = ++nowPage
            this.getList(checkIndex + 1, page)
            this.setState({
                nowPage: page
            })
        }

    }
    renderBar(item) {
        let num = (item.correct_num / item.answer_num).toFixed(4)
        let numWidth = 320 * num
        return <View style={[appStyle.flexLine]}>
            <Image
                source={require('../../../../../images/chineseHomepage/flowWrongLeft.png')}
                style={[size_tool(48)]}
            />
            <View style={{
                width: pxToDp(320),
                height: pxToDp(28),
                backgroundColor: '#F26161',
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: pxToDp(18),
                paddingRight: 8,
                marginLeft: pxToDp(24),
                marginRight: pxToDp(24)
            }}>
                <View style={{
                    fontSize: 12,
                    color: '#ffffff',
                    width: pxToDp(numWidth),
                    backgroundColor: '#77D102',
                    borderTopLeftRadius: pxToDp(18),
                    borderBottomLeftRadius: pxToDp(18),
                    borderTopRightRadius: item.correct_num === item.answer_num ? pxToDp(18) : 0,
                    borderBottomRightRadius: item.correct_num === item.answer_num ? pxToDp(18) : 0,
                }}></View>


            </View>
            <Image
                source={require('../../../../../images/chineseHomepage/flowWrongRight.png')}
                style={[size_tool(48)]}
            />
        </View>
    }
    render() {
        const { checkIndex, leftNavList } = this.state;
        return (
            <ImageBackground
                source={require('../../../../../images/chineseHomepage/flowBigBg.png')}
                style={[
                    { flex: 1, },
                ]}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.goBack()} style={{ width: pxToDp(468) }}>
                        <Image
                            source={require("../../../../../images/chineseHomepage/wrongTypeGoback.png")}
                            style={[size_tool(80), { marginLeft: pxToDp(32) }]}
                        ></Image>
                    </TouchableOpacity>
                    <ImageBackground
                        source={require('../../../../../images/chineseHomepage/wrongTypeHeader.png')}
                        style={[size_tool(500, 141), appStyle.flexCenter, { paddingTop: pxToDp(18) }]}
                    >
                        <Text style={{ ...styles.headerTitle, }}>错题集-同步诊断</Text>
                    </ImageBackground>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../../../../../images/chineseHomepage/flowRight.png')}
                            style={[size_tool(218, 72), { marginRight: pxToDp(32) }]}
                        />
                        <Image source={require('../../../../../images/chineseHomepage/flowWrong.png')}
                            style={[size_tool(218, 72)]}
                        />
                    </View>
                </View>
                <View style={styles.con}>
                    <View style={[styles.left]}>
                        <View style={[padding_tool(108, 0, 108, 0), { justifyContent: 'space-between', height: pxToDp(857) }]}>
                            {leftNavList.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.checkThis(index);
                                        }}
                                        key={index}
                                        style={[borderRadius_tool(24, 0, 0, 24), {
                                            width: pxToDp(254),
                                            height: pxToDp(100),
                                            backgroundColor: item.isActive ? '#A86A33' : '#FFF5E4',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }]}
                                    >
                                        <Text style={[{ color: item.isActive ? '#fff' : '#A86A33', fontSize: pxToDp(36) }, appFont.fontFamily_syst]}>{item.text}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                    </View>
                    <View style={{ flex: 1, backgroundColor: '#A86A33', borderRadius: pxToDp(32), padding: pxToDp(32) }}>

                        <View
                            style={{

                                flex: 1,
                                backgroundColor: '#FFF5E4',
                                borderRadius: pxToDp(32),
                                borderColor: '#FFAE00',
                                borderWidth: pxToDp(8),
                                padding: pxToDp(32)
                            }}
                        >
                            <ScrollView style={{
                                flex: 1
                            }}
                                onMomentumScrollEnd={() => this.nextPage()}>
                                {this.state.fromServeCharacterList.length > 0 ? (
                                    this.state.fromServeCharacterList.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => this.toDoHomework(item)}
                                                style={{
                                                    width: '100%',
                                                    minHeight: pxToDp(124),
                                                    backgroundColor: "#fff",
                                                    marginBottom: pxToDp(32),
                                                    flexDirection: 'row',
                                                    borderRadius: pxToDp(16),
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: pxToDp(32)
                                                }}
                                            >
                                                <Text style={[{ color: '#FFAE00', width: pxToDp(200), fontSize: pxToDp(36), }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>第{unitMap[item.unit_code]}</Text>
                                                <View style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    paddingLeft: pxToDp(32),
                                                    paddingRight: pxToDp(32),
                                                }}>
                                                    <Text style={[{ color: '#FFAE00', fontSize: pxToDp(36), width: pxToDp(500) }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>{item.learning_point}</Text>
                                                    {/* <Text style={{ color: '#FFFFFF', width: 80 }}>错题数：{item.false_num}</Text> */}
                                                    {this.renderBar(item)}
                                                </View>

                                                <View
                                                    style={[{
                                                        width: pxToDp(152),
                                                        height: pxToDp(60),
                                                        backgroundColor: "#A86A33",
                                                        borderRadius: pxToDp(30),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }]}
                                                >
                                                    <Text style={[{
                                                        color: '#fff',
                                                        fontSize: pxToDp(28),
                                                    }, appFont.fontFamily_syst]}>进入错题</Text>
                                                </View>

                                            </TouchableOpacity>
                                        );
                                    })
                                ) : (
                                    <Text>{' '}</Text>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </ImageBackground >
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        height: pxToDp(141),
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: pxToDp(40)
    },
    con: {
        flexDirection: "row",
        padding: pxToDp(40),
        flex: 1,
        alignItems: 'center'
    },
    left: {
    },
    details: {
        backgroundColor: "#fff",
        lineHeight: pxToDp(48),
        textAlign: "center",
        fontSize: pxToDp(24),
        borderRadius: pxToDp(32),
    },
    number: {
        color: "#A86A33",
        fontSize: pxToDp(32),
    },
    numberFinish: {
        color: "#fff",
        fontSize: pxToDp(32),
    },
    headerTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: pxToDp(36)
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    }
}

const mapDispathToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispathToProps)(FlowTextbookList)
