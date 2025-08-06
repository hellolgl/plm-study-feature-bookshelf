import React, { Component } from "react";
import {
    Image,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    DeviceEventEmitter,
    Platform
} from "react-native";
import {
    pxToDp,
    getHeaderPadding
} from "../../../../../util/tools"
import { appStyle, appFont } from "../../../../../theme"
import NavigationUtil from "../../../../../navigator/NavigationUtil"
import MathNavigationUtil from "../../../../../navigator/NavigationMathUtil"
import axios from '../../../../../util/http/axios'
import api from '../../../../../util/http/api'
export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.t_t_id = this.props.navigation.state.params.data.t_t_id
        this.title = this.props.navigation.state.params.data.label
        this.state = {
            statistic:{}
        }
    }
    componentDidMount() {
        this.getData()
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener('refreshPage', () => {
          this.getData()
        })
      }
      componentWillUnmount(){
        this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove()
      }
    getData = ()=>{
        let obj = {
            t_t_id:this.t_t_id
        }
        axios.get(api.getMathThinkingComprehensiveStatistic, { params: obj }).then(
            res => {
                let statistic = {...res.data.data}
                statistic._rate = 0
                if(statistic.count > 0) statistic._rate = Math.round(statistic.right/statistic.count * 100)
                this.setState({
                    statistic
                })
            }
        )
    }
    goBack = () => {
        NavigationUtil.goBack(this.props)
    }
    toDoExercise = ()=>{
        MathNavigationUtil.toMathTTComprehensiveDoExercise({...this.props, data: {t_t_id:this.t_t_id}})
    }
    render() {
        const {statistic} = this.state
        console.log("will render home page")
        return ( 
            <ImageBackground style={styles.container} source={require('../../../../../images/thinkingTraining/exercise_bg.png')}>
                <View style={[appStyle.flexCenter,Platform.OS === 'ios'?{paddingTop:getHeaderPadding(pxToDp(40))}:null]}>
                    <TouchableOpacity style={[styles.headerBack]} onPress={this.goBack}>
                        <Image style={[{ width:pxToDp(80),height:pxToDp(80),}]} source={require('../../../../../images/homePageMath/base_back.png')} resizeMode="contain"></Image>
                    </TouchableOpacity>
                    <Text style={{fontSize:pxToDp(48),fontWeight:'bold',color:'#fff'}}>{this.title}</Text>
                </View>
                <View style={[styles.content,appStyle.flexJusBetween]}>
                    <Text style={{fontSize:pxToDp(46)}}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通过应用题的结构训练、数量关系训练、思路训练、相信你的应用题基础更加扎实了，解题技能更加熟练了，逻辑思维更加活跃了，那就开始实战练习吧。
                    </Text>
                    <View style={[appStyle.flexCenter]}>
                        <TouchableOpacity onPress={this.toDoExercise}>
                            <Image style={[{width:pxToDp(240), height:pxToDp(80)}, styles.bg_8_position]} source={require('../../../../../images/thinkingTraining/start_exercise.png')} resizeMode="contain"></Image>
                        </TouchableOpacity>
                        <Text style={{fontSize:pxToDp(40),marginTop:pxToDp(16)}}>已答题目：{statistic.right}/{statistic.count}   正确率：{statistic._rate}%</Text>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding:pxToDp(32),
        paddingBottom:pxToDp(64)
    },
    headerBack:{
        position: 'absolute',
        left: 0,
    },
    content:{
        flex:1,
        backgroundColor:"#fff",
        marginTop:pxToDp(32),
        borderRadius:pxToDp(32),
        padding:pxToDp(100),
        paddingTop:pxToDp(200),
        paddingBottom:pxToDp(80)
    }
});
