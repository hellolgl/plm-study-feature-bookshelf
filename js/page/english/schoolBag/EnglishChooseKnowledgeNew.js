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
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import NavigationUtil from "../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { appStyle } from "../../../theme";
import { size_tool, pxToDp } from "../../../util/tools";
import CheckBox from "react-native-check-box";
import { Toast } from "antd-mobile-rn";

class EnglishChooseKnowledge extends PureComponent {
    constructor(props) {
        super(props);
        (this.knowledge_type = 1), (this.isloading = true);
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
            isCheckedAllPhrase: false,
            isCheckedAllExpress: false,
            wordCheckList: [],
            phraseCheckList: [],
            wordAndPhraseSelectList: [],
            expressCheckList: [],
            expressSelectList: [],
            wordAndPhraseCodeSelectList: [],
            expressCodeSelectList: [],
        };
    }

    static navigationOptions = {
        // title:'答题'
    };

    componentDidMount() {
        this.getlist();
    }

    getlist() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const item = this.props.navigation.state.params.data;
        this.knowledge_type = item.knowledge_type;
        const data = {
            origin: item.origin || "032001000707",
            // mode: item.mode,
            sub_modular: item.kpg_type,
            // student_code: userInfoJs.id
        };
        console.log("参数", data);
        this.isloading = true;
        axios.get(api.getEnglishKnowList, { params: data }).then((res) => {
            console.log("res", res.data.data);
            this.isloading = false;
            this.flag = false;
            if (item.kpg_type == 1) {
                //单词或者短语
                let wordlist = [];
                let phraselist = [];
                if (res.data.data.word) {
                    res.data.data.word.map((item) => {
                        wordlist.push({
                            check: false,
                            value: item.knowledge_point,
                            status: item.status,
                            code: item.k_id,
                        });
                    });
                }

                if (res.data.data.phrase) {
                    res.data.data.phrase.map((item) => {
                        phraselist.push({
                            check: false,
                            value: item.knowledge_point,
                            status: item.status,
                            code: item.k_id,
                        });
                    });
                }

                this.setState(() => ({
                    wordCheckList: [...wordlist],
                    phraseCheckList: [...phraselist],
                    wordAndPhraseSelectList: [],
                    wordAndPhraseCodeSelectList: [],
                    isCheckedAllPhrase: false,
                    isCheckedAllExpress: false,
                }));
            } else {
                //句子
                let expresslist = [];
                if (res.data.data) {
                    res.data.data.map((item) => {
                        expresslist.push({
                            check: false,
                            value: item.knowledge_point,
                            status: item.status,
                            code: item.k_id,
                        });
                    });
                }

                this.setState(() => ({
                    expressCheckList: [...expresslist],
                    expressCodeSelectList: [],
                    expressSelectList: [],
                    isCheckedAllPhrase: false,
                    isCheckedAllExpress: false,
                }));
            }
        });
    }
    getKnowledge = (kpg_type) => {
        switch (kpg_type) {
            case 1: //单词短语
                return this.renderChooserPhraseKnowledge();
        }
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    toDoHomework = () => {
        let item = this.props.navigation.state.params.data;
        // console.log('toDoHomework item',item)
        if (!item) return;
        switch (kpg_type) {
            case 1: //单词短语
                this.toHomeWork(kpg_type, mode, item);
                break;
            case 2: //句子
                if (+item.unit_code === "00") {
                    return;
                }
                this.toHomeWork(kpg_type, mode, item);
                break;
        }
    };

    toHomeWork = (kpg_type, mode, item) => {
        this.getKnowledge(kpg_type, mode, item);
    };
    /**
     *
     * @param {*} kpg_type  1.单词短语 2.句子
     * @param {*} mode  1:勾选知识点生成题 2：系统自推题
     */
    toSynEnByWordKnowledge = (kpg_type, mode) => {
        let item = this.props.navigation.state.params.data;
        const {
            wordAndPhraseSelectList,
            expressSelectList,
            expressCodeSelectList,
            wordAndPhraseCodeSelectList,
        } = this.state;
        if (!item || wordAndPhraseCodeSelectList.length === 0) {
            Toast.loading("请选择知识点", 1);
            return;
        }
        // Toast.loading('加载题目3', 1)

        if (kpg_type == 1) {
            NavigationUtil.toSynchronizeDiagnosisEn({
                ...this.props,
                data: {
                    exercise_origin: item.origin,
                    unit_name: item.unit_name,
                    mode,
                    kpg_type,
                    knowledgeList: wordAndPhraseSelectList,
                    knowledge_type: this.knowledge_type,
                    unit_code: item.unit_code,
                    codeList: wordAndPhraseCodeSelectList,
                    isUpload: true,
                    updatalist: () => {
                        if (this.false === true) return;
                        this.flag = true;
                        this.getlist();
                        this.isloading = true;
                    },
                },
            });
        } else if (kpg_type == 2) {
            NavigationUtil.toSynchronizeDiagnosisEn({
                ...this.props,
                data: {
                    exercise_origin: item.origin,
                    unit_name: item.unit_name,
                    mode,
                    kpg_type,
                    knowledgeList: expressSelectList,
                    knowledge_type: this.knowledge_type,
                    unit_code: item.unit_code,
                    codeList: expressCodeSelectList,
                    isUpload: true,
                    updatalist: () => {
                        if (this.false === true) return;
                        this.flag = true;
                        this.getlist();
                        this.isloading = true;
                    },
                },
            });
        }
    };

    checkSelectAllState = () => {
        const { wordCheckList, phraseCheckList } = this.state;
        let state = true;
        wordCheckList.forEach((item) => {
            if (!item.check) {
                state = false;
            }
        });
        phraseCheckList.forEach((item) => {
            if (!item.check) {
                state = false;
            }
        });
        this.setState(() => ({
            isCheckedAllPhrase: state,
        }));
    };

    setClickWordOrPhrase = (item) => {
        if (!item) return;
        const { wordAndPhraseSelectList, wordAndPhraseCodeSelectList } = this.state;
        let list = [...wordAndPhraseSelectList];
        if (item.check && list.indexOf(item.value) < 0) {
            list.push(item.value);
        } else if (!item.check && list.indexOf(item.value) > -1) {
            list.remove(item.value);
        }
        //code数组
        let codeList = [...wordAndPhraseCodeSelectList];
        if (item.check && codeList.indexOf(item.code) < 0) {
            codeList.push(item.code);
        } else if (!item.check && codeList.indexOf(item.code) > -1) {
            codeList.remove(item.code);
        }

        this.setState(() => ({
            wordAndPhraseSelectList: [...list],
            wordAndPhraseCodeSelectList: [...codeList],
        }));
        this.checkSelectAllState();
    };

    wordAndPhraseSelectAll = () => {
        const { wordCheckList, phraseCheckList, isCheckedAllPhrase } = this.state;
        //console.log('wordAndPhraseSelectAll',isCheckedAllPhrase)
        let list = [];
        let codeList = [];
        let wordlist = wordCheckList.map((item) => {
            item.check = isCheckedAllPhrase;
            if (isCheckedAllPhrase) {
                list.push(item.value);
                codeList.push(item.code);
            }
            return item;
        });
        let phraselist = phraseCheckList.map((item) => {
            item.check = isCheckedAllPhrase;
            if (isCheckedAllPhrase) {
                list.push(item.value);
                codeList.push(item.code);
            }
            return item;
        });

        this.setState(() => ({
            wordCheckList: [...wordlist],
            phraseCheckList: [...phraselist],
            wordAndPhraseSelectList: [...list],
            wordAndPhraseCodeSelectList: [...codeList],
        }));
    };

    checkExpressSelectAllState = () => {
        const { expressCheckList } = this.state;
        let state = true;
        expressCheckList.forEach((item) => {
            if (!item.check) {
                state = false;
            }
        });
        this.setState(() => ({
            isCheckedAllExpress: state,
        }));
    };

    setClickExpress = (item) => {
        if (!item) return;
        const { expressSelectList, expressCodeSelectList } = this.state;
        let list = [...expressSelectList];
        if (item.check && list.indexOf(item.value) < 0) {
            list.push(item.value);
        } else if (!item.check && list.indexOf(item.value) > -1) {
            list.remove(item.value);
        }

        let codeList = [...expressCodeSelectList];
        if (item.check && codeList.indexOf(item.code) < 0) {
            codeList.push(item.code);
        } else if (!item.check && codeList.indexOf(item.code) > -1) {
            codeList.remove(item.code);
        }
        this.setState(() => ({
            expressSelectList: [...list],
            expressCodeSelectList: [...codeList],
        }));
        this.checkExpressSelectAllState();
    };

    expressSelectAll = () => {
        const { expressCheckList, isCheckedAllExpress } = this.state;
        //console.log('expressSelectAll',isCheckedAllExpress)
        let list = [];
        let codeList = [];
        let expresslist = expressCheckList.map((item) => {
            item.check = isCheckedAllExpress;
            if (isCheckedAllExpress) {
                list.push(item.value);
                codeList.push(item.code);
            }
            return item;
        });

        this.setState(() => ({
            expressCheckList: [...expresslist],
            expressSelectList: [...list],
            expressCodeSelectList: [...codeList],
        }));
    };
    toRecord(type) {
        console.log("go record...");
        let kpg_type = type === "word" ? 1 : 2;
        NavigationUtil.toEnglishTestMeRecordList({
            ...this.props,
            data: {
                ...this.props.navigation.state.params.data,
                kpg_type: 1,
            },
        });
    }
    renderChooserPhraseKnowledge = () => {
        const { phraseCheckList, wordCheckList } = this.state;

        if (phraseCheckList.length <= 0 && wordCheckList.length <= 0)
            return (
                <Text style={{ fontSize: pxToDp(32) }}>
                    {this.isloading === true ? "" : "No Knowledge point"}
                </Text>
            );
        return (
            <View>
                <View
                    style={[
                        appStyle.flexTopLine,
                        appStyle.flexAliCenter,
                        appStyle.flexJusBetween,
                        {
                            height: pxToDp(70),
                            marginBottom: pxToDp(22),
                            position: "relative",
                        },
                    ]}
                >
                    <Text
                        style={[
                            { fontSize: pxToDp(40), color: "#AAAAAA", fontWeight: "bold" },
                        ]}
                    >
                        {"Words & Phrases"}
                    </Text>
                    <View style={[appStyle.flexLine, { position: "absolute", right: 0 }]}>
                        <Text
                            style={{
                                fontSize: pxToDp(40),
                                color: "#DC7F00",
                                fontWeight: "bold",
                            }}
                        >
                            Select all
                        </Text>
                        <CheckBox
                            style={{
                                flex: 1,
                                marginLeft: pxToDp(18),
                                marginEnd: pxToDp(18),
                                borderColor: "#FFEDCD",
                                borderWidth: pxToDp(3),
                            }}
                            onClick={() => {
                                //console.log('checkAllPhrase')
                                this.setState(
                                    () => ({
                                        isCheckedAllPhrase: !this.state.isCheckedAllPhrase,
                                    }),
                                    () => {
                                        this.wordAndPhraseSelectAll();
                                    }
                                );
                            }}
                            isChecked={this.state.isCheckedAllPhrase}
                            checkedImage={
                                <Image
                                    source={require("../../../images/englishHomepage/ic_checkbox_check.png")}
                                    style={{ width: 25, height: 25 }}
                                />
                            }
                            unCheckedImage={
                                <Image
                                    source={require("../../../images/englishHomepage/ic_checkbox_uncheck.png")}
                                    style={{ width: 25, height: 25 }}
                                />
                            }
                        ></CheckBox>
                    </View>
                </View>
                {/** 单词*/}
                <View style={[appStyle.flexLine, appStyle.flexLineWrap]}>
                    {wordCheckList.map((item, index) => {
                        let imgUrl = "";
                        if (item.status == 1) {
                            imgUrl = require("../../../images/englishHomepage/ic_excellent.png");
                        }
                        if (item.status == 2) {
                            imgUrl = require("../../../images/englishHomepage/ic_error.png");
                        }
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    item.check = !item.check;
                                    this.setClickWordOrPhrase(item);
                                }}
                                style={[
                                    styles.wordItem,
                                    appStyle.flexLine,
                                    (index + 1) % 4 === 0 ? { marginRight: 0 } : null,
                                    {
                                        borderColor: item.check ? "#FFB533" : "#FFEDCD",
                                        borderWidth: pxToDp(4),
                                    },
                                ]}
                                key={index}
                            >
                                <Text style={{ fontSize: pxToDp(40), marginLeft: pxToDp(21) }}>
                                    {item.value}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        position: "absolute",
                                        right: 0,
                                        alignItems: "center",
                                    }}
                                >
                                    {imgUrl === "" ? null : (
                                        <Image
                                            source={imgUrl}
                                            style={{ width: pxToDp(40), height: pxToDp(40) }}
                                        ></Image>
                                    )}
                                    <CheckBox
                                        style={{
                                            flex: 1,
                                            marginLeft: pxToDp(18),
                                            marginEnd: pxToDp(10),
                                            borderColor: "#FFEDCD",
                                            borderWidth: pxToDp(3),
                                        }}
                                        onClick={() => {
                                            item.check = !item.check;
                                            this.setClickWordOrPhrase(item);
                                        }}
                                        isChecked={item.check}
                                        checkedImage={
                                            <Image
                                                source={require("../../../images/englishHomepage/ic_checkbox_check.png")}
                                                style={{ width: 25, height: 25 }}
                                            />
                                        }
                                        unCheckedImage={
                                            <Image
                                                source={require("../../../images/englishHomepage/ic_checkbox_uncheck.png")}
                                                style={{ width: 25, height: 25 }}
                                            />
                                        }
                                    ></CheckBox>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {/** 短语*/}
                <View
                    style={[
                        appStyle.flexLine,
                        appStyle.flexLineWrap,
                        { marginTop: pxToDp(12) },
                    ]}
                >
                    {phraseCheckList.map((item, index) => {
                        let imgUrl = "";
                        if (item.status == 1) {
                            imgUrl = require("../../../images/englishHomepage/ic_excellent.png");
                        }
                        if (item.status == 2) {
                            imgUrl = require("../../../images/englishHomepage/ic_error.png");
                        }
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    item.check = !item.check;
                                    this.setClickWordOrPhrase(item);
                                }}
                                style={[
                                    styles.wordItem,
                                    appStyle.flexLine,
                                    (index + 1) % 4 === 0 ? { marginRight: 0 } : null,
                                    {
                                        borderColor: item.check ? "#FFB533" : "#FFEDCD",
                                        borderWidth: pxToDp(4),
                                    },
                                ]}
                                key={index}
                            >
                                <Text
                                    style={{
                                        fontSize: pxToDp(40),
                                        marginLeft: pxToDp(21),
                                        maxWidth: pxToDp(300),
                                    }}
                                >
                                    {item.value}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        position: "absolute",
                                        right: 0,
                                        alignItems: "center",
                                    }}
                                >
                                    <Image
                                        source={imgUrl}
                                        style={{ width: pxToDp(40), height: pxToDp(40) }}
                                    ></Image>
                                    <CheckBox
                                        style={{
                                            flex: 1,
                                            marginLeft: pxToDp(18),
                                            marginEnd: pxToDp(10),
                                            borderColor: "#FFEDCD",
                                            borderWidth: pxToDp(3),
                                        }}
                                        onClick={() => {
                                            item.check = !item.check;
                                            this.setClickWordOrPhrase(item);
                                        }}
                                        isChecked={item.check}
                                        checkedImage={
                                            <Image
                                                source={require("../../../images/englishHomepage/ic_checkbox_check.png")}
                                                style={{ width: 25, height: 25 }}
                                            />
                                        }
                                        unCheckedImage={
                                            <Image
                                                source={require("../../../images/englishHomepage/ic_checkbox_uncheck.png")}
                                                style={{ width: 25, height: 25 }}
                                            />
                                        }
                                    ></CheckBox>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };

    render() {
        const { kpg_type } = this.props.navigation.state.params.data;
        console.log(Platform.OS);
        return (
            <ImageBackground
                style={[styles.mainWrap, { width: "100%", height: "100%" }]}
                source={require("../../../images/englishHomepage/checkUnitBg.png")}
            >
                {Platform.OS === "ios" ? (
                    <View style={[{ marginTop: pxToDp(30) }]}></View>
                ) : (
                    <></>
                )}
                <View
                    style={[styles.header, appStyle.flexTopLine, appStyle.flexCenter]}
                >
                    <TouchableOpacity
                        style={[styles.btnBack]}
                        onPress={() => this.goBack()}
                    >
                        <Image
                            source={require("../../../images/englishHomepage/backBtn.png")}
                            style={[{ width: pxToDp(80), height: pxToDp(80) }]}
                        ></Image>
                    </TouchableOpacity>
                    <Text
                        style={[
                            { color: "#fff", fontSize: pxToDp(48), fontWeight: "bold" },
                        ]}
                    >
                        {this.props.navigation.state.params.data.unit_name}
                    </Text>
                    <View style={[styles.headRight, appStyle.flexLine]}>
                        <View style={[styles.titleItem, { marginRight: pxToDp(32) }]}>
                            <Image
                                source={require("../../../images/englishHomepage/ic_excellent.png")}
                                style={{
                                    width: pxToDp(44),
                                    height: pxToDp(44),
                                    marginRight: pxToDp(10),
                                }}
                            ></Image>
                            <Text
                                style={[
                                    {
                                        color: "#A0F06D",
                                        fontSize: pxToDp(27),
                                        fontWeight: "bold",
                                        marginEnd: pxToDp(10),
                                    },
                                ]}
                            >
                                Excellent
                            </Text>
                        </View>
                        <View style={styles.titleItem}>
                            <Image
                                source={require("../../../images/englishHomepage/ic_error.png")}
                                style={{
                                    width: pxToDp(44),
                                    height: pxToDp(44),
                                    marginRight: pxToDp(10),
                                }}
                            ></Image>
                            <Text
                                style={[
                                    {
                                        color: "#FD9A9A",
                                        fontSize: pxToDp(27),
                                        fontWeight: "bold",
                                        marginEnd: pxToDp(10),
                                    },
                                ]}
                            >
                                Try again
                            </Text>
                        </View>
                    </View>
                </View>
                <View
                    style={[
                        {
                            flex: 1,
                        },
                    ]}
                >
                    <ScrollView style={[styles.con]}>
                        <View style={{ paddingBottom: pxToDp(60) }}>
                            {this.isloading === true ? null : this.getKnowledge(kpg_type)}
                        </View>
                    </ScrollView>
                    <View
                        style={[
                            appStyle.flexCenter,
                            appStyle.flexTopLine,
                            { width: "100%", flex: 1 },
                        ]}
                    >
                        <TouchableOpacity onPress={this.toRecord.bind(this, "word")}>
                            <Image
                                style={[size_tool(240, 88), { marginRight: pxToDp(20) }]}
                                source={require("../../../images/englishHomepage/testMeRecord1.png")}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.toSynEnByWordKnowledge(1, 1);
                            }}
                        >
                            <Image
                                style={[size_tool(240, 80)]}
                                source={require("../../../images/englishHomepage/englishStudyCHeckType.png")}
                                resizeMode={"contain"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
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
        height:
            Platform.OS === "ios"
                ? Dimensions.get("window").height * 0.8
                : Dimensions.get("window").height * 0.75,
        maxHeight:
            Platform.OS === "ios"
                ? Dimensions.get("window").height * 0.8
                : Dimensions.get("window").height * 0.75,
        borderRadius: pxToDp(32),
        padding: pxToDp(40),
    },
    goDetailsBtn1: {
        width: pxToDp(240),
        height: pxToDp(64),
        backgroundColor: "#fff",
        textAlign: "center",
        lineHeight: pxToDp(64),
        borderRadius: pxToDp(32),
        marginLeft: pxToDp(48),
        marginEnd: pxToDp(48),
        marginBottom: pxToDp(48),
        fontSize: pxToDp(38),
        fontWeight: "bold",
    },
    goDetailsBtn2: {
        width: pxToDp(240),
        height: pxToDp(64),
        backgroundColor: "#fff",
        textAlign: "center",
        lineHeight: pxToDp(64),
        borderRadius: pxToDp(32),
        fontSize: pxToDp(38),
        fontWeight: "bold",
    },
    left: {
        width: pxToDp(600),
        height: pxToDp(898),
        backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        marginRight: pxToDp(48),
    },
    titleItem: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: pxToDp(36),
        width: pxToDp(218),
        height: pxToDp(72),
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    headRight: {
        position: "absolute",
        right: pxToDp(0),
    },
    btnBack: {
        position: "absolute",
        left: pxToDp(24),
    },
    wordItem: {
        width: pxToDp(449),
        // height: pxToDp(104),
        backgroundColor: "#FFEDCD",
        marginRight: pxToDp(24),
        marginBottom: pxToDp(24),
        borderRadius: pxToDp(16),
        minHeight: pxToDp(104),
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
