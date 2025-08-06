import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
import { size_tool, pxToDp, padding_tool } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import SpeWrongExerciseWrapList from "./speWrongExercise/speWrongExerciseWrapList";
import { connect } from "react-redux";
import { appStyle, appFont } from "../../../../theme";
import FlowWrong from "./components/flow";
import ChangeType from "./components/changeType";
import SpeExercise from "./components/spe";
class chooseWrongExercise extends PureComponent {
    constructor(props) {
        super(props);
        this.lessonList = [];
        this.unitList = [];
        this.articalObj = {};
        const { userInfo } = props;
        const userInfoJs = userInfo.toJS();
        this.state = {
            pageType: "",
            textBook: "年级",
            textBookOptions: [],
            unit: "类型",
            checkTerCode: "0",
            isCheckType: false,
            checkGrade: "",
            titleTxt: userInfoJs.grade + userInfoJs.term,
            showType: false,
            typeName: "同步错题",
            headTitle: '语文同步错题'
        };
    }

    selectUnit = (item) => {
        this.setState({
            unit: item.label,
            checkTerCode: item.value,
        });
    };
    goBack = () => {
        NavigationUtil.goBack(this.props);
    };
    render() {
        let { showType, typeName, headTitle } = this.state;
        return (
            <ImageBackground
                style={[styles.container]}
                source={require("../../../../images/chineseHomepage/wrong/wrongBg.png")}
                resizeMode="stretch"
            >
                <View
                    style={[
                        appStyle.flexLine,
                        { justifyContent: "space-between" },
                        padding_tool(30, 80, 30, 32),
                    ]}
                >
                    <View style={[{ width: pxToDp(170) }]}>
                        <TouchableOpacity onPress={this.goBack}>
                            <Image
                                source={require("../../../../images/MathSyncDiagnosis/back_btn_1.png")}
                                style={[size_tool(120, 80)]}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.headerTitle]}>{headTitle}</Text>
                    <View>
                        <TouchableOpacity
                            onPress={() => this.setState({ showType: true })}
                            style={[styles.changeBtnWrap]}
                        >
                            <Text style={[styles.changeBtnTxt]}>切换错题集</Text>
                            <Image
                                source={require("../../../../images/chineseHomepage/wrong/changeIcon.png")}
                                style={[size_tool(20)]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[{ flex: 1 }]}>
                    {typeName === "同步错题" ? (
                        <FlowWrong navigation={this.props.navigation} />
                    ) : (
                        <SpeExercise navigation={this.props.navigation} />
                    )}
                </View>
                <ChangeType
                    show={showType}
                    close={() =>
                        this.setState({
                            showType: false,
                        })
                    }
                    label={'切换错题集'}
                    typeName={typeName}
                    check={(name, index) => {
                        const map = {
                            0: '语文同步错题',
                            1: '语文专项错题'
                        }
                        this.setState({
                            typeName: name,
                            showType: false,
                            headTitle: map[index]
                        })
                    }
                    }
                />
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF3F5",
    },
    headerTitle: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(48),
        color: "#475266",
        lineHeight: pxToDp(50),
    },
    changeBtnWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFB649",
        width: pxToDp(240),
        height: pxToDp(80),
        borderRadius: pxToDp(40),
        justifyContent: "center",
    },
    changeBtnTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(32),
        color: "#fff",
        marginRight: pxToDp(10),
    },
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispathToProps)(chooseWrongExercise);
