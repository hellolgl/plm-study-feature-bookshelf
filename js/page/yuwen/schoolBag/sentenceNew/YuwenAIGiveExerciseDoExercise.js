import React, { useState, useEffect } from "react";

import {
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    View,
    StyleSheet,
    Text,
    DeviceEventEmitter
} from "react-native";
import { useSelector } from "react-redux";
import { borderRadius_tool, pxToDp, size_tool } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationUtil";
// import Pinyin from "./components/pinyin";
import Words from "./Words";
// import Sentence from "./components/sentence";
// import Reading from "./components/reading";
import axios from "../../../../util/http/axios";
import MyPie from "../../../../component/myChart/my";
import api from "../../../../util/http/api";
import { appFont, appStyle } from "../../../../theme";


const skill_arr = [
    {
        label: '推理能力',
        total_score: 0,
    },
    {
        label: '应用能力',
        total_score: 0,
    },
    {
        label: '理解能力',
        total_score: 0,
    },
    {
        label: '分析能力',
        total_score: 0,
    }
]
const QuickDoExercise = (props) => {
    const { currentUserInfo } = useSelector((state) => state.toJS().userInfo);
    const { checkGrade, checkTeam } = currentUserInfo;
    const [stepIndex, setstepIndex] = useState(checkGrade === "01" ? 0 : 1);
    const [answer_id, setanswer_id] = useState(0);
    const [p_id, setp_id] = useState(0);
    const [abilityInfo, setAbilityInfo] = useState({
        "推理能力": 0,
        "应用能力": 0,
        "理解能力": 0,
        "分析能力": 0

    });
    const typelist = ["pinyin_status", "word_status", "ab_status", "read_status"];
    const goBack = () => {
        NavigationUtil.goBack(props);
    };

    useEffect(() => {
        // getList()
    }, []);

    const getList = async () => {
        const res = await axios.get(api.intelligenceAiExercises, {
            params: {
                grade_code: checkGrade,
                term_code: checkTeam,
            },
        });
        if (res.data.err_code === 0) {
            const data = res.data.data;
            // abilityInfo.forEach(item => {
            //     if (data.hasOwnProperty(item.label)) {
            //         item.total_score = data[item.label];
            //     }
            // });

            setAbilityInfo(data.data)
        }
    };


    const next = () => {
        changeStatus(() => setstepIndex((e) => e + 1));
    };
    const finish = () => {
        changeStatus(goBack);
    };
    const changeStatus = async (postNext) => {
        let data = {
            answer_id,
        };
        data[typelist[stepIndex]] = "1";
        await axios.post(api.getQuickPinyin, data);
        // console.log("下一步", res.data);
        postNext();
    };
    const resetToLogin = () => {
        NavigationUtil.resetToLogin(props);
    };

    const getAbilityInfo = (data) => {

        setAbilityInfo(data)



    }
    // const domList = [
    //     <Pinyin
    //         p_id={p_id}
    //         next={next}
    //         finish={finish}
    //         resetToLogin={resetToLogin}
    //     />,
    //     <Words next={next} finish={finish} resetToLogin={resetToLogin} />,
    //     <Sentence next={next} finish={finish} />,
    //     <Reading {...props} finish={finish} />,
    // ];
    // console.log('abilityInfo111', abilityInfo)
    return (
        <ImageBackground
            source={require("../../../../images/chineseHomepage/sentence/sentenceBg.png")}
            style={[{ flex: 1 }]}
            resizeMode="cover"
        >
            <TouchableOpacity
                style={[
                    size_tool(120, 80),
                    {
                        position: "absolute",
                        top: pxToDp(Platform.OS === "ios" ? 100 : 40),
                        zIndex: 999,
                        left: pxToDp(40),
                    },
                ]}
                onPress={goBack}
            >
                <Image
                    style={[size_tool(120, 80)]}
                    source={require("../../../../images/chineseHomepage/pingyin/new/back.png")}
                />
            </TouchableOpacity>
            <View style={[{ flex: 1 }]}>
                <Words navigation={props.navigation} next={next} onAbilityInfo={(data) => { getAbilityInfo(data) }} finish={finish} resetToLogin={resetToLogin} />
            </View>
            <View
                style={styles.bottom_btn}
            >
                <View
                    style={styles.content}
                >
                    <View style={styles.left_bottom}>
                        {
                            Object.keys(abilityInfo).map((item, index) => {
                                return <View style={{
                                    ...appStyle.flexTopLine,
                                    paddingRight: pxToDp(27 * 2)
                                }}>
                                    <View style={[styles.circleWrap]}>
                                        <MyPie
                                            length={pxToDp(18)}
                                            width={72}
                                            percent={abilityInfo[item] / 100}
                                            color={
                                                abilityInfo[item] > 80
                                                    ? "#00CC88"
                                                    : abilityInfo[item] > 60
                                                        ? "#FFAA5C"
                                                        : "#FF6680"
                                            }
                                        />

                                    </View>
                                    <View>
                                        <Text style={{
                                            fontSize: pxToDp(28 * 2),
                                            color: '#4C4C59',
                                            textAlign: 'center'
                                        }}>{abilityInfo[item]}%</Text>
                                        <Text style={{
                                            fontSize: pxToDp(28),
                                            color: '#9595A6'
                                        }}>{item}</Text>
                                    </View>
                                </View>



                            })
                        }

                    </View>
                    <View style={styles.middle_bottom}>

                        <TouchableOpacity>
                            <View
                                style={[
                                    size_tool(78 * 2, 80),
                                    borderRadius_tool(200),
                                    {
                                        backgroundColor: "#E7E7F2",
                                        paddingBottom: pxToDp(8),
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        {
                                            flex: 1,
                                            backgroundColor: "#F5F5FA"
                                        },
                                        borderRadius_tool(200),
                                        appStyle.flexCenter,
                                        appStyle.flexTopLine
                                    ]}
                                >
                                    <Image style={{
                                        width: pxToDp(32),
                                        height: pxToDp(16 * 2),
                                        marginRight: pxToDp(8)
                                    }} source={require('../../../../images/MathUnitDiagnosis/skill_exercise.png')} />

                                    <Text
                                        style={[
                                            { fontSize: pxToDp(32), color: "#4C4C59" },
                                            appFont.fontFamily_jcyt_500,
                                        ]}
                                    >
                                        统计
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <View
                                style={[
                                    size_tool(78 * 2, 80),
                                    borderRadius_tool(200),
                                    {
                                        backgroundColor: "#E7E7F2",
                                        paddingBottom: pxToDp(8),
                                        marginLeft: pxToDp(40)
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        {
                                            flex: 1,
                                            backgroundColor: "#F5F5FA"
                                        },
                                        borderRadius_tool(200),
                                        appStyle.flexCenter,
                                        appStyle.flexTopLine
                                    ]}
                                >
                                    <Image style={styles.rule_skill} source={require('../../../../images/MathUnitDiagnosis/rule_skill.png')} />
                                    <Text
                                        style={[
                                            { fontSize: pxToDp(32), color: "#4C4C59" },
                                            appFont.fontFamily_jcyt_500,
                                        ]}
                                    >
                                        规则
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                    </View>


                </View>
                <TouchableOpacity onPress={() => {
                    DeviceEventEmitter.emit("nextTopaic");
                }} style={styles.topaicBtn}>
                    <View
                        style={{
                            flex: 1,
                            borderRadius: pxToDp(180),
                            backgroundColor: "#FF964A",
                            ...appStyle.flexCenter,
                        }}
                    >
                        <Text
                            style={[
                                { color: "#fff", fontSize: pxToDp(40) },
                                appFont.fontFamily_jcyt_700,
                            ]}
                        >
                            下一题
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};



export default QuickDoExercise;

const styles = StyleSheet.create({
    bottom_btn: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        height: pxToDp(206),
        backgroundColor: '#4C4C59',
        elevation: 10,
        zIndex: 10,
        borderTopLeftRadius: pxToDp(40),
        borderTopRightRadius: pxToDp(40),
    },
    content: {
        flex: 1,
        borderTopLeftRadius: pxToDp(40),
        borderTopRightRadius: pxToDp(40),
        backgroundColor: 'white',
        alignItems: 'center',
        // justifyContent: 'center',
        flexDirection: 'row',
        // padding: pxToDp(20),

    },
    circleWrap: {
        backgroundColor: "transparent",
        borderWidth: pxToDp(4),
        borderColor: "#8B8BA2",
        justifyContent: "center",
        alignItems: "center",
        width: pxToDp(84),
        height: pxToDp(84),
        borderRadius: pxToDp(44),
        marginBottom: pxToDp(14),
        marginTop: pxToDp(20),
        marginRight: pxToDp(20),

    },
    left_bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: pxToDp(80)
    },
    middle_bottom: {
        flexDirection: 'row',
        marginLeft: pxToDp(20)
    },
    topaicBtn: {
        ...size_tool(180),
        borderRadius: pxToDp(180),
        backgroundColor: "#EF7B38",
        position: "absolute",
        bottom: pxToDp(16),
        right: pxToDp(140),
        paddingBottom: pxToDp(8),
    },
});
