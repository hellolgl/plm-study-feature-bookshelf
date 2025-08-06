import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, ScrollView } from "react-native";
import { appStyle } from "../../../../../theme";
import { size_tool, pxToDp, borderRadius_tool } from "../../../../../util/tools";
import { connect } from "react-redux";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import api from "../../../../../util/http/api";
import axios from "../../../../../util/http/axios";

class Reading extends PureComponent {
    constructor(props) {
        super(props);
        console.log(props.userInfo.toJS());
        this.info = this.props.userInfo.toJS();
        this.grade = this.info.grade
        this.term = this.info.term
        this.state = {
            allList: [],
            lefList: [],
            rightList: [],
            currentIndex: 0
        };
    }
    componentDidMount() {
        this.getlist()
    }
    getlist = () => {
        const { currentIndex, } = this.state
        console.log("参数", this.props.navigation.state.params.data)
        axios
            .get(
                api.getChineseAllArticleList, {
                params: {
                    a_r_id: this.props.navigation.state.params.data.a_r_id,
                    grade_code: this.info.checkGrade,
                    term_code: this.info.checkTeam
                }
            }).then((res) => {
                if (res.data.err_code === 0) {
                    console.log("list===", res.data)
                    this.setState({
                        allList: res.data.data
                    })

                }
            })
    }
    goBack = () => {
        NavigationUtil.goBack(this.props);
    }
    clickType = (item, index) => {
        const { lefList, allList } = this.state
        let _lefList = JSON.parse(JSON.stringify(lefList))
        _lefList.forEach((childe) => {
            childe.isActive = false
            if (childe.name === item.name) childe.isActive = true
        })
        let fathetArr = allList.filter((child) => {
            return child.name === item.name
        })
        this.setState({
            currentIndex: index,
            lefList: _lefList,
            rightList: fathetArr[0].son_type
        })
    }
    clickDoExcersiz = (item, index) => {
        NavigationUtil.toChineseLookAllReadingExerciseList({
            ...this.props,
            data: {
                ...this.props.navigation.state.params.data,
                ...item
            }
        });
    }
    render() {
        const { allList, lefList, rightList } = this.state
        // console.log('______________________',allList,lefList,rightList)
        return (
            <ImageBackground style={{ width: '100%', height: '100%' }} source={require('../../../../../images/englishHomepage/checkUnitBg.png')}>
                <View style={[styles.header, appStyle.flexCenter]}>
                    <TouchableOpacity onPress={this.goBack} style={{ position: 'absolute', top: pxToDp(32), left: pxToDp(64) }}>
                        <Image style={{ width: pxToDp(80), height: pxToDp(80) }} source={require('../../../../../images/reding_back_icon.png')} resizeMode={'contain'}></Image>
                    </TouchableOpacity>
                    <ImageBackground style={[{ width: pxToDp(500), height: pxToDp(141) }, appStyle.flexCenter]} source={require('../../../../../images/reading_head.png')}>
                        <Text style={{ fontSize: pxToDp(36), color: "#fff", fontWeight: 'bold', marginTop: pxToDp(20) }}>阅读理解-{this.grade}{this.term}</Text>
                    </ImageBackground>
                </View>

                {allList.length > 0 ? <View style={[styles.content, appStyle.flexLine]}>
                    <ScrollView style={[styles.right]} contentContainerStyle={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
                        <View style={[appStyle.flexTopLine, appStyle.flexLineWrap, appStyle.flexJusBetween]}>
                            {allList && allList.length > 0 ? allList.map((item, index) => {
                                return <View style={[styles.rightItem, appStyle.flexJusBetween]} key={index}>
                                    <View style={[appStyle.flexLine]}>
                                        <Text style={[styles.numCircle]}>{index + 1}</Text>
                                        <Text style={[{ fontSize: pxToDp(40) }]}>{item.name}</Text>
                                    </View>
                                    <View style={[appStyle.flexTopLine, appStyle.flexEnd]}>
                                        <View style={[appStyle.flexLine]}>
                                            {item.status === '0' ? <Image source={require('../../../../../images/chineseHomepage/flowWrongLeft.png')}
                                                style={[size_tool(50), { marginRight: pxToDp(32) }]}
                                            /> : null}
                                            <TouchableOpacity style={[styles.btn1, styles.btn2, appStyle.flexCenter]} onPress={() => { this.clickDoExcersiz(item, index) }}>
                                                <Text style={[{ fontSize: pxToDp(28), color: '#fff' }]}>{
                                                    item.status === '0' ? '再练一次' : '开始答题'
                                                    // '开始答题'

                                                }</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            }) : null}
                        </View>

                    </ScrollView>
                </View> : null}

            </ImageBackground>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        height: pxToDp(141),
        position: 'relative',
        marginBottom: pxToDp(27)
    },
    content: {
        padding: pxToDp(40),
        paddingTop: 0,
        flex: 1,
    },
    left: {
        backgroundColor: '#FFF1DE',
        width: pxToDp(286),
        height: '100%',
        borderRadius: pxToDp(32),
        padding: pxToDp(32)
    },
    right: {
        flex: 1,
        height: '100%',
        marginLeft: pxToDp(40),
    },
    rightItem: {
        width: '48%',
        height: pxToDp(290),
        backgroundColor: '#fff',
        // marginRight: pxToDp(40),
        marginBottom: pxToDp(40),
        borderRadius: pxToDp(32),
        padding: pxToDp(32),
        paddingTop: pxToDp(55),
    },
    numCircle: {
        width: pxToDp(80),
        height: pxToDp(80),
        borderRadius: pxToDp(40),
        backgroundColor: '#FBF6E8',
        textAlign: 'center',
        lineHeight: pxToDp(80),
        fontSize: pxToDp(40),
        color: '#A86A33',
        marginRight: pxToDp(32)
    },
    btn1: {
        width: pxToDp(152),
        height: pxToDp(60),
        borderRadius: pxToDp(16),
        backgroundColor: '#E2E2E2'
    },
    btn2: {
        backgroundColor: '#A86A33',
        marginLeft: pxToDp(32)
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

export default connect(mapStateToProps, mapDispathToProps)(Reading);
