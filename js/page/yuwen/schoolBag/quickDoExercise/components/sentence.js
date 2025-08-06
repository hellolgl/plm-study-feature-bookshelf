import React, { useEffect, useState } from "react";
import { View, Text, DeviceEventEmitter } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { appStyle } from "../../../../../theme";
import {
    pxToDp,
    padding_tool,
    size_tool,
    borderRadius_tool,
} from "../../../../../util/tools";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import AnswerStatisticsModal from "../../../../../component/chinese/sentence/staticsModal";
import Sentence from "../../sentenceNew/doExercise/sentence";
import { getRewardCoinLastTopic } from "../../../../../util/coinTools";
import * as actionCreatorsUserInfo from "../../../../../action/userInfo";
import Loading from "../../../../../component/loading";
import { Toast } from "antd-mobile-rn";

const SentenceWrap = (props) => {
    const { next, finish } = props;
    const { currentUserInfo } = useSelector((state) => state.toJS().userInfo);
    const dispatch = useDispatch();
    const { checkGrade, checkTeam, id } = currentUserInfo;
    const [statusList, setstatusList] = useState([]);
    const [list, setlist] = useState([]);
    const [listindex, setlistindex] = useState(0);
    const [correct, setcorrect] = useState(0);
    const [wrong, setwrong] = useState(0);
    const [answerStatisticsModalVisible, setanswerStatisticsModalVisible] =
        useState(false);
    const [showLoading, setshowLoading] = useState(true);

    let saveNum = 0;
    let eventListener = null;
    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        const res = await axios.get(api.chineseGetDailySentenceExercise, {
            params: {
                grade_code: checkGrade,
                term_code: checkTeam,
            },
        });
        if (res.data.err_code === 0) {
            setshowLoading(false);

            const data = res.data.data;
            let statuslist = [];
            data.forEach(() => {
                statuslist.push("");
            });

            setstatusList(statuslist);
            setlist(data);
        }
    };
    const nextOne = () => {
        if (listindex + 1 === list.length) {
            // 最后一题
            let statuslistnow = [...statusList];
            // let endTime = new Date().getTime();
            // let spend_time = parseInt((endTime - start_time) / 1000);
            let obj = {
                sentence_times_id: list[listindex].sentence_times_id,
                // spend_time,
            };
            axios
                .put(api.saveChinesSenTopicAll, obj)
                .then((res) => {
                    // console.log("套题保存成功");

                    setanswerStatisticsModalVisible(true);
                })
                .catch((err) => {
                    // 请求超时
                    // if (err.code === 'ECONNABORTED') {
                    Toast.info("请求超时，正在重试...", 1);
                    let num = saveNum;
                    saveNum = ++num;

                    if (saveNum < 3) {
                        nextOne();
                    }
                    // }
                });
        } else {
            let indexnow = listindex + 1;
            setlistindex(indexnow);
        }
    };
    const saveExercise = async (parmas, isKeyExercise) => {
        if (isKeyExercise) {
            // 要素题，下一题
            nextOne();
        } else {
            // 非要素题，要存
            let currentTopic = list[listindex];
            let obj = {
                sentence_times_id: currentTopic.sentence_times_id,
                se_id: currentTopic.se_id,
                // correct: ranking,
                // answer_times,
                student_id: id,
                knowledge_id: currentTopic.knowledge_id,
                grade_term: checkGrade + checkTeam,
                pName: currentTopic.inspect,
                exercise_time: currentTopic.exercise_time,
                is_push: currentTopic.is_push,
                name: currentTopic.tag1,
                tag1_id: currentTopic.iid,
                ...parmas,
                alias: "chinese_toDoExercise",
            };

            let url = "",
                senobj = {};
            url = api.saveChinesSenTopic;
            senobj = {
                ...obj,
                sub_modular: "1",
                modular: "1",
            };

            let listnow = JSON.parse(JSON.stringify(statusList));
            let correctnow = correct,
                wrongnow = wrong;
            listnow[listindex] = parmas.correct === "0" ? "right" : "wrong";
            parmas.correct === "0" ? correctnow++ : wrongnow++;
            setstatusList(listnow);
            setcorrect(correctnow);
            setwrong(wrongnow);

            axios
                .post(url, senobj)
                .then((res) => {
                    // console.log('保存成功', res.data)
                    if (res.data.err_code === 0) {
                        if (parmas.correct === "0") {
                            // 答对
                            if (listindex + 1 === list.length) {
                                getRewardCoinLastTopic().then((res) => {
                                    if (res.isReward) {
                                        // 展示奖励弹框,在动画完后在弹统计框
                                        eventListener = DeviceEventEmitter.addListener(
                                            "rewardCoinClose",
                                            () => {
                                                nextOne();
                                                eventListener && eventListener.remove();
                                            }
                                        );
                                    } else {
                                        nextOne();
                                    }
                                });
                            } else {
                                // this.props.getRewardCoin();
                                dispatch(actionCreatorsUserInfo.getRewardCoin());
                                nextOne();
                            }
                        }
                    }
                })
                .catch((err) => {
                    console.log("错误", err, err.code);
                    if (err.code === "ECONNABORTED") {
                        Toast.info("请求超时，请重试...", 1);
                    }
                });
        }
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
    return (
        <View style={[{ flex: 1 }]}>
            <View
                style={[
                    appStyle.flexTopLine,
                    appStyle.flexCenter,
                    { height: pxToDp(140) },
                ]}
            >
                {renderStatus()}
            </View>
            <View style={[{ flex: 1 }, padding_tool(0, 80, 20, 80)]}>
                {list.length > 0 ? (
                    <Sentence
                        exercise={list[listindex]}
                        saveExercise={saveExercise}
                        type={"diary"}
                        resetToLogin={() => {
                            // NavigationUtil.resetToLogin(this.props);
                        }}
                    />
                ) : null}
            </View>
            <AnswerStatisticsModal
                dialogVisible={answerStatisticsModalVisible}
                yesNumber={correct}
                noNumber={wrong}
                waitNumber={0}
                closeDialog={closeAnswerStatisticsModal}
                finishTxt={"智能句完成"}
                showNext={true}
                next={nextSteps}
            ></AnswerStatisticsModal>
            <Loading
                showLoading={showLoading}
                text={"正在生成题目，请耐心等待。。。"}
            />
        </View>
    );
};

export default SentenceWrap;
