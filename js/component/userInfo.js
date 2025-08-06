import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import { appStyle } from "../theme";
import { size_tool, pxToDp, borderRadius_tool } from "../util/tools";
import { connect } from "react-redux";
class UserInfo extends PureComponent {
    constructor(props) {
        super(props);
        // console.log(props.userInfo.toJS());
        this.state = {
            studentName: props.userInfo.toJS().name,
            signature: "好好学习，天天向上",
            avatarSize: this.props.avatarSize,
            isRow: this.props.isRow, //横向排列还是纵向排列
            isHiddenName: this.props.isHiddenName
        };
    }
    render() {
        const { studentName, signature, avatarSize, isRow, isHiddenName } = this.state;
        return (
            <View
                style={[
                    isRow ? appStyle.flexTopLine : appStyle.flexAliCenter,
                    { marginBottom: pxToDp(32) },
                ]}
            >
                <View
                    style={
                        (styles.avatarWrap,
                            [
                                size_tool(avatarSize),
                                {
                                    marginRight: isRow ? pxToDp(24) : 0,
                                    borderRadius: pxToDp(avatarSize / 2),
                                    overflow: isRow ? "visible" : "hidden"
                                },
                            ])
                    }
                >
                    <Image
                        source={require("../images/head_img.png")}
                        style={[size_tool(avatarSize)]}
                    ></Image>
                </View>

                {
                    isHiddenName ? null :
                        <View style={[appStyle.flexJusBetween]}>
                            <View>
                                <Text
                                    style={[
                                        { color: "#333", fontSize: pxToDp(48) },
                                        isRow ? styles.rowTextStyle : styles.columnTextStyle,
                                    ]}
                                >
                                    {studentName}
                                </Text>
                                <Text
                                    style={[
                                        { color: "#AAAAAA", fontSize: isRow ? pxToDp(22) : pxToDp(32) },
                                        isRow ? styles.rowTextStyle : styles.columnTextStyle,
                                    ]}
                                >
                                    {signature}
                                </Text>
                            </View>
                            <View
                                style={[{ display: isRow ? "flex" : "none" }, appStyle.flexTopLine]}
                            >
                                <View
                                    style={[
                                        appStyle.flexTopLine,
                                        appStyle.flexAliCenter,
                                        { marginRight: pxToDp(19) },
                                    ]}
                                >
                                    <Image
                                        source={require("../images/learning_coin.png")}
                                        style={[size_tool(47), { marginRight: pxToDp(8) }]}
                                    ></Image>
                                    <Text style={[{ color: "#FCAC14", fontSize: pxToDp(24) }]}>
                                        9999
                                    </Text>
                                </View>
                                <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                                    <Image
                                        source={require("../images/learning_coin.png")}
                                        style={[size_tool(47), { marginRight: pxToDp(8) }]}
                                    ></Image>
                                    <Text style={[{ color: "#FCAC14", fontSize: pxToDp(24) }]}>
                                        9999
                                    </Text>
                                </View>
                            </View>
                        </View>
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    columnTextStyle: {
        textAlign: "center",
    },
    rowTextStyle: {
        textAlign: "left",
    },
    avatarWrap: {},
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(UserInfo);
