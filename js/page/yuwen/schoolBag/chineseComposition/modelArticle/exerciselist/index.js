import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Animated,
    Platform

} from "react-native";
import axios from "../../../../../../util/http/axios";
import api from "../../../../../../util/http/api";
import NavigationUtil from "../../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { pxToDp, padding_tool, size_tool, borderRadius_tool, margin_tool, fitHeight, fontFamilyRestoreMargin } from "../../../../../../util/tools";
import { appFont, appStyle } from "../../../../../../theme";
import ChineseMindMapping from '../../../../../../component/chinese/ChineseMindMapping'
import RichShowView from "../../../../../../component/chinese/newRichShowView";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            article: '',
            article_title: '',
            author: '',
            exercise: [],
            nowindex: 0,
            exercise_times_id: '',
            ar_map_id: 0,
            st_id: 0
        };
        this.audio = undefined;

    }

    static navigationOptions = {
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };


    componentDidMount() {
        this.getlist()
    }
    getlist = () => {
        //
        let obj = this.props.navigation.state.params.data
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        axios.get(api.getChineseCompositionArticleExerciseList, {
            params: {
                st_id: obj.st_id,
                m_id: obj.m_id
            }
        }).then((res) => {
            if (res.data?.err_code === 0) {
                console.log('回调', obj)
                this.setState({
                    exercise: res.data.data.exercise,
                })
            }
        });
    }
    toDoexercise = (item) => {
        NavigationUtil.toChineseCompisitionModelDoExercise({
            ...this.props,
            data: {
                ...item,
                ...this.props.navigation.state.params.data,
                isOne: true,
            }
        })
    }
    render() {
        const { exercise } = this.state
        const name = this.props.navigation.state.params.data.text
        return (
            <ImageBackground
                style={styles.wrap}
                source={require('../../../../../../images/chineseHomepage/sentence/sentenceBg.png')}
                resizeMode='cover'
            >
                <View style={[appStyle.flexLine, appStyle.flexJusBetween, padding_tool(0, 64, 0, 64), { width: '100%', height: pxToDp(128), }]}>
                    {/* header */}
                    <TouchableOpacity style={[size_tool(208, 80)]} onPress={this.goBack}>
                        <Image resizeMode='contain' style={[size_tool(120, 80)]} source={require('../../../../../../images/chineseHomepage/pingyin/new/back.png')} />

                    </TouchableOpacity>
                    <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(40), color: '#475266' }]} >{name}</Text>
                    <View style={[size_tool(208, 80)]}></View>
                </View>
                <View style={[{ flex: 1, width: '100%', marginBottom: pxToDp(60) }, padding_tool(40),]}>
                    <ScrollView>
                        <View style={[appStyle.flexAliCenter, padding_tool(0, 100, 0, 100)]}>

                            {
                                exercise.map((item, index) => {
                                    return <TouchableOpacity onPress={this.toDoexercise.bind(this, item)} key={index} style={[padding_tool(40), appStyle.flexTopLine, appStyle.flexAliCenter, appStyle.flexJusBetween,
                                    {
                                        backgroundColor: '#fff', borderRadius: pxToDp(24), marginBottom: pxToDp(40),
                                        width: '100%', minHeight: pxToDp(108)
                                    }]}>
                                        <RichShowView
                                            width={pxToDp(1100)}
                                            value={
                                                item.private_exercise_stem ? item.private_exercise_stem : item.stem ? item.stem : item.common_stem
                                            }
                                            size={5}
                                        />
                                        <FontAwesome name={'chevron-right'} size={20} style={{ color: '#A3A8B3' }} />
                                    </TouchableOpacity>
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
        alignItems: 'center',
        backgroundColor: "#F8CE8D"
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
    },
    statisticsWrap: {
        width: pxToDp(1080),
        // height: pxToDp(890),
        height: fitHeight(0.78, 0.78),
        position: "absolute",
        top: pxToDp(170),
        left: pxToDp(-980),
    },
    statisticsMain: {
        width: pxToDp(1000),
        // height: pxToDp(890),
        height: fitHeight(0.78, 0.78),
        borderTopRightRadius: pxToDp(32),
        borderBottomRightRadius: pxToDp(32),
        backgroundColor: '#fff',
        borderWidth: pxToDp(8),
        borderColor: '#F9AD63',
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(20),
        paddingBottom: pxToDp(20),
        paddingTop: pxToDp(40)
    },
    open: {
        position: "absolute",
        right: pxToDp(0),
        top: pxToDp(200),
        width: pxToDp(80),
        height: pxToDp(56),
        borderTopRightRadius: pxToDp(49),
        borderBottomRightRadius: pxToDp(49),
        paddingRight: pxToDp(8),
        paddingBottom: pxToDp(4),
        zIndex: 9999
    },
    close: {
        position: "absolute",
        right: pxToDp(0),
        top: pxToDp(280),
        width: pxToDp(80),
        height: pxToDp(56),
        borderTopRightRadius: pxToDp(49),
        borderBottomRightRadius: pxToDp(49),
        paddingRight: pxToDp(8),
        paddingBottom: pxToDp(4),
        zIndex: 9999
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
