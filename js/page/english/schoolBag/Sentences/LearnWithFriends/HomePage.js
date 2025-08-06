import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Platform,
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { pxToDp } from "../../../../../util/tools";
import { appStyle,appFont } from "../../../../../theme";
import url from '../../../../../util/url'
import FreeTag from '../../../../../component/FreeTag'
import * as actionCreators from "../../../../../action/purchase/index";

const IMG_MAP = {
    0:require('../../../../../images/EN_Sentences/bg_bunny_high.png'),
    1:require('../../../../../images/EN_Sentences/bg_percy.png'),
    2:require('../../../../../images/EN_Sentences/bg_frank.png'),
    3:require('../../../../../images/EN_Sentences/bg_kathy.png'),
    4:require('../../../../../images/EN_Sentences/bg_sara.png'),
    5:require('../../../../../images/EN_Sentences/bg_zara.png'),
}

class HomePage extends PureComponent {
    constructor(props) {
        super(props);
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        this.grade_code = userInfoJs.checkGrade;
        this.term_code = userInfoJs.checkTeam;
        this.state = {
            list:[],
        };
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    componentDidMount(){
        this.getData()
    }

    getData(){
        const data = {};
        data.grade_code = this.grade_code;
        data.term_code = this.term_code;
        axios.get(api.getEngCartoonInfo,{params:data}).then(res=>{
            let data = res.data.data
            let arr = []
            for (let i in data) {
                let picture = ''
                let elements = []
                let detailData = data[i].data
                for (let j = 0; j < detailData.length; j++) {
                    picture = detailData[j].picture
                    elements.push(detailData[j].name)
                }
                arr.push({
                    cartoon: i,
                    elements,
                    picture,
                    details: detailData,
                })
            }
            this.setState({
                list:arr,
            })
        })
    }
    start=(i,x,authority)=>{
        if(!authority && x !== 0){
            this.props.setVisible(true)
            return
        }
        NavigationUtil.toEnSentencesLearnWidthFriendsElement({...this.props,data:{data:{...i,index:x}}})
    }
    render() {
        const {list} = this.state
        let authority = this.props.authority
        return (
            <ImageBackground style={[styles.container]} source={Platform.OS === 'android'?require("../../../../../images/EN_Sentences/bg_1_a.png"):require("../../../../../images/EN_Sentences/bg_1_i.png")}>
                <View style={[styles.header,Platform.OS === 'ios'?{paddingTop:pxToDp(60)}:null]}>
                    <TouchableOpacity style={[styles.back_btn,Platform.OS === 'ios'?{top:pxToDp(40)}:null]} onPress={this.goBack}>
                        <Image resizeMode='stretch' style={[{width:pxToDp(120),height:pxToDp(80)}]} source={require('../../../../../images/childrenStudyCharacter/back_btn_1.png')}></Image>
                    </TouchableOpacity>
                    <Text style={[{color:"#445368",fontSize:pxToDp(58)},appFont.fontFamily_jcyt_700]}>Learn with Friends</Text>
                </View>
                <View style={[styles.content]}>
                    <ScrollView style={[{maxHeight:pxToDp(900)}]}  horizontal={true} contentContainerStyle={{paddingTop:pxToDp(23)}}>
                        {list.map((i,x)=>{
                            let imgStyle = {width:pxToDp(384),height:pxToDp(388)}
                            if(x === 0) imgStyle = {width:pxToDp(384),height:pxToDp(450),top:pxToDp(-63)}
                            return <TouchableOpacity style={[styles.item]} onPress={()=>{this.start(i,x,authority)}} key={x}>
                                <Image style={[{zIndex:1,position:"absolute"},imgStyle]} source={IMG_MAP[x]}></Image>
                                {!authority && x ===0?<View style={[{position:"absolute",zIndex:1,top:pxToDp(80),right:pxToDp(10)}]}>
                                    <FreeTag style={{backgroundColor:"#00B295"}} color={'#fff'} txt={'Free'}></FreeTag>
                                </View>:null}
                                <View style={[styles.itemContent]}>
                                    <View style={[{flex:1},appStyle.flexJusBetween]}>
                                        <View style={[appStyle.flexAliCenter]}>
                                            <Text style={[{color:"#445368",fontSize:pxToDp(58)},appFont.fontFamily_jcyt_700,Platform.OS === 'ios'?{lineHeight:pxToDp(68)}:null]}>{i.cartoon}</Text>
                                            <Image style={[{width:pxToDp(42),height:pxToDp(26),marginTop:pxToDp(50)}]} source={require('../../../../../images/EN_Sentences/icon_4.png')}></Image>
                                        </View>
                                        <View style={[appStyle.flexAliCenter]}>
                                            {i.elements.map((ii,xx) => {
                                                return <Text style={[{color:"#445368",fontSize:pxToDp(42),lineHeight:pxToDp(60)},appFont.fontFamily_jcyt_500]} key={xx}>{ii}</Text>
                                            })}
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        })}
                    </ScrollView>
                </View>

            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header:{
        position:'relative',
        ...appStyle.flexCenter,
        ...appStyle.flexLine
    },
    back_btn:{
        position:"absolute",
        left:pxToDp(40)
    },
    content:{
        flex:1,
        paddingLeft:pxToDp(163),
        ...appStyle.flexCenter,
    },
    item:{
        ...appStyle.flexAliCenter,
        margin:pxToDp(38),
        paddingTop:Platform.OS === 'ios'?pxToDp(170):pxToDp(200)
    },
    itemContent:{
        width:pxToDp(472),
        height:pxToDp(615),
        backgroundColor:"#fff",
        borderRadius:pxToDp(80),
        ...appStyle.flexAliCenter,
        paddingTop:Platform.OS === 'ios'?pxToDp(230):pxToDp(160),
        paddingBottom:pxToDp(40)
    }
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        authority:state.getIn(["userInfo", "selestModuleAuthority"]),
        selestModule:state.getIn(["userInfo", "selestModule"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setVisible(data) {
            dispatch(actionCreators.setVisible(data));
        },
        setModules(data) {
            dispatch(actionCreators.setModules(data));
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(HomePage);
