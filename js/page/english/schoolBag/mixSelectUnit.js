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
} from "../../../util/tools";
import { appStyle } from "../../../theme";
import NavigationUtil from "../../../navigator/NavigationUtil";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import UserInfo from "../../../component/userInfo";
import { connect } from "react-redux";
import DropdownSelect from "../../../component/DropdownSelect";
import FreeTag from "../../../component/FreeTag";
import * as actionCreators from "../../../action/purchase/index";
import * as purchaseCreators from "../../../action/purchase";
import BackBtn from "../../../component/math/BackBtn";

const classMap = {
    "01": "一年级",
    "02": "二年级",
    "03": "三年级",
    "04": "四年级",
    "05": "五年级",
    "06": "六年级",
};
const unitMap = {
    "01": "一单元",
    "02": "二单元",
    "03": "三单元",
    "04": "四单元",
    "05": "五单元",
    "06": "六单元",
    "07": "七单元",
    "08": "八单元",
    "09": "九单元",
    10: "十单元",
    11: "十一单元",
    12: "十二单元",
    13: "十三单元",
    14: "十四单元",
    15: "十五单元",
};
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
        };
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
            const { unit } = this.state;
            console.log("this.typeIndex111", this.typeIndex);
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
    render() {
        console.log("Mix & Match...");
        const { unitOptions } = this.state;
        const authority = this.props.authority

        return (
            <ImageBackground
                style={[styles.container]}
                source={require("../../../images/chineseHomepage/flowBigBg.png")}
            >
                <ImageBackground
                    style={styles.headerWrap}
                    source={require("../../../images/englishHomepage/mixSeleceUnitHeaderbg.png")}
                >
                    <BackBtn goBack={this.goBack} img={require('../../../images/childrenStudyCharacter/back_btn_1.png')}></BackBtn>
                    {/* <TouchableOpacity onPress={this.goBack.bind(this)}>
            <Image
              style={{ width: pxToDp(144), height: pxToDp(48) }}
              source={require("../../../images/chineseHomepage/flowGoback.png")}
            />
          </TouchableOpacity> */}
                    <Text style={styles.title}>Mix&Match</Text>
                </ImageBackground>
                {Platform.OS === "ios" ? (
                    <View style={[{ marginTop: pxToDp(200) }]}></View>
                ) : (
                    <></>
                )}
                <View style={[styles.mainWrap, padding_tool(53, 100, 13, 100)]}>
                    {unitOptions.map((item, index) => {
                        return (
                            <ImageBackground
                                source={require("../../../images/englishHomepage/mixSlecetItem.png")}
                                style={[styles.itemWrap, padding_tool(31, 90, 85, 90)]}
                                key={index}
                            >
                                {!authority && index === 0 ? (
                                    <FreeTag
                                        txt="Free"
                                        style={{
                                            position: "absolute",
                                            top: pxToDp(0),
                                            right: pxToDp(20),
                                            zIndex: 99,
                                        }}
                                    />
                                ) : null}
                                <Text style={styles.unitTitle}>
                                    Unit {Number(item.unit_code)}
                                </Text>
                                <Text style={styles.itemMain}>{item.unit_name}</Text>
                                <TouchableOpacity
                                    onPress={this.toWordAccumulation.bind(
                                        this,
                                        item,
                                        authority || index === 0
                                    )}
                                >
                                    <Image
                                        source={require("../../../images/englishHomepage/mixSelectItemGo.png")}
                                        style={styles.itemImage}
                                    />
                                </TouchableOpacity>
                            </ImageBackground>
                        );
                    })}
                </View>
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
        // flexDirection: "row",
        // justifyContent: "space-between",
        // alignItems: "center",
        paddingLeft: pxToDp(65),
        paddingRight: pxToDp(65),
        ...appStyle.flexCenter
    },
    title: {
        fontSize: pxToDp(48),
        color: "#fff",
        fontWeight: "bold",
    },
    mainWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },
    itemWrap: {
        width: pxToDp(400),
        height: pxToDp(400),
        marginBottom: pxToDp(40),
        alignItems: "center",
        justifyContent: "space-between",
    },
    itemImage: {
        width: pxToDp(126),
        height: pxToDp(58),
    },
    unitTitle: {
        fontSize: pxToDp(32),
        color: "#D2740D",
        fontWeight: "bold",
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
        setModules(data) {
            dispatch(purchaseCreators.setModules(data));
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(ChooseUnit);
// export default SelectSubject
