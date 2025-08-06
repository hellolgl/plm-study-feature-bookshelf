import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import { appStyle, appFont } from "../theme";
import {
    margin_tool,
    size_tool,
    pxToDp,
    borderRadius_tool,
    padding_tool,
    fontFamilyRestoreMargin,
} from "../util/tools";
import { connect } from "react-redux";
import axios from '../util/http/axios'
import api from '../util/http/api'

class OtherUserInfo extends PureComponent {
    constructor(props) {
        super(props);
        // console.log(props.userInfo.toJS());
        this.state = {
            studentName: props.userInfo.toJS().name,
            signature: "超越",
            avatarSize: this.props.avatarSize,
            isRow: this.props.isRow, //横向排列还是纵向排列
            paiNum: 0,
            paiPercent: 0
        };
    }
    componentDidMount() {
        if (this.props.userInfo.toJS().subject === '03') {
            // 英语
            this.setState({
                paiNum: 878,
                paiPercent: 78,
            })
            return
        }
        // getPaiNum
        console.log(this.props.userInfo.toJS())
        axios.get(api.getPaiNum, { params: { subject: '01' } }).then(res => {
            console.log('useinfo pai', res)
            if (res && res.data.err_code === 0) {
                this.setState({
                    paiNum: res.data.data.score,
                    paiPercent: res.data.data.ranking,
                })
            }
        })
    }
    render() {
        const { studentName, signature, avatarSize, isRow, paiNum, paiPercent } = this.state;
        const { hiddenBg } = this.props
        return (
            <ImageBackground
                source={hiddenBg ? null : require('../images/usereinfoBg1.png')}
                style={[
                    {
                        width: pxToDp(572),
                        height: pxToDp(220)
                    },
                ]}
            >
                <View
                    style={[
                        {
                            marginBottom: pxToDp(32),
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                            paddingLeft: pxToDp(22)
                        },
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
                            source={require("../images/useinfoHeader.png")}
                            style={[size_tool(176)]}
                        ></Image>
                    </View>

                    <View style={[appStyle.flexJusBetween]}>
                        <View>
                            <Text
                                style={[
                                    { color: "#333", fontSize: pxToDp(48) },
                                    isRow ? styles.rowTextStyle : styles.columnTextStyle,
                                    appFont.fontFamily_syst, fontFamilyRestoreMargin()
                                ]}
                            >
                                {studentName}
                            </Text>
                        </View>
                        <View
                        >
                            <View
                                style={[
                                    appStyle.flexTopLine,
                                    appStyle.flexAliCenter,
                                    { marginRight: pxToDp(19) },
                                ]}
                            >
                                <Image
                                    source={require("../images/userinfoMoney.png")}
                                    style={[size_tool(64), { zIndex: 99 }]}
                                ></Image>
                                <ImageBackground
                                    source={require('../images/userinfoBg2.png')}
                                    style={[
                                        {
                                            minWidth: pxToDp(125),
                                            height: pxToDp(48),
                                            marginLeft: pxToDp(-10),
                                            justifyContent: 'center',
                                            paddingLeft: pxToDp(10),
                                            paddingRight: pxToDp(10)
                                        },
                                    ]}
                                >
                                    <Text style={[{ color: "#FFEB6D", fontSize: pxToDp(24), fontFamily: Platform.OS === 'ios' ? 'YouSheBiaoTiHei' : 'YouSheBiaoTiHei-2' }]}>
                                        {paiNum}分
                                    </Text>
                                </ImageBackground>
                            </View>

                        </View>
                        <Text style={{ color: '#92ACC4', fontSize: pxToDp(32), fontFamily: Platform.OS === 'ios' ? 'YouSheBiaoTiHei' : 'YouSheBiaoTiHei-2' }}>{paiPercent > 50 ? `${signature + paiPercent}%的小朋友` : '请继续加油哦！'}</Text>
                    </View>
                </View>
            </ImageBackground >

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

export default connect(mapStateToProps, mapDispathToProps)(OtherUserInfo);
