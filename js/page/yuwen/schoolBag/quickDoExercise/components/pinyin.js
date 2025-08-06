import React, { useEffect, useState } from "react";

import { Platform, View, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import { appStyle } from "../../../../../theme";
import {
    pxToDp,
    padding_tool,
    size_tool,
    borderRadius_tool,
} from "../../../../../util/tools";
import MixExercise from "../../pinyin/doExercise/mix/DoExercise";
import CheckExercise from "../../pinyin/doExercise/checkExercise";
import SpeakExercise from "../../pinyin/doExercise/speakExercise";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import url from "../../../../../util/url";
import PlayAudio from "../../../../../util/audio/playAudio";
import AnswerStatisticsModal from "../../../../../component/chinese/sentence/staticsModal";
import Good from "../../../../../component/chinese/reading/good";
import Loading from "../../../../../component/loading";

const Pinyin = (props) => {
    const { p_id, next, finish, resetToLogin } = props;
    const { currentUserInfo } = useSelector((state) => state.toJS().userInfo);
    const { checkGrade, checkTeam } = currentUserInfo;
    const [statusList, setstatusList] = useState([]);
    const [exercise_times_id, setexercise_times_id] = useState(0);
    const [list, setlist] = useState([]);
    const [listindex, setlistindex] = useState(0);
    const [correct, setcorrect] = useState(0);
    const [wrong, setwrong] = useState(0);
    const [visibleGood, setvisibleGood] = useState(false);
    const [answerStatisticsModalVisible, setanswerStatisticsModalVisible] =
        useState(false);
    const [showLoading, setshowLoading] = useState(true);

    useEffect(() => {
        p_id && getList();
    }, [p_id]);

    const getList = async () => {
        const res = await axios.get(api.chinesePinyinGetKnowExercise, {
            params: {
                p_id,
                grade_term: checkGrade + checkTeam,
                support_languages: 0,
            },
        });
        if (res.data.err_code === 0) {
            setshowLoading(false);

            const { exercises, exercise_times_id } = res.data.data;
            let statuslist = [];

            exercises.forEach(() => {
                statuslist.push("");
            });
            setstatusList(statuslist);
            setexercise_times_id(exercise_times_id);
            setlist(exercises);
        }
    };

    const saveExercise = async (value) => {
        let index = listindex;

        // let { correct, wrong } = this.state;
        let correctnow = correct,
            wrongnow = wrong;
        axios
            .post(api.chinesePinyinSaveKnowExercise, {
                ...value,
                exercise_times_id: exercise_times_id,
                sign_out: index === list.length - 1 ? "0" : "1",
                grade_term: checkGrade + checkTeam,
            })
            .then((res) => {
                if (res.data.err_code === 0) {
                    ++index;
                    value.correct === 1 ? ++correctnow : ++wrongnow;
                    // console.log("回调456", index, this.state.list.length, index < this.state.list.length)
                    setcorrect(correctnow);
                    setwrong(wrongnow);
                    let listnow = [...statusList];
                    listnow[index - 1] = value.correct === 1 ? "right" : "wrong";
                    let flag = true;
                    if (value.correct === 1) {
                        flag = false;
                    }

                    // !flag ? url = this.failAudiopath : ''
                    !flag && PlayAudio.playSuccessSound(url.successAudiopath2);
                    setstatusList(listnow);
                    setvisibleGood(!flag);

                    if (index < list.length) {
                        setlistindex(flag ? index : index - 1);

                        if (!flag) {
                            setTimeout(() => {
                                setvisibleGood(false);
                                setlistindex(index);
                            }, 500);
                        }
                    } else {
                        if (!flag) {
                            setTimeout(() => {
                                setvisibleGood(false);
                                setanswerStatisticsModalVisible(true);
                            }, 500);
                        } else {
                            setanswerStatisticsModalVisible(true);
                        }
                    }
                    // 异步问题没解决，要封装一个promise
                }
            });
    };

    const closeAnswerStatisticsModal = () => {
        setanswerStatisticsModalVisible(false);
        finish();
    };
    const nextSteps = () => {
        setanswerStatisticsModalVisible(false);
        next();
    };

    const renderStatus = () => {
        const returnDom = statusList.map((item, index) => {
            return (
                <View
                    key={index}
                    style={[
                        size_tool(72),
                        appStyle.flexCenter,
                        borderRadius_tool(100),
                        {
                            borderWidth: pxToDp(6),
                            borderColor: index === listindex ? "#FF964A" : "transparent",
                            backgroundColor:
                                item === "right"
                                    ? "#16C792"
                                    : item === "wrong"
                                        ? "#F2645B"
                                        : "transparent",
                            marginRight: pxToDp(index === statusList.length - 1 ? 0 : 24),
                        },
                    ]}
                >
                    <Text
                        style={[
                            { fontSize: pxToDp(36), color: item ? "#fff" : "#475266" },
                            // fonts.fontFamily_jcyt_700,
                        ]}
                    >
                        {index + 1}
                    </Text>
                </View>
            );
        });

        return returnDom;
    };
    const renderExercise = () => {
        const type = list[listindex]?.exercise_type_private;
        // console.log("当前题目", list, list[listindex]);
        switch (type) {
            case "1":
                return (
                    <SpeakExercise
                        exercise={list[listindex]}
                        saveExercise={saveExercise}
                    />
                );
            case "2":
                return (
                    <CheckExercise
                        resetToLogin={resetToLogin}
                        exercise={list[listindex]}
                        saveExercise={saveExercise}
                    />
                );
            case "3":
                return (
                    <MixExercise exercise={list[listindex]} saveExercise={saveExercise} />
                );
            default:
                break;
        }
    };

    return (
        <View
            style={[
                { flex: 1 },
                padding_tool(Platform.OS === "ios" ? 60 : 0, 20, 20, 20),
            ]}
        >
            <View style={[styles.headerWrap]}>{renderStatus()}</View>
            <View style={[{ flex: 1 }, padding_tool(20, 40, 40, 40)]}>
                <View
                    style={[
                        {
                            flex: 1,
                            width: "100%",
                            backgroundColor: "#fff",
                            borderRadius: pxToDp(60),
                        },
                    ]}
                >
                    {renderExercise()}
                </View>
            </View>
            <AnswerStatisticsModal
                dialogVisible={answerStatisticsModalVisible}
                yesNumber={correct}
                noNumber={wrong}
                waitNumber={0}
                closeDialog={closeAnswerStatisticsModal}
                finishTxt={"拼音完成"}
                showNext={true}
                next={nextSteps}
            ></AnswerStatisticsModal>
            {visibleGood ? <Good /> : null}
            <Loading
                showLoading={showLoading}
                text={"正在生成题目，请耐心等待。。。"}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    headerWrap: {
        height: pxToDp(120),
        paddingLeft: pxToDp(200),
        paddingRight: pxToDp(200),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
    },
});
export default Pinyin;
