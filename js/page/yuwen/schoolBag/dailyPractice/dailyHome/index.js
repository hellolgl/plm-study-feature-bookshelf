import React, { Component, PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import { appStyle } from "../../../../../theme";
import { size_tool, pxToDp, padding_tool, borderRadius_tool } from "../../../../../util/tools";
import Bar from "../../../../../component/bar";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import UserInfo from "../../../../../component/userInfo";
import Header from '../../../../../component/Header'
import OtherUserInfo from "../../../../../component/otherUserinfo";
import QRCode from "react-native-qrcode-svg";
import axios from "../../../../../util/http/axios"

import api from "../../../../../util/http/api";
class DailyPracticeHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            data: this.props.navigation.state.params.data
        };
        this.duration = ["一个月", "两个月", "四个月(学期)"]

        this.subscribeTimesMap = {
            1: "一个月",
            2: "两个月",
            4: "四个月(学期)",
            0: '两次'
        }
        this.gradeMap = {
            "01": "一年级",
            "02": "二年级",
            "03": "三年级",
            "04": "四年级",
            "05": "五年级",
            "06": "六年级",
        }

        this.termMap = {
            "00": "上学期",
            "01": "下学期",
        }
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    }
    componentWillUnmount() {
        console.log('卸载页面', this.props)
        if (this.props && this.props.navigation && this.props.navigation.state.params.data.upload) {
            // NavigationUtil.goBack({ ...this.props, isGo: 'false' })
            this.props.navigation.state.params.data.upload()
        }
        // this.props.navigation.state.params.data?.upload()
    }
    componentDidMount() {

        const { data } = this.state;
        console.log('页面123', {
            product_id: data.id,
            multiple: data.lenth === 0 ? 1 : data.lenth,
            pay_source: 'native'
        })
        axios.post(api.getPayCode, {

            product_id: data.id,
            multiple: data.lenth === 0 ? 1 : data.lenth,
            pay_source: 'native'

        }).then((res) => {
            console.log('native res', res.data)
            this.setState({
                url: res.data.code_url
            })
        })
    }
    render() {
        const { url, data } = this.state;
        return (
            <View style={[appStyle.flexCenter, { backgroundColor: 'rgba(0,0,0,.5)', flex: 1 }]}>
                <View style={[size_tool(900, 836), borderRadius_tool(40), padding_tool(40), { backgroundColor: '#fff' }, appStyle.flexAliCenter, appStyle.flexJusBetween]}>
                    <View style={[appStyle.flexTopLine, appStyle.flexJusBetween, appStyle.flexAliCenter, { width: '100%' }]}>
                        <Text style={[{ fontSize: pxToDp(40), color: '#4C4C59', marginLeft: pxToDp(20) }]}>确认支付</Text>
                        <TouchableOpacity onPress={this.goBack} style={[borderRadius_tool(40), { backgroundColor: 'rgba(74,74,87,0.05)' }, size_tool(80), appStyle.flexCenter]}>
                            <Image source={require('../../../../../images/androidLogin/close.png')} style={[size_tool(60),]} />
                        </TouchableOpacity>
                    </View>
                    <View style={[appStyle.flexTopLine, appStyle.flexJusBetween, { width: '100%', paddingLeft: pxToDp(40) }]}>
                        <View>
                            <View style={[appStyle.flexTopLine, appStyle.flexAliEnd, { marginBottom: pxToDp(20) }]}>
                                <Text style={[styles.redfont]}>{data.showProductIapPrice}</Text>
                                <Text style={[styles.redfont, { fontSize: pxToDp(28), marginBottom: pxToDp(10) }]}>元</Text>
                            </View>
                            {data.lenth === 0 ? null : <Text style={[styles.littleFont]}>年级</Text>}
                            {data.lenth === 0 ? null : <Text style={[styles.bigfont]} >{this.gradeMap[data.selectGrade] + this.termMap[data.selectTerm]}</Text>}
                            <Text style={[styles.littleFont]}>商品</Text>
                            <Text style={[styles.bigfont]}>{data.selectProduct}</Text>
                            <Text style={[styles.littleFont]}>时长</Text>
                            <Text style={[styles.bigfont]}>{this.subscribeTimesMap[data.lenth]}</Text>
                        </View>
                        <View style={[size_tool(400, 460), borderRadius_tool(40), padding_tool(20), { backgroundColor: '#28CD60' }, appStyle.flexAliCenter]}>
                            <Text style={[{ fontSize: pxToDp(28), color: '#fff', marginBottom: pxToDp(20) }]}>微信扫码支付</Text>
                            <View style={[size_tool(360), borderRadius_tool(24), appStyle.flexCenter, { backgroundColor: '#fff' }]} >
                                {url ? <QRCode size={pxToDp(310)} value={url} /> : null}

                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={this.goBack}
                        style={[size_tool(400, 96), { backgroundColor: '#28CD60', borderRadius: pxToDp(80) }, appStyle.flexCenter]}>
                        <Text style={[{ fontSize: pxToDp(40), color: '#fff' }]}>已完成支付</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    redfont: {
        fontSize: pxToDp(60),
        color: '#FF4949',
    },
    bigfont: {
        fontSize: pxToDp(32),
        color: '#4C4C59',
        marginBottom: pxToDp(10)
    },
    littleFont: {
        color: '#4C4C59',
        fontSize: pxToDp(24),
        marginBottom: pxToDp(10),
        opacity: 0.6
    }
});
export default DailyPracticeHome;
