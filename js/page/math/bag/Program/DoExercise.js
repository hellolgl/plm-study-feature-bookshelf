import React, { PureComponent } from "react"
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    ActivityIndicator,
    Dimensions,
    ScrollView,
    DeviceEventEmitter
} from "react-native"
import { pxToDp } from "../../../../util/tools"
import { appFont, appStyle } from "../../../../theme"
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil"
import axios from '../../../../util/http/axios'
import api from '../../../../util/http/api'
import { Toast } from "antd-mobile-rn";
import * as _ from "lodash";
import SyntaxHighlighter from 'react-native-syntax-highlighter'
import { qtcreatorDark } from 'react-syntax-highlighter/styles/hljs'
import RichShowViewHtml from '../../../../component/math/RichShowViewHtml'
import StatisticsModal from './components/StatisticModal'
import TopicCard from './components/TopicCard'
import PlayAudio from '../../../../util/audio/playAudio'
import url from '../../../../util/url'
import BackBtn from "../../../../component/math/BackBtn"
import { connect } from "react-redux";
import {getRewardCoinLastTopic} from '../../../../util/coinTools'
import * as actionCreatorsUserInfo from "../../../../action/userInfo";

const OPTIONS_INDEX_MAP = {
    0:'A',
    1:'B',
    2:'C',
    3:'D',
}

const audiolist = ['pinyin_new/pc/audio/good.mp3','pinyin_new/pc/audio/good2.mp3', 'pinyin_new/pc/audio/good3.mp3']

class DoExercise extends PureComponent {
    constructor(props) {
        super(props)
        this.a_id = this.props.navigation.state.params.data.a_id
        this.submitThrottle = _.debounce(this.submit, 300);
        this.nextThrottle = _.debounce(this.next, 300);
        this.eventListener = undefined
        this.w_num = 0
        this.state = {
            index_list:[],
            loading:true,
            topicIndex:-1,
            currentTopic:{},
            topic:{},
            option_index:-1,
            visible:false
        }
    }

    goBack = () => {
        MathNavigationUtil.goBack(this.props);
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit("refreshPage"); //返回 上一个页面刷新
        DeviceEventEmitter.emit("refreshHomePage"); //返回 首页页面刷新
    }

    componentDidMount(){
        this.getIndex()
    }

    getIndex = () =>{
        axios.get(api.getProgramTopicIndex,{params:{a_id:this.a_id}}).then(res=>{
            if(res.data.data.length > 0){
                let index_list = []
                res.data.data.forEach((i,x) => {
                    index_list.push({
                        id:i,
                        correct:-1  //-1 未答题 0 错误 1 正确
                    })
                })
                this.setState({
                    index_list,
                    topicIndex:0
                },()=>{
                    this.getTopicData()
                })
            }
        }).finally(()=>{
            this.setState({
                loading:false
            })
        })
    }

    selectIndex = (i,x) => {
        this.setState({
            topicIndex:x,
            option_index:-1
        },()=>{
            this.getTopicData()
        })
    }

    getTopicData = () => {
        const {index_list,topicIndex,topic} = this.state
        const id = index_list[topicIndex].id
        let _t = JSON.parse(JSON.stringify(topic))
        if(!_t[topicIndex]){
            // 没有拿过这道题才请求数据
            axios.get(api.getProgramTopic,{params:{id}}).then(res => {
                _t[topicIndex] = res.data.data
                this.setState({
                    topic:_t
                })
            })
        }
    }

    selectOption = (i,x) => {
        const {index_list,topicIndex} = this.state
        if(index_list[topicIndex].correct > -1) return  //已经作答过，不能在选择
        this.setState({
            option_index:x,
        })
    }

    renderOptions = (currentTopic) => {
        const {option_index} = this.state
        const {option,my_answer_index,correct} = currentTopic
        return <View style={[appStyle.flexLine,appStyle.flexLineWrap,appStyle.flexJusBetween,Platform.OS === 'ios'?{marginBottom:pxToDp(40)}:{marginBottom:pxToDp(20)}]}>
            {option.map((i,x) => {
                let option_item_correct_style = {}
                let option_item_inner_correct_style = {}
                let show_icon = false
                let icon_img = ''
                if(my_answer_index === x && correct > -1){
                    show_icon = true
                    if(correct){
                        option_item_correct_style = {backgroundColor:"#009076"}
                        option_item_inner_correct_style = {backgroundColor:"#00C288"}
                        icon_img = require('../../../../images/mathProgramming/gou_icon.png')
                    }else{
                        option_item_correct_style = {backgroundColor:"#DF4A4A"}
                        option_item_inner_correct_style = {backgroundColor:"#F2645B"}
                        icon_img = require('../../../../images/mathProgramming/cha_icon.png')
                    }
                }
                return <TouchableOpacity style={[styles.option_item,x%2>0?{marginRight:0}:null,option_index === x?{backgroundColor:"#FFB649"}:null,option_item_correct_style]} key={x} onPress={()=>{
                    this.selectOption(i,x)
                }}>
                    <View style={[styles.option_item_inner,option_index === x?{backgroundColor:"#FFDB5D"}:null,option_item_inner_correct_style]}>
                        <Text style={[{color:"#fff",fontSize:pxToDp(36)},appFont.fontFamily_jcyt_700,option_index === x && correct === -1?{color:"#2D2D40"}:null]}>{OPTIONS_INDEX_MAP[x]}. {i}</Text>
                        {show_icon?<Image style={[{width:pxToDp(40),height:pxToDp(40)}]} source={icon_img}></Image>:null}
                    </View>
                </TouchableOpacity>
            })}
        </View>
    }

