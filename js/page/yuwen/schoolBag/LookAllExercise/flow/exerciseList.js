import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,

} from "react-native";
import { connect } from 'react-redux';
import axios from " ../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import {
    size_tool,
    pxToDp,
    padding_tool,
    borderRadius_tool,
} from "../../../../../util/tools";
import Header from '../../../../../component/Header'
import RichShowView from "../../../../../component/chinese/newRichShowView";
import { appStyle } from "../../../../../theme";



class FlowWrongExerciseList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            canvasWidth: 0,
            canvasHeight: 0,
            topaicNum: 0,
            //题目列表，后期可能改动
            fromServeCharacterList: [],
            isEnd: false,
            topaicIndex: 0,
            topicMap: new Map(),
            status: 0,
            gifUrl: "",
            checkIndex: 0,
            nowPage: 1,
            totalPage: 0,
            data: this.props.navigation.state.params.data,
        };
    }

    static navigationOptions = {
        // title:'答题'
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    toDoHomework = (exercise) => {
        NavigationUtil.toChineseLookAllFlowExerciseDetail(
            { ...this.props, data: { ...exercise, ... this.props.navigation.state.params.data } },
        );
    };
    componentDidMount() {
        this.getList(1)
    }
    getList = (page) => {
        const { data } = this.state
        console.log("列表咯", data)
        axios
            .get(`${api.getChineseAllFlowExerciseList}`, {
                params: {
                    origin: data.origin,
                    page,
                }
            })
            .then((res) => {
                let data = res.data.data;
                let totalpage = Math.ceil(Number(data.page_info.total / 10))
                console.log("list", data.data[1]);

                this.setState(() => ({
                    fromServeCharacterList: [...data.data],
                    topaicNum: data.data.length,
                    totalpage
                })
                );
            });
    }

    nextPage = (page) => {
        // 翻页
        if (page !== this.state.nowPage) {
            //     let page = nowPage + 1
            this.getList(page)
            this.setState({
                nowPage: page
            })
        }

    }
    renderPage = () => {
        const { nowPage, totalpage } = this.state
        let renturnobj = []
        for (let i = 1; i <= totalpage; i++) {
            renturnobj.push(<TouchableOpacity
                onPress={this.nextPage.bind(this, i)}
                style={[size_tool(64), appStyle.flexCenter, { backgroundColor: nowPage === i ? '#77D102' : '#fff', borderRadius: pxToDp(32), marginRight: pxToDp(pxToDp(32)) }]}>
                <Text style={{ fontSize: pxToDp(32), color: nowPage === i ? '#fff' : '#aaa' }}>{i}</Text>
            </TouchableOpacity>)
        }
        return renturnobj
    }
    render() {
        const { data } = this.state

        return (
            <View
                style={[
                    padding_tool(40, 48, 48, 48),
                    { flex: 1, backgroundColor: "#EEF3F5" },
                ]}
            >
                <Header goBack={() => { this.goBack() }}
                    text={data.learning_name}
                ></Header>
                <View style={[{ flex: 1 }]}>
                    <View style={[{ height: pxToDp(64), width: '100%', marginBottom: pxToDp(20) }, appStyle.flexCenter]}>
                        <ScrollView horizontal={true}>
                            {
                                this.renderPage()
                            }

                        </ScrollView>
                    </View>
                    <View style={{ width: '100%', flex: 1 }}>

                        <ScrollView
                            // onMomentumScrollEnd={() => this.nextPage()}
                            style={{ height: 540, paddingBottom: 80 }}>
                            {this.state.fromServeCharacterList.length > 0 ? (
                                this.state.fromServeCharacterList.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => this.toDoHomework(item)}
                                            style={[padding_tool(20, 48, 20, 48), {
                                                width: '100%',
                                                minHeight: pxToDp(50),
                                                backgroundColor: "#fff",
                                                marginBottom: pxToDp(20),
                                                flexDirection: 'row',
                                                borderRadius: pxToDp(16),
                                                justifyContent: 'space-between',
                                                alignItems: 'center',

                                            }]}
                                        >
                                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                                <View style={[size_tool(60), borderRadius_tool(30), appStyle.flexCenter, { backgroundColor: '#A86A33', marginRight: pxToDp(20) }]}>
                                                    <Text style={[{ fontSize: pxToDp(40), color: '#fff' }]}>{index + 1}</Text>
                                                </View>
                                                <RichShowView
                                                    divStyle={"font-size: x-large"}
                                                    pStyle={"font-size: x-large"}
                                                    spanStyle={"font-size: x-large"}
                                                    width={pxToDp(1100)}
                                                    value={item.private_exercise_stem ? item.private_exercise_stem : ' '}
                                                ></RichShowView>
                                            </View>

                                            <View style={[{
                                                width: pxToDp(176),
                                                height: pxToDp(60),
                                                backgroundColor: "#A86A33",
                                                borderRadius: pxToDp(32),
                                            }, appStyle.flexCenter]}>
                                                <Text style={{
                                                    color: '#fff',

                                                    lineHeight: pxToDp(60),
                                                    fontSize: pxToDp(28),
                                                }}>查看习题</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })
                            ) : (
                                <Text>{' '}</Text>
                            )}
                        </ScrollView>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    con: {
        flexDirection: "row",
    },
    left: {
        width: pxToDp(556),
        backgroundColor: "#fff",
        marginRight: pxToDp(48),
        borderRadius: pxToDp(32),
    },
    btn: {
        marginRight: 10,
        backgroundColor: "#CCCCCC",
    },
    details: {
        backgroundColor: "#fff",
        lineHeight: pxToDp(48),
        textAlign: "center",
        fontSize: pxToDp(24),
        borderRadius: pxToDp(32),
    },
    number: {
        color: "#A86A33",
        fontSize: pxToDp(32),
    },
    numberFinish: {
        color: "#fff",
        fontSize: pxToDp(32),
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    }
}

const mapDispathToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispathToProps)(FlowWrongExerciseList)
