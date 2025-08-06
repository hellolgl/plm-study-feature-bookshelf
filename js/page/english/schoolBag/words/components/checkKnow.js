import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Dimensions,
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { appStyle, appFont } from "../../../../../theme";
import {
    size_tool,
    pxToDp,
    padding_tool,
    borderRadius_tool,
} from "../../../../../util/tools";
import CheckBox from "react-native-check-box";
import { Toast } from "antd-mobile-rn";

class EnglishChooseKnowledge extends PureComponent {
    constructor(props) {
        super(props);
        this.flag = false;
        this.state = {
            list: [
                {
                    text: "Listening",
                    value: "20%",
                    bgColor: ["#6384F0", "#8BA0F8"],
                },
                {
                    text: "Speaking",
                    value: "60%",
                    bgColor: ["#FDAE00", "#FAC845"],
                },
                {
                    text: "Reading",
                    value: "10%",
                    bgColor: ["#FA7528", "#FC8A4B"],
                },
                {
                    text: "Writing",
                    value: "50%",
                    bgColor: ["#3AB4FF", "#78D7FE"],
                },
            ],
            classList: {},
            isCheckedAll: false,
            knowList: [],
            knowCheckedList: [],
            type: "",
            hasrecord: false,
        };
    }

    static navigationOptions = {
        // title:'答题'
    };
    static getDerivedStateFromProps(props, state) {
        let temstate = state;
        if (
            props.origin !== temstate.origin || (props.origin === temstate.origin && props.type !== temstate.type) || (props.origin === temstate.origin && props.knowList.length !== temstate.knowList.length)
        ) {
            let hasrecord = false;
            temstate.knowList = props.knowList.map((item) => {
                if (item.status !== 0) {
                    hasrecord = true;
                }
                return {
                    ...item,
                    check: false,
                };
            });
            temstate.knowCheckedList = [];
            temstate.isCheckedAll = false;
            temstate.type = props.type;
            temstate.origin = props.origin;
            temstate.hasrecord = hasrecord;
        }
        return temstate;
    }
    checkSelectAllState = () => {
        const { knowList } = this.state;
        let state = true;
        knowList.forEach((item) => {
            if (!item.check) {
                state = false;
            }
        });

        this.setState(() => ({
            isCheckedAll: state,
        }));
    };

    setClickWordOrPhrase = (item, index) => {
        if (!item) return;
        const { knowList, knowCheckedList } = this.state;
        let list = [...knowList];
        list[index].check = item.check;

        //code数组
        let codeList = [...knowCheckedList];
        if (item.check && codeList.indexOf(item.k_id) < 0) {
            codeList.push(item.k_id);
        } else if (!item.check && codeList.indexOf(item.k_id) > -1) {
            codeList.remove(item.k_id);
        }
        // console.log("点击数据", knowList, codeList);
        this.setState(() => ({
            knowList: [...list],
            knowCheckedList: [...codeList],
        }));
        this.checkSelectAllState();
    };

    knowSelectALl = () => {
        const { knowList, isCheckedAll } = this.state;
        //console.log('knowSelectALl',isCheckedAllPhrase)
        let list = [];
        let codeList = [];
        let wordlist = knowList.map((item) => {
            item.check = isCheckedAll;
            if (isCheckedAll) {
                list.push(item.value);
                codeList.push(item.k_id);
            }
            return item;
        });

        this.setState(() => ({
            knowList: wordlist,
            knowCheckedList: codeList,
        }));
    };

