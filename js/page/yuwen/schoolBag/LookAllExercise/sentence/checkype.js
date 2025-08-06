import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Animated,
} from "react-native";
import { appStyle } from "../../../../../theme";
import { size_tool, pxToDp, padding_tool, borderRadius_tool } from "../../../../../util/tools";
import axios from '../../../../../util/http/axios'
import api from '../../../../../util/http/api'
import Header from '../../../../../component/Header'
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { Toast } from "antd-mobile-rn";
import { ScrollView } from "react-native-gesture-handler";

class LookAllExerciseHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            littleList: [],
            checkindex: -1,
        };

    }
    componentDidMount() {
        // console.log('商品信息', info.chineseGoods.chinese_toLookAllFlowExercise)
        this.getList(0)

    }
    getList = (iid) => {
        const { } = this.state
        axios
            .get(`${api.getChineseSentenceAllType}`, {
                params: {
                    iid
                }
            })
            .then((res) => {
                if (res.data.err_code === 0) {
                    let data = res.data.data;
                    let listnow = [...this.state.list]
                    let littleListnow = [...this.state.littleList]
                    iid === 0 ? listnow = data : littleListnow = data
                    this.setState(() => ({
                        list: listnow,
                        littleList: littleListnow
                    })
                    );
                }

            });
    }
    goBack() {
        NavigationUtil.goBack(this.props);
    }
    toGet = (item, index) => {
        if (index !== this.state.checkindex) {
            this.getList(item.iid)
            this.setState({
                checkindex: index
            })
        }

    }
    toLook = (item) => {
        const { list, checkindex } = this.state
        if (list[checkindex].name === '智能造句' && item.pName === '关联词运用' || item.pName === '修辞手法') {
            Toast.info('该模块暂不支持查看所有题目！', 1)
        } else {
            NavigationUtil.toChineseLookAllSentenceExerciseList({
                ...this.props, data: {
                    ...item,
                    name: list[checkindex].name
                }
            })

        }
    }

    render() {
        const { list, checkindex, littleList } = this.state
        return (
            <View style={[padding_tool(48, 48, 48, 48), { flex: 1 }]}>
                <Header text={'智能句'} goBack={() => { this.goBack() }} />
                <View style={[{ height: pxToDp(120), marginBottom: pxToDp(40) }, appStyle.flexCenter]}>
                    <ScrollView horizontal={true}>
                        {
                            list.map((item, index) => {
                                return <TouchableOpacity
                                    key={index}
                                    style={[size_tool(300, 100),
                                    appStyle.flexCenter, borderRadius_tool(40),
                                    {
                                        backgroundColor: index === checkindex ? '#F8CE8D' : '#fff',
                                        marginRight: pxToDp(40)
                                    }]}
                                    onPress={this.toGet.bind(this, item, index)}
                                >
                                    <Text style={[{
                                        fontSize: pxToDp(40),
                                        color: index === checkindex ? '#6C3600' : '#333'
                                    }]}>{item.name}</Text>
                                </TouchableOpacity>
                            })
                        }
                    </ScrollView>

                </View>
                <View style={[{ flex: 1, backgroundColor: '#fff', padding: pxToDp(40), borderRadius: pxToDp(32) }]}>
                    <ScrollView>
                        <View style={[appStyle.flexTopLine, appStyle.flexLineWrap,]}>
                            {
                                littleList.map((item, index) => {
                                    return <TouchableOpacity
                                        key={index}
                                        style={[padding_tool(40),
                                        appStyle.flexCenter, borderRadius_tool(40),
                                        {
                                            backgroundColor: '#F8CE8D',
                                            marginRight: pxToDp(40),
                                            marginBottom: pxToDp(40),
                                        }]}
                                        onPress={this.toLook.bind(this, item)}
                                    >
                                        <Text style={[{
                                            fontSize: pxToDp(40),
                                            color: '#6C3600'
                                        }]}>{item.pName}</Text>
                                    </TouchableOpacity>
                                })
                            }
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "pink"
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

export default connect(mapStateToProps, mapDispathToProps)(LookAllExerciseHome);