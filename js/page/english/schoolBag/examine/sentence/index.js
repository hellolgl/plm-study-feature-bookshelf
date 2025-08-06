import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Modal,
    Animated,
    ScrollView,
    Platform,
} from "react-native";
import { appStyle } from "../../../../../theme";
import {
    size_tool,
    pxToDp,
    padding_tool,
    borderRadius_tool,
    margin_tool,
} from "../../../../../util/tools";
import Sound from "react-native-sound";
import RichShowView from "../../../../../component/chinese/RichShowView";
import url from "../../../../../util/url";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import Header from '../../../../../component/Header'
import axios from '../../../../../util/http/axios'
import api from '../../../../../util/http/api'
import { connect } from "react-redux";

class ExamineSentenceHomePage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            list:[],
            listIndex:0,
            unitList:[]
        };
    }
    componentDidMount(){
        axios.get(api.getEnExamineType).then(res => {
            let list = res.data.data
            this.setState({
                list
            },()=>{
                this.selectType()
            })
        })
    }

    selectType = () =>{
        const {listIndex,list} = this.state
        const {iid} = list[listIndex]
        const userInfo = this.props.userInfo.toJS()
        const data = {
            iid,
            grade_code:userInfo.checkGrade,
            term_code:userInfo.checkTeam
        }
        axios.get(api.getEnExamineUnit,{params:data}).then(res => {
            this.setState({
                unitList:res.data.data
            })
        })
    }
    render() {
        const {list,listIndex,unitList} = this.state
        const userInfo = this.props.userInfo.toJS()
        const {checkGrade,checkTeam} = userInfo
        return (
            <View style={[styles.container]}>
                <Header text={'Sentence'} goBack={() => { NavigationUtil.goBack(this.props) }} />
                <ScrollView style={[{maxHeight:pxToDp(120),marginTop:pxToDp(-20)}]} contentContainerStyle={[appStyle.flexCenter]} horizontal={true}>
                    {list.map((i,x) => {
                        return <TouchableOpacity style={[styles.item,listIndex === x?{backgroundColor:'#FFC662'}:null]} key={x} onPress={()=>{
                            this.setState({
                                listIndex:x
                            },()=>{
                                this.selectType()
                            })
                        }}>
                            <Text style={[{color:"#475266",fontSize:pxToDp(42)}]}>{i.name}</Text>
                        </TouchableOpacity>
                    })}
                </ScrollView>
                <View style={[styles.content]}>
                    {unitList.length?<>
                        {unitList.map((i,x) => {
                            return <TouchableOpacity style={[styles.unitItem]} key={x} onPress={()=>{
                                NavigationUtil.toEnExamineSentenceTopicList({ ...this.props,data:{unit_code:i,iid:list[listIndex].iid,name:list[listIndex].name} })
                            }}>
                                <Text style={[{color:"#fff",fontSize:pxToDp(42)}]}>unit {parseInt(i)}</Text>
                            </TouchableOpacity>
                        })}
                    </>:<Text style={[{fontSize:pxToDp(50),color:"#475266"}]}>【{parseInt(checkGrade)}{checkTeam === '00'?'上':'下'}】没有相关题目</Text>}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:pxToDp(48)
    },
    item:{
        height:pxToDp(90),
        backgroundColor:"#fff",
        borderRadius:pxToDp(40),
        paddingLeft:pxToDp(24),
        paddingRight:pxToDp(24),
        marginRight:pxToDp(20),
        ...appStyle.flexCenter
    },
    content:{
        flex:1,
        backgroundColor:"#fff",
        marginTop:pxToDp(20),
        borderRadius:pxToDp(40),
        ...appStyle.flexTopLine,
        ...appStyle.flexLineWrap,
        padding:pxToDp(48)
    },
    unitItem:{
        height:pxToDp(90),
        backgroundColor:"#AE82FF",
        ...appStyle.flexCenter,
        marginRight:pxToDp(32),
        paddingLeft:pxToDp(40),
        paddingRight:pxToDp(40),
        borderRadius:pxToDp(40)
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

export default connect(mapStateToProps, mapDispathToProps)(ExamineSentenceHomePage);
