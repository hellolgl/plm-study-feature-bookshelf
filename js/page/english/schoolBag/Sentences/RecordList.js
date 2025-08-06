import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView, DeviceEventEmitter, ImageBackground, Platform,
} from "react-native";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { pxToDp } from "../../../../util/tools";
import {haveNbsp} from './tools'
import { appStyle,appFont } from "../../../../theme";

class RecordList extends PureComponent {
    constructor(props) {
        super(props);
        this.eventListenerRefreshPage = undefined
        this.days = this.props.navigation.state.params.data.days
        this.unit_code = this.props.navigation.state.params.data.unit_code
        this.cartoon = this.props.navigation.state.params.data.cartoon
        this.state = {
            list: [],
            type:1,
        };
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    componentDidMount() {
        this.getData()
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener('refreshRecordPage', (event) => {
            this.getData()
        })

    }

    componentWillUnmount(){
        this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove()
    }

    getData = () => {
        if(this.days){
            // LearnToday答题记录
            this.getDailyList()
            return
        }
        if(this.cartoon){
            // LearnWithFriends答题记录
            this.getDailyListlwf()
        }
    }

    toDoExercise = (i) => {
        NavigationUtil.toEnSentencesLearnTodayRecordDoExercise({
            ...this.props,
            data: { se_id: i.se_id},
        });
    };

    toDoNewExercise = () => {
        const {type} = this.state
        switch(type) {
            case 1:
                NavigationUtil.toEnSentencesLearnTodayDoExercise({...this.props,data:{days:this.days,unit_code:this.unit_code}});
               break;
            case 2:
                NavigationUtil.toEnSentencesLearnWidthFriendsDoExercise({...this.props,data:{cartoon:this.cartoon}})
               break;
       }
    }

    getDailyList() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.days = this.days
        axios.get(api.getEngTopicDairyRcord, { params: data }).then((res) => {
            let list = res.data.data;
            this.setState(() => ({
                list,
                type:1
            }));
        });
    }

    getDailyListlwf(){
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.cartoon = this.cartoon
        axios.get(api.getEngCartoonRcordDetail, { params: data }).then((res) => {
            let list = res.data.data;
            this.setState(() => ({
                list,
                type:2
            }));
        });
    }

    renderContent = (currentTopic)=>{
       return <View style={[appStyle.flexTopLine,appStyle.flexLineWrap]}>
           {currentTopic.sentence_stem.map((item, index) => {
              return (
                <Text
                  style={[{fontSize: pxToDp(50),color:"#445368",lineHeight: pxToDp(76),},appFont.fontFamily_jcyt_700]} key={index}>
                   {index > 0?haveNbsp(item.content):''}{item.content}
                </Text>
              );
        })}
       </View>

    }

    render() {
        const {list} = this.state
        return (
            <ImageBackground style={{flex:1}} source={Platform.OS === 'android'?require("../../../../images/EN_Sentences/bg_1_a.png"):require("../../../../images/EN_Sentences/bg_1_i.png")}>
                <View style={[styles.header,Platform.OS === 'ios'?{paddingTop:pxToDp(60),marginBottom:pxToDp(40)}:{marginBottom:pxToDp(20)}]}>
                    <TouchableOpacity style={[styles.back_btn,Platform.OS === 'ios'?{top:pxToDp(40)}:null]} onPress={this.goBack}>
                        <Image resizeMode='stretch' style={[{width:pxToDp(120),height:pxToDp(80)}]} source={require('../../../../images/childrenStudyCharacter/back_btn_1.png')}></Image>
                    </TouchableOpacity>
                    <Text style={[{color:"#445368",fontSize:pxToDp(58)},appFont.fontFamily_jcyt_700]}>{this.unit_code?`Unit ${parseInt(this.unit_code)}`:" "}</Text>
                </View>
                <ScrollView contentContainerStyle={{paddingLeft:pxToDp(260),paddingRight:pxToDp(260)}}>
                    {list.map((i,x) => {
                        return <TouchableOpacity key={x} style={[styles.item]} onPress={()=>{
                            this.toDoExercise(i)
                        }}>
                            <View style={[styles.item_inner]}>
                                <View style={[appStyle.flexLine]}>
                                    <View style={[styles.circle,i.correct === '2'?{backgroundColor:"#EC5D57"}:null]}>
                                        <Text style={[{color:"#fff",fontSize:pxToDp(50)},appFont.fontFamily_jcyt_700]}>{x + 1}</Text>
                                    </View>
                                    <View style={{width:"88%"}}>
                                        <Text style={[{fontSize:pxToDp(36),color:'#ACB2BC'},appFont.fontFamily_jcyt_500,Platform.OS === 'android'?{marginBottom:pxToDp(0)}:null]}>{i.common_stem}</Text>
                                        {this.renderContent(i)}
                                    </View>
                                </View>
                                <Image source={require('../../../../images/chineseHomepage/pingyin/new/next.png')} style={[{width:pxToDp(80),height:pxToDp(80),opacity:.3}]} />
                            </View>
                        </TouchableOpacity>
                    })}
                </ScrollView>
                <TouchableOpacity style={[styles.testBtn]} onPress={this.toDoNewExercise}>
                    <View style={[styles.testBtn_inner]}>
                        <Text style={[{color:"#fff",fontSize:pxToDp(50)},appFont.fontFamily_jcyt_700]}>Start</Text>
                    </View>
                </TouchableOpacity>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    header:{
        position:'relative',
        ...appStyle.flexCenter,
        ...appStyle.flexLine
    },
    back_btn:{
        position:"absolute",
        left:pxToDp(40)
    },
    item:{
        backgroundColor:"#EDEDF5",
        borderRadius:pxToDp(40),
        marginBottom:pxToDp(38),
        paddingBottom:pxToDp(5)
    },
    item_inner:{
        flex:1,
        backgroundColor:"#fff",
        padding:pxToDp(40),
        paddingTop:pxToDp(20),
        borderRadius:pxToDp(40),
        ...appStyle.flexLine,
        ...appStyle.flexJusBetween
    },
    testBtn:{
        width:pxToDp(240),
        height:pxToDp(240),
        paddingBottom:pxToDp(7),
        backgroundColor:"#FF731C",
        borderRadius:pxToDp(120),
        position:"absolute",
        right:pxToDp(49),
        bottom:pxToDp(72)
    },
    testBtn_inner:{
        flex:1,
        backgroundColor:'#FF9032',
        borderRadius:pxToDp(120),
        ...appStyle.flexCenter
    },
    circle:{
        width:pxToDp(80),
        height:pxToDp(80),
        borderRadius:pxToDp(40),
        ...appStyle.flexCenter,
        marginRight:pxToDp(35),
        backgroundColor:"#00CB8E"
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

export default connect(mapStateToProps, mapDispathToProps)(RecordList);
