import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Platform,
} from "react-native";
import { appStyle, appFont } from "../../../../../theme";
import {
    size_tool,
    pxToDp,
    padding_tool,
    borderRadius_tool,
} from "../../../../../util/tools";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import api from "../../../../../util/http/api";
import axios from "../../../../../util/http/axios";
import { connect } from "react-redux";

import Good from "../../../../../component/chinese/reading/good";
import Exercise from "./components/exercise";

class DoWrongExerciseRead extends PureComponent {
    constructor(props) {
        super(props);
        this.info = this.props.userInfo.toJS();
        //console.log(
        // this.article_category = props.navigation.state.params.data.article_category;
        this.r_id = props.navigation.state.params.data.r_id;
        this.audio = React.createRef();
        this.articleAudio = React.createRef();
        this.state = {
            article: {},
            correct: "",
            answerIndex: -1,
            isShuffle: true,
            diagnose_notes: "",
            visible: false,
            explanation: "",
            helpVisible: false,
            helpImg: "",
            isStartAudio: false,
            exercise_type: "s", //默认阅读题
            goodVisible: false,
        };
    }
    componentDidMount() {
        axios.get(api.readExerciseDetail + `/${this.r_id}`).then((res) => {
            const data = res.data.data;
            // console.log("题", data);
            this.setState({
                article: data,
            });
        });
    }
    componentWillUnmount() { }
    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    nextTopic = (exercise, isKeyExercise) => {
        const { correct, answerIndex, article } = exercise;

        if (correct === "0") {
            // 做对了
            //console.log("对对对对对对对对对对");
            // Toast.success("恭喜你答对了 !!!", 1);
            this.setState(
                {
                    goodVisible: true,
                },
                () => {
                    setTimeout(() => {
                        this.setState({
                            goodVisible: false,
                        });
                    }, 1000);
                }
            );
            this.setState({
                isShuffle: true,
            });
        } else {
        }
    };

    render() {
        const { article, goodVisible } = this.state;
        return (
            <ImageBackground
                source={require("../../../../../images/chineseHomepage/reading/homeBg.png")}
                style={[
                    { flex: 1 },
                    padding_tool(Platform.OS === "ios" ? 60 : 0, 20, 0, 20),
                ]}
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
                    onPress={this.goBack}
                >
                    <Image
                        style={[size_tool(120, 80)]}
                        source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
                    />
                </TouchableOpacity>

                <View style={styles.topaicCard}></View>
                <View style={[{ flex: 1 }]}>
                    {article.content?.length > 0 ? (
                        <Exercise
                            {...this.props}
                            article={{ ...article, exercise_type: "s" }}
                            nextNow={this.nextTopic}
                            isKeyExercise={false}
                        />
                    ) : null}
                </View>
                {goodVisible ? <Good /> : null}
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    left: {
        width: pxToDp(1100),
        height: "100%",
        backgroundColor: "#fff",
        ...borderRadius_tool(32, 32, 0, 0),
        marginRight: pxToDp(40),
    },
    right: {
        backgroundColor: "#fff",
        position: "relative",
        height: "100%",
        ...borderRadius_tool(32, 32, 0, 0),
        flex: 1,
        ...padding_tool(40, 40, 0, 40),
    },
    aiticleTitle: {
        textAlign: "center",
        fontSize: pxToDp(40),
    },
    option: {
        width: pxToDp(56),
        height: pxToDp(56),
        borderRadius: pxToDp(26),
        borderWidth: pxToDp(2),
        borderColor: "#AAAAAA",
        color: "#AAAAAA",
        marginRight: pxToDp(24),
    },
    isActive: {
        backgroundColor: "#FC6161",
        color: "#fff",
        borderColor: "#FC6161",
        borderRadius: pxToDp(26),
    },
    nextBtn: {
        ...size_tool(336, 100),
        borderRadius: pxToDp(50),
        backgroundColor: "#F07C39",
        paddingBottom: pxToDp(8),
    },
    nextText: {
        color: "#fff",
        fontSize: pxToDp(28),
    },
    helpBtn: {
        position: "absolute",
        top: pxToDp(-40),
        right: pxToDp(0),
    },
    topaicCard: {
        width: "100%",
        height: pxToDp(160),
        // borderRadius: pxToDp(32),
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    articleTitle: {
        width: "100%",
        borderRadius: pxToDp(40),
        backgroundColor: "#F3F4F9",
        ...appStyle.flexTopLine,
        minHeight: pxToDp(140),
        alignItems: "center",
        ...padding_tool(10, 20, 10, 20),
        marginBottom: pxToDp(20),
    },
});
const mapStateToProps = (state) => {
    // 取数据
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    // 存数据
    return {};
};
export default connect(mapStateToProps, mapDispathToProps)(DoWrongExerciseRead);
