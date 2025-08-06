import React from "react"
import {View, TouchableOpacity, Image, Text, StyleSheet} from "react-native"
import RichShowView from "../../../component/math/RichShowViewHtml"
import {pxToDp} from "../../../util/tools"
import stemAudioMap from '../../../util/stemAudioMap'
import IDOMParser from "advanced-html-parser"
import {appStyle} from "../../../theme"
import Audio from "../../../util/audio/audio"
import url from "../../../util/url"
import fonts from "../../../theme/fonts"
import Microphone from "../../../component/microphone"
import * as _ from "lodash"

const log = console.log.bind(console)

class Voice extends React.Component {

	constructor() {
		super()
		this.state = {
			isRecording: false,
			score: 0,
			totalScore: '0',
			scoreTxt: '长按进行语音评测～',
		}
	}

	getStemAudio = (iseStem) => {
		let stem_audio_key = iseStem.replace(/<[^>]+>/g, "")
		if (stem_audio_key.indexOf('Listen and repeat!') > -1) {
			stem_audio_key = 'Listen and repeat!'
		}
		return stemAudioMap[stem_audio_key]
	}

	getIseSentence = (iseStem, topic) => {
		const doc = IDOMParser.parse(`<div>${iseStem}</div>`)
		let iseSentence = doc.documentElement.querySelector("span")?.innerText()
		if (iseSentence === undefined) {
			iseSentence = topic["knowledge_point"]
		}
		return iseSentence
	}

	diagnosis = () => {
		const {score} = this.state
		return {
			correction: parseInt(score) > 85? 1: 0,
			answer_content: score.toString(),
		}
	}

	render() {
		const {topic} = this.props
		const {isRecording, scoreTxt} = this.state
		const data = topic
		const iseStem = data["private_exercise_stem"]

		let iseSentence = this.getIseSentence(iseStem, topic)
		const stemAudio = this.getStemAudio(iseStem)

		return (
			<View>
				<View
					style={[voiceComponentStyle.content]}
				>
					<View
						style={[voiceComponentStyle.audioMargin]}
					>
						<Audio
							audioUri={`${url.baseURL}${data.private_stem_audio}`}
							pausedBtnImg={require("../../../images/chineseHomepage/pingyin/new/pinyinPausedAudio.png")}
							pausedBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
							playBtnImg={require("../../../images/chineseHomepage/pingyin/new/pinyinPlayAudio.png")}
							playBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
						/>
					</View>
					<View>
						{stemAudio ? <View style={[voiceComponentStyle.audioPosition]}>
							<Audio
								audioUri={`${stemAudio}`}
								pausedBtnImg={require("../../../images/english/abcs/titlePanda.png")}
								pausedBtnStyle={{ width: pxToDp(169), height: pxToDp(152) }}
								playBtnImg={require("../../../images/english/abcs/titlePanda.png")}
								playBtnStyle={{ width: pxToDp(169), height: pxToDp(152) }}
								rate={0.75}
								onRef={(ref) => { this.audioRef = ref }}
							/>
						</View> : null}
						<TouchableOpacity style={[Platform.OS === 'ios' ? { marginTop: pxToDp(20) } : null]} onPress={() => {
							if (stemAudio) this.audioRef.onPlay()
						}}>
							<RichShowView value={data?.private_exercise_stem ?
								`<div id="jiangchengyuanti">${data.private_exercise_stem}</div>` : ""}
										  size={Platform.OS === 'ios' ? 70 : 50}
							></RichShowView>
						</TouchableOpacity>
					</View>
				</View>
				<View
					style={{
						alignItems: "center",
					}}
				>
					{
						data?.private_stem_picture ? (
							<Image
								style={[voiceComponentStyle.contentImage]}
								source={{ uri: `https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/${data?.private_stem_picture}` }}
							></Image>
						) : (
							<Text></Text>
						)
					}
				</View>
				<View style={[appStyle.flexCenter, {  width: pxToDp(400), left: "50%", marginLeft: pxToDp(-200),  marginTop: pxToDp(-30)}]}>
					<View style={[{ height: pxToDp(168), width: '100%', }, appStyle.flexCenter]}>
						{isRecording ? null :
							<Text style={[{ fontSize: pxToDp(scoreTxt.length>3? 40: 80), color: '#00D3A1', opacity: 0.5 }, fonts.fontFamily_jcyt_700]}>{scoreTxt}</Text>}
					</View>

					<Microphone
						animation={true}
						microphoneImg={require("../../../images/chineseHomepage/pingyin/new/btn3.png")}
						microphoneImgStyle={{ width: pxToDp(280), height: pxToDp(140) }}
						activeMicrophoneImg={require("../../../images/chineseHomepage/pingyin/new/btn3.png")}
						activeMicrophoneImgStyle={{ width: pxToDp(280), height: pxToDp(140) }}
						iseInfo={{
							words: [`${iseSentence}\nenglish_read_sentence`],
							index: 0,
						}}
						onStartRecordEvent={() => {
							this.setState({
								isRecording: true,
							})
						}}
						onFinishRecordEvent={(score) => {
							this.setState({
								isRecording: false,
								totalScore: parseInt(score),
								// scoreTxt: 'Good!'
								scoreTxt: score,
							})
						}}
						waveStyle={{
							width: pxToDp(600),
							height: pxToDp(280),
						}}
						soundWavePosition={{
							top: pxToDp(-280),
							left: pxToDp(-160),
						}}
						backgroundColor={"#E6DBCF"}
						lineColor={'#58DABB'}
					/>
				</View>
			</View>
		)
	}
}


const voiceComponentStyle = StyleSheet.create({
	content: {
		flexDirection: "row",
	},
	audioMargin: {
		marginRight: pxToDp(30),
	},
	audioPosition: {
		...appStyle.flexTopLine,
		...appStyle.flexAliCenter,
	},
	contentImage: {
		width: pxToDp(400),
		height: pxToDp(300),
		resizeMode: "contain",
	},
})


export default Voice
