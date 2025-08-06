import React, { useEffect, useState } from "react";

import { View, Text, DeviceEventEmitter } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { appStyle } from "../../../../../theme";
import {
  pxToDp,
  size_tool,
  borderRadius_tool,
} from "../../../../../util/tools";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import AnswerStatisticsModal from "../../../../../component/chinese/sentence/staticsModal";
import { getRewardCoinLastTopic } from "../../../../../util/coinTools";
import * as actionCreatorsUserInfo from "../../../../../action/userInfo";

import Exercise from "../../newReading/doExercise/components/exercise";
import Loading from "../../../../../component/loading";

const Reading = (props) => {
  const { finish } = props;
  const { currentUserInfo } = useSelector((state) => state.toJS().userInfo);
  const dispatch = useDispatch();
  const { checkGrade, checkTeam } = currentUserInfo;
  const [list, setlist] = useState([]);
  const [listindex, setlistindex] = useState(0);
  const [correctNum, setcorrect] = useState(0);
  const [wrong, setwrong] = useState(0);
  const [answerStatisticsModalVisible, setanswerStatisticsModalVisible] =
    useState(false);
  const [exercise_ids, setexercise_ids] = useState([]);
  const [sync_ids, setsync_ids] = useState([]);
  const [isOld, setisOld] = useState(true);
  const start_time = new Date().getTime();
  const [topaicNum, settopaicNum] = useState(0);
  const [showLoading, setshowLoading] = useState(true);

  let eventListener = null;
  useEffect(() => {
    getList();
  }, []);
  const getAnswerResult = () => {
    let endTime = new Date().getTime();
    let spend_time = parseInt((endTime - start_time) / 1000);
    let obj = {
      // student_id: this.info.id,
      spend_time,
      r_times_id: list[listindex].r_times_id,
    };
    axios.put(api.studentReadStem, obj).then((res) => {
      // console.log("一套题保存成功");
      setanswerStatisticsModalVisible(true);
    });
  };
  const getList = async () => {
    const res = await axios.get(`${api.getChineseReadingDailyExercise}`, {
      params: {
        grade_code: checkGrade,
        term_code: checkTeam,
      },
    });

    // let list = [...res.data.data.sentence, ...res.data.data.article];
    // console.log("res", res);
    if (res && res.data.err_code === 0) {
      setshowLoading(false);

      let list = res.data.data;
      setlist(list);
      settopaicNum(list.length);
      setexercise_ids(list[0]?.exercise_ids);
      setsync_ids(list[0]?.sync_ids);
    }
  };

  const saveExercise = async (yesOrNo) => {
    // 保存做题结果
    const fromServeCharacterList = list,
      topaicIndex = listindex;
    let endTime = new Date().getTime();
    let answer_times = parseInt((endTime - start_time) / 1000);
    // console.log("jieguo", this.state)
    let score = 0;
    if (
      (answer_times < fromServeCharacterList[topaicIndex].exercise_time ||
        answer_times === fromServeCharacterList[topaicIndex].exercise_time) &&
      yesOrNo === 0
    ) {
      score = 3;
    }
    if (
      answer_times > fromServeCharacterList[topaicIndex].exercise_time &&
      yesOrNo === 0
    ) {
      score = 2;
    }
    if (yesOrNo === 2) {
      score = 1;
    }

    let obj = {
      grade_term: checkGrade + checkTeam,
      knowledge: fromServeCharacterList[topaicIndex].knowledge,
      exercise_id: fromServeCharacterList[topaicIndex].exercise_id,
      correct: yesOrNo + "", //批改对错，0 正确 2错误
      // push_tag: fromServeCharacterList[topaicIndex].push_tag,   //是否需要推送题目
      knowledge_type: fromServeCharacterList[topaicIndex].knowledge_type,
      exercise_level: fromServeCharacterList[topaicIndex].exercise_level,
      exercise_element: fromServeCharacterList[topaicIndex].exercise_element,
      push_num: fromServeCharacterList[topaicIndex].push_num,
      record_id: fromServeCharacterList[topaicIndex].record_id,
      a_id: fromServeCharacterList[topaicIndex].a_id,
      exercise_type: fromServeCharacterList[topaicIndex].exercise_type,
      answer_origin: fromServeCharacterList[topaicIndex].answer_origin,
      r_id: fromServeCharacterList[topaicIndex].r_id,
      r_times_id: fromServeCharacterList[topaicIndex].r_times_id,
      answer_times: score,
      ability: fromServeCharacterList[topaicIndex].ability,
      module: "3",
      exercise_ids,
      sync_ids,
      alias: "chinese_toDoExercise",
    };
    let isFinish = topaicIndex + 1 === fromServeCharacterList.length;
    if (obj.answer_origin === "3" && isOld) {
      const res = await axios.post(api.recordSingleRead, obj);

      if (res.data.err_code === 0) {
        if (yesOrNo === 2) {
          // 有下一等级题目
          console.log("send", obj);

          let isOldonw = isOld;
          let listnow = [...fromServeCharacterList];
          let topaicNumnow = topaicNum + 1;
          let exercise_idsnow = exercise_ids,
            sync_idsnow = sync_ids;
          if (res.data.data.exercise_id) {
            let insertObj = res.data.data;
            // insertObj.colorFlag = 0
            listnow.splice(topaicIndex + 1, 0, insertObj);
            isOldonw = true;
            exercise_idsnow = insertObj.exercise_ids;
            sync_idsnow = insertObj.sync_ids;
          } else {
            let insertObj = { ...fromServeCharacterList[topaicIndex] };
            insertObj.colorFlag = 3;
            // insertObj.colorFlag = 0
            listnow.splice(topaicIndex + 1, 0, insertObj);
            isOldonw = false;
          }
          setlist(listnow);
          settopaicNum(topaicNumnow);
          setexercise_ids(exercise_idsnow);
          setsync_ids(sync_idsnow);
          setlistindex(topaicIndex + 1);
          setisOld(isOldonw);
        } else {
          // 没有要素题
          if (isFinish) {
            if (yesOrNo === 0) {
              getRewardCoinLastTopic().then((res) => {
                if (res.isReward) {
                  // 展示奖励弹框,在动画完后在弹统计框
                  eventListener = DeviceEventEmitter.addListener(
                    "rewardCoinClose",
                    () => {
                      getAnswerResult();
                      eventListener && eventListener.remove();
                    }
                  );
                } else {
                  getAnswerResult();
                }
              });
            } else {
              getAnswerResult();
            }
          } else {
            if (yesOrNo === 0) {
              dispatch(actionCreatorsUserInfo.getRewardCoin());
            }

            setlistindex(topaicIndex + 1);
            setisOld(true);
          }
          //console.log("saveExercise");
        }
      }
    } else {
      if (isFinish) {
        if (yesOrNo === 0) {
          getRewardCoinLastTopic().then((res) => {
            if (res.isReward) {
              // 展示奖励弹框,在动画完后在弹统计框
              eventListener = DeviceEventEmitter.addListener(
                "rewardCoinClose",
                () => {
                  getAnswerResult();
                  eventListener && eventListener.remove();
                }
              );
            } else {
              getAnswerResult();
            }
          });
        } else {
          getAnswerResult();
        }
      } else {
        if (yesOrNo === 0) {
          dispatch(actionCreatorsUserInfo.getRewardCoin());
        }
        setlistindex(topaicIndex + 1);
        setisOld(true);
      }
    }
  };
  const nextTopaic = (exercise) => {
    // this.refs.canvas._nextTopaic();
    const fromServeCharacterList = list,
      topaicIndex = listindex;
    const { correct } = exercise;
    let correctnow = correctNum,
      wrongnow = wrong;
    let right = correct === "0" ? 0 : 2;
    fromServeCharacterList[topaicIndex].colorFlag = right;
    correct === "0" ? correctnow++ : wrongnow++;
    saveExercise(right);
    setlist(fromServeCharacterList);
    setcorrect(correctnow);
    setwrong(wrongnow);
  };
  const closeAnswerStatisticsModal = () => {
    setanswerStatisticsModalVisible(false);
    finish();
  };
  const renderStatus = () => {
    let cardList = list.map((item, index) => {
      return index <= listindex ? (
        <View
          style={[
            size_tool(80),
            borderRadius_tool(80),
            appStyle.flexCenter,
            {
              backgroundColor:
                item.colorFlag === 0
                  ? "#7FD23F"
                  : item.colorFlag === 2
                  ? "#FC6161"
                  : "transparent",
              marginRight: pxToDp(20),
            },
            index === listindex && {
              borderWidth: pxToDp(5),
              borderColor: "#FF9032",
            },
          ]}
        >
          <Text
            style={[
              {
                fontSize: pxToDp(50),
                color: index < listindex ? "#fff" : "#445268",
              },
            ]}
          >
            {index + 1}
          </Text>
        </View>
      ) : null;
    });

    return cardList;
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
      <View style={[{ flex: 1 }]}>
        {list.length > 0 ? (
          <Exercise
            {...props}
            article={{
              ...list[listindex],
              exercise_type: list[listindex].answer_origin === "3" ? "s" : "",
            }}
            nextNow={nextTopaic}
            isKeyExercise={false}
            hideHelp={true}
            resetToLogin={() => {
              //  NavigationUtil.resetToLogin(this.props);
            }}
          />
        ) : null}
      </View>
      <AnswerStatisticsModal
        dialogVisible={answerStatisticsModalVisible}
        yesNumber={correctNum}
        noNumber={wrong}
        waitNumber={0}
        closeDialog={closeAnswerStatisticsModal}
        finishTxt={"完成所有"}
      ></AnswerStatisticsModal>
      <Loading
        showLoading={showLoading}
        text={"正在生成题目，请耐心等待。。。"}
      />
    </View>
  );
};

export default Reading;
