import React, { PureComponent } from "react"
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    TouchableWithoutFeedback,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    DeviceEventEmitter
} from "react-native"
import {pxToDp, getGradeInfo} from "../../../../util/tools"
import { appFont, appStyle } from "../../../../theme"
import NavigationUtil from "../../../../navigator/NavigationUtil"
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil"
import axios from '../../../../util/http/axios'
import api from '../../../../util/http/api'
import { Toast } from "antd-mobile-rn";
import MyRadarChart from '../../../../component/myRadarChart'
import FreeTag from '../../../../component/FreeTag'
import { connect } from "react-redux";
import * as actionCreators from "../../../../action/purchase/index";
import * as purchaseCreators from "../../../../action/purchase"
import BackBtn from "../../../../component/math/BackBtn"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BADGE_MAP = {
    0:require('../../../../images/mathProgramming/badge_1_s.png'),
    1:require('../../../../images/mathProgramming/badge_2_s.png'),
    2:require('../../../../images/mathProgramming/badge_3_s.png'),
    3:require('../../../../images/mathProgramming/badge_4_s.png'),
    4:require('../../../../images/mathProgramming/badge_5_s.png'),
    5:require('../../../../images/mathProgramming/badge_6_s.png'),
}

class ProgramThinking extends PureComponent {
    constructor() {
        super()
        this.message = []
        this.eventListenerRefreshPage = undefined
        this.state = {
            list: [],
            show_rule:false,
            loading:true,
            status_0_len:0,
            namelist:[],
            valueList:[],
            all_count:0
        }
    }

    componentWillUnmount(){
        this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove()
    }

