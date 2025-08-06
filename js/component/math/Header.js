import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image ,Platform} from "react-native";
import { pxToDp, size_tool ,getHeaderPadding} from "../../util/tools";
import { appStyle } from "../../theme";
import ScribblingPadModal from "../../util/draft/ScribblingPadModal"

const log = console.log.bind(console)

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draftVisible: false,
    }
  }

  toggleDraftShow = () => {
    const {draftVisible} = this.state
    const newVisible = !draftVisible
    this.setState({
      draftVisible: newVisible,
    })
  }

  render() {
    const {draftVisible} = this.state
    const { text, haveAvatar, txtStyle } = this.props;
    return (
      <View style={[styles.header, appStyle.flexCenter,Platform.OS === 'ios'?{marginTop:getHeaderPadding()}:null]}>
        <ScribblingPadModal visible={draftVisible} toggleEvent={this.toggleDraftShow}/>
        <Text style={[styles.txt, txtStyle ? txtStyle : null]}>{text}</Text>
        {this.props.isHiddenBack?null:<TouchableOpacity
          style={[styles.backBtn]}
          onPress={() => {
            this.props.goBack();
          }}
        >
          <Image
            source={require("../../images/improveBack.png")}
            style={[size_tool(64)]}
          ></Image>
        </TouchableOpacity>}
          {this.props.isHiddenCg?null:<TouchableOpacity
            style={[styles.draftBtn]}
            onPress={() => this.toggleDraftShow()}
        >
          <View
              style={{
                borderWidth: pxToDp(4),
                borderColor: "#fbcd38",
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                width: pxToDp(140),
                height: pxToDp(65),
                borderRadius: pxToDp(30),
              }}
          >
            <Text style={{fontSize: pxToDp(28), color: "#fbcd38"}}>打草稿</Text>
          </View>
        </TouchableOpacity>}
        {this.props.isHidden?null:<TouchableOpacity
          onPress={() => {
            this.props.seeHelp();
          }}
          style={[styles.helpBtn]}
        >
          <Image
            source={require("../../images/math_help.png")}
            style={{width:'100%',height:'100%'}}
          ></Image>
        </TouchableOpacity>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: pxToDp(64),
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(40),
    position: "relative",
  },
  txt: {
    color: "#fff",
    fontSize: pxToDp(42),
  },
  backBtn: {
    position: "absolute",
    left: 0,
  },
  helpBtn: {
    position: "absolute",
    right: 0,
    width: pxToDp(140),
    height: pxToDp(64),
  },
  draftBtn: {
    position: "absolute",
    right: pxToDp(160),
    width: pxToDp(140),
    height: pxToDp(64),
  },
});
