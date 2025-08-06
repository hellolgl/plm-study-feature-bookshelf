import React from "react";

import {
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
} from "react-native";
import Talk from "./talk";
import {
    pxToDp,
    getIsTablet,
    pxToDpWidthLs,
    padding_tool,
    size_tool,
} from "../../../../../util/tools";
import NavigationUtil from "../../../../../navigator/NavigationUtil";

const ReadingAiHelp = (props) => {
    const { r_id } = props.navigation.state.params.data;
    const isPhone = !getIsTablet();
    const goBack = () => {
        NavigationUtil.goBack(props);
    };
    return (
        <ImageBackground
            source={require("../../../../../images/chineseHomepage/reading/homeBg.png")}
            style={[{ flex: 1 }, padding_tool(120, 20, 80, 20)]}
            resizeMode="cover"
        >
            <TouchableOpacity
                style={[
                    size_tool(120, 80),
                    {
                        position: "absolute",
                        top: pxToDp(40),
                        zIndex: 999,
                        left: pxToDp(40),
                    },
                ]}
                onPress={goBack}
            >
                <Image
                    style={[size_tool(120, 80)]}
                    source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
                />
            </TouchableOpacity>
            <Talk
                r_id={r_id}
                inputToolbarStyle={{
                    width: isPhone ? pxToDpWidthLs(1250) : pxToDp(1800),
                }}
                myBubbleTxtViewStyle={{
                    maxWidth: isPhone ? pxToDpWidthLs(1000) : pxToDp(1500),
                }}
                myBubbleUserViewStyle={{ backgroundColor: "#80CEC8" }}
                gptAvatar={require("../../../../../images/square/saraHead.png")}
            />
        </ImageBackground>
    );
};

export default ReadingAiHelp;
