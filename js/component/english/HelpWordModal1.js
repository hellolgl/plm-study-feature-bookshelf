import React, { Component, Fragment } from 'react';
import { Text, View, StyleSheet, Animated, Modal, TouchableOpacity, Image, ScrollView, ImageBackground } from 'react-native';
import {
    margin_tool,
    size_tool,
    pxToDp,
    borderRadius_tool,
    padding_tool,
} from "../../util/tools";
import { appStyle, appFont } from "../../theme";
import HelpCard from './HelpCardNew'
import HelpCardExpress from './HelpCardExpress'
import RichShowView from "../chinese/RichShowView";
import HelpSentenceModal from './HelpSentenceModal'
/**
 * kygType 1:单词 2:句子
 */
export default class HelpModal extends Component {

    constructor(props) {
        super(props)
        this.url = 'https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/'
    }

    componentDidMount() {
    }

    nextTopaicHelp = () => {
        this.props.closeModal()
    }

    renderCard = () => {
        // console.log('HelpModal renderCard', this.props)

        console.log('this.props.knowledgeBody', this.props.knowledgeBody)
        if (!this.props.knowledgeBody) return
        switch (+Object.getOwnPropertyNames(this.props.knowledgeBody).length) {
            // case 1:
            //     console.log('renderCard0')
            //     return this.render0child();
            // case 2:
            //     console.log('renderCard1')
            //     return this.render1child();
            case 3:
                console.log('renderCard2')
                return this.render2child();
            // case 4:
            //     return this.render3child();
            // case 5:
            //     return this.render4child();
        }
    }



    // render0child = () => {
    //     return (
    //         <Fragment>
    //             <View style={[{ flexDirection: 'row', width: '100%', height: '30%' }, appStyle.flexCenter]}>
    //             </View>
    //             <View style={[{ flexDirection: 'row', width: '100%', height: '30%' }, appStyle.flexCenter]}>
    //                 <HelpCard marginLeft={70} autoPlayAudio={true} audioPath={this.url + this.props.knowledgeBody[0].audio} imgUrl={this.props.knowledgeBody[0].picture} word_phoneticspelling={this.props.knowledgeBody[0].word_phoneticspelling} imgWidth={pxToDp(180)} imgHeight={pxToDp(180)} wordWidth={454} wordHeight={378} wordRotate={0} showLine={false} translateX={0} translateY={-30}>
    //                 </HelpCard>
    //             </View>
    //             <View style={[{ flexDirection: 'row', width: '100%', height: '30%' }, appStyle.flexCenter]}>
    //             </View>
    //         </Fragment>
    //     )
    // }

    // render1child = () => {
    //     return (
    //         <Fragment>
    //             <View style={[{ flexDirection: 'row', width: '100%', height: '30%' }, appStyle.flexCenter]}>

    //                 <HelpCard audioPath={this.url + this.props.knowledgeBody[0].audio} imgUrl={this.props.knowledgeBody[0].picture} word_phoneticspelling={this.props.knowledgeBody[0].word_phoneticspelling} word={this.props.knowledgeBody[0].word} wordWidth={400} wordHeight={320} showLine={true} translateX={90} translateY={-105} wordRotate={225} >
    //                 </HelpCard>

