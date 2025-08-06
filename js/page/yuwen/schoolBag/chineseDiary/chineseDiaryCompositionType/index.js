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
import { pxToDp, padding_tool, size_tool, borderRadius_tool, fontFamilyRestoreMargin } from "../../../../../util/tools";
import { appStyle,appFont } from "../../../../../theme";
import * as actionCreators from "../../../../../action/userInfo/index";

// import Svg,{ ForeignObject } from 'react-native-svg';
class ChineseSchoolHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            nowIndex: 0,
            unitList: [],
            titleTxt: '',
            bgList: [
                {
                    noCheckbg: require('../../../../../images/chineseHomepage/writeType1.png'),
                    Checkbg: require('../../../../../images/chineseHomepage/writeType11.png'),
                    textColor: '#4494FD',
                },
                {
                    noCheckbg: require('../../../../../images/chineseHomepage/writeType2.png'),
                    Checkbg: require('../../../../../images/chineseHomepage/writeType22.png'),
                    textColor: '#CC7D24',
                },
                {
                    noCheckbg: require('../../../../../images/chineseHomepage/writeType3.png'),
                    Checkbg: require('../../../../../images/chineseHomepage/writeType33.png'),
                    textColor: '#8E55FB',
                },
                {
                    noCheckbg: require('../../../../../images/chineseHomepage/writeType4.png'),
                    Checkbg: require('../../../../../images/chineseHomepage/writeType44.png'),
                    textColor: '#34D789',
                },
            ],
            bigTypelist: [],
            littleTypelist: []
        };
    }

    static navigationOptions = {
        // title:'答题'
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };


    componentDidMount() {
        this.getlist()
    }
    getlist() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.class_info = userInfoJs.class_code;
        data.term_code = userInfoJs.checkTeam;
        data.student_code = userInfoJs.id;
        data.subject = "01";
        axios.get(api.getCompositionMyCreaterType, { params: data }).then((res) => {
            if (res.data?.err_code === 0) {
                let titleTxt = userInfoJs.grade + userInfoJs.term

                this.setState({
                    bigTypelist: res.data.data,
                    littleTypelist: res.data.data.length > 0 ? res.data.data[0].children : [],
                    titleTxt
                })
            }
        });
    }
    gotoList = (item) => {
        const { nowIndex, bigTypelist } = this.state;
        const { userInfo } = this.props;
        let info = userInfo.toJS();
        info.c_id = item.c_id
        this.props.setUser(info);
        NavigationUtil.toChineseDiaryCompositionList({
            ...this.props,
            data: {
                ...item,
                littlename: bigTypelist[nowIndex].name
            }
        })
    }
    checkBig = (index, item) => {
        this.setState({
            littleTypelist: item.children,
            nowIndex: index
        })
    }

    render() {
        const { nowIndex, littleTypelist, bigTypelist, titleTxt, bgList } = this.state;
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
                        <Text style={[{ fontSize: pxToDp(36), color: '#fff', paddingTop: pxToDp(20) },appFont.fontFamily_syst]}>写作-{titleTxt}</Text>
                    </ImageBackground>
                    <Text style={[size_tool(80)]}></Text>
                </View>
                {bigTypelist.length > 0 ? <View style={[appStyle.flexTopLine, padding_tool(0, 40, 40, 40), { flex: 1 }]}>
                    <View style={[, padding_tool(29), borderRadius_tool(32), appStyle.flexCenter, { backgroundColor: '#fff', width: pxToDp(288), height: '100%' }]}>
                        <ScrollView >
                            {
                                bigTypelist.map((item, index) => {
                                    return <TouchableOpacity
                                        style={{ marginBottom: pxToDp(24) }}
                                        key={index}
                                        onPress={this.checkBig.bind(this, index, item)}
                                    >
                                        <ImageBackground
                                            source={nowIndex === index ? bgList[index % 4].Checkbg : bgList[index % 4].noCheckbg}
                                            style={[size_tool(228, 186), padding_tool(19, 23, 19, 23)]}
                                        >
                                            <Text style={[{
                                                color: bgList[index % 4].textColor,
                                                fontSize: pxToDp(50),
                                                fontFamily: Platform.OS === 'ios' ? 'Muyao-Softbrush' : 'Muyao-Softbrush-2',
                                            }]}>{item.name}</Text>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                })
                            }

                        </ScrollView>
                    </View>
                    <View
                        style={[padding_tool(0, 0, 0, 40), { flex: 1, height: '100%', }]}
                    >
                        <ScrollView style={[{ flex: 1 }]}>
                            <View
                                style={[appStyle.flexTopLine, appStyle.flexJusBetween, appStyle.flexLineWrap, padding_tool(0, 0, 0, 40),]}
                            >

                                {
                                    littleTypelist.map((item, index) => {
                                        return <View
                                            style={[
                                                appStyle.flexJusBetween,
                                                size_tool(776, 300),
                                                // padding_tool(55, 32, 55, 32),
                                                {
                                                    backgroundColor: '#fff',
                                                    marginBottom: pxToDp(40),
                                                    borderRadius: pxToDp(32),
                                                    borderWidth: pxToDp(10),
                                                    borderColor: '#D1E5FF'
                                                }]}
                                            key={index}
                                        >
                                            <View style={[padding_tool(20)]}>
                                                <Text style={[{
                                                    fontSize: pxToDp(40),
                                                    marginBottom: pxToDp(20)
                                                },appFont.fontFamily_syst,fontFamilyRestoreMargin()]}>题材：{item.name}</Text>
                                                <Text style={[{ fontSize: pxToDp(32), color: '#aaa' },appFont.fontFamily_syst,fontFamilyRestoreMargin()]}>选择一个题材进入查看创作记录。</Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={this.gotoList.bind(this, item)}
                                                style={[
                                                    appStyle.flexLine,
                                                    // borderRadius_tool(32),
                                                    padding_tool(0, 40, 0, 40),
                                                    {
                                                        backgroundColor: '#D1E5FF',
                                                        borderRadius: pxToDp(16),
                                                        height: pxToDp(100),
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center'
                                                    }
                                                ]}
                                            >
                                                <Text style={[{ fontSize: pxToDp(36), color: "#4494FD", marginRight: pxToDp(10), lineHeight: pxToDp(100) },appFont.fontFamily_syst,fontFamilyRestoreMargin('','',Platform.OS === 'android'?{marginTop:pxToDp(10)}:null)]}>查看我的思维导图</Text>
                                                <Text style={{ fontSize: pxToDp(40), color: "#4494FD", fontWeight: 'bold', lineHeight: pxToDp(100) }}>→</Text>
                                            </TouchableOpacity>
                                        </View>
                                    })
                                }

                            </View>

                        </ScrollView>

                    </View>
                </View>
                    : <View>
                        <Text style={[{ fontSize: pxToDp(40), fontWeight: 'bold' }]}>暂无答题记录！</Text>
                    </View>
                }
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
