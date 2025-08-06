import React, { PureComponent } from "react";
import { View, StyleSheet, Image } from "react-native";
import { appStyle } from "../../theme";
import { size_tool, pxToDp } from "../../util/tools";
import AudioList from "../../util/audio/audioList";
import Lottie from "lottie-react-native";
import url from "../../util/url";

class CharacterHelpModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.audioRef1 = React.createRef();
  }
  playBtn = (
    <View style={[styles.wrapStyle]}>
      <View style={[appStyle.flexAliCenter]}>
        <View
          style={[
            size_tool(190, 95),
            {
              positon: "absolute",
              bottom: pxToDp(40),
              backgroundColor: "#3EA1FF",
              borderRadius: pxToDp(200),
            },
            appStyle.flexCenter,
          ]}
        >
          <Image
            source={require("../../images/audio/audioIcon.png")}
            style={[size_tool(38, 34)]}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );

  pauseBtn = (
    <View style={[styles.wrapStyle]}>
      <View style={[appStyle.flexAliCenter]}>
        <View
          style={[
            size_tool(190, 95),
            {
              borderRadius: pxToDp(200),
              backgroundColor: "#fff",
              positon: "absolute",
              bottom: pxToDp(40),
            },
            appStyle.flexCenter,
          ]}
        >
          <Lottie
            source={require("../../res/json/audio.json")}
            style={[size_tool(150, 75)]}
            resizeMode="contain"
            autoPlay={true}
            loop
          />
        </View>
      </View>
    </View>
  );

  render() {
    const { diagnose_notes_audio, stem_explain_audio } = this.props;
    let urlArray = [`${url.failAudiopath}`];
    diagnose_notes_audio &&
      urlArray.push(`${url.baseURL}${diagnose_notes_audio}`);
    stem_explain_audio && urlArray.push(`${url.baseURL}${stem_explain_audio}`);
    return (
      <View>
        <AudioList
          audioUri={urlArray}
          playBtn={this.playBtn}
          pausedBtn={this.pauseBtn}
          wrapStyle={{}}
          // rate={0.75}
          onRef={(ref) => {
            this.audioRef1 = ref;
            try {
              this.audioRef1?.playCurrentAudio();
            } catch {}
          }}
          changeStatus={this.changeStatus}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapStyle: {
    position: "relative",
    alignItems: "center",
  },
});
export default CharacterHelpModal;