    //             </View>
    //             <View style={[{ flexDirection: 'row', width: '100%', height: '30%' }, appStyle.flexCenter]}>
    //                 <HelpCard audioPath={this.url + this.props.currentTopaicData.private_stem_audio} word={this.props.currentTopaicData.knowledge_point || 'A'} wordRotate={0} showLine={false} translateX={0} translateY={-30}>
    //                 </HelpCard>
    //             </View>
    //             <View style={[{ flexDirection: 'row', width: '100%', height: '30%' }, appStyle.flexCenter]}>
    //             </View>
    //         </Fragment>
    //     )
    // }
    render2child = () => {
        //单词短语
        return (
            <View style={[{ flexDirection: 'row', width: pxToDp(1490), height: pxToDp(475), marginTop: pxToDp(100), alignItems: 'center', }, appStyle.flexJusBetween]}>
                <HelpCard
                    audioPath={this.url + this.props.knowledgeBody[1].audio}
                    imgUrl={this.url + this.props.knowledgeBody[1].picture}
                    word_phoneticspelling={this.props.knowledgeBody[1].word_phoneticspelling}
                    word={this.props.knowledgeBody[1].word}
                />

                <HelpCard
                    marginLeft={70}
                    autoPlayAudio={true}
                    audioPath={this.url + this.props.knowledgeBody[0].audio}
                    imgUrl={this.url + this.props.knowledgeBody[0].picture}
                    word_phoneticspelling={this.props.knowledgeBody[0].word_phoneticspelling}
                    word={this.props.knowledgeBody[0].word}
                >
                </HelpCard>
                <HelpCard audioPath={this.url + this.props.knowledgeBody[2].audio} imgUrl={this.url + this.props.knowledgeBody[2].picture} word_phoneticspelling={this.props.knowledgeBody[2].word_phoneticspelling} word={this.props.knowledgeBody[2].word} wordWidth={460} wordHeight={570} showLine={true} translateX={-50} translateY={0} wordRotate={0} lineLen={280} >
                </HelpCard>
            </View>
        )

        // }
    }

    // render3child = () => {
    //     return (
    //         <Fragment>
    //             <View style={[{ flexDirection: 'row', width: '100%', height: '30%' }, appStyle.flexCenter]}>

    //                 <HelpCard audioPath={this.url + this.props.knowledgeBody[0].audio} imgUrl={this.props.knowledgeBody[0].picture} word_phoneticspelling={this.props.knowledgeBody[0].word_phoneticspelling} word={this.props.knowledgeBody[0].word} wordWidth={400} wordHeight={320} showLine={true} translateX={120} translateY={-155} wordRotate={225}>
    //                 </HelpCard>
    //                 <HelpCard audioPath={this.url + this.props.knowledgeBody[1].audio} imgUrl={this.props.knowledgeBody[1].picture} word_phoneticspelling={this.props.knowledgeBody[1].word_phoneticspelling} word={this.props.knowledgeBody[1].word} wordWidth={400} wordHeight={320} showLine={true} translateX={150} translateY={185} wordRotate={135}>
    //                 </HelpCard>

    //             </View>
    //             <View style={[{ flexDirection: 'row', width: '100%', height: '30%' }, appStyle.flexCenter]}>
    //                 <HelpCard audioPath={this.url + this.url + this.props.currentTopaicData.private_stem_audio} word={this.props.currentTopaicData.knowledge_point || 'A'} wordRotate={0} showLine={false} translateX={0} translateY={-30}>
    //                 </HelpCard>
    //             </View>
    //             <View style={[{ flexDirection: 'row', width: '100%', height: '30%' }, appStyle.flexCenter]}>
    //                 <HelpCard audioPath={this.url + this.props.knowledgeBody[2].audio} imgUrl={this.props.knowledgeBody[2].picture} word_phoneticspelling={this.props.knowledgeBody[2].word_phoneticspelling} word={this.props.knowledgeBody[2].word} wordWidth={400} wordHeight={320} showLine={true} translateX={-30} translateY={-50} wordRotate={45} lineLen={120}>
    //                 </HelpCard>

    //             </View>
    //         </Fragment>
    //     )
    // }

    // render4child = () => {
    //     return (
    //         <Fragment>
    //             <View style={[{ flexDirection: 'row', width: '100%', height: '30%' }, appStyle.flexCenter]}>

    //                 <HelpCard audioPath={this.url + this.props.knowledgeBody[0].audio} imgUrl={this.props.knowledgeBody[0].picture} word_phoneticspelling={this.props.knowledgeBody[0].word_phoneticspelling} word={this.props.knowledgeBody[0].word} wordWidth={400} wordHeight={320} showLine={true} translateX={120} translateY={-155} wordRotate={225}>
    //                 </HelpCard>
    //                 <HelpCard audioPath={this.url + this.props.knowledgeBody[1].audio} imgUrl={this.props.knowledgeBody[1].picture} word_phoneticspelling={this.props.knowledgeBody[1].word_phoneticspelling} word={this.props.knowledgeBody[1].word} wordWidth={400} wordHeight={320} showLine={true} translateX={150} translateY={185} wordRotate={135}>
    //                 </HelpCard>

