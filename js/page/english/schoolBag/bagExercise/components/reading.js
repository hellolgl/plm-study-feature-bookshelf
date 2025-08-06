import React, { PureComponent } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { pxToDp } from "../../../../../util/tools";

import RichShowView from "../../../../../component/chinese/newRichShowView";
import Audio from "../../../../../util/audio/audio";
import url from "../../../../../util/url";
import { connect } from "react-redux";
class DoWrongExercise extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            exerciseInfo: {},
        };
    }

    componentDidMount() {
        this.setState({
            exerciseInfo: this.props.exercise,
        });
    }

    static getDerivedStateFromProps(props, state) {
        let tempState = { ...state };
        if (
            JSON.stringify(props.exercise) !== JSON.stringify(tempState.exerciseInfo)
        ) {
            if (props.exercise.exercise_type_private === "1") {
                tempState.exerciseInfo = props.exercise;
                tempState.renderOptionList = true;
                tempState.isKeyExercise = false;

                return tempState;
            } else {
                tempState.renderAudio = false;
                return tempState;
            }
        }
    }
    renderWriteTopaic = () => {
        const { exerciseInfo } = this.state;
        const data = exerciseInfo;
        let baseUrl =
            "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
            data?.public_stem_picture;

        let stem = data?.public_exercise_stem;
        // console.log("大题干", stem);
        // stem = stem
        //   .replaceAll("?!", "?")
        //   .replaceAll("!?", "?")
        //   .replaceAll("“", '"')
        //   .replaceAll("”", '"');
        return (
            // 不同题型组装题目
            <View style={[{}]}>
                <View style={[{ marginBottom: pxToDp(20) }]}>
                    {data.public_stem_audio ? (
                        <Audio
                            audioUri={`${url.baseURL}${data.public_stem_audio}`}
                            pausedBtnImg={require("../../../../../images/chineseHomepage/pingyin/new/pinyinPausedAudio.png")}
                            pausedBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                            playBtnImg={require("../../../../../images/chineseHomepage/pingyin/new/pinyinPlayAudio.png")}
                            playBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                        />
                    ) : null}
                </View>
                <View style={[{}]}>
                    {data?.public_exercise_stem ? (
                        <RichShowView
                            width={pxToDp(900)}
                            value={data?.public_exercise_stem}
                            size={4}
                            fontFamily={"jiangchengyuanti"}
                        ></RichShowView>
                    ) : null}
                    {data?.public_stem_picture ? (
                        <Image
                            style={{
                                width: pxToDp(400),
                                height: pxToDp(300),
                            }}
                            resizeMode="contain"
                            source={{ uri: baseUrl }}
                        ></Image>
                    ) : null}
                </View>
            </View>
        );
    };

    //获取canvas手写数据

    static getDerivedStateFromProps(props, state) {
        let tempState = { ...state };
        if (
            JSON.stringify(props.exercise) !== JSON.stringify(tempState.exerciseInfo)
        ) {
            if (props.exercise.exercise_type_private === "1") {
                tempState.renderAudio = true;
            } else {
                tempState.renderAudio = false;
            }
            tempState.exerciseInfo = props.exercise;
            tempState.renderOptionList = true;
            tempState.isKeyExercise = false;
            // console.log('题目2222222', props.exercise, tempState.exerciseInfo)

            return tempState;
        } else {
            tempState.renderAudio = false;
            return tempState;
        }
    }

    render() {
        return (
            <View style={styles.mainWrap}>
                <ScrollView
                    style={[{ width: "100%" }]}
                    ref={(view) => (this.scrollRef = view)}
                >
                    {this.renderWriteTopaic()}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainWrap: {
        width: pxToDp(600),
        flex: 1,
        borderRadius: pxToDp(60),
        paddingLeft: pxToDp(20),
        // paddingBottom: 24,
    },
    container: {
        flex: 1,
    },
    topaic: {
        flex: 1,
        justifyContent: "space-between",
    },
    topaicBtn: {
        alignItems: "flex-end",
        position: "absolute",
        right: pxToDp(20),
        bottom: pxToDp(20),
    },
    topaicText: {
        // width: 900,
        padding: pxToDp(24),
        flexDirection: "row",
        // justifyContent: 'space-between'
    },

    topaicWrite: {
        position: "absolute",
    },
    buttonGroup: {
        flexDirection: "row",
        // flex: 1
    },
    checkOptions: {
        width: pxToDp(52),
        height: pxToDp(52),
        borderRadius: pxToDp(26),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: pxToDp(2),
        borderColor: "#AAAAAA",
        marginRight: pxToDp(24),
    },
    checkedOption: {
        width: pxToDp(52),
        height: pxToDp(52),
        backgroundColor: "#FA603B",
        borderRadius: pxToDp(26),
        alignItems: "center",
        justifyContent: "center",
        marginRight: pxToDp(24),
    },
});

export default DoWrongExercise;