    submit = () => {
        const {token} = this.props
        if(!token){
            MathNavigationUtil.resetToLogin(this.props);
            return
        }
        const {option_index,topic,topicIndex,index_list} = this.state
        const currentTopic = topic[topicIndex]
        const {option,answer} = currentTopic
        if(!option[option_index]){
            Toast.info('请选择答案',1)
            return
        }
        const my_answer = option[option_index].replace(/\s*/g,"")
        const topic_answer = answer.replace(/\s*/g,"")
        console.log('诊断________','我的答案',my_answer,'正确答案',topic_answer, my_answer === topic_answer)
        let result = my_answer === topic_answer
        let _i = JSON.parse(JSON.stringify(index_list))
        let _t = JSON.parse(JSON.stringify(topic))
        _i[topicIndex].correct = result?1:0
        _t[topicIndex].correct = result?1:0
        _t[topicIndex].my_answer_index = option_index
        this.saveData(result?1:0,currentTopic.id)
        if(result){
            PlayAudio.playSuccessSound(url.successAudiopath2)
        }else{
            PlayAudio.playSuccessSound(url.failAudiopath)
        }
        this.setState({
            index_list:_i,
            topic:_t
        },()=>{
            if(result){
                // 答对跳下一题
                // this.next()
            }else{
                this.w_num += 1
            }
        })
    }
    getTopicIndex = () => {
        const {index_list} = this.state
        let index = -1
        for(let i=0 ; i<index_list.length; i++) {
            if(index_list[i].correct === -1){
                index = i
                break
            }
        }
        return index
    }
    next = () => {
        let _topicIndex = this.getTopicIndex()
        if(_topicIndex === -1){
            // 已完成最后一道题
            this.setState({
                visible:true
            })
            return
        }
        this.setState({
            topicIndex:_topicIndex,
            option_index:-1
        },()=>{
            this.getTopicData()
        })
    }

    saveData = (correct,id) => {
        let params = {
            correct,
            id
        }
        axios.post(api.saveProgramTopic, params).then((res) => {
            console.log('保存————————————————————————',res.data)
            if(correct === 1){
                if(this.getTopicIndex() === -1){
                    getRewardCoinLastTopic().then(res => {
                        if(res.isReward){
                          // 展示奖励弹框,在动画完后在弹统计框
                            this.eventListener = DeviceEventEmitter.addListener(
                                "rewardCoinClose",
                                () => {
                                    this.next()
                                    this.eventListener && this.eventListener.remove()
                                }
                            );
                        }else{
                            this.next()
                        }
                    })
                }else{
                    this.props.getRewardCoin()
                    this.next()
                }
            }
        });
    }