    componentDidMount() {
        this.getData()
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "refreshPage",
            (event) => {
              this.getData();
            }
        );
    }

    getData = () => {
        axios.get(api.getProgramAbility).then(res => {
            let list = JSON.parse(JSON.stringify(res.data.data))
            let namelist = []
            let valueList = []
            let all_count = 0
            list.forEach((i,x) => {
                namelist.push(i.name)
                valueList.push(i.rate + '')
                all_count += i.all_count
            })
            let status_0_len = list.filter((i) => {
                return i.status === 0
            }).length
            this.setState({
                list,
                status_0_len,
                namelist,
                valueList,
                all_count
            })
        }).finally(()=>{
            this.setState({
                loading: false,
            })
        })
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    }

    renderBadge = (item_can_do,i,x) => {
        const {medal} = i
        if(medal){
            // 显示徽章
            return <Image resizeMode='stretch' style={[{width:pxToDp(120),height:pxToDp(140)}]} source={BADGE_MAP[x]}></Image>
        }
        if(item_can_do){
            // 显示可以答题
            return  <Image resizeMode='stretch' style={[{width:pxToDp(120),height:pxToDp(140)}]} source={require('../../../../images/mathProgramming/badge_unlock.png')}></Image>
        }
        return  <Image resizeMode='stretch' style={[{width:pxToDp(120),height:pxToDp(140)}]} source={require('../../../../images/mathProgramming/badge_lock.png')}></Image>
    }

    toDoExercise = (i,x,item_can_do,authority) => {
        if(!authority && x !== 0){
            this.props.setVisible(true)
        } else if(!item_can_do){
            Toast.info('上一个模块的正确率未达到60%',1.5)
        } else {
            MathNavigationUtil.toMathProgramDoExercise({ ...this.props,data:{a_id:i.a_id}})
        }
    }

    render() {
        const {show_rule,list,loading,status_0_len,namelist,valueList,all_count} = this.state
        let authority = this.props.authority
        return (
            <ImageBackground style={[styles.container]} source={require('../../../../images/mathProgramming/bg_1.png')}>
                <View style={[styles.header]}>
                    <BackBtn goBack={this.goBack}></BackBtn>
                    <TouchableOpacity style={[styles.rule_btn,Platform.OS === 'ios'?{top:pxToDp(40)}:null]} onPress={()=>{
                        this.setState({
                            show_rule:true
                        })
                    }}>
                        <View style={[styles.rule_icon]}>
                            <Text style={[{color:"#1F1F26",fontSize:pxToDp(28),fontWeight:"bold"}]}>?</Text>
                        </View>
                        <Text style={[appFont.fontFamily_jcyt_500,{color:"#fff",fontSize:pxToDp(28)}]}>规则</Text>
                    </TouchableOpacity>
                    <Text style={[appFont.fontFamily_jcyt_500,{fontSize:pxToDp(40),color:"#fff"},Platform.OS === 'ios'?{marginTop:pxToDp(20)}:null]}>思维训练</Text>
                </View>
                <View style={[{flex:1},appStyle.flexJusCenter]}>
                    <View style={[styles.content,loading?{...appStyle.flexCenter}:null,Platform.OS === 'ios'?{paddingBottom:pxToDp(40)}:null]}>
                        {loading?<ActivityIndicator size="large" color="#4F99FF" />:<>
                            <ScrollView contentContainerStyle={{...appStyle.flexTopLine,...appStyle.flexLineWrap,paddingTop:pxToDp(20)}}>
                                {list.map((i,x) => {
                                    let item_can_do = false  //模块是否可以答题
                                    if(status_0_len === list.length){
                                        // 初始状态，所有能力都没有答过题
                                        if(x === 0){
                                            item_can_do = true
                                        }
                                    }else{
                                        item_can_do = i.status === 1
                                        if(i.status === 0 && list[x-1].status === 1){
                                            // 当前能力的上一个能力status为1的可以答题
                                            item_can_do = true
                                        }
                                    }
                                    // console.log('______',i.name,item_can_do)
                                    return <View style={[styles.item,Platform.OS === 'ios' && (x === list.length -1 || x === list.length -2)?{marginBottom:0}:null]} key={x}>
                                        {x === 0 && !authority?<View style={[{position:"absolute",zIndex:1,top:pxToDp(-20),right:0}]}>
                                            <FreeTag />
                                        </View>:null}
                                        <View style={[styles.item_inner]}>
                                            <View style={[{marginBottom:pxToDp(40)},appStyle.flexLine]}>
                                                <View style={[appStyle.flexEnd]}>
                                                    {i.medal?null:<View style={[appStyle.flexEnd,styles.rate_wrap]}>
                                                        <View style={[{height:i.rate + '%',backgroundColor:i.rate >= 60?'#16C792':'#FF5C5C' }]}></View>
                                                    </View>}
                                                    {this.renderBadge(item_can_do,i,x)}
                                                </View>
                                                <View style={[{marginLeft:pxToDp(20)}]}>
                                                    <Text style={[{color:"#fff",fontSize:pxToDp(60)},appFont.fontFamily_jcyt_700,Platform.OS === 'android'?{marginBottom:pxToDp(-20)}:{marginBottom:pxToDp(15)}]}>{item_can_do?i.rate + '%':'-'}</Text>
                                                    <Text style={[{color:"#A3A3CC",fontSize:pxToDp(20)},appFont.fontFamily_jcyt_500]}>{i.all_count > 0 ?'综合正确率':item_can_do?'未答题':'未解锁'}</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity style={[appStyle.flexLine,appStyle.flexJusBetween]} onPress={()=>{
                                                this.toDoExercise(i,x,item_can_do,authority)
                                            }}>
                                                <Text style={[{fontSize:pxToDp(52),color:"#fff"},appFont.fontFamily_jcyt_700]}>{i.name}</Text>
                                                <Image style={[{width:pxToDp(40),height:pxToDp(40)}]} source={require('../../../../images/mathProgramming/right_icon.png')}></Image>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                })}
                            </ScrollView>
                            <View style={[{paddingTop:pxToDp(20)}]}>
                                <View style={[styles.right,appStyle.flexCenter,Platform.OS === 'ios'?{flex:1}:null]}>
                                    <Text style={[{color:"#fff",fontSize:pxToDp(40),marginBottom:pxToDp(80)},appFont.fontFamily_jcyt_700]}>综合能力</Text>
                                    <View style={[{paddingLeft:pxToDp(40),paddingRight:pxToDp(40),marginBottom:pxToDp(60)}]}>
                                        <MyRadarChart valueList={valueList} namelist={namelist} size={ Platform.OS === 'ios'?[320,320]:[400,400]} border_color={'rgba(163, 163, 204, .3)'} label_color={'#A3A3CC'} rate_color={'#fff'}></MyRadarChart>
                                    </View>
                                    <Text style={[appFont.fontFamily_jcyt_500,{color:"rgba(255, 255, 255, 0.50)",fontSize:pxToDp(36)}]}>合计做题数：{all_count}</Text>
                                </View>
                            </View>

                        </>}
                    </View>
                </View>

                {show_rule?<View style={[styles.rule_container]}>
                    <TouchableWithoutFeedback onPress={()=>{
                        this.setState({
                            show_rule:false
                        })
                    }}>
                        <View style={[styles.click_region]}></View>
                    </TouchableWithoutFeedback>
                    <View style={[styles.rule_content]}>
                        <View style={[styles.rule_content_inner]}>
                            <Text style={[appFont.fontFamily_jcyt_700,{color:"#2D2D40",fontSize:pxToDp(52)}]}>规则：</Text>
                            <Text style={[appFont.fontFamily_jcyt_700,{color:"#2D2D40",fontSize:pxToDp(40)}]}>
                                正确率大于90%（包含）可获得对应徽章，正确率在60%（包含）～90%之间及格，小于60%不及格。
                            </Text>
                            <Text style={[appFont.fontFamily_jcyt_700,{color:"#2D2D40",fontSize:pxToDp(40)}]}>
                                上一个模块至少答五道题，保持60%正确率以上，才能解锁下一个模块。
                            </Text>
                        </View>
                    </View>
                </View>:null}
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    header:{
        ...appStyle.flexCenter,
        height:pxToDp(120),
    },
    rule_btn:{
        position:"absolute",
        right:pxToDp(20),
        ...appStyle.flexLine,
        backgroundColor:'rgba(0,0,0,0.5)',
        padding:pxToDp(20),
        borderRadius:pxToDp(200)
    },
    rule_icon:{
        width:pxToDp(40),
        height:pxToDp(40),
        borderRadius:pxToDp(20),
        backgroundColor:"#fff",
        ...appStyle.flexCenter,
        marginRight:pxToDp(20)
    },
    rule_container:{
        width:windowWidth,
        height:windowHeight-pxToDp(120),
        position:'absolute',
        top:pxToDp(120),
        left:0,
        zIndex:1
    },
    click_region:{
        flex:1,
    },
    rule_content:{
        position:"absolute",
        right:pxToDp(40),
        borderRadius:pxToDp(40),
        width:pxToDp(880),
        backgroundColor:'#DAE2F2',
        paddingBottom:pxToDp(8)
    },
    rule_content_inner:{
        width:'100%',
        backgroundColor:'#fff',
        paddingTop:pxToDp(40),
        borderRadius:pxToDp(40),
        padding:pxToDp(60)
    },
    content:{
        paddingLeft:pxToDp(80),
        paddingRight:pxToDp(80),
        paddingTop:pxToDp(20),
        ...appStyle.flexTopLine,
    },
    right:{
        width:pxToDp(672),
        height:Platform.OS === 'android'?windowHeight-pxToDp(120 + 40 + 50 + 50):'auto',
        borderRadius:pxToDp(40),
        borderWidth:pxToDp(4),
        borderColor:"#2D2D40",
        marginLeft:pxToDp(20),
        ...appStyle.flexAliCenter,
        paddingTop:pxToDp(40),
        paddingBottom:pxToDp(40),
    },
    item:{
        width:pxToDp(548),
        backgroundColor:"#262638",
        borderRadius:pxToDp(40),
        paddingBottom:pxToDp(8),
        marginRight:pxToDp(20),
        marginBottom:pxToDp(40)
    },
    item_inner:{
        width:'100%',
        backgroundColor:'#2D2D40',
        borderRadius:pxToDp(40),
        padding:pxToDp(40)
    },
    rate_wrap:{
        position:"absolute",
        width:pxToDp(120),
        height:pxToDp(140),
        bottom:0,
        padding:pxToDp(3)
    }

})

const mapStateToProps = (state) => {
    return {
        lock_primary_school: state.getIn(["userInfo", "lock_primary_school"]),
        authority: state.getIn(["userInfo", "selestModuleAuthority"]),
    };
};

const mapDispathToProps = (dispatch) => {
    // 存数据
    return {
        setVisible(data) {
                dispatch(actionCreators.setVisible(data));
        },
        setModules(data) {
            dispatch(purchaseCreators.setModules(data));
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(ProgramThinking);
