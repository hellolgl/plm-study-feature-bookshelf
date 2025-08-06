import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity ,Image,Platform} from 'react-native'
import { appStyle } from '../../theme'
import { pxToDp ,getHeaderPadding} from '../../util/tools'
export default class WrongPageHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    const {title} = this.props
    return (
        <View style={[styles.header,appStyle.flexTopLine,appStyle.flexCenter,Platform.OS === 'ios'?{marginTop:getHeaderPadding(pxToDp(30))}:null]}>
            <TouchableOpacity
                style={[styles.backBtn]}
                onPress={() => {
                    this.props.goBack();
                }}
                >
                <Image
                    source={require("../../images/statisticsGoBack.png")}
                    style={[styles.headerImg]}
                ></Image>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
        marginBottom: pxToDp(48),
        position: "relative",
      },
      headerImg:{ 
        width: pxToDp(64), 
        height: pxToDp(64) 
      },
      headerTitle:{
        fontSize: pxToDp(42), 
        marginTop: pxToDp(32) 
      },
      backBtn: {
        width: pxToDp(128),
        height: pxToDp(110),
        borderRadius: pxToDp(30),
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        left: 0,
      },
})