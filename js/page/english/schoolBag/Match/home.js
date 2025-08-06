import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
    Platform,
} from "react-native";
import {
    margin_tool,
    size_tool,
    pxToDp,
    padding_tool,
    getGradeInfo,
    borderRadius_tool,
} from "../../../../util/tools";
import { appStyle, appFont } from "../../../../theme";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import UserInfo from "../../../../component/userInfo";
import { connect } from "react-redux";
import DropdownSelect from "../../../../component/DropdownSelect";
import FreeTag from "../../../../component/FreeTag";
import * as actionCreators from "../../../../action/purchase/index";
import CoinView from '../../../../component/coinView'
import * as actionCreatorsDailyTask from "../../../../action/dailyTask";

class ChooseUnit extends PureComponent {
    constructor(props) {
        super(props);
        this.unitCodeMap = new Map();
        this.typeIndex = props.navigation.state.params.data.index;
        this.checkTeam = props.userInfo.toJS().checkTeam;
        this.checkGrade = props.userInfo.toJS().checkGrade;
        this.origin = "";
        this.state = {
            unitOptions: [],
            unit: "Unit",
            showIndex: 0,
        };
    }
    componentWillUnmount() {
        this.props.getTaskData()
    }
    componentDidMount() {
        let obj = {
            grade_code: this.checkGrade,
            term_code: this.checkTeam,
            textbook: this.props.textBookCode,
        };
        axios.get(api.getUnitEn, { params: obj }).then((res) => {
            let unitOptions = [];
            let data = res.data.data ? res.data.data : [];
            unitOptions = [...data];
            unitOptions = unitOptions.filter((i) => {
                return i.unit_code !== "00";
            });
            this.setState({
                unitOptions,
            });
        });
    }