    //             </View>
    //             <View style={[{ flexDirection: 'row', width: '100%', height: '30%' }, appStyle.flexCenter]}>
    //                 <HelpCard audioPath={this.url + this.props.currentTopaicData.private_stem_audio} word={this.props.currentTopaicData.knowledge_point || 'A'} wordRotate={0} showLine={false} translateX={0} translateY={-30}>
    //                 </HelpCard>
    //             </View>
    //             <View style={[{ flexDirection: 'row', width: '100%', height: '30%' }, appStyle.flexCenter]}>
    //                 <HelpCard audioPath={this.url + this.props.knowledgeBody[2].audio} imgUrl={this.props.knowledgeBody[2].picture} word_phoneticspelling={this.props.knowledgeBody[2].word_phoneticspelling} word={this.props.knowledgeBody[2].word} wordWidth={400} wordHeight={320} showLine={true} translateX={-30} translateY={-50} wordRotate={45} lineLen={120}>
    //                 </HelpCard>
    //                 <HelpCard audioPath={this.url + this.props.knowledgeBody[3].audio} imgUrl={this.props.knowledgeBody[3].picture} word_phoneticspelling={this.props.knowledgeBody[3].word_phoneticspelling} word={this.props.knowledgeBody[3].word} wordWidth={400} wordHeight={320} showLine={true} translateX={-50} translateY={30} wordRotate={315} lineLen={120}>
    //                 </HelpCard>
    //             </View>
    //         </Fragment>
    //     )
    // }

    render() {
        const { currentTopaicData } = this.props
        var len = this.props.len;
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }
        let length = this.props.knowledgeBody ? +Object.getOwnPropertyNames(this.props.knowledgeBody).length : 0
        let isSen = length === 3 && this.props.kygType !== '1' ? true : false
        // console.log("句子", length, this.props.kygType, isSen)
        return (
            <View>
                <Modal animationType="fade" visible={this.props.visible}>
                    {!isSen ?
                        <ImageBackground
                            style={[
                                {
                                    flex: 1,
                                    width: pxToDp(2048),
                                    height: pxToDp(600),
                                    backgroundColor: '#F5D6A6'
                                },
                            ]}
                            source={require('../../images/englishHomepage/helpWordBg.png')}
                            onError={e => console.log('错误', e)}
                        >

                            <View
                                style={[
                                    styles.modalHeader,
                                    appStyle.height110,
                                    appStyle.flexJusCenter,
                                ]}
                            >
                                {/* <Text style={[appFont.f42, { color: '#3F403F', fontWeight: 'bold' }]}>{this.props.unitName}</Text> */}
                                <TouchableOpacity
                                    style={[
                                        styles.nextText,
                                        // margin_tool(0, 48, 0, 48),
                                    ]}
                                    onPress={this.nextTopaicHelp}
                                >
                                    {/* <Text style={[{ color: "#fff" }]}>返回</Text> */}
                                    {/* <Image source={require('../../images/backBtn.png')} style={[appStyle.helpBtn]}></Image> */}
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{ alignItems: 'center', paddingLeft: pxToDp(28), flex: 1 }}
                            >
                                {this.renderCard()}
                            </View>
                            {/* } */}
                        </ImageBackground>
                        :
                        <HelpSentenceModal
                            defaultValue={this.props.knowledgeBody[0]}
                            goback={this.props.closeModal}
                        />
                    }
                </Modal>
            </View>


        );
    }
}
const styles = StyleSheet.create({
    modalHeader: {
        height: pxToDp(123),
        width: '100%',
        paddingLeft: pxToDp(70),
        paddingTop: pxToDp(40)
    },
    nextText: {
        width: pxToDp(80),
        height: pxToDp(80)
    },
    contentWrap: {
        // position: "absolute",
        backgroundColor: "#fff",
        zIndex: 1,
        minWidth: pxToDp(220),
        minHeight: pxToDp(100),
    },
});
