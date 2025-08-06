import React, { Component, Fragment } from 'react';
import { Text, View, StyleSheet ,Animated,Modal,TouchableOpacity,Image} from 'react-native';
import {
    margin_tool,
    size_tool,
    pxToDp,
    borderRadius_tool,
    padding_tool,
  } from "../../util/tools";
import { appStyle, appFont } from "../../theme";
import HelpCard from './HelpCard'

export default class HelpModal extends Component {

    constructor(props){
        super(props) 
        this.url = 'https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/'
    }

    componentDidMount(){
        
    }

    nextTopaicHelp = () =>{
        this.props.closeModal()
    }

    renderCard = () => {
        if(!this.props.knowledgeBody) return
        switch(+Object.getOwnPropertyNames(this.props.knowledgeBody).length){
                case 0:
                    return this.render0child();
                case 1:
                    return this.render1child();
                case 2:
                    return this.render2child(); 
                case 3:
                    return this.render3child(); 
                case 4:
                    return this.render4child();   
        }
    }



    render0child =  () => {
        return(
            <Fragment>
                <View style = {[{flexDirection:'row',width:'100%',height:'30%'},appStyle.flexCenter]}>               
                </View>
                <View  style = {[{flexDirection:'row',width:'100%',height:'30%'},appStyle.flexCenter]}>
                    <HelpCard audioPath ={this.url+this.props.currentTopaicData.private_stem_audio}   word = {this.props.currentTopaicData.knowledge_point || 'A'}  wordRotate = {0} showLine = {false} translateX = {0} translateY = {-30}>                      
                    </HelpCard>
                </View>
                <View style = {[{flexDirection:'row',width:'100%',height:'30%'},appStyle.flexCenter]}>
                </View>
            </Fragment>          
        )
    }

    render1child =  () => {
        return(
            <Fragment>
                <View style = {[{flexDirection:'row',width:'100%',height:'30%'},appStyle.flexCenter]}>

                    <HelpCard audioPath ={this.props.knowledgeBody[0].audio}  imgUrl = {this.props.knowledgeBody[0].picture} word_phoneticspelling ={this.props.knowledgeBody[0].word_phoneticspelling} word = {this.props.knowledgeBody[0].word} wordWidth = {400} wordHeight = {320} showLine = {true}  translateX = {90} translateY = {-105} wordRotate = {225} >                      
                    </HelpCard>  
                        
                </View>
                <View  style = {[{flexDirection:'row',width:'100%',height:'30%'},appStyle.flexCenter]}>
                    <HelpCard audioPath ={this.url+this.props.currentTopaicData.private_stem_audio} word = {this.props.currentTopaicData.knowledge_point || 'A'}  wordRotate = {0} showLine = {false} translateX = {0} translateY = {-30}>                      
                    </HelpCard>
                </View>
                <View style = {[{flexDirection:'row',width:'100%',height:'30%'},appStyle.flexCenter]}>
                </View>
            </Fragment>          
        )
    }
    render2child =  () => {
        return(
            <Fragment>
                <View style = {[{flexDirection:'row',width:'100%',height:'30%'},appStyle.flexCenter]}>
                    <HelpCard audioPath ={this.props.knowledgeBody[0].audio} imgUrl = {this.props.knowledgeBody[0].picture} word_phoneticspelling ={this.props.knowledgeBody[0].word_phoneticspelling} word = {this.props.knowledgeBody[0].word} wordWidth = {400} wordHeight = {320} showLine = {true}  translateX = {120} translateY = {-155} wordRotate = {225} >                      
                    </HelpCard>  
                    <HelpCard audioPath ={this.props.knowledgeBody[1].audio} imgUrl = {this.props.knowledgeBody[1].picture} word_phoneticspelling ={this.props.knowledgeBody[1].word_phoneticspelling} word = {this.props.knowledgeBody[1].word} wordWidth = {400} wordHeight = {320}showLine = {true}  translateX = {150} translateY = {185} wordRotate = {135}>                      
                    </HelpCard>
                        
                </View>
                <View  style = {[{flexDirection:'row',width:'100%',height:'30%'},appStyle.flexCenter]}>
                    <HelpCard audioPath ={this.url+this.props.currentTopaicData.private_stem_audio}  word = {this.props.currentTopaicData.knowledge_point || 'A'}  wordRotate = {0} showLine = {false} translateX = {0} translateY = {-30}>                      
                    </HelpCard>
                </View>
                <View style = {[{flexDirection:'row',width:'100%',height:'30%'},appStyle.flexCenter]}>
                    
                </View>
            </Fragment>          
        )
    }