    toRecord = () => {
        const { hasrecord } = this.state;
        if (hasrecord) {
            this.props.toRecord();
        }
        console.log("go record...");
    };
    renderChooserPhraseKnowledge = () => {
        const { knowList, type } = this.state;
        // console.log("getDerivedStateFromProps render", knowList);
        if (knowList.length <= 0)
            return (
                <Text style={{ fontSize: pxToDp(32) }}>
                    {this.isloading === true ? "" : "No Knowledge point"}
                </Text>
            );
        return (
            <View
                style={[
                    type !== "sentence" && appStyle.flexTopLine,
                    appStyle.flexLineWrap,
                ]}
            >
                {knowList.map((item, index) => {
                    let imgUrl = "";
                    if (item.status == 1) {
                        imgUrl = require("../../../../../images/englishHomepage/ic_excellent.png");
                    }
                    if (item.status == 2) {
                        imgUrl = require("../../../../../images/englishHomepage/ic_error.png");
                    }
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                item.check = !item.check;
                                this.setClickWordOrPhrase(item, index);
                            }}
                            style={[
                                styles.wordItem,
                                !item.check && { paddingBottom: pxToDp(4) },
                                type === "sentence" && { width: "98%" },
                            ]}
                            key={index}
                        >
                            {imgUrl === "" ? null : (
                                <Image
                                    source={imgUrl}
                                    style={[
                                        {
                                            width: pxToDp(40),
                                            height: pxToDp(40),
                                            position: "absolute",
                                            top: pxToDp(-10),
                                            left: pxToDp(-10),
                                            zIndex: 99,
                                        },
                                    ]}
                                ></Image>
                            )}
                            <View
                                style={[
                                    appStyle.flexTopLine,
                                    {
                                        minHeight: pxToDp(type === "sentence" ? 80 : 120),
                                        backgroundColor: "#FFE8C5",
                                        borderRadius: pxToDp(20),
                                        padding: pxToDp(16),
                                        borderColor: "#FFE8C5",
                                        borderWidth: pxToDp(4),
                                    },
                                    item.check && {
                                        borderColor: "#FFB533",
                                        borderBottomWidth: pxToDp(4),
                                        minHeight: pxToDp(type === "sentence" ? 84 : 124),
                                        paddingBottom: pxToDp(20),
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        {
                                            justifyContent: "center",
                                            marginRight: pxToDp(20),
                                        },
                                        type === "word" && appStyle.flexCenter,
                                        type === "sentence"
                                            ? {
                                                width: pxToDp(1200),
                                            }
                                            : { minWidth: pxToDp(220) },
                                    ]}
                                >
                                    <Text
                                        style={{
                                            fontSize: pxToDp(36),
                                            ...appFont.fontFamily_jcyt_700,
                                            lineHeight: pxToDp(46),
                                        }}
                                    >
                                        {item.knowledge_point}
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        size_tool(40),
                                        {
                                            flexDirection: "row",
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <CheckBox
                                        style={{
                                            flex: 1,
                                        }}
                                        onClick={() => {
                                            // item.check = !item.check;
                                            this.setClickWordOrPhrase(
                                                {
                                                    ...item,
                                                    check: !item.check,
                                                },
                                                index
                                            );
                                        }}
                                        isChecked={item.check}
                                        checkedImage={
                                            <Image
                                                source={require("../../../../../images/english/myStudy/knowChecked.png")}
                                                style={[size_tool(40)]}
                                            />
                                        }
                                        unCheckedImage={
                                            <Image
                                                source={require("../../../../../images/english/myStudy/knowSelect2.png")}
                                                style={[size_tool(40)]}
                                            />
                                        }
                                    ></CheckBox>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };
    toExercise = () => {
        const { knowCheckedList } = this.state;

        if (knowCheckedList.length === 0) {
            return;
        }
        this.props.toExercise(knowCheckedList);
    };
    render() {
        const { knowCheckedList, hasrecord } = this.state;
        return (
            <View
                style={[
                    {
                        flex: 1,
                    },
                ]}
            >
                <ScrollView style={[styles.con]}>
                    <View style={[padding_tool(10, 40, 40, 40)]}>
                        {this.renderChooserPhraseKnowledge()}
                    </View>
                </ScrollView>
                <View
                    style={[
                        appStyle.flexJusBetween,
                        appStyle.flexLine,
                        { width: "100%", height: pxToDp(180) },
                        padding_tool(20, 40, 20, 60),
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            // console.log('1111')
                            this.setState(
                                () => ({
                                    isCheckedAll: !this.state.isCheckedAll,
                                }),
                                () => {
                                    this.knowSelectALl();
                                }
                            );
                        }}
                        style={[appStyle.flexTopLine, { alignItems: "center" }]}
                    >
                        <Image style={[{ width: pxToDp(40), height: pxToDp(40), marginRight: pxToDp(16) }]} source={this.state.isCheckedAll ? require("../../../../../images/english/myStudy/knowChecked.png") : require("../../../../../images/english/myStudy/knowSelect1.png")}></Image>
                        <Text
                            style={{
                                fontSize: pxToDp(32),
                                color: "#2D3040",
                            }}
                        >
                            Select all
                        </Text>
                    </TouchableOpacity>
                    <View style={[appStyle.flexLine]}>
                        <TouchableOpacity
                            style={[
                                size_tool(200, 78),
                                {
                                    borderWidth: pxToDp(4),
                                    borderColor: hasrecord ? "#FFDB5D" : "#E6E8F0",
                                    borderRadius: pxToDp(200),
                                },
                                appStyle.flexCenter,
                            ]}
                            onPress={this.toRecord}
                        >
                            <Text
                                style={[
                                    appFont.fontFamily_jcyt_700,
                                    {
                                        fontSize: pxToDp(32),
                                        color: hasrecord ? "#2D3040" : "rgba(45, 48, 64, 0.30)",
                                    },
                                ]}
                            >
                                Record
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                size_tool(272, 102),
                                borderRadius_tool(200),
                                {
                                    backgroundColor:
                                        knowCheckedList.length === 0 ? "#CFD3E2" : "#FFB13C",
                                    paddingBottom: pxToDp(6),
                                    marginLeft: pxToDp(40),
                                },
                            ]}
                            onPress={() => this.toExercise()}
                        >
                            <View
                                style={[
                                    {
                                        flex: 1,
                                        borderRadius: pxToDp(100),
                                        backgroundColor:
                                            knowCheckedList.length === 0 ? "#EAEBF2" : "#FFDB5D",
                                    },
                                    appStyle.flexTopLine,
                                    appStyle.flexCenter,
                                ]}
                            >
                                <Text
                                    style={[
                                        appFont.fontFamily_jcyt_700,
                                        { fontSize: pxToDp(32), color: "#2D3040", opacity: 0.4 },
                                    ]}
                                >
                                    {knowCheckedList.length}
                                </Text>
                                <Text
                                    style={[
                                        appFont.fontFamily_jcyt_700,
                                        {
                                            fontSize: pxToDp(32),
                                            color: knowCheckedList.length === 0 ? "#9799A4" : "#2D3040",
                                            marginLeft: pxToDp(20),
                                        },
                                    ]}
                                >
                                    Start
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainWrap: {
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        paddingTop: pxToDp(28),
    },
    header: {
        paddingLeft: pxToDp(67),
        paddingRight: pxToDp(67),
        position: "relative",
        marginBottom: pxToDp(44),
    },
    con: {
        backgroundColor: "white",
        flex: 1,
        borderRadius: pxToDp(32),
    },

    wordItem: {
        // height: pxToDp(104),
        backgroundColor: "#FBCD89",
        marginRight: pxToDp(20),
        marginBottom: pxToDp(20),
        borderRadius: pxToDp(20),
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        textBookCode: state.getIn(["bagEnglish", "textBookCode"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispathToProps
)(EnglishChooseKnowledge);
