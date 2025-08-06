import React, { Component } from "react";
import {
	View,
	StyleSheet,
	Image,
	Modal,
	Text,
	TouchableOpacity,
	ScrollView
} from "react-native";
import {
	pxToDp,
} from "../../util/tools";
import { appFont, appStyle } from "../../theme";

class ContentModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
		}
	}

	open = ()=>{
		this.setState({
			visible: true,
		})
	}

	hide = ()=>{
		this.setState({
			visible: false,
		})
	}

	render() {
		const {visible} = this.state
		const {title, content} = this.props
		return (
			<Modal
				animationType="fade"
				transparent
				visible={visible}
			>
				<View style={[styles.container]}>
					<View style={[styles.content]}>
						<View style={[styles.header]}>
							<Text style={[appFont.fontFamily_jcyt_700, styles.headerFont]}>{title}</Text>
						</View>
						<View
							style={{
								...appStyle.flexCenter,
							}}
						>
							{content}
						</View>
					</View>
					<TouchableOpacity style={[styles.btn]} onPress={this.hide}>
						<Image style={[{width:pxToDp(280),height:pxToDp(120)}]} source={require('../../images/childrenStudyCharacter/close_btn_1.png')}></Image>
					</TouchableOpacity>
				</View>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		...appStyle.flexCenter
	},
	btn:{
		borderRadius:pxToDp(100),
		backgroundColor:"#fff",
		...appStyle.flexCenter,
		marginTop:pxToDp(-60)
	},
	content:{
		backgroundColor: "#fff",
		borderRadius: pxToDp(40),
		width: pxToDp(1240),
		paddingRight: 0,
		paddingBottom: pxToDp(80),
		height:'75%',
	},
	header: {
		marginTop: pxToDp(20),
		alignItems: "center",
		marginBottom: pxToDp(20),
	},
	headerFont: {
		fontSize:pxToDp(52),
	}
});

export default ContentModal
