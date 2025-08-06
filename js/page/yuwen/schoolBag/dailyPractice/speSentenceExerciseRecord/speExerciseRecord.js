import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { connect } from "react-redux";
import axios from " ../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { size_tool, pxToDp, padding_tool, fontFamilyRestoreMargin } from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
import Header from '../../../../../component/Header'

class speWrongExerciseListSmart extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            //题目列表，后期可能改动
            fromServeCharacterList: [],
            nowPage: 1,
            haveNextPage: true,
            time: ''
        };
    }

    static navigationOptions = {
        // title:'答题'
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    toDoHomework = (exercise) => {
        const data = this.props.navigation.state.params.data;
        if (data.type === '1') {
            // 关联词运用和修辞手法
            NavigationUtil.toSpeSentenceDoWrongExerciseOne({
                ...this.props,
                data: { ...exercise, ...this.props },
            });
        } else {
            // 句型训练和文化积累
            NavigationUtil.toSpeSentenceDoWrongExerciseTwo({
                ...this.props,
                data: { ...exercise, ...this.props },
            });
        }

    };
    componentDidMount() {
        let type = this.props.navigation.state.params.data.gettype
        if (type === 'diary') {
            this.getDiaryWordList()
        } else {
            this.getList(1)
        }
        ;
    }
    getDiaryWordList() {
        console.log("学习日记 智能造句答题记录")
        const data = {};
        data.exercise_set_id = this.props.navigation.state.params.data.exercise_set_id;
        data.exercise_origin = this.props.navigation.state.params.data.exercise_origin
        axios.get(api.getChineseDiaryWordRecordList, { params: data }).then((res) => {
            let list = res.data.data;
            let time = list.length > 0 ? list[0].create_time : ''
            this.setState(() => ({
                fromServeCharacterList: list,
                time
            }));
        });
    }
    getList = (page) => {
        const data = this.props.navigation.state.params.data;
        const info = this.props.userInfo.toJS();
        // info.checkGrade  checkTeam
        let senobj = {
            grade_code: info.checkGrade,
            term_code: info.checkTeam,
            sub_modular: data.sub_modular,
            modular: data.modular,
            inspect_name: data.inspect_name ? data.inspect_name : '',
            tag1: data.name ? data.name : ''
        }
        axios.get(api.getChineseSpeSentenceSpeExeciseRecord, { params: { ...senobj } }).then((res) => {
            let list = res.data.data;
            console.log("list", list);

            this.setState(() => ({
                fromServeCharacterList: list,
                time: list.length > 0 ? list[0].create_time : ''
            }));
        });

    };

    render() {
        return (
            <View
                style={[
                    padding_tool(72, 48, 48, 48),
                    { flex: 1, backgroundColor: "#FFF1DE" },
                ]}
            >
                <Header text={''} goBack={() => { this.goBack() }}></Header>
                <View style={{ width: "100%", flex: 1 }}>
                    <Text style={[{ fontSize: pxToDp(32), color: '#999999', marginBottom: pxToDp(32) }]}>
                        历史记录&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.time}
                    </Text>
                    <View style={[{ flex: 1 }]}>

                        <ScrollView

                        >
                            {this.state.fromServeCharacterList.length > 0 ? (
                                this.state.fromServeCharacterList.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => this.toDoHomework(item)}
                                            style={[
                                                {
                                                    width: '100%',
                                                    minHeight: pxToDp(267),
                                                    backgroundColor: "#fff",
                                                    marginBottom: pxToDp(32),
                                                    // flexDirection: 'row',
                                                    borderRadius: 8,
                                                    justifyContent: 'space-between',
                                                    // alignItems: 'center',
                                                    paddingLeft: pxToDp(40),
                                                    paddingRight: pxToDp(40),
                                                    // paddingTop: 12,
                                                    paddingBottom: pxToDp(50),
                                                },
                                                appStyle.flexJusBetween,
                                                // appStyle.flexLine,
                                            ]}
                                        >
                                            <View style={{ flexDirection: "row", alignItems: 'center', height: pxToDp(104), borderBottomColor: "#EEF3F5", borderBottomWidth: pxToDp(2), marginBottom: pxToDp(24) }}>
                                                <Text style={[{ fontSize: pxToDp(40), color: "#999", marginRight: pxToDp(24) }, appFont.fontFamily_syst]}>第{index + 1}题</Text>
                                                {item.correct === '0' ? <Image
                                                    source={require('../../../../../images/speSentenceRight.png')}
                                                    style={{ width: pxToDp(128), height: pxToDp(48), }} />
                                                    :
                                                    null
                                                }
                                                {item.correct === '2' ? <Image
                                                    source={require('../../../../../images/speSentenceWrong.png')}
                                                    style={{ width: pxToDp(128), height: pxToDp(48), }} />
                                                    :
                                                    null
                                                }
                                                {item.correct === '1' ? <Image
                                                    source={require('../../../../../images/speSentenceNormal.png')}
                                                    style={{ width: pxToDp(128), height: pxToDp(48), }} />
                                                    :
                                                    null
                                                }
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', }}>
                                                <View style={{ flex: 1, }}>
                                                    <Text style={[{ fontSize: pxToDp(32), color: "#666666", marginBottom: pxToDp(24) }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>
                                                        {item.common_stem.indexOf('非顺序造句') !== -1 ? '' : item.common_stem}

                                                    </Text>
                                                    <View style={[appStyle.flexTopLine]}>
                                                        <Text style={[{ fontSize: pxToDp(32), color: "#333330" }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>
                                                            {item.sentence_stem.map((i) => { return i.content })}

                                                        </Text>
                                                    </View>

                                                </View>


                                                <View
                                                    style={{
                                                        width: pxToDp(176),
                                                        height: pxToDp(60),
                                                        backgroundColor: "#0179FF",
                                                        borderRadius: pxToDp(32),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Text style={[{
                                                        color: '#fff',
                                                        fontSize: pxToDp(28),
                                                    }, appFont.fontFamily_syst]}>
                                                        再练一次
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })
                            ) : null}
                        </ScrollView>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        height: pxToDp(110),
        borderRadius: 15,
        backgroundColor: "#FFFFFFFF",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: pxToDp(48),
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

export default connect(
    mapStateToProps,
    mapDispathToProps
)(speWrongExerciseListSmart);
