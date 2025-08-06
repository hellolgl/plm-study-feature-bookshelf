import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { pxToDp } from "../../util/tools";

import { useSelector, useDispatch } from "react-redux";
import url from "../../util/url";

const Avatar = ({ style, width }) => {
    const { avatar } = useSelector((state) => state.toJS().userInfo);

    return (
        <View
            style={[
                {
                    width: pxToDp(width),
                    height: pxToDp(width),
                    borderRadius: pxToDp(width / 2),
                    overflow: "hidden",
                },
                style,
            ]}
        >
            <Image
                resizeMode="contain"
                style={[
                    {
                        width: pxToDp(width),
                        height: pxToDp(width),
                        borderRadius: pxToDp(width / 2),
                    },
                    style
                ]}
                source={{ uri: url.baseURL + avatar }}
            />
        </View>

    );
};

const styles = StyleSheet.create({});
export default Avatar;
