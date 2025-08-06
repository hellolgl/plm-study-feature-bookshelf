import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
} from "react-native";
import { appFont, appStyle } from "../../../../../theme";
import { pxToDp, padding_tool, size_tool } from "../../../../../util/tools";

import { useSelector, useDispatch } from "react-redux";
import axios from " ../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import Pagenation from "./pagenation";
import CircleStatistcs from "../../../../../component/circleStatistcs";
import Loading from "../../../../../component/loading";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
const FlowWrong = ({ navigation }) => {
    const { currentUserInfo, avatar } = useSelector(
        (state) => state.toJS().userInfo
    );
    const typeList = [
        {
            isActive: true,
            text: "今日错题",
        },
        {
            isActive: false,
            text: "本周错题",
        },
        {
            isActive: false,
            text: "本月错题",
        },
        {
            isActive: false,
            text: "本学期错题",
        },
    ];
    const { checkGrade, checkTeam } = currentUserInfo;
    const [list, setlist] = useState([]);
    const [totalPage, settotalPage] = useState(1);
    const [typeIndex, settypeIndex] = useState(1);
    const [loading, setloading] = useState(false);
    const [page, setpage] = useState(1);
    const unitMap = {
        1: "一单元",
        2: "二单元",
        3: "三单元",
        4: "四单元",
        5: "五单元",
        6: "六单元",
        7: "七单元",
        8: "八单元",
        9: "九单元",
        10: "十单元",
        11: "十一单元",
        12: "十二单元",
        13: "十三单元",
        14: "十四单元",
        15: "十五单元",
    };
    useEffect(() => {
        getlist(typeIndex, 1);
    }, []);
    const getlist = async (index, page) => {
        if (loading) {
            return;
        }
        setloading(true);
        const res = await axios.get(
            `${api.chineseGetWrongTextbookList}/${checkGrade}/${checkTeam}/${index}?page=${page}`
        );
        setloading(false);
        // console.log("错题", res.data);
        if (res.data.err_code === 0) {
            const { data, total } = res.data;
            setlist(data);
            settotalPage(Math.ceil(total / 10));
            settypeIndex(index);
            setpage(page);
        }
    };

    const changePage = (page) => {
        getlist(typeIndex, page);
    };
    const changeType = (type) => {
        type !== typeIndex && getlist(type, 1);
    };
    const lookMore = (item) => {
        NavigationUtil.toFlowWrongExerciseList({
            navigation,
            data: {
                ...item,
                index: typeIndex,
            },
        });
    };

    const renderitem = ({ item, index }) => {
        let right_rate = Math.ceil((item.correct_num / item.answer_num) * 100);
        let isRed = right_rate < 80;
        return (
            <TouchableOpacity
                key={index}
                style={[styles.itemWrap, isRed && { backgroundColor: "#F6A9AD" }]}
                onPress={lookMore.bind(this, item)}
            >
                <View
                    style={[styles.itemInner, isRed && { backgroundColor: "#FEE0E2" }]}
                >
                    <Text style={[styles.itemTitle]}>第{unitMap[item.unit_code]}</Text>
                    <View style={[{ flex: 1 }, appStyle.flexCenter]}>
                        <Text
                            style={[
                                styles.itemTxt,
                                item.learning_point.length > 16 && {
                                    fontSize: pxToDp(38),
                                    lineHeight: pxToDp(46),
                                },
                            ]}
                        >
                            {item.learning_point}
                        </Text>
                    </View>
                    <View
                        style={[
                            { marginBottom: pxToDp(50) },
                            size_tool(150),
                            appStyle.flexCenter,
                        ]}
                    >
                        <CircleStatistcs
                            total={100}
                            right={Number(right_rate)}
                            size={140}
                            width={20}
                            totalText={"正确率"}
                            tintColor={isRed ? "#FF867E" : "#60E093"} //答对的颜色
                            backgroundColor={"#fff"}
                            type="percent"
                            // percenteSize={pxToDp(80)}
                            // textColor1={"#4C4C59"}
                            // textColor={"#9595A6"}
                            noTxt={true}
                        />
                    </View>
                    <View style={[styles.itemBottomWrap]}>
                        <View style={[styles.bottomTxtWrap]}>
                            <Text style={[styles.bottomTxt1]}>{item.correct_num}</Text>
                            <Text style={[styles.bottomTxt2]}>正确数</Text>
                        </View>
                        <View style={[]}>
                            <Text style={[styles.bottomTxt1]}>{item.answer_num}</Text>
                            <Text style={[styles.bottomTxt2]}>答题数</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <View style={[styles.contain]}>
            <View style={[padding_tool(136, 48, 0, 58)]}>
                {typeList.map((item, index) => {
                    return (
                        <TouchableOpacity
                            onPress={changeType.bind(this, index + 1)}
                            key={index}
                            style={[
                                styles.typeWrap,
                                typeIndex === index + 1 && { backgroundColor: "#FFB649" },
                            ]}
                        >
                            <View
                                style={[
                                    styles.typeInner,
                                    typeIndex === index + 1 && {
                                        backgroundColor: "#FFDB5D",
                                        borderRadius: pxToDp(36),
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.typeTxt,
                                        typeIndex === index + 1 && appFont.fontFamily_jcyt_700,
                                    ]}
                                >
                                    {item.text}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <View style={[{ flex: 1 }]}>
                {list.length === 0 ? (
                    <View style={[{ flex: 1 }, appStyle.flexCenter]}>
                        <Image
                            source={require("../../../../../images/square/noData.png")}
                            style={[size_tool(592, 568)]}
                            resizeMode="contain"
                        />
                    </View>
                ) : (
                    <FlatList
                        data={list}
                        renderItem={renderitem}
                        numColumns={3}
                        horizontal={false}
                    />
                )}
            </View>
            <Pagenation
                totalPage={totalPage}
                changePage={changePage}
                loading={loading}
                page={page}
            />
            <Loading showLoading={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        flexDirection: "row",
    },
    typeWrap: {
        width: pxToDp(320),
        height: pxToDp(120),
        borderRadius: pxToDp(36),
        paddingBottom: pxToDp(9),
    },
    typeInner: {
        flex: 1,
        borderRadius: pxToDp(36),
        ...appStyle.flexCenter,
    },
    typeTxt: {
        ...appFont.fontFamily_jcyt_500,
        fontSize: pxToDp(40),
        color: "#475266",
        lineHeight: pxToDp(40),
    },
    itemWrap: {
        width: pxToDp(480),
        height: pxToDp(570),
        borderRadius: pxToDp(56),
        backgroundColor: "#AFD4B2",
        paddingBottom: pxToDp(8),
        marginRight: pxToDp(48),
        marginBottom: pxToDp(16),
    },
    itemInner: {
        flex: 1,
        borderRadius: pxToDp(56),
        backgroundColor: "#E4EEE5",
        alignItems: "center",
        padding: pxToDp(40),
    },
    itemTitle: {
        ...appFont.fontFamily_syst,
        fontSize: pxToDp(36),
        color: "#475266",
        lineHeight: pxToDp(40),
    },
    itemTxt: {
        ...appFont.fontFamily_syst_bold,
        color: "#475266",
        fontSize: pxToDp(48),
        lineHeight: pxToDp(60),
    },
    itemBottomWrap: {
        flexDirection: "row",
        justifyContent: "center",
    },
    bottomTxt1: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(32),
        color: "#475266",
        lineHeight: pxToDp(32),
        textAlign: "center",
        marginBottom: pxToDp(10),
    },
    bottomTxt2: {
        ...appFont.fontFamily_jcyt_500,
        fontSize: pxToDp(24),
        color: "#475266",
        lineHeight: pxToDp(24),
        opacity: 0.7,
    },
    bottomTxtWrap: {
        marginRight: pxToDp(40),
    },
});
export default FlowWrong;
