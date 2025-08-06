import React, { useEffect, useState } from "react";
import {
    Platform,
    View,
    StyleSheet,
    Text,
    DeviceEventEmitter,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { appStyle } from "../../../../theme";
import {
    pxToDp,
    padding_tool,
    size_tool,
    borderRadius_tool,
} from "../../../../util/tools";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import AnswerStatisticsModal from "../../../../component/chinese/sentence/staticsModal";
import Good from "../../../../component/chinese/reading/good";
import CheckExercise from "./checkExercise";
import * as actionCreatorsUserInfo from "../../../../action/userInfo";
import { getRewardCoinLastTopic } from "../../../../util/coinTools";
import Loading from "../../../../component/loading";
const Words = (props) => {
    const { next, finish, resetToLogin } = props;
    const { currentUserInfo, moduleCoin } = useSelector(
        (state) => state.toJS().userInfo
    );
    const dispatch = useDispatch();
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
    const [topaicNum, settopaicNum] = useState(0);
    const [showLoading, setshowLoading] = useState(true);
    let eventListener = null;

    useEffect(() => {
        getList()
    }, []);

    const getList = async () => {
        const res = await axios.get(api.intelligenceAiExercises, {
            params: {
                grade_code: checkGrade,
                term_code: checkTeam,
            },
        });
        if (res.data.err_code === 0) {
            setshowLoading(false)
            const data = res.data.data;
            props.onAbilityInfo(data.data)
            let arr = [];
            arr.push(data);
            setlist([...list, ...arr]);
            console.log('getList', [...list, ...arr])
            settopaicNum(arr.length);
        }
    };
    const getAnswerResult = () => {
        setanswerStatisticsModalVisible(true);
    };
    const saveExerciseDetail = async (exercise, answer) => {
        // 保存做题结果
        const fromServeCharacterList = list;
        const yesOrNo = exercise.correct === 2 ? 1 : 0;
        // console.log("jieguo", exercise);
        let isFinish = listindex + 1 == fromServeCharacterList.length;
        const data = {
            correction: yesOrNo, //批改对错，0 错误 1正确
            element_type: fromServeCharacterList[listindex].element_type,
            exercise_id: fromServeCharacterList[listindex].exercise_id,
            origin: fromServeCharacterList[listindex].origin,
        };
        let correctnow = correct,
            wrongnow = wrong;
        const res = await axios.post(api.intelligenceAiExercises, data);
        if (res.data.err_code === 0) {
            let listnow = [...fromServeCharacterList];
            listnow[listindex].colorFlag = yesOrNo ? 1 : 2;
            yesOrNo ? correctnow++ : wrongnow++;
            if (yesOrNo) {
                setvisibleGood(moduleCoin < 30 ? false : true);
                setTimeout(() => {
                    setvisibleGood(false);
                }, 500);
                dispatch(actionCreatorsUserInfo.getRewardCoin());
                // this.props.getRewardCoin()
            }

            setcorrect(correctnow);
            setwrong(wrongnow);
            setlist(listnow);
            setlistindex(listindex + 1)
            setTimeout(() => {
                setshowLoading(true)
                getList();
            }, 0);
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
        const returnDom = list.map((item, index) => {
            return index > listindex ? null : (
                <View
                    key={index}
                    style={[
                        styles.statusWrap,
                        {
                            borderColor: index === listindex ? "#FF964A" : "transparent",
                            backgroundColor:
                                item.colorFlag === 1
                                    ? "#16C792"
                                    : item.colorFlag === 2
                                        ? "#F2645B"
                                        : "transparent",
                            marginRight: pxToDp(index === statusList.length - 1 ? 0 : 24),
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusTxt,
                            {
                                color: item.colorFlag ? "#fff" : "#475266",
                            },
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
        return (
            <CheckExercise
                navigation={props.navigation}
                hideHelp={true}
                exercise={list[listindex]}
                nextExercise={saveExerciseDetail}
                resetToLogin={resetToLogin}
            />
        );
    };
    return (
        <View
            style={[
                { flex: 1 },
                padding_tool(Platform.OS === "ios" ? 60 : 0, 20, 20, 20),
            ]}
        >
            <View style={[styles.headerWrap]}>{renderStatus()}</View>
            {
                !showLoading && <View style={[{ flex: 1 }]}>
                    {list[listindex]?.exercise_id ? renderExercise() : null}
                </View>
            }

            <AnswerStatisticsModal
                dialogVisible={answerStatisticsModalVisible}
                yesNumber={correct}
                noNumber={wrong}
                waitNumber={0}
                closeDialog={closeAnswerStatisticsModal}
                finishTxt={"字词完成"}
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
    statusTxt: {
        fontSize: pxToDp(36),
    },
    statusWrap: {
        ...size_tool(72),
        ...appStyle.flexCenter,
        ...borderRadius_tool(100),
        borderWidth: pxToDp(6),
    },
});
export default Words;
