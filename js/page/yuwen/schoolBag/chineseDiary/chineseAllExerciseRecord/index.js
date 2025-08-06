import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { pxToDp, padding_tool, size_tool, borderRadius_tool, fontFamilyRestoreMargin } from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
import * as actionCreators from "../../../../../action/userInfo/index";

// import Svg,{ ForeignObject } from 'react-native-svg';
class ChineseSchoolHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            littlename: '',
            titleTxt: '',
            nowPage: 1,
            haveNextPage: true,
        };
    }


    goBack = () => {
        NavigationUtil.goBack(this.props);
    };


    componentDidMount() {
        // console.log('参数', this.props.navigation.state.params.data)
        this.getlist(1)
    }
    getlist(page) {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.page = page
        data.current_time = this.props.navigation.state.params.data.current_time,
            data.exercise_origin = this.props.navigation.state.params.data.exercise_origin
        axios.get(api.getChineseDiaryRecordList, { params: data }).then((res) => {
            console.log("id", res.data)
            let listnow = res.data.data;

            let { list, haveNextPage } = this.state
            let nowList = list.concat(listnow)
            if (nowList.length === res.data.data.total) {
                haveNextPage = false
            }
            if (res.data?.err_code === 0) {
                this.setState({
                    list: nowList,
                    littlename: this.props.navigation.state.params.data.name,
                    haveNextPage
                })
            }
        });
    }
    toLook = (item) => {
        // exercise_from 智能造句 11，阅读提升4， 智能句9，字词积累2， 同步诊断1 13拼音
        console.log('123', item.exercise_from)
        switch (item.exercise_from) {
            case '1':
                NavigationUtil.toChineseDidExercise({
                    ...this.props,
                    data: {
                        ...item,
                        type: 'diary'
                    },
                })
                break
            case '2':
                NavigationUtil.toChineseDidExercise({
                    ...this.props,
                    data: {
                        ...item,
                        ...this.props.navigation.state.params.data,
                        type: 'word'
                    },
                })
                break
            case '9':
                NavigationUtil.toNewSentenceExerciseRercord({
                    ...this.props,
                    data: {
                        ...item,
                        ...this.props.navigation.state.params.data,
                        type: 'diaryAll'
                    },
                })
                break
            case '11':
                console.log(item)

                NavigationUtil.toNewSentenceExerciseRercord({
                    ...this.props,
                    data: {
                        ...item,
                        ...this.props.navigation.state.params.data,
                        type: 'diaryAll',
                        name: item.tag1 === '关联词运用' ? '关联词运用' : '句型训练',
                        inspect_name: '智能造句'
                        // type: item.tag1 === '关联词运用' || item.tag1 === '修辞手法' ? '1' : '2'
                    },
                })
                break
            case '4':
                NavigationUtil.toNewReadingRecord({
                    ...this.props,
                    data: {
                        ...item,
                        ...this.props.navigation.state.params.data,
                        type: 'diary'
                    },
                })
                break
            case '13':
                NavigationUtil.toNewSentenceExerciseRercord({
                    ...this.props,
                    data: {
                        ...item,
                        ...this.props.navigation.state.params.data,
                        type: 'diaryAll'
                    },
                })
                break
            default:
                break
        }

        // NavigationUtil.toCompositionLookMindmap({
        //     ...this.props, data: {
        //         ...item,
        //         islookmap: true,
        //         // c_id: this.props.navigation.state.params.data.c_id
        //         updata: () => {
        //             this.setState({
        //                 list: [],
        //                 haveNextPage: true,
        //                 nowPage: 1
        //             }, () => this.getlist(1))

        //         }
        //     }
        // })
    }
    toLookModelArticle = (item) => {
        // NavigationUtil.toCompositionModelArticle({
        //     ...this.props, data: {
        //         ...item,
        //         islookmap: true,
        //         // c_id: this.props.navigation.state.params.data.c_id
        //     }
        // })
    }
    nextPage = () => {
        // 翻页
        let { nowPage, haveNextPage } = this.state
        if (haveNextPage) {
            let page = ++nowPage
            this.getlist(page)
            this.setState({
                nowPage: page
            })
        }

    }
    render() {
        const { list, littlename, titleTxt } = this.state;
        return (
            <ImageBackground
                style={styles.wrap}
                source={require('../../../../../images/chineseHomepage/flowBigBg.png')}
            >
                <View style={[appStyle.flexLine, appStyle.flexJusBetween, padding_tool(0, 64, 0, 64), { width: '100%', marginBottom: pxToDp(24) }]}>
                    {/* header */}
                    <TouchableOpacity onPress={this.goBack}>
                        <Image
                            source={require('../../../../../images/chineseHomepage/wrongTypeGoback.png')}
                            style={[size_tool(80)]}
                        />
                    </TouchableOpacity>
                    <ImageBackground
                        source={require('../../../../../images/chineseHomepage/wrongTypeHeader.png')}
                        style={[size_tool(500, 141), appStyle.flexCenter]}
                    >
                        <Text style={[{ fontSize: pxToDp(36), color: '#fff', paddingTop: pxToDp(20) }, appFont.fontFamily_syst]}>{littlename}/答题记录</Text>
                    </ImageBackground>
                    <Text style={[size_tool(80)]}></Text>
                </View>
                <View style={[padding_tool(40, 10, 40, 40), { flex: 1, width: '100%', }]}>
                    <ScrollView
                        onMomentumScrollEnd={() => this.nextPage()}
                    >
                        <View style={[appStyle.flexTopLine, appStyle.flexLineWrap,]}>
                            {
                                list.map((item, index) => {
                                    return <View key={index} style={[size_tool(620, 283), borderRadius_tool(32),
                                    { backgroundColor: '#fff', marginRight: pxToDp(46), marginBottom: pxToDp(30), borderColor: '#D1E5FF', borderWidth: pxToDp(8), paddingBottom: 0 }]}>
                                        <View style={[{ flex: 1, padding: pxToDp(40) }, appStyle.flexJusBetween,]}>
                                            <Text style={[{ fontSize: pxToDp(32), color: '#4494FD', marginBottom: pxToDp(24) }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>日期：{item.operate_time}</Text>
                                            <Text style={[{ fontSize: pxToDp(36), color: '#333', }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>题目数量：{item.total}道</Text>
                                        </View>
                                        <View style={[appStyle.flexTopLine, appStyle.flexJusBetween, { height: pxToDp(80), backgroundColor: '#D1E5FF', marginBottom: pxToDp(-1) },]}>
                                            <TouchableOpacity onPress={this.toLook.bind(this, item)} style={[appStyle.flexCenter, { width: '100%', }]}>
                                                <Text style={[{ fontSize: pxToDp(32), color: '#0179FF' }, appFont.fontFamily_syst]}>{'查看记录 >'}</Text>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                })
                            }
                        </View>
                    </ScrollView>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        alignItems: 'center'
    },

});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setUser(data) {
            dispatch(actionCreators.setUserInfoNow(data));
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