    toWordAccumulation(item, authority) {
        if (authority) {
            NavigationUtil.toMatchDoExercise({
                ...this.props,
                data: {
                    origin: item.origin,
                    unit: item.unit_code,
                },
            });
        } else {
            this.props.setVisible(true);
        }
    }
    goBack = () => {
        NavigationUtil.goBack(this.props);
    };
    lookthis = (index) =>
        this.setState({
            showIndex: index,
        });
    renderUnit = () => {
        const { unitOptions, showIndex } = this.state;
        const authority = this.props.authority;
        let renderdom = unitOptions.map((item, index) => {
            return (
                <TouchableOpacity
                    onPress={this.lookthis.bind(this, index)}
                    style={[
                        showIndex === index ? styles.itemWrapCheck : styles.itemWrap,
                        index % 2 === 0 && { marginBottom: pxToDp(40) },
                    ]}
                    key={index}
                >
                    {!authority && index === 0 ? (
                        <FreeTag
                            txt="Free"
                            style={{
                                position: "absolute",
                                top: pxToDp(-20),
                                right: pxToDp(-20),
                                zIndex: 99,
                            }}
                        />
                    ) : null}
                    <View
                        style={[
                            showIndex === index ? styles.itemInnerChecked : styles.itemInner,
                            appStyle.flexCenter,
                        ]}
                    >
                        <Text
                            style={
                                showIndex === index ? styles.unitTitleChecked : styles.unitTitle
                            }
                        >
                            Unit {Number(item.unit_code)}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        });
        return renderdom;
    };
    renderPanda = () => {
        const { showIndex, unitOptions } = this.state;
        if (unitOptions.length === 0) return;
        let { unit_name } = unitOptions[showIndex];
        const authority = this.props.authority;
        return (
            <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                <Image
                    source={require("../../../../images/english/mix/innerPanda.png")}
                    style={[size_tool(863, 583), { marginRight: pxToDp(84) }]}
                />
                <View
                    style={[
                        size_tool(950, 590),
                        appStyle.flexCenter,
                        { position: "relative" },
                    ]}
                >
                    <View
                        style={[
                            size_tool(950, 470),
                            borderRadius_tool(140),
                            padding_tool(0, 0, 10, 0),
                            { backgroundColor: "#E8E6ED" },
                        ]}
                    >
                        <View
                            style={[
                                {
                                    flex: 1,
                                    borderRadius: pxToDp(140),
                                    backgroundColor: "#fff",
                                    position: "relative",
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Image
                                source={require("../../../../images/english/mix/leftIcon.png")}
                                style={[
                                    size_tool(67),
                                    { position: "absolute", left: pxToDp(-55) },
                                ]}
                                resizeMode="contain"
                            />
                            <View
                                style={[
                                    size_tool(199, 93),
                                    borderRadius_tool(100),
                                    {
                                        backgroundColor: "#C185FF",
                                        position: "absolute",
                                        left: pxToDp(90),
                                        top: pxToDp(50),
                                    },
                                    appStyle.flexCenter,
                                    appStyle.flexTopLine,
                                ]}
                            >
                                <Text
                                    style={[
                                        appFont.fontFamily_jcyt_500,
                                        {
                                            fontSize: pxToDp(50),
                                            lineHeight: pxToDp(60),
                                            color: "#fff",
                                            marginRight: pxToDp(10),
                                        },
                                        Platform.OS === "android" && { marginBottom: pxToDp(-10) },
                                    ]}
                                >
                                    Unit
                                </Text>
                                <Text
                                    style={[
                                        appFont.fontFamily_jcyt_700,
                                        {
                                            fontSize: pxToDp(50),
                                            lineHeight: pxToDp(60),
                                            color: "#fff",
                                        },
                                        Platform.OS === "android" && { marginBottom: pxToDp(-10) },
                                    ]}
                                >
                                    {showIndex + 1}
                                </Text>
                            </View>
                            <Text
                                style={[
                                    {
                                        textAlign: "center",
                                        fontSize: pxToDp(86),
                                        lineHeight: pxToDp(96),
                                        color: "#445368",
                                    },
                                    appFont.fontFamily_jcyt_700,
                                    unit_name.length > 15 && {
                                        fontSize: pxToDp(70),
                                        lineHeight: pxToDp(80),
                                    },
                                ]}
                            >
                                {unit_name}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={this.toWordAccumulation.bind(
                            this,
                            unitOptions[showIndex],
                            authority || showIndex === 0
                        )}
                        style={[
                            size_tool(315, 125),
                            borderRadius_tool(100),
                            {
                                paddingBottom: pxToDp(7),
                                backgroundColor: "#FF731C",
                                position: "absolute",
                                bottom: pxToDp(0),
                            },
                        ]}
                    >
                        <View
                            style={[
                                {
                                    flex: 1,
                                    backgroundColor: "#FFA051",
                                    borderRadius: pxToDp(100),
                                },
                                appStyle.flexCenter,
                            ]}
                        >
                            <Text
                                style={[
                                    appFont.fontFamily_jcyt_700,
                                    { fontSize: pxToDp(50), color: "#fff" },
                                ]}
                            >
                                Start
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    render() {
        return (
            <ImageBackground
                style={[styles.container]}
                source={
                    Platform.OS === "android"
                        ? require("../../../../images/EN_Sentences/bg_1_a.png")
                        : require("../../../../images/EN_Sentences/bg_1_i.png")
                }
            >
                <View style={styles.headerWrap}>
                    <TouchableOpacity onPress={this.goBack} style={[size_tool(120, 80)]}>
                        <Image
                            source={require("../../../../images/chineseHomepage/pingyin/new/back.png")}
                            style={[size_tool(120, 80)]}
                        />
                    </TouchableOpacity>

                    <Text style={styles.title}>Mix&Match</Text>
                    <Text style={{ width: pxToDp(144), height: pxToDp(48) }}></Text>
                </View>
                {Platform.OS === "ios" ? (
                    <View style={[{ marginTop: pxToDp(200) }]}></View>
                ) : (
                    <></>
                )}
                <View style={[styles.mainWrap, padding_tool(20, 10, 13, 10)]}>
                    {this.renderPanda()}
                    <View
                        style={[
                            appStyle.flexTopLine,
                            {
                                height: pxToDp(310),
                                alignItems: "flex-end",
                                width: "100%",
                                paddingLeft: pxToDp(150),
                            },
                        ]}
                    >
                        {this.renderUnit()}
                    </View>
                </View>
                <CoinView></CoinView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerWrap: {
        width: pxToDp(2100),
        height: pxToDp(128),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: pxToDp(65),
        paddingRight: pxToDp(65),
        paddingTop: pxToDp(Platform.OS === "ios" ? 60 : 0),
    },
    title: {
        fontSize: pxToDp(58),
        color: "#445368",
        ...appFont.fontFamily_jcyt_700,
        lineHeight: pxToDp(70),
    },
    mainWrap: {
        // flexDirection: "row",
        // justifyContent: "space-between",
        // flexWrap: "wrap",
    },
    itemWrap: {
        width: pxToDp(175),
        height: pxToDp(175),
        marginRight: pxToDp(47),
        backgroundColor: "rgba(255,255,255,0.7)",
        borderRadius: pxToDp(100),
        padding: pxToDp(5),
    },
    itemWrapCheck: {
        width: pxToDp(210),
        height: pxToDp(210),
        marginRight: pxToDp(47),
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: pxToDp(200),
        padding: pxToDp(5),
    },
    itemInner: {
        flex: 1,
        borderRadius: pxToDp(100),
        backgroundColor: "rgba(198, 157, 229, 0.4)",
    },
    itemInnerChecked: {
        flex: 1,
        borderRadius: pxToDp(100),
        backgroundColor: "#FFA051",
    },
    unitTitle: {
        fontSize: pxToDp(42),
        color: "#445368",
        ...appFont.fontFamily_jcyt_700,
    },
    unitTitleChecked: {
        fontSize: pxToDp(50),
        color: "#fff",
        ...appFont.fontFamily_jcyt_700,
    },
    itemMain: {
        fontSize: pxToDp(32),
        color: "#D2740D",
        fontWeight: "bold",
        textAlign: "center",
        width: pxToDp(250),
    },
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        textBookCode: state.getIn(["bagEnglish", "textBookCode"]),
        lock_primary_school: state.getIn(["userInfo", "lock_primary_school"]),
        authority: state.getIn(["userInfo", "selestModuleAuthority"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setVisible(data) {
            dispatch(actionCreators.setVisible(data));
        },
        getTaskData(data) {
            dispatch(actionCreatorsDailyTask.getTaskData(data));
        }
    };
};

export default connect(mapStateToProps, mapDispathToProps)(ChooseUnit);
// export default SelectSubject
