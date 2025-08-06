import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Platform,
    Modal
} from "react-native";
import axios from "../../../../../../util/http/axios";
import api from "../../../../../../util/http/api";
import NavigationUtil from "../../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { pxToDp, padding_tool, size_tool, fontFamilyRestoreMargin } from "../../../../../../util/tools";
import { appFont, appStyle } from "../../../../../../theme";
import VideoPlayer from "../../../../../math/bag/EasyCalculation/VideoPlayer";

// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            video: '',
            videoVisible: false,
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
        console.log('res key', this.props.navigation.state.key)
    }

    getlist() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.c_id = userInfoJs.c_id
        console.log("传参", this.props.navigation.state.params.data)
        axios.get(api.getChineseCompositionArticleTitleList, { params: data }).then((res) => {
            console.log("res", res.data.data)
            if (res.data?.err_code === 0) {
                this.setState({
                    list: res.data.data
                })
            }
        });
    }
    toArticle = (item) => {
        NavigationUtil.toChineseCompisitionModelArticle({
            ...this.props,
            data: {
                ... this.props.navigation.state.params.data,
                ...item,
            }
        })
    }
    toRecord = (item) => {
        NavigationUtil.toChineseCompisitionModelRecord({
            ...this.props,
            data: {
                ... this.props.navigation.state.params.data,
                ...item,
            }
        })
    }
    tolookVideo = (item) => {
        this.setState({
            video: item.video,
            videoVisible: true
        })
    }
    hideVideoShow = () => {
        this.setState({
            video: '',
            videoVisible: false
        })
    }
    render() {
        const { list, video, videoVisible } = this.state;
        return (
            <ImageBackground
                style={styles.wrap}
                source={require('../../../../../../images/chineseHomepage/flowBigBg.png')}
            >
                <View style={[appStyle.flexLine, padding_tool(40, 64, 0, 64), { width: '100%', marginBottom: pxToDp(24) }]}>
                    {/* header */}
                    <TouchableOpacity onPress={this.goBack}>
                        <Image
                            source={require('../../../../../../images/chineseHomepage/flowGoback.png')}
                            style={[size_tool(144, 48)]}
                        />
                    </TouchableOpacity>
                </View>
                <View style={[{ flex: 1 }, appStyle.flexCenter]}>
                    <ImageBackground
                        source={require('../../../../../../images/chineseHomepage/chineseCompositionBg.png')}
                        style={[padding_tool(64, 0, 74, 120), size_tool(1924, 921)]}>
                        <ScrollView>
                            <View style={[appStyle.flexTopLine, appStyle.flexLineWrap,]}>
                                {
                                    list.map((item, index) => {
                                        return <View style={[{ width: pxToDp(816), marginRight: pxToDp(64) }, appStyle.flexAliCenter]} key={index}>
                                            <ImageBackground
                                                source={require('../../../../../../images/chineseHomepage/chineseCompositionArticleTitle.png')}
                                                style={[size_tool(435, 100), appStyle.flexCenter, { paddingBottom: pxToDp(20), marginBottom: pxToDp(24) }]}
                                            >
                                                <Text style={[{ fontSize: pxToDp(40), color: '#fff' }, appFont.fontFamily_syst, fontFamilyRestoreMargin('',),]}>
                                                    {item.name}
                                                </Text>
                                            </ImageBackground>
                                            {
                                                item.articles.map((inItem, inIndex) => {
                                                    return <View key={inIndex} style={[padding_tool(10, 32, 10, 32), appStyle.flexLine, appStyle.flexJusBetween,
                                                    { backgroundColor: '#fff', borderRadius: pxToDp(16), marginBottom: pxToDp(24), minHeight: pxToDp(92), width: pxToDp(816) }]}>
                                                        <Text style={[appFont.fontFamily_syst, fontFamilyRestoreMargin('',), { fontSize: pxToDp(36), color: "#333" }]}>{inItem.article_name}</Text>
                                                        <View style={[appStyle.flexTopLine, appStyle.flexLineWrap, { width: pxToDp(330) }]}>
                                                            <TouchableOpacity
                                                                onPress={this.toArticle.bind(this, inItem)}
                                                                style={[size_tool(152, 60), appStyle.flexCenter, { backgroundColor: '#A86A33', borderRadius: pxToDp(16), marginRight: pxToDp(24), }]}>
                                                                <Text style={[{ fontSize: pxToDp(28), color: "#fff" }, appFont.fontFamily_syst, fontFamilyRestoreMargin('',),]}>范文练手</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                onPress={this.toRecord.bind(this, inItem)}
                                                                style={[size_tool(152, 60), appStyle.flexCenter, { backgroundColor: '#A86A33', borderRadius: pxToDp(16), }]}>
                                                                <Text style={[{ fontSize: pxToDp(28), color: "#fff" }, appFont.fontFamily_syst, fontFamilyRestoreMargin('',),]}>答题记录</Text>
                                                            </TouchableOpacity>
                                                            {inItem.video ? <TouchableOpacity
                                                                onPress={this.tolookVideo.bind(this, inItem)}
                                                                style={[size_tool(152, 60), appStyle.flexCenter, { backgroundColor: '#A86A33', borderRadius: pxToDp(16), marginTop: pxToDp(20) }]}>
                                                                <Text style={[{ fontSize: pxToDp(28), color: "#fff" }, appFont.fontFamily_syst, fontFamilyRestoreMargin('',),]}>观看视频</Text>
                                                            </TouchableOpacity> : null}
                                                        </View>
                                                    </View>
                                                })
                                            }
                                        </View>
                                    })
                                }

                            </View>
                        </ScrollView>
                        {videoVisible ? <Modal
                            supportedOrientations={['portrait', 'landscape']}
                            visible={true}>
                            <VideoPlayer hideVideoShow={this.hideVideoShow} fileUrl={video}
                            />
                        </Modal> : null}
                    </ImageBackground>
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
    text: {
        fontSize: pxToDp(40),
        color: '#fff',
        fontFamily: Platform.OS === 'ios' ? 'Muyao-Softbrush' : 'Muyao-Softbrush-2',
        marginBottom: pxToDp(20)
    },
    text1: {
        fontSize: pxToDp(40),
        color: "#FFB211",
        fontWeight: 'bold'
    },
    btn: {
        backgroundColor: '#A86A33',
        borderRadius: pxToDp(16),
        marginRight: pxToDp(24)
    },
    text2: {
        fontSize: pxToDp(28), color: '#fff'
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
