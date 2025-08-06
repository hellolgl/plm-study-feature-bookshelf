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
    getGradeInfo,
    borderRadius_tool,
} from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
import * as actionCreators from "../../../../../action/userInfo/index";
import RichShowView from "../../../../../component/chinese/newRichShowView";
import FreeTag from "../../../../../component/FreeTag";
import * as purchaseCreators from "../../../../../action/purchase/index";
import * as compositonCreators from "../../../../../action/yuwen/composition";
import Audio from "../../../../../util/audio/audio";
import url from "../../../../../util/url";
import CoinView from '../../../../../component/coinView'
import * as actionCreatorsDailyTask from "../../../../../action/dailyTask";
// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            type: "1",
            es_id: 0,
            titlelist: [],
            typeDetail: {},
            exercise: {
                exercise: [],
            },
            c_id: 0,
            littleIndex: 0,
            has_record: "",
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
        this.props.getTaskData()
    }

    componentDidMount() {
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "compostitionHome",
            () => {
                this.getlist();
            }
        );
        this.getlist();
    }

    getlist() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        axios
            .get(api.getChineseUnitCompositionList, { params: data })
            .then((res) => {
                if (res.data.err_code === 0) {
                    console.log("数据======", res.data.data);
                    this.checkType(res.data.data[0]);
                    this.setState({
                        list: res.data.data,
                    });
                }
            });
    }

    checkType = (item) => {
        this.setState({
            type: "2",
            typeDetail: item,
            littleIndex: 0,
        });
    };
    startCreate = (authority) => {
        if (!authority) {
            this.props.setVisible(true);
            return;
        }

        const { userInfo } = this.props;
        const { typeDetail } = this.state;
        console.log("typeDetail", typeDetail);
        let info = userInfo.toJS();
        info.c_id = typeDetail.c_id;
        this.props.setUser(info);
        this.props.setUser(info);
        let has_record = typeDetail.has_record;
        this.props.setRecord(has_record);
        console.log("typeDetail", has_record);
        has_record === "1"
            ? NavigationUtil.toChineseCompositionRecord({
                ...this.props,
                data: {
                    ...this.props.navigation.state.params.data,
                    ...this.state.typeDetail,
                    stem: {
                        ...this.state.typeDetail,
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
                        ...this.state.typeDetail,
                    },
                    has_record,
                },
            });
    };
    renderType = (authority) => {
        const { list, typeDetail } = this.state;
        return (
            <ScrollView style={{ flex: 1, width: "100%", height: "100%" }}>
                <View style={[{ width: "100%" }]}>
                    {list.map((item, index) => {
                        return (
                            <TouchableOpacity
                                onPress={this.checkType.bind(this, item)}
                                key={index}
                                style={[
                                    size_tool(400, 108),

                                    {
                                        backgroundColor:
                                            typeDetail.unit_code === item.unit_code
                                                ? "#E2E7F0"
                                                : "transparent",
                                        borderRadius: pxToDp(40),
                                        marginBottom: pxToDp(40),
                                        paddingBottom: pxToDp(8),
                                        // width: '45%'
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        appStyle.flexTopLine,
                                        appStyle.flexAliCenter,
                                        {
                                            flex: 1,
                                            backgroundColor:
                                                typeDetail.unit_code === item.unit_code
                                                    ? "#fff"
                                                    : "transparent",
                                            borderRadius: pxToDp(40),
                                        },
                                        padding_tool(0, 40, 0, 40),
                                    ]}
                                >
                                    <Text
                                        ellipsizeMode="tail"
                                        numberOfLines={1}
                                        style={[
                                            {
                                                fontSize: pxToDp(40),
                                                color: "#475266",
                                                marginRight: pxToDp(20),
                                            },
                                            appFont.fontFamily_syst_bold,
                                        ]}
                                    >
                                        第{chineseNum[Number(item.unit_code) - 1]}单元
                                    </Text>
                                    {!authority && item.unit_code === "01" ? (
                                        <FreeTag haveAllRadius={true} />
                                    ) : null}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        );
    };
    render() {
        const { typeDetail, littleIndex } = this.state;

        const { list } = this.state;
        const authority = this.props.authority;
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
                        {this.renderType(authority)}
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
                            <View style={[{ flex: 1 }]}>
                                <ScrollView>
                                    <View style={[{ paddingBottom: pxToDp(120) }]}>
                                        {typeDetail.stem_audio ? (
                                            <Audio
                                                audioUri={`${url.baseURL}${typeDetail.stem_audio}`}
                                                pausedBtnImg={require("../../../../../images/english/abcs/titlePanda.png")}
                                                pausedBtnStyle={{
                                                    width: pxToDp(169),
                                                    height: pxToDp(152),
                                                }}
                                                playBtnImg={require("../../../../../images/english/abcs/titlePanda.png")}
                                                playBtnStyle={{
                                                    width: pxToDp(169),
                                                    height: pxToDp(152),
                                                }}
                                            // rate={0.75}
                                            >
                                                <RichShowView
                                                    width={pxToDp(1400)}
                                                    value={typeDetail.stem}
                                                ></RichShowView>
                                            </Audio>
                                        ) : (
                                            <RichShowView
                                                width={pxToDp(1400)}
                                                value={typeDetail.stem}
                                            ></RichShowView>
                                        )}
                                    </View>
                                </ScrollView>
                                <TouchableOpacity
                                    onPress={this.startCreate.bind(
                                        this,
                                        typeDetail.unit_code === "01" || authority
                                    )}
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
                <CoinView></CoinView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? pxToDp(40) : 0,
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
        setUser(data) {
            dispatch(actionCreators.setUserInfoNow(data));
        },
        setVisible(data) {
            dispatch(purchaseCreators.setVisible(data));
        },
        setRecord(data) {
            dispatch(compositonCreators.setRecord(data));
        },
        getTaskData(data) {
            dispatch(actionCreatorsDailyTask.getTaskData(data));
        }
    };
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
