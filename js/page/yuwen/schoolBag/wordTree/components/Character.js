import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { appStyle } from "../../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../../util/tools";

// hiddenGobtn 右下角icon显影
// clickItem 能否点击

class Character extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }
    click = () => {
        if (!this.props.canClick) return;
        this.props.clickItem(this.props.character);
    };
    see = () => {
        this.props.clickItem(this.props.character);
    }
    render() {
        const {
            size,
            customStyle,
            character,
            hiddenGobtn,
        } = this.props;
        let len = 0;
        let knowledge_point_arr = []
        let centerCharacter = ''
        if (character) {
            knowledge_point_arr = character.knowledge_point.split('')
            len = knowledge_point_arr.length;
            if (character.knowledge_type === '1') {
                centerCharacter = character.knowledge_point
            } else {
                centerCharacter = character.centerCharacter
            }
        }
        return (
            <ScrollView horizontal={true} style={[appStyle.flexTopLine, { maxHeight: pxToDp(size) }]}>
                <TouchableOpacity style={[appStyle.flexTopLine]} onPress={this.click}>

                    {character
                        ? knowledge_point_arr.map((item, index) => {
                            return (
                                <ImageBackground
                                    key={index}
                                    style={[
                                        size_tool(size),
                                        {
                                            position: "relative",
                                            marginRight: customStyle.marginRight
                                                ? customStyle.marginRight
                                                : len === 1
                                                    ? 0
                                                    : pxToDp(28),
                                        },
                                        appStyle.flexCenter,
                                    ]}
                                    source={require("../../../../../images/charac_bg.png")}
                                    resizeMode="contain"
                                >
                                    <Text
                                        style={{
                                            color: item === centerCharacter ? "#FF4342" : "#43484D",
                                            fontSize: pxToDp(customStyle.fontSize),
                                            // fontFamily: 'webfont',
                                            // fontFamily: '1574320058'
                                            fontFamily: 'FZKai-Z03S'
                                        }}
                                    >
                                        {item}
                                    </Text>
                                    {!hiddenGobtn ? (
                                        <TouchableOpacity style={[styles.goCharact]} onPress={() => {
                                            this.see(item);
                                        }}>
                                            <Image
                                                source={require("../../../../../images/charact_to.png")}
                                                style={[size_tool(48)]}
                                            ></Image>
                                        </TouchableOpacity>
                                    ) : null}
                                </ImageBackground>
                            );
                        })
                        : null}
                </TouchableOpacity>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    goCharact: {
        position: "absolute",
        bottom: pxToDp(42),
        right: pxToDp(25),
    },
});
export default Character;