    render() {
        const {loading,index_list,topic,topicIndex,visible} = this.state
        const currentTopic = topic[topicIndex]
        const currentTopicIndex = index_list[topicIndex]
        console.log('当前题目——————————',currentTopic)
        return (
            <ImageBackground style={[styles.container]} source={require('../../../../images/mathProgramming/bg_1.png')}>
                <View style={[styles.header]}>
                    <BackBtn goBack={this.goBack}></BackBtn>
                    <View>
                        <TopicCard index_list={index_list} topicIndex={topicIndex} selectIndex={this.selectIndex}></TopicCard>
                    </View>
                </View>
                <View style={[styles.content]}>
                    {loading?<ActivityIndicator size="large" color="#4F99FF" />:index_list.length === 0?<Text style={[{color:"#A3A3CC",fontSize:pxToDp(40)},appFont.fontFamily_jcyt_700]}>暂无数据</Text>:<>
                        <View style={[styles.content_inner]}>
                            <ScrollView contentContainerStyle={[{padding:pxToDp(60)}]}>
                                {currentTopic?<>
                                    <Text style={[{color:"#fff",fontSize:pxToDp(48)},appFont.fontFamily_jcyt_700,{marginBottom:Platform.OS === 'android'?pxToDp(20):pxToDp(60)}]}>{currentTopic.stem}</Text>
                                    <View style={[{width:'88%'}]}>
                                        {this.renderOptions(currentTopic)}
                                        {currentTopicIndex.correct > -1? <RichShowViewHtml value={currentTopic.thinking_analysis} size={40} color={currentTopicIndex.correct === 1?'#16C792':'#F2645B'} p_style={{lineHeight:pxToDp(70)}}></RichShowViewHtml>:null}
                                        {currentTopicIndex.correct === 0?<View style={[{marginTop:Platform.OS === 'ios'?pxToDp(60):pxToDp(20),marginBottom:Platform.OS === 'ios'?pxToDp(60):pxToDp(20)}]}>
                                            <Text style={[styles.title]}>正确答案：</Text>
                                            <Text style={[{color:"#A3A3CC",fontSize:pxToDp(40)},appFont.fontFamily_jcyt_500,Platform.OS === 'android'?{marginTop:pxToDp(-20)}:null]}>{currentTopic.answer}</Text>
                                        </View>:null}
                                        <Text style={[styles.title]}>编程思维：</Text>
                                        <View style={[{backgroundColor:"#000000",padding:pxToDp(20),borderRadius:pxToDp(40)}]}>
                                            <SyntaxHighlighter fontSize={Platform.OS === 'android'?pxToDp(26):pxToDp(36)} language="python" highlighter={'hljs'} style={qtcreatorDark}>
                                                {currentTopic.program_analysis}
                                            </SyntaxHighlighter>
                                        </View>
                                    </View>
                                </>:null}
                            </ScrollView>
                            {currentTopicIndex.correct > -1? <TouchableOpacity style={[styles.next_btn]} onPress={this.nextThrottle}>
                                <View style={[styles.next_btn_inner]}>
                                    <Text style={[appFont.fontFamily_jcyt_700,{color:"#2D2D40",fontSize:pxToDp(40)}]}>下一题</Text>
                                </View>
                            </TouchableOpacity>: <TouchableOpacity style={[styles.next_btn]} onPress={this.submitThrottle}>
                                <View style={[styles.next_btn_inner]}>
                                    <Text style={[appFont.fontFamily_jcyt_700,{color:"#2D2D40",fontSize:pxToDp(40)}]}>提交</Text>
                                </View>
                            </TouchableOpacity>}
                        </View>
                    </>}
                </View>
                <StatisticsModal correct={index_list.length - this.w_num} wrong={this.w_num} visible={visible} close={()=>{
                    this.setState({
                        visible:false
                    },()=>{
                        this.goBack()
                    })
                }}></StatisticsModal>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    header:{
        height:pxToDp(120),
        ...appStyle.flexCenter,
    },
    content:{
        flex:1,
        ...appStyle.flexCenter,
        paddingLeft:pxToDp(80),
        paddingRight:pxToDp(80),
        paddingBottom:pxToDp(60),
        paddingTop:pxToDp(20)
    },
    content_inner:{
        flex:1,
        width:'100%',
        backgroundColor:"#2D2D40",
        borderRadius:pxToDp(40)
    },
    next_btn:{
        width:pxToDp(200),
        height:pxToDp(200),
        backgroundColor:'#FFB649',
        borderRadius:pxToDp(100),
        paddingBottom:pxToDp(8),
        position:'absolute',
        right:pxToDp(40),
        bottom:pxToDp(40)
    },
    next_btn_inner:{
        flex:1,
        backgroundColor:"#FFDB5D",
        borderRadius:pxToDp(100),
        ...appStyle.flexCenter
    },
    option_item:{
        width:pxToDp(750),
        height:pxToDp(124),
        backgroundColor:"#3A3A59",
        marginRight:pxToDp(40),
        marginBottom:pxToDp(40),
        paddingBottom:pxToDp(8),
        borderRadius:pxToDp(40)
    },
    option_item_inner:{
        flex:1,
        backgroundColor:"#474766",
        borderRadius:pxToDp(40),
        ...appStyle.flexJusCenter,
        paddingLeft:pxToDp(40),
        paddingRight:pxToDp(40),
        ...appStyle.flexLine,
        ...appStyle.flexJusBetween
    },
    title:{
        color:"#A3A3CC",
        fontSize:pxToDp(48),
        ...appFont.fontFamily_jcyt_700,
        marginBottom:Platform.OS === 'android'?pxToDp(10):pxToDp(20)
    },
    modal_container:{
        flex:1,
        backgroundColor:"rgba(76, 76, 89, .6)",
        ...appStyle.flexCenter
    }
})

const mapStateToProps = (state) => {
    return {
      token: state.getIn(["userInfo", "token"])
    };
  };
  
  const mapDispathToProps = (dispatch) => {
    return {
        getRewardCoin() {
            dispatch(actionCreatorsUserInfo.getRewardCoin());
        },
    };
  };
  
  export default connect(mapStateToProps, mapDispathToProps)(DoExercise);