    render3child =  () => {
        return(
            <Fragment>
                <View style = {[{flexDirection:'row',width:'100%',height:'30%'},appStyle.flexCenter]}>
    
                    <HelpCard audioPath ={this.props.knowledgeBody[0].audio} imgUrl = {this.props.knowledgeBody[0].picture} word_phoneticspelling ={this.props.knowledgeBody[0].word_phoneticspelling} word = {this.props.knowledgeBody[0].word} wordWidth = {400} wordHeight = {320} showLine = {true}  translateX = {120} translateY = {-155} wordRotate = {225}>                      
                    </HelpCard>  
                    <HelpCard audioPath ={this.props.knowledgeBody[1].audio} imgUrl = {this.props.knowledgeBody[1].picture} word_phoneticspelling ={this.props.knowledgeBody[1].word_phoneticspelling} word = {this.props.knowledgeBody[1].word} wordWidth = {400} wordHeight = {320}showLine = {true}  translateX = {150} translateY = {185} wordRotate = {135}>                      
                    </HelpCard>
                        
                </View>
                <View  style = {[{flexDirection:'row',width:'100%',height:'30%'},appStyle.flexCenter]}>
                    <HelpCard audioPath ={this.url+this.props.currentTopaicData.private_stem_audio} word = {this.props.currentTopaicData.knowledge_point || 'A'}  wordRotate = {0} showLine = {false} translateX = {0} translateY = {-30}>                      
                    </HelpCard>
                </View>
                <View style = {[{flexDirection:'row',width:'100%',height:'30%'},appStyle.flexCenter]}>
                    <HelpCard audioPath ={this.props.knowledgeBody[2].audio} imgUrl = {this.props.knowledgeBody[2].picture} word_phoneticspelling ={this.props.knowledgeBody[2].word_phoneticspelling} word = {this.props.knowledgeBody[2].word} wordWidth = {400} wordHeight = {320}showLine = {true} translateX = {-30} translateY = {-50} wordRotate = {45} lineLen = {120}>                      
                    </HelpCard>
                    
                </View>
            </Fragment>          
        )
    }

    render4child =  () => {
        return(
            <Fragment>
                <View style = {[{flexDirection:'row',width:'100%',height:'30%'},appStyle.flexCenter]}>
    
                    <HelpCard audioPath ={this.props.knowledgeBody[0].audio} imgUrl = {this.props.knowledgeBody[0].picture} word_phoneticspelling ={this.props.knowledgeBody[0].word_phoneticspelling} word = {this.props.knowledgeBody[0].word} wordWidth = {400} wordHeight = {320} showLine = {true}  translateX = {120} translateY = {-155} wordRotate = {225}>                      
                    </HelpCard>  
                    <HelpCard audioPath ={this.props.knowledgeBody[1].audio} imgUrl = {this.props.knowledgeBody[1].picture} word_phoneticspelling ={this.props.knowledgeBody[1].word_phoneticspelling} word = {this.props.knowledgeBody[1].word} wordWidth = {400} wordHeight = {320}showLine = {true}  translateX = {150} translateY = {185} wordRotate = {135}>                      
                    </HelpCard>
                        
                </View>
                <View  style = {[{flexDirection:'row',width:'100%',height:'30%'},appStyle.flexCenter]}>
                    <HelpCard audioPath ={this.url+this.props.currentTopaicData.private_stem_audio} word = {this.props.currentTopaicData.knowledge_point || 'A'}  wordRotate = {0} showLine = {false} translateX = {0} translateY = {-30}>                      
                    </HelpCard>
                </View>
                <View style = {[{flexDirection:'row',width:'100%',height:'30%'},appStyle.flexCenter]}>
                    <HelpCard audioPath ={this.props.knowledgeBody[2].audio} imgUrl = {this.props.knowledgeBody[2].picture} word_phoneticspelling ={this.props.knowledgeBody[2].word_phoneticspelling} word = {this.props.knowledgeBody[2].word} wordWidth = {400} wordHeight = {320}showLine = {true} translateX = {-30} translateY = {-50} wordRotate = {45} lineLen = {120}>                      
                    </HelpCard>
                    <HelpCard audioPath ={this.props.knowledgeBody[3].audio} imgUrl = {this.props.knowledgeBody[3].picture} word_phoneticspelling ={this.props.knowledgeBody[3].word_phoneticspelling} word = {this.props.knowledgeBody[3].word} wordWidth = {400} wordHeight = {320}showLine = {true}  translateX = {-50} translateY = {30} wordRotate = {315}  lineLen = {120}>                      
                    </HelpCard>  
                </View>
            </Fragment>          
        )
    }

    render() {
        var len = this.props.len;
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }
        return (
         <View>
            <Modal animationType="fade" visible={this.props.visible}>
                <View
                    style={[
                    {
                        backgroundColor:
                        "linear - gradient(90deg, rgba(55, 55, 54, 1) 0 %, rgba(76, 76, 76, 1) 100 %)",
                        width: "100%",
                        height: "100%",
                    },
                    ]}
                >
                    <View
                    style={[
                        styles.modalHeader,
                        appStyle.ml48,
                        appStyle.mr48,
                        appStyle.flexTopLine,
                        appStyle.mt48,
                        appStyle.height110,
                        appStyle.flexCenter,
                        borderRadius_tool(16),
                    ]}
                    >
                        <Text style={[appFont.f42, { color: "#FC6161" }]}>帮助</Text>
                        <TouchableOpacity
                            style={[
                            appStyle.absolute,
                            styles.nextText,
                            margin_tool(0, 48, 0, 48),
                            padding_tool(16, 48),
                            borderRadius_tool(30),
                            ]}
                            onPress={this.nextTopaicHelp}
                        >
                            <Text style={[{ color: "#fff" }]}>返回</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[{flexDirection:'column'},appStyle.flexCenter,appStyle.mt48]}>
                        {this.renderCard()}
                    </View>
                    
                    
                </View>
            </Modal>
        </View>   
      
            
        );
    }
}
const styles = StyleSheet.create({
      modalHeader: {
        backgroundColor: "#fff",
      },
      nextText: {
        left: 0,
        backgroundColor: "#38B3FF",
      }, 
      contentWrap: {
        // position: "absolute",
        backgroundColor: "#fff",
        zIndex: 1,
        minWidth: pxToDp(220),
        minHeight: pxToDp(100),
      },
});
