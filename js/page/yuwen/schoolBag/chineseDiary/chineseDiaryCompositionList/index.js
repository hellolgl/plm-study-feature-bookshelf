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
import { appStyle,appFont } from "../../../../../theme";
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
        this.getlist()
    }
    getlist(page) {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.class_info = userInfoJs.class_code;
        data.term_code = userInfoJs.checkTeam;
        data.student_code = userInfoJs.id;
        data.subject = "01";
        data.c_id = this.props.navigation.state.params.data.c_id
        data.page = page
        axios.get(api.getCompositionMyCreaterList, { params: data }).then((res) => {
            console.log("id", res.data.data.page_info)
            let listnow = res.data.data.data;

            let { list, haveNextPage } = this.state
            let nowList = list.concat(listnow)
            if (nowList.length === res.data.data.page_info.total) {
                haveNextPage = false
            }
            if (res.data?.err_code === 0) {
                this.setState({
                    list: nowList,
                    littlename: this.props.navigation.state.params.data.littlename,
                    haveNextPage
                })
            }
        });
    }
    toLook = (item) => {
        NavigationUtil.toCompositionLookMindmap({
            ...this.props, data: {
                ...item,
                islookmap: true,
                // c_id: this.props.navigation.state.params.data.c_id
                updata: () => {
                    this.setState({
                        list: [],
                        haveNextPage: true,
                        nowPage: 1
                    }, () => this.getlist(1))

                }
            }
        })
    }
    toLookModelArticle = (item) => {
        NavigationUtil.toCompositionModelArticle({
            ...this.props, data: {
                ...item,
                islookmap: true,
                // c_id: this.props.navigation.state.params.data.c_id
            }
        })
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
                        <Text style={[{ fontSize: pxToDp(36), color: '#fff', paddingTop: pxToDp(20) },appFont.fontFamily_syst]}>创作中心 — {littlename}</Text>
                    </ImageBackground>
                    <Text style={[size_tool(80)]}></Text>
                </View>
                <View style={[padding_tool(40, 10, 40, 40), { flex: 1, width: '100%' }]}>
                    <ScrollView
                        onMomentumScrollEnd={() => this.nextPage()}
                    >
                        <View style={[appStyle.flexTopLine, appStyle.flexLineWrap,]}>
                            {
                                list.map((item, index) => {
                                    return <View key={index} style={[size_tool(620, 359), borderRadius_tool(32),
                                    { backgroundColor: '#fff', marginRight: pxToDp(46), marginBottom: pxToDp(30), borderColor: '#D1E5FF', borderWidth: pxToDp(8) }]}>
                                        <View style={[{ flex: 1, padding: pxToDp(40) }, appStyle.flexJusBetween,]}>
                                            <View style={[appStyle.flexTopLine, appStyle.flexJusBetween,]}>
                                                <Text style={[{ fontSize: pxToDp(32), color: '#4494FD' },appFont.fontFamily_syst,fontFamilyRestoreMargin()]}>题材：{littlename}</Text>
                                                <View style={[appStyle.flexTopLine]}>
                                                    <Text style={[{ fontSize: pxToDp(32), color: '#333' },appFont.fontFamily_syst,fontFamilyRestoreMargin()]}>状态：</Text>
                                                    {item.status === '0' ? <Text style={[{ fontSize: pxToDp(32), color: '#AAAAAA' },appFont.fontFamily_syst,fontFamilyRestoreMargin()]}>未完成</Text>
                                                        : <Text style={[{ fontSize: pxToDp(32), color: '#77D102' },appFont.fontFamily_syst,fontFamilyRestoreMargin()]}>已完成</Text>
                                                    }
                                                </View>

                                            </View>
                                            <Text style={[{ fontSize: pxToDp(36), color: '#333' },appFont.fontFamily_syst]}>{item.name}</Text>
                                            <Text style={[{ fontSize: pxToDp(30), color: '#aaa' },appFont.fontFamily_syst,fontFamilyRestoreMargin()]}>完成时间：{item.operate_time}</Text>
                                        </View>
                                        <View style={[appStyle.flexTopLine, appStyle.flexJusBetween, { height: pxToDp(80), backgroundColor: '#D1E5FF' },]}>
                                            <TouchableOpacity onPress={this.toLook.bind(this, item)} style={[appStyle.flexCenter, { width: pxToDp(310), borderRightColor: '#91C9FF', borderRightWidth: pxToDp(2) }]}>
                                                <Text style={[{ fontSize: pxToDp(32), color: '#0179FF' },appFont.fontFamily_syst]}>{'思维导图 >'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={this.toLookModelArticle.bind(this, item)} style={[appStyle.flexCenter, { width: pxToDp(310) }]}>
                                                <Text style={[{ fontSize: pxToDp(32), color: '#0179FF' },appFont.fontFamily_syst]}>{'查看范文 >'}</Text>
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
