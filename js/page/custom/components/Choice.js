import React, { Component } from "react";
import { StyleSheet, View,Text,TouchableOpacity,Image} from "react-native";
import { pxToDp } from "../../../util/tools";
import Audio from "../../../util/audio/audio"
import url from "../../../util/url";
import { appFont, appStyle } from "../../../theme";
import * as _ from "lodash";
import { Toast } from "antd-mobile-rn";
import RichShowView from '../../../component/richShowViewNew'
import TextView from '../../../component/math/FractionalRendering/TextView_new'

const log = console.log.bind(console)

const ZIMU_MAP = {
    0:'A',
    1:'B',
    2:'C',
    3:'D',
    4:'E',
    5:'F',
    6:'G',
    7:'H',
    8:'I',
    9:'J',
    10:'K',
    11:'L',
    12:'A',
    13:'M',
    14:'N',
    15:'O',
    16:'P',
    17:'Q',
    18:'R',
    19:'S',
    20:'T',
}

export default class Choice extends Component {
    constructor(props) {
        super(props);
        this.audioRef = undefined
        this.state = {
            option_index_arr:[]
        }
    }

    init = () => {
        this.setState({
            option_index_arr:[]
        })
    }

    diagnosis = () => {
        const {option_index_arr} = this.state
        const {topic} = this.props
        const {choice_content, answerList,alias,topic_type} = topic
        let options = []
        Array.isArray(choice_content)?options = choice_content:options = choice_content.split('#')
        let my_answer = []
        options.forEach((i,x) => {
            if(option_index_arr.indexOf(x) > -1) my_answer.push(options[x])
        })
        if(alias === 'math_cleverCalculation' && topic_type === '1'){
            my_answer = [ZIMU_MAP[option_index_arr[0]]]
        }
        console.log('我的答案::::::::::::::', my_answer)
        // 清空渲染数据
        this.init()
        return {
            correction: _.isEqual(_.sortBy(my_answer), _.sortBy(answerList))? 1: 0,
            answer_content: _.isEmpty(my_answer.join('#'))? "#": my_answer.join('#')
        }
    }

    selectOption = (i,x) => {
        const {topic} = this.props
        const {option_index_arr} = this.state
        const {exercise_type,canChooseNum} = topic
        let _o = _.cloneDeep(option_index_arr)
        if(option_index_arr.indexOf(x) > -1){
            _o.splice(option_index_arr.indexOf(x),1)
            this.setState({
                option_index_arr:_o
            })
            return
        }
        if(exercise_type === '2'){
            // 多选
            if(canChooseNum && _o.length === canChooseNum){
                Toast.info('最多只能选择3个哟',1)
            }else{
                _o.push(x)
            }
        }else{
            _o = [x]
        }
        // console.log('ppppp',_o)
        this.setState({
            option_index_arr:_o
        })
    }

    renderStem = () => {
        const {topic} = this.props
        const RICH_STEM_TYPE = ['chinese_toPinyinHome','chinese_toWisdomTree','chinese_toChooseText','english_toSelectUnitEn2','english_toSelectUnitEn1', 'math_thinkingTraining']
        const {stem,alias,topic_type} = topic
        if(RICH_STEM_TYPE.indexOf(alias) > -1){
            return <RichShowView
                size={4}
                value={
                    `<div id="yuantiBold" >${stem}</div>`}
            ></RichShowView>
        }
        if(alias === 'math_cleverCalculation' && topic_type === '1'){
            return <TextView value={stem} txt_style={[{color:"#2D3040",fontSize:pxToDp(44)},appFont.fontFamily_jcyt_700]} fraction_border_style={[{ borderBottomColor: '#2D3040',borderBottomWidth:pxToDp(6) }]}></TextView>
        }

        return <Text style={[{color:"#2D3040",fontSize:pxToDp(48)},appFont.fontFamily_jcyt_700]}>{stem}</Text>
    }

