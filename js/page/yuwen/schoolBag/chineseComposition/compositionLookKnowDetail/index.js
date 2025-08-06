import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Animated
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { pxToDp, padding_tool, size_tool, borderRadius_tool } from "../../../../../util/tools";
import { appStyle } from "../../../../../theme";
import KnowledgeTreeModal from '../../../../../component/chinese/chineseCompositionExercise/KnowledgeTreeModal'
import RichShowView from "../../../../../component/chinese/RichShowView";
// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            knowDetail: {},
            word: this.props.navigation.state.params.data.knowledge_point,
            type: this.props.navigation.state.params.data.knowledge_type
        };
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
        // this.props.navigation.goBack(this.props.navigation.state.params.data.homeKey)
    };


    componentDidMount() {
        this.getlist()
    }
    getlist = () => {

        axios.get(api.getCompositionKnowDetail, {
            params: {
                ...this.props.navigation.state.params.data
            }
        }).then((res) => {
            if (res.data?.err_code === 0) {
                this.setState({
                    knowDetail: res.data.data
                })
            }
        });
    }

    renderword = () => {
        const { knowDetail, word } = this.state
        const nameList = {
            "knowledge_point": "知识点",
            "knowledge_type": "知识点类型",
            "classify_tag": "知识点标签",
            "pinyin_2": "拼音",
            "order": "笔顺",
            "structure": "结构",
            "meaning": "意思",
            "word_property_1": "词性1",
            "word_property_2": "词性2",
            "word_property_3": "词性3",
            "word_type1": "词语分类1",
            "word_type2": "词语分类2",
            "word_synonym": "近义词",
            "word_antonym": "反义词",
            "word_idiom": "相关句子",
            "word_confusing": "易混淆词",
            "picture": "图片",
            "pinyin_1": "音频",
            "video": "视频",
            // "status": "状态",
            // "origin": "origin",
            "wb_id": "编号",
        }

        return <View style={[padding_tool(0, 64, 40, 64)]}>
            <View style={[appStyle.flexTopLine, styles.borderstyle, { width: '100%', height: pxToDp(240), marginBottom: pxToDp(52) }]}>
                <View style={[{ width: pxToDp(1300), }, padding_tool(60, 0, 0, 39), styles.wordMain]}>
                    <Image
                        style={[size_tool(177, 68), styles.wordTitle]}
                        source={require('../../../../../images/chineseHomepage/knowDetail/knowledge_point.png')}
                    />
                    <View style={[appStyle.flexTopLine]}>
                        {
                            word.split('').map((item, index) => {
                                return <ImageBackground
                                    style={[size_tool(122), appStyle.flexCenter, { marginRight: pxToDp(22) }]}
                                    source={require('../../../../../images/chineseHomepage/knowDetail/wordBg.png')}
                                    key={index}
                                >
                                    <Text style={[{ fontSize: pxToDp(90), color: '#FF4342' }]}>{item}</Text>
                                </ImageBackground>
                            })
                        }
                    </View>
                </View>

                <View style={[{ width: pxToDp(400), }, padding_tool(60, 0, 0, 39), styles.wordMain]}>
                    <Image
                        style={[size_tool(177, 68), styles.wordTitle]}
                        source={require('../../../../../images/chineseHomepage/knowDetail/pinyin_2.png')}
                    />
                    <Text style={[styles.wordFont]}>【{knowDetail?.pinyin_2}】</Text>
                </View>
                <View style={[{ width: pxToDp(200), }, padding_tool(60, 0, 0, 39), styles.wordMain]}>
                    <Image
                        style={[size_tool(177, 68), styles.wordTitle]}
                        source={require('../../../../../images/chineseHomepage/knowDetail/structure.png')}
                    />
                    <Text style={[styles.wordFont]}>{knowDetail?.structure}</Text>
                </View>


            </View>
            <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
                <View style={[appStyle.flexJusBetween]}>
                    <View style={[size_tool(450, 270), padding_tool(60, 20, 0, 20), styles.borderstyle, styles.wordMain]}>
                        <Image
                            style={[size_tool(177, 68), styles.wordTitle]}
                            source={require('../../../../../images/chineseHomepage/knowDetail/word_synonym.png')}
                        />
                        <ScrollView>
                            <Text style={[styles.wordFont]}>{knowDetail?.word_synonym}</Text>
                        </ScrollView>
                    </View>
                    <View style={[size_tool(450, 270), padding_tool(60, 20, 0, 20), styles.borderstyle, styles.wordMain]}>
                        <Image
                            style={[size_tool(177, 68), styles.wordTitle]}
                            source={require('../../../../../images/chineseHomepage/knowDetail/word_antonym.png')}
                        />
                        <ScrollView>
                            <Text style={[styles.wordFont]}>{knowDetail?.word_antonym}</Text>
                        </ScrollView>
                    </View>
                </View>
                <View>
                    <View style={[size_tool(862, 590), padding_tool(60, 20, 0, 20), styles.borderstyle, styles.wordMain]}>
                        <Image
                            style={[size_tool(177, 68), styles.wordTitle]}
                            source={require('../../../../../images/chineseHomepage/knowDetail/meaning.png')}
                        />
                        <ScrollView>
                            <Text style={[styles.wordFont]}>{knowDetail?.meaning}</Text>
                        </ScrollView>
                    </View>
                </View>
                <View style={[appStyle.flexJusBetween]}>
                    <View style={[size_tool(480, 270), padding_tool(60, 20, 0, 20), styles.borderstyle, styles.wordMain]}>
                        <Image
                            style={[size_tool(177, 68), styles.wordTitle]}
                            source={require('../../../../../images/chineseHomepage/knowDetail/word_idiom.png')}
                        />
                        <ScrollView>
                            <Text style={[styles.wordFont]}>{knowDetail?.word_idiom}</Text>
                        </ScrollView>
                    </View>
                    <View style={[size_tool(480, 270), padding_tool(60, 20, 0, 20), styles.borderstyle, styles.wordMain]}>
                        <Image
                            style={[size_tool(177, 68), styles.wordTitle]}
                            source={require('../../../../../images/chineseHomepage/knowDetail/word_confusing.png')}
                        />
                        <Text style={[styles.wordFont]}>{knowDetail?.word_confusing}</Text>
                    </View>
                </View>
            </View>
        </View>
    }
    rendersentence = () => {
        const { knowDetail, word } = this.state
        return <View style={[appStyle.flexAliCenter]}>
            <View style={[size_tool(1872, 240), padding_tool(60, 20, 0, 20), styles.borderstyle, styles.wordMain, { marginBottom: pxToDp(60) }]}>
                <Image
                    style={[size_tool(177, 68), styles.wordTitle]}
                    source={require('../../../../../images/chineseHomepage/knowDetail/sentence.png')}
                />
                <ScrollView>
                    <Text style={[styles.wordFont]}>{word}</Text>
                </ScrollView>
            </View>
            <View style={[size_tool(1872, 590), padding_tool(60, 20, 0, 20), styles.borderstyle, styles.wordMain]}>
                <Image
                    style={[size_tool(177, 68), styles.wordTitle]}
                    source={require('../../../../../images/chineseHomepage/knowDetail/meaning.png')}
                />
                <ScrollView>
                    <Text style={[styles.wordFont]}>{knowDetail?.meaning}</Text>
                </ScrollView>
            </View>
        </View>
    }
    render() {
        const { type } = this.state
        return (
            <ImageBackground
                style={styles.wrap}
                source={require('../../../../../images/chineseHomepage/flowBigBg.png')}
            >
                <View style={[padding_tool(32, 64, 40, 64)]}>
                    <TouchableOpacity onPress={this.goBack}>
                        <Image
                            source={require('../../../../../images/chineseHomepage/wrongTypeGoback.png')}
                            style={[size_tool(80)]}
                        />
                    </TouchableOpacity>
                </View>
                <View style={[{ flex: 1 }, appStyle.flexCenter]}>
                    {
                        type === '2' ? this.renderword() : this.rendersentence()
                    }
                </View>

            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: '#F8CE8D'
    },
    borderstyle: {
        borderRadius: pxToDp(32),
        borderWidth: pxToDp(8),
        borderColor: '#F9AD63',
        backgroundColor: '#FFFBF2'
    },
    wordMain: {
        position: 'relative',
    },
    wordTitle: {
        position: 'absolute',
        top: pxToDp(-28), left:
            pxToDp(30)
    },
    wordFont: {
        fontSize: pxToDp(32)
    }
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
