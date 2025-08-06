import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ImageBackground
} from "react-native";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { pxToDp, padding_tool, size_tool, borderRadius_tool } from "../../../../util/tools";
import Header from "../../../../component/Header";
import RichShowView from "../../../../component/math/RichShowViewHtml";

import { appStyle } from "../../../../theme";
import RenderHtml from "react-native-render-html";
import fonts from "../../../../theme/fonts";
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseDidExercise extends PureComponent {
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
            nowIndex: -1,
            unitList: [],
            time: '',
            page: 1,
            total_page: 0
        };
        this.scroll = null
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
        NavigationUtil.toEnglishAbcsExerciseDoWrong({
            ...this.props,
            data: { exercise_id: item.exercise_id },
        });
    };

    checkUnit = (checkIndex) => {
        this.setState({
            nowIndex: ++checkIndex,
        });
    };
    componentDidMount() {
        let isTestMe = this.props.navigation.state.params.data.isTestMe
        let type = this.props.navigation.state.params.data.type
        this.getDailyList(this.state.page)
    }

    getDailyList(page) {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        // data.grade_code = userInfoJs.checkGrade;
        // data.term_code = userInfoJs.checkTeam;
        data.modular = this.props.navigation.state.params.data.mode
        data.sub_modular = this.props.navigation.state.params.data.kpg_type
        data.origin = this.props.navigation.state.params.data.origin
        data.page = page
        axios.get(api.getMyStudyRecord, { params: data }).then((res) => {
            let list = res.data.data;
            console.log("每日一练答题记录", this.scroll)

            let time = list.length > 0 ? list[0].create_time : ''

            this.setState(() => ({
                unitList: list,
                time,
                page,
                total_page: res.data.total_page
            }));
            this.scroll && this.scroll.scrollTo({ x: 0, y: 0, animated: false })

        });
    }

    renderNormalExercise = () => {
        const { page, classList, unitList } = this.state;
        return unitList.map((item, index) => {
            // console.log("item.private_exercise_stem: ", item.private_exercise_stem)
            return <TouchableOpacity
                key={index}
                onPress={() => this.toDoHomework(item)}
                style={[
                    {
                        width: '100%',
                        // minHeight: pxToDp(267),
                        // backgroundColor: "#fff",
                        marginBottom: pxToDp(32),
                        // flexDirection: 'row',
                        borderRadius: 8,
                        justifyContent: 'space-between',
                        // alignItems: 'center',
                        paddingLeft: pxToDp(40),
                        paddingRight: pxToDp(40),
                        // paddingTop: 12,
                        paddingBottom: pxToDp(50),
                    },
                    appStyle.flexJusBetween,
                    // appStyle.flexLine,
                ]}
            >
                <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                    <View style={[size_tool(80), appStyle.flexCenter, { backgroundColor: item.correction === '0' ? '#16C792' : '#F2645B', borderRadius: pxToDp(40), marginRight: pxToDp(20) }]}>
                        <Text style={[{ fontSize: pxToDp(36), color: '#fff' }, fonts.fontFamily_jcyt_700]}>{(page - 1) * 10 + index + 1}</Text>
                    </View>
                    <View style={{ flex: 1, }}>
                        <RichShowView
                            width={pxToDp(1420)}
                            value={
                                `<div id="yuanti">${item.private_exercise_stem}</div>`
                            }
                            size={36}
                        ></RichShowView>
                    </View>
                    <View
                        style={[size_tool(100)]}
                    >
                        <Image style={[size_tool(100)]} source={require('../../../../images/chineseHomepage/pingyin/new/next.png')} />
                    </View>
                </View>
            </TouchableOpacity>
        })
    }
    renderPage = () => {
        const { page, total_page } = this.state
        let renturnobj = []
        for (let i = 1; i <= total_page; i++) {
            renturnobj.push(<TouchableOpacity
                onPress={this.checkpage.bind(this, i)}
                style={[size_tool(64), appStyle.flexCenter, { backgroundColor: page === i ? '#77D102' : '#fff', borderRadius: pxToDp(32), marginRight: pxToDp(pxToDp(32)) }]}>
                <Text style={{ fontSize: pxToDp(32), color: page === i ? '#fff' : '#aaa' }}>{i}</Text>
            </TouchableOpacity>)
        }
        return renturnobj
    }
    checkpage = (page) => {
        this.getDailyList(page)
    }
    render() {
        return (
            <ImageBackground
                source={require('../../../../images/english/abcs/doBg.png')}
                resizeMode='cover'
                style={[, { flex: 1, position: 'relative', paddingTop: 0 }, appStyle.flexCenter, padding_tool(70, 200, 0, 200)]}>


                <TouchableOpacity
                    onPress={this.goBack}
                    style={[{ position: 'absolute', top: pxToDp(48), left: pxToDp(40), zIndex: 0 }]}>
                    <Image
                        source={require('../../../../images/chineseHomepage/pingyin/new/back.png')}
                        style={[size_tool(120, 80),
                        ]}
                    />

                </TouchableOpacity>
                <View style={[{ width: "100%", flex: 1, backgroundColor: '#fff' }, borderRadius_tool(40, 40, 0, 0), appStyle.flexAliCenter, padding_tool(40)]}>
                    <Text style={[fonts.fontFamily_jcyt_700, { fontSize: pxToDp(50) }]}>Record</Text>
                    <View style={[appStyle.flexTopLine, appStyle.flexAliCenter, { height: pxToDp(100) }]}>
                        <View style={[{ flexDirection: "row", alignItems: "center", }]}>

                            {
                                this.renderPage()
                            }
                        </View>
                    </View>
                    <ScrollView
                        ref={(scrollRef) => (this.scroll = scrollRef)}
                        style={{ height: Dimensions.get("window").height * 0.65, width: '100%', backgroundColor: '#fff' }}
                    >
                        {this.renderNormalExercise()}
                        <Text style={{ fontSize: pxToDp(32), color: '#999999', textAlign: 'center', marginRight: pxToDp(20), marginBottom: pxToDp(80), }}>
                            Record: {this.state.time}
                        </Text>
                    </ScrollView>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    mainWrap: {
        height: 570,
    },
    con: {
        flexDirection: "row",
        paddingLeft: pxToDp(48),
        paddingRight: pxToDp(48),
        height: "100%",
    },
    header: {
        height: pxToDp(104),
        backgroundColor: "#fff",
        borderRadius: pxToDp(16),
        // marginBottom: pxToDp(40),
        paddingLeft: pxToDp(20)
    },
    titleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: pxToDp(36),
        width: pxToDp(218),
        height: pxToDp(72),
        backgroundColor: "#fff",
        justifyContent: 'center'
    },
    headRight: {
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseDidExercise);