    renderOptionContent = (i,x) => {
        const {topic} = this.props
        const {alias,choice_content_type,topic_type} = topic
        if((alias === 'english_toSelectUnitEn1' || alias === 'english_toSelectUnitEn2') && choice_content_type === 'image'){
            return <View style={[appStyle.flexLine]}>
                <Text style={[{color:'#2D3040',fontSize:pxToDp(36)},appFont.fontFamily_jcyt_700]}>{ZIMU_MAP[x]}.</Text>
                <View style={[{padding:pxToDp(20)}]}>
                    <Image resizeMode='contain' style={{width:pxToDp(300),height:pxToDp(300)}} source={{ uri: url.baseURL + i }}></Image>
                </View>
            </View>
        }
        if(alias === 'math_cleverCalculation' && topic_type === '1'){
            return <View style={[appStyle.flexLine]}>
                <Text style={[{color:'#2D3040',fontSize:pxToDp(36)},appFont.fontFamily_jcyt_700]}>{ZIMU_MAP[x]}.</Text>
                <TextView value={i} txt_style={[{color:"#2D3040",fontSize:pxToDp(36)},appFont.fontFamily_jcyt_700]} fraction_border_style={[{ borderBottomColor: '#2D3040',borderBottomWidth:pxToDp(5) }]}></TextView>
            </View>
        }
        return <Text style={[{color:'#2D3040',fontSize:pxToDp(36)},appFont.fontFamily_jcyt_700]}>{ZIMU_MAP[x]}.{i}</Text>
    }

    render() {
        const {option_index_arr} = this.state
        const {topic} = this.props
        const {stem_audio,choice_content,private_stem_audio,topic_type,alias} = topic
        let options = []
        Array.isArray(choice_content)?options = choice_content:options = choice_content.split('#')

        return (
            <View style={[styles.container]}>
                {/* <View style={[appStyle.flexLine]}> */}
                {stem_audio ? <TouchableOpacity onPress={()=>{
                    this.audioRef && this.audioRef.onPlay()
                }}>
                    <Audio
                        audioUri={`${url.baseURL}${stem_audio}`}
                        pausedBtnImg={require("../../../images/english/abcs/titlePanda.png")}
                        pausedBtnStyle={{ width: pxToDp(169), height: pxToDp(152) }}
                        playBtnImg={require("../../../images/english/abcs/titlePanda.png")}
                        playBtnStyle={{ width: pxToDp(169), height: pxToDp(152) }}
                        rate={0.75}
                        onRef={(ref) => { this.audioRef = ref }}
                    />
                    {this.renderStem()}
                </TouchableOpacity> : this.renderStem()}
                {/* </View> */}
                {private_stem_audio? <View>
                    <Audio
                        audioUri={`${url.baseURL}${private_stem_audio}`}
                        pausedBtnImg={require("../../../images/custom/audio_btn_3.png")}
                        pausedBtnStyle={{ width: pxToDp(260), height: pxToDp(100) }}
                        playBtnImg={require("../../../images/custom/audio_btn_2.png")}
                        playBtnStyle={{ width: pxToDp(260), height: pxToDp(100) }}
                    />
                </View>:null}
                <View style={[appStyle.flexLine,appStyle.flexLineWrap]}>
                   {options.map((i,x) => {
                        let active = option_index_arr.indexOf(x) > -1
                        return <TouchableOpacity key={x} style={[styles.option,active?{backgroundColor:"#FFB649"}:null]} onPress={()=>{
                            this.selectOption(i,x)
                        }}>
                            <View style={[styles.option_inner,active?{backgroundColor:'#FFDB5D'}:null]}>
                                {this.renderOptionContent(i,x)}
                            </View>
                        </TouchableOpacity>
                   })}
                </View>
            </View>
        );
      }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    option:{
        marginRight:pxToDp(40),
        paddingBottom:pxToDp(8),
        backgroundColor:'#E7E7F2',
        borderRadius:pxToDp(40),
        marginBottom:pxToDp(40)
    },
    option_inner:{
        paddingLeft:pxToDp(40),
        paddingRight:pxToDp(40),
        minHeight:pxToDp(124),
        backgroundColor:"#F5F5FA",
        borderRadius:pxToDp(40),
        ...appStyle.flexJusCenter
    }
});
