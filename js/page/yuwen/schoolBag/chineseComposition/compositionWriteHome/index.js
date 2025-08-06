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
    DeviceEventEmitter,
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import {
    pxToDp,
    padding_tool,
    size_tool,
    borderRadius_tool,
    getGradeInfo,
} from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
import ChineseCompositionExercise from "../../../../../component/chinese/chineseCompositionExercise";
import RichShowView from "../../../../../component/chinese/newRichShowView";
import * as purchaseCreators from "../../../../../action/purchase";
import * as compositonCreators from "../../../../../action/yuwen/composition";
import Audio from "../../../../../util/audio/audio";
import url from "../../../../../util/url";

// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            typelist: [],
            type: "1",
            es_id: 0,
            titlelist: [],
            typeDetail: {},
            exercise: {
                exercise: [],
            },
            c_id: this.props.navigation.state.params.data.c_id,
            littleIndex: 0,
            has_record: "",
            bigIndex: 0,
        };
    }

    static navigationOptions = {
        // title:'答题'
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    componentWillUnmount() {
        DeviceEventEmitter.emit("compostition");
        this.eventListenerRefreshPage.remove();
    }
    componentDidMount() {
        let data = this.props.navigation.state.params.data;
        console.log("data", data);
        //
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "compostitionHome",
            () => {
                this.getlist(this.state.bigIndex);
            }
        );

        this.getlist(0);
    }

    getlist = (index) => {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        // data.class_info = userInfoJs.class_code;
        // data.term_code = userInfoJs.checkTeam;
        data.c_id = this.props.navigation.state.params.data.c_id;
        console.log("传参", index);
        axios
            .get(api.getchineseCompositionTypeList, { params: data })
            .then((res) => {
                console.log("res======", res.data.data);
                if (res.data?.err_code === 0) {
                    this.setState({
                        typelist: res.data.data,
                        typeDetail: res.data.data[index] ? res.data.data[index] : {},
                        bigIndex: index,
                    });
                }
            });
    };
    checkType = (item, index) => {
        console.log(item.stem.es_id);
        this.setState({
            type: "2",
            typeDetail: item,
            littleIndex: 0,
            bigIndex: index,
        });
    };

    renderType = () => {
        const { typelist, typeDetail } = this.state;
        return (
            <ScrollView style={{ flex: 1, width: "100%", height: "100%" }}>
                <View style={[{ width: "100%" }]}>
                    {typelist.map((item, index) => {
                        return (
                            <TouchableOpacity
                                onPress={this.checkType.bind(this, item, index)}
                                key={index}
                                style={[
                                    size_tool(400, 108),

                                    {
                                        backgroundColor:
                                            typeDetail.p_id === item.p_id ? "#E2E7F0" : "transparent",
                                        borderRadius: pxToDp(40),
                                        marginBottom: pxToDp(40),
                                        paddingBottom: pxToDp(8),
                                        // width: '45%'
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        {
                                            flex: 1,
                                            backgroundColor:
                                                typeDetail.p_id === item.p_id ? "#fff" : "transparent",
                                            borderRadius: pxToDp(40),
                                        },
                                        padding_tool(0, 40, 0, 40),
                                        appStyle.flexJusCenter,
                                    ]}
                                >
                                    <Text
                                        ellipsizeMode="tail"
                                        numberOfLines={1}
                                        style={[
                                            { fontSize: pxToDp(40), color: "#475266" },
                                            appFont.fontFamily_syst,
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        );
    };

    toCreate = () => {
        // 做完习题
        const authority = this.props.authority
        if (authority) {
            let has_record =
                this.state.typeDetail.stem[this.state.littleIndex].has_record;
            this.props.setRecord(has_record);
            has_record === "1"
                ? NavigationUtil.toChineseCompositionRecord({
                    ...this.props,
                    data: {
                        ...this.props.navigation.state.params.data,
                        ...this.state.typeDetail,
                        stem: {
                            ...this.state.typeDetail.stem[this.state.littleIndex],
                        },
                        has_record,
                    },
                })
                : NavigationUtil.toCompositionWriteCheckTitle({
                    ...this.props,
                    data: {
                        ...this.props.navigation.state.params.data,
                        ...this.state.typeDetail,
                        stem: {
                            ...this.state.typeDetail.stem[this.state.littleIndex],
                        },
                        has_record,
                    },
                });
        } else {
            this.props.setVisible(true);
        }
    };

    lookThis = (index) => {
        this.setState({
            littleIndex: index,
        });
    };
    render() {
        const { typeDetail, littleIndex } = this.state;

        return (
            <ImageBackground
                style={styles.wrap}
                source={require("../../../../../images/chineseHomepage/sentence/sentenceBg.png")}
                resizeMode="cover"
            >
                <View
                    style={[
                        appStyle.flexLine,
                        appStyle.flexJusBetween,
                        padding_tool(0, 64, 0, 64),
                        { width: "100%", height: pxToDp(128) },
                    ]}
                >
                    {/* header */}
                    <TouchableOpacity onPress={this.goBack}>
                        <Image
                            source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
                            style={[size_tool(120, 80)]}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <Text
                        style={[
                            appFont.fontFamily_jcyt_700,
                            { fontSize: pxToDp(40), color: "#475266" },
                        ]}
                    >
                        作文创作
                    </Text>

                    <View
                        onPress={() => this.setState({ lookMsg: true })}
                        style={[size_tool(120, 80)]}
                    ></View>
                </View>
                <View
                    style={[
                        {
                            flex: 1,
                            width: "100%",
                        },
                        appStyle.flexTopLine,
                        padding_tool(0, 60, 60, 60),
                    ]}
                >
                    {/* 命题 */}

                    <View style={[{ width: pxToDp(400), marginRight: pxToDp(40) }]}>
                        {this.renderType()}
                    </View>
                    <View
                        style={[
                            {
                                flex: 1,
                                backgroundColor: "#fff",
                                borderRadius: pxToDp(40),
                                padding: pxToDp(40),
                            },
                        ]}
                    >
                        {typeDetail.stem?.length > 0 ? (
                            <View style={[padding_tool(0, 40, 0, 0)]}>
                                <ScrollView horizontal>
                                    {typeDetail.stem.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={this.lookThis.bind(this, index)}
                                                style={[
                                                    size_tool(200, 78),
                                                    borderRadius_tool(80),
                                                    index === littleIndex
                                                        ? { backgroundColor: "#475266" }
                                                        : {
                                                            borderWidth: pxToDp(4),
                                                            borderColor: "#CFD6E4",
                                                        },
                                                    { marginRight: pxToDp(40) },
                                                    appStyle.flexCenter,
                                                ]}
                                                key={index}
                                            >
                                                <Text
                                                    style={[
                                                        appFont.fontFamily_jcyt_700,
                                                        {
                                                            fontSize: pxToDp(32),
                                                            color: index === littleIndex ? "#fff" : "#475266",
                                                        },
                                                    ]}
                                                >
                                                    作文{index + 1}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        ) : null}

                        {typeDetail.stem?.length > 0 ? (
                            <View style={[{ flex: 1, paddingTop: pxToDp(20) }]}>
                                <ScrollView>
                                    <View style={[{ paddingBottom: pxToDp(100) }]}>
                                        {typeDetail.stem[littleIndex].stem_audio ? (
                                            <Audio
                                                audioUri={`${url.baseURL}${typeDetail.stem[littleIndex].stem_audio}`}
                                                pausedBtnImg={require("../../../../../images/audio/audioPlay.png")}
                                                pausedBtnStyle={{
                                                    width: pxToDp(198),
                                                    height: pxToDp(95),
                                                }}
                                                playBtnImg={require("../../../../../images/audio/audioPause.png")}
                                                playBtnStyle={{
                                                    width: pxToDp(198),
                                                    height: pxToDp(95),
                                                }}
                                            // rate={0.75}
                                            >
                                                <RichShowView
                                                    width={pxToDp(1400)}
                                                    value={typeDetail.stem[littleIndex]?.stem}
                                                ></RichShowView>
                                            </Audio>
                                        ) : (
                                            <RichShowView
                                                width={pxToDp(1400)}
                                                value={typeDetail.stem[littleIndex]?.stem}
                                            ></RichShowView>
                                        )}
                                    </View>
                                </ScrollView>
                                <TouchableOpacity
                                    onPress={this.toCreate}
                                    style={[
                                        size_tool(280, 120),
                                        borderRadius_tool(200),
                                        {
                                            backgroundColor: "#F07C39",
                                            paddingBottom: pxToDp(8),
                                            position: "absolute",
                                            right: pxToDp(0),
                                            bottom: pxToDp(0),
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            {
                                                flex: 1,
                                                backgroundColor: "#FF964A",
                                                borderRadius: pxToDp(200),
                                            },
                                            appStyle.flexCenter,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                appFont.fontFamily_jcyt_700,
                                                { fontSize: pxToDp(40), color: "#fff" },
                                            ]}
                                        >
                                            开始创作
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ) : null}
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? pxToDp(60) : 0,
    },
    text: {
        fontSize: pxToDp(40),
        color: "#fff",
        fontFamily: Platform.OS === "ios" ? "Muyao-Softbrush" : "Muyao-Softbrush-2",
        marginBottom: pxToDp(20),
    },
    text1: {
        fontSize: pxToDp(40),
        color: "#FFB211",
        fontWeight: "bold",
    },
    btn: {
        backgroundColor: "#A86A33",
        borderRadius: pxToDp(16),
        marginRight: pxToDp(24),
    },
    text2: {
        fontSize: pxToDp(28),
        color: "#fff",
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        lock_primary_school: state.getIn(["userInfo", "lock_primary_school"]),
        authority: state.getIn(["userInfo", "selestModuleAuthority"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setVisible(data) {
            dispatch(purchaseCreators.setVisible(data));
        },
        setRecord(data) {
            dispatch(compositonCreators.setRecord(data));
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
