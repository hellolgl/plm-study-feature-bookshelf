import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
} from "react-native";
import { appStyle } from "../../../../theme";
import {
    pxToDp,
    padding_tool,
    size_tool,
    borderRadius_tool,
} from "../../../../util/tools";
import CheckType from "./components/checkType";
import UserInfo from "./components/userInfo";
import CheckSubject from "./components/checkSubject";
import MyPie from "../../../../component/myChart/my";
import MyRadarChart from "../../../../component/myRadarChart";
import CircleStatistcs from "../../../../component/circleStatistcs";
import MyManyBarChart from "../../../../component/myChart/myManyBarChart";
import MyLineChart from "../../../../component/myChart/myLineChart";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import { useSelector } from "react-redux";

const English = (props) => {
    const { changeSubject } = props;
    const { currentUserInfo, coin } = useSelector(
        (state) => state.toJS().userInfo
    );
    const { checkGrade, checkTeam } = currentUserInfo;
    const [right_rate, setright_rate] = useState(0);
    const [total_exercise, settotal_exercise] = useState(0);
    const [knowList, setknowList] = useState([
        {
            icon: require("../../../../images/chineseHomepage/statistics/icon_1.png"),
            title: "已掌握词汇",
            backgroundColor: "rgba(113,110,255,0.1)",
            type: "word",
            total: 0,
        },
        {
            icon: require("../../../../images/chineseHomepage/statistics/icon_2.png"),
            title: "已掌握短语",
            backgroundColor: "rgba(255,105,105,0.1)",
            type: "phrase",
            total: 0,
        },
        {
            icon: require("../../../../images/chineseHomepage/statistics/icon_3.png"),
            title: "已掌握句型",
            backgroundColor: "rgba(255,156,64,0.1)",
            type: "sentence",
            total: 0,
        },
    ]);
    const [rodarName, setrodarName] = useState([]);
    const [rodarvalue, setrodarvalue] = useState([]);
    const [knowTypeList, setknowTypeList] = useState([
        {
            chinese: "词汇",
            english: "Words",
            right_rate: 0,
            total: 0,
            type: "word",
        },
        {
            chinese: "短语",
            english: "Phrase",
            right_rate: 0,
            total: 0,
            type: "phrase",
        },
        {
            chinese: "阅读理解",
            english: "Reading",
            right_rate: 0,
            total: 0,
            type: "article",
        },
        {
            chinese: "语法",
            english: "Grammar",
            right_rate: 0,
            total: 0,
            type: "grammar",
        },
    ]);
    const [checkKnowType, setcheckKnowType] = useState("word");
    const colorlist = {
        good: "#00CC88",
        normal: "#FFAA5C",
        bad: "#FF6680",
    };
    const knowTypeStyle = {
        chceked: {
            lineBg: "#40404B",
            linetxtbg: "#fff",
            textColor: "#fff",
            iconOpcity: 1,
            bg: "#4C4C59",
        },
        normal: {
            lineBg: "#E9E9F2",
            linetxtbg: "#4C4C59",
            textColor: "#4C4C59",
            iconOpcity: 0,
            bg: "#fff",
        },
    };
    const rodarNameType = {
        listen: "听力 Listening",
        grammar: "语法 Grammar",
        write: "拼写 Spelling",
        read: "阅读 Reading",
        speak: "口语 Speaking",
    };
    const [rightValue, setrightValue] = useState([]);
    const [namelist, setnamelist] = useState([]);
    const [lineValue, setlineValue] = useState([]);
    const [arangelist, setarangelist] = useState([]);
    const [linename, setlinename] = useState([]);
    const [timeType, settimeType] = useState("1");
    const barNameObj = {
        Comprehension: "综合运用",
        Pronunciation: "发音",
        Recognition: "识别",
        Spelling: "拼写",
        VCQ: "词汇积累",
        Grammar: "语法",
        "Grammatical Testing": "语法",
    };
    useEffect(() => {
        getData(timeType);
        getLineAndBar(timeType, checkKnowType);
    }, [timeType]);
    useEffect(() => {
        getLineAndBar(timeType, checkKnowType);
    }, [checkKnowType]);
    const getData = async (exercise_time) => {
        const res = await axios.get(api.getEnglishNewStatistics, {
            params: {
                exercise_time,
                grade_term: checkGrade + checkTeam,
            },
        });
        // console.log("数据", res.data);

        if (res.data.err_code === 0) {
            const { master_knowledge, knowledge_data, radar_data } = res.data.data;
            let noData = 0;
            let namelist = [];
            let radar_list = radar_data.map((item) => {
                item.value === -1 && ++noData;
                namelist.push(rodarNameType[item.type]);
                return item.value === -1 ? "0" : item.value + "";
            });
            if (noData === 5) radar_list = [];
            let typeList = knowTypeList.map((item) => {
                return {
                    ...item,
                    ...knowledge_data[item.type],
                };
            });
            let myKnowList = knowList.map((item) => {
                return {
                    ...item,
                    total: master_knowledge[item.type],
                };
            });
            // console.log("组装后的数据", noData, radar_list, namelist);
            setrodarName(namelist);
            setrodarvalue(radar_list);

            settotal_exercise(res.data.data.total_exercises);
            setright_rate(res.data.data.right_rate);
            setknowTypeList(typeList);
            setknowList(myKnowList);
        }
    };
    const getLineAndBar = async (exercise_time, knowledge_type) => {
        const res = await axios.get(api.getEnglishNewStatisticsLine, {
            params: {
                exercise_time,
                grade_term: checkGrade + checkTeam,
                knowledge_type,
            },
        });
        // console.log("知识点下的统计", res.data);
        if (res.data.err_code === 0) {
            const { ability_data, rank_data } = res.data.data;
            let myList = [],
                dateList = [""],
                allList = [];
            let barList = [],
                barName = [""];
            rank_data.forEach((item, index) => {
                dateList.push(item.operate_time);
                myList.push({
                    x: index + 1,
                    y: Platform.OS === "ios" ? item.single_rate / 100 : item.single_rate, // π学分
                });
                allList.push({
                    x: index + 1,
                    y:
                        Platform.OS === "ios" ? item.average_rate / 100 : item.average_rate, // π学分
                });
            });
            ability_data.forEach((item, index) => {
                barList.push({
                    x: index + 1,
                    y: item.right_rate,
                });

                barName.push(
                    knowledge_type === "grammar" ? item.ability : barNameObj[item.ability]
                );
            });
            // console.log("组装后的折线图", barName, barList);
            setarangelist(allList);
            setlinename(dateList);
            setlineValue(myList);

            setnamelist(barName);
            setrightValue(barList);
        }
    };
    const checkTypeNow = (item) => {
        settimeType(item.value);
    };
    const lookThisType = (item) => {
        setcheckKnowType(item.type);
    };
    const renderKnow = () => {
        const returnDom = knowList.map((item, index) => {
            return (
                <View
                    style={[styles.knowWrap, { backgroundColor: item.backgroundColor }]}
                    key={index}
                >
                    <Image source={item.icon} style={[size_tool(88)]} />
                    <Text style={[styles.knowTxt1]}>{item.total}</Text>
                    <Text style={[styles.knowTxt2]}>{item.title}</Text>
                </View>
            );
        });
        return returnDom;
    };
    const renderItem = () => {
        const returnDom = knowTypeList.map((item, index) => {
            let bgtype =
                item.right_rate > 84 ? "good" : item.right_rate > 69 ? "normal" : "bad";
            let styleObj =
                item.type === checkKnowType
                    ? knowTypeStyle.chceked
                    : knowTypeStyle.normal;
            return (
                <TouchableOpacity
                    style={[appStyle.flexAliCenter]}
                    key={index}
                    onPress={lookThisType.bind(this, item)}
                >
                    <View
                        style={[
                            styles.typeMain,
                            {
                                backgroundColor: styleObj.bg,
                            },
                        ]}
                    >
                        <View style={[styles.typeTxtWrap]}>
                            <Text style={[{ color: styleObj.textColor }, styles.typeTxt1]}>
                                {item.chinese}
                            </Text>
                            <Text style={[styles.typeTxt2]}>{item.english}</Text>
                        </View>
                        <View style={[appStyle.flexAliCenter]}>
                            <View style={{ marginBottom: pxToDp(10) }}>
                                <CircleStatistcs
                                    total={item.total}
                                    right={Number(item.right_rate)}
                                    size={200}
                                    width={20}
                                    totalText={"正确率"}
                                    tintColor={colorlist[bgtype]} //答对的颜色
                                    backgroundColor={styleObj.lineBg}
                                    type="percent"
                                    percenteSize={40}
                                    textColor1={styleObj.linetxtbg}
                                    textColor={"#9595A6"}
                                />
                            </View>
                            <Text style={[styles.typeTxt3]}>已完成{item.total}题</Text>
                        </View>
                    </View>
                    <Image
                        style={[size_tool(40), { opacity: styleObj.iconOpcity }]}
                        source={require("../../../../images/chineseHomepage/statistics/icon_5.png")}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            );
        });
        return returnDom;
    };
    const renderBar = () => {
        return (
            <View style={[styles.chartWrap]}>
                <Text style={[styles.chartTitle]}>正确率:</Text>
                <View style={[styles.chart]}>
                    {/* 柱状图 */}
                    <MyManyBarChart
                        totallist={[]}
                        rightValue={rightValue}
                        namelist={namelist}
                        enabledLegend={true}
                        height={pxToDp(550)}
                        width={pxToDp(800)}
                        rightColor={"#7076FF"}
                    />
                </View>
                {/* <View style={[styles.msgWrap]}>
          {renderMsg(
            true,
            "字结构掌握相当透彻！字结构掌握相当透彻！字结构掌握相当透彻！字结构掌握相当透彻！",
            10
          )}
          {renderMsg(false, "")}
        </View> */}
            </View>
        );
    };
    const renderMsg = (isGood, txt, margin) => {
        return (
            <View style={[appStyle.flexLine, margin && { marginBottom: margin }]}>
                <Image
                    source={
                        isGood
                            ? require("../../../../images/chineseStrong.png")
                            : require("../../../../images/chineseWeak.png")
                    }
                    style={[styles.msgIcon]}
                />
                <Text style={[styles.msgTxt]}>{txt ? txt : "请继续加油哦!"}</Text>
            </View>
        );
    };
    const renderLine = () => {
        return (
            <View style={[styles.chartWrap]}>
                <Text style={[styles.chartTitle]}>π分相对排名:</Text>
                <View style={[styles.chart]}>
                    {/* 折线图 */}
                    <MyLineChart
                        value={lineValue}
                        arangelist={arangelist}
                        linename={linename}
                        height={pxToDp(550)}
                        width={pxToDp(800)}
                        myColor={"#906FFF"}
                        perColor={"#C3C3D9"}
                        perlintType={"solid"}
                    />
                </View>
                {/* <View style={[styles.msgWrap]}>
          {renderMsg(
            true,
            "字结构掌握相当透彻！字结构掌握相当透彻！字结构掌握相当透彻！字结构掌握相当透彻！",
            10
          )}
          {renderMsg(false, "")}
        </View> */}
            </View>
        );
    };
    return (
        <View style={[styles.contain]}>
            <ScrollView style={[{ flex: 1 }, padding_tool(20, 60, 0, 60)]}>
                <View
                    style={[
                        appStyle.flexLine,
                        appStyle.flexJusBetween,
                        { marginBottom: pxToDp(30) },
                    ]}
                >
                    <CheckSubject
                        defaultSubject="english"
                        changeSubject={changeSubject}
                    />
                    <CheckType checkType={checkTypeNow} />
                </View>

                <View style={[styles.infoWrap]}>
                    <View>
                        <View style={[appStyle.flexLine, { marginBottom: pxToDp(80) }]}>
                            <UserInfo />
                            <View
                                style={[appStyle.flexTopLine, { paddingLeft: pxToDp(100) }]}
                            >
                                <View style={[size_tool(240, 208)]}>
                                    <View style={[styles.circleWrap]}>
                                        <Image
                                            source={require("../../../../images/chineseHomepage/staticsStar.png")}
                                            style={[size_tool(72), borderRadius_tool(36)]}
                                        />
                                    </View>

                                    <Text style={[styles.circleText1]}>{total_exercise}</Text>
                                    <Text style={[styles.circleText2]}>合计已做题</Text>
                                </View>

                                <View style={[size_tool(240, 208)]}>
                                    {/* <MyPieChart /> */}
                                    <View style={[styles.circleWrap]}>
                                        <MyPie
                                            length={pxToDp(18)}
                                            width={72}
                                            percent={right_rate / 100}
                                            color={
                                                right_rate > 84
                                                    ? "#00CC88"
                                                    : right_rate > 69
                                                        ? "#FFAA5C"
                                                        : "#FF6680"
                                            }
                                        />
                                    </View>
                                    <Text style={[styles.circleText1]}>{right_rate + "%"}</Text>
                                    <Text style={[styles.circleText2]}>合计正确率</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[appStyle.flexTopLine]}>{renderKnow()}</View>
                    </View>

                    <View
                        style={[
                            size_tool(750, 500),
                            {
                                marginRight: pxToDp(60),
                                justifyContent: "center",
                            },
                        ]}
                    >
                        {/* y右边 */}
                        {rodarvalue.length > 0 ? (
                            <MyRadarChart
                                valueList={rodarvalue}
                                namelist={rodarName}
                                size={[pxToDp(900), pxToDp(900)]}
                            />
                        ) : (
                            <Image
                                source={require("../../../../images/chineseHomepage/statistics/noData_1.png")}
                                style={[size_tool(750, 500)]}
                            />
                        )}
                    </View>
                </View>
                <View style={[styles.typeWrap]}>{renderItem()}</View>
                <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
                    {renderBar()}
                    {renderLine()}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    contain: {
        flex: 1,
    },
    infoWrap: {
        height: pxToDp(640),
        borderRadius: pxToDp(40),
        backgroundColor: "#fff",
        padding: pxToDp(40),
        ...appStyle.flexTopLine,
        justifyContent: "space-between",
        marginBottom: pxToDp(66),
    },
    circleWrap: {
        backgroundColor: "transparent",
        borderWidth: pxToDp(4),
        borderColor: "#E4E4F0",
        justifyContent: "center",
        alignItems: "center",
        width: pxToDp(88),
        height: pxToDp(88),
        borderRadius: pxToDp(44),
        marginBottom: pxToDp(14),
    },
    circleText1: {
        fontSize: pxToDp(48),
        color: "#4C4C59",
        marginBottom: pxToDp(10),
    },
    circleText2: {
        fontSize: pxToDp(28),
        color: "#9595A6",
    },
    knowTxt1: {
        fontSize: pxToDp(48),
        color: "#4C4C59",
    },
    knowTxt2: {
        fontSize: pxToDp(28),
        color: "#4C4C59",
    },
    knowWrap: {
        ...size_tool(280, 260),
        ...borderRadius_tool(20),
        padding: pxToDp(20),
        marginRight: pxToDp(40),
        justifyContent: "space-between",
    },
    typeWrap: {
        height: pxToDp(300),
        paddingLeft: pxToDp(28),
        paddingRight: pxToDp(28),
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: pxToDp(40),
    },
    typeMain: {
        ...appStyle.flexLine,
        ...size_tool(434, 280),
        borderRadius: pxToDp(40),
        backgroundColor: "#fff",
        marginBottom: pxToDp(-20),
        justifyContent: "space-between",
        ...padding_tool(0, 24),
    },
    typeTxt1: {
        fontSize: pxToDp(36),
    },
    typeTxt2: {
        fontSize: pxToDp(24),
        color: "#A1A1B1",
    },
    typeTxt3: {
        fontSize: pxToDp(24),
        color: "#9595A6",
        marginBottom: pxToDp(20),
    },
    typeTxtWrap: {
        flex: 1,
        alignItems: "center",
    },
    chartWrap: {
        width: pxToDp(924),
        height: pxToDp(710),
        borderRadius: pxToDp(40),
        borderWidth: pxToDp(4),
        borderColor: "#E9E9F2",
        padding: pxToDp(40),
        marginBottom: pxToDp(100),
    },
    chartTitle: {
        fontSize: pxToDp(36),
        color: "#4C4C59",
        marginBottom: pxToDp(10),
    },
    chart: {
        flex: 1,
    },
    msgWrap: {
        width: "100%",
        height: pxToDp(168),
        borderRadius: pxToDp(20),
        backgroundColor: "#EDEDF5",
        padding: pxToDp(20),
        justifyContent: "center",
    },
    msgTxt: {
        fontSize: pxToDp(24),
        color: "#4C4C59",
        flex: 1,
    },
    msgIcon: {
        ...size_tool(40),
        zIndex: 99,
        marginRight: pxToDp(12),
    },
});

export default English;
